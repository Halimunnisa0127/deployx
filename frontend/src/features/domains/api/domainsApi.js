import api from '../../../lib/axios';

export const domainsApi = {
  createDomain: async (projectId, hostname) => {
    const response = await api.post('/domains', { projectId, hostname });
    return response.data;
  },

  getProjectDomains: async (projectId) => {
    const response = await api.get(`/domains/project/${projectId}`);
    return response.data;
  },

  getDomain: async (id) => {
    const response = await api.get(`/domains/${id}`);
    return response.data;
  },

  verifyDomain: async (id) => {
    const response = await api.post(`/domains/${id}/verify`);
    return response.data;
  },

  getDomainInstructions: async (id) => {
    const response = await api.get(`/domains/${id}/instructions`);
    return response.data;
  },

  updateDomainTarget: async (id, targetType, targetDeployment) => {
    const response = await api.patch(`/domains/${id}/target`, { targetType, targetDeployment });
    return response.data;
  },

  deleteDomain: async (id) => {
    const response = await api.delete(`/domains/${id}`);
    return response.data;
  }
};
