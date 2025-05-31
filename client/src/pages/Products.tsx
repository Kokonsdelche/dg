import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Product } from '../types';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';

const Products: React.FC = () => {
        const [searchParams] = useSearchParams();
        const [products, setProducts] = useState<Product[]>([]);
        const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState('');
        const [searchQuery, setSearchQuery] = useState('');
        const [selectedCategory, setSelectedCategory] = useState('');
        const [priceRange, setPriceRange] = useState([0, 50000000]);
        const [sortBy, setSortBy] = useState('newest');

        const { addToCart } = useCart();

        useEffect(() => {
                fetchProducts();
        }, []);

        // Handle URL parameters
        useEffect(() => {
                const categoryFromUrl = searchParams.get('category');
                setSelectedCategory(categoryFromUrl || ''); // Always set, even if null/empty
        }, [searchParams]);

        useEffect(() => {
                filterProducts();
        }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

        const fetchProducts = async () => {
                try {
                        const response = await productsAPI.getAll();
                        setProducts(response.products || []);
                } catch (error: any) {
                        setError('خطا در دریافت محصولات: ' + (error.response?.data?.message || error.message));
                } finally {
                        setIsLoading(false);
                }
        };

        const filterProducts = () => {
                let filtered = [...products];

                // Filter by search query
                if (searchQuery) {
                        filtered = filtered.filter(product =>
                                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                product.description.toLowerCase().includes(searchQuery.toLowerCase())
                        );
                }

                // Filter by category
                if (selectedCategory) {
                        filtered = filtered.filter(product => {
                                return product.category === selectedCategory;
                        });
                }

                // Filter by price range
                filtered = filtered.filter(product =>
                        product.price >= priceRange[0] && product.price <= priceRange[1]
                );

                // Sort products
                switch (sortBy) {
                        case 'newest':
                                filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                                break;
                        case 'oldest':
                                filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                                break;
                        case 'price-low':
                                filtered.sort((a, b) => a.price - b.price);
                                break;
                        case 'price-high':
                                filtered.sort((a, b) => b.price - a.price);
                                break;
                        case 'name':
                                filtered.sort((a, b) => a.name.localeCompare(b.name));
                                break;
                        default:
                                break;
                }

                setFilteredProducts(filtered);
        };

        const handleAddToCart = (product: Product) => {
                addToCart({
                        productId: product._id,
                        name: product.name,
                        price: product.price,
                        image: typeof product.images?.[0] === 'string' ? product.images[0] : undefined,
                        quantity: 1
                });
        };

        const formatPrice = (price: number) => {
                return new Intl.NumberFormat('fa-IR').format(price);
        };

        const resetFilters = () => {
                setSearchQuery('');
                setSelectedCategory('');
                setPriceRange([0, 50000000]);
                setSortBy('newest');
        };

        if (isLoading) {
                return (
                        <div className="min-h-screen bg-gray-50 py-8">
                                <div className="container mx-auto px-4">
                                        <div className="max-w-7xl mx-auto">
                                                <h1 className="text-3xl font-bold text-gray-800 mb-8">محصولات</h1>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                                        {[...Array(8)].map((_, index) => (
                                                                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                                                                        <div className="w-full h-64 bg-gray-300"></div>
                                                                        <div className="p-4">
                                                                                <div className="bg-gray-300 h-4 rounded mb-2"></div>
                                                                                <div className="bg-gray-300 h-4 rounded w-2/3 mb-2"></div>
                                                                                <div className="bg-gray-300 h-4 rounded w-1/3"></div>
                                                                        </div>
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
                                                <h1 className="text-3xl font-bold text-gray-800 mb-2">محصولات</h1>
                                                <p className="text-gray-600">مجموعه کامل شال و روسری با کیفیت بالا</p>
                                        </div>

                                        {error && (
                                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                                                        {error}
                                                </div>
                                        )}

                                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                                                {/* Filters Sidebar */}
                                                <div className="lg:col-span-1">
                                                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                                                                <div className="flex items-center justify-between mb-4">
                                                                        <h2 className="text-xl font-bold text-gray-800">فیلترها</h2>
                                                                        <button
                                                                                onClick={resetFilters}
                                                                                className="text-pink-600 text-sm hover:text-pink-700 transition-colors"
                                                                        >
                                                                                پاک کردن
                                                                        </button>
                                                                </div>

                                                                {/* Search */}
                                                                <div className="mb-6">
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">جستجو</label>
                                                                        <input
                                                                                type="text"
                                                                                value={searchQuery}
                                                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                                                placeholder="نام محصول..."
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                                                        />
                                                                </div>

                                                                {/* Category Filter */}
                                                                <div className="mb-6">
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

                                                                {/* Price Range */}
                                                                <div className="mb-6">
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">محدوده قیمت</label>
                                                                        <div className="space-y-2">
                                                                                <div className="flex items-center space-x-2 space-x-reverse">
                                                                                        <input
                                                                                                type="number"
                                                                                                value={priceRange[0]}
                                                                                                onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                                                                                                placeholder="از"
                                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                                                                        />
                                                                                        <span className="text-gray-500">تا</span>
                                                                                        <input
                                                                                                type="number"
                                                                                                value={priceRange[1]}
                                                                                                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 50000000])}
                                                                                                placeholder="تا"
                                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                                                                        />
                                                                                </div>
                                                                        </div>
                                                                </div>

                                                                {/* Sort */}
                                                                <div className="mb-6">
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
                                                        </div>
                                                </div>

                                                {/* Products Grid */}
                                                <div className="lg:col-span-3">
                                                        <div className="flex items-center justify-between mb-6">
                                                                <div>
                                                                        <p className="text-gray-600">
                                                                                {filteredProducts.length} محصول از {products.length} محصول یافت شد
                                                                        </p>
                                                                        <p className="text-xs text-gray-400 mt-1">
                                                                                فیلتر فعال: {selectedCategory || 'همه دسته‌ها'} | جستجو: {searchQuery || 'بدون جستجو'}
                                                                        </p>
                                                                </div>
                                                        </div>

                                                        {filteredProducts.length === 0 ? (
                                                                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                                                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                                                                <span className="text-4xl">🔍</span>
                                                                        </div>
                                                                        <h2 className="text-2xl font-bold text-gray-800 mb-4">محصولی یافت نشد</h2>
                                                                        <p className="text-gray-600 mb-8">فیلترهای خود را تغییر دهید یا دوباره جستجو کنید</p>
                                                                        <button
                                                                                onClick={resetFilters}
                                                                                className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                                                                        >
                                                                                پاک کردن فیلترها
                                                                        </button>
                                                                </div>
                                                        ) : (
                                                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                                                        {filteredProducts.map((product) => (
                                                                                <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-[580px] flex flex-col">
                                                                                        {/* Product Image */}
                                                                                        <Link to={`/products/${product._id}`} className="block">
                                                                                                <div className="relative">
                                                                                                        <img
                                                                                                                src={typeof product.images?.[0] === 'string' ? product.images[0] : '/placeholder-image.jpg'}
                                                                                                                alt={product.name}
                                                                                                                className="w-full h-64 object-cover"
                                                                                                        />
                                                                                                        {product.discount && product.discount > 0 && (
                                                                                                                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                                                                                                                        {product.discount}% تخفیف
                                                                                                                </div>
                                                                                                        )}
                                                                                                        {product.stock === 0 && (
                                                                                                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                                                                                        <span className="text-white font-bold">ناموجود</span>
                                                                                                                </div>
                                                                                                        )}
                                                                                                </div>
                                                                                        </Link>

                                                                                        {/* Product Info - Flexible content area */}
                                                                                        <div className="p-4 flex-1 flex flex-col">
                                                                                                <Link to={`/products/${product._id}`}>
                                                                                                        <h3 className="text-lg font-bold text-gray-800 mb-2 hover:text-pink-600 transition-colors line-clamp-2">
                                                                                                                {product.name}
                                                                                                        </h3>
                                                                                                </Link>

                                                                                                <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-shrink-0">
                                                                                                        {product.description}
                                                                                                </p>

                                                                                                {/* Tags section - Fixed height */}
                                                                                                <div className="mb-3 h-8 flex-shrink-0">
                                                                                                        {product.tags && product.tags.length > 0 && (
                                                                                                                <div className="flex flex-wrap gap-1">
                                                                                                                        {product.tags.slice(0, 3).map((tag, index) => (
                                                                                                                                <span key={index} className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                                                                                                                                        {tag}
                                                                                                                                </span>
                                                                                                                        ))}
                                                                                                                        {product.tags.length > 3 && (
                                                                                                                                <span className="text-xs text-gray-400">
                                                                                                                                        +{product.tags.length - 3}
                                                                                                                                </span>
                                                                                                                        )}
                                                                                                                </div>
                                                                                                        )}
                                                                                                </div>

                                                                                                {/* Category and stock info - Fixed height */}
                                                                                                <div className="flex items-center justify-between mb-3 h-6 flex-shrink-0">
                                                                                                        <div className="flex items-center gap-2">
                                                                                                                <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
                                                                                                                        {product.category}
                                                                                                                </span>
                                                                                                                {product.brand && (
                                                                                                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                                                                                                                {product.brand}
                                                                                                                        </span>
                                                                                                                )}
                                                                                                                {product.material && (
                                                                                                                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                                                                                                                {product.material}
                                                                                                                        </span>
                                                                                                                )}
                                                                                                        </div>
                                                                                                        {product.stock > 0 && (
                                                                                                                <span className="text-xs text-gray-500">
                                                                                                                        {product.stock} عدد موجود
                                                                                                                </span>
                                                                                                        )}
                                                                                                </div>

                                                                                                {/* Spacer to push price and button to bottom */}
                                                                                                <div className="flex-1"></div>

                                                                                                {/* Price and Add to Cart - Fixed at bottom */}
                                                                                                <div className="flex items-center justify-between mt-auto">
                                                                                                        <div>
                                                                                                                {product.discountPrice ? (
                                                                                                                        <div>
                                                                                                                                <span className="text-lg font-bold text-pink-600">
                                                                                                                                        {formatPrice(product.discountPrice)} تومان
                                                                                                                                </span>
                                                                                                                                <span className="text-sm text-gray-500 line-through mr-2">
                                                                                                                                        {formatPrice(product.price)} تومان
                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                                ) : product.discount && product.discount > 0 ? (
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

                                                                                                        <button
                                                                                                                onClick={() => handleAddToCart(product)}
                                                                                                                disabled={product.stock === 0}
                                                                                                                className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex-shrink-0"
                                                                                                        >
                                                                                                                {product.stock === 0 ? 'ناموجود' : 'افزودن به سبد'}
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
                        </div>
                </div>
        );
};

export default Products; 