import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import './AdminPages.css';

export default function AllTickets() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(user);
    if (parsedUser.role !== 'admin') {
      navigate('/admin-dashboard');
      return;
    }
    fetchTickets();
  }, [navigate]);

  const fetchTickets = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tickets');
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      }
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statusBadge = {
    pending: { label: 'Chờ duyệt', class: 'badge-pending' },
    progress: { label: 'Đang xử lý', class: 'badge-progress' },
    resolved: { label: 'Đã xong', class: 'badge-resolved' }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Filter tickets
  let filtered = tickets;

  if (filterStatus !== 'all') {
    filtered = filtered.filter(t => t.status === filterStatus);
  }

  if (filterCategory !== 'all') {
    filtered = filtered.filter(t => t.category === filterCategory);
  }

  if (searchTerm) {
    filtered = filtered.filter(t =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.room.includes(searchTerm) ||
      (t.studentName && t.studentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      t._id.includes(searchTerm)
    );
  }

  // Get unique categories
  const categories = [...new Set(tickets.map(t => t.category))];

  const handleUpdateStatus = async () => {
    if (!selectedTicket || !newStatus) return;

    try {
      const response = await fetch(`http://localhost:5000/api/tickets/${selectedTicket._id}`, {
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
      console.error('Lỗi cập nhật:', error);
    }
  };

  const exportToCSV = () => {
    const headers = ['Mã Vé', 'Sinh viên', 'Phòng', 'Nội dung', 'Danh mục', 'Ngày báo', 'Trạng thái'];
    const rows = filtered.map(t => [
      `QF-${t._id.substring(t._id.length - 4).toUpperCase()}`,
      t.studentName || 'N/A',
      t.room,
      t.title,
      t.category,
      formatDate(t.createdAt),
      statusBadge[t.status]?.label || 'Không rõ'
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `tickets_${new Date().getTime()}.csv`);
    link.click();
  };

  return (
    <div className="app-container">
      <Sidebar role="admin" />
      <main className="main-content">
        <Header title="Quản lý Tất Cả Sự Cố" />
        <div className="dashboard-body">
          {/* Search & Filter Section */}
          <div className="search-filter-section">
            <div className="search-box">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                placeholder="Tìm kiếm theo mã vé, phòng, sinh viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ duyệt</option>
                <option value="progress">Đang xử lý</option>
                <option value="resolved">Đã xong</option>
              </select>

              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="filter-select">
                <option value="all">Tất cả danh mục</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>

              <button className="btn-export" onClick={exportToCSV}>
                <i className="fa-solid fa-download"></i> Xuất CSV
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="quick-stats">
            <div className="stat-item">
              <span className="stat-label">Tổng sự cố</span>
              <span className="stat-number">{tickets.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Chờ duyệt</span>
              <span className="stat-number">{tickets.filter(t => t.status === 'pending').length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Đang xử lý</span>
              <span className="stat-number">{tickets.filter(t => t.status === 'progress').length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Đã xong</span>
              <span className="stat-number">{tickets.filter(t => t.status === 'resolved').length}</span>
            </div>
          </div>

          {/* Table */}
          <div className="table-section">
            <div className="table-header">
              <h3>Kết quả tìm kiếm: {filtered.length} sự cố</h3>
            </div>

            {filtered.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã Vé</th>
                    <th>Sinh viên</th>
                    <th>Phòng</th>
                    <th>Nội dung</th>
                    <th>Danh mục</th>
                    <th>Ngày báo</th>
                    <th>Trạng thái</th>
                    <th>Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((ticket) => (
                    <tr key={ticket._id}>
                      <td className="ticket-id">QF-{ticket._id.substring(ticket._id.length - 4).toUpperCase()}</td>
                      <td>{ticket.studentName || 'N/A'}</td>
                      <td><span className="room-badge">{ticket.room}</span></td>
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
            ) : (
              <div className="empty-state">
                {isLoading ? 'Đang tải dữ liệu...' : 'Không tìm thấy sự cố nào.'}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {selectedTicket && (
        <div className="modal-overlay" onClick={() => setSelectedTicket(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chi Tiết Sự Cố</h2>
              <p>Mã vé: QF-{selectedTicket._id.substring(selectedTicket._id.length - 4).toUpperCase()}</p>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Sinh viên</label>
                  <input type="text" value={selectedTicket.studentName || 'N/A'} readOnly />
                </div>
                <div className="form-group">
                  <label>Phòng</label>
                  <input type="text" value={selectedTicket.room} readOnly />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tiêu đề</label>
                  <input type="text" value={selectedTicket.title} readOnly />
                </div>
                <div className="form-group">
                  <label>Danh mục</label>
                  <input type="text" value={selectedTicket.category} readOnly />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ngày báo</label>
                  <input type="text" value={formatDate(selectedTicket.createdAt)} readOnly />
                </div>
                <div className="form-group">
                  <label>Trạng thái hiện tại</label>
                  <input type="text" value={statusBadge[selectedTicket.status]?.label || 'Không rõ'} readOnly />
                </div>
              </div>

              {selectedTicket.imageUrls && selectedTicket.imageUrls.length > 0 && (
                <div className="form-group full-width">
                  <label>Hình ảnh đính kèm</label>
                  <div className="image-grid">
                    {selectedTicket.imageUrls.map((img, idx) => (
                      <div
                        key={idx}
                        className="image-thumb"
                        onClick={() => setEnlargedImage(img)}
                        title="Nhấn để phóng to"
                      >
                        <img src={img} alt={`img-${idx}`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="form-group full-width">
                <label>Mô tả</label>
                <textarea value={selectedTicket.description} readOnly></textarea>
              </div>

              <div className="form-group full-width">
                <label>Cập nhật trạng thái</label>
                <div className="status-update">
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
                    <button className="btn-update" onClick={handleUpdateStatus}>
                      Cập nhật
                    </button>
                  )}
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-close" onClick={() => setSelectedTicket(null)}>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom */}
      {enlargedImage && (
        <div className="zoom-overlay" onClick={() => setEnlargedImage(null)}>
          <span className="zoom-close">✕</span>
          <img src={enlargedImage} alt="Zoom" className="zoom-img" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
