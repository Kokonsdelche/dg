import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
        onFileSelect: (files: File[]) => void;
        acceptedTypes?: { [key: string]: string[] };
        maxSize?: number; // in bytes
        maxFiles?: number;
        disabled?: boolean;
        className?: string;
        showPreview?: boolean;
        multiple?: boolean;
        error?: string;
}

interface FilePreview {
        file: File;
        preview: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
        onFileSelect,
        acceptedTypes = {
                'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
                'application/pdf': ['.pdf'],
                'text/*': ['.txt', '.csv'],
        },
        maxSize = 10 * 1024 * 1024, // 10MB
        maxFiles = 1,
        disabled = false,
        className = '',
        showPreview = true,
        multiple = false,
        error,
}) => {
        const [previews, setPreviews] = useState<FilePreview[]>([]);
        const [uploadError, setUploadError] = useState<string>('');

        const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
                setUploadError('');

                // Handle rejected files
                if (rejectedFiles.length > 0) {
                        const firstRejection = rejectedFiles[0];
                        if (firstRejection.errors[0]?.code === 'file-too-large') {
                                setUploadError(`حجم فایل نباید بیشتر از ${(maxSize / (1024 * 1024)).toFixed(1)} مگابایت باشد`);
                        } else if (firstRejection.errors[0]?.code === 'file-invalid-type') {
                                setUploadError('نوع فایل انتخابی پشتیبانی نمی‌شود');
                        } else if (firstRejection.errors[0]?.code === 'too-many-files') {
                                setUploadError(`حداکثر ${maxFiles} فایل مجاز است`);
                        } else {
                                setUploadError('خطا در انتخاب فایل');
                        }
                        return;
                }

                if (acceptedFiles.length > 0) {
                        onFileSelect(acceptedFiles);

                        // Create previews for images
                        if (showPreview) {
                                const newPreviews: FilePreview[] = acceptedFiles.map(file => ({
                                        file,
                                        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : ''
                                }));
                                setPreviews(newPreviews);
                        }
                }
        }, [onFileSelect, maxSize, maxFiles, showPreview]);

        const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
                onDrop,
                accept: acceptedTypes,
                maxSize,
                maxFiles,
                multiple,
                disabled,
        });

        const removePreview = useCallback((index: number) => {
                setPreviews(prev => {
                        const newPreviews = [...prev];
                        if (newPreviews[index]?.preview) {
                                URL.revokeObjectURL(newPreviews[index].preview);
                        }
                        newPreviews.splice(index, 1);
                        return newPreviews;
                });
        }, []);

        const formatFileSize = (bytes: number) => {
                if (bytes === 0) return '0 بایت';
                const k = 1024;
                const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
                const i = Math.floor(Math.log(bytes) / Math.log(k));
                return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        };

        const getBorderColor = () => {
                if (isDragReject || error || uploadError) return 'border-red-300 bg-red-50';
                if (isDragActive) return 'border-green-300 bg-green-50';
                return 'border-gray-300 hover:border-gray-400';
        };

        return (
                <div className={`space-y-4 ${className}`}>
                        {/* Upload Area */}
                        <div
                                {...getRootProps()}
                                className={`
                                        relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                                        ${getBorderColor()}
                                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                        >
                                <input {...getInputProps()} />

                                <div className="space-y-4">
                                        {/* Upload Icon */}
                                        <div className="flex justify-center">
                                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                        </div>

                                        {/* Upload Text */}
                                        <div>
                                                {isDragActive ? (
                                                        <p className="text-lg font-medium text-green-600">
                                                                فایل‌ها را اینجا رها کنید...
                                                        </p>
                                                ) : (
                                                        <div className="space-y-2">
                                                                <p className="text-lg font-medium text-gray-700">
                                                                        برای آپلود کلیک کنید یا فایل‌ها را بکشید
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                        حداکثر حجم: {formatFileSize(maxSize)}
                                                                        {multiple && ` • حداکثر ${maxFiles} فایل`}
                                                                </p>
                                                        </div>
                                                )}
                                        </div>

                                        {/* Accepted formats */}
                                        <div className="text-xs text-gray-400">
                                                فرمت‌های پشتیبانی شده: {Object.values(acceptedTypes).flat().join(', ')}
                                        </div>
                                </div>
                        </div>

                        {/* Error Messages */}
                        {(error || uploadError) && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <div className="flex items-center">
                                                <svg className="w-5 h-5 text-red-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-red-700">{error || uploadError}</span>
                                        </div>
                                </div>
                        )}

                        {/* File Previews */}
                        {showPreview && previews.length > 0 && (
                                <div className="space-y-3">
                                        <h4 className="font-medium text-gray-700">فایل‌های انتخاب شده:</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {previews.map((preview, index) => (
                                                        <div key={index} className="relative bg-white border border-gray-200 rounded-lg p-4">
                                                                {/* Remove Button */}
                                                                <button
                                                                        onClick={() => removePreview(index)}
                                                                        className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                                                                >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                        </svg>
                                                                </button>

                                                                {/* Preview Content */}
                                                                <div className="space-y-3">
                                                                        {/* Image Preview */}
                                                                        {preview.preview ? (
                                                                                <img
                                                                                        src={preview.preview}
                                                                                        alt={preview.file.name}
                                                                                        className="w-full h-32 object-cover rounded"
                                                                                />
                                                                        ) : (
                                                                                <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center">
                                                                                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                                        </svg>
                                                                                </div>
                                                                        )}

                                                                        {/* File Info */}
                                                                        <div className="space-y-1">
                                                                                <p className="text-sm font-medium text-gray-700 truncate" title={preview.file.name}>
                                                                                        {preview.file.name}
                                                                                </p>
                                                                                <p className="text-xs text-gray-500">
                                                                                        {formatFileSize(preview.file.size)}
                                                                                </p>
                                                                        </div>
                                                                </div>
                                                        </div>
                                                ))}
                                        </div>
                                </div>
                        )}
                </div>
        );
};

export default FileUpload; 