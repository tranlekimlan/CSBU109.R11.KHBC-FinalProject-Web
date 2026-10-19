const Ticket = require('../models/Ticket');

//For student dashboard
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
    const tickets = await Ticket.find({ studentId }).sort({ createdAt: -1 }); // Mới nhất xếp lên đầu
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

//For admin dashboard
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
    const { status } = req.body;

    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { status },
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