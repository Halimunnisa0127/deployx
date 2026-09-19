import { analyticsApi } from "../api/analyticsApi";

export const analyticsService = {
  getDashboardAnalytics: async (dateRange) => {
    return analyticsApi.getDashboardAnalytics(dateRange);
  },
  getDeploymentTrend: async (dateRange) => {
    return analyticsApi.getDeploymentTrend(dateRange);
  },
  getUserGrowth: async (dateRange) => {
    return analyticsApi.getUserGrowth(dateRange);
  },
  getProjectGrowth: async (dateRange) => {
    return analyticsApi.getProjectGrowth(dateRange);
  },
  getFrameworkDistribution: async () => {
    return analyticsApi.getFrameworkDistribution();
  },
  getRegionDistribution: async (dateRange) => {
    return analyticsApi.getRegionDistribution(dateRange);
  },
  getTopProjects: async (limit = 5, dateRange) => {
    return analyticsApi.getTopProjects(limit, dateRange);
  },
  getTopUsers: async (limit = 5, dateRange) => {
    return analyticsApi.getTopUsers(limit, dateRange);
  },
  exportReport: async (format) => {
    return analyticsApi.exportReport(format);
  },
};
