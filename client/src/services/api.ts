import axios from 'axios';
import { AuthResponse, User, Product, Order, CartItem, Address } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
        baseURL: API_BASE_URL,
        timeout: 30000,
        headers: {
                'Content-Type': 'application/json',
        },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
        (config) => {
                const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
                if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
        },
        (error) => {
                return Promise.reject(error);
        }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
        (response) => response,
        (error) => {
                if (error.response?.status === 401) {
                        // Handle unauthorized access
                        localStorage.removeItem('adminToken');
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.href = '/login';
                }
                return Promise.reject(error);
        }
);

// Auth API
export const authAPI = {
        register: async (userData: {
                firstName: string;
                lastName: string;
                email: string;
                phone: string;
                password: string;
        }): Promise<AuthResponse> => {
                const response = await apiClient.post('/auth/register', userData);
                return response.data;
        },

        login: async (credentials: {
                email: string;
                password: string;
        }): Promise<AuthResponse> => {
                const response = await apiClient.post('/auth/login', credentials);
                return response.data;
        },

        getProfile: async (): Promise<{ user: User }> => {
                const response = await apiClient.get('/auth/profile');
                return response.data;
        },

        updateProfile: async (userData: Partial<User>): Promise<{ user: User }> => {
                const response = await apiClient.put('/auth/profile', userData);
                return response.data;
        },

        changePassword: async (passwords: {
                currentPassword: string;
                newPassword: string;
        }): Promise<{ message: string }> => {
                const response = await apiClient.put('/auth/change-password', passwords);
                return response.data;
        },
};

// Products API
export const productsAPI = {
        getAll: async (params?: {
                page?: number;
                limit?: number;
                category?: string;
                minPrice?: number;
                maxPrice?: number;
                search?: string;
                sortBy?: string;
                sortOrder?: string;
                isFeatured?: boolean;
        }) => {
                const response = await apiClient.get('/products', { params });
                return response.data;
        },

        getProducts: async (params?: {
                page?: number;
                limit?: number;
                category?: string;
                minPrice?: number;
                maxPrice?: number;
                search?: string;
                sortBy?: string;
                sortOrder?: string;
                isFeatured?: boolean;
        }) => {
                const response = await apiClient.get('/products', { params });
                return response.data;
        },

        getProduct: async (id: string): Promise<{ product: Product }> => {
                const response = await apiClient.get(`/products/${id}`);
                return response.data;
        },

        getFeaturedProducts: async (): Promise<{ products: Product[] }> => {
                const response = await apiClient.get('/products/featured/list');
                return response.data;
        },

        getCategories: async (): Promise<{ categories: string[] }> => {
                const response = await apiClient.get('/products/categories/list');
                return response.data;
        },

        addReview: async (productId: string, review: {
                rating: number;
                comment: string;
        }) => {
                const response = await apiClient.post(`/products/${productId}/reviews`, review);
                return response.data;
        },

        searchProducts: async (query: string, params?: {
                page?: number;
                limit?: number;
        }) => {
                const response = await apiClient.get(`/products/search/${query}`, { params });
                return response.data;
        },
};

// Orders API
export const ordersAPI = {
        createOrder: async (orderData: {
                items: CartItem[];
                shippingAddress: Address;
                paymentMethod: 'zarinpal' | 'cash_on_delivery';
        }) => {
                const response = await apiClient.post('/orders', orderData);
                return response.data;
        },

        getUserOrders: async (params?: {
                page?: number;
                limit?: number;
        }) => {
                const response = await apiClient.get('/orders/my-orders', { params });
                return response.data;
        },

        getMyOrders: async (params?: {
                page?: number;
                limit?: number;
        }) => {
                const response = await apiClient.get('/orders/my-orders', { params });
                return response.data;
        },

        getOrder: async (id: string): Promise<{ order: Order }> => {
                const response = await apiClient.get(`/orders/${id}`);
                return response.data;
        },

        cancelOrder: async (id: string, cancelReason: string) => {
                const response = await apiClient.put(`/orders/${id}/cancel`, { cancelReason });
                return response.data;
        },

        trackOrder: async (id: string) => {
                const response = await apiClient.get(`/orders/${id}/track`);
                return response.data;
        },
};

