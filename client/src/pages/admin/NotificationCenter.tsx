import React from 'react';

const NotificationCenter: React.FC = () => {
        return (
                <div className="space-y-6">
                        <div className="bg-white shadow rounded-lg p-6">
                                <h1 className="text-2xl font-bold text-gray-900 mb-4">مرکز اطلاع‌رسانی</h1>
                                <p className="text-gray-600">
                                        این بخش در حال توسعه است. شما می‌توانید از طریق این صفحه اطلاع‌رسانی‌ها را مدیریت کنید.
                                </p>

                                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-blue-50 p-6 rounded-lg">
                                                <h3 className="text-lg font-medium text-blue-900 mb-2">کمپین‌ها</h3>
                                                <p className="text-blue-700">مدیریت کمپین‌های بازاریابی</p>
                                        </div>

                                        <div className="bg-green-50 p-6 rounded-lg">
                                                <h3 className="text-lg font-medium text-green-900 mb-2">قالب‌ها</h3>
                                                <p className="text-green-700">ایجاد و ویرایش قالب‌های اطلاع‌رسانی</p>
                                        </div>

                                        <div className="bg-purple-50 p-6 rounded-lg">
                                                <h3 className="text-lg font-medium text-purple-900 mb-2">گزارشات</h3>
                                                <p className="text-purple-700">مشاهده آمار و گزارشات</p>
                                        </div>
                                </div>
                        </div>
                </div>
        );
};

export default NotificationCenter; 