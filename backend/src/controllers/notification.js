const Notification = require('../models/Notification');

// LẤY TẤT CẢ THÔNG BÁO CỦA MỘT USER
exports.getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ recipientId: userId })
      .sort({ createdAt: -1 })
      .limit(50); // Giới hạn 50 thông báo gần nhất
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// ĐẾM SỐ THÔNG BÁO CHƯA ĐỌC (Dùng cho badge sidebar)
exports.getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;
    const count = await Notification.countDocuments({ recipientId: userId, isRead: false });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// ĐÁNH DẤU MỘT THÔNG BÁO LÀ ĐÃ ĐỌC
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { isRead: true });
    res.status(200).json({ message: 'Đã đánh dấu là đã đọc' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// ĐÁNH DẤU TẤT CẢ LÀ ĐÃ ĐỌC CHO MỘT USER
exports.markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    await Notification.updateMany({ recipientId: userId, isRead: false }, { isRead: true });
    res.status(200).json({ message: 'Đã đánh dấu tất cả là đã đọc' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// XÓA MỘT THÔNG BÁO
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);
    res.status(200).json({ message: 'Đã xóa thông báo' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// HELPER: Tạo thông báo nội bộ (dùng bởi ticket controller)
exports.createNotification = async ({ recipientId, recipientRole, type, title, message, ticketId }) => {
  try {
    const notif = new Notification({ recipientId, recipientRole, type, title, message, ticketId });
    await notif.save();
  } catch (error) {
    console.error('Lỗi khi tạo thông báo:', error.message);
  }
};
