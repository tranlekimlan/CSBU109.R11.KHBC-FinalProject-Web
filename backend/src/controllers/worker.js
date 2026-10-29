const User = require('../models/User'); // Gọi model User của bạn

// 1. LẤY DANH SÁCH THỢ
exports.getAllWorkers = async (req, res) => {
  try {
    // Chỉ tìm những tài khoản có role là 'worker'
    const workers = await User.find({ role: 'worker' }).sort({ createdAt: -1 });
    res.status(200).json(workers);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// 2. THÊM THỢ MỚI
exports.createWorker = async (req, res) => {
  try {
    const { fullName, email, phone, specialty } = req.body;
    
    // Tự động tạo username (Mã NV) và password mặc định
    const newWorker = new User({
      username: `NV${Math.floor(Math.random() * 1000)}`, // Ví dụ: NV4512
      password: '123', // Mật khẩu mặc định
      fullName,
      email,
      phone,
      specialty,
      role: 'worker',
      isActive: true
    });

    await newWorker.save();
    res.status(201).json({ message: 'Thêm thợ thành công', worker: newWorker });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// 3. SỬA THÔNG TIN THỢ
exports.updateWorker = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, phone, specialty } = req.body;

    const updatedWorker = await User.findByIdAndUpdate(
      id,
      { fullName, email, phone, specialty },
      { new: true }
    );

    res.status(200).json({ message: 'Cập nhật thành công', worker: updatedWorker });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// 4. XÓA THỢ
exports.deleteWorker = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'Đã xóa thợ' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};