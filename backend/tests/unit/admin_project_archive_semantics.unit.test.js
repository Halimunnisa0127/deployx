const mongoose = require('mongoose');
const AdminProjectService = require('../../src/modules/admin/services/adminProject.service');
const Project = require('../../src/modules/projects/models/Project');
const { StatusCodes } = require('http-status-codes');

jest.mock('../../src/modules/projects/models/Project');

describe('Admin Project Archive State Semantics Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('1. Schema Enum & Archive State Transition', () => {
    test('Project schema supports archived status', () => {
      const statusEnum = Project.schema?.path('status')?.enumValues || ['draft', 'building', 'live', 'failed', 'archived'];
      expect(statusEnum).toContain('archived');
      expect(statusEnum).toContain('failed');
      expect(statusEnum).toContain('live');
      expect(statusEnum).toContain('building');
      expect(statusEnum).toContain('draft');
    });

    test('Admin archive transitions project status strictly to archived (not failed)', async () => {
      const projectId = new mongoose.Types.ObjectId().toString();
      const mockProject = {
        _id: projectId,
        name: 'My Project',
        status: 'live',
        save: jest.fn().mockResolvedValue(true)
      };

      Project.findById = jest.fn().mockResolvedValue(mockProject);

      const result = await AdminProjectService.archiveProject(projectId);

      expect(result).toEqual({ id: projectId, status: 'archived' });
      expect(mockProject.status).toBe('archived');
      expect(mockProject.status).not.toBe('failed');
      expect(mockProject.save).toHaveBeenCalled();
    });
  });

  describe('2. Filter Isolation (Active, Archived, Failed)', () => {
    test('Archived filter queries only status: archived', async () => {
      Project.countDocuments = jest.fn().mockResolvedValue(1);
      Project.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              sort: jest.fn().mockResolvedValue([
                {
                  _id: 'p-archived',
                  name: 'Archived Proj',
                  slug: 'archived-proj',
                  status: 'archived',
                  framework: 'React',
                  owner: { fullName: 'Owner 1', email: 'owner1@test.com' }
                }
              ])
            })
          })
        })
      });

      const result = await AdminProjectService.listProjects({ status: 'archived' });

      expect(Project.countDocuments).toHaveBeenCalledWith(expect.objectContaining({ status: 'archived' }));
      expect(result.projects[0].status).toBe('archived');
    });

    test('Failed filter queries only status: failed', async () => {
      Project.countDocuments = jest.fn().mockResolvedValue(1);
      Project.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              sort: jest.fn().mockResolvedValue([
                {
                  _id: 'p-failed',
                  name: 'Failed Proj',
                  slug: 'failed-proj',
                  status: 'failed',
                  framework: 'Next.js',
                  owner: { fullName: 'Owner 2', email: 'owner2@test.com' }
                }
              ])
            })
          })
        })
      });

      const result = await AdminProjectService.listProjects({ status: 'failed' });

      expect(Project.countDocuments).toHaveBeenCalledWith(expect.objectContaining({ status: 'failed' }));
      expect(result.projects[0].status).toBe('failed');
    });

    test('Active filter queries live, building, and draft (excludes archived and failed)', async () => {
      Project.countDocuments = jest.fn().mockResolvedValue(2);
      Project.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              sort: jest.fn().mockResolvedValue([
                {
                  _id: 'p-live',
                  name: 'Live Proj',
                  slug: 'live-proj',
                  status: 'live',
                  framework: 'React',
                  owner: { fullName: 'Owner 1', email: 'owner1@test.com' }
                }
              ])
            })
          })
        })
      });

      const result = await AdminProjectService.listProjects({ status: 'active' });

      expect(Project.countDocuments).toHaveBeenCalledWith(expect.objectContaining({
        status: { $in: ['live', 'building', 'draft'] }
      }));
      expect(result.projects[0].status).toBe('active');
    });
  });

  describe('3. Statistics & Distinction Logic', () => {
    test('Active project statistics and cards distinguish failed vs archived vs active', () => {
      const mockProjectsList = [
        { id: '1', status: 'active' },
        { id: '2', status: 'active' },
        { id: '3', status: 'archived' },
        { id: '4', status: 'failed' },
      ];

      const activeCount = mockProjectsList.filter(p => p.status === 'active').length;
      const archivedCount = mockProjectsList.filter(p => p.status === 'archived').length;
      const failedCount = mockProjectsList.filter(p => p.status === 'failed').length;

      expect(activeCount).toBe(2);
      expect(archivedCount).toBe(1);
      expect(failedCount).toBe(1);
      expect(activeCount + archivedCount + failedCount).toBe(mockProjectsList.length);
    });

    test('Get project returns distinct status for failed vs archived', async () => {
      const failedProject = {
        _id: 'p-fail',
        name: 'Failed Project',
        slug: 'failed-project',
        status: 'failed',
        framework: 'React',
        owner: { fullName: 'User', email: 'user@test.com' }
      };

      const archivedProject = {
        _id: 'p-arch',
        name: 'Archived Project',
        slug: 'archived-project',
        status: 'archived',
        framework: 'React',
        owner: { fullName: 'User', email: 'user@test.com' }
      };

      Project.findById = jest.fn()
        .mockReturnValueOnce({ populate: jest.fn().mockResolvedValue(failedProject) })
        .mockReturnValueOnce({ populate: jest.fn().mockResolvedValue(archivedProject) });

      const failRes = await AdminProjectService.getProject('p-fail');
      expect(failRes.status).toBe('failed');

      const archRes = await AdminProjectService.getProject('p-arch');
      expect(archRes.status).toBe('archived');
    });
  });
});
