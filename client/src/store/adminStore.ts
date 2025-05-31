import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Types
export interface Order {
        _id: string;
        orderNumber: string;
        user: {
                _id: string;
                firstName: string;
                lastName: string;
                email: string;
                phone: string;
        };
        items: Array<{
                product: {
                        _id: string;
                        name: string;
                        price: number;
                        images: Array<{ url: string; alt: string }>;
                };
                quantity: number;
                price: number;
                selectedColor?: string;
                selectedSize?: string;
        }>;
        finalAmount: number;
        orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
        paymentStatus: 'pending' | 'paid' | 'failed';
        paymentMethod: 'zarinpal' | 'cash_on_delivery';
        shippingAddress: {
                street: string;
                city: string;
                state: string;
                postalCode: string;
                country: string;
        };
        trackingNumber?: string;
        notes?: string;
        createdAt: string;
        updatedAt: string;
}

export interface User {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        isActive: boolean;
        isAdmin: boolean;
        address: {
                street: string;
                city: string;
                state: string;
                postalCode: string;
                country: string;
        };
        createdAt: string;
        updatedAt: string;
}

export interface DashboardStats {
        totalUsers: number;
        totalProducts: number;
        totalOrders: number;
        totalRevenue: number;
        recentOrders: Order[];
        topProducts: any[];
        salesData: any[];
}

// New Reports Types
export interface SalesData {
        date: string;
        revenue: number;
        orders: number;
        customers: number;
}

export interface ProductAnalytics {
        _id: string;
        name: string;
        totalSold: number;
        revenue: number;
        viewCount: number;
        conversionRate: number;
        category: string;
}

export interface CustomerAnalytics {
        totalCustomers: number;
        newCustomers: number;
        returningCustomers: number;
        averageOrderValue: number;
        customerLifetimeValue: number;
}

export interface ReportFilters {
        dateRange: {
                startDate: Date;
                endDate: Date;
        };
        period: 'daily' | 'weekly' | 'monthly' | 'yearly';
        category?: string;
        productId?: string;
}

export interface ReportsData {
        salesData: SalesData[];
        productAnalytics: ProductAnalytics[];
        customerAnalytics: CustomerAnalytics;
        revenueGrowth: {
                current: number;
                previous: number;
                percentage: number;
        };
        topSellingProducts: ProductAnalytics[];
        recentTransactions: Order[];
}

// Content Management Types
export interface Banner {
        _id: string;
        title: string;
        description?: string;
        imageUrl: string;
        linkUrl?: string;
        isActive: boolean;
        position: 'hero' | 'middle' | 'footer';
        order: number;
        startDate?: Date;
        endDate?: Date;
        createdAt: string;
        updatedAt: string;
}

export interface MediaFile {
        _id: string;
        filename: string;
        originalName: string;
        url: string;
        mimeType: string;
        size: number;
        folder: string;
        altText?: string;
        tags: string[];
        createdAt: string;
        updatedAt: string;
}

export interface PageContent {
        _id: string;
        page: 'home' | 'about' | 'contact' | 'privacy' | 'terms';
        section: string;
        title: string;
        content: string;
        isActive: boolean;
        order: number;
        metadata: {
                metaTitle?: string;
                metaDescription?: string;
                keywords?: string[];
        };
        createdAt: string;
        updatedAt: string;
}

export interface ContentFilters {
        type: 'banners' | 'media' | 'pages';
        isActive?: boolean;
        position?: string;
        folder?: string;
        page?: string;
        search: string;
        page_number: number;
        limit: number;
}

export interface ContentData {
        banners: Banner[];
        media: MediaFile[];
        pages: PageContent[];
}

// System Settings Types
export interface GeneralSettings {
        siteName: string;
        siteDescription: string;
        adminEmail: string;
        contactEmail: string;
        phone: string;
        address: string;
        timezone: string;
        language: 'fa' | 'en';
        currency: 'IRR' | 'USD' | 'EUR';
        dateFormat: string;
        itemsPerPage: number;
        maintenanceMode: boolean;
        allowRegistration: boolean;
        requireEmailVerification: boolean;
        logo?: string;
        favicon?: string;
        socialLinks: {
                instagram?: string;
                telegram?: string;
                whatsapp?: string;
                twitter?: string;
                facebook?: string;
        };
}

export interface PaymentSettings {
        zarinpal: {
                enabled: boolean;
                merchantId: string;
                sandbox: boolean;
                callbackUrl: string;
        };
        cashOnDelivery: {
                enabled: boolean;
                additionalCost: number;
                maxOrderValue: number;
        };
        bankTransfer: {
                enabled: boolean;
                accountNumber: string;
                accountHolder: string;
                bankName: string;
                shaba: string;
                instructions: string;
        };
        minimumOrderValue: number;
        processingTime: string;
        refundPolicy: string;
}

export interface ShippingSettings {
        freeShippingThreshold: number;
        defaultShippingCost: number;
        expressShippingCost: number;
        internationalShippingCost: number;
        estimatedDeliveryTime: string;
        expressDeliveryTime: string;
        internationalDeliveryTime: string;
        shippingZones: Array<{
                name: string;
                cities: string[];
                cost: number;
                deliveryTime: string;
        }>;
        weightBasedPricing: {
                enabled: boolean;
                rates: Array<{
                        maxWeight: number;
                        cost: number;
                }>;
        };
        packagingOptions: Array<{
                name: string;
                cost: number;
                description: string;
        }>;
}

export interface EmailSettings {
        smtp: {
                host: string;
                port: number;
                secure: boolean;
                username: string;
                password: string;
                fromName: string;
                fromEmail: string;
        };
        templates: {
                orderConfirmation: {
                        enabled: boolean;
                        subject: string;
                        content: string;
                };
                orderShipped: {
                        enabled: boolean;
                        subject: string;
                        content: string;
                };
                orderDelivered: {
                        enabled: boolean;
                        subject: string;
                        content: string;
                };
                passwordReset: {
                        enabled: boolean;
                        subject: string;
                        content: string;
                };
                welcomeEmail: {
                        enabled: boolean;
                        subject: string;
                        content: string;
                };
        };
        notifications: {
                newOrder: boolean;
                lowStock: boolean;
                newUser: boolean;
                contactForm: boolean;
        };
}

