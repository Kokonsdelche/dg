const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('فقط فایل‌های تصویری مجاز هستند'));
    }
  }
});

// Temporary public dashboard endpoint for testing
router.get('/dashboard-public', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ isActive: true });
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
    
    // Revenue calculation
    const revenueData = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$finalAmount' } } }
    ]);
    
    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    // Recent orders
    const recentOrders = await Order.find()
      .populate('user', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        stats: {
          totalProducts,
          totalOrders,
          totalUsers,
          pendingOrders,
          totalRevenue
        },
        recentOrders
      }
    });
  } catch (error) {
    console.error('خطا در دریافت آمار داشبورد:', error);
    res.status(500).json({ 
      success: false,
      message: 'خطای سرور',
      error: error.message 
    });
  }
});

// Apply auth and adminAuth to all routes
router.use(auth);
router.use(adminAuth);

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Admin routes are working!' });
});

// Dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ isActive: true });
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
    
    // Revenue calculation
    const revenueData = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$finalAmount' } } }
    ]);
    
    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    // Recent orders
    const recentOrders = await Order.find()
      .populate('user', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        pendingOrders,
        totalRevenue
      },
      recentOrders
    });
  } catch (error) {
    console.error('خطا در دریافت آمار داشبورد:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
});

// Dashboard stats for new dashboard
router.get('/dashboard-stats', async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();
    
    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { orderStatus: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$finalAmount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber orderStatus finalAmount createdAt')
      .lean();

    // Get top products
    const topProducts = await Product.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name category price')
      .lean();

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        recentOrders,
        topProducts,
        salesData: [] // Placeholder for future sales analytics
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت آمار داشبورد',
      error: error.message
    });
  }
});

// Product management
// Get all products for admin
router.get('/products', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search, status } = req.query;
    
    // Build filter
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.isActive = status === 'active';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: {
        products,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('خطا در دریافت محصولات:', error);
    res.status(500).json({ 
      success: false,
      message: 'خطا در دریافت محصولات',
      error: error.message 
    });
  }
});

router.post('/products', upload.array('images', 5), async (req, res) => {
  try {
    const productData = JSON.parse(req.body.productData);
    
    // Process uploaded images
    const images = req.files?.map((file, index) => ({
      url: `/uploads/${file.filename}`,
      alt: productData.name,
      isPrimary: index === 0
    })) || [];

    // Colors and sizes are already in correct format from the frontend
    // No need to convert them anymore since the frontend sends proper objects

    const product = new Product({
      ...productData,
      images
    });

    await product.save();

    res.status(201).json({
      message: 'محصول با موفقیت اضافه شد',
      product
    });
  } catch (error) {
    console.error('خطا در اضافه کردن محصول:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
});

// Update product
router.put('/products/:id', upload.array('images', 5), async (req, res) => {
  try {
    const productData = JSON.parse(req.body.productData);
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'محصول یافت نشد' });
    }

    // Process new uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file, index) => ({
        url: `/uploads/${file.filename}`,
        alt: productData.name,
        isPrimary: index === 0 && product.images.length === 0
      }));
      
      productData.images = [...product.images, ...newImages];
    }

    Object.assign(product, productData);
    await product.save();

    res.json({
      message: 'محصول با موفقیت به‌روزرسانی شد',
      product
    });
  } catch (error) {
    console.error('خطا در به‌روزرسانی محصول:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'محصول یافت نشد' });
    }

    product.isActive = false;
    await product.save();

    res.json({ message: 'محصول با موفقیت حذف شد' });
  } catch (error) {
    console.error('خطا در حذف محصول:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
});

// Get all orders for admin
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    const filter = {};
    if (status) filter.orderStatus = status;

    const orders = await Order.find(filter)
      .populate('user', 'firstName lastName email phone')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('خطا در دریافت سفارشات:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
});

// Update order status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status, note, trackingNumber } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'سفارش یافت نشد' });
    }

    order.orderStatus = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (note) {
      order.statusHistory.push({
        status,
        note,
        date: new Date()
      });
    }

    if (status === 'delivered') {
      order.deliveredAt = new Date();
    }

    await order.save();

    res.json({
      message: 'وضعیت سفارش با موفقیت به‌روزرسانی شد',
      order
    });
  } catch (error) {
    console.error('خطا در به‌روزرسانی وضعیت سفارش:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments();

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('خطا در دریافت کاربران:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
});

// Toggle user status
router.put('/users/:id/toggle-status', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'کاربر یافت نشد' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `کاربر با موفقیت ${user.isActive ? 'فعال' : 'غیرفعال'} شد`,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('خطا در تغییر وضعیت کاربر:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
});

module.exports = router; 