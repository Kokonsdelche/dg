import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { adminAPI } from '../services/api';
import {
        useContentData,
        useAdminActions,
        Banner,
        MediaFile,
        PageContent,
        ContentFilters
} from '../store/adminStore';

export const useAdminContent = () => {
        const { data, loading, error, filters } = useContentData();
        const {
                setContentData,
                setContentLoading,
                setContentError,
                setContentFilters,
                updateBanner,
                toggleBannerStatus,
                updatePageContent,
                resetContentState,
        } = useAdminActions();

        // Load content based on filters
        const loadContent = useCallback(async () => {
                setContentLoading(true);
                setContentError(null);

                try {
                        let contentData = { banners: [], media: [], pages: [] };

                        // Load based on content type
                        if (filters.type === 'banners' || filters.type === undefined) {
                                const bannersResponse = await adminAPI.content.getBanners(filters);
                                contentData.banners = bannersResponse.data.banners || [];
                        }

                        if (filters.type === 'media' || filters.type === undefined) {
                                const mediaResponse = await adminAPI.content.getMedia(filters);
                                contentData.media = mediaResponse.data.media || [];
                        }

                        if (filters.type === 'pages' || filters.type === undefined) {
                                const pagesResponse = await adminAPI.content.getPages(filters);
                                contentData.pages = pagesResponse.data.pages || [];
                        }

                        setContentData(contentData);
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || 'خطا در بارگذاری محتوا';
                        setContentError(errorMessage);
                        toast.error(errorMessage);
                } finally {
                        setContentLoading(false);
                }
        }, [filters, setContentData, setContentLoading, setContentError]);

        // Banner Management
        const createBanner = useCallback(async (bannerData: Omit<Banner, '_id' | 'createdAt' | 'updatedAt'>) => {
                try {
                        const response = await adminAPI.content.createBanner(bannerData);
                        toast.success('بنر با موفقیت ایجاد شد');
                        await loadContent(); // Refresh data
                        return response.data.banner;
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || 'خطا در ایجاد بنر';
                        toast.error(errorMessage);
                        throw err;
                }
        }, [loadContent]);

        const updateBannerById = useCallback(async (bannerId: string, bannerData: Partial<Banner>) => {
                try {
                        const response = await adminAPI.content.updateBanner(bannerId, bannerData);
                        updateBanner(bannerId, bannerData);
                        toast.success('بنر با موفقیت بروزرسانی شد');
                        return response.data.banner;
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || 'خطا در بروزرسانی بنر';
                        toast.error(errorMessage);
                        throw err;
                }
        }, [updateBanner]);

        const deleteBanner = useCallback(async (bannerId: string) => {
                try {
                        await adminAPI.content.deleteBanner(bannerId);
                        toast.success('بنر با موفقیت حذف شد');
                        await loadContent(); // Refresh data
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || 'خطا در حذف بنر';
                        toast.error(errorMessage);
                        throw err;
                }
        }, [loadContent]);

        const toggleBannerStatusById = useCallback(async (bannerId: string) => {
                try {
                        await adminAPI.content.toggleBannerStatus(bannerId);
                        toggleBannerStatus(bannerId);
                        toast.success('وضعیت بنر تغییر کرد');
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || 'خطا در تغییر وضعیت بنر';
                        toast.error(errorMessage);
                        throw err;
                }
        }, [toggleBannerStatus]);

        // Media Management
        const uploadMedia = useCallback(async (file: File, folder: string = 'general', altText?: string, tags?: string[]) => {
                try {
                        const formData = new FormData();
                        formData.append('file', file);
                        formData.append('folder', folder);
                        if (altText) formData.append('altText', altText);
                        if (tags) formData.append('tags', JSON.stringify(tags));

                        const response = await adminAPI.content.uploadMedia(formData);
                        toast.success('فایل با موفقیت آپلود شد');
                        await loadContent(); // Refresh data
                        return response.data.media;
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || 'خطا در آپلود فایل';
                        toast.error(errorMessage);
                        throw err;
                }
        }, [loadContent]);

        const deleteMedia = useCallback(async (mediaId: string) => {
                try {
                        await adminAPI.content.deleteMedia(mediaId);
                        toast.success('فایل با موفقیت حذف شد');
                        await loadContent(); // Refresh data
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || 'خطا در حذف فایل';
                        toast.error(errorMessage);
                        throw err;
                }
        }, [loadContent]);

        const updateMediaById = useCallback(async (mediaId: string, mediaData: Partial<MediaFile>) => {
                try {
                        const response = await adminAPI.content.updateMedia(mediaId, mediaData);
                        toast.success('فایل با موفقیت بروزرسانی شد');
                        await loadContent(); // Refresh data
                        return response.data.media;
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || 'خطا در بروزرسانی فایل';
                        toast.error(errorMessage);
                        throw err;
                }
        }, [loadContent]);

        // Page Content Management
        const createPageContent = useCallback(async (contentData: Omit<PageContent, '_id' | 'createdAt' | 'updatedAt'>) => {
                try {
                        const response = await adminAPI.content.createPageContent(contentData);
                        toast.success('محتوای صفحه با موفقیت ایجاد شد');
                        await loadContent(); // Refresh data
                        return response.data.content;
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || 'خطا در ایجاد محتوای صفحه';
                        toast.error(errorMessage);
                        throw err;
                }
        }, [loadContent]);

        const updatePageContentById = useCallback(async (contentId: string, contentData: Partial<PageContent>) => {
                try {
                        const response = await adminAPI.content.updatePageContent(contentId, contentData);
                        updatePageContent(contentId, contentData);
                        toast.success('محتوای صفحه با موفقیت بروزرسانی شد');
                        return response.data.content;
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || 'خطا در بروزرسانی محتوای صفحه';
                        toast.error(errorMessage);
                        throw err;
                }
        }, [updatePageContent]);

        const deletePageContent = useCallback(async (contentId: string) => {
                try {
                        await adminAPI.content.deletePageContent(contentId);
                        toast.success('محتوای صفحه با موفقیت حذف شد');
                        await loadContent(); // Refresh data
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || 'خطا در حذف محتوای صفحه';
                        toast.error(errorMessage);
                        throw err;
                }
        }, [loadContent]);

        // Filter Management
        const changeContentType = useCallback((type: ContentFilters['type']) => {
                setContentFilters({
                        type,
                        page_number: 1 // Reset pagination
                });
        }, [setContentFilters]);

        const changeSearch = useCallback((search: string) => {
                setContentFilters({
                        search,
                        page_number: 1 // Reset pagination when searching
                });
        }, [setContentFilters]);

        const changePage = useCallback((page: number) => {
                setContentFilters({ page_number: page });
        }, [setContentFilters]);

        const changeFilters = useCallback((newFilters: Partial<ContentFilters>) => {
                setContentFilters({ ...newFilters, page_number: 1 });
        }, [setContentFilters]);

        // Refresh data
        const refreshData = useCallback(() => {
                loadContent();
        }, [loadContent]);

        // Load data on mount and when filters change
        useEffect(() => {
                loadContent();
        }, [loadContent]);

        // Computed values
        const hasData = useMemo(() => {
                if (!data) return false;
                return data.banners.length > 0 || data.media.length > 0 || data.pages.length > 0;
        }, [data]);

        const isEmpty = useMemo(() => {
                return !loading && !hasData;
        }, [loading, hasData]);

        const isInitialLoad = useMemo(() => {
                return loading && !data;
        }, [loading, data]);

        const activeData = useMemo(() => {
                if (!data) return null;

                switch (filters.type) {
                        case 'banners':
                                return data.banners;
                        case 'media':
                                return data.media;
                        case 'pages':
                                return data.pages;
                        default:
                                return data;
                }
        }, [data, filters.type]);

        const statistics = useMemo(() => {
                if (!data) return null;

                return {
                        totalBanners: data.banners.length,
                        activeBanners: data.banners.filter(b => b.isActive).length,
                        totalMedia: data.media.length,
                        mediaSize: data.media.reduce((total, m) => total + m.size, 0),
                        totalPages: data.pages.length,
                        activePages: data.pages.filter(p => p.isActive).length,
                };
        }, [data]);

        const totalPages = useMemo(() => {
                if (!activeData || !Array.isArray(activeData)) return 1;
                return Math.ceil(activeData.length / filters.limit);
        }, [activeData, filters.limit]);

        return {
                // Data
                data,
                activeData,
                loading,
                error,
                filters,
                statistics,

                // Computed
                hasData,
                isEmpty,
                isInitialLoad,
                totalPages,

                // Banner Actions
                createBanner,
                updateBannerById,
                deleteBanner,
                toggleBannerStatusById,

                // Media Actions
                uploadMedia,
                deleteMedia,
                updateMediaById,

                // Page Content Actions
                createPageContent,
                updatePageContentById,
                deletePageContent,

                // Filter Actions
                changeContentType,
                changeSearch,
                changePage,
                changeFilters,

                // General Actions
                refreshData,
                resetState: resetContentState,
        };
}; 