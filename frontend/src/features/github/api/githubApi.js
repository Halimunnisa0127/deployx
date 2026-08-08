import api from '../../../lib/axios';

export const githubApi = {
  checkConnectionStatus: async () => {
    try {
      const response = await api.get('/integrations/github/status');
      // response.data.data contains { status, lastSyncedAt, username }
      return response.data?.data || null;
    } catch (error) {
      return null;
    }
  },

  getRepositories: async () => {
    const response = await api.get('/integrations/github/repositories');
    // The backend uses QueryBuilder which returns { data: [...], meta: {...} } inside the ApiResponse data field.
    return response.data?.data?.data || []; 
  },

  syncRepositories: async () => {
    const response = await api.post('/integrations/github/repositories/sync');
    return response.data?.data;
  },

  getBranches: async (owner, repo) => {
    const response = await api.get(`/integrations/github/repositories/${owner}/${repo}/branches`);
    return response.data?.data?.branches || [];
  },

  disconnect: async () => {
    const response = await api.delete('/integrations/github/disconnect');
    return response.data;
  }
};
