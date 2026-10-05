import React from 'react';
import { useNavigate } from 'react-router-dom';
import './role-selection.css';

function RoleSelection() {
  const navigate = useNavigate();

  // Hàm chuyển hướng sang Login và mang theo vai trò (role)
  const handleSelectRole = (selectedRole) => {
    navigate('/login', { state: { role: selectedRole } });
  };

  return (
    <div className="role-layout">
      <div className="role-container">
        <h2>Bạn là ai?</h2>
        <p>Vui lòng chọn vai trò của bạn để truy cập hệ thống QFix</p>

        <div className="role-cards">
          <div className="role-card" onClick={() => handleSelectRole('student')}>
            <i className="fa-solid fa-user-graduate role-icon"></i>
            <h3>Sinh viên</h3>
            <p style={{fontSize: '13px', color: '#64748b', margin: 0}}>Báo cáo sự cố KTX</p>
          </div>

          <div className="role-card" onClick={() => handleSelectRole('worker')}>
            <i className="fa-solid fa-wrench role-icon"></i>
            <h3>Thợ sửa chữa</h3>
            <p style={{fontSize: '13px', color: '#64748b', margin: 0}}>Tiếp nhận & xử lý</p>
          </div>

          <div className="role-card" onClick={() => handleSelectRole('admin')}>
            <i className="fa-solid fa-shield-halved role-icon"></i>
            <h3>Quản lý / Admin</h3>
            <p style={{fontSize: '13px', color: '#64748b', margin: 0}}>Điều phối hệ thống</p>
          </div>
        </div>

        <button className="back-btn" onClick={() => navigate('/')}>
          <i className="fa-solid fa-arrow-left"></i> Quay lại trang chủ
        </button>
      </div>
    </div>
  );
}

export default RoleSelection;