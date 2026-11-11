import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar/Sidebar';
import Header from '../../../components/Header/Header';
import './Notifications.css';

const API = 'http://localhost:5000/api';

const TYPE_CONFIG = {
  report_created: { icon: 'fa-circle-check',    color: 'green',  filterKey: 'report'  },
  worker_assigned:{ icon: 'fa-user-gear',        color: 'blue',   filterKey: 'status'  },
  status_update:  { icon: 'fa-wrench',           color: 'orange', filterKey: 'status'  },
  rating_sent:    { icon: 'fa-star',             color: 'yellow', filterKey: 'rating'  },
};

const formatTime = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return 'Vừa xong';
  if (mins  < 60) return `${mins} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  return `${days} ngày trước`;
};

export default function Notifications() {
  const navigate   = useNavigate();
  const [currentUser, setCurrentUser]   = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter]             = useState('all');
  const [isLoading, setIsLoading]       = useState(true);

  // ─── Auth ────────────────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (!stored) { navigate('/login'); return; }
    const user = JSON.parse(stored);
    if (user.role !== 'student') { navigate('/login'); return; }
    setCurrentUser(user);
  }, [navigate]);

  // ─── Fetch ───────────────────────────────────────────────
  const fetchNotifications = useCallback(async (userId) => {
    try {
      const res  = await fetch(`${API}/notifications/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error('Lỗi tải thông báo:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const userId = currentUser.id || currentUser._id;
    fetchNotifications(userId);

    // Polling 30 giây một lần
    const interval = setInterval(() => fetchNotifications(userId), 30000);
    return () => clearInterval(interval);
  }, [currentUser, fetchNotifications]);

  // ─── Actions ─────────────────────────────────────────────
  const markAsRead = async (notifId) => {
    await fetch(`${API}/notifications/${notifId}/read`, { method: 'PUT' });
    setNotifications(prev => prev.map(n => n._id === notifId ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = async () => {
    const userId = currentUser.id || currentUser._id;
    await fetch(`${API}/notifications/read-all/${userId}`, { method: 'PUT' });
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = async (notifId) => {
    await fetch(`${API}/notifications/${notifId}`, { method: 'DELETE' });
    setNotifications(prev => prev.filter(n => n._id !== notifId));
  };

  // ─── Filter ──────────────────────────────────────────────
  const filtered = (() => {
    if (filter === 'all')    return notifications;
    if (filter === 'unread') return notifications.filter(n => !n.isRead);
    return notifications.filter(n => TYPE_CONFIG[n.type]?.filterKey === filter);
  })();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // ─── Render ──────────────────────────────────────────────
  return (
    <div className="app-container">
      <Sidebar />

      <main className="main-content">
        <Header title="Thông báo" />

        <div className="dashboard-body">
          <div className="notifications-container">

            {/* Header */}
            <div className="notifications-header">
              <div className="header-content">
                <h2>Thông báo</h2>
                {unreadCount > 0 && <span className="badge-unread">{unreadCount}</span>}
              </div>
              {unreadCount > 0 && (
                <button className="btn-mark-all" onClick={markAllAsRead}>
                  Đánh dấu tất cả là đã đọc
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="filter-buttons">
              {[
                { key: 'all',    label: 'Tất cả' },
                { key: 'unread', label: 'Chưa đọc' },
                { key: 'report', label: 'Báo cáo' },
                { key: 'status', label: 'Cập nhật trạng thái' },
                { key: 'rating', label: 'Đánh giá' },
              ].map(f => (
                <button
                  key={f.key}
                  className={`filter-btn ${filter === f.key ? 'active' : ''}`}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="notifications-list">
              {isLoading ? (
                <div className="empty-state">
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                  <p>Đang tải thông báo...</p>
                </div>
              ) : filtered.length > 0 ? (
                filtered.map((notif) => {
                  const cfg = TYPE_CONFIG[notif.type] || { icon: 'fa-bell', color: 'blue' };
                  return (
                    <div
                      key={notif._id}
                      className={`notification-item ${!notif.isRead ? 'unread' : ''} type-${notif.type}`}
                    >
                      <div className={`notification-icon icon-${cfg.color}`}>
                        <i className={`fa-solid ${cfg.icon}`}></i>
                      </div>

                      <div className="notification-content">
                        <div className="notification-title">
                          {notif.title}
                          {!notif.isRead && <span className="dot-unread"></span>}
                        </div>
                        <p className="notification-message">{notif.message}</p>
                        <span className="notification-time">{formatTime(notif.createdAt)}</span>
                      </div>

                      <div className="notification-actions">
                        {!notif.isRead && (
                          <button
                            className="action-btn read-btn"
                            onClick={() => markAsRead(notif._id)}
                            title="Đánh dấu là đã đọc"
                          >
                            <i className="fa-solid fa-check"></i>
                          </button>
                        )}
                        <button
                          className="action-btn delete-btn"
                          onClick={() => deleteNotification(notif._id)}
                          title="Xóa"
                        >
                          <i className="fa-solid fa-trash-alt"></i>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="empty-state">
                  <i className="fa-solid fa-bell-slash"></i>
                  <p>Không có thông báo nào</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
