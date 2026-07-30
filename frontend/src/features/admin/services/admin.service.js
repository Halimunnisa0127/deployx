// Mock data for Admin Dashboard

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getDashboardStats = async () => {
  await wait(800);
  return {
    totalUsers: { value: 12450, change: 12.5 },
    totalProjects: { value: 3840, change: 8.2 },
    totalDeployments: { value: 45200, change: 24.1 },
    activeDomains: { value: 890, change: 5.4 },
    activeServers: { value: 42, change: 0 },
    platformUptime: { value: 99.99, change: 0.01 },
  };
};

export const getRecentDeployments = async () => {
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

export const getRecentUsers = async () => {
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

export const getPlatformHealth = async () => {
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

export const getActivity = async () => {
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

export const getDeploymentTrend = async () => {
  await wait(300);
  return [
    { date: "Mon", deployments: 120 },
    { date: "Tue", deployments: 145 },
    { date: "Wed", deployments: 160 },
    { date: "Thu", deployments: 130 },
    { date: "Fri", deployments: 190 },
    { date: "Sat", deployments: 210 },
    { date: "Sun", deployments: 180 },
  ];
};

export const getUserGrowth = async () => {
  await wait(300);
  return [
    { date: "Week 1", users: 11000 },
    { date: "Week 2", users: 11500 },
    { date: "Week 3", users: 11900 },
    { date: "Week 4", users: 12450 },
  ];
};
