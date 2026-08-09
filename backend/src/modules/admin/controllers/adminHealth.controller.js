const { StatusCodes } = require('http-status-codes');
const ApiResponse = require('../../../shared/responses/ApiResponse');
const adminHealthService = require('../services/adminHealth.service');

class AdminHealthController {
  async getOverview(req, res) {
    const overview = await adminHealthService.getOverview();
    return res.status(StatusCodes.OK).json(ApiResponse.success('Admin health overview retrieved', overview));
  }

  async getInfrastructure(req, res) {
    const infra = await adminHealthService.getInfrastructure();
    return res.status(StatusCodes.OK).json(ApiResponse.success('Admin infrastructure metrics retrieved', infra));
  }

  async getIncidents(req, res) {
    const { page, limit } = req.query;
    const incidentsData = await adminHealthService.getIncidents(page, limit);
    return res.status(StatusCodes.OK).json(ApiResponse.success('Admin incidents retrieved', incidentsData));
  }
}

module.exports = new AdminHealthController();
