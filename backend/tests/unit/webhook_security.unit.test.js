const crypto = require('crypto');
const GithubWebhookService = require('../../src/modules/integrations/github/services/githubWebhook.service');
const GithubWebhookDelivery = require('../../src/modules/integrations/github/models/GithubWebhookDelivery');
const Project = require('../../src/modules/projects/models/Project');
const DeploymentService = require('../../src/modules/deployments/services/deployment.service');
const config = require('../../src/config/env/env');

jest.mock('../../src/modules/integrations/github/models/GithubWebhookDelivery');
jest.mock('../../src/modules/projects/models/Project');
jest.mock('../../src/modules/deployments/services/deployment.service');
jest.mock('../../src/config/env/env', () => ({
  github: {
    webhookSecret: 'test-secret'
  }
}));

describe('Webhook Security & Idempotency Unit Tests', () => {
  const secret = 'test-secret';
  const payload = JSON.stringify({
    repository: { full_name: 'test/repo' },
    ref: 'refs/heads/main',
    after: 'a'.repeat(40),
    head_commit: { message: 'test commit' },
    deleted: false
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Signature Verification', () => {
    test('Valid signature with matching HMAC is accepted', async () => {
      const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');
      const headers = {
        'x-github-delivery': 'delivery-123',
        'x-github-event': 'push',
        'x-hub-signature-256': `sha256=${hmac}`
      };

      Project.findOne = jest.fn().mockResolvedValue({
        _id: 'proj1',
        owner: 'user1',
        gitRepository: { branch: 'main' }
      });
      GithubWebhookDelivery.create = jest.fn().mockResolvedValue({ save: jest.fn() });
      DeploymentService.getDeploymentByCommit = jest.fn().mockResolvedValue(null);
      DeploymentService.createDeployment = jest.fn().mockResolvedValue({ _id: 'dep1' });

      const result = await GithubWebhookService.processWebhook(headers, payload, JSON.parse(payload));
      expect(result.success).toBe(true);
      expect(result.message).toBe('Deployment queued successfully');
    });

    test('Missing signature is rejected', async () => {
      const headers = {
        'x-github-delivery': 'delivery-123',
        'x-github-event': 'push'
      };

      await expect(
        GithubWebhookService.processWebhook(headers, payload, JSON.parse(payload))
      ).rejects.toThrow('Missing signature or raw body for webhook verification.');
    });

    test('Invalid signature is rejected (timing-safe check failure)', async () => {
      const headers = {
        'x-github-delivery': 'delivery-123',
        'x-github-event': 'push',
        'x-hub-signature-256': 'sha256=invalidhash'
      };

      await expect(
        GithubWebhookService.processWebhook(headers, payload, JSON.parse(payload))
      ).rejects.toThrow('Webhook signature validation failed.');
    });

    test('Malformed signature is rejected', async () => {
      const headers = {
        'x-github-delivery': 'delivery-123',
        'x-github-event': 'push',
        'x-hub-signature-256': 'malformed-without-sha256-prefix'
      };

      await expect(
        GithubWebhookService.processWebhook(headers, payload, JSON.parse(payload))
      ).rejects.toThrow('Webhook signature validation failed.');
    });
  });

  describe('Webhook Idempotency', () => {
    test('Duplicate X-GitHub-Delivery ID is ignored', async () => {
      const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');
      const headers = {
        'x-github-delivery': 'delivery-duplicate',
        'x-github-event': 'push',
        'x-hub-signature-256': `sha256=${hmac}`
      };

      Project.findOne = jest.fn().mockResolvedValue({
        _id: 'proj1',
        owner: 'user1',
        gitRepository: { branch: 'main' }
      });

      // Simulate duplicate DB key error
      const mongoError = new Error('Duplicate key');
      mongoError.code = 11000;
      GithubWebhookDelivery.create = jest.fn().mockRejectedValue(mongoError);

      const result = await GithubWebhookService.processWebhook(headers, payload, JSON.parse(payload));
      expect(result.success).toBe(true);
      expect(result.message).toBe('Duplicate webhook delivery ignored');
      expect(DeploymentService.createDeployment).not.toHaveBeenCalled();
    });

    test('Duplicate request for same commit hash returns existing deployment', async () => {
      const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');
      const headers = {
        'x-github-delivery': 'delivery-new',
        'x-github-event': 'push',
        'x-hub-signature-256': `sha256=${hmac}`
      };

      Project.findOne = jest.fn().mockResolvedValue({
        _id: 'proj1',
        owner: 'user1',
        gitRepository: { branch: 'main' }
      });

      const mockDelivery = { save: jest.fn() };
      GithubWebhookDelivery.create = jest.fn().mockResolvedValue(mockDelivery);
      
      // Commit already has an active deployment
      DeploymentService.getDeploymentByCommit = jest.fn().mockResolvedValue({ _id: 'existing-dep' });

      const result = await GithubWebhookService.processWebhook(headers, payload, JSON.parse(payload));
      expect(result.success).toBe(true);
      expect(result.message).toBe('Deployment already exists for this commit');
      expect(mockDelivery.deployment).toBe('existing-dep');
      expect(DeploymentService.createDeployment).not.toHaveBeenCalled();
    });
  });
});
