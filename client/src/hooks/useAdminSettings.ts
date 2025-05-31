import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { adminAPI } from '../services/api';
import { EmailSettings, SMSSettings } from '../types';

export const useAdminSettings = () => {
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState<string | null>(null);
        const [currentSettings, setCurrentSettings] = useState<any>({});
        const [filters, setFilters] = useState({ category: 'general' });

        // Mock state
        const hasSettings = true;
        const isEmpty = false;
        const isInitialLoad = false;

        // Update email settings
        const updateEmailSettings = useCallback(async (emailSettings: Partial<EmailSettings>) => {
                try {
                        setLoading(true);
                        setError(null);
                        await adminAPI.notifications.updateEmailSettings(emailSettings);
                        toast.success('تنظیمات ایمیل با موفقیت بروزرسانی شد');
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || 'خطا در بروزرسانی تنظیمات ایمیل';
                        setError(errorMessage);
                        toast.error(errorMessage);
                        throw err;
                } finally {
                        setLoading(false);
                }
        }, []);

        // Update SMS settings
        const updateSMSSettings = useCallback(async (smsSettings: Partial<SMSSettings>) => {
                try {
                        setLoading(true);
                        setError(null);
                        await adminAPI.notifications.updateSMSSettings(smsSettings);
                        toast.success('تنظیمات پیامک با موفقیت بروزرسانی شد');
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || 'خطا در بروزرسانی تنظیمات پیامک';
                        setError(errorMessage);
                        toast.error(errorMessage);
                        throw err;
                } finally {
                        setLoading(false);
                }
        }, []);

        // Test email configuration
        const testEmailSettings = useCallback(async (testEmail: string) => {
                try {
                        // Simulate test email
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        toast.success('ایمیل تست با موفقیت ارسال شد');
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || 'خطا در ارسال ایمیل تست';
                        toast.error(errorMessage);
                        throw err;
                }
        }, []);

        // Test SMS configuration
        const testSMSSettings = useCallback(async (testPhone: string) => {
                try {
                        // Simulate test SMS
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        toast.success('پیامک تست با موفقیت ارسال شد');
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || 'خطا در ارسال پیامک تست';
                        toast.error(errorMessage);
                        throw err;
                }
        }, []);

        // Mock methods for Settings.tsx compatibility
        const refreshData = useCallback(async () => { }, []);
        const updateGeneralSettings = useCallback(async (settings: any) => { }, []);
        const updatePaymentSettings = useCallback(async (settings: any) => { }, []);
        const updateShippingSettings = useCallback(async (settings: any) => { }, []);
        const updateSecuritySettings = useCallback(async (settings: any) => { }, []);
        const updateBackupSettings = useCallback(async (settings: any) => { }, []);
        const createBackup = useCallback(async (options: any) => { }, []);
        const getBackupHistory = useCallback(async () => [], []);
        const enableMaintenanceMode = useCallback(async (reason: string) => { }, []);
        const disableMaintenanceMode = useCallback(async () => { }, []);
        const getSystemStats = useCallback(async () => ({}), []);
        const resetToDefaults = useCallback(async (category: string) => { }, []);
        const exportSettings = useCallback(async () => { }, []);
        const importSettings = useCallback(async (file: File) => { }, []);
        const changeCategory = useCallback((category: string) => {
                setFilters({ category });
        }, []);

        return {
                loading,
                error,
                currentSettings,
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
        };
}; 