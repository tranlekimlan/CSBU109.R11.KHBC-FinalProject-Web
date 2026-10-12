import React, { useState, useEffect } from 'react';
import './Header.css';

export default function Header({ title = 'Bảng điều khiển' }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Lấy thông tin user từ bộ nhớ trình duyệt
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // Tự động tạo link avatar dựa trên tên của user (VD: Nguyễn Văn A -> chữ N)
  // Nếu chưa load kịp thì để mặc định là 'User'
  const avatarName = currentUser ? encodeURIComponent(currentUser.fullName) : 'User';
  const avatarUrl = `https://ui-avatars.com/api/?name=${avatarName}&background=e2e8f0&color=334155`;

  return (
    <header className="topbar">
      <div className="page-title">{title}</div>

      <div className="user-profile">
        <div className="user-info">
          {/* Hiển thị Tên thật */}
          <div className="user-name">
            {currentUser ? currentUser.fullName : 'Đang tải...'}
          </div>
          
          {/* Hiển thị Số phòng và Mã sinh viên (chính là trường username) */}
          <div className="user-room">
            {currentUser 
              ? `Phòng: ${currentUser.room || 'N/A'} | SV: ${currentUser.username}` 
              : 'Đang tải...'}
          </div>
        </div>
        
        {/* Hiển thị Avatar động */}
        <img src={avatarUrl} alt="Avatar" className="avatar" />
      </div>
    </header>
  );
}