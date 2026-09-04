import api from '../../../../lib/axios';

export const deploymentsApi = {
  getDeployments: async (params = {}) => {
    const response = await api.get('/admin/deployments', { params });
    return response.data?.data?.deployments || response.data?.data || [];
  },

  getDeployment: async (id) => {
    const response = await api.get(`/admin/deployments/${id}`);
    return response.data?.data?.deployment || response.data?.data;
  },

  getDeploymentLogs: async (id) => {
    try {
      const response = await api.get(`/deployments/${id}/logs`);
      const logs = response.data?.data?.logs || [];
      if (!logs || logs.length === 0) {
        return 'No logs found for this deployment.';
      }
      return logs.map(log => {
        const time = log.timestamp ? new Date(log.timestamp).toISOString() : '';
        const level = (log.level || 'INFO').toUpperCase();
        return `[${time}] [${level}] ${log.message || ''}`;
      }).join('\n');
    } catch (error) {
      console.error("Failed to fetch logs", error);
      return 'No logs found for this deployment.';
    }
  },

  getDeploymentTimeline: async (id) => {
    const deployment = await deploymentsApi.getDeployment(id);
    return deployment?.timeline || [];
  },

  getDeploymentArtifacts: async (id) => {
    const deployment = await deploymentsApi.getDeployment(id);
    if (!deployment?.artifact) {
      return {
        buildSize: "N/A",
        outputDirectory: deployment?.framework === 'nextjs' ? '.next' : 'dist',
        fileCount: 0,
        checksum: null,
      };
    }
    return {
      buildSize: deployment.artifact.formattedSize || `${(deployment.artifact.size / (1024 * 1024)).toFixed(2)} MB`,
      outputDirectory: deployment.artifact.outputDirectory || (deployment.framework === 'nextjs' ? '.next' : 'dist'),
      fileCount: deployment.artifact.fileCount || 0,
      checksum: deployment.artifact.checksum || null,
      rawBytes: deployment.artifact.size,
    };
  },

  redeployDeployment: async (id) => {
    const details = await deploymentsApi.getDeployment(id);
    const response = await api.post('/deployments', {
      projectId: details.projectId,
      environment: details.environment,
      branch: details.branch,
      commitHash: details.commitHash || details.commit,
      commitMessage: details.commitMessage,
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
    const response = await api.post("/admin/deployments/export", { format });
    return response.data;
  }
};
