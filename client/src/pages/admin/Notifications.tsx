import React, { useState } from 'react';

const Notifications: React.FC = () => {
        const [notifications] = useState([]);
        const [loading] = useState(false);

        return (
                <div className="space-y-6">
                        <div className="bg-white shadow rounded-lg p-6">
                                <div className="flex items-center justify-between mb-6">
                                        <h1 className="text-2xl font-bold text-gray-900">اطلاع‌رسانی‌ها</h1>
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                                ایجاد اطلاع‌رسانی جدید
                                        </button>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                        <div className="bg-blue-50 rounded-lg p-4">
                                                <div className="text-2xl font-bold text-blue-600">{notifications.length}</div>
                                                <div className="text-sm text-blue-800">کل اطلاع‌رسانی‌ها</div>
                                        </div>
                                        <div className="bg-green-50 rounded-lg p-4">
                                                <div className="text-2xl font-bold text-green-600">{notifications.filter(n => (n as any).status === 'sent').length}</div>
                                                <div className="text-sm text-green-800">ارسال شده</div>
                                        </div>
                                        <div className="bg-yellow-50 rounded-lg p-4">
                                                <div className="text-2xl font-bold text-yellow-600">{notifications.filter(n => (n as any).status === 'pending').length}</div>
                                                <div className="text-sm text-yellow-800">در انتظار</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="text-2xl font-bold text-gray-600">{notifications.filter(n => (n as any).status !== 'read').length}</div>
                                                <div className="text-sm text-gray-800">خوانده نشده</div>
                                        </div>
                                </div>

                                {/* Content */}
                                {loading ? (
                                        <div className="text-center py-8">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                                <p className="mt-2 text-gray-600">در حال بارگذاری...</p>
                                        </div>
                                ) : notifications.length === 0 ? (
                                        <div className="text-center py-12">
                                                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-12h5v12z" />
                                                </svg>
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">هیچ اطلاع‌رسانی‌ای یافت نشد</h3>
                                                <p className="text-gray-500 mb-4">شما می‌توانید اطلاع‌رسانی جدید ایجاد کنید.</p>
                                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                                        ایجاد اولین اطلاع‌رسانی
                                                </button>
                                        </div>
                                ) : (
                                        <div className="space-y-4">
                                                {notifications.map((notification: any, index) => (
                                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                                                <div className="flex items-start justify-between">
                                                                        <div className="flex-1">
                                                                                <h3 className="text-lg font-medium text-gray-900">{notification.title}</h3>
                                                                                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                                                                <div className="flex items-center mt-2 space-x-4 space-x-reverse">
                                                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${notification.status === 'sent' ? 'bg-green-100 text-green-800' :
                                                                                                        notification.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                                                                'bg-gray-100 text-gray-800'
                                                                                                }`}>
                                                                                                {notification.status === 'sent' ? 'ارسال شده' :
                                                                                                        notification.status === 'pending' ? 'در انتظار' : 'پیش‌نویس'}
                                                                                        </span>
                                                                                        <span className="text-xs text-gray-500">
                                                                                                {new Date(notification.createdAt).toLocaleDateString('fa-IR')}
                                                                                        </span>
                                                                                </div>
                                                                        </div>
                                                                        <div className="flex items-center space-x-2 space-x-reverse">
                                                                                <button className="p-2 text-gray-400 hover:text-gray-600">
                                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                                                        </svg>
                                                                                </button>
                                                                                <button className="p-2 text-gray-400 hover:text-red-600">
                                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                                        </svg>
                                                                                </button>
                                                                        </div>
                                                                </div>
                                                        </div>
                                                ))}
                                        </div>
                                )}
                        </div>
                </div>
        );
};

export default Notifications; 