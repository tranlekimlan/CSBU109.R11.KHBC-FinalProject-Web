const Ticket = require('../models/Ticket');

// ===================================
// FOR STUDENT DASHBOARD
// ===================================
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

exports.getTicketsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params; 
    const tickets = await Ticket.find({ studentId }).sort({ createdAt: -1 }); 
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// ===================================
// FOR ADMIN DASHBOARD
// ===================================
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    // Lấy thêm workerId từ request body của Admin
    const { status, workerId } = req.body; 

    // Đóng gói dữ liệu cần update
    const updateData = { status };
    if (workerId) {
      updateData.workerId = workerId; // Chỉ cập nhật workerId khi Admin có gửi xuống
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      updateData,
      { new: true } 
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: 'Không tìm thấy báo cáo này!' });
    }

    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// ===================================
// FOR WORKER DASHBOARD (THÊM MỚI)
// ===================================
exports.getTicketsByWorker = async (req, res) => {
  try {
    const { workerId } = req.params;
    const tickets = await Ticket.find({ workerId }).sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTicket = await Ticket.findByIdAndDelete(id);
    
    if (!deletedTicket) {
      return res.status(404).json({ message: 'Không tìm thấy vé để xóa!' });
    }

    res.status(200).json({ message: 'Đã xác nhận và xóa vé thành công!' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};