// Admin API
export const adminAPI = {
        getDashboard: async () => {
                const response = await apiClient.get('/admin/dashboard');
                return response.data;
        },

        getDashboardStats: async () => {
                const response = await apiClient.get('/admin/dashboard-public');
                return response.data;
        },

        // Products management
        getAllProducts: () => apiClient.get('/admin/products'),
        createProduct: async (productData: FormData) => {
                const response = await apiClient.post('/admin/products', productData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                });
                return response.data;
        },
        updateProduct: async (id: string, productData: FormData) => {
                const response = await apiClient.put(`/admin/products/${id}`, productData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                });
                return response.data;
        },
        deleteProduct: async (id: string) => {
                const response = await apiClient.delete(`/admin/products/${id}`);
                return response.data;
        },

        // Orders management
        getAllOrders: () => apiClient.get('/admin/orders'),
        getOrders: (params?: {
                page?: number;
                limit?: number;
                status?: string;
        }) => apiClient.get('/admin/orders', { params }),
        updateOrderStatus: async (orderId: string, data: {
                status: string;
                trackingNumber?: string;
                note?: string;
        }) => {
                const response = await apiClient.patch(`/admin/orders/${orderId}/status`, data);
                return response.data;
        },
        deleteOrder: (orderId: string) => apiClient.delete(`/admin/orders/${orderId}`),

        // Additional Order Methods
        refundOrder: async (orderId: string, data: { amount?: number; reason?: string }) => {
                const response = await apiClient.post(`/admin/orders/${orderId}/refund`, data);
                return response.data;
        },
        exportOrders: (format: 'csv' | 'excel' | 'pdf', filters?: any) => {
                return apiClient.get('/admin/orders/export', {
                        params: { format, ...filters },
                        responseType: 'blob'
                });
        },
        sendOrderNotification: async (orderId: string, data: { type: string; message?: string }) => {
                const response = await apiClient.post(`/admin/orders/${orderId}/notification`, data);
                return response.data;
        },
        printOrderLabel: (orderId: string) => {
                return apiClient.get(`/admin/orders/${orderId}/label`, { responseType: 'blob' });
        },
        trackOrder: async (orderId: string) => {
                const response = await apiClient.get(`/admin/orders/${orderId}/track`);
                return response.data;
        },

        // Users management
        getAllUsers: () => apiClient.get('/admin/users'),
        getUsers: (params?: {
                page?: number;
                limit?: number;
        }) => apiClient.get('/admin/users', { params }),
        updateUserRole: (userId: string, role: string) => apiClient.patch(`/admin/users/${userId}/role`, { role }),
        deleteUser: (userId: string) => apiClient.delete(`/admin/users/${userId}`),
        toggleUserStatus: async (id: string) => {
                const response = await apiClient.patch(`/admin/users/${id}/toggle-status`);
                return response.data;
        },

        // Products (Admin)
        getProducts: (params?: any) => apiClient.get('/admin/products', { params }),
        getProductById: (productId: string) => apiClient.get(`/admin/products/${productId}`),
        uploadProductImages: (productId: string, formData: FormData) => apiClient.post(`/admin/products/${productId}/images`, formData, {
                headers: {
                        'Content-Type': 'multipart/form-data',
                },
        }),

        // Categories
        getCategories: () => apiClient.get('/admin/categories'),
        createCategory: (data: any) => apiClient.post('/admin/categories', data),
        updateCategory: (categoryId: string, data: any) => apiClient.patch(`/admin/categories/${categoryId}`, data),
        deleteCategory: (categoryId: string) => apiClient.delete(`/admin/categories/${categoryId}`),

        // Analytics
        getSalesData: (params?: { period?: string; startDate?: string; endDate?: string }) => apiClient.get('/admin/analytics/sales', { params }),
        getTopProducts: (params?: { limit?: number; period?: string }) => apiClient.get('/admin/analytics/top-products', { params }),
        getCustomerStats: () => apiClient.get('/admin/analytics/customers'),

        // Settings
        getSettings: () => apiClient.get('/admin/settings'),
        updateSettings: (data: any) => apiClient.patch('/admin/settings', data),

        // Content Management
        getBanners: () => apiClient.get('/admin/banners'),
        createBanner: (data: any) => apiClient.post('/admin/banners', data),
        updateBanner: (bannerId: string, data: any) => apiClient.patch(`/admin/banners/${bannerId}`, data),
        deleteBanner: (bannerId: string) => apiClient.delete(`/admin/banners/${bannerId}`),

        // Comments/Reviews
        getComments: (params?: any) => apiClient.get('/admin/comments', { params }),
        approveComment: (commentId: string) => apiClient.patch(`/admin/comments/${commentId}/approve`),
        rejectComment: (commentId: string) => apiClient.patch(`/admin/comments/${commentId}/reject`),
        deleteComment: (commentId: string) => apiClient.delete(`/admin/comments/${commentId}`),

        // Comments Management - Comprehensive
        comments: {
                // Basic CRUD Operations
                getComments: (filters?: any) =>
                        apiClient.get('/admin/comments', {
                                params: {
                                        page: filters?.page || 1,
                                        limit: filters?.limit || 20,
                                        status: filters?.status || 'all',
                                        search: filters?.search || '',
                                        sortBy: filters?.sortBy || 'createdAt',
                                        sortOrder: filters?.sortOrder || 'desc',
                                        product: filters?.product,
                                        author: filters?.author,
                                        rating: filters?.rating,
                                        sentiment: filters?.sentiment,
                                        hasReplies: filters?.hasReplies,
                                        isReply: filters?.isReply,
                                        startDate: filters?.dateRange?.startDate?.toISOString(),
                                        endDate: filters?.dateRange?.endDate?.toISOString(),
                                        tags: filters?.tags?.join(','),
                                        isSpam: filters?.moderationFlags?.isSpam,
                                        isOffensive: filters?.moderationFlags?.isOffensive,
                                        isReported: filters?.moderationFlags?.isReported,
                                }
                        }),

                getCommentById: (commentId: string) =>
                        apiClient.get(`/admin/comments/${commentId}`),

                createComment: (commentData: any) =>
                        apiClient.post('/admin/comments', commentData),

                updateComment: (commentId: string, updateData: any) =>
                        apiClient.put(`/admin/comments/${commentId}`, updateData),

                deleteComment: (commentId: string, permanent: boolean = false) =>
                        apiClient.delete(`/admin/comments/${commentId}`, {
                                data: { permanent }
                        }),

                // Moderation Actions
                approveComment: (commentId: string, note?: string) =>
                        apiClient.patch(`/admin/comments/${commentId}/approve`, { note }),

                rejectComment: (commentId: string, reason?: string) =>
                        apiClient.patch(`/admin/comments/${commentId}/reject`, { reason }),

                markAsSpam: (commentId: string) =>
                        apiClient.patch(`/admin/comments/${commentId}/spam`),

                restoreComment: (commentId: string) =>
                        apiClient.patch(`/admin/comments/${commentId}/restore`),

                // Bulk Operations
                bulkOperation: (operation: any) =>
                        apiClient.post('/admin/comments/bulk', operation),

                bulkApprove: (commentIds: string[], note?: string) =>
                        apiClient.post('/admin/comments/bulk/approve', { commentIds, note }),

                bulkReject: (commentIds: string[], reason?: string) =>
                        apiClient.post('/admin/comments/bulk/reject', { commentIds, reason }),

                bulkDelete: (commentIds: string[], permanent: boolean = false) =>
                        apiClient.post('/admin/comments/bulk/delete', { commentIds, permanent }),

                bulkMarkSpam: (commentIds: string[]) =>
                        apiClient.post('/admin/comments/bulk/spam', { commentIds }),

                bulkAssignTags: (commentIds: string[], tags: string[]) =>
                        apiClient.post('/admin/comments/bulk/tags', { commentIds, tags }),

                // Reply Management
                getReplies: (commentId: string) =>
                        apiClient.get(`/admin/comments/${commentId}/replies`),

                createReply: (commentId: string, replyData: any) =>
                        apiClient.post(`/admin/comments/${commentId}/replies`, replyData),

                // Analytics & Reports
                getAnalytics: (params?: any) =>
                        apiClient.get('/admin/comments/analytics', {
                                params: {
                                        startDate: params?.startDate?.toISOString(),
                                        endDate: params?.endDate?.toISOString(),
                                        productId: params?.productId,
                                }
                        }),

                getCommentsStats: () =>
                        apiClient.get('/admin/comments/stats'),

                getCommentsTrends: (period: string = '30d') =>
                        apiClient.get('/admin/comments/trends', { params: { period } }),

                getTopCommenters: (params?: any) =>
                        apiClient.get('/admin/comments/top-commenters', { params }),

                getModerationStats: () =>
                        apiClient.get('/admin/comments/moderation-stats'),

                // Sentiment Analysis
                analyzeSentiment: (commentId: string) =>
                        apiClient.post(`/admin/comments/${commentId}/analyze-sentiment`),

                bulkAnalyzeSentiment: (commentIds?: string[]) =>
                        apiClient.post('/admin/comments/bulk/analyze-sentiment', { commentIds }),

                getSentimentDistribution: () =>
                        apiClient.get('/admin/comments/sentiment-distribution'),

                // Spam Detection
                runSpamDetection: (commentIds?: string[]) =>
                        apiClient.post('/admin/comments/spam-detection', { commentIds }),

                trainSpamFilter: (spamCommentIds: string[], hamCommentIds: string[]) =>
                        apiClient.post('/admin/comments/train-spam-filter', {
                                spamCommentIds,
                                hamCommentIds
                        }),

                getSpamStats: () =>
                        apiClient.get('/admin/comments/spam-stats'),

                // User Comment History
                getUserCommentHistory: (userId: string, params?: any) =>
                        apiClient.get(`/admin/comments/user/${userId}`, {
                                params: {
                                        page: params?.page || 1,
                                        limit: params?.limit || 20,
                                }
                        }),

                getUserStats: (userId: string) =>
                        apiClient.get(`/admin/comments/user/${userId}/stats`),

                banUser: (userId: string, reason?: string, duration?: number) =>
                        apiClient.post(`/admin/comments/user/${userId}/ban`, {
                                reason,
                                duration // in days
                        }),

                unbanUser: (userId: string) =>
                        apiClient.delete(`/admin/comments/user/${userId}/ban`),

                // Moderation Settings
                getModerationSettings: () =>
                        apiClient.get('/admin/comments/moderation-settings'),

                updateModerationSettings: (settings: any) =>
                        apiClient.put('/admin/comments/moderation-settings', settings),

                toggleAutoModeration: (enabled: boolean) =>
                        apiClient.post('/admin/comments/auto-moderation/toggle', { enabled }),

                // Export & Import
                exportComments: (format: 'csv' | 'excel' | 'pdf', filters?: any) =>
                        apiClient.get(`/admin/comments/export/${format}`, {
                                params: filters,
                                responseType: 'blob'
                        }),

                importComments: (file: FormData) =>
                        apiClient.post('/admin/comments/import', file, {
                                headers: {
                                        'Content-Type': 'multipart/form-data',
                                },
                        }),

                // Tags Management
                getTags: () =>
                        apiClient.get('/admin/comments/tags'),

                createTag: (tagData: any) =>
                        apiClient.post('/admin/comments/tags', tagData),

                updateTag: (tagId: string, tagData: any) =>
                        apiClient.put(`/admin/comments/tags/${tagId}`, tagData),

                deleteTag: (tagId: string) =>
                        apiClient.delete(`/admin/comments/tags/${tagId}`),

                // Reporting & Flagging
                getReports: (params?: any) =>
                        apiClient.get('/admin/comments/reports', { params }),

                resolveReport: (reportId: string, action: string, note?: string) =>
                        apiClient.post(`/admin/comments/reports/${reportId}/resolve`, {
                                action,
                                note
                        }),

                getReportStats: () =>
                        apiClient.get('/admin/comments/reports/stats'),

                // Advanced Search & Filtering
                searchComments: (query: string, params?: any) =>
                        apiClient.get('/admin/comments/search', {
                                params: { query, ...params }
                        }),

                searchByKeywords: (keywords: string[]) =>
                        apiClient.post('/admin/comments/search/keywords', { keywords }),

                searchBySentiment: (sentiment: 'positive' | 'negative' | 'neutral', threshold?: number) =>
                        apiClient.get('/admin/comments/search/sentiment', {
                                params: { sentiment, threshold }
                        }),

                // Engagement Metrics
                getEngagementStats: () =>
                        apiClient.get('/admin/comments/engagement'),

                getCommentVotes: (commentId: string) =>
                        apiClient.get(`/admin/comments/${commentId}/votes`),

                // Moderation Queue
                getModerationQueue: (priority?: 'high' | 'medium' | 'low') =>
                        apiClient.get('/admin/comments/moderation-queue', {
                                params: { priority }
                        }),

                assignModerator: (commentIds: string[], moderatorId: string) =>
                        apiClient.post('/admin/comments/assign-moderator', {
                                commentIds,
                                moderatorId
                        }),

                getModerationHistory: (params?: any) =>
                        apiClient.get('/admin/comments/moderation-history', { params }),

                // Notifications
                getCommentNotifications: () =>
                        apiClient.get('/admin/comments/notifications'),

                markNotificationRead: (notificationId: string) =>
                        apiClient.patch(`/admin/comments/notifications/${notificationId}/read`),

                updateNotificationSettings: (settings: any) =>
                        apiClient.put('/admin/comments/notification-settings', settings),

                // Performance & Monitoring
                getPerformanceMetrics: () =>
                        apiClient.get('/admin/comments/performance'),

                getSystemHealth: () =>
                        apiClient.get('/admin/comments/system-health'),

                clearCache: () =>
                        apiClient.post('/admin/comments/clear-cache'),

                // Backup & Restore
                createBackup: () =>
                        apiClient.post('/admin/comments/backup'),

                restoreBackup: (backupId: string) =>
                        apiClient.post(`/admin/comments/restore/${backupId}`),

                getBackupHistory: () =>
                        apiClient.get('/admin/comments/backups'),

                // Configuration
                getConfiguration: () =>
                        apiClient.get('/admin/comments/config'),

                updateConfiguration: (config: any) =>
                        apiClient.put('/admin/comments/config', config),

                resetConfiguration: () =>
                        apiClient.post('/admin/comments/config/reset'),

                // Maintenance
                runMaintenance: (tasks: string[]) =>
                        apiClient.post('/admin/comments/maintenance', { tasks }),

                optimizeDatabase: () =>
                        apiClient.post('/admin/comments/optimize'),

                cleanupDeleted: (olderThanDays: number) =>
                        apiClient.delete('/admin/comments/cleanup', {
                                data: { olderThanDays }
                        }),
        },

        // Notifications Management
        notifications: {
                // Get notifications with filters
                getNotifications: (filters?: any) => {
                        return apiClient.get('/admin/notifications', { params: filters });
                },

                // Get notification by ID
                getNotificationById: (notificationId: string) => {
                        return apiClient.get(`/admin/notifications/${notificationId}`);
                },

                // Create notification
                createNotification: (data: any) => {
                        return apiClient.post('/admin/notifications', data);
                },

                // Update notification
                updateNotification: (notificationId: string, data: any) => {
                        return apiClient.put(`/admin/notifications/${notificationId}`, data);
                },

                // Delete notification
                deleteNotification: (notificationId: string) => {
                        return apiClient.delete(`/admin/notifications/${notificationId}`);
                },

                // Mark as read
                markAsRead: (notificationId: string) => {
                        return apiClient.patch(`/admin/notifications/${notificationId}/read`);
                },

                // Mark all as read
                markAllAsRead: () => {
                        return apiClient.patch('/admin/notifications/mark-all-read');
                },

                // Bulk operations
                bulkOperation: (data: { action: string; notificationIds: string[] }) => {
                        return apiClient.post('/admin/notifications/bulk', data);
                },

                // Get stats
                getStats: () => {
                        return apiClient.get('/admin/notifications/stats');
                },

                // Templates
                getTemplates: (filters?: any) => {
                        return apiClient.get('/admin/notifications/templates', { params: filters });
                },

                createTemplate: (data: any) => {
                        return apiClient.post('/admin/notifications/templates', data);
                },

                updateTemplate: (templateId: string, data: any) => {
                        return apiClient.put(`/admin/notifications/templates/${templateId}`, data);
                },

                deleteTemplate: (templateId: string) => {
                        return apiClient.delete(`/admin/notifications/templates/${templateId}`);
                },

                duplicateTemplate: (templateId: string) => {
                        return apiClient.post(`/admin/notifications/templates/${templateId}/duplicate`);
                },

                previewTemplate: (templateId: string, data?: any) => {
                        return apiClient.post(`/admin/notifications/templates/${templateId}/preview`, data);
                },

                testTemplate: (templateId: string, data: any) => {
                        return apiClient.post(`/admin/notifications/templates/${templateId}/test`, data);
                },

                getTemplateStats: () => {
                        return apiClient.get('/admin/notifications/templates/stats');
                },

                // Campaigns
                getCampaigns: (filters?: any) => {
                        return apiClient.get('/admin/notifications/campaigns', { params: filters });
                },

                createCampaign: (data: any) => {
                        return apiClient.post('/admin/notifications/campaigns', data);
                },

                updateCampaign: (campaignId: string, data: any) => {
                        return apiClient.put(`/admin/notifications/campaigns/${campaignId}`, data);
                },

                deleteCampaign: (campaignId: string) => {
                        return apiClient.delete(`/admin/notifications/campaigns/${campaignId}`);
                },

                // Settings
                getEmailSettings: () => {
                        return apiClient.get('/admin/notifications/settings/email');
                },

                updateEmailSettings: (data: any) => {
                        return apiClient.put('/admin/notifications/settings/email', data);
                },

                getSMSSettings: () => {
                        return apiClient.get('/admin/notifications/settings/sms');
                },

                updateSMSSettings: (data: any) => {
                        return apiClient.put('/admin/notifications/settings/sms', data);
                },

                getNotificationSettings: () => {
                        return apiClient.get('/admin/notifications/settings');
                },

                updateNotificationSettings: (data: any) => {
                        return apiClient.put('/admin/notifications/settings', data);
                },

                // Analytics
                getAnalytics: (params?: any) => {
                        return apiClient.get('/admin/notifications/analytics', { params });
                },
        },

        // System Settings
        settings: {
                // Get all settings
                getSettings: () =>
                        apiClient.get('/admin/settings'),

                // General Settings
                updateGeneralSettings: (generalSettings: any) =>
                        apiClient.put('/admin/settings/general', generalSettings),

                getGeneralSettings: () =>
                        apiClient.get('/admin/settings/general'),

                // Payment Settings
                updatePaymentSettings: (paymentSettings: any) =>
                        apiClient.put('/admin/settings/payment', paymentSettings),

                getPaymentSettings: () =>
                        apiClient.get('/admin/settings/payment'),

                testPaymentGateway: (gateway: string, testData: any) =>
                        apiClient.post(`/admin/settings/payment/test/${gateway}`, testData),

                // Shipping Settings
                updateShippingSettings: (shippingSettings: any) =>
                        apiClient.put('/admin/settings/shipping', shippingSettings),

                getShippingSettings: () =>
                        apiClient.get('/admin/settings/shipping'),

                addShippingZone: (zoneData: any) =>
                        apiClient.post('/admin/settings/shipping/zones', zoneData),

                updateShippingZone: (zoneId: string, zoneData: any) =>
                        apiClient.put(`/admin/settings/shipping/zones/${zoneId}`, zoneData),

                deleteShippingZone: (zoneId: string) =>
                        apiClient.delete(`/admin/settings/shipping/zones/${zoneId}`),

                calculateShippingCost: (orderData: any) =>
                        apiClient.post('/admin/settings/shipping/calculate', orderData),

                // Email Settings
                updateEmailSettings: (emailSettings: any) =>
                        apiClient.put('/admin/settings/email', emailSettings),

                getEmailSettings: () =>
                        apiClient.get('/admin/settings/email'),

                testEmailSettings: (testEmail: string) =>
                        apiClient.post('/admin/settings/email/test', { testEmail }),

                updateEmailTemplate: (templateId: string, templateData: any) =>
                        apiClient.put(`/admin/settings/email/templates/${templateId}`, templateData),

                getEmailTemplates: () =>
                        apiClient.get('/admin/settings/email/templates'),

                previewEmailTemplate: (templateId: string, sampleData?: any) =>
                        apiClient.post(`/admin/settings/email/templates/${templateId}/preview`, sampleData || {}),

                sendTestEmail: (templateId: string, testEmail: string, sampleData?: any) =>
                        apiClient.post(`/admin/settings/email/templates/${templateId}/send-test`, {
                                testEmail,
                                sampleData: sampleData || {}
                        }),

                // SMS Settings
                updateSMSSettings: (smsSettings: any) =>
                        apiClient.put('/admin/settings/sms', smsSettings),

                getSMSSettings: () =>
                        apiClient.get('/admin/settings/sms'),

                testSMSSettings: (testPhone: string) =>
                        apiClient.post('/admin/settings/sms/test', { testPhone }),

                updateSMSTemplate: (templateId: string, templateData: any) =>
                        apiClient.put(`/admin/settings/sms/templates/${templateId}`, templateData),

                getSMSTemplates: () =>
                        apiClient.get('/admin/settings/sms/templates'),

                sendTestSMS: (templateId: string, testPhone: string, sampleData?: any) =>
                        apiClient.post(`/admin/settings/sms/templates/${templateId}/send-test`, {
                                testPhone,
                                sampleData: sampleData || {}
                        }),

                // Security Settings
                updateSecuritySettings: (securitySettings: any) =>
                        apiClient.put('/admin/settings/security', securitySettings),

                getSecuritySettings: () =>
                        apiClient.get('/admin/settings/security'),

                addIPToWhitelist: (ip: string) =>
                        apiClient.post('/admin/settings/security/whitelist', { ip }),

                removeIPFromWhitelist: (ip: string) =>
                        apiClient.delete('/admin/settings/security/whitelist', { data: { ip } }),

                getSecurityLogs: (params?: any) =>
                        apiClient.get('/admin/settings/security/logs', { params }),

                clearSecurityLogs: () =>
                        apiClient.delete('/admin/settings/security/logs'),

                generateAPIKey: (keyName: string, permissions: string[]) =>
                        apiClient.post('/admin/settings/security/api-keys', { keyName, permissions }),

                revokeAPIKey: (keyId: string) =>
                        apiClient.delete(`/admin/settings/security/api-keys/${keyId}`),

                getAPIKeys: () =>
                        apiClient.get('/admin/settings/security/api-keys'),

                enable2FA: (secret: string) =>
                        apiClient.post('/admin/settings/security/2fa/enable', { secret }),

                disable2FA: () =>
                        apiClient.post('/admin/settings/security/2fa/disable'),

                verify2FA: (code: string) =>
                        apiClient.post('/admin/settings/security/2fa/verify', { code }),

                // Backup Settings
                updateBackupSettings: (backupSettings: any) =>
                        apiClient.put('/admin/settings/backup', backupSettings),

                getBackupSettings: () =>
                        apiClient.get('/admin/settings/backup'),

                createBackup: (options?: any) =>
                        apiClient.post('/admin/settings/backup/create', options || {}),

                getBackupHistory: () =>
                        apiClient.get('/admin/settings/backup/history'),

                restoreBackup: (backupId: string) =>
                        apiClient.post(`/admin/settings/backup/restore/${backupId}`),

                deleteBackup: (backupId: string) =>
                        apiClient.delete(`/admin/settings/backup/${backupId}`),

                downloadBackup: (backupId: string) =>
                        apiClient.get(`/admin/settings/backup/${backupId}/download`, {
                                responseType: 'blob'
                        }),

                scheduleBackup: (scheduleData: any) =>
                        apiClient.post('/admin/settings/backup/schedule', scheduleData),

                cancelScheduledBackup: (scheduleId: string) =>
                        apiClient.delete(`/admin/settings/backup/schedule/${scheduleId}`),

                // System Maintenance
                enableMaintenanceMode: (reason?: string) =>
                        apiClient.post('/admin/settings/maintenance/enable', { reason: reason || 'تعمیرات سیستم' }),

                disableMaintenanceMode: () =>
                        apiClient.post('/admin/settings/maintenance/disable'),

                getMaintenanceStatus: () =>
                        apiClient.get('/admin/settings/maintenance/status'),

                // System Statistics & Monitoring
                getSystemStats: () =>
                        apiClient.get('/admin/settings/system/stats'),

                getSystemHealth: () =>
                        apiClient.get('/admin/settings/system/health'),

                getPerformanceMetrics: (period?: string) =>
                        apiClient.get('/admin/settings/system/performance', {
                                params: { period: period || '24h' }
                        }),

                getErrorLogs: (params?: any) =>
                        apiClient.get('/admin/settings/system/logs/errors', { params }),

                clearErrorLogs: () =>
                        apiClient.delete('/admin/settings/system/logs/errors'),

                getAccessLogs: (params?: any) =>
                        apiClient.get('/admin/settings/system/logs/access', { params }),

                clearAccessLogs: () =>
                        apiClient.delete('/admin/settings/system/logs/access'),

                // Configuration Management
                resetToDefaults: (category: string) =>
                        apiClient.post(`/admin/settings/reset/${category}`),

                exportSettings: () =>
                        apiClient.get('/admin/settings/export', { responseType: 'blob' }),

                importSettings: (formData: FormData) =>
                        apiClient.post('/admin/settings/import', formData, {
                                headers: {
                                        'Content-Type': 'multipart/form-data',
                                },
                        }),

                validateSettings: (settingsData: any) =>
                        apiClient.post('/admin/settings/validate', settingsData),

                getConfigurationTemplate: (category: string) =>
                        apiClient.get(`/admin/settings/template/${category}`),

                // Cache Management
                clearCache: (cacheType?: string) =>
                        apiClient.post('/admin/settings/cache/clear', { type: cacheType || 'all' }),

                getCacheStats: () =>
                        apiClient.get('/admin/settings/cache/stats'),

                optimizeCache: () =>
                        apiClient.post('/admin/settings/cache/optimize'),

                // Database Management
                optimizeDatabase: () =>
                        apiClient.post('/admin/settings/database/optimize'),

                getDatabaseStats: () =>
                        apiClient.get('/admin/settings/database/stats'),

                repairDatabase: () =>
                        apiClient.post('/admin/settings/database/repair'),

                vacuumDatabase: () =>
                        apiClient.post('/admin/settings/database/vacuum'),

                // File Management
                cleanupTempFiles: () =>
                        apiClient.post('/admin/settings/files/cleanup-temp'),

                optimizeImages: () =>
                        apiClient.post('/admin/settings/files/optimize-images'),

                getStorageStats: () =>
                        apiClient.get('/admin/settings/files/storage-stats'),

                // Update Management
                checkForUpdates: () =>
                        apiClient.get('/admin/settings/updates/check'),

                downloadUpdate: (updateId: string) =>
                        apiClient.post(`/admin/settings/updates/download/${updateId}`),

                installUpdate: (updateId: string) =>
                        apiClient.post(`/admin/settings/updates/install/${updateId}`),

                getUpdateHistory: () =>
                        apiClient.get('/admin/settings/updates/history'),

                // License Management
                getLicenseInfo: () =>
                        apiClient.get('/admin/settings/license/info'),

                activateLicense: (licenseKey: string) =>
                        apiClient.post('/admin/settings/license/activate', { licenseKey }),

                deactivateLicense: () =>
                        apiClient.post('/admin/settings/license/deactivate'),

                validateLicense: () =>
                        apiClient.post('/admin/settings/license/validate'),

                // Plugin Management
                getPlugins: () =>
                        apiClient.get('/admin/settings/plugins'),

                installPlugin: (pluginData: FormData) =>
                        apiClient.post('/admin/settings/plugins/install', pluginData, {
                                headers: {
                                        'Content-Type': 'multipart/form-data',
                                },
                        }),

                enablePlugin: (pluginId: string) =>
                        apiClient.post(`/admin/settings/plugins/${pluginId}/enable`),

                disablePlugin: (pluginId: string) =>
                        apiClient.post(`/admin/settings/plugins/${pluginId}/disable`),

                uninstallPlugin: (pluginId: string) =>
                        apiClient.delete(`/admin/settings/plugins/${pluginId}`),

                getPluginSettings: (pluginId: string) =>
                        apiClient.get(`/admin/settings/plugins/${pluginId}/settings`),

                updatePluginSettings: (pluginId: string, settings: any) =>
                        apiClient.put(`/admin/settings/plugins/${pluginId}/settings`, settings),

                // Webhook Management
                getWebhooks: () =>
                        apiClient.get('/admin/settings/webhooks'),

                createWebhook: (webhookData: any) =>
                        apiClient.post('/admin/settings/webhooks', webhookData),

                updateWebhook: (webhookId: string, webhookData: any) =>
                        apiClient.put(`/admin/settings/webhooks/${webhookId}`, webhookData),

                deleteWebhook: (webhookId: string) =>
                        apiClient.delete(`/admin/settings/webhooks/${webhookId}`),

                testWebhook: (webhookId: string) =>
                        apiClient.post(`/admin/settings/webhooks/${webhookId}/test`),

                getWebhookLogs: (webhookId: string) =>
                        apiClient.get(`/admin/settings/webhooks/${webhookId}/logs`),

                // Localization Management
                getLanguages: () =>
                        apiClient.get('/admin/settings/localization/languages'),

                updateTranslations: (languageCode: string, translations: any) =>
                        apiClient.put(`/admin/settings/localization/languages/${languageCode}`, translations),

                exportTranslations: (languageCode: string) =>
                        apiClient.get(`/admin/settings/localization/languages/${languageCode}/export`, {
                                responseType: 'blob'
                        }),

                importTranslations: (languageCode: string, file: FormData) =>
                        apiClient.post(`/admin/settings/localization/languages/${languageCode}/import`, file, {
                                headers: {
                                        'Content-Type': 'multipart/form-data',
                                },
                        }),

                // Theme Management
                getThemes: () =>
                        apiClient.get('/admin/settings/themes'),

                activateTheme: (themeId: string) =>
                        apiClient.post(`/admin/settings/themes/${themeId}/activate`),

                getThemeSettings: (themeId: string) =>
                        apiClient.get(`/admin/settings/themes/${themeId}/settings`),

                updateThemeSettings: (themeId: string, settings: any) =>
                        apiClient.put(`/admin/settings/themes/${themeId}/settings`, settings),

                installTheme: (themeData: FormData) =>
                        apiClient.post('/admin/settings/themes/install', themeData, {
                                headers: {
                                        'Content-Type': 'multipart/form-data',
                                },
                        }),

                uninstallTheme: (themeId: string) =>
                        apiClient.delete(`/admin/settings/themes/${themeId}`),

                previewTheme: (themeId: string) =>
                        apiClient.get(`/admin/settings/themes/${themeId}/preview`),
        },

        // Content management API
        content: {
                getBanners: (filters: any) => apiClient.get('/content/banners', { params: filters }),
                createBanner: (data: any) => apiClient.post('/content/banners', data),
                updateBanner: (id: string, data: any) => apiClient.put(`/content/banners/${id}`, data),
                deleteBanner: (id: string) => apiClient.delete(`/content/banners/${id}`),
                toggleBannerStatus: (id: string) => apiClient.patch(`/content/banners/${id}/toggle`),

                getMedia: (filters: any) => apiClient.get('/content/media', { params: filters }),
                uploadMedia: (data: FormData) => apiClient.post('/content/media', data),
                updateMedia: (id: string, data: any) => apiClient.put(`/content/media/${id}`, data),
                deleteMedia: (id: string) => apiClient.delete(`/content/media/${id}`),

                getPages: (filters: any) => apiClient.get('/content/pages', { params: filters }),
                createPageContent: (data: any) => apiClient.post('/content/pages', data),
                updatePageContent: (id: string, data: any) => apiClient.put(`/content/pages/${id}`, data),
                deletePageContent: (id: string) => apiClient.delete(`/content/pages/${id}`),
        },

        // Reports API
        reports: {
                getAnalytics: (params: any) => apiClient.get('/reports/analytics', { params }),
                exportCSV: (params: any) => apiClient.get('/reports/export/csv', { params, responseType: 'blob' }),
                exportPDF: (params: any) => apiClient.get('/reports/export/pdf', { params, responseType: 'blob' }),
        },
};

