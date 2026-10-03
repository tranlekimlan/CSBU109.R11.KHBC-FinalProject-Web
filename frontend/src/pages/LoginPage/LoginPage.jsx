import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import logoImg from '../../images/Logo.png';

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentId: '',
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
    console.log('Đăng nhập:', formData);
    // TODO: Gọi API đăng nhập tại đây
    // navigate('/dashboard');
  };

  const handleBack = () => {
    navigate('/');
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
        <div className="form-container">
          <h2>Đăng nhập</h2>
          <p className="subtitle">Vui lòng nhập tài khoản để truy cập hệ thống.</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="studentId">Mã Sinh Viên / Tên đăng nhập</label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                placeholder="VD: 20231234"
                value={formData.studentId}
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

          <div className="register-link">
            Chưa có tài khoản? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Đăng ký ngay</a>
          </div>
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
