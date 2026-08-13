import api from '../../../lib/axios';

export const deploymentsApi = {
  createDeployment: async (deploymentData) => {
    const response = await api.post('/deployments', deploymentData);
    return response.data;
  },

  getDeployments: async () => {
    const response = await api.get('/deployments');
    return response.data;
  },

  getProjectDeployments: async (projectId) => {
    const response = await api.get(`/deployments/project/${projectId}`);
    return response.data;
  },

  getDeploymentDetails: async (id) => {
    const response = await api.get(`/deployments/${id}`);
    return response.data;
  },

  cancelDeployment: async (id) => {
    const response = await api.post(`/deployments/${id}/cancel`);
    return response.data;
  },

  promoteDeployment: async (id) => {
    const response = await api.post(`/deployments/${id}/promote`);
    return response.data;
  },

  rollbackDeployment: async (id) => {
    const response = await api.post(`/deployments/${id}/rollback`);
    return response.data;
  },

  getDeploymentLogs: async (id, page = 1, limit = 100) => {
    const response = await api.get(`/deployments/${id}/logs`, { params: { page, limit } });
    return response.data;
  },

  getDeploymentHistory: async (projectId, page = 1, limit = 10) => {
    const response = await api.get(`/deployments/project/${projectId}/history`, { params: { page, limit } });
    return response.data;
  }
};
