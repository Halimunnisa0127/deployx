const mongoose = require('mongoose');
const AdminDeploymentService = require('../../src/modules/admin/services/adminDeployment.service');
const Deployment = require('../../src/modules/deployments/models/Deployment');
const Artifact = require('../../src/modules/storage/models/Artifact');
const DeploymentLog = require('../../src/modules/logs/models/DeploymentLog');
const LogSequence = require('../../src/modules/logs/models/LogSequence');
const DockerClient = require('../../src/infrastructure/docker/docker.client');
const { getDeploymentLogs } = require('../../src/modules/logs/controllers/deploymentLog.controller');
const deploymentLogService = require('../../src/modules/logs/services/deploymentLog.service');
const { ROLES } = require('../../src/shared/constants/constants');

jest.mock('../../src/modules/deployments/models/Deployment');
jest.mock('../../src/modules/storage/models/Artifact');
jest.mock('../../src/modules/logs/models/DeploymentLog');
jest.mock('../../src/modules/logs/models/LogSequence');
jest.mock('../../src/infrastructure/docker/docker.client');
jest.mock('../../src/modules/logs/services/deploymentLog.service');

describe('Admin Deployments Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('1. Deployment Listing & Filtering', () => {
    test('listDeployments maps real duration, status, and artifact size', async () => {
      const mockDeployments = [
        {
          _id: 'dep-1',
          status: 'ready',
          project: { _id: 'proj-1', name: 'My React App', slug: 'my-react-app', framework: 'react', domainUrl: 'https://my-react-app.deployx.app' },
          owner: { fullName: 'Jane Doe', email: 'jane@test.com' },
          artifact: { size: 5242880, fileCount: 25, checksum: 'sha-123', originalOutputDirectory: 'dist' },
          startedAt: new Date(Date.now() - 30000),
          completedAt: new Date(),
          createdAt: new Date(Date.now() - 35000),
          triggeredBy: 'GitHub',
          commitMessage: 'feat: add login',
          commitHash: 'a1b2c3d',
        }
      ];

      Deployment.countDocuments = jest.fn().mockResolvedValue(1);
      Deployment.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockDeployments)
      });

      const result = await AdminDeploymentService.listDeployments({ page: 1, limit: 10 });

      expect(result.deployments.length).toBe(1);
      const dep = result.deployments[0];
      expect(dep.status).toBe('success');
      expect(dep.rawStatus).toBe('ready');
      expect(dep.duration).toBe('30s');
      expect(dep.artifactSize).toBe('5 MB');
      expect(dep.project).toBe('My React App');
      expect(dep.owner).toBe('Jane Doe');
    });

    test('listDeployments translates frontend status filters to backend schema', async () => {
      Deployment.countDocuments = jest.fn().mockResolvedValue(0);
      Deployment.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([])
      });

      // 1. Success -> ready
      await AdminDeploymentService.listDeployments({ status: 'success' });
      expect(Deployment.countDocuments).toHaveBeenCalledWith(expect.objectContaining({ status: 'ready' }));

      // 2. Running -> building
      await AdminDeploymentService.listDeployments({ status: 'running' });
      expect(Deployment.countDocuments).toHaveBeenCalledWith(expect.objectContaining({ status: 'building' }));

      // 3. Queued -> queued
      await AdminDeploymentService.listDeployments({ status: 'queued' });
      expect(Deployment.countDocuments).toHaveBeenCalledWith(expect.objectContaining({ status: 'queued' }));
    });
  });

  describe('2. Deployment Retrieval & Measured Artifact Metadata', () => {
    test('getDeployment builds real execution timeline and returns measured artifact details', async () => {
      const depId = 'dep-100';
      const mockDeployment = {
        _id: depId,
        status: 'ready',
        project: { _id: 'proj-1', name: 'Next App', slug: 'next-app', framework: 'nextjs', domainUrl: 'https://next-app.deployx.app' },
        owner: { fullName: 'Alice Admin', email: 'alice@deployx.com' },
        artifact: {
          _id: 'art-1',
          size: 10485760, // 10 MB
          fileCount: 120,
          checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          originalOutputDirectory: '.next',
          storageKey: 'artifacts/proj-1/dep-100.tar',
          storageProvider: 'local'
        },
        createdAt: new Date('2026-09-01T10:00:00Z'),
        startedAt: new Date('2026-09-01T10:00:05Z'),
        completedAt: new Date('2026-09-01T10:00:45Z'),
        commitMessage: 'fix: optimize bundle',
        commitHash: 'deadbeef',
        triggeredBy: 'Manual',
      };

      Deployment.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
      });
      // Final populated resolution
      Deployment.findById().populate().populate().populate = jest.fn().mockResolvedValue(mockDeployment);

      const result = await AdminDeploymentService.getDeployment(depId);

      expect(result.id).toBe(depId);
      expect(result.status).toBe('success');
      expect(result.duration).toBe('40s');
      expect(result.artifact).not.toBeNull();
      expect(result.artifact.formattedSize).toBe('10 MB');
      expect(result.artifact.fileCount).toBe(120);
      expect(result.artifact.checksum).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
      expect(result.timeline.length).toBe(3);
      expect(result.timeline[0].step).toBe('Queued');
      expect(result.timeline[1].step).toBe('Building');
      expect(result.timeline[2].step).toBe('Completed');
    });

    test('getDeployment throws 404 for nonexistent deployment', async () => {
      Deployment.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
      });
      Deployment.findById().populate().populate().populate = jest.fn().mockResolvedValue(null);

      await expect(AdminDeploymentService.getDeployment('invalid-id')).rejects.toThrow('Deployment not found');
    });
  });

  describe('3. Deployment Cancellation & Safety Rules', () => {
    test('cancel queued deployment transitions to cancelled and stops container', async () => {
      const mockDep = {
        _id: 'dep-q',
        status: 'queued',
        save: jest.fn().mockResolvedValue(true)
      };

      Deployment.findById = jest.fn().mockResolvedValue(mockDep);
      DockerClient.stopDeploymentContainer = jest.fn().mockResolvedValue(true);
      DockerClient.removeDeploymentContainer = jest.fn().mockResolvedValue(true);

      const result = await AdminDeploymentService.cancelDeployment('dep-q');

      expect(result.status).toBe('cancelled');
      expect(result.errorMessage).toBe('Cancelled by administrator');
      expect(mockDep.save).toHaveBeenCalled();
      expect(DockerClient.stopDeploymentContainer).toHaveBeenCalledWith('dep-q');
      expect(DockerClient.removeDeploymentContainer).toHaveBeenCalledWith('dep-q');
    });

    test('cancel building deployment transitions to cancelled and cleans container', async () => {
      const mockDep = {
        _id: 'dep-b',
        status: 'building',
        save: jest.fn().mockResolvedValue(true)
      };

      Deployment.findById = jest.fn().mockResolvedValue(mockDep);
      DockerClient.stopDeploymentContainer = jest.fn().mockResolvedValue(true);
      DockerClient.removeDeploymentContainer = jest.fn().mockResolvedValue(true);

      const result = await AdminDeploymentService.cancelDeployment('dep-b');

      expect(result.status).toBe('cancelled');
      expect(mockDep.save).toHaveBeenCalled();
    });

    test('cancel completed deployment rejects with 400 Bad Request', async () => {
      const mockDep = { _id: 'dep-done', status: 'ready' };
      Deployment.findById = jest.fn().mockResolvedValue(mockDep);

      await expect(AdminDeploymentService.cancelDeployment('dep-done')).rejects.toThrow(
        'Only queued or building deployments can be cancelled'
      );
    });

    test('cancel failed deployment rejects with 400 Bad Request', async () => {
      const mockDep = { _id: 'dep-fail', status: 'failed' };
      Deployment.findById = jest.fn().mockResolvedValue(mockDep);

      await expect(AdminDeploymentService.cancelDeployment('dep-fail')).rejects.toThrow(
        'Only queued or building deployments can be cancelled'
      );
    });

    test('cancel nonexistent deployment throws 404', async () => {
      Deployment.findById = jest.fn().mockResolvedValue(null);

      await expect(AdminDeploymentService.cancelDeployment('dep-none')).rejects.toThrow('Deployment not found');
    });
  });

  describe('4. Deployment Deletion & Artifact Cleanup', () => {
    test('deleteDeployment removes container, artifact, logs, and deployment record', async () => {
      const mockDep = {
        _id: 'dep-del',
        artifact: 'art-del'
      };

      Deployment.findById = jest.fn().mockResolvedValue(mockDep);
      Artifact.findById = jest.fn().mockResolvedValue({ _id: 'art-del', storageKey: 'artifacts/proj/dep-del.tar' });
      Artifact.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });
      DeploymentLog.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 5 });
      LogSequence.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 1 });
      Deployment.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });

      const result = await AdminDeploymentService.deleteDeployment('dep-del');

      expect(result.success).toBe(true);
      expect(DockerClient.stopDeploymentContainer).toHaveBeenCalledWith('dep-del');
      expect(Artifact.deleteOne).toHaveBeenCalledWith({ _id: 'art-del' });
      expect(DeploymentLog.deleteMany).toHaveBeenCalledWith({ deployment: 'dep-del' });
      expect(Deployment.deleteOne).toHaveBeenCalledWith({ _id: 'dep-del' });
    });

    test('deleteDeployment throws 404 for nonexistent deployment', async () => {
      Deployment.findById = jest.fn().mockResolvedValue(null);

      await expect(AdminDeploymentService.deleteDeployment('dep-none')).rejects.toThrow('Deployment not found');
    });
  });

  describe('5. Deployment Logs Authorization', () => {
    test('Admin user can view logs for any deployment', async () => {
      const mockDep = { _id: 'dep-1', owner: new mongoose.Types.ObjectId().toString() };
      Deployment.findById = jest.fn().mockResolvedValue(mockDep);
      deploymentLogService.getDeploymentLogs = jest.fn().mockResolvedValue({ logs: [], pagination: {} });

      const req = {
        params: { id: 'dep-1' },
        query: { page: 1, limit: 100 },
        user: { id: 'admin-id', role: ROLES.ADMIN }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await getDeploymentLogs(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(deploymentLogService.getDeploymentLogs).toHaveBeenCalledWith('dep-1', 1, 100);
    });

    test('Non-admin third party is rejected with 403 Forbidden', async () => {
      const ownerId = new mongoose.Types.ObjectId().toString();
      const mockDep = { _id: 'dep-1', owner: ownerId };
      Deployment.findById = jest.fn().mockResolvedValue(mockDep);

      const req = {
        params: { id: 'dep-1' },
        query: { page: 1, limit: 100 },
        user: { id: 'stranger-id', role: ROLES.USER }
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await expect(getDeploymentLogs(req, res)).rejects.toThrow('You do not have permission to view logs for this deployment');
    });
  });
});
