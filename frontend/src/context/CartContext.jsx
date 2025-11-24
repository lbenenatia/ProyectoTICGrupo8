import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "../context/AuthContext";

const CartContext = createContext(null);

function safeParseArray(raw) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function cleanCartItems(items) {
  if (!Array.isArray(items)) return [];
  return items
    .filter((i) => i && (i.product || i.customProduct))
    .map((i) => ({
      ...i,
      qty: typeof i.qty === "number" && i.qty > 0 ? i.qty : 1,
    }));
}

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const userKey = user?.email || "guest";

  const [items, setItems] = useState([]);

  const [orders, setOrders] = useState([]);

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!user) {
      setItems([]);
      setOrders([]);
      setFavorites([]);

      localStorage.removeItem("cart_guest");
      localStorage.removeItem("orders_guest");
      localStorage.removeItem("favorites_guest");
      return;
    }

    const cartRaw = localStorage.getItem(`cart_${userKey}`);
    const ordersRaw = localStorage.getItem(`orders_${userKey}`);
    const favsRaw = localStorage.getItem(`favorites_${userKey}`);

    const loadedItems = cleanCartItems(safeParseArray(cartRaw));
    const loadedOrders = safeParseArray(ordersRaw);
    const loadedFavs = safeParseArray(favsRaw);

    setItems(loadedItems);
    setOrders(loadedOrders);
    setFavorites(loadedFavs);
  }, [userKey, user]);

  useEffect(() => {
    if (!user) return;

    try {
      localStorage.setItem(`cart_${userKey}`, JSON.stringify(items));
    } catch (error) {
      console.error("Error guardando carrito:", error);
    }
  }, [items, userKey, user]);

  useEffect(() => {
    if (!user) return;
    try {
      localStorage.setItem(`orders_${userKey}`, JSON.stringify(orders));
    } catch (error) {
      console.error("Error guardando orders:", error);
    }
  }, [orders, userKey, user]);

  useEffect(() => {
    if (!user) return;
    try {
      localStorage.setItem(`favorites_${userKey}`, JSON.stringify(favorites));
    } catch (error) {
      console.error("Error guardando favoritos:", error);
    }
  }, [favorites, userKey, user]);

  const addToCart = (product, options = {}, qty = 1) => {
    console.log("addToCart llamado con:", { product, options, qty });

    const isCustomProduct = product?.customData !== undefined;

    setItems((prev) => {
      const cleanedPrev = cleanCartItems(prev);

      if (isCustomProduct) {
        const newItem = {
          id: product.id || `custom-${Date.now()}`,
          product: null,
          customProduct: product,
          qty: qty,
        };
        console.log("Nuevo producto personalizado agregado:", newItem);
        return [...cleanedPrev, newItem];
      }

      const { size, customizations, ingredients = [] } = options;

      const idx = cleanedPrev.findIndex(
        (i) =>
          i.product?.id === product?.id &&
          JSON.stringify(i.ingredients || []) ===
            JSON.stringify(ingredients || []) &&
          i.size === size
      );

      if (idx >= 0) {
        const next = [...cleanedPrev];
        next[idx].qty = (next[idx].qty || 1) + qty;
        console.log("Item actualizado:", next[idx]);
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
      console.log("Nuevo item normal agregado:", newItem);
      return [...cleanedPrev, newItem];
    });
  };

  const updateQty = (id, qty) =>
    setItems((prev) =>
      cleanCartItems(prev).map((i) =>
        i.id === id ? { ...i, qty: Math.max(1, qty) } : i
      )
    );

  const removeFromCart = (id) => {
    console.log("Eliminando item:", id);
    setItems((prev) => cleanCartItems(prev).filter((i) => i.id !== id));
  };

  const clearCart = () => {
    console.log("Limpiando carrito");
    setItems([]);
  };

  const addToFavorites = (recipe) => {
    const newFavorite = {
      id: `FAV-${Date.now()}`,
      ...recipe,
      createdAt: new Date().toISOString(),
    };

    setFavorites((prev) => {
      const cleanedPrev = Array.isArray(prev) ? prev : [];

      const isDuplicate = cleanedPrev.some(
        (fav) =>
          fav.name === recipe.name &&
          JSON.stringify(fav.customData?.ingredients) ===
            JSON.stringify(recipe.customData?.ingredients)
      );

      if (isDuplicate) {
        alert("Esta receta ya está en tus favoritos");
        return cleanedPrev;
      }

      alert("Receta agregada a favoritos");
      return [...cleanedPrev, newFavorite];
    });
  };

  const removeFromFavorites = (favoriteId) => {
    setFavorites((prev) =>
      (Array.isArray(prev) ? prev : []).filter((fav) => fav.id !== favoriteId)
    );
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const placeOrder = (deliveryType = "delivery") => {
    const cleanedItems = cleanCartItems(items);
    if (cleanedItems.length === 0) return null;

    const newOrder = {
      id: `ORD-${Date.now()}`,
      status: "preparing",
      createdAt: new Date().toISOString(),
      deliveryType,
      items: cleanedItems,
      total,
      driver: null,
    };

    setOrders((prev) => [...(Array.isArray(prev) ? prev : []), newOrder]);
    clearCart();
    return newOrder;
  };

  const getLastFiveOrders = () => {
    const arr = Array.isArray(orders) ? orders : [];
    return [...arr].slice(-5).reverse();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prev) => {
        const arr = Array.isArray(prev) ? prev : [];
        return arr.map((order) =>
          order.status === "preparing"
            ? {
                ...order,
                status: "out-for-delivery",
                driver: {
                  name: "Mike Johnson",
                  vehicle: "Honda Civic - ABC 123",
                },
              }
            : order.status === "out-for-delivery"
            ? { ...order, status: "delivered" }
            : order
        );
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const { cartCount, subtotal, total } = useMemo(() => {
    const safeItems = cleanCartItems(items);

    const cartCount = safeItems.reduce((n, i) => n + (i.qty || 1), 0);

    const subtotal = safeItems.reduce((sum, i) => {
      const qty = i.qty || 1;

      if (i.customProduct) {
        const price = i.customProduct?.price || 0;
        return sum + price * qty;
      }

      const price = i.product?.price || 0;
      return sum + price * qty;
    }, 0);

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
      orders,
      placeOrder,
      setOrders,
      getLastFiveOrders,
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
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};
