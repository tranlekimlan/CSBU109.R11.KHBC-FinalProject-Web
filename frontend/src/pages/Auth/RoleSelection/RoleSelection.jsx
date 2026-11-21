import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './role-selection.css';

function RoleSelection() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const roles = [
    { id: 'student', title: 'Sinh viên', desc: 'Báo cáo sự cố KTX', icon: 'fa-user-graduate' },
    { id: 'worker', title: 'Thợ sửa chữa', desc: 'Tiếp nhận & xử lý', icon: 'fa-wrench' },
    { id: 'admin', title: 'Quản lý / Admin', desc: 'Điều phối hệ thống', icon: 'fa-shield-halved' }
  ];

  const handleSelectRole = (selectedRole) => {
    navigate('/login', { state: { role: selectedRole } });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === roles.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? roles.length - 1 : prev - 1));
  };

  return (
    <div className="role-layout">
      <div className="role-container">
        <h2>Bạn là ai?</h2>
        <p>Vui lòng chọn vai trò của bạn để truy cập hệ thống QFix</p>

        {/* Khung chứa các Thẻ và Mũi tên */}
        <div className="role-content">
          
          {/* Mũi tên trái (Chỉ hiện trên Mobile) */}
          <button className="nav-arrow prev-arrow" onClick={handlePrev}>
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          {/* Vùng chứa 3 thẻ */}
          <div className="role-cards">
            {roles.map((role, index) => (
              <div 
                key={role.id} 
                className={`role-card ${index === currentIndex ? 'active-card' : 'hidden-card'}`} 
                onClick={() => handleSelectRole(role.id)}
              >
                <i className={`fa-solid ${role.icon} role-icon`}></i>
                <h3>{role.title}</h3>
                <p className="role-desc">{role.desc}</p>
                <div className="click-hint">Chạm để chọn</div>
              </div>
            ))}
          </div>

          {/* Mũi tên phải (Chỉ hiện trên Mobile) */}
          <button className="nav-arrow next-arrow" onClick={handleNext}>
            <i className="fa-solid fa-chevron-right"></i>
          </button>

        </div>

        {/* Dấu chấm chỉ báo (Chỉ hiện trên Mobile) */}
        <div className="carousel-dots">
          {roles.map((_, idx) => (
            <span key={idx} className={`dot ${idx === currentIndex ? 'active' : ''}`} />
          ))}
        </div>

        <button className="back-btn" onClick={() => navigate('/')}>
          <i className="fa-solid fa-arrow-left"></i> Quay lại trang chủ
        </button>
      </div>
    </div>
  );
}

export default RoleSelection;