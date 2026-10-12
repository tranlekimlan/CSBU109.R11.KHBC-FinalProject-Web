const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket');

router.post('/create', ticketController.createTicket);
router.get('/student/:studentId', ticketController.getTicketsByStudent);

module.exports = router;