import { useState, useEffect, useCallback } from 'react';
import {
  getDashboardStats,
  getRecentDeployments,
  getRecentUsers,
  getPlatformHealth,
  getActivity,
  getDeploymentTrend,
  getUserGrowth,
} from '../services/admin.service';

export function useAdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('7d'); // '24h', '7d', '30d', 'all'
  
  const [data, setData] = useState({
    stats: null,
    deployments: [],
    users: [],
    health: [],
    activity: [],
    trend: [],
    growth: [],
  });

  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const [
        statsData,
        deploymentsData,
        usersData,
        healthData,
        activityData,
        trendData,
        growthData,
      ] = await Promise.all([
        getDashboardStats(dateRange),
        getRecentDeployments(dateRange),
        getRecentUsers(dateRange),
        getPlatformHealth(),
        getActivity(dateRange),
        getDeploymentTrend(dateRange),
        getUserGrowth(dateRange),
      ]);

      setData({
        stats: statsData,
        deployments: deploymentsData,
        users: usersData,
        health: healthData,
        activity: activityData,
        trend: trendData,
        growth: growthData,
      });
    } catch (err) {
      console.error("Failed to load admin dashboard data:", err);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshData = () => {
    fetchData(true);
  };

  return {
    ...data,
    loading,
    refreshing,
    error,
    dateRange,
    setDateRange,
    refreshData,
  };
}
