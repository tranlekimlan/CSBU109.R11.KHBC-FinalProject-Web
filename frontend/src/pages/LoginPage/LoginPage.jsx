import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './login.css';
import logoImg from '../../images/Logo.png';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 1. Lấy role từ trang chọn vai trò gửi sang (mặc định là student nếu lỡ truy cập trực tiếp url /login)
  const userRole = location.state?.role || 'student';

  // 2. TẠO BỘ TỪ ĐIỂN TEXT TỰ ĐỘNG THEO VAI TRÒ
  const roleConfig = {
    student: {
      title: "Đăng nhập Sinh viên",
      subtitle: "Dành cho sinh viên KTX báo cáo sự cố.",
      inputLabel: "Mã Sinh Viên / Tên đăng nhập",
      inputPlaceholder: "VD: 20231234"
    },
    worker: {
      title: "Đăng nhập Thợ sửa chữa",
      subtitle: "Dành cho nhân viên kỹ thuật tiếp nhận công việc.",
      inputLabel: "Mã Nhân Viên",
      inputPlaceholder: "VD: NV0123"
    },
    admin: {
      title: "Đăng nhập Quản trị viên",
      subtitle: "Hệ thống điều hành và quản lý QFix.",
      inputLabel: "Email / Tên đăng nhập quản trị",
      inputPlaceholder: "admin@qfix.edu.vn"
    }
  };

  const currentConfig = roleConfig[userRole];

  // 3. Đổi 'studentId' thành 'username' cho dùng chung được mọi vai trò
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Gửi kèm role vào data để backend dễ phân loại sau này
    console.log('Đăng nhập:', { ...formData, role: userRole });
    
    // ĐIỀU HƯỚNG DỰA TRÊN VAI TRÒ
    if (userRole === 'admin') {
      navigate('/admin-dashboard');
    } else if (userRole === 'worker') {
      navigate('/worker-dashboard');
    } else {
      navigate('/student-dashboard');
    }
  };

  const handleBack = () => {
    navigate('/select-role'); // Đổi nút back về lại trang chọn vai trò
  };

  return (
    <div className="split-layout">
      {/* Nửa Trái: Form Đăng nhập */}
      <div className="login-panel">
        <button onClick={handleBack} className="back-link">
          <i className="fa-solid fa-arrow-left"></i> Quay lại
        </button>

        {/* Logo */}
        <div className="logo-container" onClick={() => navigate('/')}>
          <img src={logoImg} alt="Logo QFix" className="logo-img" />
          <div className="logo-text">
            <h1>QFix</h1>
            <p>QSVN</p>
          </div>
        </div>

        {/* Nội dung Form */}
        <div className="form-container" style={{ border: 'none', boxShadow: 'none', background: 'transparent', padding: 0 }}>
          
          {/* HIỂN THỊ TEXT ĐỘNG TỪ BỘ CẤU HÌNH */}
          <h2>{currentConfig.title}</h2>
          <p className="subtitle">{currentConfig.subtitle}</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">{currentConfig.inputLabel}</label>
              <input
                type="text"
                id="username"
                name="username" // Đã đổi name thành username
                placeholder={currentConfig.inputPlaceholder}
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleInputChange}
                />
                Ghi nhớ tài khoản
              </label>
              <a href="#" className="forgot-password">Quên mật khẩu?</a>
            </div>

            <button type="submit" className="btn-submit">
              Đăng nhập vào hệ thống
            </button>
          </form>

          {/* ĐIỀU KIỆN ẨN HIỆN: Chỉ hiển thị nút đăng ký nếu là Sinh viên */}
          {userRole === 'student' && (
            <div className="register-link">
              Chưa có tài khoản? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Đăng ký ngay</a>
            </div>
          )}
          
        </div>
      </div>

      {/* Nửa Phải: Ảnh nền */}
      <div className="image-panel">
        <div className="image-overlay"></div>
      </div>
    </div>
  );
}

export default LoginPage;