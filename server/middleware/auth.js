const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'دسترسی غیرمجاز، توکن موجود نیست' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'کاربر یافت نشد' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'حساب کاربری غیرفعال است' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('خطا در احراز هویت:', error);
    res.status(401).json({ message: 'توکن نامعتبر است' });
  }
};

// Check if user is admin
const adminAuth = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'دسترسی مدیر مورد نیاز است' });
    }
    next();
  } catch (error) {
    console.error('خطا در احراز هویت مدیر:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
};

// Optional auth (for endpoints that work with or without auth)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // If token is invalid, continue without user
    next();
  }
};

module.exports = { auth, adminAuth, optionalAuth }; 