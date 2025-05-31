import React, { useState, useEffect } from 'react';
import { NotificationCampaign, NotificationTemplate } from '../../store/adminStore';
import Modal from './Modal';
import { toast } from 'react-hot-toast';

interface CampaignEditorProps {
        campaign?: NotificationCampaign | null;
        isOpen: boolean;
        onClose: () => void;
        onSave: (campaignData: Partial<NotificationCampaign>) => Promise<void>;
        loading?: boolean;
        mode: 'create' | 'edit';
        templates?: NotificationTemplate[];
}

interface FormData {
        name: string;
        description: string;
        type: 'immediate' | 'scheduled' | 'triggered';
        channels: {
                inApp: boolean;
                email: boolean;
                sms: boolean;
                push: boolean;
        };
        templateId: string;
        customContent: {
                subject: string;
                text: string;
                html: string;
        };
        targetAudience: {
                type: string;
                criteria: Record<string, any>;
                segments: string[];
                tags: string[];
                total: number;
                estimatedReach?: number;
                userIds?: string[];
        };
        schedule: {
                type: string;
                startDate: string;
                endDate: string;
                timezone: string;
                recurring: {
                        enabled: boolean;
                        frequency: string;
                        interval: number;
                        endDate: string;
                };
                sendAt?: string;
                repeat?: {
                        enabled: boolean;
                        frequency: 'daily' | 'hourly' | 'weekly' | 'monthly';
                        interval: number;
                        endDate?: string;
                };
        };
        settings: {
                enableTracking: boolean;
                enableUnsubscribe: boolean;
                priority: string;
                maxRetries: number;
                retryDelay: number;
                testMode: boolean;
                throttling: {
                        enabled: boolean;
                        messagesPerHour: number;
                        messagesPerDay: number;
                };
                tracking: {
                        enabled: boolean;
                        openTracking: boolean;
                        clickTracking: boolean;
                };
        };
}

