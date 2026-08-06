// Mock API data for Admin Dashboard

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchDashboardStats = async (dateRange = '7d') => {
  await wait(800);
  const multiplier = dateRange === '24h' ? 0.2 : dateRange === '30d' ? 3 : dateRange === 'all' ? 10 : 1;
  return {
    totalUsers: { value: Math.floor(12450 * multiplier), change: 12.5 },
    activeUsers: { value: Math.floor(2140 * multiplier), change: 4.1 },
    totalProjects: { value: Math.floor(3840 * multiplier), change: 8.2 },
    totalDeployments: { value: Math.floor(45200 * multiplier), change: 24.1 },
    activeDeployments: { value: Math.floor(34 * multiplier), change: 2.1 },
    failedDeployments: { value: Math.floor(12 * multiplier), change: -1.5 },
    pendingDeployments: { value: Math.floor(8 * multiplier), change: 0.5 },
    recentBuilds: { value: Math.floor(145 * multiplier), change: 15.2 },
    recentErrors: { value: Math.floor(24 * multiplier), change: -5.4 },
    activeDomains: { value: Math.floor(890 * multiplier), change: 5.4 },
    activeServers: { value: 42, change: 0 },
    platformUptime: { value: 99.99, change: 0.01 },
  };
};

export const fetchRecentDeployments = async (dateRange = '7d') => {
  await wait(600);
  return [
    {
      id: "dep_1",
      project: "ecommerce-frontend",
      status: "success",
      region: "us-east",
      duration: "45s",
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
      id: "dep_2",
      project: "auth-api",
      status: "building",
      region: "eu-west",
      duration: "1m 12s",
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: "dep_3",
      project: "admin-dashboard",
      status: "failed",
      region: "us-east",
      duration: "2m 04s",
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
      id: "dep_4",
      project: "payment-service",
      status: "success",
      region: "ap-south",
      duration: "32s",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: "dep_5",
      project: "blog-static",
      status: "success",
      region: "global",
      duration: "12s",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
  ];
};

export const fetchRecentUsers = async (dateRange = '7d') => {
  await wait(700);
  return [
    {
      id: "usr_1",
      name: "Alice Smith",
      email: "alice@example.com",
      role: "admin",
      status: "active",
      joinedAt: "2026-01-15",
    },
    {
      id: "usr_2",
      name: "Bob Jones",
      email: "bob@example.com",
      role: "developer",
      status: "active",
      joinedAt: "2026-03-22",
    },
    {
      id: "usr_3",
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "viewer",
      status: "suspended",
      joinedAt: "2025-11-10",
    },
    {
      id: "usr_4",
      name: "Diana Prince",
      email: "diana@example.com",
      role: "developer",
      status: "active",
      joinedAt: "2026-06-05",
    },
    {
      id: "usr_5",
      name: "Evan Wright",
      email: "evan@example.com",
      role: "admin",
      status: "pending",
      joinedAt: "2026-07-20",
    },
  ];
};

export const fetchPlatformHealth = async (dateRange = '7d') => {
  await wait(500);
  return [
    {
      id: "api",
      name: "API Server",
      status: "healthy",
      latency: "24ms",
      uptime: "99.99%",
      lastChecked: "1m ago",
    },
    {
      id: "db",
      name: "Database",
      status: "healthy",
      latency: "12ms",
      uptime: "99.95%",
      lastChecked: "1m ago",
    },
    {
      id: "queue",
      name: "Queue Workers",
      status: "warning",
      latency: "150ms",
      uptime: "98.50%",
      lastChecked: "2m ago",
    },
    {
      id: "docker",
      name: "Docker",
      status: "healthy",
      latency: "45ms",
      uptime: "99.90%",
      lastChecked: "1m ago",
    },
    {
      id: "storage",
      name: "Storage",
      status: "healthy",
      latency: "8ms",
      uptime: "100%",
      lastChecked: "5m ago",
    },
  ];
};

export const fetchActivity = async (dateRange = '7d') => {
  await wait(900);
  return [
    {
      id: "act_1",
      type: "deployment_started",
      title: "Deployment Started",
      description: "auth-api deployed to production",
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      user: "Alice Smith",
    },
    {
      id: "act_2",
      type: "user_created",
      title: "User Created",
      description: "Evan Wright joined the platform",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      user: "System",
    },
    {
      id: "act_3",
      type: "deployment_failed",
      title: "Deployment Failed",
      description: "admin-dashboard build failed",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      user: "Bob Jones",
    },
    {
      id: "act_4",
      type: "domain_verified",
      title: "Domain Verified",
      description: "example.com is now active",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      user: "Alice Smith",
    },
    {
      id: "act_5",
      type: "project_created",
      title: "Project Created",
      description: "ecommerce-frontend was created",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      user: "Charlie Brown",
    },
  ];
};

export const fetchDeploymentTrend = async (dateRange = '7d') => {
  await wait(300);
  const m = dateRange === '24h' ? 0.2 : dateRange === '30d' ? 3 : dateRange === 'all' ? 10 : 1;
  return [
    { date: "Mon", deployments: Math.floor(120 * m) },
    { date: "Tue", deployments: Math.floor(145 * m) },
    { date: "Wed", deployments: Math.floor(160 * m) },
    { date: "Thu", deployments: Math.floor(130 * m) },
    { date: "Fri", deployments: Math.floor(190 * m) },
    { date: "Sat", deployments: Math.floor(210 * m) },
    { date: "Sun", deployments: Math.floor(180 * m) },
  ];
};

export const fetchUserGrowth = async (dateRange = '7d') => {
  await wait(300);
  const m = dateRange === '24h' ? 0.2 : dateRange === '30d' ? 3 : dateRange === 'all' ? 10 : 1;
  return [
    { date: "Week 1", users: Math.floor(11000 * m) },
    { date: "Week 2", users: Math.floor(11500 * m) },
    { date: "Week 3", users: Math.floor(11900 * m) },
    { date: "Week 4", users: Math.floor(12450 * m) },
  ];
};
