import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToastContainer: React.FC = () => {
        return (
                <Toaster
                        position="top-left"
                        reverseOrder={false}
                        gutter={8}
                        containerClassName=""
                        containerStyle={{}}
                        toastOptions={{
                                // Define default options
                                className: '',
                                duration: 4000,
                                style: {
                                        background: '#fff',
                                        color: '#374151',
                                        fontSize: '14px',
                                        fontFamily: 'system-ui, -apple-system, sans-serif',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                        borderRadius: '8px',
                                        padding: '12px 16px',
                                        maxWidth: '400px',
                                        direction: 'rtl',
                                },

                                // Default options for specific types
                                success: {
                                        duration: 3000,
                                        style: {
                                                background: '#f0f9ff',
                                                color: '#0f766e',
                                                border: '1px solid #a7f3d0',
                                        },
                                        iconTheme: {
                                                primary: '#059669',
                                                secondary: '#f0f9ff',
                                        },
                                },

                                error: {
                                        duration: 5000,
                                        style: {
                                                background: '#fef2f2',
                                                color: '#dc2626',
                                                border: '1px solid #fecaca',
                                        },
                                        iconTheme: {
                                                primary: '#dc2626',
                                                secondary: '#fef2f2',
                                        },
                                },

                                loading: {
                                        style: {
                                                background: '#fefce8',
                                                color: '#a16207',
                                                border: '1px solid #fde68a',
                                        },
                                        iconTheme: {
                                                primary: '#d97706',
                                                secondary: '#fefce8',
                                        },
                                },

                                // Custom toast types
                                custom: {
                                        style: {
                                                background: '#f8fafc',
                                                color: '#475569',
                                                border: '1px solid #e2e8f0',
                                        },
                                },
                        }}
                />
        );
};

export default ToastContainer; 