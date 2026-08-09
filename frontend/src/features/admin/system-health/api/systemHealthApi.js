import api from "../../../lib/axios";
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
    await wait(1000);
    return {
      success: true,
      message: `Service ${serviceId} restarted successfully.`,
    };
  },
  toggleMaintenanceMode: async (serviceId, enable) => {
    await wait(800);
    return {
      success: true,
      message: `Maintenance mode ${enable ? "enabled" : "disabled"} for ${serviceId}.`,
    };
  },
  exportHealthReport: async () => {
    await wait(1000);
    return { success: true, url: "/downloads/system_health_report.pdf" };
  },
};
