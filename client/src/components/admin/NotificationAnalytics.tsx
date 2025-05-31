import React, { useState, useEffect } from 'react';
import { useAdminNotifications } from '../../hooks/useAdminNotifications';
import LoadingSpinner from '../common/LoadingSpinner';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
        Chart as ChartJS,
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        BarElement,
        Title,
        Tooltip,
        Legend,
        ArcElement,
} from 'chart.js';

ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        BarElement,
        Title,
        Tooltip,
        Legend,
        ArcElement
);

interface NotificationMetrics {
        overview: {
                totalSent: number;
                totalDelivered: number;
                totalOpened: number;
                totalClicked: number;
                deliveryRate: number;
                openRate: number;
                clickRate: number;
                bounceRate: number;
        };
        channels: {
                [key: string]: {
                        sent: number;
                        delivered: number;
                        failed: number;
                        rate: number;
                };
        };
        timelineData: {
                labels: string[];
                sent: number[];
                delivered: number[];
                opened: number[];
                clicked: number[];
        };
        topPerformingTemplates: Array<{
                id: string;
                name: string;
                sent: number;
                openRate: number;
                clickRate: number;
        }>;
        failureReasons: {
                [key: string]: number;
        };
        deviceBreakdown: {
                [key: string]: number;
        };
}

