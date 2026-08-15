const { StatusCodes } = require('http-status-codes');
const ApiResponse = require('../../../shared/responses/ApiResponse');
const adminProjectService = require('../services/adminProject.service');

class AdminProjectController {
  async listProjects(req, res) {
    const { page, limit, search, status, framework } = req.query;
    const result = await adminProjectService.listProjects({ page, limit, search, status, framework });
    return res.status(StatusCodes.OK).json(ApiResponse.success('Projects retrieved successfully', result));
  }

  async getProject(req, res) {
    const { id } = req.params;
    const project = await adminProjectService.getProject(id);
    return res.status(StatusCodes.OK).json(ApiResponse.success('Project retrieved successfully', { project }));
  }

  async archiveProject(req, res) {
    const { id } = req.params;
    const result = await adminProjectService.archiveProject(id);
    return res.status(StatusCodes.OK).json(ApiResponse.success('Project archived successfully', result));
  }

  async deleteProject(req, res) {
    const { id } = req.params;
    await adminProjectService.deleteProject(id);
    return res.status(StatusCodes.OK).json(ApiResponse.success('Project deleted successfully'));
  }

  async exportProjects(req, res) {
    return res.status(StatusCodes.OK).json(ApiResponse.success('Projects report exported successfully'));
  }
}

module.exports = new AdminProjectController();
