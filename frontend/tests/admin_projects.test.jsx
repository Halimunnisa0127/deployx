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
});
