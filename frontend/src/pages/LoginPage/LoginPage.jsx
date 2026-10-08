import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './login.css';
import logoImg from '../../images/Logo.png';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const userRole = location.state?.role || 'student';

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

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false
  });

  // 1. THÊM STATE ĐIỀU KHIỂN POPUP
  const [popup, setPopup] = useState({ show: false, message: '' });
  const [errorMessage, setErrorMessage] = useState(''); // THÊM DÒNG NÀY

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Xóa lỗi cũ mỗi lần bấm đăng nhập

    try {
      // 1. Gửi data xuống Backend
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          role: userRole // Gửi kèm vai trò (student, worker, admin)
        }),
      });

      // 2. Nhận kết quả từ Backend
      const data = await response.json();

      if (response.ok) {
        // --- ĐĂNG NHẬP THÀNH CÔNG ---
        // Lưu thông tin người dùng vào Local Storage để dùng cho các trang Dashboard
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        
        // Điều hướng đúng theo route của bạn
        if (userRole === 'admin') {
          navigate('/admin-dashboard');
        } else if (userRole === 'worker') {
          navigate('/worker-dashboard');
        } else {
          navigate('/student-dashboard');
        }
      } else {
        // --- ĐĂNG NHẬP THẤT BẠI ---
        // Hiển thị lỗi do Backend gửi lên (VD: "Mật khẩu không chính xác!")
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error('Lỗi mạng:', error);
      setErrorMessage('Không thể kết nối đến máy chủ Backend!');
    }
  };

  const handleBack = () => {
    navigate('/select-role'); 
  };

  // 2. THÊM HÀM XỬ LÝ KHI BẤM QUÊN MẬT KHẨU
  const handleForgotPassword = (e) => {
    e.preventDefault(); // Chặn hành vi load lại trang của thẻ <a>
    if (userRole === 'admin') {
      setPopup({ show: true, message: 'Vui lòng truy cập thẳng vào cơ sở dữ liệu (MongoDB) để kiểm tra hoặc reset lại mật khẩu Quản trị viên!' });
    } else {
      setPopup({ show: true, message: 'Vui lòng liên hệ với Ban Quản lý KTX (Phòng Hành chính) và mang theo thẻ để được hỗ trợ cấp lại mật khẩu.' });
    }
  };

  return (
    <div className="split-layout">
      
      {/* 3. GIAO DIỆN POPUP BÁO LỖI */}
      {popup.show && (
        <div className="custom-popup-overlay">
          <div className="custom-popup-box">
            <div className="popup-icon">
              <i className="fa-solid fa-circle-info"></i>
            </div>
            <h3>Hỗ trợ khôi phục</h3>
            <p>{popup.message}</p>
            <button onClick={() => setPopup({ show: false, message: '' })} className="btn-close-popup">
              Đã hiểu
            </button>
          </div>
        </div>
      )}

      <div className="login-panel">
        <button onClick={handleBack} className="back-link">
          <i className="fa-solid fa-arrow-left"></i> Quay lại
        </button>

        <div className="logo-container" onClick={() => navigate('/')}>
          <img src={logoImg} alt="Logo QFix" className="logo-img" />
          <div className="logo-text">
            <h1>QFix</h1>
            <p>QSVN</p>
          </div>
        </div>

        <div className="form-container" style={{ border: 'none', boxShadow: 'none', background: 'transparent', padding: 0 }}>
          
          <h2>{currentConfig.title}</h2>
          <p className="subtitle">{currentConfig.subtitle}</p>

          {errorMessage && (
            <div style={{ color: '#dc2626', backgroundColor: '#fee2e2', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px', textAlign: 'center' }}>
              <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '5px' }}></i>
              {errorMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">{currentConfig.inputLabel}</label>
              <input
                type="text"
                id="username"
                name="username" 
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
              
              {/* 4. GẮN SỰ KIỆN CLICK VÀO CHỮ QUÊN MẬT KHẨU */}
              <a href="#" className="forgot-password" onClick={handleForgotPassword}>Quên mật khẩu?</a>
            </div>

            <button type="submit" className="btn-submit">
              Đăng nhập vào hệ thống
            </button>
          </form>

          {userRole === 'student' && (
            <div className="register-link">
              Chưa có tài khoản? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Đăng ký ngay</a>
            </div>
          )}
          
        </div>
      </div>

      <div className="image-panel">
        <div className="image-overlay"></div>
      </div>
    </div>
  );
}

export default LoginPage;