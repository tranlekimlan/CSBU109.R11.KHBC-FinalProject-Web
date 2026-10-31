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

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newData = { ...currentUser, avatar: reader.result };
        localStorage.setItem('currentUser', JSON.stringify(newData));
        setCurrentUser(newData);
        setFormData(newData);
      };
      reader.readAsDataURL(file);
    }
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

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header title="Thông Tin Cá Nhân" />
        <div className="dashboard-body">
          <div className="profile-card">
            <div className="profile-header">
              {isEditing ? (
                <label htmlFor="avatar-input" style={{ cursor: 'pointer' }}>
                  <div className="profile-avatar upload-avatar">
                    {(formData.avatar || currentUser.avatar) ? (
                      <img src={formData.avatar || currentUser.avatar} alt="Avatar" />
                    ) : (
                      <>
                        <i className="fa-solid fa-user"></i>
                        <span className="upload-text">Bấm để thay ảnh</span>
                      </>
                    )}
                  </div>
                </label>
              ) : (
                <div className="profile-avatar">
                  {(formData.avatar || currentUser.avatar) ? (
                    <img src={formData.avatar || currentUser.avatar} alt="Avatar" />
                  ) : (
                    <i className="fa-solid fa-user"></i>
                  )}
                </div>
              )}
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
              <div className="profile-info">
                <h2>{currentUser.fullName}</h2>
                <p>{currentUser.role === 'student' ? 'Sinh viên' : currentUser.role === 'admin' ? 'Quản lý' : 'Kỹ thuật viên'}</p>
              </div>
            </div>

            {!isEditing ? (
              <>
                <div className="profile-details">
                  <div className="detail-row">
                    <label>Email</label>
                    <span>{currentUser.email}</span>
                  </div>
                  <div className="detail-row">
                    <label>Số điện thoại</label>
                    <span>{currentUser.phone || 'Chưa cập nhật'}</span>
                  </div>
                  {currentUser.room && (
                    <div className="detail-row">
                      <label>Phòng KTX</label>
                      <span>{currentUser.room}</span>
                    </div>
                  )}
                  <div className="detail-row">
                    <label>Ngày tham gia</label>
                    <span>{new Date(currentUser.createdAt).toLocaleDateString('vi-VN')}</span>
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
