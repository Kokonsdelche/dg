const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: '30d'
  });
};

// Register user
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phone }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'کاربری با این ایمیل یا شماره تلفن قبلاً ثبت شده است' 
      });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'ثبت‌نام با موفقیت انجام شد',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('خطا در ثبت‌نام:', error);
    res.status(500).json({ message: 'خطای سرور در ثبت‌نام' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'ایمیل یا رمز عبور نادرست است' });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'حساب کاربری غیرفعال است' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'ایمیل یا رمز عبور نادرست است' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'ورود با موفقیت انجام شد',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('خطا در ورود:', error);
    res.status(500).json({ message: 'خطای سرور در ورود' });
  }
});

// Get current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('orderHistory')
      .populate('favorites');

    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        isAdmin: user.isAdmin,
        orderHistory: user.orderHistory,
        favorites: user.favorites,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('خطا در دریافت پروفایل:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, phone, address } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (address) user.address = { ...user.address, ...address };
    
    await user.save();

    res.json({
      message: 'پروفایل با موفقیت به‌روزرسانی شد',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error) {
    console.error('خطا در به‌روزرسانی پروفایل:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
});

// Change password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id);
    
    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'رمز عبور فعلی نادرست است' });
    }
    
    user.password = newPassword;
    await user.save();

    res.json({ message: 'رمز عبور با موفقیت تغییر کرد' });
  } catch (error) {
    console.error('خطا در تغییر رمز عبور:', error);
    res.status(500).json({ message: 'خطای سرور' });
  }
});

module.exports = router; 