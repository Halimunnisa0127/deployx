import api from '../../../lib/axios';

/**
 * Get all projects
 */
export const fetchProjectsApi = async () => {
  const response = await api.get('/projects');
  return response.data;
};

/**
 * Get project by ID
 */
export const getProjectApi = async (id) => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

/**
 * Update project
 */
export const updateProjectApi = async (id, data) => {
  const response = await api.patch(`/projects/${id}`, data);
  return response.data;
};

/**
 * Delete project
 */
export const deleteProjectApi = async (id) => {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};
