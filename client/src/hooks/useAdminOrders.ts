import { useState, useCallback, useEffect } from 'react';
import { useAdminStore, useOrdersData, useAdminActions, Order } from '../store/adminStore';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useAdminOrders = () => {
        const { orders, loading, error, filters } = useOrdersData();
        const {
                setOrders,
                setOrdersLoading,
                setOrdersError,
                setOrderFilters,
                updateOrderStatus,
                resetOrdersState
        } = useAdminActions();

        // Fetch orders with filters
        const fetchOrders = useCallback(async (customFilters?: Partial<typeof filters>) => {
                setOrdersLoading(true);
                setOrdersError(null);

                try {
                        const params = {
                                page: filters.page,
                                limit: filters.limit,
                                status: filters.status !== 'all' ? filters.status : undefined,
                                search: filters.search || undefined,
                                ...customFilters
                        };

                        const response = await adminAPI.getOrders(params);
                        const ordersData = response.data?.data?.orders || response.data?.orders || response.data || [];
                        setOrders(ordersData);
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || err.message || 'خطا در دریافت سفارشات';
                        setOrdersError(errorMessage);
                        toast.error(errorMessage);
                } finally {
                        setOrdersLoading(false);
                }
        }, [filters, setOrders, setOrdersLoading, setOrdersError]);

        // Change order status
        const changeOrderStatus = useCallback(async (
                orderId: string,
                newStatus: Order['orderStatus'],
                trackingNumber?: string,
                note?: string
        ) => {
                try {
                        await adminAPI.updateOrderStatus(orderId, {
                                status: newStatus,
                                trackingNumber,
                                note
                        });

                        // Update local state
                        updateOrderStatus(orderId, newStatus, trackingNumber);

                        toast.success('وضعیت سفارش با موفقیت تغییر یافت');

                        // Refresh orders list
                        fetchOrders();
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || err.message || 'خطا در تغییر وضعیت سفارش';
                        toast.error(errorMessage);
                }
        }, [updateOrderStatus, fetchOrders]);

        // Update filters
        const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
                setOrderFilters(newFilters);
        }, [setOrderFilters]);

        // Search orders
        const searchOrders = useCallback((searchTerm: string) => {
                updateFilters({ search: searchTerm, page: 1 });
        }, [updateFilters]);

        // Filter by status
        const filterByStatus = useCallback((status: string) => {
                updateFilters({ status, page: 1 });
        }, [updateFilters]);

        // Change page
        const changePage = useCallback((page: number) => {
                updateFilters({ page });
        }, [updateFilters]);

        // Reset filters
        const resetFilters = useCallback(() => {
                updateFilters({
                        status: 'all',
                        search: '',
                        page: 1,
                        dateFrom: undefined,
                        dateTo: undefined
                });
        }, [updateFilters]);

        // Bulk status update
        const bulkUpdateStatus = useCallback(async (
                orderIds: string[],
                newStatus: Order['orderStatus']
        ) => {
                try {
                        setOrdersLoading(true);

                        // Update each order
                        await Promise.all(
                                orderIds.map(orderId =>
                                        adminAPI.updateOrderStatus(orderId, { status: newStatus })
                                )
                        );

                        toast.success(`وضعیت ${orderIds.length} سفارش با موفقیت تغییر یافت`);

                        // Refresh orders
                        fetchOrders();
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || err.message || 'خطا در به‌روزرسانی انبوه';
                        toast.error(errorMessage);
                } finally {
                        setOrdersLoading(false);
                }
        }, [fetchOrders, setOrdersLoading]);

        // Cancel order
        const cancelOrder = useCallback(async (orderId: string, reason?: string) => {
                try {
                        await changeOrderStatus(orderId, 'cancelled');
                        toast.success('سفارش با موفقیت لغو شد');
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || err.message || 'خطا در لغو سفارش';
                        toast.error(errorMessage);
                }
        }, [changeOrderStatus]);

        // Refund order
        const refundOrder = useCallback(async (orderId: string, amount?: number, reason?: string) => {
                try {
                        await adminAPI.refundOrder(orderId, { amount, reason });
                        toast.success('بازپرداخت با موفقیت انجام شد');
                        fetchOrders();
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || err.message || 'خطا در بازپرداخت';
                        toast.error(errorMessage);
                }
        }, [fetchOrders]);

        // Export orders
        const exportOrders = useCallback(async (format: 'csv' | 'excel' | 'pdf' = 'csv') => {
                try {
                        const response = await adminAPI.exportOrders(format, filters);

                        // Create download link
                        const blob = new Blob([response.data], {
                                type: format === 'pdf' ? 'application/pdf' : 'application/octet-stream'
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `orders-${new Date().toISOString().split('T')[0]}.${format}`;
                        a.click();
                        URL.revokeObjectURL(url);

                        toast.success('خروجی سفارشات با موفقیت دانلود شد');
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || err.message || 'خطا در خروجی گیری';
                        toast.error(errorMessage);
                }
        }, [filters]);

        // Send order notification
        const sendOrderNotification = useCallback(async (orderId: string, type: string, message?: string) => {
                try {
                        await adminAPI.sendOrderNotification(orderId, { type, message });
                        toast.success('اطلاع‌رسانی با موفقیت ارسال شد');
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || err.message || 'خطا در ارسال اطلاع‌رسانی';
                        toast.error(errorMessage);
                }
        }, []);

        // Print order label
        const printOrderLabel = useCallback(async (orderId: string) => {
                try {
                        const response = await adminAPI.printOrderLabel(orderId);

                        // Open print dialog
                        const blob = new Blob([response.data], { type: 'application/pdf' });
                        const url = URL.createObjectURL(blob);
                        window.open(url, '_blank');
                        URL.revokeObjectURL(url);

                        toast.success('برچسب سفارش آماده چاپ است');
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || err.message || 'خطا در تولید برچسب';
                        toast.error(errorMessage);
                }
        }, []);

        // Track order
        const trackOrder = useCallback(async (orderId: string) => {
                try {
                        const response = await adminAPI.trackOrder(orderId);
                        return response.data.tracking;
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || err.message || 'خطا در پیگیری سفارش';
                        toast.error(errorMessage);
                        throw err;
                }
        }, []);

        // Get order statistics
        const getOrderStats = useCallback(() => {
                return {
                        total: orders.length,
                        pending: orders.filter(o => o.orderStatus === 'pending').length,
                        processing: orders.filter(o => o.orderStatus === 'processing').length,
                        shipped: orders.filter(o => o.orderStatus === 'shipped').length,
                        delivered: orders.filter(o => o.orderStatus === 'delivered').length,
                        cancelled: orders.filter(o => o.orderStatus === 'cancelled').length,
                };
        }, [orders]);

        // Auto-fetch on mount and filter changes
        useEffect(() => {
                fetchOrders();
        }, [filters.page, filters.status, filters.search]);

        // Cleanup on unmount
        useEffect(() => {
                return () => {
                        resetOrdersState();
                };
        }, [resetOrdersState]);

        return {
                // Data
                orders,
                allOrders: orders,
                loading,
                error,
                filters,
                stats: getOrderStats(),
                totalPages: Math.ceil(orders.length / filters.limit),

                // Actions
                fetchOrders,
                changeOrderStatus,
                updateFilters,
                searchOrders,
                filterByStatus,
                changePage,
                resetFilters,
                bulkUpdateStatus,
                cancelOrder,
                refundOrder,
                exportOrders,
                sendOrderNotification,
                printOrderLabel,
                trackOrder,

                // Utility
                refreshData: () => fetchOrders(),
                resetState: resetOrdersState
        };
}; 