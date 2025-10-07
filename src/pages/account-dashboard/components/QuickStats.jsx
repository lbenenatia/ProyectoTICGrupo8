import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStats = ({ stats }) => {
  const statItems = [
    {
      icon: 'ShoppingBag',
      label: 'Orders This Month',
      value: stats?.monthlyOrders,
      change: '+12%',
      changeType: 'positive',
      color: 'text-primary'
    },
    {
      icon: 'Heart',
      label: 'Favorite Items',
      value: stats?.favoriteItems,
      change: '+3',
      changeType: 'positive',
      color: 'text-error'
    },
    {
      icon: 'Award',
      label: 'Points Earned',
      value: stats?.pointsEarned,
      change: '+45',
      changeType: 'positive',
      color: 'text-accent'
    },
    {
      icon: 'Target',
      label: 'Nutrition Goal',
      value: `${stats?.nutritionGoal}%`,
      change: '+8%',
      changeType: 'positive',
      color: 'text-success'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems?.map((item, index) => (
        <div key={index} className="bg-card rounded-lg p-4 shadow-warm-sm">
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg bg-muted ${item?.color}`}>
              <Icon name={item?.icon} size={20} />
            </div>
            <div className={`text-xs px-2 py-1 rounded-full ${
              item?.changeType === 'positive' ?'bg-success/10 text-success' :'bg-error/10 text-error'
            }`}>
              {item?.change}
            </div>
          </div>
          <div className="text-2xl font-bold text-text-primary mb-1">{item?.value}</div>
          <div className="text-sm text-text-secondary">{item?.label}</div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;