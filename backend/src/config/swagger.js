const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'QFix - Hệ thống Quản lý & Báo cáo Sự cố Cơ sở Vật chất API',
      version: '1.0.0',
      description:
        'Tài liệu đặc tả RESTful API cho hệ thống QFix (MERN Stack), phục vụ 3 phân hệ: Sinh viên (Student), Kỹ thuật viên (Worker) và Ban quản lý (Admin).',
    },
    servers: [
      {
        url: 'https://csbu109-r11-khbc-finalproject-web.onrender.com',
        description: 'Production Server (Render)',
      },
      {
        url: 'http://localhost:5000',
        description: 'Local Development Server',
      },
    ],
    tags: [
      { name: 'Auth', description: 'Xác thực tài khoản (Đăng ký, Đăng nhập)' },
      { name: 'Tickets', description: 'Quản lý báo cáo sự cố, phân công & đánh giá' },
      { name: 'Workers', description: 'Quản lý danh sách kỹ thuật viên (Admin)' },
      { name: 'Notifications', description: 'Hệ thống thông báo thời gian thực' },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '6741a2b3c4d5e6f7a8b9c0d1' },
            username: { type: 'string', example: '22520001' },
            fullName: { type: 'string', example: 'Nguyễn Văn A' },
            role: { type: 'string', enum: ['student', 'worker', 'admin'], example: 'student' },
            room: { type: 'string', nullable: true, example: 'A202' },
            phone: { type: 'string', nullable: true, example: '0901234567' },
            specialty: { type: 'string', nullable: true, example: 'Điện / Ánh sáng' },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Ticket: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '6741b5c6d7e8f9a0b1c2d3e4' },
            title: { type: 'string', example: 'Quạt trần kêu to' },
            room: { type: 'string', example: 'A202' },
            category: { type: 'string', example: 'Điện / Ánh sáng' },
            description: { type: 'string', example: 'Quạt quay chậm và phát tiếng ồn lớn từ sáng nay.' },
            status: {
              type: 'string',
              enum: ['pending', 'assigned', 'progress', 'resolved', 'archived'],
              example: 'pending',
            },
            studentId: { type: 'string', example: '6741a2b3c4d5e6f7a8b9c0d1' },
            workerId: { type: 'string', nullable: true, example: null },
            imageUrls: {
              type: 'array',
              items: { type: 'string' },
              example: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
            },
            rating: {
              type: 'object',
              properties: {
                score: { type: 'integer', minimum: 1, maximum: 5, nullable: true, example: 5 },
                comment: { type: 'string', nullable: true, example: 'Thợ sửa rất nhiệt tình!' },
                ratedAt: { type: 'string', format: 'date-time', nullable: true },
              },
            },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Notification: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '6741c8d9e0f1a2b3c4d5e6f7' },
            recipientId: { type: 'string', example: '6741a2b3c4d5e6f7a8b9c0d1' },
            recipientRole: { type: 'string', enum: ['student', 'worker'], example: 'student' },
            type: {
              type: 'string',
              enum: [
                'report_created',
                'worker_assigned',
                'status_update',
                'rating_sent',
                'new_task',
                'rating_received',
                'task_closed',
              ],
              example: 'report_created',
            },
            title: { type: 'string', example: 'Báo cáo đã được gửi thành công!' },
            message: { type: 'string', example: 'Báo cáo "Quạt trần kêu to" tại phòng A202 đã được tiếp nhận.' },
            ticketId: { type: 'string', nullable: true, example: '6741b5c6d7e8f9a0b1c2d3e4' },
            isRead: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, '../routes/*.js').replace(/\\/g, '/')],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;