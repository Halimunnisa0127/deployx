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

  async getHistoricalMetrics(req, res) {
    const { metric, range } = req.query;
    const history = await adminHealthService.getHistoricalMetrics({ metric, range });
    return res.status(StatusCodes.OK).json(ApiResponse.success('Historical metrics retrieved', history));
  }

  async getPerformance(req, res) {
    const performance = await adminHealthService.getPerformanceOverview();
    return res.status(StatusCodes.OK).json(ApiResponse.success('Performance overview retrieved', performance));
  }

  async recordSample(req, res) {
    const samples = await adminHealthService.recordTelemetrySample();
    return res.status(StatusCodes.OK).json(ApiResponse.success('Telemetry sample recorded', { samplesCount: samples.length }));
  }

  async getAnalyticsOverview(req, res) {
    const { days } = req.query;
    const overview = await adminHealthService.getAnalyticsOverview(days);
    return res.status(StatusCodes.OK).json(ApiResponse.success('Admin analytics overview retrieved', overview));
  }

  async getDeploymentTrends(req, res) {
    const { days } = req.query;
    const trends = await adminHealthService.getDeploymentTrends(days);
    return res.status(StatusCodes.OK).json(ApiResponse.success('Deployment trends retrieved', trends));
  }

  async getUserGrowth(req, res) {
    const { days } = req.query;
    const growth = await adminHealthService.getUserGrowth(days);
    return res.status(StatusCodes.OK).json(ApiResponse.success('User growth retrieved', growth));
  }

  async getProjectGrowth(req, res) {
    const growth = await adminHealthService.getProjectGrowth();
    return res.status(StatusCodes.OK).json(ApiResponse.success('Project growth retrieved', growth));
  }

  async getFrameworkDistribution(req, res) {
    const frameworks = await adminHealthService.getFrameworkDistribution();
    return res.status(StatusCodes.OK).json(ApiResponse.success('Framework distribution retrieved', frameworks));
  }

  async getTopProjects(req, res) {
    const { limit } = req.query;
    const topProjects = await adminHealthService.getTopProjects(limit);
    return res.status(StatusCodes.OK).json(ApiResponse.success('Top projects retrieved', topProjects));
  }

  async getTopUsers(req, res) {
    const { limit } = req.query;
    const topUsers = await adminHealthService.getTopUsers(limit);
    return res.status(StatusCodes.OK).json(ApiResponse.success('Top users retrieved', topUsers));
  }

  async getRegionDistribution(req, res) {
    const regions = await adminHealthService.getRegionDistribution();
    return res.status(StatusCodes.OK).json(ApiResponse.success('Region distribution retrieved', regions));
  }
}

module.exports = new AdminHealthController();
