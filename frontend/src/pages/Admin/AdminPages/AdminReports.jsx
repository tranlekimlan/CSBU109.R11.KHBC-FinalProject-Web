import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar/Sidebar';
import Header from '../../../components/Header/Header';
import './AdminPages.css';

export default function AdminReports() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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
    fetchTickets();
  }, [navigate]);

  const fetchTickets = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tickets');
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      }
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error);
    }
  };

  // Filter by date range
  const filteredTickets = tickets.filter(t => {
    if (!startDate && !endDate) return true;

    const ticketDate = new Date(t.createdAt);
    const start = startDate ? new Date(startDate) : new Date('1900-01-01');
    const end = endDate ? new Date(endDate) : new Date('2100-12-31');

    return ticketDate >= start && ticketDate <= end;
  });

  // Statistics
  const stats = {
    total: filteredTickets.length,
    pending: filteredTickets.filter(t => t.status === 'pending').length,
    progress: filteredTickets.filter(t => t.status === 'progress').length,
    resolved: filteredTickets.filter(t => t.status === 'resolved').length
  };

  const resolveRate = stats.total > 0 ? ((stats.resolved / stats.total) * 100).toFixed(1) : 0;

  // Category breakdown
  const categories = {};
  filteredTickets.forEach(t => {
    categories[t.category] = (categories[t.category] || 0) + 1;
  });

  // Status breakdown
  const statusBreakdown = {
    pending: stats.pending,
    progress: stats.progress,
    resolved: stats.resolved
  };

  const exportReport = async () => {
    // 1. Khởi tạo một Workbook mới
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Báo Cáo Sự Cố');

    // 2. Thêm dòng tiêu đề cột
    worksheet.addRow(['Mã Vé', 'Sinh viên', 'Phòng', 'Danh mục', 'Trạng thái', 'Ngày báo']);

    // Định dạng in đậm cho dòng tiêu đề
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    // 3. Chuẩn bị dữ liệu và thêm vào các dòng tiếp theo
    filteredTickets.forEach(t => {
      worksheet.addRow([
        `QF-${t._id.substring(t._id.length - 4).toUpperCase()}`,
        t.studentName || 'N/A',
        t.room,
        t.category,
        ['pending', 'progress', 'resolved'].includes(t.status)
          ? { pending: 'Chờ duyệt', progress: 'Đang xử lý', resolved: 'Đã xong' }[t.status]
          : 'Không rõ',
        new Date(t.createdAt).toLocaleDateString('vi-VN')
      ]);
    });

    // 4. Thuật toán tự động tính toán và điều chỉnh độ rộng cho từng cột (AutoFit)
    worksheet.columns.forEach((column) => {
      let maxColumnLength = 0;
      // Duyệt qua từng ô trong cột để tìm nội dung dài nhất
      column.eachCell({ includeEmpty: true }, (cell) => {
        const cellValue = cell.value ? cell.value.toString() : '';
        maxColumnLength = Math.max(maxColumnLength, cellValue.length);
      });
      // Đặt độ rộng bằng độ dài lớn nhất tìm được cộng thêm một khoảng đệm nhỏ (ví dụ: 5)
      column.width = maxColumnLength < 10 ? 10 : maxColumnLength + 5;
    });

    // 5. Thêm phần thống kê tóm lược (cách ra 2 dòng cho đẹp)
    worksheet.addRow([]);
    worksheet.addRow([]);
    
    const summaryHeaderRow = worksheet.addRow(['THỐNG KÊ TÓM LƯỢC']);
    summaryHeaderRow.font = { bold: true };
    
    worksheet.addRow(['Tổng số sự cố', stats.total]);
    worksheet.addRow(['Chờ duyệt', stats.pending]);
    worksheet.addRow(['Đang xử lý', stats.progress]);
    worksheet.addRow(['Đã xong', stats.resolved]);
    worksheet.addRow(['Tỷ lệ hoàn thành', `${resolveRate}%`]);

    // 6. Xuất và tải file Excel về máy
    try {
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `Bao_Cao_QFix_${new Date().getTime()}.xlsx`);
    } catch (error) {
      console.error('Lỗi khi tạo file Excel:', error);
      alert('Đã xảy ra lỗi khi xuất file Excel. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="app-container">
      <Sidebar role="admin" />
      <main className="main-content">
        <Header title="Thống kê & Báo cáo" />
        <div className="dashboard-body">
          {/* Filter Section */}
          <div className="search-filter-section">
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                Từ ngày
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', width: '100%' }}
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                Đến ngày
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', width: '100%' }}
              />
            </div>

            <div style={{ alignSelf: 'flex-end' }}>
              <button className="btn-export" onClick={exportReport}>
                <i className="fa-solid fa-download"></i> Xuất Báo Cáo
              </button>
            </div>
          </div>

          {/* Main Statistics */}
          <div className="quick-stats">
            <div className="stat-item">
              <span className="stat-label">Tổng sự cố</span>
              <span className="stat-number">{stats.total}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Chờ duyệt</span>
              <span className="stat-number" style={{ color: '#3b82f6' }}>{stats.pending}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Đang xử lý</span>
              <span className="stat-number" style={{ color: '#f97316' }}>{stats.progress}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Đã xong</span>
              <span className="stat-number" style={{ color: '#22c55e' }}>{stats.resolved}</span>
            </div>
          </div>

          {/* Resolution Rate */}
          <div className="chart-container">
            <h3>Tỷ lệ hoàn thành</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                  <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="8"
                      strokeDasharray={`${(resolveRate / 100) * 283} 283`}
                    />
                  </svg>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '32px', fontWeight: '800', color: '#22c55e' }}>
                      {resolveRate}%
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Đã hoàn thành</div>
                  </div>
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <p style={{ marginBottom: '12px' }}>
                  <strong>Tổng sự cố:</strong> {stats.total}
                </p>
                <p style={{ marginBottom: '12px' }}>
                  <strong>Đã hoàn thành:</strong> {stats.resolved}
                </p>
                <p style={{ marginBottom: '12px' }}>
                  <strong>Còn lại:</strong> {stats.pending + stats.progress}
                </p>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="chart-container">
            <h3>Phân bố theo danh mục</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Danh mục</th>
                  <th>Số lượng</th>
                  <th>Tỷ lệ</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(categories).map(([category, count]) => (
                  <tr key={category}>
                    <td>{category}</td>
                    <td><strong>{count}</strong></td>
                    <td>{stats.total > 0 ? ((count / stats.total) * 100).toFixed(1) : 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Status Breakdown */}
          <div className="chart-container">
            <h3>Phân bố theo trạng thái</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div style={{
                padding: '20px',
                background: '#eff6ff',
                borderRadius: '12px',
                textAlign: 'center',
                borderLeft: '4px solid #3b82f6'
              }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#3b82f6', marginBottom: '8px' }}>
                  {stats.pending}
                </div>
                <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '600' }}>Chờ duyệt</div>
              </div>

              <div style={{
                padding: '20px',
                background: '#fff7ed',
                borderRadius: '12px',
                textAlign: 'center',
                borderLeft: '4px solid #f97316'
              }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#f97316', marginBottom: '8px' }}>
                  {stats.progress}
                </div>
                <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '600' }}>Đang xử lý</div>
              </div>

              <div style={{
                padding: '20px',
                background: '#f0fdf4',
                borderRadius: '12px',
                textAlign: 'center',
                borderLeft: '4px solid #22c55e'
              }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#22c55e', marginBottom: '8px' }}>
                  {stats.resolved}
                </div>
                <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '600' }}>Đã xong</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
