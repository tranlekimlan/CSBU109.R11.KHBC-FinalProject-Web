import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar/Sidebar';
import Header from '../../../components/Header/Header';
import './MyReports.css';

// IMPORT HÌNH ẢNH TỪ THƯ MỤC ASSETS
import totalIcon from '../../../images/task.png';
import pendingIcon from '../../../images/pending.png';
import progressIcon from '../../../images/working.png';
import resolvedIcon from '../../../images/finished.png';

export default function MyReports() {
  const navigate = useNavigate();
  
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);

  // Rating state in detail modal
  const [ratingScore, setRatingScore] = useState(0);
  const [starHover, setStarHover] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [isEditingRating, setIsEditingRating] = useState(false);

  const openReportDetail = (report) => {
    setSelectedReport(report);
    setRatingScore(report.rating?.score || 0);
    setRatingComment(report.rating?.comment || '');
    setStarHover(0);
    setIsEditingRating(false);
  };

  const handleRateSubmit = async () => {
    if (!ratingScore || !selectedReport) return;
    setIsSubmittingRating(true);
    try {
      const res = await fetch(`http://localhost:5000/api/tickets/${selectedReport._id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: ratingScore, comment: ratingComment })
      });
      const data = await res.json();
      if (res.ok) {
        const updatedRating = { score: ratingScore, comment: ratingComment, ratedAt: new Date() };
        setReports(prev => prev.map(r => r._id === selectedReport._id ? { ...r, rating: updatedRating } : r));
        setSelectedReport(prev => ({ ...prev, rating: updatedRating }));
        setIsEditingRating(false);
        alert('Cảm ơn bạn đã gửi đánh giá! Đánh giá đã được lưu vào Lịch sử đánh giá công việc.');
      } else {
        alert(data.message || 'Lỗi khi gửi đánh giá');
      }
    } catch (err) {
      alert('Không thể kết nối máy chủ');
    } finally {
      setIsSubmittingRating(false);
    }
  };

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
    assigned: { label: 'Chưa Bắt Đầu', class: 'badge-assigned' },
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
                        <button className="btn-view-detail" onClick={() => openReportDetail(report)}>
                          Xem
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

      {selectedReport && (
        <div className="sd-modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="sd-modal-box" onClick={(e) => e.stopPropagation()}> 
            
            <div className="sd-modal-header">
              <h2>Chi Tiết Sự Cố</h2>
              <p>Mã lỗi: {formatId(selectedReport._id)}</p>
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

              {/* PHẦN ĐÁNH GIÁ CHẤT LƯỢNG KHI SỰ CỐ ĐÃ HOÀN THÀNH (RESOLVED) */}
              {selectedReport.status === 'resolved' && (
                <div className="sd-rating-section">
                  <div className="sd-rating-header">
                    <h4>
                      <i className="fa-solid fa-star" style={{ color: '#f59e0b' }}></i>
                      {selectedReport.rating?.score && !isEditingRating
                        ? 'Đánh giá dịch vụ sửa chữa'
                        : 'Đánh giá chất lượng sửa chữa (1 - 5 sao)'}
                    </h4>
                    <p>
                      {selectedReport.rating?.score && !isEditingRating
                        ? 'Cảm ơn bạn đã để lại phản hồi cho công việc này.'
                        : 'Vui lòng chọn số sao và gửi nhận xét để đánh giá kết quả sửa chữa của thợ.'}
                    </p>
                  </div>

                  {selectedReport.rating?.score && !isEditingRating ? (
                    <div>
                      <div className="sd-rated-box">
                        <div className="sd-rated-stars">
                          {'★'.repeat(selectedReport.rating.score)}
                          <span style={{ color: '#d1d5db' }}>
                            {'★'.repeat(5 - selectedReport.rating.score)}
                          </span>
                          <span className="score-num">({selectedReport.rating.score}/5 sao)</span>
                        </div>
                        {selectedReport.rating.comment ? (
                          <p className="sd-rated-comment">"{selectedReport.rating.comment}"</p>
                        ) : (
                          <p className="sd-rated-comment" style={{ color: '#94a3b8' }}>(Không có nhận xét)</p>
                        )}
                        {selectedReport.rating.ratedAt && (
                          <span className="sd-rated-time">
                            <i className="fa-regular fa-clock" style={{ marginRight: '6px' }}></i>
                            Ngày đánh giá: {formatDate(selectedReport.rating.ratedAt)}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        className="sd-btn-rate-edit"
                        onClick={() => setIsEditingRating(true)}
                      >
                        <i className="fa-solid fa-pen-to-square" style={{ marginRight: '6px' }}></i>
                        Chỉnh sửa đánh giá
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="sd-star-row">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className={`sd-star-btn ${(starHover || ratingScore) >= star ? 'active' : ''}`}
                            onMouseEnter={() => setStarHover(star)}
                            onMouseLeave={() => setStarHover(0)}
                            onClick={() => setRatingScore(star)}
                            title={`${star} sao`}
                          >
                            ★
                          </button>
                        ))}
                        <span className="sd-star-label">
                          {starHover === 1 || (!starHover && ratingScore === 1) ? 'Rất không hài lòng (1 sao)' : ''}
                          {starHover === 2 || (!starHover && ratingScore === 2) ? 'Chưa hài lòng (2 sao)' : ''}
                          {starHover === 3 || (!starHover && ratingScore === 3) ? 'Bình thường (3 sao)' : ''}
                          {starHover === 4 || (!starHover && ratingScore === 4) ? 'Hài lòng (4 sao)' : ''}
                          {starHover === 5 || (!starHover && ratingScore === 5) ? 'Rất hài lòng (5 sao)' : ''}
                          {!starHover && !ratingScore ? 'Chọn số sao' : ''}
                        </span>
                      </div>

                      <textarea
                        className="sd-rating-textarea"
                        placeholder="Nhập nhận xét của bạn về thái độ phục vụ và kết quả hoàn thành của thợ (tùy chọn)..."
                        value={ratingComment}
                        onChange={(e) => setRatingComment(e.target.value)}
                        rows={3}
                      />

                      <div className="sd-rating-actions">
                        <button
                          type="button"
                          className="sd-btn-rate-submit"
                          disabled={!ratingScore || isSubmittingRating}
                          onClick={handleRateSubmit}
                        >
                          {isSubmittingRating ? (
                            <>
                              <i className="fa-solid fa-circle-notch fa-spin"></i>
                              Đang lưu...
                            </>
                          ) : (
                            <>
                              <i className="fa-solid fa-paper-plane"></i>
                              {isEditingRating ? 'Cập nhật đánh giá' : 'Gửi đánh giá'}
                            </>
                          )}
                        </button>
                        {isEditingRating && (
                          <button
                            type="button"
                            className="sd-btn-rate-edit"
                            onClick={() => {
                              setIsEditingRating(false);
                              setRatingScore(selectedReport.rating?.score || 0);
                              setRatingComment(selectedReport.rating?.comment || '');
                            }}
                          >
                            Hủy
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

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
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}

    </div>
  );
}