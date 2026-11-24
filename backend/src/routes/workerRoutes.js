const express = require('express');
const router = express.Router();
const workerController = require('../controllers/worker');

/**
 * @swagger
 * /api/workers:
 *   get:
 *     summary: Lấy danh sách tất cả Thợ (Kỹ thuật viên)
 *     tags: [Workers]
 *     responses:
 *       200:
 *         description: Danh sách kỹ thuật viên
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', workerController.getAllWorkers);

/**
 * @swagger
 * /api/workers:
 *   post:
 *     summary: Thêm kỹ thuật viên mới (Tự động sinh mã NV & mật khẩu mặc định 123)
 *     tags: [Workers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - phone
 *               - specialty
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Trần Văn Thợ"
 *               email:
 *                 type: string
 *                 example: "thotran@qfix.vn"
 *               phone:
 *                 type: string
 *                 example: "0912345678"
 *               specialty:
 *                 type: string
 *                 example: "Điện / Ánh sáng"
 *     responses:
 *       201:
 *         description: Thêm thợ thành công
 */
router.post('/', workerController.createWorker);

/**
 * @swagger
 * /api/workers/{id}:
 *   put:
 *     summary: Cập nhật thông tin kỹ thuật viên
 *     tags: [Workers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId của thợ
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Trần Văn Thợ"
 *               email:
 *                 type: string
 *                 example: "thotran@qfix.vn"
 *               phone:
 *                 type: string
 *                 example: "0987654321"
 *               specialty:
 *                 type: string
 *                 example: "Hệ thống Nước"
 *     responses:
 *       200:
 *         description: Cập nhật thông tin thợ thành công
 */
router.put('/:id', workerController.updateWorker);

/**
 * @swagger
 * /api/workers/{id}:
 *   delete:
 *     summary: Xóa kỹ thuật viên khỏi hệ thống
 *     tags: [Workers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId của thợ cần xóa
 *     responses:
 *       200:
 *         description: Đã xóa thợ
 */
router.delete('/:id', workerController.deleteWorker);

module.exports = router;