const mongoose = require('mongoose');
const Deployment = require('../models/Deployment');
const DeploymentCounter = require('../models/DeploymentCounter');
const DeploymentPromotionHistory = require('../models/DeploymentPromotionHistory');
const Project = require('../../projects/models/Project');
const deploymentQueue = require('../../../infrastructure/queue/deployment.queue');
const ApiError = require('../../../shared/errors/ApiError');
const { StatusCodes } = require('http-status-codes');

class DeploymentService {
  /**
   * Helper to get the next sequential deployment number safely
   */
  static async getNextDeploymentNumber(projectId) {
    const counter = await DeploymentCounter.findOneAndUpdate(
      { projectId },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    return counter.seq;
  }

  /**
   * Create a new deployment record (Status: queued)
   */
  static async createDeployment(userId, deploymentData) {
    const { projectId, environment, branch, commitHash, commitMessage } = deploymentData;

    // 1. Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      throw new ApiError('Project not found', StatusCodes.NOT_FOUND);
    }

    // 2. Verify project ownership
    if (project.owner.toString() !== userId.toString()) {
      throw new ApiError('Not authorized to access this project', StatusCodes.FORBIDDEN);
    }

    // 3. Snapshot safe build settings (exclude secrets)
    const buildSettingsSnapshot = {
      framework: project.framework,
      packageManager: project.buildSettings.packageManager,
      installCommand: project.buildSettings.installCommand,
      buildCommand: project.buildSettings.buildCommand,
      outputDirectory: project.buildSettings.outputDirectory,
      nodeVersion: project.buildSettings.nodeVersion,
      rootDirectory: project.rootDirectory,
    };

    // 4. Generate next deployment number safely
    const deploymentNumber = await this.getNextDeploymentNumber(projectId);

    // 5. Source Resolution
    const branchToUse = branch || project.gitRepository.branch || 'main';
    let resolvedCommitHash = commitHash || null;
    let resolvedCommitMessage = commitMessage || null;
    let provider = project.gitRepository.provider || 'manual';
    let repositoryFullName = project.gitRepository.fullName || null;

    if (provider === 'github' && repositoryFullName) {
      if (deploymentData.isWebhookTrigger) {
        resolvedCommitHash = commitHash;
        resolvedCommitMessage = commitMessage;
      } else {
        const [owner, repo] = repositoryFullName.split('/');
        try {
          const commitData = await GitHubRepositoryService.getCommitByBranch(userId, owner, repo, branchToUse);
          resolvedCommitHash = commitData.sha;
          resolvedCommitMessage = commitData.message || resolvedCommitMessage;
        } catch (error) {
          if (commitHash) {
            resolvedCommitHash = commitHash;
            resolvedCommitMessage = commitMessage || 'Initial build trigger';
          } else {
            throw new ApiError('Failed to resolve GitHub repository source. Please check integration and repository access.', StatusCodes.BAD_REQUEST);
          }
        }
      }
    } else if (provider !== 'manual') {
      throw new ApiError('Provider not supported or repository missing.', StatusCodes.BAD_REQUEST);
    }

    // 6. Create queued deployment record
    const deployment = await Deployment.create({
      project: project._id,
      owner: userId,
      deploymentNumber,
      environment: environment || 'Production',
      branch: branchToUse, // flat field for backwards compatibility
      commitHash: resolvedCommitHash, // flat field
      commitMessage: resolvedCommitMessage, // flat field
      source: {
        provider,
        repositoryFullName,
        branch: branchToUse,
        commitSha: resolvedCommitHash,
        commitMessage: resolvedCommitMessage
      },
      buildSettings: buildSettingsSnapshot,
      region: project.region,
      status: 'queued',
      triggeredBy: deploymentData.isWebhookTrigger ? 'GitHub Webhook' : 'Manual Redeploy',
      url: null,
    });

    // 6. Enqueue the deployment job
    try {
      await deploymentQueue.add('process-deployment', {
        deploymentId: deployment._id,
        projectId: project._id,
      }, {
        jobId: `deploy-${deployment._id}`
      });
    } catch (error) {
      console.error('[Queue Error] Failed to enqueue deployment job:', error.message);
      deployment.status = 'failed';
      deployment.errorMessage = 'Failed to enqueue deployment job.';
      await deployment.save().catch((saveErr) => {
        console.error('[Queue Error Cleanup] Failed to mark deployment as failed:', saveErr.message);
      });
      throw new ApiError('Failed to enqueue deployment job.', StatusCodes.INTERNAL_SERVER_ERROR);
    }

    return deployment;
  }

  /**
   * List deployments for a specific project
   */
  static async getProjectDeployments(userId, projectId) {
    const project = await Project.findById(projectId);
    if (!project) {
      throw new ApiError('Project not found', StatusCodes.NOT_FOUND);
    }
    if (project.owner.toString() !== userId.toString()) {
      throw new ApiError('Not authorized to access this project', StatusCodes.FORBIDDEN);
    }

    const deployments = await Deployment.find({ project: projectId }).populate('project', 'name slug').sort({ createdAt: -1 });
    return deployments;
  }

  /**
   * List all deployments for a user across all projects
   */
  static async getUserDeployments(userId) {
    const deployments = await Deployment.find({ owner: userId }).populate('project', 'name slug').sort({ createdAt: -1 });
    return deployments;
  }

  /**
   * Get a specific deployment by ID
   */
  static async getDeploymentById(userId, deploymentId) {
    const deployment = await Deployment.findById(deploymentId).populate('project', 'name slug');
    
    if (!deployment) {
      throw new ApiError('Deployment not found', StatusCodes.NOT_FOUND);
    }
    
    if (deployment.owner.toString() !== userId.toString()) {
      throw new ApiError('Not authorized to access this deployment', StatusCodes.FORBIDDEN);
    }

    return deployment;
  }

