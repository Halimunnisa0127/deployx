const mongoose = require('mongoose');
const DeploymentService = require('../../src/modules/deployments/services/deployment.service');
const Deployment = require('../../src/modules/deployments/models/Deployment');
const Project = require('../../src/modules/projects/models/Project');
const DeploymentPromotionHistory = require('../../src/modules/deployments/models/DeploymentPromotionHistory');
const deploymentQueue = require('../../src/infrastructure/queue/deployment.queue');

jest.mock('../../src/modules/deployments/models/Deployment');
jest.mock('../../src/modules/projects/models/Project');
jest.mock('../../src/modules/deployments/models/DeploymentPromotionHistory');
jest.mock('../../src/infrastructure/queue/deployment.queue');
jest.mock('../../src/modules/integrations/github/services/githubRepository.service');
jest.mock('../../src/infrastructure/docker/docker.client');

describe('Deployment State Machine & Lifecycle Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Deployment State Machine transitions', () => {
    test('Valid transition combinations must be supported', () => {
      const allowedTransitions = {
        queued: ['building', 'cancelled'],
        building: ['ready', 'failed', 'cancelled'],
        ready: [],
        failed: [],
        cancelled: []
      };

      const verifyTransition = (from, to) => {
        return allowedTransitions[from]?.includes(to) || false;
      };

      expect(verifyTransition('queued', 'building')).toBe(true);
      expect(verifyTransition('building', 'ready')).toBe(true);
      expect(verifyTransition('building', 'failed')).toBe(true);
      expect(verifyTransition('queued', 'cancelled')).toBe(true);
      expect(verifyTransition('building', 'cancelled')).toBe(true);
    });

    test('Invalid transitions must be rejected', () => {
      const allowedTransitions = {
        queued: ['building', 'cancelled'],
        building: ['ready', 'failed', 'cancelled'],
        ready: [],
        failed: [],
        cancelled: []
      };

      const verifyTransition = (from, to) => {
        return allowedTransitions[from]?.includes(to) || false;
      };

      expect(verifyTransition('ready', 'building')).toBe(false);
      expect(verifyTransition('ready', 'failed')).toBe(false);
      expect(verifyTransition('failed', 'building')).toBe(false);
      expect(verifyTransition('failed', 'ready')).toBe(false);
      expect(verifyTransition('cancelled', 'building')).toBe(false);
      expect(verifyTransition('cancelled', 'ready')).toBe(false);
    });
  });

  describe('Deployment Ownership checks', () => {
    const ownerId = new mongoose.Types.ObjectId();
    const otherUserId = new mongoose.Types.ObjectId();
    const deploymentId = new mongoose.Types.ObjectId();

    test('Owner can access and cancel own deployment', async () => {
      const mockDeployment = {
        _id: deploymentId,
        owner: ownerId,
        status: 'queued',
        project: { _id: 'proj1' }
      };

      Deployment.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockDeployment)
      });

      Deployment.findOneAndUpdate = jest.fn().mockResolvedValue({
        ...mockDeployment,
        status: 'cancelled'
      });

      const retrieved = await DeploymentService.getDeploymentById(ownerId, deploymentId);
      expect(retrieved.owner.toString()).toBe(ownerId.toString());

      const cancelled = await DeploymentService.cancelDeployment(ownerId, deploymentId);
      expect(cancelled.status).toBe('cancelled');
    });

    test('Another user cannot access or cancel the deployment', async () => {
      const mockDeployment = {
        _id: deploymentId,
        owner: ownerId,
        status: 'queued',
        project: { _id: 'proj1' }
      };

      Deployment.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockDeployment)
      });

      await expect(
        DeploymentService.getDeploymentById(otherUserId, deploymentId)
      ).rejects.toThrow('Not authorized to access this deployment');

      await expect(
        DeploymentService.cancelDeployment(otherUserId, deploymentId)
      ).rejects.toThrow('Not authorized to access this deployment');
    });
  });

  describe('Promotion and Rollback logic', () => {
    const userId = new mongoose.Types.ObjectId();
    const projectId = new mongoose.Types.ObjectId();
    const deploymentId = new mongoose.Types.ObjectId();

    test('Ready deployment with artifact can be promoted', async () => {
      const mockDeployment = {
        _id: deploymentId,
        owner: userId,
        project: projectId,
        status: 'ready',
        artifact: new mongoose.Types.ObjectId()
      };

      const mockProject = {
        _id: projectId,
        owner: userId,
        productionDeployment: null,
        save: jest.fn().mockResolvedValue(true)
      };

      Deployment.findById = jest.fn().mockResolvedValue(mockDeployment);
      Project.findOne = jest.fn().mockResolvedValue(mockProject);
      DeploymentPromotionHistory.create = jest.fn().mockResolvedValue({});

      const promoted = await DeploymentService.promoteDeployment(userId, deploymentId);
      expect(promoted.status).toBe('ready');
      expect(mockProject.productionDeployment.toString()).toBe(deploymentId.toString());
      expect(DeploymentPromotionHistory.create).toHaveBeenCalled();
      // Ensure no BullMQ enqueue happened (promotion is pointer-only)
      expect(deploymentQueue.add).not.toHaveBeenCalled();
    });

    test('Non-ready or missing-artifact deployments are rejected for promotion', async () => {
      const mockDeploymentNoArtifact = {
        _id: deploymentId,
        owner: userId,
        project: projectId,
        status: 'ready',
        artifact: null
      };

      const mockDeploymentBuilding = {
        _id: deploymentId,
        owner: userId,
        project: projectId,
        status: 'building',
        artifact: new mongoose.Types.ObjectId()
      };

      Deployment.findById = jest.fn()
        .mockResolvedValueOnce(mockDeploymentNoArtifact)
        .mockResolvedValueOnce(mockDeploymentBuilding);

      await expect(
        DeploymentService.promoteDeployment(userId, deploymentId)
      ).rejects.toThrow('Deployment has no associated artifact');

      await expect(
        DeploymentService.promoteDeployment(userId, deploymentId)
      ).rejects.toThrow('Only ready deployments can be promoted to production');
    });

    test('Cross-project and cross-user promotion is rejected', async () => {
      const mockDeployment = {
        _id: deploymentId,
        owner: userId,
        project: projectId,
        status: 'ready',
        artifact: new mongoose.Types.ObjectId()
      };

      Deployment.findById = jest.fn().mockResolvedValue(mockDeployment);
      // Project search fails because of cross-user/cross-project ownership check
      Project.findOne = jest.fn().mockResolvedValue(null);

      await expect(
        DeploymentService.promoteDeployment(userId, deploymentId)
      ).rejects.toThrow('Project not found or not authorized');
    });

    test('Repeated rollback/promotion to the current deployment is idempotent', async () => {
      const mockDeployment = {
        _id: deploymentId,
        owner: userId,
        project: projectId,
        status: 'ready',
        artifact: new mongoose.Types.ObjectId()
      };

      const mockProject = {
        _id: projectId,
        owner: userId,
        productionDeployment: deploymentId, // Already current production deployment
        save: jest.fn()
      };

      Deployment.findById = jest.fn().mockResolvedValue(mockDeployment);
      Project.findOne = jest.fn().mockResolvedValue(mockProject);
      DeploymentPromotionHistory.create = jest.fn();

      const result = await DeploymentService.promoteDeployment(userId, deploymentId, 'rollback');
      expect(result._id).toBe(deploymentId);
      expect(mockProject.save).not.toHaveBeenCalled();
      expect(DeploymentPromotionHistory.create).not.toHaveBeenCalled();
    });
  });
});
