const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const sampleProducts = [
  {
    name: 'شال کشمیری زمستانی',
    description: 'شال زیبا و گرم کشمیری برای فصل زمستان. مناسب برای استفاده روزانه و مهمانی‌ها.',
    price: 450000,
    discountPrice: 350000,
    category: 'شال',
    subcategory: 'کشمیری',
    images: [
      {
        url: '/uploads/sample-shawl-1.jpg',
        alt: 'شال کشمیری زمستانی',
        isPrimary: true
      }
    ],
    colors: [
      { name: 'قرمز', hex: '#dc2626', stock: 10 },
      { name: 'آبی', hex: '#2563eb', stock: 8 },
      { name: 'سبز', hex: '#16a34a', stock: 12 }
    ],
    sizes: [
      { name: 'متوسط', dimensions: '70x200 سانتی‌متر', stock: 20 },
      { name: 'بزرگ', dimensions: '80x220 سانتی‌متر', stock: 10 }
    ],
    material: 'کشمیر طبیعی',
    brand: 'شال پارس',
    tags: ['کشمیر', 'زمستانی', 'گرم', 'شیک'],
    stock: 30,
    isFeatured: true,
    averageRating: 4.5,
    totalReviews: 12
  },
  {
    name: 'روسری نخی تابستانی',
    description: 'روسری سبک و راحت نخی برای فصل تابستان. مناسب برای کار و تفریح.',
    price: 120000,
    category: 'روسری',
    subcategory: 'نخی',
    images: [
      {
        url: '/uploads/sample-headscarf-1.jpg',
        alt: 'روسری نخی تابستانی',
        isPrimary: true
      }
    ],
    colors: [
      { name: 'صورتی', hex: '#ec4899', stock: 15 },
      { name: 'زرد', hex: '#eab308', stock: 10 },
      { name: 'سفید', hex: '#ffffff', stock: 20 }
    ],
    sizes: [
      { name: 'استاندارد', dimensions: '90x90 سانتی‌متر', stock: 45 }
    ],
    material: 'نخ طبیعی',
    brand: 'روسری ایران',
    tags: ['نخی', 'تابستانی', 'سبک', 'راحت'],
    stock: 45,
    isFeatured: true,
    averageRating: 4.2,
    totalReviews: 8
  }
];

const addSampleProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shal-roosari-shop');
    console.log('متصل به MongoDB شد');

    // حذف محصولات قبلی (اختیاری)
    await Product.deleteMany({});
    console.log('محصولات قبلی حذف شدند');

    // اضافه کردن محصولات نمونه
    const products = await Product.insertMany(sampleProducts);
    console.log(`${products.length} محصول نمونه اضافه شد`);

    products.forEach(product => {
      console.log(`- ${product.name} (${product.category})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('خطا در اضافه کردن محصولات:', error);
    process.exit(1);
  }
};

addSampleProducts(); 