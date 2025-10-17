import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useCart } from '../../../context/CartContext';

const BurgerCard = ({ burger, onCustomize, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState('medium');
  const [showIngredients, setShowIngredients] = useState(false);
  const cart = useCart();

  const getSizePrice = (basePrice, size) => {
    const multipliers = { small: 0.8, medium: 1, large: 1.3, xl: 1.6 };
    return (basePrice * multipliers?.[size])?.toFixed(2);
  };

  const getSizeCalories = (baseCalories, size) => {
    const multipliers = { small: 0.8, medium: 1, large: 1.3, xl: 1.6 };
    return Math.round(baseCalories * multipliers?.[size]);
  };

  const getDietaryBadgeColor = (type) => {
    const colors = {
      'Gluten-Free': 'bg-success text-success-foreground',
      'Vegan': 'bg-accent text-accent-foreground',
      'Keto': 'bg-secondary text-secondary-foreground',
      'Vegetarian': 'bg-warning text-warning-foreground'
    };
    return colors?.[type] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="bg-card rounded-lg shadow-warm overflow-hidden border border-border hover:shadow-warm-lg transition-warm">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={burger?.image}
          alt={burger?.name}
          className="w-full h-full object-cover"
        />
        {burger?.isNew && (
          <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
            New!
          </div>
        )}
        {burger?.isPopular && (
          <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-medium">
            Popular
          </div>
        )}
        
        {/* Dietary Badges */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
          {burger?.dietaryOptions?.map((option, index) => (
            <span
              key={index}
              className={`px-2 py-1 rounded-full text-xs font-medium ${getDietaryBadgeColor(option)}`}
            >
              {option}
            </span>
          ))}
        </div>
      </div>
      {/* Content Section */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-text-primary">{burger?.name}</h3>
          <div className="flex items-center space-x-1">
            <Icon name="Star" size={16} className="text-accent fill-current" />
            <span className="text-sm text-text-secondary">{burger?.rating}</span>
          </div>
        </div>

        <p className="text-text-secondary text-sm mb-3 line-clamp-2">{burger?.description}</p>

        {/* Size Selection */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">Size:</span>
            <span className="text-sm text-text-secondary">
              {getSizeCalories(burger?.calories, selectedSize)} cal
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {['small', 'medium', 'large', 'xl']?.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-2 py-1 text-xs rounded border transition-quick ${
                  selectedSize === size
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-text-secondary border-border hover:border-primary'
                }`}
              >
                {size?.charAt(0)?.toUpperCase() + size?.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Ingredients Toggle */}
        <button
          onClick={() => setShowIngredients(!showIngredients)}
          className="flex items-center justify-between w-full py-2 text-sm text-text-primary hover:text-primary transition-quick"
        >
          <span>Ingredients & Allergens</span>
          <Icon 
            name={showIngredients ? "ChevronUp" : "ChevronDown"} 
            size={16} 
          />
        </button>

        {/* Ingredients List */}
        {showIngredients && (
          <div className="mt-2 p-3 bg-muted rounded-md">
            <div className="mb-2">
              <h4 className="text-xs font-medium text-text-primary mb-1">Ingredients:</h4>
              <p className="text-xs text-text-secondary">{burger?.ingredients?.join(', ')}</p>
            </div>
            {burger?.allergens?.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-text-primary mb-1">Contains:</h4>
                <p className="text-xs text-warning">{burger?.allergens?.join(', ')}</p>
              </div>
            )}
            <div className="mt-2">
              <h4 className="text-xs font-medium text-text-primary mb-1">Sourcing:</h4>
              <p className="text-xs text-text-secondary">{burger?.sourcing}</p>
            </div>
          </div>
        )}

        {/* Price and Actions */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-primary">
              ${getSizePrice(burger?.basePrice, selectedSize)}
            </span>
            <span className="text-xs text-text-secondary">
              {selectedSize} size
            </span>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCustomize(burger, selectedSize)}
              iconName="Settings"
              iconPosition="left"
            >
              Customize
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => (onAddToCart ? onAddToCart(burger, selectedSize) : cart.addToCart(burger, { size: selectedSize }))}
              iconName="Plus"
              iconPosition="left"
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BurgerCard;