import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar/Sidebar';
import Header from '../../../components/Header/Header';
import './StudentDashboard.css';
import pendingIcon from '../../../images/pending.png';
import progressIcon from '../../../images/working.png';
import resolvedIcon from '../../../images/finished.png';

export default function StudentDashboard() {
  const navigate = useNavigate();
  
  const [currentUser, setCurrentUser] = useState(null);
  const [reports, setReports] = useState([]); // State lưu danh sách báo cáo thật
  const [isLoading, setIsLoading] = useState(true); // Trạng thái loading
  const [selectedReport, setSelectedReport] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      // Gọi hàm lấy báo cáo sự cố sau khi đã có thông tin user
      fetchReports(user.id);
    } else {
      navigate('/login', { state: { role: 'student' } });
    }
  }, [navigate]);

  // HÀM GỌI API LẤY DANH SÁCH BÁO CÁO TỪ MONGODB
  const fetchReports = async (studentId) => {
    try {
      // Đảm bảo bạn đã thêm ticketRoutes vào backend như mình hướng dẫn ở trên nhé
      const response = await fetch(`http://localhost:5000/api/tickets/student/${studentId}`);
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error("Lỗi mạng khi tải danh sách báo cáo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // TỰ ĐỘNG TÍNH TOÁN CÁC CON SỐ THỐNG KÊ
  const pendingCount = reports.filter(r => r.status === 'pending').length;
  const progressCount = reports.filter(r => r.status === 'progress').length;
  const resolvedCount = reports.filter(r => r.status === 'resolved').length;

  const stats = [
    { imgSrc: pendingIcon, label: 'Đang chờ duyệt', value: pendingCount, color: 'blue' },
    { imgSrc: progressIcon, label: 'Thợ đang xử lý', value: progressCount, color: 'orange' },
    { imgSrc: resolvedIcon, label: 'Đã sửa xong', value: resolvedCount, color: 'green' }
  ];

  const statusBadge = {
    pending: { label: 'Chờ duyệt', class: 'badge-pending' },
    progress: { label: 'Đang xử lý', class: 'badge-progress' },
    resolved: { label: 'Đã xong', class: 'badge-resolved' }
  };

  // Hàm format ngày giờ hiển thị cho đẹp (Từ MongoDB xuất ra)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
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
              <h2>Xin chào, {currentUser ? currentUser.fullName : 'Sinh viên'}! 👋</h2>
              {currentUser && currentUser.room && (
                <p style={{ fontWeight: 'bold', marginBottom: '6px', color: '#e2e8f0' }}>
                  <i className="fa-solid fa-door-closed" style={{ marginRight: '6px' }}></i>
                  Phòng KTX: {currentUser.room}
                </p>
              )}
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
                  {/* THAY THẺ <i> THÀNH THẺ <img> */}
                  <img src={stat.imgSrc} alt={stat.label} className="custom-stat-img" />
                </div>
                <div className="stat-info">
                  <p>{stat.label}</p>
                  <h3>{isLoading ? '...' : stat.value}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Reports Table */}
          <div className="table-section">
            <div className="table-header">
              <h3>Lịch sử báo cáo gần đây</h3>
              <a href="#" className="view-all" onClick={(e) => { e.preventDefault(); navigate('/my-reports'); }}>
                Xem tất cả <i className="fa-solid fa-arrow-right" style={{ marginLeft: '4px', fontSize: '12px' }}></i>
              </a>
            </div>
            
            {/* Hiển thị bảng nếu có dữ liệu, nếu không thì báo trống */}
            {reports.length > 0 ? (
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
                    <tr key={report._id}>
                      {/* Cắt 4 số cuối của ID MongoDB làm Mã lỗi cho gọn */}
                      <td>QF-{report._id.substring(report._id.length - 4).toUpperCase()}</td>
                      <td className="ticket-title">{report.title}</td>
                      <td>{report.category}</td>
                      <td>{formatDate(report.createdAt)}</td>
                      <td>
                        <span className={`badge ${statusBadge[report.status]?.class || 'badge-pending'}`}>
                          {statusBadge[report.status]?.label || 'Không rõ'}
                        </span>
                      </td>
                      <td>
                        <button className="btn-view-detail" onClick={() => setSelectedReport(report)}>
                          Xem
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                {isLoading ? 'Đang tải dữ liệu...' : 'Bạn chưa có báo cáo sự cố nào.'}
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedReport && (
        <div className="sd-modal-overlay" onClick={() => setSelectedReport(null)}>
          {/* Ngăn không cho click xuyên qua form để đóng popup */}
          <div className="sd-modal-box" onClick={(e) => e.stopPropagation()}> 
            
            <div className="sd-modal-header">
              <h2>Chi Tiết Sự Cố</h2>
              <p>Mã lỗi: QF-{selectedReport._id.substring(selectedReport._id.length - 4).toUpperCase()}</p>
            </div>

            <div className="sd-modal-body">
              <div className="sd-row">
                <div className="sd-group">
                  <label>Tiêu đề sự cố</label>
                  <input type="text" value={selectedReport.title} readOnly />
                </div>
                <div className="sd-group">
                  <label>Số phòng</label>
                  <input type="text" value={selectedReport.room} readOnly />
                </div>
              </div>

              <div className="sd-row">
                <div className="sd-group">
                  <label>Danh mục</label>
                  <input type="text" value={selectedReport.category} readOnly />
                </div>
                <div className="sd-group">
                  <label>Ngày báo cáo</label>
                  <input type="text" value={formatDate(selectedReport.createdAt)} readOnly />
                </div>
              </div>
              
              {/* Chỉ hiển thị khu vực ảnh nếu báo cáo có đính kèm ảnh */}
              {selectedReport.imageUrls && selectedReport.imageUrls.length > 0 && (
                <div className="sd-group">
                  <label>Hình ảnh đính kèm</label>

                  <div className="sd-image-grid">

                    {selectedReport.imageUrls.map((img, index) => (
                      <div 
                        key={index} 
                        className="sd-image-preview"
                        onClick={() => setEnlargedImage(img)}
                        title="Nhấn để phóng to ảnh"
                      >
                        <img src={img} alt={`report-img-${index}`} />
                      </div>
                    ))}
                    
                  </div>
                </div>
              )}

              <div className="sd-group">
                <label>Mô tả chi tiết</label>
                <textarea value={selectedReport.description} readOnly></textarea>
              </div>

              <div className="sd-actions">
                <button className="sd-btn-close" onClick={() => setSelectedReport(null)}>
                  Đóng Pop-up
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {enlargedImage && (
        <div className="sd-image-zoom-overlay" onClick={() => setEnlargedImage(null)}>
          <span className="sd-zoom-close">✕</span>
          <img 
            src={enlargedImage} 
            alt="Phóng to" 
            className="sd-zoom-content" 
            onClick={(e) => e.stopPropagation()} /* Chặn tắt khi bấm vào trong ảnh */
          />
        </div>
      )}

    </div>
  );
}