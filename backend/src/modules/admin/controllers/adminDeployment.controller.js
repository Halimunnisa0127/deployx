const { StatusCodes } = require('http-status-codes');
const ApiResponse = require('../../../shared/responses/ApiResponse');
const adminDeploymentService = require('../services/adminDeployment.service');

class AdminDeploymentController {
  async listDeployments(req, res) {
    const { page, limit, search, status } = req.query;
    const result = await adminDeploymentService.listDeployments({ page, limit, search, status });
    return res.status(StatusCodes.OK).json(ApiResponse.success('Deployments retrieved successfully', result));
  }

  async getDeployment(req, res) {
    const { id } = req.params;
    const deployment = await adminDeploymentService.getDeployment(id);
    return res.status(StatusCodes.OK).json(ApiResponse.success('Deployment retrieved successfully', { deployment }));
  }

  async cancelDeployment(req, res) {
    const { id } = req.params;
    const deployment = await adminDeploymentService.cancelDeployment(id);
    return res.status(StatusCodes.OK).json(ApiResponse.success('Deployment cancelled successfully', { deployment }));
  }

  async deleteDeployment(req, res) {
    const { id } = req.params;
    await adminDeploymentService.deleteDeployment(id);
    return res.status(StatusCodes.OK).json(ApiResponse.success('Deployment deleted successfully'));
  }

  async exportDeployments(req, res) {
    return res.status(StatusCodes.OK).json(ApiResponse.success('Deployments report exported successfully'));
  }
}

module.exports = new AdminDeploymentController();
