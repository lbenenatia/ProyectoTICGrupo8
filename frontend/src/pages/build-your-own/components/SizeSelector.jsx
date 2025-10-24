import React from 'react';
import Icon from '../../../components/AppIcon';

const SizeSelector = ({ selectedSize, onSizeChange, productType }) => {
  const pizzaSizes = [
    {
      id: 'small',
      name: 'Small',
      size: '25.4 cm',
      servings: '1-2 personas',
      multiplier: 1
    },
    {
      id: 'medium',
      name: 'Medium',
      size: '30.48 cm',
      servings: '2-3 personas',
      multiplier: 1.4,
      popular: true
    },
    {
      id: 'large',
      name: 'Grande',
      size: '35.56 cm',
      servings: '3-4 personas',
      multiplier: 1.8
    }
  ];

  const burgerSizes = [
    {
      id: 'single',
      name: 'Simple',
      size: '1/4 lb',
      servings: 'Regular appetite',
      multiplier: 1
    },
    {
      id: 'double',
      name: 'Doble',
      size: '1/2 lb',
      servings: 'Hearty appetite',
      multiplier: 1.6
    },
    {
      id: 'triple',
      name: 'Triple',
      size: '3/4 lb',
      servings: 'Big appetite',
      multiplier: 2.2
    }
  ];

  const sizes = productType === 'pizza' ? pizzaSizes : burgerSizes;

  return (
    <div className="bg-card rounded-lg p-6 shadow-warm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-text-primary">Tamaño</h2>
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
            
            <div className="text-center">
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