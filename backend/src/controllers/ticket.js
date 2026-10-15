const Ticket = require('../models/Ticket');

exports.createTicket = async (req, res) => {
  try {
    const { title, room, category, description, studentId } = req.body;

    const imageUrls = (req.files && Array.isArray(req.files)) 
                        ? req.files.map(file => file.path) 
                        : [];

    const newTicket = new Ticket({ title, room, category, description, studentId, imageUrls });
    await newTicket.save();
    
    res.status(201).json({ message: 'Tạo báo cáo thành công!', ticket: newTicket });
    
  } catch (error) {
    console.error("Lỗi khi tạo Ticket:", error.message);
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