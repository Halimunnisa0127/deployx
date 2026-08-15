import api from "../../../../lib/axios";
import {
  generatePerformanceData,
  generateServiceDetails,
} from "../data/systemHealthData";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
    // Keep mock performance data to feed trends charts until timeseries DB is established
    await wait(300);
    return generatePerformanceData();
  },
  getIncidents: async (page = 1, limit = 20) => {
    const res = await api.get(`/admin/health/incidents?page=${page}&limit=${limit}`);
    return res.data.data;
  },
  getServiceDetails: async (serviceId) => {
    await wait(400);
    return generateServiceDetails(serviceId);
  },
  restartService: async (serviceId) => {
    await wait(400);
    throw new Error("Service restart is unavailable in this environment.");
  },
  toggleMaintenanceMode: async (serviceId, enable) => {
    await wait(400);
    throw new Error("Maintenance mode control is unsupported on this platform.");
  },
  exportHealthReport: async () => {
    await wait(400);
    throw new Error("System health report export is currently offline.");
  },
};
