import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const CreationPreview = ({ 
  productType, 
  selectedSize, 
  selectedIngredients 
}) => {
  const getPreviewImage = () => {
    if (productType === 'pizza') {
      const sizeImages = {
        small: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=300&fit=crop',
        medium: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=350&h=350&fit=crop',
        large: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop',
        xlarge: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=450&h=450&fit=crop'
      };
      return sizeImages?.[selectedSize] || sizeImages?.medium;
    } else {
      const sizeImages = {
        single: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&fit=crop',
        double: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=350&h=350&fit=crop',
        triple: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop'
      };
      return sizeImages?.[selectedSize] || sizeImages?.single;
    }
  };

  const getSelectedIngredientsList = () => {
    const ingredientNames = {
      // Pizza ingredients
      'thin-crust': 'Thin Crust', 'thick-crust': 'Thick Crust', 'gluten-free': 'Gluten-Free Base', 'cauliflower': 'Cauliflower Crust',
      'tomato-pizza': 'Classic Tomato', 'white': 'White Sauce', 'pesto': 'Basil Pesto', 'bbq': 'BBQ Sauce',
      'mozzarella': 'Mozzarella', 'cheddar': 'Cheddar', 'vegan-cheese': 'Vegan Cheese', 'goat-cheese': 'Goat Cheese',
      'pepperoni': 'Pepperoni', 'mushrooms': 'Mushrooms', 'bell-peppers': 'Bell Peppers', 'olives': 'Black Olives', 'chicken': 'Grilled Chicken', 'bacon': 'Bacon',
      // Burger ingredients
      'brioche': 'Brioche Bun', 'whole-wheat': 'Whole Wheat Bun', 'gluten-free-bun': 'Gluten-Free Bun', 'lettuce-wrap': 'Lettuce Wrap',
      'beef': 'Beef Patty', 'turkey': 'Turkey Patty', 'plant-based': 'Plant-Based Patty', 'black-bean': 'Black Bean Patty',
      'american': 'American Cheese', 'swiss': 'Swiss Cheese', 'vegan-cheese-slice': 'Vegan Cheese', 'blue-cheese': 'Blue Cheese',
      'lettuce': 'Lettuce', 'tomato-burger': 'Tomato', 'onion': 'Red Onion', 'pickles': 'Pickles', 'bacon-burger': 'Bacon', 'avocado': 'Avocado'
    };

    const allSelected = [];
    Object.entries(selectedIngredients)?.forEach(([category, items]) => {
      items?.forEach(itemId => {
        if (ingredientNames?.[itemId]) {
          allSelected?.push(ingredientNames?.[itemId]);
        }
      });
    });

    return allSelected;
  };

  const selectedItems = getSelectedIngredientsList();

  return (
    <div className="bg-card rounded-lg p-6 shadow-warm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-text-primary">Live Preview</h2>
        <Icon name="Eye" size={20} className="text-text-secondary" />
      </div>
      {/* 3D Preview Container */}
      <div className="relative mb-6">
        <div className="aspect-square bg-gradient-to-br from-muted to-background rounded-lg overflow-hidden border-2 border-border">
          <div className="relative w-full h-full flex items-center justify-center">
            {selectedSize ? (
              <div className="relative">
                <Image
                  src={getPreviewImage()}
                  alt={`Custom ${productType} preview`}
                  className="w-full h-full object-cover rounded-lg"
                />
                
                {/* Overlay indicators for ingredients */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {selectedItems?.length} ingredients
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Icon name={productType === 'pizza' ? 'Pizza' : 'Beef'} size={64} className="text-text-secondary mx-auto mb-4" />
                <p className="text-text-secondary">Select a size to see preview</p>
              </div>
            )}
          </div>
        </div>

        {/* Size indicator */}
        {selectedSize && (
          <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
            {productType === 'pizza' ? (
              selectedSize === 'small' ? '10"' :
              selectedSize === 'medium' ? '12"' :
              selectedSize === 'large' ? '14"' : '16"'
            ) : (
              selectedSize === 'single' ? '1/4 lb' :
              selectedSize === 'double' ? '1/2 lb' : '3/4 lb'
            )}
          </div>
        )}
      </div>
      {/* Ingredient List */}
      <div className="space-y-3">
        <h3 className="font-medium text-text-primary">Your Selection</h3>
        
        {selectedItems?.length > 0 ? (
          <div className="space-y-2">
            {Object.entries(selectedIngredients)?.map(([category, items]) => {
              if (items?.length === 0) return null;
              
              return (
                <div key={category} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon 
                      name={
                        category === 'base' ? 'Circle' :
                        category === 'sauce' ? 'Droplets' :
                        category === 'cheese' ? 'Milk' :
                        category === 'patty' ? 'Beef' : 'Plus'
                      } 
                      size={12} 
                      className="text-primary" 
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary capitalize">{category}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {items?.map(itemId => {
                        const ingredientNames = {
                          'thin-crust': 'Thin Crust', 'thick-crust': 'Thick Crust', 'gluten-free': 'Gluten-Free', 'cauliflower': 'Cauliflower',
                          'tomato-pizza': 'Tomato', 'white': 'White', 'pesto': 'Pesto', 'bbq': 'BBQ',
                          'mozzarella': 'Mozzarella', 'cheddar': 'Cheddar', 'vegan-cheese': 'Vegan', 'goat-cheese': 'Goat',
                          'pepperoni': 'Pepperoni', 'mushrooms': 'Mushrooms', 'bell-peppers': 'Peppers', 'olives': 'Olives', 'chicken': 'Chicken', 'bacon': 'Bacon',
                          'brioche': 'Brioche', 'whole-wheat': 'Wheat', 'gluten-free-bun': 'GF Bun', 'lettuce-wrap': 'Lettuce Wrap',
                          'beef': 'Beef', 'turkey': 'Turkey', 'plant-based': 'Plant-Based', 'black-bean': 'Black Bean',
                          'american': 'American', 'swiss': 'Swiss', 'vegan-cheese-slice': 'Vegan', 'blue-cheese': 'Blue',
                          'lettuce': 'Lettuce', 'tomato-burger': 'Tomato', 'onion': 'Onion', 'pickles': 'Pickles', 'bacon-burger': 'Bacon', 'avocado': 'Avocado'
                        };
                        
                        return (
                          <span 
                            key={itemId}
                            className="text-xs bg-accent/10 text-accent-foreground px-2 py-1 rounded-full"
                          >
                            {ingredientNames?.[itemId] || itemId}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6">
            <Icon name="ChefHat" size={32} className="text-text-secondary mx-auto mb-2" />
            <p className="text-sm text-text-secondary">Start building your creation!</p>
            <p className="text-xs text-text-secondary mt-1">Select ingredients to see them here</p>
          </div>
        )}
      </div>
      {/* Quick Actions */}
      {selectedItems?.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex space-x-2">
            <button className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 bg-muted rounded-lg hover:bg-muted/80 transition-warm">
              <Icon name="RotateCcw" size={14} />
              <span className="text-sm">Reset</span>
            </button>
            <button className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 bg-muted rounded-lg hover:bg-muted/80 transition-warm">
              <Icon name="Shuffle" size={14} />
              <span className="text-sm">Random</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreationPreview;