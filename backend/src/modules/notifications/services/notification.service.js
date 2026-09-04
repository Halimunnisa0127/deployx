const Notification = require('../models/Notification');
const { ApiError } = require('../../../shared/errors/ApiError');
const { StatusCodes } = require('http-status-codes');

class NotificationService {
  /**
   * Create a new in-app notification.
   */
  static async createNotification({
    recipient,
    type = 'info',
    category = 'system',
    title,
    message,
    project = null,
    projectName = '',
    deployment = null,
    domain = null,
    actionUrl = '',
    details = '',
    metadata = {},
    scope = 'user',
  }) {
    if (!recipient || !title || !message) {
      return null;
    }

    try {
      const notif = await Notification.create({
        recipient,
        type,
        category,
        title: String(title).trim(),
        message: String(message).trim(),
        project,
        projectName,
        deployment,
        domain,
        actionUrl,
        details,
        metadata,
        scope,
        unread: true,
      });

      return notif;
    } catch (error) {
      console.error('[NotificationService] Failed to create notification:', error.message);
      return null;
    }
  }

  /**
   * Get paginated notifications for the authenticated user.
   */
  static async getUserNotifications(userId, { page = 1, limit = 50, category = '', unread = null, search = '' } = {}) {
    const query = { recipient: userId };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (unread !== null && unread !== undefined && unread !== '') {
      query.unread = unread === true || unread === 'true';
    }

    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      query.$or = [
        { title: searchRegex },
        { message: searchRegex },
        { projectName: searchRegex },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const [total, notifications, unreadCount] = await Promise.all([
      Notification.countDocuments(query),
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Notification.countDocuments({ recipient: userId, unread: true }),
    ]);

    const mapped = notifications.map((n) => ({
      id: n._id.toString(),
      _id: n._id.toString(),
      type: n.type,
      category: n.category,
      title: n.title,
      message: n.message,
      projectName: n.projectName || '',
      timestamp: n.createdAt,
      createdAt: n.createdAt,
      unread: Boolean(n.unread),
      details: n.details || '',
      actionUrl: n.actionUrl || '',
      projectId: n.project ? n.project.toString() : null,
      deploymentId: n.deployment ? n.deployment.toString() : null,
      domainId: n.domain ? n.domain.toString() : null,
    }));

    return {
      notifications: mapped,
      unreadCount,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  /**
   * Get unread notification count for authenticated user.
   */
  static async getUnreadCount(userId) {
    const count = await Notification.countDocuments({
      recipient: userId,
      unread: true,
    });
    return count;
  }

  /**
   * Toggle or mark single notification as read.
   */
  static async markAsRead(userId, notificationId) {
    const notif = await Notification.findOne({
      _id: notificationId,
      recipient: userId,
    });

    if (!notif) {
      throw new ApiError('Notification not found', StatusCodes.NOT_FOUND);
    }

    notif.unread = false;
    notif.readAt = new Date();
    await notif.save();

    return {
      id: notif._id.toString(),
      unread: false,
      readAt: notif.readAt,
    };
  }

  /**
   * Mark all notifications as read for authenticated user.
   */
  static async markAllAsRead(userId) {
    await Notification.updateMany(
      { recipient: userId, unread: true },
      { $set: { unread: false, readAt: new Date() } }
    );
    return { success: true };
  }

  /**
   * Delete single notification owned by authenticated user.
   */
  static async deleteNotification(userId, notificationId) {
    const result = await Notification.deleteOne({
      _id: notificationId,
      recipient: userId,
    });

    if (result.deletedCount === 0) {
      throw new ApiError('Notification not found', StatusCodes.NOT_FOUND);
    }

    return { success: true };
  }

  /**
   * Clear all notifications for authenticated user.
   */
  static async clearAllNotifications(userId) {
    await Notification.deleteMany({ recipient: userId });
    return { success: true };
  }
}

module.exports = NotificationService;
