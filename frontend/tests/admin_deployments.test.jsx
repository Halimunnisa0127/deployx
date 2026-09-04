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
    const mockDeployments = [{ _id: 'dep-1', status: 'ready', project: 'App 1' }];
    api.get.mockResolvedValue({
      data: {
        data: {
          deployments: mockDeployments
        }
      }
    });

    const deployments = await deploymentsApi.getDeployments();
    expect(api.get).toHaveBeenCalledWith('/admin/deployments', { params: {} });
    expect(deployments).toEqual(mockDeployments);
  });

  test('getDeployment calls /admin/deployments/:id and maps response', async () => {
    const mockDeployment = {
      _id: 'dep-1',
      status: 'success',
      project: 'Cool App',
      artifact: {
        size: 15728640,
        formattedSize: '15.0 MB',
        fileCount: 42,
        checksum: 'sha256-abc12345',
        outputDirectory: 'dist',
      },
      timeline: [
        { step: 'Queued', status: 'completed', time: '10:00:00 AM' },
        { step: 'Building', status: 'completed', time: '10:00:05 AM' },
        { step: 'Completed', status: 'completed', time: '10:00:25 AM' },
      ],
    };

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
    expect(deployment.artifact.formattedSize).toBe('15.0 MB');
    expect(deployment.timeline.length).toBe(3);
  });

  test('getDeploymentArtifacts returns measured artifact metadata without hardcoded values', async () => {
    const mockDeployment = {
      _id: 'dep-1',
      framework: 'react',
      artifact: {
        size: 2097152,
        formattedSize: '2.0 MB',
        fileCount: 18,
        checksum: 'abc-hash',
        outputDirectory: 'dist',
      }
    };

    api.get.mockResolvedValue({
      data: {
        data: {
          deployment: mockDeployment
        }
      }
    });

    const artifacts = await deploymentsApi.getDeploymentArtifacts('dep-1');
    expect(artifacts.buildSize).toBe('2.0 MB');
    expect(artifacts.fileCount).toBe(18);
    expect(artifacts.checksum).toBe('abc-hash');
    expect(artifacts.outputDirectory).toBe('dist');
  });

  test('getDeploymentLogs fetches and formats logs from /deployments/:id/logs', async () => {
    api.get.mockResolvedValue({
      data: {
        data: {
          logs: [
            { timestamp: '2026-09-01T10:00:00.000Z', level: 'info', message: 'Build started' },
            { timestamp: '2026-09-01T10:00:05.000Z', level: 'success', message: 'Build completed successfully' },
          ]
        }
      }
    });

    const logsText = await deploymentsApi.getDeploymentLogs('dep-1');
    expect(api.get).toHaveBeenCalledWith('/deployments/dep-1/logs');
    expect(logsText).toContain('[INFO] Build started');
    expect(logsText).toContain('[SUCCESS] Build completed successfully');
  });

  test('cancelDeployment issues POST to cancel endpoint', async () => {
    api.post.mockResolvedValue({
      data: { success: true, data: { deployment: { _id: 'dep-1', status: 'cancelled' } } }
    });

    const res = await deploymentsApi.cancelDeployment('dep-1');
    expect(api.post).toHaveBeenCalledWith('/admin/deployments/dep-1/cancel');
    expect(res.success).toBe(true);
  });

  test('deleteDeployment issues DELETE to delete endpoint', async () => {
    api.delete.mockResolvedValue({
      data: { success: true, message: 'Deployment deleted successfully' }
    });

    const res = await deploymentsApi.deleteDeployment('dep-1');
    expect(api.delete).toHaveBeenCalledWith('/admin/deployments/dep-1');
    expect(res.success).toBe(true);
  });

  test('redeployDeployment triggers POST /deployments with project details', async () => {
    const mockDetails = {
      projectId: 'proj-123',
      environment: 'Production',
      branch: 'main',
      commitHash: 'c0ffee1',
      commitMessage: 'fix: update ui'
    };

    api.get.mockResolvedValue({
      data: {
        data: {
          deployment: mockDetails
        }
      }
    });

    api.post.mockResolvedValue({
      data: { success: true, data: { deployment: { _id: 'dep-new' } } }
    });

    const res = await deploymentsApi.redeployDeployment('dep-1');
    expect(api.post).toHaveBeenCalledWith('/deployments', {
      projectId: 'proj-123',
      environment: 'Production',
      branch: 'main',
      commitHash: 'c0ffee1',
      commitMessage: 'fix: update ui'
    });
    expect(res.success).toBe(true);
  });
});
