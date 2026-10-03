import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css';
import logoImg from '../../images/Logo.png';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    roomNumber: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }
    console.log('Đăng ký:', formData);
    // TODO: Gọi API đăng ký tại đây
    // navigate('/login');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="split-layout">
      {/* Nửa Trái: Form Đăng ký */}
      <div className="register-panel">

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
          <h2>Tạo tài khoản</h2>
          <p className="subtitle">Điền thông tin của bạn để bắt đầu sử dụng QFix.</p>

          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <label htmlFor="fullName">Họ và tên</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="VD: Nguyễn Văn A"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="input-row">
              <div className="input-group">
                <label htmlFor="studentId">Mã Sinh Viên</label>
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
                <label htmlFor="roomNumber">Số phòng (KTX)</label>
                <input
                  type="text"
                  id="roomNumber"
                  name="roomNumber"
                  placeholder="VD: A202"
                  value={formData.roomNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Tạo mật khẩu (ít nhất 6 ký tự)"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className="btn-submit">
              Đăng ký tài khoản
            </button>
          </form>

          <div className="login-link">
            Đã có tài khoản? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Đăng nhập tại đây</a>
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

export default RegisterPage;