export interface SMSSettings {
        provider: 'kavenegar' | 'ghasedak' | 'melipayamak' | 'disabled';
        apiKey: string;
        senderNumber: string;
        templates: {
                orderConfirmation: {
                        enabled: boolean;
                        template: string;
                };
                orderShipped: {
                        enabled: boolean;
                        template: string;
                };
                verificationCode: {
                        enabled: boolean;
                        template: string;
                };
        };
        notifications: {
                newOrder: boolean;
                lowStock: boolean;
        };
}

export interface SecuritySettings {
        enableTwoFactor: boolean;
        sessionTimeout: number; // in minutes
        maxLoginAttempts: number;
        lockoutDuration: number; // in minutes
        passwordPolicy: {
                minLength: number;
                requireUppercase: boolean;
                requireLowercase: boolean;
                requireNumbers: boolean;
                requireSpecialChars: boolean;
                expirationDays: number;
        };
        ipWhitelist: string[];
        allowedFileTypes: string[];
        maxFileSize: number; // in MB
        enableApiRateLimit: boolean;
        apiRateLimit: number; // requests per minute
        enableSslRedirect: boolean;
        cookieSettings: {
                secure: boolean;
                sameSite: 'strict' | 'lax' | 'none';
                maxAge: number; // in days
        };
}

export interface BackupSettings {
        autoBackup: {
                enabled: boolean;
                frequency: 'daily' | 'weekly' | 'monthly';
                time: string; // HH:mm format
                retentionDays: number;
        };
        storage: {
                local: boolean;
                cloud: {
                        enabled: boolean;
                        provider: 'aws' | 'google' | 'azure';
                        credentials: any;
                        bucket: string;
                };
        };
        backupTypes: {
                database: boolean;
                files: boolean;
                settings: boolean;
        };
        compression: boolean;
        encryption: {
                enabled: boolean;
                algorithm: string;
        };
}

// Comments Management Types
export interface Comment {
        _id: string;
        content: string;
        author: {
                _id: string;
                firstName: string;
                lastName: string;
                email: string;
                avatar?: string;
                isVerified: boolean;
        };
        product?: {
                _id: string;
                name: string;
                slug: string;
                images: Array<{ url: string; alt: string }>;
        };
        rating?: number; // 1-5 rating for product reviews
        status: 'pending' | 'approved' | 'rejected' | 'spam';
        parentComment?: string; // for replies
        replies: Comment[];
        isReply: boolean;
        metadata: {
                ipAddress: string;
                userAgent: string;
                location?: {
                        country: string;
                        city: string;
                };
        };
        sentiment: {
                score: number; // -1 to 1
                label: 'positive' | 'negative' | 'neutral';
                confidence: number;
        };
        moderationFlags: {
                isSpam: boolean;
                isOffensive: boolean;
                isReported: boolean;
                reportCount: number;
                lastReportDate?: string;
        };
        engagement: {
                likes: number;
                dislikes: number;
                reports: number;
                helpfulVotes: number;
        };
        tags: string[];
        attachments: Array<{
                type: 'image' | 'file';
                url: string;
                name: string;
                size: number;
        }>;
        editHistory: Array<{
                content: string;
                editedAt: string;
                reason?: string;
        }>;
        createdAt: string;
        updatedAt: string;
        approvedAt?: string;
        approvedBy?: {
                _id: string;
                firstName: string;
                lastName: string;
        };
}

export interface CommentAnalytics {
        totalComments: number;
        pendingComments: number;
        approvedComments: number;
        rejectedComments: number;
        spamComments: number;
        averageRating: number;
        sentimentDistribution: {
                positive: number;
                negative: number;
                neutral: number;
        };
        engagementMetrics: {
                totalLikes: number;
                totalDislikes: number;
                totalReports: number;
                averageEngagement: number;
        };
        topCommenters: Array<{
                user: {
                        _id: string;
                        firstName: string;
                        lastName: string;
                        email: string;
                };
                commentCount: number;
                averageRating: number;
                lastCommentDate: string;
        }>;
        commentTrends: Array<{
                date: string;
                count: number;
                approved: number;
                rejected: number;
                spam: number;
        }>;
        moderationStats: {
                averageApprovalTime: number; // in hours
                moderatorActivity: Array<{
                        moderator: {
                                _id: string;
                                firstName: string;
                                lastName: string;
                        };
                        actionsCount: number;
                        averageResponseTime: number;
                }>;
        };
}

export interface CommentFilters {
        status: 'all' | 'pending' | 'approved' | 'rejected' | 'spam';
        product?: string;
        author?: string;
        rating?: number;
        sentiment?: 'positive' | 'negative' | 'neutral';
        hasReplies?: boolean;
        isReply?: boolean;
        dateRange?: {
                startDate: Date;
                endDate: Date;
        };
        search: string;
        sortBy: 'createdAt' | 'updatedAt' | 'rating' | 'likes' | 'replies';
        sortOrder: 'asc' | 'desc';
        page: number;
        limit: number;
        tags?: string[];
        moderationFlags?: {
                isSpam?: boolean;
                isOffensive?: boolean;
                isReported?: boolean;
        };
}

export interface CommentModerationAction {
        type: 'approve' | 'reject' | 'mark_spam' | 'delete' | 'edit' | 'reply';
        commentIds: string[];
        reason?: string;
        note?: string;
        newContent?: string; // for edit action
        replyContent?: string; // for reply action
}

export interface CommentBulkOperation {
        action: 'approve' | 'reject' | 'delete' | 'mark_spam' | 'assign_tag' | 'change_status';
        commentIds: string[];
        data?: any;
        filters?: Partial<CommentFilters>;
}

