import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar/Sidebar';
import Header from '../../../components/Header/Header';
import './StudentPages.css';

export default function StudentComplaints() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const parsedUser = JSON.parse(user);
      setCurrentUser(parsedUser);
      fetchComplaints(parsedUser.id);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchComplaints = async (studentId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/complaints/student/${studentId}`);
      if (response.ok) {
        const data = await response.json();
        setComplaints(data || []);
      }
    } catch (error) {
      console.error('Lỗi tải khiếu nại:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: currentUser.id,
          studentName: currentUser.fullName,
          email: currentUser.email,
          title: formData.title,
          content: formData.content
        })
      });

      if (response.ok) {
        alert('Gửi khiếu nại thành công!');
        setFormData({ title: '', content: '' });
        setShowForm(false);
        fetchComplaints(currentUser.id);
      }
    } catch (error) {
      console.error('Lỗi gửi khiếu nại:', error);
      alert('Có lỗi xảy ra!');
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

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header title="Khiếu Nại" />
        <div className="dashboard-body">
          {!showForm ? (
            <div style={{ marginBottom: '32px' }}>
              <button
                className="btn-primary"
                onClick={() => setShowForm(true)}
              >
                <i className="fa-solid fa-plus"></i> Gửi Khiếu Nại Mới
              </button>
            </div>
          ) : (
            <div className="form-box">
              <h3>Gửi Khiếu Nại</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Tiêu đề khiếu nại *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Vd: Dịch vụ phòng không tốt, Vấn đề với nhân viên..."
                  />
                </div>

                <div className="form-group">
                  <label>Nội dung chi tiết *</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Mô tả chi tiết vấn đề của bạn..."
                    style={{ minHeight: '150px' }}
                  ></textarea>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="submit" className="btn-primary">
                    Gửi
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowForm(false)}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="table-section">
            <div className="table-header">
              <h3>Danh sách khiếu nại của bạn ({complaints.length})</h3>
            </div>

            {complaints.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tiêu đề</th>
                    <th>Ngày gửi</th>
                    <th>Trạng thái</th>
                    <th>Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <tr key={complaint._id}>
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
                          onClick={() => setSelectedComplaint(complaint)}
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
                {isLoading ? 'Đang tải...' : 'Bạn chưa gửi khiếu nại nào.'}
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedComplaint && (
        <div className="modal-overlay" onClick={() => setSelectedComplaint(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chi Tiết Khiếu Nại</h2>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Tiêu đề</label>
                <input type="text" value={selectedComplaint.title} readOnly />
              </div>

              <div className="form-group">
                <label>Nội dung</label>
                <textarea value={selectedComplaint.content} readOnly style={{ minHeight: '100px' }}></textarea>
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
                <div className="form-group">
                  <label>Phản hồi từ Quản lý</label>
                  <textarea value={selectedComplaint.reply} readOnly style={{ minHeight: '80px' }}></textarea>
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
