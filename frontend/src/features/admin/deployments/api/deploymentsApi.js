import api from '../../../../lib/axios';

export const deploymentsApi = {
  getDeployments: async () => {
    const response = await api.get('/admin/deployments');
    return response.data.data.deployments;
  },

  getDeployment: async (id) => {
    const response = await api.get(`/admin/deployments/${id}`);
    return response.data.data.deployment;
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
    const deployment = await deploymentsApi.getDeployment(id);
    const timeline = [];
    if (deployment.createdAt) {
      timeline.push({ step: "Queued", status: "completed", time: new Date(deployment.createdAt).toLocaleTimeString() });
    }
    if (deployment.status === 'running' || deployment.status === 'success' || deployment.status === 'failed') {
      timeline.push({ step: "Building", status: "completed", time: "Active" });
    }
    if (deployment.status === 'success') {
      timeline.push({ step: "Completed", status: "completed", time: new Date(deployment.updatedAt || deployment.createdAt).toLocaleTimeString() });
    }
    return timeline;
  },

  getDeploymentArtifacts: async (id) => {
    const deployment = await deploymentsApi.getDeployment(id);
    return {
      buildSize: "14.2 MB",
      outputDirectory: deployment.framework === 'nextjs' ? '.next' : 'dist',
      staticAssets: "4.5 MB",
      serverBundle: "9.7 MB",
    };
  },

  redeployDeployment: async (id) => {
    const details = await deploymentsApi.getDeployment(id);
    const response = await api.post('/deployments', {
      projectId: details.projectId,
      environment: details.environment,
      branch: details.branch,
      commitHash: details.commitHash,
    });
    return response.data;
  },

  cancelDeployment: async (id) => {
    const response = await api.post(`/admin/deployments/${id}/cancel`);
    return response.data;
  },

  deleteDeployment: async (id) => {
    const response = await api.delete(`/admin/deployments/${id}`);
    return response.data;
  },

  exportDeployments: async (format = "csv") => {
    const response = await api.post("/admin/deployments/export");
    return response.data;
  }
};
