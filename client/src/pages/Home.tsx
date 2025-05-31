import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { productsAPI } from '../services/api';

const Home: React.FC = () => {
        const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
                const fetchFeaturedProducts = async () => {
                        try {
                                const response = await productsAPI.getFeaturedProducts();
                                setFeaturedProducts(response.products);
                        } catch (error) {
                                console.error('خطا در دریافت محصولات ویژه:', error);
                        } finally {
                                setIsLoading(false);
                        }
                };

                fetchFeaturedProducts();
        }, []);

        return (
                <div className="min-h-screen">
                        {/* Hero Section */}
                        <section className="relative bg-gradient-to-r from-purple-600 to-purple-800 text-white" style={{ backgroundColor: '#9333ea' }}>
                                <div className="container mx-auto px-4 py-20">
                                        <div className="max-w-3xl">
                                                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                                                        فروشگاه تخصصی شال و روسری
                                                </h1>
                                                <p className="text-xl mb-8 text-gray-100">
                                                        بهترین کیفیت، متنوع‌ترین طرح‌ها و مناسب‌ترین قیمت‌ها را از ما بخواهید
                                                </p>
                                                <div className="flex flex-col sm:flex-row gap-4">
                                                        <Link
                                                                to="/products"
                                                                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors text-center"
                                                        >
                                                                مشاهده محصولات
                                                        </Link>
                                                        <Link
                                                                to="/products?isFeatured=true"
                                                                className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-purple-600 transition-colors text-center"
                                                        >
                                                                محصولات ویژه
                                                        </Link>
                                                </div>
                                        </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
                        </section>

                        {/* Categories Section */}
                        <section className="py-16 bg-white">
                                <div className="container mx-auto px-4">
                                        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
                                                دسته‌بندی محصولات
                                        </h2>
                                        <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                                {[
                                                        { name: 'شال', emoji: '🧣', color: 'bg-purple-100' },
                                                        { name: 'روسری', emoji: '👗', color: 'bg-purple-100' },
                                                ].map((category) => (
                                                        <Link
                                                                key={category.name}
                                                                to={`/products?category=${category.name}`}
                                                                className={`${category.color} p-8 rounded-xl text-center hover:shadow-lg transition-shadow group`}
                                                        >
                                                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                                                                        {category.emoji}
                                                                </div>
                                                                <h3 className="text-lg font-bold text-gray-800">{category.name}</h3>
                                                        </Link>
                                                ))}
                                        </div>
                                </div>
                        </section>

                        {/* Featured Products */}
                        <section className="py-16 bg-gray-50">
                                <div className="container mx-auto px-4">
                                        <div className="flex justify-between items-center mb-12">
                                                <h2 className="text-3xl font-bold text-gray-800">محصولات ویژه</h2>
                                                <Link
                                                        to="/products?isFeatured=true"
                                                        className="text-purple-600 hover:text-purple-700 font-medium"
                                                >
                                                        مشاهده همه →
                                                </Link>
                                        </div>

                                        {isLoading ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                                        {[...Array(4)].map((_, index) => (
                                                                <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                                                                        <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                                                                        <div className="bg-gray-300 h-4 rounded mb-2"></div>
                                                                        <div className="bg-gray-300 h-4 rounded w-2/3"></div>
                                                                </div>
                                                        ))}
                                                </div>
                                        ) : (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                                        {featuredProducts.slice(0, 4).map((product) => (
                                                                <Link
                                                                        key={product._id}
                                                                        to={`/products/${product._id}`}
                                                                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow group"
                                                                >
                                                                        <div className="relative overflow-hidden rounded-t-lg">
                                                                                <img
                                                                                        src={typeof product.images[0] === 'string' ? product.images[0] : '/placeholder-image.jpg'}
                                                                                        alt={product.name}
                                                                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                                                                                />
                                                                        </div>
                                                                        <div className="p-4">
                                                                                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                                                                                        {product.name}
                                                                                </h3>
                                                                        </div>
                                                                </Link>
                                                        ))}
                                                </div>
                                        )}
                                </div>
                        </section>

                        {/* Features Section */}
                        <section className="py-16 bg-white">
                                <div className="container mx-auto px-4">
                                        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
                                                چرا ما را انتخاب کنید؟
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                <div className="text-center">
                                                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                                <span className="text-2xl">🚚</span>
                                                        </div>
                                                        <h3 className="text-xl font-bold mb-2">ارسال رایگان</h3>
                                                        <p className="text-gray-600">
                                                                برای خریدهای بالای ۵۰۰ هزار تومان ارسال رایگان
                                                        </p>
                                                </div>
                                                <div className="text-center">
                                                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                                <span className="text-2xl">💎</span>
                                                        </div>
                                                        <h3 className="text-xl font-bold mb-2">کیفیت برتر</h3>
                                                        <p className="text-gray-600">
                                                                تمامی محصولات با بهترین کیفیت و مواد اولیه درجه یک
                                                        </p>
                                                </div>
                                                <div className="text-center">
                                                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                                <span className="text-2xl">🔄</span>
                                                        </div>
                                                        <h3 className="text-xl font-bold mb-2">ضمانت بازگشت</h3>
                                                        <p className="text-gray-600">
                                                                ۷ روز ضمانت بازگشت کالا در صورت عدم رضایت
                                                        </p>
                                                </div>
                                        </div>
                                </div>
                        </section>
                </div>
        );
};

export default Home; 