import { describe, test, expect, vi, beforeEach } from 'vitest';
import { deploymentsApi } from '../src/features/admin/deployments/api/deploymentsApi';
import api from '../src/lib/axios';

vi.mock('../src/lib/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Admin Deployments API Client Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('getDeployments calls /admin/deployments and resolves array', async () => {
    const mockDeployments = [{ _id: 'dep-1', status: 'ready' }];
    api.get.mockResolvedValue({
      data: {
        data: {
          deployments: mockDeployments
        }
      }
    });

    const deployments = await deploymentsApi.getDeployments();
    expect(api.get).toHaveBeenCalledWith('/admin/deployments');
    expect(deployments).toEqual(mockDeployments);
  });

  test('getDeployment calls /admin/deployments/:id and maps response', async () => {
    const mockDeployment = { _id: 'dep-1', status: 'ready' };
    api.get.mockResolvedValue({
      data: {
        data: {
          deployment: mockDeployment
        }
      }
    });

    const deployment = await deploymentsApi.getDeployment('dep-1');
    expect(api.get).toHaveBeenCalledWith('/admin/deployments/dep-1');
    expect(deployment).toEqual(mockDeployment);
  });

  test('cancelDeployment issues POST to cancel endpoint', async () => {
    api.post.mockResolvedValue({
      data: { success: true, message: 'Cancelled' }
    });

    const res = await deploymentsApi.cancelDeployment('dep-1');
    expect(api.post).toHaveBeenCalledWith('/admin/deployments/dep-1/cancel');
    expect(res.success).toBe(true);
  });
});
