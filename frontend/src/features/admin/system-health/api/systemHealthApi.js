import {
  overviewData,
  infrastructureData,
  generatePerformanceData,
  generateIncidentTimeline,
  generateServiceDetails,
} from "../data/systemHealthData";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const systemHealthApi = {
  getOverview: async () => {
    await wait(500);
    return overviewData;
  },
  getInfrastructure: async () => {
    await wait(600);
    return infrastructureData;
  },
  getPerformance: async () => {
    await wait(500);
    return generatePerformanceData();
  },
  getIncidents: async () => {
    await wait(700);
    return generateIncidentTimeline();
  },
  getServiceDetails: async (serviceId) => {
    await wait(800);
    return generateServiceDetails(serviceId);
  },
  restartService: async (serviceId) => {
    await wait(1500);
    return {
      success: true,
      message: `Service ${serviceId} restarted successfully.`,
    };
  },
  toggleMaintenanceMode: async (serviceId, enable) => {
    await wait(1000);
    return {
      success: true,
      message: `Maintenance mode ${enable ? "enabled" : "disabled"} for ${serviceId}.`,
    };
  },
  exportHealthReport: async () => {
    await wait(1200);
    return { success: true, url: "/downloads/system_health_report.pdf" };
  },
};
