const express = require('express');
const router = express.Router();
const workerController = require('../controllers/worker');

// Cấu hình các đường dẫn API cho Thợ (Workers)
router.get('/', workerController.getAllWorkers);           // Lấy danh sách
router.post('/', workerController.createWorker);           // Thêm mới
router.put('/:id', workerController.updateWorker);         // Sửa
router.delete('/:id', workerController.deleteWorker);      // Xóa

module.exports = router;