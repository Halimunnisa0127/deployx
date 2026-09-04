import { describe, test, expect, vi, beforeEach } from 'vitest';
import { systemHealthApi } from '../src/features/admin/system-health/api/systemHealthApi';
import api from '../src/lib/axios';

vi.mock('../src/lib/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Admin System Health API Client Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('getOverview calls GET /admin/health/overview', async () => {
    const mockOverview = {
      status: 'healthy',
      services: { mongodb: 'ready', redis: 'ready', docker: 'ready' },
    };

    api.get.mockResolvedValue({
      data: { data: mockOverview },
    });

    const res = await systemHealthApi.getOverview();
    expect(api.get).toHaveBeenCalledWith('/admin/health/overview');
    expect(res).toEqual(mockOverview);
  });

  test('getPerformance calls GET /admin/health/performance', async () => {
    const mockPerformance = {
      cpu: { current: 42, trend: 1.5, data: [{ time: '12:00', value: 40 }] },
      memory: { current: 65, trend: -0.5, data: [{ time: '12:00', value: 65 }] },
    };

    api.get.mockResolvedValue({
      data: { data: mockPerformance },
    });

    const res = await systemHealthApi.getPerformance();
    expect(api.get).toHaveBeenCalledWith('/admin/health/performance');
    expect(res.cpu.current).toBe(42);
    expect(res.cpu.data).toHaveLength(1);
  });

  test('getHistory calls GET /admin/health/history with parameters', async () => {
    const mockHistory = {
      metric: 'cpu',
      range: '24h',
      data: [{ time: '10:00', value: 35, min: 20, max: 45 }],
    };

    api.get.mockResolvedValue({
      data: { data: mockHistory },
    });

    const res = await systemHealthApi.getHistory({ metric: 'cpu', range: '24h' });
    expect(api.get).toHaveBeenCalledWith('/admin/health/history', {
      params: { metric: 'cpu', range: '24h' },
    });
    expect(res.metric).toBe('cpu');
  });

  test('getInfrastructure calls GET /admin/health/infrastructure', async () => {
    const mockInfra = {
      mongodb: { status: 'ready' },
      redis: { status: 'ready' },
    };

    api.get.mockResolvedValue({
      data: { data: mockInfra },
    });

    const res = await systemHealthApi.getInfrastructure();
    expect(api.get).toHaveBeenCalledWith('/admin/health/infrastructure');
    expect(res.mongodb.status).toBe('ready');
  });
});
