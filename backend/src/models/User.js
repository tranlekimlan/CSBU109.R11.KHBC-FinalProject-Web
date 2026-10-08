const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  role: { type: String, enum: ['student', 'worker', 'admin'], required: true },
  room: { type: String, default: null }, // Dành riêng cho sinh viên (Admin/Thợ sẽ là null)
  isActive: { type: Boolean, default: true } // Trạng thái tài khoản
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);