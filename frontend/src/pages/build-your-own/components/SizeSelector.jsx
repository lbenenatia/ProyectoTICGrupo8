import React from 'react';
import Icon from '../../../components/AppIcon';

const SizeSelector = ({ selectedSize, onSizeChange, productType }) => {
  const pizzaSizes = [
    {
      id: 'small',
      name: 'Small',
      size: '10"',
      servings: '1-2 people',
      multiplier: 1,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=200&fit=crop'
    },
    {
      id: 'medium',
      name: 'Medium',
      size: '12"',
      servings: '2-3 people',
      multiplier: 1.4,
      popular: true,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=250&h=250&fit=crop'
    },
    {
      id: 'large',
      name: 'Large',
      size: '14"',
      servings: '3-4 people',
      multiplier: 1.8,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=300&fit=crop'
    },
    {
      id: 'xlarge',
      name: 'X-Large',
      size: '16"',
      servings: '4-6 people',
      multiplier: 2.2,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=350&h=350&fit=crop'
    }
  ];

  const burgerSizes = [
    {
      id: 'single',
      name: 'Single',
      size: '1/4 lb',
      servings: 'Regular appetite',
      multiplier: 1,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop'
    },
    {
      id: 'double',
      name: 'Double',
      size: '1/2 lb',
      servings: 'Hearty appetite',
      multiplier: 1.6,
      popular: true,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=250&h=250&fit=crop'
    },
    {
      id: 'triple',
      name: 'Triple',
      size: '3/4 lb',
      servings: 'Big appetite',
      multiplier: 2.2,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&fit=crop'
    }
  ];

  const sizes = productType === 'pizza' ? pizzaSizes : burgerSizes;

  return (
    <div className="bg-card rounded-lg p-6 shadow-warm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-text-primary">Choose Size</h2>
        <Icon name="Ruler" size={20} className="text-text-secondary" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {sizes?.map((size) => (
          <div
            key={size?.id}
            className={`relative border-2 rounded-lg p-4 cursor-pointer transition-warm ${
              selectedSize === size?.id
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
            }`}
            onClick={() => onSizeChange(size?.id)}
          >
            {size?.popular && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <span className="bg-accent text-accent-foreground text-xs font-medium px-2 py-1 rounded-full">
                  Popular
                </span>
              </div>
            )}
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden bg-muted">
                <img 
                  src={size?.image} 
                  alt={size?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-text-primary">{size?.name}</h3>
              <p className="text-sm text-primary font-medium">{size?.size}</p>
              <p className="text-xs text-text-secondary mt-1">{size?.servings}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;