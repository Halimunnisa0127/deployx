const express = require('express');
const { authenticate } = require('../../../middleware/auth.middleware');
const notificationController = require('../controllers/notification.controller');
const { asyncHandler } = require('../../../utils');

const router = express.Router();

router.use(authenticate);

router.get('/', asyncHandler(notificationController.getNotifications));
router.get('/unread-count', asyncHandler(notificationController.getUnreadCount));
router.patch('/read-all', asyncHandler(notificationController.markAllAsRead));
router.patch('/:id/read', asyncHandler(notificationController.markAsRead));
router.delete('/', asyncHandler(notificationController.clearAllNotifications));
router.delete('/:id', asyncHandler(notificationController.deleteNotification));

module.exports = router;