export interface CommentModerationSettings {
        autoModeration: {
                enabled: boolean;
                spamThreshold: number; // 0-1
                sentimentThreshold: number; // negative sentiment threshold
                profanityFilter: boolean;
                requireApproval: boolean;
                autoApproveVerifiedUsers: boolean;
                autoApproveReturningCustomers: boolean;
        };
        notifications: {
                newCommentEmail: boolean;
                newCommentSMS: boolean;
                spamDetectionEmail: boolean;
                moderationReminders: boolean;
        };
        limits: {
                maxCommentsPerDay: number;
                maxCommentsPerHour: number;
                minCommentLength: number;
                maxCommentLength: number;
                allowAttachments: boolean;
                maxAttachmentSize: number; // in MB
                allowedAttachmentTypes: string[];
        };
        display: {
                commentsPerPage: number;
                showRatings: boolean;
                showUserProfiles: boolean;
                showVerificationBadges: boolean;
                allowVoting: boolean;
                allowReporting: boolean;
                showSentimentAnalysis: boolean;
        };
        moderation: {
                requireModerationForNewUsers: boolean;
                requireModerationForNegativeSentiment: boolean;
                bannedWords: string[];
                bannedIPs: string[];
                bannedUsers: string[];
                autoDeleteAfterDays: number;
        };
}

export interface CommentsData {
        comments: Comment[];
        analytics: CommentAnalytics | null;
        moderationSettings: CommentModerationSettings | null;
}

export interface SystemSettings {
        general: GeneralSettings;
        payment: PaymentSettings;
        shipping: ShippingSettings;
        email: EmailSettings;
        sms: SMSSettings;
        security: SecuritySettings;
        backup: BackupSettings;
}

export interface SystemFilters {
        category: 'general' | 'payment' | 'shipping' | 'email' | 'sms' | 'security' | 'backup';
        search: string;
}

// Notifications Management Types
export interface Notification {
        _id: string;
        title: string;
        message: string;
        type: 'info' | 'success' | 'warning' | 'error' | 'order' | 'user' | 'product' | 'system' | 'security';
        priority: 'low' | 'medium' | 'high' | 'urgent';
        recipient: {
                type: 'user' | 'admin' | 'role' | 'all' | 'group' | 'broadcast';
                target?: string; // user ID, admin ID, or role name
        };
        channels: {
                inApp: boolean;
                email: boolean;
                sms: boolean;
                push: boolean;
                webhook?: boolean;
        };
        status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed' | 'expired' | 'cancelled';
        metadata: {
                sourceId?: string; // ID of the related entity (order, user, etc.)
                sourceType?: 'order' | 'user' | 'product' | 'comment' | 'system';
                actionUrl?: string; // URL to navigate when clicked
                imageUrl?: string;
                expiresAt?: string;
                retryCount?: number;
                lastRetryAt?: string;
        };
        delivery: {
                sentAt?: string;
                deliveredAt?: string;
                readAt?: string;
                failedAt?: string;
                failureReason?: string;
                deliveryAttempts: number;
                attempts?: number; // for backward compatibility
        };
        template?: {
                id: string;
                variables: Record<string, any>;
        };
        tags: string[];
        isSystemGenerated: boolean;
        author?: {
                _id: string;
                name: string;
                firstName: string;
                lastName: string;
                avatar?: string;
                type: 'admin' | 'system';
        };
        createdBy?: {
                _id: string;
                firstName: string;
                lastName: string;
                type: 'admin' | 'system';
        };
        createdAt: string;
        updatedAt: string;
}

export interface NotificationTemplate {
        _id: string;
        name: string;
        description: string;
        category: 'order' | 'user' | 'product' | 'system' | 'marketing' | 'security';
        type: 'email' | 'sms' | 'push' | 'inApp';
        isActive: boolean;
        subject?: string; // for email/push
        content: {
                html?: string; // for email
                text: string; // for SMS/push/inApp
                variables: Array<{
                        name: string;
                        description: string;
                        required: boolean;
                        defaultValue?: string;
                }>;
        };
        design: {
                backgroundColor?: string;
                textColor?: string;
                buttonColor?: string;
                logo?: string;
                header?: string;
                footer?: string;
        };
        triggers: Array<{
                event: string;
                conditions?: Record<string, any>;
                delay?: number; // in minutes
        }>;
        scheduling: {
                enabled: boolean;
                timezone?: string;
                allowedHours?: {
                        start: string; // HH:mm
                        end: string; // HH:mm
                };
                allowedDays?: number[]; // 0-6 (Sunday-Saturday)
        };
        analytics: {
                sent: number;
                delivered: number;
                opened: number;
                clicked: number;
                unsubscribed: number;
                lastUsed?: string;
        };
        createdAt: string;
        updatedAt: string;
}

export interface NotificationSettings {
        general: {
                enabled: boolean;
                defaultChannels: string[];
                retryAttempts: number;
                retryDelay: number; // in minutes
                batchSize: number;
                rateLimit: number; // per minute
        };
        inApp: {
                enabled: boolean;
                maxNotifications: number;
                autoMarkRead: boolean;
                displayDuration: number; // in seconds
                showAvatars: boolean;
                playSound: boolean;
                soundFile?: string;
        };
        email: {
                enabled: boolean;
                fromName: string;
                fromEmail: string;
                replyTo: string;
                trackOpening: boolean;
                trackClicks: boolean;
                unsubscribeLink: boolean;
                smtp: {
                        host: string;
                        port: number;
                        secure: boolean;
                        username: string;
                        password: string;
                };
        };
        sms: {
                enabled: boolean;
                provider: 'kavenegar' | 'ghasedak' | 'melipayamak';
                apiKey: string;
                senderNumber: string;
                maxLength: number;
                unicode: boolean;
        };
        push: {
                enabled: boolean;
                vapidKeys: {
                        publicKey: string;
                        privateKey: string;
                };
                fcmServerKey?: string;
                icon: string;
                badge: string;
                requireInteraction: boolean;
                silent: boolean;
        };
        webhook: {
                enabled: boolean;
                endpoints: Array<{
                        url: string;
                        events: string[];
                        headers?: Record<string, string>;
                        secret?: string;
                }>;
        };
        automation: {
                enabled: boolean;
                welcomeEmail: boolean;
                orderConfirmation: boolean;
                orderStatusUpdate: boolean;
                passwordReset: boolean;
                newUserRegistration: boolean;
                lowStockAlert: boolean;
                newCommentNotification: boolean;
        };
}

