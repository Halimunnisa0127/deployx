const mongoose = require('mongoose');
const AdminProjectService = require('../../src/modules/admin/services/adminProject.service');
const Project = require('../../src/modules/projects/models/Project');
const Domain = require('../../src/modules/domains/models/Domain');
const Deployment = require('../../src/modules/deployments/models/Deployment');
const DockerClient = require('../../src/infrastructure/docker/docker.client');
const { ApiError } = require('../../src/shared/errors/ApiError');
const { StatusCodes } = require('http-status-codes');

jest.mock('../../src/modules/projects/models/Project');
jest.mock('../../src/modules/domains/models/Domain');
jest.mock('../../src/modules/deployments/models/Deployment');
jest.mock('../../src/infrastructure/docker/docker.client');

describe('Project Deletion Safety & Resource Lifecycle Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('1. Nonexistent Project Deletion', () => {
    test('Deleting a non-existent project throws 404 Not Found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      Project.findById = jest.fn().mockResolvedValue(null);

      await expect(AdminProjectService.deleteProject(nonExistentId)).rejects.toThrow(
        expect.objectContaining({
          statusCode: StatusCodes.NOT_FOUND,
          message: 'Project not found'
        })
      );

      expect(Project.findById).toHaveBeenCalledWith(nonExistentId);
      expect(Project.deleteOne).not.toHaveBeenCalled();
      expect(Domain.deleteMany).not.toHaveBeenCalled();
    });
  });

  describe('2. Custom Domains Cleanup', () => {
    test('Deleting a project cleans up all associated custom domains', async () => {
      const projectId = new mongoose.Types.ObjectId().toString();
      const mockProject = { _id: projectId, name: 'Test Project' };

      Project.findById = jest.fn().mockResolvedValue(mockProject);
      Deployment.find = jest.fn().mockResolvedValue([]);
      Domain.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 3 });
      Project.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });
      DockerClient.removePreviousRuntimeContainers = jest.fn().mockResolvedValue(true);

      const result = await AdminProjectService.deleteProject(projectId);

      expect(result).toEqual({ success: true });
      expect(Domain.deleteMany).toHaveBeenCalledWith({ project: projectId });
      expect(Project.deleteOne).toHaveBeenCalledWith({ _id: projectId });
    });
  });

  describe('3. Historical Deployments Retention Behavior', () => {
    test('Historical ready/failed deployments are retained when project is deleted', async () => {
      const projectId = new mongoose.Types.ObjectId().toString();
      const mockProject = { _id: projectId, name: 'Historical Project' };

      Project.findById = jest.fn().mockResolvedValue(mockProject);
      // Active deployments query returns empty because all deployments are terminal/ready/failed
      Deployment.find = jest.fn().mockResolvedValue([]);
      Domain.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 0 });
      Project.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });
      DockerClient.removePreviousRuntimeContainers = jest.fn().mockResolvedValue(true);

      await AdminProjectService.deleteProject(projectId);

      // Verify Deployment.deleteMany was NOT called (historical records are retained)
      expect(Deployment.deleteMany).not.toHaveBeenCalled();
      expect(Deployment.deleteOne).not.toHaveBeenCalled();
    });
  });

  describe('4. Active Deployment Safe Cancellation & Container Cleanup', () => {
    test('Deleting a project with active (queued/building) deployment safely cancels it and stops containers', async () => {
      const projectId = new mongoose.Types.ObjectId().toString();
      const mockProject = { _id: projectId, name: 'Active Project' };

      const activeDep1 = {
        _id: new mongoose.Types.ObjectId().toString(),
        project: projectId,
        status: 'queued',
        save: jest.fn().mockResolvedValue(true)
      };

      const activeDep2 = {
        _id: new mongoose.Types.ObjectId().toString(),
        project: projectId,
        status: 'building',
        save: jest.fn().mockResolvedValue(true)
      };

      Project.findById = jest.fn().mockResolvedValue(mockProject);
      Deployment.find = jest.fn().mockResolvedValue([activeDep1, activeDep2]);
      Domain.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 0 });
      Project.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });
      DockerClient.stopDeploymentContainer = jest.fn().mockResolvedValue(true);
      DockerClient.removeDeploymentContainer = jest.fn().mockResolvedValue(true);
      DockerClient.removePreviousRuntimeContainers = jest.fn().mockResolvedValue(true);

      const result = await AdminProjectService.deleteProject(projectId);

      expect(result).toEqual({ success: true });
      expect(activeDep1.status).toBe('cancelled');
      expect(activeDep1.errorMessage).toBe('Project was deleted by administrator');
      expect(activeDep1.save).toHaveBeenCalled();

      expect(activeDep2.status).toBe('cancelled');
      expect(activeDep2.errorMessage).toBe('Project was deleted by administrator');
      expect(activeDep2.save).toHaveBeenCalled();

      expect(DockerClient.stopDeploymentContainer).toHaveBeenCalledWith(activeDep1._id);
      expect(DockerClient.removeDeploymentContainer).toHaveBeenCalledWith(activeDep1._id);
      expect(DockerClient.stopDeploymentContainer).toHaveBeenCalledWith(activeDep2._id);
      expect(DockerClient.removeDeploymentContainer).toHaveBeenCalledWith(activeDep2._id);
      expect(DockerClient.removePreviousRuntimeContainers).toHaveBeenCalledWith(projectId);
    });
  });

  describe('5. Transaction and Consistency Fallback', () => {
    test('Uses MongoDB transaction session when available', async () => {
      const projectId = new mongoose.Types.ObjectId().toString();
      const mockProject = { _id: projectId, name: 'Txn Project' };

      Project.findById = jest.fn().mockResolvedValue(mockProject);
      Deployment.find = jest.fn().mockResolvedValue([]);
      DockerClient.removePreviousRuntimeContainers = jest.fn().mockResolvedValue(true);

      const mockSession = {
        withTransaction: jest.fn().mockImplementation(async (callback) => {
          await callback();
        }),
        endSession: jest.fn().mockResolvedValue(true)
      };

      const startSessionSpy = jest.spyOn(mongoose, 'startSession').mockResolvedValue(mockSession);
      Domain.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 1 });
      Project.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });

      const result = await AdminProjectService.deleteProject(projectId);

      expect(result).toEqual({ success: true });
      expect(mockSession.withTransaction).toHaveBeenCalled();
      expect(mockSession.endSession).toHaveBeenCalled();

      startSessionSpy.mockRestore();
    });

    test('Falls back gracefully to sequential deletion on standalone MongoDB without replica set', async () => {
      const projectId = new mongoose.Types.ObjectId().toString();
      const mockProject = { _id: projectId, name: 'Standalone Project' };

      Project.findById = jest.fn().mockResolvedValue(mockProject);
      Deployment.find = jest.fn().mockResolvedValue([]);
      DockerClient.removePreviousRuntimeContainers = jest.fn().mockResolvedValue(true);

      const startSessionSpy = jest.spyOn(mongoose, 'startSession').mockRejectedValue(new Error('Transactions not supported'));
      Domain.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 1 });
      Project.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });

      const result = await AdminProjectService.deleteProject(projectId);

      expect(result).toEqual({ success: true });
      expect(Domain.deleteMany).toHaveBeenCalledWith({ project: projectId });
      expect(Project.deleteOne).toHaveBeenCalledWith({ _id: projectId });

      startSessionSpy.mockRestore();
    });
  });
});
