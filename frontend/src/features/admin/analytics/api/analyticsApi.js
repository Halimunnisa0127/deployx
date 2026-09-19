import api from '../../../../lib/axios';

const parseDays = (dateRange) => {
  if (!dateRange) return 30;
  if (dateRange === 'today' || dateRange === '24h' || dateRange === 1) return '24h';
  if (dateRange === '7d' || dateRange === 7) return 7;
  if (dateRange === '30d' || dateRange === 30) return 30;
  if (dateRange === '90d' || dateRange === 90) return 90;
  if (dateRange === 'this_month') return Math.max(1, new Date().getDate());
  if (dateRange === 'last_month') return 30;
  if (dateRange === 'all') return 'all';
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

  getRegionDistribution: async (dateRange = '30d') => {
    const days = parseDays(dateRange);
    const response = await api.get('/admin/health/regions', { params: { days } });
    return response.data?.data || response.data || [];
  },

  getTopProjects: async (limit = 5, dateRange = '30d') => {
    const days = parseDays(dateRange);
    const response = await api.get('/admin/health/top-projects', { params: { limit, days } });
    return response.data?.data || response.data || [];
  },

  getTopUsers: async (limit = 5, dateRange = '30d') => {
    const days = parseDays(dateRange);
    const response = await api.get('/admin/health/top-users', { params: { limit, days } });
    return response.data?.data || response.data || [];
  },

  exportReport: async (format = 'pdf') => {
    return { success: true, message: `Exporting ${format.toUpperCase()} report...` };
  },
};
