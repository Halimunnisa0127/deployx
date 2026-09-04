// Deprecated mock system health data generators. Replaced by real backend /admin/health endpoints.
export const overviewData = {};
export const infrastructureData = [];
export const generatePerformanceData = () => ({
  cpu: { current: 0, trend: 0, data: [] },
  memory: { current: 0, trend: 0, data: [] },
  disk: { current: 0, trend: 0, data: [] },
  network: { current: 0, trend: 0, data: [] },
  connections: { current: 0, trend: 0, data: [] },
  requests: { current: 0, trend: 0, data: [] },
});
export const generateIncidentTimeline = () => [];
export const generateServiceDetails = () => null;
