import { useState, useEffect, useCallback } from "react";
import { systemHealthService } from "../services/systemHealthService";

export const useSystemHealth = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasData, setHasData] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState("off");

  const [overview, setOverview] = useState(null);
  const [infrastructure, setInfrastructure] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [incidents, setIncidents] = useState([]);

  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const [overviewRes, infraRes, metricsRes, incidentsRes] =
        await Promise.all([
          systemHealthService.getSystemOverview(),
          systemHealthService.getInfrastructureStatus(),
          systemHealthService.getPerformanceMetrics(),
          systemHealthService.getIncidentTimeline(),
        ]);

      setOverview(overviewRes);
      setInfrastructure(infraRes);
      setMetrics(metricsRes);
      setIncidents(incidentsRes);
      setHasData(true);
    } catch (error) {
      console.error("Failed to fetch system health:", error);
      setHasData(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (autoRefresh === "off") return;
    const interval = parseInt(autoRefresh) * 1000;
    const timer = setInterval(() => fetchData(true), interval);
    return () => clearInterval(timer);
  }, [autoRefresh, fetchData]);

  const handleExport = async () => {
    try {
      await systemHealthService.exportHealthReport();
      // Use standard alert since it was in the original component
      alert(`Exporting system health report...`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRestartService = async (serviceId) => {
    try {
      await systemHealthService.restartService(serviceId);
      await fetchData(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleMaintenance = async (serviceId, enable) => {
    try {
      await systemHealthService.toggleMaintenanceMode(serviceId, enable);
      await fetchData(true);
      return true; // Indicate success for the UI to close drawers etc
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return {
    loading,
    refreshing,
    hasData,
    autoRefresh,
    setAutoRefresh,
    overview,
    infrastructure,
    metrics,
    incidents,
    fetchData,
    handleExport,
    handleRestartService,
    handleToggleMaintenance,
  };
};
