import React, { useState, useMemo } from 'react';
import { useAdminNotifications } from '../../hooks/useAdminNotifications';
import NotificationCard from './NotificationCard';
import LoadingSpinner from '../common/LoadingSpinner';

const NotificationCenter: React.FC = () => {
        const {
                notifications,
                loading,
                error,
                filters,
                stats,
                unreadCount,
                totalPages,
                changeFilters,
                resetFilters,
                markAsRead,
                markAllAsRead,
                performBulkOperation,
                deleteNotification,
                refreshData,
        } = useAdminNotifications();

        const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
        const [showFilters, setShowFilters] = useState(false);

        // Handle select all notifications
        const handleSelectAll = (checked: boolean) => {
                if (checked) {
                        setSelectedNotifications(notifications.map(n => n._id));
                } else {
                        setSelectedNotifications([]);
                }
        };

        // Handle individual notification selection
        const handleSelectNotification = (notificationId: string, selected: boolean) => {
                if (selected) {
                        setSelectedNotifications(prev => [...prev, notificationId]);
                } else {
                        setSelectedNotifications(prev => prev.filter(id => id !== notificationId));
                }
        };

        // Handle bulk operations
        const handleBulkOperation = async (action: string) => {
                if (selectedNotifications.length === 0) return;

                try {
                        await performBulkOperation({
                                action: action as any,
                                notificationIds: selectedNotifications,
                        });
                        setSelectedNotifications([]);
                } catch (error) {
                        console.error('خطا در انجام عملیات دسته‌ای:', error);
                }
        };

        // Update filter
        const updateFilter = (key: string, value: any) => {
                changeFilters({ [key]: value, page: 1 });
        };

        // Reset all filters
        const handleResetFilters = () => {
                resetFilters();
                setSelectedNotifications([]);
        };

        // Get filter count
        const activeFiltersCount = useMemo(() => {
                let count = 0;
                if (filters.status !== 'all') count++;
                if (filters.type !== 'all') count++;
                if (filters.priority !== 'all') count++;
                if (filters.channel !== 'all') count++;
                if (filters.recipient !== 'all') count++;
                if (filters.search) count++;
                if (filters.dateRange) count++;
                if (filters.tags && filters.tags.length > 0) count++;
                return count;
        }, [filters]);

        if (loading && notifications.length === 0) {
                return (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                                <LoadingSpinner />
                        </div>
                );
        }

        return (
                <div className="space-y-6">
                        {/* Header */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                        <div>
                                                <h1 className="text-2xl font-bold text-gray-900">مرکز اطلاع‌رسانی</h1>
                                                <p className="text-sm text-gray-600 mt-1">
                                                        مدیریت و نمایش همه اطلاع‌رسانی‌های سیستم
                                                </p>
                                        </div>

                                        <div className="flex items-center space-x-3 space-x-reverse">
                                                {/* Refresh Button */}
                                                <button
                                                        onClick={refreshData}
                                                        disabled={loading}
                                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                                >
                                                        {loading ? (
                                                                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                                </svg>
                                                        ) : (
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                                </svg>
                                                        )}
                                                        <span className="mr-2">بروزرسانی</span>
                                                </button>

                                                {/* Mark All Read Button */}
                                                {unreadCount > 0 && (
                                                        <button
                                                                onClick={markAllAsRead}
                                                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        >
                                                                علامت‌گذاری همه ({unreadCount})
                                                        </button>
                                                )}
                                        </div>
                                </div>

                                {/* Stats Cards */}
                                <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                                        <div className="bg-blue-50 rounded-lg p-4">
                                                <div className="text-2xl font-bold text-blue-600">{stats?.overview?.totalSent || 0}</div>
                                                <div className="text-sm text-blue-800">کل اطلاع‌رسانی‌ها</div>
                                        </div>
                                        <div className="bg-yellow-50 rounded-lg p-4">
                                                <div className="text-2xl font-bold text-yellow-600">{notifications.filter(n => n.status === 'pending').length}</div>
                                                <div className="text-sm text-yellow-800">در انتظار</div>
                                        </div>
                                        <div className="bg-green-50 rounded-lg p-4">
                                                <div className="text-2xl font-bold text-green-600">{stats?.overview?.totalDelivered || 0}</div>
                                                <div className="text-sm text-green-800">تحویل شده</div>
                                        </div>
                                        <div className="bg-purple-50 rounded-lg p-4">
                                                <div className="text-2xl font-bold text-purple-600">{stats?.overview?.totalRead || 0}</div>
                                                <div className="text-sm text-purple-800">خوانده شده</div>
                                        </div>
                                        <div className="bg-red-50 rounded-lg p-4">
                                                <div className="text-2xl font-bold text-red-600">{stats?.overview?.totalFailed || 0}</div>
                                                <div className="text-sm text-red-800">ناموفق</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="text-2xl font-bold text-gray-600">{notifications.filter(n => n.status !== 'read').length}</div>
                                                <div className="text-sm text-gray-800">خوانده نشده</div>
                                        </div>
                                </div>
                        </div>

                        {/* Filters and Search */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-4 space-x-reverse">
                                                <h2 className="text-lg font-semibold text-gray-900">فیلترها و جستجو</h2>
                                                {activeFiltersCount > 0 && (
                                                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                                {activeFiltersCount} فیلتر فعال
                                                        </span>
                                                )}
                                        </div>

                                        <div className="flex items-center space-x-2 space-x-reverse">
                                                <button
                                                        onClick={() => setShowFilters(!showFilters)}
                                                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                                >
                                                        {showFilters ? 'مخفی کردن فیلترها' : 'نمایش فیلترها'}
                                                </button>

                                                {activeFiltersCount > 0 && (
                                                        <button
                                                                onClick={handleResetFilters}
                                                                className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100"
                                                        >
                                                                پاک کردن فیلترها
                                                        </button>
                                                )}
                                        </div>
                                </div>

                                {/* Search Bar */}
                                <div className="mb-4">
                                        <div className="relative">
                                                <input
                                                        type="text"
                                                        placeholder="جستجو در عنوان، پیام یا برچسب‌ها..."
                                                        value={filters.search}
                                                        onChange={(e) => updateFilter('search', e.target.value)}
                                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                        </svg>
                                                </div>
                                        </div>
                                </div>

                                {/* Advanced Filters */}
                                {showFilters && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                                {/* Status Filter */}
                                                <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">وضعیت</label>
                                                        <select
                                                                value={filters.status}
                                                                onChange={(e) => updateFilter('status', e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        >
                                                                <option value="all">همه</option>
                                                                <option value="pending">در انتظار</option>
                                                                <option value="sent">ارسال شده</option>
                                                                <option value="delivered">تحویل شده</option>
                                                                <option value="read">خوانده شده</option>
                                                                <option value="failed">ناموفق</option>
                                                        </select>
                                                </div>

                                                {/* Type Filter */}
                                                <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">نوع</label>
                                                        <select
                                                                value={filters.type}
                                                                onChange={(e) => updateFilter('type', e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        >
                                                                <option value="all">همه</option>
                                                                <option value="info">اطلاعات</option>
                                                                <option value="success">موفقیت</option>
                                                                <option value="warning">هشدار</option>
                                                                <option value="error">خطا</option>
                                                                <option value="order">سفارش</option>
                                                                <option value="user">کاربر</option>
                                                                <option value="product">محصول</option>
                                                                <option value="system">سیستم</option>
                                                                <option value="security">امنیت</option>
                                                        </select>
                                                </div>

                                                {/* Priority Filter */}
                                                <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">اولویت</label>
                                                        <select
                                                                value={filters.priority}
                                                                onChange={(e) => updateFilter('priority', e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        >
                                                                <option value="all">همه</option>
                                                                <option value="low">کم</option>
                                                                <option value="medium">متوسط</option>
                                                                <option value="high">بالا</option>
                                                                <option value="urgent">فوری</option>
                                                        </select>
                                                </div>

                                                {/* Channel Filter */}
                                                <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">کانال</label>
                                                        <select
                                                                value={filters.channel}
                                                                onChange={(e) => updateFilter('channel', e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        >
                                                                <option value="all">همه</option>
                                                                <option value="inApp">اپلیکیشن</option>
                                                                <option value="email">ایمیل</option>
                                                                <option value="sms">پیامک</option>
                                                                <option value="push">فوری</option>
                                                                <option value="webhook">وب‌هوک</option>
                                                        </select>
                                                </div>

                                                {/* Recipient Filter */}
                                                <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">گیرنده</label>
                                                        <select
                                                                value={filters.recipient}
                                                                onChange={(e) => updateFilter('recipient', e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        >
                                                                <option value="all">همه</option>
                                                                <option value="user">کاربر</option>
                                                                <option value="admin">مدیر</option>
                                                                <option value="role">نقش</option>
                                                        </select>
                                                </div>
                                        </div>
                                )}
                        </div>

                        {/* Bulk Actions */}
                        {selectedNotifications.length > 0 && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3 space-x-reverse">
                                                        <span className="text-sm font-medium text-blue-900">
                                                                {selectedNotifications.length} اطلاع‌رسانی انتخاب شده
                                                        </span>
                                                </div>

                                                <div className="flex items-center space-x-2 space-x-reverse">
                                                        <button
                                                                onClick={() => handleBulkOperation('mark_read')}
                                                                className="px-3 py-1 text-sm font-medium text-blue-700 bg-white border border-blue-300 rounded hover:bg-blue-50"
                                                        >
                                                                علامت‌گذاری به عنوان خوانده شده
                                                        </button>
                                                        <button
                                                                onClick={() => handleBulkOperation('mark_unread')}
                                                                className="px-3 py-1 text-sm font-medium text-blue-700 bg-white border border-blue-300 rounded hover:bg-blue-50"
                                                        >
                                                                علامت‌گذاری به عنوان خوانده نشده
                                                        </button>
                                                        <button
                                                                onClick={() => handleBulkOperation('delete')}
                                                                className="px-3 py-1 text-sm font-medium text-red-700 bg-white border border-red-300 rounded hover:bg-red-50"
                                                        >
                                                                حذف
                                                        </button>
                                                        <button
                                                                onClick={() => setSelectedNotifications([])}
                                                                className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
                                                        >
                                                                لغو انتخاب
                                                        </button>
                                                </div>
                                        </div>
                                </div>
                        )}

                        {/* Notifications List */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                {/* List Header */}
                                <div className="px-6 py-4 border-b border-gray-200">
                                        <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3 space-x-reverse">
                                                        <input
                                                                type="checkbox"
                                                                checked={selectedNotifications.length === notifications.length && notifications.length > 0}
                                                                onChange={(e) => handleSelectAll(e.target.checked)}
                                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                                        />
                                                        <span className="text-sm font-medium text-gray-900">
                                                                انتخاب همه ({notifications.length})
                                                        </span>
                                                </div>

                                                <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
                                                        <span>صفحه {filters.page} از {totalPages}</span>
                                                        <div className="flex items-center space-x-2 space-x-reverse">
                                                                <button
                                                                        onClick={() => updateFilter('page', Math.max(1, filters.page - 1))}
                                                                        disabled={filters.page <= 1}
                                                                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                                        </svg>
                                                                </button>
                                                                <button
                                                                        onClick={() => updateFilter('page', Math.min(totalPages, filters.page + 1))}
                                                                        disabled={filters.page >= totalPages}
                                                                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                        </svg>
                                                                </button>
                                                        </div>
                                                </div>
                                        </div>
                                </div>

                                {/* Notifications */}
                                <div className="divide-y divide-gray-200">
                                        {notifications.length > 0 ? (
                                                notifications.map((notification) => (
                                                        <div key={notification._id} className="p-6">
                                                                <NotificationCard
                                                                        notification={notification}
                                                                        selected={selectedNotifications.includes(notification._id)}
                                                                        onSelect={(selected) => handleSelectNotification(notification._id, selected)}
                                                                        onMarkAsRead={() => markAsRead(notification._id)}
                                                                        onDelete={() => deleteNotification(notification._id)}
                                                                        showBulkSelect={true}
                                                                        showActions={true}
                                                                />
                                                        </div>
                                                ))
                                        ) : (
                                                <div className="p-12 text-center">
                                                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM12 3c.483 0 .966.097 1.426.291a9.981 9.981 0 016.274 9.209c0 .688.024 1.373.072 2.055.096 1.365.146 2.733.146 4.099 0 .346-.14.678-.388.925-.247.248-.58.388-.925.388H6.424a1.31 1.31 0 01-.925-.388A1.31 1.31 0 015.11 19.191c0-1.366.05-2.734.146-4.1.048-.681.072-1.366.072-2.054A9.981 9.981 0 0112 3z" />
                                                        </svg>
                                                        <h3 className="text-lg font-medium text-gray-900 mb-2">اطلاع‌رسانی‌ای یافت نشد</h3>
                                                        <p className="text-gray-500">
                                                                {activeFiltersCount > 0
                                                                        ? 'با فیلترهای اعمال شده اطلاع‌رسانی‌ای یافت نشد. لطفاً فیلترها را تغییر دهید.'
                                                                        : 'هنوز اطلاع‌رسانی‌ای در سیستم ثبت نشده است.'
                                                                }
                                                        </p>
                                                        {activeFiltersCount > 0 && (
                                                                <button
                                                                        onClick={handleResetFilters}
                                                                        className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                                                                >
                                                                        پاک کردن فیلترها
                                                                </button>
                                                        )}
                                                </div>
                                        )}
                                </div>

                                {/* Pagination Footer */}
                                {notifications.length > 0 && totalPages > 1 && (
                                        <div className="px-6 py-4 border-t border-gray-200">
                                                <div className="flex items-center justify-between">
                                                        <div className="text-sm text-gray-700">
                                                                نمایش {((filters.page - 1) * filters.limit) + 1} تا {Math.min(filters.page * filters.limit, stats?.total || 0)} از {stats?.total || 0} اطلاع‌رسانی
                                                        </div>

                                                        <div className="flex items-center space-x-2 space-x-reverse">
                                                                <button
                                                                        onClick={() => updateFilter('page', 1)}
                                                                        disabled={filters.page <= 1}
                                                                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                        اول
                                                                </button>
                                                                <button
                                                                        onClick={() => updateFilter('page', filters.page - 1)}
                                                                        disabled={filters.page <= 1}
                                                                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                        قبلی
                                                                </button>
                                                                <span className="px-3 py-2 text-sm text-gray-700">
                                                                        صفحه {filters.page} از {totalPages}
                                                                </span>
                                                                <button
                                                                        onClick={() => updateFilter('page', filters.page + 1)}
                                                                        disabled={filters.page >= totalPages}
                                                                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                        بعدی
                                                                </button>
                                                                <button
                                                                        onClick={() => updateFilter('page', totalPages)}
                                                                        disabled={filters.page >= totalPages}
                                                                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                        آخر
                                                                </button>
                                                        </div>
                                                </div>
                                        </div>
                                )}
                        </div>

                        {/* Error Message */}
                        {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <div className="flex items-center">
                                                <svg className="w-5 h-5 text-red-400 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                </svg>
                                                <p className="text-sm text-red-800">{error}</p>
                                        </div>
                                </div>
                        )}
                </div>
        );
};

export default NotificationCenter; 