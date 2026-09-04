const mongoose = require('mongoose');
const NotificationService = require('../../src/modules/notifications/services/notification.service');
const Notification = require('../../src/modules/notifications/models/Notification');

jest.mock('../../src/modules/notifications/models/Notification');

describe('Notification Service Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('1. Notification Creation', () => {
    test('createNotification creates and saves valid notification', async () => {
      const mockCreated = {
        _id: 'notif-123',
        recipient: 'user-1',
        title: 'Deployment Queued',
        message: 'Deployment #1 is queued',
        category: 'deployment',
        type: 'info',
        unread: true,
      };

      Notification.create = jest.fn().mockResolvedValue(mockCreated);

      const res = await NotificationService.createNotification({
        recipient: 'user-1',
        title: 'Deployment Queued',
        message: 'Deployment #1 is queued',
        category: 'deployment',
        type: 'info',
      });

      expect(Notification.create).toHaveBeenCalledWith(
        expect.objectContaining({
          recipient: 'user-1',
          title: 'Deployment Queued',
          message: 'Deployment #1 is queued',
          category: 'deployment',
          type: 'info',
          unread: true,
        })
      );
      expect(res).toEqual(mockCreated);
    });

    test('createNotification returns null if missing recipient, title, or message', async () => {
      const res = await NotificationService.createNotification({
        recipient: null,
        title: 'Test',
      });

      expect(res).toBeNull();
      expect(Notification.create).not.toHaveBeenCalled();
    });
  });

  describe('2. Notification Retrieval & Isolation', () => {
    test('getUserNotifications returns paginated results scoped to recipient', async () => {
      const mockNotifs = [
        {
          _id: new mongoose.Types.ObjectId('60c72b2f9b1d8b2bad000001'),
          recipient: 'user-1',
          title: 'Deployment Success',
          message: 'Ready',
          type: 'success',
          category: 'deployment',
          projectName: 'my-app',
          createdAt: new Date('2026-08-20T10:00:00Z'),
          unread: true,
        },
      ];

      Notification.countDocuments = jest
        .fn()
        .mockResolvedValueOnce(1) // total
        .mockResolvedValueOnce(1); // unreadCount

      const mockQueryChain = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockNotifs),
      };
      Notification.find = jest.fn().mockReturnValue(mockQueryChain);

      const result = await NotificationService.getUserNotifications('user-1', {
        page: 1,
        limit: 20,
        category: 'deployment',
        unread: true,
      });

      expect(Notification.find).toHaveBeenCalledWith(
        expect.objectContaining({
          recipient: 'user-1',
          category: 'deployment',
          unread: true,
        })
      );
      expect(result.notifications).toHaveLength(1);
      expect(result.notifications[0].title).toBe('Deployment Success');
      expect(result.unreadCount).toBe(1);
      expect(result.pagination.total).toBe(1);
    });

    test('getUnreadCount returns number of unread notifications for user', async () => {
      Notification.countDocuments = jest.fn().mockResolvedValue(3);

      const count = await NotificationService.getUnreadCount('user-1');

      expect(Notification.countDocuments).toHaveBeenCalledWith({
        recipient: 'user-1',
        unread: true,
      });
      expect(count).toBe(3);
    });
  });

  describe('3. Read Status Mutation', () => {
    test('markAsRead updates notification to unread: false and sets readAt', async () => {
      const mockDoc = {
        _id: 'notif-1',
        recipient: 'user-1',
        unread: true,
        readAt: null,
        save: jest.fn().mockResolvedValue(true),
      };

      Notification.findOne = jest.fn().mockResolvedValue(mockDoc);

      const res = await NotificationService.markAsRead('user-1', 'notif-1');

      expect(Notification.findOne).toHaveBeenCalledWith({
        _id: 'notif-1',
        recipient: 'user-1',
      });
      expect(mockDoc.unread).toBe(false);
      expect(mockDoc.readAt).toBeInstanceOf(Date);
      expect(mockDoc.save).toHaveBeenCalled();
      expect(res.unread).toBe(false);
    });

    test('markAsRead throws 404 if notification does not exist or belong to user', async () => {
      Notification.findOne = jest.fn().mockResolvedValue(null);

      await expect(NotificationService.markAsRead('user-1', 'foreign-notif')).rejects.toThrow(
        'Notification not found'
      );
    });

    test('markAllAsRead updates all unread notifications for user', async () => {
      Notification.updateMany = jest.fn().mockResolvedValue({ modifiedCount: 5 });

      const res = await NotificationService.markAllAsRead('user-1');

      expect(Notification.updateMany).toHaveBeenCalledWith(
        { recipient: 'user-1', unread: true },
        expect.objectContaining({
          $set: expect.objectContaining({ unread: false }),
        })
      );
      expect(res.success).toBe(true);
    });
  });

  describe('4. Notification Deletion', () => {
    test('deleteNotification deletes owned notification', async () => {
      Notification.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });

      const res = await NotificationService.deleteNotification('user-1', 'notif-1');

      expect(Notification.deleteOne).toHaveBeenCalledWith({
        _id: 'notif-1',
        recipient: 'user-1',
      });
      expect(res.success).toBe(true);
    });

    test('deleteNotification throws 404 if notification not owned by user', async () => {
      Notification.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 0 });

      await expect(NotificationService.deleteNotification('user-1', 'notif-foreign')).rejects.toThrow(
        'Notification not found'
      );
    });

    test('clearAllNotifications deletes all notifications for user', async () => {
      Notification.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 10 });

      const res = await NotificationService.clearAllNotifications('user-1');

      expect(Notification.deleteMany).toHaveBeenCalledWith({ recipient: 'user-1' });
      expect(res.success).toBe(true);
    });
  });
});
