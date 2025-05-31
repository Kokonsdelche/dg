import React, { useState, useEffect } from 'react';
import { useAdminNotifications } from '../../hooks/useAdminNotifications';
import LoadingSpinner from '../common/LoadingSpinner';

interface TestResult {
        id: string;
        type: 'email' | 'sms' | 'push';
        recipient: string;
        subject?: string;
        content: string;
        status: 'success' | 'failed' | 'pending';
        sentAt: Date;
        deliveredAt?: Date;
        error?: string;
        details: {
                provider?: string;
                messageId?: string;
                cost?: number;
                deliveryTime?: number;
        };
}

interface TestTemplate {
        id: string;
        name: string;
        type: 'email' | 'sms' | 'push';
        subject?: string;
        content: string;
        variables: string[];
}

const TestingTools: React.FC = () => {
        const { loading } = useAdminNotifications();

        const [activeTab, setActiveTab] = useState<'single' | 'bulk' | 'templates' | 'history'>('single');
        const [testType, setTestType] = useState<'email' | 'sms' | 'push'>('email');
        const [testing, setTesting] = useState(false);
        const [testResults, setTestResults] = useState<TestResult[]>([]);

        // Single test form
        const [singleTest, setSingleTest] = useState({
                recipient: '',
                subject: '',
                content: '',
                priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
                useTemplate: false,
                selectedTemplate: '',
                variables: {} as Record<string, string>
        });

        // Bulk test form
        const [bulkTest, setBulkTest] = useState({
                recipients: '',
                subject: '',
                content: '',
                batchSize: 50,
                delay: 1000
        });

        // Test templates
        const [testTemplates] = useState<TestTemplate[]>([
                {
                        id: 'email-welcome',
                        name: 'خوش‌آمدگویی ایمیل',
                        type: 'email',
                        subject: 'خوش آمدید {{name}}!',
                        content: 'سلام {{name}}، به فروشگاه ما خوش آمدید. کد تخفیف شما: {{code}}',
                        variables: ['name', 'code']
                },
                {
                        id: 'sms-order',
                        name: 'تایید سفارش پیامک',
                        type: 'sms',
                        content: 'سفارش {{orderNumber}} شما تایید شد. مبلغ: {{amount}} تومان. زمان تحویل: {{deliveryTime}}',
                        variables: ['orderNumber', 'amount', 'deliveryTime']
                },
                {
                        id: 'push-discount',
                        name: 'تخفیف ویژه Push',
                        type: 'push',
                        subject: 'تخفیف ۵۰٪!',
                        content: '{{name}} عزیز، تخفیف ویژه {{percentage}}٪ برای شما فعال است!',
                        variables: ['name', 'percentage']
                }
        ]);

        // Available recipients for testing
        const [testRecipients] = useState({
                email: [
                        'test@example.com',
                        'admin@example.com',
                        'demo@example.com'
                ],
                sms: [
                        '09123456789',
                        '09187654321',
                        '09361234567'
                ],
                push: [
                        'device_token_1',
                        'device_token_2',
                        'device_token_3'
                ]
        });

        // Single test submission
        const handleSingleTest = async () => {
                if (!singleTest.recipient || !singleTest.content) {
                        alert('لطفاً تمام فیلدهای ضروری را پر کنید');
                        return;
                }

                setTesting(true);

                try {
                        // Simulate API call
                        await new Promise(resolve => setTimeout(resolve, 2000));

                        const newResult: TestResult = {
                                id: `test-${Date.now()}`,
                                type: testType,
                                recipient: singleTest.recipient,
                                subject: singleTest.subject,
                                content: singleTest.content,
                                status: Math.random() > 0.2 ? 'success' : 'failed',
                                sentAt: new Date(),
                                deliveredAt: Math.random() > 0.2 ? new Date() : undefined,
                                error: Math.random() > 0.2 ? undefined : 'خطا در ارسال',
                                details: {
                                        provider: testType === 'email' ? 'Gmail SMTP' : testType === 'sms' ? 'کاوه‌نگار' : 'FCM',
                                        messageId: `msg_${Math.random().toString(36).substr(2, 9)}`,
                                        cost: testType === 'sms' ? 15 : 0,
                                        deliveryTime: Math.floor(Math.random() * 5000) + 500
                                }
                        };

                        setTestResults(prev => [newResult, ...prev]);

                        if (newResult.status === 'success') {
                                alert('تست با موفقیت ارسال شد!');
                        } else {
                                alert('خطا در ارسال تست!');
                        }

                } catch (error) {
                        alert('خطا در ارسال تست');
                } finally {
                        setTesting(false);
                }
        };

        // Bulk test submission
        const handleBulkTest = async () => {
                if (!bulkTest.recipients || !bulkTest.content) {
                        alert('لطفاً تمام فیلدهای ضروری را پر کنید');
                        return;
                }

                setTesting(true);

                try {
                        const recipients = bulkTest.recipients.split('\n').filter(r => r.trim());

                        // Simulate bulk sending
                        for (let i = 0; i < recipients.length; i++) {
                                await new Promise(resolve => setTimeout(resolve, bulkTest.delay));

                                const newResult: TestResult = {
                                        id: `bulk-test-${Date.now()}-${i}`,
                                        type: testType,
                                        recipient: recipients[i].trim(),
                                        subject: bulkTest.subject,
                                        content: bulkTest.content,
                                        status: Math.random() > 0.1 ? 'success' : 'failed',
                                        sentAt: new Date(),
                                        deliveredAt: Math.random() > 0.1 ? new Date() : undefined,
                                        error: Math.random() > 0.1 ? undefined : 'خطا در ارسال',
                                        details: {
                                                provider: testType === 'email' ? 'Gmail SMTP' : testType === 'sms' ? 'کاوه‌نگار' : 'FCM',
                                                messageId: `bulk_${Math.random().toString(36).substr(2, 9)}`,
                                                cost: testType === 'sms' ? 15 : 0,
                                                deliveryTime: Math.floor(Math.random() * 3000) + 200
                                        }
                                };

                                setTestResults(prev => [newResult, ...prev]);
                        }

                        alert(`ارسال انبوه به ${recipients.length} دریافت‌کننده تکمیل شد!`);

                } catch (error) {
                        alert('خطا در ارسال انبوه');
                } finally {
                        setTesting(false);
                }
        };

        // Load template
        const loadTemplate = (templateId: string) => {
                const template = testTemplates.find(t => t.id === templateId);
                if (template) {
                        setSingleTest(prev => ({
                                ...prev,
                                subject: template.subject || '',
                                content: template.content,
                                selectedTemplate: templateId,
                                useTemplate: true
                        }));
                }
        };

        // Replace template variables
        const replaceVariables = (text: string, variables: Record<string, string>) => {
                let result = text;
                Object.entries(variables).forEach(([key, value]) => {
                        result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
                });
                return result;
        };

        // Get filtered templates
        const filteredTemplates = testTemplates.filter(t => t.type === testType);

        if (loading) {
                return <LoadingSpinner />;
        }

        return (
                <div className="space-y-6">
                        {/* Header */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                        <div>
                                                <h1 className="text-2xl font-bold text-gray-900">ابزارهای تست</h1>
                                                <p className="text-sm text-gray-600 mt-1">
                                                        تست و بررسی عملکرد سیستم اطلاع‌رسانی
                                                </p>
                                        </div>

                                        <div className="flex items-center space-x-3 space-x-reverse">
                                                {/* Test Type Selector */}
                                                <div className="flex bg-gray-100 rounded-lg p-1">
                                                        {[
                                                                { key: 'email', label: 'ایمیل', icon: '📧' },
                                                                { key: 'sms', label: 'پیامک', icon: '📱' },
                                                                { key: 'push', label: 'Push', icon: '🔔' }
                                                        ].map(type => (
                                                                <button
                                                                        key={type.key}
                                                                        onClick={() => setTestType(type.key as any)}
                                                                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${testType === type.key
                                                                                        ? 'bg-white text-blue-600 shadow-sm'
                                                                                        : 'text-gray-600 hover:text-gray-900'
                                                                                }`}
                                                                >
                                                                        {type.icon} {type.label}
                                                                </button>
                                                        ))}
                                                </div>
                                        </div>
                                </div>
                        </div>

                        {/* Main Interface */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                {/* Tabs */}
                                <div className="border-b border-gray-200">
                                        <nav className="flex space-x-8 space-x-reverse px-6">
                                                {[
                                                        { id: 'single', name: 'تست تکی' },
                                                        { id: 'bulk', name: 'تست انبوه' },
                                                        { id: 'templates', name: 'قالب‌های تست' },
                                                        { id: 'history', name: 'تاریخچه تست‌ها' }
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
                                        {/* Single Test Tab */}
                                        {activeTab === 'single' && (
                                                <div className="space-y-6">
                                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                                {/* Test Form */}
                                                                <div className="space-y-4">
                                                                        <h3 className="text-lg font-medium text-gray-900">تست {testType === 'email' ? 'ایمیل' : testType === 'sms' ? 'پیامک' : 'Push'}</h3>

                                                                        {/* Template Selection */}
                                                                        <div>
                                                                                <label className="flex items-center mb-2">
                                                                                        <input
                                                                                                type="checkbox"
                                                                                                checked={singleTest.useTemplate}
                                                                                                onChange={(e) => setSingleTest(prev => ({ ...prev, useTemplate: e.target.checked }))}
                                                                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                                                                        />
                                                                                        <span className="mr-2 text-sm text-gray-700">استفاده از قالب</span>
                                                                                </label>

                                                                                {singleTest.useTemplate && (
                                                                                        <select
                                                                                                value={singleTest.selectedTemplate}
                                                                                                onChange={(e) => loadTemplate(e.target.value)}
                                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                        >
                                                                                                <option value="">انتخاب قالب...</option>
                                                                                                {filteredTemplates.map(template => (
                                                                                                        <option key={template.id} value={template.id}>
                                                                                                                {template.name}
                                                                                                        </option>
                                                                                                ))}
                                                                                        </select>
                                                                                )}
                                                                        </div>

                                                                        {/* Recipient */}
                                                                        <div>
                                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                                        {testType === 'email' ? 'ایمیل دریافت‌کننده' :
                                                                                                testType === 'sms' ? 'شماره موبایل' : 'شناسه دستگاه'}
                                                                                </label>
                                                                                <div className="flex space-x-2 space-x-reverse">
                                                                                        <input
                                                                                                type={testType === 'email' ? 'email' : 'text'}
                                                                                                value={singleTest.recipient}
                                                                                                onChange={(e) => setSingleTest(prev => ({ ...prev, recipient: e.target.value }))}
                                                                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                                placeholder={testType === 'email' ? 'test@example.com' :
                                                                                                        testType === 'sms' ? '09123456789' : 'device_token'}
                                                                                        />
                                                                                        <select
                                                                                                onChange={(e) => setSingleTest(prev => ({ ...prev, recipient: e.target.value }))}
                                                                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                        >
                                                                                                <option value="">انتخاب سریع</option>
                                                                                                {testRecipients[testType].map((recipient, index) => (
                                                                                                        <option key={index} value={recipient}>
                                                                                                                {recipient}
                                                                                                        </option>
                                                                                                ))}
                                                                                        </select>
                                                                                </div>
                                                                        </div>

                                                                        {/* Subject (Email/Push only) */}
                                                                        {(testType === 'email' || testType === 'push') && (
                                                                                <div>
                                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">موضوع</label>
                                                                                        <input
                                                                                                type="text"
                                                                                                value={singleTest.subject}
                                                                                                onChange={(e) => setSingleTest(prev => ({ ...prev, subject: e.target.value }))}
                                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                                placeholder="موضوع پیام"
                                                                                        />
                                                                                </div>
                                                                        )}

                                                                        {/* Content */}
                                                                        <div>
                                                                                <label className="block text-sm font-medium text-gray-700 mb-2">محتوا</label>
                                                                                <textarea
                                                                                        value={singleTest.content}
                                                                                        onChange={(e) => setSingleTest(prev => ({ ...prev, content: e.target.value }))}
                                                                                        rows={testType === 'sms' ? 3 : 5}
                                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                        placeholder="محتوای پیام تست"
                                                                                />
                                                                                {testType === 'sms' && (
                                                                                        <p className="text-xs text-gray-500 mt-1">
                                                                                                طول محتوا: {singleTest.content.length} کاراکتر
                                                                                                {singleTest.content.length > 70 && ' (بیش از یک پیامک)'}
                                                                                        </p>
                                                                                )}
                                                                        </div>

                                                                        {/* Priority */}
                                                                        <div>
                                                                                <label className="block text-sm font-medium text-gray-700 mb-2">اولویت</label>
                                                                                <select
                                                                                        value={singleTest.priority}
                                                                                        onChange={(e) => setSingleTest(prev => ({ ...prev, priority: e.target.value as any }))}
                                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                >
                                                                                        <option value="low">پایین</option>
                                                                                        <option value="normal">معمولی</option>
                                                                                        <option value="high">بالا</option>
                                                                                        <option value="urgent">فوری</option>
                                                                                </select>
                                                                        </div>

                                                                        {/* Template Variables */}
                                                                        {singleTest.useTemplate && singleTest.selectedTemplate && (
                                                                                <div>
                                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">متغیرهای قالب</label>
                                                                                        {filteredTemplates.find(t => t.id === singleTest.selectedTemplate)?.variables.map(variable => (
                                                                                                <div key={variable} className="mb-2">
                                                                                                        <input
                                                                                                                type="text"
                                                                                                                placeholder={`مقدار ${variable}`}
                                                                                                                value={singleTest.variables[variable] || ''}
                                                                                                                onChange={(e) => setSingleTest(prev => ({
                                                                                                                        ...prev,
                                                                                                                        variables: { ...prev.variables, [variable]: e.target.value }
                                                                                                                }))}
                                                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                                        />
                                                                                                </div>
                                                                                        ))}
                                                                                </div>
                                                                        )}

                                                                        {/* Send Button */}
                                                                        <button
                                                                                onClick={handleSingleTest}
                                                                                disabled={testing || !singleTest.recipient || !singleTest.content}
                                                                                className={`w-full px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${testing || !singleTest.recipient || !singleTest.content
                                                                                                ? 'bg-gray-400 cursor-not-allowed'
                                                                                                : 'bg-blue-600 hover:bg-blue-700'
                                                                                        }`}
                                                                        >
                                                                                {testing ? 'در حال ارسال...' : 'ارسال تست'}
                                                                        </button>
                                                                </div>

                                                                {/* Preview */}
                                                                <div className="bg-gray-50 rounded-lg p-4">
                                                                        <h4 className="text-sm font-medium text-gray-900 mb-3">پیش‌نمایش</h4>
                                                                        <div className="bg-white rounded border p-4">
                                                                                {(testType === 'email' || testType === 'push') && singleTest.subject && (
                                                                                        <div className="mb-2">
                                                                                                <strong>موضوع:</strong> {singleTest.useTemplate
                                                                                                        ? replaceVariables(singleTest.subject, singleTest.variables)
                                                                                                        : singleTest.subject
                                                                                                }
                                                                                        </div>
                                                                                )}
                                                                                <div>
                                                                                        <strong>محتوا:</strong>
                                                                                        <div className="mt-1 text-gray-700">
                                                                                                {singleTest.useTemplate
                                                                                                        ? replaceVariables(singleTest.content, singleTest.variables)
                                                                                                        : singleTest.content || 'محتوای پیام...'
                                                                                                }
                                                                                        </div>
                                                                                </div>
                                                                                {testType === 'sms' && (
                                                                                        <div className="mt-2 text-xs text-gray-500">
                                                                                                تعداد پیامک مورد نیاز: {Math.ceil((singleTest.useTemplate
                                                                                                        ? replaceVariables(singleTest.content, singleTest.variables)
                                                                                                        : singleTest.content).length / 70) || 1}
                                                                                        </div>
                                                                                )}
                                                                        </div>
                                                                </div>
                                                        </div>
                                                </div>
                                        )}

                                        {/* Bulk Test Tab */}
                                        {activeTab === 'bulk' && (
                                                <div className="space-y-6">
                                                        <h3 className="text-lg font-medium text-gray-900">تست انبوه {testType === 'email' ? 'ایمیل' : testType === 'sms' ? 'پیامک' : 'Push'}</h3>

                                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                                <div className="space-y-4">
                                                                        {/* Recipients */}
                                                                        <div>
                                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                                        لیست دریافت‌کنندگان (هر خط یک دریافت‌کننده)
                                                                                </label>
                                                                                <textarea
                                                                                        value={bulkTest.recipients}
                                                                                        onChange={(e) => setBulkTest(prev => ({ ...prev, recipients: e.target.value }))}
                                                                                        rows={6}
                                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                        placeholder={testType === 'email'
                                                                                                ? 'test1@example.com\ntest2@example.com\ntest3@example.com'
                                                                                                : testType === 'sms'
                                                                                                        ? '09123456789\n09187654321\n09361234567'
                                                                                                        : 'device_token_1\ndevice_token_2\ndevice_token_3'
                                                                                        }
                                                                                />
                                                                                <p className="text-xs text-gray-500 mt-1">
                                                                                        تعداد دریافت‌کنندگان: {bulkTest.recipients.split('\n').filter(r => r.trim()).length}
                                                                                </p>
                                                                        </div>

                                                                        {/* Subject */}
                                                                        {(testType === 'email' || testType === 'push') && (
                                                                                <div>
                                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">موضوع</label>
                                                                                        <input
                                                                                                type="text"
                                                                                                value={bulkTest.subject}
                                                                                                onChange={(e) => setBulkTest(prev => ({ ...prev, subject: e.target.value }))}
                                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                                placeholder="موضوع پیام انبوه"
                                                                                        />
                                                                                </div>
                                                                        )}

                                                                        {/* Content */}
                                                                        <div>
                                                                                <label className="block text-sm font-medium text-gray-700 mb-2">محتوا</label>
                                                                                <textarea
                                                                                        value={bulkTest.content}
                                                                                        onChange={(e) => setBulkTest(prev => ({ ...prev, content: e.target.value }))}
                                                                                        rows={4}
                                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                        placeholder="محتوای پیام تست انبوه"
                                                                                />
                                                                        </div>

                                                                        {/* Batch Settings */}
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                                <div>
                                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">اندازه دسته</label>
                                                                                        <input
                                                                                                type="number"
                                                                                                min="1"
                                                                                                max="500"
                                                                                                value={bulkTest.batchSize}
                                                                                                onChange={(e) => setBulkTest(prev => ({ ...prev, batchSize: parseInt(e.target.value) }))}
                                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                        />
                                                                                </div>
                                                                                <div>
                                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">تاخیر (میلی‌ثانیه)</label>
                                                                                        <input
                                                                                                type="number"
                                                                                                min="100"
                                                                                                max="10000"
                                                                                                step="100"
                                                                                                value={bulkTest.delay}
                                                                                                onChange={(e) => setBulkTest(prev => ({ ...prev, delay: parseInt(e.target.value) }))}
                                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                        />
                                                                                </div>
                                                                        </div>

                                                                        {/* Send Button */}
                                                                        <button
                                                                                onClick={handleBulkTest}
                                                                                disabled={testing || !bulkTest.recipients || !bulkTest.content}
                                                                                className={`w-full px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${testing || !bulkTest.recipients || !bulkTest.content
                                                                                                ? 'bg-gray-400 cursor-not-allowed'
                                                                                                : 'bg-blue-600 hover:bg-blue-700'
                                                                                        }`}
                                                                        >
                                                                                {testing ? 'در حال ارسال انبوه...' : 'شروع ارسال انبوه'}
                                                                        </button>
                                                                </div>

                                                                <div className="bg-gray-50 rounded-lg p-4">
                                                                        <h4 className="text-sm font-medium text-gray-900 mb-3">تنظیمات ارسال</h4>
                                                                        <div className="space-y-3 text-sm text-gray-600">
                                                                                <div>
                                                                                        <strong>تعداد دریافت‌کنندگان:</strong> {bulkTest.recipients.split('\n').filter(r => r.trim()).length}
                                                                                </div>
                                                                                <div>
                                                                                        <strong>اندازه هر دسته:</strong> {bulkTest.batchSize}
                                                                                </div>
                                                                                <div>
                                                                                        <strong>تاخیر بین ارسال:</strong> {bulkTest.delay} میلی‌ثانیه
                                                                                </div>
                                                                                <div>
                                                                                        <strong>زمان تخمینی:</strong> {Math.ceil(bulkTest.recipients.split('\n').filter(r => r.trim()).length * bulkTest.delay / 1000)} ثانیه
                                                                                </div>
                                                                                {testType === 'sms' && (
                                                                                        <div>
                                                                                                <strong>هزینه تخمینی:</strong> {bulkTest.recipients.split('\n').filter(r => r.trim()).length * 15} تومان
                                                                                        </div>
                                                                                )}
                                                                        </div>
                                                                </div>
                                                        </div>
                                                </div>
                                        )}

                                        {/* Templates Tab */}
                                        {activeTab === 'templates' && (
                                                <div className="space-y-6">
                                                        <h3 className="text-lg font-medium text-gray-900">قالب‌های تست</h3>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                {testTemplates.map(template => (
                                                                        <div
                                                                                key={template.id}
                                                                                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${template.type === testType
                                                                                                ? 'border-blue-500 bg-blue-50'
                                                                                                : 'border-gray-200 hover:border-gray-300'
                                                                                        }`}
                                                                                onClick={() => {
                                                                                        setTestType(template.type);
                                                                                        loadTemplate(template.id);
                                                                                        setActiveTab('single');
                                                                                }}
                                                                        >
                                                                                <div className="flex items-center justify-between mb-2">
                                                                                        <h4 className="font-medium text-gray-900">{template.name}</h4>
                                                                                        <span className={`px-2 py-1 text-xs rounded ${template.type === 'email' ? 'bg-blue-100 text-blue-800' :
                                                                                                        template.type === 'sms' ? 'bg-green-100 text-green-800' :
                                                                                                                'bg-purple-100 text-purple-800'
                                                                                                }`}>
                                                                                                {template.type === 'email' ? 'ایمیل' :
                                                                                                        template.type === 'sms' ? 'پیامک' : 'Push'}
                                                                                        </span>
                                                                                </div>

                                                                                {template.subject && (
                                                                                        <p className="text-xs text-gray-600 mb-1">
                                                                                                <strong>موضوع:</strong> {template.subject}
                                                                                        </p>
                                                                                )}

                                                                                <p className="text-xs text-gray-600 mb-2">
                                                                                        {template.content.substring(0, 80)}...
                                                                                </p>

                                                                                {template.variables.length > 0 && (
                                                                                        <div className="flex flex-wrap gap-1">
                                                                                                {template.variables.map(variable => (
                                                                                                        <span
                                                                                                                key={variable}
                                                                                                                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                                                                                                        >
                                                                                                                {variable}
                                                                                                        </span>
                                                                                                ))}
                                                                                        </div>
                                                                                )}
                                                                        </div>
                                                                ))}
                                                        </div>
                                                </div>
                                        )}

                                        {/* History Tab */}
                                        {activeTab === 'history' && (
                                                <div className="space-y-6">
                                                        <div className="flex items-center justify-between">
                                                                <h3 className="text-lg font-medium text-gray-900">تاریخچه تست‌ها</h3>
                                                                <button
                                                                        onClick={() => setTestResults([])}
                                                                        className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                                                                >
                                                                        پاک کردن تاریخچه
                                                                </button>
                                                        </div>

                                                        {testResults.length === 0 ? (
                                                                <div className="text-center py-8 text-gray-500">
                                                                        هیچ تستی انجام نشده است
                                                                </div>
                                                        ) : (
                                                                <div className="overflow-x-auto">
                                                                        <table className="min-w-full divide-y divide-gray-200">
                                                                                <thead className="bg-gray-50">
                                                                                        <tr>
                                                                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                                                        نوع
                                                                                                </th>
                                                                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                                                        دریافت‌کننده
                                                                                                </th>
                                                                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                                                        محتوا
                                                                                                </th>
                                                                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                                                        وضعیت
                                                                                                </th>
                                                                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                                                        زمان ارسال
                                                                                                </th>
                                                                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                                                        جزئیات
                                                                                                </th>
                                                                                        </tr>
                                                                                </thead>
                                                                                <tbody className="bg-white divide-y divide-gray-200">
                                                                                        {testResults.map((result) => (
                                                                                                <tr key={result.id} className="hover:bg-gray-50">
                                                                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                                                                <span className={`px-2 py-1 text-xs rounded ${result.type === 'email' ? 'bg-blue-100 text-blue-800' :
                                                                                                                                result.type === 'sms' ? 'bg-green-100 text-green-800' :
                                                                                                                                        'bg-purple-100 text-purple-800'
                                                                                                                        }`}>
                                                                                                                        {result.type === 'email' ? 'ایمیل' :
                                                                                                                                result.type === 'sms' ? 'پیامک' : 'Push'}
                                                                                                                </span>
                                                                                                        </td>
                                                                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                                                                {result.recipient}
                                                                                                        </td>
                                                                                                        <td className="px-6 py-4 text-sm text-gray-900">
                                                                                                                <div className="max-w-xs truncate">
                                                                                                                        {result.subject && <div className="font-medium">{result.subject}</div>}
                                                                                                                        {result.content}
                                                                                                                </div>
                                                                                                        </td>
                                                                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                                                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${result.status === 'success' ? 'bg-green-100 text-green-800' :
                                                                                                                                result.status === 'failed' ? 'bg-red-100 text-red-800' :
                                                                                                                                        'bg-yellow-100 text-yellow-800'
                                                                                                                        }`}>
                                                                                                                        {result.status === 'success' ? 'موفق' :
                                                                                                                                result.status === 'failed' ? 'ناموفق' : 'در انتظار'}
                                                                                                                </span>
                                                                                                        </td>
                                                                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                                                                {result.sentAt.toLocaleString('fa-IR')}
                                                                                                        </td>
                                                                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                                                                <div>
                                                                                                                        {result.details.provider && <div>ارائه‌دهنده: {result.details.provider}</div>}
                                                                                                                        {result.details.deliveryTime && <div>زمان تحویل: {result.details.deliveryTime}ms</div>}
                                                                                                                        {result.details.cost && <div>هزینه: {result.details.cost} تومان</div>}
                                                                                                                        {result.error && <div className="text-red-600">خطا: {result.error}</div>}
                                                                                                                </div>
                                                                                                        </td>
                                                                                                </tr>
                                                                                        ))}
                                                                                </tbody>
                                                                        </table>
                                                                </div>
                                                        )}
                                                </div>
                                        )}
                                </div>
                        </div>
                </div>
        );
};

export default TestingTools; 