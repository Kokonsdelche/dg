import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
import { adminAPI } from '../services/api';
import {
        Notification,
        NotificationTemplate,
        NotificationCampaign,
        NotificationFilters,
        NotificationStats,
        EmailSettings,
        SMSSettings
} from '../types';

interface UseAdminNotificationsReturn {
        // Data
        notifications: Notification[];
        templates: NotificationTemplate[];
        campaigns: NotificationCampaign[];
        stats: NotificationStats;
        loading: boolean;
        error: string | null;
        filters: NotificationFilters;
        unreadCount: number;
        totalPages: number;

        // Basic Operations
        refreshData: () => Promise<void>;
        changeFilters: (newFilters: Partial<NotificationFilters>) => void;
        resetFilters: () => void;

        // Notification Operations
        markAsRead: (notificationId: string) => Promise<void>;
        markAllAsRead: () => Promise<void>;
        deleteNotification: (notificationId: string) => Promise<void>;
        performBulkOperation: (data: { action: string; notificationIds: string[] }) => Promise<void>;

        // Template Operations
        createTemplate: (data: any) => Promise<void>;
        updateTemplate: (templateId: string, data: any) => Promise<void>;
        deleteTemplate: (templateId: string) => Promise<void>;
        duplicateTemplate: (templateId: string) => Promise<void>;
        previewTemplate: (templateId: string, data?: any) => Promise<any>;
        testTemplate: (templateId: string, data: any) => Promise<void>;
        templateStats: any;
        refreshTemplates: () => Promise<void>;

        // Campaign Operations
        createCampaign: (data: any) => Promise<void>;
        updateCampaign: (campaignId: string, data: any) => Promise<void>;
        deleteCampaign: (campaignId: string) => Promise<void>;

        // Settings Operations
        updateSettings: (data: any) => Promise<void>;
        updateEmailSettings: (data: Partial<EmailSettings>) => Promise<void>;
        updateSMSSettings: (data: Partial<SMSSettings>) => Promise<void>;
        refreshSettings: () => Promise<void>;
}

