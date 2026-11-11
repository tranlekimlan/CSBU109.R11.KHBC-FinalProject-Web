const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipientRole: { type: String, enum: ['student', 'worker'], required: true },
  type: {
    type: String,
    enum: [
      'report_created',   // Student: sau khi tạo báo cáo thành công
      'worker_assigned',  // Student: khi admin giao thợ cho vé của họ
      'status_update',    // Student: khi thợ cập nhật trạng thái
      'rating_sent',      // Student: sau khi gửi đánh giá thành công
      'new_task',         // Worker: khi admin giao việc mới
      'rating_received',  // Worker: khi sinh viên đánh giá công việc đã làm xong
      'task_closed'       // Worker: khi vé được đóng/hoàn thành
    ],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', default: null },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
