import { describe, test, expect, vi, beforeEach } from 'vitest';
import { notificationApi } from '../src/features/notifications/api/notificationApi';
import api from '../src/lib/axios';

vi.mock('../src/lib/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Notifications API Client Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('getUserNotifications calls GET /notifications with query params', async () => {
    const mockNotifications = [
      {
        id: 'notif-1',
        title: 'Deployment Queued',
        message: 'Deployment is queued',
        unread: true,
      },
    ];

    api.get.mockResolvedValue({
      data: {
        data: {
          notifications: mockNotifications,
        },
      },
    });

    const result = await notificationApi.getUserNotifications({ page: 1, limit: 10 });
    expect(api.get).toHaveBeenCalledWith('/notifications', { params: { page: 1, limit: 10 } });
    expect(result).toEqual(mockNotifications);
  });

  test('getUnreadCount calls GET /notifications/unread-count', async () => {
    api.get.mockResolvedValue({
      data: {
        data: {
          unreadCount: 4,
        },
      },
    });

    const count = await notificationApi.getUnreadCount();
    expect(api.get).toHaveBeenCalledWith('/notifications/unread-count');
    expect(count).toBe(4);
  });

  test('markAsRead calls PATCH /notifications/:id/read', async () => {
    api.patch.mockResolvedValue({
      data: {
        data: {
          id: 'notif-1',
          unread: false,
        },
      },
    });

    const res = await notificationApi.markAsRead('notif-1');
    expect(api.patch).toHaveBeenCalledWith('/notifications/notif-1/read');
    expect(res.unread).toBe(false);
  });

  test('markAllAsRead calls PATCH /notifications/read-all', async () => {
    api.patch.mockResolvedValue({
      data: {
        data: {
          success: true,
        },
      },
    });

    const res = await notificationApi.markAllAsRead();
    expect(api.patch).toHaveBeenCalledWith('/notifications/read-all');
    expect(res.success).toBe(true);
  });

  test('deleteNotification calls DELETE /notifications/:id', async () => {
    api.delete.mockResolvedValue({
      data: {
        data: {
          success: true,
        },
      },
    });

    const res = await notificationApi.deleteNotification('notif-1');
    expect(api.delete).toHaveBeenCalledWith('/notifications/notif-1');
    expect(res.success).toBe(true);
  });

  test('clearAllNotifications calls DELETE /notifications', async () => {
    api.delete.mockResolvedValue({
      data: {
        data: {
          success: true,
        },
      },
    });

    const res = await notificationApi.clearAllNotifications();
    expect(api.delete).toHaveBeenCalledWith('/notifications');
    expect(res.success).toBe(true);
  });
});
