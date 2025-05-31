import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CartItem } from '../types';
import { ordersAPI } from '../services/api';

interface ShippingForm {
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
        address: {
                street: string;
                city: string;
                state: string;
                postalCode: string;
                country: string;
        };
}

const Checkout: React.FC = () => {
        const navigate = useNavigate();
        const { cartItems, getCartTotal, clearCart } = useCart();
        const { user } = useAuth();

        const [currentStep, setCurrentStep] = useState(1);
        const [isLoading, setIsLoading] = useState(false);
        const [errors, setErrors] = useState<{ [key: string]: string }>({});

        const [shippingForm, setShippingForm] = useState<ShippingForm>({
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                phone: user?.phone || '',
                email: user?.email || '',
                address: {
                        street: user?.address?.street || '',
                        city: user?.address?.city || '',
                        state: user?.address?.state || '',
                        postalCode: user?.address?.postalCode || '',
                        country: user?.address?.country || 'ایران'
                }
        });

        const [paymentMethod, setPaymentMethod] = useState<'zarinpal' | 'cash_on_delivery'>('zarinpal');

        const shippingCost = 50000;
        const subtotal = getCartTotal();
        const finalTotal = subtotal + (subtotal > 500000 ? 0 : shippingCost);

        const formatPrice = (price: number) => {
                return price.toLocaleString('fa-IR');
        };

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
                const { name, value } = e.target;

                if (name.includes('.')) {
                        // Handle nested object properties like address.street
                        const [parent, child] = name.split('.');
                        setShippingForm((prev: ShippingForm) => ({
                                ...prev,
                                [parent]: {
                                        ...(prev as any)[parent],
                                        [child]: value
                                }
                        }));
                } else {
                        setShippingForm((prev: ShippingForm) => ({
                                ...prev,
                                [name]: value
                        }));
                }

                // Clear error when user starts typing
                if (errors[name]) {
                        setErrors((prev: { [key: string]: string }) => ({
                                ...prev,
                                [name]: ''
                        }));
                }
        };

        const validateStep1 = () => {
                const newErrors: { [key: string]: string } = {};

                if (!shippingForm.firstName.trim()) newErrors.firstName = 'نام الزامی است';
                if (!shippingForm.lastName.trim()) newErrors.lastName = 'نام خانوادگی الزامی است';
                if (!shippingForm.phone.trim()) newErrors.phone = 'شماره تلفن الزامی است';
                if (!shippingForm.email.trim()) newErrors.email = 'ایمیل الزامی است';
                if (!shippingForm.address.street.trim()) newErrors['address.street'] = 'آدرس الزامی است';
                if (!shippingForm.address.city.trim()) newErrors['address.city'] = 'شهر الزامی است';
                if (!shippingForm.address.state.trim()) newErrors['address.state'] = 'استان الزامی است';
                if (!shippingForm.address.postalCode.trim()) newErrors['address.postalCode'] = 'کد پستی الزامی است';

                setErrors(newErrors);
                return Object.keys(newErrors).length === 0;
        };

        const handleNextStep = () => {
                if (currentStep === 1 && validateStep1()) {
                        setCurrentStep(2);
                } else if (currentStep === 2) {
                        setCurrentStep(3);
                }
        };

        const handlePrevStep = () => {
                if (currentStep > 1) {
                        setCurrentStep(currentStep - 1);
                }
        };

        const handleSubmitOrder = async () => {
                setIsLoading(true);

                try {
                        const orderData = {
                                items: cartItems,
                                shippingAddress: shippingForm.address,
                                paymentMethod
                        };

                        const response = await ordersAPI.createOrder(orderData);

                        if (paymentMethod === 'zarinpal' && response.paymentUrl) {
                                // Redirect to ZarinPal
                                window.location.href = response.paymentUrl;
                        } else {
                                // Cash on delivery - clear cart and redirect
                                clearCart();
                                alert('سفارش شما با موفقیت ثبت شد');
                                navigate(`/orders/${response.order._id}`);
                        }
                } catch (error: any) {
                        alert('خطا در ثبت سفارش: ' + (error.response?.data?.message || error.message));
                } finally {
                        setIsLoading(false);
                }
        };

        if (cartItems.length === 0) {
                return (
                        <div className="min-h-screen bg-gray-50 py-8">
                                <div className="container mx-auto px-4">
                                        <div className="max-w-2xl mx-auto text-center">
                                                <div className="bg-white rounded-lg shadow-md p-12">
                                                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                                                <span className="text-4xl">🛒</span>
                                                        </div>
                                                        <h1 className="text-2xl font-bold text-gray-800 mb-4">سبد خرید شما خالی است</h1>
                                                        <p className="text-gray-600 mb-8">برای ادامه خرید، محصولاتی به سبد خرید اضافه کنید</p>
                                                        <button
                                                                onClick={() => navigate('/products')}
                                                                className="bg-pink-600 text-white px-8 py-3 rounded-lg hover:bg-pink-700 transition-colors"
                                                        >
                                                                شروع خرید
                                                        </button>
                                                </div>
                                        </div>
                                </div>
                        </div>
                );
        }

        return (
                <div className="min-h-screen bg-gray-50 py-8">
                        <div className="container mx-auto px-4">
                                <div className="max-w-6xl mx-auto">
                                        {/* Header */}
                                        <div className="mb-8">
                                                <h1 className="text-3xl font-bold text-gray-800">تکمیل خرید</h1>
                                                <p className="text-gray-600 mt-2">مراحل نهایی برای تکمیل سفارش شما</p>
                                        </div>

                                        {/* Steps Progress */}
                                        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                                                <div className="flex items-center justify-between">
                                                        <div className={`flex items-center ${currentStep >= 1 ? 'text-purple-600' : 'text-gray-400'}`}>
                                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                                                                        1
                                                                </div>
                                                                <span className="mr-3 font-medium">اطلاعات ارسال</span>
                                                        </div>

                                                        <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-purple-600' : 'bg-gray-200'}`}></div>

                                                        <div className={`flex items-center ${currentStep >= 2 ? 'text-purple-600' : 'text-gray-400'}`}>
                                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                                                                        2
                                                                </div>
                                                                <span className="mr-3 font-medium">روش پرداخت</span>
                                                        </div>

                                                        <div className={`w-16 h-1 ${currentStep >= 3 ? 'bg-purple-600' : 'bg-gray-200'}`}></div>

                                                        <div className={`flex items-center ${currentStep >= 3 ? 'text-purple-600' : 'text-gray-400'}`}>
                                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                                                                        3
                                                                </div>
                                                                <span className="mr-3 font-medium">بررسی نهایی</span>
                                                        </div>
                                                </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                                {/* Main Content */}
                                                <div className="lg:col-span-2">
                                                        {/* Step 1: Shipping Information */}
                                                        {currentStep === 1 && (
                                                                <div className="bg-white rounded-lg shadow-md p-6">
                                                                        <h2 className="text-xl font-bold text-gray-800 mb-6">اطلاعات ارسال</h2>

                                                                        <form className="space-y-6">
                                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                                        <div>
                                                                                                <label className="block text-sm font-medium text-gray-700 mb-2">نام *</label>
                                                                                                <input
                                                                                                        type="text"
                                                                                                        name="firstName"
                                                                                                        value={shippingForm.firstName}
                                                                                                        onChange={handleInputChange}
                                                                                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                                                                                                />
                                                                                                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                                                                                        </div>

                                                                                        <div>
                                                                                                <label className="block text-sm font-medium text-gray-700 mb-2">نام خانوادگی *</label>
                                                                                                <input
                                                                                                        type="text"
                                                                                                        name="lastName"
                                                                                                        value={shippingForm.lastName}
                                                                                                        onChange={handleInputChange}
                                                                                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                                                                                                />
                                                                                                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                                                                                        </div>

                                                                                        <div>
                                                                                                <label className="block text-sm font-medium text-gray-700 mb-2">شماره تلفن *</label>
                                                                                                <input
                                                                                                        type="tel"
                                                                                                        name="phone"
                                                                                                        value={shippingForm.phone}
                                                                                                        onChange={handleInputChange}
                                                                                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                                                                                                />
                                                                                                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                                                                        </div>

                                                                                        <div>
                                                                                                <label className="block text-sm font-medium text-gray-700 mb-2">ایمیل *</label>
                                                                                                <input
                                                                                                        type="email"
                                                                                                        name="email"
                                                                                                        value={shippingForm.email}
                                                                                                        onChange={handleInputChange}
                                                                                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                                                                                />
                                                                                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                                                                        </div>

                                                                                        <div className="md:col-span-2">
                                                                                                <label className="block text-sm font-medium text-gray-700 mb-2">آدرس کامل *</label>
                                                                                                <input
                                                                                                        type="text"
                                                                                                        name="address.street"
                                                                                                        value={shippingForm.address.street}
                                                                                                        onChange={handleInputChange}
                                                                                                        placeholder="خیابان، کوچه، پلاک، واحد"
                                                                                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${errors['address.street'] ? 'border-red-500' : 'border-gray-300'}`}
                                                                                                />
                                                                                                {errors['address.street'] && <p className="text-red-500 text-sm mt-1">{errors['address.street']}</p>}
                                                                                        </div>

                                                                                        <div>
                                                                                                <label className="block text-sm font-medium text-gray-700 mb-2">شهر *</label>
                                                                                                <input
                                                                                                        type="text"
                                                                                                        name="address.city"
                                                                                                        value={shippingForm.address.city}
                                                                                                        onChange={handleInputChange}
                                                                                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${errors['address.city'] ? 'border-red-500' : 'border-gray-300'}`}
                                                                                                />
                                                                                                {errors['address.city'] && <p className="text-red-500 text-sm mt-1">{errors['address.city']}</p>}
                                                                                        </div>

                                                                                        <div>
                                                                                                <label className="block text-sm font-medium text-gray-700 mb-2">استان *</label>
                                                                                                <input
                                                                                                        type="text"
                                                                                                        name="address.state"
                                                                                                        value={shippingForm.address.state}
                                                                                                        onChange={handleInputChange}
                                                                                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${errors['address.state'] ? 'border-red-500' : 'border-gray-300'}`}
                                                                                                />
                                                                                                {errors['address.state'] && <p className="text-red-500 text-sm mt-1">{errors['address.state']}</p>}
                                                                                        </div>

                                                                                        <div>
                                                                                                <label className="block text-sm font-medium text-gray-700 mb-2">کد پستی *</label>
                                                                                                <input
                                                                                                        type="text"
                                                                                                        name="address.postalCode"
                                                                                                        value={shippingForm.address.postalCode}
                                                                                                        onChange={handleInputChange}
                                                                                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${errors['address.postalCode'] ? 'border-red-500' : 'border-gray-300'}`}
                                                                                                />
                                                                                                {errors['address.postalCode'] && <p className="text-red-500 text-sm mt-1">{errors['address.postalCode']}</p>}
                                                                                        </div>
                                                                                </div>
                                                                        </form>
                                                                </div>
                                                        )}

                                                        {/* Step 2: Payment Method */}
                                                        {currentStep === 2 && (
                                                                <div className="bg-white rounded-lg shadow-md p-6">
                                                                        <h2 className="text-xl font-bold text-gray-800 mb-6">روش پرداخت</h2>

                                                                        <div className="space-y-4">
                                                                                <div
                                                                                        className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'zarinpal' ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}
                                                                                        onClick={() => setPaymentMethod('zarinpal')}
                                                                                >
                                                                                        <div className="flex items-center">
                                                                                                <input
                                                                                                        type="radio"
                                                                                                        checked={paymentMethod === 'zarinpal'}
                                                                                                        onChange={() => setPaymentMethod('zarinpal')}
                                                                                                        className="text-purple-600"
                                                                                                />
                                                                                                <div className="mr-3">
                                                                                                        <h3 className="font-medium text-gray-800">پرداخت آنلاین</h3>
                                                                                                        <p className="text-sm text-gray-600">پرداخت امن از طریق درگاه زرین‌پال</p>
                                                                                                </div>
                                                                                        </div>
                                                                                </div>

                                                                                <div
                                                                                        className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'cash_on_delivery' ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}
                                                                                        onClick={() => setPaymentMethod('cash_on_delivery')}
                                                                                >
                                                                                        <div className="flex items-center">
                                                                                                <input
                                                                                                        type="radio"
                                                                                                        checked={paymentMethod === 'cash_on_delivery'}
                                                                                                        onChange={() => setPaymentMethod('cash_on_delivery')}
                                                                                                        className="text-purple-600"
                                                                                                />
                                                                                                <div className="mr-3">
                                                                                                        <h3 className="font-medium text-gray-800">پرداخت در محل</h3>
                                                                                                        <p className="text-sm text-gray-600">پرداخت هنگام دریافت کالا</p>
                                                                                                </div>
                                                                                        </div>
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                        )}

                                                        {/* Step 3: Order Review */}
                                                        {currentStep === 3 && (
                                                                <div className="bg-white rounded-lg shadow-md p-6">
                                                                        <h2 className="text-xl font-bold text-gray-800 mb-6">بررسی نهایی سفارش</h2>

                                                                        {/* Order Items */}
                                                                        <div className="mb-6">
                                                                                <h3 className="text-lg font-medium text-gray-800 mb-4">محصولات سفارش</h3>
                                                                                <div className="space-y-3">
                                                                                        {cartItems.map((item: CartItem, index: number) => (
                                                                                                <div key={`${item.productId}-${item.color || 'no-color'}-${item.size || 'no-size'}-${index}`} className="flex items-center justify-between py-3 border-b border-gray-100">
                                                                                                        <div className="flex items-center">
                                                                                                                <img
                                                                                                                        src={item.image || '/placeholder-image.jpg'}
                                                                                                                        alt={item.name}
                                                                                                                        className="w-16 h-16 object-cover rounded-lg ml-4"
                                                                                                                />
                                                                                                                <div>
                                                                                                                        <h4 className="font-medium text-gray-800">{item.name}</h4>
                                                                                                                        <div className="text-sm text-gray-500">
                                                                                                                                <span>تعداد: {item.quantity}</span>
                                                                                                                                {item.color && <span className="mr-4">رنگ: {item.color}</span>}
                                                                                                                                {item.size && <span className="mr-4">سایز: {item.size}</span>}
                                                                                                                        </div>
                                                                                                                </div>
                                                                                                        </div>
                                                                                                        <div className="text-right">
                                                                                                                <p className="font-bold text-gray-800">
                                                                                                                        {formatPrice(item.price * item.quantity)} تومان
                                                                                                                </p>
                                                                                                        </div>
                                                                                                </div>
                                                                                        ))}
                                                                                </div>
                                                                        </div>

                                                                        {/* Shipping Info */}
                                                                        <div className="mb-6">
                                                                                <h3 className="text-lg font-medium text-gray-800 mb-4">اطلاعات ارسال</h3>
                                                                                <div className="bg-gray-50 rounded-lg p-4">
                                                                                        <p className="font-medium">{shippingForm.firstName} {shippingForm.lastName}</p>
                                                                                        <p className="text-gray-600">{shippingForm.phone}</p>
                                                                                        <p className="text-gray-600">{shippingForm.email}</p>
                                                                                        <p className="text-gray-600 mt-2">
                                                                                                {shippingForm.address.street}, {shippingForm.address.city}, {shippingForm.address.state}
                                                                                        </p>
                                                                                        <p className="text-gray-600">کد پستی: {shippingForm.address.postalCode}</p>
                                                                                </div>
                                                                        </div>

                                                                        {/* Payment Method */}
                                                                        <div className="mb-6">
                                                                                <h3 className="text-lg font-medium text-gray-800 mb-4">روش پرداخت</h3>
                                                                                <div className="bg-gray-50 rounded-lg p-4">
                                                                                        <p className="font-medium">
                                                                                                {paymentMethod === 'zarinpal' ? 'پرداخت آنلاین (زرین‌پال)' : 'پرداخت در محل'}
                                                                                        </p>
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                        )}

                                                        {/* Navigation Buttons */}
                                                        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                                                                <div className="flex justify-between">
                                                                        <button
                                                                                onClick={handlePrevStep}
                                                                                disabled={currentStep === 1}
                                                                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                        >
                                                                                مرحله قبل
                                                                        </button>

                                                                        {currentStep < 3 ? (
                                                                                <button
                                                                                        onClick={handleNextStep}
                                                                                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                                                                >
                                                                                        مرحله بعد
                                                                                </button>
                                                                        ) : (
                                                                                <button
                                                                                        onClick={handleSubmitOrder}
                                                                                        disabled={isLoading}
                                                                                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                                                                >
                                                                                        {isLoading ? 'در حال ثبت...' : 'ثبت سفارش'}
                                                                                </button>
                                                                        )}
                                                                </div>
                                                        </div>
                                                </div>

                                                {/* Order Summary Sidebar */}
                                                <div className="lg:col-span-1">
                                                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                                                                <h2 className="text-xl font-bold text-gray-800 mb-6">خلاصه سفارش</h2>

                                                                <div className="space-y-4 mb-6">
                                                                        <div className="flex justify-between">
                                                                                <span className="text-gray-600">جمع محصولات ({cartItems.length} عدد)</span>
                                                                                <span className="font-medium">{formatPrice(subtotal)} تومان</span>
                                                                        </div>

                                                                        <div className="flex justify-between">
                                                                                <span className="text-gray-600">هزینه ارسال</span>
                                                                                <span className="font-medium">
                                                                                        {subtotal > 500000 ? (
                                                                                                <span className="text-green-600">رایگان</span>
                                                                                        ) : (
                                                                                                `${formatPrice(shippingCost)} تومان`
                                                                                        )}
                                                                                </span>
                                                                        </div>

                                                                        {subtotal <= 500000 && (
                                                                                <div className="bg-blue-50 p-3 rounded-lg">
                                                                                        <p className="text-sm text-blue-700">
                                                                                                برای ارسال رایگان {formatPrice(500000 - subtotal)} تومان تا تکمیل مبلغ باقی مانده
                                                                                        </p>
                                                                                </div>
                                                                        )}

                                                                        <hr className="border-gray-200" />

                                                                        <div className="flex justify-between text-lg font-bold">
                                                                                <span>مجموع نهایی</span>
                                                                                <span className="text-purple-600">{formatPrice(finalTotal)} تومان</span>
                                                                        </div>
                                                                </div>

                                                                {/* Security Features */}
                                                                <div className="space-y-3">
                                                                        <div className="flex items-center text-sm text-gray-600">
                                                                                <span className="text-green-600 ml-2">🔒</span>
                                                                                پرداخت امن SSL
                                                                        </div>
                                                                        <div className="flex items-center text-sm text-gray-600">
                                                                                <span className="text-green-600 ml-2">🚚</span>
                                                                                ارسال سریع و مطمئن
                                                                        </div>
                                                                        <div className="flex items-center text-sm text-gray-600">
                                                                                <span className="text-green-600 ml-2">↩️</span>
                                                                                ضمانت بازگشت کالا
                                                                        </div>
                                                                </div>
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </div>
                </div>
        );
};

export default Checkout; 