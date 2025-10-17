import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RecentOrders = ({ orders, onReorder, onViewDetails }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-success bg-success/10';
      case 'preparing': return 'text-warning bg-warning/10';
      case 'cancelled': return 'text-error bg-error/10';
      default: return 'text-text-secondary bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return 'CheckCircle';
      case 'preparing': return 'Clock';
      case 'cancelled': return 'XCircle';
      default: return 'Package';
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-warm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Recent Orders</h3>
        <Button variant="ghost" size="sm" iconName="ExternalLink">
          View All
        </Button>
      </div>
      <div className="space-y-4">
        {orders?.map((order) => (
          <div key={order?.id} className="border border-border rounded-lg p-4 hover:shadow-warm-sm transition-warm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Image
                    src={order?.image}
                    alt={order?.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  {order?.isCustom && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                      <Icon name="Sparkles" size={8} className="text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-text-primary">{order?.name}</h4>
                  <p className="text-sm text-text-secondary">Order #{order?.id}</p>
                  <p className="text-sm text-text-secondary">{order?.date}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-text-primary">${order?.total}</div>
                <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(order?.status)}`}>
                  <Icon name={getStatusIcon(order?.status)} size={12} />
                  <span className="capitalize">{order?.status}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-text-secondary">
                <div className="flex items-center space-x-1">
                  <Icon name="Users" size={14} />
                  <span>{order?.items} items</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={14} />
                  <span>{order?.points} pts earned</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onViewDetails(order?.id)}
                  iconName="Eye"
                >
                  Details
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => onReorder(order?.id)}
                  iconName="RotateCcw"
                >
                  Reorder
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;