export interface NotificationAnalytics {
        // Flat properties for UI compatibility
        total?: number;
        unread?: number;
        delivered?: number;
        read?: number;
        sent?: number;
        pending?: number;
        failed?: number;
        deliveryRate?: number;
        readRate?: number;

        // Existing nested structure
        overview: {
                totalSent: number;
                totalDelivered: number;
                totalRead: number;
                totalFailed: number;
                deliveryRate: number;
                readRate: number;
                failureRate: number;
        };
        byChannel: {
                inApp: {
                        sent: number;
                        delivered: number;
                        read: number;
                        failed: number;
                };
                email: {
                        sent: number;
                        delivered: number;
                        opened: number;
                        clicked: number;
                        bounced: number;
                        unsubscribed: number;
                };
                sms: {
                        sent: number;
                        delivered: number;
                        failed: number;
                };
                push: {
                        sent: number;
                        delivered: number;
                        clicked: number;
                        dismissed: number;
                };
        };
        byType: Array<{
                type: string;
                sent: number;
                delivered: number;
                read: number;
                engagement: number;
        }>;
        trends: Array<{
                date: string;
                sent: number;
                delivered: number;
                read: number;
                failed: number;
        }>;
        topPerformers?: Array<{
                id: string;
                name: string;
                sent: number;
                deliveryRate: number;
                engagement: number;
        }>;
}

export interface NotificationFilters {
        status: 'all' | 'pending' | 'sent' | 'delivered' | 'read' | 'failed' | 'expired';
        type: 'all' | 'info' | 'success' | 'warning' | 'error' | 'order' | 'user' | 'product' | 'system' | 'security';
        priority: 'all' | 'low' | 'medium' | 'high' | 'urgent';
        channel: 'all' | 'inApp' | 'email' | 'sms' | 'push' | 'webhook';
        recipient: 'all' | 'user' | 'admin' | 'role';
        dateRange?: {
                startDate: Date;
                endDate: Date;
        };
        search: string;
        sortBy: 'createdAt' | 'updatedAt' | 'priority' | 'status' | 'type';
        sortOrder: 'asc' | 'desc';
        page: number;
        limit: number;
        tags?: string[];
        isSystemGenerated?: boolean;
        templateId?: string;
}

export interface NotificationCampaign {
        _id: string;
        name: string;
        description: string;
        type: 'immediate' | 'scheduled' | 'triggered';
        status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
        template: NotificationTemplate;
        audience: {
                type: 'all' | 'segment' | 'specific';
                criteria?: Record<string, any>;
                userIds?: string[];
                estimatedReach: number;
        };
        scheduling: {
                sendAt?: string;
                timezone?: string;
                repeat?: {
                        enabled: boolean;
                        frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
                        interval: number;
                        endDate?: string;
                };
        };
        channels: {
                inApp: boolean;
                email: boolean;
                sms: boolean;
                push: boolean;
        };
        analytics: {
                sent: number;
                delivered: number;
                opened: number;
                clicked: number;
                unsubscribed: number;
                revenue?: number;
        };
        // Additional properties for UI components
        progress?: {
                percentage: number;
                processed: number;
                remaining: number;
        };
        schedule?: {
                type: 'immediate' | 'scheduled' | 'recurring';
                startDate?: string;
                endDate?: string;
                timezone?: string;
        };
        lastModified?: string;
        templateId?: string;
        customContent?: {
                subject: string;
                text: string;
                html: string;
        };
        targetAudience?: {
                type: string;
                criteria: Record<string, any>;
                segments: string[];
                tags: string[];
                total: number;
        };
        settings?: {
                enableTracking: boolean;
                enableUnsubscribe: boolean;
                priority: string;
                maxRetries: number;
                retryDelay: number;
        };
        createdBy: {
                _id: string;
                firstName: string;
                lastName: string;
        };
        createdAt: string;
        updatedAt: string;
        startedAt?: string;
        completedAt?: string;
}

export interface NotificationBulkOperation {
        action: 'mark_read' | 'mark_unread' | 'delete' | 'archive' | 'retry' | 'cancel';
        notificationIds: string[];
        data?: any;
}

export interface NotificationsData {
        notifications: Notification[];
        templates: NotificationTemplate[];
        campaigns: NotificationCampaign[];
        analytics: NotificationAnalytics | null;
        settings: NotificationSettings | null;
        unreadCount: number;
}

export interface AdminState {
        // Data
        orders: Order[];
        users: User[];
        dashboardStats: DashboardStats | null;
        reportsData: ReportsData | null;
        contentData: ContentData | null;
        systemSettings: SystemSettings | null;
        commentsData: CommentsData | null;
        notificationsData: NotificationsData | null;

        // UI State
        loading: {
                orders: boolean;
                users: boolean;
                dashboard: boolean;
                reports: boolean;
                content: boolean;
                settings: boolean;
                comments: boolean;
                notifications: boolean;
        };
        error: {
                orders: string | null;
                users: string | null;
                dashboard: string | null;
                reports: string | null;
                content: string | null;
                settings: string | null;
                comments: string | null;
                notifications: string | null;
        };

        // Filters
        orderFilters: {
                status: string;
                search: string;
                dateFrom?: Date;
                dateTo?: Date;
                page: number;
                limit: number;
        };
        userFilters: {
                status: string;
                role: string;
                search: string;
                page: number;
                limit: number;
        };
        reportFilters: ReportFilters;
        contentFilters: ContentFilters;
        systemFilters: SystemFilters;
        commentFilters: CommentFilters;
        notificationFilters: NotificationFilters;

        // Actions
        setOrders: (orders: Order[]) => void;
        setUsers: (users: User[]) => void;
        setDashboardStats: (stats: DashboardStats) => void;
        setReportsData: (data: ReportsData) => void;
        setContentData: (data: ContentData) => void;
        setSystemSettings: (settings: SystemSettings) => void;
        setCommentsData: (data: CommentsData) => void;
        setNotificationsData: (data: NotificationsData) => void;

