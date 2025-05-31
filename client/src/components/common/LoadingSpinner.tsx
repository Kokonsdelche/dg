import React from 'react';

interface LoadingSpinnerProps {
        size?: 'sm' | 'md' | 'lg' | 'large';
        color?: 'primary' | 'secondary' | 'white';
        text?: string;
        fullPage?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
        size = 'md',
        color = 'primary',
        text,
        fullPage = false
}) => {
        const sizeClasses = {
                sm: 'w-4 h-4',
                md: 'w-8 h-8',
                lg: 'w-12 h-12',
                large: 'w-16 h-16' // Added support for "large"
        };

        const colorClasses = {
                primary: 'border-purple-600',
                secondary: 'border-gray-600',
                white: 'border-white'
        };

        const textSizeClasses = {
                sm: 'text-sm',
                md: 'text-base',
                lg: 'text-lg',
                large: 'text-xl'
        };

        const spinner = (
                <div className="flex flex-col items-center justify-center space-y-2">
                        <div
                                className={`
          ${sizeClasses[size]}
          border-4 border-gray-200 border-t-4 ${colorClasses[color]}
          rounded-full animate-spin
        `}
                        />
                        {text && (
                                <p className={`text-gray-600 ${textSizeClasses[size]} font-medium`}>
                                        {text}
                                </p>
                        )}
                </div>
        );

        if (fullPage) {
                return (
                        <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
                                {spinner}
                        </div>
                );
        }

        return (
                <div className="flex items-center justify-center p-4">
                        {spinner}
                </div>
        );
};

export default LoadingSpinner; 