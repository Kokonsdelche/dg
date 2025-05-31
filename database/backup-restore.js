const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const BACKUP_DIR = path.join(__dirname, 'backups');

// اطمینان از وجود پوشه پشتیبان‌گیری
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// اتصال به دیتابیس
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/shal-roosari-shop';
    await mongoose.connect(mongoURI);
    console.log('✅ اتصال به MongoDB برقرار شد');
    return mongoose.connection.db;
  } catch (error) {
    console.error('❌ خطا در اتصال به MongoDB:', error);
    process.exit(1);
  }
};

// پشتیبان‌گیری از دیتابیس
const backupDatabase = async () => {
  try {
    const db = await connectDB();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}.json`);
    
    console.log('🔄 شروع پشتیبان‌گیری...');
    
    const collections = await db.listCollections().toArray();
    const backup = {};
    
    for (const collection of collections) {
      const collectionName = collection.name;
      console.log(`📦 پشتیبان‌گیری از کالکشن: ${collectionName}`);
      
      const documents = await db.collection(collectionName).find({}).toArray();
      backup[collectionName] = documents;
    }
    
    fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
    console.log(`✅ پشتیبان‌گیری کامل شد: ${backupPath}`);
    
    // ایجاد خلاصه پشتیبان‌گیری
    const summary = {
      timestamp: new Date().toISOString(),
      collections: Object.keys(backup).length,
      totalDocuments: Object.values(backup).reduce((total, docs) => total + docs.length, 0),
      size: fs.statSync(backupPath).size
    };
    
    console.log('📊 خلاصه پشتیبان‌گیری:');
    console.log(`   - تعداد کالکشن‌ها: ${summary.collections}`);
    console.log(`   - تعداد کل اسناد: ${summary.totalDocuments}`);
    console.log(`   - حجم فایل: ${(summary.size / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    console.error('❌ خطا در پشتیبان‌گیری:', error);
  } finally {
    await mongoose.connection.close();
  }
};

// بازیابی دیتابیس از پشتیبان
const restoreDatabase = async (backupFile) => {
  try {
    if (!fs.existsSync(backupFile)) {
      throw new Error(`فایل پشتیبان موجود نیست: ${backupFile}`);
    }
    
    const db = await connectDB();
    console.log(`🔄 شروع بازیابی از: ${backupFile}`);
    
    const backup = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    
    for (const [collectionName, documents] of Object.entries(backup)) {
      if (documents.length > 0) {
        console.log(`📥 بازیابی کالکشن: ${collectionName} (${documents.length} سند)`);
        
        // پاک کردن کالکشن موجود
        await db.collection(collectionName).deleteMany({});
        
        // وارد کردن اسناد جدید
        await db.collection(collectionName).insertMany(documents);
      }
    }
    
    console.log('✅ بازیابی کامل شد!');
    
  } catch (error) {
    console.error('❌ خطا در بازیابی:', error);
  } finally {
    await mongoose.connection.close();
  }
};

// نمایش لیست پشتیبان‌ها
const listBackups = () => {
  try {
    const backups = fs.readdirSync(BACKUP_DIR)
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(BACKUP_DIR, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          path: filePath,
          size: (stats.size / 1024).toFixed(2) + ' KB',
          created: stats.birthtime.toLocaleString('fa-IR')
        };
      })
      .sort((a, b) => new Date(b.created) - new Date(a.created));
    
    if (backups.length === 0) {
      console.log('📁 هیچ پشتیبانی موجود نیست');
      return;
    }
    
    console.log('📋 لیست پشتیبان‌ها:');
    backups.forEach((backup, index) => {
      console.log(`${index + 1}. ${backup.name}`);
      console.log(`   حجم: ${backup.size}`);
      console.log(`   تاریخ: ${backup.created}`);
      console.log('');
    });
    
    return backups;
  } catch (error) {
    console.error('❌ خطا در خواندن لیست پشتیبان‌ها:', error);
  }
};

// پاک کردن پشتیبان‌های قدیمی (بیش از 30 روز)
const cleanOldBackups = () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const files = fs.readdirSync(BACKUP_DIR);
    let deletedCount = 0;
    
    files.forEach(file => {
      const filePath = path.join(BACKUP_DIR, file);
      const stats = fs.statSync(filePath);
      
      if (stats.birthtime < thirtyDaysAgo) {
        fs.unlinkSync(filePath);
        deletedCount++;
        console.log(`🗑️ پشتیبان قدیمی حذف شد: ${file}`);
      }
    });
    
    if (deletedCount === 0) {
      console.log('✅ هیچ پشتیبان قدیمی برای حذف وجود ندارد');
    } else {
      console.log(`✅ ${deletedCount} پشتیبان قدیمی حذف شد`);
    }
  } catch (error) {
    console.error('❌ خطا در پاک کردن پشتیبان‌های قدیمی:', error);
  }
};

// CLI interface
const main = () => {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'backup':
      backupDatabase();
      break;
    case 'restore':
      if (args[1]) {
        restoreDatabase(args[1]);
      } else {
        console.log('❌ لطفاً مسیر فایل پشتیبان را مشخص کنید');
        console.log('مثال: node backup-restore.js restore ./backups/backup-2024-01-01.json');
      }
      break;
    case 'list':
      listBackups();
      break;
    case 'clean':
      cleanOldBackups();
      break;
    default:
      console.log('📖 راهنمای استفاده:');
      console.log('node backup-restore.js backup          - پشتیبان‌گیری از دیتابیس');
      console.log('node backup-restore.js restore [file]  - بازیابی از پشتیبان');
      console.log('node backup-restore.js list            - نمایش لیست پشتیبان‌ها');
      console.log('node backup-restore.js clean           - حذف پشتیبان‌های قدیمی');
      break;
  }
};

if (require.main === module) {
  main();
}

module.exports = {
  backupDatabase,
  restoreDatabase,
  listBackups,
  cleanOldBackups
}; 