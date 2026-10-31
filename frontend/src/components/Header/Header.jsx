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

    // Lắng nghe sự thay đổi localStorage
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem('currentUser');
      if (updatedUser) {
        setCurrentUser(JSON.parse(updatedUser));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Tự động tạo link avatar dựa trên tên của user (VD: Nguyễn Văn A -> chữ N)
  // Nếu chưa load kịp thì để mặc định là 'User'
  const avatarName = currentUser ? encodeURIComponent(currentUser.fullName) : 'User';
  const defaultAvatarUrl = `https://ui-avatars.com/api/?name=${avatarName}&background=e2e8f0&color=334155`;
  const avatarUrl = currentUser?.avatar || defaultAvatarUrl;

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
              ? `Phòng: ${currentUser.room || 'N/A'} | MS: ${currentUser.username}`
              : 'Đang tải...'}
          </div>
        </div>

        {/* Hiển thị Avatar - ưu tiên avatar được upload, nếu không có thì dùng avatar mặc định */}
        <img src={avatarUrl} alt="Avatar" className="avatar" />
      </div>
    </header>
  );
}