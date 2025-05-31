import React, { useState } from 'react';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import DateRangePicker from '../../components/admin/DateRangePicker';
import { SalesChart, ProductAnalyticsChart, RevenueGrowthChart } from '../../components/admin/Chart';
import { useAdminReports } from '../../hooks/useAdminReports';
import toast from 'react-hot-toast';

const AdminReports: React.FC = () => {
        const {
                data,
                loading,
                error,
                filters,
                statistics,
                chartData,
                changeDateRange,
                changePeriod,
                refreshData,
                exportToCSV,
                exportToPDF,
                hasData,
                isEmpty,
                isInitialLoad
        } = useAdminReports();

        const [activeTab, setActiveTab] = useState<'overview' | 'sales' | 'products' | 'customers'>('overview');

        // Format numbers with Persian locale
        const formatNumber = (num: number) => {
                return new Intl.NumberFormat('fa-IR').format(num);
        };

        // Format currency
        const formatCurrency = (amount: number) => {
                return `${formatNumber(amount)} تومان`;
        };

        // Format percentage
        const formatPercentage = (percent: number) => {
                return `${formatNumber(Math.round(percent * 100) / 100)}%`;
        };

        if (isInitialLoad) {
                return (
                        <div className="flex items-center justify-center min-h-screen">
                                <LoadingSpinner size="large" />
                        </div>
                );
        }

        if (error) {
                return (
                        <div className="p-6">
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <div className="flex items-center">
                                                <svg className="w-5 h-5 text-red-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-red-700">{error}</span>
                                        </div>
                                        <button
                                                onClick={refreshData}
                                                className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                        >
                                                تلاش مجدد
                                        </button>
                                </div>
                        </div>
                );
        }

        return (
                <ErrorBoundary>
                        <div className="p-6 space-y-6">
                                {/* Header */}
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        <div>
                                                <h1 className="text-2xl font-bold text-gray-900">📊 گزارشات و تحلیل‌ها</h1>
                                                <p className="text-gray-600 mt-1">آمار کامل فروش و عملکرد فروشگاه</p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-wrap items-center gap-3">
                                                <button
                                                        onClick={refreshData}
                                                        disabled={loading}
                                                        className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                        <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                        </svg>
                                                        بروزرسانی
                                                </button>

                                                <button
                                                        onClick={exportToCSV}
                                                        disabled={loading || isEmpty}
                                                        className="flex items-center gap-2 px-4 py-2 text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        دانلود CSV
                                                </button>

                                                <button
                                                        onClick={exportToPDF}
                                                        disabled={loading || isEmpty}
                                                        className="flex items-center gap-2 px-4 py-2 text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                        </svg>
                                                        دانلود PDF
                                                </button>
                                        </div>
                                </div>

                                {/* Filters */}
                                <div className="bg-white rounded-lg shadow-md p-6">
                                        <div className="flex flex-col lg:flex-row gap-4">
                                                {/* Date Range Picker */}
                                                <div className="flex-1">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                بازه زمانی
                                                        </label>
                                                        <DateRangePicker
                                                                startDate={filters.dateRange.startDate}
                                                                endDate={filters.dateRange.endDate}
                                                                onChange={changeDateRange}
                                                                disabled={loading}
                                                        />
                                                </div>

                                                {/* Period Selector */}
                                                <div className="lg:w-48">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                دوره زمانی
                                                        </label>
                                                        <select
                                                                value={filters.period}
                                                                onChange={(e) => changePeriod(e.target.value as any)}
                                                                disabled={loading}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                                <option value="daily">روزانه</option>
                                                                <option value="weekly">هفتگی</option>
                                                                <option value="monthly">ماهانه</option>
                                                                <option value="yearly">سالانه</option>
                                                        </select>
                                                </div>
                                        </div>
                                </div>

                                {loading && (
                                        <div className="bg-white rounded-lg shadow-md p-12">
                                                <LoadingSpinner size="large" />
                                        </div>
                                )}

                                {!loading && isEmpty && (
                                        <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                                                </svg>
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">داده‌ای یافت نشد</h3>
                                                <p className="text-gray-600">در بازه زمانی انتخابی هیچ داده‌ای موجود نیست.</p>
                                        </div>
                                )}

                                {!loading && hasData && statistics && (
                                        <>
                                                {/* Statistics Cards */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                        {/* Total Revenue */}
                                                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                                                                <div className="flex items-center justify-between">
                                                                        <div>
                                                                                <h3 className="text-sm font-medium opacity-90">کل درآمد</h3>
                                                                                <p className="text-2xl font-bold mt-1">{formatCurrency(statistics.totals.revenue)}</p>
                                                                                <div className="flex items-center mt-2">
                                                                                        <span className={`text-xs ${statistics.growth.isPositive ? 'text-green-200' : 'text-red-200'}`}>
                                                                                                {statistics.growth.isPositive ? '↗' : '↘'} {formatPercentage(Math.abs(statistics.growth.revenue))}
                                                                                        </span>
                                                                                </div>
                                                                        </div>
                                                                        <div className="text-4xl opacity-80">💰</div>
                                                                </div>
                                                        </div>

                                                        {/* Total Orders */}
                                                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                                                                <div className="flex items-center justify-between">
                                                                        <div>
                                                                                <h3 className="text-sm font-medium opacity-90">کل سفارشات</h3>
                                                                                <p className="text-2xl font-bold mt-1">{formatNumber(statistics.totals.orders)}</p>
                                                                                <div className="flex items-center mt-2">
                                                                                        <span className="text-xs text-green-200">
                                                                                                میانگین: {formatNumber(Math.round(statistics.averages.dailyOrders))}
                                                                                        </span>
                                                                                </div>
                                                                        </div>
                                                                        <div className="text-4xl opacity-80">📦</div>
                                                                </div>
                                                        </div>

                                                        {/* Total Customers */}
                                                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                                                                <div className="flex items-center justify-between">
                                                                        <div>
                                                                                <h3 className="text-sm font-medium opacity-90">کل مشتریان</h3>
                                                                                <p className="text-2xl font-bold mt-1">{formatNumber(statistics.customers.total)}</p>
                                                                                <div className="flex items-center mt-2">
                                                                                        <span className="text-xs text-blue-200">
                                                                                                جدید: {formatNumber(statistics.customers.new)}
                                                                                        </span>
                                                                                </div>
                                                                        </div>
                                                                        <div className="text-4xl opacity-80">👥</div>
                                                                </div>
                                                        </div>

                                                        {/* Average Order Value */}
                                                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                                                                <div className="flex items-center justify-between">
                                                                        <div>
                                                                                <h3 className="text-sm font-medium opacity-90">میانگین ارزش سفارش</h3>
                                                                                <p className="text-2xl font-bold mt-1">{formatCurrency(statistics.averages.orderValue)}</p>
                                                                                <div className="flex items-center mt-2">
                                                                                        <span className="text-xs text-orange-200">
                                                                                                CLV: {formatCurrency(statistics.averages.customerLifetimeValue)}
                                                                                        </span>
                                                                                </div>
                                                                        </div>
                                                                        <div className="text-4xl opacity-80">📊</div>
                                                                </div>
                                                        </div>
                                                </div>

                                                {/* Tabs */}
                                                <div className="bg-white rounded-lg shadow-md">
                                                        <div className="border-b border-gray-200">
                                                                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                                                                        {[
                                                                                { id: 'overview', name: 'کلی', icon: '📋' },
                                                                                { id: 'sales', name: 'فروش', icon: '📈' },
                                                                                { id: 'products', name: 'محصولات', icon: '📦' },
                                                                                { id: 'customers', name: 'مشتریان', icon: '👥' },
                                                                        ].map((tab) => (
                                                                                <button
                                                                                        key={tab.id}
                                                                                        onClick={() => setActiveTab(tab.id as any)}
                                                                                        className={`${activeTab === tab.id
                                                                                                        ? 'border-purple-500 text-purple-600'
                                                                                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                                                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                                                                                >
                                                                                        <span>{tab.icon}</span>
                                                                                        {tab.name}
                                                                                </button>
                                                                        ))}
                                                                </nav>
                                                        </div>

                                                        <div className="p-6">
                                                                {/* Overview Tab */}
                                                                {activeTab === 'overview' && chartData && (
                                                                        <div className="space-y-6">
                                                                                {/* Sales Chart */}
                                                                                <SalesChart
                                                                                        data={chartData.sales}
                                                                                        period={filters.period}
                                                                                        className="col-span-full"
                                                                                />

                                                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                                                        {/* Products Chart */}
                                                                                        <ProductAnalyticsChart
                                                                                                data={chartData.products}
                                                                                        />

                                                                                        {/* Revenue Growth Chart */}
                                                                                        <RevenueGrowthChart
                                                                                                data={chartData.revenueComparison}
                                                                                        />
                                                                                </div>
                                                                        </div>
                                                                )}

                                                                {/* Sales Tab */}
                                                                {activeTab === 'sales' && chartData && (
                                                                        <div className="space-y-6">
                                                                                <SalesChart
                                                                                        data={chartData.sales}
                                                                                        period={filters.period}
                                                                                        className="col-span-full"
                                                                                />

                                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                                                        <div className="bg-gray-50 rounded-lg p-4">
                                                                                                <h4 className="font-medium text-gray-900 mb-2">مجموع فروش</h4>
                                                                                                <p className="text-2xl font-bold text-purple-600">{formatCurrency(statistics.totals.revenue)}</p>
                                                                                        </div>
                                                                                        <div className="bg-gray-50 rounded-lg p-4">
                                                                                                <h4 className="font-medium text-gray-900 mb-2">میانگین روزانه</h4>
                                                                                                <p className="text-2xl font-bold text-green-600">{formatCurrency(statistics.averages.dailyRevenue)}</p>
                                                                                        </div>
                                                                                        <div className="bg-gray-50 rounded-lg p-4">
                                                                                                <h4 className="font-medium text-gray-900 mb-2">رشد درآمد</h4>
                                                                                                <p className={`text-2xl font-bold ${statistics.growth.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                                                                                        {statistics.growth.isPositive ? '+' : ''}{formatPercentage(statistics.growth.revenue)}
                                                                                                </p>
                                                                                        </div>
                                                                                </div>
                                                                        </div>
                                                                )}

                                                                {/* Products Tab */}
                                                                {activeTab === 'products' && chartData && (
                                                                        <div className="space-y-6">
                                                                                <ProductAnalyticsChart
                                                                                        data={chartData.products}
                                                                                        className="mb-6"
                                                                                />

                                                                                {/* Top Products Table */}
                                                                                <div className="bg-gray-50 rounded-lg p-4">
                                                                                        <h3 className="font-medium text-gray-900 mb-4">محصولات پرفروش</h3>
                                                                                        <div className="overflow-x-auto">
                                                                                                <table className="min-w-full">
                                                                                                        <thead>
                                                                                                                <tr className="border-b border-gray-200">
                                                                                                                        <th className="text-right py-2">محصول</th>
                                                                                                                        <th className="text-right py-2">تعداد فروش</th>
                                                                                                                        <th className="text-right py-2">درآمد</th>
                                                                                                                </tr>
                                                                                                        </thead>
                                                                                                        <tbody>
                                                                                                                {chartData.products.slice(0, 5).map((product, index) => (
                                                                                                                        <tr key={index} className="border-b border-gray-100">
                                                                                                                                <td className="py-2">{product.name}</td>
                                                                                                                                <td className="py-2">{formatNumber(product.totalSold)}</td>
                                                                                                                                <td className="py-2">{formatCurrency(product.revenue)}</td>
                                                                                                                        </tr>
                                                                                                                ))}
                                                                                                        </tbody>
                                                                                                </table>
                                                                                        </div>
                                                                                </div>
                                                                        </div>
                                                                )}

                                                                {/* Customers Tab */}
                                                                {activeTab === 'customers' && (
                                                                        <div className="space-y-6">
                                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                                                        <div className="bg-blue-50 rounded-lg p-4">
                                                                                                <h4 className="font-medium text-gray-900 mb-2">کل مشتریان</h4>
                                                                                                <p className="text-2xl font-bold text-blue-600">{formatNumber(statistics.customers.total)}</p>
                                                                                        </div>
                                                                                        <div className="bg-green-50 rounded-lg p-4">
                                                                                                <h4 className="font-medium text-gray-900 mb-2">مشتریان جدید</h4>
                                                                                                <p className="text-2xl font-bold text-green-600">{formatNumber(statistics.customers.new)}</p>
                                                                                                <p className="text-sm text-gray-600">{formatPercentage(statistics.customers.newPercentage)} از کل</p>
                                                                                        </div>
                                                                                        <div className="bg-purple-50 rounded-lg p-4">
                                                                                                <h4 className="font-medium text-gray-900 mb-2">مشتریان بازگشتی</h4>
                                                                                                <p className="text-2xl font-bold text-purple-600">{formatNumber(statistics.customers.returning)}</p>
                                                                                                <p className="text-sm text-gray-600">{formatPercentage(statistics.customers.returningPercentage)} از کل</p>
                                                                                        </div>
                                                                                        <div className="bg-orange-50 rounded-lg p-4">
                                                                                                <h4 className="font-medium text-gray-900 mb-2">ارزش دوره زندگی</h4>
                                                                                                <p className="text-2xl font-bold text-orange-600">{formatCurrency(statistics.averages.customerLifetimeValue)}</p>
                                                                                        </div>
                                                                                </div>

                                                                                {/* Customer Insights */}
                                                                                <div className="bg-gray-50 rounded-lg p-6">
                                                                                        <h3 className="font-medium text-gray-900 mb-4">تحلیل مشتریان</h3>
                                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                                                <div>
                                                                                                        <h4 className="text-sm font-medium text-gray-700 mb-2">نرخ بازگشت مشتریان</h4>
                                                                                                        <div className="bg-white rounded p-3">
                                                                                                                <div className="flex justify-between items-center">
                                                                                                                        <span>بازگشتی</span>
                                                                                                                        <span className="font-medium">{formatPercentage(statistics.customers.returningPercentage)}</span>
                                                                                                                </div>
                                                                                                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                                                                                                        <div
                                                                                                                                className="bg-purple-600 h-2 rounded-full"
                                                                                                                                style={{ width: `${statistics.customers.returningPercentage}%` }}
                                                                                                                        ></div>
                                                                                                                </div>
                                                                                                        </div>
                                                                                                </div>
                                                                                                <div>
                                                                                                        <h4 className="text-sm font-medium text-gray-700 mb-2">میانگین ارزش سفارش</h4>
                                                                                                        <div className="bg-white rounded p-3">
                                                                                                                <p className="text-lg font-semibold text-green-600">
                                                                                                                        {formatCurrency(statistics.averages.orderValue)}
                                                                                                                </p>
                                                                                                                <p className="text-sm text-gray-600">به ازای هر سفارش</p>
                                                                                                        </div>
                                                                                                </div>
                                                                                        </div>
                                                                                </div>
                                                                        </div>
                                                                )}
                                                        </div>
                                                </div>
                                        </>
                                )}
                        </div>
                </ErrorBoundary>
        );
};

export default AdminReports; 