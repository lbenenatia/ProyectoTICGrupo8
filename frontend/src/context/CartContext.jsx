import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  
  // --- CART STATE ---
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem("cart");
      const parsed = raw ? JSON.parse(raw) : [];
      console.log('🛒 CartContext - Items cargados desde localStorage:', parsed);
      return parsed;
    } catch (error) {
      console.error('❌ Error cargando carrito:', error);
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

  // --- FAVORITES STATE ---
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem("favorites");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // --- SYNC TO LOCALSTORAGE ---
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items));
      console.log('💾 Guardando carrito:', items);
    } catch (error) {
      console.error('❌ Error guardando carrito:', error);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem("orders", JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch (error) {
      console.error('❌ Error guardando favoritos:', error);
    }
  }, [favorites]);

  // --- CART FUNCTIONS ---
  const addToCart = (product, options = {}, qty = 1) => {
    console.log('➕ addToCart llamado con:', { product, options, qty });
    
    // Detectar si es un producto personalizado (tiene customData)
    const isCustomProduct = product?.customData !== undefined;
    
    setItems((prev) => {
      // Para productos personalizados, siempre crear nuevo item (son únicos)
      if (isCustomProduct) {
        const newItem = {
          id: product.id || `custom-${Date.now()}`,
          product: null, // No hay producto base
          customProduct: product, // Guardamos el producto personalizado completo
          qty: qty,
        };
        
        console.log('✅ Nuevo producto personalizado agregado:', newItem);
        return [...prev, newItem];
      }
      
      // Para productos normales del menú (lógica original)
      const { size, customizations, ingredients = [] } = options;

      const idx = prev.findIndex(
        (i) =>
          i.product?.id === product?.id &&
          JSON.stringify(i.ingredients || []) === JSON.stringify(ingredients || []) &&
          i.size === size
      );

      if (idx >= 0) {
        const next = [...prev];
        next[idx].qty = (next[idx].qty || 1) + qty;
        console.log('✅ Item actualizado:', next[idx]);
        return next;
      }

      const newItem = {
        id: Date.now(),
        product,
        size,
        customizations,
        ingredients,
        qty,
      };
      
      console.log('✅ Nuevo item normal agregado:', newItem);
      return [...prev, newItem];
    });
  };

  const updateQty = (id, qty) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))
    );

  const removeFromCart = (id) => {
    console.log('🗑️ Eliminando item:', id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    console.log('🧹 Limpiando carrito');
    setItems([]);
  };

  // --- FAVORITES FUNCTIONS ---
  const addToFavorites = (recipe) => {
    const newFavorite = {
      id: `FAV-${Date.now()}`,
      ...recipe,
      createdAt: new Date().toISOString(),
    };

    setFavorites((prev) => {
      // Evitar duplicados basados en nombre e ingredientes
      const isDuplicate = prev.some(
        (fav) =>
          fav.name === recipe.name &&
          JSON.stringify(fav.customData?.ingredients) === JSON.stringify(recipe.customData?.ingredients)
      );

      if (isDuplicate) {
        alert('⚠️ Esta receta ya está en tus favoritos');
        return prev;
      }

      const updated = [...prev, newFavorite];
      alert('✅ Receta agregada a favoritos');
      return updated;
    });
  };

  const removeFromFavorites = (favoriteId) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== favoriteId));
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

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
    clearCart();
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
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // --- CART CALCULATIONS ---
  const { cartCount, subtotal, total } = useMemo(() => {
    console.log('🧮 Calculando totales para items:', items);
    
    const cartCount = items.reduce((n, i) => n + (i.qty || 1), 0);
    
    const subtotal = items.reduce((sum, i) => {
      const qty = i.qty || 1;
      
      // Para productos personalizados
      if (i.customProduct) {
        const price = i.customProduct?.price || 0;
        console.log(`  Producto personalizado: ${i.customProduct?.name}, Precio: ${price}, Qty: ${qty}`);
        return sum + (price * qty);
      }
      
      // Para productos normales
      const price = i.product?.price || 0;
      console.log(`  Producto normal: ${i.product?.name}, Precio: ${price}, Qty: ${qty}`);
      return sum + (price * qty);
    }, 0);
    
    const total = subtotal;
    
    console.log('✅ Totales calculados:', { cartCount, subtotal, total });
    
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
      // Favorites functions
      favorites,
      addToFavorites,
      removeFromFavorites,
      clearFavorites,
    }),
    [items, cartCount, subtotal, total, orders, favorites]
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