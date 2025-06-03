const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 Starting server...');
console.log('📝 Environment variables loaded:');
console.log('- PORT:', process.env.PORT || 'Not set (using 5000)');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'Not set');
console.log('- MONGO_URI:', process.env.MONGO_URI ? 'Set ✅' : 'Not set ❌');
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? 'Set ✅' : 'Not set ❌');
console.log('- CLIENT_URL:', process.env.CLIENT_URL || 'Not set');

// CORS configuration for Vercel frontend and Render backend
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://dg-gamma-flax.vercel.app',
    'https://dg-git-main-koroshs-projects-20aecca8.vercel.app',
    'https://dg-e824grrlo-koroshs-projects-20aecca8.vercel.app',
    'https://dg-bimyr6iw8-koroshs-projects-20aecca8.vercel.app',
    'https://dg-production-c1df.up.railway.app',
    'https://dg-backend.onrender.com',
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200
};

console.log('🌐 CORS origins:', corsOptions.origin);

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ 
    message: 'خطای سرور', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'سرور فروشگاه شال و روسری راه‌اندازی شد',
    status: 'running',
    timestamp: new Date().toISOString(),
    port: PORT,
    env: process.env.NODE_ENV
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Catch all route
app.get('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// MongoDB connection with better error handling
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shal-roosari-shop', {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅ اتصال به MongoDB برقرار شد');
  console.log('📊 Database connected successfully');
})
.catch(err => {
  console.error('❌ خطا در اتصال به MongoDB:', err);
  console.error('💥 MongoDB connection failed:', err.message);
  process.exit(1);
});

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 سرور در پورت ${PORT} راه‌اندازی شد`);
  console.log(`🌍 Server running on http://0.0.0.0:${PORT}`);
  console.log('✅ Server startup completed');
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\n⚠️ Received ${signal}. Starting graceful shutdown...`);
  
  server.close(async () => {
    console.log('🔴 HTTP server closed');
    
    try {
      await mongoose.connection.close();
      console.log('🔴 MongoDB connection closed');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error closing MongoDB connection:', error);
      process.exit(1);
    }
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.log('⚠️ Force closing after 10 seconds');
    process.exit(1);
  }, 10000);
};

// Handle different termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
}); 