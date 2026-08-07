const { StatusCodes } = require('http-status-codes');
const userService = require('../services/user.service');
const ApiResponse = require('../../../shared/responses/ApiResponse');
const { clearRefreshTokenCookie } = require('../../../utils/helpers/cookie.helper');

class UserController {
  async getProfile(req, res) {
    const user = await userService.getProfile(req.user.id);
    res.status(StatusCodes.OK).json(ApiResponse.success('Profile retrieved successfully', { user }));
  }

  async updateProfile(req, res) {
    const updatedUser = await userService.updateProfile(req.user.id, req.body);
    res.status(StatusCodes.OK).json(ApiResponse.updated('Profile updated successfully', { user: updatedUser }));
  }

  async updatePassword(req, res) {
    const { currentPassword, newPassword } = req.body;
    await userService.updatePassword(req.user.id, currentPassword, newPassword);
    
    clearRefreshTokenCookie(res);
    res.status(StatusCodes.OK).json(ApiResponse.success('Password updated successfully. Please log in again.'));
  }

  async uploadAvatar(req, res) {
    const mockFile = req.file || { originalname: 'mock.png', size: 1024 };
    const updatedUser = await userService.updateAvatar(req.user.id, mockFile);
    res.status(StatusCodes.OK).json(ApiResponse.updated('Avatar updated successfully', { user: updatedUser }));
  }
}

module.exports = new UserController();
