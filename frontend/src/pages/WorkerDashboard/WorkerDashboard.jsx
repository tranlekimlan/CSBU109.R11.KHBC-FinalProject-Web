import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import './WorkerDashboard.css';

export default function WorkerDashboard() {
  const navigate = useNavigate();

  // Thống kê công việc dành riêng cho Thợ
  const stats = [
    { icon: 'fa-clipboard-list', label: 'Việc mới nhận', value: 2, color: 'blue' },
    { icon: 'fa-person-digging', label: 'Đang sửa chữa', value: 1, color: 'orange' },
    { icon: 'fa-check-double', label: 'Hoàn thành hôm nay', value: 4, color: 'green' }
  ];

  // Danh sách công việc được Admin phân công
  const tasks = [
    {
      id: 'QF-1245',
      room: 'B301',
      title: 'Thay vòi nước bồn rửa mặt',
      category: 'Hệ thống Nước',
      time: '08:30 - Hôm nay',
      status: 'assigned'
    },
    {
      id: 'QF-1240',
      room: 'C105',
      title: 'Sửa quạt trần lắc mạnh',
      category: 'Điện / Ánh sáng',
      time: '10:00 - Hôm nay',
      status: 'in_progress'
    },
    {
      id: 'QF-1238',
      room: 'A102',
      title: 'Thay bản lề tủ quần áo',
      category: 'Mộc / Nội thất',
      time: '14:00 - Hôm qua',
      status: 'completed'
    }
  ];

  const statusBadge = {
    assigned: { label: 'Chưa bắt đầu', class: 'badge-assigned' },
    in_progress: { label: 'Đang sửa', class: 'badge-progress' },
    completed: { label: 'Đã xong', class: 'badge-completed' }
  };

  return (
    <div className="app-container">
      {/* Gọi Sidebar và truyền role là worker để nó tự đổi màu và menu */}
      <Sidebar role="worker" />

      <main className="main-content">
        <Header title="Bảng điều khiển Thợ" />

        <div className="dashboard-body">
          {/* Banner sử dụng tông màu Cam/Đất (phù hợp với kỹ thuật/công trường) */}
          <div className="welcome-banner worker-banner">
            <div className="welcome-text">
              <h2>Xin chào, Kỹ thuật viên Trần Văn B!</h2>
              <p>Hôm nay bạn có 2 công việc mới cần xử lý. Hãy kiểm tra danh sách bên dưới.</p>
            </div>
            <button className="btn-update-status" onClick={() => alert('Mở camera quét mã QR phòng...')}>
              <i className="fa-solid fa-qrcode"></i> Quét QR Nhận Việc
            </button>
          </div>

          {/* Grid Thống kê */}
          <div className="stats-grid">
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-card">
                <div className={`stat-icon icon-${stat.color}`}>
                  <i className={`fa-solid ${stat.icon}`}></i>
                </div>
                <div className="stat-info">
                  <p>{stat.label}</p>
                  <h3>{stat.value}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Bảng Danh sách Công việc */}
          <div className="table-section">
            <div className="table-header">
              <h3>Danh sách việc cần làm</h3>
              <a href="#" className="view-all" onClick={() => navigate('/worker/tasks')}>
                Xem lịch trình <i className="fa-solid fa-arrow-right" style={{ marginLeft: '4px', fontSize: '12px' }}></i>
              </a>
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
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td><strong>{task.id}</strong></td>
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
                      {task.status === 'completed' ? (
                        <button className="action-btn" onClick={() => navigate(`/report/${task.id}`)} title="Xem lại">
                          <i className="fa-solid fa-eye"></i>
                        </button>
                      ) : (
                        <button className="action-btn update-btn" onClick={() => navigate(`/worker/update/${task.id}`)} title="Cập nhật tiến độ">
                          <i className="fa-solid fa-pen-to-square"></i> Cập nhật
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}