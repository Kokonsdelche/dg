import React, { useState } from 'react';
import { NotificationCampaign } from '../../store/adminStore';
import { formatDistanceToNow, format } from 'date-fns';
import { faIR } from 'date-fns/locale';

interface CampaignCardProps {
        campaign: NotificationCampaign;
        selected?: boolean;
        onSelect?: (selected: boolean) => void;
        onEdit?: () => void;
        onDelete?: () => void;
        onDuplicate?: () => void;
        onView?: () => void;
        onPause?: () => void;
        onResume?: () => void;
        showBulkSelect?: boolean;
        showActions?: boolean;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
        campaign,
        selected = false,
        onSelect,
        onEdit,
        onDelete,
        onDuplicate,
        onView,
        onPause,
        onResume,
        showBulkSelect = false,
        showActions = true,
}) => {
        const [showActionDropdown, setShowActionDropdown] = useState(false);

        // Get campaign status color
        const getStatusColor = (status: string) => {
                switch (status) {
                        case 'active': return 'bg-green-100 text-green-800 border-green-200';
                        case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
                        case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
                        case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
                        case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
                        case 'scheduled': return 'bg-purple-100 text-purple-800 border-purple-200';
                        default: return 'bg-gray-100 text-gray-800 border-gray-200';
                }
        };

        // Get campaign status text
        const getStatusText = (status: string) => {
                switch (status) {
                        case 'active': return 'فعال';
                        case 'paused': return 'متوقف';
                        case 'completed': return 'تکمیل شده';
                        case 'cancelled': return 'لغو شده';
                        case 'draft': return 'پیش‌نویس';
                        case 'scheduled': return 'زمان‌بندی شده';
                        default: return 'نامشخص';
                }
        };

        // Get campaign type color
        const getTypeColor = (type: string) => {
                switch (type) {
                        case 'immediate': return 'bg-red-100 text-red-800';
                        case 'scheduled': return 'bg-blue-100 text-blue-800';
                        case 'triggered': return 'bg-purple-100 text-purple-800';
                        default: return 'bg-gray-100 text-gray-800';
                }
        };

        // Format date in Persian
        const formatDate = (date: string) => {
                try {
                        return formatDistanceToNow(new Date(date), {
                                addSuffix: true,
                                locale: faIR
                        });
                } catch (error) {
                        return 'زمان نامشخص';
                }
        };

        // Format exact date
        const formatExactDate = (date: string) => {
                try {
                        return format(new Date(date), 'yyyy/MM/dd HH:mm', { locale: faIR });
                } catch (error) {
                        return 'زمان نامشخص';
                }
        };

        // Calculate success rate
        const getSuccessRate = () => {
                if (!campaign.analytics || campaign.analytics.sent === 0) return 0;
                return Math.round((campaign.analytics.delivered / campaign.analytics.sent) * 100);
        };

        // Calculate engagement rate
        const getEngagementRate = () => {
                if (!campaign.analytics || campaign.analytics.delivered === 0) return 0;
                return Math.round(((campaign.analytics.opened + campaign.analytics.clicked) / campaign.analytics.delivered) * 100);
        };

        return (
                <div
                        className={`
                                bg-white rounded-lg border transition-all duration-200 hover:shadow-md
                                ${campaign.status === 'active' ? 'border-green-300 shadow-sm' : 'border-gray-300'}
                                ${selected ? 'ring-2 ring-blue-500 border-blue-500' : ''}
                        `}
                >
                        <div className="p-6">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start space-x-3 space-x-reverse flex-1">
                                                {/* Bulk Select Checkbox */}
                                                {showBulkSelect && (
                                                        <div className="flex items-center pt-1">
                                                                <input
                                                                        type="checkbox"
                                                                        checked={selected}
                                                                        onChange={(e) => onSelect?.(e.target.checked)}
                                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                                                />
                                                        </div>
                                                )}

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between">
                                                                <div>
                                                                        <h3 className="font-semibold text-lg text-gray-900">
                                                                                {campaign.name}
                                                                        </h3>
                                                                        {campaign.description && (
                                                                                <p className="text-sm text-gray-500 mt-1">
                                                                                        {campaign.description}
                                                                                </p>
                                                                        )}
                                                                </div>

                                                                {/* Status Badge */}
                                                                <div className="flex items-center space-x-2 space-x-reverse">
                                                                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(campaign.status)}`}>
                                                                                {getStatusText(campaign.status)}
                                                                        </span>
                                                                </div>
                                                        </div>

                                                        {/* Badges */}
                                                        <div className="flex items-center space-x-2 space-x-reverse mt-3">
                                                                {/* Type Badge */}
                                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(campaign.type)}`}>
                                                                        {campaign.type === 'immediate' && 'فوری'}
                                                                        {campaign.type === 'scheduled' && 'زمان‌بندی شده'}
                                                                        {campaign.type === 'triggered' && 'شرطی'}
                                                                </span>

                                                                {/* Channel Badges */}
                                                                {Object.entries(campaign.channels)
                                                                        .filter(([_, enabled]) => enabled)
                                                                        .map(([channel, _]) => (
                                                                                <span key={channel} className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                                                        {channel === 'email' && 'ایمیل'}
                                                                                        {channel === 'sms' && 'پیامک'}
                                                                                        {channel === 'push' && 'فوری'}
                                                                                        {channel === 'inApp' && 'اپلیکیشن'}
                                                                                </span>
                                                                        ))}

                                                                {/* Target Audience */}
                                                                <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                                                                        {campaign.audience.estimatedReach.toLocaleString()} نفر
                                                                </span>
                                                        </div>
                                                </div>
                                        </div>

                                        {/* Actions */}
                                        {showActions && (
                                                <div className="relative">
                                                        <button
                                                                onClick={() => setShowActionDropdown(!showActionDropdown)}
                                                                className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                                        >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
                                                                </svg>
                                                        </button>

                                                        {/* Action Dropdown */}
                                                        {showActionDropdown && (
                                                                <div className="absolute left-0 top-8 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                                                                        <button
                                                                                onClick={() => {
                                                                                        onView?.();
                                                                                        setShowActionDropdown(false);
                                                                                }}
                                                                                className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                        >
                                                                                مشاهده جزئیات
                                                                        </button>

                                                                        <button
                                                                                onClick={() => {
                                                                                        onEdit?.();
                                                                                        setShowActionDropdown(false);
                                                                                }}
                                                                                className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                        >
                                                                                ویرایش
                                                                        </button>

                                                                        {campaign.status === 'active' && (
                                                                                <button
                                                                                        onClick={() => {
                                                                                                onPause?.();
                                                                                                setShowActionDropdown(false);
                                                                                        }}
                                                                                        className="block w-full text-right px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50"
                                                                                >
                                                                                        توقف کمپین
                                                                                </button>
                                                                        )}

                                                                        {campaign.status === 'paused' && (
                                                                                <button
                                                                                        onClick={() => {
                                                                                                onResume?.();
                                                                                                setShowActionDropdown(false);
                                                                                        }}
                                                                                        className="block w-full text-right px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                                                                                >
                                                                                        ادامه کمپین
                                                                                </button>
                                                                        )}

                                                                        <button
                                                                                onClick={() => {
                                                                                        onDuplicate?.();
                                                                                        setShowActionDropdown(false);
                                                                                }}
                                                                                className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                        >
                                                                                کپی کمپین
                                                                        </button>

                                                                        <hr className="my-1" />

                                                                        <button
                                                                                onClick={() => {
                                                                                        onDelete?.();
                                                                                        setShowActionDropdown(false);
                                                                                }}
                                                                                className="block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                                        >
                                                                                حذف
                                                                        </button>
                                                                </div>
                                                        )}
                                                </div>
                                        )}
                                </div>

                                {/* Analytics */}
                                {campaign.analytics && (
                                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                                                <div className="text-center">
                                                        <div className="text-lg font-semibold text-gray-900">{campaign.analytics.sent.toLocaleString()}</div>
                                                        <div className="text-xs text-gray-500">ارسال شده</div>
                                                </div>
                                                <div className="text-center">
                                                        <div className="text-lg font-semibold text-green-600">{campaign.analytics.delivered.toLocaleString()}</div>
                                                        <div className="text-xs text-gray-500">تحویل شده</div>
                                                </div>
                                                <div className="text-center">
                                                        <div className="text-lg font-semibold text-blue-600">{campaign.analytics.opened.toLocaleString()}</div>
                                                        <div className="text-xs text-gray-500">باز شده</div>
                                                </div>
                                                <div className="text-center">
                                                        <div className="text-lg font-semibold text-purple-600">{campaign.analytics.clicked.toLocaleString()}</div>
                                                        <div className="text-xs text-gray-500">کلیک شده</div>
                                                </div>
                                                <div className="text-center">
                                                        <div className="text-lg font-semibold text-orange-600">{getSuccessRate()}%</div>
                                                        <div className="text-xs text-gray-500">نرخ موفقیت</div>
                                                </div>
                                        </div>
                                )}

                                {/* Progress Bar */}
                                {campaign.status === 'active' && campaign.progress && (
                                        <div className="mb-4">
                                                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                                        <span>پیشرفت کمپین</span>
                                                        <span>{campaign.progress.percentage}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                                style={{ width: `${campaign.progress.percentage}%` }}
                                                        />
                                                </div>
                                                <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                                                        <span>{campaign.progress.processed.toLocaleString()} پردازش شده</span>
                                                        <span>{campaign.progress.remaining.toLocaleString()} باقیمانده</span>
                                                </div>
                                        </div>
                                )}

                                {/* Schedule Info */}
                                {campaign.schedule && (
                                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                        <div>
                                                                <div className="text-sm font-medium text-blue-900">
                                                                        {campaign.schedule.type === 'immediate' && 'ارسال فوری'}
                                                                        {campaign.schedule.type === 'scheduled' && 'زمان‌بندی شده'}
                                                                        {campaign.schedule.type === 'recurring' && 'تکراری'}
                                                                </div>
                                                                {campaign.schedule.startDate && (
                                                                        <div className="text-xs text-blue-700 mt-1">
                                                                                شروع: {formatExactDate(campaign.schedule.startDate)}
                                                                        </div>
                                                                )}
                                                                {campaign.schedule.endDate && (
                                                                        <div className="text-xs text-blue-700">
                                                                                پایان: {formatExactDate(campaign.schedule.endDate)}
                                                                        </div>
                                                                )}
                                                        </div>
                                                        {campaign.schedule.timezone && (
                                                                <div className="text-xs text-blue-600">
                                                                        {campaign.schedule.timezone}
                                                                </div>
                                                        )}
                                                </div>
                                        </div>
                                )}

                                {/* Footer */}
                                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                                        <div className="flex items-center space-x-3 space-x-reverse">
                                                <span>ایجاد: {formatDate(campaign.createdAt)}</span>
                                                {campaign.lastModified && (
                                                        <span>آخرین تغییر: {formatDate(campaign.lastModified)}</span>
                                                )}
                                        </div>

                                        <div className="flex items-center space-x-3 space-x-reverse">
                                                {campaign.createdBy && (
                                                        <span>ایجاد شده توسط: {campaign.createdBy.firstName} {campaign.createdBy.lastName}</span>
                                                )}
                                        </div>
                                </div>
                        </div>

                        {/* Click outside to close dropdown */}
                        {showActionDropdown && (
                                <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowActionDropdown(false)}
                                />
                        )}
                </div>
        );
};

export default CampaignCard; 