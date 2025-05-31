import React, { useState, useEffect } from 'react';
import { useAdminNotifications } from '../../hooks/useAdminNotifications';
import LoadingSpinner from '../common/LoadingSpinner';
import { Line, Bar, Pie } from 'react-chartjs-2';

interface CampaignAnalytics {
        campaignId: string;
        campaignName: string;
        status: 'active' | 'completed' | 'paused' | 'draft';
        type: 'promotional' | 'transactional' | 'newsletter';

        performance: {
                sent: number;
                delivered: number;
                opened: number;
                clicked: number;
                bounced: number;
                unsubscribed: number;

                deliveryRate: number;
                openRate: number;
                clickRate: number;
                bounceRate: number;
                unsubscribeRate: number;
        };

        timeline: {
                labels: string[];
                sent: number[];
                delivered: number[];
                opened: number[];
                clicked: number[];
        };

        deviceBreakdown: {
                mobile: number;
                desktop: number;
                tablet: number;
        };

        locationBreakdown: {
                [city: string]: number;
        };

        channelPerformance: {
                [channel: string]: {
                        sent: number;
                        delivered: number;
                        opened: number;
                        clicked: number;
                        rate: number;
                };
        };

        contentAnalysis: {
                subjectLines?: {
                        [subject: string]: {
                                sent: number;
                                openRate: number;
                        };
                };
                linkClicks: {
                        [url: string]: {
                                clicks: number;
                                uniqueClicks: number;
                        };
                };
        };

        audienceInsights: {
                totalRecipients: number;
                newSubscribers: number;
                engagementScore: number;
                demographicBreakdown: {
                        [age: string]: number;
                };
        };
}

