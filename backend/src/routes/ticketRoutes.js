const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket');
const upload = require('../middleware/upload');

/**
 * @swagger
 * /api/tickets/create:
 *   post:
 *     summary: Sinh viên tạo báo cáo sự cố mới (kèm tối đa 5 ảnh)
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - room
 *               - category
 *               - description
 *               - studentId
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Quạt trần kêu to"
 *               room:
 *                 type: string
 *                 example: "A202"
 *               category:
 *                 type: string
 *                 example: "Điện / Ánh sáng"
 *               description:
 *                 type: string
 *                 example: "Quạt quay yếu và phát tiếng kêu lớn"
 *               studentId:
 *                 type: string
 *                 example: "6741a2b3c4d5e6f7a8b9c0d1"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Chọn tối đa 5 file ảnh (JPG, PNG)
 *     responses:
 *       201:
 *         description: Tạo báo cáo thành công
 *       500:
 *         description: Lỗi server
 */
router.post('/create', upload.array('images', 5), ticketController.createTicket);

/**
 * @swagger
 * /api/tickets/student/{studentId}:
 *   get:
 *     summary: Lấy danh sách báo cáo của một Sinh viên
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId của sinh viên
 *     responses:
 *       200:
 *         description: Danh sách ticket của sinh viên
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 */
router.get('/student/:studentId', ticketController.getTicketsByStudent);

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Lấy toàn bộ danh sách sự cố (Dành cho Admin)
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: Danh sách tất cả ticket trong hệ thống
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 */
router.get('/', ticketController.getAllTickets);

/**
 * @swagger
 * /api/tickets/{id}:
 *   put:
 *     summary: Cập nhật trạng thái sự cố hoặc phân công Thợ
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId của ticket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, assigned, progress, resolved, archived]
 *                 example: "assigned"
 *               workerId:
 *                 type: string
 *                 example: "6741d9e0f1a2b3c4d5e6f7a8"
 *                 description: Truyền vào khi Admin giao việc cho thợ
 *     responses:
 *       200:
 *         description: Cập nhật ticket thành công
 *       404:
 *         description: Không tìm thấy báo cáo
 */
router.put('/:id', ticketController.updateTicketStatus);

/**
 * @swagger
 * /api/tickets/{id}:
 *   delete:
 *     summary: Xóa báo cáo sự cố
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId của ticket cần xóa
 *     responses:
 *       200:
 *         description: Đã xóa vé thành công
 *       404:
 *         description: Không tìm thấy vé để xóa
 */
router.delete('/:id', ticketController.deleteTicket);

/**
 * @swagger
 * /api/tickets/worker/{workerId}:
 *   get:
 *     summary: Lấy danh sách công việc được giao cho một Thợ
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: workerId
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId của thợ
 *     responses:
 *       200:
 *         description: Danh sách công việc của thợ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 */
router.get('/worker/:workerId', ticketController.getTicketsByWorker);

/**
 * @swagger
 * /api/tickets/{id}/rate:
 *   post:
 *     summary: Sinh viên đánh giá chất lượng sửa chữa (sau khi resolved)
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId của ticket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - score
 *             properties:
 *               score:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Sửa nhanh, sạch sẽ, rất hài lòng!"
 *     responses:
 *       200:
 *         description: Đánh giá thành công
 *       400:
 *         description: Điểm không hợp lệ hoặc sự cố chưa ở trạng thái resolved
 *       404:
 *         description: Không tìm thấy báo cáo
 */
router.post('/:id/rate', ticketController.rateTicket);

module.exports = router;