const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://dg-gamma-flax.vercel.app',
    'https://dg-git-main-koroshs-projects-20aecca8.vercel.app',
    'https://dg-e824grrlo-koroshs-projects-20aecca8.vercel.app',
    'https://dg-bimyr6iw8-koroshs-projects-20aecca8.vercel.app',
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection for serverless
let cachedConnection = null;

const connectToDatabase = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  try {
    if (mongoose.connection.readyState === 0) {
      cachedConnection = await mongoose.connect(process.env.MONGO_URI, {
        bufferCommands: false,
        maxPoolSize: 1,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
    }
    return cachedConnection;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

// Import routes
const authRoutes = require('../server/routes/auth');
const productRoutes = require('../server/routes/products');
const orderRoutes = require('../server/routes/orders');
const adminRoutes = require('../server/routes/admin');

// Routes (without /api prefix since Vercel already handles that)
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    platform: 'vercel-serverless',
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'سرور فروشگاه شال و روسری - Vercel API',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/health',
      '/auth/register',
      '/auth/login',
      '/products',
      '/orders',
      '/admin'
    ]
  });
});

// Catch all route
app.get('*', (req, res) => {
  res.status(404).json({ 
    message: 'API endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Export handler for Vercel
module.exports = async (req, res) => {
  // Connect to database
  await connectToDatabase();
  
  // Handle the request
  return app(req, res);
}; 