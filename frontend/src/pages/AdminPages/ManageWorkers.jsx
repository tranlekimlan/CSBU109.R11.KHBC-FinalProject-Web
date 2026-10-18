import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import './AdminPages.css';

export default function ManageWorkers() {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialty: ''
  });

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(user);
    if (parsedUser.role !== 'admin') {
      navigate('/admin-dashboard');
      return;
    }
    fetchWorkers();
  }, [navigate]);

  const fetchWorkers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/workers');
      if (response.ok) {
        const data = await response.json();
        setWorkers(data);
      }
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone || !formData.specialty) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      const url = editingId
        ? `http://localhost:5000/api/workers/${editingId}`
        : 'http://localhost:5000/api/workers';

      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: 'worker' })
      });

      if (response.ok) {
        fetchWorkers();
        resetForm();
        alert(editingId ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
      }
    } catch (error) {
      console.error('Lỗi:', error);
      alert('Đã xảy ra lỗi!');
    }
  };

  const handleEdit = (worker) => {
    setFormData({
      fullName: worker.fullName,
      email: worker.email,
      phone: worker.phone || '',
      specialty: worker.specialty || ''
    });
    setEditingId(worker._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa nhân viên này?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/workers/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchWorkers();
        alert('Xóa thành công!');
      }
    } catch (error) {
      console.error('Lỗi:', error);
    }
  };

  const resetForm = () => {
    setFormData({ fullName: '', email: '', phone: '', specialty: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="app-container">
      <Sidebar role="admin" />
      <main className="main-content">
        <Header title="Quản lý Nhân Sự Kỹ Thuật" />
        <div className="dashboard-body">
          {/* Add/Edit Form */}
          {showForm && (
            <div className="worker-form">
              <h3>{editingId ? 'Sửa Thông Tin Nhân Viên' : 'Thêm Nhân Viên Mới'}</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Họ và tên</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Nhập email"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Số điện thoại</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  <div className="form-group">
                    <label>Chuyên môn</label>
                    <input
                      type="text"
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleInputChange}
                      placeholder="Ví dụ: Điện, Nước, Cơ khí"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button type="submit" className="btn-primary">
                    <i className="fa-solid fa-save"></i> {editingId ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                  <button type="button" className="btn-secondary" onClick={resetForm}>
                    <i className="fa-solid fa-xmark"></i> Hủy
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Button to open form */}
          {!showForm && (
            <div style={{ marginBottom: '24px' }}>
              <button className="btn-primary" onClick={() => setShowForm(true)}>
                <i className="fa-solid fa-user-plus"></i> Thêm Nhân Viên Mới
              </button>
            </div>
          )}

          {/* Workers List */}
          <div className="worker-list">
            <div className="table-header">
              <h3>Danh sách nhân viên ({workers.length})</h3>
            </div>

            {workers.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Họ và tên</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Chuyên môn</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map((worker) => (
                    <tr key={worker._id}>
                      <td>{worker.fullName}</td>
                      <td>{worker.email}</td>
                      <td>{worker.phone || 'N/A'}</td>
                      <td>{worker.specialty || 'N/A'}</td>
                      <td>
                        <button
                          className="btn-secondary"
                          onClick={() => handleEdit(worker)}
                          style={{ marginRight: '8px' }}
                        >
                          <i className="fa-solid fa-edit"></i> Sửa
                        </button>
                        <button
                          className="btn-danger"
                          onClick={() => handleDelete(worker._id)}
                        >
                          <i className="fa-solid fa-trash"></i> Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                Chưa có nhân viên nào. Hãy thêm nhân viên mới!
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
