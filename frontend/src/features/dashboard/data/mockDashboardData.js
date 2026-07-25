/**
 * Mock data module for DeployX Dashboard UI.
 * Standardized data structure easily replaceable with API / Redux state.
 */

export const MOCK_STAT_METRICS = [
  {
    id: 'total_projects',
    title: 'Total Projects',
    value: '12',
    iconName: 'FolderPlus',
  },
  {
    id: 'total_deployments',
    title: 'Total Deployments',
    value: '148',
    iconName: 'Layers',
  },
  {
    id: 'active_domains',
    title: 'Active Domains',
    value: '8',
    iconName: 'Globe',
  },
  {
    id: 'success_rate',
    title: 'Deployment Success Rate',
    value: '98.2%',
    iconName: 'Zap',
  },
];

export const MOCK_RECENT_DEPLOYMENTS = [
  {
    id: 'dep-101',
    projectName: 'deployx-frontend',
    status: 'success',
    statusLabel: 'Success',
    branch: 'main',
    timeAgo: '2 mins ago',
    commitHash: '7a8f3b2',
    commitMessage: 'feat: add responsive dashboard cards',
  },
  {
    id: 'dep-102',
    projectName: 'deployx-api-service',
    status: 'building',
    statusLabel: 'Building',
    branch: 'feat/auth',
    timeAgo: '14 mins ago',
    commitHash: 'e49c10d',
    commitMessage: 'fix: optimize JWT token validation',
  },
  {
    id: 'dep-103',
    projectName: 'docs-portal',
    status: 'success',
    statusLabel: 'Success',
    branch: 'main',
    timeAgo: '1 hour ago',
    commitHash: '9b3f81a',
    commitMessage: 'docs: update deployment guidelines',
  },
  {
    id: 'dep-104',
    projectName: 'analytics-worker',
    status: 'failed',
    statusLabel: 'Failed',
    branch: 'fix/db-pool',
    timeAgo: '3 hours ago',
    commitHash: '2c7104e',
    commitMessage: 'refactor: update connection pool size',
  },
  {
    id: 'dep-105',
    projectName: 'marketing-landing',
    status: 'queued',
    statusLabel: 'Queued',
    branch: 'main',
    timeAgo: '5 hours ago',
    commitHash: 'f812d90',
    commitMessage: 'chore: bump dependencies version',
  },
];

export const MOCK_SYSTEM_SERVICES = [
  {
    id: 'api_server',
    name: 'API Server',
    status: 'success',
    statusLabel: 'Healthy',
    detail: '24ms response',
  },
  {
    id: 'database',
    name: 'Database',
    status: 'success',
    statusLabel: 'Healthy',
    detail: 'Primary Pool (Operational)',
  },
  {
    id: 'docker_engine',
    name: 'Docker Engine',
    status: 'success',
    statusLabel: 'Healthy',
    detail: 'Active (v24.0.7)',
  },
  {
    id: 'build_queue',
    name: 'Build Queue',
    status: 'warning',
    statusLabel: 'Warning',
    detail: '2 builds waiting',
  },
];

export const MOCK_PROJECT_OVERVIEW = {
  total: 12,
  liveCount: 9,
  buildingCount: 2,
  failedCount: 1,
};

export const MOCK_RECENT_ACTIVITIES = [
  {
    id: 'act-1',
    title: 'Deployment completed successfully',
    projectName: 'deployx-frontend',
    timeAgo: '2 mins ago',
    type: 'success',
  },
  {
    id: 'act-2',
    title: 'Build trigger started',
    projectName: 'deployx-api-service',
    timeAgo: '14 mins ago',
    type: 'building',
  },
  {
    id: 'act-3',
    title: 'Custom domain connected (api.deployx.dev)',
    projectName: 'deployx-api-service',
    timeAgo: '1 hour ago',
    type: 'domain',
  },
  {
    id: 'act-4',
    title: 'Environment variable updated (DATABASE_URL)',
    projectName: 'analytics-worker',
    timeAgo: '3 hours ago',
    type: 'env',
  },
  {
    id: 'act-5',
    title: 'Build failed during step npm run build',
    projectName: 'analytics-worker',
    timeAgo: '4 hours ago',
    type: 'failed',
  },
];

export const MOCK_QUICK_ACTIONS = [
  {
    id: 'new_project',
    title: 'New Project',
    description: 'Deploy a new web application or web service instantly.',
    to: '/dashboard/projects/new',
    icon: 'FolderPlus',
    accentColor: 'indigo',
  },
  {
    id: 'import_repo',
    title: 'Import Repository',
    description: 'Connect your GitHub or Git repository to configure auto-deploys.',
    to: '/dashboard/projects/import',
    icon: 'GitBranch',
    accentColor: 'emerald',
  },
  {
    id: 'view_logs',
    title: 'View Deployment Logs',
    description: 'Inspect real-time build streaming and runtime server logs.',
    to: '/dashboard/deployments',
    icon: 'Terminal',
    accentColor: 'amber',
  },
  {
    id: 'manage_domains',
    title: 'Manage Domains',
    description: 'Configure custom domains, SSL certificates, and DNS records.',
    to: '/dashboard/settings/domains',
    icon: 'Globe',
    accentColor: 'sky',
  },
];
