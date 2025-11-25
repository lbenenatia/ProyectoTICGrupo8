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

  const [ordersList, setOrdersList] = useState([]);

  useEffect(() => {
    if (location.state?.defaultTab) {
      setActiveTab(location.state.defaultTab);
    }
  }, [location.state]);

  // Cargar datos del usuario (direcciones y tarjetas)
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

  useEffect(() => {
    if (!user?.email) return;

    fetch(`http://localhost:4028/api/orders/user/${user.email}/recent`)
      .then(res => res.json())
      .then(data => setOrdersList(data))
      .catch(err => console.error("Error cargando pedidos del usuario:", err));
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentOrders orders={ordersList} />  
              
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
                onEditAddress={setSelectedAddress}
                onAddAddress={() => setIsAddressModalOpen(true)}
                onDeleteAddress={(id) => setAddresses(addresses.filter(a => a.id !== id))}
              />
              <CardsInfo
                cards={cards}
                onEditCard={setSelectedCard}
                onAddCard={() => setIsCardModalOpen(true)}
                onDeleteCard={(id) => setCards(cards.filter(c => c.id !== id))}
              />
            </div>
          </div>
        );
      case 'orders':
        return <RecentOrders orders={ordersList} />;
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
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProfileCard user={userData} onEditProfile={handleEditProfile} />

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="border-b border-border">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-warm ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                    }`}>
                    <Icon name={tab.icon} size={16} />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="mb-8">
            {renderTabContent()}
          </div>
        </div>
      </div>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSave={() => {}}
        address={selectedAddress}
        userEmail={user?.email}
      />

      <CardModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        onSave={() => {}}
        card={selectedCard}
        userEmail={user?.email}
      />
    </div>
  );
};

export default AccountDashboard;
