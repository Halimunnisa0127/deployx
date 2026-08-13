import { describe, test, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDeploymentDetails } from '../src/features/deployments/hooks/useDeploymentDetails';
import { deploymentsApi } from '../src/features/deployments/api/deploymentsApi';

vi.mock('../src/features/deployments/api/deploymentsApi', () => ({
  deploymentsApi: {
    getDeploymentDetails: vi.fn(),
  },
}));

describe('useDeploymentDetails Hook Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('loading starts as true and API is called with correct ID', async () => {
    deploymentsApi.getDeploymentDetails.mockReturnValue(new Promise(() => {})); // Never resolves
    const { result } = renderHook(() => useDeploymentDetails('dep-123'));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.deployment).toBeNull();
    expect(result.current.error).toBeNull();
    expect(deploymentsApi.getDeploymentDetails).toHaveBeenCalledWith('dep-123');
  });

  test('successful response updates deployment state and ends loading', async () => {
    const mockResponse = {
      success: true,
      data: {
        deployment: {
          _id: 'dep-123',
          status: 'ready',
          project: { name: 'My Project' },
        },
      },
    };
    deploymentsApi.getDeploymentDetails.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useDeploymentDetails('dep-123'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.deployment).toEqual({
      _id: 'dep-123',
      id: 'dep-123',
      status: 'ready',
      project: { name: 'My Project' },
      projectName: 'My Project',
    });
  });

  test('API error updates error state and ends loading', async () => {
    const apiError = new Error('Network Error');
    deploymentsApi.getDeploymentDetails.mockRejectedValue(apiError);

    const { result } = renderHook(() => useDeploymentDetails('dep-123'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.deployment).toBeNull();
    expect(result.current.error).toBe('Network Error');
  });

  test('regression: undefined response is handled gracefully', async () => {
    // Mock API returning undefined
    deploymentsApi.getDeploymentDetails.mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeploymentDetails('dep-123'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.deployment).toBeNull();
    expect(result.current.error).toBe('Invalid response structure: deployment is undefined');
  });

  test('missing deployment ID is handled safely', async () => {
    const { result } = renderHook(() => useDeploymentDetails(null));

    expect(result.current.isLoading).toBe(true);
    expect(deploymentsApi.getDeploymentDetails).not.toHaveBeenCalled();
  });

  test('polling flows: building -> ready and then stops polling', async () => {
    vi.useFakeTimers();
    
    const mockBuildingResponse = {
      success: true,
      data: {
        deployment: {
          _id: 'dep-123',
          status: 'building',
          project: { name: 'My Project' },
        },
      },
    };
    deploymentsApi.getDeploymentDetails.mockResolvedValueOnce(mockBuildingResponse);

    const { result } = renderHook(() => useDeploymentDetails('dep-123'));

    await waitFor(() => {
      expect(result.current.deployment?.status).toBe('building');
    });

    expect(deploymentsApi.getDeploymentDetails).toHaveBeenCalledTimes(1);

    const mockReadyResponse = {
      success: true,
      data: {
        deployment: {
          _id: 'dep-123',
          status: 'ready',
          project: { name: 'My Project' },
        },
      },
    };
    deploymentsApi.getDeploymentDetails.mockResolvedValueOnce(mockReadyResponse);

    await vi.advanceTimersByTimeAsync(4000);

    await waitFor(() => {
      expect(result.current.deployment?.status).toBe('ready');
    });

    expect(deploymentsApi.getDeploymentDetails).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(4000);
    expect(deploymentsApi.getDeploymentDetails).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });

  test('polling flows: building -> failed and then stops polling', async () => {
    vi.useFakeTimers();
    
    const mockBuildingResponse = {
      success: true,
      data: {
        deployment: {
          _id: 'dep-123',
          status: 'building',
          project: { name: 'My Project' },
        },
      },
    };
    deploymentsApi.getDeploymentDetails.mockResolvedValueOnce(mockBuildingResponse);

    const { result } = renderHook(() => useDeploymentDetails('dep-123'));

    await waitFor(() => {
      expect(result.current.deployment?.status).toBe('building');
    });

    const mockFailedResponse = {
      success: true,
      data: {
        deployment: {
          _id: 'dep-123',
          status: 'failed',
          project: { name: 'My Project' },
        },
      },
    };
    deploymentsApi.getDeploymentDetails.mockResolvedValueOnce(mockFailedResponse);

    await vi.advanceTimersByTimeAsync(4000);

    await waitFor(() => {
      expect(result.current.deployment?.status).toBe('failed');
    });

    expect(deploymentsApi.getDeploymentDetails).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(4000);
    expect(deploymentsApi.getDeploymentDetails).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });

  test('polling flows: building -> cancelled and then stops polling', async () => {
    vi.useFakeTimers();
    
    const mockBuildingResponse = {
      success: true,
      data: {
        deployment: {
          _id: 'dep-123',
          status: 'building',
          project: { name: 'My Project' },
        },
      },
    };
    deploymentsApi.getDeploymentDetails.mockResolvedValueOnce(mockBuildingResponse);

    const { result } = renderHook(() => useDeploymentDetails('dep-123'));

    await waitFor(() => {
      expect(result.current.deployment?.status).toBe('building');
    });

    const mockCancelledResponse = {
      success: true,
      data: {
        deployment: {
          _id: 'dep-123',
          status: 'cancelled',
          project: { name: 'My Project' },
        },
      },
    };
    deploymentsApi.getDeploymentDetails.mockResolvedValueOnce(mockCancelledResponse);

    await vi.advanceTimersByTimeAsync(4000);

    await waitFor(() => {
      expect(result.current.deployment?.status).toBe('cancelled');
    });

    expect(deploymentsApi.getDeploymentDetails).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(4000);
    expect(deploymentsApi.getDeploymentDetails).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });
});
