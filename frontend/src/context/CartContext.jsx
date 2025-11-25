import React, { createContext, useContext, useEffect, useMemo, useState } from "react";



const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  
  // --- CART STATE ---
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem("cart");
      const parsed = raw ? JSON.parse(raw) : [];
      console.log(' CartContext - Items cargados desde localStorage:', parsed);
      return parsed;
    } catch (error) {
      console.error('Error cargando carrito:', error);
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
      console.log(' Guardando carrito:', items);
    } catch (error) {
      console.error('Error guardando carrito:', error);
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
      console.error('Error guardando favoritos:', error);
    }
  }, [favorites]);

  // --- CART FUNCTIONS ---
  const addToCart = (product, options = {}, qty = 1) => {
    console.log('addToCart llamado con:', { product, options, qty });
    
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
        
        console.log(' Nuevo producto personalizado agregado:', newItem);
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
        console.log('Item actualizado:', next[idx]);
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
      
      console.log(' Nuevo item normal agregado:', newItem);
      return [...prev, newItem];
    });
  };

  const updateQty = (id, qty) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))
    );

  const removeFromCart = (id) => {
    console.log('Eliminando item:', id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    console.log(' Limpiando carrito');
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
        alert(' Esta receta ya está en tus favoritos');
        return prev;
      }

      const updated = [...prev, newFavorite];
      alert('Receta agregada a favoritos');
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
const placeOrder = async () => {
  if (items.length === 0) return null;

  // --- helpers para mapear a enums del backend ---
const mapCreationType = (type) => {
  if (!type) return "PIZZA";

  const t = type.toString().toUpperCase();

  if (t.includes("PIZZA")) return "PIZZA";
  if (t.includes("BURGER")) return "BURGER";

  if (t.includes("BOTH") || t.includes("COMBO")) return "BOTH";

  return "PIZZA"; // fallback seguro
};


 
  const mapPaymentMethod = () => {
    return "TARJETA"; 
  };

  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.email) {
      alert("Tenés que iniciar sesión antes de hacer un pedido.");
      return null;
    }

    // 1) Crear pedido
    const orderRes = await fetch(
      `http://localhost:4028/api/orders/create/${user.email}`,
      { method: "POST" }
    );

    if (!orderRes.ok) {
      console.error("Error creando pedido (create):", orderRes.status);
      alert("No se pudo crear el pedido.");
      return null;
    }

    const order = await orderRes.json();

    // 2) Agregar creaciones
    for (const item of items) {
      const productIds = item.ingredients?.map((i) => i.id) || [];

      let rawType;

      // Si es producto personalizado
      if (item.customProduct) {
        rawType = item.customProduct.type?.toUpperCase() || "PIZZA";
      } else {
        // Producto del menú
        rawType = (item.product?.type || item.product?.category || "PIZZA").toUpperCase();
      }

      const typeEnum = mapCreationType(rawType);

      const size = item.size || "MEDIUM";

      const creationRes = await fetch(
        `http://localhost:4028/api/orders/${order.id}/add-creation?type=${typeEnum}&size=${size}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productIds),
        }
      );

      if (!creationRes.ok) {
        console.error(
          "Error creando creación (add-creation):",
          creationRes.status
        );
        alert("Hubo un error al agregar una creación al pedido.");
        // si querés, acá podrías hacer un `return null;`
      }
    }

    // 3) Generar ticket
    const paymentEnum = mapPaymentMethod();

    const ticketRes = await fetch(
      `http://localhost:4028/api/orders/${order.id}/generate-ticket?method=${paymentEnum}`,
      { method: "POST" }
    );

    if (!ticketRes.ok) {
      console.error(
        "Error generando ticket (generate-ticket):",
        ticketRes.status
      );
      alert("Hubo un error generando el ticket.");
      return null;
    }

    const ticket = await ticketRes.json();
    console.log("Ticket generado:", ticket);

    // 4) Guardar pedido local y vaciar carrito
    setOrders((prev) => [...prev, order]);
    clearCart();

    return order;
  } catch (err) {
    console.error("Error creando pedido:", err);
    alert("Hubo un error creando el pedido.");
    return null;
  }
};



  // --- GET LAST FIVE ORDERS ---
  const getLastFiveOrders = () => {
    return [...orders].slice(-5).reverse();
  };

  

  // --- CART CALCULATIONS ---
  const { cartCount, subtotal, total } = useMemo(() => {
    console.log(' Calculando totales para items:', items);
    
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
    
    console.log(' Totales calculados:', { cartCount, subtotal, total });
    
    return { cartCount, subtotal, total };
  }, [items]);
    // --- SYNC ORDER FROM BACKEND ---
  
  const syncOrderFromBackend = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:4028/api/orders/${orderId}`);
      if (!response.ok) {
        console.warn("No se pudo refrescar el pedido:", response.status);
        return;
      }

      const updatedOrder = await response.json();

      // Actualizar estado global + localStorage
      setOrders((prev) => {
        const newOrders = prev.map((o) =>
          o.id === orderId ? updatedOrder : o
        );
        localStorage.setItem("orders", JSON.stringify(newOrders));
        return newOrders;
      });

    } catch (err) {
      console.error("Error sincronizando pedido:", err);
    }
  };

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
      syncOrderFromBackend,
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