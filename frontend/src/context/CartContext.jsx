// 🔥 CartContext.jsx — Versión final fusionada
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "../context/AuthContext";

const CartContext = createContext(null);

// -------------------------------
// Helpers
// -------------------------------
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

  // -------------------------------
  // Load storage
  // -------------------------------
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

  // -------------------------------
  // Persist storage
  // -------------------------------
  useEffect(() => {
    if (!user) return;
    try {
      localStorage.setItem(`cart_${userKey}`, JSON.stringify(items));
    } catch (err) {
      console.error("Error guardando carrito:", err);
    }
  }, [items, userKey, user]);

  useEffect(() => {
    if (!user) return;
    try {
      localStorage.setItem(`orders_${userKey}`, JSON.stringify(orders));
    } catch (err) {
      console.error("Error guardando orders:", err);
    }
  }, [orders, userKey, user]);

  useEffect(() => {
    if (!user) return;
    try {
      localStorage.setItem(`favorites_${userKey}`, JSON.stringify(favorites));
    } catch (err) {
      console.error("Error guardando favoritos:", err);
    }
  }, [favorites, userKey, user]);

  // -------------------------------
  // ADD TO CART
  // -------------------------------
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
          JSON.stringify(i.ingredients || []) === JSON.stringify(ingredients || []) &&
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

  // -------------------------------
  // UPDATE / REMOVE
  // -------------------------------
  const updateQty = (id, qty) =>
    setItems((prev) =>
      cleanCartItems(prev).map((i) =>
        i.id === id ? { ...i, qty: Math.max(1, qty) } : i
      )
    );

  const removeFromCart = (id) =>
    setItems((prev) => cleanCartItems(prev).filter((i) => i.id !== id));

  const clearCart = () => setItems([]);

  // -------------------------------
  // FAVORITOS
  // -------------------------------
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
    setFavorites((prev) =>
      (Array.isArray(prev) ? prev : []).filter((fav) => fav.id !== favoriteId)
    );
  };

  // ---------------------------------
  // Helpers
  // ---------------------------------
  const buildProductIdsFromItem = (item) => {
    const idsSet = new Set();

    if (item.product?.id) idsSet.add(item.product.id);

    const customData = item.customProduct?.customData;
    if (customData?.ingredients)
      customData.ingredients.forEach((i) => i?.id && idsSet.add(i.id));
    if (customData?.extras)
      customData.extras.forEach((e) => e?.id && idsSet.add(e.id));

    if (item.ingredients)
      item.ingredients.forEach((ing) => ing?.id && idsSet.add(ing.id));

    return Array.from(idsSet);
  };

  const mapCreationType = (type) => {
    if (!type) return "PIZZA";
    const t = type.toString().toUpperCase();

    if (t.includes("PIZZA")) return "PIZZA";
    if (t.includes("BURGER")) return "BURGER";
    if (t.includes("BOTH")) return "BOTH";
    return "PIZZA";
  };

  const mapPaymentMethod = () => "TARJETA";

  // ---------------------------------
  // ✔ placeOrder REAL (tu versión)
  // ---------------------------------
  const placeOrder = async (deliveryOption, paymentOption) => {
    const currentItems = cleanCartItems(items);
    if (currentItems.length === 0) return null;

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.email) {
        alert("Tenés que iniciar sesión antes de hacer un pedido.");
        return null;
      }

      const orderRes = await fetch(
        `http://localhost:4028/api/orders/create/${user.email}?deliveryType=${deliveryOption}`,
        { method: "POST" }
      );

      if (!orderRes.ok) return null;

      const order = await orderRes.json();

      for (const item of currentItems) {
        const productIds = buildProductIdsFromItem(item);
        if (productIds.length === 0) continue;

        let type, size;

        if (item.customProduct?.customData) {
          type = mapCreationType(item.customProduct.customData.type);
          size = item.customProduct.customData.size;
        } else {
          type = mapCreationType(item.product?.type || "PIZZA");
          size = item.size || "MEDIUM";
        }

        const qty = item.qty || 1;

        for (let k = 0; k < qty; k++) {
          await fetch(
            `http://localhost:4028/api/orders/${order.id}/add-creation?type=${type}&size=${size}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(productIds),
            }
          );
        }
      }

      await fetch(
        `http://localhost:4028/api/orders/${order.id}/generate-ticket?method=${mapPaymentMethod(
          paymentOption
        )}`,
        { method: "POST" }
      );

      let updatedOrder = order;
      try {
        const refreshed = await fetch(
          `http://localhost:4028/api/orders/${order.id}`
        );
        if (refreshed.ok) updatedOrder = await refreshed.json();
      } catch {}

      setOrders((prev) => [...prev, updatedOrder]);
      clearCart();

      return updatedOrder;
    } catch (err) {
      console.error("Error creando pedido:", err);
      return null;
    }
  };

  // ---------------------------------
  // ✔ syncOrderFromBackend REAL (tu versión original)
  // ---------------------------------
  const syncOrderFromBackend = async (orderId) => {
    try {
      const res = await fetch(`http://localhost:4028/api/orders/${orderId}`);
      if (!res.ok) return;

      const updated = await res.json();

      setOrders((prev) => {
        const final = prev.map((o) => (o.id === orderId ? updated : o));
        localStorage.setItem(`orders_${userKey}`, JSON.stringify(final));
        return final;
      });
    } catch (err) {
      console.error("Error syncing order:", err);
    }
  };

  // ---------------------------------
  // Last 5 orders
  // ---------------------------------
  const getLastFiveOrders = () => {
    const arr = Array.isArray(orders) ? orders : [];
    return [...arr].slice(-5).reverse();
  };

  // ---------------------------------
  // Totales
  // ---------------------------------
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

    return { cartCount, subtotal, total: subtotal };
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,

        favorites,
        addToFavorites,
        removeFromFavorites,

        orders,
        setOrders,
        placeOrder,
        syncOrderFromBackend,
        getLastFiveOrders,

        cartCount,
        subtotal,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
