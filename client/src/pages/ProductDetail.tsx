import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product, ProductColor, ProductSize } from '../types';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';

const ProductDetail: React.FC = () => {
        const { id } = useParams<{ id: string }>();
        const [product, setProduct] = useState<Product | null>(null);
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState('');
        const [selectedImageIndex, setSelectedImageIndex] = useState(0);
        const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
        const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
        const [quantity, setQuantity] = useState(1);
        const [activeTab, setActiveTab] = useState('description');

        const { addToCart: addToCartContext } = useCart();

        useEffect(() => {
                if (id) {
                        fetchProduct();
                }
        }, [id]);

        const fetchProduct = async () => {
                try {
                        setIsLoading(true);
                        const response = await productsAPI.getProduct(id!);
                        setProduct(response.product);

                        // Set default color and size if available
                        if (response.product.colors && response.product.colors.length > 0) {
                                setSelectedColor(response.product.colors[0]);
                        }
                        if (response.product.sizes && response.product.sizes.length > 0) {
                                setSelectedSize(response.product.sizes[0]);
                        }
                } catch (error: any) {
                        setError('خطا در دریافت اطلاعات محصول: ' + (error.response?.data?.message || error.message));
                } finally {
                        setIsLoading(false);
                }
        };

        const addToCart = () => {
                if (!product) return;

                const finalPrice = product.discount && product.discount > 0
                        ? product.price * (1 - product.discount / 100)
                        : product.price;

                addToCartContext({
                        productId: product._id,
                        name: product.name,
                        price: finalPrice,
                        image: typeof product.images?.[0] === 'string' ? product.images[0] : '',
                        quantity,
                        color: selectedColor?.name || undefined,
                        size: selectedSize?.name || undefined
                });

                alert('محصول به سبد خرید اضافه شد');
        };

        const formatPrice = (price: number) => {
                return new Intl.NumberFormat('fa-IR').format(price);
        };

        const finalPrice = product && product.discount && product.discount > 0
                ? product.price * (1 - product.discount / 100)
                : product?.price || 0;

        if (isLoading) {
                return (
                        <div className="min-h-screen bg-gray-50 py-8">
                                <div className="container mx-auto px-4">
                                        <div className="max-w-6xl mx-auto">
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                        <div className="bg-gray-300 h-96 rounded-lg animate-pulse"></div>
                                                        <div className="space-y-4">
                                                                <div className="bg-gray-300 h-8 rounded animate-pulse"></div>
                                                                <div className="bg-gray-300 h-4 rounded w-2/3 animate-pulse"></div>
                                                                <div className="bg-gray-300 h-6 rounded w-1/3 animate-pulse"></div>
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </div>
                );
        }

        if (error || !product) {
                return (
                        <div className="min-h-screen bg-gray-50 py-8">
                                <div className="container mx-auto px-4">
                                        <div className="max-w-2xl mx-auto text-center">
                                                <div className="bg-white rounded-lg shadow-md p-12">
                                                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                                                <span className="text-4xl">❌</span>
                                                        </div>
                                                        <h1 className="text-2xl font-bold text-gray-800 mb-4">محصول یافت نشد</h1>
                                                        <p className="text-gray-600 mb-8">{error || 'محصول مورد نظر وجود ندارد یا حذف شده است'}</p>
                                                        <Link
                                                                to="/products"
                                                                className="bg-pink-600 text-white px-8 py-3 rounded-lg hover:bg-pink-700 transition-colors inline-block"
                                                        >
                                                                بازگشت به محصولات
                                                        </Link>
                                                </div>
                                        </div>
                                </div>
                        </div>
                );
        }

        return (
                <div className="min-h-screen bg-gray-50 py-8">
                        <div className="container mx-auto px-4">
                                <div className="max-w-6xl mx-auto">
                                        {/* Breadcrumb */}
                                        <nav className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500 mb-8">
                                                <Link to="/" className="hover:text-purple-600">خانه</Link>
                                                <span>/</span>
                                                <Link to="/products" className="hover:text-purple-600">محصولات</Link>
                                                <span>/</span>
                                                <span className="text-gray-800">{product.name}</span>
                                        </nav>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                                {/* Product Images */}
                                                <div className="space-y-4">
                                                        {/* Main Image */}
                                                        <div className="relative">
                                                                <img
                                                                        src={typeof product.images?.[selectedImageIndex] === 'string' ? product.images[selectedImageIndex] : '/placeholder-image.jpg'}
                                                                        alt={product.name}
                                                                        className="w-full h-96 object-cover rounded-lg"
                                                                />
                                                                {product.discount && product.discount > 0 && (
                                                                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-lg font-bold">
                                                                                {product.discount}% تخفیف
                                                                        </div>
                                                                )}
                                                                {product.stock === 0 && (
                                                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                                                <span className="text-white text-xl font-bold">ناموجود</span>
                                                                        </div>
                                                                )}
                                                        </div>

                                                        {/* Image Thumbnails */}
                                                        {product.images && product.images.length > 1 && (
                                                                <div className="flex space-x-2 space-x-reverse mt-4 overflow-x-auto">
                                                                        {product.images.map((image, index) => (
                                                                                <img
                                                                                        key={index}
                                                                                        src={typeof image === 'string' ? image : '/placeholder-image.jpg'}
                                                                                        alt={`${product.name} ${index + 1}`}
                                                                                        className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${selectedImageIndex === index ? 'border-pink-600' : 'border-gray-200'
                                                                                                }`}
                                                                                        onClick={() => setSelectedImageIndex(index)}
                                                                                />
                                                                        ))}
                                                                </div>
                                                        )}
                                                </div>

                                                {/* Product Info */}
                                                <div className="space-y-6">
                                                        {/* Basic Info */}
                                                        <div>
                                                                <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                                                                        {product.category}
                                                                </span>
                                                                <h1 className="text-3xl font-bold text-gray-800 mt-4">{product.name}</h1>
                                                                <p className="text-gray-600 mt-2">{product.description}</p>
                                                        </div>

                                                        {/* Price */}
                                                        <div className="border-b border-gray-200 pb-6">
                                                                {product.discount && product.discount > 0 ? (
                                                                        <div className="flex items-center space-x-4 space-x-reverse">
                                                                                <span className="text-3xl font-bold text-pink-600">
                                                                                        {formatPrice(finalPrice)} تومان
                                                                                </span>
                                                                                <span className="text-xl text-gray-500 line-through">
                                                                                        {formatPrice(product.price)} تومان
                                                                                </span>
                                                                                <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-medium">
                                                                                        {product.discount}% تخفیف
                                                                                </span>
                                                                        </div>
                                                                ) : (
                                                                        <span className="text-3xl font-bold text-gray-800">
                                                                                {formatPrice(product.price)} تومان
                                                                        </span>
                                                                )}
                                                        </div>

                                                        {/* Color Selection */}
                                                        {product.colors && product.colors.length > 0 && (
                                                                <div className="border-b border-gray-200 pb-6">
                                                                        <h3 className="text-lg font-medium text-gray-800 mb-3">رنگ:</h3>
                                                                        <div className="flex flex-wrap gap-2">
                                                                                {product.colors.map((color, index) => (
                                                                                        <button
                                                                                                key={`color-${index}-${color.name}`}
                                                                                                onClick={() => setSelectedColor(color)}
                                                                                                className={`px-4 py-2 border rounded-lg transition-colors ${selectedColor?.name === color.name
                                                                                                        ? 'border-purple-600 bg-purple-50 text-purple-600'
                                                                                                        : 'border-gray-300 hover:border-gray-400'
                                                                                                        }`}
                                                                                        >
                                                                                                {color.name}
                                                                                        </button>
                                                                                ))}
                                                                        </div>
                                                                </div>
                                                        )}

                                                        {/* Size Selection */}
                                                        {product.sizes && product.sizes.length > 0 && (
                                                                <div className="border-b border-gray-200 pb-6">
                                                                        <h3 className="text-lg font-medium text-gray-800 mb-3">سایز:</h3>
                                                                        <div className="flex flex-wrap gap-2">
                                                                                {product.sizes.map((size, index) => (
                                                                                        <button
                                                                                                key={`size-${index}-${size.name}`}
                                                                                                onClick={() => setSelectedSize(size)}
                                                                                                className={`px-4 py-2 border rounded-lg transition-colors ${selectedSize?.name === size.name
                                                                                                        ? 'border-purple-600 bg-purple-50 text-purple-600'
                                                                                                        : 'border-gray-300 hover:border-gray-400'
                                                                                                        }`}
                                                                                        >
                                                                                                {size.name}
                                                                                        </button>
                                                                                ))}
                                                                        </div>
                                                                </div>
                                                        )}

                                                        {/* Quantity */}
                                                        <div>
                                                                <h3 className="text-lg font-medium text-gray-800 mb-3">تعداد</h3>
                                                                <div className="flex items-center space-x-4 space-x-reverse">
                                                                        <div className="flex items-center border border-gray-300 rounded-lg">
                                                                                <button
                                                                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                                                        className="px-3 py-2 hover:bg-gray-50 transition-colors"
                                                                                >
                                                                                        −
                                                                                </button>
                                                                                <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                                                                                <button
                                                                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                                                                        className="px-3 py-2 hover:bg-gray-50 transition-colors"
                                                                                        disabled={quantity >= product.stock}
                                                                                >
                                                                                        +
                                                                                </button>
                                                                        </div>
                                                                        <span className="text-sm text-gray-500">
                                                                                {product.stock} عدد موجود
                                                                        </span>
                                                                </div>
                                                        </div>

                                                        {/* Add to Cart */}
                                                        <div className="space-y-4">
                                                                <button
                                                                        onClick={addToCart}
                                                                        disabled={product.stock === 0}
                                                                        className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                                                                >
                                                                        {product.stock === 0 ? 'ناموجود' : 'افزودن به سبد خرید'}
                                                                </button>

                                                                <div className="grid grid-cols-2 gap-4">
                                                                        <button className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                                                                                ❤️ افزودن به علاقه‌مندی‌ها
                                                                        </button>
                                                                        <button className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                                                                                📤 اشتراک‌گذاری
                                                                        </button>
                                                                </div>
                                                        </div>

                                                        {/* Product Features */}
                                                        <div className="bg-gray-50 rounded-lg p-4">
                                                                <h4 className="font-medium text-gray-800 mb-3">ویژگی‌های محصول</h4>
                                                                <ul className="space-y-2 text-sm text-gray-600">
                                                                        <li className="flex items-center">
                                                                                <span className="text-green-600 ml-2">✓</span>
                                                                                کیفیت بالا و مواد مرغوب
                                                                        </li>
                                                                        <li className="flex items-center">
                                                                                <span className="text-green-600 ml-2">✓</span>
                                                                                ضمانت اصالت کالا
                                                                        </li>
                                                                        <li className="flex items-center">
                                                                                <span className="text-green-600 ml-2">✓</span>
                                                                                ارسال سریع در کل کشور
                                                                        </li>
                                                                        <li className="flex items-center">
                                                                                <span className="text-green-600 ml-2">✓</span>
                                                                                پشتیبانی 24 ساعته
                                                                        </li>
                                                                </ul>
                                                        </div>
                                                </div>
                                        </div>

                                        {/* Product Details Tabs */}
                                        <div className="mt-16">
                                                <div className="border-b border-gray-200">
                                                        <nav className="-mb-px flex space-x-8 space-x-reverse">
                                                                <button
                                                                        onClick={() => setActiveTab('description')}
                                                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'description'
                                                                                ? 'border-purple-600 text-purple-600'
                                                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                                                }`}
                                                                >
                                                                        توضیحات تکمیلی
                                                                </button>
                                                                <button
                                                                        onClick={() => setActiveTab('specifications')}
                                                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'specifications'
                                                                                ? 'border-purple-600 text-purple-600'
                                                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                                                }`}
                                                                >
                                                                        مشخصات
                                                                </button>
                                                                <button
                                                                        onClick={() => setActiveTab('shipping')}
                                                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'shipping'
                                                                                ? 'border-purple-600 text-purple-600'
                                                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                                                }`}
                                                                >
                                                                        ارسال و بازگشت
                                                                </button>
                                                        </nav>
                                                </div>

                                                <div className="py-8">
                                                        {activeTab === 'description' && (
                                                                <div className="prose prose-lg max-w-none">
                                                                        <p className="text-gray-700 leading-relaxed">
                                                                                {product.description}
                                                                        </p>
                                                                </div>
                                                        )}

                                                        {activeTab === 'specifications' && (
                                                                <div className="space-y-4">
                                                                        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                                                <div className="flex justify-between">
                                                                                        <dt className="text-gray-600">دسته‌بندی:</dt>
                                                                                        <dd className="font-medium">{product.category}</dd>
                                                                                </div>
                                                                                {product.brand && (
                                                                                        <div className="flex justify-between">
                                                                                                <dt className="text-gray-600">برند:</dt>
                                                                                                <dd className="font-medium">{product.brand}</dd>
                                                                                        </div>
                                                                                )}
                                                                                {product.material && (
                                                                                        <div className="flex justify-between">
                                                                                                <dt className="text-gray-600">جنس:</dt>
                                                                                                <dd className="font-medium">{product.material}</dd>
                                                                                        </div>
                                                                                )}
                                                                                <div className="flex justify-between">
                                                                                        <dt className="text-gray-600">قیمت:</dt>
                                                                                        <dd className="font-medium">{formatPrice(product.price)} تومان</dd>
                                                                                </div>
                                                                                {product.discount && product.discount > 0 && (
                                                                                        <div className="flex justify-between">
                                                                                                <dt className="text-gray-600">تخفیف:</dt>
                                                                                                <dd className="font-medium text-red-600">{product.discount}%</dd>
                                                                                        </div>
                                                                                )}
                                                                        </dl>
                                                                </div>
                                                        )}

                                                        {activeTab === 'shipping' && (
                                                                <div className="bg-white rounded-lg p-6">
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                                                <div>
                                                                                        <h4 className="font-medium text-gray-800 mb-4">🚚 ارسال</h4>
                                                                                        <ul className="space-y-3 text-gray-700">
                                                                                                <li>• ارسال رایگان برای خریدهای بالای 500,000 تومان</li>
                                                                                                <li>• ارسال عادی: 2-3 روز کاری</li>
                                                                                                <li>• ارسال اکسپرس: 1 روز کاری</li>
                                                                                                <li>• ارسال به سراسر کشور</li>
                                                                                                <li>• امکان تحویل در محل</li>
                                                                                        </ul>
                                                                                </div>

                                                                                <div>
                                                                                        <h4 className="font-medium text-gray-800 mb-4">🔄 بازگشت و تعویض</h4>
                                                                                        <ul className="space-y-3 text-gray-700">
                                                                                                <li>• 7 روز ضمانت بازگشت کالا</li>
                                                                                                <li>• شرایط: کالا در بسته‌بندی اصلی</li>
                                                                                                <li>• عدم استفاده از محصول</li>
                                                                                                <li>• همراه داشتن فاکتور خرید</li>
                                                                                                <li>• بازپرداخت در صورت تایید</li>
                                                                                        </ul>
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                        )}
                                                </div>
                                        </div>
                                </div>
                        </div>
                </div>
        );
};

export default ProductDetail;