        // Loading actions
        setOrdersLoading: (loading: boolean) => void;
        setUsersLoading: (loading: boolean) => void;
        setDashboardLoading: (loading: boolean) => void;
        setReportsLoading: (loading: boolean) => void;
        setContentLoading: (loading: boolean) => void;
        setSettingsLoading: (loading: boolean) => void;
        setCommentsLoading: (loading: boolean) => void;
        setNotificationsLoading: (loading: boolean) => void;

        // Error actions
        setOrdersError: (error: string | null) => void;
        setUsersError: (error: string | null) => void;
        setDashboardError: (error: string | null) => void;
        setReportsError: (error: string | null) => void;
        setContentError: (error: string | null) => void;
        setSettingsError: (error: string | null) => void;
        setCommentsError: (error: string | null) => void;
        setNotificationsError: (error: string | null) => void;

        // Filter actions
        setOrderFilters: (filters: Partial<AdminState['orderFilters']>) => void;
        setUserFilters: (filters: Partial<AdminState['userFilters']>) => void;
        setReportFilters: (filters: Partial<ReportFilters>) => void;
        setContentFilters: (filters: Partial<ContentFilters>) => void;
        setSystemFilters: (filters: Partial<SystemFilters>) => void;
        setCommentFilters: (filters: Partial<CommentFilters>) => void;
        setNotificationFilters: (filters: Partial<NotificationFilters>) => void;

        // Data manipulation
        updateOrderStatus: (orderId: string, status: Order['orderStatus'], trackingNumber?: string) => void;
        toggleUserStatus: (userId: string) => void;
        updateBanner: (bannerId: string, banner: Partial<Banner>) => void;
        toggleBannerStatus: (bannerId: string) => void;
        updatePageContent: (contentId: string, content: Partial<PageContent>) => void;
        updateSystemSetting: (category: keyof SystemSettings, settings: any) => void;
        updateCommentStatus: (commentId: string, status: Comment['status']) => void;
        updateComment: (commentId: string, comment: Partial<Comment>) => void;
        deleteComment: (commentId: string) => void;
        addCommentReply: (parentId: string, reply: Comment) => void;
        bulkUpdateComments: (commentIds: string[], update: Partial<Comment>) => void;
        updateNotificationStatus: (notificationId: string, status: Notification['status']) => void;
        markNotificationAsRead: (notificationId: string) => void;
        markAllNotificationsAsRead: () => void;
        deleteNotification: (notificationId: string) => void;
        bulkUpdateNotifications: (notificationIds: string[], update: Partial<Notification>) => void;
        addNotification: (notification: Notification) => void;

        // Reset actions
        resetOrdersState: () => void;
        resetUsersState: () => void;
        resetReportsState: () => void;
        resetContentState: () => void;
        resetSettingsState: () => void;
        resetCommentsState: () => void;
        resetNotificationsState: () => void;
}

const initialState = {
        orders: [],
        users: [],
        dashboardStats: null,
        reportsData: null,
        contentData: null,
        systemSettings: null,
        commentsData: null,
        notificationsData: null,
        loading: {
                orders: false,
                users: false,
                dashboard: false,
                reports: false,
                content: false,
                settings: false,
                comments: false,
                notifications: false,
        },
        error: {
                orders: null,
                users: null,
                dashboard: null,
                reports: null,
                content: null,
                settings: null,
                comments: null,
                notifications: null,
        },
        orderFilters: {
                status: 'all',
                search: '',
                dateFrom: undefined,
                dateTo: undefined,
                page: 1,
                limit: 20,
        },
        userFilters: {
                status: 'all',
                role: 'all',
                search: '',
                page: 1,
                limit: 20,
        },
        reportFilters: {
                dateRange: {
                        startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                        endDate: new Date(),
                },
                period: 'daily' as const,
        },
        contentFilters: {
                type: 'banners' as const,
                search: '',
                page_number: 1,
                limit: 20,
        },
        systemFilters: {
                category: 'general' as const,
                search: '',
        },
        commentFilters: {
                status: 'all' as const,
                search: '',
                sortBy: 'createdAt' as const,
                sortOrder: 'desc' as const,
                page: 1,
                limit: 20,
        },
        notificationFilters: {
                status: 'all' as const,
                type: 'all' as const,
                priority: 'all' as const,
                channel: 'all' as const,
                recipient: 'all' as const,
                search: '',
                sortBy: 'createdAt' as const,
                sortOrder: 'desc' as const,
                page: 1,
                limit: 20,
        },
};

