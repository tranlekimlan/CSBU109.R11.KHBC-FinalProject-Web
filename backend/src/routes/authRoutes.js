const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký tài khoản Sinh viên mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - fullName
 *               - room
 *             properties:
 *               username:
 *                 type: string
 *                 example: "22520123"
 *               password:
 *                 type: string
 *                 example: "123456"
 *               fullName:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *               room:
 *                 type: string
 *                 example: "A202"
 *     responses:
 *       201:
 *         description: Đăng ký tài khoản thành công
 *       400:
 *         description: Tài khoản đã tồn tại
 *       500:
 *         description: Lỗi server
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập hệ thống (Student / Worker / Admin)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 example: "22520123"
 *               password:
 *                 type: string
 *                 example: "123456"
 *               role:
 *                 type: string
 *                 enum: [student, worker, admin]
 *                 example: "student"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về thông tin user
 *       400:
 *         description: Mật khẩu không chính xác
 *       403:
 *         description: Tài khoản đã bị khóa
 *       404:
 *         description: Tài khoản không tồn tại hoặc sai vai trò
 */
router.post('/login', authController.login);

module.exports = router;