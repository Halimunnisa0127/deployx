import { describe, test, expect, vi, beforeEach } from 'vitest';
import { systemHealthApi } from '../src/features/admin/system-health/api/systemHealthApi';
import api from '../src/lib/axios';

vi.mock('../src/lib/axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('Admin System Health API Client Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('getOverview maps backend services status correctly', async () => {
    const mockOverview = {
      status: 'healthy',
      services: { mongodb: 'ready', redis: 'ready', docker: 'ready' },
      queue: { waiting: 0, active: 0, completed: 5, failed: 0, delayed: 0 },
      timestamp: '2026-08-12T12:00:00Z'
    };

    api.get.mockResolvedValue({
      data: {
        data: mockOverview
      }
    });

    const result = await systemHealthApi.getOverview();
    expect(api.get).toHaveBeenCalledWith('/admin/health/overview');
    expect(result.status).toBe('healthy');
    expect(result.services.mongodb).toBe('ready');
  });

  test('getInfrastructure maps metrics correctly', async () => {
    const mockInfra = {
      mongodb: { status: 'ready' },
      redis: { status: 'ready' },
      docker: { status: 'ready', activeBuildsCount: 0 }
    };

    api.get.mockResolvedValue({
      data: {
        data: mockInfra
      }
    });

    const result = await systemHealthApi.getInfrastructure();
    expect(api.get).toHaveBeenCalledWith('/admin/health/infrastructure');
    expect(result.mongodb.status).toBe('ready');
  });

  test('getIncidents maps pagination query parameters correctly', async () => {
    const mockIncidents = {
      incidents: [],
      pagination: { total: 0, page: 2, limit: 10 }
    };

    api.get.mockResolvedValue({
      data: {
        data: mockIncidents
      }
    });

    const result = await systemHealthApi.getIncidents(2, 10);
    expect(api.get).toHaveBeenCalledWith('/admin/health/incidents?page=2&limit=10');
    expect(result.pagination.page).toBe(2);
  });

  test('handles 401 unauthenticated and 403 unauthorized errors', async () => {
    const err401 = new Error('Unauthorized');
    err401.response = { status: 401 };
    api.get.mockRejectedValueOnce(err401);

    await expect(systemHealthApi.getOverview()).rejects.toThrow('Unauthorized');

    const err403 = new Error('Forbidden');
    err403.response = { status: 403 };
    api.get.mockRejectedValueOnce(err403);

    await expect(systemHealthApi.getOverview()).rejects.toThrow('Forbidden');
  });

  test('handles 503 service degraded response safely', async () => {
    const err503 = new Error('Service Unavailable');
    err503.response = { status: 503 };
    api.get.mockRejectedValueOnce(err503);

    await expect(systemHealthApi.getOverview()).rejects.toThrow('Service Unavailable');
  });
});
