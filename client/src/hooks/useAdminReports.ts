import { useCallback, useEffect } from 'react';
import {
        useReportsData,
        useAdminActions,
        ReportsData,
        ReportFilters,
        SalesData,
        ProductAnalytics,
        CustomerAnalytics
} from '../store/adminStore';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useAdminReports = () => {
        const { data, loading, error, filters } = useReportsData();
        const {
                setReportsData,
                setReportsLoading,
                setReportsError,
                setReportFilters,
                resetReportsState
        } = useAdminActions();

        // Fetch reports data
        const fetchReportsData = useCallback(async (customFilters?: Partial<ReportFilters>) => {
                setReportsLoading(true);
                setReportsError(null);

                try {
                        const params = {
                                startDate: customFilters?.dateRange?.startDate || filters.dateRange.startDate,
                                endDate: customFilters?.dateRange?.endDate || filters.dateRange.endDate,
                                period: customFilters?.period || filters.period,
                                category: customFilters?.category,
                                productId: customFilters?.productId,
                        };

                        const response = await adminAPI.reports.getAnalytics(params);
                        setReportsData(response.data);

                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || 'خطا در دریافت گزارشات';
                        setReportsError(errorMessage);
                        toast.error(errorMessage);
                } finally {
                        setReportsLoading(false);
                }
        }, [filters, setReportsData, setReportsLoading, setReportsError]);

        // Update filters and fetch data
        const updateFilters = useCallback((newFilters: Partial<ReportFilters>) => {
                setReportFilters(newFilters);
                fetchReportsData(newFilters);
        }, [setReportFilters, fetchReportsData]);

        // Change date range
        const changeDateRange = useCallback((startDate: Date, endDate: Date) => {
                updateFilters({
                        dateRange: { startDate, endDate }
                });
        }, [updateFilters]);

        // Change period
        const changePeriod = useCallback((period: 'daily' | 'weekly' | 'monthly' | 'yearly') => {
                updateFilters({ period });
        }, [updateFilters]);

        // Filter by category
        const filterByCategory = useCallback((category?: string) => {
                updateFilters({ category });
        }, [updateFilters]);

        // Filter by product
        const filterByProduct = useCallback((productId?: string) => {
                updateFilters({ productId });
        }, [updateFilters]);

        // Export data functions
        const exportToCSV = useCallback(async () => {
                try {
                        setReportsLoading(true);
                        const response = await adminAPI.reports.exportCSV({
                                startDate: filters.dateRange.startDate,
                                endDate: filters.dateRange.endDate,
                                period: filters.period,
                                category: filters.category,
                                productId: filters.productId,
                        });

                        // Create download link
                        const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
                        const link = document.createElement('a');
                        const url = URL.createObjectURL(blob);
                        link.setAttribute('href', url);
                        link.setAttribute('download', `گزارش-فروش-${Date.now()}.csv`);
                        link.style.visibility = 'hidden';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        toast.success('گزارش با موفقیت دانلود شد');
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || 'خطا در دانلود گزارش';
                        toast.error(errorMessage);
                } finally {
                        setReportsLoading(false);
                }
        }, [filters, setReportsLoading]);

        const exportToPDF = useCallback(async () => {
                try {
                        setReportsLoading(true);
                        const response = await adminAPI.reports.exportPDF({
                                startDate: filters.dateRange.startDate,
                                endDate: filters.dateRange.endDate,
                                period: filters.period,
                                category: filters.category,
                                productId: filters.productId,
                        });

                        // Create download link
                        const blob = new Blob([response.data], { type: 'application/pdf' });
                        const link = document.createElement('a');
                        const url = URL.createObjectURL(blob);
                        link.setAttribute('href', url);
                        link.setAttribute('download', `گزارش-فروش-${Date.now()}.pdf`);
                        link.style.visibility = 'hidden';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        toast.success('گزارش PDF با موفقیت دانلود شد');
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || 'خطا در دانلود گزارش PDF';
                        toast.error(errorMessage);
                } finally {
                        setReportsLoading(false);
                }
        }, [filters, setReportsLoading]);

        // Refresh data
        const refreshData = useCallback(() => {
                fetchReportsData();
        }, [fetchReportsData]);

        // Reset filters
        const resetFilters = useCallback(() => {
                resetReportsState();
        }, [resetReportsState]);

        // Calculate statistics
        const getStatistics = useCallback(() => {
                if (!data) return null;

                const { salesData, customerAnalytics, revenueGrowth } = data;

                // Calculate totals
                const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
                const totalOrders = salesData.reduce((sum, item) => sum + item.orders, 0);
                const totalCustomers = salesData.reduce((sum, item) => sum + item.customers, 0);

                // Calculate averages
                const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
                const averageDailyRevenue = salesData.length > 0 ? totalRevenue / salesData.length : 0;
                const averageDailyOrders = salesData.length > 0 ? totalOrders / salesData.length : 0;

                // Growth calculations
                const revenueGrowthPercentage = revenueGrowth.percentage;
                const isPositiveGrowth = revenueGrowthPercentage > 0;

                return {
                        totals: {
                                revenue: totalRevenue,
                                orders: totalOrders,
                                customers: totalCustomers,
                                uniqueCustomers: customerAnalytics.totalCustomers,
                        },
                        averages: {
                                orderValue: averageOrderValue,
                                dailyRevenue: averageDailyRevenue,
                                dailyOrders: averageDailyOrders,
                                customerLifetimeValue: customerAnalytics.customerLifetimeValue,
                        },
                        growth: {
                                revenue: revenueGrowthPercentage,
                                isPositive: isPositiveGrowth,
                                current: revenueGrowth.current,
                                previous: revenueGrowth.previous,
                        },
                        customers: {
                                total: customerAnalytics.totalCustomers,
                                new: customerAnalytics.newCustomers,
                                returning: customerAnalytics.returningCustomers,
                                newPercentage: customerAnalytics.totalCustomers > 0
                                        ? (customerAnalytics.newCustomers / customerAnalytics.totalCustomers) * 100
                                        : 0,
                                returningPercentage: customerAnalytics.totalCustomers > 0
                                        ? (customerAnalytics.returningCustomers / customerAnalytics.totalCustomers) * 100
                                        : 0,
                        }
                };
        }, [data]);

        // Format chart data
        const getChartData = useCallback(() => {
                if (!data) return null;

                return {
                        sales: data.salesData,
                        products: data.topSellingProducts,
                        revenueComparison: [
                                {
                                        period: 'دوره جاری',
                                        current: data.revenueGrowth.current,
                                        previous: 0
                                },
                                {
                                        period: 'دوره قبل',
                                        current: 0,
                                        previous: data.revenueGrowth.previous
                                }
                        ]
                };
        }, [data]);

        // Auto-refresh on mount
        useEffect(() => {
                if (!data) {
                        fetchReportsData();
                }
        }, [data, fetchReportsData]);

        return {
                // Data
                data,
                loading,
                error,
                filters,
                statistics: getStatistics(),
                chartData: getChartData(),

                // Actions
                fetchReportsData,
                refreshData,
                resetFilters,

                // Filters
                updateFilters,
                changeDateRange,
                changePeriod,
                filterByCategory,
                filterByProduct,

                // Export
                exportToCSV,
                exportToPDF,

                // Utilities
                hasData: !!data && data.salesData.length > 0,
                isEmpty: !data || data.salesData.length === 0,
                isInitialLoad: !data && loading,
        };
}; 