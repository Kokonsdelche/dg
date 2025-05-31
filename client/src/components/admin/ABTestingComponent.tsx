import React, { useState, useEffect } from 'react';
import { useAdminNotifications } from '../../hooks/useAdminNotifications';
import LoadingSpinner from '../common/LoadingSpinner';
import { Line, Bar } from 'react-chartjs-2';

interface ABTest {
        id: string;
        name: string;
        description: string;
        status: 'draft' | 'running' | 'completed' | 'paused';
        type: 'subject_line' | 'content' | 'send_time' | 'channel' | 'template';

        variants: {
                id: string;
                name: string;
                isControl: boolean;
                trafficPercentage: number;

                // Email specific
                subject?: string;
                content?: string;

                // Timing specific
                sendTime?: string;

                // Channel specific
                channel?: 'email' | 'sms' | 'push';

                // Template specific
                templateId?: string;
        }[];

        configuration: {
                audienceSize: number;
                duration: number; // in hours
                confidenceLevel: number; // 90, 95, 99
                minSampleSize: number;
                significanceThreshold: number;
                autoWinner: boolean;
        };

        results: {
                [variantId: string]: {
                        sent: number;
                        delivered: number;
                        opened: number;
                        clicked: number;
                        converted: number;

                        deliveryRate: number;
                        openRate: number;
                        clickRate: number;
                        conversionRate: number;

                        confidenceInterval: {
                                lower: number;
                                upper: number;
                        };
                };
        };

        timeline: {
                labels: string[];
                data: {
                        [variantId: string]: number[];
                };
        };

        winner?: {
                variantId: string;
                metric: string;
                improvement: number;
                confidence: number;
        };

        createdAt: Date;
        startedAt?: Date;
        completedAt?: Date;
}

