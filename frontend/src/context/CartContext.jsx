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

  // -------------------------------------------------------------
  // Load localStorage when user changes
  // -------------------------------------------------------------
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

    setItems(cleanCartItems(safeParseArray(cartRaw)));
    setOrders(safeParseArray(ordersRaw));
    setFavorites(safeParseArray(favsRaw));
  }, [userKey, user]);

  // -------------------------------------------------------------
  // Persist changes
  // -------------------------------------------------------------
  useEffect(() => {
    if (!user) return;
    localStorage.setItem(`cart_${userKey}`, JSON.stringify(items));
  }, [items, userKey, user]);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem(`orders_${userKey}`, JSON.stringify(orders));
  }, [orders, userKey, user]);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem(`favorites_${userKey}`, JSON.stringify(favorites));
  }, [favorites, userKey, user]);

  // -------------------------------------------------------------
  // CART FUNCTIONS
  // -------------------------------------------------------------
  const addToCart = (product, options = {}, qty = 1) => {
    const isCustomProduct = product?.customData !== undefined;

    setItems((prev) => {
      const cleanedPrev = cleanCartItems(prev);

      if (isCustomProduct) {
        const newItem = {
          id: product.id || `custom-${Date.now()}`,
          product: null,
          customProduct: product,
          qty,
        };
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
        return next;
      }

      return [
        ...cleanedPrev,
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
      cleanCartItems(prev).map((i) =>
        i.id === id ? { ...i, qty: Math.max(1, qty) } : i
      )
    );

  const removeFromCart = (id) => {
    setItems((prev) => cleanCartItems(prev).filter((i) => i.id !== id));
  };

  const clearCart = () => setItems([]);

  // -------------------------------------------------------------
  // FAVORITES
  // -------------------------------------------------------------
  const addToFavorites = (recipe) => {
    const newFavorite = {
      id: `FAV-${Date.now()}`,
      ...recipe,
      createdAt: new Date().toISOString(),
    };

    setFavorites((prev) => {
      const isDuplicate = prev.some(
        (fav) =>
          fav.name === recipe.name &&
          JSON.stringify(fav.customData?.ingredients) ===
            JSON.stringify(recipe.customData?.ingredients)
      );

      if (isDuplicate) {
        alert("Esta receta ya está en tus favoritos");
        return prev;
      }

      alert("Receta agregada a favoritos");
      return [...prev, newFavorite];
    });
  };

  const removeFromFavorites = (favoriteId) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== favoriteId));
  };

  const clearFavorites = () => setFavorites([]);

  // -------------------------------------------------------------
  // PLACE ORDER (BACKEND REAL)
  // -------------------------------------------------------------
  const placeOrder = async () => {
    if (items.length === 0) return null;

    const mapCreationType = (type) => {
      if (!type) return "PIZZA";
      const t = type.toString().toUpperCase();
      if (t.includes("PIZZA")) return "PIZZA";
      if (t.includes("BURGER")) return "BURGER";
      if (t.includes("BOTH") || t.includes("COMBO")) return "BOTH";
      return "PIZZA";
    };

    const mapPaymentMethod = () => "TARJETA";

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

      if (!orderRes.ok) return null;

      const order = await orderRes.json();

      // 2) Para cada producto → agregar creación
      for (const item of items) {
        let productIds = [];

        if (item.customProduct?.customData?.ingredients) {
          productIds = item.customProduct.customData.ingredients.map((i) => i.id);
        } else if (item.ingredients) {
          productIds = item.ingredients.map((i) => i.id);
        }

        const type = item.customProduct
          ? item.customProduct.type?.toUpperCase()
          : item.product?.type || "PIZZA";

        const size = item.size || "MEDIUM";

        await fetch(
          `http://localhost:4028/api/orders/${order.id}/add-creation?type=${mapCreationType(
            type
          )}&size=${size}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productIds),
          }
        );
      }

      // 3) Generar ticket
      await fetch(
        `http://localhost:4028/api/orders/${order.id}/generate-ticket?method=${mapPaymentMethod()}`,
        { method: "POST" }
      );

      // 4) Guardar local + total real
      setOrders((prev) => [...prev, { ...order, total }]);
      clearCart();

      return order;
    } catch (err) {
      console.error("Error creando pedido:", err);
      return null;
    }
  };

  // -------------------------------------------------------------
  // GET LAST FIVE ORDERS
  // -------------------------------------------------------------
  const getLastFiveOrders = () => {
    const arr = Array.isArray(orders) ? orders : [];
    return [...arr].slice(-5).reverse();
  };

  // -------------------------------------------------------------
  // SYNC ORDER FROM BACKEND
  // -------------------------------------------------------------
  const syncOrderFromBackend = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:4028/api/orders/${orderId}`);
      if (!response.ok) return;

      const updated = await response.json();

      setOrders((prev) => {
        const newOrders = prev.map((o) =>
          o.id === orderId ? updated : o
        );
        localStorage.setItem(`orders_${userKey}`, JSON.stringify(newOrders));
        return newOrders;
      });
    } catch (err) {
      console.error("Error syncing order:", err);
    }
  };

  // -------------------------------------------------------------
  // TOTALS
  // -------------------------------------------------------------
  const { cartCount, subtotal, total } = useMemo(() => {
    const safeItems = cleanCartItems(items);

    const cartCount = safeItems.reduce((n, i) => n + (i.qty || 1), 0);

    const subtotal = safeItems.reduce((sum, i) => {
      const qty = i.qty || 1;

      if (i.customProduct) {
        return sum + (i.customProduct.price || 0) * qty;
      }

      return sum + (i.product?.price || 0) * qty;
    }, 0);

    const total = subtotal;

    return { cartCount, subtotal, total };
  }, [items]);

  // -------------------------------------------------------------
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

      syncOrderFromBackend,
    }),
    [items, cartCount, subtotal, total, orders, favorites]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};
