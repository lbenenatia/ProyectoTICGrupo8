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
import ConfirmModal from "../../components/ui/ConfirmModal";

const CartPage = () => {
  const [activeTab, setActiveTab] = useState('new-order');
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState('delivery');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const navigate = useNavigate();

  const { user } = useAuth();

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
    updateQty
  } = useCart();

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

  const [savedCards, setSavedCards] = useState(() => {
    try {
      const raw = localStorage.getItem('savedCards');
      return raw
        ? JSON.parse(raw)
        : [
            { id: 1, last4: "4242", brand: "Visa", expiry: "12/25" },
            { id: 2, last4: "5555", brand: "Mastercard", expiry: "08/26" },
          ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('savedCards', JSON.stringify(savedCards));
  }, [savedCards]);

  const handleAddCard = () => {
    const last4 = prompt("Ingresá los últimos 4 dígitos de la tarjeta:");
    const brand = prompt("Marca (Visa, Mastercard, etc.):");
    const expiry = prompt("Vencimiento (MM/AA):");

    if (last4 && brand && expiry) {
      const newCard = {
        id: Date.now(),
        last4,
        brand,
        expiry,
      };
      setSavedCards((prev) => [...prev, newCard]);
      setSelectedPaymentMethod('card');
      alert(`Tarjeta ${brand} **** ${last4} agregada correctamente `);
    }
  };

  const handleSelectCard = (cardId) => {
    setSelectedPaymentMethod('card');
    setSavedCards((prev) =>
      prev.map((c) => ({ ...c, selected: c.id === cardId }))
    );
  };

  const calculateOrderTotals = () => {
    const deliveryFee = selectedDeliveryOption === 'delivery' ? 5.00 : 0;
    const totalOrder = subtotal + deliveryFee;
    return { deliveryFee, total: totalOrder };
  };

  const { deliveryFee, total: totalOrder } = calculateOrderTotals();

  const handlePlaceOrder = () => {
    const newOrder = placeOrder(selectedDeliveryOption);
    if (newOrder) setActiveTab('tracking');
  };

  const handleCancelOrder = (orderId) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const handleContactDriver = (driver) => {
    alert(`Llamando al repartidor ${driver.name} (${driver.vehicle}) 🚗`);
  };

  const handleReorder = (order) => {
    order.items.forEach((i) =>
      addToCart(i.product, { size: i.size, ingredients: i.ingredients }, i.qty)
    );
    setActiveTab('new-order');
  };

  const handleModifyAndReorder = (order) => {
    console.log('Modificar antes de volver a pedir:', order);
  };

  const handleModifyItem = (itemId) => {
    const itemToEdit = cartItems.find(item => item.id === itemId);
    if (!itemToEdit) {
      console.error("Item no encontrado");
      return;
    }

    console.log("Editando item:", itemToEdit);

    if (itemToEdit.customProduct) {
      const customData = itemToEdit.customProduct.customData;
      
      console.log("CustomData del producto:", customData);
      console.log("Ingredients array:", customData.ingredients);

      // CORREGIR: Los ingredientes ya vienen en customData.ingredients como array
      // NO intentar convertirlos de nuevo, usarlos directamente
      const editData = {
        ...customData,
        editMode: true,
        originalItemId: itemId,
        productType: customData.type,
        selectedSize: customData.size,
        selectedIngredients: customData.ingredients || [], // ← Usar directamente
        selectedExtras: customData.extras || [] // ← Usar directamente
      };

      console.log("Guardando datos para editar:", editData);
      localStorage.setItem("editItem", JSON.stringify(editData));
      navigate('/build-your-own');
      
    } else {
      console.log('Editando producto regular:', itemToEdit);
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
            {/* --- NUEVO PEDIDO --- */}
            {activeTab === 'new-order' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {/* Dirección */}
                  <DeliveryOptionsCard
                    selectedOption={selectedDeliveryOption}
                    onOptionChange={setSelectedDeliveryOption}
                    deliveryAddress={deliveryAddress}
                    onAddressChange={handleAddressChange}
                  />

                  {/* Método de pago */}
                  <PaymentMethodCard
                    selectedMethod={selectedPaymentMethod}
                    onMethodChange={setSelectedPaymentMethod}
                    savedCards={savedCards}
                    onAddCard={handleAddCard}
                    onSelectCard={handleSelectCard}
                  />
                </div>

                {/* Resumen */}
                <div className="space-y-6">
                  <OrderSummaryCard
                    items={cartItems}
                    subtotal={subtotal}
                    deliveryFee={deliveryFee}
                    total={totalOrder}
                    onModifyItem={handleModifyItem}
                    onRemoveItem={handleRemoveItem}
                  />

                  <Button
                    variant="default"
                    size="lg"
                    fullWidth
                    iconName="CreditCard"
                    iconPosition="left"
                    onClick={handlePlaceOrder}
                    disabled={cartItems.length === 0}
                  >
                    Hacer pedido - ${totalOrder.toFixed(2)}
                  </Button>
                </div>
              </div>
            )}

            {/* --- SEGUIMIENTO --- */}
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

            {/* --- VOLVER A PEDIR --- */}
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
