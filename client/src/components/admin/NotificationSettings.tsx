import React, { useState, useEffect } from 'react';
import { useAdminNotifications } from '../../hooks/useAdminNotifications';
import LoadingSpinner from '../common/LoadingSpinner';

interface NotificationChannelSettings {
        enabled: boolean;
        defaultPriority: 'low' | 'normal' | 'high' | 'urgent';
        throttleLimit: number;
        retryAttempts: number;
        timeout: number;
        fallbackChannel?: string;
}

interface NotificationSettingsState {
        email: NotificationChannelSettings;
        sms: NotificationChannelSettings;
        push: NotificationChannelSettings;
        inApp: NotificationChannelSettings;
        general: {
                enableBatching: boolean;
                batchSize: number;
                batchDelay: number;
                enableUnsubscribe: boolean;
                trackingEnabled: boolean;
                enableA11y: boolean;
                timezone: string;
                language: string;
        };
}

const NotificationSettings: React.FC = () => {
        const { loading, updateSettings } = useAdminNotifications();

        const [settings, setSettings] = useState<NotificationSettingsState>({
                email: {
                        enabled: true,
                        defaultPriority: 'normal',
                        throttleLimit: 100,
                        retryAttempts: 3,
                        timeout: 30000,
                        fallbackChannel: 'sms'
                },
                sms: {
                        enabled: true,
                        defaultPriority: 'high',
                        throttleLimit: 50,
                        retryAttempts: 2,
                        timeout: 15000,
                        fallbackChannel: 'email'
                },
                push: {
                        enabled: true,
                        defaultPriority: 'high',
                        throttleLimit: 200,
                        retryAttempts: 3,
                        timeout: 10000,
                        fallbackChannel: 'inApp'
                },
                inApp: {
                        enabled: true,
                        defaultPriority: 'normal',
                        throttleLimit: 500,
                        retryAttempts: 1,
                        timeout: 5000
                },
                general: {
                        enableBatching: true,
                        batchSize: 50,
                        batchDelay: 300,
                        enableUnsubscribe: true,
                        trackingEnabled: true,
                        enableA11y: true,
                        timezone: 'Asia/Tehran',
                        language: 'fa'
                }
        });

        const [activeTab, setActiveTab] = useState<'email' | 'sms' | 'push' | 'inApp' | 'general'>('general');
        const [hasChanges, setHasChanges] = useState(false);
        const [saving, setSaving] = useState(false);

        // Track changes
        useEffect(() => {
                setHasChanges(true);
        }, [settings]);

        // Available channels for fallback selection
        const channels = ['email', 'sms', 'push', 'inApp'];

        // Update channel settings
        const updateChannelSettings = (channel: 'email' | 'sms' | 'push' | 'inApp', updates: Partial<NotificationChannelSettings>) => {
                setSettings(prev => ({
                        ...prev,
                        [channel]: { ...prev[channel], ...updates }
                }));
        };

        // Update general settings
        const updateGeneralSettings = (updates: Partial<NotificationSettingsState['general']>) => {
                setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, ...updates }
                }));
        };

        // Save settings
        const handleSave = async () => {
                setSaving(true);
                try {
                        // Transform settings to match API expected structure (NotificationSettings interface)
                        const apiSettings = {
                                general: {
                                        enabled: true,
                                        defaultChannels: ['email'],
                                        retryAttempts: 3,
                                        retryDelay: 1000,
                                        batchSize: settings.general.batchSize || 50,
                                        rateLimit: 100,
                                },
                                inApp: {
                                        enabled: settings.inApp.enabled,
                                        maxNotifications: 100, // Default value
                                        autoMarkRead: true, // Default value
                                        displayDuration: 5000, // Default value in ms  
                                        showAvatars: true, // Default value
                                        playSound: false, // Default value
                                        soundFile: undefined
                                },
                                email: {
                                        enabled: settings.email.enabled,
                                        fromName: 'شال و روسری',
                                        fromEmail: 'noreply@shal-roosari.com',
                                        replyTo: 'support@shal-roosari.com',
                                        trackOpening: true,
                                        trackClicks: true,
                                        unsubscribeLink: true,
                                        smtp: {
                                                host: 'smtp.gmail.com',
                                                port: 587,
                                                secure: false,
                                                username: '',
                                                password: ''
                                        }
                                },
                                sms: {
                                        enabled: settings.sms.enabled,
                                        provider: 'kavenegar' as const,
                                        apiKey: '',
                                        senderNumber: '',
                                        maxLength: 70,
                                        unicode: true
                                },
                                push: {
                                        enabled: settings.push.enabled,
                                        vapidKeys: {
                                                publicKey: '',
                                                privateKey: ''
                                        },
                                        fcmServerKey: '',
                                        icon: '/icon-192x192.png',
                                        badge: '/badge-72x72.png',
                                        requireInteraction: false,
                                        silent: false
                                }
                        };
                        await updateSettings(apiSettings);
                        setHasChanges(false);
                } catch (error) {
                        console.error('خطا در ذخیره تنظیمات:', error);
                } finally {
                        setSaving(false);
                }
        };

        // Reset settings
        const handleReset = () => {
                // Reset to default values
                setSettings({
                        email: {
                                enabled: true,
                                defaultPriority: 'normal',
                                throttleLimit: 100,
                                retryAttempts: 3,
                                timeout: 30000,
                                fallbackChannel: 'sms'
                        },
                        sms: {
                                enabled: true,
                                defaultPriority: 'high',
                                throttleLimit: 50,
                                retryAttempts: 2,
                                timeout: 15000,
                                fallbackChannel: 'email'
                        },
                        push: {
                                enabled: true,
                                defaultPriority: 'high',
                                throttleLimit: 200,
                                retryAttempts: 3,
                                timeout: 10000,
                                fallbackChannel: 'inApp'
                        },
                        inApp: {
                                enabled: true,
                                defaultPriority: 'normal',
                                throttleLimit: 500,
                                retryAttempts: 1,
                                timeout: 5000
                        },
                        general: {
                                enableBatching: true,
                                batchSize: 50,
                                batchDelay: 300,
                                enableUnsubscribe: true,
                                trackingEnabled: true,
                                enableA11y: true,
                                timezone: 'Asia/Tehran',
                                language: 'fa'
                        }
                });
                setHasChanges(false);
        };

        // Get channel icon
        const getChannelIcon = (channel: string) => {
                const iconClasses = "w-5 h-5";
                switch (channel) {
                        case 'email':
                                return <svg className={`${iconClasses} text-blue-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.945a1 1 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
                        case 'sms':
                                return <svg className={`${iconClasses} text-green-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>;
                        case 'push':
                                return <svg className={`${iconClasses} text-purple-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM12 3v1m6.364.636l-.707.707M21 12h-1M18.364 18.364l-.707-.707M12 20v1m-6.364-.636l.707-.707M3 12h1M5.636 5.636l.707.707" /></svg>;
                        case 'inApp':
                                return <svg className={`${iconClasses} text-orange-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a1 1 0 001-1v-1H7v1a1 1 0 001 1zM10 2C9 2 9 3 9 3h6s0-1-1-1h-4zM4 5a2 2 0 012-2h12a2 2 0 012 2v11H4V5z" /></svg>;
                        case 'general':
                                return <svg className={`${iconClasses} text-gray-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
                        default:
                                return null;
                }
        };

        // Render channel settings
        const renderChannelSettings = (channel: 'email' | 'sms' | 'push' | 'inApp') => {
                const channelSettings = settings[channel];
                const channelNames = {
                        email: 'ایمیل',
                        sms: 'پیامک',
                        push: 'اعلان فوری',
                        inApp: 'اپلیکیشن'
                };

                return (
                        <div className="space-y-6">
                                {/* Enable/Disable */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                                <h3 className="text-lg font-medium text-gray-900">وضعیت کانال {channelNames[channel]}</h3>
                                                <p className="text-sm text-gray-600">فعال یا غیرفعال کردن این کانال اطلاع‌رسانی</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={channelSettings.enabled}
                                                        onChange={(e) => updateChannelSettings(channel, { enabled: e.target.checked })}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        </label>
                                </div>

                                {/* Settings Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Default Priority */}
                                        <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">اولویت پیش‌فرض</label>
                                                <select
                                                        value={channelSettings.defaultPriority}
                                                        onChange={(e) => updateChannelSettings(channel, { defaultPriority: e.target.value as any })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        disabled={!channelSettings.enabled}
                                                >
                                                        <option value="low">پایین</option>
                                                        <option value="normal">معمولی</option>
                                                        <option value="high">بالا</option>
                                                        <option value="urgent">فوری</option>
                                                </select>
                                        </div>

                                        {/* Throttle Limit */}
                                        <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">حد محدودیت (در ساعت)</label>
                                                <input
                                                        type="number"
                                                        min="1"
                                                        max="1000"
                                                        value={channelSettings.throttleLimit}
                                                        onChange={(e) => updateChannelSettings(channel, { throttleLimit: parseInt(e.target.value) })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        disabled={!channelSettings.enabled}
                                                />
                                        </div>

                                        {/* Retry Attempts */}
                                        <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">تعداد تلاش مجدد</label>
                                                <input
                                                        type="number"
                                                        min="0"
                                                        max="10"
                                                        value={channelSettings.retryAttempts}
                                                        onChange={(e) => updateChannelSettings(channel, { retryAttempts: parseInt(e.target.value) })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        disabled={!channelSettings.enabled}
                                                />
                                        </div>

                                        {/* Timeout */}
                                        <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">زمان انتظار (میلی‌ثانیه)</label>
                                                <input
                                                        type="number"
                                                        min="1000"
                                                        max="60000"
                                                        step="1000"
                                                        value={channelSettings.timeout}
                                                        onChange={(e) => updateChannelSettings(channel, { timeout: parseInt(e.target.value) })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        disabled={!channelSettings.enabled}
                                                />
                                        </div>

                                        {/* Fallback Channel */}
                                        {channel !== 'inApp' && (
                                                <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">کانال جایگزین</label>
                                                        <select
                                                                value={channelSettings.fallbackChannel || ''}
                                                                onChange={(e) => updateChannelSettings(channel, { fallbackChannel: e.target.value || undefined })}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                disabled={!channelSettings.enabled}
                                                        >
                                                                <option value="">بدون جایگزین</option>
                                                                {channels.filter(ch => ch !== channel).map(ch => (
                                                                        <option key={ch} value={ch}>
                                                                                {ch === 'email' && 'ایمیل'}
                                                                                {ch === 'sms' && 'پیامک'}
                                                                                {ch === 'push' && 'اعلان فوری'}
                                                                                {ch === 'inApp' && 'اپلیکیشن'}
                                                                        </option>
                                                                ))}
                                                        </select>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                                در صورت عدم موفقیت در ارسال از این کانال، از کانال جایگزین استفاده شود
                                                        </p>
                                                </div>
                                        )}
                                </div>
                        </div>
                );
        };

        // Render general settings
        const renderGeneralSettings = () => {
                return (
                        <div className="space-y-6">
                                {/* Batching Settings */}
                                <div className="p-4 bg-gray-50 rounded-lg">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">تنظیمات دسته‌ای</h3>

                                        <div className="space-y-4">
                                                {/* Enable Batching */}
                                                <div className="flex items-center justify-between">
                                                        <div>
                                                                <h4 className="text-sm font-medium text-gray-900">ارسال دسته‌ای</h4>
                                                                <p className="text-xs text-gray-600">گروه‌بندی اطلاع‌رسانی‌ها برای ارسال بهینه</p>
                                                        </div>
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                                <input
                                                                        type="checkbox"
                                                                        className="sr-only peer"
                                                                        checked={settings.general.enableBatching}
                                                                        onChange={(e) => updateGeneralSettings({ enableBatching: e.target.checked })}
                                                                />
                                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                        </label>
                                                </div>

                                                {/* Batch Size */}
                                                {settings.general.enableBatching && (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">اندازه دسته</label>
                                                                        <input
                                                                                type="number"
                                                                                min="10"
                                                                                max="500"
                                                                                value={settings.general.batchSize}
                                                                                onChange={(e) => updateGeneralSettings({ batchSize: parseInt(e.target.value) })}
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                        />
                                                                </div>
                                                                <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">تاخیر بین دسته‌ها (ثانیه)</label>
                                                                        <input
                                                                                type="number"
                                                                                min="0"
                                                                                max="3600"
                                                                                value={settings.general.batchDelay}
                                                                                onChange={(e) => updateGeneralSettings({ batchDelay: parseInt(e.target.value) })}
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                        />
                                                                </div>
                                                        </div>
                                                )}
                                        </div>
                                </div>

                                {/* User Experience Settings */}
                                <div className="p-4 bg-gray-50 rounded-lg">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">تجربه کاربری</h3>

                                        <div className="space-y-4">
                                                {/* Enable Unsubscribe */}
                                                <div className="flex items-center justify-between">
                                                        <div>
                                                                <h4 className="text-sm font-medium text-gray-900">لینک لغو اشتراک</h4>
                                                                <p className="text-xs text-gray-600">اضافه کردن لینک لغو اشتراک به اطلاع‌رسانی‌ها</p>
                                                        </div>
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                                <input
                                                                        type="checkbox"
                                                                        className="sr-only peer"
                                                                        checked={settings.general.enableUnsubscribe}
                                                                        onChange={(e) => updateGeneralSettings({ enableUnsubscribe: e.target.checked })}
                                                                />
                                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                        </label>
                                                </div>

                                                {/* Enable Tracking */}
                                                <div className="flex items-center justify-between">
                                                        <div>
                                                                <h4 className="text-sm font-medium text-gray-900">ردیابی فعالیت</h4>
                                                                <p className="text-xs text-gray-600">ردیابی باز کردن، کلیک و سایر فعالیت‌ها</p>
                                                        </div>
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                                <input
                                                                        type="checkbox"
                                                                        className="sr-only peer"
                                                                        checked={settings.general.trackingEnabled}
                                                                        onChange={(e) => updateGeneralSettings({ trackingEnabled: e.target.checked })}
                                                                />
                                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                        </label>
                                                </div>

                                                {/* Enable Accessibility */}
                                                <div className="flex items-center justify-between">
                                                        <div>
                                                                <h4 className="text-sm font-medium text-gray-900">دسترسی‌پذیری</h4>
                                                                <p className="text-xs text-gray-600">بهینه‌سازی برای ابزارهای کمکی</p>
                                                        </div>
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                                <input
                                                                        type="checkbox"
                                                                        className="sr-only peer"
                                                                        checked={settings.general.enableA11y}
                                                                        onChange={(e) => updateGeneralSettings({ enableA11y: e.target.checked })}
                                                                />
                                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                        </label>
                                                </div>
                                        </div>
                                </div>

                                {/* System Settings */}
                                <div className="p-4 bg-gray-50 rounded-lg">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">تنظیمات سیستم</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Timezone */}
                                                <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">منطقه زمانی</label>
                                                        <select
                                                                value={settings.general.timezone}
                                                                onChange={(e) => updateGeneralSettings({ timezone: e.target.value })}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        >
                                                                <option value="Asia/Tehran">تهران (UTC+3:30)</option>
                                                                <option value="UTC">UTC (UTC+0)</option>
                                                                <option value="Asia/Dubai">دبی (UTC+4)</option>
                                                                <option value="Europe/London">لندن (UTC+0/+1)</option>
                                                        </select>
                                                </div>

                                                {/* Language */}
                                                <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">زبان پیش‌فرض</label>
                                                        <select
                                                                value={settings.general.language}
                                                                onChange={(e) => updateGeneralSettings({ language: e.target.value })}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        >
                                                                <option value="fa">فارسی</option>
                                                                <option value="en">انگلیسی</option>
                                                                <option value="ar">عربی</option>
                                                        </select>
                                                </div>
                                        </div>
                                </div>
                        </div>
                );
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
                                                <h1 className="text-2xl font-bold text-gray-900">تنظیمات اطلاع‌رسانی</h1>
                                                <p className="text-sm text-gray-600 mt-1">
                                                        پیکربندی کانال‌های اطلاع‌رسانی و تنظیمات عمومی
                                                </p>
                                        </div>

                                        <div className="flex items-center space-x-3 space-x-reverse">
                                                {hasChanges && (
                                                        <button
                                                                onClick={handleReset}
                                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        >
                                                                بازنشانی
                                                        </button>
                                                )}

                                                <button
                                                        onClick={handleSave}
                                                        disabled={!hasChanges || saving}
                                                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${hasChanges && !saving
                                                                ? 'bg-blue-600 hover:bg-blue-700'
                                                                : 'bg-gray-400 cursor-not-allowed'
                                                                }`}
                                                >
                                                        {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                                                </button>
                                        </div>
                                </div>
                        </div>

                        {/* Tabs */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="border-b border-gray-200">
                                        <nav className="flex space-x-8 space-x-reverse px-6">
                                                {[
                                                        { id: 'general', name: 'عمومی', count: null },
                                                        { id: 'email', name: 'ایمیل', count: settings.email.enabled ? 'فعال' : 'غیرفعال' },
                                                        { id: 'sms', name: 'پیامک', count: settings.sms.enabled ? 'فعال' : 'غیرفعال' },
                                                        { id: 'push', name: 'اعلان فوری', count: settings.push.enabled ? 'فعال' : 'غیرفعال' },
                                                        { id: 'inApp', name: 'اپلیکیشن', count: settings.inApp.enabled ? 'فعال' : 'غیرفعال' }
                                                ].map((tab) => (
                                                        <button
                                                                key={tab.id}
                                                                onClick={() => setActiveTab(tab.id as any)}
                                                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === tab.id
                                                                        ? 'border-blue-500 text-blue-600'
                                                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                                                        }`}
                                                        >
                                                                <div className="flex items-center space-x-2 space-x-reverse">
                                                                        {getChannelIcon(tab.id)}
                                                                        <span>{tab.name}</span>
                                                                        {tab.count && (
                                                                                <span className={`px-2 py-1 text-xs rounded-full ${tab.count === 'فعال'
                                                                                        ? 'bg-green-100 text-green-700'
                                                                                        : 'bg-gray-100 text-gray-700'
                                                                                        }`}>
                                                                                        {tab.count}
                                                                                </span>
                                                                        )}
                                                                </div>
                                                        </button>
                                                ))}
                                        </nav>
                                </div>

                                {/* Tab Content */}
                                <div className="p-6">
                                        {activeTab === 'general' && renderGeneralSettings()}
                                        {activeTab === 'email' && renderChannelSettings('email')}
                                        {activeTab === 'sms' && renderChannelSettings('sms')}
                                        {activeTab === 'push' && renderChannelSettings('push')}
                                        {activeTab === 'inApp' && renderChannelSettings('inApp')}
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
                                                        تغییراتی اعمال شده است. برای ذخیره تغییرات دکمه "ذخیره تغییرات" را کلیک کنید.
                                                </p>
                                        </div>
                                </div>
                        )}
                </div>
        );
};

export default NotificationSettings; 