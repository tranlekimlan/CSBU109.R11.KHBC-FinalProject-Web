import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar/Sidebar';
import Header from '../../../components/Header/Header';
import './admin-dashboard.css';
import pendingIcon from '../../../images/pending.png';
import progressIcon from '../../../images/working.png';
import resolvedIcon from '../../../images/finished.png';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role !== 'admin') {
        navigate('/login', { state: { role: 'admin' } });
        return;
      }
      setCurrentUser(user);
      fetchAllTickets();
    } else {
      navigate('/login', { state: { role: 'admin' } });
    }
  }, [navigate]);

  const fetchAllTickets = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tickets`);
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách vé:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalCount = tickets.length;
  const pendingCount = tickets.filter(t => t.status === 'pending').length;
  const progressCount = tickets.filter(t => t.status === 'progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved').length;

  const stats = [
    { imgSrc: pendingIcon, label: 'Chờ duyệt', value: pendingCount, color: 'blue' },
    { imgSrc: progressIcon, label: 'Đang xử lý', value: progressCount, color: 'orange' },
    { imgSrc: resolvedIcon, label: 'Đã hoàn thành', value: resolvedCount, color: 'green' }
  ];

  const statusBadge = {
    pending: { label: 'Chờ duyệt', class: 'badge-pending' },
    progress: { label: 'Đang xử lý', class: 'badge-progress' },
    assigned: { label: 'Chưa Bắt Đầu', class: 'badge-assigned' },
    resolved: { label: 'Đã xong', class: 'badge-resolved' }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const filteredTickets = filterStatus === 'all'
    ? tickets
    : tickets.filter(t => t.status === filterStatus);

  const handleUpdateStatus = async () => {
    if (!selectedTicket || !newStatus) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tickets/${selectedTicket._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setTickets(tickets.map(t =>
          t._id === selectedTicket._id
            ? { ...t, status: newStatus }
            : t
        ));
        setSelectedTicket(null);
        setNewStatus('');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
    }
  };

  const handleArchiveTicket = async () => {
    if (!window.confirm('Xác nhận nghiệm thu? Vé này sẽ được lưu trữ lịch sử và gỡ khỏi bảng điều khiển của Admin.')) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tickets/${selectedTicket._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'archived' })
      });

      if (response.ok) {
        setTickets(tickets.filter(t => t._id !== selectedTicket._id));
        setSelectedTicket(null); 
        alert('Đã nghiệm thu và lưu trữ vé thành công!');
      } else {
        alert('Có lỗi xảy ra khi lưu trữ vé.');
      }
    } catch (error) {
      console.error('Lỗi khi lưu trữ vé:', error);
    }
  };

  return (
    <div className="app-container">
      <Sidebar role='admin'/>

      <main className="main-content">
        <Header title="Tổng quan Quản trị" />

        <div className="dashboard-body">
          <div className="welcome-banner admin-banner">
            <div className="welcome-text">
              <h2>Chào mừng, {currentUser ? currentUser.fullName : 'Admin'}! 👨‍💼</h2>
              <p>Quản lý và xử lý tất cả các báo cáo sự cố từ sinh viên</p>
            </div>
          </div>

          <div className="stats-grid">
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-card">
                <div className={`stat-icon icon-${stat.color}`}>
                  <img src={stat.imgSrc} alt={stat.label} className="custom-stat-img" />
                </div>
                <div className="stat-info">
                  <p>{stat.label}</p>
                  <h3>{isLoading ? '...' : stat.value}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="filter-section">
            {/* Giao diện nút bấm cho Máy tính */}
            <div className="filter-buttons desktop-filters">
              <button
                className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                Tất cả ({totalCount})
              </button>
              <button
                className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
                onClick={() => setFilterStatus('pending')}
              >
                Chờ duyệt ({pendingCount})
              </button>
              <button
                className={`filter-btn ${filterStatus === 'progress' ? 'active' : ''}`}
                onClick={() => setFilterStatus('progress')}
              >
                Đang xử lý ({progressCount})
              </button>
              <button
                className={`filter-btn ${filterStatus === 'resolved' ? 'active' : ''}`}
                onClick={() => setFilterStatus('resolved')}
              >
                Đã xong ({resolvedCount})
              </button>
            </div>

            {/* Giao diện Dropdown cho Điện thoại */}
            <div className="mobile-filters">
              <select 
                className="filter-dropdown"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả ({totalCount})</option>
                <option value="pending">Chờ duyệt ({pendingCount})</option>
                <option value="progress">Đang xử lý ({progressCount})</option>
                <option value="resolved">Đã xong ({resolvedCount})</option>
              </select>
            </div>
          </div>

          <div className="table-section">
            <div className="table-header">
              <h3>Danh sách báo cáo sự cố</h3>
            </div>

            {filteredTickets.length > 0 ? (
              <>
                {/* --- GIAO DIỆN 1: BẢNG CHO MÁY TÍNH (DESKTOP) --- */}
                <div className="admin-table-desktop">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Mã Vé</th>
                        <th>Sinh viên</th>
                        <th>Phòng</th>
                        <th>Nội dung</th>
                        <th>Danh mục</th>
                        <th>Ngày báo</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTickets.map((ticket) => (
                        <tr key={ticket._id}>
                          <td>QF-{ticket._id.substring(ticket._id.length - 4).toUpperCase()}</td>
                          <td>{ticket.studentName || 'N/A'}</td>
                          <td>{ticket.room}</td>
                          <td className="ticket-title">{ticket.title}</td>
                          <td>{ticket.category}</td>
                          <td>{formatDate(ticket.createdAt)}</td>
                          <td>
                            <span className={`badge ${statusBadge[ticket.status]?.class || 'badge-pending'}`}>
                              {statusBadge[ticket.status]?.label || 'Không rõ'}
                            </span>
                          </td>
                          <td>
                            <button className="btn-view-detail" onClick={() => {setSelectedTicket(ticket); setNewStatus('');}}>
                              Xem
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* --- GIAO DIỆN 2: THẺ (CARD) CHO ĐIỆN THOẠI (Đồng bộ Worker) --- */}
                <div className="admin-cards-mobile">
                  {filteredTickets.map((ticket) => (
                    <div className="ticket-worker-card" key={ticket._id}>
                      {/* Tiêu đề & Ngày */}
                      <div className="worker-card-header">
                        <span className="worker-card-id">
                          QF-{ticket._id.substring(ticket._id.length - 4).toUpperCase()}
                        </span>
                        <span className="worker-card-date">{formatDate(ticket.createdAt)}</span>
                      </div>

                      {/* Room Badge */}
                      <div className="worker-room-badge">
                        {ticket.room}
                      </div>

                      {/* Title & Info */}
                      <div className="worker-card-body">
                        <div className="worker-card-title">{ticket.title}</div>
                        <div className="worker-card-category">{ticket.category}</div>
                        <div className="worker-card-student">SV: {ticket.studentName || 'N/A'}</div>
                      </div>

                      {/* Status Badge */}
                      <div className="worker-status-badge">
                        <span className={`badge ${statusBadge[ticket.status]?.class || 'badge-pending'}`}>
                          {statusBadge[ticket.status]?.label || 'Không rõ'}
                        </span>
                      </div>

                      {/* Divider & Action */}
                      <div className="worker-card-divider"></div>
                      <button 
                        className="btn-worker-action" 
                        onClick={() => {setSelectedTicket(ticket); setNewStatus('');}}
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                {isLoading ? 'Đang tải dữ liệu...' : 'Không có báo cáo nào.'}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal Chi tiết vé giữ nguyên như cũ */}
      {selectedTicket && (
        <div className="sd-modal-overlay" onClick={() => setSelectedTicket(null)}>
          <div className="sd-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="sd-modal-header admin-header">
              <h2>Chi Tiết Báo Cáo</h2>
              <p>Mã vé: QF-{selectedTicket._id.substring(selectedTicket._id.length - 4).toUpperCase()}</p>
            </div>

            <div className="sd-modal-body">
              <div className="sd-row">
                <div className="sd-group">
                  <label>Sinh viên</label>
                  <input type="text" value={selectedTicket.studentName || 'N/A'} readOnly />
                </div>
                <div className="sd-group">
                  <label>Số phòng</label>
                  <input type="text" value={selectedTicket.room} readOnly />
                </div>
              </div>
              <div className="sd-row">
                <div className="sd-group">
                  <label>Tiêu đề</label>
                  <input type="text" value={selectedTicket.title} readOnly />
                </div>
                <div className="sd-group">
                  <label>Danh mục</label>
                  <input type="text" value={selectedTicket.category} readOnly />
                </div>
              </div>
              <div className="sd-row">
                <div className="sd-group">
                  <label>Ngày báo cáo</label>
                  <input type="text" value={formatDate(selectedTicket.createdAt)} readOnly />
                </div>
                <div className="sd-group">
                  <label>Trạng thái hiện tại</label>
                  <input
                    type="text"
                    value={statusBadge[selectedTicket.status]?.label || 'Không rõ'}
                    readOnly
                  />
                </div>
              </div>

              {selectedTicket.imageUrls && selectedTicket.imageUrls.length > 0 && (
                <div className="sd-group">
                  <label>Hình ảnh đính kèm</label>
                  <div className="sd-image-grid">
                    {selectedTicket.imageUrls.map((img, index) => (
                      <div
                        key={index}
                        className="sd-image-preview"
                        onClick={() => setEnlargedImage(img)}
                        title="Nhấn để phóng to ảnh"
                      >
                        <img src={img} alt={`report-img-${index}`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="sd-group">
                <label>Mô tả chi tiết</label>
                <textarea value={selectedTicket.description} readOnly></textarea>
              </div>

              <div className="sd-group">
                <label>Cập nhật trạng thái</label>
                <div className="status-update-group">
                  <select
                    value={newStatus || selectedTicket.status}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="status-select"
                  >
                    <option value="pending">Chờ duyệt</option>
                    <option value="progress">Đang xử lý</option>
                    <option value="resolved">Đã xong</option>
                  </select>
                  {newStatus && newStatus !== selectedTicket.status && (
                    <button
                      className="btn-update-status"
                      onClick={handleUpdateStatus}
                    >
                      Cập nhật
                    </button>
                  )}
                </div>
              </div>

              <div className="sd-actions">
                {selectedTicket.status === 'resolved' && (
                  <button 
                    className="btn-update-status" 
                    style={{ backgroundColor: '#0f766e', marginRight: '12px' }}
                    onClick={handleArchiveTicket}
                  >
                    <i className="fa-solid fa-box-archive"></i> Nghiệm thu & Lưu trữ
                  </button>
                )}

                <button className="sd-btn-close" onClick={() => setSelectedTicket(null)}>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {enlargedImage && (
        <div className="sd-image-zoom-overlay" onClick={() => setEnlargedImage(null)}>
          <span className="sd-zoom-close">✕</span>
          <img
            src={enlargedImage}
            alt="Phóng to"
            className="sd-zoom-content"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

    </div>
  );
}