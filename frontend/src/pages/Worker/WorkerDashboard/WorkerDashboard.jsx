import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar/Sidebar';
import Header from '../../../components/Header/Header';
import './WorkerDashboard.css';
import assignedIcon from '../../../images/task.png';
import workingIcon from '../../../images/working.png';
import resolvedIcon from '../../../images/finished.png';

export default function WorkerDashboard() {
  const navigate = useNavigate();

  // State quản lý UI giống hệt Admin
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  // Dữ liệu mẫu (Tạm thời dùng State tĩnh, sau này sẽ thay bằng fetch API)
  const [tasks, setTasks] = useState([
    {
      _id: '1245',
      room: 'B301',
      title: 'Thay vòi nước bồn rửa mặt',
      category: 'Nước / Vệ sinh',
      time: '08:30 - Hôm nay',
      status: 'assigned',
      description: 'Sinh viên báo vòi nước rỉ sét, vặn không chặt, rò rỉ nước liên tục.'
    },
    {
      _id: '1240',
      room: 'C105',
      title: 'Sửa quạt trần lắc mạnh',
      category: 'Điện / Ánh sáng',
      time: '10:00 - Hôm nay',
      status: 'progress',
      description: 'Quạt quay phát ra tiếng kêu cọt kẹt lớn, rung lắc mạnh khi bật số 3.'
    },
    {
      _id: '1238',
      room: 'A102',
      title: 'Thay bản lề tủ quần áo',
      category: 'Mộc / Nội thất',
      time: '14:00 - Hôm qua',
      status: 'resolved',
      description: 'Cửa tủ xệ hoàn toàn, rớt 2 ốc bản lề dưới.'
    }
  ]);

  // Logic đếm số lượng
  const totalCount = tasks.length;
  const assignedCount = tasks.filter(t => t.status === 'assigned').length;
  const progressCount = tasks.filter(t => t.status === 'progress').length;
  const resolvedCount = tasks.filter(t => t.status === 'resolved').length;

  const stats = [
    { imgSrc: assignedIcon, label: 'Mới phân công', value: assignedCount, color: 'blue' },
    { imgSrc: workingIcon, label: 'Đang sửa chữa', value: progressCount, color: 'orange' },
    { imgSrc: resolvedIcon, label: 'Hoàn thành', value: resolvedCount, color: 'green' }
  ];

  const statusBadge = {
    assigned: { label: 'Chưa bắt đầu', class: 'badge-assigned' },
    progress: { label: 'Đang sửa', class: 'badge-progress' },
    resolved: { label: 'Đã xong', class: 'badge-resolved' }
  };

  const filteredTasks = filterStatus === 'all'
    ? tasks
    : tasks.filter(t => t.status === filterStatus);

  // Hàm mô phỏng cập nhật (sau này sẽ gọi API PUT)
  const handleUpdateStatus = () => {
    if (!selectedTask || !newStatus) return;
    setTasks(tasks.map(t =>
      t._id === selectedTask._id ? { ...t, status: newStatus } : t
    ));
    setSelectedTask(null);
    setNewStatus('');
  };

  return (
    <div className="app-container">
      <Sidebar role="worker" />

      <main className="main-content">
        <Header title="Bảng điều khiển Thợ" />

        <div className="dashboard-body">
          {/* Banner */}
          <div className="welcome-banner worker-banner">
            <div className="welcome-text">
              <h2>Xin chào, Kỹ thuật viên Nguyễn Văn Điện! 👷‍♂️</h2>
              <p>Bạn đang có {assignedCount + progressCount} công việc cần xử lý. Chúc một ngày làm việc hiệu quả.</p>
            </div>
            <button className="btn-scan-qr" onClick={() => alert('Mở camera quét mã QR phòng...')}>
              <i className="fa-solid fa-qrcode"></i> Quét QR Nhận Việc
            </button>
          </div>

          {/* Grid Thống kê */}
          <div className="stats-grid">
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-card">
                <div className={`stat-icon icon-${stat.color}`}>
                  <img src={stat.imgSrc} alt={stat.label} className="custom-stat-img" />
                </div>
                <div className="stat-info">
                  <p>{stat.label}</p>
                  <h3>{stat.value}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Bộ lọc giống Admin */}
          <div className="filter-section">
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                Tất cả ({totalCount})
              </button>
              <button
                className={`filter-btn ${filterStatus === 'assigned' ? 'active' : ''}`}
                onClick={() => setFilterStatus('assigned')}
              >
                Chưa bắt đầu ({assignedCount})
              </button>
              <button
                className={`filter-btn ${filterStatus === 'progress' ? 'active' : ''}`}
                onClick={() => setFilterStatus('progress')}
              >
                Đang sửa ({progressCount})
              </button>
              <button
                className={`filter-btn ${filterStatus === 'resolved' ? 'active' : ''}`}
                onClick={() => setFilterStatus('resolved')}
              >
                Đã xong ({resolvedCount})
              </button>
            </div>
          </div>

          {/* Bảng Danh sách Công việc */}
          <div className="table-section">
            <div className="table-header">
              <h3>Danh sách việc cần làm</h3>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Mã Lỗi</th>
                  <th>Phòng</th>
                  <th>Công việc</th>
                  <th>Danh mục</th>
                  <th>Thời gian giao</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task._id}>
                    <td><strong>QF-{task._id}</strong></td>
                    <td><span className="room-tag-worker">{task.room}</span></td>
                    <td className="ticket-title">{task.title}</td>
                    <td>{task.category}</td>
                    <td>{task.time}</td>
                    <td>
                      <span className={`badge ${statusBadge[task.status].class}`}>
                        {statusBadge[task.status].label}
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
          </div>
        </div>
      </main>

      {/* Modal Popup cập nhật trạng thái (Sao chép hoàn hảo từ Admin) */}
      {selectedTask && (
        <div className="sd-modal-overlay" onClick={() => setSelectedTask(null)}>
          <div className="sd-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="sd-modal-header worker-header">
              <h2>Cập Nhật Tiến Độ</h2>
              <p>Mã lỗi: QF-{selectedTask._id}</p>
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
                <textarea value={selectedTask.description} readOnly></textarea>
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