# 🏠 QFIX - QSVN — Hệ thống Báo cáo Sự cố Cơ sở Vật chất

**Nền tảng tiếp nhận & xử lý sự cố tập trung dành cho Ký túc xá / Khu quân sự**

---

## 📋 Mục lục

- [Bối cảnh & Vấn đề](#-bối-cảnh--vấn-đề)
- [Giải pháp](#-giải-pháp)
- [Tính năng chính](#-tính-năng-chính)
- [Tech Stack](#-tech-stack)
- [Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Cài đặt & Chạy dự án](#-cài-đặt--chạy-dự-án)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Nhóm phát triển](#-nhóm-phát-triển)

---

## 🚨 Bối cảnh & Vấn đề

Tại các Ký túc xá và Khu quân sự, khi sinh viên gặp sự cố cơ sở vật chất (hư vòi nước, nghẹt cống, cháy bóng đèn...), quy trình báo cáo thường diễn ra như sau:

```
Sinh viên → Nhắn Zalo → Lớp trưởng → Cán bộ quản lý → Thợ sửa chữa
```

**Hậu quả:**
- 📵 Tin nhắn bị trôi, thông tin bị bỏ sót
- ⏳ Sinh viên chờ đợi rất lâu, không biết tiến độ xử lý
- 📊 Ban quản lý không có cái nhìn tổng quan về tình trạng hư hỏng

---

## 💡 Giải pháp

**QFIX - QSVN** là một Web App đóng vai trò "Cổng tiếp nhận và xử lý sự cố tập trung":

- Sinh viên gửi **Ticket** (kèm ảnh chụp) trực tiếp lên hệ thống
- Ticket được chuyển thẳng đến **Dashboard** của Ban quản lý / Thợ kỹ thuật
- Mọi bên có thể theo dõi **tiến độ xử lý theo thời gian thực**

---

## ✨ Tính năng chính

### 👨‍🎓 Sinh viên (Student)
- Đăng ký / Đăng nhập tài khoản
- Gửi báo cáo sự cố kèm ảnh (tối đa 5 ảnh)
- Theo dõi trạng thái Ticket theo thời gian thực
- Xem lịch sử các báo cáo đã gửi
- Gửi phản ánh / khiếu nại
- Quản lý thông tin cá nhân

### 🔧 Thợ sửa chữa (Worker)
- Xem danh sách công việc được phân công
- Cập nhật trạng thái Ticket (Đang sửa → Đã xong)
- Nhận thông báo khi được giao việc mới
- Quản lý hồ sơ cá nhân & chuyên môn

### 🛡️ Quản trị viên (Admin)
- Tổng quan toàn bộ sự cố qua Dashboard thống kê
- Duyệt và phân công Ticket cho thợ phù hợp
- Quản lý đội ngũ thợ sửa chữa (CRUD)
- Xử lý khiếu nại từ sinh viên
- Xuất báo cáo thống kê (Excel)
- Lưu trữ / xóa Ticket đã xử lý xong

---

## 🛠️ Tech Stack

| Lớp | Công nghệ |
|-----|-----------|
| **Frontend** | React 19, React Router DOM 7, Vite 8 |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB (qua Mongoose 9) |
| **File Storage** | Cloudinary (ảnh báo cáo) |
| **HTTP Client** | Axios |
| **Export** | ExcelJS + FileSaver |
| **Dev Tools** | Nodemon, ESLint |

---

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────┐
│                   CLIENT LAYER                      │
│         React + Vite  (deploy: Vercel)              │
│   Student │ Worker │ Admin (Role-based views)       │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP / REST API
┌──────────────────────▼──────────────────────────────┐
│                   SERVER LAYER                      │
│          Node.js + Express  (deploy: Render)        │
│    /api/auth  │  /api/tickets  │  /api/workers      │
└──────┬───────────────────────────────────┬──────────┘
       │                                   │
┌──────▼──────┐                   ┌────────▼────────┐
│   MongoDB   │                   │   Cloudinary    │
│  (Atlas)    │                   │  (Image Store)  │
└─────────────┘                   └─────────────────┘
```

### Vòng đời của một Ticket

```
[Student] Gửi báo cáo
      │
      ▼
  pending ──► [Admin] Duyệt & phân công ──► assigned
                                                │
                                                ▼
                                     [Worker] Bắt đầu xử lý ──► progress
                                                                     │
                                                                     ▼
                                                          [Worker] Hoàn thành ──► resolved
                                                                                      │
                                                                                      ▼
                                                                         [Admin] Lưu trữ ──► archived
```

---

## 📁 Cấu trúc thư mục

```
qfix-qsvn/
│
├── backend/
│   └── src/
│       ├── config/
│       │   └── db.js              # Kết nối MongoDB
│       ├── controllers/
│       │   ├── auth.js            # Đăng ký / Đăng nhập
│       │   ├── ticket.js          # CRUD Ticket
│       │   └── worker.js          # Quản lý Thợ
│       ├── middleware/
│       │   └── upload.js          # Upload ảnh lên Cloudinary
│       ├── models/
│       │   ├── User.js            # Schema người dùng
│       │   └── Ticket.js          # Schema ticket sự cố
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── ticketRoutes.js
│       │   └── workerRoutes.js
│       └── server.js              # Entry point Express
│
├── frontend/
│   └── src/
│       ├── components/            # Shared components
│       ├── pages/
│       │   ├── Auth/              # Welcome, Login, Register, RoleSelection
│       │   ├── Student/           # Dashboard, CreateReport, MyReports, Notifications, Profile
│       │   ├── Worker/            # Dashboard, AllTickets, Notification, Profile
│       │   └── Admin/             # Dashboard, AllTickets, ManageWorkers, Reports, Complaints
│       ├── App.jsx                # Router chính
│       └── main.jsx
│
└── initial-designs/               # Wireframe thiết kế ban đầu (HTML)
```

---

## ⚙️ Cài đặt & Chạy dự án

### Yêu cầu
- Node.js >= 18
- Tài khoản [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Tài khoản [Cloudinary](https://cloudinary.com/)

### 1. Clone dự án

```bash
git clone https://github.com/<your-username>/qfix-qsvn.git
cd qfix-qsvn
```

### 2. Cấu hình Backend

```bash
cd backend
npm install
```

Tạo file `.env` trong thư mục `backend/`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/QFIX - QSVN
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Chạy backend:

```bash
# Development (auto-reload)
npx nodemon src/server.js

# Production
node src/server.js
```

### 3. Cấu hình Frontend

```bash
cd ../frontend
npm install
```

Tạo file `.env` trong thư mục `frontend/`:

```env
VITE_API_URL=http://localhost:5000
```

Chạy frontend:

```bash
npm run dev
```

Mở trình duyệt tại `http://localhost:5173`

---

## 📡 API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `POST` | `/register` | Đăng ký tài khoản sinh viên |
| `POST` | `/login` | Đăng nhập (tất cả vai trò) |

### Tickets — `/api/tickets`

| Method | Endpoint | Mô tả | Quyền |
|--------|----------|-------|-------|
| `POST` | `/create` | Tạo ticket mới (kèm ảnh) | Student |
| `GET` | `/` | Lấy tất cả tickets | Admin |
| `GET` | `/student/:studentId` | Lấy tickets của sinh viên | Student |
| `GET` | `/worker/:workerId` | Lấy tickets được giao cho thợ | Worker |
| `PUT` | `/:id` | Cập nhật trạng thái / phân công | Admin, Worker |
| `DELETE` | `/:id` | Xóa ticket | Admin |

### Workers — `/api/workers`

| Method | Endpoint | Mô tả | Quyền |
|--------|----------|-------|-------|
| `GET` | `/` | Lấy danh sách thợ | Admin |
| `POST` | `/` | Thêm thợ mới | Admin |
| `PUT` | `/:id` | Cập nhật thông tin thợ | Admin |
| `DELETE` | `/:id` | Xóa thợ | Admin |

---

## 🗃️ Database Schema

### Collection: `users`

```js
{
  username:  String,   // Mã sinh viên / Tên tài khoản (unique)
  password:  String,   // Mật khẩu
  fullName:  String,   // Họ và tên
  role:      String,   // 'student' | 'worker' | 'admin'
  room:      String,   // Số phòng (dành cho sinh viên)
  phone:     String,   // Số điện thoại (dành cho thợ)
  specialty: String,   // Chuyên môn (Điện, Nước, Mộc...)
  isActive:  Boolean,  // Trạng thái tài khoản
  createdAt, updatedAt
}
```

### Collection: `tickets`

```js
{
  title:       String,    // Tiêu đề sự cố
  room:        String,    // Phòng xảy ra sự cố
  category:    String,    // Danh mục (Điện, Nước, Mộc, Mạng...)
  description: String,    // Mô tả chi tiết
  status:      String,    // 'pending' | 'assigned' | 'progress' | 'resolved' | 'archived'
  studentId:   ObjectId,  // Ref → users
  workerId:    ObjectId,  // Ref → users (null nếu chưa phân công)
  imageUrls:   [String],  // Danh sách URL ảnh (Cloudinary)
  createdAt, updatedAt
}
```

---

## 👥 Nhóm phát triển

> Đồ án môn **Mạng Web + Cơ sở Dữ liệu** — Nhóm 2 người

| | Thành viên |
|-|-----------|
| 👨‍💻 | Trần Lê Kim Lân |
| 👨‍💻 | Nguyễn Lâm Anh Tuấn |
