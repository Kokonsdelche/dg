# 🧕 فروشگاه شال و روسری | Shal Roosari Shop

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![React](https://img.shields.io/badge/React-19+-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-5+-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)

**فروشگاه آنلاین تخصصی شال و روسری با پنل مدیریت کامل**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Kokonsdelche/dg&project-name=shal-roosari-shop&repository-name=shal-roosari-shop)

[🌐 Demo](#) | [📖 مستندات](#مستندات) | [🐛 گزارش مشکل](https://github.com/your-username/shal-roosari-shop/issues) | [💡 پیشنهادات](https://github.com/your-username/shal-roosari-shop/issues)

</div>

## 📋 فهرست مطالب

- [✨ ویژگی‌ها](#-ویژگیها)
- [🛠️ تکنولوژی‌ها](#️-تکنولوژیها)
- [⚡ نصب سریع](#-نصب-سریع)
- [🚀 راه‌اندازی](#-راهاندازی)
- [📱 API Documentation](#-api-documentation)
- [🗄️ دیتابیس](#️-دیتابیس)
- [🔐 امنیت](#-امنیت)
- [📦 Deployment](#-deployment)
- [🤝 مشارکت](#-مشارکت)
- [📄 لایسنس](#-لایسنس)

## ✨ ویژگی‌ها

### 🛍️ فروشگاه آنلاین
- **کاتالوگ محصولات**: نمایش زیبا و کاربردی محصولات
- **سبد خرید پیشرفته**: مدیریت آسان سفارشات
- **سیستم پرداخت**: یکپارچه با درگاه‌های ایرانی
- **جستجو و فیلتر**: یافتن سریع محصولات مورد نظر
- **نظرات و امتیازدهی**: تعامل کاربران با محصولات

### 👨‍💼 پنل مدیریت
- **داشبورد آنالیتیک**: گزارش‌های فروش و آمار
- **مدیریت محصولات**: افزودن، ویرایش و حذف محصولات
- **مدیریت سفارشات**: پیگیری و بروزرسانی وضعیت سفارشات
- **مدیریت کاربران**: کنترل دسترسی‌ها و کاربران
- **گزارشات مالی**: تحلیل درآمد و فروش

### 🎨 رابط کاربری
- **طراحی ریسپانسیو**: سازگار با تمام دستگاه‌ها
- **UI/UX مدرن**: استفاده از Tailwind CSS
- **انیمیشن‌های نرم**: Framer Motion
- **پشتیبانی از فارسی**: راست‌چین و کاملاً فارسی
- **تم تاریک و روشن**: انتخاب بر اساس ترجیح کاربر

## 🛠️ تکنولوژی‌ها

### Backend
- **Node.js**: پلتفرم اجرای JavaScript
- **Express.js**: فریمورک وب سرور
- **MongoDB**: پایگاه داده NoSQL
- **Mongoose**: ODM برای MongoDB
- **JWT**: احراز هویت توکن‌مبنا
- **Bcrypt**: رمزنگاری کلمات عبور
- **Multer**: آپلود فایل
- **Nodemon**: Development tool

### Frontend
- **React 19**: کتابخانه رابط کاربری
- **TypeScript**: JavaScript با تایپ
- **Tailwind CSS**: فریمورک CSS
- **React Router**: مسیریابی SPA
- **Axios**: درخواست‌های HTTP
- **React Query**: مدیریت state سرور
- **Framer Motion**: انیمیشن‌ها
- **React Hook Form**: مدیریت فرم‌ها
- **Zustand**: مدیریت state کلاینت

### DevOps & Tools
- **Git**: کنترل نسخه
- **ESLint**: Linter
- **Prettier**: Code formatter
- **Concurrently**: اجرای همزمان scripts
- **Dotenv**: مدیریت environment variables

## ⚡ نصب سریع

### پیش‌نیازها
```bash
Node.js >= 18.0.0
MongoDB >= 5.0.0
Git
```

### 1. کلون پروژه
```bash
git clone https://github.com/your-username/shal-roosari-shop.git
cd shal-roosari-shop
```

### 2. نصب dependencies
```bash
npm run install-deps
```

### 3. تنظیم محیط
```bash
# کپی فایل environment
cp server/env.example server/.env

# ویرایش تنظیمات
nano server/.env
```

### 4. راه‌اندازی دیتابیس
```bash
# راه‌اندازی MongoDB و ایجاد دیتابیس
node database/init-database.js

# ایجاد admin و محصولات نمونه
cd server && npm run setup
```

### 5. اجرای پروژه
```bash
npm run dev
```

🎉 **سایت آماده است!**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🚀 راه‌اندازی

### تنظیمات Environment Variables

در فایل `server/.env`:

```bash
# تنظیمات سرور
PORT=5000
NODE_ENV=development

# دیتابیس
MONGO_URI=mongodb://localhost:27017/shal-roosari-shop

# امنیت
JWT_SECRET=your-super-secret-key
JWT_EXPIRE=30d

# آپلود فایل
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=jpg,jpeg,png,webp

# کلاینت
CLIENT_URL=http://localhost:3000
```

### Scripts موجود

```bash
# Development
npm run dev          # اجرای کامل پروژه
npm run client       # فقط frontend
npm run server       # فقط backend

# Production
npm run build        # ساخت نسخه تولید
npm start           # اجرای production

# Database
npm run create-admin # ایجاد ادمین
npm run add-products # اضافه کردن محصولات نمونه
npm run setup        # راه‌اندازی کامل دیتابیس

# Utilities
npm run clean        # پاک کردن files ساخته شده
npm test            # اجرای تست‌ها
```

## 📱 API Documentation

### Authentication
```http
POST /api/auth/register     # ثبت‌نام کاربر
POST /api/auth/login        # ورود کاربر
POST /api/auth/admin-login  # ورود ادمین
GET  /api/auth/profile      # پروفایل کاربر
PUT  /api/auth/profile      # بروزرسانی پروفایل
```

### Products
```http
GET    /api/products        # لیست محصولات
GET    /api/products/:id    # جزئیات محصول
POST   /api/products        # ایجاد محصول (ادمین)
PUT    /api/products/:id    # بروزرسانی محصول (ادمین)
DELETE /api/products/:id    # حذف محصول (ادمین)
```

### Orders
```http
GET  /api/orders           # لیست سفارشات کاربر
POST /api/orders           # ایجاد سفارش جدید
GET  /api/orders/:id       # جزئیات سفارش
PUT  /api/orders/:id       # بروزرسانی سفارش
```

### Admin
```http
GET  /api/admin/stats      # آمار داشبورد
GET  /api/admin/orders     # همه سفارشات
GET  /api/admin/users      # همه کاربران
PUT  /api/admin/orders/:id # بروزرسانی وضعیت سفارش
```

## 🗄️ دیتابیس

### ساختار Collections

#### Users
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phoneNumber: String,
  address: Object,
  isAdmin: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Products
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  salePrice: Number,
  category: String,
  images: [String],
  stock: Number,
  isActive: Boolean,
  featured: Boolean,
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

#### Orders
```javascript
{
  _id: ObjectId,
  orderNumber: String (unique),
  userId: ObjectId,
  items: [{
    productId: ObjectId,
    name: String,
    price: Number,
    quantity: Number
  }],
  totalAmount: Number,
  shippingAddress: Object,
  status: String,
  paymentStatus: String,
  createdAt: Date,
  updatedAt: Date
}
```

### مدیریت دیتابیس

```bash
# پشتیبان‌گیری
node database/backup-restore.js backup

# بازیابی
node database/backup-restore.js restore ./database/backups/backup-file.json

# نمایش لیست پشتیبان‌ها
node database/backup-restore.js list

# پاک کردن پشتیبان‌های قدیمی
node database/backup-restore.js clean
```

## 🔐 امنیت

### پیاده‌سازی شده
- ✅ رمزنگاری کلمات عبور با Bcrypt
- ✅ JWT برای احراز هویت
- ✅ Validation ورودی‌ها
- ✅ CORS محدود شده
- ✅ Rate limiting
- ✅ حذف اطلاعات حساس از response ها

### توصیه‌های امنیتی
- 🔹 تغییر JWT_SECRET در production
- 🔹 استفاده از HTTPS
- 🔹 تنظیم فایروال MongoDB
- 🔹 بروزرسانی منظم dependencies
- 🔹 نظارت بر logها

## 📦 Deployment

### Docker (توصیه شده)

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build
EXPOSE 5000 3000
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGO_URI=mongodb://mongo:27017/shal-roosari-shop
    depends_on:
      - mongo
  
  mongo:
    image: mongo:5
    volumes:
      - mongo_data:/data/db
    
volumes:
  mongo_data:
```

### Heroku
```bash
# نصب Heroku CLI
npm install -g heroku

# ورود به Heroku
heroku login

# ایجاد اپلیکیشن
heroku create shal-roosari-shop

# تنظیم MongoDB Atlas
heroku config:set MONGO_URI=your-mongodb-atlas-uri

# Deploy
git push heroku main
```

### VPS (Ubuntu/CentOS)
```bash
# نصب Node.js و MongoDB
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs mongodb

# کلون و راه‌اندازی
git clone your-repo
cd shal-roosari-shop
npm run install-deps
npm run build

# تنظیم PM2 برای production
npm install -g pm2
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

## 🤝 مشارکت

### راهنمای مشارکت

1. **Fork** کردن پروژه
2. ایجاد **branch** جدید (`git checkout -b feature/amazing-feature`)
3. **Commit** تغییرات (`git commit -m 'Add amazing feature'`)
4. **Push** به branch (`git push origin feature/amazing-feature`)
5. ایجاد **Pull Request**

### استانداردهای کد
- کد تمیز و خوانا
- Comment گذاری مناسب
- تست‌های unit
- Documentation مناسب

### مسائل و پیشنهادات
برای گزارش bug ها یا ارائه پیشنهادات، از [GitHub Issues](https://github.com/your-username/shal-roosari-shop/issues) استفاده کنید.

## 📈 Roadmap

### نسخه بعدی (v2.0)
- [ ] اپلیکیشن موبایل React Native
- [ ] سیستم چند زبانه
- [ ] یکپارچگی با انبار
- [ ] AI برای پیشنهاد محصولات
- [ ] سیستم وفاداری مشتریان
- [ ] گزارشات پیشرفته
- [ ] API GraphQL

### در حال توسعه (v1.5)
- [ ] پرداخت آنلاین
- [ ] نوتیفیکیشن Push
- [ ] چت آنلاین
- [ ] کوپن تخفیف
- [ ] سیستم ارزیابی فروشنده

## 🌟 سپاسگزاری

از همه افرادی که در این پروژه مشارکت کرده‌اند، تشکر می‌کنیم:
- تیم توسعه
- طراحان UI/UX
- تست کنندگان
- جامعه متن‌باز

## 📞 تماس و پشتیبانی

- **وب‌سایت**: [your-website.com](https://your-website.com)
- **ایمیل**: support@your-domain.com
- **تلگرام**: [@your-telegram](https://t.me/your-telegram)
- **مسائل GitHub**: [Issues](https://github.com/your-username/shal-roosari-shop/issues)

## 📄 لایسنس

این پروژه تحت لایسنس MIT منتشر شده است. برای جزئیات بیشتر فایل [LICENSE](LICENSE) را مطالعه کنید.

---

<div align="center">

**ساخته شده با ❤️ برای جامعه فارسی‌زبان**

[⭐ ستاره دهید](https://github.com/your-username/shal-roosari-shop) | [🍴 Fork کنید](https://github.com/your-username/shal-roosari-shop/fork) | [📢 اشتراک بگذارید](https://twitter.com/intent/tweet?text=Check%20out%20this%20awesome%20Persian%20hijab%20shop)

</div> 