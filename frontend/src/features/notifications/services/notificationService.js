import { notificationApi } from '../api/notificationApi';

export const notificationService = {
  // Role-aware fetch function
  getNotifications: async (currentUser) => {
    // Return admin notifications if role is admin
    if (currentUser?.role === 'admin') {
      return notificationApi.getAdminNotifications();
    }
    // Otherwise return standard user notifications
    return notificationApi.getUserNotifications();
  },

  // Mocked actions that would typically hit an API
  markAsRead: async (id) => {
    return true;
  },

  markAllAsRead: async () => {
    return true;
  },

  deleteNotification: async (id) => {
    return true;
  },

  clearNotifications: async () => {
    return true;
  },

  updateSettings: async (settings) => {
    return true;
  }
};
