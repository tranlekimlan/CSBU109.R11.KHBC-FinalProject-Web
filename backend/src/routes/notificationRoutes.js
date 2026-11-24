const express = require('express');
const router = express.Router();
const notifController = require('../controllers/notification');

/**
 * @swagger
 * /api/notifications/{userId}:
 *   get:
 *     summary: Lấy 50 thông báo gần nhất của một User
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId của người nhận (Student hoặc Worker)
 *     responses:
 *       200:
 *         description: Danh sách thông báo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 */
router.get('/:userId', notifController.getNotifications);

/**
 * @swagger
 * /api/notifications/{userId}/unread-count:
 *   get:
 *     summary: Đếm số thông báo chưa đọc (hiển thị badge trên giao diện)
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Số lượng thông báo chưa đọc
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 3
 */
router.get('/:userId/unread-count', notifController.getUnreadCount);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   put:
 *     summary: Đánh dấu một thông báo là đã đọc
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId của thông báo
 *     responses:
 *       200:
 *         description: Đã đánh dấu là đã đọc
 */
router.put('/:id/read', notifController.markAsRead);

/**
 * @swagger
 * /api/notifications/read-all/{userId}:
 *   put:
 *     summary: Đánh dấu tất cả thông báo của User là đã đọc
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId của User
 *     responses:
 *       200:
 *         description: Đã đánh dấu tất cả là đã đọc
 */
router.put('/read-all/:userId', notifController.markAllAsRead);

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Xóa một thông báo
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId của thông báo
 *     responses:
 *       200:
 *         description: Đã xóa thông báo
 */
router.delete('/:id', notifController.deleteNotification);

module.exports = router;