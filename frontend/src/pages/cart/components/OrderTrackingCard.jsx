import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const OrderTrackingCard = ({ order, onCancelOrder, onContactDriver }) => {
  const trackingSteps = [
    {
      id: 'confirmed',
      title: 'Order Confirmed',
      description: 'We received your order',
      time: order?.confirmedAt,
      completed: true
    },
    {
      id: 'preparing',
      title: 'Preparing Food',
      description: 'Our chefs are working on your order',
      time: order?.preparingAt,
      completed: order?.status !== 'confirmed'
    },
    {
      id: 'ready',
      title: order?.deliveryType === 'delivery' ? 'Out for Delivery' : 'Ready for Pickup',
      description: order?.deliveryType === 'delivery' ?'Your order is on the way' :'Your order is ready for pickup',
      time: order?.readyAt,
      completed: ['out-for-delivery', 'ready-for-pickup', 'delivered', 'completed']?.includes(order?.status)
    },
    {
      id: 'delivered',
      title: order?.deliveryType === 'delivery' ? 'Delivered' : 'Picked Up',
      description: order?.deliveryType === 'delivery' ?'Order delivered successfully' :'Order picked up successfully',
      time: order?.deliveredAt,
      completed: ['delivered', 'completed']?.includes(order?.status)
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-warning';
      case 'preparing': return 'text-warning';
      case 'out-for-delivery': case'ready-for-pickup': return 'text-primary';
      case 'delivered': case'completed': return 'text-success';
      default: return 'text-text-secondary';
    }
  };

  const getEstimatedTime = () => {
    const now = new Date();
    const orderTime = new Date(order.createdAt);
    const elapsed = Math.floor((now - orderTime) / (1000 * 60));
    const remaining = Math.max(0, order?.estimatedTime - elapsed);
    
    if (remaining === 0) return 'Any moment now';
    return `${remaining} min remaining`;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-warm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Order #{order?.id}</h3>
          <p className="text-sm text-text-secondary">Placed on {new Date(order.createdAt)?.toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <p className={`text-sm font-medium ${getStatusColor(order?.status)}`}>
            {order?.status?.replace('-', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
          </p>
          <p className="text-sm text-text-secondary">{getEstimatedTime()}</p>
        </div>
      </div>
      {/* Progress Timeline */}
      <div className="space-y-4 mb-6">
        {trackingSteps?.map((step, index) => (
          <div key={step?.id} className="flex items-start space-x-4">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step?.completed 
                  ? 'bg-success text-success-foreground' 
                  : 'bg-muted text-text-secondary'
              }`}>
                {step?.completed ? (
                  <Icon name="Check" size={16} />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              {index < trackingSteps?.length - 1 && (
                <div className={`w-0.5 h-8 mt-2 ${
                  step?.completed ? 'bg-success' : 'bg-border'
                }`} />
              )}
            </div>
            <div className="flex-1 pb-4">
              <h4 className={`font-medium ${
                step?.completed ? 'text-text-primary' : 'text-text-secondary'
              }`}>
                {step?.title}
              </h4>
              <p className="text-sm text-text-secondary mt-1">{step?.description}</p>
              {step?.time && (
                <p className="text-xs text-text-secondary mt-1">
                  {new Date(step.time)?.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Driver Information (for delivery orders) */}
      {order?.deliveryType === 'delivery' && order?.driver && order?.status === 'out-for-delivery' && (
        <div className="bg-background rounded-lg p-4 mb-4">
          <h4 className="font-medium text-text-primary mb-3">Your Delivery Driver</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-medium">
                  {order?.driver?.name?.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-text-primary">{order?.driver?.name}</p>
                <p className="text-sm text-text-secondary">{order?.driver?.vehicle}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Icon name="Star" size={12} className="text-warning fill-current" />
                  <span className="text-xs text-text-secondary">{order?.driver?.rating}</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              iconName="Phone"
              onClick={() => onContactDriver(order?.driver)}
            >
              Call
            </Button>
          </div>
        </div>
      )}
      {/* Live Map (for delivery orders) */}
      {order?.deliveryType === 'delivery' && order?.status === 'out-for-delivery' && (
        <div className="bg-background rounded-lg p-4 mb-4">
          <h4 className="font-medium text-text-primary mb-3">Live Tracking</h4>
          <div className="w-full h-48 rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              title="Delivery Tracking"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=40.7128,-74.0060&z=14&output=embed"
            />
          </div>
        </div>
      )}
      {/* Order Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {order?.status === 'confirmed' && (
          <Button
            variant="outline"
            size="sm"
            iconName="X"
            onClick={() => onCancelOrder(order?.id)}
          >
            Cancel Order
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          iconName="MessageCircle"
        >
          Contact Support
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          iconName="Receipt"
        >
          View Receipt
        </Button>
      </div>
    </div>
  );
};

export default OrderTrackingCard;