const adminStore = create<AdminState>()(
        devtools(
                (set, get) => ({
                        ...initialState,

                        // Data setters
                        setOrders: (orders) => set({ orders }, false, 'setOrders'),
                        setUsers: (users) => set({ users }, false, 'setUsers'),
                        setDashboardStats: (stats) => set({ dashboardStats: stats }, false, 'setDashboardStats'),
                        setReportsData: (data) => set({ reportsData: data }, false, 'setReportsData'),
                        setContentData: (data) => set({ contentData: data }, false, 'setContentData'),
                        setSystemSettings: (settings) => set({ systemSettings: settings }, false, 'setSystemSettings'),
                        setCommentsData: (data) => set({ commentsData: data }, false, 'setCommentsData'),
                        setNotificationsData: (data) => set({ notificationsData: data }, false, 'setNotificationsData'),

                        // Loading setters
                        setOrdersLoading: (loading) =>
                                set((state) => ({
                                        loading: { ...state.loading, orders: loading }
                                }), false, 'setOrdersLoading'),
                        setUsersLoading: (loading) =>
                                set((state) => ({
                                        loading: { ...state.loading, users: loading }
                                }), false, 'setUsersLoading'),
                        setDashboardLoading: (loading) =>
                                set((state) => ({
                                        loading: { ...state.loading, dashboard: loading }
                                }), false, 'setDashboardLoading'),
                        setReportsLoading: (loading) =>
                                set((state) => ({
                                        loading: { ...state.loading, reports: loading }
                                }), false, 'setReportsLoading'),
                        setContentLoading: (loading) =>
                                set((state) => ({
                                        loading: { ...state.loading, content: loading }
                                }), false, 'setContentLoading'),
                        setSettingsLoading: (loading) =>
                                set((state) => ({
                                        loading: { ...state.loading, settings: loading }
                                }), false, 'setSettingsLoading'),
                        setCommentsLoading: (loading) =>
                                set((state) => ({
                                        loading: { ...state.loading, comments: loading }
                                }), false, 'setCommentsLoading'),
                        setNotificationsLoading: (loading) =>
                                set((state) => ({
                                        loading: { ...state.loading, notifications: loading }
                                }), false, 'setNotificationsLoading'),

                        // Error setters
                        setOrdersError: (error) =>
                                set((state) => ({
                                        error: { ...state.error, orders: error }
                                }), false, 'setOrdersError'),
                        setUsersError: (error) =>
                                set((state) => ({
                                        error: { ...state.error, users: error }
                                }), false, 'setUsersError'),
                        setDashboardError: (error) =>
                                set((state) => ({
                                        error: { ...state.error, dashboard: error }
                                }), false, 'setDashboardError'),
                        setReportsError: (error) =>
                                set((state) => ({
                                        error: { ...state.error, reports: error }
                                }), false, 'setReportsError'),
                        setContentError: (error) =>
                                set((state) => ({
                                        error: { ...state.error, content: error }
                                }), false, 'setContentError'),
                        setSettingsError: (error) =>
                                set((state) => ({
                                        error: { ...state.error, settings: error }
                                }), false, 'setSettingsError'),
                        setCommentsError: (error) =>
                                set((state) => ({
                                        error: { ...state.error, comments: error }
                                }), false, 'setCommentsError'),
                        setNotificationsError: (error) =>
                                set((state) => ({
                                        error: { ...state.error, notifications: error }
                                }), false, 'setNotificationsError'),

                        // Filter setters
                        setOrderFilters: (filters) =>
                                set((state) => ({
                                        orderFilters: { ...state.orderFilters, ...filters }
                                }), false, 'setOrderFilters'),
                        setUserFilters: (filters) =>
                                set((state) => ({
                                        userFilters: { ...state.userFilters, ...filters }
                                }), false, 'setUserFilters'),
                        setReportFilters: (filters) =>
                                set((state) => ({
                                        reportFilters: { ...state.reportFilters, ...filters }
                                }), false, 'setReportFilters'),
                        setContentFilters: (filters) =>
                                set((state) => ({
                                        contentFilters: { ...state.contentFilters, ...filters }
                                }), false, 'setContentFilters'),
                        setSystemFilters: (filters) =>
                                set((state) => ({
                                        systemFilters: { ...state.systemFilters, ...filters }
                                }), false, 'setSystemFilters'),
                        setCommentFilters: (filters) =>
                                set((state) => ({
                                        commentFilters: { ...state.commentFilters, ...filters }
                                }), false, 'setCommentFilters'),
                        setNotificationFilters: (filters) =>
                                set((state) => ({
                                        notificationFilters: { ...state.notificationFilters, ...filters }
                                }), false, 'setNotificationFilters'),

                        // Data manipulation
                        updateOrderStatus: (orderId, status, trackingNumber) =>
                                set((state) => ({
                                        orders: state.orders.map(order =>
                                                order._id === orderId
                                                        ? { ...order, orderStatus: status, trackingNumber }
                                                        : order
                                        )
                                }), false, 'updateOrderStatus'),

                        toggleUserStatus: (userId) =>
                                set((state) => ({
                                        users: state.users.map(user =>
                                                user._id === userId
                                                        ? { ...user, isActive: !user.isActive }
                                                        : user
                                        )
                                }), false, 'toggleUserStatus'),

                        updateBanner: (bannerId, banner) =>
                                set((state) => ({
                                        contentData: state.contentData ? {
                                                ...state.contentData,
                                                banners: state.contentData.banners.map(b =>
                                                        b._id === bannerId ? { ...b, ...banner } : b
                                                )
                                        } : null
                                }), false, 'updateBanner'),

                        toggleBannerStatus: (bannerId) =>
                                set((state) => ({
                                        contentData: state.contentData ? {
                                                ...state.contentData,
                                                banners: state.contentData.banners.map(b =>
                                                        b._id === bannerId ? { ...b, isActive: !b.isActive } : b
                                                )
                                        } : null
                                }), false, 'toggleBannerStatus'),

                        updatePageContent: (contentId, content) =>
                                set((state) => ({
                                        contentData: state.contentData ? {
                                                ...state.contentData,
                                                pages: state.contentData.pages.map(p =>
                                                        p._id === contentId ? { ...p, ...content } : p
                                                )
                                        } : null
                                }), false, 'updatePageContent'),

                        updateSystemSetting: (category, settings) =>
                                set((state) => ({
                                        systemSettings: state.systemSettings ? {
                                                ...state.systemSettings,
                                                [category]: { ...state.systemSettings[category], ...settings }
                                        } : null
                                }), false, 'updateSystemSetting'),

                        updateCommentStatus: (commentId, status) =>
                                set((state) => ({
                                        commentsData: state.commentsData ? {
                                                ...state.commentsData,
                                                comments: state.commentsData.comments.map(c =>
                                                        c._id === commentId ? { ...c, status } : c
                                                )
                                        } : null
                                }), false, 'updateCommentStatus'),

                        updateComment: (commentId, comment) =>
                                set((state) => ({
                                        commentsData: state.commentsData ? {
                                                ...state.commentsData,
                                                comments: state.commentsData.comments.map(c =>
                                                        c._id === commentId ? { ...c, ...comment } : c
                                                )
                                        } : null
                                }), false, 'updateComment'),

                        deleteComment: (commentId) =>
                                set((state) => ({
                                        commentsData: state.commentsData ? {
                                                ...state.commentsData,
                                                comments: state.commentsData.comments.filter(c => c._id !== commentId)
                                        } : null
                                }), false, 'deleteComment'),

                        addCommentReply: (parentId, reply) =>
                                set((state) => ({
                                        commentsData: state.commentsData ? {
                                                ...state.commentsData,
                                                comments: [...state.commentsData.comments, reply]
                                        } : null
                                }), false, 'addCommentReply'),

                        bulkUpdateComments: (commentIds, update) =>
                                set((state) => ({
                                        commentsData: state.commentsData ? {
                                                ...state.commentsData,
                                                comments: state.commentsData.comments.map(c =>
                                                        commentIds.includes(c._id) ? { ...c, ...update } : c
                                                )
                                        } : null
                                }), false, 'bulkUpdateComments'),

                        // Notification Data Manipulation
                        updateNotificationStatus: (notificationId, status) =>
                                set((state) => ({
                                        notificationsData: state.notificationsData ? {
                                                ...state.notificationsData,
                                                notifications: state.notificationsData.notifications.map(n =>
                                                        n._id === notificationId ? { ...n, status } : n
                                                )
                                        } : null
                                }), false, 'updateNotificationStatus'),

                        markNotificationAsRead: (notificationId) =>
                                set((state) => ({
                                        notificationsData: state.notificationsData ? {
                                                ...state.notificationsData,
                                                notifications: state.notificationsData.notifications.map(n =>
                                                        n._id === notificationId ? {
                                                                ...n,
                                                                status: 'read',
                                                                delivery: { ...n.delivery, readAt: new Date().toISOString() }
                                                        } : n
                                                ),
                                                unreadCount: Math.max(0, state.notificationsData.unreadCount - 1)
                                        } : null
                                }), false, 'markNotificationAsRead'),

                        markAllNotificationsAsRead: () =>
                                set((state) => ({
                                        notificationsData: state.notificationsData ? {
                                                ...state.notificationsData,
                                                notifications: state.notificationsData.notifications.map(n =>
                                                        n.status !== 'read' ? {
                                                                ...n,
                                                                status: 'read',
                                                                delivery: { ...n.delivery, readAt: new Date().toISOString() }
                                                        } : n
                                                ),
                                                unreadCount: 0
                                        } : null
                                }), false, 'markAllNotificationsAsRead'),

                        deleteNotification: (notificationId) =>
                                set((state) => ({
                                        notificationsData: state.notificationsData ? {
                                                ...state.notificationsData,
                                                notifications: state.notificationsData.notifications.filter(n => n._id !== notificationId)
                                        } : null
                                }), false, 'deleteNotification'),

                        bulkUpdateNotifications: (notificationIds, update) =>
                                set((state) => ({
                                        notificationsData: state.notificationsData ? {
                                                ...state.notificationsData,
                                                notifications: state.notificationsData.notifications.map(n =>
                                                        notificationIds.includes(n._id) ? { ...n, ...update } : n
                                                )
                                        } : null
                                }), false, 'bulkUpdateNotifications'),

                        addNotification: (notification) =>
                                set((state) => ({
                                        notificationsData: state.notificationsData ? {
                                                ...state.notificationsData,
                                                notifications: [notification, ...state.notificationsData.notifications],
                                                unreadCount: state.notificationsData.unreadCount + 1
                                        } : null
                                }), false, 'addNotification'),

                        // Reset actions
                        resetOrdersState: () =>
                                set((state) => ({
                                        orders: [],
                                        loading: { ...state.loading, orders: false },
                                        error: { ...state.error, orders: null },
                                        orderFilters: initialState.orderFilters,
                                }), false, 'resetOrdersState'),

                        resetUsersState: () =>
                                set((state) => ({
                                        users: [],
                                        loading: { ...state.loading, users: false },
                                        error: { ...state.error, users: null },
                                        userFilters: initialState.userFilters,
                                }), false, 'resetUsersState'),

                        resetReportsState: () =>
                                set((state) => ({
                                        reportsData: null,
                                        loading: { ...state.loading, reports: false },
                                        error: { ...state.error, reports: null },
                                        reportFilters: initialState.reportFilters,
                                }), false, 'resetReportsState'),

                        resetContentState: () =>
                                set((state) => ({
                                        contentData: null,
                                        loading: { ...state.loading, content: false },
                                        error: { ...state.error, content: null },
                                        contentFilters: initialState.contentFilters,
                                }), false, 'resetContentState'),

                        resetSettingsState: () =>
                                set((state) => ({
                                        systemSettings: null,
                                        loading: { ...state.loading, settings: false },
                                        error: { ...state.error, settings: null },
                                        systemFilters: initialState.systemFilters,
                                }), false, 'resetSettingsState'),

                        resetCommentsState: () =>
                                set((state) => ({
                                        commentsData: null,
                                        loading: { ...state.loading, comments: false },
                                        error: { ...state.error, comments: null },
                                        commentFilters: initialState.commentFilters,
                                }), false, 'resetCommentsState'),

                        resetNotificationsState: () =>
                                set((state) => ({
                                        notificationsData: null,
                                        loading: { ...state.loading, notifications: false },
                                        error: { ...state.error, notifications: null },
                                        notificationFilters: initialState.notificationFilters,
                                }), false, 'resetNotificationsState'),
                }),
                {
                        name: 'admin-store',
                }
        )
);

