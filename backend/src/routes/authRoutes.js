const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

// Định nghĩa 2 đường link (Endpoint)
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;