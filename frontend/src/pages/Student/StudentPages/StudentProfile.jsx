import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar/Sidebar';
import Header from '../../../components/Header/Header';
import './StudentPages.css';

export default function StudentProfile() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const parsedUser = JSON.parse(user);
      setCurrentUser(parsedUser);
      setFormData(parsedUser);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        setIsEditing(false);
        alert('Cập nhật thông tin thành công!');
      }
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
      alert('Có lỗi xảy ra!');
    }
  };

  if (!currentUser) {
    return <div>Đang tải...</div>;
  }

  // ==========================================
  // THUẬT TOÁN TẠO AVATAR CHỮ GIỐNG HỆT HEADER
  // ==========================================
  const avatarName = currentUser ? encodeURIComponent(currentUser.fullName) : 'User';
  // Dùng đúng màu nền (e2e8f0) và màu chữ (334155) của Header. Có thêm size=150 để ảnh to rõ nét.
  const defaultAvatarUrl = `https://ui-avatars.com/api/?name=${avatarName}&background=e2e8f0&color=334155&size=150`;
  const avatarUrl = currentUser?.avatar || defaultAvatarUrl;

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header title="Thông Tin Cá Nhân" />
        <div className="dashboard-body">
          <div className="profile-card">
            
            <div className="profile-header">
              {/* Khung avatar hoàn toàn tĩnh, không có tính năng upload hay thay đổi hình */}
              <div className="profile-avatar">
                <img 
                  src={avatarUrl} 
                  alt="Avatar" 
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                />
              </div>
              
              <div className="profile-info">
                <h2>{currentUser.fullName}</h2>
                <p>{currentUser.role === 'student' ? 'Sinh viên' : currentUser.role === 'admin' ? 'Quản lý' : 'Kỹ thuật viên'}</p>
              </div>
            </div>

            {!isEditing ? (
              <>
                <div className="profile-details">
                  {currentUser.room && (
                    <div className="detail-row">
                      <label>Phòng KTX</label>
                      <span>{currentUser.room}</span>
                    </div>
                  )}
                  <div className="detail-row">
                    <label>Ngày tham gia</label>
                    {/* Đã xử lý lỗi Invalid Date bằng cách check xem createdAt có tồn tại hay không */}
                    <span>{currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</span>
                  </div>
                  <div className="detail-row">
                    <label>Khoá Học</label>
                    <span>{currentUser.course || 'Chưa cập nhật'}</span>
                  </div>
                </div>

                <button className="btn-primary" onClick={() => setIsEditing(true)}>
                  <i className="fa-solid fa-edit"></i> Chỉnh sửa thông tin
                </button>
              </>
            ) : (
              <div className="form-box">
                  <div className="form-group">
                    <label>Họ và tên</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName || ''}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Số điện thoại</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                    />
                  </div>

                  {currentUser.room && (
                    <div className="form-group">
                      <label>Phòng KTX</label>
                      <input
                        type="text"
                        name="room"
                        value={formData.room || ''}
                        onChange={handleChange}
                      />
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                    <button className="btn-primary" onClick={handleSave}>
                      <i className="fa-solid fa-save"></i> Lưu
                    </button>
                    <button className="btn-secondary" onClick={() => {
                      setIsEditing(false);
                      setFormData(currentUser);
                    }}>
                      <i className="fa-solid fa-xmark"></i> Hủy
                    </button>
                  </div>
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}