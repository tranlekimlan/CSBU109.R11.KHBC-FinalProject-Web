const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  room: { type: String, required: true},
  category: { type: String, required: true },
  description: { type: String, required: true },
  // THÊM 'assigned' vào danh sách enum
  status: { type: String, enum: ['pending', 'assigned', 'progress', 'resolved', 'archived'], default: 'pending' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },   
  imageUrls: [{ type: String}]
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);