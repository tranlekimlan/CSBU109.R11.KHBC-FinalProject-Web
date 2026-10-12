const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket');
const upload = require('../middleware/upload'); // Phải import middleware ở đây

// CHÚ Ý: Chữ 'images' ở đây PHẢI KHỚP với chữ 'images' ở Frontend
router.post('/create', upload.array('images', 5), ticketController.createTicket); 
router.get('/student/:studentId', ticketController.getTicketsByStudent);

module.exports = router;