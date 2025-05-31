import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
        const {
                cartItems,
                updateQuantity,
                removeFromCart,
                getCartTotal,
                getCartItemsCount,
                clearCart
        } = useCart();

        const formatPrice = (price: number) => {
                return new Intl.NumberFormat('fa-IR').format(price);
        };

        const shippingCost = 50000; // هزینه ارسال ثابت
        const totalAmount = getCartTotal();
        const finalAmount = totalAmount + (totalAmount > 500000 ? 0 : shippingCost);

        if (cartItems.length === 0) {
                return (
                        <div className="min-h-screen bg-gray-50 py-8">
                                <div className="container mx-auto px-4">
                                        <div className="max-w-4xl mx-auto">
                                                <h1 className="text-3xl font-bold text-gray-800 mb-8">سبد خرید</h1>

                                                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                                                <span className="text-4xl">🛒</span>
                                                        </div>
                                                        <h2 className="text-2xl font-bold text-gray-800 mb-4">سبد خرید شما خالی است</h2>
                                                        <p className="text-gray-600 mb-8">محصولاتی که دوست دارید را به سبد خرید اضافه کنید</p>
                                                        <Link
                                                                to="/products"
                                                                className="bg-pink-600 text-white px-8 py-3 rounded-lg hover:bg-pink-700 transition-colors inline-block"
                                                        >
                                                                شروع خرید
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
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-8">
                                                <div>
                                                        <h1 className="text-3xl font-bold text-gray-800">سبد خرید</h1>
                                                        <p className="text-gray-600 mt-1">{getCartItemsCount()} محصول در سبد خرید شما</p>
                                                </div>
                                                <button
                                                        onClick={clearCart}
                                                        className="text-red-600 hover:text-red-700 transition-colors"
                                                >
                                                        پاک کردن سبد خرید
                                                </button>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                                {/* Cart Items */}
                                                <div className="lg:col-span-2">
                                                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                                                <div className="p-6 border-b">
                                                                        <h2 className="text-xl font-bold text-gray-800">محصولات</h2>
                                                                </div>

                                                                <div className="divide-y divide-gray-200">
                                                                        {cartItems.map((item) => (
                                                                                <div key={`${item.productId}-${item.color || ''}-${item.size || ''}`} className="p-6">
                                                                                        <div className="flex items-center">
                                                                                                {/* Product Image */}
                                                                                                <img
                                                                                                        src={item.image || '/placeholder-image.jpg'}
                                                                                                        alt={item.name}
                                                                                                        className="w-20 h-20 object-cover rounded-lg ml-4"
                                                                                                />

                                                                                                {/* Product Info */}
                                                                                                <div className="flex-1">
                                                                                                        <h3 className="text-lg font-medium text-gray-800 mb-1">{item.name}</h3>
                                                                                                        <div className="flex items-center text-sm text-gray-500 mb-2">
                                                                                                                {item.color && <span className="ml-4">رنگ: {item.color}</span>}
                                                                                                                {item.size && <span className="ml-4">سایز: {item.size}</span>}
                                                                                                        </div>
                                                                                                        <p className="text-lg font-bold text-purple-600">
                                                                                                                {formatPrice(item.price)} تومان
                                                                                                        </p>
                                                                                                </div>

                                                                                                {/* Quantity Controls */}
                                                                                                <div className="flex items-center ml-4">
                                                                                                        <button
                                                                                                                onClick={() => updateQuantity(item.productId, item.quantity - 1, item.color, item.size)}
                                                                                                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                                                                                                disabled={item.quantity <= 1}
                                                                                                        >
                                                                                                                <span className="text-lg">−</span>
                                                                                                        </button>
                                                                                                        <span className="mx-3 text-lg font-medium w-8 text-center">{item.quantity}</span>
                                                                                                        <button
                                                                                                                onClick={() => updateQuantity(item.productId, item.quantity + 1, item.color, item.size)}
                                                                                                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                                                                                        >
                                                                                                                <span className="text-lg">+</span>
                                                                                                        </button>
                                                                                                </div>

                                                                                                {/* Total Price */}
                                                                                                <div className="text-right ml-6">
                                                                                                        <p className="text-lg font-bold text-gray-800">
                                                                                                                {formatPrice(item.price * item.quantity)} تومان
                                                                                                        </p>
                                                                                                        <p className="text-sm text-gray-500">جمع</p>
                                                                                                </div>

                                                                                                {/* Remove Button */}
                                                                                                <button
                                                                                                        onClick={() => removeFromCart(item.productId, item.color, item.size)}
                                                                                                        className="text-red-600 hover:text-red-700 transition-colors mr-4"
                                                                                                >
                                                                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                                                        </svg>
                                                                                                </button>
                                                                                        </div>
                                                                                </div>
                                                                        ))}
                                                                </div>
                                                        </div>
                                                </div>

                                                {/* Order Summary */}
                                                <div className="lg:col-span-1">
                                                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                                                                <h2 className="text-xl font-bold text-gray-800 mb-6">خلاصه سفارش</h2>

                                                                <div className="space-y-4 mb-6">
                                                                        <div className="flex justify-between">
                                                                                <span className="text-gray-600">جمع محصولات ({getCartItemsCount()} عدد)</span>
                                                                                <span className="font-medium">{formatPrice(totalAmount)} تومان</span>
                                                                        </div>

                                                                        <div className="flex justify-between">
                                                                                <span className="text-gray-600">هزینه ارسال</span>
                                                                                <span className="font-medium">
                                                                                        {totalAmount > 500000 ? (
                                                                                                <span className="text-green-600">رایگان</span>
                                                                                        ) : (
                                                                                                `${formatPrice(shippingCost)} تومان`
                                                                                        )}
                                                                                </span>
                                                                        </div>

                                                                        {totalAmount <= 500000 && (
                                                                                <div className="bg-blue-50 p-3 rounded-lg">
                                                                                        <p className="text-sm text-blue-700">
                                                                                                برای ارسال رایگان {formatPrice(500000 - totalAmount)} تومان تا تکمیل مبلغ باقی مانده
                                                                                        </p>
                                                                                </div>
                                                                        )}

                                                                        <hr className="border-gray-200" />

                                                                        <div className="flex justify-between text-lg font-bold">
                                                                                <span>مجموع نهایی</span>
                                                                                <span className="text-purple-600">{formatPrice(finalAmount)} تومان</span>
                                                                        </div>
                                                                </div>

                                                                <div className="space-y-3">
                                                                        <Link
                                                                                to="/checkout"
                                                                                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                                                                        >
                                                                                ادامه فرآیند خرید
                                                                        </Link>

                                                                        <Link
                                                                                to="/products"
                                                                                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                                                                        >
                                                                                ادامه خرید
                                                                        </Link>
                                                                </div>

                                                                {/* Security Badge */}
                                                                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                                                                        <div className="flex items-center">
                                                                                <svg className="w-5 h-5 text-green-600 ml-2" fill="currentColor" viewBox="0 0 20 20">
                                                                                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                                </svg>
                                                                                <div>
                                                                                        <p className="text-sm font-medium text-green-800">خرید امن</p>
                                                                                        <p className="text-xs text-green-600">اطلاعات شما محافظت می‌شود</p>
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </div>
                </div>
        );
};

export default Cart; 