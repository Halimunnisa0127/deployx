const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getSystemOverview = async () => {
  await wait(500);
  return {
    healthScore: 98,
    uptime: 99.99,
    activeServices: 12,
    offlineServices: 0,
    warningServices: 1,
    maintenanceServices: 0,
    lastChecked: new Date().toISOString(),
  };
};

export const getInfrastructureStatus = async () => {
  await wait(600);
  return [
    {
      id: "srv-api",
      name: "API Server",
      status: "healthy",
      uptime: 99.9,
      lastCheck: new Date().toISOString(),
      type: "api",
      metrics: { cpu: 45, memory: 60 },
    },
    {
      id: "srv-db",
      name: "Database Cluster",
      status: "healthy",
      uptime: 100,
      lastCheck: new Date().toISOString(),
      type: "database",
      metrics: { cpu: 65, memory: 80 },
    },
    {
      id: "srv-docker",
      name: "Docker Engine",
      status: "warning",
      uptime: 98.5,
      lastCheck: new Date().toISOString(),
      type: "docker",
      metrics: { cpu: 85, memory: 90 },
    },
    {
      id: "srv-queue",
      name: "Queue Workers",
      status: "healthy",
      uptime: 99.8,
      lastCheck: new Date().toISOString(),
      type: "queue",
      metrics: { cpu: 30, memory: 40 },
    },
    {
      id: "srv-storage",
      name: "Storage Volume",
      status: "healthy",
      uptime: 100,
      lastCheck: new Date().toISOString(),
      type: "storage",
      metrics: { cpu: 10, memory: 20 },
    },
    {
      id: "srv-github",
      name: "GitHub Integration",
      status: "healthy",
      uptime: 99.5,
      lastCheck: new Date().toISOString(),
      type: "github",
      metrics: { cpu: 5, memory: 10 },
    },
  ];
};

export const getPerformanceMetrics = async () => {
  await wait(500);
  // Generate random trend data
  const generateTrend = (base, variance, points = 20) => {
    return Array.from({ length: points }).map((_, i) => {
      const now = new Date();
      now.setMinutes(now.getMinutes() - (points - i) * 5);
      return {
        time: now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        value: Math.max(
          0,
          Math.min(100, base + (Math.random() * variance * 2 - variance)),
        ),
      };
    });
  };

  return {
    cpu: { current: 45, trend: 2.5, data: generateTrend(45, 15) },
    memory: { current: 68, trend: -1.2, data: generateTrend(68, 10) },
    disk: { current: 72, trend: 0.1, data: generateTrend(72, 2) },
    network: { current: 85, trend: 15.4, data: generateTrend(60, 30) },
    connections: {
      current: 1250,
      trend: 120,
      data: generateTrend(1200, 200).map((d) => ({
        ...d,
        value: Math.floor(d.value * 25),
      })),
    },
    requests: {
      current: 4500,
      trend: 350,
      data: generateTrend(4000, 1000).map((d) => ({
        ...d,
        value: Math.floor(d.value * 80),
      })),
    },
  };
};

export const getIncidentTimeline = async () => {
  await wait(700);
  const now = new Date();
  const d1 = new Date(now);
  d1.setHours(d1.getHours() - 2);
  const d2 = new Date(now);
  d2.setDate(d2.getDate() - 1);
  const d3 = new Date(now);
  d3.setDate(d3.getDate() - 2);
  const d4 = new Date(now);
  d4.setDate(d4.getDate() - 5);

  return [
    {
      id: "inc-1",
      type: "alert",
      severity: "warning",
      service: "Docker Engine",
      description:
        "High memory usage detected on worker nodes. Auto-scaling triggered.",
      timestamp: d1.toISOString(),
      status: "resolved",
      duration: "45m",
    },
    {
      id: "inc-2",
      type: "outage",
      severity: "critical",
      service: "API Server",
      description: "API gateway timeout in eu-central-1 region.",
      timestamp: d2.toISOString(),
      status: "resolved",
      duration: "12m",
    },
    {
      id: "inc-3",
      type: "maintenance",
      severity: "info",
      service: "Database Cluster",
      description: "Scheduled index rebuilding and vacuum operations.",
      timestamp: d3.toISOString(),
      status: "completed",
      duration: "2h",
    },
    {
      id: "inc-4",
      type: "deployment",
      severity: "warning",
      service: "Queue Workers",
      description:
        "Deployment failed due to incompatible environment variables. Rolled back successfully.",
      timestamp: d4.toISOString(),
      status: "resolved",
      duration: "5m",
    },
  ];
};

export const getServiceDetails = async (serviceId) => {
  await wait(800);
  // Mock finding details based on id
  return {
    id: serviceId,
    name: serviceId.replace("srv-", "").toUpperCase(),
    status: serviceId === "srv-docker" ? "warning" : "healthy",
    version: "v2.14.5",
    environment: "Production",
    region: "us-east-1",
    host: "ip-10-0-1-45.ec2.internal",
    lastRestart: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    uptime: "14d 5h 22m",
    metrics: {
      cpu: Math.floor(Math.random() * 50) + 20,
      memory: Math.floor(Math.random() * 40) + 40,
      disk: Math.floor(Math.random() * 30) + 10,
      network: Math.floor(Math.random() * 1000) + 500,
      connections: Math.floor(Math.random() * 500) + 100,
      requestRate: Math.floor(Math.random() * 2000) + 500,
      responseTime: Math.floor(Math.random() * 150) + 50,
    },
    recentLogs: [
      {
        id: 1,
        level: "info",
        message: "Service check successful",
        time: new Date().toISOString(),
      },
      {
        id: 2,
        level: "warning",
        message: "Memory usage approaching threshold",
        time: new Date(Date.now() - 5 * 60000).toISOString(),
      },
      {
        id: 3,
        level: "info",
        message: "Garbage collection completed",
        time: new Date(Date.now() - 15 * 60000).toISOString(),
      },
    ],
    dependencies: ["Database", "Redis Cache", "S3 Storage"],
  };
};

export const restartService = async (serviceId) => {
  await wait(1500);
  return {
    success: true,
    message: `Service ${serviceId} restarted successfully.`,
  };
};

export const toggleMaintenanceMode = async (serviceId, enable) => {
  await wait(1000);
  return {
    success: true,
    message: `Maintenance mode ${enable ? "enabled" : "disabled"} for ${serviceId}.`,
  };
};

export const exportHealthReport = async () => {
  await wait(1200);
  return { success: true, url: "/downloads/system_health_report.pdf" };
};