const NotificationAnalytics: React.FC = () => {
        const { loading } = useAdminNotifications();

        const [metrics, setMetrics] = useState<NotificationMetrics>({
                overview: {
                        totalSent: 15420,
                        totalDelivered: 14835,
                        totalOpened: 8901,
                        totalClicked: 2340,
                        deliveryRate: 96.2,
                        openRate: 60.0,
                        clickRate: 26.3,
                        bounceRate: 3.8
                },
                channels: {
                        email: { sent: 8500, delivered: 8200, failed: 300, rate: 96.5 },
                        sms: { sent: 4200, delivered: 4050, failed: 150, rate: 96.4 },
                        push: { sent: 2100, delivered: 1950, failed: 150, rate: 92.9 },
                        inApp: { sent: 620, delivered: 635, failed: 35, rate: 97.4 }
                },
                timelineData: {
                        labels: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'],
                        sent: [2100, 2300, 2800, 2200, 2600, 2400, 1920],
                        delivered: [2020, 2210, 2690, 2110, 2500, 2300, 1845],
                        opened: [1212, 1326, 1614, 1266, 1500, 1380, 1107],
                        clicked: [303, 331, 403, 316, 375, 345, 276]
                },
                topPerformingTemplates: [
                        { id: '1', name: 'خوش‌آمدگویی', sent: 1200, openRate: 85.3, clickRate: 42.1 },
                        { id: '2', name: 'تایید سفارش', sent: 2800, openRate: 78.9, clickRate: 35.6 },
                        { id: '3', name: 'تخفیف ویژه', sent: 890, openRate: 72.4, clickRate: 28.9 },
                        { id: '4', name: 'یادآوری سبد خرید', sent: 1500, openRate: 68.2, clickRate: 25.7 }
                ],
                failureReasons: {
                        'ایمیل نامعتبر': 45,
                        'صندوق پر': 25,
                        'مسدود شده': 15,
                        'خطای سرور': 10,
                        'سایر': 5
                },
                deviceBreakdown: {
                        'موبایل': 65,
                        'دسکتاپ': 25,
                        'تبلت': 10
                }
        });

        const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('7d');
        const [selectedChannel, setSelectedChannel] = useState<'all' | 'email' | 'sms' | 'push' | 'inApp'>('all');
        const [refreshing, setRefreshing] = useState(false);

        // Refresh data
        const refreshData = async () => {
                setRefreshing(true);
                try {
                        // Simulate API call
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        // Update metrics here
                } finally {
                        setRefreshing(false);
                }
        };

        // Chart configurations
        const timelineChartData = {
                labels: metrics.timelineData.labels,
                datasets: [
                        {
                                label: 'ارسال شده',
                                data: metrics.timelineData.sent,
                                borderColor: 'rgb(59, 130, 246)',
                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                tension: 0.4,
                        },
                        {
                                label: 'تحویل شده',
                                data: metrics.timelineData.delivered,
                                borderColor: 'rgb(16, 185, 129)',
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                tension: 0.4,
                        },
                        {
                                label: 'باز شده',
                                data: metrics.timelineData.opened,
                                borderColor: 'rgb(245, 158, 11)',
                                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                tension: 0.4,
                        },
                        {
                                label: 'کلیک شده',
                                data: metrics.timelineData.clicked,
                                borderColor: 'rgb(139, 92, 246)',
                                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                                tension: 0.4,
                        },
                ],
        };

        const channelChartData = {
                labels: Object.keys(metrics.channels).map(channel => {
                        const channelNames = {
                                email: 'ایمیل',
                                sms: 'پیامک',
                                push: 'اعلان فوری',
                                inApp: 'اپلیکیشن'
                        };
                        return channelNames[channel as keyof typeof channelNames] || channel;
                }),
                datasets: [
                        {
                                label: 'تحویل شده',
                                data: Object.values(metrics.channels).map(channel => channel.delivered),
                                backgroundColor: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'],
                                borderWidth: 1,
                        },
                ],
        };

        const failureChartData = {
                labels: Object.keys(metrics.failureReasons),
                datasets: [
                        {
                                data: Object.values(metrics.failureReasons),
                                backgroundColor: [
                                        '#EF4444',
                                        '#F97316',
                                        '#EAB308',
                                        '#6B7280',
                                        '#94A3B8'
                                ],
                                borderWidth: 0,
                        },
                ],
        };

        const deviceChartData = {
                labels: Object.keys(metrics.deviceBreakdown),
                datasets: [
                        {
                                data: Object.values(metrics.deviceBreakdown),
                                backgroundColor: [
                                        '#3B82F6',
                                        '#10B981',
                                        '#F59E0B'
                                ],
                                borderWidth: 0,
                        },
                ],
        };

        const chartOptions = {
                responsive: true,
                plugins: {
                        legend: {
                                position: 'top' as const,
                        },
                },
                scales: {
                        y: {
                                beginAtZero: true,
                        },
                },
        };

        const doughnutOptions = {
                responsive: true,
                plugins: {
                        legend: {
                                position: 'bottom' as const,
                        },
                },
        };

        if (loading) {
                return <LoadingSpinner />;
        }

        return (
                <div className="space-y-6">
                        {/* Header */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                        <div>
                                                <h1 className="text-2xl font-bold text-gray-900">آنالیتیک اطلاع‌رسانی</h1>
                                                <p className="text-sm text-gray-600 mt-1">
                                                        آمار عملکرد و تجزیه‌وتحلیل سیستم اطلاع‌رسانی
                                                </p>
                                        </div>

                                        <div className="flex items-center space-x-3 space-x-reverse">
                                                {/* Date Range Filter */}
                                                <select
                                                        value={dateRange}
                                                        onChange={(e) => setDateRange(e.target.value as any)}
                                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                        <option value="7d">۷ روز گذشته</option>
                                                        <option value="30d">۳۰ روز گذشته</option>
                                                        <option value="90d">۹۰ روز گذشته</option>
                                                        <option value="1y">یک سال گذشته</option>
                                                </select>

                                                {/* Channel Filter */}
                                                <select
                                                        value={selectedChannel}
                                                        onChange={(e) => setSelectedChannel(e.target.value as any)}
                                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                        <option value="all">همه کانال‌ها</option>
                                                        <option value="email">ایمیل</option>
                                                        <option value="sms">پیامک</option>
                                                        <option value="push">اعلان فوری</option>
                                                        <option value="inApp">اپلیکیشن</option>
                                                </select>

                                                <button
                                                        onClick={refreshData}
                                                        disabled={refreshing}
                                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                                >
                                                        {refreshing ? 'در حال بروزرسانی...' : 'بروزرسانی'}
                                                </button>
                                        </div>
                                </div>
                        </div>

                        {/* Overview Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                        <div className="flex items-center">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                        </svg>
                                                </div>
                                                <div className="mr-4">
                                                        <p className="text-sm font-medium text-gray-600">کل ارسال</p>
                                                        <p className="text-2xl font-bold text-gray-900">{metrics.overview.totalSent.toLocaleString('fa-IR')}</p>
                                                </div>
                                        </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                        <div className="flex items-center">
                                                <div className="p-2 bg-green-100 rounded-lg">
                                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                </div>
                                                <div className="mr-4">
                                                        <p className="text-sm font-medium text-gray-600">نرخ تحویل</p>
                                                        <p className="text-2xl font-bold text-gray-900">%{metrics.overview.deliveryRate}</p>
                                                </div>
                                        </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                        <div className="flex items-center">
                                                <div className="p-2 bg-orange-100 rounded-lg">
                                                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                </div>
                                                <div className="mr-4">
                                                        <p className="text-sm font-medium text-gray-600">نرخ باز کردن</p>
                                                        <p className="text-2xl font-bold text-gray-900">%{metrics.overview.openRate}</p>
                                                </div>
                                        </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                        <div className="flex items-center">
                                                <div className="p-2 bg-purple-100 rounded-lg">
                                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                                        </svg>
                                                </div>
                                                <div className="mr-4">
                                                        <p className="text-sm font-medium text-gray-600">نرخ کلیک</p>
                                                        <p className="text-2xl font-bold text-gray-900">%{metrics.overview.clickRate}</p>
                                                </div>
                                        </div>
                                </div>
                        </div>

                        {/* Main Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Timeline Chart */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">روند زمانی اطلاع‌رسانی</h3>
                                        <Line data={timelineChartData} options={chartOptions} />
                                </div>

                                {/* Channel Performance */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">عملکرد کانال‌ها</h3>
                                        <Bar data={channelChartData} options={chartOptions} />
                                </div>
                        </div>

                        {/* Secondary Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Failure Reasons */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">دلایل عدم موفقیت</h3>
                                        <Doughnut data={failureChartData} options={doughnutOptions} />
                                </div>

                                {/* Device Breakdown */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">تفکیک دستگاه</h3>
                                        <Doughnut data={deviceChartData} options={doughnutOptions} />
                                </div>

                                {/* Channel Details */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">جزئیات کانال‌ها</h3>
                                        <div className="space-y-3">
                                                {Object.entries(metrics.channels).map(([channel, data]) => {
                                                        const channelNames = {
                                                                email: 'ایمیل',
                                                                sms: 'پیامک',
                                                                push: 'اعلان فوری',
                                                                inApp: 'اپلیکیشن'
                                                        };
                                                        const channelName = channelNames[channel as keyof typeof channelNames] || channel;

                                                        return (
                                                                <div key={channel} className="flex items-center justify-between">
                                                                        <div className="flex items-center">
                                                                                <div className={`w-3 h-3 rounded-full ml-2 ${channel === 'email' ? 'bg-blue-500' :
                                                                                                channel === 'sms' ? 'bg-green-500' :
                                                                                                        channel === 'push' ? 'bg-purple-500' : 'bg-orange-500'
                                                                                        }`}></div>
                                                                                <span className="text-sm text-gray-900">{channelName}</span>
                                                                        </div>
                                                                        <div className="text-left">
                                                                                <p className="text-sm font-medium text-gray-900">%{data.rate}</p>
                                                                                <p className="text-xs text-gray-500">{data.delivered.toLocaleString('fa-IR')}</p>
                                                                        </div>
                                                                </div>
                                                        );
                                                })}
                                        </div>
                                </div>
                        </div>

                        {/* Top Performing Templates */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">قالب‌های برتر</h3>
                                <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                        <tr>
                                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                        نام قالب
                                                                </th>
                                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                        تعداد ارسال
                                                                </th>
                                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                        نرخ باز کردن
                                                                </th>
                                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                        نرخ کلیک
                                                                </th>
                                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                        عملیات
                                                                </th>
                                                        </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                        {metrics.topPerformingTemplates.map((template) => (
                                                                <tr key={template.id} className="hover:bg-gray-50">
                                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                                {template.name}
                                                                        </td>
                                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                                {template.sent.toLocaleString('fa-IR')}
                                                                        </td>
                                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                                        %{template.openRate}
                                                                                </span>
                                                                        </td>
                                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                                        %{template.clickRate}
                                                                                </span>
                                                                        </td>
                                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                                <button className="text-blue-600 hover:text-blue-900 ml-4">مشاهده</button>
                                                                                <button className="text-gray-600 hover:text-gray-900">تکرار</button>
                                                                        </td>
                                                                </tr>
                                                        ))}
                                                </tbody>
                                        </table>
                                </div>
                        </div>
                </div>
        );
};

export default NotificationAnalytics; 