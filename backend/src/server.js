require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); 

// Gọi file routes bạn vừa tạo
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const workerRoutes = require('./routes/workerRoutes');

const app = express();
connectDB();

app.use(cors());
app.use(express.json()); 

// Cắm đường link API vào server
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/workers', workerRoutes);

app.get('/', (req, res) => {
  res.send('Backend is connected to QFix');
});

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server QFix đang chạy tại cổng http://localhost:${PORT}`);
});