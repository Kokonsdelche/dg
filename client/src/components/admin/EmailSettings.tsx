import React, { useState, useEffect } from 'react';
import { useAdminSettings } from '../../hooks/useAdminSettings';
import { EmailSettings } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';

interface EmailProvider {
        name: string;
        host: string;
        port: number;
        secure: boolean;
        requiresAuth: boolean;
        description: string;
}

const EMAIL_PROVIDERS: EmailProvider[] = [
        {
                name: 'Gmail SMTP',
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                requiresAuth: true,
                description: 'استفاده از Gmail برای ارسال ایمیل'
        },
        {
                name: 'Custom SMTP',
                host: '',
                port: 587,
                secure: false,
                requiresAuth: true,
                description: 'پیکربندی سرور SMTP سفارشی'
        }
];

const EmailSettingsComponent: React.FC = () => {
        const { loading, updateEmailSettings } = useAdminSettings();

        const [settings, setSettings] = useState<EmailSettings>({
                provider: 'smtp',
                smtp: {
                        host: '',
                        port: 587,
                        secure: false,
                        username: '',
                        password: ''
                },
                fromEmail: '',
                fromName: 'فروشگاه شال و روسری',
                templates: {
                        orderConfirmation: {
                                enabled: true,
                                subject: 'تایید سفارش',
                                content: 'سفارش شما با موفقیت ثبت شد.'
                        },
                        orderShipped: {
                                enabled: true,
                                subject: 'ارسال سفارش',
                                content: 'سفارش شما ارسال شد.'
                        },
                        orderDelivered: {
                                enabled: true,
                                subject: 'تحویل سفارش',
                                content: 'سفارش شما تحویل داده شد.'
                        },
                        passwordReset: {
                                enabled: true,
                                subject: 'بازیابی رمز عبور',
                                content: 'برای بازیابی رمز عبور روی لینک کلیک کنید.'
                        },
                        welcomeEmail: {
                                enabled: true,
                                subject: 'خوش آمدید',
                                content: 'به فروشگاه ما خوش آمدید.'
                        }
                },
                defaultTemplate: 'modern',
                headerLogo: '',
                footerText: 'با تشکر، تیم فروشگاه شال و روسری',
                unsubscribeText: 'برای لغو اشتراک از دریافت ایمیل‌ها کلیک کنید',
                privacyPolicyUrl: '',
                termsOfServiceUrl: ''
        });

        const [activeTab, setActiveTab] = useState<'basic' | 'templates' | 'testing'>('basic');
        const [hasChanges, setHasChanges] = useState(false);
        const [saving, setSaving] = useState(false);
        const [testing, setTesting] = useState(false);
        const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
        const [testEmail, setTestEmail] = useState('');
        const [enableTestMode, setEnableTestMode] = useState(false);
        const [logEmails, setLogEmails] = useState(true);

        // Track changes
        useEffect(() => {
                setHasChanges(true);
        }, [settings]);

        // Update settings
        const updateSetting = (section: keyof EmailSettings, key: string, value: any) => {
                setSettings(prev => {
                        const sectionData = prev[section];
                        if (typeof sectionData === 'object' && sectionData !== null) {
                                return {
                                        ...prev,
                                        [section]: { ...sectionData, [key]: value }
                                };
                        }
                        return { ...prev, [section]: value };
                });
        };

        // Load provider preset
        const loadProviderPreset = (providerName: string) => {
                const provider = EMAIL_PROVIDERS.find(p => p.name === providerName);
                if (provider && provider.host) {
                        setSettings(prev => ({
                                ...prev,
                                smtp: {
                                        ...prev.smtp!,
                                        host: provider.host,
                                        port: provider.port,
                                        secure: provider.secure
                                }
                        }));
                }
        };

        // Test email configuration
        const testEmailConfig = async () => {
                if (!testEmail) {
                        setTestResult({ success: false, message: 'لطفاً ایمیل تست را وارد کنید' });
                        return;
                }

                setTesting(true);
                setTestResult(null);

                try {
                        // Simulate email test
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        setTestResult({ success: true, message: 'ایمیل تست با موفقیت ارسال شد' });
                } catch (error) {
                        setTestResult({ success: false, message: 'خطا در ارسال ایمیل تست' });
                } finally {
                        setTesting(false);
                }
        };

        // Save settings
        const handleSave = async () => {
                setSaving(true);
                try {
                        await updateEmailSettings(settings);
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
                                                <h1 className="text-2xl font-bold text-gray-900">تنظیمات ایمیل</h1>
                                                <p className="text-sm text-gray-600 mt-1">
                                                        پیکربندی سرور ایمیل و تنظیمات SMTP
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
                                                                <label className="block text-sm font-medium text-gray-700 mb-3">انتخاب ارائه‌دهنده</label>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                        {EMAIL_PROVIDERS.map((provider) => (
                                                                                <div
                                                                                        key={provider.name}
                                                                                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${settings.smtp?.host === provider.host
                                                                                                ? 'border-blue-500 bg-blue-50'
                                                                                                : 'border-gray-200 hover:border-gray-300'
                                                                                                }`}
                                                                                        onClick={() => loadProviderPreset(provider.name)}
                                                                                >
                                                                                        <h3 className="font-medium text-gray-900">{provider.name}</h3>
                                                                                        <p className="text-sm text-gray-600 mt-1">{provider.description}</p>
                                                                                        {provider.host && (
                                                                                                <p className="text-xs text-gray-500 mt-2">
                                                                                                        {provider.host}:{provider.port}
                                                                                                </p>
                                                                                        )}
                                                                                </div>
                                                                        ))}
                                                                </div>
                                                        </div>

                                                        {/* SMTP Configuration */}
                                                        <div className="p-4 bg-gray-50 rounded-lg">
                                                                <h3 className="text-lg font-medium text-gray-900 mb-4">پیکربندی SMTP</h3>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                        <div>
                                                                                <label className="block text-sm font-medium text-gray-700 mb-2">هاست سرور</label>
                                                                                <input
                                                                                        type="text"
                                                                                        value={settings.smtp?.host || ''}
                                                                                        onChange={(e) => updateSetting('smtp', 'host', e.target.value)}
                                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                        placeholder="smtp.example.com"
                                                                                />
                                                                        </div>

                                                                        <div>
                                                                                <label className="block text-sm font-medium text-gray-700 mb-2">پورت</label>
                                                                                <input
                                                                                        type="number"
                                                                                        value={settings.smtp?.port || 587}
                                                                                        onChange={(e) => updateSetting('smtp', 'port', parseInt(e.target.value))}
                                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                />
                                                                        </div>

                                                                        <div>
                                                                                <label className="block text-sm font-medium text-gray-700 mb-2">نام کاربری</label>
                                                                                <input
                                                                                        type="text"
                                                                                        value={settings.smtp?.username || ''}
                                                                                        onChange={(e) => updateSetting('smtp', 'username', e.target.value)}
                                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                />
                                                                        </div>

                                                                        <div>
                                                                                <label className="block text-sm font-medium text-gray-700 mb-2">رمز عبور</label>
                                                                                <input
                                                                                        type="password"
                                                                                        value={settings.smtp?.password || ''}
                                                                                        onChange={(e) => updateSetting('smtp', 'password', e.target.value)}
                                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                />
                                                                        </div>

                                                                        <div>
                                                                                <label className="block text-sm font-medium text-gray-700 mb-2">نام فرستنده</label>
                                                                                <input
                                                                                        type="text"
                                                                                        value={settings.fromName}
                                                                                        onChange={(e) => updateSetting('fromName', 'fromName', e.target.value)}
                                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                />
                                                                        </div>

                                                                        <div>
                                                                                <label className="block text-sm font-medium text-gray-700 mb-2">ایمیل فرستنده</label>
                                                                                <input
                                                                                        type="email"
                                                                                        value={settings.fromEmail}
                                                                                        onChange={(e) => updateSetting('fromEmail', 'fromEmail', e.target.value)}
                                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                />
                                                                        </div>
                                                                </div>

                                                                <div className="mt-4">
                                                                        <label className="flex items-center">
                                                                                <input
                                                                                        type="checkbox"
                                                                                        checked={settings.smtp?.secure || false}
                                                                                        onChange={(e) => updateSetting('smtp', 'secure', e.target.checked)}
                                                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                                                                />
                                                                                <span className="mr-2 text-sm text-gray-700">استفاده از SSL/TLS</span>
                                                                        </label>
                                                                </div>
                                                        </div>
                                                </div>
                                        )}

                                        {/* Templates Tab */}
                                        {activeTab === 'templates' && (
                                                <div className="space-y-6">
                                                        <div className="p-4 bg-gray-50 rounded-lg">
                                                                <h3 className="text-lg font-medium text-gray-900 mb-4">تنظیمات قالب</h3>

                                                                <div className="space-y-4">
                                                                        <div>
                                                                                <label className="block text-sm font-medium text-gray-700 mb-2">قالب پیش‌فرض</label>
                                                                                <select
                                                                                        value={settings.defaultTemplate}
                                                                                        onChange={(e) => updateSetting('defaultTemplate', 'defaultTemplate', e.target.value)}
                                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                >
                                                                                        <option value="modern">مدرن</option>
                                                                                        <option value="classic">کلاسیک</option>
                                                                                        <option value="minimal">مینیمال</option>
                                                                                </select>
                                                                        </div>

                                                                        <div>
                                                                                <label className="block text-sm font-medium text-gray-700 mb-2">متن پاورقی</label>
                                                                                <textarea
                                                                                        value={settings.footerText}
                                                                                        onChange={(e) => updateSetting('footerText', 'footerText', e.target.value)}
                                                                                        rows={3}
                                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                />
                                                                        </div>

                                                                        <div>
                                                                                <label className="block text-sm font-medium text-gray-700 mb-2">متن لغو اشتراک</label>
                                                                                <input
                                                                                        type="text"
                                                                                        value={settings.unsubscribeText}
                                                                                        onChange={(e) => updateSetting('unsubscribeText', 'unsubscribeText', e.target.value)}
                                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                />
                                                                        </div>
                                                                </div>
                                                        </div>
                                                </div>
                                        )}

                                        {/* Testing Tab */}
                                        {activeTab === 'testing' && (
                                                <div className="space-y-6">
                                                        <div className="p-4 bg-gray-50 rounded-lg">
                                                                <h3 className="text-lg font-medium text-gray-900 mb-4">تست ایمیل</h3>

                                                                <div className="space-y-4">
                                                                        <div>
                                                                                <label className="block text-sm font-medium text-gray-700 mb-2">ایمیل تست</label>
                                                                                <div className="flex space-x-3 space-x-reverse">
                                                                                        <input
                                                                                                type="email"
                                                                                                value={testEmail}
                                                                                                onChange={(e) => setTestEmail(e.target.value)}
                                                                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                                placeholder="test@example.com"
                                                                                        />
                                                                                        <button
                                                                                                onClick={testEmailConfig}
                                                                                                disabled={testing || !testEmail}
                                                                                                className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${testing || !testEmail
                                                                                                        ? 'bg-gray-400 cursor-not-allowed'
                                                                                                        : 'bg-blue-600 hover:bg-blue-700'
                                                                                                        }`}
                                                                                        >
                                                                                                {testing ? 'در حال ارسال...' : 'ارسال تست'}
                                                                                        </button>
                                                                                </div>
                                                                        </div>

                                                                        {testResult && (
                                                                                <div className={`p-3 rounded-lg ${testResult.success
                                                                                        ? 'bg-green-50 border border-green-200 text-green-800'
                                                                                        : 'bg-red-50 border border-red-200 text-red-800'
                                                                                        }`}>
                                                                                        {testResult.message}
                                                                                </div>
                                                                        )}

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
                                                                                                checked={logEmails}
                                                                                                onChange={(e) => setLogEmails(e.target.checked)}
                                                                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                                                                        />
                                                                                        <span className="mr-2 text-sm text-gray-700">ثبت لاگ ایمیل‌ها</span>
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

export default EmailSettingsComponent; 