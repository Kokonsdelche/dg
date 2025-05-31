import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { adminAPI } from '../../services/api';

const Products: React.FC = () => {
        const [products, setProducts] = useState<Product[]>([]);
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState('');
        const [searchQuery, setSearchQuery] = useState('');
        const [selectedCategory, setSelectedCategory] = useState('');
        const [sortBy, setSortBy] = useState('newest');
        const [showAddModal, setShowAddModal] = useState(false);

        useEffect(() => {
                fetchProducts();
        }, []);

        const fetchProducts = async () => {
                try {
                        const response = await adminAPI.getAllProducts();
                        // Handle the new API response structure
                        const productsData = response.data?.data?.products || response.data?.products || [];
                        setProducts(productsData);
                } catch (error: any) {
                        setError('خطا در دریافت محصولات: ' + (error.response?.data?.message || error.message));
                } finally {
                        setIsLoading(false);
                }
        };

        const handleDeleteProduct = async (productId: string) => {
                if (!window.confirm('آیا مطمئن هستید که می‌خواهید این محصول را حذف کنید؟')) {
                        return;
                }

                try {
                        await adminAPI.deleteProduct(productId);
                        setProducts(products.filter(p => p._id !== productId));
                        alert('محصول با موفقیت حذف شد');
                } catch (error: any) {
                        alert('خطا در حذف محصول: ' + (error.response?.data?.message || error.message));
                }
        };

        const formatPrice = (price: number) => {
                return new Intl.NumberFormat('fa-IR').format(price);
        };

        const filteredProducts = products.filter(product => {
                const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        product.description.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesCategory = !selectedCategory || product.category === selectedCategory;
                return matchesSearch && matchesCategory;
        }).sort((a, b) => {
                switch (sortBy) {
                        case 'newest':
                                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                        case 'oldest':
                                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                        case 'price-low':
                                return a.price - b.price;
                        case 'price-high':
                                return b.price - a.price;
                        case 'name':
                                return a.name.localeCompare(b.name);
                        default:
                                return 0;
                }
        });

        if (isLoading) {
                return (
                        <div className="min-h-screen bg-gray-50 py-8">
                                <div className="container mx-auto px-4">
                                        <div className="max-w-7xl mx-auto">
                                                <h1 className="text-3xl font-bold text-gray-800 mb-8">مدیریت محصولات</h1>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                        {[...Array(6)].map((_, index) => (
                                                                <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                                                                        <div className="bg-gray-300 h-32 rounded mb-4"></div>
                                                                        <div className="bg-gray-300 h-4 rounded mb-2"></div>
                                                                        <div className="bg-gray-300 h-4 rounded w-2/3"></div>
                                                                </div>
                                                        ))}
                                                </div>
                                        </div>
                                </div>
                        </div>
                );
        }

        return (
                <div className="min-h-screen bg-gray-50 py-8">
                        <div className="container mx-auto px-4">
                                <div className="max-w-7xl mx-auto">
                                        {/* Header */}
                                        <div className="mb-8">
                                                <div className="flex items-center justify-between">
                                                        <div>
                                                                <h1 className="text-3xl font-bold text-gray-800">مدیریت محصولات</h1>
                                                                <p className="text-gray-600 mt-1">مدیریت محصولات فروشگاه شال و روسری</p>
                                                        </div>
                                                        <Link
                                                                to="/admin/products/new"
                                                                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                                                        >
                                                                <span className="text-lg ml-2">+</span>
                                                                افزودن محصول جدید
                                                        </Link>
                                                </div>
                                        </div>

                                        {error && (
                                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                                                        {error}
                                                </div>
                                        )}

                                        {/* Filters */}
                                        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                        <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">جستجو</label>
                                                                <input
                                                                        type="text"
                                                                        value={searchQuery}
                                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                                        placeholder="نام محصول..."
                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                                                />
                                                        </div>

                                                        <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">دسته‌بندی</label>
                                                                <select
                                                                        value={selectedCategory}
                                                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                                                >
                                                                        <option value="">همه دسته‌ها</option>
                                                                        <option value="شال">شال</option>
                                                                        <option value="روسری">روسری</option>
                                                                        <option value="سایر">سایر</option>
                                                                </select>
                                                        </div>

                                                        <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">مرتب‌سازی</label>
                                                                <select
                                                                        value={sortBy}
                                                                        onChange={(e) => setSortBy(e.target.value)}
                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                                                >
                                                                        <option value="newest">جدیدترین</option>
                                                                        <option value="oldest">قدیمی‌ترین</option>
                                                                        <option value="price-low">ارزان‌ترین</option>
                                                                        <option value="price-high">گران‌ترین</option>
                                                                        <option value="name">نام (الفبایی)</option>
                                                                </select>
                                                        </div>

                                                        <div className="flex items-end">
                                                                <button
                                                                        onClick={() => {
                                                                                setSearchQuery('');
                                                                                setSelectedCategory('');
                                                                                setSortBy('newest');
                                                                        }}
                                                                        className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                                >
                                                                        پاک کردن فیلترها
                                                                </button>
                                                        </div>
                                                </div>
                                        </div>

                                        {/* Stats Cards */}
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                                <div className="bg-white rounded-lg shadow-md p-6">
                                                        <div className="flex items-center">
                                                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                                        <span className="text-2xl">📦</span>
                                                                </div>
                                                                <div className="mr-4">
                                                                        <h3 className="text-sm font-medium text-gray-500">کل محصولات</h3>
                                                                        <p className="text-2xl font-bold text-gray-800">{products.length}</p>
                                                                </div>
                                                        </div>
                                                </div>

                                                <div className="bg-white rounded-lg shadow-md p-6">
                                                        <div className="flex items-center">
                                                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                                                        <span className="text-2xl">✅</span>
                                                                </div>
                                                                <div className="mr-4">
                                                                        <h3 className="text-sm font-medium text-gray-500">موجود</h3>
                                                                        <p className="text-2xl font-bold text-gray-800">
                                                                                {products.filter(p => p.stock > 0).length}
                                                                        </p>
                                                                </div>
                                                        </div>
                                                </div>

                                                <div className="bg-white rounded-lg shadow-md p-6">
                                                        <div className="flex items-center">
                                                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                                                        <span className="text-2xl">❌</span>
                                                                </div>
                                                                <div className="mr-4">
                                                                        <h3 className="text-sm font-medium text-gray-500">ناموجود</h3>
                                                                        <p className="text-2xl font-bold text-gray-800">
                                                                                {products.filter(p => p.stock === 0).length}
                                                                        </p>
                                                                </div>
                                                        </div>
                                                </div>

                                                <div className="bg-white rounded-lg shadow-md p-6">
                                                        <div className="flex items-center">
                                                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                                                        <span className="text-2xl">🔍</span>
                                                                </div>
                                                                <div className="mr-4">
                                                                        <h3 className="text-sm font-medium text-gray-500">نتایج فیلتر</h3>
                                                                        <p className="text-2xl font-bold text-gray-800">{filteredProducts.length}</p>
                                                                </div>
                                                        </div>
                                                </div>
                                        </div>

                                        {/* Products Grid */}
                                        {filteredProducts.length === 0 ? (
                                                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                                                <span className="text-4xl">📦</span>
                                                        </div>
                                                        <h2 className="text-2xl font-bold text-gray-800 mb-4">محصولی یافت نشد</h2>
                                                        <p className="text-gray-600 mb-8">
                                                                {products.length === 0
                                                                        ? 'هنوز محصولی اضافه نشده است'
                                                                        : 'فیلترهای خود را تغییر دهید یا محصول جدید اضافه کنید'
                                                                }
                                                        </p>
                                                        <Link
                                                                to="/admin/products/new"
                                                                className="bg-pink-600 text-white px-8 py-3 rounded-lg hover:bg-pink-700 transition-colors inline-block"
                                                        >
                                                                افزودن محصول اول
                                                        </Link>
                                                </div>
                                        ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                        {filteredProducts.map((product) => (
                                                                <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                                                        {/* Product Image */}
                                                                        <div className="relative">
                                                                                <img
                                                                                        src={typeof product.images?.[0] === 'string' ? product.images[0] : '/placeholder-image.jpg'}
                                                                                        alt={product.name}
                                                                                        className="w-full h-48 object-cover"
                                                                                />
                                                                                {!product.isActive && (
                                                                                        <div className="absolute top-2 left-2 bg-gray-500 text-white px-2 py-1 rounded-full text-sm">
                                                                                                غیرفعال
                                                                                        </div>
                                                                                )}
                                                                                {product.discount && product.discount > 0 && (
                                                                                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                                                                                                {product.discount}% تخفیف
                                                                                        </div>
                                                                                )}
                                                                        </div>

                                                                        {/* Product Info */}
                                                                        <div className="p-4">
                                                                                <div className="flex items-start justify-between mb-2">
                                                                                        <h3 className="text-lg font-bold text-gray-800 flex-1">{product.name}</h3>
                                                                                        <span className={`text-xs px-2 py-1 rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                                                                }`}>
                                                                                                {product.isActive ? 'فعال' : 'غیرفعال'}
                                                                                        </span>
                                                                                </div>

                                                                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                                                        {product.description}
                                                                                </p>

                                                                                <div className="flex items-center justify-between mb-3">
                                                                                        <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
                                                                                                {product.category}
                                                                                        </span>
                                                                                        <span className="text-sm text-gray-500">
                                                                                                موجودی: {product.stock}
                                                                                        </span>
                                                                                </div>

                                                                                <div className="flex items-center justify-between mb-4">
                                                                                        <div>
                                                                                                {product.discount && product.discount > 0 ? (
                                                                                                        <div>
                                                                                                                <span className="text-lg font-bold text-pink-600">
                                                                                                                        {formatPrice(product.price * (1 - product.discount / 100))} تومان
                                                                                                                </span>
                                                                                                                <span className="text-sm text-gray-500 line-through mr-2">
                                                                                                                        {formatPrice(product.price)} تومان
                                                                                                                </span>
                                                                                                        </div>
                                                                                                ) : (
                                                                                                        <span className="text-lg font-bold text-gray-800">
                                                                                                                {formatPrice(product.price)} تومان
                                                                                                        </span>
                                                                                                )}
                                                                                        </div>
                                                                                </div>

                                                                                {/* Actions */}
                                                                                <div className="flex gap-2">
                                                                                        <Link
                                                                                                to={`/admin/products/${product._id}/edit`}
                                                                                                className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-center text-sm"
                                                                                        >
                                                                                                ویرایش
                                                                                        </Link>
                                                                                        <Link
                                                                                                to={`/products/${product._id}`}
                                                                                                target="_blank"
                                                                                                className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-center text-sm"
                                                                                        >
                                                                                                مشاهده
                                                                                        </Link>
                                                                                        <button
                                                                                                onClick={() => handleDeleteProduct(product._id)}
                                                                                                className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors text-sm"
                                                                                        >
                                                                                                حذف
                                                                                        </button>
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                        ))}
                                                </div>
                                        )}
                                </div>
                        </div>
                </div>
        );
};

export default Products; 