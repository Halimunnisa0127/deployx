import { deploymentsApi } from '../api/deploymentsApi';

class DeploymentsService {
  async getDeployments() {
    return await deploymentsApi.getDeployments();
  }

  async getDeployment(id) {
    return await deploymentsApi.getDeployment(id);
  }

  async getDeploymentLogs(id) {
    return await deploymentsApi.getDeploymentLogs(id);
  }

  async getDeploymentTimeline(id) {
    return await deploymentsApi.getDeploymentTimeline(id);
  }

  async getDeploymentArtifacts(id) {
    return await deploymentsApi.getDeploymentArtifacts(id);
  }

  async redeployDeployment(id) {
    return await deploymentsApi.redeployDeployment(id);
  }

  async cancelDeployment(id) {
    return await deploymentsApi.cancelDeployment(id);
  }

  async deleteDeployment(id) {
    return await deploymentsApi.deleteDeployment(id);
  }

  async exportDeployments(format) {
    return await deploymentsApi.exportDeployments(format);
  }
}

export const deploymentsService = new DeploymentsService();
