import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const QuickReorderCard = ({ favoriteOrders, recentOrders, onReorder, onModifyAndReorder }) => {
  const renderOrderItem = (order, isFavorite = false) => (
    <div key={order?.id} className="p-4 bg-background rounded-lg border border-border hover:border-primary/50 transition-warm">
      <div className="flex items-start space-x-3">
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={order?.image}
            alt={order?.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-text-primary">{order?.name}</h4>
              <p className="text-sm text-text-secondary mt-1">{order?.description}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm font-medium text-primary">${order?.price?.toFixed(2)}</span>
                <span className="text-xs text-text-secondary">
                  Last ordered: {new Date(order.lastOrdered)?.toLocaleDateString()}
                </span>
              </div>
            </div>
            {isFavorite && (
              <Icon name="Heart" size={16} className="text-error fill-current" />
            )}
          </div>
          <div className="flex items-center space-x-2 mt-3">
            <Button
              variant="default"
              size="xs"
              iconName="RotateCcw"
              onClick={() => onReorder(order)}
            >
              Reorder
            </Button>
            <Button
              variant="outline"
              size="xs"
              iconName="Edit"
              onClick={() => onModifyAndReorder(order)}
            >
              Modify & Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Favorite Orders */}
      {favoriteOrders && favoriteOrders?.length > 0 && (
        <div className="bg-card rounded-lg border border-border p-6 shadow-warm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Icon name="Heart" size={20} className="text-error" />
              <h3 className="text-lg font-semibold text-text-primary">Favorite Orders</h3>
            </div>
            <Button variant="ghost" size="sm" iconName="MoreHorizontal" />
          </div>
          <div className="space-y-3">
            {favoriteOrders?.slice(0, 3)?.map(order => renderOrderItem(order, true))}
          </div>
          {favoriteOrders?.length > 3 && (
            <Button variant="ghost" size="sm" className="mt-4" fullWidth>
              View All Favorites ({favoriteOrders?.length})
            </Button>
          )}
        </div>
      )}
      {/* Recent Orders */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-warm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-text-primary">Recent Orders</h3>
          </div>
          <Button variant="ghost" size="sm" iconName="MoreHorizontal" />
        </div>
        <div className="space-y-3">
          {recentOrders?.slice(0, 5)?.map(order => renderOrderItem(order))}
        </div>
        {recentOrders?.length > 5 && (
          <Button variant="ghost" size="sm" className="mt-4" fullWidth>
            View Order History
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuickReorderCard;