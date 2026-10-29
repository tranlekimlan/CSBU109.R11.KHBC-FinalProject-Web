import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import "./AdminPages.css";

export default function ManageWorkers() {
  const navigate = useNavigate();
  
  // 1. CHUYỂN TẤT CẢ STATE VÀO BÊN TRONG HÀM NÀY
  const [workers, setWorkers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    specialty: "",
  });

  // State phục vụ tính năng Gán việc
  const [tickets, setTickets] = useState([]);
  const [assignModal, setAssignModal] = useState({ isOpen: false, worker: null });
  const [selectedTicketId, setSelectedTicketId] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(user);
    if (parsedUser.role !== "admin") {
      navigate("/admin-dashboard");
      return;
    }
    fetchWorkers();
    fetchTickets();
  }, [navigate]);

  const fetchTickets = async () => {
    try {
      // 2. Sửa https thành http
      const response = await fetch("http://localhost:5000/api/tickets"); 
      if (response.ok) {
        // 3. Sửa response.json thành response.json()
        const data = await response.json(); 
        setTickets(data.filter((t) => t.status === "pending"));
      }
    } catch (error) {
      console.error("Lỗi tải danh sách vé:", error);
    }
  };

  const fetchWorkers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/workers");
      if (response.ok) {
        const data = await response.json();
        setWorkers(data);
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.specialty) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      const url = editingId
        ? `http://localhost:5000/api/workers/${editingId}`
        : "http://localhost:5000/api/workers";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: "worker" }),
      });

      if (response.ok) {
        fetchWorkers();
        resetForm();
        alert(editingId ? "Cập nhật thành công!" : "Thêm mới thành công!");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Đã xảy ra lỗi!");
    }
  };

  const handleEdit = (worker) => {
    setFormData({
      fullName: worker.fullName,
      phone: worker.phone || "",
      specialty: worker.specialty || "",
    });
    setEditingId(worker._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa nhân viên này?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/workers/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchWorkers();
        alert("Xóa thành công!");
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const resetForm = () => {
    setFormData({ fullName: "",phone: "", specialty: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAssignTask = async () => {
    if (!selectedTicketId) {
      alert("Vui lòng chọn một công việc!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/tickets/${selectedTicketId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "assigned", 
            workerId: assignModal.worker._id,
          }),
        },
      );

      if (response.ok) {
        alert(`Đã giao việc thành công cho thợ ${assignModal.worker.fullName}!`);
        setAssignModal({ isOpen: false, worker: null });
        setSelectedTicketId("");
        fetchTickets(); 
      }
    } catch (error) {
      console.error("Lỗi khi giao việc:", error);
      alert("Không thể giao việc lúc này.");
    }
  };

  return (
    <div className="app-container">
      <Sidebar role="admin" />
      <main className="main-content">
        <Header title="Quản lý Nhân Sự Kỹ Thuật" />
        <div className="dashboard-body">
          {showForm && (
            <div className="worker-form">
              <h3>
                {editingId ? "Sửa Thông Tin Nhân Viên" : "Thêm Nhân Viên Mới"}
              </h3>
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

                <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                  <button type="submit" className="btn-primary">
                    <i className="fa-solid fa-save"></i>{" "}
                    {editingId ? "Cập nhật" : "Thêm mới"}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={resetForm}
                  >
                    <i className="fa-solid fa-xmark"></i> Hủy
                  </button>
                </div>
              </form>
            </div>
          )}

          {!showForm && (
            <div style={{ marginBottom: "24px" }}>
              <button className="btn-primary" onClick={() => setShowForm(true)}>
                <i className="fa-solid fa-user-plus"></i> Thêm Nhân Viên Mới
              </button>
            </div>
          )}

          <div className="worker-list">
            <div className="table-header">
              <h3>Danh sách nhân viên ({workers.length})</h3>
            </div>

            {workers.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Họ và tên</th>
                    <th>Số điện thoại</th>
                    <th>Chuyên môn</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map((worker) => (
                    <tr key={worker._id}>
                      <td>{worker.fullName}</td>
                      <td>{worker.phone || "N/A"}</td>
                      <td>{worker.specialty || "N/A"}</td>
                      <td>
                        <button
                          className="btn-primary"
                          /* 4. Sửa onclick thành onClick và thêm lại thẻ <i> */
                          onClick={() => setAssignModal({ isOpen: true, worker: worker })}
                          style={{
                            marginRight: "8px",
                            backgroundColor: "#3b82f6",
                          }}
                        >
                          <i className="fa-solid fa-clipboard-check"></i> Gán Việc
                        </button>
                        <button
                          className="btn-secondary"
                          onClick={() => handleEdit(worker)}
                          style={{ marginRight: "8px" }}
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

        {/* Modal Gán Việc cho Thợ */}
        {assignModal.isOpen && (
          <div
            className="sd-modal-overlay"
            onClick={() => setAssignModal({ isOpen: false, worker: null })}
          >
            <div
              className="sd-modal-box"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "500px" }}
            >
              <div className="sd-modal-header admin-header">
                <h2>Phân Công Công Việc</h2>
                <p>
                  Kỹ thuật viên: <strong>{assignModal.worker.fullName}</strong>{" "}
                  ({assignModal.worker.specialty})
                </p>
              </div>

              <div className="sd-modal-body">
                <div className="sd-group">
                  <label>Chọn sự cố cần giao:</label>
                  {tickets.length > 0 ? (
                    <select
                      value={selectedTicketId}
                      onChange={(e) => setSelectedTicketId(e.target.value)}
                      className="status-select"
                      style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "10px",
                      }}
                    >
                      <option value="">-- Click để chọn sự cố --</option>
                      {tickets.map((t) => (
                        <option key={t._id} value={t._id}>
                          Phòng {t.room} - {t.title} ({t.category})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div
                      style={{
                        padding: "15px",
                        background: "#fef2f2",
                        color: "#ef4444",
                        borderRadius: "8px",
                        marginTop: "10px",
                      }}
                    >
                      Hiện không có sự cố nào đang chờ phân công!
                    </div>
                  )}
                </div>

                <div className="sd-actions" style={{ marginTop: "30px" }}>
                  <button
                    className="btn-update-status"
                    onClick={handleAssignTask}
                    disabled={!selectedTicketId || tickets.length === 0}
                  >
                    <i className="fa-solid fa-check"></i> Xác nhận Giao việc
                  </button>
                  <button
                    className="sd-btn-close"
                    onClick={() => setAssignModal({ isOpen: false, worker: null })}
                    style={{ marginLeft: "12px" }}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}