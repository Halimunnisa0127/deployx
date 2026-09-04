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
    const currentAdminId = req.user?._id || req.user?.id;
    if (currentAdminId && currentAdminId.toString() === id.toString()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(ApiResponse.error('Cannot delete your own admin account', {}, StatusCodes.BAD_REQUEST));
    }
    await adminUserService.deleteUser(id, currentAdminId);
    return res.status(StatusCodes.OK).json(ApiResponse.success('User deleted successfully'));
  }

  async resetPassword(req, res) {
    // Password reset simulation endpoint for admin panel
    return res.status(StatusCodes.OK).json(ApiResponse.success('Password reset triggered successfully'));
  }
}

module.exports = new AdminUserController();
