import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar/Sidebar';
import Header from '../../../components/Header/Header';
import './StudentPages.css';

export default function StudentComplaints() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('rated'); // 'rated' | 'pending' | 'complaint'

  // Rating modal state
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ratingScore, setRatingScore] = useState(0);
  const [starHover, setStarHover] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [isEditingRating, setIsEditingRating] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState(null);

  // Form khiếu nại phụ
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const parsedUser = JSON.parse(userStr);
      if (parsedUser.role !== 'student') {
        navigate('/login');
        return;
      }
      setCurrentUser(parsedUser);
      const studentId = parsedUser.id || parsedUser._id;
      fetchData(studentId);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchData = async (studentId) => {
    setIsLoading(true);
    try {
      // 1. Lấy danh sách sự cố của sinh viên để lọc ra lịch sử đánh giá
      const ticketRes = await fetch(`http://localhost:5000/api/tickets/student/${studentId}`);
      if (ticketRes.ok) {
        const ticketData = await ticketRes.json();
        setTickets(ticketData || []);
      }

      // 2. Lấy danh sách khiếu nại riêng (nếu có)
      const compRes = await fetch(`http://localhost:5000/api/complaints/student/${studentId}`);
      if (compRes.ok) {
        const compData = await compRes.json();
        setComplaints(compData || []);
      }
    } catch (error) {
      console.error('Lỗi tải dữ liệu đánh giá:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Lọc các công việc đã đánh giá và chờ đánh giá
  const ratedTickets = tickets.filter(t => t.rating && t.rating.score);
  const pendingRatingTickets = tickets.filter(t => t.status === 'resolved' && !(t.rating && t.rating.score));

  const formatId = (id) => 'QF-' + id.substring(id.length - 4).toUpperCase();
  const formatDate = (dateString) => {
    if (!dateString) return '---';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const openRatingModal = (ticket, editMode = false) => {
    setSelectedTicket(ticket);
    setRatingScore(ticket.rating?.score || 0);
    setRatingComment(ticket.rating?.comment || '');
    setStarHover(0);
    setIsEditingRating(editMode || !ticket.rating?.score);
  };

  const handleRateSubmit = async () => {
    if (!ratingScore || !selectedTicket) return;
    setIsSubmittingRating(true);
    try {
      const res = await fetch(`http://localhost:5000/api/tickets/${selectedTicket._id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: ratingScore, comment: ratingComment })
      });
      const data = await res.json();
      if (res.ok) {
        const updatedRating = { score: ratingScore, comment: ratingComment, ratedAt: new Date() };
        setTickets(prev => prev.map(t => t._id === selectedTicket._id ? { ...t, rating: updatedRating } : t));
        setSelectedTicket(prev => ({ ...prev, rating: updatedRating }));
        setIsEditingRating(false);
        alert('Cảm ơn bạn! Đánh giá đã được lưu vào lịch sử đánh giá.');
      } else {
        alert(data.message || 'Lỗi khi gửi đánh giá');
      }
    } catch (err) {
      alert('Không thể kết nối máy chủ');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Vui lòng điền đầy đủ tiêu đề và nội dung khiếu nại!');
      return;
    }

    setIsSubmittingComplaint(true);
    try {
      const studentId = currentUser.id || currentUser._id;
      const res = await fetch('http://localhost:5000/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          studentName: currentUser.fullName,
          email: currentUser.email,
          title: formData.title,
          content: formData.content
        })
      });

      if (res.ok) {
        alert('Gửi khiếu nại thành công!');
        setFormData({ title: '', content: '' });
        fetchData(studentId);
      } else {
        alert('Có lỗi xảy ra khi gửi khiếu nại.');
      }
    } catch (err) {
      alert('Không thể kết nối máy chủ.');
    } finally {
      setIsSubmittingComplaint(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />

      <main className="main-content">
        <Header title="Đánh Giá Công Việc" />

        <div className="dashboard-body">
          {/* TAB BAR NAVIGATION */}
          <div className="rating-tab-bar">
            <button
              type="button"
              className={`rating-tab-btn ${activeTab === 'rated' ? 'active' : ''}`}
              onClick={() => setActiveTab('rated')}
            >
              <i className="fa-solid fa-star star-gold"></i>
              Lịch sử đã đánh giá
              <span className="rating-tab-badge">{ratedTickets.length}</span>
            </button>

            <button
              type="button"
              className={`rating-tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              <i className="fa-solid fa-clock-rotate-left"></i>
              Chờ bạn đánh giá
              <span className="rating-tab-badge">{pendingRatingTickets.length}</span>
            </button>
          </div>

          {/* TAB 1: LỊCH SỬ ĐÃ ĐÁNH GIÁ */}
          {activeTab === 'rated' && (
            <div className="table-section">
              <div className="table-header">
                <h3>Lịch sử đánh giá công việc của bạn ({ratedTickets.length})</h3>
              </div>

              {isLoading ? (
                <div className="empty-state">
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                  <p>Đang tải dữ liệu đánh giá...</p>
                </div>
              ) : ratedTickets.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Mã lỗi</th>
                      <th>Nội dung sự cố</th>
                      <th>Thợ phụ trách</th>
                      <th>Đánh giá sao</th>
                      <th>Nhận xét</th>
                      <th>Ngày đánh giá</th>
                      <th>Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ratedTickets.map((ticket) => (
                      <tr key={ticket._id}>
                        <td style={{ fontWeight: 600 }}>{formatId(ticket._id)}</td>
                        <td className="ticket-title">
                          <strong>{ticket.title}</strong>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>
                            Phòng: {ticket.room} • {ticket.category}
                          </div>
                        </td>
                        <td>
                          {ticket.workerId?.fullName || (
                            <span style={{ color: '#64748b', fontStyle: 'italic' }}>Thợ kỹ thuật</span>
                          )}
                        </td>
                        <td>
                          <div className="rating-star-display">
                            {'★'.repeat(ticket.rating.score)}
                            <span style={{ color: '#d1d5db' }}>
                              {'★'.repeat(5 - ticket.rating.score)}
                            </span>
                            <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '4px' }}>
                              ({ticket.rating.score}/5)
                            </span>
                          </div>
                        </td>
                        <td style={{ maxWidth: '220px' }}>
                          {ticket.rating.comment ? (
                            <span style={{ fontStyle: 'italic', color: '#334155' }}>
                              "{ticket.rating.comment}"
                            </span>
                          ) : (
                            <span style={{ color: '#94a3b8' }}>-</span>
                          )}
                        </td>
                        <td>{formatDate(ticket.rating.ratedAt)}</td>
                        <td>
                          <button
                            className="btn-view-detail"
                            onClick={() => openRatingModal(ticket, false)}
                          >
                            Xem
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <i className="fa-regular fa-star" style={{ fontSize: '36px', color: '#cbd5e1', marginBottom: '12px' }}></i>
                  <p>Bạn chưa có đánh giá nào.</p>
                  <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
                    Khi thợ hoàn thành sửa chữa, bạn có thể vào đây hoặc Dashboard để đánh giá chất lượng.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CÔNG VIỆC CHỜ ĐÁNH GIÁ */}
          {activeTab === 'pending' && (
            <div className="table-section">
              <div className="table-header">
                <h3>Công việc đã hoàn thành - Chờ bạn đánh giá ({pendingRatingTickets.length})</h3>
              </div>

              {isLoading ? (
                <div className="empty-state">
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                  <p>Đang tải...</p>
                </div>
              ) : pendingRatingTickets.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Mã lỗi</th>
                      <th>Nội dung sự cố</th>
                      <th>Phòng</th>
                      <th>Thợ phụ trách</th>
                      <th>Ngày xong</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRatingTickets.map((ticket) => (
                      <tr key={ticket._id}>
                        <td style={{ fontWeight: 600 }}>{formatId(ticket._id)}</td>
                        <td className="ticket-title">
                          <strong>{ticket.title}</strong>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{ticket.category}</div>
                        </td>
                        <td>{ticket.room}</td>
                        <td>
                          {ticket.workerId?.fullName || (
                            <span style={{ color: '#64748b', fontStyle: 'italic' }}>Thợ kỹ thuật</span>
                          )}
                        </td>
                        <td>{formatDate(ticket.updatedAt || ticket.createdAt)}</td>
                        <td>
                          <button
                            className="btn-rate-now"
                            onClick={() => openRatingModal(ticket, true)}
                          >
                            <i className="fa-solid fa-star"></i>
                            Đánh giá ngay
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <i className="fa-regular fa-circle-check" style={{ fontSize: '36px', color: '#10b981', marginBottom: '12px' }}></i>
                  <p>Tuyệt vời! Bạn không có công việc nào đang chờ đánh giá.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* POPUP CHI TIẾT & ĐÁNH GIÁ */}
      {selectedTicket && (
        <div className="sd-modal-overlay" onClick={() => setSelectedTicket(null)}>
          <div className="sd-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="sd-modal-header">
              <h2>Chi Tiết Công Việc & Đánh Giá</h2>
              <p>Mã lỗi: {formatId(selectedTicket._id)}</p>
            </div>

            <div className="sd-modal-body">
              <div className="sd-row">
                <div className="sd-group">
                  <label>Tiêu đề sự cố</label>
                  <input type="text" value={selectedTicket.title} readOnly />
                </div>
                <div className="sd-group">
                  <label>Số phòng</label>
                  <input type="text" value={selectedTicket.room} readOnly />
                </div>
              </div>

              <div className="sd-row">
                <div className="sd-group">
                  <label>Danh mục</label>
                  <input type="text" value={selectedTicket.category} readOnly />
                </div>
                <div className="sd-group">
                  <label>Thợ phụ trách</label>
                  <input
                    type="text"
                    value={selectedTicket.workerId?.fullName || 'Thợ kỹ thuật KTX'}
                    readOnly
                  />
                </div>
              </div>

              {selectedTicket.imageUrls && selectedTicket.imageUrls.length > 0 && (
                <div className="sd-group">
                  <label>Hình ảnh đính kèm</label>
                  <div className="sd-image-grid">
                    {selectedTicket.imageUrls.map((img, index) => (
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
                <textarea value={selectedTicket.description} readOnly></textarea>
              </div>

              {/* KHU VỰC ĐÁNH GIÁ TRONG POPUP */}
              <div className="sd-rating-section">
                <div className="sd-rating-header">
                  <h4>
                    <i className="fa-solid fa-star" style={{ color: '#f59e0b' }}></i>
                    {selectedTicket.rating?.score && !isEditingRating
                      ? 'Đánh giá dịch vụ của bạn'
                      : 'Đánh giá chất lượng sửa chữa (1 - 5 sao)'}
                  </h4>
                  <p>
                    {selectedTicket.rating?.score && !isEditingRating
                      ? 'Bạn có thể chỉnh sửa lại điểm đánh giá bất cứ lúc nào.'
                      : 'Vui lòng chọn số sao từ 1 đến 5 và chia sẻ ý kiến của bạn.'}
                  </p>
                </div>

                {selectedTicket.rating?.score && !isEditingRating ? (
                  <div>
                    <div className="sd-rated-box">
                      <div className="sd-rated-stars">
                        {'★'.repeat(selectedTicket.rating.score)}
                        <span style={{ color: '#d1d5db' }}>
                          {'★'.repeat(5 - selectedTicket.rating.score)}
                        </span>
                        <span className="score-num">({selectedTicket.rating.score}/5 sao)</span>
                      </div>
                      {selectedTicket.rating.comment ? (
                        <p className="sd-rated-comment">"{selectedTicket.rating.comment}"</p>
                      ) : (
                        <p className="sd-rated-comment" style={{ color: '#94a3b8' }}>(Không có nhận xét)</p>
                      )}
                      {selectedTicket.rating.ratedAt && (
                        <span className="sd-rated-time">
                          <i className="fa-regular fa-clock" style={{ marginRight: '6px' }}></i>
                          Ngày đánh giá: {formatDate(selectedTicket.rating.ratedAt)}
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
                            {selectedTicket.rating?.score ? 'Cập nhật đánh giá' : 'Gửi đánh giá'}
                          </>
                        )}
                      </button>
                      {selectedTicket.rating?.score && (
                        <button
                          type="button"
                          className="sd-btn-rate-edit"
                          onClick={() => {
                            setIsEditingRating(false);
                            setRatingScore(selectedTicket.rating?.score || 0);
                            setRatingComment(selectedTicket.rating?.comment || '');
                          }}
                        >
                          Hủy
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="sd-actions">
                <button className="sd-btn-close" onClick={() => setSelectedTicket(null)}>
                  Đóng Pop-up
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ZOOM ẢNH NẾU CẦN */}
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
