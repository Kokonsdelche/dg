import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

interface UserProfile {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address?: {
                street: string;
                city: string;
                state: string;
                postalCode: string;
                country: string;
        };
}

const Profile: React.FC = () => {
        const { user } = useAuth();
        const [profile, setProfile] = useState<UserProfile>({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                address: {
                        street: '',
                        city: '',
                        state: '',
                        postalCode: '',
                        country: 'ایران'
                }
        });
        const [isEditing, setIsEditing] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
        const [message, setMessage] = useState('');

        useEffect(() => {
                if (user) {
                        setProfile({
                                firstName: user.firstName || '',
                                lastName: user.lastName || '',
                                email: user.email || '',
                                phone: user.phone || '',
                                address: user.address || {
                                        street: '',
                                        city: '',
                                        state: '',
                                        postalCode: '',
                                        country: 'ایران'
                                }
                        });
                }
        }, [user]);

        const handleSubmit = async (e: React.FormEvent) => {
                e.preventDefault();
                setIsLoading(true);
                setMessage('');

                try {
                        await authAPI.updateProfile(profile);
                        setMessage('پروفایل با موفقیت به‌روزرسانی شد');
                        setIsEditing(false);
                } catch (error: any) {
                        setMessage('خطا در به‌روزرسانی پروفایل: ' + (error.response?.data?.message || error.message));
                } finally {
                        setIsLoading(false);
                }
        };

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const { name, value } = e.target;
                if (name.startsWith('address.')) {
                        const addressField = name.split('.')[1];
                        setProfile(prev => ({
                                ...prev,
                                address: {
                                        ...prev.address!,
                                        [addressField]: value
                                }
                        }));
                } else {
                        setProfile(prev => ({ ...prev, [name]: value }));
                }
        };

        const getFieldClassName = (value: string, isDisabled: boolean) => {
                if (isDisabled) {
                        return "w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed";
                }

                const isEmpty = !value || value.trim() === '';
                const baseClass = "w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-all duration-300";

                if (isEmpty) {
                        return `${baseClass} border-red-500 text-red-700 focus:ring-2 focus:ring-red-500 bg-red-50`;
                } else {
                        return `${baseClass} border-purple-500 text-purple-700 focus:ring-2 focus:ring-purple-500 bg-purple-50`;
                }
        };

        const getLabelClassName = (value: string) => {
                const isEmpty = !value || value.trim() === '';
                const baseClass = "block text-sm font-medium mb-2 transition-colors duration-300";

                if (isEmpty) {
                        return `${baseClass} text-red-600`;
                } else {
                        return `${baseClass} text-purple-600`;
                }
        };

        return (
                <div className="min-h-screen bg-gray-50 py-8">
                        <div className="container mx-auto px-4">
                                <div className="max-w-4xl mx-auto">
                                        {/* Header */}
                                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                                <div className="flex items-center justify-between">
                                                        <div>
                                                                <h1 className="text-3xl font-bold text-gray-800">پروفایل کاربری</h1>
                                                                <p className="text-gray-600 mt-1">مدیریت اطلاعات شخصی شما</p>
                                                        </div>
                                                        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
                                                                <span className="text-white text-2xl font-bold">
                                                                        {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                                                                </span>
                                                        </div>
                                                </div>
                                        </div>

                                        {/* Stats Cards */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                                <div className="bg-white rounded-lg shadow-md p-6">
                                                        <div className="flex items-center">
                                                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                                        <span className="text-2xl">🛒</span>
                                                                </div>
                                                                <div className="mr-4">
                                                                        <h3 className="text-lg font-bold text-gray-800">سفارشات</h3>
                                                                        <p className="text-gray-600">0 سفارش</p>
                                                                </div>
                                                        </div>
                                                </div>

                                                <div className="bg-white rounded-lg shadow-md p-6">
                                                        <div className="flex items-center">
                                                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                                                        <span className="text-2xl">💰</span>
                                                                </div>
                                                                <div className="mr-4">
                                                                        <h3 className="text-lg font-bold text-gray-800">مجموع خرید</h3>
                                                                        <p className="text-gray-600">0 تومان</p>
                                                                </div>
                                                        </div>
                                                </div>

                                                <div className="bg-white rounded-lg shadow-md p-6">
                                                        <div className="flex items-center">
                                                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                                                        <span className="text-2xl">❤️</span>
                                                                </div>
                                                                <div className="mr-4">
                                                                        <h3 className="text-lg font-bold text-gray-800">علاقه‌مندی‌ها</h3>
                                                                        <p className="text-gray-600">0 محصول</p>
                                                                </div>
                                                        </div>
                                                </div>
                                        </div>

                                        {/* Profile Form */}
                                        <div className="bg-white rounded-lg shadow-md p-6">
                                                <div className="flex items-center justify-between mb-6">
                                                        <h2 className="text-xl font-bold text-gray-800">اطلاعات شخصی</h2>
                                                        <button
                                                                onClick={() => setIsEditing(!isEditing)}
                                                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                                        >
                                                                {isEditing ? 'لغو' : 'ویرایش'}
                                                        </button>
                                                </div>

                                                {message && (
                                                        <div className={`mb-4 p-4 rounded-lg ${message.includes('خطا') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                                {message}
                                                        </div>
                                                )}

                                                <form onSubmit={handleSubmit}>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                {/* Personal Info */}
                                                                <div>
                                                                        <label className={getLabelClassName(profile.firstName)}>
                                                                                نام <span className="text-red-500">*</span>
                                                                        </label>
                                                                        <input
                                                                                type="text"
                                                                                name="firstName"
                                                                                value={profile.firstName}
                                                                                onChange={handleInputChange}
                                                                                disabled={!isEditing}
                                                                                className={getFieldClassName(profile.firstName, !isEditing)}
                                                                                required
                                                                        />
                                                                </div>

                                                                <div>
                                                                        <label className={getLabelClassName(profile.lastName)}>
                                                                                نام خانوادگی <span className="text-red-500">*</span>
                                                                        </label>
                                                                        <input
                                                                                type="text"
                                                                                name="lastName"
                                                                                value={profile.lastName}
                                                                                onChange={handleInputChange}
                                                                                disabled={!isEditing}
                                                                                className={getFieldClassName(profile.lastName, !isEditing)}
                                                                                required
                                                                        />
                                                                </div>

                                                                <div>
                                                                        <label className={getLabelClassName(profile.email)}>
                                                                                ایمیل <span className="text-red-500">*</span>
                                                                        </label>
                                                                        <input
                                                                                type="email"
                                                                                name="email"
                                                                                value={profile.email}
                                                                                disabled
                                                                                className={getFieldClassName(profile.email, true)}
                                                                        />
                                                                        <p className="text-xs text-gray-500 mt-1">ایمیل قابل تغییر نیست</p>
                                                                </div>

                                                                <div>
                                                                        <label className={getLabelClassName(profile.phone)}>
                                                                                شماره تلفن <span className="text-red-500">*</span>
                                                                        </label>
                                                                        <input
                                                                                type="tel"
                                                                                name="phone"
                                                                                value={profile.phone}
                                                                                onChange={handleInputChange}
                                                                                disabled={!isEditing}
                                                                                className={getFieldClassName(profile.phone, !isEditing)}
                                                                                required
                                                                        />
                                                                </div>

                                                                {/* Address */}
                                                                <div className="md:col-span-2">
                                                                        <h3 className="text-lg font-bold text-gray-800 mb-4">آدرس</h3>
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                                <div className="md:col-span-2">
                                                                                        <label className={getLabelClassName(profile.address?.street || '')}>
                                                                                                آدرس کامل <span className="text-red-500">*</span>
                                                                                        </label>
                                                                                        <input
                                                                                                type="text"
                                                                                                name="address.street"
                                                                                                value={profile.address?.street || ''}
                                                                                                onChange={handleInputChange}
                                                                                                disabled={!isEditing}
                                                                                                className={getFieldClassName(profile.address?.street || '', !isEditing)}
                                                                                                placeholder="خیابان، کوچه، پلاک"
                                                                                                required
                                                                                        />
                                                                                </div>

                                                                                <div>
                                                                                        <label className={getLabelClassName(profile.address?.city || '')}>
                                                                                                شهر <span className="text-red-500">*</span>
                                                                                        </label>
                                                                                        <input
                                                                                                type="text"
                                                                                                name="address.city"
                                                                                                value={profile.address?.city || ''}
                                                                                                onChange={handleInputChange}
                                                                                                disabled={!isEditing}
                                                                                                className={getFieldClassName(profile.address?.city || '', !isEditing)}
                                                                                                required
                                                                                        />
                                                                                </div>

                                                                                <div>
                                                                                        <label className={getLabelClassName(profile.address?.state || '')}>
                                                                                                استان <span className="text-red-500">*</span>
                                                                                        </label>
                                                                                        <input
                                                                                                type="text"
                                                                                                name="address.state"
                                                                                                value={profile.address?.state || ''}
                                                                                                onChange={handleInputChange}
                                                                                                disabled={!isEditing}
                                                                                                className={getFieldClassName(profile.address?.state || '', !isEditing)}
                                                                                                required
                                                                                        />
                                                                                </div>

                                                                                <div>
                                                                                        <label className={getLabelClassName(profile.address?.postalCode || '')}>
                                                                                                کد پستی <span className="text-red-500">*</span>
                                                                                        </label>
                                                                                        <input
                                                                                                type="text"
                                                                                                name="address.postalCode"
                                                                                                value={profile.address?.postalCode || ''}
                                                                                                onChange={handleInputChange}
                                                                                                disabled={!isEditing}
                                                                                                className={getFieldClassName(profile.address?.postalCode || '', !isEditing)}
                                                                                                required
                                                                                        />
                                                                                </div>

                                                                                <div>
                                                                                        <label className={getLabelClassName(profile.address?.country || 'ایران')}>
                                                                                                کشور <span className="text-red-500">*</span>
                                                                                        </label>
                                                                                        <input
                                                                                                type="text"
                                                                                                name="address.country"
                                                                                                value={profile.address?.country || 'ایران'}
                                                                                                onChange={handleInputChange}
                                                                                                disabled={!isEditing}
                                                                                                className={getFieldClassName(profile.address?.country || 'ایران', !isEditing)}
                                                                                                required
                                                                                        />
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                        </div>

                                                        {isEditing && (
                                                                <div className="mt-6 flex gap-4">
                                                                        <button
                                                                                type="submit"
                                                                                disabled={isLoading}
                                                                                className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50"
                                                                        >
                                                                                {isLoading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                                                                        </button>
                                                                        <button
                                                                                type="button"
                                                                                onClick={() => setIsEditing(false)}
                                                                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                                        >
                                                                                لغو
                                                                        </button>
                                                                </div>
                                                        )}
                                                </form>
                                        </div>
                                </div>
                        </div>
                </div>
        );
};

export default Profile; 