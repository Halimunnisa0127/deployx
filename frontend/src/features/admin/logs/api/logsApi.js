import api from '../../../../lib/axios';

export const logsApi = {
  fetchLogs: async (params = {}) => {
    try {
      const response = await api.get('/admin/health/logs', { params });
      return response.data?.data?.logs || response.data?.data || [];
    } catch (error) {
      console.error('Failed to fetch platform logs:', error);
      return [];
    }
  },
};
