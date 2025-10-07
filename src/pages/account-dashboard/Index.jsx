import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import ProfileCard from './components/ProfileCard';
import QuickStats from './components/QuickStats';
import RecentOrders from './components/RecentOrders';
import FavoriteItems from './components/FavoriteItems';
import LoyaltyRewards from './components/LoyaltyRewards';
import NutritionTracker from './components/NutritionTracker';
import FamilyProfiles from './components/FamilyProfiles';
import QuickActions from './components/QuickActions';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AccountDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  // Mock user data
  const userData = {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    location: "Downtown, Seattle",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    totalOrders: 47,
    loyaltyPoints: 1250,
    memberSince: "March 2023"
  };

  // Mock stats data
  const statsData = {
    monthlyOrders: 8,
    favoriteItems: 12,
    pointsEarned: 245,
    nutritionGoal: 78
  };

  // Mock recent orders
  const recentOrders = [
    {
      id: "ORD-2024-001",
      name: "Custom Margherita Pizza",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop",
      date: "Oct 5, 2024",
      total: 18.99,
      status: "delivered",
      items: 2,
      points: 19,
      isCustom: true
    },
    {
      id: "ORD-2024-002",
      name: "BBQ Bacon Burger",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop",
      date: "Oct 3, 2024",
      total: 24.50,
      status: "delivered",
      items: 3,
      points: 25,
      isCustom: false
    },
    {
      id: "ORD-2024-003",
      name: "Family Combo Deal",
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=100&h=100&fit=crop",
      date: "Sep 28, 2024",
      total: 45.99,
      status: "delivered",
      items: 6,
      points: 46,
      isCustom: false
    }
  ];

  // Mock favorite items
  const favoriteItems = [
    {
      id: "fav-001",
      name: "Gluten-Free Veggie Supreme",
      description: "Custom pizza with gluten-free base, fresh vegetables, and dairy-free cheese",
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=150&h=150&fit=crop",
      price: 22.99,
      prepTime: 25,
      isCustom: true,
      dietary: { glutenFree: true, vegan: true, keto: false }
    },
    {
      id: "fav-002",
      name: "Keto Bacon Cheeseburger",
      description: "Lettuce wrap burger with extra bacon and cheese, no bun",
      image: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=150&h=150&fit=crop",
      price: 16.99,
      prepTime: 15,
      isCustom: true,
      dietary: { glutenFree: true, vegan: false, keto: true }
    },
    {
      id: "fav-003",
      name: "Classic Pepperoni Pizza",
      description: "Traditional pepperoni pizza with mozzarella cheese",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=150&h=150&fit=crop",
      price: 14.99,
      prepTime: 20,
      isCustom: false,
      dietary: { glutenFree: false, vegan: false, keto: false }
    },
    {
      id: "fav-004",
      name: "Vegan Buddha Burger",
      description: "Plant-based patty with avocado, sprouts, and vegan mayo",
      image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=150&h=150&fit=crop",
      price: 18.99,
      prepTime: 18,
      isCustom: false,
      dietary: { glutenFree: false, vegan: true, keto: false }
    }
  ];

  // Mock loyalty data
  const loyaltyData = {
    currentPoints: 1250,
    nextTierPoints: 2000,
    currentTier: "Silver",
    rewards: [
      {
        id: "reward-001",
        title: "Free Medium Pizza",
        description: "Any medium pizza of your choice",
        points: 500,
        icon: "Pizza"
      },
      {
        id: "reward-002",
        title: "20% Off Next Order",
        description: "Discount on your entire order",
        points: 300,
        icon: "Percent"
      },
      {
        id: "reward-003",
        title: "Free Delivery",
        description: "Free delivery for one month",
        points: 800,
        icon: "Truck"
      },
      {
        id: "reward-004",
        title: "Custom Creation Credit",
        description: "$10 credit for build-your-own items",
        points: 400,
        icon: "Gift"
      }
    ],
    recentEarnings: [
      { description: "Order #ORD-2024-001", points: 19, date: "Oct 5" },
      { description: "Review bonus", points: 10, date: "Oct 4" },
      { description: "Order #ORD-2024-002", points: 25, date: "Oct 3" },
      { description: "Referral bonus", points: 50, date: "Oct 1" }
    ]
  };

  // Mock nutrition data
  const nutritionData = {
    dailyGoals: [
      { name: "Calories", current: 1850, target: 2000, unit: "kcal", percentage: 92.5 },
      { name: "Protein", current: 85, target: 100, unit: "g", percentage: 85 },
      { name: "Carbs", current: 180, target: 200, unit: "g", percentage: 90 },
      { name: "Fiber", current: 22, target: 25, unit: "g", percentage: 88 }
    ],
    weeklyProgress: [
      { day: "Monday", completion: 95 },
      { day: "Tuesday", completion: 88 },
      { day: "Wednesday", completion: 92 },
      { day: "Thursday", completion: 78 },
      { day: "Friday", completion: 85 },
      { day: "Saturday", completion: 90 },
      { day: "Sunday", completion: 82 }
    ],
    achievements: [
      { id: 1, title: "Fiber Goal Met", icon: "Award", date: "Oct 5" },
      { id: 2, title: "Protein Streak", icon: "Target", date: "Oct 3" },
      { id: 3, title: "Balanced Week", icon: "TrendingUp", date: "Sep 30" },
      { id: 4, title: "Hydration Hero", icon: "Droplets", date: "Sep 28" }
    ]
  };

  // Mock family members
  const familyMembers = [
    {
      id: "family-001",
      name: "Mike Johnson",
      relationship: "spouse",
      age: 34,
      ageGroup: "adult",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      dietary: { glutenFree: false, vegan: false, vegetarian: false, keto: true, dairyFree: false },
      totalOrders: 23,
      favoriteItems: [
        { name: "Keto Burger", image: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=50&h=50&fit=crop" },
        { name: "Meat Lovers Pizza", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=50&h=50&fit=crop" }
      ]
    },
    {
      id: "family-002",
      name: "Emma Johnson",
      relationship: "daughter",
      age: 12,
      ageGroup: "child",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
      dietary: { glutenFree: true, vegan: false, vegetarian: true, keto: false, dairyFree: false },
      totalOrders: 15,
      favoriteItems: [
        { name: "Cheese Pizza", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=50&h=50&fit=crop" },
        { name: "Veggie Burger", image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=50&h=50&fit=crop" },
        { name: "Fruit Smoothie", image: "https://images.unsplash.com/photo-1553830591-d8632a99e6ff?w=50&h=50&fit=crop" }
      ]
    }
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: 'LayoutDashboard' },
    { id: 'orders', name: 'Orders', icon: 'ShoppingBag' },
    { id: 'favorites', name: 'Favorites', icon: 'Heart' },
    { id: 'nutrition', name: 'Nutrition', icon: 'TrendingUp' },
    { id: 'family', name: 'Family', icon: 'Users' },
    { id: 'rewards', name: 'Rewards', icon: 'Award' }
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
            <QuickStats stats={statsData} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentOrders 
                orders={recentOrders?.slice(0, 3)} 
                onReorder={handleReorder}
                onViewDetails={handleViewOrderDetails}
              />
              <QuickActions onAction={handleQuickAction} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FavoriteItems 
                favorites={favoriteItems?.slice(0, 2)}
                onAddToCart={handleAddToCart}
                onRemoveFavorite={handleRemoveFavorite}
                onCustomize={handleCustomizeItem}
              />
              <LoyaltyRewards 
                loyaltyData={loyaltyData}
                onRedeemReward={handleRedeemReward}
                onViewHistory={handleViewRewardHistory}
              />
            </div>
          </div>
        );
      case 'orders':
        return (
          <RecentOrders 
            orders={recentOrders}
            onReorder={handleReorder}
            onViewDetails={handleViewOrderDetails}
          />
        );
      case 'favorites':
        return (
          <FavoriteItems 
            favorites={favoriteItems}
            onAddToCart={handleAddToCart}
            onRemoveFavorite={handleRemoveFavorite}
            onCustomize={handleCustomizeItem}
          />
        );
      case 'nutrition':
        return (
          <NutritionTracker 
            nutritionData={nutritionData}
            onSetGoals={handleSetNutritionGoals}
            onViewDetails={handleViewNutritionDetails}
          />
        );
      case 'family':
        return (
          <FamilyProfiles 
            familyMembers={familyMembers}
            onAddMember={handleAddFamilyMember}
            onEditMember={handleEditFamilyMember}
            onViewOrders={handleViewFamilyOrders}
          />
        );
      case 'rewards':
        return (
          <LoyaltyRewards 
            loyaltyData={loyaltyData}
            onRedeemReward={handleRedeemReward}
            onViewHistory={handleViewRewardHistory}
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

          {/* Footer Actions */}
          <div className="bg-card rounded-lg p-6 shadow-warm">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Need Help?</h3>
                <p className="text-text-secondary">Contact our support team for assistance with your account</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" iconName="MessageCircle">
                  Live Chat
                </Button>
                <Button variant="outline" iconName="Phone">
                  Call Support
                </Button>
                <Button variant="default" iconName="Mail">
                  Email Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDashboard;