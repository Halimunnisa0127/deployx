export const PROJECT_DETAILS_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'deployments', label: 'Deployments' },
  { id: 'env', label: 'Environment Variables' },
  { id: 'domains', label: 'Domains' },
  { id: 'settings', label: 'Settings' },
  { id: 'logs', label: 'Logs' },
];

export const STATUS_VARIANT_MAP = {
  live: 'success',
  building: 'warning',
  failed: 'danger',
  'not deployed': 'neutral',
};

export const getMockDeployments = (project) => {
  const defaultUrl =
    project?.url ||
    `${(project?.name || 'app').toLowerCase().replace(/[^a-z0-9-]/g, '')}.deployx.app`;

  return [
    {
      id: 'dep-101',
      commit: 'Update landing page hero section with new gradient CTA',
      hash: '7a8f9c2',
      branch: project?.branch || 'main',
      environment: 'Production',
      status: project?.status || 'live',
      time: '2 hours ago',
      duration: '42s',
      triggeredBy: 'GitHub Push by @alex-dev',
      url: `https://${defaultUrl}`,
    },
    {
      id: 'dep-100',
      commit: 'Fix responsive navigation drawer on mobile viewports',
      hash: '3b1d4e5',
      branch: 'feature/nav-fix',
      environment: 'Preview',
      status: 'live',
      time: '1 day ago',
      duration: '38s',
      triggeredBy: 'Manual Redeploy by @sarah-ui',
      url: `https://dep-100.${defaultUrl}`,
    },
    {
      id: 'dep-099',
      commit: 'Upgrade dependencies and update Vite config',
      hash: '9e2f1a0',
      branch: project?.branch || 'main',
      environment: 'Production',
      status: 'live',
      time: '3 days ago',
      duration: '51s',
      triggeredBy: 'GitHub Push by @alex-dev',
      url: `https://${defaultUrl}`,
    },
    {
      id: 'dep-098',
      commit: 'Refactor database query optimization for dashboard API',
      hash: '5c4e3b1',
      branch: 'feature/db-optimization',
      environment: 'Preview',
      status: 'failed',
      time: '5 days ago',
      duration: '1m 04s',
      triggeredBy: 'Pull Request #42 by @backend-team',
      url: `https://dep-098.${defaultUrl}`,
    },
    {
      id: 'dep-097',
      commit: 'Initial production build release',
      hash: '1a2b3c4',
      branch: project?.branch || 'main',
      environment: 'Production',
      status: 'live',
      time: '1 week ago',
      duration: '45s',
      triggeredBy: 'System Automation',
      url: `https://${defaultUrl}`,
    },
  ];
};


export const getMockProjectStats = (project) => [
  {
    id: 'stat-1',
    title: 'Total Deployments',
    value: '48',
    subtitle: '+12 this month',
    iconName: 'Layers',
  },
  {
    id: 'stat-2',
    title: 'Success Rate',
    value: '98.2%',
    subtitle: 'Last 30 days',
    iconName: 'CheckCircle2',
  },
  {
    id: 'stat-3',
    title: 'Active Domains',
    value: '2',
    subtitle: 'Primary & preview URL',
    iconName: 'Globe',
  },
  {
    id: 'stat-4',
    title: 'Env Variables',
    value: '14',
    subtitle: 'Across 2 environments',
    iconName: 'Key',
  },
];

export const getMockProjectActivities = (project) => [
  {
    id: 'act-1',
    title: 'Deployment Completed',
    description: `Production build for branch ${project?.branch || 'main'} deployed successfully`,
    timeAgo: '2 hours ago',
    type: 'success',
  },
  {
    id: 'act-2',
    title: 'Environment Variable Added',
    description: 'Added DATABASE_MAX_CONNECTIONS to Production',
    timeAgo: '5 hours ago',
    type: 'env',
  },
  {
    id: 'act-3',
    title: 'Domain Connected',
    description: `Configured alias domain ${project?.name ? project.name.toLowerCase().replace(/[^a-z0-9-]/g, '') : 'app'}.deployx.app`,
    timeAgo: '1 day ago',
    type: 'domain',
  },
  {
    id: 'act-4',
    title: 'Rollback Triggered',
    description: 'Rolled back deployment to commit 3b1d4e5',
    timeAgo: '3 days ago',
    type: 'rollback',
  },
];


export const getMockDomains = (project) => {
  const defaultUrl =
    project?.url ||
    `${(project?.name || 'app').toLowerCase().replace(/[^a-z0-9-]/g, '')}.deployx.app`;

  const slug = (project?.name || 'app').toLowerCase().replace(/[^a-z0-9-]/g, '');

  return [
    {
      id: 'dom-101',
      name: defaultUrl,
      isPrimary: true,
      type: 'Production Domain',
      sslStatus: 'Active',
      dnsStatus: 'Verified',
      createdDate: 'Jul 12, 2026',
      lastChecked: '2 mins ago',
      redirectStatus: 'Direct (No Redirect)',
      cnameTarget: 'cname.deployx.app',
    },
    {
      id: 'dom-102',
      name: `api.${slug}.com`,
      isPrimary: false,
      type: 'Custom Domain',
      sslStatus: 'Active',
      dnsStatus: 'Verified',
      createdDate: 'Jul 15, 2026',
      lastChecked: '5 mins ago',
      redirectStatus: 'Direct (No Redirect)',
      cnameTarget: 'cname.deployx.app',
    },
    {
      id: 'dom-103',
      name: `www.${slug}.com`,
      isPrimary: false,
      type: 'Custom Domain',
      sslStatus: 'Pending',
      dnsStatus: 'Pending',
      createdDate: 'Jul 20, 2026',
      lastChecked: '12 mins ago',
      redirectStatus: `Redirects to ${defaultUrl}`,
      cnameTarget: 'cname.deployx.app',
    },
  ];
};
