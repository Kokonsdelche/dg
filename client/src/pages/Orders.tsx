import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Order } from '../types';
import { ordersAPI } from '../services/api';

const Orders: React.FC = () => {
        const [orders, setOrders] = useState<Order[]>([]);
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState('');

        useEffect(() => {
                fetchOrders();
        }, []);

        const fetchOrders = async () => {
                try {
                        const response = await ordersAPI.getUserOrders();
                        setOrders(response.orders || []);
                } catch (error: any) {
                        setError('خطا در دریافت سفارشات: ' + (error.response?.data?.message || error.message));
                } finally {
                        setIsLoading(false);
                }
        };

        const getStatusText = (status: string) => {
                const statusMap = {
                        pending: 'در انتظار تایید',
                        confirmed: 'تایید شده',
                        processing: 'در حال پردازش',
                        shipped: 'ارسال شده',
                        delivered: 'تحویل داده شده',
                        cancelled: 'لغو شده'
                };
                return statusMap[status as keyof typeof statusMap] || status;
        };

        const getStatusColor = (status: string) => {
                const colorMap = {
                        pending: 'bg-yellow-100 text-yellow-800',
                        confirmed: 'bg-blue-100 text-blue-800',
                        processing: 'bg-purple-100 text-purple-800',
                        shipped: 'bg-indigo-100 text-indigo-800',
                        delivered: 'bg-green-100 text-green-800',
                        cancelled: 'bg-red-100 text-red-800'
                };
                return colorMap[status as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
        };

        const formatPrice = (price: number) => {
                return new Intl.NumberFormat('fa-IR').format(price);
        };

        const formatDate = (dateString: string) => {
                return new Date(dateString).toLocaleDateString('fa-IR');
        };

        if (isLoading) {
                return (
                        <div className="min-h-screen bg-gray-50 py-8">
                                <div className="container mx-auto px-4">
                                        <div className="max-w-6xl mx-auto">
                                                <h1 className="text-3xl font-bold text-gray-800 mb-8">سفارشات من</h1>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                        {[...Array(6)].map((_, index) => (
                                                                <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                                                                        <div className="bg-gray-300 h-4 rounded mb-4"></div>
                                                                        <div className="bg-gray-300 h-4 rounded w-2/3 mb-2"></div>
                                                                        <div className="bg-gray-300 h-4 rounded w-1/3"></div>
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
                                <div className="max-w-6xl mx-auto">
                                        {/* Header */}
                                        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                                                <div className="flex items-center justify-between">
                                                        <div>
                                                                <h1 className="text-3xl font-bold text-gray-800">سفارشات من</h1>
                                                                <p className="text-gray-600 mt-1">مشاهده و پیگیری سفارشات شما</p>
                                                        </div>
                                                        <div className="text-right">
                                                                <p className="text-sm text-gray-500">تعداد سفارشات</p>
                                                                <p className="text-2xl font-bold text-purple-600">{orders.length}</p>
                                                        </div>
                                                </div>
                                        </div>

                                        {error && (
                                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                                                        {error}
                                                </div>
                                        )}

                                        {orders.length === 0 ? (
                                                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                                                <span className="text-4xl">📦</span>
                                                        </div>
                                                        <h2 className="text-2xl font-bold text-gray-800 mb-4">هنوز سفارشی ندارید</h2>
                                                        <p className="text-gray-600 mb-8">برای شروع خرید، محصولات ما را مشاهده کنید</p>
                                                        <Link
                                                                to="/products"
                                                                className="bg-pink-600 text-white px-8 py-3 rounded-lg hover:bg-pink-700 transition-colors inline-block"
                                                        >
                                                                مشاهده محصولات
                                                        </Link>
                                                </div>
                                        ) : (
                                                <div className="space-y-6">
                                                        {orders.map((order) => (
                                                                <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                                                        {/* Order Header */}
                                                                        <div className="bg-gray-50 px-6 py-4 border-b">
                                                                                <div className="flex items-center justify-between">
                                                                                        <div className="flex items-center space-x-4 space-x-reverse">
                                                                                                <h3 className="text-lg font-bold text-gray-800">
                                                                                                        سفارش #{order.orderNumber}
                                                                                                </h3>
                                                                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                                                                                                        {getStatusText(order.orderStatus)}
                                                                                                </span>
                                                                                        </div>
                                                                                        <div className="text-right">
                                                                                                <p className="text-sm text-gray-500">تاریخ سفارش</p>
                                                                                                <p className="font-medium">{formatDate(order.createdAt)}</p>
                                                                                        </div>
                                                                                </div>
                                                                        </div>

                                                                        {/* Order Content */}
                                                                        <div className="p-6">
                                                                                {/* Order Items */}
                                                                                <div className="mb-6">
                                                                                        <h4 className="text-lg font-bold text-gray-800 mb-4">محصولات سفارش</h4>
                                                                                        <div className="space-y-3">
                                                                                                {order.items.map((item, index) => (
                                                                                                        <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100">
                                                                                                                <div className="flex items-center">
                                                                                                                        <img
                                                                                                                                src={item.image || '/placeholder-image.jpg'}
                                                                                                                                alt={item.name}
                                                                                                                                className="w-16 h-16 object-cover rounded-lg ml-4"
                                                                                                                        />
                                                                                                                        <div>
                                                                                                                                <h5 className="font-medium text-gray-800">{item.name}</h5>
                                                                                                                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                                                                                                                        <span>تعداد: {item.quantity}</span>
                                                                                                                                        {item.color && <span className="mr-4">رنگ: {item.color}</span>}
                                                                                                                                        {item.size && <span className="mr-4">سایز: {item.size}</span>}
                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                                </div>
                                                                                                                <div className="text-right">
                                                                                                                        <p className="font-bold text-gray-800">{formatPrice(item.price)} تومان</p>
                                                                                                                        <p className="text-sm text-gray-500">قیمت واحد</p>
                                                                                                                </div>
                                                                                                        </div>
                                                                                                ))}
                                                                                        </div>
                                                                                </div>

                                                                                {/* Order Summary */}
                                                                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                                                                                <div>
                                                                                                        <p className="text-sm text-gray-500">مجموع اولیه</p>
                                                                                                        <p className="font-bold text-gray-800">{formatPrice(order.totalAmount)} تومان</p>
                                                                                                </div>
                                                                                                <div>
                                                                                                        <p className="text-sm text-gray-500">تخفیف</p>
                                                                                                        <p className="font-bold text-green-600">{formatPrice(order.discountAmount || 0)} تومان</p>
                                                                                                </div>
                                                                                                <div>
                                                                                                        <p className="text-sm text-gray-500">هزینه ارسال</p>
                                                                                                        <p className="font-bold text-gray-800">{formatPrice(order.shippingCost || 0)} تومان</p>
                                                                                                </div>
                                                                                                <div>
                                                                                                        <p className="text-sm text-gray-500">مبلغ نهایی</p>
                                                                                                        <p className="font-bold text-pink-600 text-lg">{formatPrice(order.finalAmount)} تومان</p>
                                                                                                </div>
                                                                                        </div>
                                                                                </div>

                                                                                {/* Shipping Address */}
                                                                                {order.shippingAddress && (
                                                                                        <div className="mb-6">
                                                                                                <h4 className="text-lg font-bold text-gray-800 mb-2">آدرس تحویل</h4>
                                                                                                <div className="bg-gray-50 rounded-lg p-4">
                                                                                                        <p className="text-gray-700">
                                                                                                                {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}
                                                                                                        </p>
                                                                                                        {order.shippingAddress.postalCode && (
                                                                                                                <p className="text-gray-600 text-sm mt-1">
                                                                                                                        کد پستی: {order.shippingAddress.postalCode}
                                                                                                                </p>
                                                                                                        )}
                                                                                                </div>
                                                                                        </div>
                                                                                )}

                                                                                {/* Actions */}
                                                                                <div className="flex flex-wrap gap-3">
                                                                                        <Link
                                                                                                to={`/orders/${order._id}`}
                                                                                                className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
                                                                                        >
                                                                                                جزئیات سفارش
                                                                                        </Link>

                                                                                        {order.trackingNumber && (
                                                                                                <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                                                                                        پیگیری مرسوله
                                                                                                </button>
                                                                                        )}

                                                                                        {order.orderStatus === 'pending' && (
                                                                                                <button className="border border-red-300 text-red-700 px-6 py-2 rounded-lg hover:bg-red-50 transition-colors">
                                                                                                        لغو سفارش
                                                                                                </button>
                                                                                        )}

                                                                                        {order.orderStatus === 'delivered' && (
                                                                                                <button className="border border-green-300 text-green-700 px-6 py-2 rounded-lg hover:bg-green-50 transition-colors">
                                                                                                        نظر و امتیاز
                                                                                                </button>
                                                                                        )}
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

export default Orders; 