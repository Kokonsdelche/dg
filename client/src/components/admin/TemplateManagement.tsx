import React, { useState, useMemo } from 'react';
import { useAdminNotifications } from '../../hooks/useAdminNotifications';
import TemplateCard from './TemplateCard';
import TemplateEditor from './TemplateEditor';
import LoadingSpinner from '../common/LoadingSpinner';
import { NotificationTemplate } from '../../types';

const TemplateManagement: React.FC = () => {
        const {
                templates,
                loading,
                error,
                templateStats,
                refreshTemplates,
                createTemplate,
                updateTemplate,
                deleteTemplate,
                duplicateTemplate,
                previewTemplate,
                testTemplate,
        } = useAdminNotifications();

        const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
        const [showEditor, setShowEditor] = useState(false);
        const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
        const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create');
        const [showFilters, setShowFilters] = useState(false);
        const [filters, setFilters] = useState({
                search: '',
                type: 'all',
                category: 'all',
                status: 'all'
        });

        // Filter templates
        const filteredTemplates = useMemo(() => {
                return templates.filter(template => {
                        const matchesSearch = !filters.search ||
                                template.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                                template.description?.toLowerCase().includes(filters.search.toLowerCase());

                        const matchesType = filters.type === 'all' || template.type === filters.type;
                        const matchesCategory = filters.category === 'all' || template.category === filters.category;
                        const matchesStatus = filters.status === 'all' ||
                                (filters.status === 'active' && template.isActive) ||
                                (filters.status === 'inactive' && !template.isActive);

                        return matchesSearch && matchesType && matchesCategory && matchesStatus;
                });
        }, [templates, filters]);

        // Handle template selection
        const handleSelectAll = (checked: boolean) => {
                if (checked) {
                        setSelectedTemplates(filteredTemplates.map(t => t._id));
                } else {
                        setSelectedTemplates([]);
                }
        };

        const handleSelectTemplate = (templateId: string, selected: boolean) => {
                if (selected) {
                        setSelectedTemplates(prev => [...prev, templateId]);
                } else {
                        setSelectedTemplates(prev => prev.filter(id => id !== templateId));
                }
        };

        // Handle bulk operations
        const handleBulkDelete = async () => {
                if (selectedTemplates.length === 0) return;

                if (confirm(`آیا از حذف ${selectedTemplates.length} قالب اطمینان دارید؟`)) {
                        try {
                                await Promise.all(selectedTemplates.map(id => deleteTemplate(id)));
                                setSelectedTemplates([]);
                        } catch (error) {
                                console.error('خطا در حذف دسته‌ای:', error);
                        }
                }
        };

        const handleBulkToggleStatus = async (status: boolean) => {
                if (selectedTemplates.length === 0) return;

                try {
                        await Promise.all(
                                selectedTemplates.map(id => {
                                        const template = templates.find(t => t._id === id);
                                        if (template) {
                                                return updateTemplate(id, { ...template, isActive: status });
                                        }
                                        return Promise.resolve();
                                })
                        );
                        setSelectedTemplates([]);
                } catch (error) {
                        console.error('خطا در تغییر وضعیت دسته‌ای:', error);
                }
        };

        // Handle template actions
        const handleCreateTemplate = () => {
                setEditingTemplate(null);
                setEditorMode('create');
                setShowEditor(true);
        };

        const handleEditTemplate = (template: NotificationTemplate) => {
                setEditingTemplate(template);
                setEditorMode('edit');
                setShowEditor(true);
        };

        const handleSaveTemplate = async (templateData: Partial<NotificationTemplate>) => {
                try {
                        if (editorMode === 'create') {
                                await createTemplate(templateData as any);
                        } else if (editingTemplate) {
                                await updateTemplate(editingTemplate._id, templateData);
                        }
                        setShowEditor(false);
                        setEditingTemplate(null);
                } catch (error) {
                        console.error('خطا در ذخیره قالب:', error);
                }
        };

        const handleDeleteTemplate = async (templateId: string) => {
                if (confirm('آیا از حذف این قالب اطمینان دارید؟')) {
                        try {
                                await deleteTemplate(templateId);
                        } catch (error) {
                                console.error('خطا در حذف قالب:', error);
                        }
                }
        };

        const handleDuplicateTemplate = async (template: NotificationTemplate) => {
                try {
                        await duplicateTemplate(template._id);
                } catch (error) {
                        console.error('خطا در کپی قالب:', error);
                }
        };

        const handlePreviewTemplate = async (template: NotificationTemplate) => {
                try {
                        await previewTemplate(template._id);
                } catch (error) {
                        console.error('خطا در پیش‌نمایش قالب:', error);
                }
        };

        const handleTestTemplate = async (template: NotificationTemplate) => {
                try {
                        await testTemplate(template._id, 'admin@example.com');
                } catch (error) {
                        console.error('خطا در تست قالب:', error);
                }
        };

        // Update filter
        const updateFilter = (key: string, value: string) => {
                setFilters(prev => ({ ...prev, [key]: value }));
        };

        // Reset filters
        const resetFilters = () => {
                setFilters({
                        search: '',
                        type: 'all',
                        category: 'all',
                        status: 'all'
                });
        };

        // Get active filters count
        const activeFiltersCount = useMemo(() => {
                let count = 0;
                if (filters.search) count++;
                if (filters.type !== 'all') count++;
                if (filters.category !== 'all') count++;
                if (filters.status !== 'all') count++;
                return count;
        }, [filters]);

        if (loading && templates.length === 0) {
                return (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                                <LoadingSpinner />
                        </div>
                );
        }

        return (
                <div className="space-y-6">
                        {/* Header */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                        <div>
                                                <h1 className="text-2xl font-bold text-gray-900">مدیریت قالب‌ها</h1>
                                                <p className="text-sm text-gray-600 mt-1">
                                                        ایجاد و مدیریت قالب‌های اطلاع‌رسانی‌های سیستم
                                                </p>
                                        </div>

                                        <div className="flex items-center space-x-3 space-x-reverse">
                                                {/* Refresh Button */}
                                                <button
                                                        onClick={refreshTemplates}
                                                        disabled={loading}
                                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                                >
                                                        {loading ? (
                                                                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                                </svg>
                                                        ) : (
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                                </svg>
                                                        )}
                                                        <span className="mr-2">بروزرسانی</span>
                                                </button>

                                                {/* Create Template Button */}
                                                <button
                                                        onClick={handleCreateTemplate}
                                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                        <svg className="w-4 h-4 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                        </svg>
                                                        ایجاد قالب جدید
                                                </button>
                                        </div>
                                </div>

                                {/* Stats Cards */}
                                {templateStats && (
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                                <div className="bg-blue-50 rounded-lg p-4">
                                                        <div className="text-2xl font-bold text-blue-600">{templateStats.total}</div>
                                                        <div className="text-sm text-blue-800">کل قالب‌ها</div>
                                                </div>
                                                <div className="bg-green-50 rounded-lg p-4">
                                                        <div className="text-2xl font-bold text-green-600">{templateStats.active}</div>
                                                        <div className="text-sm text-green-800">فعال</div>
                                                </div>
                                                <div className="bg-yellow-50 rounded-lg p-4">
                                                        <div className="text-2xl font-bold text-yellow-600">{templateStats.mostUsed}</div>
                                                        <div className="text-sm text-yellow-800">پرکاربرد</div>
                                                </div>
                                                <div className="bg-purple-50 rounded-lg p-4">
                                                        <div className="text-2xl font-bold text-purple-600">{templateStats.categories}</div>
                                                        <div className="text-sm text-purple-800">دسته‌بندی</div>
                                                </div>
                                        </div>
                                )}
                        </div>

                        {/* Filters and Search */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-4 space-x-reverse">
                                                <h2 className="text-lg font-semibold text-gray-900">فیلترها و جستجو</h2>
                                                {activeFiltersCount > 0 && (
                                                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                                {activeFiltersCount} فیلتر فعال
                                                        </span>
                                                )}
                                        </div>

                                        <div className="flex items-center space-x-2 space-x-reverse">
                                                <button
                                                        onClick={() => setShowFilters(!showFilters)}
                                                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                                >
                                                        {showFilters ? 'مخفی کردن فیلترها' : 'نمایش فیلترها'}
                                                </button>

                                                {activeFiltersCount > 0 && (
                                                        <button
                                                                onClick={resetFilters}
                                                                className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100"
                                                        >
                                                                پاک کردن فیلترها
                                                        </button>
                                                )}
                                        </div>
                                </div>

                                {/* Search Bar */}
                                <div className="mb-4">
                                        <div className="relative">
                                                <input
                                                        type="text"
                                                        placeholder="جستجو در نام، توضیحات یا محتوای قالب‌ها..."
                                                        value={filters.search}
                                                        onChange={(e) => updateFilter('search', e.target.value)}
                                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                        </svg>
                                                </div>
                                        </div>
                                </div>

                                {/* Advanced Filters */}
                                {showFilters && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {/* Type Filter */}
                                                <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">نوع</label>
                                                        <select
                                                                value={filters.type}
                                                                onChange={(e) => updateFilter('type', e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        >
                                                                <option value="all">همه</option>
                                                                <option value="email">ایمیل</option>
                                                                <option value="sms">پیامک</option>
                                                                <option value="push">اعلان فوری</option>
                                                                <option value="inApp">اپلیکیشن</option>
                                                        </select>
                                                </div>

                                                {/* Category Filter */}
                                                <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">دسته‌بندی</label>
                                                        <select
                                                                value={filters.category}
                                                                onChange={(e) => updateFilter('category', e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        >
                                                                <option value="all">همه</option>
                                                                <option value="order">سفارشات</option>
                                                                <option value="user">کاربران</option>
                                                                <option value="product">محصولات</option>
                                                                <option value="system">سیستم</option>
                                                                <option value="marketing">بازاریابی</option>
                                                                <option value="security">امنیت</option>
                                                        </select>
                                                </div>

                                                {/* Status Filter */}
                                                <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">وضعیت</label>
                                                        <select
                                                                value={filters.status}
                                                                onChange={(e) => updateFilter('status', e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        >
                                                                <option value="all">همه</option>
                                                                <option value="active">فعال</option>
                                                                <option value="inactive">غیرفعال</option>
                                                        </select>
                                                </div>
                                        </div>
                                )}
                        </div>

                        {/* Bulk Actions */}
                        {selectedTemplates.length > 0 && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3 space-x-reverse">
                                                        <span className="text-sm font-medium text-blue-900">
                                                                {selectedTemplates.length} قالب انتخاب شده
                                                        </span>
                                                </div>

                                                <div className="flex items-center space-x-2 space-x-reverse">
                                                        <button
                                                                onClick={() => handleBulkToggleStatus(true)}
                                                                className="px-3 py-1 text-sm font-medium text-green-700 bg-white border border-green-300 rounded hover:bg-green-50"
                                                        >
                                                                فعال کردن
                                                        </button>
                                                        <button
                                                                onClick={() => handleBulkToggleStatus(false)}
                                                                className="px-3 py-1 text-sm font-medium text-yellow-700 bg-white border border-yellow-300 rounded hover:bg-yellow-50"
                                                        >
                                                                غیرفعال کردن
                                                        </button>
                                                        <button
                                                                onClick={handleBulkDelete}
                                                                className="px-3 py-1 text-sm font-medium text-red-700 bg-white border border-red-300 rounded hover:bg-red-50"
                                                        >
                                                                حذف
                                                        </button>
                                                        <button
                                                                onClick={() => setSelectedTemplates([])}
                                                                className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
                                                        >
                                                                لغو انتخاب
                                                        </button>
                                                </div>
                                        </div>
                                </div>
                        )}

                        {/* Templates List */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                {/* List Header */}
                                <div className="px-6 py-4 border-b border-gray-200">
                                        <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3 space-x-reverse">
                                                        <input
                                                                type="checkbox"
                                                                checked={selectedTemplates.length === filteredTemplates.length && filteredTemplates.length > 0}
                                                                onChange={(e) => handleSelectAll(e.target.checked)}
                                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                                        />
                                                        <span className="text-sm font-medium text-gray-900">
                                                                انتخاب همه ({filteredTemplates.length})
                                                        </span>
                                                </div>

                                                <div className="text-sm text-gray-500">
                                                        {filteredTemplates.length} قالب
                                                </div>
                                        </div>
                                </div>

                                {/* Templates */}
                                <div className="divide-y divide-gray-200">
                                        {filteredTemplates.length > 0 ? (
                                                filteredTemplates.map((template) => (
                                                        <div key={template._id} className="p-6">
                                                                <TemplateCard
                                                                        template={template}
                                                                        selected={selectedTemplates.includes(template._id)}
                                                                        onSelect={(selected) => handleSelectTemplate(template._id, selected)}
                                                                        onEdit={() => handleEditTemplate(template)}
                                                                        onDelete={() => handleDeleteTemplate(template._id)}
                                                                        onDuplicate={() => handleDuplicateTemplate(template)}
                                                                        onPreview={() => handlePreviewTemplate(template)}
                                                                        onTest={() => handleTestTemplate(template)}
                                                                        showBulkSelect={true}
                                                                        showActions={true}
                                                                />
                                                        </div>
                                                ))
                                        ) : (
                                                <div className="p-12 text-center">
                                                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <h3 className="text-lg font-medium text-gray-900 mb-2">قالبی یافت نشد</h3>
                                                        <p className="text-gray-500 mb-4">
                                                                {activeFiltersCount > 0
                                                                        ? 'با فیلترهای اعمال شده قالبی یافت نشد. لطفاً فیلترها را تغییر دهید.'
                                                                        : 'هنوز قالبی در سیستم ثبت نشده است.'
                                                                }
                                                        </p>
                                                        {activeFiltersCount > 0 ? (
                                                                <button
                                                                        onClick={resetFilters}
                                                                        className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                                                                >
                                                                        پاک کردن فیلترها
                                                                </button>
                                                        ) : (
                                                                <button
                                                                        onClick={handleCreateTemplate}
                                                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                                                >
                                                                        ایجاد اولین قالب
                                                                </button>
                                                        )}
                                                </div>
                                        )}
                                </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <div className="flex items-center">
                                                <svg className="w-5 h-5 text-red-400 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                </svg>
                                                <p className="text-sm text-red-800">{error}</p>
                                        </div>
                                </div>
                        )}

                        {/* Template Editor Modal */}
                        <TemplateEditor
                                template={editingTemplate}
                                isOpen={showEditor}
                                onClose={() => {
                                        setShowEditor(false);
                                        setEditingTemplate(null);
                                }}
                                onSave={handleSaveTemplate}
                                loading={loading}
                                mode={editorMode}
                        />
                </div>
        );
};

export default TemplateManagement; 