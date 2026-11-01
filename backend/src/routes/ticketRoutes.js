const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket');
const upload = require('../middleware/upload');

// Routes của Sinh viên
router.post('/create', upload.array('images', 5), ticketController.createTicket); 
router.get('/student/:studentId', ticketController.getTicketsByStudent);

// Routes của Admin
router.get('/', ticketController.getAllTickets);
router.put('/:id', ticketController.updateTicketStatus);
router.delete('/:id', ticketController.deleteTicket);

// THÊM: Routes của Thợ (Worker)
router.get('/worker/:workerId', ticketController.getTicketsByWorker);

module.exports = router;