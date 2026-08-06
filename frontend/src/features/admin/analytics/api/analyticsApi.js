import { analyticsMockData, generateDeploymentTrend, generateUserGrowth } from "../data/analyticsData";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const analyticsApi = {
  getDashboardAnalytics: async (dateRange) => {
    await wait(600);
    return analyticsMockData.kpi;
  },
  getDeploymentTrend: async (dateRange) => {
    await wait(400);
    return generateDeploymentTrend(15);
  },
  getUserGrowth: async (dateRange) => {
    await wait(400);
    return generateUserGrowth(31);
  },
  getProjectGrowth: async (dateRange) => {
    await wait(400);
    return analyticsMockData.projectGrowth;
  },
  getFrameworkDistribution: async () => {
    await wait(400);
    return analyticsMockData.frameworkDistribution;
  },
  getRegionDistribution: async () => {
    await wait(400);
    return analyticsMockData.regionDistribution;
  },
  getTopProjects: async () => {
    await wait(500);
    return analyticsMockData.topProjects;
  },
  getTopUsers: async () => {
    await wait(500);
    return analyticsMockData.topUsers;
  },
  exportReport: async (format) => {
    await wait(1200);
    return { success: true, url: `/downloads/analytics_report.${format}` };
  },
};
