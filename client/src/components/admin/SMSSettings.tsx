import React, { useState, useEffect } from 'react';
import { useAdminNotifications } from '../../hooks/useAdminNotifications';
import { SMSSettings } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';

interface SMSProvider {
        name: string;
        apiUrl: string;
        requiresUsername: boolean;
        requiresPassword: boolean;
        requiresApiKey: boolean;
        maxLength: number;
        description: string;
        pricePerSMS: string;
}

const SMS_PROVIDERS: SMSProvider[] = [
        {
                name: 'کاوه نگار',
                apiUrl: 'https://api.kavenegar.com/v1/',
                requiresApiKey: true,
                requiresUsername: false,
                requiresPassword: false,
                maxLength: 612,
                description: 'ارائه‌دهنده محبوب SMS در ایران',
                pricePerSMS: '۱۵ تومان'
        },
        {
                name: 'قاصدک',
                apiUrl: 'https://api.ghasedak.com/',
                requiresApiKey: true,
                requiresUsername: false,
                requiresPassword: false,
                maxLength: 612,
                description: 'سرویس SMS با قیمت مناسب',
                pricePerSMS: '۱۲ تومان'
        },
        {
                name: 'آی پی پنل',
                apiUrl: 'https://rest.ippanel.com/api/',
                requiresApiKey: true,
                requiresUsername: false,
                requiresPassword: false,
                maxLength: 612,
                description: 'پنل پیامک با امکانات کامل',
                pricePerSMS: '۱۸ تومان'
        },
        {
                name: 'ملی پیامک',
                apiUrl: 'https://rest.payamak-panel.com/api/',
                requiresApiKey: false,
                requiresUsername: true,
                requiresPassword: true,
                maxLength: 612,
                description: 'سرویس ملی پیامک',
                pricePerSMS: '۱۶ تومان'
        }
];

