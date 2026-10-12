const Ticket = require('../models/Ticket');

// TẠO BÁO CÁO MỚI
exports.createTicket = async (req, res) => {
  try {
    const { title, category, description, studentId } = req.body;
    const newTicket = new Ticket({ title, category, description, studentId });
    await newTicket.save();
    res.status(201).json({ message: 'Tạo báo cáo thành công!', ticket: newTicket });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// LẤY DANH SÁCH LỖI ĐỂ HIỆN LÊN DASHBOARD
exports.getTicketsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params; 
    const tickets = await Ticket.find({ studentId }).sort({ createdAt: -1 }); // Mới nhất xếp lên đầu
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};