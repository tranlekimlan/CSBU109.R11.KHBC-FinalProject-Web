import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import './StudentDashboard.css';

export default function StudentDashboard() {
  const navigate = useNavigate();

  const stats = [
    { icon: 'fa-spinner', label: 'Đang chờ duyệt', value: 1, color: 'blue' },
    { icon: 'fa-person-digging', label: 'Thợ đang xử lý', value: 0, color: 'orange' },
    { icon: 'fa-check-double', label: 'Đã sửa xong', value: 3, color: 'green' }
  ];

  const reports = [
    {
      id: 'QF-1240',
      title: 'Quạt trần kêu to và lắc mạnh',
      category: 'Điện / Ánh sáng',
      date: '27/10/2023',
      status: 'pending'
    },
    {
      id: 'QF-1122',
      title: 'Vòi nước bồn rửa mặt bị rỉ',
      category: 'Hệ thống Nước',
      date: '15/10/2023',
      status: 'resolved'
    },
    {
      id: 'QF-1089',
      title: 'Bản lề tủ quần áo bị gãy',
      category: 'Mộc / Nội thất',
      date: '02/10/2023',
      status: 'resolved'
    }
  ];

  const statusBadge = {
    pending: { label: 'Chờ duyệt', class: 'badge-pending' },
    progress: { label: 'Đang xử lý', class: 'badge-progress' },
    resolved: { label: 'Đã xong', class: 'badge-resolved' }
  };

  return (
    <div className="app-container">
      <Sidebar />

      <main className="main-content">
        <Header title="Bảng điều khiển" />

        <div className="dashboard-body">
          {/* Welcome Banner */}
          <div className="welcome-banner">
            <div className="welcome-text">
              <h2>Xin chào, Nguyễn Văn A! 👋</h2>
              <p>Bạn có phát hiện hỏng hóc gì trong phòng không? Hãy báo cáo ngay cho Ban quản lý nhé.</p>
            </div>
            <button className="btn-create-ticket" onClick={() => navigate('/create-report')}>
              <i className="fa-solid fa-wrench"></i> Tạo Báo Cáo Sự Cố
            </button>
          </div>

          {/* Stats Grid */}
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

          {/* Reports Table */}
          <div className="table-section">
            <div className="table-header">
              <h3>Lịch sử báo cáo gần đây</h3>
              <a href="#" className="view-all" onClick={() => navigate('/my-reports')}>
                Xem tất cả <i className="fa-solid fa-arrow-right" style={{ marginLeft: '4px', fontSize: '12px' }}></i>
              </a>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Mã Lỗi</th>
                  <th>Nội dung sự cố</th>
                  <th>Danh mục</th>
                  <th>Ngày báo</th>
                  <th>Trạng thái</th>
                  <th>Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.id}</td>
                    <td className="ticket-title">{report.title}</td>
                    <td>{report.category}</td>
                    <td>{report.date}</td>
                    <td>
                      <span className={`badge ${statusBadge[report.status].class}`}>
                        {statusBadge[report.status].label}
                      </span>
                    </td>
                    <td>
                      <button className="action-btn" onClick={() => navigate(`/report/${report.id}`)}>
                        <i className="fa-solid fa-eye"></i>
                      </button>
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
