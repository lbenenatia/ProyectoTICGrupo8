import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";
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

    // Cargar pedidos del backend usando endpoint de admin temporalmente
    fetchUserOrders();
  }, [userKey, user]);

  const fetchUserOrders = async () => {
    if (!user) return;
    
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      // Usar el nuevo endpoint de usuario
      const response = await axios.get("http://localhost:4028/api/user/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("Orders from user endpoint:", response.data);
      setOrders(response.data || []);
      
    } catch (error) {
      console.error("Error fetching user orders:", error);
      // En caso de error, mantener array vacío para forzar uso del backend
      setOrders([]);
    }
  };

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
      
      // GUARDAR TAMBIÉN EN UN LUGAR GLOBAL PARA EL ADMIN
      const allUserOrders = JSON.parse(localStorage.getItem('all_orders') || '{}');
      allUserOrders[userKey] = orders;
      localStorage.setItem('all_orders', JSON.stringify(allUserOrders));
      
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

  // Polling para actualizar estados de pedidos
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      fetchUserOrders();
    }, 15000); // Actualizar cada 15 segundos (menos frecuente)

    return () => clearInterval(interval);
  }, [user]);

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

  const placeOrder = async (deliveryType = "delivery") => {
    const cleanedItems = cleanCartItems(items);
    if (cleanedItems.length === 0) {
      alert("El carrito está vacío");
      return null;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token");
      }

      // Calcular total
      const orderTotal = cleanedItems.reduce((sum, item) => {
        if (item.customProduct) {
          return sum + (item.customProduct.price * (item.qty || 1));
        } else {
          return sum + (item.product?.price * (item.qty || 1));
        }
      }, 0);

      // Preparar el pedido para el backend
      const orderData = {
        items: cleanedItems.map(item => {
          const baseItem = {
            quantity: item.qty || 1,
            price: item.customProduct ? item.customProduct.price : item.product?.price
          };

          if (item.customProduct) {
            return {
              ...baseItem,
              productId: null,
              customProduct: item.customProduct
            };
          } else {
            return {
              ...baseItem,
              productId: item.product?.id,
              size: item.size,
              ingredients: item.ingredients
            };
          }
        }),
        total: orderTotal,
        deliveryType: deliveryType,
        status: "QUEUE" // Esto será sobrescrito por el backend, pero lo enviamos por seguridad
      };

      console.log("Enviando pedido al backend:", orderData);

      // Enviar al backend usando el nuevo endpoint de usuario
      const response = await axios.post(
        "http://localhost:4028/api/user/orders", 
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newOrder = response.data;
      console.log("Pedido creado en backend:", newOrder);

      // Actualizar la lista de pedidos
      await fetchUserOrders();
      
      // Limpiar carrito
      clearCart();
      
      alert("✅ Pedido creado exitosamente");
      return newOrder;

    } catch (error) {
      console.error("Error creando pedido:", error);
      alert("❌ Error al crear el pedido. Por favor, intenta nuevamente.");
      return null;
    }
  };

  const getLastFiveOrders = () => {
    const arr = Array.isArray(orders) ? orders : [];
    return [...arr].slice(-5).reverse();
  };

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