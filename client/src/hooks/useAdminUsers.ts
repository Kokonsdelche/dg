import { useCallback, useEffect } from 'react';
import { useAdminStore, useUsersData, useAdminActions, User } from '../store/adminStore';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useAdminUsers = () => {
        const { users, loading, error, filters } = useUsersData();
        const {
                setUsers,
                setUsersLoading,
                setUsersError,
                setUserFilters,
                toggleUserStatus,
                resetUsersState
        } = useAdminActions();

        // Fetch users with filters
        const fetchUsers = useCallback(async (customFilters?: Partial<typeof filters>) => {
                setUsersLoading(true);
                setUsersError(null);

                try {
                        const params = {
                                page: filters.page,
                                limit: filters.limit,
                                status: filters.status !== 'all' ? filters.status : undefined,
                                role: filters.role !== 'all' ? filters.role : undefined,
                                search: filters.search || undefined,
                                ...customFilters
                        };

                        const response = await adminAPI.getUsers(params);
                        const usersData = response.data?.data?.users || response.data?.users || response.data || [];
                        setUsers(usersData);
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || err.message || 'خطا در دریافت کاربران';
                        setUsersError(errorMessage);
                        toast.error(errorMessage);
                } finally {
                        setUsersLoading(false);
                }
        }, [filters, setUsers, setUsersLoading, setUsersError]);

        // Toggle user status (active/inactive)
        const changeUserStatus = useCallback(async (userId: string) => {
                try {
                        await adminAPI.toggleUserStatus(userId);

                        // Update local state
                        toggleUserStatus(userId);

                        toast.success('وضعیت کاربر با موفقیت تغییر یافت');

                        // Refresh users list
                        fetchUsers();
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || err.message || 'خطا در تغییر وضعیت کاربر';
                        toast.error(errorMessage);
                }
        }, [toggleUserStatus, fetchUsers]);

        // Update user role
        const updateUserRole = useCallback(async (userId: string, newRole: 'user' | 'admin') => {
                try {
                        await adminAPI.updateUserRole(userId, newRole);

                        toast.success('نقش کاربر با موفقیت تغییر یافت');

                        // Refresh users list
                        fetchUsers();
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || err.message || 'خطا در تغییر نقش کاربر';
                        toast.error(errorMessage);
                }
        }, [fetchUsers]);

        // Delete user
        const deleteUser = useCallback(async (userId: string) => {
                try {
                        await adminAPI.deleteUser(userId);

                        toast.success('کاربر با موفقیت حذف شد');

                        // Refresh users list
                        fetchUsers();
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || err.message || 'خطا در حذف کاربر';
                        toast.error(errorMessage);
                }
        }, [fetchUsers]);

        // Update filters
        const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
                setUserFilters(newFilters);
        }, [setUserFilters]);

        // Search users
        const searchUsers = useCallback((searchTerm: string) => {
                updateFilters({ search: searchTerm, page: 1 });
        }, [updateFilters]);

        // Filter by status
        const filterByStatus = useCallback((status: string) => {
                updateFilters({ status, page: 1 });
        }, [updateFilters]);

        // Filter by role
        const filterByRole = useCallback((role: string) => {
                updateFilters({ role, page: 1 });
        }, [updateFilters]);

        // Change page
        const changePage = useCallback((page: number) => {
                updateFilters({ page });
        }, [updateFilters]);

        // Reset filters
        const resetFilters = useCallback(() => {
                updateFilters({
                        status: 'all',
                        role: 'all',
                        search: '',
                        page: 1
                });
        }, [updateFilters]);

        // Bulk status update
        const bulkUpdateStatus = useCallback(async (
                userIds: string[],
                action: 'activate' | 'deactivate' | 'delete'
        ) => {
                try {
                        setUsersLoading(true);

                        if (action === 'delete') {
                                // Delete multiple users
                                await Promise.all(
                                        userIds.map(userId => adminAPI.deleteUser(userId))
                                );
                                toast.success(`${userIds.length} کاربر با موفقیت حذف شد`);
                        } else {
                                // Toggle status for users that need it
                                await Promise.all(
                                        userIds.map(userId => adminAPI.toggleUserStatus(userId))
                                );
                                const actionText = action === 'activate' ? 'فعال' : 'غیرفعال';
                                toast.success(`${userIds.length} کاربر ${actionText} شد`);
                        }

                        // Refresh users
                        fetchUsers();
                } catch (err: any) {
                        const errorMessage = err.response?.data?.message || err.message || 'خطا در به‌روزرسانی انبوه';
                        toast.error(errorMessage);
                } finally {
                        setUsersLoading(false);
                }
        }, [fetchUsers, setUsersLoading]);

        // Get user statistics
        const getUserStats = useCallback(() => {
                return {
                        total: users.length,
                        active: users.filter(u => u.isActive).length,
                        inactive: users.filter(u => !u.isActive).length,
                        admins: users.filter(u => u.isAdmin).length,
                        regularUsers: users.filter(u => !u.isAdmin).length,
                        newToday: users.filter(u => {
                                const today = new Date();
                                const userDate = new Date(u.createdAt);
                                return userDate.toDateString() === today.toDateString();
                        }).length,
                        newThisWeek: users.filter(u => {
                                const weekAgo = new Date();
                                weekAgo.setDate(weekAgo.getDate() - 7);
                                const userDate = new Date(u.createdAt);
                                return userDate >= weekAgo;
                        }).length,
                };
        }, [users]);

        // Auto-fetch on mount and filter changes
        useEffect(() => {
                fetchUsers();
        }, [filters.page, filters.status, filters.role, filters.search]);

        // Cleanup on unmount
        useEffect(() => {
                return () => {
                        resetUsersState();
                };
        }, [resetUsersState]);

        return {
                // Data
                users,
                loading,
                error,
                filters,
                stats: getUserStats(),

                // Actions
                fetchUsers,
                changeUserStatus,
                updateUserRole,
                deleteUser,
                updateFilters,
                searchUsers,
                filterByStatus,
                filterByRole,
                changePage,
                resetFilters,
                bulkUpdateStatus,

                // Utility
                refresh: () => fetchUsers(),
                reset: resetUsersState
        };
}; 