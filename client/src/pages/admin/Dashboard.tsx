import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: any[];
  topProducts: any[];
  salesData: any[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    topProducts: [],
    salesData: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Fetch dashboard statistics from API
      const response = await adminAPI.getDashboardStats();

      if (response.success && response.data) {
        const { stats } = response.data;
        setStats({
          totalUsers: stats?.totalUsers || 0,
          totalProducts: stats?.totalProducts || 0,
          totalOrders: stats?.totalOrders || 0,
          totalRevenue: stats?.totalRevenue || 0,
          recentOrders: response.data.recentOrders || [],
          topProducts: [], // Empty for now as API doesn't return this
          salesData: []
        });
      } else {
        // Fallback to empty data if API fails
        console.warn('Failed to fetch dashboard stats, using empty data');
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('خطا در دریافت آمار. لطفاً صفحه را بروزرسانی کنید.');
    } finally {
      setIsLoading(false);
    }
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
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">داشبورد مدیریت</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="bg-gray-300 h-4 rounded mb-4"></div>
                  <div className="bg-gray-300 h-8 rounded w-2/3"></div>
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
                <h1 className="text-3xl font-bold text-gray-800 mb-2">داشبورد مدیریت</h1>
                <p className="text-gray-600">خلاصه‌ای از عملکرد فروشگاه شال و روسری</p>
              </div>
              <button
                onClick={fetchDashboardStats}
                disabled={isLoading}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {isLoading ? 'در حال بروزرسانی...' : 'بروزرسانی آمار'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="mr-4">
                  <h3 className="text-sm font-medium text-gray-500">کاربران</h3>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalUsers}</p>
                </div>
              </div>
              <div className="mt-4">
                <Link to="/admin/users" className="text-blue-600 text-sm hover:text-blue-700">
                  مشاهده همه کاربران →
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📦</span>
                </div>
                <div className="mr-4">
                  <h3 className="text-sm font-medium text-gray-500">محصولات</h3>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalProducts}</p>
                </div>
              </div>
              <div className="mt-4">
                <Link to="/admin/products" className="text-purple-600 text-sm hover:text-purple-700">
                  مدیریت محصولات →
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🛒</span>
                </div>
                <div className="mr-4">
                  <h3 className="text-sm font-medium text-gray-500">سفارشات</h3>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
                </div>
              </div>
              <div className="mt-4">
                <Link to="/admin/orders" className="text-purple-600 text-sm hover:text-purple-700">
                  مشاهده سفارشات →
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
                <div className="mr-4">
                  <h3 className="text-sm font-medium text-gray-500">درآمد کل</h3>
                  <p className="text-xl font-bold text-gray-800">{formatPrice(stats.totalRevenue)} تومان</p>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-purple-600 text-sm">
                  از ابتدای فعالیت
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">سفارشات اخیر</h2>
                <Link to="/admin/orders" className="text-pink-600 text-sm hover:text-pink-700">
                  مشاهده همه
                </Link>
              </div>

              <div className="space-y-4">
                {stats.recentOrders.slice(0, 5).map((order) => (
                  <div key={order._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div>
                      <h4 className="font-medium text-gray-800">سفارش #{order.orderNumber || 'N/A'}</h4>
                      <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">{formatPrice(order.finalAmount)} تومان</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                        {order.orderStatus === 'pending' ? 'در انتظار' :
                          order.orderStatus === 'delivered' ? 'تحویل شده' :
                            'در حال پردازش'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">محصولات پرفروش</h2>
                <Link to="/admin/products" className="text-purple-600 text-sm hover:text-purple-700">
                  مشاهده همه
                </Link>
              </div>

              <div className="space-y-4">
                {stats.topProducts.slice(0, 5).map((product, index) => (
                  <div key={product._id || index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center">
                      <span className="w-6 h-6 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="font-medium text-gray-800">{product.name}</h4>
                        <p className="text-sm text-gray-500">شال و روسری</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">{product.sales} فروش</p>
                      <p className="text-sm text-gray-500">{formatPrice(product.price)} تومان</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">عملیات سریع</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                to="/admin/products/new"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg">➕</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">افزودن محصول</h3>
                  <p className="text-sm text-gray-500">محصول جدید</p>
                </div>
              </Link>

              <Link
                to="/admin/orders"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg">📋</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">مدیریت سفارشات</h3>
                  <p className="text-sm text-gray-500">پردازش سفارشات</p>
                </div>
              </Link>

              <Link
                to="/admin/users"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg">👥</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">مدیریت کاربران</h3>
                  <p className="text-sm text-gray-500">کاربران سایت</p>
                </div>
              </Link>

              <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg">📊</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">گزارشات</h3>
                  <p className="text-sm text-gray-500">آمار فروش</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 