// Export store directly - no selectors to prevent infinite loops
export default adminStore;

// Simple compatibility functions that don't cause infinite loops
export const getAdminStore = () => adminStore.getState();

export const useOrdersState = () => {
        const state = adminStore.getState();
        return {
                orders: state.orders,
                loading: state.loading.orders,
                error: state.error.orders,
                filters: state.orderFilters,
        };
};

export const useUsersState = () => {
        const state = adminStore.getState();
        return {
                users: state.users,
                loading: state.loading.users,
                error: state.error.users,
                filters: state.userFilters,
        };
};

export const useDashboardState = () => {
        const state = adminStore.getState();
        return {
                stats: state.dashboardStats,
                loading: state.loading.dashboard,
                error: state.error.dashboard,
        };
};

export const useNotificationsState = () => {
        const state = adminStore.getState();
        return {
                data: state.notificationsData,
                loading: state.loading.notifications,
                error: state.error.notifications,
                filters: state.notificationFilters,
        };
};

// Add compatibility exports for hooks
export const useAdminStore = adminStore;
export const useOrdersData = useOrdersState;
export const useUsersData = useUsersState;
export const useDashboardData = useDashboardState;
export const useNotificationsData = useNotificationsState;

// Add missing exports
export const useCommentsData = () => {
        const state = adminStore.getState();
        return {
                data: state.commentsData,
                loading: state.loading.comments,
                error: state.error.comments,
                filters: state.commentFilters,
        };
};

