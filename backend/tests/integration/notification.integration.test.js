const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const User = require('../../src/modules/users/models/User');
const Notification = require('../../src/modules/notifications/models/Notification');
const { generateAccessToken } = require('../../src/utils/helpers/jwt.helper');


describe('In-App Notifications Integration Tests', () => {
  let mongoAvailable = false;
  let userA, userB;
  let tokenA, tokenB;
  let notifA1, notifA2, notifB1;

  beforeAll(async () => {
    try {
      if (mongoose.connection.readyState === 1) {
        mongoAvailable = true;
      } else if (process.env.MONGODB_URI) {
        await mongoose.connect(process.env.MONGODB_URI);
        mongoAvailable = true;
      }
    } catch (err) {
      console.warn('MongoDB not available for notifications integration test, skipping DB parts');
    }

    if (mongoAvailable) {
      await User.deleteMany({ email: { $in: ['notif_user_a@deployx.test', 'notif_user_b@deployx.test'] } });
      await Notification.deleteMany({});

      userA = await User.create({
        fullName: 'User A',
        email: 'notif_user_a@deployx.test',
        password: 'Password123!',
        role: 'user',
        isEmailVerified: true,
      });

      userB = await User.create({
        fullName: 'User B',
        email: 'notif_user_b@deployx.test',
        password: 'Password123!',
        role: 'user',
        isEmailVerified: true,
      });

      tokenA = generateAccessToken(userA._id.toString(), userA.role);
      tokenB = generateAccessToken(userB._id.toString(), userB.role);


      notifA1 = await Notification.create({
        recipient: userA._id,
        title: 'Project Created',
        message: 'Project alpha created',
        category: 'project',
        type: 'success',
        unread: true,
      });

      notifA2 = await Notification.create({
        recipient: userA._id,
        title: 'Deployment Ready',
        message: 'Deployment #1 is ready',
        category: 'deployment',
        type: 'success',
        unread: true,
      });

      notifB1 = await Notification.create({
        recipient: userB._id,
        title: 'User B Alert',
        message: 'Private message for User B',
        category: 'system',
        type: 'info',
        unread: true,
      });
    }
  });

  afterAll(async () => {
    if (mongoAvailable) {
      await User.deleteMany({ email: { $in: ['notif_user_a@deployx.test', 'notif_user_b@deployx.test'] } });
      await Notification.deleteMany({});
    }
  });

  describe('1. Authentication & Scoping Isolation', () => {
    test('GET /notifications returns 401 for unauthenticated request', async () => {
      const res = await request(app).get('/notifications');
      expect(res.status).toBe(401);
    });

    test('GET /notifications returns only own notifications for User A', async () => {
      if (!mongoAvailable) return;

      const res = await request(app)
        .get('/notifications')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.notifications).toHaveLength(2);
      expect(res.body.data.unreadCount).toBe(2);

      // Verify User B's notification is NOT visible to User A
      const titles = res.body.data.notifications.map((n) => n.title);
      expect(titles).toContain('Project Created');
      expect(titles).toContain('Deployment Ready');
      expect(titles).not.toContain('User B Alert');
    });

    test('GET /notifications/unread-count returns correct count', async () => {
      if (!mongoAvailable) return;

      const res = await request(app)
        .get('/notifications/unread-count')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.data.unreadCount).toBe(2);
    });
  });

  describe('2. Mutation & Authorization Protection', () => {
    test('PATCH /notifications/:id/read marks User A notification as read', async () => {
      if (!mongoAvailable) return;

      const res = await request(app)
        .patch(`/notifications/${notifA1._id}/read`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.data.unread).toBe(false);

      const unreadRes = await request(app)
        .get('/notifications/unread-count')
        .set('Authorization', `Bearer ${tokenA}`);
      expect(unreadRes.body.data.unreadCount).toBe(1);
    });

    test('PATCH /notifications/:id/read fails with 404 if User A tries to modify User B notification', async () => {
      if (!mongoAvailable) return;

      const res = await request(app)
        .patch(`/notifications/${notifB1._id}/read`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(404);
    });

    test('DELETE /notifications/:id fails with 404 if User A tries to delete User B notification', async () => {
      if (!mongoAvailable) return;

      const res = await request(app)
        .delete(`/notifications/${notifB1._id}`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(404);
    });

    test('PATCH /notifications/read-all marks all User A notifications as read', async () => {
      if (!mongoAvailable) return;

      const res = await request(app)
        .patch('/notifications/read-all')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);

      const unreadRes = await request(app)
        .get('/notifications/unread-count')
        .set('Authorization', `Bearer ${tokenA}`);
      expect(unreadRes.body.data.unreadCount).toBe(0);

      // Verify User B's unread status remains unaffected
      const unreadB = await request(app)
        .get('/notifications/unread-count')
        .set('Authorization', `Bearer ${tokenB}`);
      expect(unreadB.body.data.unreadCount).toBe(1);
    });

    test('DELETE /notifications/:id deletes owned notification', async () => {
      if (!mongoAvailable) return;

      const res = await request(app)
        .delete(`/notifications/${notifA1._id}`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);

      const listRes = await request(app)
        .get('/notifications')
        .set('Authorization', `Bearer ${tokenA}`);
      expect(listRes.body.data.notifications).toHaveLength(1);
    });

    test('DELETE /notifications clears all notifications for User A', async () => {
      if (!mongoAvailable) return;

      const res = await request(app)
        .delete('/notifications')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);

      const listRes = await request(app)
        .get('/notifications')
        .set('Authorization', `Bearer ${tokenA}`);
      expect(listRes.body.data.notifications).toHaveLength(0);

      // Verify User B still has their notification
      const listB = await request(app)
        .get('/notifications')
        .set('Authorization', `Bearer ${tokenB}`);
      expect(listB.body.data.notifications).toHaveLength(1);
    });
  });
});
