import React, { useState } from 'react';
import { Notification } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { faIR } from 'date-fns/locale';

interface NotificationCardProps {
        notification: Notification;
        selected?: boolean;
        onSelect?: (selected: boolean) => void;
        onMarkAsRead?: () => void;
        onMarkAsUnread?: () => void;
        onEdit?: () => void;
        onDelete?: () => void;
        onResend?: () => void;
        onViewDetails?: () => void;
        showBulkSelect?: boolean;
        showActions?: boolean;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
        notification,
        selected = false,
        onSelect,
        onMarkAsRead,
        onMarkAsUnread,
        onEdit,
        onDelete,
        onResend,
        onViewDetails,
        showBulkSelect = false,
        showActions = true,
}) => {
        const [isExpanded, setIsExpanded] = useState(false);
        const [showActionDropdown, setShowActionDropdown] = useState(false);

        // Get notification status color
        const getStatusColor = (status: string) => {
                switch (status) {
                        case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
                        case 'sent': return 'bg-blue-100 text-blue-800 border-blue-200';
                        case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
                        case 'read': return 'bg-gray-100 text-gray-800 border-gray-200';
                        case 'failed': return 'bg-red-100 text-red-800 border-red-200';
                        case 'unread': return 'bg-blue-100 text-blue-800 border-blue-200';
                        default: return 'bg-gray-100 text-gray-800 border-gray-200';
                }
        };

        // Get priority color
        const getPriorityColor = (priority: string) => {
                switch (priority) {
                        case 'low': return 'bg-gray-100 text-gray-700';
                        case 'medium': return 'bg-blue-100 text-blue-700';
                        case 'high': return 'bg-orange-100 text-orange-700';
                        case 'urgent': return 'bg-red-100 text-red-700';
                        default: return 'bg-gray-100 text-gray-700';
                }
        };

        // Get type icon
        const getTypeIcon = (type: string) => {
                const iconClasses = "w-5 h-5";
                switch (type) {
                        case 'order':
                                return <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
                        case 'payment':
                                return <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
                        case 'system':
                                return <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
                        case 'info':
                                return <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
                        case 'warning':
                                return <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.824-.833-2.598 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" /></svg>;
                        case 'error':
                                return <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
                        case 'success':
                                return <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
                        default:
                                return <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM12 3v8.586l-3-3-3 3V3h6z" /></svg>;
                }
        };

        // Get avatar for notification - simplified since we don't have author info
        const getAvatar = () => {
                return (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                                {notification.type === 'system' ? 'سیس' :
                                        notification.type === 'order' ? 'سف' :
                                                notification.type === 'payment' ? 'پرد' : 'اط'}
                        </div>
                );
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

        return (
                <div
                        className={`
                                bg-white rounded-lg border transition-all duration-200 hover:shadow-md
                                ${notification.status === 'read' ? 'border-gray-200 opacity-75' : 'border-gray-300 shadow-sm'}
                                ${selected ? 'ring-2 ring-blue-500 border-blue-500' : ''}
                        `}
                >
                        <div className="p-4">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
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

                                                {/* Avatar */}
                                                <div className="flex-shrink-0">
                                                        {getAvatar()}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between">
                                                                <div className="flex items-center space-x-2 space-x-reverse">
                                                                        <h3 className={`font-semibold ${notification.status === 'read' ? 'text-gray-600' : 'text-gray-900'}`}>
                                                                                {notification.title}
                                                                        </h3>

                                                                        {/* Type Icon */}
                                                                        <div className="text-gray-500">
                                                                                {getTypeIcon(notification.type)}
                                                                        </div>

                                                                        {/* Priority Badge */}
                                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(notification.priority)}`}>
                                                                                {notification.priority === 'low' && 'کم'}
                                                                                {notification.priority === 'medium' && 'متوسط'}
                                                                                {notification.priority === 'high' && 'بالا'}
                                                                                {notification.priority === 'urgent' && 'فوری'}
                                                                        </span>
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
                                                                                                {notification.status !== 'read' ? (
                                                                                                        <button
                                                                                                                onClick={() => {
                                                                                                                        onMarkAsRead?.();
                                                                                                                        setShowActionDropdown(false);
                                                                                                                }}
                                                                                                                className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                                                        >
                                                                                                                علامت‌گذاری به عنوان خوانده شده
                                                                                                        </button>
                                                                                                ) : (
                                                                                                        <button
                                                                                                                onClick={() => {
                                                                                                                        onMarkAsUnread?.();
                                                                                                                        setShowActionDropdown(false);
                                                                                                                }}
                                                                                                                className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                                                        >
                                                                                                                علامت‌گذاری به عنوان خوانده نشده
                                                                                                        </button>
                                                                                                )}

                                                                                                <button
                                                                                                        onClick={() => {
                                                                                                                onViewDetails?.();
                                                                                                                setShowActionDropdown(false);
                                                                                                        }}
                                                                                                        className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                                                >
                                                                                                        مشاهده جزئیات
                                                                                                </button>

                                                                                                {notification.status === 'failed' && (
                                                                                                        <button
                                                                                                                onClick={() => {
                                                                                                                        onResend?.();
                                                                                                                        setShowActionDropdown(false);
                                                                                                                }}
                                                                                                                className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                                                        >
                                                                                                                ارسال مجدد
                                                                                                        </button>
                                                                                                )}

                                                                                                <button
                                                                                                        onClick={() => {
                                                                                                                onEdit?.();
                                                                                                                setShowActionDropdown(false);
                                                                                                        }}
                                                                                                        className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                                                >
                                                                                                        ویرایش
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

                                                        {/* Message Preview */}
                                                        <p className={`mt-1 text-sm ${notification.status === 'read' ? 'text-gray-500' : 'text-gray-700'}`}>
                                                                {isExpanded ? notification.message : notification.message.substring(0, 120) + (notification.message.length > 120 ? '...' : '')}
                                                                {notification.message.length > 120 && (
                                                                        <button
                                                                                onClick={() => setIsExpanded(!isExpanded)}
                                                                                className="text-blue-600 hover:text-blue-800 mr-1"
                                                                        >
                                                                                {isExpanded ? 'کمتر' : 'بیشتر'}
                                                                        </button>
                                                                )}
                                                        </p>

                                                        {/* Tags */}
                                                        {notification.tags && notification.tags.length > 0 && (
                                                                <div className="flex flex-wrap gap-1 mt-2">
                                                                        {notification.tags.slice(0, isExpanded ? notification.tags.length : 3).map((tag, index) => (
                                                                                <span
                                                                                        key={index}
                                                                                        className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
                                                                                >
                                                                                        {tag}
                                                                                </span>
                                                                        ))}
                                                                        {!isExpanded && notification.tags.length > 3 && (
                                                                                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                                                                                        +{notification.tags.length - 3}
                                                                                </span>
                                                                        )}
                                                                </div>
                                                        )}
                                                </div>
                                        </div>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
                                        <div className="flex items-center space-x-4 space-x-reverse">
                                                {/* Status Badge */}
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(notification.status)}`}>
                                                        {notification.status === 'pending' && 'در انتظار'}
                                                        {notification.status === 'sent' && 'ارسال شده'}
                                                        {notification.status === 'delivered' && 'تحویل شده'}
                                                        {notification.status === 'read' && 'خوانده شده'}
                                                        {notification.status === 'failed' && 'ناموفق'}
                                                        {notification.status === 'unread' && 'خوانده نشده'}
                                                </span>

                                                {/* Channels */}
                                                <div className="flex items-center space-x-1 space-x-reverse">
                                                        {notification.channel === 'in-app' && <span className="text-blue-600">📱</span>}
                                                        {notification.channel === 'email' && <span className="text-green-600">📧</span>}
                                                        {notification.channel === 'sms' && <span className="text-orange-600">📱</span>}
                                                        {notification.channel === 'push' && <span className="text-purple-600">🔔</span>}
                                                </div>

                                                {/* Recipient Type */}
                                                <span className="text-gray-400">
                                                        {notification.recipientType === 'user' && 'کاربر'}
                                                        {notification.recipientType === 'admin' && 'مدیر'}
                                                        {notification.recipientType === 'all' && 'همگانی'}
                                                </span>
                                        </div>

                                        {/* Time and Author */}
                                        <div className="flex items-center space-x-3 space-x-reverse">
                                                <span>{formatDate(notification.createdAt)}</span>
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

export default NotificationCard; 