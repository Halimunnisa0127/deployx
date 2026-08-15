const { StatusCodes } = require('http-status-codes');
const ApiResponse = require('../../../shared/responses/ApiResponse');
const adminUserService = require('../services/adminUser.service');

class AdminUserController {
  async listUsers(req, res) {
    const { page, limit, search, role, status } = req.query;
    const result = await adminUserService.listUsers({ page, limit, search, role, status });
    return res.status(StatusCodes.OK).json(ApiResponse.success('Users retrieved successfully', result));
  }

  async getUser(req, res) {
    const { id } = req.params;
    const user = await adminUserService.getUser(id);
    return res.status(StatusCodes.OK).json(ApiResponse.success('User retrieved successfully', { user }));
  }

  async createUser(req, res) {
    const user = await adminUserService.createUser(req.body);
    return res.status(StatusCodes.CREATED).json(ApiResponse.created('User created successfully', { user }));
  }

  async updateUser(req, res) {
    const { id } = req.params;
    const user = await adminUserService.updateUser(id, req.body);
    return res.status(StatusCodes.OK).json(ApiResponse.success('User updated successfully', { user }));
  }

  async deleteUser(req, res) {
    const { id } = req.params;
    await adminUserService.deleteUser(id);
    return res.status(StatusCodes.OK).json(ApiResponse.success('User deleted successfully'));
  }

  async resetPassword(req, res) {
    // Password reset simulation endpoint for admin panel
    return res.status(StatusCodes.OK).json(ApiResponse.success('Password reset triggered successfully'));
  }
}

module.exports = new AdminUserController();
