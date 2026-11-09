import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar/Sidebar'; // Đảm bảo đường dẫn này đúng
import Header from '../../../components/Header/Header';
import '../WorkerDashboard/WorkerDashboard.css';

export default function WorkerTasks() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 1. KIỂM TRA ĐĂNG NHẬP VÀ LẤY DỮ LIỆU CÔNG VIỆC CỦA THỢ NÀY
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role !== 'worker') {
        navigate('/login');
        return;
      }
      
      const workerId = user._id || user.id; 
      if (workerId) {
         fetchTasks(workerId);
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchTasks = async (workerId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tickets/worker/${workerId}`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách việc:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Đếm số lượng cho bộ lọc
  const totalCount = tasks.length;
  const assignedCount = tasks.filter(t => t.status === 'assigned').length;
  const progressCount = tasks.filter(t => t.status === 'progress').length;
  const resolvedCount = tasks.filter(t => t.status === 'resolved').length;

  const statusBadge = {
    assigned: { label: 'Chưa bắt đầu', class: 'badge-assigned' },
    progress: { label: 'Đang sửa', class: 'badge-progress' },
    resolved: { label: 'Đã xong', class: 'badge-resolved' }
  };

  const filteredTasks = filterStatus === 'all'
    ? tasks
    : tasks.filter(t => t.status === filterStatus);

  // 2. XỬ LÝ CẬP NHẬT TRẠNG THÁI
  const handleUpdateStatus = async () => {
    if (!selectedTask || !newStatus) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/tickets/${selectedTask._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setTasks(tasks.map(t =>
          t._id === selectedTask._id ? { ...t, status: newStatus } : t
        ));
        setSelectedTask(null);
        setNewStatus('');
      }
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái:', error);
      alert('Không thể lưu trạng thái lúc này!');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="app-container">
      <Sidebar role="worker" />

      <main className="main-content">
        <Header title="Việc Được Giao" />

        <div className="dashboard-body">
          {/* Bộ lọc (Đã bỏ margin-top vì không còn Banner) */}
          <div className="filter-section" style={{ marginTop: '0' }}>
            <div className="filter-buttons">
              <button className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`} onClick={() => setFilterStatus('all')}>
                Tất cả ({totalCount})
              </button>
              <button className={`filter-btn ${filterStatus === 'assigned' ? 'active' : ''}`} onClick={() => setFilterStatus('assigned')}>
                Chưa bắt đầu ({assignedCount})
              </button>
              <button className={`filter-btn ${filterStatus === 'progress' ? 'active' : ''}`} onClick={() => setFilterStatus('progress')}>
                Đang sửa ({progressCount})
              </button>
              <button className={`filter-btn ${filterStatus === 'resolved' ? 'active' : ''}`} onClick={() => setFilterStatus('resolved')}>
                Đã xong ({resolvedCount})
              </button>
            </div>
          </div>

          {/* Bảng Danh sách Công việc */}
          <div className="table-section">
            <div className="table-header">
              <h3>Danh sách việc cần làm</h3>
            </div>
            {filteredTasks.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Mã Lỗi</th>
                    <th>Phòng</th>
                    <th>Công việc</th>
                    <th>Danh mục</th>
                    <th>Ngày giao</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => (
                    <tr key={task._id}>
                      <td><strong>QF-{task._id.substring(task._id.length - 4).toUpperCase()}</strong></td>
                      <td><span className="room-tag-worker">{task.room}</span></td>
                      <td className="ticket-title">{task.title}</td>
                      <td>{task.category}</td>
                      <td>{formatDate(task.createdAt)}</td>
                      <td>
                        <span className={`badge ${statusBadge[task.status]?.class || 'badge-assigned'}`}>
                          {statusBadge[task.status]?.label || 'Không rõ'}
                        </span>
                      </td>
                      <td>
                        <button className="btn-view-detail" onClick={() => { setSelectedTask(task); setNewStatus(''); }}>
                          Cập nhật
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                {isLoading ? 'Đang tải dữ liệu...' : 'Hiện tại bạn không có công việc nào trong mục này.'}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal Popup cập nhật trạng thái */}
      {selectedTask && (
        <div className="sd-modal-overlay" onClick={() => setSelectedTask(null)}>
          <div className="sd-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="sd-modal-header worker-header">
              <h2>Cập Nhật Tiến Độ</h2>
              <p>Mã lỗi: QF-{selectedTask._id.substring(selectedTask._id.length - 4).toUpperCase()}</p>
            </div>

            <div className="sd-modal-body">
              <div className="sd-row">
                <div className="sd-group">
                  <label>Số phòng</label>
                  <input type="text" value={selectedTask.room} readOnly />
                </div>
                <div className="sd-group">
                  <label>Danh mục</label>
                  <input type="text" value={selectedTask.category} readOnly />
                </div>
              </div>

              <div className="sd-group">
                <label>Vấn đề cần xử lý</label>
                <input type="text" value={selectedTask.title} readOnly />
              </div>

              <div className="sd-group">
                <label>Mô tả chi tiết từ sinh viên</label>
                <textarea value={selectedTask.description || 'Không có mô tả thêm'} readOnly></textarea>
              </div>

              <div className="sd-group">
                <label>Cập nhật trạng thái sửa chữa</label>
                <div className="status-update-group">
                  <select
                    value={newStatus || selectedTask.status}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="status-select"
                  >
                    <option value="assigned">Chưa bắt đầu</option>
                    <option value="progress">Đang sửa chữa</option>
                    <option value="resolved">Đã hoàn thành</option>
                  </select>
                  {newStatus && newStatus !== selectedTask.status && (
                    <button className="btn-update-status" onClick={handleUpdateStatus}>
                      Xác nhận lưu
                    </button>
                  )}
                </div>
              </div>

              <div className="sd-actions">
                <button className="sd-btn-close" onClick={() => setSelectedTask(null)}>
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