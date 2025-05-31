import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Comment } from '../../store/adminStore';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';

interface CommentCardProps {
        comment: Comment;
        onApprove: (commentId: string, note?: string) => void;
        onReject: (commentId: string, reason?: string) => void;
        onDelete: (commentId: string, permanent?: boolean) => void;
        onMarkSpam: (commentId: string) => void;
        onEdit: (commentId: string, content: string) => void;
        onReply: (parentId: string, content: string) => void;
        onAnalyzeSentiment: (commentId: string) => void;
        onSelect?: (commentId: string, selected: boolean) => void;
        isSelected?: boolean;
        showBulkActions?: boolean;
        isCompact?: boolean;
}

const CommentCard: React.FC<CommentCardProps> = ({
        comment,
        onApprove,
        onReject,
        onDelete,
        onMarkSpam,
        onEdit,
        onReply,
        onAnalyzeSentiment,
        onSelect,
        isSelected = false,
        showBulkActions = false,
        isCompact = false,
}) => {
        const [showActions, setShowActions] = useState(false);
        const [showReplyForm, setShowReplyForm] = useState(false);
        const [showEditForm, setShowEditForm] = useState(false);
        const [replyContent, setReplyContent] = useState('');
        const [editContent, setEditContent] = useState(comment.content);
        const [loading, setLoading] = useState(false);

        // Status colors and labels
        const statusConfig = {
                pending: {
                        color: 'yellow',
                        bgColor: 'bg-yellow-50',
                        textColor: 'text-yellow-800',
                        borderColor: 'border-yellow-200',
                        label: 'در انتظار تایید'
                },
                approved: {
                        color: 'green',
                        bgColor: 'bg-green-50',
                        textColor: 'text-green-800',
                        borderColor: 'border-green-200',
                        label: 'تایید شده'
                },
                rejected: {
                        color: 'red',
                        bgColor: 'bg-red-50',
                        textColor: 'text-red-800',
                        borderColor: 'border-red-200',
                        label: 'رد شده'
                },
                spam: {
                        color: 'orange',
                        bgColor: 'bg-orange-50',
                        textColor: 'text-orange-800',
                        borderColor: 'border-orange-200',
                        label: 'اسپم'
                }
        };

        const currentStatus = statusConfig[comment.status] || statusConfig.pending;

        // Sentiment colors and icons
        const sentimentConfig = {
                positive: {
                        color: 'text-green-600',
                        bgColor: 'bg-green-100',
                        icon: '😊',
                        label: 'مثبت'
                },
                negative: {
                        color: 'text-red-600',
                        bgColor: 'bg-red-100',
                        icon: '😞',
                        label: 'منفی'
                },
                neutral: {
                        color: 'text-gray-600',
                        bgColor: 'bg-gray-100',
                        icon: '😐',
                        label: 'خنثی'
                }
        };

        const currentSentiment = sentimentConfig[comment.sentiment?.label] || sentimentConfig.neutral;

        // Handle moderation actions
        const handleApprove = async () => {
                setLoading(true);
                try {
                        await onApprove(comment._id);
                } finally {
                        setLoading(false);
                }
        };

        const handleReject = async () => {
                const reason = prompt('دلیل رد نظر را وارد کنید:');
                if (reason !== null) {
                        setLoading(true);
                        try {
                                await onReject(comment._id, reason);
                        } finally {
                                setLoading(false);
                        }
                }
        };

        const handleDelete = async (permanent: boolean = false) => {
                const confirmMessage = permanent
                        ? 'آیا مطمئن هستید که می‌خواهید این نظر را برای همیشه حذف کنید؟'
                        : 'آیا مطمئن هستید که می‌خواهید این نظر را حذف کنید؟';

                if (window.confirm(confirmMessage)) {
                        setLoading(true);
                        try {
                                await onDelete(comment._id, permanent);
                        } finally {
                                setLoading(false);
                        }
                }
        };

        const handleMarkSpam = async () => {
                if (window.confirm('آیا مطمئن هستید که می‌خواهید این نظر را به عنوان اسپم علامت‌گذاری کنید؟')) {
                        setLoading(true);
                        try {
                                await onMarkSpam(comment._id);
                        } finally {
                                setLoading(false);
                        }
                }
        };

        const handleEdit = async () => {
                if (editContent.trim() && editContent !== comment.content) {
                        setLoading(true);
                        try {
                                await onEdit(comment._id, editContent);
                                setShowEditForm(false);
                        } finally {
                                setLoading(false);
                        }
                }
        };

        const handleReply = async () => {
                if (replyContent.trim()) {
                        setLoading(true);
                        try {
                                await onReply(comment._id, replyContent);
                                setReplyContent('');
                                setShowReplyForm(false);
                        } finally {
                                setLoading(false);
                        }
                }
        };

        const handleAnalyzeSentiment = async () => {
                setLoading(true);
                try {
                        await onAnalyzeSentiment(comment._id);
                } finally {
                        setLoading(false);
                }
        };

        return (
                <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`bg-white rounded-lg border-2 ${currentStatus.borderColor} shadow-sm hover:shadow-md transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500' : ''} ${isCompact ? 'p-4' : 'p-6'}`}
                >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-3">
                                        {/* Bulk Selection Checkbox */}
                                        {showBulkActions && onSelect && (
                                                <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={(e) => onSelect(comment._id, e.target.checked)}
                                                        className="mt-1"
                                                />
                                        )}

                                        {/* Author Avatar */}
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                                                {comment.author.firstName.charAt(0)}{comment.author.lastName.charAt(0)}
                                        </div>

                                        {/* Author Info */}
                                        <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                        <h4 className="font-medium text-gray-900">
                                                                {comment.author.firstName} {comment.author.lastName}
                                                        </h4>
                                                        {comment.author.isVerified && (
                                                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                                        <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                        </svg>
                                                                        تایید شده
                                                                </span>
                                                        )}
                                                </div>
                                                <p className="text-sm text-gray-500">{comment.author.email}</p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                        {format(new Date(comment.createdAt), 'dd MMMM yyyy - HH:mm', { locale: faIR })}
                                                </p>
                                        </div>
                                </div>

                                {/* Status & Actions */}
                                <div className="flex items-center gap-2">
                                        {/* Status Badge */}
                                        <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${currentStatus.bgColor} ${currentStatus.textColor}`}>
                                                {currentStatus.label}
                                        </span>

                                        {/* Actions Menu */}
                                        <div className="relative">
                                                <button
                                                        onClick={() => setShowActions(!showActions)}
                                                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                        disabled={loading}
                                                >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                        </svg>
                                                </button>

                                                {/* Actions Dropdown */}
                                                {showActions && (
                                                        <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                                                <div className="py-1">
                                                                        {comment.status === 'pending' && (
                                                                                <button
                                                                                        onClick={handleApprove}
                                                                                        className="w-full text-right px-4 py-2 text-sm text-green-700 hover:bg-green-50 transition-colors"
                                                                                >
                                                                                        تایید نظر
                                                                                </button>
                                                                        )}
                                                                        {comment.status !== 'rejected' && (
                                                                                <button
                                                                                        onClick={handleReject}
                                                                                        className="w-full text-right px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                                                                                >
                                                                                        رد نظر
                                                                                </button>
                                                                        )}
                                                                        {comment.status !== 'spam' && (
                                                                                <button
                                                                                        onClick={handleMarkSpam}
                                                                                        className="w-full text-right px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 transition-colors"
                                                                                >
                                                                                        علامت‌گذاری به عنوان اسپم
                                                                                </button>
                                                                        )}
                                                                        <button
                                                                                onClick={() => setShowEditForm(true)}
                                                                                className="w-full text-right px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 transition-colors"
                                                                        >
                                                                                ویرایش نظر
                                                                        </button>
                                                                        <button
                                                                                onClick={() => setShowReplyForm(true)}
                                                                                className="w-full text-right px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 transition-colors"
                                                                        >
                                                                                پاسخ به نظر
                                                                        </button>
                                                                        <button
                                                                                onClick={handleAnalyzeSentiment}
                                                                                className="w-full text-right px-4 py-2 text-sm text-indigo-700 hover:bg-indigo-50 transition-colors"
                                                                        >
                                                                                تحلیل احساسات
                                                                        </button>
                                                                        <div className="border-t border-gray-100 my-1"></div>
                                                                        <button
                                                                                onClick={() => handleDelete(false)}
                                                                                className="w-full text-right px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                                                                        >
                                                                                حذف (قابل بازیابی)
                                                                        </button>
                                                                        <button
                                                                                onClick={() => handleDelete(true)}
                                                                                className="w-full text-right px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                                                                        >
                                                                                حذف دائم
                                                                        </button>
                                                                </div>
                                                        </div>
                                                )}
                                        </div>
                                </div>
                        </div>

                        {/* Product Info (if exists) */}
                        {comment.product && (
                                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                                {comment.product.images.length > 0 && (
                                                        <img
                                                                src={comment.product.images[0].url}
                                                                alt={comment.product.images[0].alt}
                                                                className="w-10 h-10 rounded object-cover"
                                                        />
                                                )}
                                                <div>
                                                        <p className="text-sm font-medium text-gray-900">{comment.product.name}</p>
                                                        {comment.rating && (
                                                                <div className="flex items-center gap-1 mt-1">
                                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                                                <svg
                                                                                        key={star}
                                                                                        className={`w-4 h-4 ${star <= comment.rating! ? 'text-yellow-400' : 'text-gray-300'}`}
                                                                                        fill="currentColor"
                                                                                        viewBox="0 0 20 20"
                                                                                >
                                                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                                </svg>
                                                                        ))}
                                                                        <span className="text-xs text-gray-500 mr-1">({comment.rating}/5)</span>
                                                                </div>
                                                        )}
                                                </div>
                                        </div>
                                </div>
                        )}

                        {/* Comment Content */}
                        {showEditForm ? (
                                <div className="mb-4">
                                        <textarea
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                rows={3}
                                                placeholder="نظر خود را ویرایش کنید..."
                                        />
                                        <div className="flex gap-2 mt-2">
                                                <button
                                                        onClick={handleEdit}
                                                        disabled={loading || !editContent.trim()}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                        ذخیره
                                                </button>
                                                <button
                                                        onClick={() => {
                                                                setShowEditForm(false);
                                                                setEditContent(comment.content);
                                                        }}
                                                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                        لغو
                                                </button>
                                        </div>
                                </div>
                        ) : (
                                <div className="mb-4">
                                        <p className="text-gray-800 leading-relaxed">{comment.content}</p>
                                </div>
                        )}

                        {/* Metadata */}
                        <div className="flex flex-wrap items-center gap-4 mb-4 text-xs text-gray-500">
                                {/* Sentiment */}
                                {comment.sentiment && (
                                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${currentSentiment.bgColor}`}>
                                                <span>{currentSentiment.icon}</span>
                                                <span className={`font-medium ${currentSentiment.color}`}>
                                                        {currentSentiment.label}
                                                </span>
                                                <span className="text-gray-500">
                                                        ({(comment.sentiment.confidence * 100).toFixed(0)}%)
                                                </span>
                                        </div>
                                )}

                                {/* Engagement */}
                                <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1">
                                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V9a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                                </svg>
                                                {comment.engagement.likes}
                                        </span>
                                        <span className="flex items-center gap-1">
                                                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                                                </svg>
                                                {comment.engagement.dislikes}
                                        </span>
                                        {comment.engagement.reports > 0 && (
                                                <span className="flex items-center gap-1 text-orange-600">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                        </svg>
                                                        {comment.engagement.reports} گزارش
                                                </span>
                                        )}
                                        {comment.replies.length > 0 && (
                                                <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                        </svg>
                                                        {comment.replies.length} پاسخ
                                                </span>
                                        )}
                                </div>

                                {/* IP Address for admins */}
                                <span>IP: {comment.metadata.ipAddress}</span>
                        </div>

                        {/* Reply Form */}
                        {showReplyForm && (
                                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <textarea
                                                value={replyContent}
                                                onChange={(e) => setReplyContent(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                rows={3}
                                                placeholder="پاسخ شما به این نظر..."
                                        />
                                        <div className="flex gap-2 mt-2">
                                                <button
                                                        onClick={handleReply}
                                                        disabled={loading || !replyContent.trim()}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                        ارسال پاسخ
                                                </button>
                                                <button
                                                        onClick={() => {
                                                                setShowReplyForm(false);
                                                                setReplyContent('');
                                                        }}
                                                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                        لغو
                                                </button>
                                        </div>
                                </div>
                        )}

                        {/* Tags */}
                        {comment.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                        {comment.tags.map((tag, index) => (
                                                <span
                                                        key={index}
                                                        className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                                                >
                                                        #{tag}
                                                </span>
                                        ))}
                                </div>
                        )}

                        {/* Loading Overlay */}
                        {loading && (
                                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                                        <div className="flex items-center gap-2 text-blue-600">
                                                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                در حال پردازش...
                                        </div>
                                </div>
                        )}
                </motion.div>
        );
};

export default CommentCard; 