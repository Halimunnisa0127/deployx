import { notificationApi } from '../api/notificationApi';

export const notificationService = {
  getNotifications: async (currentUser, params = {}) => {
    return await notificationApi.getUserNotifications(params);
  },

  getNotificationsData: async (params = {}) => {
    return await notificationApi.getNotificationsData(params);
  },

  getUnreadCount: async () => {
    return await notificationApi.getUnreadCount();
  },

  markAsRead: async (id) => {
    return await notificationApi.markAsRead(id);
  },

  markAllAsRead: async () => {
    return await notificationApi.markAllAsRead();
  },

  deleteNotification: async (id) => {
    return await notificationApi.deleteNotification(id);
  },

  clearNotifications: async () => {
    return await notificationApi.clearAllNotifications();
  },

  updateSettings: async (settings) => {
    // Client preferences persist in localStorage
    try {
      localStorage.setItem('deployx_notification_settings', JSON.stringify(settings));
    } catch (e) {
      // Ignore
    }
    return true;
  },
};
