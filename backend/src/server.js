require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); 

// Gọi file routes bạn vừa tạo
const authRoutes = require('./routes/authRoutes');

const app = express();
connectDB();

app.use(cors());
app.use(express.json()); 

// Cắm đường link API vào server
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('QFix Backend đang chạy và đã kết nối Database!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server QFix đang chạy tại cổng http://localhost:${PORT}`);
});