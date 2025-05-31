import React, { useState, useMemo } from 'react';
import LoadingSpinner from './LoadingSpinner';
import StatusBadge from './StatusBadge';

export interface Column<T> {
        key: keyof T | 'actions';
        title: string;
        width?: string;
        sortable?: boolean;
        render?: (value: any, item: T, index: number) => React.ReactNode;
        className?: string;
}

interface DataTableProps<T> {
        data: T[];
        columns: Column<T>[];
        loading?: boolean;
        emptyMessage?: string;
        onEdit?: (item: T) => void;
        onDelete?: (item: T) => void;
        onView?: (item: T) => void;
        selectedItems?: T[];
        onSelectionChange?: (selectedItems: T[]) => void;
        pagination?: {
                currentPage: number;
                totalPages: number;
                onPageChange: (page: number) => void;
        };
        className?: string;
        rowClassName?: (item: T, index: number) => string;
        actions?: (item: T) => React.ReactNode;
}

function DataTable<T extends { _id: string }>({
        data,
        columns,
        loading = false,
        emptyMessage = 'داده‌ای یافت نشد',
        onEdit,
        onDelete,
        onView,
        selectedItems = [],
        onSelectionChange,
        pagination,
        className = '',
        rowClassName,
        actions
}: DataTableProps<T>) {
        const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
        const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

        // Handle sorting
        const sortedData = useMemo(() => {
                if (!sortColumn) return data;

                return [...data].sort((a, b) => {
                        const aValue = a[sortColumn];
                        const bValue = b[sortColumn];

                        if (typeof aValue === 'string' && typeof bValue === 'string') {
                                const comparison = aValue.localeCompare(bValue, 'fa');
                                return sortDirection === 'asc' ? comparison : -comparison;
                        }

                        if (typeof aValue === 'number' && typeof bValue === 'number') {
                                return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
                        }

                        return 0;
                });
        }, [data, sortColumn, sortDirection]);

        const handleSort = (column: Column<T>) => {
                if (!column.sortable) return;

                const columnKey = column.key as keyof T;
                if (sortColumn === columnKey) {
                        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                } else {
                        setSortColumn(columnKey);
                        setSortDirection('asc');
                }
        };

        const handleSelectAll = (checked: boolean) => {
                if (!onSelectionChange) return;
                onSelectionChange(checked ? [...data] : []);
        };

        const handleSelectItem = (item: T, checked: boolean) => {
                if (!onSelectionChange) return;

                if (checked) {
                        onSelectionChange([...selectedItems, item]);
                } else {
                        onSelectionChange(selectedItems.filter(selected => selected._id !== item._id));
                }
        };

        const isAllSelected = selectedItems.length === data.length && data.length > 0;
        const isIndeterminate = selectedItems.length > 0 && selectedItems.length < data.length;

        if (loading) {
                return (
                        <div className="bg-white rounded-lg shadow-md">
                                <LoadingSpinner size="lg" text="در حال بارگذاری..." />
                        </div>
                );
        }

        return (
                <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
                        {/* Selection Summary */}
                        {selectedItems.length > 0 && (
                                <div className="bg-purple-50 border-b border-purple-200 px-6 py-3">
                                        <p className="text-purple-800 font-medium">
                                                {selectedItems.length} مورد انتخاب شده
                                        </p>
                                </div>
                        )}

                        <div className="overflow-x-auto">
                                <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                                <tr>
                                                        {/* Selection checkbox */}
                                                        {onSelectionChange && (
                                                                <th className="px-6 py-4 text-right">
                                                                        <input
                                                                                type="checkbox"
                                                                                checked={isAllSelected}
                                                                                ref={input => {
                                                                                        if (input) input.indeterminate = isIndeterminate;
                                                                                }}
                                                                                onChange={(e) => handleSelectAll(e.target.checked)}
                                                                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                                                        />
                                                                </th>
                                                        )}

                                                        {columns.map((column, index) => (
                                                                <th
                                                                        key={index}
                                                                        className={`
                    px-6 py-4 text-right text-sm font-semibold text-gray-700
                    ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}
                    ${column.className || ''}
                  `}
                                                                        style={{ width: column.width }}
                                                                        onClick={() => handleSort(column)}
                                                                >
                                                                        <div className="flex items-center justify-between">
                                                                                {column.title}
                                                                                {column.sortable && (
                                                                                        <div className="flex flex-col ml-2">
                                                                                                <svg
                                                                                                        className={`w-3 h-3 ${sortColumn === column.key && sortDirection === 'asc'
                                                                                                                        ? 'text-purple-600'
                                                                                                                        : 'text-gray-400'
                                                                                                                }`}
                                                                                                        fill="currentColor"
                                                                                                        viewBox="0 0 20 20"
                                                                                                >
                                                                                                        <path d="M5.293 7.293L10 2.586l4.707 4.707a1 1 0 001.414-1.414L10.707.879a.997.997 0 00-1.414 0L4.879 6.293a1 1 0 101.414 1.414z" />
                                                                                                </svg>
                                                                                                <svg
                                                                                                        className={`w-3 h-3 ${sortColumn === column.key && sortDirection === 'desc'
                                                                                                                        ? 'text-purple-600'
                                                                                                                        : 'text-gray-400'
                                                                                                                }`}
                                                                                                        fill="currentColor"
                                                                                                        viewBox="0 0 20 20"
                                                                                                >
                                                                                                        <path d="M14.707 12.707L10 17.414l-4.707-4.707a1 1 0 10-1.414 1.414L9.293 19.121a.997.997 0 001.414 0l5.414-5.414a1 1 0 00-1.414-1.414z" />
                                                                                                </svg>
                                                                                        </div>
                                                                                )}
                                                                        </div>
                                                                </th>
                                                        ))}

                                                        {/* Actions column */}
                                                        {(onEdit || onDelete || onView || actions) && (
                                                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                                                                        عملیات
                                                                </th>
                                                        )}
                                                </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                                {sortedData.length === 0 ? (
                                                        <tr>
                                                                <td
                                                                        colSpan={columns.length + (onSelectionChange ? 1 : 0) + (onEdit || onDelete || onView || actions ? 1 : 0)}
                                                                        className="px-6 py-12 text-center text-gray-500"
                                                                >
                                                                        <div className="flex flex-col items-center">
                                                                                <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                                </svg>
                                                                                {emptyMessage}
                                                                        </div>
                                                                </td>
                                                        </tr>
                                                ) : (
                                                        sortedData.map((item, index) => {
                                                                const isSelected = selectedItems.some(selected => selected._id === item._id);

                                                                return (
                                                                        <tr
                                                                                key={item._id}
                                                                                className={`
                      hover:bg-gray-50 transition-colors
                      ${isSelected ? 'bg-purple-50' : ''}
                      ${rowClassName ? rowClassName(item, index) : ''}
                    `}
                                                                        >
                                                                                {/* Selection checkbox */}
                                                                                {onSelectionChange && (
                                                                                        <td className="px-6 py-4">
                                                                                                <input
                                                                                                        type="checkbox"
                                                                                                        checked={isSelected}
                                                                                                        onChange={(e) => handleSelectItem(item, e.target.checked)}
                                                                                                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                                                                                />
                                                                                        </td>
                                                                                )}

                                                                                {columns.map((column, colIndex) => (
                                                                                        <td
                                                                                                key={colIndex}
                                                                                                className={`px-6 py-4 text-sm text-gray-900 ${column.className || ''}`}
                                                                                        >
                                                                                                {column.render
                                                                                                        ? column.render(
                                                                                                                column.key === 'actions' ? null : item[column.key as keyof T],
                                                                                                                item,
                                                                                                                index
                                                                                                        )
                                                                                                        : String(item[column.key as keyof T] || '-')
                                                                                                }
                                                                                        </td>
                                                                                ))}

                                                                                {/* Actions */}
                                                                                {(onEdit || onDelete || onView || actions) && (
                                                                                        <td className="px-6 py-4">
                                                                                                <div className="flex items-center gap-2">
                                                                                                        {actions ? (
                                                                                                                actions(item)
                                                                                                        ) : (
                                                                                                                <>
                                                                                                                        {onView && (
                                                                                                                                <button
                                                                                                                                        onClick={() => onView(item)}
                                                                                                                                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                                                                                        title="مشاهده"
                                                                                                                                >
                                                                                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                                                                                        </svg>
                                                                                                                                </button>
                                                                                                                        )}
                                                                                                                        {onEdit && (
                                                                                                                                <button
                                                                                                                                        onClick={() => onEdit(item)}
                                                                                                                                        className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                                                                                                        title="ویرایش"
                                                                                                                                >
                                                                                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                                                                                        </svg>
                                                                                                                                </button>
                                                                                                                        )}
                                                                                                                        {onDelete && (
                                                                                                                                <button
                                                                                                                                        onClick={() => onDelete(item)}
                                                                                                                                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                                                                                        title="حذف"
                                                                                                                                >
                                                                                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                                                                                        </svg>
                                                                                                                                </button>
                                                                                                                        )}
                                                                                                                </>
                                                                                                        )}
                                                                                                </div>
                                                                                        </td>
                                                                                )}
                                                                        </tr>
                                                                );
                                                        })
                                                )}
                                        </tbody>
                                </table>
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                        <div className="text-sm text-gray-700">
                                                صفحه {pagination.currentPage} از {pagination.totalPages}
                                        </div>
                                        <div className="flex items-center gap-2">
                                                <button
                                                        onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                                                        disabled={pagination.currentPage <= 1}
                                                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                        قبلی
                                                </button>
                                                <button
                                                        onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                                                        disabled={pagination.currentPage >= pagination.totalPages}
                                                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                        بعدی
                                                </button>
                                        </div>
                                </div>
                        )}
                </div>
        );
}

export default DataTable; 