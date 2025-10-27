import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  // --- CART STATE ---
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem("cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // --- ORDERS STATE ---
  const [orders, setOrders] = useState(() => {
    try {
      const raw = localStorage.getItem("orders");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // --- SYNC TO LOCALSTORAGE ---
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch {}
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem("orders", JSON.stringify(orders));
    } catch {}
  }, [orders]);

  // --- CART FUNCTIONS ---
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

  // --- PLACE ORDER ---
  const placeOrder = (deliveryType = "delivery") => {
    if (items.length === 0) return null;

    const newOrder = {
      id: `ORD-${Date.now()}`,
      status: "preparing",
      createdAt: new Date().toISOString(),
      deliveryType,
      items,
      total,
      driver: null,
    };

    setOrders((prev) => [...prev, newOrder]);
    clearCart(); // Vacía el carrito después de hacer pedido
    return newOrder;
  };

  // --- GET LAST FIVE ORDERS ---
  const getLastFiveOrders = () => {
    return [...orders].slice(-5).reverse();
  };

  // --- SIMULATE ORDER STATUS UPDATES ---
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prev) =>
        prev.map((order) =>
          order.status === "preparing"
            ? {
                ...order,
                status: "out-for-delivery",
                driver: { name: "Mike Johnson", vehicle: "Honda Civic - ABC 123" },
              }
            : order.status === "out-for-delivery"
            ? { ...order, status: "delivered" }
            : order
        )
      );
    }, 30000); // cada 30 segundos cambia el estado

    return () => clearInterval(interval);
  }, []);

  // --- CART CALCULATIONS ---
  const { cartCount, subtotal, total } = useMemo(() => {
    const cartCount = items.reduce((n, i) => n + (i.qty || 1), 0);
    const subtotal = items.reduce(
      (sum, i) => sum + (i.product?.price || 0) * (i.qty || 1),
      0
    );
    const total = subtotal;
    return { cartCount, subtotal, total };
  }, [items]);

  // --- CONTEXT VALUE ---
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
      orders,
      placeOrder,
      setOrders,
      getLastFiveOrders,
    }),
    [items, cartCount, subtotal, total, orders]
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
