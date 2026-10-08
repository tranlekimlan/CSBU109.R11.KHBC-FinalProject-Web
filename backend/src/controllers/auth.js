const User = require('../models/User');

// ĐĂNG KÝ (Dành cho Sinh viên - Lưu mật khẩu bình thường)
exports.register = async (req, res) => {
  try {
    const { username, password, fullName, room } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Tài khoản này đã tồn tại!' });
    }

    const newUser = new User({
      username,
      password, // Lưu nguyên bản
      fullName,
      room,
      role: 'student'
    });

    await newUser.save();
    res.status(201).json({ message: 'Đăng ký tài khoản thành công!' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// ĐĂNG NHẬP
exports.login = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const user = await User.findOne({ username, role });
    if (!user) {
      return res.status(404).json({ message: 'Tài khoản không tồn tại hoặc chọn sai vai trò!' });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: 'Mật khẩu không chính xác!' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Tài khoản của bạn đã bị khóa!' });
    }

    res.status(200).json({
      message: 'Đăng nhập thành công!',
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        room: user.room
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};