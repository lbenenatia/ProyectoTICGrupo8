import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import OrderSummaryCard from './components/OrderSummaryCard';
import DeliveryOptionsCard from './components/DeliveryOptionsCard';
import PaymentMethodCard from './components/PaymentMethodCard';
import OrderTrackingCard from './components/OrderTrackingCard';
import QuickReorderCard from './components/QuickReorderCard';
import GroupOrderCard from './components/GroupOrderCard';

const OrderDeliveryPage = () => {
  const [activeTab, setActiveTab] = useState('new-order');
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState('delivery');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [deliveryAddress, setDeliveryAddress] = useState(null);

  // Mock data for current cart
  const [cartItems] = useState([
    {
      id: 1,
      name: "Margherita Pizza",
      size: "Large",
      customizations: "Extra cheese, Gluten-free base",
      price: 18.99,
      image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400"
    },
    {
      id: 2,
      name: "Classic Cheeseburger",
      size: "Regular",
      customizations: "No pickles, Extra bacon",
      price: 12.99,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"
    }
  ]);

  // Mock data for saved cards
  const [savedCards] = useState([
    {
      id: 1,
      last4: "4242",
      brand: "Visa",
      expiry: "12/25"
    },
    {
      id: 2,
      last4: "5555",
      brand: "Mastercard",
      expiry: "08/26"
    }
  ]);

  // Mock data for active orders
  const [activeOrders] = useState([
    {
      id: "ORD-2025-001",
      status: "out-for-delivery",
      deliveryType: "delivery",
      createdAt: "2025-01-07T11:00:00Z",
      confirmedAt: "2025-01-07T11:02:00Z",
      preparingAt: "2025-01-07T11:15:00Z",
      readyAt: "2025-01-07T11:45:00Z",
      estimatedTime: 35,
      driver: {
        name: "Mike Johnson",
        vehicle: "Honda Civic - ABC 123",
        rating: 4.8
      },
      items: cartItems,
      total: 34.97
    }
  ]);

  // Mock data for favorite orders
  const [favoriteOrders] = useState([
    {
      id: 1,
      name: "Margherita Pizza (Large)",
      description: "Extra cheese, Gluten-free base",
      price: 18.99,
      lastOrdered: "2025-01-05T19:30:00Z",
      image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400"
    },
    {
      id: 2,
      name: "BBQ Chicken Pizza (Medium)",
      description: "Extra BBQ sauce, Red onions",
      price: 16.99,
      lastOrdered: "2025-01-03T20:15:00Z",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400"
    },
    {
      id: 3,
      name: "Bacon Cheeseburger",
      description: "Double patty, Extra bacon",
      price: 14.99,
      lastOrdered: "2025-01-02T18:45:00Z",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"
    }
  ]);

  // Mock data for recent orders
  const [recentOrders] = useState([
    ...favoriteOrders,
    {
      id: 4,
      name: "Veggie Supreme Pizza",
      description: "Bell peppers, Mushrooms, Olives",
      price: 17.99,
      lastOrdered: "2024-12-30T17:20:00Z",
      image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400"
    },
    {
      id: 5,
      name: "Chicken Deluxe Burger",
      description: "Grilled chicken, Avocado",
      price: 13.99,
      lastOrdered: "2024-12-28T19:10:00Z",
      image: "https://images.unsplash.com/photo-1606755962773-d324e9a13086?w=400"
    }
  ]);

  // Mock data for group order
  const [groupOrder] = useState({
    id: "GRP-2025-001",
    organizer: "user-1",
    deadline: "2025-01-07T13:00:00Z",
    deliveryAddress: "123 Main St, New York, NY 10001",
    paymentMethod: "Split evenly",
    members: [
      {
        id: "user-1",
        name: "You",
        email: "you@example.com",
        status: "completed",
        items: [
          {
            id: 1,
            name: "Margherita Pizza",
            customizations: "Large, Extra cheese",
            price: 18.99,
            image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400"
          }
        ]
      },
      {
        id: "user-2",
        name: "Sarah Wilson",
        email: "sarah@example.com",
        status: "completed",
        items: [
          {
            id: 2,
            name: "BBQ Chicken Pizza",
            customizations: "Medium, Extra BBQ sauce",
            price: 16.99,
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400"
          }
        ]
      },
      {
        id: "user-3",
        name: "John Davis",
        email: "john@example.com",
        status: "pending",
        items: []
      }
    ]
  });

  // Set default delivery address
  useEffect(() => {
    setDeliveryAddress({
      label: "Home",
      address: "123 Main Street",
      city: "New York",
      state: "NY",
      zip: "10001"
    });
  }, []);

  const calculateOrderTotals = () => {
    const subtotal = cartItems?.reduce((sum, item) => sum + item?.price, 0);
    const deliveryFee = selectedDeliveryOption === 'delivery' ? 2.99 : 0;
    const tax = subtotal * 0.08;
    const total = subtotal + deliveryFee + tax;

    return { subtotal, deliveryFee, tax, total };
  };

  const handleModifyItem = (itemId) => {
    console.log('Modify item:', itemId);
  };

  const handleRemoveItem = (itemId) => {
    console.log('Remove item:', itemId);
  };

  const handlePlaceOrder = () => {
    console.log('Placing order...');
  };

  const handleReorder = (order) => {
    console.log('Reordering:', order);
  };

  const handleModifyAndReorder = (order) => {
    console.log('Modify and reorder:', order);
  };

  const handleCancelOrder = (orderId) => {
    console.log('Cancel order:', orderId);
  };

  const handleContactDriver = (driver) => {
    console.log('Contact driver:', driver);
  };

  const handleInviteMembers = (emails) => {
    console.log('Invite members:', emails);
  };

  const handleRemoveMember = (memberId) => {
    console.log('Remove member:', memberId);
  };

  const handleFinalizeGroupOrder = () => {
    console.log('Finalize group order');
  };

  const tabs = [
    { id: 'new-order', label: 'New Order', icon: 'ShoppingCart' },
    { id: 'tracking', label: 'Order Tracking', icon: 'MapPin' },
    { id: 'reorder', label: 'Quick Reorder', icon: 'RotateCcw' },
    { id: 'group', label: 'Group Order', icon: 'Users' }
  ];

  const { subtotal, deliveryFee, tax, total } = calculateOrderTotals();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-12">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="text-center">
              <h1 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
                Order & Delivery
              </h1>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                Complete your order, track delivery, and manage your food preferences all in one place
              </p>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="bg-card border-b border-border sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="flex space-x-1 overflow-x-auto py-4">
              {tabs?.map((tab) => (
                <Button
                  key={tab?.id}
                  variant={activeTab === tab?.id ? "default" : "ghost"}
                  size="sm"
                  iconName={tab?.icon}
                  iconPosition="left"
                  onClick={() => setActiveTab(tab?.id)}
                  className="whitespace-nowrap"
                >
                  {tab?.label}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            
            {/* New Order Tab */}
            {activeTab === 'new-order' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <DeliveryOptionsCard
                    selectedOption={selectedDeliveryOption}
                    onOptionChange={setSelectedDeliveryOption}
                    deliveryAddress={deliveryAddress}
                    onAddressChange={setDeliveryAddress}
                  />
                  
                  <PaymentMethodCard
                    selectedMethod={selectedPaymentMethod}
                    onMethodChange={setSelectedPaymentMethod}
                    savedCards={savedCards}
                    onAddCard={() => {}}
                  />
                </div>
                
                <div className="space-y-6">
                  <OrderSummaryCard
                    items={cartItems}
                    subtotal={subtotal}
                    deliveryFee={deliveryFee}
                    tax={tax}
                    total={total}
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
                    disabled={cartItems?.length === 0}
                  >
                    Place Order - ${total?.toFixed(2)}
                  </Button>
                </div>
              </div>
            )}

            {/* Order Tracking Tab */}
            {activeTab === 'tracking' && (
              <div className="max-w-4xl mx-auto">
                {activeOrders?.length > 0 ? (
                  <div className="space-y-6">
                    {activeOrders?.map((order) => (
                      <OrderTrackingCard
                        key={order?.id}
                        order={order}
                        onCancelOrder={handleCancelOrder}
                        onContactDriver={handleContactDriver}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Icon name="Package" size={48} className="text-text-secondary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-text-primary mb-2">No Active Orders</h3>
                    <p className="text-text-secondary mb-6">You don't have any orders in progress right now</p>
                    <Button variant="default" iconName="ShoppingCart" iconPosition="left">
                      Start New Order
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Quick Reorder Tab */}
            {activeTab === 'reorder' && (
              <div className="max-w-4xl mx-auto">
                <QuickReorderCard
                  favoriteOrders={favoriteOrders}
                  recentOrders={recentOrders}
                  onReorder={handleReorder}
                  onModifyAndReorder={handleModifyAndReorder}
                />
              </div>
            )}

            {/* Group Order Tab */}
            {activeTab === 'group' && (
              <div className="max-w-4xl mx-auto">
                <GroupOrderCard
                  groupOrder={groupOrder}
                  onInviteMembers={handleInviteMembers}
                  onRemoveMember={handleRemoveMember}
                  onFinalizeOrder={handleFinalizeGroupOrder}
                />
              </div>
            )}
          </div>
        </section>

        {/* Quick Actions Footer */}
        <section className="bg-card border-t border-border py-8">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-text-primary mb-2">Need Help?</h3>
              <p className="text-text-secondary">Our support team is here to assist you</p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="outline" iconName="MessageCircle" iconPosition="left">
                Live Chat Support
              </Button>
              <Button variant="outline" iconName="Phone" iconPosition="left">
                Call (555) 123-4567
              </Button>
              <Button variant="outline" iconName="Mail" iconPosition="left">
                Email Support
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default OrderDeliveryPage;