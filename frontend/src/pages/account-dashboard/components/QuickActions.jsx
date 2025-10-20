import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickActions = ({ onAction }) => {
  const actions = [
    {
      id: 'reorder-last',
      title: 'Ordenar último',
      description: 'Repite tu pedido más reciente',
      icon: 'RotateCcw',
      color: 'bg-primary text-primary-foreground',
      action: () => onAction('reorder-last')
    },
    {
      id: 'build-pizza',
      title: 'Crear Pizza',
      description: 'Crea una pizza personalizada',
      icon: 'Pizza',
      color: 'bg-accent text-accent-foreground',
      action: () => onAction('build-pizza')
    },
    {
      id: 'build-burger',
      title: 'Crear Hamburguesa',
      description: 'Crea una hamburguesa personalizada',
      icon: 'Beef',
      color: 'bg-secondary text-secondary-foreground',
      action: () => onAction('build-burger')
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
    </div>
  );
};

export default QuickActions;