const express = require('express');
const router = express.Router();
const notifController = require('../controllers/notification');

// Lấy tất cả thông báo của một user
router.get('/:userId', notifController.getNotifications);

// Đếm số thông báo chưa đọc (badge sidebar)
router.get('/:userId/unread-count', notifController.getUnreadCount);

// Đánh dấu một thông báo đã đọc
router.put('/:id/read', notifController.markAsRead);

// Đánh dấu TẤT CẢ đã đọc cho một user
router.put('/read-all/:userId', notifController.markAllAsRead);

// Xóa một thông báo
router.delete('/:id', notifController.deleteNotification);

module.exports = router;
