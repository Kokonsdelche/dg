import React from 'react';

interface StatusBadgeProps {
        status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'active' | 'inactive' | 'paid' | 'failed';
        size?: 'sm' | 'md' | 'lg';
        type?: 'order' | 'user' | 'payment';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
        status,
        size = 'md',
        type = 'order'
}) => {
        const sizeClasses = {
                sm: 'px-2 py-1 text-xs',
                md: 'px-3 py-1 text-sm',
                lg: 'px-4 py-2 text-base'
        };

        const getStatusConfig = () => {
                switch (type) {
                        case 'order':
                                return {
                                        pending: {
                                                bg: 'bg-yellow-100',
                                                text: 'text-yellow-800',
                                                border: 'border-yellow-200',
                                                label: 'در انتظار',
                                                icon: '⏳'
                                        },
                                        processing: {
                                                bg: 'bg-blue-100',
                                                text: 'text-blue-800',
                                                border: 'border-blue-200',
                                                label: 'در حال پردازش',
                                                icon: '⚙️'
                                        },
                                        shipped: {
                                                bg: 'bg-purple-100',
                                                text: 'text-purple-800',
                                                border: 'border-purple-200',
                                                label: 'ارسال شده',
                                                icon: '🚚'
                                        },
                                        delivered: {
                                                bg: 'bg-green-100',
                                                text: 'text-green-800',
                                                border: 'border-green-200',
                                                label: 'تحویل شده',
                                                icon: '✅'
                                        },
                                        cancelled: {
                                                bg: 'bg-red-100',
                                                text: 'text-red-800',
                                                border: 'border-red-200',
                                                label: 'لغو شده',
                                                icon: '❌'
                                        }
                                };

                        case 'user':
                                return {
                                        active: {
                                                bg: 'bg-green-100',
                                                text: 'text-green-800',
                                                border: 'border-green-200',
                                                label: 'فعال',
                                                icon: '✅'
                                        },
                                        inactive: {
                                                bg: 'bg-gray-100',
                                                text: 'text-gray-800',
                                                border: 'border-gray-200',
                                                label: 'غیرفعال',
                                                icon: '⏸️'
                                        }
                                };

                        case 'payment':
                                return {
                                        pending: {
                                                bg: 'bg-yellow-100',
                                                text: 'text-yellow-800',
                                                border: 'border-yellow-200',
                                                label: 'در انتظار پرداخت',
                                                icon: '⏳'
                                        },
                                        paid: {
                                                bg: 'bg-green-100',
                                                text: 'text-green-800',
                                                border: 'border-green-200',
                                                label: 'پرداخت شده',
                                                icon: '💳'
                                        },
                                        failed: {
                                                bg: 'bg-red-100',
                                                text: 'text-red-800',
                                                border: 'border-red-200',
                                                label: 'پرداخت ناموفق',
                                                icon: '❌'
                                        }
                                };

                        default:
                                return {};
                }
        };

        const statusConfigs = getStatusConfig();
        const config = statusConfigs[status as keyof typeof statusConfigs];

        if (!config) {
                return (
                        <span className={`
        inline-flex items-center ${sizeClasses[size]}
        bg-gray-100 text-gray-800 border border-gray-200
        rounded-full font-medium
      `}>
                                نامشخص
                        </span>
                );
        }

        return (
                <span className={`
      inline-flex items-center ${sizeClasses[size]}
      ${config.bg} ${config.text} border ${config.border}
      rounded-full font-medium gap-1
    `}>
                        {size !== 'sm' && <span>{config.icon}</span>}
                        {config.label}
                </span>
        );
};

export default StatusBadge; 