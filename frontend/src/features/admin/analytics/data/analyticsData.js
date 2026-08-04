export const generateDeploymentTrend = (days = 15) => {
  const data = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
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

export const generateUserGrowth = (days = 31) => {
  const data = [];
  const now = new Date();
  let baseUsers = 12000;
  for (let i = days - 1; i >= 0; i--) {
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

export const analyticsMockData = {
  kpi: {
    totalDeployments: { value: 12450, trend: 15.2, previous: 10800 },
    successRate: { value: 98.5, trend: 0.5, previous: 98.0 },
    failureRate: { value: 1.5, trend: -0.5, previous: 2.0 },
    deploymentDuration: { value: "45s", trend: -12.4, previous: "52s" },
    activeUsers: { value: 3420, trend: 12.4, previous: 3040 },
    activeProjects: { value: 856, trend: 5.1, previous: 814 },
    storageUsage: { value: "2.4 TB", trend: 8.4, previous: "2.2 TB" },
    bandwidthUsage: { value: "15.8 TB", trend: -2.1, previous: "16.1 TB" },
  },
  projectGrowth: [
    { month: "Jan", projects: 120 },
    { month: "Feb", projects: 145 },
    { month: "Mar", projects: 180 },
    { month: "Apr", projects: 220 },
    { month: "May", projects: 280 },
    { month: "Jun", projects: 350 },
    { month: "Jul", projects: 410 },
  ],
  frameworkDistribution: [
    { name: "React", value: 45 },
    { name: "Next.js", value: 30 },
    { name: "Vue", value: 15 },
    { name: "Node.js", value: 7 },
    { name: "Angular", value: 3 },
  ],
  regionDistribution: [
    { region: "North America", percentage: 42, deployments: 5200 },
    { region: "Europe", percentage: 35, deployments: 4300 },
    { region: "Asia", percentage: 15, deployments: 1800 },
    { region: "South America", percentage: 5, deployments: 600 },
    { region: "Australia", percentage: 3, deployments: 350 },
  ],
  topProjects: [
    { id: "1", name: "ecommerce-platform", deployments: 1250, successRate: 99.2, owner: "Alice Smith" },
    { id: "2", name: "marketing-site", deployments: 850, successRate: 97.5, owner: "Fiona Gallagher" },
    { id: "3", name: "internal-dashboard", deployments: 620, successRate: 98.8, owner: "Diana Prince" },
    { id: "4", name: "auth-service", deployments: 410, successRate: 99.9, owner: "Alice Smith" },
    { id: "5", name: "blog-frontend", deployments: 380, successRate: 96.4, owner: "Bob Jones" },
  ],
  topUsers: [
    { id: "u1", name: "Alice Smith", projects: 12, deployments: 850, score: 98 },
    { id: "u2", name: "Diana Prince", projects: 8, deployments: 620, score: 92 },
    { id: "u3", name: "Fiona Gallagher", projects: 5, deployments: 450, score: 85 },
    { id: "u4", name: "Bob Jones", projects: 6, deployments: 380, score: 78 },
    { id: "u5", name: "Charlie Davis", projects: 3, deployments: 210, score: 65 },
  ]
};
