import { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import './CreateReport.css';

export default function CreateReport() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    room: '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Báo cáo sự cố của bạn đã được gửi thành công!');
    setFormData({ title: '', description: '', category: '', room: '', image: null });
  };

  const categories = [
    'Điện',
    'Hệ thống Nước',
    'Nội thất',
    'Vệ sinh',
    'Khác'
  ];

  return (
    <div className="app-container">
      <Sidebar />

      <main className="main-content">
        <Header title="Tạo Báo Cáo Sự Cố" />

        <div className="dashboard-body">
          <div className="form-container">
            <div className="form-header">
              <h2>Báo cáo sự cố mới</h2>
              <p>Vui lòng mô tả chi tiết sự cố mà bạn phát hiện</p>
            </div>

            <form onSubmit={handleSubmit} className="form-content">
              <div className="form-group">
                <label htmlFor="room">Phòng của bạn *</label>
                <input
                  type="text"
                  id="room"
                  name="room"
                  value={formData.room}
                  onChange={handleChange}
                  placeholder="Ví dụ: A202"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="title">Tiêu đề sự cố *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ví dụ: Quạt trần kêu to"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Danh mục *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description">Mô tả chi tiết *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Mô tả đầy đủ về sự cố..."
                  rows="6"
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="image">Hình ảnh (Tùy chọn)</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  accept="image/*"
                />
                <small>Chọn ảnh để giúp Ban quản lý hiểu rõ hơn về sự cố</small>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  <i className="fa-solid fa-paper-plane"></i> Gửi Báo Cáo
                </button>
                <button type="reset" className="btn-cancel">
                  <i className="fa-solid fa-xmark"></i> Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
