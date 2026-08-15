export const logsMockData = [
  { id: 1, timestamp: new Date().toISOString(), level: 'info',  source: 'deployment-worker', message: 'Deployment dpl_abc123 started successfully.' },
  { id: 2, timestamp: new Date().toISOString(), level: 'warn',  source: 'api-gateway',        message: 'Rate limit approaching for user usr_xyz.' },
  { id: 3, timestamp: new Date().toISOString(), level: 'error', source: 'build-runner',       message: 'Build failed for project my-app: exit code 1.' },
  { id: 4, timestamp: new Date().toISOString(), level: 'debug', source: 'auth-service',       message: 'Token refresh for session ses_001.' },
  { id: 5, timestamp: new Date().toISOString(), level: 'info',  source: 'scheduler',          message: 'Nightly cleanup job completed in 3.2s.' },
];
