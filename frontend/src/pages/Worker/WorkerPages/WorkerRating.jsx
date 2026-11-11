import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar/Sidebar';
import Header from '../../../components/Header/Header';
import './WorkerPages.css';

export default function WorkerRating() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [ratedTasks, setRatedTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [starFilter, setStarFilter] = useState('all'); // 'all' | '5' | '4' | '3' | 'low'
  const [selectedTask, setSelectedTask] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const parsedUser = JSON.parse(userStr);
      if (parsedUser.role !== 'worker') {
        navigate('/login');
        return;
      }
      setCurrentUser(parsedUser);
      const workerId = parsedUser._id || parsedUser.id;
      if (workerId) {
        fetchWorkerRatings(workerId);
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchWorkerRatings = async (workerId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/tickets/worker/${workerId}`);
      if (response.ok) {
        const data = await response.json();
        // Lọc các công việc đã có sinh viên đánh giá
        const reviewed = (data || []).filter(t => t.rating && t.rating.score);
        setRatedTasks(reviewed);
      }
    } catch (error) {
      console.error('Lỗi khi tải đánh giá của thợ:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Tính toán các chỉ số thống kê
  const totalReviews = ratedTasks.length;
  const avgScore = totalReviews > 0
    ? (ratedTasks.reduce((acc, t) => acc + t.rating.score, 0) / totalReviews).toFixed(1)
    : '5.0';
  const fiveStarCount = ratedTasks.filter(t => t.rating.score === 5).length;
  const positiveCount = ratedTasks.filter(t => t.rating.score >= 4).length;
  const positiveRate = totalReviews > 0
    ? Math.round((positiveCount / totalReviews) * 100)
    : 100;

  // Lọc theo số sao
  const filteredTasks = ratedTasks.filter(task => {
    if (starFilter === 'all') return true;
    if (starFilter === '5') return task.rating.score === 5;
    if (starFilter === '4') return task.rating.score === 4;
    if (starFilter === '3') return task.rating.score === 3;
    if (starFilter === 'low') return task.rating.score <= 2;
    return true;
  });

  const formatId = (id) => 'QF-' + id.substring(id.length - 4).toUpperCase();
  const formatDate = (dateString) => {
    if (!dateString) return '---';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="app-container">
      <Sidebar role="worker" />

      <main className="main-content">
        <Header title="Đánh Giá Của Tôi" />

        <div className="dashboard-body">
          {/* BANNER THỐNG KÊ */}
          <div className="worker-rating-stats">
            <div className="worker-stat-card">
              <div className="worker-stat-icon icon-amber">
                <i className="fa-solid fa-star"></i>
              </div>
              <div className="worker-stat-info">
                <p>Điểm trung bình</p>
                <h3>{totalReviews > 0 ? avgScore : '---'} <span style={{ fontSize: '14px', fontWeight: 600, color: '#f59e0b' }}>/ 5.0</span></h3>
              </div>
            </div>

            <div className="worker-stat-card">
              <div className="worker-stat-icon icon-blue">
                <i className="fa-solid fa-comments"></i>
              </div>
              <div className="worker-stat-info">
                <p>Tổng lượt đánh giá</p>
                <h3>{totalReviews} <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>lượt</span></h3>
              </div>
            </div>

            <div className="worker-stat-card">
              <div className="worker-stat-icon icon-green">
                <i className="fa-solid fa-award"></i>
              </div>
              <div className="worker-stat-info">
                <p>Đánh giá 5 sao</p>
                <h3>{fiveStarCount} <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>lượt</span></h3>
              </div>
            </div>

            <div className="worker-stat-card">
              <div className="worker-stat-icon icon-purple">
                <i className="fa-solid fa-thumbs-up"></i>
              </div>
              <div className="worker-stat-info">
                <p>Tỷ lệ hài lòng (≥4★)</p>
                <h3>{totalReviews > 0 ? `${positiveRate}%` : '100%'}</h3>
              </div>
            </div>
          </div>

          {/* BỘ LỌC THEO SỐ SAO */}
          <div className="rating-filter-bar">
            <button
              className={`rating-filter-pill ${starFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStarFilter('all')}
            >
              Tất cả ({ratedTasks.length})
            </button>
            <button
              className={`rating-filter-pill ${starFilter === '5' ? 'active' : ''}`}
              onClick={() => setStarFilter('5')}
            >
              ⭐ 5 sao ({ratedTasks.filter(t => t.rating.score === 5).length})
            </button>
            <button
              className={`rating-filter-pill ${starFilter === '4' ? 'active' : ''}`}
              onClick={() => setStarFilter('4')}
            >
              ⭐ 4 sao ({ratedTasks.filter(t => t.rating.score === 4).length})
            </button>
            <button
              className={`rating-filter-pill ${starFilter === '3' ? 'active' : ''}`}
              onClick={() => setStarFilter('3')}
            >
              ⭐ 3 sao ({ratedTasks.filter(t => t.rating.score === 3).length})
            </button>
            <button
              className={`rating-filter-pill ${starFilter === 'low' ? 'active' : ''}`}
              onClick={() => setStarFilter('low')}
            >
              ⭐ 1 - 2 sao ({ratedTasks.filter(t => t.rating.score <= 2).length})
            </button>
          </div>

          {/* DANH SÁCH ĐÁNH GIÁ */}
          <div className="rating-list-container">
            {isLoading ? (
              <div className="empty-state">
                <i className="fa-solid fa-circle-notch fa-spin"></i>
                <p>Đang tải danh sách đánh giá...</p>
              </div>
            ) : filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <div key={task._id} className="rating-review-card">
                  <div className="review-card-header">
                    <div className="review-ticket-meta">
                      <span className="review-code-badge">{formatId(task._id)}</span>
                      <div>
                        <div className="review-ticket-title">{task.title}</div>
                        <div style={{ marginTop: '4px', display: 'flex', gap: '8px' }}>
                          <span className="review-room-pill">Phòng: {task.room}</span>
                          <span className="review-room-pill">{task.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="review-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          className={`fa-solid fa-star ${star <= task.rating.score ? '' : 'star-empty'}`}
                        ></i>
                      ))}
                      <span className="review-score-tag">({task.rating.score}/5 sao)</span>
                    </div>
                  </div>

                  {task.rating.comment ? (
                    <div className="review-comment-box">
                      "{task.rating.comment}"
                    </div>
                  ) : (
                    <div className="review-no-comment">
                      (Sinh viên không để lại nhận xét bằng lời)
                    </div>
                  )}

                  <div className="review-card-footer">
                    <div className="review-student-info">
                      <i className="fa-solid fa-user-check"></i>
                      <span>
                        Sinh viên: <strong>{task.studentId?.fullName || 'Sinh viên KTX'}</strong>
                        {task.studentId?.room && ` (Phòng ${task.studentId.room})`}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span>
                        <i className="fa-regular fa-clock" style={{ marginRight: '6px' }}></i>
                        {formatDate(task.rating.ratedAt)}
                      </span>
                      <button
                        className="btn-view-task"
                        onClick={() => setSelectedTask(task)}
                      >
                        <i className="fa-solid fa-eye" style={{ marginRight: '6px' }}></i>
                        Xem việc
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <i className="fa-solid fa-star-half-stroke" style={{ fontSize: '36px', color: '#cbd5e1', marginBottom: '12px' }}></i>
                <p>Chưa có đánh giá nào ở mục này.</p>
                <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
                  Khi hoàn thành các công việc được giao và sinh viên để lại đánh giá, chúng sẽ xuất hiện tại đây.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODAL CHI TIẾT CÔNG VIỆC CHO THỢ */}
      {selectedTask && (
        <div className="wk-modal-overlay" onClick={() => setSelectedTask(null)}>
          <div className="wk-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="wk-modal-header">
              <h2>Chi Tiết Công Việc & Đánh Giá</h2>
              <span className="review-code-badge">{formatId(selectedTask._id)}</span>
            </div>

            <div className="wk-modal-body">
              <div className="wk-row">
                <div className="wk-group">
                  <label>Tiêu đề công việc</label>
                  <input type="text" value={selectedTask.title} readOnly />
                </div>
                <div className="wk-group">
                  <label>Phòng</label>
                  <input type="text" value={selectedTask.room} readOnly />
                </div>
              </div>

              <div className="wk-row">
                <div className="wk-group">
                  <label>Danh mục</label>
                  <input type="text" value={selectedTask.category} readOnly />
                </div>
                <div className="wk-group">
                  <label>Người báo cáo</label>
                  <input
                    type="text"
                    value={selectedTask.studentId?.fullName ? `${selectedTask.studentId.fullName} (${selectedTask.studentId.phone || 'KTX'})` : 'Sinh viên'}
                    readOnly
                  />
                </div>
              </div>

              <div className="wk-group" style={{ marginBottom: '16px' }}>
                <label>Mô tả sự cố ban đầu</label>
                <textarea value={selectedTask.description} readOnly rows={3}></textarea>
              </div>

              {selectedTask.imageUrls && selectedTask.imageUrls.length > 0 && (
                <div className="wk-group" style={{ marginBottom: '16px' }}>
                  <label>Hình ảnh đính kèm</label>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {selectedTask.imageUrls.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="task-img"
                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', cursor: 'zoom-in', border: '1px solid #e2e8f0' }}
                        onClick={() => setEnlargedImage(img)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* KHỐI NỔI BẬT ĐÁNH GIÁ CỦA SINH VIÊN */}
              <div className="wk-review-highlight">
                <h4>
                  <i className="fa-solid fa-star" style={{ color: '#f59e0b' }}></i>
                  Đánh giá từ sinh viên: {selectedTask.rating.score}/5 sao
                </h4>
                <div className="review-stars" style={{ marginBottom: '8px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`fa-solid fa-star ${star <= selectedTask.rating.score ? '' : 'star-empty'}`}
                    ></i>
                  ))}
                </div>
                {selectedTask.rating.comment ? (
                  <p style={{ fontStyle: 'italic', color: '#1e293b', margin: '6px 0 10px 0' }}>
                    "{selectedTask.rating.comment}"
                  </p>
                ) : (
                  <p style={{ color: '#94a3b8', fontStyle: 'italic', margin: '6px 0 10px 0' }}>
                    (Sinh viên không ghi nhận xét bằng lời)
                  </p>
                )}
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Ngày đánh giá: {formatDate(selectedTask.rating.ratedAt)}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setSelectedTask(null)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHÓNG TO HÌNH ẢNH */}
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
