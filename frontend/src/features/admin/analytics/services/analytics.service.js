const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getDashboardAnalytics = async (dateRange) => {
  await wait(600);
  return {
    totalDeployments: { value: 12450, trend: 15.2 },
    successRate: { value: 98.5, trend: 0.5 },
    activeUsers: { value: 3420, trend: 12.4 },
    activeProjects: { value: 856, trend: 5.1 },
    storageUsage: { value: "2.4 TB", trend: 8.4 },
    bandwidthUsage: { value: "15.8 TB", trend: -2.1 },
  };
};

export const getDeploymentTrend = async (dateRange) => {
  await wait(400);
  const data = [];
  const now = new Date();
  for (let i = 14; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    data.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      deployments: Math.floor(Math.random() * 500) + 100,
      failures: Math.floor(Math.random() * 20),
    });
  }
  return data;
};

export const getUserGrowth = async (dateRange) => {
  await wait(400);
  const data = [];
  const now = new Date();
  let baseUsers = 12000;
  for (let i = 30; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    baseUsers += Math.floor(Math.random() * 50) + 10;
    data.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      users: baseUsers,
      active: Math.floor(baseUsers * (0.2 + Math.random() * 0.1)),
    });
  }
  return data;
};

export const getProjectGrowth = async (dateRange) => {
  await wait(400);
  return [
    { month: "Jan", projects: 120 },
    { month: "Feb", projects: 145 },
    { month: "Mar", projects: 180 },
    { month: "Apr", projects: 220 },
    { month: "May", projects: 280 },
    { month: "Jun", projects: 350 },
    { month: "Jul", projects: 410 },
  ];
};

export const getFrameworkDistribution = async () => {
  await wait(400);
  return [
    { name: "React", value: 45 },
    { name: "Next.js", value: 30 },
    { name: "Vue", value: 15 },
    { name: "Node.js", value: 7 },
    { name: "Angular", value: 3 },
  ];
};

export const getRegionDistribution = async () => {
  await wait(400);
  return [
    { region: "North America", percentage: 42, deployments: 5200 },
    { region: "Europe", percentage: 35, deployments: 4300 },
    { region: "Asia", percentage: 15, deployments: 1800 },
    { region: "South America", percentage: 5, deployments: 600 },
    { region: "Australia", percentage: 3, deployments: 350 },
  ];
};

export const getTopProjects = async () => {
  await wait(500);
  return [
    {
      id: "1",
      name: "ecommerce-platform",
      deployments: 1250,
      successRate: 99.2,
      owner: "Alice Smith",
    },
    {
      id: "2",
      name: "marketing-site",
      deployments: 850,
      successRate: 97.5,
      owner: "Fiona Gallagher",
    },
    {
      id: "3",
      name: "internal-dashboard",
      deployments: 620,
      successRate: 98.8,
      owner: "Diana Prince",
    },
    {
      id: "4",
      name: "auth-service",
      deployments: 410,
      successRate: 99.9,
      owner: "Alice Smith",
    },
    {
      id: "5",
      name: "blog-frontend",
      deployments: 380,
      successRate: 96.4,
      owner: "Bob Jones",
    },
  ];
};

export const getTopUsers = async () => {
  await wait(500);
  return [
    {
      id: "u1",
      name: "Alice Smith",
      projects: 12,
      deployments: 850,
      score: 98,
    },
    {
      id: "u2",
      name: "Diana Prince",
      projects: 8,
      deployments: 620,
      score: 92,
    },
    {
      id: "u3",
      name: "Fiona Gallagher",
      projects: 5,
      deployments: 450,
      score: 85,
    },
    { id: "u4", name: "Bob Jones", projects: 6, deployments: 380, score: 78 },
    {
      id: "u5",
      name: "Charlie Davis",
      projects: 3,
      deployments: 210,
      score: 65,
    },
  ];
};

export const exportReport = async (format) => {
  await wait(1200);
  return { success: true, url: `/downloads/analytics_report.${format}` };
};