const CampaignAnalytics: React.FC = () => {
        const adminNotifications = useAdminNotifications();
        const loading = adminNotifications?.loading || false;

        const [selectedCampaign, setSelectedCampaign] = useState<string>('campaign-1');
        const [compareMode, setCompareMode] = useState(false);
        const [compareCampaign, setCompareCampaign] = useState<string>('');
        const [timeframe, setTimeframe] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

        const [analytics, setAnalytics] = useState<CampaignAnalytics>({
                campaignId: 'campaign-1',
                campaignName: 'کمپین تخفیف پاییزه',
                status: 'active',
                type: 'promotional',

                performance: {
                        sent: 5420,
                        delivered: 5180,
                        opened: 3108,
                        clicked: 745,
                        bounced: 240,
                        unsubscribed: 15,

                        deliveryRate: 95.6,
                        openRate: 60.0,
                        clickRate: 24.0,
                        bounceRate: 4.4,
                        unsubscribeRate: 0.3
                },

                timeline: {
                        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
                        sent: [120, 200, 800, 1200, 1500, 1100, 500],
                        delivered: [115, 192, 768, 1152, 1440, 1056, 480],
                        opened: [23, 58, 230, 460, 720, 528, 240],
                        clicked: [5, 12, 46, 92, 144, 106, 48]
                },

                deviceBreakdown: {
                        mobile: 68,
                        desktop: 22,
                        tablet: 10
                },

                locationBreakdown: {
                        'تهران': 35,
                        'اصفهان': 18,
                        'مشهد': 15,
                        'شیراز': 12,
                        'تبریز': 10,
                        'سایر': 10
                },

                channelPerformance: {
                        email: { sent: 3200, delivered: 3072, opened: 1843, clicked: 442, rate: 96.0 },
                        sms: { sent: 1500, delivered: 1440, opened: 864, clicked: 207, rate: 96.0 },
                        push: { sent: 720, delivered: 668, opened: 401, clicked: 96, rate: 92.8 }
                },

                contentAnalysis: {
                        subjectLines: {
                                'تخفیف ۵۰٪ ویژه پاییز': { sent: 2700, openRate: 65.2 },
                                'فرصت طلایی برای خرید': { sent: 2720, openRate: 54.8 }
                        },
                        linkClicks: {
                                'فروشگاه اصلی': { clicks: 420, uniqueClicks: 380 },
                                'محصولات تخفیف‌دار': { clicks: 325, uniqueClicks: 295 },
                                'درباره ما': { clicks: 45, uniqueClicks: 42 }
                        }
                },

                audienceInsights: {
                        totalRecipients: 5420,
                        newSubscribers: 120,
                        engagementScore: 78.5,
                        demographicBreakdown: {
                                '18-25': 25,
                                '26-35': 35,
                                '36-45': 25,
                                '46+': 15
                        }
                }
        });

        const [availableCampaigns] = useState([
                { id: 'campaign-1', name: 'کمپین تخفیف پاییزه', status: 'active' },
                { id: 'campaign-2', name: 'خوش‌آمدگویی جدید', status: 'completed' },
                { id: 'campaign-3', name: 'یادآوری سبد خرید', status: 'active' },
                { id: 'campaign-4', name: 'نظرسنجی رضایت', status: 'paused' }
        ]);

        // Chart configurations
        const timelineChartData = {
                labels: analytics.timeline.labels,
                datasets: [
                        {
                                label: 'ارسال شده',
                                data: analytics.timeline.sent,
                                borderColor: 'rgb(59, 130, 246)',
                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                tension: 0.4,
                        },
                        {
                                label: 'تحویل شده',
                                data: analytics.timeline.delivered,
                                borderColor: 'rgb(16, 185, 129)',
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                tension: 0.4,
                        },
                        {
                                label: 'باز شده',
                                data: analytics.timeline.opened,
                                borderColor: 'rgb(245, 158, 11)',
                                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                tension: 0.4,
                        },
                        {
                                label: 'کلیک شده',
                                data: analytics.timeline.clicked,
                                borderColor: 'rgb(139, 92, 246)',
                                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                                tension: 0.4,
                        },
                ],
        };

        const deviceChartData = {
                labels: ['موبایل', 'دسکتاپ', 'تبلت'],
                datasets: [
                        {
                                data: [analytics.deviceBreakdown.mobile, analytics.deviceBreakdown.desktop, analytics.deviceBreakdown.tablet],
                                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
                                borderWidth: 0,
                        },
                ],
        };

        const locationChartData = {
                labels: Object.keys(analytics.locationBreakdown),
                datasets: [
                        {
                                data: Object.values(analytics.locationBreakdown),
                                backgroundColor: [
                                        '#3B82F6',
                                        '#10B981',
                                        '#F59E0B',
                                        '#8B5CF6',
                                        '#EF4444',
                                        '#6B7280'
                                ],
                                borderWidth: 0,
                        },
                ],
        };

        const channelChartData = {
                labels: Object.keys(analytics.channelPerformance).map(channel => {
                        const channelNames = { email: 'ایمیل', sms: 'پیامک', push: 'اعلان فوری' };
                        return channelNames[channel as keyof typeof channelNames] || channel;
                }),
                datasets: [
                        {
                                label: 'نرخ باز کردن',
                                data: Object.values(analytics.channelPerformance).map(channel =>
                                        (channel.opened / channel.delivered * 100).toFixed(1)
                                ),
                                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                        },
                        {
                                label: 'نرخ کلیک',
                                data: Object.values(analytics.channelPerformance).map(channel =>
                                        (channel.clicked / channel.delivered * 100).toFixed(1)
                                ),
                                backgroundColor: 'rgba(16, 185, 129, 0.8)',
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

        const pieOptions = {
                responsive: true,
                plugins: {
                        legend: {
                                position: 'bottom' as const,
                        },
                },
        };

        // Format numbers
        const formatNumber = (num: number) => num.toLocaleString('fa-IR');
        const formatPercent = (num: number) => `%${num.toFixed(1)}`;

        if (loading) {
                return <LoadingSpinner />;
        }

        return (
                <div className="space-y-6">
                        {/* Header */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                        <div>
                                                <h1 className="text-2xl font-bold text-gray-900">آنالیتیک کمپین</h1>
                                                <p className="text-sm text-gray-600 mt-1">
                                                        تجزیه‌وتحلیل تفصیلی عملکرد کمپین‌های اطلاع‌رسانی
                                                </p>
                                        </div>

                                        <div className="flex items-center space-x-3 space-x-reverse">
                                                {/* Campaign Selector */}
                                                <select
                                                        value={selectedCampaign}
                                                        onChange={(e) => setSelectedCampaign(e.target.value)}
                                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                        {availableCampaigns.map(campaign => (
                                                                <option key={campaign.id} value={campaign.id}>
                                                                        {campaign.name}
                                                                </option>
                                                        ))}
                                                </select>

                                                {/* Timeframe Filter */}
                                                <select
                                                        value={timeframe}
                                                        onChange={(e) => setTimeframe(e.target.value as any)}
                                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                        <option value="1h">ساعت گذشته</option>
                                                        <option value="24h">۲۴ ساعت گذشته</option>
                                                        <option value="7d">۷ روز گذشته</option>
                                                        <option value="30d">۳۰ روز گذشته</option>
                                                </select>

                                                {/* Compare Toggle */}
                                                <label className="flex items-center">
                                                        <input
                                                                type="checkbox"
                                                                checked={compareMode}
                                                                onChange={(e) => setCompareMode(e.target.checked)}
                                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                                        />
                                                        <span className="mr-2 text-sm text-gray-700">مقایسه</span>
                                                </label>
                                        </div>
                                </div>
                        </div>

                        {/* Campaign Overview */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-6">
                                        <div>
                                                <h2 className="text-xl font-semibold text-gray-900">{analytics.campaignName}</h2>
                                                <div className="flex items-center mt-2 space-x-4 space-x-reverse">
                                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${analytics.status === 'active' ? 'bg-green-100 text-green-800' :
                                                                analytics.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                                                        analytics.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                                                                                'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                {analytics.status === 'active' ? 'فعال' :
                                                                        analytics.status === 'completed' ? 'تکمیل شده' :
                                                                                analytics.status === 'paused' ? 'متوقف' : 'پیش‌نویس'}
                                                        </span>
                                                        <span className="text-sm text-gray-600">
                                                                نوع: {analytics.type === 'promotional' ? 'تبلیغاتی' :
                                                                        analytics.type === 'transactional' ? 'تراکنشی' : 'خبرنامه'}
                                                        </span>
                                                </div>
                                        </div>

                                        <div className="text-left">
                                                <p className="text-sm text-gray-600">امتیاز مشارکت</p>
                                                <p className="text-3xl font-bold text-blue-600">{analytics.audienceInsights.engagementScore}</p>
                                        </div>
                                </div>

                                {/* Performance Metrics */}
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-600">ارسال شده</p>
                                                <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.performance.sent)}</p>
                                        </div>
                                        <div className="text-center p-4 bg-green-50 rounded-lg">
                                                <p className="text-sm text-gray-600">تحویل شده</p>
                                                <p className="text-2xl font-bold text-green-600">{formatPercent(analytics.performance.deliveryRate)}</p>
                                                <p className="text-sm text-gray-500">{formatNumber(analytics.performance.delivered)}</p>
                                        </div>
                                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                                                <p className="text-sm text-gray-600">باز شده</p>
                                                <p className="text-2xl font-bold text-orange-600">{formatPercent(analytics.performance.openRate)}</p>
                                                <p className="text-sm text-gray-500">{formatNumber(analytics.performance.opened)}</p>
                                        </div>
                                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                                                <p className="text-sm text-gray-600">کلیک شده</p>
                                                <p className="text-2xl font-bold text-purple-600">{formatPercent(analytics.performance.clickRate)}</p>
                                                <p className="text-sm text-gray-500">{formatNumber(analytics.performance.clicked)}</p>
                                        </div>
                                        <div className="text-center p-4 bg-red-50 rounded-lg">
                                                <p className="text-sm text-gray-600">برگشتی</p>
                                                <p className="text-2xl font-bold text-red-600">{formatPercent(analytics.performance.bounceRate)}</p>
                                                <p className="text-sm text-gray-500">{formatNumber(analytics.performance.bounced)}</p>
                                        </div>
                                </div>
                        </div>

                        {/* Timeline Chart */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">روند زمانی کمپین</h3>
                                <Line data={timelineChartData} options={chartOptions} />
                        </div>

                        {/* Analytics Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Channel Performance */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">عملکرد کانال‌ها</h3>
                                        <Bar data={channelChartData} options={chartOptions} />
                                </div>

                                {/* Device Breakdown */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">تفکیک دستگاه</h3>
                                        <Pie data={deviceChartData} options={pieOptions} />
                                </div>
                        </div>

                        {/* Additional Analytics */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Location Analytics */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">پراکندگی جغرافیایی</h3>
                                        <Pie data={locationChartData} options={pieOptions} />
                                </div>

                                {/* Link Performance */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">عملکرد لینک‌ها</h3>
                                        <div className="space-y-3">
                                                {Object.entries(analytics.contentAnalysis.linkClicks).map(([url, data]) => (
                                                        <div key={url} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                                <div>
                                                                        <p className="text-sm font-medium text-gray-900">{url}</p>
                                                                        <p className="text-xs text-gray-600">کلیک‌های یکتا: {data.uniqueClicks}</p>
                                                                </div>
                                                                <div className="text-left">
                                                                        <p className="text-lg font-bold text-blue-600">{data.clicks}</p>
                                                                        <p className="text-xs text-gray-500">کل کلیک</p>
                                                                </div>
                                                        </div>
                                                ))}
                                        </div>
                                </div>
                        </div>

                        {/* A/B Testing Results */}
                        {analytics.contentAnalysis.subjectLines && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">نتایج A/B Testing - خط موضوع</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {Object.entries(analytics.contentAnalysis.subjectLines).map(([subject, data]) => (
                                                        <div key={subject} className="p-4 border border-gray-200 rounded-lg">
                                                                <h4 className="font-medium text-gray-900 mb-2">{subject}</h4>
                                                                <div className="flex justify-between items-center">
                                                                        <span className="text-sm text-gray-600">ارسال: {formatNumber(data.sent)}</span>
                                                                        <span className={`px-2 py-1 rounded text-sm font-medium ${data.openRate > 60 ? 'bg-green-100 text-green-800' :
                                                                                data.openRate > 50 ? 'bg-yellow-100 text-yellow-800' :
                                                                                        'bg-red-100 text-red-800'
                                                                                }`}>
                                                                                نرخ باز کردن: {formatPercent(data.openRate)}
                                                                        </span>
                                                                </div>
                                                        </div>
                                                ))}
                                        </div>
                                </div>
                        )}

                        {/* Audience Insights */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">تحلیل مخاطبان</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="text-center">
                                                <p className="text-3xl font-bold text-blue-600">{formatNumber(analytics.audienceInsights.totalRecipients)}</p>
                                                <p className="text-sm text-gray-600">کل دریافت‌کنندگان</p>
                                        </div>
                                        <div className="text-center">
                                                <p className="text-3xl font-bold text-green-600">{formatNumber(analytics.audienceInsights.newSubscribers)}</p>
                                                <p className="text-sm text-gray-600">مشترک جدید</p>
                                        </div>
                                        <div className="text-center">
                                                <p className="text-3xl font-bold text-purple-600">{analytics.audienceInsights.engagementScore}</p>
                                                <p className="text-sm text-gray-600">امتیاز مشارکت</p>
                                        </div>
                                </div>

                                <div className="mt-6">
                                        <h4 className="text-sm font-medium text-gray-900 mb-3">تفکیک سنی</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {Object.entries(analytics.audienceInsights.demographicBreakdown).map(([age, percentage]) => (
                                                        <div key={age} className="text-center p-3 bg-gray-50 rounded-lg">
                                                                <p className="text-lg font-bold text-gray-900">{percentage}%</p>
                                                                <p className="text-xs text-gray-600">{age} سال</p>
                                                        </div>
                                                ))}
                                        </div>
                                </div>
                        </div>

                        {/* Export Actions */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">اقدامات</h3>
                                <div className="flex flex-wrap gap-3">
                                        <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100">
                                                دانلود گزارش PDF
                                        </button>
                                        <button className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100">
                                                صدور Excel
                                        </button>
                                        <button className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100">
                                                ایجاد کمپین مشابه
                                        </button>
                                        <button className="px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100">
                                                بهینه‌سازی خودکار
                                        </button>
                                </div>
                        </div>
                </div>
        );
};

export default CampaignAnalytics; 