// Public API endpoints (for non-admin features)
export const publicAPI = {
        // Auth
        login: (credentials: { email: string; password: string }) => apiClient.post('/auth/login', credentials),
        register: (userData: any) => apiClient.post('/auth/register', userData),
        logout: () => apiClient.post('/auth/logout'),
        refreshToken: () => apiClient.post('/auth/refresh'),
        forgotPassword: (email: string) => apiClient.post('/auth/forgot-password', { email }),
        resetPassword: (token: string, password: string) => apiClient.post('/auth/reset-password', { token, password }),

        // Products (Public)
        getProducts: (params?: any) => apiClient.get('/products', { params }),
        getProductById: (productId: string) => apiClient.get(`/products/${productId}`),
        searchProducts: (query: string) => apiClient.get('/products/search', { params: { q: query } }),

        // Categories (Public)
        getCategories: () => apiClient.get('/categories'),
        getCategoryProducts: (categoryId: string, params?: any) => apiClient.get(`/categories/${categoryId}/products`, { params }),

        // Cart
        addToCart: (data: any) => apiClient.post('/cart/add', data),
        getCart: () => apiClient.get('/cart'),
        updateCartItem: (itemId: string, data: any) => apiClient.patch(`/cart/items/${itemId}`, data),
        removeFromCart: (itemId: string) => apiClient.delete(`/cart/items/${itemId}`),
        clearCart: () => apiClient.delete('/cart'),

        // Orders (User)
        createOrder: (orderData: any) => apiClient.post('/orders', orderData),
        getOrderById: (orderId: string) => apiClient.get(`/orders/${orderId}`),
        cancelOrder: (orderId: string) => apiClient.patch(`/orders/${orderId}/cancel`),

        // Payment
        createPayment: (orderData: any) => apiClient.post('/payment/create', orderData),
        verifyPayment: (data: any) => apiClient.post('/payment/verify', data),

        // User Profile
        getProfile: () => apiClient.get('/user/profile'),
        updateProfile: (data: any) => apiClient.patch('/user/profile', data),
        changePassword: (data: { currentPassword: string; newPassword: string }) => apiClient.patch('/user/change-password', data),

        // Wishlist
        getWishlist: () => apiClient.get('/user/wishlist'),
        addToWishlist: (productId: string) => apiClient.post('/user/wishlist', { productId }),
        removeFromWishlist: (productId: string) => apiClient.delete(`/user/wishlist/${productId}`),

        // Reviews
        createReview: (productId: string, data: any) => apiClient.post(`/products/${productId}/reviews`, data),
        getProductReviews: (productId: string) => apiClient.get(`/products/${productId}/reviews`),
        updateReview: (reviewId: string, data: any) => apiClient.patch(`/reviews/${reviewId}`, data),
        deleteReview: (reviewId: string) => apiClient.delete(`/reviews/${reviewId}`),
};

// Utility functions
export const apiUtils = {
        isNetworkError: (error: any) => {
                return !error.response && error.request;
        },

        getErrorMessage: (error: any) => {
                if (error.response?.data?.message) {
                        return error.response.data.message;
                }
                if (error.message) {
                        return error.message;
                }
                return 'خطای غیرمنتظره‌ای رخ داده است';
        },

        isUnauthorized: (error: any) => {
                return error.response?.status === 401;
        },

        isForbidden: (error: any) => {
                return error.response?.status === 403;
        },

        isNotFound: (error: any) => {
                return error.response?.status === 404;
        },

        isServerError: (error: any) => {
                return error.response?.status >= 500;
        }
};

export default { adminAPI, publicAPI, apiUtils };

// Export apiClient for use in other files
export { apiClient }; 