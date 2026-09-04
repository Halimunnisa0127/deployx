const { StatusCodes } = require('http-status-codes');
const ApiResponse = require('../../../shared/responses/ApiResponse');
const notificationService = require('../services/notification.service');

class NotificationController {
  async getNotifications(req, res) {
    const userId = req.user.id;
    const { page, limit, category, unread, search } = req.query;

    const result = await notificationService.getUserNotifications(userId, {
      page,
      limit,
      category,
      unread,
      search,
    });

    return res
      .status(StatusCodes.OK)
      .json(ApiResponse.success('Notifications retrieved successfully', result));
  }

  async getUnreadCount(req, res) {
    const userId = req.user.id;
    const unreadCount = await notificationService.getUnreadCount(userId);

    return res
      .status(StatusCodes.OK)
      .json(ApiResponse.success('Unread count retrieved successfully', { unreadCount }));
  }

  async markAsRead(req, res) {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await notificationService.markAsRead(userId, id);

    return res
      .status(StatusCodes.OK)
      .json(ApiResponse.success('Notification marked as read', result));
  }

  async markAllAsRead(req, res) {
    const userId = req.user.id;

    await notificationService.markAllAsRead(userId);

    return res
      .status(StatusCodes.OK)
      .json(ApiResponse.success('All notifications marked as read'));
  }

  async deleteNotification(req, res) {
    const userId = req.user.id;
    const { id } = req.params;

    await notificationService.deleteNotification(userId, id);

    return res
      .status(StatusCodes.OK)
      .json(ApiResponse.success('Notification deleted successfully'));
  }

  async clearAllNotifications(req, res) {
    const userId = req.user.id;

    await notificationService.clearAllNotifications(userId);

    return res
      .status(StatusCodes.OK)
      .json(ApiResponse.success('All notifications cleared successfully'));
  }
}

module.exports = new NotificationController();
