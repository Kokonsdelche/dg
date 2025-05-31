import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
        const [formData, setFormData] = useState({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: ''
        });
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState('');
        const [successMessage, setSuccessMessage] = useState('');

        const { register } = useAuth();
        const navigate = useNavigate();

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData({
                        ...formData,
                        [e.target.name]: e.target.value
                });
        };

        const handleSubmit = async (e: React.FormEvent) => {
                e.preventDefault();
                setIsLoading(true);
                setError('');
                setSuccessMessage('');

                if (formData.password !== formData.confirmPassword) {
                        setError('رمز عبور و تکرار آن یکسان نیستند');
                        setIsLoading(false);
                        return;
                }

                try {
                        await register({
                                firstName: formData.firstName,
                                lastName: formData.lastName,
                                email: formData.email,
                                phone: formData.phone,
                                password: formData.password
                        });

                        // Show success message
                        setSuccessMessage('ثبت‌نام با موفقیت انجام شد!');

                        // Hide success message and navigate after 1.5 seconds
                        setTimeout(() => {
                                setSuccessMessage('');
                                navigate('/');
                        }, 1500);

                } catch (error: any) {
                        setError(error.response?.data?.message || 'خطایی رخ داد');
                } finally {
                        setIsLoading(false);
                }
        };

        return (
                <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                        <div className="sm:mx-auto sm:w-full sm:max-w-md">
                                <div className="text-center">
                                        <h2 className="mt-6 text-3xl font-bold text-gray-900">
                                                ایجاد حساب کاربری
                                        </h2>
                                        <p className="mt-2 text-sm text-gray-600">
                                                یا{' '}
                                                <Link
                                                        to="/login"
                                                        className="font-medium text-primary-600 hover:text-primary-500"
                                                >
                                                        وارد حساب موجود شوید
                                                </Link>
                                        </p>
                                </div>

                                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                                        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                                                <form className="space-y-6" onSubmit={handleSubmit}>
                                                        <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                                                                نام
                                                                        </label>
                                                                        <input
                                                                                id="firstName"
                                                                                name="firstName"
                                                                                type="text"
                                                                                required
                                                                                value={formData.firstName}
                                                                                onChange={handleChange}
                                                                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                                                        />
                                                                </div>

                                                                <div>
                                                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                                                                نام خانوادگی
                                                                        </label>
                                                                        <input
                                                                                id="lastName"
                                                                                name="lastName"
                                                                                type="text"
                                                                                required
                                                                                value={formData.lastName}
                                                                                onChange={handleChange}
                                                                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                                                        />
                                                                </div>
                                                        </div>

                                                        <div>
                                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                                        ایمیل
                                                                </label>
                                                                <input
                                                                        id="email"
                                                                        name="email"
                                                                        type="email"
                                                                        required
                                                                        value={formData.email}
                                                                        onChange={handleChange}
                                                                        className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                                                        placeholder="example@email.com"
                                                                />
                                                        </div>

                                                        <div>
                                                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                                                        شماره تلفن
                                                                </label>
                                                                <input
                                                                        id="phone"
                                                                        name="phone"
                                                                        type="tel"
                                                                        required
                                                                        value={formData.phone}
                                                                        onChange={handleChange}
                                                                        className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                                                        placeholder="09123456789"
                                                                />
                                                        </div>

                                                        <div>
                                                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                                                        رمز عبور
                                                                </label>
                                                                <input
                                                                        id="password"
                                                                        name="password"
                                                                        type="password"
                                                                        required
                                                                        value={formData.password}
                                                                        onChange={handleChange}
                                                                        className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                                                />
                                                        </div>

                                                        <div>
                                                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                                                        تکرار رمز عبور
                                                                </label>
                                                                <input
                                                                        id="confirmPassword"
                                                                        name="confirmPassword"
                                                                        type="password"
                                                                        required
                                                                        value={formData.confirmPassword}
                                                                        onChange={handleChange}
                                                                        className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                                                />
                                                        </div>

                                                        {successMessage && (
                                                                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded flex items-center">
                                                                        <span className="mr-2">✅</span>
                                                                        {successMessage}
                                                                </div>
                                                        )}

                                                        {error && (
                                                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                                                                        {error}
                                                                </div>
                                                        )}

                                                        <div>
                                                                <button
                                                                        type="submit"
                                                                        disabled={isLoading || successMessage !== ''}
                                                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                                                                >
                                                                        {successMessage ? 'ثبت‌نام موفق ✅' : isLoading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
                                                                </button>
                                                        </div>
                                                </form>
                                        </div>
                                </div>
                        </div>
                </div>
        );
};

export default Register; 