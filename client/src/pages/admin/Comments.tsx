import React, { useState } from 'react';

const Comments: React.FC = () => {
        const [comments] = useState([]);
        const [loading] = useState(false);

        return (
                <div className="space-y-6">
                        <div className="bg-white shadow rounded-lg p-6">
                                <div className="flex items-center justify-between mb-6">
                                        <h1 className="text-2xl font-bold text-gray-900">مدیریت نظرات</h1>
                                        <div className="flex space-x-2 space-x-reverse">
                                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                                        بروزرسانی
                                                </button>
                                        </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                        <div className="bg-blue-50 rounded-lg p-4">
                                                <div className="text-2xl font-bold text-blue-600">{comments.length}</div>
                                                <div className="text-sm text-blue-800">کل نظرات</div>
                                        </div>
                                        <div className="bg-yellow-50 rounded-lg p-4">
                                                <div className="text-2xl font-bold text-yellow-600">{comments.filter(c => (c as any).status === 'pending').length}</div>
                                                <div className="text-sm text-yellow-800">در انتظار تایید</div>
                                        </div>
                                        <div className="bg-green-50 rounded-lg p-4">
                                                <div className="text-2xl font-bold text-green-600">{comments.filter(c => (c as any).status === 'approved').length}</div>
                                                <div className="text-sm text-green-800">تایید شده</div>
                                        </div>
                                        <div className="bg-red-50 rounded-lg p-4">
                                                <div className="text-2xl font-bold text-red-600">{comments.filter(c => (c as any).status === 'rejected').length}</div>
                                                <div className="text-sm text-red-800">رد شده</div>
                                        </div>
                                </div>

                                {/* Search and Filters */}
                                <div className="mb-6">
                                        <div className="flex flex-col md:flex-row gap-4">
                                                <div className="flex-1">
                                                        <input
                                                                type="text"
                                                                placeholder="جستجو در نظرات..."
                                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                </div>
                                                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                                        <option value="all">همه وضعیت‌ها</option>
                                                        <option value="pending">در انتظار تایید</option>
                                                        <option value="approved">تایید شده</option>
                                                        <option value="rejected">رد شده</option>
                                                </select>
                                        </div>
                                </div>

                                {/* Content */}
                                {loading ? (
                                        <div className="text-center py-8">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                                <p className="mt-2 text-gray-600">در حال بارگذاری...</p>
                                        </div>
                                ) : comments.length === 0 ? (
                                        <div className="text-center py-12">
                                                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">هیچ نظری یافت نشد</h3>
                                                <p className="text-gray-500">هنوز نظری برای محصولات ثبت نشده است.</p>
                                        </div>
                                ) : (
                                        <div className="space-y-4">
                                                {comments.map((comment: any, index) => (
                                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                                                <div className="flex items-start justify-between">
                                                                        <div className="flex-1">
                                                                                <div className="flex items-center space-x-2 space-x-reverse mb-2">
                                                                                        <h4 className="font-medium text-gray-900">{comment.user?.name || 'کاربر ناشناس'}</h4>
                                                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${comment.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                                                                        comment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                                                                'bg-red-100 text-red-800'
                                                                                                }`}>
                                                                                                {comment.status === 'approved' ? 'تایید شده' :
                                                                                                        comment.status === 'pending' ? 'در انتظار' : 'رد شده'}
                                                                                        </span>
                                                                                </div>
                                                                                <p className="text-gray-700 mb-2">{comment.content}</p>
                                                                                <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
                                                                                        <span>محصول: {comment.product?.name || 'نامشخص'}</span>
                                                                                        <span>{new Date(comment.createdAt).toLocaleDateString('fa-IR')}</span>
                                                                                </div>
                                                                        </div>
                                                                        <div className="flex items-center space-x-2 space-x-reverse">
                                                                                <button className="p-2 text-green-600 hover:text-green-800">
                                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                                        </svg>
                                                                                </button>
                                                                                <button className="p-2 text-red-600 hover:text-red-800">
                                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                                        </svg>
                                                                                </button>
                                                                                <button className="p-2 text-gray-400 hover:text-gray-600">
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

export default Comments; 