import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState('');
        const [success, setSuccess] = useState('');

        const { login, user } = useAuth();
        const navigate = useNavigate();

        // اگر کاربر قبلاً وارد شده، آنها را هدایت کن
        useEffect(() => {
                if (user) {
                        if (user.isAdmin) {
                                navigate('/admin');
                        } else {
                                navigate('/');
                        }
                }
        }, [user, navigate]);

        const handleSubmit = async (e: React.FormEvent) => {
                e.preventDefault();
                setIsLoading(true);
                setError('');
                setSuccess('');

                try {
                        await login(email, password);
                        setSuccess('ورود موفقیت‌آمیز بود');

                        // تاخیر کوتاه برای نمایش پیام موفقیت
                        setTimeout(() => {
                                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                                console.log('User data after login:', userData);

                                if (userData.isAdmin) {
                                        console.log('Redirecting to admin panel');
                                        navigate('/admin');
                                } else {
                                        console.log('Redirecting to home page');
                                        navigate('/');
                                }
                        }, 1000);
                } catch (error: any) {
                        console.error('Login error:', error);
                        setError(error.response?.data?.message || 'خطایی رخ داد');
                } finally {
                        setIsLoading(false);
                }
        };

        // پیش‌پر کردن فیلدها برای تست سریع
        const fillAdminCredentials = () => {
                setEmail('admin@shal-roosari.com');
                setPassword('admin123');
        };

        return (
                <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                        <div className="sm:mx-auto sm:w-full sm:max-w-md">
                                <div className="text-center">
                                        <h2 className="mt-6 text-3xl font-bold text-gray-900">
                                                ورود به حساب کاربری
                                        </h2>
                                        <p className="mt-2 text-sm text-gray-600">
                                                یا{' '}
                                                <Link
                                                        to="/register"
                                                        className="font-medium text-primary-600 hover:text-primary-500"
                                                >
                                                        حساب جدید ایجاد کنید
                                                </Link>
                                        </p>
                                        <button
                                                type="button"
                                                onClick={fillAdminCredentials}
                                                className="mt-2 text-xs text-blue-600 hover:text-blue-500"
                                        >
                                                ورود سریع مدیر (برای تست)
                                        </button>
                                </div>

                                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                                        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                                                <form className="space-y-6" onSubmit={handleSubmit}>
                                                        <div>
                                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                                        ایمیل
                                                                </label>
                                                                <div className="mt-1">
                                                                        <input
                                                                                id="email"
                                                                                name="email"
                                                                                type="email"
                                                                                autoComplete="email"
                                                                                required
                                                                                value={email}
                                                                                onChange={(e) => setEmail(e.target.value)}
                                                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                                                                placeholder="example@email.com"
                                                                        />
                                                                </div>
                                                        </div>

                                                        <div>
                                                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                                                        رمز عبور
                                                                </label>
                                                                <div className="mt-1">
                                                                        <input
                                                                                id="password"
                                                                                name="password"
                                                                                type="password"
                                                                                autoComplete="current-password"
                                                                                required
                                                                                value={password}
                                                                                onChange={(e) => setPassword(e.target.value)}
                                                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                                                        />
                                                                </div>
                                                        </div>

                                                        {error && (
                                                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                                                                        {error}
                                                                </div>
                                                        )}

                                                        {success && (
                                                                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
                                                                        {success}
                                                                </div>
                                                        )}

                                                        <div>
                                                                <button
                                                                        type="submit"
                                                                        disabled={isLoading}
                                                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                                                                >
                                                                        {isLoading ? 'در حال ورود...' : 'ورود'}
                                                                </button>
                                                        </div>
                                                </form>
                                        </div>
                                </div>
                        </div>
                </div>
        );
};

export default Login; 