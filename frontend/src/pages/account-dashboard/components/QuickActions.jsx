import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ onAction }) => {
  const actions = [
    {
      id: 'reorder-last',
      title: 'Reorder Last',
      description: 'Repeat your most recent order',
      icon: 'RotateCcw',
      color: 'bg-primary text-primary-foreground',
      action: () => onAction('reorder-last')
    },
    {
      id: 'build-pizza',
      title: 'Build Pizza',
      description: 'Create custom pizza',
      icon: 'Pizza',
      color: 'bg-accent text-accent-foreground',
      action: () => onAction('build-pizza')
    },
    {
      id: 'build-burger',
      title: 'Build Burger',
      description: 'Create custom burger',
      icon: 'Beef',
      color: 'bg-secondary text-secondary-foreground',
      action: () => onAction('build-burger')
    },
    {
      id: 'family-order',
      title: 'Family Order',
      description: 'Order for multiple people',
      icon: 'Users',
      color: 'bg-success text-success-foreground',
      action: () => onAction('family-order')
    },
    {
      id: 'schedule-delivery',
      title: 'Schedule Delivery',
      description: 'Plan future orders',
      icon: 'Calendar',
      color: 'bg-warning text-warning-foreground',
      action: () => onAction('schedule-delivery')
    },
    {
      id: 'dietary-menu',
      title: 'Dietary Menu',
      description: 'Browse special diets',
      icon: 'Leaf',
      color: 'bg-muted text-text-primary',
      action: () => onAction('dietary-menu')
    }
  ];

  return (
    <div className="bg-card rounded-lg p-6 shadow-warm">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {actions?.map((action) => (
          <button
            key={action?.id}
            onClick={action?.action}
            className="flex flex-col items-center p-4 rounded-lg border border-border hover:shadow-warm-sm transition-warm group"
          >
            <div className={`p-3 rounded-lg mb-2 group-hover:scale-110 transition-transform ${action?.color}`}>
              <Icon name={action?.icon} size={20} />
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-text-primary mb-1">{action?.title}</div>
              <div className="text-xs text-text-secondary">{action?.description}</div>
            </div>
          </button>
        ))}
      </div>
      {/* Featured Promotions */}
      <div className="mt-6 pt-6 border-t border-border">
        <h4 className="font-medium text-text-primary mb-3">Today's Specials</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon name="Percent" size={16} className="text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium text-text-primary">20% Off Family Meals</div>
                <div className="text-xs text-text-secondary">Valid until midnight</div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Use Now
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-accent/5 border border-accent/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Icon name="Gift" size={16} className="text-accent" />
              </div>
              <div>
                <div className="text-sm font-medium text-text-primary">Free Delivery</div>
                <div className="text-xs text-text-secondary">On orders over $25</div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Order Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;