import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem("cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch {}
  }, [items]);

  const addToCart = (product, options = {}, qty = 1) => {
    const { size, customizations, ingredients = [] } = options;

    setItems((prev) => {
      const idx = prev.findIndex(
        (i) =>
          i.product?.id === product?.id &&
          JSON.stringify(i.ingredients || []) === JSON.stringify(ingredients || []) &&
          i.size === size
      );

      if (idx >= 0) {
        const next = [...prev];
        next[idx].qty = (next[idx].qty || 1) + qty;
        return next;
      }

      return [
        ...prev,
        {
          id: Date.now(),
          product,
          size,
          customizations,
          ingredients,
          qty,
        },
      ];
    });
  };

  const updateQty = (id, qty) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))
    );

  const removeFromCart = (id) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  const clearCart = () => setItems([]);


  const { cartCount, subtotal, total } = useMemo(() => {
    const cartCount = items.reduce((n, i) => n + (i.qty || 1), 0);
    const subtotal = items.reduce(
      (sum, i) => sum + (i.product?.price || 0) * (i.qty || 1),
      0
    );
    const total = subtotal;
    return { cartCount, subtotal, total };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      cartCount,
      subtotal,
      total,
    }),
    [items, cartCount, subtotal, total]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx)
    throw new Error("useCart must be used within a CartProvider");
  return ctx;
};
