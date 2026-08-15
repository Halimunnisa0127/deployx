const crypto = require('crypto');
const GithubWebhookDelivery = require('../models/GithubWebhookDelivery');
const Project = require('../../../projects/models/Project');
const DeploymentService = require('../../../deployments/services/deployment.service');
const config = require('../../../../config/env/env');

class GithubWebhookService {
  /**
   * Process a GitHub Webhook request safely and asynchronously
   */
  static async processWebhook(headers, rawBody, parsedBody) {
    const deliveryId = headers['x-github-delivery'];
    const event = headers['x-github-event'];
    const signature = headers['x-hub-signature-256'];

    if (!deliveryId || !event) {
      throw new Error('Missing core webhook headers');
    }

    // 1. Signature Verification
    if (!signature || !rawBody) {
      throw new Error('Missing signature or raw body for webhook verification.');
    }

    if (!config.github.webhookSecret) {
      throw new Error('GitHub webhook secret is not configured.');
    }

    const hmac = crypto.createHmac('sha256', config.github.webhookSecret);
    hmac.update(rawBody);
    const expectedSignature = `sha256=${hmac.digest('hex')}`;

    try {
      if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
        throw new Error('Invalid signature');
      }
    } catch (err) {
      throw new Error('Webhook signature validation failed.');
    }

    // 2. Event Filtering
    if (event !== 'push') {
      return { success: true, message: 'Event ignored' };
    }

    // 3. Push Validation
    const { repository, ref, after, head_commit, deleted } = parsedBody;

    if (!repository || !repository.full_name) {
      throw new Error('Malformed repository payload');
    }
    
    if (deleted === true) {
      return { success: true, message: 'Deleted push ignored' };
    }
    
    if (!ref || !ref.startsWith('refs/heads/')) {
      return { success: true, message: 'Non-branch push ignored' };
    }

    if (!after || after.length !== 40 || !/^[0-9a-f]{40}$/i.test(after)) {
      throw new Error('Invalid commit SHA');
    }

    // 4. Branch Extraction
    const branch = ref.replace('refs/heads/', '');
    const repositoryFullName = repository.full_name;

    // 5. Project Resolution
    const project = await Project.findOne({
      'gitRepository.provider': 'github',
      'gitRepository.fullName': repositoryFullName
    });

    if (!project) {
      return { success: true, message: 'No matching project found' };
    }

    const configuredBranch = project.gitRepository.branch || 'main';
    if (branch !== configuredBranch) {
      return { success: true, message: 'Push not on configured deployment branch' };
    }

    // 6. Idempotency (Atomic creation)
    let delivery;
    try {
      delivery = await GithubWebhookDelivery.create({
        deliveryId,
        event,
        repository: repositoryFullName,
      });
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate delivery ID race condition caught safely
        return { success: true, message: 'Duplicate webhook delivery ignored' };
      }
      throw error;
    }

    // Prevent duplicate deployment for same exact commit (webhook retry fallback)
    // The requirement says: "If an existing deployment already represents the same webhook commit, safely reuse/acknowledge it where appropriate."
    const existingDeployment = await DeploymentService.getDeploymentByCommit(project._id, branch, after).catch(() => null);
    if (existingDeployment) {
      delivery.deployment = existingDeployment._id;
      await delivery.save();
      return { success: true, message: 'Deployment already exists for this commit' };
    }

    // 7. Deployment Creation
    // Since it's a webhook, we tell the deployment service to use the exact SHA (`after`)
    const deploymentData = {
      projectId: project._id,
      environment: 'Production',
      branch: branch,
      commitHash: after,
      commitMessage: head_commit ? head_commit.message : '',
      isWebhookTrigger: true // Bypasses github branch HEAD lookup
    };

    const deployment = await DeploymentService.createDeployment(project.owner, deploymentData);

    // Attach deployment ID to the delivery log
    delivery.deployment = deployment._id;
    await delivery.save();

    return { success: true, message: 'Deployment queued successfully', deploymentId: deployment._id };
  }
}

module.exports = GithubWebhookService;
