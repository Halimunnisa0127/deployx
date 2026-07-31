const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let mockDeployments = [
  {
    id: "dep_102",
    project: "ecommerce-frontend",
    owner: "Alice Smith",
    framework: "Next.js",
    environment: "production",
    status: "success",
    region: "us-east-1",
    duration: "2m 15s",
    createdAt: "2026-07-29T10:00:00Z",
    triggeredBy: "GitHub Hook",
    latestCommit: "a1b2c3d",
    domain: "shop.deployx.dev",
    repository: "github.com/alicesmith/ecommerce-frontend",
  },
  {
    id: "dep_103",
    project: "auth-api",
    owner: "Alice Smith",
    framework: "Node.js",
    environment: "staging",
    status: "running",
    region: "us-west-2",
    duration: "1m 05s",
    createdAt: "2026-07-30T07:15:00Z",
    triggeredBy: "Manual Trigger",
    latestCommit: "e4f5g6h",
    domain: "auth-staging.deployx.dev",
    repository: "github.com/alicesmith/auth-api",
  },
  {
    id: "dep_104",
    project: "admin-dashboard",
    owner: "Diana Prince",
    framework: "React",
    environment: "production",
    status: "failed",
    region: "eu-central-1",
    duration: "3m 45s",
    createdAt: "2026-07-28T14:30:00Z",
    triggeredBy: "GitHub Hook",
    latestCommit: "j7k8l9m",
    domain: "admin.deployx.dev",
    repository: "github.com/dianaprince/admin-dashboard",
  },
  {
    id: "dep_105",
    project: "legacy-app",
    owner: "Bob Jones",
    framework: "React",
    environment: "preview",
    status: "queued",
    region: "us-east-1",
    duration: "-",
    createdAt: "2026-07-30T08:05:00Z",
    triggeredBy: "GitHub Hook",
    latestCommit: "n0p1q2r",
    domain: "pr-12-legacy.deployx.dev",
    repository: "github.com/bobjones/legacy-app",
  },
  {
    id: "dep_106",
    project: "marketing-site",
    owner: "Fiona Gallagher",
    framework: "Next.js",
    environment: "production",
    status: "cancelled",
    region: "ap-southeast-1",
    duration: "45s",
    createdAt: "2026-07-25T09:40:00Z",
    triggeredBy: "Manual Trigger",
    latestCommit: "s3t4u5v",
    domain: "marketing.deployx.dev",
    repository: "github.com/fionagallagher/marketing-site",
  },
];

export const getDeployments = async () => {
  await wait(600);
  return [...mockDeployments];
};

export const getDeployment = async (id) => {
  await wait(400);
  const deployment = mockDeployments.find((d) => d.id === id);
  if (!deployment) throw new Error("Deployment not found");
  return { ...deployment };
};

export const getDeploymentLogs = async (id) => {
  await wait(500);
  return `[10:00:00.000Z] Cloning repository github.com/user/repo...
[10:00:02.124Z] Cloned successfully.
[10:00:02.150Z] Installing dependencies using npm install...
[10:00:15.340Z] Dependencies installed.
[10:00:15.355Z] Running build command: npm run build
[10:01:05.100Z] Build completed successfully.
[10:01:06.000Z] Uploading build artifacts...
[10:01:10.500Z] Upload complete (14 MB).
[10:01:15.000Z] Deployment live at https://app.deployx.dev`;
};

export const getDeploymentTimeline = async (id) => {
  await wait(300);
  return [
    { step: "Queued", status: "completed", time: "10:00:00 AM" },
    { step: "Building", status: "completed", time: "10:00:02 AM" },
    { step: "Uploading", status: "completed", time: "10:01:06 AM" },
    { step: "Deploying", status: "completed", time: "10:01:10 AM" },
    { step: "Completed", status: "completed", time: "10:01:15 AM" },
  ];
};

export const getDeploymentArtifacts = async (id) => {
  await wait(300);
  return {
    buildSize: "14.2 MB",
    outputDirectory: ".next",
    staticAssets: "4.5 MB",
    serverBundle: "9.7 MB",
  };
};

export const redeployDeployment = async (id) => {
  await wait(800);
  return { success: true, message: "Redeployment triggered" };
};

export const cancelDeployment = async (id) => {
  await wait(500);
  mockDeployments = mockDeployments.map((d) =>
    d.id === id ? { ...d, status: "cancelled" } : d,
  );
  return { success: true };
};

export const deleteDeployment = async (id) => {
  await wait(800);
  mockDeployments = mockDeployments.filter((d) => d.id !== id);
  return { success: true };
};

export const exportDeployments = async (format = "csv") => {
  await wait(1000);
  return {
    success: true,
    message: `Exported deployments.${format} successfully`,
  };
};
