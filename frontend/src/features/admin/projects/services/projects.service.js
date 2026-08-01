const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let mockProjects = [
  {
    id: "prj_1",
    name: "ecommerce-frontend",
    owner: "Alice Smith",
    framework: "Next.js",
    environment: "production",
    status: "active",
    region: "us-east-1",
    createdAt: "2025-01-10T10:00:00Z",
    updatedAt: "2026-07-25T14:30:00Z",
    latestDeployment: "dep_102",
    connectedDomain: "shop.deployx.dev",
    repository: "github.com/alicesmith/ecommerce-frontend",
    envVarsCount: 15,
  },
  {
    id: "prj_2",
    name: "auth-api",
    owner: "Alice Smith",
    framework: "Node.js",
    environment: "production",
    status: "failed",
    region: "us-west-2",
    createdAt: "2025-02-15T09:20:00Z",
    updatedAt: "2026-07-26T08:15:00Z",
    latestDeployment: "dep_098",
    connectedDomain: "auth.deployx.dev",
    repository: "github.com/alicesmith/auth-api",
    envVarsCount: 8,
  },
  {
    id: "prj_3",
    name: "admin-dashboard",
    owner: "Diana Prince",
    framework: "React",
    environment: "staging",
    status: "active",
    region: "eu-central-1",
    createdAt: "2026-01-20T11:45:00Z",
    updatedAt: "2026-07-27T10:05:00Z",
    latestDeployment: "dep_075",
    connectedDomain: "admin-staging.deployx.dev",
    repository: "github.com/dianaprince/admin-dashboard",
    envVarsCount: 12,
  },
  {
    id: "prj_4",
    name: "legacy-app",
    owner: "Bob Jones",
    framework: "React",
    environment: "production",
    status: "archived",
    region: "us-east-1",
    createdAt: "2024-05-10T08:30:00Z",
    updatedAt: "2025-12-15T16:20:00Z",
    latestDeployment: "dep_010",
    connectedDomain: "old-app.deployx.dev",
    repository: "github.com/bobjones/legacy-app",
    envVarsCount: 4,
  },
  {
    id: "prj_5",
    name: "marketing-site",
    owner: "Fiona Gallagher",
    framework: "Next.js",
    environment: "production",
    status: "active",
    region: "ap-southeast-1",
    createdAt: "2026-03-05T13:10:00Z",
    updatedAt: "2026-07-20T09:40:00Z",
    latestDeployment: "dep_115",
    connectedDomain: "marketing.deployx.dev",
    repository: "github.com/fionagallagher/marketing-site",
    envVarsCount: 6,
  },
];

export const getProjects = async () => {
  await wait(600);
  return [...mockProjects];
};

export const getProject = async (id) => {
  await wait(400);
  const project = mockProjects.find((p) => p.id === id);
  if (!project) throw new Error("Project not found");
  return { ...project };
};

export const archiveProject = async (id) => {
  await wait(700);
  mockProjects = mockProjects.map((project) =>
    project.id === id ? { ...project, status: "archived" } : project,
  );
  return mockProjects.find((p) => p.id === id);
};

export const deleteProject = async (id) => {
  await wait(800);
  mockProjects = mockProjects.filter((project) => project.id !== id);
  return { success: true };
};

export const exportProjects = async () => {
  await wait(1000);
  // Simulating CSV generation and download
  return { success: true, message: "Exported projects.csv successfully" };
};
