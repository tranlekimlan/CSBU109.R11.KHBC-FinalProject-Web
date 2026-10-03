import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/student-dashboard', label: 'Tổng quan', icon: 'fa-house' },
    { path: '/create-report', label: 'Báo sự cố mới', icon: 'fa-plus-circle' },
    { path: '/my-reports', label: 'Báo cáo của tôi', icon: 'fa-clipboard-list' },
    { path: '/notifications', label: 'Thông báo', icon: 'fa-bell' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <a href="#" className="logo-area" onClick={(e) => { e.preventDefault(); navigate('/student-dashboard'); }}>
        <i className="fa-solid fa-wrench" style={{ fontSize: '24px', color: '#14b8a6', marginRight: '12px' }}></i>
        <div className="logo-text">
          <h1>QFix</h1>
          <p>QSVN</p>
        </div>
      </a>

      <nav className="menu-area">
        {menuItems.map((item) => (
          <a
            key={item.path}
            href="#"
            className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); navigate(item.path); }}
          >
            <i className={`fa-solid ${item.icon}`}></i> {item.label}
          </a>
        ))}
      </nav>

      <div className="logout-area">
        <a href="#" className="logout-btn" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>
          <i className="fa-solid fa-arrow-right-from-bracket" style={{ marginRight: '10px' }}></i> Đăng xuất
        </a>
      </div>
    </aside>
  );
}
