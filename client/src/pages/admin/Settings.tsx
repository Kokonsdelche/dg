import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import Modal from '../../components/admin/Modal';
import JSONEditor from '../../components/admin/JSONEditor';
import FileUpload from '../../components/admin/FileUpload';
import { useAdminSettings } from '../../hooks/useAdminSettings';
import {
        EmailSettings,
        SMSSettings,
} from '../../types';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';
import toast from 'react-hot-toast';
import CryptoJS from 'crypto-js';

// Mock types for compatibility
interface GeneralSettings {
        siteName?: string;
        siteDescription?: string;
        maintenanceMode?: boolean;
}

interface PaymentSettings {
        provider?: string;
        apiKey?: string;
}

interface ShippingSettings {
        freeShippingThreshold?: number;
        shippingRate?: number;
}

interface SecuritySettings {
        twoFactorAuth?: boolean;
        passwordPolicy?: any;
}

interface BackupSettings {
        autoBackup?: boolean;
        backupInterval?: string;
}

const SystemSettings: React.FC = () => {
        const {
                currentSettings,
                loading,
                error,
                filters,
                hasSettings,
                isEmpty,
                isInitialLoad,
                refreshData,
                updateGeneralSettings,
                updatePaymentSettings,
                updateShippingSettings,
                updateEmailSettings,
                updateSMSSettings,
                updateSecuritySettings,
                updateBackupSettings,
                testEmailSettings,
                testSMSSettings,
                createBackup,
                getBackupHistory,
                enableMaintenanceMode,
                disableMaintenanceMode,
                getSystemStats,
                resetToDefaults,
                exportSettings,
                importSettings,
                changeCategory,
        } = useAdminSettings();

        // Modal states
        const [showTestModal, setShowTestModal] = useState(false);
        const [showBackupModal, setShowBackupModal] = useState(false);
        const [showImportModal, setShowImportModal] = useState(false);
        const [showSystemStatsModal, setShowSystemStatsModal] = useState(false);

        // Form states
        const [formData, setFormData] = useState<any>({});
        const [testData, setTestData] = useState<any>({});
        const [backupHistory, setBackupHistory] = useState<any[]>([]);
        const [systemStats, setSystemStats] = useState<any>(null);
        const [saving, setSaving] = useState(false);
        const [testing, setTesting] = useState(false);

        // Initialize form data when settings change
        useEffect(() => {
                if (currentSettings) {
                        setFormData({ ...currentSettings });
                }
        }, [currentSettings]);

        // Category configurations
        const categories = [
                { id: 'general', name: 'عمومی', icon: '⚙️', color: 'blue' },
                { id: 'payment', name: 'پرداخت', icon: '💳', color: 'green' },
                { id: 'shipping', name: 'ارسال', icon: '🚚', color: 'yellow' },
                { id: 'email', name: 'ایمیل', icon: '📧', color: 'purple' },
                { id: 'sms', name: 'پیامک', icon: '📱', color: 'indigo' },
                { id: 'security', name: 'امنیت', icon: '🔒', color: 'red' },
                { id: 'backup', name: 'پشتیبان‌گیری', icon: '💾', color: 'gray' },
        ];

        const currentCategory = categories.find(cat => cat.id === filters.category);

        // Handle form submission
        const handleSubmit = async (e: React.FormEvent) => {
                e.preventDefault();
                setSaving(true);

                try {
                        switch (filters.category) {
                                case 'general':
                                        await updateGeneralSettings(formData as Partial<GeneralSettings>);
                                        break;
                                case 'payment':
                                        await updatePaymentSettings(formData as Partial<PaymentSettings>);
                                        break;
                                case 'shipping':
                                        await updateShippingSettings(formData as Partial<ShippingSettings>);
                                        break;
                                case 'email':
                                        await updateEmailSettings(formData as Partial<EmailSettings>);
                                        break;
                                case 'sms':
                                        await updateSMSSettings(formData as Partial<SMSSettings>);
                                        break;
                                case 'security':
                                        await updateSecuritySettings(formData as Partial<SecuritySettings>);
                                        break;
                                case 'backup':
                                        await updateBackupSettings(formData as Partial<BackupSettings>);
                                        break;
                        }
                } catch (err) {
                        console.error('Error saving settings:', err);
                } finally {
                        setSaving(false);
                }
        };

        // Handle test functionality
        const handleTest = async () => {
                if (!testData.testValue) {
                        toast.error('لطفاً مقدار تست را وارد کنید');
                        return;
                }

                setTesting(true);
                try {
                        if (filters.category === 'email') {
                                await testEmailSettings(testData.testValue);
                        } else if (filters.category === 'sms') {
                                await testSMSSettings(testData.testValue);
                        }
                        setShowTestModal(false);
                        setTestData({});
                } catch (err) {
                        console.error('Test failed:', err);
                } finally {
                        setTesting(false);
                }
        };

        // Handle backup creation
        const handleCreateBackup = async (options: any) => {
                try {
                        await createBackup(options);
                        setShowBackupModal(false);
                        await loadBackupHistory();
                } catch (err) {
                        console.error('Backup creation failed:', err);
                }
        };

        // Load backup history
        const loadBackupHistory = async () => {
                try {
                        const history = await getBackupHistory();
                        setBackupHistory(history);
                } catch (err) {
                        console.error('Failed to load backup history:', err);
                }
        };

        // Load system stats
        const loadSystemStats = async () => {
                try {
                        const stats = await getSystemStats();
                        setSystemStats(stats);
                        setShowSystemStatsModal(true);
                } catch (err) {
                        console.error('Failed to load system stats:', err);
                }
        };

        // Handle maintenance mode
        const handleMaintenanceToggle = async () => {
                try {
                        if (formData.maintenanceMode) {
                                await disableMaintenanceMode();
                        } else {
                                const reason = prompt('دلیل فعال‌سازی حالت تعمیر:');
                                if (reason !== null) {
                                        await enableMaintenanceMode(reason);
                                }
                        }
                        await refreshData();
                } catch (err) {
                        console.error('Maintenance mode toggle failed:', err);
                }
        };

        // Handle reset to defaults
        const handleResetToDefaults = async () => {
                if (window.confirm(`آیا مطمئن هستید که می‌خواهید تنظیمات ${currentCategory?.name} را به حالت پیش‌فرض بازگردانید؟`)) {
                        try {
                                await resetToDefaults(filters.category);
                                await refreshData();
                        } catch (err) {
                                console.error('Reset to defaults failed:', err);
                        }
                }
        };

        // Handle settings import
        const handleImportSettings = async (files: File[]) => {
                if (files.length === 0) return;

                try {
                        await importSettings(files[0]);
                        setShowImportModal(false);
                        await refreshData();
                } catch (err) {
                        console.error('Settings import failed:', err);
                }
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
                                                <h1 className="text-2xl font-bold text-gray-900">⚙️ تنظیمات سیستم</h1>
                                                <p className="text-gray-600 mt-1">مدیریت تنظیمات کلی سیستم و پیکربندی‌ها</p>
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
                                                        onClick={loadSystemStats}
                                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                        </svg>
                                                        آمار سیستم
                                                </button>

                                                <button
                                                        onClick={exportSettings}
                                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                                >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        خروجی
                                                </button>

                                                <button
                                                        onClick={() => setShowImportModal(true)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                                >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                                        </svg>
                                                        ورودی
                                                </button>
                                        </div>
                                </div>

                                {/* Category Tabs */}
                                <div className="bg-white rounded-lg shadow-md">
                                        <div className="border-b border-gray-200">
                                                <nav className="flex space-x-8 px-6">
                                                        {categories.map((category) => (
                                                                <button
                                                                        key={category.id}
                                                                        onClick={() => changeCategory(category.id)}
                                                                        className={`${filters.category === category.id
                                                                                ? `text-${category.color}-600 border-${category.color}-500`
                                                                                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                                                                                } w-full flex items-center px-3 py-2 text-sm font-medium rounded-md border-l-2 transition-colors duration-200`}
                                                                >
                                                                        <span className="text-2xl ml-3">{category.icon}</span>
                                                                        {category.name}
                                                                </button>
                                                        ))}
                                                </nav>
                                        </div>

                                        {/* Settings Content */}
                                        <div className="p-6">
                                                {loading && (
                                                        <div className="flex justify-center py-12">
                                                                <LoadingSpinner size="large" />
                                                        </div>
                                                )}

                                                {!loading && hasSettings && currentSettings && (
                                                        <form onSubmit={handleSubmit} className="space-y-8">
                                                                {/* Category-specific Settings */}
                                                                <AnimatePresence mode="wait">
                                                                        <motion.div
                                                                                key={filters.category}
                                                                                initial={{ opacity: 0, x: 20 }}
                                                                                animate={{ opacity: 1, x: 0 }}
                                                                                exit={{ opacity: 0, x: -20 }}
                                                                                transition={{ duration: 0.2 }}
                                                                                className="space-y-6"
                                                                        >
                                                                                {/* General Settings */}
                                                                                {filters.category === 'general' && (
                                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                                                <div>
                                                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">نام سایت</label>
                                                                                                        <input
                                                                                                                type="text"
                                                                                                                value={formData.siteName || ''}
                                                                                                                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                                                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                                                                placeholder="نام فروشگاه"
                                                                                                        />
                                                                                                </div>
                                                                                                <div>
                                                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">ایمیل مدیر</label>
                                                                                                        <input
                                                                                                                type="email"
                                                                                                                value={formData.adminEmail || ''}
                                                                                                                onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                                                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                                                                placeholder="admin@example.com"
                                                                                                        />
                                                                                                </div>
                                                                                                <div className="md:col-span-2">
                                                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات سایت</label>
                                                                                                        <textarea
                                                                                                                value={formData.siteDescription || ''}
                                                                                                                onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}
                                                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                                                                rows={3}
                                                                                                                placeholder="توضیح کوتاه از فروشگاه"
                                                                                                        />
                                                                                                </div>
                                                                                                <div className="md:col-span-2 space-y-4">
                                                                                                        <h3 className="font-medium text-gray-900">تنظیمات سیستم</h3>
                                                                                                        <div className="space-y-3">
                                                                                                                <div className="flex items-center">
                                                                                                                        <input
                                                                                                                                type="checkbox"
                                                                                                                                checked={formData.maintenanceMode || false}
                                                                                                                                onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
                                                                                                                                className="ml-2"
                                                                                                                        />
                                                                                                                        <label className="text-sm text-gray-700">حالت تعمیر فعال</label>
                                                                                                                </div>
                                                                                                                <div className="flex items-center">
                                                                                                                        <input
                                                                                                                                type="checkbox"
                                                                                                                                checked={formData.allowRegistration || false}
                                                                                                                                onChange={(e) => setFormData({ ...formData, allowRegistration: e.target.checked })}
                                                                                                                                className="ml-2"
                                                                                                                        />
                                                                                                                        <label className="text-sm text-gray-700">اجازه ثبت‌نام کاربران</label>
                                                                                                                </div>
                                                                                                        </div>
                                                                                                </div>
                                                                                        </div>
                                                                                )}

                                                                                {/* JSON Editor for Advanced Settings */}
                                                                                {filters.category !== 'general' && (
                                                                                        <div>
                                                                                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                                                                                        تنظیمات پیشرفته {currentCategory?.name}
                                                                                                </h3>
                                                                                                <JSONEditor
                                                                                                        value={formData}
                                                                                                        onChange={setFormData}
                                                                                                        height={500}
                                                                                                />
                                                                                        </div>
                                                                                )}
                                                                        </motion.div>
                                                                </AnimatePresence>

                                                                {/* Action Buttons */}
                                                                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gray-200">
                                                                        <div className="flex items-center gap-3">
                                                                                <button
                                                                                        type="submit"
                                                                                        disabled={saving}
                                                                                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                                                >
                                                                                        {saving ? (
                                                                                                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                                                                </svg>
                                                                                        ) : (
                                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                                                </svg>
                                                                                        )}
                                                                                        {saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
                                                                                </button>

                                                                                {(filters.category === 'email' || filters.category === 'sms') && (
                                                                                        <button
                                                                                                type="button"
                                                                                                onClick={() => setShowTestModal(true)}
                                                                                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                                                                        >
                                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                                </svg>
                                                                                                تست
                                                                                        </button>
                                                                                )}

                                                                                {filters.category === 'backup' && (
                                                                                        <button
                                                                                                type="button"
                                                                                                onClick={() => setShowBackupModal(true)}
                                                                                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                                                                        >
                                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                                                                                                </svg>
                                                                                                ایجاد پشتیبان
                                                                                        </button>
                                                                                )}
                                                                        </div>

                                                                        <button
                                                                                type="button"
                                                                                onClick={handleResetToDefaults}
                                                                                className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                                                                        >
                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                                                </svg>
                                                                                بازگردانی به پیش‌فرض
                                                                        </button>
                                                                </div>
                                                        </form>
                                                )}
                                        </div>
                                </div>

                                {/* Test Modal */}
                                <Modal
                                        isOpen={showTestModal}
                                        onClose={() => setShowTestModal(false)}
                                        title={`تست تنظیمات ${currentCategory?.name}`}
                                >
                                        <div className="space-y-4">
                                                <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                {filters.category === 'email' ? 'ایمیل تست' : 'شماره تلفن تست'}
                                                        </label>
                                                        <input
                                                                type={filters.category === 'email' ? 'email' : 'tel'}
                                                                value={testData.testValue || ''}
                                                                onChange={(e) => setTestData({ ...testData, testValue: e.target.value })}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                placeholder={filters.category === 'email' ? 'test@example.com' : '09123456789'}
                                                        />
                                                </div>
                                                <div className="flex justify-end gap-3">
                                                        <button
                                                                type="button"
                                                                onClick={() => setShowTestModal(false)}
                                                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                                        >
                                                                لغو
                                                        </button>
                                                        <button
                                                                onClick={handleTest}
                                                                disabled={testing}
                                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                        >
                                                                {testing ? 'در حال ارسال...' : 'ارسال تست'}
                                                        </button>
                                                </div>
                                        </div>
                                </Modal>

                                {/* Import Modal */}
                                <Modal
                                        isOpen={showImportModal}
                                        onClose={() => setShowImportModal(false)}
                                        title="وارد کردن تنظیمات"
                                >
                                        <div className="space-y-4">
                                                <p className="text-sm text-gray-600">
                                                        فایل JSON تنظیمات خود را انتخاب کنید. توجه کنید که این عمل تنظیمات فعلی را جایگزین خواهد کرد.
                                                </p>
                                                <FileUpload
                                                        onFileSelect={handleImportSettings}
                                                        acceptedTypes={{ 'application/json': ['.json'] }}
                                                        maxFiles={1}
                                                        showPreview={false}
                                                />
                                        </div>
                                </Modal>

                                {/* System Stats Modal */}
                                <Modal
                                        isOpen={showSystemStatsModal}
                                        onClose={() => setShowSystemStatsModal(false)}
                                        title="آمار سیستم"
                                        size="large"
                                >
                                        {systemStats && (
                                                <div className="space-y-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                <div className="bg-blue-50 p-4 rounded-lg">
                                                                        <h4 className="font-medium text-blue-900">CPU Usage</h4>
                                                                        <p className="text-2xl font-bold text-blue-600">{systemStats.cpuUsage}%</p>
                                                                </div>
                                                                <div className="bg-green-50 p-4 rounded-lg">
                                                                        <h4 className="font-medium text-green-900">Memory Usage</h4>
                                                                        <p className="text-2xl font-bold text-green-600">{systemStats.memoryUsage}%</p>
                                                                </div>
                                                                <div className="bg-purple-50 p-4 rounded-lg">
                                                                        <h4 className="font-medium text-purple-900">Disk Usage</h4>
                                                                        <p className="text-2xl font-bold text-purple-600">{systemStats.diskUsage}%</p>
                                                                </div>
                                                        </div>
                                                        <JSONEditor
                                                                value={systemStats}
                                                                onChange={() => { }}
                                                                readOnly={true}
                                                                height={300}
                                                        />
                                                </div>
                                        )}
                                </Modal>
                        </div>
                </ErrorBoundary>
        );
};

export default SystemSettings; 