const ABTestingComponent: React.FC = () => {
        const adminNotifications = useAdminNotifications();
        const loading = adminNotifications?.loading || false;

        const [tests, setTests] = useState<ABTest[]>([
                {
                        id: 'test-1',
                        name: 'تست خط موضوع تخفیف',
                        description: 'مقایسه عملکرد دو خط موضوع مختلف برای کمپین تخفیف پاییزه',
                        status: 'running',
                        type: 'subject_line',

                        variants: [
                                {
                                        id: 'variant-a',
                                        name: 'کنترل - تخفیف ۵۰٪',
                                        isControl: true,
                                        trafficPercentage: 50,
                                        subject: 'تخفیف ۵۰٪ ویژه پاییز!',
                                        content: 'محتوای ایمیل تخفیف...'
                                },
                                {
                                        id: 'variant-b',
                                        name: 'تست - فرصت طلایی',
                                        isControl: false,
                                        trafficPercentage: 50,
                                        subject: 'فرصت طلایی برای خرید با تخفیف!',
                                        content: 'محتوای ایمیل تخفیف...'
                                }
                        ],

                        configuration: {
                                audienceSize: 5000,
                                duration: 48,
                                confidenceLevel: 95,
                                minSampleSize: 1000,
                                significanceThreshold: 0.05,
                                autoWinner: true
                        },

                        results: {
                                'variant-a': {
                                        sent: 2500,
                                        delivered: 2400,
                                        opened: 1440,
                                        clicked: 360,
                                        converted: 72,
                                        deliveryRate: 96.0,
                                        openRate: 60.0,
                                        clickRate: 25.0,
                                        conversionRate: 5.0,
                                        confidenceInterval: { lower: 58.2, upper: 61.8 }
                                },
                                'variant-b': {
                                        sent: 2500,
                                        delivered: 2375,
                                        opened: 1663,
                                        clicked: 428,
                                        converted: 95,
                                        deliveryRate: 95.0,
                                        openRate: 70.0,
                                        clickRate: 25.7,
                                        conversionRate: 5.7,
                                        confidenceInterval: { lower: 68.1, upper: 71.9 }
                                }
                        },

                        timeline: {
                                labels: ['ساعت 1', 'ساعت 6', 'ساعت 12', 'ساعت 18', 'ساعت 24', 'ساعت 30', 'ساعت 36', 'ساعت 42'],
                                data: {
                                        'variant-a': [8.5, 25.3, 42.1, 52.8, 58.2, 59.7, 59.9, 60.0],
                                        'variant-b': [12.1, 32.5, 51.2, 62.4, 67.1, 69.2, 69.8, 70.0]
                                }
                        },

                        winner: {
                                variantId: 'variant-b',
                                metric: 'openRate',
                                improvement: 16.7,
                                confidence: 98.5
                        },

                        createdAt: new Date('2024-12-18'),
                        startedAt: new Date('2024-12-19'),
                }
        ]);

        const [activeTest, setActiveTest] = useState<string>('test-1');
        const [activeTab, setActiveTab] = useState<'overview' | 'create' | 'results' | 'settings'>('overview');
        const [showCreateModal, setShowCreateModal] = useState(false);

        // New test form
        const [newTest, setNewTest] = useState<Partial<ABTest>>({
                name: '',
                description: '',
                type: 'subject_line',
                variants: [
                        { id: 'variant-a', name: 'کنترل', isControl: true, trafficPercentage: 50 },
                        { id: 'variant-b', name: 'تست', isControl: false, trafficPercentage: 50 }
                ],
                configuration: {
                        audienceSize: 1000,
                        duration: 24,
                        confidenceLevel: 95,
                        minSampleSize: 100,
                        significanceThreshold: 0.05,
                        autoWinner: false
                }
        });

        const currentTest = tests.find(t => t.id === activeTest);

        // Chart configurations
        const timelineChartData = currentTest ? {
                labels: currentTest.timeline.labels,
                datasets: currentTest.variants.map((variant, index) => ({
                        label: variant.name,
                        data: currentTest.timeline.data[variant.id] || [],
                        borderColor: index === 0 ? 'rgb(59, 130, 246)' : 'rgb(16, 185, 129)',
                        backgroundColor: index === 0 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                }))
        } : null;

        const variantsComparisonData = currentTest ? {
                labels: ['نرخ تحویل', 'نرخ باز کردن', 'نرخ کلیک', 'نرخ تبدیل'],
                datasets: currentTest.variants.map((variant, index) => {
                        const results = currentTest.results[variant.id];
                        return {
                                label: variant.name,
                                data: results ? [
                                        results.deliveryRate,
                                        results.openRate,
                                        results.clickRate,
                                        results.conversionRate
                                ] : [0, 0, 0, 0],
                                backgroundColor: index === 0 ? 'rgba(59, 130, 246, 0.8)' : 'rgba(16, 185, 129, 0.8)',
                        };
                })
        } : null;

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
                                max: 100,
                                ticks: {
                                        callback: (value: any) => value + '%'
                                }
                        },
                },
        };

        // Statistical significance calculation
        const calculateSignificance = (variantA: any, variantB: any, metric: string) => {
                if (!variantA || !variantB) return null;

                const rateA = variantA[metric] / 100;
                const rateB = variantB[metric] / 100;
                const nA = variantA.sent;
                const nB = variantB.sent;

                const pooledRate = (rateA * nA + rateB * nB) / (nA + nB);
                const standardError = Math.sqrt(pooledRate * (1 - pooledRate) * (1 / nA + 1 / nB));
                const zScore = Math.abs(rateA - rateB) / standardError;

                // Approximate p-value calculation
                const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));
                const confidence = (1 - pValue) * 100;

                return {
                        zScore,
                        pValue,
                        confidence,
                        significant: pValue < 0.05
                };
        };

        // Normal CDF approximation
        const normalCDF = (x: number) => {
                return 0.5 * (1 + erf(x / Math.sqrt(2)));
        };

        const erf = (x: number) => {
                const a1 = 0.254829592;
                const a2 = -0.284496736;
                const a3 = 1.421413741;
                const a4 = -1.453152027;
                const a5 = 1.061405429;
                const p = 0.3275911;

                const sign = x >= 0 ? 1 : -1;
                x = Math.abs(x);

                const t = 1.0 / (1.0 + p * x);
                const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

                return sign * y;
        };

        // Create new test
        const createTest = () => {
                if (!newTest.name || !newTest.description) {
                        alert('لطفاً نام و توضیحات تست را وارد کنید');
                        return;
                }

                const test: ABTest = {
                        id: `test-${Date.now()}`,
                        name: newTest.name,
                        description: newTest.description,
                        status: 'draft',
                        type: newTest.type || 'subject_line',
                        variants: newTest.variants || [],
                        configuration: newTest.configuration!,
                        results: {},
                        timeline: { labels: [], data: {} },
                        createdAt: new Date()
                };

                setTests(prev => [...prev, test]);
                setShowCreateModal(false);
                setActiveTest(test.id);
        };

        // Start test
        const startTest = (testId: string) => {
                setTests(prev => prev.map(test =>
                        test.id === testId
                                ? { ...test, status: 'running', startedAt: new Date() }
                                : test
                ));
        };

        // Pause test
        const pauseTest = (testId: string) => {
                setTests(prev => prev.map(test =>
                        test.id === testId
                                ? { ...test, status: 'paused' }
                                : test
                ));
        };

        // Complete test
        const completeTest = (testId: string) => {
                setTests(prev => prev.map(test =>
                        test.id === testId
                                ? { ...test, status: 'completed', completedAt: new Date() }
                                : test
                ));
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
                                                <h1 className="text-2xl font-bold text-gray-900">A/B Testing</h1>
                                                <p className="text-sm text-gray-600 mt-1">
                                                        بهینه‌سازی کمپین‌ها با تست تقسیمی
                                                </p>
                                        </div>

                                        <div className="flex items-center space-x-3 space-x-reverse">
                                                <select
                                                        value={activeTest}
                                                        onChange={(e) => setActiveTest(e.target.value)}
                                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                        {tests.map(test => (
                                                                <option key={test.id} value={test.id}>
                                                                        {test.name}
                                                                </option>
                                                        ))}
                                                </select>

                                                <button
                                                        onClick={() => setShowCreateModal(true)}
                                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                        ایجاد تست جدید
                                                </button>
                                        </div>
                                </div>
                        </div>

                        {/* Test Overview */}
                        {currentTest && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                        <div className="flex items-center justify-between mb-6">
                                                <div>
                                                        <h2 className="text-xl font-semibold text-gray-900">{currentTest.name}</h2>
                                                        <p className="text-sm text-gray-600 mt-1">{currentTest.description}</p>

                                                        <div className="flex items-center mt-3 space-x-4 space-x-reverse">
                                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${currentTest.status === 'running' ? 'bg-green-100 text-green-800' :
                                                                        currentTest.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                                                                currentTest.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                                                                                        'bg-gray-100 text-gray-800'
                                                                        }`}>
                                                                        {currentTest.status === 'running' ? 'در حال اجرا' :
                                                                                currentTest.status === 'completed' ? 'تکمیل شده' :
                                                                                        currentTest.status === 'paused' ? 'متوقف' : 'پیش‌نویس'}
                                                                </span>

                                                                <span className="text-sm text-gray-600">
                                                                        نوع: {currentTest.type === 'subject_line' ? 'خط موضوع' :
                                                                                currentTest.type === 'content' ? 'محتوا' :
                                                                                        currentTest.type === 'send_time' ? 'زمان ارسال' :
                                                                                                currentTest.type === 'channel' ? 'کانال' : 'قالب'}
                                                                </span>

                                                                <span className="text-sm text-gray-600">
                                                                        مخاطبان: {currentTest.configuration.audienceSize.toLocaleString('fa-IR')}
                                                                </span>
                                                        </div>
                                                </div>

                                                <div className="flex items-center space-x-2 space-x-reverse">
                                                        {currentTest.status === 'draft' && (
                                                                <button
                                                                        onClick={() => startTest(currentTest.id)}
                                                                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                                                                >
                                                                        شروع تست
                                                                </button>
                                                        )}

                                                        {currentTest.status === 'running' && (
                                                                <>
                                                                        <button
                                                                                onClick={() => pauseTest(currentTest.id)}
                                                                                className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700"
                                                                        >
                                                                                توقف
                                                                        </button>
                                                                        <button
                                                                                onClick={() => completeTest(currentTest.id)}
                                                                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                                                        >
                                                                                پایان تست
                                                                        </button>
                                                                </>
                                                        )}
                                                </div>
                                        </div>

                                        {/* Test Progress */}
                                        {currentTest.status === 'running' && (
                                                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                                                        <div className="flex items-center justify-between mb-2">
                                                                <span className="text-sm font-medium text-blue-900">پیشرفت تست</span>
                                                                <span className="text-sm text-blue-700">
                                                                        {Math.min(100, Math.round((Date.now() - (currentTest.startedAt?.getTime() || 0)) / (currentTest.configuration.duration * 60 * 60 * 1000) * 100))}%
                                                                </span>
                                                        </div>
                                                        <div className="w-full bg-blue-200 rounded-full h-2">
                                                                <div
                                                                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                                                        style={{
                                                                                width: `${Math.min(100, Math.round((Date.now() - (currentTest.startedAt?.getTime() || 0)) / (currentTest.configuration.duration * 60 * 60 * 1000) * 100))}%`
                                                                        }}
                                                                ></div>
                                                        </div>
                                                </div>
                                        )}

                                        {/* Winner Declaration */}
                                        {currentTest.winner && (
                                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                                        <div className="flex items-center">
                                                                <svg className="w-5 h-5 text-green-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                <div>
                                                                        <p className="text-sm font-medium text-green-900">برنده تست مشخص شد!</p>
                                                                        <p className="text-sm text-green-700">
                                                                                {currentTest.variants.find(v => v.id === currentTest.winner?.variantId)?.name} با
                                                                                {currentTest.winner.improvement.toFixed(1)}% بهبود در {currentTest.winner.metric}
                                                                                (اطمینان: {currentTest.winner.confidence.toFixed(1)}%)
                                                                        </p>
                                                                </div>
                                                        </div>
                                                </div>
                                        )}

                                        {/* Variants Results */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                {currentTest.variants.map((variant) => {
                                                        const results = currentTest.results[variant.id];
                                                        const isWinner = currentTest.winner?.variantId === variant.id;

                                                        return (
                                                                <div
                                                                        key={variant.id}
                                                                        className={`p-4 border-2 rounded-lg ${isWinner ? 'border-green-500 bg-green-50' :
                                                                                variant.isControl ? 'border-blue-500 bg-blue-50' :
                                                                                        'border-gray-200 bg-gray-50'
                                                                                }`}
                                                                >
                                                                        <div className="flex items-center justify-between mb-3">
                                                                                <h3 className="font-medium text-gray-900">{variant.name}</h3>
                                                                                <div className="flex items-center space-x-2 space-x-reverse">
                                                                                        {variant.isControl && (
                                                                                                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">کنترل</span>
                                                                                        )}
                                                                                        {isWinner && (
                                                                                                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">برنده</span>
                                                                                        )}
                                                                                        <span className="text-sm text-gray-600">{variant.trafficPercentage}%</span>
                                                                                </div>
                                                                        </div>

                                                                        {results && (
                                                                                <div className="space-y-2">
                                                                                        <div className="flex justify-between text-sm">
                                                                                                <span className="text-gray-600">ارسال شده:</span>
                                                                                                <span className="font-medium">{results.sent.toLocaleString('fa-IR')}</span>
                                                                                        </div>
                                                                                        <div className="flex justify-between text-sm">
                                                                                                <span className="text-gray-600">نرخ تحویل:</span>
                                                                                                <span className="font-medium">{results.deliveryRate.toFixed(1)}%</span>
                                                                                        </div>
                                                                                        <div className="flex justify-between text-sm">
                                                                                                <span className="text-gray-600">نرخ باز کردن:</span>
                                                                                                <span className="font-medium">{results.openRate.toFixed(1)}%</span>
                                                                                        </div>
                                                                                        <div className="flex justify-between text-sm">
                                                                                                <span className="text-gray-600">نرخ کلیک:</span>
                                                                                                <span className="font-medium">{results.clickRate.toFixed(1)}%</span>
                                                                                        </div>
                                                                                        <div className="flex justify-between text-sm">
                                                                                                <span className="text-gray-600">نرخ تبدیل:</span>
                                                                                                <span className="font-medium">{results.conversionRate.toFixed(1)}%</span>
                                                                                        </div>

                                                                                        {/* Confidence Interval */}
                                                                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                                                                                <div className="text-xs text-gray-500">
                                                                                                        بازه اطمینان ۹۵٪: {results.confidenceInterval.lower.toFixed(1)}% - {results.confidenceInterval.upper.toFixed(1)}%
                                                                                                </div>
                                                                                        </div>
                                                                                </div>
                                                                        )}

                                                                        {/* Variant Content */}
                                                                        <div className="mt-4 pt-3 border-t border-gray-200">
                                                                                {variant.subject && (
                                                                                        <div className="text-xs text-gray-600 mb-1">
                                                                                                <strong>موضوع:</strong> {variant.subject}
                                                                                        </div>
                                                                                )}
                                                                                {variant.content && (
                                                                                        <div className="text-xs text-gray-600">
                                                                                                <strong>محتوا:</strong> {variant.content.substring(0, 100)}...
                                                                                        </div>
                                                                                )}
                                                                                {variant.sendTime && (
                                                                                        <div className="text-xs text-gray-600">
                                                                                                <strong>زمان ارسال:</strong> {variant.sendTime}
                                                                                        </div>
                                                                                )}
                                                                                {variant.channel && (
                                                                                        <div className="text-xs text-gray-600">
                                                                                                <strong>کانال:</strong> {variant.channel}
                                                                                        </div>
                                                                                )}
                                                                        </div>
                                                                </div>
                                                        );
                                                })}
                                        </div>

                                        {/* Statistical Significance */}
                                        {currentTest.variants.length === 2 && (
                                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                                        <h4 className="text-sm font-medium text-gray-900 mb-3">تحلیل آماری</h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                                                {['deliveryRate', 'openRate', 'clickRate', 'conversionRate'].map(metric => {
                                                                        const significance = calculateSignificance(
                                                                                currentTest.results[currentTest.variants[0].id],
                                                                                currentTest.results[currentTest.variants[1].id],
                                                                                metric
                                                                        );

                                                                        const metricNames = {
                                                                                deliveryRate: 'تحویل',
                                                                                openRate: 'باز کردن',
                                                                                clickRate: 'کلیک',
                                                                                conversionRate: 'تبدیل'
                                                                        };

                                                                        return (
                                                                                <div key={metric} className="text-center">
                                                                                        <div className="font-medium text-gray-900">{metricNames[metric as keyof typeof metricNames]}</div>
                                                                                        {significance && (
                                                                                                <>
                                                                                                        <div className={`text-lg font-bold ${significance.significant ? 'text-green-600' : 'text-red-600'}`}>
                                                                                                                {significance.confidence.toFixed(1)}%
                                                                                                        </div>
                                                                                                        <div className="text-xs text-gray-500">
                                                                                                                {significance.significant ? 'معنادار' : 'غیرمعنادار'}
                                                                                                        </div>
                                                                                                </>
                                                                                        )}
                                                                                </div>
                                                                        );
                                                                })}
                                                        </div>
                                                </div>
                                        )}

                                        {/* Charts */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                {/* Timeline Chart */}
                                                {timelineChartData && (
                                                        <div>
                                                                <h4 className="text-lg font-medium text-gray-900 mb-4">روند زمانی نرخ باز کردن</h4>
                                                                <Line data={timelineChartData} options={chartOptions} />
                                                        </div>
                                                )}

                                                {/* Comparison Chart */}
                                                {variantsComparisonData && (
                                                        <div>
                                                                <h4 className="text-lg font-medium text-gray-900 mb-4">مقایسه عملکرد</h4>
                                                                <Bar data={variantsComparisonData} options={chartOptions} />
                                                        </div>
                                                )}
                                        </div>
                                </div>
                        )}

                        {/* Create Test Modal */}
                        {showCreateModal && (
                                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                                        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                                                <div className="mt-3">
                                                        <h3 className="text-lg font-medium text-gray-900 mb-4">ایجاد تست A/B جدید</h3>

                                                        <div className="space-y-4">
                                                                <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">نام تست</label>
                                                                        <input
                                                                                type="text"
                                                                                value={newTest.name || ''}
                                                                                onChange={(e) => setNewTest(prev => ({ ...prev, name: e.target.value }))}
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                placeholder="نام تست را وارد کنید"
                                                                        />
                                                                </div>

                                                                <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
                                                                        <textarea
                                                                                value={newTest.description || ''}
                                                                                onChange={(e) => setNewTest(prev => ({ ...prev, description: e.target.value }))}
                                                                                rows={3}
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                placeholder="توضیحات تست"
                                                                        />
                                                                </div>

                                                                <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">نوع تست</label>
                                                                        <select
                                                                                value={newTest.type || 'subject_line'}
                                                                                onChange={(e) => setNewTest(prev => ({ ...prev, type: e.target.value as any }))}
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                        >
                                                                                <option value="subject_line">خط موضوع</option>
                                                                                <option value="content">محتوا</option>
                                                                                <option value="send_time">زمان ارسال</option>
                                                                                <option value="channel">کانال</option>
                                                                                <option value="template">قالب</option>
                                                                        </select>
                                                                </div>

                                                                <div className="grid grid-cols-2 gap-4">
                                                                        <div>
                                                                                <label className="block text-sm font-medium text-gray-700 mb-2">تعداد مخاطبان</label>
                                                                                <input
                                                                                        type="number"
                                                                                        min="100"
                                                                                        max="100000"
                                                                                        value={newTest.configuration?.audienceSize || 1000}
                                                                                        onChange={(e) => setNewTest(prev => ({
                                                                                                ...prev,
                                                                                                configuration: { ...prev.configuration!, audienceSize: parseInt(e.target.value) }
                                                                                        }))}
                                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                />
                                                                        </div>

                                                                        <div>
                                                                                <label className="block text-sm font-medium text-gray-700 mb-2">مدت زمان (ساعت)</label>
                                                                                <input
                                                                                        type="number"
                                                                                        min="1"
                                                                                        max="168"
                                                                                        value={newTest.configuration?.duration || 24}
                                                                                        onChange={(e) => setNewTest(prev => ({
                                                                                                ...prev,
                                                                                                configuration: { ...prev.configuration!, duration: parseInt(e.target.value) }
                                                                                        }))}
                                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                />
                                                                        </div>
                                                                </div>
                                                        </div>

                                                        <div className="flex items-center justify-end space-x-3 space-x-reverse mt-6">
                                                                <button
                                                                        onClick={() => setShowCreateModal(false)}
                                                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                                                >
                                                                        انصراف
                                                                </button>
                                                                <button
                                                                        onClick={createTest}
                                                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                                                >
                                                                        ایجاد تست
                                                                </button>
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        )}
                </div>
        );
};

export default ABTestingComponent; 