import React from 'react';
import {
        Chart as ChartJS,
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        BarElement,
        ArcElement,
        Title,
        Tooltip,
        Legend,
        Filler,
} from 'chart.js';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        BarElement,
        ArcElement,
        Title,
        Tooltip,
        Legend,
        Filler
);

interface ChartProps {
        type: 'line' | 'bar' | 'doughnut' | 'pie';
        data: any;
        options?: any;
        height?: number;
        className?: string;
        title?: string;
}

const Chart: React.FC<ChartProps> = ({
        type,
        data,
        options = {},
        height = 300,
        className = '',
        title
}) => {
        // Default Persian/RTL optimized options
        const defaultOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                        legend: {
                                position: 'top' as const,
                                align: 'center' as const,
                                labels: {
                                        usePointStyle: true,
                                        padding: 20,
                                        font: {
                                                family: 'system-ui, -apple-system, sans-serif',
                                                size: 12,
                                        },
                                        generateLabels: (chart: any) => {
                                                const labels = ChartJS.defaults.plugins.legend.labels.generateLabels(chart);
                                                // Ensure Persian text is displayed correctly
                                                return labels.map((label: any) => ({
                                                        ...label,
                                                        text: label.text || 'نامشخص'
                                                }));
                                        }
                                }
                        },
                        tooltip: {
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                titleColor: '#fff',
                                bodyColor: '#fff',
                                borderColor: '#374151',
                                borderWidth: 1,
                                cornerRadius: 8,
                                displayColors: true,
                                titleFont: {
                                        family: 'system-ui, -apple-system, sans-serif',
                                        size: 14,
                                        weight: 'bold' as const,
                                },
                                bodyFont: {
                                        family: 'system-ui, -apple-system, sans-serif',
                                        size: 13,
                                },
                                callbacks: {
                                        label: function (context: any) {
                                                let label = context.dataset.label || '';
                                                if (label) {
                                                        label += ': ';
                                                }
                                                if (context.parsed.y !== null) {
                                                        // Format numbers with Persian locale
                                                        label += new Intl.NumberFormat('fa-IR').format(context.parsed.y);
                                                }
                                                return label;
                                        }
                                }
                        },
                        title: {
                                display: !!title,
                                text: title,
                                font: {
                                        family: 'system-ui, -apple-system, sans-serif',
                                        size: 16,
                                        weight: 'bold' as const,
                                },
                                color: '#374151',
                                padding: {
                                        top: 10,
                                        bottom: 30
                                }
                        }
                },
                scales: type === 'line' || type === 'bar' ? {
                        x: {
                                grid: {
                                        display: true,
                                        color: 'rgba(156, 163, 175, 0.1)',
                                },
                                ticks: {
                                        font: {
                                                family: 'system-ui, -apple-system, sans-serif',
                                                size: 11,
                                        },
                                        color: '#6B7280',
                                        maxRotation: 45,
                                        minRotation: 0
                                }
                        },
                        y: {
                                grid: {
                                        display: true,
                                        color: 'rgba(156, 163, 175, 0.1)',
                                },
                                ticks: {
                                        font: {
                                                family: 'system-ui, -apple-system, sans-serif',
                                                size: 11,
                                        },
                                        color: '#6B7280',
                                        callback: function (value: any) {
                                                // Format numbers with Persian locale
                                                return new Intl.NumberFormat('fa-IR').format(value);
                                        }
                                }
                        }
                } : {},
                ...options
        };

        const containerStyle = {
                height: `${height}px`,
                position: 'relative' as const,
                direction: 'ltr' as const, // Charts work better with LTR
        };

        const renderChart = () => {
                switch (type) {
                        case 'line':
                                return <Line data={data} options={defaultOptions} />;
                        case 'bar':
                                return <Bar data={data} options={defaultOptions} />;
                        case 'doughnut':
                                return <Doughnut data={data} options={defaultOptions} />;
                        case 'pie':
                                return <Pie data={data} options={defaultOptions} />;
                        default:
                                return <Line data={data} options={defaultOptions} />;
                }
        };

        return (
                <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
                        <div style={containerStyle}>
                                {renderChart()}
                        </div>
                </div>
        );
};

