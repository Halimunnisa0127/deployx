import { describe, test, expect, vi, beforeEach } from 'vitest';
import api from '../src/lib/axios';
import { deploymentsApi } from '../src/features/deployments/api/deploymentsApi';
import { domainsApi } from '../src/features/domains/api/domainsApi';
import { fetchUsers } from '../src/features/admin/users/api/usersApi';
import { fetchProjects } from '../src/features/admin/projects/api/projectsApi';
import { systemHealthApi } from '../src/features/admin/system-health/api/systemHealthApi';

vi.mock('../src/lib/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('API Contract Configuration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Deployment creation endpoint uses POST and maps database fields correctly', async () => {
    const payload = { projectId: 'p1', environment: 'Production', branch: 'main' };
    api.post.mockResolvedValue({
      data: {
        success: true,
        data: {
          deployment: {
            _id: 'dep-101',
            status: 'queued',
            deploymentNumber: 42
          }
        }
      }
    });

    const res = await deploymentsApi.createDeployment(payload);
    expect(api.post).toHaveBeenCalledWith('/deployments', payload);
    expect(res.data.deployment._id).toBe('dep-101');
    expect(res.data.deployment.status).toBe('queued');
  });

  test('Project domains routing uses project ID prefix', async () => {
    api.get.mockResolvedValue({
      data: {
        success: true,
        data: []
      }
    });

    await domainsApi.getProjectDomains('proj-xyz');
    expect(api.get).toHaveBeenCalledWith('/domains/project/proj-xyz');
  });

  test('System health incidents endpoint maps page and limit parameters correctly', async () => {
    api.get.mockResolvedValue({
      data: {
        data: {
          incidents: [],
          pagination: { total: 0, page: 5, limit: 25 }
        }
      }
    });

    const res = await systemHealthApi.getIncidents(5, 25);
    expect(api.get).toHaveBeenCalledWith('/admin/health/incidents?page=5&limit=25');
    expect(res.pagination.page).toBe(5);
  });
});
