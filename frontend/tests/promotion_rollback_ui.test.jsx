import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import ProjectDeploymentsTab from '../src/features/projects/components/ProjectDeploymentsTab';
import { useDeploymentMutations } from '../src/features/deployments/hooks/useDeploymentMutations';
import { deploymentsApi } from '../src/features/deployments/api/deploymentsApi';

vi.mock('../src/features/deployments/hooks/useDeploymentMutations');
vi.mock('../src/features/deployments/api/deploymentsApi', () => ({
  deploymentsApi: {
    getDeploymentHistory: vi.fn(),
  },
}));

describe('Promotion and Rollback UI component tests', () => {
  const mockProject = { _id: 'proj-1', id: 'proj-1', name: 'My Project' };
  const mockDeployments = [
    {
      id: 'dep-101',
      status: 'ready',
      environment: 'Production',
      branch: 'main',
      time: '10 mins ago',
      commit: 'First commit',
      hash: 'abcde'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useDeploymentMutations.mockReturnValue({
      promoteDeployment: vi.fn(),
      cancelDeployment: vi.fn(),
      isCreating: false,
      isCancelling: false
    });
  });

  test('ready deployment displays promote button and clicking it calls promote API', async () => {
    const promoteSpy = vi.fn().mockResolvedValue({});
    useDeploymentMutations.mockReturnValue({
      promoteDeployment: promoteSpy
    });
    deploymentsApi.getDeploymentHistory.mockResolvedValue({
      data: { history: [] }
    });

    render(
      <ProjectDeploymentsTab
        project={mockProject}
        deployments={mockDeployments}
      />
    );

    const promoteButton = screen.getByRole('button', { name: /promote/i });
    expect(promoteButton).toBeInTheDocument();

    fireEvent.click(promoteButton);

    expect(promoteSpy).toHaveBeenCalledWith('dep-101');
  });

  test('renders promotion history items successfully', async () => {
    const mockHistory = [
      {
        _id: 'hist-1',
        action: 'promote',
        previousDeployment: null,
        deployment: { deploymentNumber: 1, _id: 'dep-101' },
        actor: { name: 'John Doe' },
        createdAt: '2026-08-12T10:00:00Z'
      }
    ];

    deploymentsApi.getDeploymentHistory.mockResolvedValue({
      data: { history: mockHistory }
    });

    render(
      <ProjectDeploymentsTab
        project={mockProject}
        deployments={mockDeployments}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('PROMOTE')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});
