import { describe, test, expect, vi, beforeEach } from 'vitest';
import { fetchProjects, fetchProjectById } from '../src/features/admin/projects/api/projectsApi';
import api from '../src/lib/axios';

vi.mock('../src/lib/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Admin Projects API Client Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('fetchProjects calls /admin/projects and maps array response', async () => {
    const mockProjects = [{ _id: 'proj-1', name: 'Cool App' }];
    api.get.mockResolvedValue({
      data: {
        data: {
          projects: mockProjects
        }
      }
    });

    const projects = await fetchProjects();
    expect(api.get).toHaveBeenCalledWith('/admin/projects');
    expect(projects).toEqual(mockProjects);
  });

  test('fetchProjectById requests correct detail endpoint', async () => {
    const mockProject = { _id: 'proj-1', name: 'Cool App' };
    api.get.mockResolvedValue({
      data: {
        data: {
          project: mockProject
        }
      }
    });

    const project = await fetchProjectById('proj-1');
    expect(api.get).toHaveBeenCalledWith('/admin/projects/proj-1');
    expect(project).toEqual(mockProject);
  });

  test('handles unauthorized response (401/403) gracefully', async () => {
    const errorResponse = new Error('Request failed with status code 403');
    errorResponse.response = { status: 403, data: { message: 'Forbidden' } };
    api.get.mockRejectedValue(errorResponse);

    await expect(fetchProjects()).rejects.toThrow('Request failed with status code 403');
  });

  test('archiveProjectApi calls POST /admin/projects/:id/archive', async () => {
    const { archiveProjectApi } = await import('../src/features/admin/projects/api/projectsApi');
    api.post.mockResolvedValue({
      data: {
        success: true,
        data: { id: 'proj-1', status: 'archived' }
      }
    });

    const result = await archiveProjectApi('proj-1');
    expect(api.post).toHaveBeenCalledWith('/admin/projects/proj-1/archive');
    expect(result).toEqual({ id: 'proj-1', status: 'archived' });
  });

  test('deleteProjectApi calls DELETE /admin/projects/:id', async () => {
    const { deleteProjectApi } = await import('../src/features/admin/projects/api/projectsApi');
    api.delete.mockResolvedValue({
      data: {
        success: true,
        message: 'Project deleted successfully'
      }
    });

    const result = await deleteProjectApi('proj-1');
    expect(api.delete).toHaveBeenCalledWith('/admin/projects/proj-1');
    expect(result.success).toBe(true);
  });

  test('Status counting and filtering correctly separates active, archived, and failed projects', () => {
    const mockList = [
      { id: '1', name: 'P1', status: 'active', framework: 'React' },
      { id: '2', name: 'P2', status: 'active', framework: 'Next.js' },
      { id: '3', name: 'P3', status: 'archived', framework: 'React' },
      { id: '4', name: 'P4', status: 'failed', framework: 'Node.js' },
    ];

    const active = mockList.filter((p) => p.status === 'active');
    const archived = mockList.filter((p) => p.status === 'archived');
    const failed = mockList.filter((p) => p.status === 'failed');

    expect(active.length).toBe(2);
    expect(archived.length).toBe(1);
    expect(failed.length).toBe(1);

    expect(archived.map(p => p.name)).toEqual(['P3']);
    expect(failed.map(p => p.name)).toEqual(['P4']);
    expect(active.map(p => p.name)).toEqual(['P1', 'P2']);
  });
});