const SMSSettingsComponent: React.FC = () => {
        const { loading, updateSMSSettings } = useAdminNotifications();

        const [settings, setSettings] = useState<SMSSettings>({
                provider: 'kavenegar',
                kavenegar: {
                        apiKey: '',
                        sender: 'فروشگاه'
                },
                enabled: true,
                templates: {
                        orderConfirmation: {
                                enabled: true,
                                content: 'سفارش شما با موفقیت ثبت شد.'
                        },
                        orderShipped: {
                                enabled: true,
                                content: 'سفارش شما ارسال شد.'
                        },
                        passwordReset: {
                                enabled: true,
                                content: 'کد بازیابی رمز عبور شما: {code}'
                        },
                        verificationCode: {
                                enabled: true,
                                content: 'کد تایید شما: {code}'
                        }
                }
        });

        const [activeTab, setActiveTab] = useState<'basic' | 'templates' | 'testing'>('basic');
        const [hasChanges, setHasChanges] = useState(false);
        const [saving, setSaving] = useState(false);
        const [testing, setTesting] = useState(false);
        const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
        const [testNumber, setTestNumber] = useState('');
        const [allowedTestNumbers, setAllowedTestNumbers] = useState<string[]>([]);
        const [enableTestMode, setEnableTestMode] = useState(false);
        const [logSMS, setLogSMS] = useState(true);

        const currentProvider = SMS_PROVIDERS.find(p => p.name === getProviderDisplayName(settings.provider));

        // Track changes
        useEffect(() => {
                setHasChanges(true);
        }, [settings]);

        // Get provider display name
        function getProviderDisplayName(provider: string) {
                switch (provider) {
                        case 'kavenegar': return 'کاوه نگار';
                        case 'ghasedak': return 'قاصدک';
                        case 'ippanel': return 'آی پی پنل';
                        case 'melipayamak': return 'ملی پیامک';
                        default: return 'سفارشی';
                }
        }

        // Update settings
        const updateSetting = (section: keyof SMSSettings, key: string, value: any) => {
                setSettings(prev => {
                        const sectionData = prev[section];
                        if (typeof sectionData === 'object' && sectionData !== null) {
                                return {
                                        ...prev,
                                        [section]: { ...sectionData, [key]: value }
                                };
                        }
                        return prev;
                });
        };

        // Load provider preset
        const loadProviderPreset = (providerKey: string) => {
                setSettings(prev => ({
                        ...prev,
                        provider: providerKey as any
                }));
        };

        // Test SMS configuration
        const testSMSConfig = async () => {
                if (!testNumber) {
                        setTestResult({ success: false, message: 'لطفاً شماره تست را وارد کنید' });
                        return;
                }

                // Validate Iranian mobile number
                const iranianMobileRegex = /^(\+98|0)?9\d{9}$/;
                if (!iranianMobileRegex.test(testNumber)) {
                        setTestResult({ success: false, message: 'شماره موبایل وارد شده معتبر نیست' });
                        return;
                }

                setTesting(true);
                setTestResult(null);

                try {
                        // Simulate SMS test
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        setTestResult({ success: true, message: 'پیامک تست با موفقیت ارسال شد' });
                } catch (error) {
                        setTestResult({ success: false, message: 'خطا در ارسال پیامک تست' });
                } finally {
                        setTesting(false);
                }
        };

        // Add test number
        const addTestNumber = () => {
                if (testNumber && !allowedTestNumbers.includes(testNumber)) {
                        setAllowedTestNumbers(prev => [...prev, testNumber]);
                        setTestNumber('');
                }
        };

        // Remove test number
        const removeTestNumber = (number: string) => {
                setAllowedTestNumbers(prev => prev.filter(n => n !== number));
        };

        // Save settings
        const handleSave = async () => {
                setSaving(true);
                try {
                        await updateSMSSettings(settings);
                        setHasChanges(false);
                } catch (error) {
                        console.error('خطا در ذخیره تنظیمات:', error);
                } finally {
                        setSaving(false);
                }
        };

        if (loading) {
                return <LoadingSpinner />;
        }

        return (
                <div className="space-y-6">
                        {/* Header */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                        <div>
                                                <h1 className="text-2xl font-bold text-gray-900">تنظیمات پیامک</h1>
                                                <p className="text-sm text-gray-600 mt-1">
                                                        پیکربندی سرویس SMS و تنظیمات ارسال پیامک
                                                </p>
                                        </div>

                                        <div className="flex items-center space-x-3 space-x-reverse">
                                                <button
                                                        onClick={handleSave}
                                                        disabled={!hasChanges || saving}
                                                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${hasChanges && !saving
                                                                ? 'bg-blue-600 hover:bg-blue-700'
                                                                : 'bg-gray-400 cursor-not-allowed'
                                                                }`}
                                                >
                                                        {saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
                                                </button>
                                        </div>
                                </div>
                        </div>

                        {/* Tabs */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="border-b border-gray-200">
                                        <nav className="flex space-x-8 space-x-reverse px-6">
                                                {[
                                                        { id: 'basic', name: 'تنظیمات پایه' },
                                                        { id: 'templates', name: 'قالب‌ها' },
                                                        { id: 'testing', name: 'تست و دیباگ' }
                                                ].map((tab) => (
                                                        <button
                                                                key={tab.id}
                                                                onClick={() => setActiveTab(tab.id as any)}
                                                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === tab.id
                                                                        ? 'border-blue-500 text-blue-600'
                                                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                                                        }`}
                                                        >
                                                                {tab.name}
                                                        </button>
                                                ))}
                                        </nav>
                                </div>

                                <div className="p-6">
                                        {/* Basic Settings Tab */}
                                        {activeTab === 'basic' && (
                                                <div className="space-y-6">
                                                        {/* Provider Selection */}
                                                        <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-3">انتخاب ارائه‌دهنده SMS</label>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                        {SMS_PROVIDERS.map((provider) => {
                                                                                const providerKey = provider.name === 'کاوه نگار' ? 'kavenegar' :
                                                                                        provider.name === 'قاصدک' ? 'ghasedak' :
                                                                                                provider.name === 'آی پی پنل' ? 'ippanel' : 'melipayamak';

                                                                                return (
                                                                                        <div
                                                                                                key={provider.name}
                                                                                                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${settings.provider === providerKey
                                                                                                        ? 'border-blue-500 bg-blue-50'
                                                                                                        : 'border-gray-200 hover:border-gray-300'
                                                                                                        }`}
                                                                                                onClick={() => loadProviderPreset(providerKey)}
                                                                                        >
                                                                                                <div className="flex justify-between items-start mb-2">
                                                                                                        <h3 className="font-medium text-gray-900">{provider.name}</h3>
                                                                                                        <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                                                                                                                {provider.pricePerSMS}
                                                                                                        </span>
                                                                                                </div>
                                                                                                <p className="text-sm text-gray-600 mb-2">{provider.description}</p>
                                                                                                <p className="text-xs text-gray-500">
                                                                                                        حداکثر طول: {provider.maxLength} کاراکتر
                                                                                                </p>
                                                                                        </div>
                                                                                );
                                                                        })}
                                                                </div>
                                                        </div>

                                                        {/* SMS Configuration */}
                                                        <div className="p-4 bg-gray-50 rounded-lg">
                                                                <h3 className="text-lg font-medium text-gray-900 mb-4">پیکربندی {getProviderDisplayName(settings.provider)}</h3>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                        {currentProvider?.requiresApiKey && (
                                                                                <div className="md:col-span-2">
                                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                                                                                        <input
                                                                                                type="text"
                                                                                                value={settings.kavenegar?.apiKey || ''}
                                                                                                onChange={(e) => updateSetting('kavenegar', 'apiKey', e.target.value)}
                                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                                placeholder="کلید API خود را وارد کنید"
                                                                                        />
                                                                                </div>
                                                                        )}

                                                                        <div>
                                                                                <label className="block text-sm font-medium text-gray-700 mb-2">شماره فرستنده</label>
                                                                                <input
                                                                                        type="text"
                                                                                        value={settings.kavenegar?.sender || ''}
                                                                                        onChange={(e) => updateSetting('kavenegar', 'sender', e.target.value)}
                                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                        placeholder="نام یا شماره فرستنده"
                                                                                />
                                                                        </div>
                                                                </div>

                                                                {currentProvider && (
                                                                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                                                                <p className="text-sm text-blue-800">
                                                                                        <strong>راهنما:</strong> برای دریافت اطلاعات دسترسی، به پنل کاربری {currentProvider.name} مراجعه کنید.
                                                                                        {currentProvider.maxLength && ` حداکثر طول پیام ${currentProvider.maxLength} کاراکتر است.`}
                                                                                </p>
                                                                        </div>
                                                                )}
                                                        </div>
                                                </div>
                                        )}

                                        {/* Templates Tab */}
                                        {activeTab === 'templates' && (
                                                <div className="space-y-6">
                                                        <div className="p-4 bg-gray-50 rounded-lg">
                                                                <h3 className="text-lg font-medium text-gray-900 mb-4">تنظیمات قالب‌ها</h3>

                                                                <div className="space-y-6">
                                                                        {/* Order Confirmation Template */}
                                                                        <div>
                                                                                <h4 className="text-md font-medium text-gray-900 mb-3">تایید سفارش</h4>
                                                                                <div className="space-y-3">
                                                                                        <label className="flex items-center">
                                                                                                <input
                                                                                                        type="checkbox"
                                                                                                        checked={settings.templates.orderConfirmation.enabled}
                                                                                                        onChange={(e) => updateSetting('templates', 'orderConfirmation', { ...settings.templates.orderConfirmation, enabled: e.target.checked })}
                                                                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                                                                                />
                                                                                                <span className="mr-2 text-sm text-gray-700">فعال کردن پیامک تایید سفارش</span>
                                                                                        </label>
                                                                                        <textarea
                                                                                                value={settings.templates.orderConfirmation.content}
                                                                                                onChange={(e) => updateSetting('templates', 'orderConfirmation', { ...settings.templates.orderConfirmation, content: e.target.value })}
                                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                                rows={3}
                                                                                                placeholder="متن پیامک تایید سفارش"
                                                                                        />
                                                                                </div>
                                                                        </div>

                                                                        {/* Order Shipped Template */}
                                                                        <div>
                                                                                <h4 className="text-md font-medium text-gray-900 mb-3">ارسال سفارش</h4>
                                                                                <div className="space-y-3">
                                                                                        <label className="flex items-center">
                                                                                                <input
                                                                                                        type="checkbox"
                                                                                                        checked={settings.templates.orderShipped.enabled}
                                                                                                        onChange={(e) => updateSetting('templates', 'orderShipped', { ...settings.templates.orderShipped, enabled: e.target.checked })}
                                                                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                                                                                />
                                                                                                <span className="mr-2 text-sm text-gray-700">فعال کردن پیامک ارسال سفارش</span>
                                                                                        </label>
                                                                                        <textarea
                                                                                                value={settings.templates.orderShipped.content}
                                                                                                onChange={(e) => updateSetting('templates', 'orderShipped', { ...settings.templates.orderShipped, content: e.target.value })}
                                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                                rows={3}
                                                                                                placeholder="متن پیامک ارسال سفارش"
                                                                                        />
                                                                                </div>
                                                                        </div>

                                                                        {/* Password Reset Template */}
                                                                        <div>
                                                                                <h4 className="text-md font-medium text-gray-900 mb-3">بازیابی رمز عبور</h4>
                                                                                <div className="space-y-3">
                                                                                        <label className="flex items-center">
                                                                                                <input
                                                                                                        type="checkbox"
                                                                                                        checked={settings.templates.passwordReset.enabled}
                                                                                                        onChange={(e) => updateSetting('templates', 'passwordReset', { ...settings.templates.passwordReset, enabled: e.target.checked })}
                                                                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                                                                                />
                                                                                                <span className="mr-2 text-sm text-gray-700">فعال کردن پیامک بازیابی رمز عبور</span>
                                                                                        </label>
                                                                                        <textarea
                                                                                                value={settings.templates.passwordReset.content}
                                                                                                onChange={(e) => updateSetting('templates', 'passwordReset', { ...settings.templates.passwordReset, content: e.target.value })}
                                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                                rows={3}
                                                                                                placeholder="متن پیامک بازیابی رمز عبور"
                                                                                        />
                                                                                </div>
                                                                        </div>

                                                                        {/* Verification Code Template */}
                                                                        <div>
                                                                                <h4 className="text-md font-medium text-gray-900 mb-3">کد تایید</h4>
                                                                                <div className="space-y-3">
                                                                                        <label className="flex items-center">
                                                                                                <input
                                                                                                        type="checkbox"
                                                                                                        checked={settings.templates.verificationCode.enabled}
                                                                                                        onChange={(e) => updateSetting('templates', 'verificationCode', { ...settings.templates.verificationCode, enabled: e.target.checked })}
                                                                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                                                                                />
                                                                                                <span className="mr-2 text-sm text-gray-700">فعال کردن پیامک کد تایید</span>
                                                                                        </label>
                                                                                        <textarea
                                                                                                value={settings.templates.verificationCode.content}
                                                                                                onChange={(e) => updateSetting('templates', 'verificationCode', { ...settings.templates.verificationCode, content: e.target.value })}
                                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                                rows={3}
                                                                                                placeholder="متن پیامک کد تایید"
                                                                                        />
                                                                                </div>
                                                                        </div>

                                                                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                                                                <p className="text-sm text-blue-800">
                                                                                        <strong>نکته:</strong> می‌توانید از متغیرها مانند {"{code}"}, {"{orderNumber}"}, {"{customerName}"} در متن پیامک‌ها استفاده کنید.
                                                                                </p>
                                                                        </div>
                                                                </div>
                                                        </div>
                                                </div>
                                        )}

                                        {/* Testing Tab */}
                                        {activeTab === 'testing' && (
                                                <div className="space-y-6">
                                                        <div className="p-4 bg-gray-50 rounded-lg">
                                                                <h3 className="text-lg font-medium text-gray-900 mb-4">تست SMS</h3>

                                                                <div className="space-y-4">
                                                                        <div>
                                                                                <label className="block text-sm font-medium text-gray-700 mb-2">شماره موبایل تست</label>
                                                                                <div className="flex space-x-3 space-x-reverse">
                                                                                        <input
                                                                                                type="tel"
                                                                                                value={testNumber}
                                                                                                onChange={(e) => setTestNumber(e.target.value)}
                                                                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                                placeholder="09123456789"
                                                                                                dir="ltr"
                                                                                        />
                                                                                        <button
                                                                                                onClick={testSMSConfig}
                                                                                                disabled={testing || !testNumber}
                                                                                                className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${testing || !testNumber
                                                                                                        ? 'bg-gray-400 cursor-not-allowed'
                                                                                                        : 'bg-blue-600 hover:bg-blue-700'
                                                                                                        }`}
                                                                                        >
                                                                                                {testing ? 'در حال ارسال...' : 'ارسال تست'}
                                                                                        </button>
                                                                                </div>
                                                                                <p className="text-xs text-gray-500 mt-1">
                                                                                        فرمت: 09XXXXXXXXX یا +989XXXXXXXXX
                                                                                </p>
                                                                        </div>

                                                                        {testResult && (
                                                                                <div className={`p-3 rounded-lg ${testResult.success
                                                                                        ? 'bg-green-50 border border-green-200 text-green-800'
                                                                                        : 'bg-red-50 border border-red-200 text-red-800'
                                                                                        }`}>
                                                                                        {testResult.message}
                                                                                </div>
                                                                        )}

                                                                        {/* Test Numbers Management */}
                                                                        <div>
                                                                                <label className="block text-sm font-medium text-gray-700 mb-2">شماره‌های مجاز برای تست</label>
                                                                                <div className="flex space-x-3 space-x-reverse mb-3">
                                                                                        <input
                                                                                                type="tel"
                                                                                                value={testNumber}
                                                                                                onChange={(e) => setTestNumber(e.target.value)}
                                                                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                                placeholder="09123456789"
                                                                                                dir="ltr"
                                                                                        />
                                                                                        <button
                                                                                                onClick={addTestNumber}
                                                                                                disabled={!testNumber}
                                                                                                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                                        >
                                                                                                افزودن
                                                                                        </button>
                                                                                </div>

                                                                                {allowedTestNumbers.length > 0 && (
                                                                                        <div className="space-y-2">
                                                                                                {allowedTestNumbers.map((number, index) => (
                                                                                                        <div key={index} className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded">
                                                                                                                <span className="text-sm font-mono">{number}</span>
                                                                                                                <button
                                                                                                                        onClick={() => removeTestNumber(number)}
                                                                                                                        className="text-red-600 hover:text-red-800"
                                                                                                                >
                                                                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                                                                        </svg>
                                                                                                                </button>
                                                                                                        </div>
                                                                                                ))}
                                                                                        </div>
                                                                                )}
                                                                        </div>

                                                                        <div className="space-y-3">
                                                                                <label className="flex items-center">
                                                                                        <input
                                                                                                type="checkbox"
                                                                                                checked={enableTestMode}
                                                                                                onChange={(e) => setEnableTestMode(e.target.checked)}
                                                                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                                                                        />
                                                                                        <span className="mr-2 text-sm text-gray-700">فعال‌سازی حالت تست</span>
                                                                                </label>

                                                                                <label className="flex items-center">
                                                                                        <input
                                                                                                type="checkbox"
                                                                                                checked={logSMS}
                                                                                                onChange={(e) => setLogSMS(e.target.checked)}
                                                                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                                                                        />
                                                                                        <span className="mr-2 text-sm text-gray-700">ثبت لاگ پیامک‌ها</span>
                                                                                </label>
                                                                        </div>
                                                                </div>
                                                        </div>
                                                </div>
                                        )}
                                </div>
                        </div>

                        {/* Changes indicator */}
                        {hasChanges && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <div className="flex items-center">
                                                <svg className="w-5 h-5 text-yellow-400 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                </svg>
                                                <p className="text-sm text-yellow-800">
                                                        تغییراتی اعمال شده است. برای ذخیره تنظیمات دکمه "ذخیره تنظیمات" را کلیک کنید.
                                                </p>
                                        </div>
                                </div>
                        )}
                </div>
        );
};

export default SMSSettingsComponent; 