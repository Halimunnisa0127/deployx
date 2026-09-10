import api from "../../../../lib/axios";

export const systemHealthApi = {
  getOverview: async () => {
    const res = await api.get("/admin/health/overview");
    return res.data.data;
  },

  getInfrastructure: async () => {
    const res = await api.get("/admin/health/infrastructure");
    return res.data.data;
  },

  getPerformance: async () => {
    const res = await api.get("/admin/health/performance");
    return res.data.data;
  },

  getHistory: async (params = {}) => {
    const res = await api.get("/admin/health/history", { params });
    return res.data.data;
  },

  getIncidents: async (page = 1, limit = 20) => {
    const res = await api.get(`/admin/health/incidents?page=${page}&limit=${limit}`);
    return res.data.data;
  },

  getServiceDetails: async (serviceId) => {
    // Return real infrastructure entry matching serviceId
    const infra = await systemHealthApi.getInfrastructure();
    const service = infra[serviceId] || null;
    return service;
  },

  restartService: async (serviceId) => {
    throw new Error(`Service restart is unavailable in this environment for: ${serviceId}`);
  },

  toggleMaintenanceMode: async (serviceId, enable) => {
    throw new Error(`Maintenance mode (${enable}) is unsupported on this platform for: ${serviceId}`);
  },

  exportHealthReport: async () => {
    throw new Error("System health report export is currently offline.");
  },
};
