import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType {
        user: User | null;
        token: string | null;
        login: (email: string, password: string) => Promise<void>;
        register: (userData: {
                firstName: string;
                lastName: string;
                email: string;
                phone: string;
                password: string;
        }) => Promise<void>;
        logout: () => void;
        updateUser: (userData: Partial<User>) => void;
        isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
        const context = useContext(AuthContext);
        if (context === undefined) {
                throw new Error('useAuth must be used within an AuthProvider');
        }
        return context;
};

interface AuthProviderProps {
        children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
        const [user, setUser] = useState<User | null>(null);
        const [token, setToken] = useState<string | null>(null);
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
                const initAuth = async () => {
                        const storedToken = localStorage.getItem('token');
                        const storedUser = localStorage.getItem('user');

                        if (storedToken && storedUser) {
                                setToken(storedToken);
                                setUser(JSON.parse(storedUser));

                                // Verify token is still valid
                                try {
                                        const response = await authAPI.getProfile();
                                        setUser(response.user);
                                        localStorage.setItem('user', JSON.stringify(response.user));
                                } catch (error) {
                                        // Token is invalid, clear storage
                                        localStorage.removeItem('token');
                                        localStorage.removeItem('user');
                                        setToken(null);
                                        setUser(null);
                                }
                        }
                        setIsLoading(false);
                };

                initAuth();
        }, []);

        const login = async (email: string, password: string) => {
                try {
                        const response = await authAPI.login({ email, password });
                        setToken(response.token);
                        setUser(response.user);
                        localStorage.setItem('token', response.token);
                        localStorage.setItem('user', JSON.stringify(response.user));
                } catch (error) {
                        throw error;
                }
        };

        const register = async (userData: {
                firstName: string;
                lastName: string;
                email: string;
                phone: string;
                password: string;
        }) => {
                try {
                        const response = await authAPI.register(userData);
                        setToken(response.token);
                        setUser(response.user);
                        localStorage.setItem('token', response.token);
                        localStorage.setItem('user', JSON.stringify(response.user));
                } catch (error) {
                        throw error;
                }
        };

        const logout = () => {
                setToken(null);
                setUser(null);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
        };

        const updateUser = (userData: Partial<User>) => {
                if (user) {
                        const updatedUser = { ...user, ...userData };
                        setUser(updatedUser);
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                }
        };

        const value = {
                user,
                token,
                login,
                register,
                logout,
                updateUser,
                isLoading,
        };

        return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 