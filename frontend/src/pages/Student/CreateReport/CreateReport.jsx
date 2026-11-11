import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar/Sidebar';
import Header from '../../../components/Header/Header';
import './CreateReport.css';

export default function CreateReport() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    room: ''
  });

  const [images, setImages] = useState([]);
  
  // STATE MỚI: Dùng để lưu ảnh đang được phóng to
  const [selectedPreview, setSelectedPreview] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      setFormData(prev => ({ ...prev, room: user.room || '' }));
    } else {
      navigate('/login', { state: { role: 'student' } });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file: file,
      previewUrl: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('room', formData.room);
      submitData.append('category', formData.category);
      submitData.append('description', formData.description);
      submitData.append('studentId', currentUser.id);
      
      // KIỂM TRA CHẶC CHẼ TRƯỚC KHI GẮN ẢNH VÀO FORM
      if (images && images.length > 0) {
        images.forEach(img => {
          // Bắt buộc img.file phải là đối tượng File thực sự
          if (img.file instanceof File) {
            submitData.append('images', img.file); 
          }
        });
      }

      const response = await fetch('http://localhost:5000/api/tickets/create', {
        method: 'POST',
        // QUAN TRỌNG: Không set Content-Type là application/json nữa, 
        // trình duyệt sẽ TỰ ĐỘNG set Content-Type thành multipart/form-data khi truyền submitData
        body: submitData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Báo cáo sự cố của bạn đã được gửi thành công!' });
        setTimeout(() => {
          window.location.href = '/student-dashboard';
        }, 2000);
      } 
      
      else {
        setMessage({ type: 'error', text: data.message || 'Có lỗi xảy ra khi gửi báo cáo.' });
      }
    } catch (error) {
      console.error('Lỗi mạng:', error);
      setMessage({ type: 'error', text: 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/student-dashboard');
  };

  return (
    <div className="app-container">
      <Sidebar />

      <main className="main-content">
        <Header title="Tạo Báo Cáo Sự Cố" />

        <div className="cr-page-wrapper">
          <div className="cr-form-box">
            
            <div className="cr-header">
              <h2>Báo Cáo Sự Cố Mới</h2>
              <p>Vui lòng mô tả chi tiết sự cố mà bạn phát hiện.<br/>BQL sẽ tiếp nhận và cử thợ đến xử lý sớm nhất.</p>
            </div>

            <form onSubmit={handleSubmit} className="cr-body">
              
              {message.text && (
                <div className={`cr-message ${message.type === 'success' ? 'cr-msg-success' : 'cr-msg-error'}`}>
                  <i className={`fa-solid ${message.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
                  {message.text}
                </div>
              )}

              <div className="cr-row">
                <div className="cr-group">
                  <label htmlFor="title">Tiêu đề sự cố *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="VD: Quạt trần kêu to..."
                    required
                  />
                </div>

                <div className="cr-group">
                  <label htmlFor="room">Số phòng *</label>
                  <input
                    type="text"
                    id="room"
                    name="room"
                    value={formData.room}
                    onChange={handleChange}
                    placeholder="VD: A202"
                    required
                  />
                </div>
              </div>

              <div className="cr-group">
                <label htmlFor="category">Danh mục *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Chọn loại sự cố --</option>
                  <option value="Điện / Ánh sáng">Điện / Ánh sáng</option>
                  <option value="Hệ thống Nước">Hệ thống Nước</option>
                  <option value="Mộc / Nội thất">Mộc / Nội thất</option>
                  <option value="Vệ sinh">Vệ sinh</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div className="cr-group">
                <label>Hình ảnh đính kèm (Tùy chọn)</label>
                <div className="cr-image-grid">
                  
                  {images.map((img, index) => (
                    // THÊM SỰ KIỆN CLICK ĐỂ PHÓNG TO ẢNH
                    <div 
                      key={index} 
                      className="cr-image-preview" 
                      onClick={() => setSelectedPreview(img.previewUrl)}
                      title="Nhấn để xem ảnh lớn"
                    >
                      <img src={img.previewUrl} alt={`preview-${index}`} />
                      <button 
                        type="button" 
                        className="cr-remove-btn" 
                        // e.stopPropagation() GIÚP CHẶN SỰ KIỆN CLICK LAN XUỐNG ẢNH ĐỂ KHÔNG BỊ PHÓNG TO KHI BẤM XÓA
                        onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                        title="Xóa ảnh này"
                        style={{ fontWeight: 'bold' }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <label className="cr-upload-box">
                    <input
                      type="file"
                      multiple
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleImageSelect}
                      style={{ display: 'none' }}
                    />
                    <div className="cr-plus-icon">+</div>
                    <span>Thêm ảnh</span>
                  </label>

                </div>
                <small style={{ marginTop: '12px' }}>Hỗ trợ JPG, PNG. Có thể chọn nhiều ảnh để kỹ thuật viên đánh giá chính xác hơn.</small>
              </div>

              <div className="cr-group">
                <label htmlFor="description">Mô tả chi tiết tình trạng *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Vui lòng cung cấp thêm thông tin: Sự cố bắt đầu từ khi nào? Cần chuẩn bị thang hay dụng cụ đặc biệt không?..."
                  required
                ></textarea>
              </div>

              <div className="cr-actions">
                <button type="submit" className="cr-btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><i className="fa-solid fa-spinner fa-spin"></i> Đang gửi...</>
                  ) : (
                    <><i className="fa-solid fa-paper-plane"></i> Gửi Yêu Cầu</>
                  )}
                </button>
                <button type="button" className="cr-btn-cancel" onClick={handleCancel}>
                  Quay lại
                </button>
              </div>

            </form>
          </div>
        </div>

      </main>

      {/* LỚP PHỦ NỀN ĐEN HIỂN THỊ ẢNH PHÓNG TO */}
      {selectedPreview && (
        <div className="cr-image-modal" onClick={() => setSelectedPreview(null)}>
          <span className="cr-close-modal">✕</span>
          <img 
            src={selectedPreview} 
            alt="Phóng to" 
            className="cr-modal-content" 
            onClick={(e) => e.stopPropagation()} /* Bấm vào trong ảnh thì không bị đóng */
          />
        </div>
      )}

    </div>
  );
}