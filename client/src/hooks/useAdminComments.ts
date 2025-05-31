import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { adminAPI } from '../services/api';
import {
        useCommentsData,
        useAdminActions,
        Comment,
        CommentAnalytics,
        CommentFilters,
        CommentModerationAction,
        CommentBulkOperation,
        CommentModerationSettings,
        CommentsData
} from '../store/adminStore';

export const useAdminComments = () => {
        const { data, loading, error, filters } = useCommentsData();
        const {
                setCommentsData,
                setCommentsLoading,
                setCommentsError,
                setCommentFilters,
                updateCommentStatus,
                updateComment,
                deleteComment,
                addCommentReply,
                bulkUpdateComments,
                resetCommentsState,
        } = useAdminActions();

        // Load comments
        const loadComments = useCallback(async (customFilters?: Partial<CommentFilters>) => {
                setCommentsLoading(true);
                setCommentsError(null);

                try {
                        const queryFilters = { ...filters, ...customFilters };
                        const response = await adminAPI.comments.getComments(queryFilters);
                        setCommentsData(response.data);
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || 'خطا در بارگذاری نظرات';
                        setCommentsError(errorMessage);
                        toast.error(errorMessage);
                } finally {
                        setCommentsLoading(false);
                }
        }, [filters, setCommentsData, setCommentsLoading, setCommentsError]);

        // Get comment by ID
        const getCommentById = useCallback(async (commentId: string) => {
                try {
                        const response = await adminAPI.comments.getCommentById(commentId);
                        return response.data.comment;
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || 'خطا در دریافت نظر';
                        toast.error(errorMessage);
                        throw err;
                }
        }, []);

        // Create comment (admin reply)
        const createComment = useCallback(async (commentData: {
                content: string;
                productId?: string;
                parentCommentId?: string;
                rating?: number;
        }) => {
                try {
                        const response = await adminAPI.comments.createComment(commentData);

                        if (commentData.parentCommentId) {
                                addCommentReply(commentData.parentCommentId, response.data.comment);
                        } else {
                                await loadComments();
                        }

                        toast.success('نظر با موفقیت ایجاد شد');
                        return response.data.comment;
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || 'خطا در ایجاد نظر';
                        toast.error(errorMessage);
                        throw err;
                }
        }, [addCommentReply, loadComments]);

        // Update comment
        const updateCommentData = useCallback(async (commentId: string, updateData: Partial<Comment>) => {
                try {
                        const response = await adminAPI.comments.updateComment(commentId, updateData);
                        updateComment(commentId, response.data.comment);
                        toast.success('نظر با موفقیت بروزرسانی شد');
                        return response.data.comment;
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || 'خطا در بروزرسانی نظر';
                        toast.error(errorMessage);
                        throw err;
                }
        }, [updateComment]);

        // Delete comment
        const deleteCommentData = useCallback(async (commentId: string, permanent: boolean = false) => {
                try {
                        await adminAPI.comments.deleteComment(commentId, permanent);
                        deleteComment(commentId);
                        toast.success(`نظر با موفقیت ${permanent ? 'حذف' : 'به زباله‌دان منتقل'} شد`);
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || 'خطا در حذف نظر';
                        toast.error(errorMessage);
                        throw err;
                }
        }, [deleteComment]);

        // Moderation actions
        const approveComment = useCallback(async (commentId: string, note?: string) => {
                try {
                        await adminAPI.comments.approveComment(commentId, note);
                        updateCommentStatus(commentId, 'approved');
                        toast.success('نظر تایید شد');
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || 'خطا در تایید نظر';
                        toast.error(errorMessage);
                        throw err;
                }
        }, [updateCommentStatus]);

        const rejectComment = useCallback(async (commentId: string, reason?: string) => {
                try {
                        await adminAPI.comments.rejectComment(commentId, reason);
                        updateCommentStatus(commentId, 'rejected');
                        toast.success('نظر رد شد');
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || 'خطا در رد نظر';
                        toast.error(errorMessage);
                        throw err;
                }
        }, [updateCommentStatus]);

        const markAsSpam = useCallback(async (commentId: string) => {
                try {
                        await adminAPI.comments.markAsSpam(commentId);
                        updateCommentStatus(commentId, 'spam');
                        toast.success('نظر به عنوان اسپم علامت‌گذاری شد');
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || 'خطا در علامت‌گذاری به عنوان اسپم';
                        toast.error(errorMessage);
                        throw err;
                }
        }, [updateCommentStatus]);

        // Bulk operations
        const performBulkOperation = useCallback(async (operation: CommentBulkOperation) => {
                try {
                        const response = await adminAPI.comments.bulkOperation(operation);

                        // Update local state based on operation
                        switch (operation.action) {
                                case 'approve':
                                        bulkUpdateComments(operation.commentIds, { status: 'approved' });
                                        break;
                                case 'reject':
                                        bulkUpdateComments(operation.commentIds, { status: 'rejected' });
                                        break;
                                case 'mark_spam':
                                        bulkUpdateComments(operation.commentIds, { status: 'spam' });
                                        break;
                                case 'delete':
                                        // Reload comments after bulk delete
                                        await loadComments();
                                        break;
                                default:
                                        await loadComments();
                        }

                        toast.success(`عملیات دسته‌ای روی ${operation.commentIds.length} نظر انجام شد`);
                        return response.data;
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || 'خطا در انجام عملیات دسته‌ای';
                        toast.error(errorMessage);
                        throw err;
                }
        }, [bulkUpdateComments, loadComments]);

        // Analytics
        const getCommentsAnalytics = useCallback(async (params?: {
                startDate?: Date;
                endDate?: Date;
                productId?: string;
        }) => {
                try {
                        const response = await adminAPI.comments.getAnalytics(params);
                        return response.data.analytics;
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || 'خطا در دریافت آمار نظرات';
                        toast.error(errorMessage);
                        throw err;
                }
        }, []);

        // Sentiment analysis
        const analyzeCommentSentiment = useCallback(async (commentId: string) => {
                try {
                        const response = await adminAPI.comments.analyzeSentiment(commentId);
                        updateComment(commentId, { sentiment: response.data.sentiment });
                        return response.data.sentiment;
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || 'خطا در تحلیل احساسات';
                        toast.error(errorMessage);
                        throw err;
                }
        }, [updateComment]);

        // Moderation settings
        const getModerationSettings = useCallback(async () => {
                try {
                        const response = await adminAPI.comments.getModerationSettings();
                        return response.data.settings;
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || 'خطا در دریافت تنظیمات نظارت';
                        toast.error(errorMessage);
                        throw err;
                }
        }, []);

        const updateModerationSettings = useCallback(async (settings: Partial<CommentModerationSettings>) => {
                try {
                        const response = await adminAPI.comments.updateModerationSettings(settings);
                        toast.success('تنظیمات نظارت بروزرسانی شد');
                        return response.data.settings;
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || 'خطا در بروزرسانی تنظیمات نظارت';
                        toast.error(errorMessage);
                        throw err;
                }
        }, []);

        // Export comments
        const exportComments = useCallback(async (format: 'csv' | 'excel' | 'pdf', customFilters?: Partial<CommentFilters>) => {
                try {
                        const queryFilters = { ...filters, ...customFilters };
                        const response = await adminAPI.comments.exportComments(format, queryFilters);

                        // Create download link
                        const blob = new Blob([response.data], {
                                type: format === 'pdf' ? 'application/pdf' : 'application/octet-stream'
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `comments-${new Date().toISOString().split('T')[0]}.${format}`;
                        a.click();
                        URL.revokeObjectURL(url);

                        toast.success('خروجی نظرات با موفقیت دانلود شد');
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || 'خطا در خروجی گیری نظرات';
                        toast.error(errorMessage);
                        throw err;
                }
        }, [filters]);

        // User comment history
        const getUserCommentHistory = useCallback(async (userId: string, params?: {
                page?: number;
                limit?: number;
        }) => {
                try {
                        const response = await adminAPI.comments.getUserCommentHistory(userId, params);
                        return response.data;
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || 'خطا در دریافت تاریخچه نظرات کاربر';
                        toast.error(errorMessage);
                        throw err;
                }
        }, []);

        // Spam detection
        const runSpamDetection = useCallback(async (commentIds?: string[]) => {
                try {
                        const response = await adminAPI.comments.runSpamDetection(commentIds);
                        if (commentIds) {
                                // Update specific comments
                                await loadComments();
                        }
                        toast.success(`${response.data.detectedSpam} نظر اسپم شناسایی شد`);
                        return response.data;
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || 'خطا در شناسایی اسپم';
                        toast.error(errorMessage);
                        throw err;
                }
        }, [loadComments]);

        // Auto-moderation
        const toggleAutoModeration = useCallback(async (enabled: boolean) => {
                try {
                        await adminAPI.comments.toggleAutoModeration(enabled);
                        toast.success(`نظارت خودکار ${enabled ? 'فعال' : 'غیرفعال'} شد`);
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || 'خطا در تغییر وضعیت نظارت خودکار';
                        toast.error(errorMessage);
                        throw err;
                }
        }, []);

        // Filter management
        const changeFilters = useCallback((newFilters: Partial<CommentFilters>) => {
                setCommentFilters(newFilters);
        }, [setCommentFilters]);

        const resetFilters = useCallback(() => {
                setCommentFilters({
                        status: 'all',
                        search: '',
                        sortBy: 'createdAt',
                        sortOrder: 'desc',
                        page: 1,
                        limit: 20,
                });
        }, [setCommentFilters]);

        // Refresh data
        const refreshData = useCallback(() => {
                loadComments();
        }, [loadComments]);

        // Load data on mount
        useEffect(() => {
                loadComments();
        }, [loadComments]);

        // Computed values
        const comments = useMemo(() => data?.comments || [], [data?.comments]);
        const analytics = useMemo(() => data?.analytics || null, [data?.analytics]);
        const moderationSettings = useMemo(() => data?.moderationSettings || null, [data?.moderationSettings]);

        const hasComments = useMemo(() => comments.length > 0, [comments]);
        const isEmpty = useMemo(() => !loading && comments.length === 0, [loading, comments]);
        const isInitialLoad = useMemo(() => loading && !data, [loading, data]);

        // Filter comments based on current filters
        const filteredComments = useMemo(() => {
                let filtered = [...comments];

                // Status filter
                if (filters.status !== 'all') {
                        filtered = filtered.filter(comment => comment.status === filters.status);
                }

                // Search filter
                if (filters.search) {
                        const searchTerm = filters.search.toLowerCase();
                        filtered = filtered.filter(comment =>
                                comment.content.toLowerCase().includes(searchTerm) ||
                                comment.author.firstName.toLowerCase().includes(searchTerm) ||
                                comment.author.lastName.toLowerCase().includes(searchTerm) ||
                                comment.author.email.toLowerCase().includes(searchTerm) ||
                                (comment.product?.name.toLowerCase().includes(searchTerm))
                        );
                }

                // Sort
                filtered.sort((a, b) => {
                        const aValue = a[filters.sortBy as keyof Comment];
                        const bValue = b[filters.sortBy as keyof Comment];

                        if (typeof aValue === 'string' && typeof bValue === 'string') {
                                const comparison = aValue.localeCompare(bValue);
                                return filters.sortOrder === 'asc' ? comparison : -comparison;
                        }

                        if (typeof aValue === 'number' && typeof bValue === 'number') {
                                return filters.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
                        }

                        return 0;
                });

                return filtered;
        }, [comments, filters]);

        // Pagination
        const paginatedComments = useMemo(() => {
                const startIndex = (filters.page - 1) * filters.limit;
                const endIndex = startIndex + filters.limit;
                return filteredComments.slice(startIndex, endIndex);
        }, [filteredComments, filters.page, filters.limit]);

        const totalPages = useMemo(() =>
                Math.ceil(filteredComments.length / filters.limit),
                [filteredComments.length, filters.limit]
        );

        // Statistics
        const stats = useMemo(() => {
                const total = comments.length;
                const pending = comments.filter(c => c.status === 'pending').length;
                const approved = comments.filter(c => c.status === 'approved').length;
                const rejected = comments.filter(c => c.status === 'rejected').length;
                const spam = comments.filter(c => c.status === 'spam').length;

                return {
                        total,
                        pending,
                        approved,
                        rejected,
                        spam,
                        pendingPercentage: total > 0 ? ((pending / total) * 100).toFixed(1) : '0',
                        approvedPercentage: total > 0 ? ((approved / total) * 100).toFixed(1) : '0',
                };
        }, [comments]);

        return {
                // Data
                data,
                comments: paginatedComments,
                allComments: comments,
                filteredComments,
                analytics,
                moderationSettings,
                loading,
                error,
                filters,
                stats,

                // Computed
                hasComments,
                isEmpty,
                isInitialLoad,
                totalPages,

                // General Actions
                loadComments,
                refreshData,
                resetState: resetCommentsState,

                // CRUD Operations
                getCommentById,
                createComment,
                updateComment: updateCommentData,
                deleteComment: deleteCommentData,

                // Moderation Actions
                approveComment,
                rejectComment,
                markAsSpam,
                performBulkOperation,

                // Analytics & Reports
                getCommentsAnalytics,
                analyzeCommentSentiment,
                exportComments,
                getUserCommentHistory,

                // Moderation Settings
                getModerationSettings,
                updateModerationSettings,

                // Spam Detection
                runSpamDetection,
                toggleAutoModeration,

                // Filter Actions
                changeFilters,
                resetFilters,
        };
}; 