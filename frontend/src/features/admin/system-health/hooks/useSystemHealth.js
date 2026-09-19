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
    const services = rawOverview.services || {};
    
    // Calculate custom health score based on backend statuses
    let score = 100;
    let warningCount = 0;
    let offlineCount = 0;
    
    if (services.mongodb !== "ready") {
      score -= 50;
      offlineCount++;
    }
    if (services.redis !== "ready") {
      score -= 50;
      offlineCount++;
    }
    if (services.docker !== "ready") {
      score -= 20;
      warningCount++;
    }

    return {
      healthScore: Math.max(0, score),
      uptime: score === 100 ? 99.9 : score >= 80 ? 95.0 : 0.0,
      activeServices: Object.values(services).filter(s => s === "ready").length,
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
    const mongoStatus = rawInfra.mongodb?.status === "ready" ? "healthy" : "offline";
    list.push({
      id: "srv-db",
      name: "Database (MongoDB)",
      status: mongoStatus,
      uptime: mongoStatus === "healthy" ? 100 : 0,
      lastCheck: new Date().toISOString(),
      type: "database",
      metrics: { cpu: 12, memory: 34 },
    });

    // Redis
    const redisStatus = rawInfra.redis?.status === "ready" ? "healthy" : "offline";
    list.push({
      id: "srv-redis",
      name: "Redis Cache",
      status: redisStatus,
      uptime: redisStatus === "healthy" ? 99.9 : 0,
      lastCheck: new Date().toISOString(),
      type: "database",
      metrics: { cpu: 5, memory: 8 },
    });

    // Docker
    const dockerStatus = rawInfra.docker?.status === "ready" ? "healthy" : "offline";
    list.push({
      id: "srv-docker",
      name: "Docker Engine",
      status: dockerStatus,
      uptime: dockerStatus === "healthy" ? 99.9 : 0,
      lastCheck: new Date().toISOString(),
      type: "docker",
      metrics: { cpu: 15, memory: 20 },
    });

    // Queue
    const q = rawInfra.queue || { active: 0, waiting: 0 };
    list.push({
      id: "srv-queue",
      name: "Deployment Queue",
      status: redisStatus,
      uptime: redisStatus === "healthy" ? 99.9 : 0,
      lastCheck: new Date().toISOString(),
      type: "queue",
      metrics: { cpu: (q.active || 0) * 15, memory: Math.min(100, ((q.waiting || 0) + (q.active || 0)) * 2) },
    });

    // Workers
    const w = rawInfra.worker || { status: 'offline', activeWorkersCount: 0 };
    const workerStatus = w.status === "available" ? "healthy" : "offline";
    list.push({
      id: "srv-worker",
      name: "Deployment Worker",
      status: workerStatus,
      uptime: workerStatus === "healthy" ? 100 : 0,
      lastCheck: new Date().toISOString(),
      type: "worker",
      metrics: { cpu: (w.activeWorkersCount || 0) * 20, memory: Math.min(100, (w.activeWorkersCount || 0) * 12) },
    });

    // API Service (Express Backend)
    list.push({
      id: "srv-api",
      name: "Backend API Service",
      status: "healthy",
      uptime: 99.9,
      lastCheck: new Date().toISOString(),
      type: "api",
      metrics: { cpu: 5, memory: 15 },
    });

    // Storage / Disk
    if (rawInfra.disk) {
      const diskHealthy = rawInfra.disk.status !== "critical";
      list.push({
        id: "srv-disk",
        name: "Artifact Storage",
        status: diskHealthy ? "healthy" : "offline",
        uptime: diskHealthy ? 100 : 0,
        lastCheck: new Date().toISOString(),
        type: "storage",
        metrics: { cpu: 0, memory: rawInfra.disk.usagePercent || 0 },
      });
    }

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
    let ignore = false;
    Promise.all([
      systemHealthService.getSystemOverview(),
      systemHealthService.getInfrastructureStatus(),
      systemHealthService.getPerformanceMetrics(),
      systemHealthService.getIncidentTimeline(incidentPage, incidentLimit),
    ])
      .then(([overviewRes, infraRes, metricsRes, incidentsRes]) => {
        if (!ignore) {
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
          setLoading(false);
        }
      })
      .catch((error) => {
        if (!ignore) {
          console.error("Failed to fetch system health:", error);
          setHasData(false);
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, [incidentPage, incidentLimit]);

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
      alert(err.message || "System health report export is currently unavailable.");
    }
  };

  const handleRestartService = async (serviceId) => {
    try {
      await systemHealthService.restartService(serviceId);
      await fetchData(true, incidentPage);
    } catch (err) {
      console.error(err);
      alert(err.message || "Restarting services is currently unavailable in this environment.");
    }
  };

  const handleToggleMaintenance = async (serviceId, enable) => {
    try {
      await systemHealthService.toggleMaintenanceMode(serviceId, enable);
      await fetchData(true, incidentPage);
      return true;
    } catch (err) {
      console.error(err);
      alert(err.message || "Maintenance mode control is unsupported on this platform.");
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
