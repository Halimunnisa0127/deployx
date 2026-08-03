import { USER_MOCK_NOTIFICATIONS } from '../data/userNotifications';
import { ADMIN_MOCK_NOTIFICATIONS } from '../data/adminNotifications';

export const notificationApi = {
  getUserNotifications: async () => {
    return [...USER_MOCK_NOTIFICATIONS];
  },
  
  getAdminNotifications: async () => {
    return [...ADMIN_MOCK_NOTIFICATIONS];
  }
};
