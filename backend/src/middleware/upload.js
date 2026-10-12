const multer = require('multer');
const path = require('path');
const fs = require('fs');

// CÁCH AN TOÀN HƠN: Lấy thư mục gốc của project (nơi chứa package.json)
const rootDir = path.resolve(__dirname, '../../'); 
const uploadDir = path.join(rootDir, 'uploads');

// Kiểm tra và tạo thư mục nếu chưa tồn tại
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('📁 Đã tạo thư mục lưu ảnh:', uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Lưu vào thư mục vừa tạo
  },
  filename: function (req, file, cb) {
    // Đổi tên file: timestamp-random.ext
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

module.exports = multer({ storage: storage });