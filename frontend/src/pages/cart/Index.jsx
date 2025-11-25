import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import OrderSummaryCard from './components/OrderSummaryCard';
import DeliveryOptionsCard from './components/DeliveryOptionsCard';
import PaymentMethodCard from './components/PaymentMethodCard';
import OrderTrackingCard from './components/OrderTrackingCard';
import QuickReorderCard from './components/QuickReorderCard';
import AddressModal from '../../components/ui/AddressModal';
import CardModal from '../../components/ui/CardModal';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import ConfirmModal from "../../components/ui/ConfirmModal";

const CartPage = () => {
  const [activeTab, setActiveTab] = useState('new-order');
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState('delivery');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
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

  // 🔹 DEFINICIÓN DE TABS
  const tabs = [
    { id: 'new-order', label: 'Nuevo Pedido', icon: 'ShoppingCart' },
    { id: 'tracking', label: 'Seguimiento', icon: 'MapPin' },
    { id: 'reorder', label: 'Volver a Pedir', icon: 'RotateCcw' },
  ];

  // Estados para modales de confirmación
  const [showConfirmRemoveItem, setShowConfirmRemoveItem] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  
  const [showConfirmRemoveAddress, setShowConfirmRemoveAddress] = useState(false);
  const [addressToRemove, setAddressToRemove] = useState(null);
  
  const [showConfirmRemoveCard, setShowConfirmRemoveCard] = useState(false);
  const [cardToRemove, setCardToRemove] = useState(null);

  // 🔹 Cargar direcciones del usuario
  const [addresses, setAddresses] = useState([]);
  useEffect(() => {
    if (!user?.email) return;

    const userKey = user.email;
    const addressesKey = `addresses_${userKey}`;
    const deliveryKey = `deliveryAddress_${userKey}`;

    // Cargar direcciones guardadas
    const addressesRaw = localStorage.getItem(addressesKey);
    if (addressesRaw) {
      try {
        const parsedAddresses = JSON.parse(addressesRaw);
        setAddresses(parsedAddresses);
      } catch {
        setAddresses([]);
      }
    }

    // Cargar dirección de entrega seleccionada
    const savedSelectionRaw = localStorage.getItem(deliveryKey);
    if (savedSelectionRaw) {
      try {
        const parsed = JSON.parse(savedSelectionRaw);
        setDeliveryAddress(parsed);
      } catch {}
    }
  }, [user]);

  // 🔹 Cargar tarjetas del usuario
  const [savedCards, setSavedCards] = useState([]);
  useEffect(() => {
    if (!user?.email) return;

    const userKey = user.email;
    const cardsKey = `savedCards_${userKey}`;
    const selectedCardKey = `selectedCard_${userKey}`;

    // Cargar tarjetas guardadas
    const cardsRaw = localStorage.getItem(cardsKey);
    if (cardsRaw) {
      try {
        const parsedCards = JSON.parse(cardsRaw);
        setSavedCards(parsedCards);
      } catch {
        setSavedCards([]);
      }
    }

    // Cargar tarjeta seleccionada
    const selectedCardRaw = localStorage.getItem(selectedCardKey);
    if (selectedCardRaw) {
      try {
        const parsed = JSON.parse(selectedCardRaw);
        setSelectedCard(parsed);
      } catch {}
    }
  }, [user]);

  // 🔹 Manejar guardado de dirección
  const handleSaveAddress = (newAddress) => {
    const userKey = user?.email;
    if (!userKey) return;

    const addressesKey = `addresses_${userKey}`;
    const deliveryKey = `deliveryAddress_${userKey}`;

    let updatedAddresses;
    if (editingAddress) {
      // Editar dirección existente
      updatedAddresses = addresses.map(addr => 
        addr.id === editingAddress.id ? newAddress : addr
      );
    } else {
      // Nueva dirección
      updatedAddresses = [...addresses, newAddress];
    }

    setAddresses(updatedAddresses);
    localStorage.setItem(addressesKey, JSON.stringify(updatedAddresses));

    // Seleccionar automáticamente la nueva dirección
    setDeliveryAddress(newAddress);
    localStorage.setItem(deliveryKey, JSON.stringify(newAddress));

    setShowAddressModal(false);
    setEditingAddress(null);
  };

  // 🔹 Manejar guardado de tarjeta
  const handleSaveCard = (newCard) => {
    const userKey = user?.email;
    if (!userKey) return;

    const cardsKey = `savedCards_${userKey}`;
    const selectedCardKey = `selectedCard_${userKey}`;

    let updatedCards;
    if (editingCard) {
      // Editar tarjeta existente
      updatedCards = savedCards.map(card => 
        card.id === editingCard.id ? newCard : card
      );
    } else {
      // Nueva tarjeta
      updatedCards = [...savedCards, newCard];
    }

    setSavedCards(updatedCards);
    localStorage.setItem(cardsKey, JSON.stringify(updatedCards));

    // Seleccionar automáticamente la nueva tarjeta
    setSelectedCard(newCard);
    localStorage.setItem(selectedCardKey, JSON.stringify(newCard));

    setShowCardModal(false);
    setEditingCard(null);
  };

  // 🔹 Abrir modal para nueva dirección
  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowAddressModal(true);
  };

  // 🔹 Abrir modal para editar dirección
  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddressModal(true);
  };

  // 🔹 Abrir modal para nueva tarjeta
  const handleAddCard = () => {
    setEditingCard(null);
    setShowCardModal(true);
  };

  // 🔹 Abrir modal para editar tarjeta
  const handleEditCard = (card) => {
    setEditingCard(card);
    setShowCardModal(true);
  };

  // 🔹 Seleccionar dirección
  const handleSelectAddress = (address) => {
    setDeliveryAddress(address);
    if (user?.email) {
      localStorage.setItem(`deliveryAddress_${user.email}`, JSON.stringify(address));
    }
  };

  // 🔹 Seleccionar tarjeta
  const handleSelectCard = (card) => {
    setSelectedCard(card);
    setSelectedPaymentMethod('card');
    if (user?.email) {
      localStorage.setItem(`selectedCard_${user.email}`, JSON.stringify(card));
    }
  };

  // 🔹 Solicitar eliminación de dirección
  const handleRequestDeleteAddress = (addressId) => {
    const address = addresses.find(addr => addr.id === addressId);
    setAddressToRemove(address);
    setShowConfirmRemoveAddress(true);
  };

  // 🔹 Confirmar eliminación de dirección
  const handleConfirmDeleteAddress = () => {
    if (!addressToRemove) return;

    const updatedAddresses = addresses.filter(addr => addr.id !== addressToRemove.id);
    setAddresses(updatedAddresses);
    
    if (user?.email) {
      localStorage.setItem(`addresses_${user.email}`, JSON.stringify(updatedAddresses));
    }

    // Si la dirección eliminada era la seleccionada, limpiar selección
    if (deliveryAddress?.id === addressToRemove.id) {
      setDeliveryAddress(null);
      localStorage.removeItem(`deliveryAddress_${user.email}`);
    }

    setShowConfirmRemoveAddress(false);
    setAddressToRemove(null);
  };

  // 🔹 Solicitar eliminación de tarjeta
  const handleRequestDeleteCard = (cardId) => {
    const card = savedCards.find(c => c.id === cardId);
    setCardToRemove(card);
    setShowConfirmRemoveCard(true);
  };

  // 🔹 Confirmar eliminación de tarjeta
  const handleConfirmDeleteCard = () => {
    if (!cardToRemove) return;

    const updatedCards = savedCards.filter(card => card.id !== cardToRemove.id);
    setSavedCards(updatedCards);
    
    if (user?.email) {
      localStorage.setItem(`savedCards_${user.email}`, JSON.stringify(updatedCards));
    }

    // Si la tarjeta eliminada era la seleccionada, limpiar selección
    if (selectedCard?.id === cardToRemove.id) {
      setSelectedCard(null);
      localStorage.removeItem(`selectedCard_${user.email}`);
    }

    setShowConfirmRemoveCard(false);
    setCardToRemove(null);
  };

  // 🔹 Cancelar eliminaciones
  const handleCancelDelete = () => {
    setShowConfirmRemoveAddress(false);
    setShowConfirmRemoveCard(false);
    setShowConfirmRemoveItem(false);
    setAddressToRemove(null);
    setCardToRemove(null);
    setItemToRemove(null);
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

      const editData = {
        ...customData,
        editMode: true,
        originalItemId: itemId,
        productType: customData.type,
        selectedSize: customData.size,
        selectedIngredients: customData.ingredients || [],
        selectedExtras: customData.extras || []
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

  // 🔹 Solicitar eliminación de item del carrito
  const handleRequestRemoveItem = (itemId) => {
    const item = cartItems.find(i => i.id === itemId);
    if (!item) return;

    setItemToRemove(item);
    setShowConfirmRemoveItem(true);
  };

  // 🔹 Confirmar eliminación de item del carrito
  const handleConfirmRemoveItem = () => {
    if (itemToRemove) {
      removeFromCart(itemToRemove.id);
      setShowConfirmRemoveItem(false);
      setItemToRemove(null);
    }
  };

  const getItemName = (item) => {
    if (!item) return 'este producto';
    return item.customProduct?.name || item.name || item.product?.name || 'este producto';
  };

  const getAddressLabel = (address) => {
    if (!address) return 'esta dirección';
    return address.label || 'esta dirección';
  };

  const getCardLabel = (card) => {
    if (!card) return 'esta tarjeta';
    return `tarjeta terminada en ${card.last4 || '****'}`;
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
                    addresses={addresses}
                    onAddAddress={handleAddAddress}
                    onEditAddress={handleEditAddress}
                    onSelectAddress={handleSelectAddress}
                    onDeleteAddress={handleRequestDeleteAddress}
                  />

                  {/* Método de pago */}
                  <PaymentMethodCard
                    selectedMethod={selectedPaymentMethod}
                    onMethodChange={setSelectedPaymentMethod}
                    selectedCard={selectedCard}
                    savedCards={savedCards}
                    onAddCard={handleAddCard}
                    onEditCard={handleEditCard}
                    onSelectCard={handleSelectCard}
                    onDeleteCard={handleRequestDeleteCard}
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
                    onRemoveItem={handleRequestRemoveItem}
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

      {/* 🔹 MODALES */}
      <AddressModal
        isOpen={showAddressModal}
        onClose={() => {
          setShowAddressModal(false);
          setEditingAddress(null);
        }}
        onSave={handleSaveAddress}
        address={editingAddress}
        userEmail={user?.email}
      />

      <CardModal
        isOpen={showCardModal}
        onClose={() => {
          setShowCardModal(false);
          setEditingCard(null);
        }}
        onSave={handleSaveCard}
        card={editingCard}
        userEmail={user?.email}
      />

      {/* 🔹 MODALES DE CONFIRMACIÓN */}
      <ConfirmModal
        open={showConfirmRemoveItem}
        title="Eliminar del carrito"
        message={`¿Seguro que deseas eliminar "${getItemName(itemToRemove)}" del carrito?`}
        onConfirm={handleConfirmRemoveItem}
        onCancel={handleCancelDelete}
      />

      <ConfirmModal
        open={showConfirmRemoveAddress}
        title="Eliminar dirección"
        message={`¿Seguro que deseas eliminar "${getAddressLabel(addressToRemove)}"?`}
        onConfirm={handleConfirmDeleteAddress}
        onCancel={handleCancelDelete}
      />

      <ConfirmModal
        open={showConfirmRemoveCard}
        title="Eliminar tarjeta"
        message={`¿Seguro que deseas eliminar la ${getCardLabel(cardToRemove)}?`}
        onConfirm={handleConfirmDeleteCard}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default CartPage;