// Pre-configured chart components for common use cases
export const SalesChart: React.FC<{
        data: Array<{ date: string; revenue: number; orders: number }>;
        period: 'daily' | 'weekly' | 'monthly' | 'yearly';
        className?: string;
}> = ({ data, period, className }) => {
        const chartData = {
                labels: data.map(item => {
                        const date = new Date(item.date);
                        switch (period) {
                                case 'daily':
                                        return date.toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' });
                                case 'weekly':
                                        return `هفته ${Math.ceil(date.getDate() / 7)}`;
                                case 'monthly':
                                        return date.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long' });
                                case 'yearly':
                                        return date.toLocaleDateString('fa-IR', { year: 'numeric' });
                                default:
                                        return date.toLocaleDateString('fa-IR');
                        }
                }),
                datasets: [
                        {
                                label: 'درآمد (تومان)',
                                data: data.map(item => item.revenue),
                                borderColor: 'rgb(147, 51, 234)',
                                backgroundColor: 'rgba(147, 51, 234, 0.1)',
                                tension: 0.4,
                                fill: true,
                                pointBackgroundColor: 'rgb(147, 51, 234)',
                                pointBorderColor: '#fff',
                                pointBorderWidth: 2,
                                pointRadius: 4,
                                pointHoverRadius: 6,
                        },
                        {
                                label: 'تعداد سفارش',
                                data: data.map(item => item.orders),
                                borderColor: 'rgb(34, 197, 94)',
                                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                tension: 0.4,
                                fill: false,
                                pointBackgroundColor: 'rgb(34, 197, 94)',
                                pointBorderColor: '#fff',
                                pointBorderWidth: 2,
                                pointRadius: 4,
                                pointHoverRadius: 6,
                        }
                ]
        };

        return (
                <Chart
                        type="line"
                        data={chartData}
                        title={`نمودار فروش (${period === 'daily' ? 'روزانه' : period === 'weekly' ? 'هفتگی' : period === 'monthly' ? 'ماهانه' : 'سالانه'})`}
                        className={className}
                        height={350}
                />
        );
};

export const ProductAnalyticsChart: React.FC<{
        data: Array<{ name: string; totalSold: number; revenue: number }>;
        className?: string;
}> = ({ data, className }) => {
        const chartData = {
                labels: data.map(item => item.name),
                datasets: [
                        {
                                label: 'تعداد فروش',
                                data: data.map(item => item.totalSold),
                                backgroundColor: [
                                        'rgba(147, 51, 234, 0.8)',
                                        'rgba(34, 197, 94, 0.8)',
                                        'rgba(249, 115, 22, 0.8)',
                                        'rgba(239, 68, 68, 0.8)',
                                        'rgba(59, 130, 246, 0.8)',
                                        'rgba(168, 85, 247, 0.8)',
                                        'rgba(34, 197, 94, 0.8)',
                                        'rgba(251, 191, 36, 0.8)',
                                ],
                                borderColor: [
                                        'rgb(147, 51, 234)',
                                        'rgb(34, 197, 94)',
                                        'rgb(249, 115, 22)',
                                        'rgb(239, 68, 68)',
                                        'rgb(59, 130, 246)',
                                        'rgb(168, 85, 247)',
                                        'rgb(34, 197, 94)',
                                        'rgb(251, 191, 36)',
                                ],
                                borderWidth: 2,
                        }
                ]
        };

        return (
                <Chart
                        type="doughnut"
                        data={chartData}
                        title="محصولات پرفروش"
                        className={className}
                        height={300}
                />
        );
};

export const RevenueGrowthChart: React.FC<{
        data: Array<{ period: string; current: number; previous: number }>;
        className?: string;
}> = ({ data, className }) => {
        const chartData = {
                labels: data.map(item => item.period),
                datasets: [
                        {
                                label: 'دوره جاری',
                                data: data.map(item => item.current),
                                backgroundColor: 'rgba(147, 51, 234, 0.8)',
                                borderColor: 'rgb(147, 51, 234)',
                                borderWidth: 1,
                        },
                        {
                                label: 'دوره قبل',
                                data: data.map(item => item.previous),
                                backgroundColor: 'rgba(156, 163, 175, 0.8)',
                                borderColor: 'rgb(156, 163, 175)',
                                borderWidth: 1,
                        }
                ]
        };

        return (
                <Chart
                        type="bar"
                        data={chartData}
                        title="مقایسه درآمد"
                        className={className}
                        height={300}
                />
        );
};

export default Chart; 