  /**
   * Cancel a queued or building deployment
   */
  static async cancelDeployment(userId, deploymentId) {
    // Validate ownership/access first using existing getDeploymentById method
    const deployment = await this.getDeploymentById(userId, deploymentId);

    if (deployment.status !== 'queued' && deployment.status !== 'building') {
      throw new ApiError('Only queued or building deployments can be cancelled', StatusCodes.BAD_REQUEST);
    }

    // Atomically transition queued or building -> cancelled
    const updated = await Deployment.findOneAndUpdate(
      { _id: deploymentId, status: { $in: ['queued', 'building'] } },
      { status: 'cancelled', errorMessage: 'Cancelled by user' },
      { new: true }
    );

    if (!updated) {
      throw new ApiError('Deployment status changed before cancellation completed', StatusCodes.BAD_REQUEST);
    }

    // Clean up Docker container if exists
    const DockerClient = require('../../../infrastructure/docker/docker.client');
    try {
      await DockerClient.stopDeploymentContainer(deploymentId);
      await DockerClient.removeDeploymentContainer(deploymentId);
    } catch (err) {
      // Ignore errors on stopping/removing container so cancellation succeeds
    }

    return updated;
  }

  /**
   * Find an existing deployment by commit to prevent duplicate webhook deployments
   */
  static async getDeploymentByCommit(projectId, branch, commitSha) {
    return await Deployment.findOne({
      project: projectId,
      'source.branch': branch,
      'source.commitSha': commitSha
    });
  }

  /**
   * Promotes a deployment to the active production deployment of a project.
   */
  static async promoteDeployment(userId, deploymentId, action = 'promote') {
    const deployment = await Deployment.findById(deploymentId);
    if (!deployment) {
      throw new ApiError('Deployment not found', StatusCodes.NOT_FOUND);
    }

    if (deployment.owner.toString() !== userId.toString()) {
      throw new ApiError('Not authorized to access this deployment', StatusCodes.FORBIDDEN);
    }

    if (deployment.status !== 'ready') {
      throw new ApiError('Only ready deployments can be promoted to production', StatusCodes.BAD_REQUEST);
    }

    if (!deployment.artifact) {
      throw new ApiError('Deployment has no associated artifact', StatusCodes.BAD_REQUEST);
    }

    const project = await Project.findOne({
      _id: deployment.project,
      owner: userId
    });

    if (!project) {
      throw new ApiError('Project not found or not authorized', StatusCodes.NOT_FOUND);
    }

    const previousDeploymentId = project.productionDeployment;
    if (previousDeploymentId && previousDeploymentId.toString() === deploymentId.toString()) {
      return deployment;
    }

    const session = await mongoose.startSession().catch(() => null);
    let transactionSuccess = false;
    if (session) {
      try {
        await session.withTransaction(async () => {
          project.productionDeployment = deployment._id;
          await project.save({ session });

          await DeploymentPromotionHistory.create(
            [
              {
                project: project._id,
                deployment: deployment._id,
                previousDeployment: previousDeploymentId || null,
                action,
                triggeredBy: action === 'rollback' ? 'rollback' : 'manual',
                actor: userId,
              },
            ],
            { session }
          );
        });
        transactionSuccess = true;
      } catch (txnError) {
        // Fallback to non-transactional save on standalone MongoDB
      } finally {
        await session.endSession().catch(() => {});
      }
    }

    if (!transactionSuccess) {
      project.productionDeployment = deployment._id;
      await project.save();

      await DeploymentPromotionHistory.create({
        project: project._id,
        deployment: deployment._id,
        previousDeployment: previousDeploymentId || null,
        action,
        triggeredBy: action === 'rollback' ? 'rollback' : 'manual',
        actor: userId,
      });
    }

    return deployment;
  }

  /**
   * Reusable service-level check to validate a project's active production deployment pointer.
   * Returns the validated deployment or null if invalid.
   */
  static async validateProductionDeployment(projectId) {
    const project = await Project.findById(projectId);
    if (!project || !project.productionDeployment) {
      return null;
    }

    const deployment = await Deployment.findById(project.productionDeployment);
    if (!deployment) {
      return null;
    }

    if (deployment.project.toString() !== projectId.toString()) {
      return null;
    }

    if (deployment.status !== 'ready' || !deployment.artifact) {
      return null;
    }

    return deployment;
  }

  /**
   * Retrieves paginated promotion/rollback history for a project.
   */
  static async getProjectPromotionHistory(userId, projectId, action, page = 1, limit = 10) {
    const project = await Project.findOne({ _id: projectId, owner: userId });
    if (!project) {
      throw new ApiError('Project not found or not authorized', StatusCodes.NOT_FOUND);
    }

    const enforcedLimit = Math.min(Number(limit) || 10, 100);
    const pageNum = Math.max(Number(page) || 1, 1);
    const skip = (pageNum - 1) * enforcedLimit;

    const query = { project: projectId };
    if (action && ['promote', 'rollback'].includes(action)) {
      query.action = action;
    }

    const total = await DeploymentPromotionHistory.countDocuments(query);
    const history = await DeploymentPromotionHistory.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(enforcedLimit)
      .populate('deployment')
      .populate('previousDeployment')
      .populate('actor', 'name email');

    return {
      history,
      pagination: {
        total,
        page: pageNum,
        limit: enforcedLimit,
        pages: Math.ceil(total / enforcedLimit),
      },
    };
  }
}

module.exports = DeploymentService;
