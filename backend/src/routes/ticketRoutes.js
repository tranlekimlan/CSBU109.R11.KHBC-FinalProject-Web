const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket');
const upload = require('../middleware/upload');

router.post('/create', upload.array('images', 5), ticketController.createTicket); 
router.get('/student/:studentId', ticketController.getTicketsByStudent);

router.get('/', ticketController.getAllTickets);
router.put('/:id', ticketController.updateTicketStatus);

module.exports = router;