import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import Header from '../../components/ui/Header';
import ProfileCard from './components/ProfileCard';
import RecentOrders from './components/RecentOrders';
import FavoriteItems from './components/FavoriteItems';
import QuickActions from './components/QuickActions';
import Icon from '../../components/AppIcon';

const AccountDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'es';
    setCurrentLanguage(savedLanguage);
  }, []);

  if (!user) {
    // redirect to login preserving where user was going
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Mock user data
  // Use authenticated user for profile header when available
  const userData = {
    name: user?.name,
    email: user?.email,
    location: user?.location,
    avatar: user?.avatar || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    memberSince: user?.memberSince
  };

  // Mock recent orders
  const recentOrders = [];

  // Mock favorite items
  const favoriteItems = [];  

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

  const handleRedeemReward = (rewardId) => {
    console.log('Redeem reward:', rewardId);
  };

  const handleViewRewardHistory = () => {
    console.log('View reward history');
  };

  const handleSetNutritionGoals = () => {
    console.log('Set nutrition goals');
  };

  const handleViewNutritionDetails = () => {
    console.log('View nutrition details');
  };

  const handleAddFamilyMember = () => {
    console.log('Add family member');
  };

  const handleEditFamilyMember = (memberId) => {
    console.log('Edit family member:', memberId);
  };

  const handleViewFamilyOrders = (memberId) => {
    console.log('View family orders for:', memberId);
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
              <QuickActions onAction={handleQuickAction} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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