import api from '../../../../lib/axios';

const parseDays = (dateRange) => {
  if (!dateRange) return 30;
  const match = String(dateRange).match(/\d+/);
  return match ? parseInt(match[0], 10) : 30;
};

export const analyticsApi = {
  getDashboardAnalytics: async (dateRange = '30d') => {
    const days = parseDays(dateRange);
    const response = await api.get('/admin/health/analytics', { params: { days } });
    return response.data?.data || response.data;
  },

  getDeploymentTrend: async (dateRange = '15d') => {
    const days = parseDays(dateRange);
    const response = await api.get('/admin/health/deployment-trends', { params: { days } });
    return response.data?.data || response.data || [];
  },

  getUserGrowth: async (dateRange = '30d') => {
    const days = parseDays(dateRange);
    const response = await api.get('/admin/health/user-growth', { params: { days } });
    return response.data?.data || response.data || [];
  },

  getProjectGrowth: async () => {
    const response = await api.get('/admin/health/project-growth');
    return response.data?.data || response.data || [];
  },

  getFrameworkDistribution: async () => {
    const response = await api.get('/admin/health/frameworks');
    return response.data?.data || response.data || [];
  },

  getRegionDistribution: async () => {
    const response = await api.get('/admin/health/regions');
    return response.data?.data || response.data || [];
  },

  getTopProjects: async (limit = 5) => {
    const response = await api.get('/admin/health/top-projects', { params: { limit } });
    return response.data?.data || response.data || [];
  },

  getTopUsers: async (limit = 5) => {
    const response = await api.get('/admin/health/top-users', { params: { limit } });
    return response.data?.data || response.data || [];
  },

  exportReport: async (format = 'pdf') => {
    return { success: true, message: `Exporting ${format.toUpperCase()} report...` };
  },
};
