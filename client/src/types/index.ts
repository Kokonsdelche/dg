export interface User {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        role: 'user' | 'admin';
        isActive: boolean;
        isAdmin?: boolean;
        address?: {
                street: string;
                city: string;
                state: string;
                postalCode: string;
                country: string;
        };
        createdAt: string;
        updatedAt: string;
}

export interface Address {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
}

export interface Product {
        _id: string;
        name: string;
        description: string;
        longDescription?: string;
        price: number;
        discountPrice?: number;
        discount?: number;
        category: 'شال' | 'روسری' | 'سایر';
        subcategory?: string;
        brand?: string;
        material?: string;
        colors?: ProductColor[];
        sizes?: ProductSize[];
        images: ProductImage[];
        tags?: string[];
        stock: number;
        isActive: boolean;
        isFeatured: boolean;
        averageRating?: number;
        totalReviews?: number;
        soldCount?: number;
        viewCount?: number;
        createdAt: string;
        updatedAt: string;
}

export type ProductImage = string;

export interface ProductColor {
        name: string;
        hex: string;
        stock: number;
        _id?: string;
}

export interface ProductSize {
        name: string;
        dimensions?: string;
        stock: number;
        _id?: string;
}

export interface CartItem {
        productId: string;
        name: string;
        price: number;
        image?: string;
        quantity: number;
        color?: string;
        size?: string;
}

export interface Order {
        _id: string;
        orderNumber: string;
        user: string;
        items: OrderItem[];
        totalAmount: number;
        discountAmount?: number;
        shippingCost?: number;
        finalAmount: number;
        shippingAddress: Address;
        paymentMethod: 'zarinpal' | 'cash_on_delivery';
        paymentStatus: 'pending' | 'paid' | 'failed';
        orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
        trackingNumber?: string;
        statusHistory: Array<{
                status: string;
                note?: string;
                date: string;
        }>;
        createdAt: string;
        updatedAt: string;
}

export interface OrderItem {
        product: string;
        name: string;
        price: number;
        quantity: number;
        image?: string;
        color?: string;
        size?: string;
}

export interface AuthResponse {
        user: User;
        token: string;
        refreshToken: string;
}

export interface ApiResponse<T> {
        message?: string;
        data?: T;
        error?: string;
}

export interface PaginatedResponse<T> {
        data: T[];
        totalPages: number;
        currentPage: number;
        total: number;
}

export interface CartContextType {
        cartItems: CartItem[];
        addToCart: (item: CartItem) => void;
        removeFromCart: (productId: string, color?: string, size?: string) => void;
        updateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
        clearCart: () => void;
        getCartTotal: () => number;
        getCartItemsCount: () => number;
}

// Notification Types
export interface Notification {
        _id: string;
        title: string;
        message: string;
        type: 'info' | 'warning' | 'error' | 'success' | 'order' | 'payment' | 'system';
        status: 'read' | 'unread' | 'pending' | 'sent' | 'failed' | 'delivered';
        priority: 'low' | 'medium' | 'high' | 'urgent';
        channel: 'email' | 'sms' | 'push' | 'in-app';
        recipient?: string;
        recipientType: 'user' | 'admin' | 'all';
        data?: any;
        tags?: string[];
        sentAt?: string;
        readAt?: string;
        createdAt: string;
        updatedAt: string;
}

export interface NotificationTemplate {
        _id: string;
        name: string;
        description?: string;
        type: 'email' | 'sms' | 'push' | 'in-app';
        category: 'order' | 'payment' | 'marketing' | 'system' | 'custom';
        subject?: string;
        content: string;
        variables?: string[];
        isActive: boolean;
        isSystem: boolean;
        createdAt: string;
        updatedAt: string;
}

export interface NotificationCampaign {
        _id: string;
        name: string;
        description?: string;
        type: 'broadcast' | 'targeted' | 'automated';
        status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused' | 'cancelled';
        template: string;
        targetAudience: {
                type: 'all' | 'segment' | 'custom';
                filters?: any;
                userIds?: string[];
        };
        schedule?: {
                type: 'immediate' | 'scheduled' | 'recurring';
                scheduledAt?: string;
                timezone?: string;
                recurring?: {
                        frequency: 'daily' | 'weekly' | 'monthly';
                        interval: number;
                        endDate?: string;
                };
        };
        analytics?: {
                sent: number;
                delivered: number;
                opened: number;
                clicked: number;
                failed: number;
        };
        createdAt: string;
        updatedAt: string;
}

export interface EmailSettings {
        provider: 'smtp' | 'sendgrid' | 'mailgun' | 'ses';
        smtp?: {
                host: string;
                port: number;
                secure: boolean;
                username: string;
                password: string;
        };
        sendgrid?: {
                apiKey: string;
        };
        mailgun?: {
                apiKey: string;
                domain: string;
        };
        ses?: {
                accessKeyId: string;
                secretAccessKey: string;
                region: string;
        };
        fromEmail: string;
        fromName: string;
        replyToEmail?: string;
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
        defaultTemplate: string;
        headerLogo: string;
        footerText: string;
        unsubscribeText: string;
        privacyPolicyUrl: string;
        termsOfServiceUrl: string;
}

export interface SMSSettings {
        provider: 'kavenegar' | 'ghasedak' | 'ippanel' | 'melipayamak';
        kavenegar?: {
                apiKey: string;
                sender: string;
        };
        ghasedak?: {
                apiKey: string;
                sender: string;
        };
        ippanel?: {
                apiKey: string;
                sender: string;
        };
        melipayamak?: {
                username: string;
                password: string;
                sender: string;
        };
        enabled: boolean;
        templates: {
                orderConfirmation: {
                        enabled: boolean;
                        content: string;
                };
                orderShipped: {
                        enabled: boolean;
                        content: string;
                };
                passwordReset: {
                        enabled: boolean;
                        content: string;
                };
                verificationCode: {
                        enabled: boolean;
                        content: string;
                };
        };
}

export interface NotificationFilters {
        search: string;
        status: string;
        type: string;
        priority: string;
        channel: string;
        recipient?: string;
        sortBy: string;
        sortOrder: string;
        page: number;
        limit: number;
        dateRange?: {
                startDate: Date;
                endDate: Date;
        };
        tags?: string[];
}

export interface NotificationStats {
        total: number;
        unread: number;
        delivered: number;
        failed: number;
        sent: number;
        pending: number;
        read: number;
        deliveryRate: number;
        readRate: number;
        overview?: {
                totalSent: number;
                totalDelivered: number;
                totalRead: number;
                totalFailed: number;
        };
} 