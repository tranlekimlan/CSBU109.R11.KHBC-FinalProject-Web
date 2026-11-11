import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar/Sidebar'; // Hãy đảm bảo đường dẫn này chính xác
import Header from '../../../components/Header/Header';
// Import chung file CSS của Profile (Nếu bạn để WorkerPages ở thư mục khác, hãy sửa lại đường dẫn này)
import './WorkerPages.css'; 

export default function WorkerProfile() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const parsedUser = JSON.parse(user);
      
      // Chặn nếu không phải là worker
      if (parsedUser.role !== 'worker') {
        navigate('/login');
        return;
      }
      
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
      const response = await fetch(`http://localhost:5000/api/users/${currentUser._id || currentUser.id}`, {
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
      } else {
        alert('Có lỗi xảy ra khi lưu thông tin!');
      }
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
      alert('Không thể kết nối đến máy chủ!');
    }
  };

  if (!currentUser) {
    return <div>Đang tải thông tin...</div>;
  }

  // ==========================================
  // THUẬT TOÁN TẠO AVATAR CHỮ GIỐNG HỆT HEADER
  // ==========================================
  const avatarName = currentUser ? encodeURIComponent(currentUser.fullName) : 'Worker';
  const defaultAvatarUrl = `https://ui-avatars.com/api/?name=${avatarName}&background=e2e8f0&color=334155&size=150`;
  const avatarUrl = currentUser?.avatar || defaultAvatarUrl;

  return (
    <div className="app-container">
      <Sidebar role="worker" />
      
      <main className="main-content">
        <Header title="Hồ Sơ Kỹ Thuật Viên" />
        
        <div className="dashboard-body">
          <div className="profile-card">
            
            <div className="profile-header">
              {/* Khung avatar hoàn toàn tĩnh */}
              <div className="profile-avatar">
                <img 
                  src={avatarUrl} 
                  alt="Avatar" 
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                />
              </div>
              
              <div className="profile-info">
                <h2>{currentUser.fullName}</h2>
                <p>Kỹ thuật viên ({currentUser.username})</p>
              </div>
            </div>

            {!isEditing ? (
              <>
                <div className="profile-details">
                  <div className="detail-row">
                    <label>Số điện thoại liên hệ</label>
                    <span>{currentUser.phone || 'Chưa cập nhật'}</span>
                  </div>
                  
                  <div className="detail-row">
                    <label>Chuyên môn sửa chữa</label>
                    <span>{currentUser.specialty || 'Chưa cập nhật'}</span>
                  </div>

                  <div className="detail-row">
                    <label>Ngày gia nhập đội ngũ</label>
                    <span>{currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</span>
                  </div>
                </div>

              </>
            ) : (
              <div className="form-box">
                  <div className="form-group">
                    <label>Họ và tên Kỹ thuật viên</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName || ''}
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
                  
                  <div className="form-group">
                    <label>Chuyên môn (Ví dụ: Điện, Nước, Mộc)</label>
                    <input
                      type="text"
                      name="specialty"
                      value={formData.specialty || ''}
                      onChange={handleChange}
                    />
                  </div>

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