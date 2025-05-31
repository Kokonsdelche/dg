import React, { useState, useRef, useEffect } from 'react';
import { format, startOfDay, endOfDay, subDays, subWeeks, subMonths } from 'date-fns';
import { faIR } from 'date-fns/locale';

interface DateRangePickerProps {
        startDate: Date;
        endDate: Date;
        onChange: (startDate: Date, endDate: Date) => void;
        className?: string;
        disabled?: boolean;
}

interface Preset {
        label: string;
        value: () => { start: Date; end: Date };
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
        startDate,
        endDate,
        onChange,
        className = '',
        disabled = false
}) => {
        const [isOpen, setIsOpen] = useState(false);
        const [tempStartDate, setTempStartDate] = useState(startDate);
        const [tempEndDate, setTempEndDate] = useState(endDate);
        const [activeInput, setActiveInput] = useState<'start' | 'end' | null>(null);
        const dropdownRef = useRef<HTMLDivElement>(null);

        // Predefined date ranges
        const presets: Preset[] = [
                {
                        label: '۷ روز اخیر',
                        value: () => ({
                                start: startOfDay(subDays(new Date(), 6)),
                                end: endOfDay(new Date())
                        })
                },
                {
                        label: '۱۵ روز اخیر',
                        value: () => ({
                                start: startOfDay(subDays(new Date(), 14)),
                                end: endOfDay(new Date())
                        })
                },
                {
                        label: '۳۰ روز اخیر',
                        value: () => ({
                                start: startOfDay(subDays(new Date(), 29)),
                                end: endOfDay(new Date())
                        })
                },
                {
                        label: 'این هفته',
                        value: () => ({
                                start: startOfDay(subDays(new Date(), new Date().getDay())),
                                end: endOfDay(new Date())
                        })
                },
                {
                        label: 'هفته گذشته',
                        value: () => {
                                const today = new Date();
                                const currentWeekStart = subDays(today, today.getDay());
                                return {
                                        start: startOfDay(subWeeks(currentWeekStart, 1)),
                                        end: endOfDay(subDays(currentWeekStart, 1))
                                };
                        }
                },
                {
                        label: 'این ماه',
                        value: () => ({
                                start: startOfDay(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
                                end: endOfDay(new Date())
                        })
                },
                {
                        label: 'ماه گذشته',
                        value: () => {
                                const today = new Date();
                                const firstDayThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                                const lastDayLastMonth = subDays(firstDayThisMonth, 1);
                                const firstDayLastMonth = new Date(lastDayLastMonth.getFullYear(), lastDayLastMonth.getMonth(), 1);
                                return {
                                        start: startOfDay(firstDayLastMonth),
                                        end: endOfDay(lastDayLastMonth)
                                };
                        }
                }
        ];

        // Close dropdown when clicking outside
        useEffect(() => {
                const handleClickOutside = (event: MouseEvent) => {
                        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                                setIsOpen(false);
                                setActiveInput(null);
                        }
                };

                document.addEventListener('mousedown', handleClickOutside);
                return () => {
                        document.removeEventListener('mousedown', handleClickOutside);
                };
        }, []);

        // Apply date range
        const applyDateRange = () => {
                onChange(tempStartDate, tempEndDate);
                setIsOpen(false);
                setActiveInput(null);
        };

        // Cancel selection
        const cancelSelection = () => {
                setTempStartDate(startDate);
                setTempEndDate(endDate);
                setIsOpen(false);
                setActiveInput(null);
        };

        // Select preset
        const selectPreset = (preset: Preset) => {
                const { start, end } = preset.value();
                setTempStartDate(start);
                setTempEndDate(end);
                onChange(start, end);
                setIsOpen(false);
                setActiveInput(null);
        };

        // Format date for display
        const formatDisplayDate = (date: Date) => {
                return format(date, 'yyyy/MM/dd', { locale: faIR });
        };

        // Convert Date to input format (YYYY-MM-DD)
        const formatInputDate = (date: Date) => {
                return format(date, 'yyyy-MM-dd');
        };

        // Parse input date
        const parseInputDate = (dateString: string) => {
                return new Date(dateString);
        };

        return (
                <div className={`relative ${className}`} ref={dropdownRef}>
                        {/* Trigger Button */}
                        <button
                                type="button"
                                onClick={() => !disabled && setIsOpen(!isOpen)}
                                disabled={disabled}
                                className={`
          flex items-center justify-between w-full px-4 py-2 text-sm border rounded-lg
          ${disabled
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer'
                                        }
        `}
                        >
                                <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>
                                                {formatDisplayDate(startDate)} - {formatDisplayDate(endDate)}
                                        </span>
                                </div>
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                        </button>

                        {/* Dropdown */}
                        {isOpen && !disabled && (
                                <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-96">
                                        <div className="p-4">
                                                {/* Quick Presets */}
                                                <div className="mb-4">
                                                        <h3 className="text-sm font-medium text-gray-700 mb-2">بازه‌های آماده</h3>
                                                        <div className="grid grid-cols-2 gap-2">
                                                                {presets.map((preset, index) => (
                                                                        <button
                                                                                key={index}
                                                                                type="button"
                                                                                onClick={() => selectPreset(preset)}
                                                                                className="px-3 py-2 text-xs text-gray-600 hover:bg-purple-50 hover:text-purple-700 rounded border border-gray-200 hover:border-purple-200 transition-colors"
                                                                        >
                                                                                {preset.label}
                                                                        </button>
                                                                ))}
                                                        </div>
                                                </div>

                                                {/* Manual Date Selection */}
                                                <div className="border-t pt-4">
                                                        <h3 className="text-sm font-medium text-gray-700 mb-3">انتخاب دستی</h3>
                                                        <div className="space-y-3">
                                                                {/* Start Date */}
                                                                <div>
                                                                        <label className="block text-xs text-gray-600 mb-1">از تاریخ</label>
                                                                        <input
                                                                                type="date"
                                                                                value={formatInputDate(tempStartDate)}
                                                                                onChange={(e) => {
                                                                                        const newDate = parseInputDate(e.target.value);
                                                                                        setTempStartDate(startOfDay(newDate));
                                                                                        if (newDate > tempEndDate) {
                                                                                                setTempEndDate(endOfDay(newDate));
                                                                                        }
                                                                                }}
                                                                                onFocus={() => setActiveInput('start')}
                                                                                className={`w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${activeInput === 'start' ? 'border-purple-500 ring-2 ring-purple-500' : 'border-gray-300'
                                                                                        }`}
                                                                        />
                                                                </div>

                                                                {/* End Date */}
                                                                <div>
                                                                        <label className="block text-xs text-gray-600 mb-1">تا تاریخ</label>
                                                                        <input
                                                                                type="date"
                                                                                value={formatInputDate(tempEndDate)}
                                                                                onChange={(e) => {
                                                                                        const newDate = parseInputDate(e.target.value);
                                                                                        setTempEndDate(endOfDay(newDate));
                                                                                        if (newDate < tempStartDate) {
                                                                                                setTempStartDate(startOfDay(newDate));
                                                                                        }
                                                                                }}
                                                                                onFocus={() => setActiveInput('end')}
                                                                                className={`w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${activeInput === 'end' ? 'border-purple-500 ring-2 ring-purple-500' : 'border-gray-300'
                                                                                        }`}
                                                                        />
                                                                </div>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
                                                                <button
                                                                        type="button"
                                                                        onClick={cancelSelection}
                                                                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                                                                >
                                                                        انصراف
                                                                </button>
                                                                <button
                                                                        type="button"
                                                                        onClick={applyDateRange}
                                                                        className="px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded transition-colors"
                                                                >
                                                                        اعمال
                                                                </button>
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        )}
                </div>
        );
};

export default DateRangePicker; 