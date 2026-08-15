import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import DeploymentDetails from '../src/features/deployments/pages/DeploymentDetails';
import { useDeploymentDetails } from '../src/features/deployments/hooks/useDeploymentDetails';
import { useDeploymentLogs } from '../src/features/deployments/hooks/useDeploymentLogs';
import { useDeploymentMutations } from '../src/features/deployments/hooks/useDeploymentMutations';

vi.mock('react-router-dom', () => ({
  useParams: () => ({ id: 'dep-123' }),
  useNavigate: () => vi.fn(),
}));

vi.mock('../src/features/deployments/hooks/useDeploymentDetails');
vi.mock('../src/features/deployments/hooks/useDeploymentLogs');
vi.mock('../src/features/deployments/hooks/useDeploymentMutations');

describe('DeploymentDetails UI Component tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useDeploymentMutations.mockReturnValue({
      createDeployment: vi.fn(),
      cancelDeployment: vi.fn(),
      isCreating: false,
      isCancelling: false,
    });
  });

  test('displays loading spinner and text on loading', () => {
    useDeploymentDetails.mockReturnValue({
      deployment: null,
      isLoading: true,
      error: null,
    });
    useDeploymentLogs.mockReturnValue({ logs: [], isLoading: true });

    render(<DeploymentDetails />);
    expect(screen.getByText('Loading deployment details...')).toBeInTheDocument();
  });

  test('displays Deployment Not Found on empty or error details', () => {
    useDeploymentDetails.mockReturnValue({
      deployment: null,
      isLoading: false,
      error: 'Not Found',
    });
    useDeploymentLogs.mockReturnValue({ logs: [], isLoading: false });

    render(<DeploymentDetails />);
    expect(screen.getByText('Deployment Not Found')).toBeInTheDocument();
    expect(screen.getByText('Not Found')).toBeInTheDocument();
  });

  test('renders successfully when deployment is ready', () => {
    useDeploymentDetails.mockReturnValue({
      deployment: {
        id: 'dep-123',
        _id: 'dep-123',
        status: 'ready',
        environment: 'Production',
        branch: 'main',
        commitHash: 'abcdef',
        project: { name: 'My Project' },
      },
      isLoading: false,
      error: null,
    });
    useDeploymentLogs.mockReturnValue({
      logs: [{ id: 1, type: 'info', time: '12:00:00', text: 'Build output line' }],
      isLoading: false,
    });

    render(<DeploymentDetails />);
    expect(screen.getByText('Build output line')).toBeInTheDocument();
  });

  test('renders failed banner when deployment status is failed', () => {
    useDeploymentDetails.mockReturnValue({
      deployment: {
        id: 'dep-123',
        _id: 'dep-123',
        status: 'failed',
        environment: 'Production',
        branch: 'main',
        errorMessage: 'Compilation failed',
        project: { name: 'My Project' },
      },
      isLoading: false,
      error: null,
    });
    useDeploymentLogs.mockReturnValue({ logs: [], isLoading: false });

    render(<DeploymentDetails />);
    expect(screen.getByText(/failed/i)).toBeInTheDocument();
  });

  test('renders cancelled banner when deployment status is cancelled', () => {
    useDeploymentDetails.mockReturnValue({
      deployment: {
        id: 'dep-123',
        _id: 'dep-123',
        status: 'cancelled',
        environment: 'Production',
        branch: 'main',
        project: { name: 'My Project' },
      },
      isLoading: false,
      error: null,
    });
    useDeploymentLogs.mockReturnValue({ logs: [], isLoading: false });

    render(<DeploymentDetails />);
    expect(screen.getByText(/cancelled/i)).toBeInTheDocument();
  });
});
