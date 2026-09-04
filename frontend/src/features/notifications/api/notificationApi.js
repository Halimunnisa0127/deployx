import api from '../../../lib/axios';

export const notificationApi = {
  getUserNotifications: async (params = {}) => {
    const response = await api.get('/notifications', { params });
    return response.data?.data?.notifications || [];
  },

  getNotificationsData: async (params = {}) => {
    const response = await api.get('/notifications', { params });
    return response.data?.data || { notifications: [], unreadCount: 0, pagination: {} };
  },

  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data?.data?.unreadCount || 0;
  },

  markAsRead: async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data?.data || { id, unread: false };
  },

  markAllAsRead: async () => {
    const response = await api.patch('/notifications/read-all');
    return response.data?.data || { success: true };
  },

  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data?.data || { success: true };
  },

  clearAllNotifications: async () => {
    const response = await api.delete('/notifications');
    return response.data?.data || { success: true };
  },

  getAdminNotifications: async (params = {}) => {
    // Admins query the same /notifications endpoint which delivers their notifications
    const response = await api.get('/notifications', { params });
    return response.data?.data?.notifications || [];
  },
};
