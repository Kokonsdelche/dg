const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shal-roosari-shop');
    console.log('متصل به MongoDB شد');

    // بررسی اینکه آیا ادمین وجود دارد یا نه
    const existingAdmin = await User.findOne({ isAdmin: true });
    if (existingAdmin) {
      console.log('کاربر ادمین از قبل وجود دارد:', existingAdmin.email);
      process.exit(0);
    }

    // ایجاد کاربر ادمین
    const admin = new User({
      firstName: 'مدیر',
      lastName: 'سیستم',
      email: 'admin@shal-roosari.com',
      phone: '09123456789',
      password: 'admin123',
      isAdmin: true,
      address: {
        street: 'خیابان ولیعصر',
        city: 'تهران',
        state: 'تهران',
        postalCode: '1234567890',
        country: 'ایران'
      }
    });

    await admin.save();
    console.log('کاربر ادمین با موفقیت ایجاد شد');
    console.log('ایمیل: admin@shal-roosari.com');
    console.log('رمز عبور: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('خطا در ایجاد کاربر ادمین:', error);
    process.exit(1);
  }
};

createAdmin(); 