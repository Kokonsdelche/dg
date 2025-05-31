import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import RichTextEditor from '../../components/admin/RichTextEditor';
import FileUpload from '../../components/admin/FileUpload';
import Modal from '../../components/admin/Modal';
import { useAdminContent } from '../../hooks/useAdminContent';
import { Banner, MediaFile, PageContent } from '../../store/adminStore';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';
import toast from 'react-hot-toast';

const ContentManagement: React.FC = () => {
        const {
                data,
                activeData,
                loading,
                error,
                filters,
                statistics,
                hasData,
                isEmpty,
                isInitialLoad,
                changeContentType,
                changeSearch,
                changePage,
                refreshData,
                createBanner,
                updateBannerById,
                deleteBanner,
                toggleBannerStatusById,
                uploadMedia,
                deleteMedia,
                updateMediaById,
                createPageContent,
                updatePageContentById,
                deletePageContent,
        } = useAdminContent();

        // Modal states
        const [showCreateModal, setShowCreateModal] = useState(false);
        const [showEditModal, setShowEditModal] = useState(false);
        const [selectedItem, setSelectedItem] = useState<Banner | MediaFile | PageContent | null>(null);

        // Form states
        const [formData, setFormData] = useState<any>({});
        const [uploading, setUploading] = useState(false);

        // Format file size
        const formatFileSize = (bytes: number) => {
                if (bytes === 0) return '0 بایت';
                const k = 1024;
                const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
                const i = Math.floor(Math.log(bytes) / Math.log(k));
                return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        };

        // Handle create/edit banner
        const handleBannerSubmit = async (e: React.FormEvent) => {
                e.preventDefault();
                try {
                        if (selectedItem) {
                                await updateBannerById(selectedItem._id, formData);
                        } else {
                                await createBanner({
                                        ...formData,
                                        isActive: formData.isActive || false,
                                        order: formData.order || 0,
                                });
                        }
                        setShowCreateModal(false);
                        setShowEditModal(false);
                        setSelectedItem(null);
                        setFormData({});
                } catch (err) {
                        console.error('Error saving banner:', err);
                }
        };

        // Handle file upload
        const handleFileUpload = async (files: File[]) => {
                setUploading(true);
                try {
                        for (const file of files) {
                                await uploadMedia(file, 'general');
                        }
                        toast.success('فایل‌ها با موفقیت آپلود شدند');
                } catch (err) {
                        console.error('Error uploading files:', err);
                } finally {
                        setUploading(false);
                }
        };

        // Handle page content submission
        const handlePageContentSubmit = async (e: React.FormEvent) => {
                e.preventDefault();
                try {
                        if (selectedItem) {
                                await updatePageContentById(selectedItem._id, formData);
                        } else {
                                await createPageContent({
                                        ...formData,
                                        isActive: formData.isActive || false,
                                        order: formData.order || 0,
                                        metadata: formData.metadata || {},
                                });
                        }
                        setShowCreateModal(false);
                        setShowEditModal(false);
                        setSelectedItem(null);
                        setFormData({});
                } catch (err) {
                        console.error('Error saving page content:', err);
                }
        };

        // Open edit modal
        const openEditModal = (item: Banner | MediaFile | PageContent) => {
                setSelectedItem(item);
                setFormData(item);
                setShowEditModal(true);
        };

        if (isInitialLoad) {
                return (
                        <div className="flex items-center justify-center min-h-screen">
                                <LoadingSpinner size="large" />
                        </div>
                );
        }

        if (error) {
                return (
                        <div className="p-6">
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <div className="flex items-center">
                                                <svg className="w-5 h-5 text-red-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-red-700">{error}</span>
                                        </div>
                                        <button
                                                onClick={refreshData}
                                                className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                        >
                                                تلاش مجدد
                                        </button>
                                </div>
                        </div>
                );
        }

        return (
                <ErrorBoundary>
                        <div className="p-6 space-y-6">
                                {/* Header */}
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        <div>
                                                <h1 className="text-2xl font-bold text-gray-900">🎨 مدیریت محتوا</h1>
                                                <p className="text-gray-600 mt-1">مدیریت بنرها، رسانه‌ها و محتوای صفحات</p>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3">
                                                <button
                                                        onClick={refreshData}
                                                        disabled={loading}
                                                        className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                        <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                        </svg>
                                                        بروزرسانی
                                                </button>

                                                <button
                                                        onClick={() => setShowCreateModal(true)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                                >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                        </svg>
                                                        {filters.type === 'banners' ? 'بنر جدید' :
                                                                filters.type === 'media' ? 'آپلود فایل' : 'محتوای جدید'}
                                                </button>
                                        </div>
                                </div>

                                {/* Statistics Cards */}
                                {statistics && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                                                        <div className="flex items-center justify-between">
                                                                <div>
                                                                        <h3 className="text-sm font-medium opacity-90">کل بنرها</h3>
                                                                        <p className="text-2xl font-bold mt-1">{statistics.totalBanners}</p>
                                                                        <p className="text-xs opacity-75">فعال: {statistics.activeBanners}</p>
                                                                </div>
                                                                <div className="text-4xl opacity-80">🎨</div>
                                                        </div>
                                                </div>

                                                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                                                        <div className="flex items-center justify-between">
                                                                <div>
                                                                        <h3 className="text-sm font-medium opacity-90">فایل‌های رسانه</h3>
                                                                        <p className="text-2xl font-bold mt-1">{statistics.totalMedia}</p>
                                                                        <p className="text-xs opacity-75">حجم: {formatFileSize(statistics.mediaSize)}</p>
                                                                </div>
                                                                <div className="text-4xl opacity-80">🖼️</div>
                                                        </div>
                                                </div>

                                                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                                                        <div className="flex items-center justify-between">
                                                                <div>
                                                                        <h3 className="text-sm font-medium opacity-90">محتوای صفحات</h3>
                                                                        <p className="text-2xl font-bold mt-1">{statistics.totalPages}</p>
                                                                        <p className="text-xs opacity-75">فعال: {statistics.activePages}</p>
                                                                </div>
                                                                <div className="text-4xl opacity-80">📄</div>
                                                        </div>
                                                </div>

                                                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                                                        <div className="flex items-center justify-between">
                                                                <div>
                                                                        <h3 className="text-sm font-medium opacity-90">کل محتوا</h3>
                                                                        <p className="text-2xl font-bold mt-1">
                                                                                {statistics.totalBanners + statistics.totalMedia + statistics.totalPages}
                                                                        </p>
                                                                        <p className="text-xs opacity-75">آیتم موجود</p>
                                                                </div>
                                                                <div className="text-4xl opacity-80">📊</div>
                                                        </div>
                                                </div>
                                        </div>
                                )}

                                {/* Filters */}
                                <div className="bg-white rounded-lg shadow-md p-6">
                                        <div className="flex flex-col lg:flex-row gap-4">
                                                {/* Content Type Tabs */}
                                                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                                                        {[
                                                                { id: 'banners', name: 'بنرها', icon: '🎨' },
                                                                { id: 'media', name: 'رسانه‌ها', icon: '🖼️' },
                                                                { id: 'pages', name: 'صفحات', icon: '📄' },
                                                        ].map((tab) => (
                                                                <button
                                                                        key={tab.id}
                                                                        onClick={() => changeContentType(tab.id as any)}
                                                                        className={`${filters.type === tab.id
                                                                                        ? 'bg-white text-purple-600 shadow-sm'
                                                                                        : 'text-gray-500 hover:text-gray-700'
                                                                                } px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2`}
                                                                >
                                                                        <span>{tab.icon}</span>
                                                                        {tab.name}
                                                                </button>
                                                        ))}
                                                </div>

                                                {/* Search */}
                                                <div className="flex-1 max-w-md">
                                                        <div className="relative">
                                                                <input
                                                                        type="text"
                                                                        value={filters.search}
                                                                        onChange={(e) => changeSearch(e.target.value)}
                                                                        placeholder="جستجو در محتوا..."
                                                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                                />
                                                                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                                </svg>
                                                        </div>
                                                </div>
                                        </div>
                                </div>

                                {loading && (
                                        <div className="bg-white rounded-lg shadow-md p-12">
                                                <LoadingSpinner size="large" />
                                        </div>
                                )}

                                {!loading && isEmpty && (
                                        <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                                <div className="text-6xl mb-4">
                                                        {filters.type === 'banners' ? '🎨' :
                                                                filters.type === 'media' ? '🖼️' : '📄'}
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                        {filters.type === 'banners' ? 'هیچ بنری موجود نیست' :
                                                                filters.type === 'media' ? 'هیچ فایل رسانه‌ای موجود نیست' :
                                                                        'هیچ محتوای صفحه‌ای موجود نیست'}
                                                </h3>
                                                <p className="text-gray-600 mb-4">
                                                        برای شروع، یک {filters.type === 'banners' ? 'بنر' :
                                                                filters.type === 'media' ? 'فایل' : 'محتوا'} جدید ایجاد کنید.
                                                </p>
                                                <button
                                                        onClick={() => setShowCreateModal(true)}
                                                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                                >
                                                        ایجاد {filters.type === 'banners' ? 'بنر' :
                                                                filters.type === 'media' ? 'فایل' : 'محتوای'} جدید
                                                </button>
                                        </div>
                                )}

                                {/* Content Grid */}
                                {!loading && hasData && activeData && (
                                        <div className="bg-white rounded-lg shadow-md">
                                                {/* Media Upload for Media Tab */}
                                                {filters.type === 'media' && (
                                                        <div className="p-6 border-b border-gray-200">
                                                                <h3 className="text-lg font-medium text-gray-900 mb-4">آپلود فایل جدید</h3>
                                                                <FileUpload
                                                                        onFileSelect={handleFileUpload}
                                                                        multiple={true}
                                                                        maxFiles={10}
                                                                        disabled={uploading}
                                                                        acceptedTypes={{
                                                                                'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
                                                                                'application/pdf': ['.pdf'],
                                                                                'text/*': ['.txt', '.csv'],
                                                                                'application/zip': ['.zip'],
                                                                        }}
                                                                />
                                                        </div>
                                                )}

                                                <div className="p-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                                <AnimatePresence>
                                                                        {(activeData as any[]).map((item: any, index: number) => (
                                                                                <motion.div
                                                                                        key={item._id}
                                                                                        initial={{ opacity: 0, y: 20 }}
                                                                                        animate={{ opacity: 1, y: 0 }}
                                                                                        exit={{ opacity: 0, y: -20 }}
                                                                                        transition={{ delay: index * 0.1 }}
                                                                                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                                                                                >
                                                                                        {/* Banner Card */}
                                                                                        {filters.type === 'banners' && (
                                                                                                <div className="space-y-3">
                                                                                                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                                                                                                {item.imageUrl ? (
                                                                                                                        <img
                                                                                                                                src={item.imageUrl}
                                                                                                                                alt={item.title}
                                                                                                                                className="w-full h-full object-cover"
                                                                                                                        />
                                                                                                                ) : (
                                                                                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                                                                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                                                                                </svg>
                                                                                                                        </div>
                                                                                                                )}
                                                                                                        </div>
                                                                                                        <div>
                                                                                                                <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                                                                                                                <p className="text-sm text-gray-600 mt-1">{item.position}</p>
                                                                                                                <div className="flex items-center gap-2 mt-2">
                                                                                                                        <span className={`px-2 py-1 text-xs rounded-full ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                                                                                                }`}>
                                                                                                                                {item.isActive ? 'فعال' : 'غیرفعال'}
                                                                                                                        </span>
                                                                                                                        <span className="text-xs text-gray-500">ترتیب: {item.order}</span>
                                                                                                                </div>
                                                                                                        </div>
                                                                                                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                                                                                                <button
                                                                                                                        onClick={() => openEditModal(item)}
                                                                                                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                                                                                                >
                                                                                                                        ویرایش
                                                                                                                </button>
                                                                                                                <div className="flex items-center gap-2">
                                                                                                                        <button
                                                                                                                                onClick={() => toggleBannerStatusById(item._id)}
                                                                                                                                className="text-orange-600 hover:text-orange-800 text-sm"
                                                                                                                        >
                                                                                                                                {item.isActive ? 'غیرفعال' : 'فعال'}
                                                                                                                        </button>
                                                                                                                        <button
                                                                                                                                onClick={() => deleteBanner(item._id)}
                                                                                                                                className="text-red-600 hover:text-red-800 text-sm"
                                                                                                                        >
                                                                                                                                حذف
                                                                                                                        </button>
                                                                                                                </div>
                                                                                                        </div>
                                                                                                </div>
                                                                                        )}

                                                                                        {/* Media Card */}
                                                                                        {filters.type === 'media' && (
                                                                                                <div className="space-y-3">
                                                                                                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                                                                                                {item.mimeType?.startsWith('image/') ? (
                                                                                                                        <img
                                                                                                                                src={item.url}
                                                                                                                                alt={item.altText || item.filename}
                                                                                                                                className="w-full h-full object-cover"
                                                                                                                        />
                                                                                                                ) : (
                                                                                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                                                                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                                                                                </svg>
                                                                                                                        </div>
                                                                                                                )}
                                                                                                        </div>
                                                                                                        <div>
                                                                                                                <h3 className="font-medium text-gray-900 truncate" title={item.originalName}>
                                                                                                                        {item.originalName}
                                                                                                                </h3>
                                                                                                                <p className="text-sm text-gray-600">{formatFileSize(item.size)}</p>
                                                                                                                <p className="text-xs text-gray-500 mt-1">{item.folder}</p>
                                                                                                        </div>
                                                                                                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                                                                                                <button
                                                                                                                        onClick={() => openEditModal(item)}
                                                                                                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                                                                                                >
                                                                                                                        ویرایش
                                                                                                                </button>
                                                                                                                <button
                                                                                                                        onClick={() => deleteMedia(item._id)}
                                                                                                                        className="text-red-600 hover:text-red-800 text-sm"
                                                                                                                >
                                                                                                                        حذف
                                                                                                                </button>
                                                                                                        </div>
                                                                                                </div>
                                                                                        )}

                                                                                        {/* Page Content Card */}
                                                                                        {filters.type === 'pages' && (
                                                                                                <div className="space-y-3">
                                                                                                        <div className="p-4 bg-gray-50 rounded-lg">
                                                                                                                <h3 className="font-medium text-gray-900">{item.title}</h3>
                                                                                                                <p className="text-sm text-gray-600 mt-1">{item.page} - {item.section}</p>
                                                                                                                <div className="mt-2 text-sm text-gray-700 line-clamp-3"
                                                                                                                        dangerouslySetInnerHTML={{ __html: item.content?.substring(0, 100) + '...' || 'بدون محتوا' }}
                                                                                                                />
                                                                                                        </div>
                                                                                                        <div className="flex items-center gap-2">
                                                                                                                <span className={`px-2 py-1 text-xs rounded-full ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                                                                                        }`}>
                                                                                                                        {item.isActive ? 'فعال' : 'غیرفعال'}
                                                                                                                </span>
                                                                                                                <span className="text-xs text-gray-500">ترتیب: {item.order}</span>
                                                                                                        </div>
                                                                                                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                                                                                                <button
                                                                                                                        onClick={() => openEditModal(item)}
                                                                                                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                                                                                                >
                                                                                                                        ویرایش
                                                                                                                </button>
                                                                                                                <button
                                                                                                                        onClick={() => deletePageContent(item._id)}
                                                                                                                        className="text-red-600 hover:text-red-800 text-sm"
                                                                                                                >
                                                                                                                        حذف
                                                                                                                </button>
                                                                                                        </div>
                                                                                                </div>
                                                                                        )}
                                                                                </motion.div>
                                                                        ))}
                                                                </AnimatePresence>
                                                        </div>
                                                </div>
                                        </div>
                                )}

                                {/* Create Modal */}
                                <Modal
                                        isOpen={showCreateModal}
                                        onClose={() => {
                                                setShowCreateModal(false);
                                                setFormData({});
                                        }}
                                        title={`ایجاد ${filters.type === 'banners' ? 'بنر' :
                                                        filters.type === 'media' ? 'فایل' : 'محتوای'
                                                } جدید`}
                                        size="large"
                                >
                                        <form onSubmit={filters.type === 'pages' ? handlePageContentSubmit : handleBannerSubmit} className="space-y-6">
                                                {filters.type === 'banners' && (
                                                        <>
                                                                <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">عنوان بنر</label>
                                                                        <input
                                                                                type="text"
                                                                                value={formData.title || ''}
                                                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                                                required
                                                                        />
                                                                </div>
                                                                <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">URL تصویر</label>
                                                                        <input
                                                                                type="url"
                                                                                value={formData.imageUrl || ''}
                                                                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                                                required
                                                                        />
                                                                </div>
                                                                <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">موقعیت</label>
                                                                        <select
                                                                                value={formData.position || 'hero'}
                                                                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                                        >
                                                                                <option value="hero">اصلی</option>
                                                                                <option value="middle">میانه</option>
                                                                                <option value="footer">پایین</option>
                                                                        </select>
                                                                </div>
                                                                <div className="flex items-center">
                                                                        <input
                                                                                type="checkbox"
                                                                                checked={formData.isActive || false}
                                                                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                                                className="ml-2"
                                                                        />
                                                                        <label className="text-sm text-gray-700">فعال</label>
                                                                </div>
                                                        </>
                                                )}

                                                {filters.type === 'pages' && (
                                                        <>
                                                                <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">عنوان</label>
                                                                        <input
                                                                                type="text"
                                                                                value={formData.title || ''}
                                                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                                                required
                                                                        />
                                                                </div>
                                                                <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">صفحه</label>
                                                                        <select
                                                                                value={formData.page || 'home'}
                                                                                onChange={(e) => setFormData({ ...formData, page: e.target.value })}
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                                        >
                                                                                <option value="home">خانه</option>
                                                                                <option value="about">درباره ما</option>
                                                                                <option value="contact">تماس با ما</option>
                                                                                <option value="privacy">حریم خصوصی</option>
                                                                                <option value="terms">شرایط استفاده</option>
                                                                        </select>
                                                                </div>
                                                                <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">بخش</label>
                                                                        <input
                                                                                type="text"
                                                                                value={formData.section || ''}
                                                                                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                                                required
                                                                        />
                                                                </div>
                                                                <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">محتوا</label>
                                                                        <RichTextEditor
                                                                                value={formData.content || ''}
                                                                                onChange={(content) => setFormData({ ...formData, content })}
                                                                                height={300}
                                                                        />
                                                                </div>
                                                                <div className="flex items-center">
                                                                        <input
                                                                                type="checkbox"
                                                                                checked={formData.isActive || false}
                                                                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                                                className="ml-2"
                                                                        />
                                                                        <label className="text-sm text-gray-700">فعال</label>
                                                                </div>
                                                        </>
                                                )}

                                                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                                                        <button
                                                                type="button"
                                                                onClick={() => setShowCreateModal(false)}
                                                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                                        >
                                                                لغو
                                                        </button>
                                                        <button
                                                                type="submit"
                                                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                                        >
                                                                ایجاد
                                                        </button>
                                                </div>
                                        </form>
                                </Modal>

                                {/* Edit Modal */}
                                <Modal
                                        isOpen={showEditModal}
                                        onClose={() => {
                                                setShowEditModal(false);
                                                setSelectedItem(null);
                                                setFormData({});
                                        }}
                                        title={`ویرایش ${filters.type === 'banners' ? 'بنر' :
                                                        filters.type === 'media' ? 'فایل' : 'محتوای'
                                                }`}
                                        size="large"
                                >
                                        {/* Similar form structure as create modal but with pre-filled data */}
                                        <form onSubmit={filters.type === 'pages' ? handlePageContentSubmit : handleBannerSubmit} className="space-y-6">
                                                {/* Form fields similar to create modal */}
                                                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                                                        <button
                                                                type="button"
                                                                onClick={() => setShowEditModal(false)}
                                                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                                        >
                                                                لغو
                                                        </button>
                                                        <button
                                                                type="submit"
                                                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                                        >
                                                                ذخیره
                                                        </button>
                                                </div>
                                        </form>
                                </Modal>
                        </div>
                </ErrorBoundary>
        );
};

export default ContentManagement; 