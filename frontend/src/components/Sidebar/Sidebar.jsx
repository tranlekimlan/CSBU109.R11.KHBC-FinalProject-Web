import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

// Thêm prop "role" để tự động biết đang đứng ở trang của ai. Mặc định là 'student'
export default function Sidebar({ role = 'student' }) {
  const navigate = useNavigate();
  const location = useLocation();

  // BỘ TỪ ĐIỂN MENU CHO TỪNG VAI TRÒ
  const menuConfig = {
    student: {
      dashboard: '/student-dashboard',
      items: [
        { path: '/student-dashboard', label: 'Tổng quan', icon: 'fa-house' },
        { path: '/create-report', label: 'Báo sự cố mới', icon: 'fa-plus-circle' },
        { path: '/my-reports', label: 'Báo cáo của tôi', icon: 'fa-clipboard-list' },
        { path: '/notifications', label: 'Thông báo', icon: 'fa-bell' }
      ]
    },
    admin: {
      dashboard: '/admin-dashboard',
      items: [
        { path: '/admin-dashboard', label: 'Tổng quan Quản trị', icon: 'fa-chart-pie' },
        { path: '/admin/all-tickets', label: 'Quản lý sự cố', icon: 'fa-list-check' },
        { path: '/manage-workers', label: 'Quản lý nhân sự', icon: 'fa-users-gear' },
        { path: '/admin/reports', label: 'Thống kê & Báo cáo', icon: 'fa-file-contract' }
      ]
    },
    worker: {
      dashboard: '/worker-dashboard',
      items: [
        { path: '/worker-dashboard', label: 'Tổng quan', icon: 'fa-house' },
        { path: '/worker/tasks', label: 'Việc được giao', icon: 'fa-toolbox' },
        { path: '/worker/history', label: 'Lịch sử sửa chữa', icon: 'fa-clock-rotate-left' }
      ]
    }
  };

  const currentMenu = menuConfig[role];
  const isActive = (path) => location.pathname === path;

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
            // Gắn class active tùy theo role để đổi màu tương ứng
            className={`menu-item ${isActive(item.path) ? `active active-${role}` : ''}`}
            onClick={(e) => { e.preventDefault(); navigate(item.path); }}
          >
            <i className={`fa-solid ${item.icon}`}></i> {item.label}
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