export const useContentData = () => {
        const state = adminStore.getState();
        return {
                data: state.contentData,
                loading: state.loading.content,
                error: state.error.content,
                filters: state.contentFilters,
        };
};

export const useReportsData = () => {
        const state = adminStore.getState();
        return {
                data: state.reportsData,
                loading: state.loading.reports,
                error: state.error.reports,
                filters: state.reportFilters,
        };
};

export const useSystemSettingsData = () => {
        const state = adminStore.getState();
        return {
                settings: state.systemSettings,
                loading: state.loading.settings,
                error: state.error.settings,
                filters: state.systemFilters,
        };
};

// Add mock useAdminActions for compatibility
export const useAdminActions = () => {
        const store = adminStore.getState();

        return {
                // Proper implementations with correct parameters
                setOrders: (orders: any[]) => adminStore.getState().setOrders(orders),
                setUsers: (users: any[]) => adminStore.getState().setUsers(users),
                setDashboardStats: (stats: any) => adminStore.getState().setDashboardStats(stats),
                setNotificationsData: (data: any) => adminStore.getState().setNotificationsData(data),
                setCommentsData: (data: any) => adminStore.getState().setCommentsData(data),
                setContentData: (data: any) => adminStore.getState().setContentData(data),
                setReportsData: (data: any) => adminStore.getState().setReportsData(data),
                setSystemSettings: (settings: any) => adminStore.getState().setSystemSettings(settings),

                // Loading setters with parameters
                setOrdersLoading: (loading: boolean) => adminStore.getState().setOrdersLoading(loading),
                setUsersLoading: (loading: boolean) => adminStore.getState().setUsersLoading(loading),
                setDashboardLoading: (loading: boolean) => adminStore.getState().setDashboardLoading(loading),
                setNotificationsLoading: (loading: boolean) => adminStore.getState().setNotificationsLoading(loading),
                setCommentsLoading: (loading: boolean) => adminStore.getState().setCommentsLoading(loading),
                setContentLoading: (loading: boolean) => adminStore.getState().setContentLoading(loading),
                setReportsLoading: (loading: boolean) => adminStore.getState().setReportsLoading(loading),
                setSettingsLoading: (loading: boolean) => adminStore.getState().setSettingsLoading(loading),

                // Error setters with parameters
                setOrdersError: (error: string | null) => adminStore.getState().setOrdersError(error),
                setUsersError: (error: string | null) => adminStore.getState().setUsersError(error),
                setDashboardError: (error: string | null) => adminStore.getState().setDashboardError(error),
                setNotificationsError: (error: string | null) => adminStore.getState().setNotificationsError(error),
                setCommentsError: (error: string | null) => adminStore.getState().setCommentsError(error),
                setContentError: (error: string | null) => adminStore.getState().setContentError(error),
                setReportsError: (error: string | null) => adminStore.getState().setReportsError(error),
                setSettingsError: (error: string | null) => adminStore.getState().setSettingsError(error),

                // Filter setters with parameters
                setOrderFilters: (filters: any) => adminStore.getState().setOrderFilters(filters),
                setUserFilters: (filters: any) => adminStore.getState().setUserFilters(filters),
                setNotificationFilters: (filters: any) => adminStore.getState().setNotificationFilters(filters),
                setCommentFilters: (filters: any) => adminStore.getState().setCommentFilters(filters),
                setContentFilters: (filters: any) => adminStore.getState().setContentFilters(filters),
                setReportFilters: (filters: any) => adminStore.getState().setReportFilters(filters),
                setSystemFilters: (filters: any) => adminStore.getState().setSystemFilters(filters),

                // Data manipulation with parameters
                updateOrderStatus: (id: string, status: string, trackingNumber?: string) =>
                        adminStore.getState().updateOrderStatus(id, status as any, trackingNumber),
                toggleUserStatus: (id: string) => adminStore.getState().toggleUserStatus(id),
                updateBanner: (id: string, banner: any) => adminStore.getState().updateBanner(id, banner),
                toggleBannerStatus: (id: string) => adminStore.getState().toggleBannerStatus(id),
                updatePageContent: (id: string, content: any) => adminStore.getState().updatePageContent(id, content),
                updateSystemSetting: (category: string, settings: any) => adminStore.getState().updateSystemSetting(category as any, settings),
                updateCommentStatus: (id: string, status: string) => adminStore.getState().updateCommentStatus(id, status as any),
                updateComment: (id: string, comment: any) => adminStore.getState().updateComment(id, comment),
                deleteComment: (id: string) => adminStore.getState().deleteComment(id),
                addCommentReply: (parentId: string, reply: any) => adminStore.getState().addCommentReply(parentId, reply),
                bulkUpdateComments: (ids: string[], update: any) => adminStore.getState().bulkUpdateComments(ids, update),
                updateNotificationStatus: (id: string, status: string) => adminStore.getState().updateNotificationStatus(id, status as any),
                markNotificationAsRead: (id: string) => adminStore.getState().markNotificationAsRead(id),
                markAllNotificationsAsRead: () => adminStore.getState().markAllNotificationsAsRead(),
                deleteNotification: (id: string) => adminStore.getState().deleteNotification(id),
                bulkUpdateNotifications: (ids: string[], update: any) => adminStore.getState().bulkUpdateNotifications(ids, update),
                addNotification: (notification: any) => adminStore.getState().addNotification(notification),

                // Reset actions
                resetOrdersState: () => adminStore.getState().resetOrdersState(),
                resetUsersState: () => adminStore.getState().resetUsersState(),
                resetReportsState: () => adminStore.getState().resetReportsState(),
                resetContentState: () => adminStore.getState().resetContentState(),
                resetSettingsState: () => adminStore.getState().resetSettingsState(),
                resetCommentsState: () => adminStore.getState().resetCommentsState(),
                resetNotificationsState: () => adminStore.getState().resetNotificationsState(),
        };
}; 