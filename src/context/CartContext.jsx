import React, { createContext, useContext, useState, useMemo } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('cart');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const addToCart = (product, options = {}) => {
    setItems(prev => {
      const next = [...prev, { id: Date.now(), product, options }];
      try { localStorage.setItem('cart', JSON.stringify(next)); } catch {}
      return next;
    });
    console.info('Added to cart:', product, options);
  };

  const removeFromCart = (id) => {
    setItems(prev => {
      const next = prev.filter(i => i.id !== id);
      try { localStorage.setItem('cart', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const clearCart = () => {
    setItems([]);
    try { localStorage.removeItem('cart'); } catch {}
  };

  const value = useMemo(() => ({ items, addToCart, removeFromCart, clearCart }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
};

export default CartContext;
