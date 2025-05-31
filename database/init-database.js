const mongoose = require('mongoose');
require('dotenv').config();

// تنظیمات اتصال به دیتابیس
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/shal-roosari-shop';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ اتصال به MongoDB برقرار شد');
    return mongoose.connection.db;
  } catch (error) {
    console.error('❌ خطا در اتصال به MongoDB:', error);
    process.exit(1);
  }
};

// ایجاد ایندکس‌ها و تنظیمات دیتابیس
const setupDatabase = async () => {
  try {
    const db = await connectDB();
    
    // ایجاد کالکشن‌ها و ایندکس‌ها
    console.log('🔨 در حال ایجاد ایندکس‌ها...');
    
    // Users collection indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ phoneNumber: 1 });
    await db.collection('users').createIndex({ createdAt: -1 });
    
    // Products collection indexes
    await db.collection('products').createIndex({ name: 'text', description: 'text' });
    await db.collection('products').createIndex({ category: 1 });
    await db.collection('products').createIndex({ price: 1 });
    await db.collection('products').createIndex({ createdAt: -1 });
    await db.collection('products').createIndex({ isActive: 1 });
    await db.collection('products').createIndex({ featured: 1 });
    
    // Orders collection indexes
    await db.collection('orders').createIndex({ userId: 1 });
    await db.collection('orders').createIndex({ status: 1 });
    await db.collection('orders').createIndex({ orderNumber: 1 }, { unique: true });
    await db.collection('orders').createIndex({ createdAt: -1 });
    
    // Categories collection indexes
    await db.collection('categories').createIndex({ name: 1 }, { unique: true });
    await db.collection('categories').createIndex({ slug: 1 }, { unique: true });
    
    // Reviews collection indexes
    await db.collection('reviews').createIndex({ productId: 1 });
    await db.collection('reviews').createIndex({ userId: 1 });
    await db.collection('reviews').createIndex({ createdAt: -1 });
    
    console.log('✅ ایندکس‌ها با موفقیت ایجاد شدند');
    
    // ایجاد دسته‌بندی‌های پیش‌فرض
    await createDefaultCategories(db);
    
    console.log('🎉 دیتابیس با موفقیت راه‌اندازی شد!');
    
  } catch (error) {
    console.error('❌ خطا در راه‌اندازی دیتابیس:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 اتصال دیتابیس بسته شد');
  }
};

// ایجاد دسته‌بندی‌های پیش‌فرض
const createDefaultCategories = async (db) => {
  const categories = [
    {
      name: 'شال',
      slug: 'shal',
      description: 'انواع شال‌های زیبا و باکیفیت',
      isActive: true,
      createdAt: new Date()
    },
    {
      name: 'روسری',
      slug: 'roosari',
      description: 'روسری‌های مدرن و سنتی',
      isActive: true,
      createdAt: new Date()
    },
    {
      name: 'شال و روسری ساتن',
      slug: 'satin',
      description: 'محصولات ساتن لوکس',
      isActive: true,
      createdAt: new Date()
    },
    {
      name: 'شال و روسری نخی',
      slug: 'cotton',
      description: 'محصولات نخی راحت و سبک',
      isActive: true,
      createdAt: new Date()
    },
    {
      name: 'شال و روسری ابریشم',
      slug: 'silk',
      description: 'محصولات ابریشم درجه یک',
      isActive: true,
      createdAt: new Date()
    }
  ];
  
  try {
    // بررسی وجود دسته‌بندی‌ها
    for (const category of categories) {
      const exists = await db.collection('categories').findOne({ slug: category.slug });
      if (!exists) {
        await db.collection('categories').insertOne(category);
        console.log(`✅ دسته‌بندی "${category.name}" ایجاد شد`);
      }
    }
  } catch (error) {
    console.error('❌ خطا در ایجاد دسته‌بندی‌ها:', error);
  }
};

// اجرای اسکریپت
if (require.main === module) {
  setupDatabase();
}

module.exports = { connectDB, setupDatabase }; 