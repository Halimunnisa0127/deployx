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
  archived: 'neutral',
  draft: 'neutral',
  'not deployed': 'neutral',
};

// Deprecated mock helpers. Real data is sourced from backend API models.
export const getMockDeployments = () => [];
export const getMockProjectStats = () => [];
export const getMockProjectActivities = () => [];
export const getMockDomains = () => [];
