const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const listAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shal-roosari-shop');
    console.log('متصل به MongoDB شد');

    // دریافت تمام مدیران
    const admins = await User.find({ isAdmin: true }).select('-password');
    
    if (admins.length === 0) {
      console.log('هیچ مدیری در سیستم یافت نشد');
      process.exit(0);
    }

    console.log(`\n📋 لیست مدیران سیستم (${admins.length} نفر):`);
    console.log('═'.repeat(80));

    admins.forEach((admin, index) => {
      console.log(`\n${index + 1}. ${admin.firstName} ${admin.lastName}`);
      console.log(`   📧 ایمیل: ${admin.email}`);
      console.log(`   📱 تلفن: ${admin.phone}`);
      console.log(`   🟢 وضعیت: ${admin.isActive ? 'فعال' : 'غیرفعال'}`);
      console.log(`   📅 تاریخ ایجاد: ${new Date(admin.createdAt).toLocaleDateString('fa-IR')}`);
      console.log('─'.repeat(50));
    });

    console.log(`\n✅ تعداد کل مدیران: ${admins.length}`);
    console.log(`✅ مدیران فعال: ${admins.filter(a => a.isActive).length}`);
    console.log(`❌ مدیران غیرفعال: ${admins.filter(a => !a.isActive).length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('خطا در دریافت لیست مدیران:', error);
    process.exit(1);
  }
};

listAdmins(); 