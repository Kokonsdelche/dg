import { apiClient } from './api';

// Settings API
export const adminAPIExtensions = {
        settings: {
                get: () => apiClient.get('/settings'),
                update: (data: any) => apiClient.put('/settings', data),
                reset: () => apiClient.delete('/settings'),
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