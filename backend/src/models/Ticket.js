const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  room: { type: String, required: true},
  category: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'progress', 'resolved'], default: 'pending' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ID của người gửi
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },    // ID của thợ sẽ sửa
  imageUrls: [{ type: String}]
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);