const Ticket = require('../models/Ticket');
const { createNotification } = require('./notification');

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

    // --- THÔNG BÁO: Báo cáo tạo thành công ---
    await createNotification({
      recipientId: studentId,
      recipientRole: 'student',
      type: 'report_created',
      title: 'Báo cáo đã được gửi thành công!',
      message: `Báo cáo "${title}" của bạn tại phòng ${room} đã được tiếp nhận. Ban quản lý sẽ xem xét và phân công thợ sớm nhất.`,
      ticketId: newTicket._id
    });

    res.status(201).json({ message: 'Tạo báo cáo thành công!', ticket: newTicket });
  } catch (error) {
    console.error("Lỗi khi tạo Ticket:", error.message);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.getTicketsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params; 
    const tickets = await Ticket.find({ studentId }).populate('workerId', 'fullName phone specialty').sort({ createdAt: -1 }); 
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
    const { status, workerId } = req.body;

    // Lấy vé cũ trước khi update để so sánh
    const oldTicket = await Ticket.findById(id);
    if (!oldTicket) {
      return res.status(404).json({ message: 'Không tìm thấy báo cáo này!' });
    }

    const updateData = { status };
    if (workerId) {
      updateData.workerId = workerId;
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(id, updateData, { new: true });

    // --- THÔNG BÁO: Admin giao thợ cho sinh viên ---
    if (workerId && status === 'assigned' && !oldTicket.workerId) {
      await createNotification({
        recipientId: updatedTicket.studentId,
        recipientRole: 'student',
        type: 'worker_assigned',
        title: 'Thợ đã được phân công cho báo cáo của bạn!',
        message: `Báo cáo "${updatedTicket.title}" tại phòng ${updatedTicket.room} đã được tiếp nhận và sẽ sớm được xử lý.`,
        ticketId: updatedTicket._id
      });

      // Thông báo cho thợ được nhận việc mới
      await createNotification({
        recipientId: workerId,
        recipientRole: 'worker',
        type: 'new_task',
        title: 'Bạn vừa được giao một công việc mới!',
        message: `Phòng ${updatedTicket.room}: "${updatedTicket.title}". Vui lòng kiểm tra chi tiết và bắt đầu xử lý sớm nhất.`,
        ticketId: updatedTicket._id
      });
    }

    // --- THÔNG BÁO: Thợ cập nhật trạng thái ---
    if (status === 'progress' && oldTicket.status !== 'progress') {
      await createNotification({
        recipientId: updatedTicket.studentId,
        recipientRole: 'student',
        type: 'status_update',
        title: 'Thợ đang xử lý báo cáo của bạn',
        message: `Báo cáo "${updatedTicket.title}" tại phòng ${updatedTicket.room} hiện đang được thợ sửa chữa. Chúng tôi sẽ thông báo khi hoàn thành.`,
        ticketId: updatedTicket._id
      });
    }

    if (status === 'resolved' && oldTicket.status !== 'resolved') {
      await createNotification({
        recipientId: updatedTicket.studentId,
        recipientRole: 'student',
        type: 'status_update',
        title: 'Báo cáo của bạn đã được giải quyết! ✅',
        message: `Sự cố "${updatedTicket.title}" tại phòng ${updatedTicket.room} đã được sửa xong. Bạn có thể đánh giá chất lượng công việc trong mục "Báo cáo của tôi".`,
        ticketId: updatedTicket._id
      });

      // Thông báo cho thợ: công việc đã hoàn thành
      if (updatedTicket.workerId) {
        await createNotification({
          recipientId: updatedTicket.workerId,
          recipientRole: 'worker',
          type: 'task_closed',
          title: 'Công việc đã được nghiệm thu!',
          message: `Sự cố "${updatedTicket.title}" tại phòng ${updatedTicket.room} đã được đánh dấu hoàn thành. Cảm ơn bạn đã làm việc hiệu quả!`,
          ticketId: updatedTicket._id
        });
      }
    }

    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// ===================================
// FOR WORKER DASHBOARD
// ===================================
exports.getTicketsByWorker = async (req, res) => {
  try {
    const { workerId } = req.params;
    const tickets = await Ticket.find({ workerId })
      .populate('studentId', 'fullName email phone room')
      .sort({ createdAt: -1 });
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

// ===================================
// RATING - SINH VIÊN ĐÁNH GIÁ
// ===================================
exports.rateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { score, comment } = req.body;

    if (!score || score < 1 || score > 5) {
      return res.status(400).json({ message: 'Điểm đánh giá phải từ 1 đến 5!' });
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Không tìm thấy báo cáo!' });
    }

    if (ticket.status !== 'resolved') {
      return res.status(400).json({ message: 'Chỉ có thể đánh giá sau khi sự cố đã được giải quyết!' });
    }

    const isUpdate = Boolean(ticket.rating && ticket.rating.score);

    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { rating: { score, comment: comment || '', ratedAt: new Date() } },
      { new: true }
    ).populate('workerId', 'fullName phone specialty');

    const stars = '⭐'.repeat(score);

    // Thông báo cho thợ: nhận được đánh giá
    if (ticket.workerId) {
      await createNotification({
        recipientId: ticket.workerId,
        recipientRole: 'worker',
        type: 'rating_received',
        title: isUpdate ? `Đánh giá vừa được cập nhật ${stars}` : `Bạn vừa nhận được đánh giá ${stars}`,
        message: `Sinh viên đã ${isUpdate ? 'cập nhật' : 'đánh giá'} ${score}/5 sao cho công việc tại phòng ${ticket.room}${comment ? `: "${comment}"` : '.'}`,
        ticketId: ticket._id
      });
    }

    // Thông báo cho sinh viên: đánh giá thành công
    await createNotification({
      recipientId: ticket.studentId,
      recipientRole: 'student',
      type: 'rating_sent',
      title: isUpdate ? 'Cập nhật đánh giá thành công! 🙏' : 'Đánh giá của bạn đã được ghi nhận! 🙏',
      message: `Cảm ơn bạn đã ${isUpdate ? 'cập nhật' : 'để lại'} ${score}/5 sao cho sự cố "${ticket.title}". Phản hồi của bạn giúp chúng tôi cải thiện dịch vụ.`,
      ticketId: ticket._id
    });

    res.status(200).json({ message: isUpdate ? 'Cập nhật đánh giá thành công!' : 'Đánh giá thành công!', ticket: updatedTicket });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};