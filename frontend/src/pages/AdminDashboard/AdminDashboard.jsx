import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import './admin-dashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Thống kê dành cho Admin (Bao quát toàn hệ thống và nhân sự)
  const stats = [
    { icon: 'fa-triangle-exclamation', label: 'Sự cố chờ phân công', value: 12, color: 'red' },
    { icon: 'fa-person-digging', label: 'Thợ đang xử lý', value: 8, color: 'orange' },
    { icon: 'fa-check-double', label: 'Đã xong (Tháng này)', value: 145, color: 'green' },
    { icon: 'fa-users-gear', label: 'Thợ đang trực', value: 5, color: 'purple' }
  ];

  // Báo cáo có thêm cột Phòng/Người báo để Admin dễ điều phối
  const reports = [
    {
      id: 'QF-1241',
      room: 'A202',
      title: 'Chập điện cầu dao tổng',
      category: 'Điện / Ánh sáng',
      date: '28/10/2026',
      status: 'pending'
    },
    {
      id: 'QF-1240',
      room: 'C105',
      title: 'Quạt trần kêu to và lắc mạnh',
      category: 'Điện / Ánh sáng',
      date: '27/10/2026',
      status: 'progress'
    },
    {
      id: 'QF-1122',
      room: 'B301',
      title: 'Vòi nước bồn rửa mặt bị rỉ',
      category: 'Hệ thống Nước',
      date: '15/10/2026',
      status: 'resolved'
    }
  ];

  const statusBadge = {
    pending: { label: 'Chờ phân công', class: 'badge-pending' },
    progress: { label: 'Đang sửa chữa', class: 'badge-progress' },
    resolved: { label: 'Đã nghiệm thu', class: 'badge-resolved' }
  };

  return (
    <div className="app-container">
      <Sidebar role='admin'/>

      <main className="main-content">
        <Header title="Tổng quan Quản trị" />

        <div className="dashboard-body">
          {/* Banner với màu sắc quyền lực hơn cho Admin */}
          <div className="welcome-banner admin-banner">
            <div className="welcome-text">
              <h2>Xin chào, Ban Quản Lý KTX!</h2>
              <p>Tóm tắt tình hình cơ sở vật chất và điều phối nhân sự ngày hôm nay.</p>
            </div>
            <div className="admin-actions">
              <button className="btn-secondary" onClick={() => navigate('/manage-workers')}>
                <i className="fa-solid fa-user-plus"></i> Cấp tài khoản Thợ
              </button>
              <button className="btn-create-ticket" onClick={() => alert('Đang xuất báo cáo Excel...')}>
                <i className="fa-solid fa-file-export"></i> Xuất Báo Cáo
              </button>
            </div>
          </div>

          {/* Grid 4 cột cho Admin thay vì 3 */}
          <div className="stats-grid admin-stats">
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

          <div className="table-section">
            <div className="table-header">
              <h3>Sự cố cần điều phối gấp</h3>
              <a href="#" className="view-all" onClick={() => navigate('/admin/all-tickets')}>
                Quản lý toàn bộ <i className="fa-solid fa-arrow-right" style={{ marginLeft: '4px', fontSize: '12px' }}></i>
              </a>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Mã Lỗi</th>
                  <th>Phòng</th>
                  <th>Nội dung sự cố</th>
                  <th>Danh mục</th>
                  <th>Ngày báo</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td><strong>{report.id}</strong></td>
                    <td><span className="room-tag">{report.room}</span></td>
                    <td className="ticket-title">{report.title}</td>
                    <td>{report.category}</td>
                    <td>{report.date}</td>
                    <td>
                      <span className={`badge ${statusBadge[report.status].class}`}>
                        {statusBadge[report.status].label}
                      </span>
                    </td>
                    <td>
                      {report.status === 'pending' ? (
                        <button className="action-btn assign-btn" onClick={() => navigate(`/admin/assign/${report.id}`)} title="Phân công thợ">
                          <i className="fa-solid fa-clipboard-user"></i> Phân công
                        </button>
                      ) : (
                        <button className="action-btn" onClick={() => navigate(`/report/${report.id}`)} title="Xem chi tiết">
                          <i className="fa-solid fa-eye"></i>
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