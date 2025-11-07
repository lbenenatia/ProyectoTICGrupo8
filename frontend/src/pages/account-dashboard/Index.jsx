import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import Header from '../../components/ui/Header';
import ProfileCard from './components/ProfileCard';
import RecentOrders from './components/RecentOrders';
import FavoriteItems from './components/FavoriteItems';
import Icon from '../../components/AppIcon';

const AccountDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');

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
    { id: 'orders', name: 'Orders', icon: 'ShoppingBag' },
    { id: 'favorites', name: 'Favorites', icon: 'Heart' },
  ];

  // Event handlers
  const handleEditProfile = () => {
    console.log('Edit profile clicked');
  };

  const handleReorder = (orderId) => {
    console.log('Reorder clicked for:', orderId);
  };

  const handleViewOrderDetails = (orderId) => {
    console.log('View order details for:', orderId);
  };

  const handleAddToCart = (itemId) => {
    console.log('Add to cart:', itemId);
  };

  const handleRemoveFavorite = (itemId) => {
    console.log('Remove favorite:', itemId);
  };

  const handleCustomizeItem = (itemId) => {
    console.log('Customize item:', itemId);
  };

  const handleQuickAction = (actionId) => {
    console.log('Quick action:', actionId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentOrders />
              <FavoriteItems />
            </div>
          </div>
        );
      case 'orders':
        return (
          <RecentOrders />
        );
      case 'favorites':
        return (
          <FavoriteItems />
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
    </div>
  );
};

export default AccountDashboard;