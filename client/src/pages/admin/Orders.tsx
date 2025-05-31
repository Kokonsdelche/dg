import React, { useState } from 'react';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';
import DataTable, { Column } from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import Modal from '../../components/admin/Modal';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import ErrorBoundary from '../../components/ErrorBoundary';
import { useAdminOrders } from '../../hooks/useAdminOrders';
import { Order } from '../../store/adminStore';
import toast from 'react-hot-toast';

const AdminOrders: React.FC = () => {
        const {
                orders,
                loading,
                error,
                filters,
                stats,
                searchOrders,
                filterByStatus,
                changePage,
                changeOrderStatus,
                bulkUpdateStatus,
                resetFilters
        } = useAdminOrders();

        const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);
        const [showOrderDetail, setShowOrderDetail] = useState<Order | null>(null);
        const [showStatusModal, setShowStatusModal] = useState<Order | null>(null);
        const [statusForm, setStatusForm] = useState({
                status: '' as Order['orderStatus'],
                trackingNumber: '',
                note: ''
        });

        // Format price
        const formatPrice = (price: number) => {
                return new Intl.NumberFormat('fa-IR').format(price);
        };

        // Format date
        const formatDate = (dateString: string) => {
                return format(new Date(dateString), 'dd MMM yyyy', { locale: faIR });
        };

        // Handle bulk status update
        const handleBulkStatusUpdate = async (newStatus: Order['orderStatus']) => {
                if (selectedOrders.length === 0) {
                        toast.error('لطفاً سفارش‌هایی را انتخاب کنید');
                        return;
                }

                const orderIds = selectedOrders.map(order => order._id);
                await bulkUpdateStatus(orderIds, newStatus);
                setSelectedOrders([]);
        };

        // Handle status change
        const handleStatusChange = async () => {
                if (!showStatusModal || !statusForm.status) {
                        toast.error('لطفاً وضعیت جدید را انتخاب کنید');
                        return;
                }

                await changeOrderStatus(
                        showStatusModal._id,
                        statusForm.status,
                        statusForm.trackingNumber || undefined,
                        statusForm.note || undefined
                );

                setShowStatusModal(null);
                setStatusForm({ status: '' as Order['orderStatus'], trackingNumber: '', note: '' });
        };

        // Table columns
        const columns: Column<Order>[] = [
                {
                        key: 'orderNumber',
                        title: 'شماره سفارش',
                        width: '150px',
                        sortable: true,
                        render: (value) => (
                                <span className="font-mono text-purple-600 font-medium">
                                        #{value || 'N/A'}
                                </span>
                        )
                },
                {
                        key: 'user',
                        title: 'مشتری',
                        width: '200px',
                        sortable: true,
                        render: (user) => user ? (
                                <div>
                                        <div className="font-medium text-gray-900">
                                                {user.firstName} {user.lastName}
                                        </div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                        ) : '-'
                },
                {
                        key: 'finalAmount',
                        title: 'مبلغ',
                        width: '120px',
                        sortable: true,
                        render: (amount) => (
                                <span className="font-semibold text-gray-900">
                                        {formatPrice(amount)} تومان
                                </span>
                        )
                },
                {
                        key: 'orderStatus',
                        title: 'وضعیت سفارش',
                        width: '150px',
                        render: (status) => (
                                <StatusBadge status={status} type="order" />
                        )
                },
                {
                        key: 'paymentStatus',
                        title: 'وضعیت پرداخت',
                        width: '150px',
                        render: (status) => (
                                <StatusBadge status={status} type="payment" />
                        )
                },
                {
                        key: 'createdAt',
                        title: 'تاریخ ثبت',
                        width: '120px',
                        sortable: true,
                        render: (date) => formatDate(date)
                }
        ];

        return (
                <ErrorBoundary>
                        <div className="min-h-screen bg-gray-50 py-8">
                                <div className="container mx-auto px-4">
                                        <div className="max-w-7xl mx-auto">
                                                {/* Header */}
                                                <div className="mb-8">
                                                        <div className="flex items-center justify-between">
                                                                <div>
                                                                        <h1 className="text-3xl font-bold text-gray-800">مدیریت سفارشات</h1>
                                                                        <p className="text-gray-600 mt-1">مدیریت و پیگیری تمامی سفارشات فروشگاه</p>
                                                                </div>
                                                                <button
                                                                        onClick={() => resetFilters()}
                                                                        className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                                                                >
                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                                        </svg>
                                                                        بروزرسانی
                                                                </button>
                                                        </div>
                                                </div>

                                                {/* Stats Cards */}
                                                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                                                        <div className="bg-white rounded-lg shadow-md p-6">
                                                                <div className="flex items-center">
                                                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                                                <span className="text-2xl">📋</span>
                                                                        </div>
                                                                        <div className="mr-4">
                                                                                <h3 className="text-sm font-medium text-gray-500">کل سفارشات</h3>
                                                                                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                                                                        </div>
                                                                </div>
                                                        </div>

                                                        <div className="bg-white rounded-lg shadow-md p-6">
                                                                <div className="flex items-center">
                                                                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                                                                <span className="text-2xl">⏳</span>
                                                                        </div>
                                                                        <div className="mr-4">
                                                                                <h3 className="text-sm font-medium text-gray-500">در انتظار</h3>
                                                                                <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
                                                                        </div>
                                                                </div>
                                                        </div>

                                                        <div className="bg-white rounded-lg shadow-md p-6">
                                                                <div className="flex items-center">
                                                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                                                <span className="text-2xl">⚙️</span>
                                                                        </div>
                                                                        <div className="mr-4">
                                                                                <h3 className="text-sm font-medium text-gray-500">در حال پردازش</h3>
                                                                                <p className="text-2xl font-bold text-gray-800">{stats.processing}</p>
                                                                        </div>
                                                                </div>
                                                        </div>

                                                        <div className="bg-white rounded-lg shadow-md p-6">
                                                                <div className="flex items-center">
                                                                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                                                                <span className="text-2xl">🚚</span>
                                                                        </div>
                                                                        <div className="mr-4">
                                                                                <h3 className="text-sm font-medium text-gray-500">ارسال شده</h3>
                                                                                <p className="text-2xl font-bold text-gray-800">{stats.shipped}</p>
                                                                        </div>
                                                                </div>
                                                        </div>

                                                        <div className="bg-white rounded-lg shadow-md p-6">
                                                                <div className="flex items-center">
                                                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                                                                <span className="text-2xl">✅</span>
                                                                        </div>
                                                                        <div className="mr-4">
                                                                                <h3 className="text-sm font-medium text-gray-500">تحویل شده</h3>
                                                                                <p className="text-2xl font-bold text-gray-800">{stats.delivered}</p>
                                                                        </div>
                                                                </div>
                                                        </div>
                                                </div>

                                                {/* Filters */}
                                                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                                <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">جستجو</label>
                                                                        <input
                                                                                type="text"
                                                                                value={filters.search}
                                                                                onChange={(e) => searchOrders(e.target.value)}
                                                                                placeholder="شماره سفارش یا نام مشتری..."
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                                        />
                                                                </div>

                                                                <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">وضعیت</label>
                                                                        <select
                                                                                value={filters.status}
                                                                                onChange={(e) => filterByStatus(e.target.value)}
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                                        >
                                                                                <option value="all">همه وضعیت‌ها</option>
                                                                                <option value="pending">در انتظار</option>
                                                                                <option value="processing">در حال پردازش</option>
                                                                                <option value="shipped">ارسال شده</option>
                                                                                <option value="delivered">تحویل شده</option>
                                                                                <option value="cancelled">لغو شده</option>
                                                                        </select>
                                                                </div>

                                                                <div className="col-span-2">
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">عملیات انبوه</label>
                                                                        <div className="flex gap-2">
                                                                                <button
                                                                                        onClick={() => handleBulkStatusUpdate('processing')}
                                                                                        disabled={selectedOrders.length === 0}
                                                                                        className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                                                >
                                                                                        پردازش ({selectedOrders.length})
                                                                                </button>
                                                                                <button
                                                                                        onClick={() => handleBulkStatusUpdate('shipped')}
                                                                                        disabled={selectedOrders.length === 0}
                                                                                        className="flex-1 px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                                                >
                                                                                        ارسال ({selectedOrders.length})
                                                                                </button>
                                                                                <button
                                                                                        onClick={() => handleBulkStatusUpdate('delivered')}
                                                                                        disabled={selectedOrders.length === 0}
                                                                                        className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                                                >
                                                                                        تحویل ({selectedOrders.length})
                                                                                </button>
                                                                        </div>
                                                                </div>
                                                        </div>
                                                </div>

                                                {/* Error Message */}
                                                {error && (
                                                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                                                                {error}
                                                        </div>
                                                )}

                                                {/* Orders Table */}
                                                <DataTable
                                                        data={orders}
                                                        columns={columns}
                                                        loading={loading}
                                                        emptyMessage="هیچ سفارشی یافت نشد"
                                                        selectedItems={selectedOrders}
                                                        onSelectionChange={setSelectedOrders}
                                                        onView={(order) => setShowOrderDetail(order)}
                                                        actions={(order) => (
                                                                <div className="flex items-center gap-2">
                                                                        <button
                                                                                onClick={() => setShowOrderDetail(order)}
                                                                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                                title="مشاهده جزئیات"
                                                                        >
                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                                </svg>
                                                                        </button>
                                                                        <button
                                                                                onClick={() => {
                                                                                        setShowStatusModal(order);
                                                                                        setStatusForm({ status: order.orderStatus, trackingNumber: order.trackingNumber || '', note: '' });
                                                                                }}
                                                                                className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                                                title="تغییر وضعیت"
                                                                        >
                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                                </svg>
                                                                        </button>
                                                                </div>
                                                        )}
                                                />
                                        </div>
                                </div>
                        </div>

                        {/* Order Detail Modal */}
                        <Modal
                                isOpen={!!showOrderDetail}
                                onClose={() => setShowOrderDetail(null)}
                                title={`جزئیات سفارش #${showOrderDetail?.orderNumber || ''}`}
                                size="lg"
                        >
                                {showOrderDetail && (
                                        <div className="space-y-6">
                                                {/* Customer Info */}
                                                <div className="bg-gray-50 rounded-lg p-4">
                                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">اطلاعات مشتری</h3>
                                                        <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                        <span className="text-sm text-gray-500">نام:</span>
                                                                        <p className="font-medium">{showOrderDetail.user?.firstName} {showOrderDetail.user?.lastName}</p>
                                                                </div>
                                                                <div>
                                                                        <span className="text-sm text-gray-500">ایمیل:</span>
                                                                        <p className="font-medium">{showOrderDetail.user?.email}</p>
                                                                </div>
                                                                <div>
                                                                        <span className="text-sm text-gray-500">تلفن:</span>
                                                                        <p className="font-medium">{showOrderDetail.user?.phone}</p>
                                                                </div>
                                                                <div>
                                                                        <span className="text-sm text-gray-500">تاریخ سفارش:</span>
                                                                        <p className="font-medium">{formatDate(showOrderDetail.createdAt)}</p>
                                                                </div>
                                                        </div>
                                                </div>

                                                {/* Order Items */}
                                                <div>
                                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">محصولات سفارش</h3>
                                                        <div className="space-y-3">
                                                                {showOrderDetail.items?.map((item, index) => (
                                                                        <div key={index} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                                                                                {item.product?.images?.[0] && (
                                                                                        <img
                                                                                                src={`http://localhost:5000${item.product.images[0].url}`}
                                                                                                alt={item.product.name}
                                                                                                className="w-16 h-16 object-cover rounded-lg"
                                                                                        />
                                                                                )}
                                                                                <div className="flex-1">
                                                                                        <h4 className="font-medium text-gray-800">{item.product?.name}</h4>
                                                                                        <div className="text-sm text-gray-500 space-y-1">
                                                                                                {item.selectedColor && <p>رنگ: {item.selectedColor}</p>}
                                                                                                {item.selectedSize && <p>سایز: {item.selectedSize}</p>}
                                                                                                <p>تعداد: {item.quantity}</p>
                                                                                        </div>
                                                                                </div>
                                                                                <div className="text-left">
                                                                                        <p className="font-semibold text-gray-800">{formatPrice(item.price)} تومان</p>
                                                                                </div>
                                                                        </div>
                                                                ))}
                                                        </div>
                                                </div>

                                                {/* Shipping Address */}
                                                <div className="bg-gray-50 rounded-lg p-4">
                                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">آدرس ارسال</h3>
                                                        <p className="text-gray-700">
                                                                {showOrderDetail.shippingAddress?.street}, {showOrderDetail.shippingAddress?.city}, {showOrderDetail.shippingAddress?.state}
                                                                <br />
                                                                کد پستی: {showOrderDetail.shippingAddress?.postalCode}
                                                        </p>
                                                </div>

                                                {/* Order Summary */}
                                                <div className="bg-purple-50 rounded-lg p-4">
                                                        <div className="flex items-center justify-between">
                                                                <span className="text-lg font-semibold text-gray-800">مبلغ کل:</span>
                                                                <span className="text-xl font-bold text-purple-600">{formatPrice(showOrderDetail.finalAmount)} تومان</span>
                                                        </div>
                                                        <div className="flex items-center justify-between mt-2">
                                                                <span>روش پرداخت:</span>
                                                                <span>{showOrderDetail.paymentMethod === 'zarinpal' ? 'زرین‌پال' : 'نقدی در محل'}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between mt-1">
                                                                <span>وضعیت پرداخت:</span>
                                                                <StatusBadge status={showOrderDetail.paymentStatus} type="payment" size="sm" />
                                                        </div>
                                                        {showOrderDetail.trackingNumber && (
                                                                <div className="flex items-center justify-between mt-1">
                                                                        <span>کد رهگیری:</span>
                                                                        <span className="font-mono text-purple-600">{showOrderDetail.trackingNumber}</span>
                                                                </div>
                                                        )}
                                                </div>
                                        </div>
                                )}
                        </Modal>

                        {/* Status Change Modal */}
                        <Modal
                                isOpen={!!showStatusModal}
                                onClose={() => {
                                        setShowStatusModal(null);
                                        setStatusForm({ status: '' as Order['orderStatus'], trackingNumber: '', note: '' });
                                }}
                                title={`تغییر وضعیت سفارش #${showStatusModal?.orderNumber || ''}`}
                                size="md"
                                actions={
                                        <>
                                                <button
                                                        onClick={() => setShowStatusModal(null)}
                                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                        انصراف
                                                </button>
                                                <button
                                                        onClick={handleStatusChange}
                                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                                >
                                                        تایید تغییر
                                                </button>
                                        </>
                                }
                        >
                                {showStatusModal && (
                                        <div className="space-y-4">
                                                <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">وضعیت جدید</label>
                                                        <select
                                                                value={statusForm.status}
                                                                onChange={(e) => setStatusForm(prev => ({ ...prev, status: e.target.value as Order['orderStatus'] }))}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                        >
                                                                <option value="pending">در انتظار</option>
                                                                <option value="processing">در حال پردازش</option>
                                                                <option value="shipped">ارسال شده</option>
                                                                <option value="delivered">تحویل شده</option>
                                                                <option value="cancelled">لغو شده</option>
                                                        </select>
                                                </div>

                                                {statusForm.status === 'shipped' && (
                                                        <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">کد رهگیری</label>
                                                                <input
                                                                        type="text"
                                                                        value={statusForm.trackingNumber}
                                                                        onChange={(e) => setStatusForm(prev => ({ ...prev, trackingNumber: e.target.value }))}
                                                                        placeholder="کد رهگیری پستی..."
                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                                />
                                                        </div>
                                                )}

                                                <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">یادداشت (اختیاری)</label>
                                                        <textarea
                                                                value={statusForm.note}
                                                                onChange={(e) => setStatusForm(prev => ({ ...prev, note: e.target.value }))}
                                                                placeholder="یادداشت یا توضیحات اضافی..."
                                                                rows={3}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                        />
                                                </div>
                </div>
                                )}
                        </Modal>
                </ErrorBoundary>
        );
};

export default AdminOrders; 