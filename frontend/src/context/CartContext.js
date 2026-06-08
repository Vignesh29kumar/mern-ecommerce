import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [cartLoading, setCartLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user) return;
    try {
      setCartLoading(true);
      const data = await cartAPI.getCart();
      setCart(data);
    } catch (err) {
      console.error('Fetch cart error:', err);
    } finally {
      setCartLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      fetchCart();
    } else {
      setCart({ items: [] });
    }
  }, [user, fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    const data = await cartAPI.addToCart(productId, quantity);
    setCart(data);
  };

  const removeFromCart = async (productId) => {
    const data = await cartAPI.removeFromCart(productId);
    setCart(data);
  };

  const clearCart = async () => {
    await cartAPI.clearCart();
    setCart({ items: [] });
  };

  const cartCount = cart?.items?.length || 0;

  return (
    <CartContext.Provider value={{ cart, cartLoading, addToCart, removeFromCart, clearCart, cartCount, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
