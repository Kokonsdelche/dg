import React, { useState } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

interface Campaign {
        _id: string;
        name: string;
        status: string;
        type: string;
        channels: any;
        description?: string;
        createdAt: string;
}

const CampaignManagement: React.FC = () => {
        const [campaigns] = useState<Campaign[]>([]);
        const [loading] = useState(false);
        const [error] = useState<string | null>(null);
        const [showEditor, setShowEditor] = useState(false);
        const [filters, setFilters] = useState({
                search: '',
                type: 'all',
                status: 'all',
                channel: 'all',
                dateRange: 'all'
        });

        const campaignStats = {
                total: campaigns.length,
                active: campaigns.filter(c => c.status === 'active').length,
                paused: campaigns.filter(c => c.status === 'paused').length,
                completed: campaigns.filter(c => c.status === 'completed').length,
                draft: campaigns.filter(c => c.status === 'draft').length,
        };

        // Filter campaigns
        const filteredCampaigns = campaigns.filter(campaign => {
                const matchesSearch = !filters.search ||
                        campaign.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                        campaign.description?.toLowerCase().includes(filters.search.toLowerCase());

                const matchesType = filters.type === 'all' || campaign.type === filters.type;
                const matchesStatus = filters.status === 'all' || campaign.status === filters.status;

                return matchesSearch && matchesType && matchesStatus;
        });

        const handleCreateCampaign = () => {
                setShowEditor(true);
        };

        const updateFilter = (key: string, value: string) => {
                setFilters(prev => ({ ...prev, [key]: value }));
        };

        const resetFilters = () => {
                setFilters({
                        search: '',
                        type: 'all',
                        status: 'all',
                        channel: 'all',
                        dateRange: 'all'
                });
        };

        const activeFiltersCount = Object.entries(filters).filter(([key, value]) =>
                key !== 'search' ? value !== 'all' : value !== ''
        ).length;

        if (loading && campaigns.length === 0) {
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
                                                <h1 className="text-2xl font-bold text-gray-900">مدیریت کمپین‌ها</h1>
                                                <p className="text-sm text-gray-600 mt-1">
                                                        ایجاد و مدیریت کمپین‌های بازاریابی و اطلاع‌رسانی
                                                </p>
                                        </div>

                                        <div className="flex items-center space-x-3 space-x-reverse">
                                                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                                                        <span className="mr-2">بروزرسانی</span>
                                                </button>

                                                <button
                                                        onClick={handleCreateCampaign}
                                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                                >
                                                        <svg className="w-4 h-4 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                        </svg>
                                                        ایجاد کمپین جدید
                                                </button>
                                        </div>
                                </div>

                                {/* Stats Cards */}
                                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                                        <div className="bg-blue-50 rounded-lg p-4">
                                                <div className="text-2xl font-bold text-blue-600">{campaignStats.total}</div>
                                                <div className="text-sm text-blue-800">کل کمپین‌ها</div>
                                        </div>
                                        <div className="bg-green-50 rounded-lg p-4">
                                                <div className="text-2xl font-bold text-green-600">{campaignStats.active}</div>
                                                <div className="text-sm text-green-800">فعال</div>
                                        </div>
                                        <div className="bg-yellow-50 rounded-lg p-4">
                                                <div className="text-2xl font-bold text-yellow-600">{campaignStats.paused}</div>
                                                <div className="text-sm text-yellow-800">متوقف</div>
                                        </div>
                                        <div className="bg-purple-50 rounded-lg p-4">
                                                <div className="text-2xl font-bold text-purple-600">{campaignStats.completed}</div>
                                                <div className="text-sm text-purple-800">تکمیل شده</div>
                                        </div>
                                        <div className="bg-indigo-50 rounded-lg p-4">
                                                <div className="text-2xl font-bold text-indigo-600">{campaignStats.draft}</div>
                                                <div className="text-sm text-indigo-800">پیش‌نویس</div>
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

                                        {activeFiltersCount > 0 && (
                                                <button
                                                        onClick={resetFilters}
                                                        className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100"
                                                >
                                                        پاک کردن فیلترها
                                                </button>
                                        )}
                                </div>

                                <div className="mb-4">
                                        <div className="relative">
                                                <input
                                                        type="text"
                                                        placeholder="جستجو در نام، توضیحات یا محتوای کمپین‌ها..."
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

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">نوع</label>
                                                <select
                                                        value={filters.type}
                                                        onChange={(e) => updateFilter('type', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                        <option value="all">همه</option>
                                                        <option value="promotional">تبلیغاتی</option>
                                                        <option value="transactional">تراکنشی</option>
                                                        <option value="newsletter">خبرنامه</option>
                                                </select>
                                        </div>

                                        <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">وضعیت</label>
                                                <select
                                                        value={filters.status}
                                                        onChange={(e) => updateFilter('status', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                        <option value="all">همه</option>
                                                        <option value="draft">پیش‌نویس</option>
                                                        <option value="active">فعال</option>
                                                        <option value="paused">متوقف</option>
                                                        <option value="completed">تکمیل شده</option>
                                                </select>
                                        </div>

                                        <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">کانال</label>
                                                <select
                                                        value={filters.channel}
                                                        onChange={(e) => updateFilter('channel', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                        <option value="all">همه</option>
                                                        <option value="email">ایمیل</option>
                                                        <option value="sms">پیامک</option>
                                                        <option value="push">اعلان فوری</option>
                                                </select>
                                        </div>
                                </div>
                        </div>

                        {/* Campaigns List */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200">
                                        <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-900">
                                                        لیست کمپین‌ها ({filteredCampaigns.length})
                                                </span>
                                        </div>
                                </div>

                                <div className="divide-y divide-gray-200">
                                        {filteredCampaigns.length > 0 ? (
                                                filteredCampaigns.map((campaign) => (
                                                        <div key={campaign._id} className="p-6">
                                                                <div className="flex items-start justify-between">
                                                                        <div className="flex-1">
                                                                                <h3 className="text-lg font-medium text-gray-900">{campaign.name}</h3>
                                                                                <p className="text-sm text-gray-500 mt-1">{campaign.description}</p>
                                                                                <div className="flex items-center mt-2 space-x-4 space-x-reverse">
                                                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                                                                                                        campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                                                                                                                campaign.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                                                                                                                        'bg-gray-100 text-gray-800'
                                                                                                }`}>
                                                                                                {campaign.status === 'active' ? 'فعال' :
                                                                                                        campaign.status === 'paused' ? 'متوقف' :
                                                                                                                campaign.status === 'completed' ? 'تکمیل شده' : 'پیش‌نویس'}
                                                                                        </span>
                                                                                        <span className="text-xs text-gray-500">
                                                                                                {new Date(campaign.createdAt).toLocaleDateString('fa-IR')}
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
                                                ))
                                        ) : (
                                                <div className="p-12 text-center">
                                                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                        </svg>
                                                        <h3 className="text-lg font-medium text-gray-900 mb-2">کمپینی یافت نشد</h3>
                                                        <p className="text-gray-500 mb-4">
                                                                {activeFiltersCount > 0
                                                                        ? 'با فیلترهای اعمال شده کمپینی یافت نشد. لطفاً فیلترها را تغییر دهید.'
                                                                        : 'هنوز کمپینی در سیستم ثبت نشده است.'
                                                                }
                                                        </p>
                                                        {activeFiltersCount > 0 ? (
                                                                <button
                                                                        onClick={resetFilters}
                                                                        className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                                                                >
                                                                        پاک کردن فیلترها
                                                                </button>
                                                        ) : (
                                                                <button
                                                                        onClick={handleCreateCampaign}
                                                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                                                >
                                                                        ایجاد اولین کمپین
                                                                </button>
                                                        )}
                                                </div>
                                        )}
                                </div>
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

                        {/* Campaign Editor Modal Placeholder */}
                        {showEditor && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                                        <div className="bg-white rounded-lg p-6 max-w-md w-full">
                                                <h3 className="text-lg font-medium mb-4">ایجاد کمپین جدید</h3>
                                                <p className="text-gray-600 mb-4">این بخش در حال توسعه است.</p>
                                                <button
                                                        onClick={() => setShowEditor(false)}
                                                        className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                                >
                                                        بستن
                                                </button>
                                        </div>
                                </div>
                        )}
                </div>
        );
};

export default CampaignManagement; 