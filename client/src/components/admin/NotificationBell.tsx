import React, { useState, useRef, useEffect } from 'react';
import { useAdminNotifications } from '../../hooks/useAdminNotifications';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { faIR } from 'date-fns/locale';

interface NotificationBellProps {
        className?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
        className = ''
}) => {
        const {
                notifications,
                unreadCount,
                loading,
                markAsRead,
                markAllAsRead
        } = useAdminNotifications();

        const [showDropdown, setShowDropdown] = useState(false);
        const dropdownRef = useRef<HTMLDivElement>(null);

        // Recent notifications (last 5)
        const recentNotifications = notifications.slice(0, 5);

        // Click outside to close dropdown
        useEffect(() => {
                const handleClickOutside = (event: MouseEvent) => {
                        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                                setShowDropdown(false);
                        }
                };

                if (showDropdown) {
                        document.addEventListener('mousedown', handleClickOutside);
                        return () => document.removeEventListener('mousedown', handleClickOutside);
                }
        }, [showDropdown]);

        // Get notification icon
        const getNotificationIcon = (type: string) => {
                const iconClasses = "w-4 h-4";
                switch (type) {
                        case 'order':
                                return <svg className={`${iconClasses} text-blue-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
                        case 'user':
                                return <svg className={`${iconClasses} text-green-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
                        case 'system':
                                return <svg className={`${iconClasses} text-orange-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>;
                        case 'security':
                                return <svg className={`${iconClasses} text-red-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
                        default:
                                return <svg className={`${iconClasses} text-blue-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM12 3v8.586l-3-3-3 3V3h6z" /></svg>;
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

        return (
                <div className={`relative ${className}`} ref={dropdownRef}>
                        {/* Bell Button */}
                        <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className={`
                                        relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 
                                        rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
                                        ${showDropdown ? 'bg-gray-100 text-gray-900' : ''}
                                `}
                                title="اطلاع‌رسانی‌ها"
                        >
                                {/* Bell Icon */}
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM12 3c.483 0 .966.097 1.426.291a9.981 9.981 0 016.274 9.209c0 .688.024 1.373.072 2.055.096 1.365.146 2.733.146 4.099 0 .346-.14.678-.388.925-.247.248-.58.388-.925.388H6.424a1.31 1.31 0 01-.925-.388A1.31 1.31 0 015.11 19.191c0-1.366.05-2.734.146-4.1.048-.681.072-1.366.072-2.054A9.981 9.981 0 0112 3z" />
                                </svg>

                                {/* Unread Count Badge */}
                                {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full min-w-[1.5rem] h-6">
                                                {unreadCount > 99 ? '99+' : unreadCount}
                                        </span>
                                )}

                                {/* Loading Indicator */}
                                {loading && (
                                        <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                                )}
                        </button>

                        {/* Dropdown */}
                        {showDropdown && (
                                <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                        {/* Header */}
                                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                                                <h3 className="text-sm font-semibold text-gray-900">
                                                        اطلاع‌رسانی‌ها
                                                        {unreadCount > 0 && (
                                                                <span className="mr-1 text-xs text-gray-500">
                                                                        ({unreadCount} خوانده نشده)
                                                                </span>
                                                        )}
                                                </h3>

                                                {unreadCount > 0 && (
                                                        <button
                                                                onClick={() => {
                                                                        markAllAsRead();
                                                                        setShowDropdown(false);
                                                                }}
                                                                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                                        >
                                                                علامت‌گذاری همه
                                                        </button>
                                                )}
                                        </div>

                                        {/* Notifications List */}
                                        <div className="max-h-80 overflow-y-auto">
                                                {recentNotifications.length > 0 ? (
                                                        <div className="py-2">
                                                                {recentNotifications.map((notification) => (
                                                                        <div
                                                                                key={notification._id}
                                                                                className={`
                                                                                        px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200 border-r-4
                                                                                        ${notification.status === 'read'
                                                                                                ? 'border-transparent bg-gray-50/50'
                                                                                                : 'border-blue-500 bg-blue-50/30'
                                                                                        }
                                                                                `}
                                                                                onClick={() => {
                                                                                        if (notification.status !== 'read') {
                                                                                                markAsRead(notification._id);
                                                                                        }
                                                                                }}
                                                                        >
                                                                                <div className="flex items-start space-x-3 space-x-reverse">
                                                                                        {/* Icon */}
                                                                                        <div className="flex-shrink-0 mt-1">
                                                                                                {getNotificationIcon(notification.type)}
                                                                                        </div>

                                                                                        {/* Content */}
                                                                                        <div className="flex-1 min-w-0">
                                                                                                <p className={`text-sm font-medium ${notification.status === 'read' ? 'text-gray-600' : 'text-gray-900'}`}>
                                                                                                        {notification.title}
                                                                                                </p>
                                                                                                <p className={`text-xs mt-1 ${notification.status === 'read' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                                                        {notification.message.substring(0, 60)}
                                                                                                        {notification.message.length > 60 ? '...' : ''}
                                                                                                </p>
                                                                                                <div className="flex items-center justify-between mt-2">
                                                                                                        <p className="text-xs text-gray-400">
                                                                                                                {formatDate(notification.createdAt)}
                                                                                                        </p>
                                                                                                        {notification.priority === 'urgent' && (
                                                                                                                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                                                                                                                        فوری
                                                                                                                </span>
                                                                                                        )}
                                                                                                </div>
                                                                                        </div>

                                                                                        {/* Unread Indicator */}
                                                                                        {notification.status !== 'read' && (
                                                                                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                                                                        )}
                                                                                </div>
                                                                        </div>
                                                                ))}
                                                        </div>
                                                ) : (
                                                        <div className="px-4 py-8 text-center">
                                                                <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM12 3c.483 0 .966.097 1.426.291a9.981 9.981 0 016.274 9.209c0 .688.024 1.373.072 2.055.096 1.365.146 2.733.146 4.099 0 .346-.14.678-.388.925-.247.248-.58.388-.925.388H6.424a1.31 1.31 0 01-.925-.388A1.31 1.31 0 015.11 19.191c0-1.366.05-2.734.146-4.1.048-.681.072-1.366.072-2.054A9.981 9.981 0 0112 3z" />
                                                                </svg>
                                                                <p className="text-sm text-gray-500">اطلاع‌رسانی جدیدی وجود ندارد</p>
                                                        </div>
                                                )}
                                        </div>

                                        {/* Footer */}
                                        {recentNotifications.length > 0 && (
                                                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                                                        <Link
                                                                to="/admin/notifications"
                                                                onClick={() => setShowDropdown(false)}
                                                                className="block text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                                                        >
                                                                مشاهده همه اطلاع‌رسانی‌ها
                                                        </Link>
                                                </div>
                                        )}
                                </div>
                        )}
                </div>
        );
};

export default NotificationBell; 