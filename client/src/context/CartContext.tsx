import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, CartContextType } from '../types';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
        const context = useContext(CartContext);
        if (context === undefined) {
                throw new Error('useCart must be used within a CartProvider');
        }
        return context;
};

interface CartProviderProps {
        children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
        const [cartItems, setCartItems] = useState<CartItem[]>([]);

        // Load cart from localStorage on mount
        useEffect(() => {
                const savedCart = localStorage.getItem('cart');
                if (savedCart) {
                        setCartItems(JSON.parse(savedCart));
                }
        }, []);

        // Save cart to localStorage whenever items change
        useEffect(() => {
                localStorage.setItem('cart', JSON.stringify(cartItems));
        }, [cartItems]);

        const addToCart = (newItem: CartItem) => {
                setCartItems(prevItems => {
                        const existingItem = prevItems.find(
                                item => item.productId === newItem.productId &&
                                        item.color === newItem.color &&
                                        item.size === newItem.size
                        );

                        if (existingItem) {
                                // Update quantity if item already exists
                                return prevItems.map(item =>
                                        item.productId === newItem.productId &&
                                                item.color === newItem.color &&
                                                item.size === newItem.size
                                                ? { ...item, quantity: item.quantity + newItem.quantity }
                                                : item
                                );
                        } else {
                                // Add new item
                                return [...prevItems, newItem];
                        }
                });
        };

        const removeFromCart = (productId: string, color?: string, size?: string) => {
                setCartItems(prevItems =>
                        prevItems.filter(item => {
                                if (item.productId !== productId) return true;
                                if (color && item.color !== color) return true;
                                if (size && item.size !== size) return true;
                                return false;
                        })
                );
        };

        const updateQuantity = (productId: string, quantity: number, color?: string, size?: string) => {
                if (quantity <= 0) {
                        removeFromCart(productId, color, size);
                        return;
                }

                setCartItems(prevItems =>
                        prevItems.map(item => {
                                if (item.productId === productId &&
                                        (!color || item.color === color) &&
                                        (!size || item.size === size)) {
                                        return { ...item, quantity };
                                }
                                return item;
                        })
                );
        };

        const clearCart = () => {
                setCartItems([]);
        };

        const getCartTotal = () => {
                return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        };

        const getCartItemsCount = () => {
                return cartItems.reduce((total, item) => total + item.quantity, 0);
        };

        const value: CartContextType = {
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartTotal,
                getCartItemsCount,
        };

        return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}; 