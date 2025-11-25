import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import OrderSummaryCard from './components/OrderSummaryCard';
import DeliveryOptionsCard from './components/DeliveryOptionsCard';
import PaymentMethodCard from './components/PaymentMethodCard';
import OrderTrackingCard from './components/OrderTrackingCard';
import QuickReorderCard from './components/QuickReorderCard';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from "../../components/ui/ConfirmModal";

const CartPage = () => {
  const [activeTab, setActiveTab] = useState('new-order');
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState('delivery');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const navigate = useNavigate();

  const { user } = useAuth();
  const { showToast } = useToast();

  const {
    items: cartItems,
    subtotal,
    total,
    orders,
    setOrders,
    placeOrder,
    getLastFiveOrders,
    addToCart,
    removeFromCart,
    updateQty,
    syncOrderFromBackend,
  } = useCart();

  // ✅ Cargar dirección guardada
  useEffect(() => {
    if (!user?.email) return;

    const userKey = user.email;
    const addressesKey = `addresses_${userKey}`;
    const deliveryKey = `deliveryAddress_${userKey}`;

    const savedSelectionRaw = localStorage.getItem(deliveryKey);
    if (savedSelectionRaw) {
      try {
        const parsed = JSON.parse(savedSelectionRaw);
        setDeliveryAddress(parsed);
        return;
      } catch {
      }
    }

    const addressesRaw = localStorage.getItem(addressesKey);
    if (addressesRaw) {
      try {
        const addresses = JSON.parse(addressesRaw);
        if (Array.isArray(addresses) && addresses.length > 0) {
          setDeliveryAddress(addresses[addresses.length - 1]);
          return;
        }
      } catch {
      }
    }

    setDeliveryAddress(null);
  }, [user]);

  // ✅ Cargar tarjeta seleccionada
  useEffect(() => {
    if (!user?.email) return;

    const userKey = user.email;
    const cardsKey = `savedCards_${userKey}`;
    const saved = localStorage.getItem(cardsKey);
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          setSelectedCard(parsed[parsed.length - 1].id);
        }
      } catch {
        setSelectedCard(null);
      }
    }
  }, [user]);

  const handleAddressChange = (newAddress) => {
    setDeliveryAddress(newAddress);

    if (!user?.email) return;
    const userKey = user.email;
    const deliveryKey = `deliveryAddress_${userKey}`;

    if (newAddress) {
      localStorage.setItem(deliveryKey, JSON.stringify(newAddress));
    } else {
      localStorage.removeItem(deliveryKey);
    }
  };

  // ✅ Handler para cuando se selecciona una tarjeta
  const handleCardSelect = (cardId) => {
    setSelectedCard(cardId);
  };

  useEffect(() => {
    if (activeTab !== "tracking") return;
    if (!orders || orders.length === 0) return;

    const interval = setInterval(() => {
      orders.forEach(o => syncOrderFromBackend(o.id));
    }, 4000);

    return () => clearInterval(interval);
  }, [activeTab, orders]);

  // --- Totales ---
  const calculateOrderTotals = () => {
    const deliveryFee = selectedDeliveryOption === 'delivery' ? 5.00 : 0;
    const totalOrder = subtotal + deliveryFee;
    return { deliveryFee, total: totalOrder };
  };

  const { deliveryFee, total: totalOrder } = calculateOrderTotals();

  // ✅ VALIDACIÓN COMPLETA ANTES DE HACER EL PEDIDO
  const validateOrder = () => {
    // Validar que hay items en el carrito
    if (cartItems.length === 0) {
      showToast("⚠️ Tu carrito está vacío");
      return false;
    }

    // Validar opción de entrega
    if (selectedDeliveryOption === 'delivery') {
      if (!deliveryAddress) {
        showToast("📍 Seleccioná un domicilio para continuar");
        return false;
      }
    }

    // Validar método de pago
    if (selectedPaymentMethod === 'card') {
      if (!selectedCard) {
        showToast("💳 Seleccioná una tarjeta para continuar");
        return false;
      }
    }

    return true;
  };

  // --- Place order ---
  const handlePlaceOrder = async () => {
    // Validar antes de hacer el pedido
    if (!validateOrder()) {
      return;
    }

    const newOrder = await placeOrder(selectedDeliveryOption);

    if (newOrder) {
      showToast("Pedido realizado exitosamente");
      setActiveTab('tracking');
    }
  };


  // --- Cancel order (BACKEND REAL) ---
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("¿Seguro que querés cancelar este pedido?")) return;

    try {
      const res = await fetch(`http://localhost:4028/api/orders/${orderId}/cancel`, {
        method: "PUT"
      });

      if (!res.ok) {
        alert("No se pudo cancelar el pedido.");
        return;
      }

      const updated = await res.json();

      setOrders(prev =>
        prev.map(o => (o.id === orderId ? updated : o))
      );

    } catch (err) {
      console.error("Error cancelando pedido:", err);
      alert("Hubo un error cancelando el pedido.");
    }
  };

  const handleContactDriver = (driver) => {
    showToast(`📞 Llamando a ${driver.name}`);
  };

  const handleReorder = (order) => {
    order.items.forEach((i) =>
      addToCart(i.product, { size: i.size, ingredients: i.ingredients }, i.qty)
    );
    setActiveTab('new-order');
    showToast("✅ Productos agregados al carrito");
  };

  const handleModifyAndReorder = (order) => {
    console.log('Modificar antes de volver a pedir:', order);
  };

  const handleModifyItem = (itemId) => {
    const itemToEdit = cartItems.find(item => item.id === itemId);
    if (!itemToEdit) {
      console.error("❌ Item no encontrado");
      return;
    }

    console.log("✏️ Editando item:", itemToEdit);

    if (itemToEdit.customProduct) {
      const customData = itemToEdit.customProduct.customData;
      
      console.log("📦 CustomData del producto:", customData);
      console.log("🍕 Ingredients array:", customData.ingredients);
      console.log("🎁 Extras array:", customData.extras);

      const editData = {
        editMode: true,
        originalItemId: itemId,
        productType: customData.type,
        selectedSize: customData.size,
        selectedIngredients: customData.ingredients || [],
        selectedExtras: customData.extras || [],
        sizeInfo: customData.sizeInfo,
        basePrice: customData.basePrice,
        ingredientsPrice: customData.ingredientsPrice,
        extrasPrice: customData.extrasPrice
      };

      console.log("💾 Guardando datos para editar:", editData);
      console.log("📋 selectedIngredients que se guardarán:", editData.selectedIngredients);
      console.log("📋 selectedExtras que se guardarán:", editData.selectedExtras);
      
      localStorage.setItem("editItem", JSON.stringify(editData));
      navigate('/build-your-own');
      
    } else {
      console.log('✏️ Editando producto regular:', itemToEdit);
      navigate(`/product/${itemToEdit.product?.id}?edit=true`);
    }
  };

  const recentOrders = useMemo(() => getLastFiveOrders(), [orders, getLastFiveOrders]);

  const tabs = [
    { id: 'new-order', label: 'Nuevo Pedido', icon: 'ShoppingCart' },
    { id: 'tracking', label: 'Seguimiento', icon: 'MapPin' },
    { id: 'reorder', label: 'Volver a Pedir', icon: 'RotateCcw' },
  ];

  const [showConfirm, setShowConfirm] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const handleRemoveItem = (itemId) => {
    const item = cartItems.find(i => i.id === itemId);
    if (!item) return;

    setItemToRemove(item);
    setShowConfirm(true);
  };

  const handleConfirmRemove = () => {
    if (itemToRemove) {
      removeFromCart(itemToRemove.id);
      setShowConfirm(false);
      setItemToRemove(null);
      showToast("🗑️ Producto eliminado del carrito");
    }
  };

  const handleCancelRemove = () => {
    setShowConfirm(false);
    setItemToRemove(null);
  };

  const getItemName = (item) => {
    if (!item) return 'este producto';
    return item.customProduct?.name || item.name || item.product?.name || 'este producto';
  };

  // ✅ Calcular si el botón de "Hacer pedido" debe estar deshabilitado
  const isOrderButtonDisabled = useMemo(() => {
    if (cartItems.length === 0) return true;
    if (selectedDeliveryOption === 'delivery' && !deliveryAddress) return true;
    if (selectedPaymentMethod === 'card' && !selectedCard) return true;
    return false;
  }, [cartItems.length, selectedDeliveryOption, deliveryAddress, selectedPaymentMethod, selectedCard]);

  // ✅ Mensaje dinámico para el tooltip del botón
  const getOrderButtonTooltip = () => {
    if (cartItems.length === 0) return "Agregá productos al carrito";
    if (selectedDeliveryOption === 'delivery' && !deliveryAddress) return "Seleccioná un domicilio";
    if (selectedPaymentMethod === 'card' && !selectedCard) return "Seleccioná una tarjeta";
    return "";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">

        {/* Hero */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-12">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 text-center">
            <h1 className="text-4xl lg:text-5xl font-playfair font-semibold text-text-primary mb-4">
              Mi Carrito
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Completá tu pedido, rastreá la entrega y gestioná tus preferencias en un solo lugar.
            </p>
          </div>
        </section>

        {/* Tabs */}
        <section className="sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="bg-background">
              <div className="inline-flex space-x-1 bg-card border border-border rounded-lg p-2">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    size="sm"
                    iconName={tab.icon}
                    iconPosition="left"
                    onClick={() => setActiveTab(tab.id)}
                    className="whitespace-nowrap"
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">

            {/* NEW ORDER */}
            {activeTab === 'new-order' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">

                  <DeliveryOptionsCard
                    selectedOption={selectedDeliveryOption}
                    onOptionChange={setSelectedDeliveryOption}
                    deliveryAddress={deliveryAddress}
                    onAddressChange={handleAddressChange}
                  />

                  <PaymentMethodCard
                    selectedMethod={selectedPaymentMethod}
                    onMethodChange={setSelectedPaymentMethod}
                    selectedCard={selectedCard}
                    onCardSelect={handleCardSelect}
                  />

                </div>

                <div className="space-y-6">
                  <OrderSummaryCard
                    items={cartItems}
                    subtotal={subtotal}
                    deliveryFee={deliveryFee}
                    total={totalOrder}
                    onModifyItem={handleModifyItem}
                    onRemoveItem={handleRemoveItem}
                  />

                  <div className="relative">
                    <Button
                      variant="default"
                      size="lg"
                      fullWidth
                      iconName="CreditCard"
                      iconPosition="left"
                      onClick={handlePlaceOrder}
                      disabled={isOrderButtonDisabled}
                      title={getOrderButtonTooltip()}
                    >
                      Hacer pedido - ${totalOrder.toFixed(2)}
                    </Button>
                    
                    {/* ✅ Indicador visual de qué falta */}
                    {isOrderButtonDisabled && cartItems.length > 0 && (
                      <div className="mt-2 text-xs text-center text-text-secondary">
                        {getOrderButtonTooltip()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TRACKING */}
            {activeTab === 'tracking' && (
              <div className="max-w-4xl mx-auto">
                {orders.length > 0 ? (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <OrderTrackingCard
                        key={order.id}
                        order={order}
                        onCancelOrder={handleCancelOrder}
                        onContactDriver={handleContactDriver}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Icon name="Package" size={48} className="text-text-secondary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                      No hay pedidos activos
                    </h3>
                    <p className="text-text-secondary mb-6">
                      Aún no realizaste ningún pedido.
                    </p>
                    <Button
                      variant="default"
                      iconName="ShoppingCart"
                      iconPosition="left"
                      onClick={() => setActiveTab('new-order')}
                    >
                      Nuevo Pedido
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* REORDER */}
            {activeTab === 'reorder' && (
              <div className="max-w-4xl mx-auto">
                {recentOrders.length > 0 ? (
                  <QuickReorderCard
                    favoriteOrders={[]}
                    recentOrders={recentOrders}
                    onReorder={handleReorder}
                    onModifyAndReorder={handleModifyAndReorder}
                  />
                ) : (
                  <div className="text-center py-12">
                    <Icon
                      name="History"
                      size={48}
                      className="text-text-secondary mx-auto mb-4"
                    />
                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                      Sin pedidos recientes
                    </h3>
                    <p className="text-text-secondary mb-6">
                      Aún no tenés pedidos para volver a pedir.
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>
        </section>

      </main>
      <ConfirmModal
        open={showConfirm}
        title="Eliminar del carrito"
        message={`¿Seguro que deseas eliminar "${getItemName(itemToRemove)}" del carrito?`}
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
      />
    </div>
  );
};

export default CartPage;
