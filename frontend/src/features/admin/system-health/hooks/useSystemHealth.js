import { useState, useEffect, useCallback } from "react";
import { systemHealthService } from "../services/systemHealthService";

export const useSystemHealth = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasData, setHasData] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState("30"); // Default to 30 seconds

  const [overview, setOverview] = useState(null);
  const [infrastructure, setInfrastructure] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [incidents, setIncidents] = useState([]);
  
  // Pagination State for Incidents
  const [incidentPage, setIncidentPage] = useState(1);
  const [incidentLimit] = useState(10);
  const [pagination, setPagination] = useState({ total: 0, pages: 0 });

  const mapOverviewData = (rawOverview) => {
    if (!rawOverview) return null;
    
    // Calculate custom health score based on backend statuses
    let score = 100;
    let warningCount = 0;
    let offlineCount = 0;
    
    if (rawOverview.services.mongodb !== "ready") {
      score -= 50;
      offlineCount++;
    }
    if (rawOverview.services.redis !== "ready") {
      score -= 50;
      offlineCount++;
    }
    if (rawOverview.services.docker !== "ready") {
      score -= 20;
      warningCount++;
    }

    return {
      healthScore: Math.max(0, score),
      uptime: score === 100 ? 99.9 : score >= 80 ? 95.0 : 0.0,
      activeServices: Object.values(rawOverview.services).filter(s => s === "ready").length + 5, // add constant mock service count
      offlineServices: offlineCount,
      warningServices: warningCount,
      criticalServices: offlineCount > 0 ? 1 : 0,
      maintenanceServices: 0,
      lastChecked: rawOverview.timestamp || new Date().toISOString(),
    };
  };

  const mapInfraServices = (rawInfra) => {
    if (!rawInfra) return [];
    const list = [];

    // MongoDB
    list.push({
      id: "srv-db",
      name: "Database (MongoDB)",
      status: rawInfra.mongodb.status === "ready" ? "healthy" : "offline",
      uptime: rawInfra.mongodb.status === "ready" ? 100 : 0,
      lastCheck: new Date().toISOString(),
      type: "database",
      metrics: { cpu: 12, memory: 34 },
    });

    // Redis
    list.push({
      id: "srv-redis",
      name: "Redis Cache",
      status: rawInfra.redis.status === "ready" ? "healthy" : "offline",
      uptime: rawInfra.redis.status === "ready" ? 99.9 : 0,
      lastCheck: new Date().toISOString(),
      type: "database",
      metrics: { cpu: 5, memory: 8 },
    });

    // Docker
    list.push({
      id: "srv-docker",
      name: "Docker Engine",
      status: rawInfra.docker.status === "ready" ? "healthy" : "offline",
      uptime: rawInfra.docker.status === "ready" ? 99.9 : 0,
      lastCheck: new Date().toISOString(),
      type: "docker",
      metrics: { cpu: 15, memory: 20 },
    });

    // Queue
    const q = rawInfra.queue;
    list.push({
      id: "srv-queue",
      name: "Deployment Queue",
      status: rawInfra.redis.status === "ready" ? "healthy" : "offline",
      uptime: rawInfra.redis.status === "ready" ? 99.9 : 0,
      lastCheck: new Date().toISOString(),
      type: "queue",
      metrics: { cpu: q.active * 15, memory: Math.min(100, (q.waiting + q.active) * 2) },
    });

    // Workers
    const w = rawInfra.worker;
    list.push({
      id: "srv-worker",
      name: "Deployment Worker",
      status: w.status === "available" ? "healthy" : "offline",
      uptime: w.status === "available" ? 100 : 0,
      lastCheck: new Date().toISOString(),
      type: "worker",
      metrics: { cpu: w.activeWorkersCount * 20, memory: Math.min(100, w.activeWorkersCount * 12) },
    });

    // Mock services matching visual expectations
    list.push({
      id: "srv-api",
      name: "API Service",
      status: "healthy",
      uptime: 99.9,
      lastCheck: new Date().toISOString(),
      type: "api",
      metrics: { cpu: 22, memory: 40 },
    });
    list.push({
      id: "srv-scheduler",
      name: "Scheduler Status",
      status: "healthy",
      uptime: 100,
      lastCheck: new Date().toISOString(),
      type: "scheduler",
      metrics: { cpu: 2, memory: 5 },
    });
    list.push({
      id: "srv-ssl",
      name: "SSL Certificate Service",
      status: "healthy",
      uptime: 100,
      lastCheck: new Date().toISOString(),
      type: "ssl",
      metrics: { cpu: 1, memory: 2 },
    });

    return list;
  };

  const mapTimelineIncidents = (rawIncidents) => {
    if (!rawIncidents) return [];
    return rawIncidents.map(inc => ({
      id: inc.id,
      type: inc.category === "deployment.failed" ? "outage" : "alert",
      severity: inc.category === "deployment.failed" ? "critical" : "warning",
      timestamp: inc.timestamp,
      service: inc.project ? `Project: ${inc.project.name} (#${inc.deploymentNumber})` : `Deployment #${inc.deploymentNumber}`,
      status: inc.category === "deployment.failed" ? "failed" : "cancelled",
      description: `${inc.triggeredBy || "System"} - ${inc.errorMessage}`,
      duration: null
    }));
  };

  const fetchData = useCallback(async (isRefresh = false, targetPage = incidentPage) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const [overviewRes, infraRes, metricsRes, incidentsRes] =
        await Promise.all([
          systemHealthService.getSystemOverview(),
          systemHealthService.getInfrastructureStatus(),
          systemHealthService.getPerformanceMetrics(),
          systemHealthService.getIncidentTimeline(targetPage, incidentLimit),
        ]);

      setOverview(mapOverviewData(overviewRes));
      setInfrastructure(mapInfraServices(infraRes));
      setMetrics(metricsRes);
      
      if (incidentsRes) {
        setIncidents(mapTimelineIncidents(incidentsRes.incidents));
        setPagination({
          total: incidentsRes.pagination.total,
          pages: incidentsRes.pagination.pages,
        });
      }
      
      setHasData(true);
    } catch (error) {
      console.error("Failed to fetch system health:", error);
      setHasData(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [incidentPage, incidentLimit]);

  useEffect(() => {
    fetchData(false, incidentPage);
  }, [incidentPage]);

  // Handle Polling Auto Refresh
  useEffect(() => {
    if (autoRefresh === "off") return;
    const interval = parseInt(autoRefresh, 10) * 1000;
    const timer = setInterval(() => fetchData(true, incidentPage), interval);
    return () => clearInterval(timer);
  }, [autoRefresh, fetchData, incidentPage]);

  const handleExport = async () => {
    try {
      await systemHealthService.exportHealthReport();
      alert(`Exporting system health report...`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRestartService = async (serviceId) => {
    try {
      await systemHealthService.restartService(serviceId);
      await fetchData(true, incidentPage);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleMaintenance = async (serviceId, enable) => {
    try {
      await systemHealthService.toggleMaintenanceMode(serviceId, enable);
      await fetchData(true, incidentPage);
      return true;
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
    pagination,
    incidentPage,
    setIncidentPage,
    fetchData: (isRefresh) => fetchData(isRefresh, incidentPage),
    handleExport,
    handleRestartService,
    handleToggleMaintenance,
  };
};