const CampaignEditor: React.FC<CampaignEditorProps> = ({
        campaign,
        isOpen,
        onClose,
        onSave,
        loading = false,
        mode = 'create',
        templates = []
}) => {
        const [activeTab, setActiveTab] = useState('basic');
        const [formData, setFormData] = useState({
                name: campaign?.name || '',
                description: campaign?.description || '',
                type: (campaign?.type || 'immediate') as 'immediate' | 'scheduled' | 'triggered',
                channels: {
                        inApp: campaign?.channels?.inApp || false,
                        email: campaign?.channels?.email || false,
                        sms: campaign?.channels?.sms || false,
                        push: campaign?.channels?.push || false,
                },
                templateId: campaign?.template?._id || '',
                customContent: {
                        subject: campaign?.customContent?.subject || '',
                        text: campaign?.customContent?.text || '',
                        html: campaign?.customContent?.html || '',
                },
                targetAudience: {
                        type: campaign?.audience?.type || 'all',
                        criteria: campaign?.audience?.criteria || {},
                        segments: [] as string[],
                        tags: [] as string[],
                        total: campaign?.audience?.estimatedReach || 0,
                },
                schedule: {
                        type: campaign?.type || 'immediate',
                        startDate: campaign?.scheduling?.sendAt || '',
                        endDate: '',
                        timezone: campaign?.scheduling?.timezone || 'Asia/Tehran',
                        recurring: {
                                enabled: campaign?.scheduling?.repeat?.enabled || false,
                                frequency: campaign?.scheduling?.repeat?.frequency || 'daily',
                                interval: campaign?.scheduling?.repeat?.interval || 1,
                                endDate: campaign?.scheduling?.repeat?.endDate || '',
                        },
                },
                settings: {
                        priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
                        throttling: {
                                enabled: false,
                                rateLimit: 100,
                                window: 3600,
                        },
                        tracking: {
                                enabled: true,
                                openTracking: true,
                                clickTracking: true,
                        },
                },
        });

        // Initialize form data when campaign or mode changes
        useEffect(() => {
                if (mode === 'edit' && campaign) {
                        setFormData({
                                name: campaign.name || '',
                                description: campaign.description || '',
                                type: (campaign.type || 'immediate') as 'immediate' | 'scheduled' | 'triggered',
                                channels: {
                                        inApp: campaign.channels?.inApp || false,
                                        email: campaign.channels?.email || false,
                                        sms: campaign.channels?.sms || false,
                                        push: campaign.channels?.push || false,
                                },
                                templateId: campaign.template?._id || '',
                                customContent: {
                                        subject: campaign.customContent?.subject || '',
                                        text: campaign.customContent?.text || '',
                                        html: campaign.customContent?.html || '',
                                },
                                targetAudience: {
                                        type: campaign.audience?.type || 'all',
                                        criteria: campaign.audience?.criteria || {},
                                        segments: [] as string[],
                                        tags: [] as string[],
                                        total: campaign.audience?.estimatedReach || 0,
                                },
                                schedule: {
                                        type: campaign.type || 'immediate',
                                        startDate: campaign.scheduling?.sendAt || '',
                                        endDate: '',
                                        timezone: campaign.scheduling?.timezone || 'Asia/Tehran',
                                        recurring: {
                                                enabled: campaign.scheduling?.repeat?.enabled || false,
                                                frequency: campaign.scheduling?.repeat?.frequency || 'daily',
                                                interval: campaign.scheduling?.repeat?.interval || 1,
                                                endDate: campaign.scheduling?.repeat?.endDate || '',
                                        },
                                },
                                settings: {
                                        priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
                                        throttling: {
                                                enabled: false,
                                                rateLimit: 100,
                                                window: 3600,
                                        },
                                        tracking: {
                                                enabled: true,
                                                openTracking: true,
                                                clickTracking: true,
                                        },
                                },
                        });
                }
        }, [campaign, mode]);

        // Update handlers
        const handleBasicChange = (field: string, value: any) => {
                setFormData(prev => ({
                        ...prev,
                        [field]: value
                }));
        };

        const handleNestedChange = (section: keyof typeof formData, field: string, value: any) => {
                setFormData(prev => {
                        const currentSection = prev[section];
                        if (typeof currentSection === 'object' && currentSection !== null) {
                                return {
                                        ...prev,
                                        [section]: {
                                                ...currentSection,
                                                [field]: value
                                        }
                                };
                        }
                        return prev;
                });
        };

        const handleDeepNestedChange = (section: keyof typeof formData, subsection: string, field: string, value: any) => {
                setFormData(prev => {
                        const currentSection = prev[section];
                        if (typeof currentSection === 'object' && currentSection !== null) {
                                const currentSubsection = (currentSection as any)[subsection];
                                if (typeof currentSubsection === 'object' && currentSubsection !== null) {
                                        return {
                                                ...prev,
                                                [section]: {
                                                        ...currentSection,
                                                        [subsection]: {
                                                                ...currentSubsection,
                                                                [field]: value
                                                        }
                                                }
                                        };
                                }
                        }
                        return prev;
                });
        };

        // Channel management
        const toggleChannel = (channel: keyof typeof formData.channels) => {
                setFormData(prev => ({
                        ...prev,
                        channels: {
                                ...prev.channels,
                                [channel]: !prev.channels[channel]
                        }
                }));
        };

        // Tag management
        const addTag = (tag: string) => {
                if (tag && !formData.targetAudience.tags.includes(tag)) {
                        handleNestedChange('targetAudience', 'tags', [...formData.targetAudience.tags, tag]);
                }
        };

        const handleRemoveTag = (tag: string) => {
                handleNestedChange('targetAudience', 'tags', formData.targetAudience.tags.filter(t => t !== tag));
        };

        // Form submission
        const handleSubmit = async (e: React.FormEvent) => {
                e.preventDefault();

                // Basic validation
                if (!formData.name.trim()) {
                        toast.error('نام کمپین الزامی است');
                        return;
                }

                if (Object.values(formData.channels).every(enabled => !enabled)) {
                        toast.error('حداقل یک کانال باید انتخاب شود');
                        return;
                }

                try {
                        // Transform formData to match NotificationCampaign interface
                        const campaignData: Partial<NotificationCampaign> = {
                                name: formData.name,
                                description: formData.description,
                                type: formData.type,
                                channels: formData.channels,
                                template: {
                                        _id: formData.templateId
                                } as NotificationTemplate,
                                customContent: formData.customContent,
                                audience: {
                                        type: formData.targetAudience.type as 'all' | 'segment' | 'specific',
                                        criteria: formData.targetAudience.criteria,
                                        userIds: [],
                                        estimatedReach: formData.targetAudience.total
                                },
                                scheduling: {
                                        sendAt: formData.schedule.startDate,
                                        timezone: formData.schedule.timezone,
                                        repeat: formData.schedule.recurring.enabled ? {
                                                enabled: formData.schedule.recurring.enabled,
                                                frequency: formData.schedule.recurring.frequency as 'hourly' | 'daily' | 'weekly' | 'monthly',
                                                interval: formData.schedule.recurring.interval,
                                                endDate: formData.schedule.recurring.endDate
                                        } : undefined
                                }
                        };

                        await onSave(campaignData);
                } catch (error: any) {
                        toast.error(error.message || 'خطا در ذخیره کمپین');
                }
        };

        // Validate form
        const isFormValid = () => {
                const hasEnabledChannel = Object.values(formData.channels).some(enabled => enabled);
                return formData.name.trim() &&
                        hasEnabledChannel &&
                        (formData.templateId || formData.customContent.text);
        };

        const tabs = [
                { id: 'basic', label: 'اطلاعات پایه', icon: '📋' },
                { id: 'content', label: 'محتوا', icon: '📝' },
                { id: 'audience', label: 'مخاطبان', icon: '👥' },
                { id: 'schedule', label: 'زمان‌بندی', icon: '⏰' },
                { id: 'settings', label: 'تنظیمات', icon: '⚙️' }
        ];

        if (!isOpen) return null;

        return (
                <Modal
                        isOpen={isOpen}
                        onClose={onClose}
                        title={mode === 'create' ? 'ایجاد کمپین جدید' : 'ویرایش کمپین'}
                        size="large"
                >
                        <div className="space-y-6 max-h-[80vh] overflow-y-auto">
                                {/* Tabs */}
                                <div className="border-b border-gray-200">
                                        <nav className="flex space-x-8 space-x-reverse" aria-label="Tabs">
                                                {tabs.map((tab) => (
                                                        <button
                                                                key={tab.id}
                                                                onClick={() => setActiveTab(tab.id)}
                                                                className={`
                                                                        py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200
                                                                        ${activeTab === tab.id
                                                                                ? 'border-blue-500 text-blue-600'
                                                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                                        }
                                                                `}
                                                        >
                                                                <span className="ml-2">{tab.icon}</span>
                                                                {tab.label}
                                                        </button>
                                                ))}
                                        </nav>
                                </div>

                                {/* Tab Content */}
                                <div className="min-h-[400px]">
                                        {/* Basic Info Tab */}
                                        {activeTab === 'basic' && (
                                                <div className="space-y-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                {/* Campaign Name */}
                                                                <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                                نام کمپین *
                                                                        </label>
                                                                        <input
                                                                                type="text"
                                                                                value={formData.name}
                                                                                onChange={(e) => handleBasicChange('name', e.target.value)}
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                placeholder="نام کمپین را وارد کنید"
                                                                        />
                                                                </div>

                                                                {/* Campaign Type */}
                                                                <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                                نوع کمپین
                                                                        </label>
                                                                        <select
                                                                                value={formData.type}
                                                                                onChange={(e) => handleBasicChange('type', e.target.value as FormData['type'])}
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                        >
                                                                                <option value="immediate">فوری</option>
                                                                                <option value="scheduled">زمان‌بندی شده</option>
                                                                                <option value="triggered">شرطی</option>
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
                                                                        onChange={(e) => handleBasicChange('description', e.target.value)}
                                                                        rows={3}
                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                        placeholder="توضیحات کمپین را وارد کنید"
                                                                />
                                                        </div>

                                                        {/* Channels */}
                                                        <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                                                        کانال‌های ارسال *
                                                                </label>
                                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                                        {[
                                                                                { id: 'email' as const, label: 'ایمیل', icon: '📧' },
                                                                                { id: 'sms' as const, label: 'پیامک', icon: '📱' },
                                                                                { id: 'push' as const, label: 'اعلان فوری', icon: '🔔' },
                                                                                { id: 'inApp' as const, label: 'درون اپلیکیشن', icon: '📲' }
                                                                        ].map((channel) => (
                                                                                <label key={channel.id} className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                                                                        <input
                                                                                                type="checkbox"
                                                                                                checked={formData.channels[channel.id]}
                                                                                                onChange={() => toggleChannel(channel.id)}
                                                                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                                                                        />
                                                                                        <span className="mr-3 text-lg">{channel.icon}</span>
                                                                                        <span className="text-sm font-medium text-gray-700">{channel.label}</span>
                                                                                </label>
                                                                        ))}
                                                                </div>
                                                        </div>
                                                </div>
                                        )}

                                        {/* Content Tab */}
                                        {activeTab === 'content' && (
                                                <div className="space-y-6">
                                                        {/* Template Selection */}
                                                        <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                        انتخاب قالب
                                                                </label>
                                                                <select
                                                                        value={formData.templateId}
                                                                        onChange={(e) => handleBasicChange('templateId', e.target.value)}
                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                >
                                                                        <option value="">محتوای سفارشی</option>
                                                                        {templates.map((template) => (
                                                                                <option key={template._id} value={template._id}>
                                                                                        {template.name} ({template.type})
                                                                                </option>
                                                                        ))}
                                                                </select>
                                                        </div>

                                                        {/* Custom Content */}
                                                        {!formData.templateId && (
                                                                <div className="space-y-4">
                                                                        {/* Subject */}
                                                                        {formData.channels.email && (
                                                                                <div>
                                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                                                موضوع (برای ایمیل)
                                                                                        </label>
                                                                                        <input
                                                                                                type="text"
                                                                                                value={formData.customContent.subject}
                                                                                                onChange={(e) => handleDeepNestedChange('customContent', 'subject', 'subject', e.target.value)}
                                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                                placeholder="موضوع ایمیل را وارد کنید"
                                                                                        />
                                                                                </div>
                                                                        )}

                                                                        {/* Text Content */}
                                                                        <div>
                                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                                        متن پیام *
                                                                                </label>
                                                                                <textarea
                                                                                        value={formData.customContent.text}
                                                                                        onChange={(e) => handleDeepNestedChange('customContent', 'text', 'text', e.target.value)}
                                                                                        rows={6}
                                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                        placeholder="متن پیام را وارد کنید"
                                                                                />
                                                                        </div>

                                                                        {/* HTML Content */}
                                                                        {formData.channels.email && (
                                                                                <div>
                                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                                                محتوای HTML (اختیاری)
                                                                                        </label>
                                                                                        <textarea
                                                                                                value={formData.customContent.html}
                                                                                                onChange={(e) => handleDeepNestedChange('customContent', 'html', 'html', e.target.value)}
                                                                                                rows={8}
                                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                                                                                                placeholder="کد HTML را وارد کنید"
                                                                                        />
                                                                                </div>
                                                                        )}
                                                                </div>
                                                        )}
                                                </div>
                                        )}

                                        {/* Audience Tab */}
                                        {activeTab === 'audience' && (
                                                <div className="space-y-6">
                                                        {/* Audience Type */}
                                                        <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                                                        نوع مخاطبان
                                                                </label>
                                                                <div className="space-y-3">
                                                                        {[
                                                                                { id: 'all', label: 'همه کاربران' },
                                                                                { id: 'segments', label: 'بخش‌های خاص' },
                                                                                { id: 'custom', label: 'فیلتر سفارشی' }
                                                                        ].map((type) => (
                                                                                <label key={type.id} className="flex items-center">
                                                                                        <input
                                                                                                type="radio"
                                                                                                name="audienceType"
                                                                                                value={type.id}
                                                                                                checked={formData.targetAudience.type === type.id}
                                                                                                onChange={(e) => handleNestedChange('targetAudience', 'type', e.target.value)}
                                                                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                                                                                        />
                                                                                        <span className="mr-3 text-sm font-medium text-gray-700">{type.label}</span>
                                                                                </label>
                                                                        ))}
                                                                </div>
                                                        </div>

                                                        {/* Tags */}
                                                        <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                        برچسب‌ها
                                                                </label>
                                                                <div className="flex items-center space-x-2 space-x-reverse mb-2">
                                                                        <input
                                                                                type="text"
                                                                                onKeyPress={(e) => {
                                                                                        if (e.key === 'Enter') {
                                                                                                e.preventDefault();
                                                                                                addTag((e.target as HTMLInputElement).value);
                                                                                                (e.target as HTMLInputElement).value = '';
                                                                                        }
                                                                                }}
                                                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                placeholder="برچسب جدید... (Enter برای افزودن)"
                                                                        />
                                                                </div>
                                                                <div className="flex flex-wrap gap-2">
                                                                        {formData.targetAudience.tags.map((tag) => (
                                                                                <span
                                                                                        key={tag}
                                                                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                                                                                >
                                                                                        {tag}
                                                                                        <button
                                                                                                onClick={() => handleRemoveTag(tag)}
                                                                                                className="mr-2 text-blue-600 hover:text-blue-800"
                                                                                        >
                                                                                                ×
                                                                                        </button>
                                                                                </span>
                                                                        ))}
                                                                </div>
                                                        </div>

                                                        {/* Estimated Audience */}
                                                        <div className="bg-blue-50 p-4 rounded-lg">
                                                                <div className="flex items-center justify-between">
                                                                        <span className="text-sm font-medium text-blue-900">تخمین مخاطبان</span>
                                                                        <span className="text-2xl font-bold text-blue-600">{formData.targetAudience.total.toLocaleString()} نفر</span>
                                                                </div>
                                                        </div>
                                                </div>
                                        )}

                                        {/* Schedule Tab */}
                                        {activeTab === 'schedule' && (
                                                <div className="space-y-6">
                                                        {/* Schedule Type */}
                                                        <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                                                        نوع زمان‌بندی
                                                                </label>
                                                                <div className="space-y-3">
                                                                        {[
                                                                                { id: 'immediate', label: 'ارسال فوری' },
                                                                                { id: 'scheduled', label: 'زمان‌بندی شده' },
                                                                                { id: 'recurring', label: 'تکراری' }
                                                                        ].map((type) => (
                                                                                <label key={type.id} className="flex items-center">
                                                                                        <input
                                                                                                type="radio"
                                                                                                name="scheduleType"
                                                                                                value={type.id}
                                                                                                checked={formData.schedule.type === type.id}
                                                                                                onChange={(e) => handleNestedChange('schedule', 'type', e.target.value)}
                                                                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                                                                                        />
                                                                                        <span className="mr-3 text-sm font-medium text-gray-700">{type.label}</span>
                                                                                </label>
                                                                        ))}
                                                                </div>
                                                        </div>

                                                        {/* Scheduled Date */}
                                                        {formData.type === 'scheduled' && (
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                        <div>
                                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                                        تاریخ شروع
                                                                                </label>
                                                                                <input
                                                                                        type="datetime-local"
                                                                                        value={formData.schedule.startDate}
                                                                                        onChange={(e) => handleNestedChange('schedule', 'startDate', e.target.value)}
                                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                />
                                                                        </div>
                                                                        <div>
                                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                                        تاریخ پایان (اختیاری)
                                                                                </label>
                                                                                <input
                                                                                        type="datetime-local"
                                                                                        value={formData.schedule.endDate}
                                                                                        onChange={(e) => handleNestedChange('schedule', 'endDate', e.target.value)}
                                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                />
                                                                        </div>
                                                                </div>
                                                        )}

                                                        {/* Recurring Settings */}
                                                        {formData.schedule.recurring.enabled && (
                                                                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                                                                        <h4 className="font-medium text-gray-900">تنظیمات تکرار</h4>

                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                                <div>
                                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                                                فرکانس
                                                                                        </label>
                                                                                        <select
                                                                                                value={formData.schedule.recurring.frequency}
                                                                                                onChange={(e) => handleDeepNestedChange('schedule', 'recurring', 'frequency', e.target.value)}
                                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                        >
                                                                                                <option value="daily">روزانه</option>
                                                                                                <option value="weekly">هفتگی</option>
                                                                                                <option value="monthly">ماهانه</option>
                                                                                        </select>
                                                                                </div>
                                                                                <div>
                                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                                                فاصله (روز)
                                                                                        </label>
                                                                                        <input
                                                                                                type="number"
                                                                                                min="1"
                                                                                                value={formData.schedule.recurring.interval}
                                                                                                onChange={(e) => handleDeepNestedChange('schedule', 'recurring', 'interval', parseInt(e.target.value))}
                                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                        />
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                        )}
                                                </div>
                                        )}

                                        {/* Settings Tab */}
                                        {activeTab === 'settings' && (
                                                <div className="space-y-6">
                                                        {/* Basic Settings */}
                                                        <div className="space-y-4">
                                                                <div className="flex items-center justify-between">
                                                                        <div>
                                                                                <h4 className="font-medium text-gray-900">ردیابی فعالیت</h4>
                                                                                <p className="text-sm text-gray-500">ردیابی بازدید و کلیک</p>
                                                                        </div>
                                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                                                <input
                                                                                        type="checkbox"
                                                                                        checked={formData.settings.tracking.enabled}
                                                                                        onChange={(e) => handleDeepNestedChange('settings', 'tracking', 'enabled', e.target.checked)}
                                                                                        className="sr-only peer"
                                                                                />
                                                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                                        </label>
                                                                </div>

                                                                <div className="flex items-center justify-between">
                                                                        <div>
                                                                                <h4 className="font-medium text-gray-900">ردیابی کلیک</h4>
                                                                                <p className="text-sm text-gray-500">ردیابی کلیک روی لینک‌ها</p>
                                                                        </div>
                                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                                                <input
                                                                                        type="checkbox"
                                                                                        checked={formData.settings.tracking.clickTracking}
                                                                                        onChange={(e) => handleDeepNestedChange('settings', 'tracking', 'clickTracking', e.target.checked)}
                                                                                        className="sr-only peer"
                                                                                />
                                                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                                        </label>
                                                                </div>
                                                        </div>

                                                        {/* Priority */}
                                                        <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                        اولویت
                                                                </label>
                                                                <select
                                                                        value={formData.settings.priority}
                                                                        onChange={(e) => handleNestedChange('settings', 'priority', e.target.value)}
                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                >
                                                                        <option value="low">پایین</option>
                                                                        <option value="normal">عادی</option>
                                                                        <option value="high">بالا</option>
                                                                        <option value="urgent">فوری</option>
                                                                </select>
                                                        </div>

                                                        {/* Throttling */}
                                                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                                                                <div className="flex items-center justify-between">
                                                                        <h4 className="font-medium text-gray-900">محدودیت ارسال</h4>
                                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                                                <input
                                                                                        type="checkbox"
                                                                                        checked={formData.settings.throttling?.enabled || false}
                                                                                        onChange={(e) => handleDeepNestedChange('settings', 'throttling', 'enabled', e.target.checked)}
                                                                                        className="sr-only peer"
                                                                                />
                                                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                                        </label>
                                                                </div>

                                                                {formData.settings.throttling?.enabled && (
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                                <div>
                                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                                                حد سرعت
                                                                                        </label>
                                                                                        <input
                                                                                                type="number"
                                                                                                min="1"
                                                                                                value={formData.settings.throttling?.rateLimit || 100}
                                                                                                onChange={(e) => handleDeepNestedChange('settings', 'throttling', 'rateLimit', parseInt(e.target.value))}
                                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                        />
                                                                                </div>
                                                                                <div>
                                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                                                پنجره زمانی (ثانیه)
                                                                                        </label>
                                                                                        <input
                                                                                                type="number"
                                                                                                min="1"
                                                                                                value={formData.settings.throttling?.window || 3600}
                                                                                                onChange={(e) => handleDeepNestedChange('settings', 'throttling', 'window', parseInt(e.target.value))}
                                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                        />
                                                                                </div>
                                                                        </div>
                                                                )}
                                                        </div>
                                                </div>
                                        )}
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
                                                        {mode === 'create' ? 'ایجاد کمپین' : 'ذخیره تغییرات'}
                                                </button>
                                        </div>
                                </div>
                        </div>
                </Modal>
        );
};

export default CampaignEditor; 