export const useAdminNotifications = (): UseAdminNotificationsReturn => {
        // State
        const [notifications, setNotifications] = useState<Notification[]>([]);
        const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
        const [campaigns, setCampaigns] = useState<NotificationCampaign[]>([]);
        const [stats, setStats] = useState<NotificationStats>({
                total: 0,
                unread: 0,
                delivered: 0,
                failed: 0,
                sent: 0,
                pending: 0,
                read: 0,
                deliveryRate: 0,
                readRate: 0,
                overview: {
                        totalSent: 0,
                        totalDelivered: 0,
                        totalRead: 0,
                        totalFailed: 0,
                }
        });
        const [templateStats, setTemplateStats] = useState<any>({});
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState<string | null>(null);
        const [filters, setFilters] = useState<NotificationFilters>({
                search: '',
                status: 'all',
                type: 'all',
                priority: 'all',
                channel: 'all',
                recipient: 'all',
                sortBy: 'createdAt',
                sortOrder: 'desc',
                page: 1,
                limit: 20,
        });
        const [totalPages, setTotalPages] = useState(1);

        // Socket connection
        const socketRef = useRef<Socket | null>(null);

        // Computed values
        const unreadCount = useMemo(() => {
                return notifications.filter(n => n.status === 'unread').length;
        }, [notifications]);

        // Fetch notifications
        const fetchNotifications = useCallback(async () => {
                try {
                        setLoading(true);
                        setError(null);
                        const response = await adminAPI.notifications.getNotifications(filters);
                        setNotifications(response.data.notifications || []);
                        setTotalPages(response.data.totalPages || 1);
                } catch (err: any) {
                        setError(err.message || 'خطا در بارگیری اطلاع‌رسانی‌ها');
                        console.error('Error fetching notifications:', err);
                } finally {
                        setLoading(false);
                }
        }, [filters]);

        // Fetch templates
        const fetchTemplates = useCallback(async () => {
                try {
                        const response = await adminAPI.notifications.getTemplates();
                        setTemplates(response.data.templates || []);
                } catch (err: any) {
                        console.error('Error fetching templates:', err);
                }
        }, []);

        // Fetch campaigns
        const fetchCampaigns = useCallback(async () => {
                try {
                        const response = await adminAPI.notifications.getCampaigns();
                        setCampaigns(response.data.campaigns || []);
                } catch (err: any) {
                        console.error('Error fetching campaigns:', err);
                }
        }, []);

        // Fetch stats
        const fetchStats = useCallback(async () => {
                try {
                        const response = await adminAPI.notifications.getStats();
                        setStats(response.data || stats);
                } catch (err: any) {
                        console.error('Error fetching stats:', err);
                }
        }, []);

        // Fetch template stats
        const fetchTemplateStats = useCallback(async () => {
                try {
                        const response = await adminAPI.notifications.getTemplateStats();
                        setTemplateStats(response.data || {});
                } catch (err: any) {
                        console.error('Error fetching template stats:', err);
                }
        }, []);

        // Main data refresh
        const refreshData = useCallback(async () => {
                await Promise.all([
                        fetchNotifications(),
                        fetchStats(),
                ]);
        }, [fetchNotifications, fetchStats]);

        // Refresh templates
        const refreshTemplates = useCallback(async () => {
                await Promise.all([
                        fetchTemplates(),
                        fetchTemplateStats(),
                ]);
        }, [fetchTemplates, fetchTemplateStats]);

        // Refresh settings
        const refreshSettings = useCallback(async () => {
                // This would fetch settings if needed
                return Promise.resolve();
        }, []);

        // Change filters
        const changeFilters = useCallback((newFilters: Partial<NotificationFilters>) => {
                setFilters(prev => ({ ...prev, ...newFilters }));
        }, []);

        // Reset filters
        const resetFilters = useCallback(() => {
                setFilters({
                        search: '',
                        status: 'all',
                        type: 'all',
                        priority: 'all',
                        channel: 'all',
                        recipient: 'all',
                        sortBy: 'createdAt',
                        sortOrder: 'desc',
                        page: 1,
                        limit: 20,
                });
        }, []);

        // Mark as read
        const markAsRead = useCallback(async (notificationId: string) => {
                try {
                        await adminAPI.notifications.markAsRead(notificationId);
                        setNotifications(prev =>
                                prev.map(n =>
                                        n._id === notificationId
                                                ? { ...n, status: 'read' as const, readAt: new Date().toISOString() }
                                                : n
                                )
                        );
                        toast.success('اطلاع‌رسانی به عنوان خوانده شده علامت‌گذاری شد');
                } catch (err: any) {
                        toast.error('خطا در علامت‌گذاری اطلاع‌رسانی');
                        console.error('Error marking as read:', err);
                }
        }, []);

        // Mark all as read
        const markAllAsRead = useCallback(async () => {
                try {
                        await adminAPI.notifications.markAllAsRead();
                        setNotifications(prev =>
                                prev.map(n => ({ ...n, status: 'read' as const, readAt: new Date().toISOString() }))
                        );
                        toast.success('تمام اطلاع‌رسانی‌ها به عنوان خوانده شده علامت‌گذاری شدند');
                } catch (err: any) {
                        toast.error('خطا در علامت‌گذاری اطلاع‌رسانی‌ها');
                        console.error('Error marking all as read:', err);
                }
        }, []);

        // Delete notification
        const deleteNotification = useCallback(async (notificationId: string) => {
                try {
                        await adminAPI.notifications.deleteNotification(notificationId);
                        setNotifications(prev => prev.filter(n => n._id !== notificationId));
                        toast.success('اطلاع‌رسانی حذف شد');
                } catch (err: any) {
                        toast.error('خطا در حذف اطلاع‌رسانی');
                        console.error('Error deleting notification:', err);
                }
        }, []);

        // Bulk operations
        const performBulkOperation = useCallback(async (data: { action: string; notificationIds: string[] }) => {
                try {
                        await adminAPI.notifications.bulkOperation(data);
                        await refreshData();
                        toast.success('عملیات دسته‌ای با موفقیت انجام شد');
                } catch (err: any) {
                        toast.error('خطا در انجام عملیات دسته‌ای');
                        console.error('Error performing bulk operation:', err);
                }
        }, [refreshData]);

        // Template operations
        const createTemplate = useCallback(async (data: any) => {
                try {
                        await adminAPI.notifications.createTemplate(data);
                        await refreshTemplates();
                        toast.success('قالب جدید ایجاد شد');
                } catch (err: any) {
                        toast.error('خطا در ایجاد قالب');
                        console.error('Error creating template:', err);
                }
        }, [refreshTemplates]);

        const updateTemplate = useCallback(async (templateId: string, data: any) => {
                try {
                        await adminAPI.notifications.updateTemplate(templateId, data);
                        await refreshTemplates();
                        toast.success('قالب به‌روزرسانی شد');
                } catch (err: any) {
                        toast.error('خطا در به‌روزرسانی قالب');
                        console.error('Error updating template:', err);
                }
        }, [refreshTemplates]);

        const deleteTemplate = useCallback(async (templateId: string) => {
                try {
                        await adminAPI.notifications.deleteTemplate(templateId);
                        await refreshTemplates();
                        toast.success('قالب حذف شد');
                } catch (err: any) {
                        toast.error('خطا در حذف قالب');
                        console.error('Error deleting template:', err);
                }
        }, [refreshTemplates]);

        const duplicateTemplate = useCallback(async (templateId: string) => {
                try {
                        await adminAPI.notifications.duplicateTemplate(templateId);
                        await refreshTemplates();
                        toast.success('قالب کپی شد');
                } catch (err: any) {
                        toast.error('خطا در کپی قالب');
                        console.error('Error duplicating template:', err);
                }
        }, [refreshTemplates]);

        const previewTemplate = useCallback(async (templateId: string, data?: any) => {
                try {
                        const response = await adminAPI.notifications.previewTemplate(templateId, data);
                        return response.data;
                } catch (err: any) {
                        toast.error('خطا در پیش‌نمایش قالب');
                        console.error('Error previewing template:', err);
                        throw err;
                }
        }, []);

        const testTemplate = useCallback(async (templateId: string, data: any) => {
                try {
                        await adminAPI.notifications.testTemplate(templateId, data);
                        toast.success('قالب تست شد');
                } catch (err: any) {
                        toast.error('خطا در تست قالب');
                        console.error('Error testing template:', err);
                }
        }, []);

        // Campaign operations
        const createCampaign = useCallback(async (data: any) => {
                try {
                        await adminAPI.notifications.createCampaign(data);
                        await fetchCampaigns();
                        toast.success('کمپین جدید ایجاد شد');
                } catch (err: any) {
                        toast.error('خطا در ایجاد کمپین');
                        console.error('Error creating campaign:', err);
                }
        }, [fetchCampaigns]);

        const updateCampaign = useCallback(async (campaignId: string, data: any) => {
                try {
                        await adminAPI.notifications.updateCampaign(campaignId, data);
                        await fetchCampaigns();
                        toast.success('کمپین به‌روزرسانی شد');
                } catch (err: any) {
                        toast.error('خطا در به‌روزرسانی کمپین');
                        console.error('Error updating campaign:', err);
                }
        }, [fetchCampaigns]);

        const deleteCampaign = useCallback(async (campaignId: string) => {
                try {
                        await adminAPI.notifications.deleteCampaign(campaignId);
                        await fetchCampaigns();
                        toast.success('کمپین حذف شد');
                } catch (err: any) {
                        toast.error('خطا در حذف کمپین');
                        console.error('Error deleting campaign:', err);
                }
        }, [fetchCampaigns]);

        // Settings operations
        const updateSettings = useCallback(async (data: any) => {
                try {
                        await adminAPI.notifications.updateNotificationSettings(data);
                        toast.success('تنظیمات به‌روزرسانی شد');
                } catch (err: any) {
                        toast.error('خطا در به‌روزرسانی تنظیمات');
                        console.error('Error updating settings:', err);
                }
        }, []);

        const updateEmailSettings = useCallback(async (data: Partial<EmailSettings>) => {
                try {
                        await adminAPI.notifications.updateEmailSettings(data);
                        toast.success('تنظیمات ایمیل به‌روزرسانی شد');
                } catch (err: any) {
                        toast.error('خطا در به‌روزرسانی تنظیمات ایمیل');
                        console.error('Error updating email settings:', err);
                }
        }, []);

        const updateSMSSettings = useCallback(async (data: Partial<SMSSettings>) => {
                try {
                        await adminAPI.notifications.updateSMSSettings(data);
                        toast.success('تنظیمات پیامک به‌روزرسانی شد');
                } catch (err: any) {
                        toast.error('خطا در به‌روزرسانی تنظیمات پیامک');
                        console.error('Error updating SMS settings:', err);
                }
        }, []);

        // Initial data load
        useEffect(() => {
                refreshData();
        }, [refreshData]);

        // Setup socket connection
        useEffect(() => {
                if (typeof window !== 'undefined') {
                        const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
                                auth: {
                                        token: localStorage.getItem('adminToken'),
                                },
                        });

                        socketRef.current = socket;

                        socket.on('notification:new', (notification: Notification) => {
                                setNotifications(prev => [notification, ...prev]);
                                setStats(prev => ({ ...prev, total: prev.total + 1, unread: prev.unread + 1 }));
                        });

                        socket.on('notification:updated', (notification: Notification) => {
                                setNotifications(prev =>
                                        prev.map(n => n._id === notification._id ? notification : n)
                                );
                        });

                        socket.on('notification:deleted', (notificationId: string) => {
                                setNotifications(prev => prev.filter(n => n._id !== notificationId));
                        });

                        return () => {
                                socket.disconnect();
                        };
                }
        }, []);

        return {
                // Data
                notifications,
                templates,
                campaigns,
                stats,
                loading,
                error,
                filters,
                unreadCount,
                totalPages,

                // Basic Operations
                refreshData,
                changeFilters,
                resetFilters,

                // Notification Operations
                markAsRead,
                markAllAsRead,
                deleteNotification,
                performBulkOperation,

                // Template Operations
                createTemplate,
                updateTemplate,
                deleteTemplate,
                duplicateTemplate,
                previewTemplate,
                testTemplate,
                templateStats,
                refreshTemplates,

                // Campaign Operations
                createCampaign,
                updateCampaign,
                deleteCampaign,

                // Settings Operations
                updateSettings,
                updateEmailSettings,
                updateSMSSettings,
                refreshSettings,
        };
}; 