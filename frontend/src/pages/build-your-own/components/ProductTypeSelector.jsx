import React from 'react';

import Icon from '../../../components/AppIcon';

const ProductTypeSelector = ({ selectedType, onTypeChange }) => {
  const productTypes = [
    {
      id: 'pizza',
      name: 'Pizza',
      icon: 'Pizza',
      description: 'Crea tu pizza perfecta desde cero',
    },
    {
      id: 'burger',
      name: 'Hamburguesa',
      icon: 'Hamburger',
      description: 'Crea tu hamburguesa perfecta desde cero',
    }
  ];

  return (
    <div className="bg-card rounded-lg p-6 shadow-warm">
      <h2 className="text-xl font-semibold text-text-primary mb-4">Elige tu producto</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {productTypes?.map((type) => (
          <div
            key={type?.id}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-warm ${
              selectedType === type?.id
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
            }`}
            onClick={() => onTypeChange(type?.id)}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                selectedType === type?.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-text-secondary'
              }`}>
                <Icon name={type?.icon} size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">{type?.name}</h3>
              </div>
            </div>
            <p className="text-sm text-text-secondary">{type?.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductTypeSelector;