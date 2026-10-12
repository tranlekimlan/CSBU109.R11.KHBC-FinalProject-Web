import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import './MyReports.css';

// IMPORT HÌNH ẢNH TỪ THƯ MỤC ASSETS
import totalIcon from '../../images/task.png';
import pendingIcon from '../../images/pending.png';
import progressIcon from '../../images/working.png';
import resolvedIcon from '../../images/finished.png';

export default function MyReports() {
  const navigate = useNavigate();
  
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Lấy dữ liệu khi load trang VÀ MỖI LẦN TRANG ĐƯỢC HIỂN THỊ
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      
      // FIX LỖI Ở ĐÂY: Ưu tiên dùng user.id giống bên CreateReport 
      // (kèm theo user._id để dự phòng nếu sau này đổi chuẩn)
      const studentId = user.id || user._id; 
      
      console.log("=> Đang tìm báo cáo cho sinh viên mang ID:", studentId);
      
      if (studentId) {
        fetchMyReports(studentId);
      } else {
        console.error("Không tìm thấy ID của User trong localStorage!");
      }

    } else {
      navigate('/login', { state: { role: 'student' } });
    }
  }, [navigate]);

  const fetchMyReports = async (studentId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tickets/student/${studentId}`);
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      } else {
        // NÂNG CẤP DÒNG 39: Đọc luôn câu chửi của Backend để biết nó lỗi gì
        const errorData = await response.json();
        console.error("Lỗi từ backend trả về:", errorData);
      }
    } catch (error) {
      console.error("Lỗi mạng:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const formatId = (id) => {
    return 'QF-' + id.substring(id.length - 4).toUpperCase();
  };

  return (
    <div className="app-container">
      <Sidebar />

      <main className="main-content">
        <Header title="Báo cáo của tôi" />

        <div className="dashboard-body">
          
          {/* CẬP NHẬT THẺ THỐNG KÊ DÙNG HÌNH ẢNH */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon icon-blue">
                <img src={totalIcon} alt="Tổng" className="custom-stat-img" />
              </div>
              <div className="stat-info">
                <p>Tổng báo cáo</p>
                <h3>{isLoading ? '...' : statsData.total}</h3>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon icon-blue">
                <img src={pendingIcon} alt="Chờ duyệt" className="custom-stat-img" />
              </div>
              <div className="stat-info">
                <p>Chờ duyệt</p>
                <h3>{isLoading ? '...' : statsData.pending}</h3>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon icon-orange">
                <img src={progressIcon} alt="Đang xử lý" className="custom-stat-img" />
              </div>
              <div className="stat-info">
                <p>Đang xử lý</p>
                <h3>{isLoading ? '...' : statsData.progress}</h3>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon icon-green">
                <img src={resolvedIcon} alt="Đã xong" className="custom-stat-img" />
              </div>
              <div className="stat-info">
                <p>Đã xong</p>
                <h3>{isLoading ? '...' : statsData.resolved}</h3>
              </div>
            </div>
          </div>

          {/* Filter & Table (Giữ nguyên) */}
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

            {isLoading ? (
              <div className="empty-state">
                <i className="fa-solid fa-circle-notch fa-spin"></i>
                <p>Đang tải dữ liệu...</p>
              </div>
            ) : filteredReports.length > 0 ? (
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
                    <tr key={report._id}>
                      <td className="ticket-id">{formatId(report._id)}</td>
                      <td className="ticket-title">{report.title}</td>
                      <td>{report.category}</td>
                      <td>{report.room}</td>
                      <td>{formatDate(report.createdAt)}</td>
                      <td>
                        <span className={`badge ${statusBadge[report.status]?.class || 'badge-pending'}`}>
                          {statusBadge[report.status]?.label || 'Không rõ'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="action-btn" 
                          title="Xem chi tiết"
                          onClick={() => navigate(`/report/${report._id}`)}
                        >
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
                <p>Không có báo cáo nào ở trạng thái này</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}