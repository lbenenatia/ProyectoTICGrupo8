import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PizzaCard = ({ pizza, onCustomize, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState('medium');
  const [showIngredients, setShowIngredients] = useState(false);

  const getSizePrice = (size) => {
    const multipliers = { small: 0.8, medium: 1, large: 1.4, xlarge: 1.8 };
    return (pizza?.basePrice * multipliers?.[size])?.toFixed(2);
  };

  const getSizeInfo = (size) => {
    const info = {
      small: { diameter: '10"', slices: '6 slices', serves: '1-2 people' },
      medium: { diameter: '12"', slices: '8 slices', serves: '2-3 people' },
      large: { diameter: '14"', slices: '10 slices', serves: '3-4 people' },
      xlarge: { diameter: '16"', slices: '12 slices', serves: '4-6 people' }
    };
    return info?.[size];
  };

  const getDietaryBadges = () => {
    return pizza?.dietary?.map(diet => (
      <span
        key={diet}
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          diet === 'Gluten-Free' ? 'bg-success/10 text-success' :
          diet === 'Vegan' ? 'bg-accent/10 text-accent' :
          diet === 'Keto'? 'bg-primary/10 text-primary' : 'bg-muted text-text-secondary'
        }`}
      >
        {diet}
      </span>
    ));
  };

  return (
    <div className="bg-card rounded-lg shadow-warm hover:shadow-warm-lg transition-warm overflow-hidden group">
      {/* Pizza Image */}
      <div className="relative overflow-hidden h-48">
        <Image
          src={pizza?.image}
          alt={pizza?.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-warm"
        />
        {pizza?.isPopular && (
          <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
            Popular
          </div>
        )}
        {pizza?.isNew && (
          <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-medium">
            New
          </div>
        )}
        
        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-warm flex items-center justify-center">
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              iconName="Eye"
              onClick={() => setShowIngredients(!showIngredients)}
            >
              View Details
            </Button>
            <Button
              variant="default"
              size="sm"
              iconName="Settings"
              onClick={() => onCustomize(pizza)}
            >
              Customize
            </Button>
          </div>
        </div>
      </div>
      {/* Pizza Info */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-lg text-text-primary mb-1">{pizza?.name}</h3>
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center">
                <Icon name="Star" size={16} className="text-accent fill-current" />
                <span className="text-sm text-text-secondary ml-1">{pizza?.rating}</span>
              </div>
              <span className="text-text-secondary">•</span>
              <span className="text-sm text-text-secondary">{pizza?.reviews} reviews</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-primary">${getSizePrice(selectedSize)}</div>
            <div className="text-xs text-text-secondary">{getSizeInfo(selectedSize)?.serves}</div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-text-secondary mb-3 line-clamp-2">{pizza?.description}</p>

        {/* Dietary Badges */}
        <div className="flex flex-wrap gap-1 mb-3">
          {getDietaryBadges()}
        </div>

        {/* Size Selector */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">Size</span>
            <span className="text-xs text-text-secondary">{getSizeInfo(selectedSize)?.diameter}</span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {['small', 'medium', 'large', 'xlarge']?.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-2 py-1 text-xs rounded-md border transition-warm ${
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

        {/* Ingredients (Expandable) */}
        {showIngredients && (
          <div className="mb-4 p-3 bg-muted rounded-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-primary">Ingredients</span>
              <Button
                variant="ghost"
                size="xs"
                iconName="X"
                onClick={() => setShowIngredients(false)}
              />
            </div>
            <div className="space-y-2">
              {pizza?.ingredients?.map((ingredient, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="text-text-primary">{ingredient?.name}</span>
                  <div className="flex items-center space-x-2">
                    {ingredient?.allergens?.length > 0 && (
                      <div className="flex space-x-1">
                        {ingredient?.allergens?.map(allergen => (
                          <span
                            key={allergen}
                            className="bg-warning/10 text-warning px-1 py-0.5 rounded text-xs"
                          >
                            {allergen}
                          </span>
                        ))}
                      </div>
                    )}
                    <span className="text-text-secondary">{ingredient?.source}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nutritional Info */}
        <div className="mb-4 p-3 bg-muted rounded-md">
          <div className="text-sm font-medium text-text-primary mb-2">Nutrition (per slice)</div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-medium text-text-primary">{Math.round(pizza?.nutrition?.calories / getSizeInfo(selectedSize)?.slices?.split(' ')?.[0])}</div>
              <div className="text-text-secondary">Calories</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-text-primary">{pizza?.nutrition?.protein}g</div>
              <div className="text-text-secondary">Protein</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-text-primary">{pizza?.nutrition?.carbs}g</div>
              <div className="text-text-secondary">Carbs</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Settings"
            iconPosition="left"
            onClick={() => onCustomize(pizza)}
            className="flex-1"
          >
            Customize
          </Button>
          <Button
            variant="default"
            size="sm"
            iconName="ShoppingCart"
            iconPosition="left"
            onClick={() => onAddToCart(pizza, selectedSize)}
            className="flex-1"
          >
            Add ${getSizePrice(selectedSize)}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PizzaCard;