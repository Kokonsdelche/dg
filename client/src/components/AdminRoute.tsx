import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AdminRouteProps {
        children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
        const { user, isLoading } = useAuth();

        if (isLoading) {
                return (
                        <div className="min-h-screen flex items-center justify-center">
                                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
                        </div>
                );
        }

        if (!user) {
                return <Navigate to="/login" replace />;
        }

        if (!user.isAdmin) {
                return <Navigate to="/" replace />;
        }

        return <>{children}</>;
};

export default AdminRoute; 