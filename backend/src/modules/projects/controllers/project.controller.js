const { StatusCodes } = require('http-status-codes');
const ProjectService = require('../services/project.service');
const ApiResponse = require('../../../shared/responses/ApiResponse');

class ProjectController {
  /**
   * Get Framework Presets
   */
  async getFrameworkPresets(req, res) {
    const { FRAMEWORK_PRESETS } = require('../constants/frameworkPresets');
    res.status(StatusCodes.OK).json(ApiResponse.success('Framework presets retrieved', { presets: FRAMEWORK_PRESETS }));
  }

  /**
   * Step 1: Check project name availability and generate domain preview URL
   */
  async checkNameAvailability(req, res) {
    const { name } = req.body;
    const userId = req.user ? (req.user._id || req.user.id) : null;

    const result = await ProjectService.checkProjectNameAvailability(userId, name);
    res.status(StatusCodes.OK).json(ApiResponse.success('Project name check completed', result));
  }

  /**
   * Complete Project Creation (Step 6 / Final Submission)
   */
  async createProject(req, res) {
    const userId = req.user ? (req.user._id || req.user.id) : null;
    const project = await ProjectService.createProject(userId, req.body);
    res.status(StatusCodes.CREATED).json(ApiResponse.created('Project created successfully', { project }));
  }

  /**
   * Get all projects for current user
   */
  async getProjects(req, res) {
    const userId = req.user ? (req.user._id || req.user.id) : null;
    const projects = await ProjectService.getUserProjects(userId);
    res.status(StatusCodes.OK).json(ApiResponse.success('Projects retrieved successfully', { projects }));
  }

  /**
   * Get single project by ID
   */
  async getProject(req, res) {
    const userId = req.user ? (req.user._id || req.user.id) : null;
    const { id } = req.params;
    const project = await ProjectService.getProjectById(userId, id);
    res.status(StatusCodes.OK).json(ApiResponse.success('Project retrieved successfully', { project }));
  }

  /**
   * Update project details
   */
  async updateProject(req, res) {
    const userId = req.user ? (req.user._id || req.user.id) : null;
    const { id } = req.params;
    const project = await ProjectService.updateProject(userId, id, req.body);
    res.status(StatusCodes.OK).json(ApiResponse.success('Project updated successfully', { project }));
  }

  /**
   * Delete project
   */
  async deleteProject(req, res) {
    const userId = req.user ? (req.user._id || req.user.id) : null;
    const { id } = req.params;
    await ProjectService.deleteProject(userId, id);
    res.status(StatusCodes.OK).json(ApiResponse.success('Project deleted successfully'));
  }
}

module.exports = new ProjectController();
