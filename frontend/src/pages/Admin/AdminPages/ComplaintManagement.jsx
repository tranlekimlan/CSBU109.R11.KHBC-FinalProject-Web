import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar/Sidebar';
import Header from '../../../components/Header/Header';
import './AdminPages.css';

export default function ComplaintManagement() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [newStatus, setNewStatus] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');

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
    fetchComplaints();
  }, [navigate]);

  const fetchComplaints = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/complaints');
      if (response.ok) {
        const data = await response.json();
        setComplaints(data || []);
      }
    } catch (error) {
      console.error('Lỗi tải khiếu nại:', error);
      setComplaints([]);
    } finally {
      setIsLoading(false);
    }
  };

  const statusBadge = {
    pending: { label: 'Chưa xử lý', class: 'badge-pending' },
    processing: { label: 'Đang xử lý', class: 'badge-progress' },
    resolved: { label: 'Đã giải quyết', class: 'badge-resolved' }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const filteredComplaints = filterStatus === 'all'
    ? complaints
    : complaints.filter(c => c.status === filterStatus);

  const handleUpdateStatus = async () => {
    if (!selectedComplaint || !newStatus) return;

    try {
      const response = await fetch(`http://localhost:5000/api/complaints/${selectedComplaint._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setComplaints(complaints.map(c =>
          c._id === selectedComplaint._id
            ? { ...c, status: newStatus }
            : c
        ));
        setSelectedComplaint(null);
        setNewStatus('');
      }
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
    }
  };

  const handleReply = async () => {
    if (!selectedComplaint || !replyText.trim()) return;

    try {
      const response = await fetch(`http://localhost:5000/api/complaints/${selectedComplaint._id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: replyText })
      });

      if (response.ok) {
        setComplaints(complaints.map(c =>
          c._id === selectedComplaint._id
            ? { ...c, reply: replyText, repliedAt: new Date() }
            : c
        ));
        setReplyText('');
        setShowReplyForm(false);
      }
    } catch (error) {
      console.error('Lỗi gửi phản hồi:', error);
    }
  };

  return (
    <div className="app-container">
      <Sidebar role="admin" />
      <main className="main-content">
        <Header title="Quản lý Khiếu Nại" />
        <div className="dashboard-body">
          {/* Filter */}
          <div className="filter-section">
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                Tất cả ({complaints.length})
              </button>
              <button
                className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
                onClick={() => setFilterStatus('pending')}
              >
                Chưa xử lý ({complaints.filter(c => c.status === 'pending').length})
              </button>
              <button
                className={`filter-btn ${filterStatus === 'processing' ? 'active' : ''}`}
                onClick={() => setFilterStatus('processing')}
              >
                Đang xử lý ({complaints.filter(c => c.status === 'processing').length})
              </button>
              <button
                className={`filter-btn ${filterStatus === 'resolved' ? 'active' : ''}`}
                onClick={() => setFilterStatus('resolved')}
              >
                Đã giải quyết ({complaints.filter(c => c.status === 'resolved').length})
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="table-section">
            <div className="table-header">
              <h3>Danh sách khiếu nại ({filteredComplaints.length})</h3>
            </div>

            {filteredComplaints.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã</th>
                    <th>Sinh viên</th>
                    <th>Tiêu đề</th>
                    <th>Ngày gửi</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.map((complaint) => (
                    <tr key={complaint._id}>
                      <td className="ticket-id">KN-{complaint._id.substring(complaint._id.length - 4).toUpperCase()}</td>
                      <td>{complaint.studentName || 'N/A'}</td>
                      <td className="ticket-title">{complaint.title}</td>
                      <td>{formatDate(complaint.createdAt)}</td>
                      <td>
                        <span className={`badge ${statusBadge[complaint.status]?.class || 'badge-pending'}`}>
                          {statusBadge[complaint.status]?.label || 'Không rõ'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-view-detail"
                          onClick={() => {
                            setSelectedComplaint(complaint);
                            setNewStatus('');
                            setShowReplyForm(false);
                          }}
                        >
                          Xem
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                {isLoading ? 'Đang tải dữ liệu...' : 'Không có khiếu nại nào.'}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {selectedComplaint && (
        <div className="modal-overlay" onClick={() => setSelectedComplaint(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chi Tiết Khiếu Nại</h2>
              <p>Mã: KN-{selectedComplaint._id.substring(selectedComplaint._id.length - 4).toUpperCase()}</p>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Sinh viên</label>
                  <input type="text" value={selectedComplaint.studentName || 'N/A'} readOnly />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={selectedComplaint.email || ''} readOnly />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label>Tiêu đề</label>
                  <input type="text" value={selectedComplaint.title} readOnly />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Nội dung khiếu nại</label>
                <textarea value={selectedComplaint.content} readOnly></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ngày gửi</label>
                  <input type="text" value={formatDate(selectedComplaint.createdAt)} readOnly />
                </div>
                <div className="form-group">
                  <label>Trạng thái</label>
                  <input type="text" value={statusBadge[selectedComplaint.status]?.label || 'Không rõ'} readOnly />
                </div>
              </div>

              {selectedComplaint.reply && (
                <div className="form-group full-width">
                  <label>Phản hồi của Admin</label>
                  <textarea value={selectedComplaint.reply} readOnly></textarea>
                </div>
              )}

              <div className="form-group full-width">
                <label>Cập nhật trạng thái</label>
                <div className="status-update">
                  <select
                    value={newStatus || selectedComplaint.status}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="status-select"
                  >
                    <option value="pending">Chưa xử lý</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="resolved">Đã giải quyết</option>
                  </select>
                  {newStatus && newStatus !== selectedComplaint.status && (
                    <button className="btn-update" onClick={handleUpdateStatus}>
                      Cập nhật
                    </button>
                  )}
                </div>
              </div>

              {!showReplyForm ? (
                <button
                  className="btn-primary"
                  onClick={() => setShowReplyForm(true)}
                  style={{ marginTop: '16px', width: '100%' }}
                >
                  <i className="fa-solid fa-reply"></i> Gửi Phản Hồi
                </button>
              ) : (
                <div className="form-group full-width" style={{ marginTop: '16px' }}>
                  <label>Phản hồi</label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Nhập phản hồi cho sinh viên..."
                    style={{ minHeight: '100px' }}
                  ></textarea>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                    <button className="btn-primary" onClick={handleReply} style={{ flex: 1 }}>
                      Gửi
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => { setShowReplyForm(false); setReplyText(''); }}
                      style={{ flex: 1 }}
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button className="btn-close" onClick={() => setSelectedComplaint(null)}>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
