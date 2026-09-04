import { systemHealthApi } from "../api/systemHealthApi";

export const systemHealthService = {
  getSystemOverview: async () => {
    return await systemHealthApi.getOverview();
  },

  getInfrastructureStatus: async () => {
    return await systemHealthApi.getInfrastructure();
  },

  getPerformanceMetrics: async () => {
    return await systemHealthApi.getPerformance();
  },

  getHistoricalMetrics: async (params) => {
    return await systemHealthApi.getHistory(params);
  },

  getIncidentTimeline: async (page, limit) => {
    return await systemHealthApi.getIncidents(page, limit);
  },

  getServiceDetails: async (serviceId) => {
    return await systemHealthApi.getServiceDetails(serviceId);
  },

  restartService: async (serviceId) => {
    return await systemHealthApi.restartService(serviceId);
  },

  toggleMaintenanceMode: async (serviceId, enable) => {
    return await systemHealthApi.toggleMaintenanceMode(serviceId, enable);
  },

  exportHealthReport: async () => {
    return await systemHealthApi.exportHealthReport();
  },
};

export const {
  getSystemOverview,
  getInfrastructureStatus,
  getPerformanceMetrics,
  getHistoricalMetrics,
  getIncidentTimeline,
  getServiceDetails,
  restartService,
  toggleMaintenanceMode,
  exportHealthReport,
} = systemHealthService;
