const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'سرور فروشگاه شال و روسری راه‌اندازی شد' });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shal-roosari-shop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('اتصال به MongoDB برقرار شد'))
.catch(err => console.error('خطا در اتصال به MongoDB:', err));

app.listen(PORT, () => {
  console.log(`سرور در پورت ${PORT} راه‌اندازی شد`);
}); 