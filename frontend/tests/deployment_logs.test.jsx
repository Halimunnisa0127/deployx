import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDeploymentLogs } from '../src/features/deployments/hooks/useDeploymentLogs';
import { deploymentsApi } from '../src/features/deployments/api/deploymentsApi';

vi.mock('../src/features/deployments/api/deploymentsApi', () => ({
  deploymentsApi: {
    getDeploymentLogs: vi.fn(),
  },
}));

describe('useDeploymentLogs Hook Unit Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('calls log API with deploymentId and loading state works', async () => {
    deploymentsApi.getDeploymentLogs.mockReturnValue(new Promise(() => {})); // Never resolves
    const { result } = renderHook(() => useDeploymentLogs('dep-123', 'ready'));

    expect(result.current.isLoading).toBe(true);
    expect(deploymentsApi.getDeploymentLogs).toHaveBeenCalledWith('dep-123', 1, 10000);
  });

  test('maps raw logs successfully', async () => {
    const mockLogs = {
      success: true,
      data: {
        logs: [
          { sequence: 1, level: 'info', timestamp: '2026-08-12T10:00:00.000Z', message: 'Build started' },
          { sequence: 2, level: 'error', timestamp: '2026-08-12T10:00:01.000Z', message: 'Syntax error' }
        ]
      }
    };
    deploymentsApi.getDeploymentLogs.mockResolvedValue(mockLogs);

    const { result } = renderHook(() => useDeploymentLogs('dep-123', 'ready'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.logs).toHaveLength(2);
    expect(result.current.logs[0]).toEqual({
      id: 1,
      type: 'info',
      time: expect.any(String),
      text: 'Build started'
    });
    expect(result.current.logs[1].type).toBe('error');
  });

  test('handles empty logs response safely', async () => {
    const mockLogs = {
      success: true,
      data: {
        logs: []
      }
    };
    deploymentsApi.getDeploymentLogs.mockResolvedValue(mockLogs);

    const { result } = renderHook(() => useDeploymentLogs('dep-123', 'ready'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.logs).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  test('handles API failures safely', async () => {
    deploymentsApi.getDeploymentLogs.mockRejectedValue(new Error('Connection timeout'));

    const { result } = renderHook(() => useDeploymentLogs('dep-123', 'ready'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Connection timeout');
  });

  test('polling starts only for active deployments and clears on unmount', async () => {
    const mockLogs = { success: true, data: { logs: [] } };
    deploymentsApi.getDeploymentLogs.mockResolvedValue(mockLogs);

    // Render with active status 'building'
    const { unmount } = renderHook(() => useDeploymentLogs('dep-123', 'building'));

    await waitFor(() => {
      expect(deploymentsApi.getDeploymentLogs).toHaveBeenCalledTimes(1);
    });

    // Advance timers by 3000ms to trigger next polling tick
    vi.advanceTimersByTime(3000);
    expect(deploymentsApi.getDeploymentLogs).toHaveBeenCalledTimes(2);

    // Unmount hook
    unmount();

    // Advance timers again, verify no further calls are made
    vi.advanceTimersByTime(3000);
    expect(deploymentsApi.getDeploymentLogs).toHaveBeenCalledTimes(2);
  });
});
