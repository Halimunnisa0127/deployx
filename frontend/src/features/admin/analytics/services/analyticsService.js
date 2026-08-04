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
  getRegionDistribution: async () => {
    return analyticsApi.getRegionDistribution();
  },
  getTopProjects: async () => {
    return analyticsApi.getTopProjects();
  },
  getTopUsers: async () => {
    return analyticsApi.getTopUsers();
  },
  exportReport: async (format) => {
    return analyticsApi.exportReport(format);
  },
};
