import { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import './MyReports.css';

export default function MyReports() {
  const [reports] = useState([
    
  ]);

  const [filter, setFilter] = useState('all');

  const statusBadge = {
    pending: { label: 'Chờ duyệt', class: 'badge-pending' },
    progress: { label: 'Đang xử lý', class: 'badge-progress' },
    resolved: { label: 'Đã xong', class: 'badge-resolved' }
  };

  const filteredReports = filter === 'all'
    ? reports
    : reports.filter(r => r.status === filter);

  const statsData = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    progress: reports.filter(r => r.status === 'progress').length,
    resolved: reports.filter(r => r.status === 'resolved').length
  };

  return (
    <div className="app-container">
      <Sidebar />

      <main className="main-content">
        <Header title="Báo cáo của tôi" />

        <div className="dashboard-body">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon icon-blue">
                <i className="fa-solid fa-list"></i>
              </div>
              <div className="stat-info">
                <p>Tổng báo cáo</p>
                <h3>{statsData.total}</h3>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon icon-blue">
                <i className="fa-solid fa-spinner"></i>
              </div>
              <div className="stat-info">
                <p>Chờ duyệt</p>
                <h3>{statsData.pending}</h3>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon icon-orange">
                <i className="fa-solid fa-person-digging"></i>
              </div>
              <div className="stat-info">
                <p>Đang xử lý</p>
                <h3>{statsData.progress}</h3>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon icon-green">
                <i className="fa-solid fa-check-double"></i>
              </div>
              <div className="stat-info">
                <p>Đã xong</p>
                <h3>{statsData.resolved}</h3>
              </div>
            </div>
          </div>

          {/* Filter & Table */}
          <div className="table-section">
            <div className="table-header">
              <h3>Danh sách báo cáo của tôi</h3>
              <div className="filter-group">
                <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
                  <option value="all">Tất cả</option>
                  <option value="pending">Chờ duyệt</option>
                  <option value="progress">Đang xử lý</option>
                  <option value="resolved">Đã xong</option>
                </select>
              </div>
            </div>

            {filteredReports.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Mã Lỗi</th>
                    <th>Nội dung</th>
                    <th>Danh mục</th>
                    <th>Phòng</th>
                    <th>Ngày báo</th>
                    <th>Trạng thái</th>
                    <th>Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report) => (
                    <tr key={report.id}>
                      <td className="ticket-id">{report.id}</td>
                      <td className="ticket-title">{report.title}</td>
                      <td>{report.category}</td>
                      <td>{report.room}</td>
                      <td>{report.date}</td>
                      <td>
                        <span className={`badge ${statusBadge[report.status].class}`}>
                          {statusBadge[report.status].label}
                        </span>
                      </td>
                      <td>
                        <button className="action-btn" title="Xem chi tiết">
                          <i className="fa-solid fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <i className="fa-solid fa-inbox"></i>
                <p>Không có báo cáo nào</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
