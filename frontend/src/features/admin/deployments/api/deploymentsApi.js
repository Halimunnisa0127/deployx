import { mockDeployments } from '../data/deploymentsData';
import api from '../../../../lib/axios';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const deploymentsApi = {
  getDeployments: async () => {
    await wait(600);
    return [...mockDeployments];
  },

  getDeployment: async (id) => {
    await wait(400);
    const deployment = mockDeployments.find((d) => d.id === id);
    if (!deployment) throw new Error("Deployment not found");
    return { ...deployment };
  },

  getDeploymentLogs: async (id) => {
    try {
      const response = await api.get(`/deployments/${id}/logs`);
      const { logs } = response.data.data;
      if (!logs || logs.length === 0) {
        return 'No logs found for this deployment.';
      }
      return logs.map(log => {
        const time = new Date(log.timestamp).toISOString();
        return `[${time}] [${log.level.toUpperCase()}] ${log.message}`;
      }).join('\n');
    } catch (error) {
      console.error("Failed to fetch logs", error);
      return 'Error retrieving logs.';
    }
  },

  getDeploymentTimeline: async (id) => {
    await wait(300);
    return [
      { step: "Queued", status: "completed", time: "10:00:00 AM" },
      { step: "Building", status: "completed", time: "10:00:02 AM" },
      { step: "Uploading", status: "completed", time: "10:01:06 AM" },
      { step: "Deploying", status: "completed", time: "10:01:10 AM" },
      { step: "Completed", status: "completed", time: "10:01:15 AM" },
    ];
  },

  getDeploymentArtifacts: async (id) => {
    await wait(300);
    return {
      buildSize: "14.2 MB",
      outputDirectory: ".next",
      staticAssets: "4.5 MB",
      serverBundle: "9.7 MB",
    };
  },

  redeployDeployment: async (id) => {
    await wait(800);
    return { success: true, message: "Redeployment triggered" };
  },

  cancelDeployment: async (id) => {
    await wait(500);
    const index = mockDeployments.findIndex((d) => d.id === id);
    if (index !== -1) {
      mockDeployments[index].status = "cancelled";
    }
    return { success: true };
  },

  deleteDeployment: async (id) => {
    await wait(800);
    const index = mockDeployments.findIndex((d) => d.id === id);
    if (index !== -1) {
      mockDeployments.splice(index, 1);
    }
    return { success: true };
  },

  exportDeployments: async (format = "csv") => {
    await wait(1000);
    return {
      success: true,
      message: `Exported deployments.${format} successfully`,
    };
  }
};
