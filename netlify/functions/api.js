const serverless = require('serverless-http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

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

// MongoDB connection (for serverless, we connect on each request)
let cachedDb = null;

const connectToDatabase = async () => {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
      bufferMaxEntries: 0,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    cachedDb = connection.db;
    return cachedDb;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

// Routes
app.use('/auth', require('../../server/routes/auth'));
app.use('/products', require('../../server/routes/products'));
app.use('/orders', require('../../server/routes/orders'));
app.use('/admin', require('../../server/routes/admin'));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    platform: 'netlify-functions'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'سرور فروشگاه شال و روسری - Netlify Functions',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Wrap with serverless
const handler = serverless(app, {
  binary: false
});

exports.handler = async (event, context) => {
  // Connect to database on each request
  await connectToDatabase();
  
  // Handle the request
  return handler(event, context);
}; 