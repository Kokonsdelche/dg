import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header: React.FC = () => {
        const { user, logout } = useAuth();
        const { getCartItemsCount } = useCart();
        const navigate = useNavigate();
        const [isMenuOpen, setIsMenuOpen] = useState(false);
        const [searchQuery, setSearchQuery] = useState('');
        const [showProfileText, setShowProfileText] = useState(false);

        // Alternating text animation for user greeting
        useEffect(() => {
                if (user) {
                        const interval = setInterval(() => {
                                setShowProfileText(prev => !prev);
                        }, 2000); // Switch every 2 seconds

                        return () => clearInterval(interval);
                }
        }, [user]);

        const handleLogout = () => {
                logout();
                navigate('/');
                setIsMenuOpen(false);
        };

        const handleSearch = (e: React.FormEvent) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                        navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                        setSearchQuery('');
                        setIsMenuOpen(false);
                }
        };

        const handleLinkClick = () => {
                setIsMenuOpen(false);
        };

        return (
                <header className="bg-white shadow-lg sticky top-0 z-50">
                        <div className="container mx-auto px-4">
                                {/* Main Header */}
                                <div className="flex items-center justify-between py-4">
                                        {/* Logo */}
                                        <Link to="/" className="flex items-center space-x-2 space-x-reverse">
                                                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                                                        <span className="text-white font-bold text-xl">ش</span>
                                                </div>
                                                <div>
                                                        <h1 className="text-xl font-bold text-gray-800">شال و روسری</h1>
                                                        <p className="text-xs text-gray-500">فروشگاه تخصصی</p>
                                                </div>
                                        </Link>

                                        {/* Search Bar */}
                                        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
                                                <div className="relative">
                                                        <input
                                                                type="text"
                                                                value={searchQuery}
                                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                                placeholder="جستجو در محصولات..."
                                                                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                        />
                                                        <button
                                                                type="submit"
                                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600"
                                                        >
                                                                🔍
                                                        </button>
                                                </div>
                                        </form>

                                        {/* Cart & Menu */}
                                        <div className="flex items-center space-x-4 space-x-reverse">
                                                <Link
                                                        to="/cart"
                                                        className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
                                                >
                                                        🛒
                                                        {getCartItemsCount() > 0 && (
                                                                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                                        {getCartItemsCount()}
                                                                </span>
                                                        )}
                                                </Link>

                                                {/* Mobile Menu Button */}
                                                <button
                                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                                        className="md:hidden p-2 text-gray-600 hover:text-primary-600"
                                                >
                                                        ☰
                                                </button>
                                        </div>
                                </div>

                                {/* Navigation */}
                                <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block border-t py-4`}>
                                        <ul className="flex flex-col md:flex-row md:items-center md:space-x-8 md:space-x-reverse space-y-2 md:space-y-0">
                                                <li>
                                                        <Link
                                                                to="/"
                                                                className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                                                                onClick={handleLinkClick}
                                                        >
                                                                خانه
                                                        </Link>
                                                </li>
                                                <li>
                                                        <Link
                                                                to="/products"
                                                                className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                                                                onClick={handleLinkClick}
                                                        >
                                                                همه محصولات
                                                        </Link>
                                                </li>
                                                <li>
                                                        <Link
                                                                to="/products?category=شال"
                                                                className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                                                                onClick={handleLinkClick}
                                                        >
                                                                شال
                                                        </Link>
                                                </li>
                                                <li>
                                                        <Link
                                                                to="/products?category=روسری"
                                                                className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                                                                onClick={handleLinkClick}
                                                        >
                                                                روسری
                                                        </Link>
                                                </li>

                                                {/* User Section */}
                                                {user ? (
                                                        <>
                                                                <li>
                                                                        <Link
                                                                                to="/orders"
                                                                                className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                                                                                onClick={handleLinkClick}
                                                                        >
                                                                                سفارشات من
                                                                        </Link>
                                                                </li>
                                                                {user.isAdmin && (
                                                                        <li>
                                                                                <Link
                                                                                        to="/admin"
                                                                                        className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                                                                                        onClick={handleLinkClick}
                                                                                >
                                                                                        پنل مدیریت
                                                                                </Link>
                                                                        </li>
                                                                )}
                                                                <li>
                                                                        <button
                                                                                onClick={handleLogout}
                                                                                className="block w-full text-right px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                                                                        >
                                                                                خروج
                                                                        </button>
                                                                </li>
                                                                <li>
                                                                        <Link
                                                                                to="/profile"
                                                                                className={`block px-3 py-2 transition-all duration-500 ease-in-out ${showProfileText
                                                                                                ? 'text-blue-600 hover:text-blue-700'
                                                                                                : 'text-red-600 hover:text-red-700'
                                                                                        }`}
                                                                                onClick={handleLinkClick}
                                                                        >
                                                                                <span className="transition-opacity duration-500 ease-in-out">
                                                                                        {showProfileText ? 'پروفایل من' : `درود ${user.firstName} همه چیز خوبه؟`}
                                                                                </span>
                                                                        </Link>
                                                                </li>
                                                        </>
                                                ) : (
                                                        <>
                                                                <li>
                                                                        <Link
                                                                                to="/login"
                                                                                className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                                                                                onClick={handleLinkClick}
                                                                        >
                                                                                ورود
                                                                        </Link>
                                                                </li>
                                                                <li>
                                                                        <Link
                                                                                to="/register"
                                                                                className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                                                                                onClick={handleLinkClick}
                                                                        >
                                                                                ثبت‌نام
                                                                        </Link>
                                                                </li>
                                                        </>
                                                )}
                                        </ul>
                                </nav>
                        </div>
                </header>
        );
};

export default Header; 