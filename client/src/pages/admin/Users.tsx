import React, { useState } from 'react';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';
import DataTable, { Column } from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import Modal from '../../components/admin/Modal';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import ErrorBoundary from '../../components/ErrorBoundary';
import { useAdminUsers } from '../../hooks/useAdminUsers';
import { User } from '../../store/adminStore';
import toast from 'react-hot-toast';

const AdminUsers: React.FC = () => {
        const {
                users,
                loading,
                error,
                filters,
                stats,
                searchUsers,
                filterByStatus,
                filterByRole,
                changePage,
                changeUserStatus,
                updateUserRole,
                deleteUser,
                bulkUpdateStatus,
                resetFilters
        } = useAdminUsers();

        const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
        const [showUserDetail, setShowUserDetail] = useState<User | null>(null);
        const [showRoleModal, setShowRoleModal] = useState<User | null>(null);
        const [showDeleteModal, setShowDeleteModal] = useState<User | null>(null);
        const [roleForm, setRoleForm] = useState({
                role: '' as 'user' | 'admin'
        });

        // Format date
        const formatDate = (dateString: string) => {
                return format(new Date(dateString), 'dd MMM yyyy', { locale: faIR });
        };

        // Handle bulk operations
        const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete') => {
                if (selectedUsers.length === 0) {
                        toast.error('لطفاً کاربرانی را انتخاب کنید');
                        return;
                }

                const userIds = selectedUsers.map(user => user._id);
                await bulkUpdateStatus(userIds, action);
                setSelectedUsers([]);
        };

        // Handle role change
        const handleRoleChange = async () => {
                if (!showRoleModal || !roleForm.role) {
                        toast.error('لطفاً نقش جدید را انتخاب کنید');
                        return;
                }

                await updateUserRole(showRoleModal._id, roleForm.role);
                setShowRoleModal(null);
                setRoleForm({ role: '' as 'user' | 'admin' });
        };

        // Handle delete confirmation
        const handleDeleteConfirm = async () => {
                if (!showDeleteModal) return;

                await deleteUser(showDeleteModal._id);
                setShowDeleteModal(null);
        };

        // Table columns
        const columns: Column<User>[] = [
                {
                        key: '_id',
                        title: 'شناسه',
                        width: '100px',
                        render: (value) => (
                                <span className="font-mono text-gray-500 text-xs">
                                        #{value?.slice(-6) || 'N/A'}
                                </span>
                        )
                },
                {
                        key: 'firstName',
                        title: 'نام کاربر',
                        width: '200px',
                        sortable: true,
                        render: (_, user) => (
                                <div>
                                        <div className="font-medium text-gray-900">
                                                {user.firstName} {user.lastName}
                                        </div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                        )
                },
                {
                        key: 'phone',
                        title: 'تلفن',
                        width: '130px',
                        render: (phone) => (
                                <span className="font-mono text-gray-700">
                                        {phone || '-'}
                                </span>
                        )
                },
                {
                        key: 'isActive',
                        title: 'وضعیت',
                        width: '100px',
                        render: (isActive) => (
                                <StatusBadge
                                        status={isActive ? 'active' : 'inactive'}
                                        type="user"
                                        size="sm"
                                />
                        )
                },
                {
                        key: 'isAdmin',
                        title: 'نقش',
                        width: '100px',
                        render: (isAdmin) => (
                                <span className={`
          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
          ${isAdmin
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }
        `}>
                                        {isAdmin ? 'مدیر' : 'کاربر'}
                                </span>
                        )
                },
                {
                        key: 'createdAt',
                        title: 'تاریخ عضویت',
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
                                                                        <h1 className="text-3xl font-bold text-gray-800">مدیریت کاربران</h1>
                                                                        <p className="text-gray-600 mt-1">مدیریت اطلاعات و دسترسی‌های کاربران</p>
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
                                                <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
                                                        <div className="bg-white rounded-lg shadow-md p-6">
                                                                <div className="flex items-center">
                                                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                                                <span className="text-2xl">👥</span>
                                                                        </div>
                                                                        <div className="mr-4">
                                                                                <h3 className="text-sm font-medium text-gray-500">کل کاربران</h3>
                                                                                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                                                                        </div>
                                                                </div>
                                                        </div>

                                                        <div className="bg-white rounded-lg shadow-md p-6">
                                                                <div className="flex items-center">
                                                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                                                                <span className="text-2xl">✅</span>
                                                                        </div>
                                                                        <div className="mr-4">
                                                                                <h3 className="text-sm font-medium text-gray-500">فعال</h3>
                                                                                <p className="text-2xl font-bold text-gray-800">{stats.active}</p>
                                                                        </div>
                                                                </div>
                                                        </div>

                                                        <div className="bg-white rounded-lg shadow-md p-6">
                                                                <div className="flex items-center">
                                                                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                                                <span className="text-2xl">⏸️</span>
                                                                        </div>
                                                                        <div className="mr-4">
                                                                                <h3 className="text-sm font-medium text-gray-500">غیرفعال</h3>
                                                                                <p className="text-2xl font-bold text-gray-800">{stats.inactive}</p>
                                                                        </div>
                                                                </div>
                                                        </div>

                                                        <div className="bg-white rounded-lg shadow-md p-6">
                                                                <div className="flex items-center">
                                                                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                                                                <span className="text-2xl">👑</span>
                                                                        </div>
                                                                        <div className="mr-4">
                                                                                <h3 className="text-sm font-medium text-gray-500">مدیران</h3>
                                                                                <p className="text-2xl font-bold text-gray-800">{stats.admins}</p>
                                                                        </div>
                                                                </div>
                                                        </div>

                                                        <div className="bg-white rounded-lg shadow-md p-6">
                                                                <div className="flex items-center">
                                                                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                                                                <span className="text-2xl">📅</span>
                                                                        </div>
                                                                        <div className="mr-4">
                                                                                <h3 className="text-sm font-medium text-gray-500">امروز</h3>
                                                                                <p className="text-2xl font-bold text-gray-800">{stats.newToday}</p>
                                                                        </div>
                                                                </div>
                                                        </div>

                                                        <div className="bg-white rounded-lg shadow-md p-6">
                                                                <div className="flex items-center">
                                                                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                                                                <span className="text-2xl">📊</span>
                                                                        </div>
                                                                        <div className="mr-4">
                                                                                <h3 className="text-sm font-medium text-gray-500">این هفته</h3>
                                                                                <p className="text-2xl font-bold text-gray-800">{stats.newThisWeek}</p>
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
                                                                                onChange={(e) => searchUsers(e.target.value)}
                                                                                placeholder="نام، ایمیل یا تلفن..."
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
                                                                                <option value="active">فعال</option>
                                                                                <option value="inactive">غیرفعال</option>
                                                                        </select>
                                                                </div>

                                                                <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">نقش</label>
                                                                        <select
                                                                                value={filters.role}
                                                                                onChange={(e) => filterByRole(e.target.value)}
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                                        >
                                                                                <option value="all">همه نقش‌ها</option>
                                                                                <option value="user">کاربر عادی</option>
                                                                                <option value="admin">مدیر</option>
                                                                        </select>
                                                                </div>

                                                                <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">عملیات انبوه</label>
                                                                        <div className="flex gap-2">
                                                                                <button
                                                                                        onClick={() => handleBulkAction('activate')}
                                                                                        disabled={selectedUsers.length === 0}
                                                                                        className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                                                >
                                                                                        فعال ({selectedUsers.length})
                                                                                </button>
                                                                                <button
                                                                                        onClick={() => handleBulkAction('deactivate')}
                                                                                        disabled={selectedUsers.length === 0}
                                                                                        className="flex-1 px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                                                >
                                                                                        غیرفعال ({selectedUsers.length})
                                                                                </button>
                                                                                <button
                                                                                        onClick={() => handleBulkAction('delete')}
                                                                                        disabled={selectedUsers.length === 0}
                                                                                        className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                                                >
                                                                                        حذف ({selectedUsers.length})
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

                                                {/* Users Table */}
                                                <DataTable
                                                        data={users}
                                                        columns={columns}
                                                        loading={loading}
                                                        emptyMessage="هیچ کاربری یافت نشد"
                                                        selectedItems={selectedUsers}
                                                        onSelectionChange={setSelectedUsers}
                                                        onView={(user) => setShowUserDetail(user)}
                                                        actions={(user) => (
                                                                <div className="flex items-center gap-2">
                                                                        <button
                                                                                onClick={() => setShowUserDetail(user)}
                                                                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                                title="مشاهده جزئیات"
                                                                        >
                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                                </svg>
                                                                        </button>
                                                                        <button
                                                                                onClick={() => changeUserStatus(user._id)}
                                                                                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                                                title={user.isActive ? 'غیرفعال کردن' : 'فعال کردن'}
                                                                        >
                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                                                                                </svg>
                                                                        </button>
                                                                        <button
                                                                                onClick={() => {
                                                                                        setShowRoleModal(user);
                                                                                        setRoleForm({ role: user.isAdmin ? 'admin' : 'user' });
                                                                                }}
                                                                                className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                                                title="تغییر نقش"
                                                                        >
                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                                </svg>
                                                                        </button>
                                                                        <button
                                                                                onClick={() => setShowDeleteModal(user)}
                                                                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                                title="حذف کاربر"
                                                                        >
                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                                </svg>
                                                                        </button>
                                                                </div>
                                                        )}
                                                />
                                        </div>
                                </div>
                        </div>

                        {/* User Detail Modal */}
                        <Modal
                                isOpen={!!showUserDetail}
                                onClose={() => setShowUserDetail(null)}
                                title={`جزئیات کاربر: ${showUserDetail?.firstName || ''} ${showUserDetail?.lastName || ''}`}
                                size="lg"
                        >
                                {showUserDetail && (
                                        <div className="space-y-6">
                                                {/* Basic Info */}
                                                <div className="bg-gray-50 rounded-lg p-4">
                                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">اطلاعات شخصی</h3>
                                                        <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                        <span className="text-sm text-gray-500">نام:</span>
                                                                        <p className="font-medium">{showUserDetail.firstName}</p>
                                                                </div>
                                                                <div>
                                                                        <span className="text-sm text-gray-500">نام خانوادگی:</span>
                                                                        <p className="font-medium">{showUserDetail.lastName}</p>
                                                                </div>
                                                                <div>
                                                                        <span className="text-sm text-gray-500">ایمیل:</span>
                                                                        <p className="font-medium">{showUserDetail.email}</p>
                                                                </div>
                                                                <div>
                                                                        <span className="text-sm text-gray-500">تلفن:</span>
                                                                        <p className="font-medium">{showUserDetail.phone || '-'}</p>
                                                                </div>
                                                                <div>
                                                                        <span className="text-sm text-gray-500">وضعیت:</span>
                                                                        <div className="mt-1">
                                                                                <StatusBadge
                                                                                        status={showUserDetail.isActive ? 'active' : 'inactive'}
                                                                                        type="user"
                                                                                        size="sm"
                                                                                />
                                                                        </div>
                                                                </div>
                                                                <div>
                                                                        <span className="text-sm text-gray-500">نقش:</span>
                                                                        <p className="font-medium">{showUserDetail.isAdmin ? 'مدیر' : 'کاربر عادی'}</p>
                                                                </div>
                                                                <div>
                                                                        <span className="text-sm text-gray-500">تاریخ عضویت:</span>
                                                                        <p className="font-medium">{formatDate(showUserDetail.createdAt)}</p>
                                                                </div>
                                                                <div>
                                                                        <span className="text-sm text-gray-500">آخرین بروزرسانی:</span>
                                                                        <p className="font-medium">{formatDate(showUserDetail.updatedAt)}</p>
                                                                </div>
                                                        </div>
                                                </div>

                                                {/* Address Info */}
                                                {showUserDetail.address && (
                                                        <div className="bg-gray-50 rounded-lg p-4">
                                                                <h3 className="text-lg font-semibold text-gray-800 mb-3">آدرس</h3>
                                                                <p className="text-gray-700">
                                                                        {showUserDetail.address.street}, {showUserDetail.address.city}, {showUserDetail.address.state}
                                                                        <br />
                                                                        کد پستی: {showUserDetail.address.postalCode}
                                                                </p>
                                                        </div>
                                                )}
                                        </div>
                                )}
                        </Modal>

                        {/* Role Change Modal */}
                        <Modal
                                isOpen={!!showRoleModal}
                                onClose={() => {
                                        setShowRoleModal(null);
                                        setRoleForm({ role: '' as 'user' | 'admin' });
                                }}
                                title={`تغییر نقش کاربر: ${showRoleModal?.firstName || ''} ${showRoleModal?.lastName || ''}`}
                                size="md"
                                actions={
                                        <>
                                                <button
                                                        onClick={() => setShowRoleModal(null)}
                                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                        انصراف
                                                </button>
                                                <button
                                                        onClick={handleRoleChange}
                                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                                >
                                                        تایید تغییر
                                                </button>
                                        </>
                                }
                        >
                                {showRoleModal && (
                                        <div className="space-y-4">
                                                <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">نقش جدید</label>
                                                        <select
                                                                value={roleForm.role}
                                                                onChange={(e) => setRoleForm({ role: e.target.value as 'user' | 'admin' })}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                        >
                                                                <option value="user">کاربر عادی</option>
                                                                <option value="admin">مدیر</option>
                                                        </select>
                                                </div>
                                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                                        <p className="text-sm text-yellow-800">
                                                                <strong>توجه:</strong> تغییر نقش کاربر ممکن است دسترسی‌های او را تغییر دهد.
                                                        </p>
                                                </div>
                                        </div>
                                )}
                        </Modal>

                        {/* Delete Confirmation Modal */}
                        <Modal
                                isOpen={!!showDeleteModal}
                                onClose={() => setShowDeleteModal(null)}
                                title="تایید حذف کاربر"
                                size="md"
                                actions={
                                        <>
                                                <button
                                                        onClick={() => setShowDeleteModal(null)}
                                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                        انصراف
                                                </button>
                                                <button
                                                        onClick={handleDeleteConfirm}
                                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                >
                                                        تایید حذف
                                                </button>
                                        </>
                                }
                        >
                                {showDeleteModal && (
                                        <div className="space-y-4">
                                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                        <p className="text-red-800">
                                                                آیا مطمئن هستید که می‌خواهید کاربر <strong>{showDeleteModal.firstName} {showDeleteModal.lastName}</strong> را حذف کنید؟
                                                        </p>
                                                        <p className="text-sm text-red-600 mt-2">
                                                                این عمل قابل بازگشت نیست و تمام اطلاعات مربوط به این کاربر حذف خواهد شد.
                                                        </p>
                                                </div>
                </div>
                                )}
                        </Modal>
                </ErrorBoundary>
        );
};

export default AdminUsers; 