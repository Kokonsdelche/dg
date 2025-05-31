import React, { useState } from 'react';
import { NotificationTemplate } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { faIR } from 'date-fns/locale';

interface TemplateCardProps {
        template: NotificationTemplate;
        selected?: boolean;
        onSelect?: (selected: boolean) => void;
        onEdit?: () => void;
        onDelete?: () => void;
        onDuplicate?: () => void;
        onPreview?: () => void;
        onTest?: () => void;
        showBulkSelect?: boolean;
        showActions?: boolean;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
        template,
        selected = false,
        onSelect,
        onEdit,
        onDelete,
        onDuplicate,
        onPreview,
        onTest,
        showBulkSelect = false,
        showActions = true,
}) => {
        const [showActionDropdown, setShowActionDropdown] = useState(false);

        // Get template category color
        const getCategoryColor = (category: string) => {
                switch (category) {
                        case 'order': return 'bg-blue-100 text-blue-800 border-blue-200';
                        case 'payment': return 'bg-green-100 text-green-800 border-green-200';
                        case 'marketing': return 'bg-purple-100 text-purple-800 border-purple-200';
                        case 'system': return 'bg-orange-100 text-orange-800 border-orange-200';
                        case 'custom': return 'bg-pink-100 text-pink-800 border-pink-200';
                        default: return 'bg-gray-100 text-gray-800 border-gray-200';
                }
        };

        // Get template type icon
        const getTypeIcon = (type: string) => {
                const iconClasses = "w-5 h-5";
                switch (type) {
                        case 'email':
                                return <svg className={`${iconClasses} text-blue-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.945a1 1 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
                        case 'sms':
                                return <svg className={`${iconClasses} text-green-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>;
                        case 'push':
                                return <svg className={`${iconClasses} text-purple-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM12 3v1m6.364.636l-.707.707M21 12h-1M18.364 18.364l-.707-.707M12 20v1m-6.364-.636l.707-.707M3 12h1M5.636 5.636l.707.707" /></svg>;
                        case 'in-app':
                                return <svg className={`${iconClasses} text-orange-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a1 1 0 001-1v-1H7v1a1 1 0 001 1zM10 2C9 2 9 3 9 3h6s0-1-1-1h-4zM4 5a2 2 0 012-2h12a2 2 0 012 2v11H4V5z" /></svg>;
                        default:
                                return <svg className={`${iconClasses} text-gray-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
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

        // Get performance color
        const getPerformanceColor = (rate: number) => {
                if (rate >= 80) return 'text-green-600';
                if (rate >= 60) return 'text-yellow-600';
                if (rate >= 40) return 'text-orange-600';
                return 'text-red-600';
        };

        return (
                <div
                        className={`
                                bg-white rounded-lg border transition-all duration-200 hover:shadow-md
                                ${template.isActive ? 'border-gray-300 shadow-sm' : 'border-gray-200 opacity-75'}
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
                                                                <div className="flex items-center space-x-3 space-x-reverse">
                                                                        {/* Type Icon */}
                                                                        <div>
                                                                                {getTypeIcon(template.type)}
                                                                        </div>

                                                                        <div>
                                                                                <h3 className={`font-semibold text-lg ${template.isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                                                                                        {template.name}
                                                                                </h3>
                                                                                {template.description && (
                                                                                        <p className="text-sm text-gray-500 mt-1">
                                                                                                {template.description}
                                                                                        </p>
                                                                                )}
                                                                        </div>
                                                                </div>

                                                                {/* Status Badge */}
                                                                <div className="flex items-center space-x-2 space-x-reverse">
                                                                        {template.isActive ? (
                                                                                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                                                                        فعال
                                                                                </span>
                                                                        ) : (
                                                                                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                                                                                        غیرفعال
                                                                                </span>
                                                                        )}
                                                                </div>
                                                        </div>

                                                        {/* Badges */}
                                                        <div className="flex items-center space-x-2 space-x-reverse mt-3">
                                                                {/* Category Badge */}
                                                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(template.category)}`}>
                                                                        {template.category === 'order' && 'سفارش'}
                                                                        {template.category === 'payment' && 'پرداخت'}
                                                                        {template.category === 'marketing' && 'بازاریابی'}
                                                                        {template.category === 'system' && 'سیستم'}
                                                                        {template.category === 'custom' && 'مخصوص'}
                                                                </span>

                                                                {/* Type Badge */}
                                                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                                        {template.type === 'email' && 'ایمیل'}
                                                                        {template.type === 'sms' && 'پیامک'}
                                                                        {template.type === 'push' && 'فوری'}
                                                                        {template.type === 'in-app' && 'اپلیکیشن'}
                                                                </span>

                                                                {/* Variables Count */}
                                                                {template.variables && template.variables.length > 0 && (
                                                                        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                                                                {template.variables.length} متغیر
                                                                        </span>
                                                                )}
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
                                                                                        onPreview?.();
                                                                                        setShowActionDropdown(false);
                                                                                }}
                                                                                className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                        >
                                                                                پیش‌نمایش
                                                                        </button>

                                                                        <button
                                                                                onClick={() => {
                                                                                        onTest?.();
                                                                                        setShowActionDropdown(false);
                                                                                }}
                                                                                className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                        >
                                                                                تست ارسال
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

                                                                        <button
                                                                                onClick={() => {
                                                                                        onDuplicate?.();
                                                                                        setShowActionDropdown(false);
                                                                                }}
                                                                                className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                        >
                                                                                کپی
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

                                {/* Content Preview */}
                                <div className="mb-4">
                                        {template.subject && (
                                                <div className="mb-2">
                                                        <span className="text-xs font-medium text-gray-500">موضوع:</span>
                                                        <p className="text-sm text-gray-700 mt-1 font-medium">{template.subject}</p>
                                                </div>
                                        )}
                                        <div>
                                                <span className="text-xs font-medium text-gray-500">متن:</span>
                                                <p className="text-sm text-gray-700 mt-1 line-clamp-3">
                                                        {template.content.substring(0, 150)}
                                                        {template.content.length > 150 ? '...' : ''}
                                                </p>
                                        </div>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                                        <div className="flex items-center space-x-3 space-x-reverse">
                                                <span>آخرین بروزرسانی: {formatDate(template.updatedAt)}</span>
                                        </div>

                                        <div className="flex items-center space-x-3 space-x-reverse">
                                                <span>ایجاد: {formatDate(template.createdAt)}</span>
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

export default TemplateCard; 