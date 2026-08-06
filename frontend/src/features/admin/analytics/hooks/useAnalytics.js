import { useState, useEffect, useCallback } from "react";
import { analyticsService } from "../services/analyticsService";

export function useAnalytics(initialDateRange = "30d") {
  const [dateRange, setDateRange] = useState(initialDateRange);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasData, setHasData] = useState(true);

  // Data states
  const [kpiData, setKpiData] = useState(null);
  const [deploymentTrend, setDeploymentTrend] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [projectGrowth, setProjectGrowth] = useState([]);
  const [frameworks, setFrameworks] = useState([]);
  const [regions, setRegions] = useState([]);
  const [topProjects, setTopProjects] = useState([]);
  const [topUsers, setTopUsers] = useState([]);

  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const [
        kpiRes,
        trendRes,
        usersRes,
        projRes,
        frameRes,
        regRes,
        topProjRes,
        topUsersRes,
      ] = await Promise.all([
        analyticsService.getDashboardAnalytics(dateRange),
        analyticsService.getDeploymentTrend(dateRange),
        analyticsService.getUserGrowth(dateRange),
        analyticsService.getProjectGrowth(dateRange),
        analyticsService.getFrameworkDistribution(),
        analyticsService.getRegionDistribution(),
        analyticsService.getTopProjects(),
        analyticsService.getTopUsers(),
      ]);

      setKpiData(kpiRes);
      setDeploymentTrend(trendRes);
      setUserGrowth(usersRes);
      setProjectGrowth(projRes);
      setFrameworks(frameRes);
      setRegions(regRes);
      setTopProjects(topProjRes);
      setTopUsers(topUsersRes);
      setHasData(true);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      setHasData(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleExport = async (format = "pdf") => {
    try {
      await analyticsService.exportReport(format);
      alert(`Exporting ${format.toUpperCase()} report...`);
    } catch (err) {
      console.error(err);
    }
  };

  return {
    dateRange,
    setDateRange,
    loading,
    refreshing,
    hasData,
    kpiData,
    deploymentTrend,
    userGrowth,
    projectGrowth,
    frameworks,
    regions,
    topProjects,
    topUsers,
    fetchData,
    handleExport,
  };
}
