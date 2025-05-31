const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const addAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shal-roosari-shop');
    console.log('متصل به MongoDB شد');

    // دریافت اطلاعات مدیر جدید از command line arguments
    const args = process.argv.slice(2);
    
    if (args.length < 4) {
      console.log('استفاده: node addAdmin.js <firstName> <lastName> <email> <phone> [password]');
      console.log('مثال: node addAdmin.js احمد محمدی ahmad@example.com 09121234567 password123');
      process.exit(1);
    }

    const [firstName, lastName, email, phone, password = 'admin123'] = args;

    // بررسی اینکه آیا کاربری با این ایمیل یا شماره تلفن وجود دارد
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phone }] 
    });

    if (existingUser) {
      if (existingUser.isAdmin) {
        console.log('این کاربر از قبل مدیر است:', existingUser.email);
      } else {
        // تبدیل کاربر موجود به مدیر
        existingUser.isAdmin = true;
        await existingUser.save();
        console.log('کاربر موجود با موفقیت به مدیر تبدیل شد:', existingUser.email);
      }
      process.exit(0);
    }

    // ایجاد مدیر جدید
    const newAdmin = new User({
      firstName,
      lastName,
      email,
      phone,
      password,
      isAdmin: true,
      address: {
        street: 'آدرس پیش‌فرض',
        city: 'تهران',
        state: 'تهران',
        postalCode: '1234567890',
        country: 'ایران'
      }
    });

    await newAdmin.save();
    console.log('مدیر جدید با موفقیت ایجاد شد:');
    console.log('نام:', firstName, lastName);
    console.log('ایمیل:', email);
    console.log('شماره تلفن:', phone);
    console.log('رمز عبور:', password);
    
    // نمایش تعداد کل مدیران
    const adminCount = await User.countDocuments({ isAdmin: true });
    console.log(`\nتعداد کل مدیران سیستم: ${adminCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('خطا در ایجاد مدیر جدید:', error);
    process.exit(1);
  }
};

addAdmin(); 