const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for Vercel frontend
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://dg-gamma-flax.vercel.app',
    'https://dg-git-main-koroshs-projects-20aecca8.vercel.app',
    'https://dg-e824grrlo-koroshs-projects-20aecca8.vercel.app',
    'https://dg-bimyr6iw8-koroshs-projects-20aecca8.vercel.app',
    'https://dg-production-c1df.up.railway.app',
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
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
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shal-roosari-shop')
.then(() => console.log('اتصال به MongoDB برقرار شد'))
.catch(err => console.error('خطا در اتصال به MongoDB:', err));

app.listen(PORT, () => {
  console.log(`سرور در پورت ${PORT} راه‌اندازی شد`);
}); 