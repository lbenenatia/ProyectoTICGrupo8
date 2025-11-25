import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import { useCart } from 'context/CartContext';
import { useToast } from '../../context/ToastContext';
import Header from '../../components/ui/Header';
import ProfileCard from './components/ProfileCard';
import RecentOrders from './components/RecentOrders';
import FavoriteItems from './components/FavoriteItems';
import AddressesCard from './components/AddressesCard';
import CardsInfo from './components/CardsInfo';
import AddressModal from '../../components/ui/AddressModal';
import CardModal from '../../components/ui/CardModal';
import Icon from '../../components/AppIcon';

const AccountDashboard = () => {
  const { user } = useAuth();
  const { favorites, removeFromFavorites, addToCart } = useCart();
  const { showToast } = useToast();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    if (location.state?.defaultTab) {
      setActiveTab(location.state.defaultTab);
    }
  }, [location.state]);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userData = {
    name: user.name,
    email: user.email,
    location: user.location,
    avatar: user.avatar,
    memberSince: user.createdAt
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: 'LayoutDashboard' },
    { id: 'profile', name: 'Perfil', icon: 'User' },
    { id: 'orders', name: 'Orders', icon: 'ShoppingBag' },
    { id: 'favorites', name: 'Favorites', icon: 'Heart' },
  ];

  const handleEditProfile = () => {
    console.log('Edit profile clicked');
  };

  const handleAddToCart = (itemId) => {
    const favorite = favorites.find(fav => fav.id === itemId);
    if (!favorite) return;

    const cartItem = {
      id: `custom-${Date.now()}`,
      name: favorite.name,
      description: favorite.customData?.ingredients?.map(i => i.name).join(', ') || favorite.description,
      price: favorite.price,
      image: favorite.image,
      quantity: 1,
      customData: favorite.customData
    };

    addToCart(cartItem);
    showToast("✅ Producto agregado al carrito");
  };

  const handleRemoveFavorite = (itemId) => {
    if (window.confirm('¿Estás seguro de que querés eliminar este favorito?')) {
      removeFromFavorites(itemId);
      showToast("🗑️ Favorito eliminado");
    }
  };

  // ✅ Helpers para localStorage
  const getAddressesKey = () => {
    const email = user?.email || "guest";
    return `addresses_${email}`;
  };

  const getCardsKey = () => {
    const email = user?.email || "guest";
    return `savedCards_${email}`;
  };

  // ✅ ADDRESS HANDLERS
  const handleAddAddress = () => {
    setSelectedAddress(null);
    setIsAddressModalOpen(true);
  };

  const handleEditAddress = (address) => {
    setSelectedAddress(address);
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = (addressData) => {
    const addressesKey = getAddressesKey();
    const saved = localStorage.getItem(addressesKey);
    let addresses = [];
    
    try {
      addresses = saved ? JSON.parse(saved) : [];
    } catch {
      addresses = [];
    }

    if (selectedAddress) {
      // ✅ Actualizar dirección existente
      const updated = addresses.map(a => 
        a.id === selectedAddress.id ? { ...addressData, id: selectedAddress.id } : a
      );
      localStorage.setItem(addressesKey, JSON.stringify(updated));
      showToast("✅ Dirección actualizada correctamente");
    } else {
      // ✅ Agregar nueva dirección
      const newAddress = { ...addressData, id: Date.now() };
      const updated = [...addresses, newAddress];
      localStorage.setItem(addressesKey, JSON.stringify(updated));
      showToast("✅ Dirección guardada correctamente");
    }

    // ✅ Cerrar modal
    setIsAddressModalOpen(false);
    setSelectedAddress(null);
    
    // ✅ Trigger storage event para sincronizar
    window.dispatchEvent(new StorageEvent('storage', {
      key: addressesKey,
      newValue: localStorage.getItem(addressesKey)
    }));
  };

  // ✅ CARD HANDLERS
  const handleAddCard = () => {
    setSelectedCard(null);
    setIsCardModalOpen(true);
  };

  const handleEditCard = (card) => {
    setSelectedCard(card);
    setIsCardModalOpen(true);
  };

  const handleSaveCard = (cardData) => {
    const cardsKey = getCardsKey();
    const saved = localStorage.getItem(cardsKey);
    let cards = [];
    
    try {
      cards = saved ? JSON.parse(saved) : [];
    } catch {
      cards = [];
    }

    if (selectedCard) {
      // ✅ Actualizar tarjeta existente
      const updated = cards.map(c => 
        c.id === selectedCard.id 
          ? { 
              ...cardData, 
              id: selectedCard.id,
              // Mantener el número si no se proporcionó uno nuevo
              number: cardData.number || cardData.cardNumber || selectedCard.number || selectedCard.cardNumber,
              cardNumber: cardData.cardNumber || cardData.number || selectedCard.cardNumber || selectedCard.number,
              holder: cardData.holder || cardData.cardHolder,
              cardHolder: cardData.cardHolder || cardData.holder,
              expiry: cardData.expiry || cardData.cardExpiry,
              cardExpiry: cardData.cardExpiry || cardData.expiry,
              cvv: cardData.cvv || cardData.cardCVV,
              cardCVV: cardData.cardCVV || cardData.cvv
            } 
          : c
      );
      localStorage.setItem(cardsKey, JSON.stringify(updated));
      showToast("✅ Tarjeta actualizada correctamente");
    } else {
      // ✅ Agregar nueva tarjeta
      const newCard = { 
        ...cardData, 
        id: Date.now(),
        number: cardData.cardNumber || cardData.number,
        cardNumber: cardData.cardNumber || cardData.number,
        holder: cardData.cardHolder || cardData.holder,
        cardHolder: cardData.cardHolder || cardData.holder,
        expiry: cardData.cardExpiry || cardData.expiry,
        cardExpiry: cardData.cardExpiry || cardData.expiry,
        cvv: cardData.cardCVV || cardData.cvv,
        cardCVV: cardData.cardCVV || cardData.cvv
      };
      const updated = [...cards, newCard];
      localStorage.setItem(cardsKey, JSON.stringify(updated));
      showToast("✅ Tarjeta guardada correctamente");
    }

    // ✅ Cerrar modal
    setIsCardModalOpen(false);
    setSelectedCard(null);
    
    // ✅ Trigger storage event para sincronizar
    window.dispatchEvent(new StorageEvent('storage', {
      key: cardsKey,
      newValue: localStorage.getItem(cardsKey)
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentOrders />
              <FavoriteItems
                favorites={favorites}
                onAddToCart={handleAddToCart}
                onRemoveFavorite={handleRemoveFavorite}
              />
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AddressesCard
                onEditAddress={handleEditAddress}
                onAddAddress={handleAddAddress}
              />
              <CardsInfo
                onEditCard={handleEditCard}
                onAddCard={handleAddCard}
              />
            </div>
          </div>
        );
      case 'orders':
        return (
          <RecentOrders />
        );
      case 'favorites':
        return (
          <FavoriteItems
            favorites={favorites}
            onAddToCart={handleAddToCart}
            onRemoveFavorite={handleRemoveFavorite}
          />
        );
      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentOrders />
              <FavoriteItems
                favorites={favorites}
                onAddToCart={handleAddToCart}
                onRemoveFavorite={handleRemoveFavorite}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <div className="mb-8">
            <ProfileCard user={userData} onEditProfile={handleEditProfile} />
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="border-b border-border">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-warm ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mb-8">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Modales */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setIsAddressModalOpen(false);
          setSelectedAddress(null);
        }}
        onSave={handleSaveAddress}
        address={selectedAddress}
      />

      <CardModal
        isOpen={isCardModalOpen}
        onClose={() => {
          setIsCardModalOpen(false);
          setSelectedCard(null);
        }}
        onSave={handleSaveCard}
        card={selectedCard}
      />
    </div>
  );
};

export default AccountDashboard;