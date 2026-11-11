import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const API = 'http://localhost:5000/api';

// Thêm prop "role" để tự động biết đang đứng ở trang của ai. Mặc định là 'student'
export default function Sidebar({ role = 'student' }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  // BỘ TỪ ĐIỂN MENU CHO TỪNG VAI TRÒ
  const menuConfig = {
    student: {
      dashboard: '/student-dashboard',
      notifPath: '/notifications',
      items: [
        { path: '/student-dashboard', label: 'Tổng quan',          icon: 'fa-house' },
        { path: '/create-report',     label: 'Báo sự cố mới',      icon: 'fa-plus-circle' },
        { path: '/my-reports',        label: 'Báo cáo của tôi',    icon: 'fa-clipboard-list' },
        { path: '/complain',          label: 'Đánh giá công việc', icon: 'fa-star' },
        { path: '/notifications',     label: 'Thông báo',          icon: 'fa-bell', badge: true },
        { path: '/profile',           label: 'Thông tin cá nhân',  icon: 'fa-user' }
      ]
    },
    admin: {
      dashboard: '/admin-dashboard',
      notifPath: null,
      items: [
        { path: '/admin-dashboard',   label: 'Tổng quan Quản trị',  icon: 'fa-chart-pie' },
        { path: '/admin/all-tickets', label: 'Quản lý sự cố',       icon: 'fa-list-check' },
        { path: '/admin/complaints',  label: 'Quản lý đánh giá',    icon: 'fa-message' },
        { path: '/manage-workers',    label: 'Quản lý nhân sự',     icon: 'fa-users-gear' },
        { path: '/admin/reports',     label: 'Thống kê & Báo cáo',  icon: 'fa-file-contract' }
      ]
    },
    worker: {
      dashboard: '/worker-dashboard',
      notifPath: '/worker/notification',
      items: [
        { path: '/worker-dashboard',    label: 'Tổng quan',          icon: 'fa-house' },
        { path: '/worker/tasks',        label: 'Việc được giao',     icon: 'fa-toolbox' },
        { path: '/worker/complain',     label: 'Đánh giá của tôi',  icon: 'fa-star' },
        { path: '/worker/notification', label: 'Thông báo',          icon: 'fa-bell', badge: true },
        { path: '/worker/profile',      label: 'Thông tin cá nhân', icon: 'fa-user' }
      ]
    }
  };

  const currentMenu = menuConfig[role];
  const isActive = (path) => location.pathname === path;

  // ─── Fetch unread count for badge ─────────────────────
  const fetchUnreadCount = useCallback(async () => {
    const stored = localStorage.getItem('currentUser');
    if (!stored) return;
    const user    = JSON.parse(stored);
    const userId  = user.id || user._id;
    if (!userId || !currentMenu.notifPath) return;
    try {
      const res = await fetch(`${API}/notifications/${userId}/unread-count`);
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.count || 0);
      }
    } catch (_) {}
  }, [currentMenu.notifPath]);

  useEffect(() => {
    fetchUnreadCount();
    // Poll every 30s to keep badge in sync
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  return (
    <aside className={`sidebar sidebar-${role}`}>
      {/* Click vào logo sẽ bay về đúng trang chủ của role đó */}
      <a href="#" className="logo-area" onClick={(e) => { e.preventDefault(); navigate(currentMenu.dashboard); }}>
        <i className="fa-solid fa-wrench logo-icon"></i>
        <div className="logo-text">
          <h1>QFix</h1>
          <p>QSVN</p>
        </div>
      </a>

      <nav className="menu-area">
        {currentMenu.items.map((item) => (
          <a
            key={item.path}
            href="#"
            className={`menu-item ${isActive(item.path) ? `active active-${role}` : ''}`}
            onClick={(e) => { e.preventDefault(); navigate(item.path); }}
          >
            <i className={`fa-solid ${item.icon}`}></i>
            <span className="menu-label">{item.label}</span>
            {/* Red dot badge for notification items */}
            {item.badge && unreadCount > 0 && (
              <span className="notif-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
            )}
          </a>
        ))}
      </nav>

      <div className="logout-area">
        <a href="#" className="logout-btn" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
          <i className="fa-solid fa-arrow-right-from-bracket" style={{ marginRight: '10px' }}></i> Đăng xuất
        </a>
      </div>
    </aside>
  );
}