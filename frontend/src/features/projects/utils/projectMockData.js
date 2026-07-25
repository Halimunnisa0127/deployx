export const PROJECT_DETAILS_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'deployments', label: 'Deployments' },
  { id: 'env', label: 'Environment Variables' },
  { id: 'domains', label: 'Domains' },
  { id: 'settings', label: 'Settings' },
];

export const STATUS_VARIANT_MAP = {
  live: 'success',
  building: 'warning',
  failed: 'danger',
  'not deployed': 'neutral',
};

export const getMockDeployments = (project) => [
  {
    id: 'dep-101',
    commit: 'Update landing page hero section',
    hash: '7a8f9c2',
    branch: project?.branch || 'main',
    status: project?.status || 'live',
    time: '2 hours ago',
    duration: '42s',
  },
  {
    id: 'dep-100',
    commit: 'Fix responsive navigation drawer',
    hash: '3b1d4e5',
    branch: project?.branch || 'main',
    status: 'live',
    time: '1 day ago',
    duration: '38s',
  },
  {
    id: 'dep-099',
    commit: 'Upgrade dependencies and config',
    hash: '9e2f1a0',
    branch: project?.branch || 'main',
    status: 'live',
    time: '3 days ago',
    duration: '51s',
  },
];
