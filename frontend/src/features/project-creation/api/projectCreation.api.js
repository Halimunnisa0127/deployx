import api from '../../../lib/axios';

/**
 * Step 1: Check Project Name Availability & Generate Domain Preview URL
 * @param {string} name
 */
export const checkProjectNameApi = async (name) => {
  const response = await api.post('/projects/check-name', { name });
  return response.data;
};

/**
 * Create Project (Final Wizard Step 6 Submission)
 * @param {Object} projectData
 */
export const createProjectApi = async (projectData) => {
  const response = await api.post('/projects', projectData);
  return response.data;
};

/**
 * Get All User Projects
 */
export const fetchProjectsApi = async () => {
  const response = await api.get('/projects');
  return response.data;
};

/**
 * Get Framework Presets
 */
export const getFrameworkPresetsApi = async () => {
  const response = await api.get('/projects/framework-presets');
  return response.data;
};
