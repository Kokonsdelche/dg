import React, { useState, useEffect } from 'react';
import { NotificationTemplate } from '../../types';
import Modal from './Modal';

interface TemplateEditorProps {
        template?: NotificationTemplate | null;
        isOpen: boolean;
        onClose: () => void;
        onSave: (templateData: Partial<NotificationTemplate>) => Promise<void>;
        loading?: boolean;
        mode: 'create' | 'edit';
}

interface FormData {
        name: string;
        description?: string;
        category: NotificationTemplate['category'];
        type: NotificationTemplate['type'];
        isActive: boolean;
        subject?: string;
        content: string;
        variables?: string[];
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({
        template,
        isOpen,
        onClose,
        onSave,
        loading = false,
        mode = 'create'
}) => {
        const [formData, setFormData] = useState<FormData>({
                name: '',
                description: '',
                category: 'order' as const,
                type: 'email' as const,
                isActive: true,
                subject: '',
                content: '',
                variables: []
        });

        // Initialize form data when template prop changes
        useEffect(() => {
                if (template && mode === 'edit') {
                        setFormData({
                                name: template.name || '',
                                description: template.description || '',
                                category: template.category || 'order',
                                type: template.type || 'email',
                                isActive: template.isActive ?? true,
                                subject: template.subject || '',
                                content: template.content || '',
                                variables: template.variables || []
                        });
                } else if (mode === 'create') {
                        // Reset form for create mode
                        setFormData({
                                name: '',
                                description: '',
                                category: 'order',
                                type: 'email',
                                isActive: true,
                                subject: '',
                                content: '',
                                variables: []
                        });
                }
        }, [template, mode]);

        const handleSubmit = async () => {
                try {
                        await onSave(formData);
                } catch (error) {
                        console.error('خطا در ذخیره قالب:', error);
                }
        };

        const isFormValid = () => {
                return formData.name.trim() && formData.content.trim();
        };

        if (!isOpen) return null;

        return (
                <Modal
                        isOpen={isOpen}
                        onClose={onClose}
                        title={mode === 'create' ? 'ایجاد قالب جدید' : 'ویرایش قالب'}
                        size="large"
                >
                        <div className="space-y-6">
                                {/* Basic Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        نام قالب *
                                                </label>
                                                <input
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="نام قالب را وارد کنید"
                                                />
                                        </div>

                                        <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        نوع قالب
                                                </label>
                                                <select
                                                        value={formData.type}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                        <option value="email">ایمیل</option>
                                                        <option value="sms">پیامک</option>
                                                        <option value="push">اعلان فوری</option>
                                                        <option value="inApp">درون اپلیکیشن</option>
                                                </select>
                                        </div>
                                </div>

                                {/* Description */}
                                <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                توضیحات
                                        </label>
                                        <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="توضیحات قالب را وارد کنید"
                                        />
                                </div>

                                {/* Subject for Email */}
                                {formData.type === 'email' && (
                                        <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        موضوع
                                                </label>
                                                <input
                                                        type="text"
                                                        value={formData.subject}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="موضوع ایمیل را وارد کنید"
                                                />
                                        </div>
                                )}

                                {/* Content */}
                                <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                محتوای قالب *
                                        </label>
                                        <textarea
                                                value={formData.content}
                                                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                                rows={6}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="محتوای قالب را وارد کنید"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                                می‌توانید از متغیرها مانند {"{name}"}, {"{orderNumber}"}, {"{code}"} استفاده کنید.
                                        </p>
                                </div>

                                {/* Category */}
                                <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                دسته‌بندی
                                        </label>
                                        <select
                                                value={formData.category}
                                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                                <option value="order">سفارش</option>
                                                <option value="user">کاربر</option>
                                                <option value="product">محصول</option>
                                                <option value="system">سیستم</option>
                                                <option value="marketing">بازاریابی</option>
                                                <option value="security">امنیت</option>
                                        </select>
                                </div>

                                {/* Status */}
                                <div className="flex items-center justify-between">
                                        <div>
                                                <h4 className="font-medium text-gray-900">وضعیت فعال</h4>
                                                <p className="text-sm text-gray-500">قالب در دسترس برای استفاده باشد</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                        type="checkbox"
                                                        checked={formData.isActive}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                                        className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                                        <div className="text-sm text-gray-500">
                                                * فیلدهای اجباری
                                        </div>
                                        <div className="flex items-center space-x-3 space-x-reverse">
                                                <button
                                                        onClick={onClose}
                                                        disabled={loading}
                                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                                >
                                                        لغو
                                                </button>
                                                <button
                                                        onClick={handleSubmit}
                                                        disabled={loading || !isFormValid()}
                                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                                >
                                                        {loading ? (
                                                                <svg className="w-4 h-4 animate-spin inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                                </svg>
                                                        ) : null}
                                                        {mode === 'create' ? 'ایجاد قالب' : 'ذخیره تغییرات'}
                                                </button>
                                        </div>
                                </div>
                        </div>
                </Modal>
        );
};

export default TemplateEditor; 