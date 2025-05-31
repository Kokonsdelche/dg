import React from 'react';

interface ErrorBoundaryState {
        hasError: boolean;
        error?: Error;
        errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
        children: React.ReactNode;
        fallback?: React.ComponentType<{ error?: Error; retry: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
        constructor(props: ErrorBoundaryProps) {
                super(props);
                this.state = { hasError: false };
        }

        static getDerivedStateFromError(error: Error): ErrorBoundaryState {
                return {
                        hasError: true,
                        error
                };
        }

        componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
                this.setState({
                        error,
                        errorInfo
                });

                // Log error to monitoring service
                console.error('ErrorBoundary caught an error:', error, errorInfo);
        }

        handleRetry = () => {
                this.setState({ hasError: false, error: undefined, errorInfo: undefined });
        };

        render() {
                if (this.state.hasError) {
                        if (this.props.fallback) {
                                const FallbackComponent = this.props.fallback;
                                return <FallbackComponent error={this.state.error} retry={this.handleRetry} />;
                        }

                        return <DefaultErrorFallback error={this.state.error} retry={this.handleRetry} />;
                }

                return this.props.children;
        }
}

interface ErrorFallbackProps {
        error?: Error;
        retry: () => void;
}

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error, retry }) => {
        return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                                <div className="mb-6">
                                        <svg
                                                className="w-16 h-16 mx-auto text-red-500 mb-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                        >
                                                <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1}
                                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L3.232 16.5c-.77.833.192 2.5 1.732 2.5z"
                                                />
                                        </svg>
                                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                                خطایی رخ داده است
                                        </h2>
                                        <p className="text-gray-600">
                                                متأسفانه مشکلی در نمایش این بخش پیش آمده است.
                                        </p>
                                </div>

                                {process.env.NODE_ENV === 'development' && error && (
                                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                                                <p className="text-sm text-red-800 font-mono break-all">
                                                        {error.message}
                                                </p>
                                        </div>
                                )}

                                <div className="space-y-3">
                                        <button
                                                onClick={retry}
                                                className="w-full px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                                        >
                                                تلاش مجدد
                                        </button>
                                        <button
                                                onClick={() => window.location.reload()}
                                                className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                                بارگذاری مجدد صفحه
                                        </button>
                                        <button
                                                onClick={() => window.history.back()}
                                                className="w-full px-6 py-3 text-gray-500 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                                بازگشت به صفحه قبل
                                        </button>
                                </div>
                        </div>
                </div>
        );
};

// Mini error boundary for smaller components
export const MiniErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
        return (
                <ErrorBoundary
                        fallback={({ error, retry }) => (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <div className="flex items-center mb-3">
                                                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-red-800 font-medium">خطا در بارگذاری</span>
                                        </div>
                                        {process.env.NODE_ENV === 'development' && error && (
                                                <p className="text-sm text-red-700 mb-3 font-mono">
                                                        {error.message}
                                                </p>
                                        )}
                                        <button
                                                onClick={retry}
                                                className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded hover:bg-red-200 transition-colors"
                                        >
                                                تلاش مجدد
                                        </button>
                                </div>
                        )}
                >
                        {children}
                </ErrorBoundary>
        );
};

export default ErrorBoundary; 