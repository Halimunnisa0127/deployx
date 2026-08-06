import {
  fetchDashboardStats,
  fetchRecentDeployments,
  fetchRecentUsers,
  fetchPlatformHealth,
  fetchActivity,
  fetchDeploymentTrend,
  fetchUserGrowth,
} from '../api/admin.api';

export const getDashboardStats = async (dateRange = '7d') => {
  return await fetchDashboardStats(dateRange);
};

export const getRecentDeployments = async (dateRange = '7d') => {
  return await fetchRecentDeployments(dateRange);
};

export const getRecentUsers = async (dateRange = '7d') => {
  return await fetchRecentUsers(dateRange);
};

export const getPlatformHealth = async (dateRange = '7d') => {
  return await fetchPlatformHealth(dateRange);
};

export const getActivity = async (dateRange = '7d') => {
  return await fetchActivity(dateRange);
};

export const getDeploymentTrend = async (dateRange = '7d') => {
  return await fetchDeploymentTrend(dateRange);
};

export const getUserGrowth = async (dateRange = '7d') => {
  return await fetchUserGrowth(dateRange);
};
