const { StatusCodes } = require('http-status-codes');
const ApiResponse = require('../../../shared/responses/ApiResponse');
const adminSettingsService = require('../services/adminSettings.service');

class AdminSettingsController {
  async getSettings(req, res) {
    const settings = await adminSettingsService.getSettings();
    return res
      .status(StatusCodes.OK)
      .json(ApiResponse.success('Platform settings retrieved successfully', { settings }));
  }

  async updateSettings(req, res) {
    const userId = req.user.id;
    const settings = await adminSettingsService.updateSettings(userId, req.body);
    return res
      .status(StatusCodes.OK)
      .json(ApiResponse.success('Platform settings updated successfully', { settings }));
  }

  async resetSettings(req, res) {
    const userId = req.user.id;
    const settings = await adminSettingsService.resetSettings(userId);
    return res
      .status(StatusCodes.OK)
      .json(ApiResponse.success('Platform settings reset to defaults', { settings }));
  }

  async sendTestEmail(req, res) {
    const userId = req.user.id;
    const { email } = req.body;
    const result = await adminSettingsService.sendTestEmail(userId, email);
    return res
      .status(StatusCodes.OK)
      .json(ApiResponse.success(result.message, result));
  }
}

module.exports = new AdminSettingsController();
