import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import { useCart } from 'context/CartContext';
import Header from '../../components/ui/Header';
import ProfileCard from './components/ProfileCard';
import RecentOrders from './components/RecentOrders';
import FavoriteItems from './components/FavoriteItems';
import AddressesCard from './components/AddressesCard';
import CardsInfo from './components/CardsInfo';
import AddressModal from './components/AddressModal';
import CardModal from './components/CardModal';
import Icon from '../../components/AppIcon';

const AccountDashboard = () => {
  const { user } = useAuth();
  const { favorites, removeFromFavorites, addToCart } = useCart();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [addresses, setAddresses] = useState([]);
  const [cards, setCards] = useState([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    if (location.state?.defaultTab) {
      setActiveTab(location.state.defaultTab);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.email) return;

      try {
        const response = await fetch(`http://localhost:4028/api/user/${user.email}`);
        if (response.ok) {
          const data = await response.json();
          setAddresses(data.addresses || []);
          setCards(data.cards || []);
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
      }
    };

    fetchUserData();
  }, [user]);

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

  const handleViewOrderDetails = (orderId) => {
    console.log('View order details for:', orderId);
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
  };

  const handleRemoveFavorite = (itemId) => {
    if (window.confirm('¿Estás seguro de que querés eliminar este favorito?')) {
      removeFromFavorites(itemId);
    }
  };

  const handleCustomizeItem = (itemId) => {
    const favorite = favorites.find(fav => fav.id === itemId);
    if (!favorite) return;

    localStorage.setItem("editingFavorite", JSON.stringify({
      ...favorite,
      editMode: true
    }));

    if (favorite.customData?.type === 'pizza') {
      window.location.href = '/customize?product=pizza&edit=true';
    } else if (favorite.customData?.type === 'burger') {
      window.location.href = '/customize?product=burger&edit=true';
    } else {
      window.location.href = '/customize';
    }
  };

  const handleAddAddress = () => {
    setSelectedAddress(null);
    setIsAddressModalOpen(true);
  };

  const handleEditAddress = (address) => {
    setSelectedAddress(address);
    setIsAddressModalOpen(true);
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('¿Estás seguro de que querés eliminar esta dirección?')) return;

    try {
      const response = await fetch(`http://localhost:4028/api/user/addresses/${addressId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setAddresses(addresses.filter(a => a.id !== addressId));
      }
    } catch (error) {
      console.error('Error al eliminar dirección:', error);
    }
  };

  const handleSaveAddress = (savedAddress) => {
    if (selectedAddress) {
      setAddresses(addresses.map(a => a.id === savedAddress.id ? savedAddress : a));
    } else {
      setAddresses([...addresses, savedAddress]);
    }
  };

  const handleAddCard = () => {
    setSelectedCard(null);
    setIsCardModalOpen(true);
  };

  const handleEditCard = (card) => {
    setSelectedCard(card);
    setIsCardModalOpen(true);
  };

  const handleDeleteCard = async (cardId) => {
    if (!window.confirm('¿Estás seguro de que querés eliminar esta tarjeta?')) return;

    try {
      const response = await fetch(`http://localhost:4028/api/user/cards/${cardId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setCards(cards.filter(c => c.id !== cardId));
      }
    } catch (error) {
      console.error('Error al eliminar tarjeta:', error);
    }
  };

  const handleSaveCard = (savedCard) => {
    if (selectedCard) {
      setCards(cards.map(c => c.id === savedCard.id ? savedCard : c));
    } else {
      setCards([...cards, savedCard]);
    }
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
                onCustomize={handleCustomizeItem}
              />
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AddressesCard
                addresses={addresses}
                onEditAddress={handleEditAddress}
                onAddAddress={handleAddAddress}
                onDeleteAddress={handleDeleteAddress}
              />
              <CardsInfo
                cards={cards}
                onEditCard={handleEditCard}
                onAddCard={handleAddCard}
                onDeleteCard={handleDeleteCard}
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
            onCustomize={handleCustomizeItem}
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
                onCustomize={handleCustomizeItem}
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
        onClose={() => setIsAddressModalOpen(false)}
        onSave={handleSaveAddress}
        address={selectedAddress}
        userEmail={user?.email}
      />

      <CardModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        onSave={handleSaveCard}
        card={selectedCard}
        userEmail={user?.email}
      />
    </div>
  );
};

export default AccountDashboard;