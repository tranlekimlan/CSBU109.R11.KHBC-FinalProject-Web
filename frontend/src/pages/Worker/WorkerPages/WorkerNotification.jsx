import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar/Sidebar'; // Đảm bảo đường dẫn này chính xác
import Header from '../../../components/Header/Header';
// Import chung file CSS của mục Notifications, nếu bạn tách CSS cho thợ thì nhớ trỏ lại
import '../../Student/Notifications/Notifications.css'; 

export default function WorkerNotifications() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  
  // Dữ liệu mẫu (sau này bạn sẽ gọi API từ database)
  const [notifications, setNotifications] = useState([
  ]);

  const [filter, setFilter] = useState('all');

  // Xác thực Worker
  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.role !== 'worker') {
        navigate('/login');
        return;
      }
      setCurrentUser(parsedUser);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const filteredNotifications = filter === 'all'
    ? notifications
    : filter === 'unread'
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.type === filter);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  if (!currentUser) return <div>Đang tải...</div>;

  return (
    <div className="app-container">
      <Sidebar role="worker" />

      <main className="main-content">
        <Header title="Thông Báo Công Việc" />

        <div className="dashboard-body">
          <div className="notifications-container">
            {/* Notification Header */}
            <div className="notifications-header">
              <div className="header-content">
                <h2>Hộp thư thông báo</h2>
                {unreadCount > 0 && <span className="badge-unread">{unreadCount}</span>}
              </div>
              {unreadCount > 0 && (
                <button className="btn-mark-all" onClick={markAllAsRead}>
                  Đánh dấu tất cả là đã đọc
                </button>
              )}
            </div>

            {/* Filter Buttons - Tùy chỉnh riêng cho luồng việc của Thợ */}
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                Tất cả
              </button>
              <button
                className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
                onClick={() => setFilter('unread')}
              >
                Chưa đọc
              </button>
              <button
                className={`filter-btn ${filter === 'new_task' ? 'active' : ''}`}
                onClick={() => setFilter('new_task')}
              >
                Việc mới giao
              </button>
              <button
                className={`filter-btn ${filter === 'urgent' ? 'active' : ''}`}
                onClick={() => setFilter('urgent')}
              >
                Khẩn cấp
              </button>
              <button
                className={`filter-btn ${filter === 'status' ? 'active' : ''}`}
                onClick={() => setFilter('status')}
              >
                Nghiệm thu
              </button>
            </div>

            {/* Notifications List */}
            <div className="notifications-list">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`notification-item ${!notif.read ? 'unread' : ''} type-${notif.type}`}
                  >
                    <div className={`notification-icon icon-${notif.color}`}>
                      <i className={`fa-solid ${notif.icon}`}></i>
                    </div>

                    <div className="notification-content">
                      <div className="notification-title">
                        {notif.title}
                        {!notif.read && <span className="dot-unread"></span>}
                      </div>
                      <p className="notification-message">{notif.message}</p>
                      <span className="notification-time">{notif.timestamp}</span>
                    </div>

                    <div className="notification-actions">
                      {!notif.read && (
                        <button
                          className="action-btn read-btn"
                          onClick={() => markAsRead(notif.id)}
                          title="Đánh dấu là đã đọc"
                        >
                          <i className="fa-solid fa-check"></i>
                        </button>
                      )}
                      <button
                        className="action-btn delete-btn"
                        onClick={() => deleteNotification(notif.id)}
                        title="Xóa"
                      >
                        <i className="fa-solid fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <i className="fa-solid fa-bell-slash"></i>
                  <p>Bạn không có thông báo nào vào lúc này.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}