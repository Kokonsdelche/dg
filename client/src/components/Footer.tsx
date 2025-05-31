import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
        return (
                <footer className="bg-gray-800 text-white">
                        <div className="container mx-auto px-4 py-8">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                        {/* Company Info */}
                                        <div>
                                                <h3 className="text-lg font-bold mb-4">فروشگاه شال و روسری</h3>
                                                <p className="text-gray-300 text-sm mb-4">
                                                        فروشگاه تخصصی شال و روسری با بهترین کیفیت و قیمت مناسب
                                                </p>
                                                <div className="flex space-x-4 space-x-reverse">
                                                        <button className="text-gray-300 hover:text-white">📘</button>
                                                        <button className="text-gray-300 hover:text-white">📷</button>
                                                        <button className="text-gray-300 hover:text-white">🐦</button>
                                                        <button className="text-gray-300 hover:text-white">📱</button>
                                                </div>
                                        </div>

                                        {/* Quick Links */}
                                        <div>
                                                <h3 className="text-lg font-bold mb-4">لینک‌های سریع</h3>
                                                <ul className="space-y-2">
                                                        <li>
                                                                <Link to="/" className="text-gray-300 hover:text-white text-sm">
                                                                        خانه
                                                                </Link>
                                                        </li>
                                                        <li>
                                                                <Link to="/products" className="text-gray-300 hover:text-white text-sm">
                                                                        محصولات
                                                                </Link>
                                                        </li>
                                                        <li>
                                                                <Link to="/about" className="text-gray-300 hover:text-white text-sm">
                                                                        درباره ما
                                                                </Link>
                                                        </li>
                                                        <li>
                                                                <Link to="/contact" className="text-gray-300 hover:text-white text-sm">
                                                                        تماس با ما
                                                                </Link>
                                                        </li>
                                                </ul>
                                        </div>

                                        {/* Categories */}
                                        <div>
                                                <h3 className="text-lg font-bold mb-4">دسته‌بندی‌ها</h3>
                                                <ul className="space-y-2">
                                                        <li>
                                                                <Link to="/products?category=شال" className="text-gray-300 hover:text-white text-sm">
                                                                        شال
                                                                </Link>
                                                        </li>
                                                        <li>
                                                                <Link to="/products?category=روسری" className="text-gray-300 hover:text-white text-sm">
                                                                        روسری
                                                                </Link>
                                                        </li>
                                                </ul>
                                        </div>

                                        {/* Contact Info */}
                                        <div>
                                                <h3 className="text-lg font-bold mb-4">اطلاعات تماس</h3>
                                                <div className="space-y-3 text-sm text-gray-300">
                                                        <div className="flex items-center space-x-2 space-x-reverse">
                                                                <span className="text-primary-400">📍</span>
                                                                <p>تهران، خیابان ولیعصر، پلاک ۱۲۳</p>
                                                        </div>
                                                        <div className="flex items-center space-x-2 space-x-reverse">
                                                                <span className="text-primary-400">📞</span>
                                                                <a href="tel:021-12345678" className="hover:text-white transition-colors">
                                                                        ۰۲۱-۱۲۳۴۵۶۷۸
                                                                </a>
                                                        </div>
                                                        <div className="flex items-center space-x-2 space-x-reverse">
                                                                <span className="text-primary-400">📱</span>
                                                                <a href="tel:0912-3456789" className="hover:text-white transition-colors">
                                                                        ۰۹۱۲-۳۴۵۶۷۸۹
                                                                </a>
                                                        </div>
                                                        <div className="flex items-center space-x-2 space-x-reverse">
                                                                <span className="text-primary-400">✉️</span>
                                                                <a href="mailto:info@shal-roosari.com" className="hover:text-white transition-colors">
                                                                        info@shal-roosari.com
                                                                </a>
                                                        </div>
                                                        <div className="flex items-center space-x-2 space-x-reverse">
                                                                <span className="text-primary-400">🕐</span>
                                                                <p>شنبه تا پنج‌شنبه: ۹ تا ۱۸</p>
                                                        </div>
                                                </div>
                                        </div>
                                </div>

                                <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                                        <p className="text-gray-300 text-sm">
                                                © ۱۴۰۳ فروشگاه شال و روسری. تمامی حقوق محفوظ است.
                                        </p>
                                </div>
                        </div>
                </footer>
        );
};

export default Footer; 