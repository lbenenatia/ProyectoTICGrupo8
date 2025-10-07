import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OrderSummary = ({ 
  productType, 
  selectedSize, 
  selectedIngredients, 
  totalPrice, 
  nutritionalInfo,
  onAddToCart,
  onSaveRecipe 
}) => {
  const getIngredientDetails = () => {
    const pizzaIngredients = {
      base: [
        { id: 'thin-crust', name: 'Thin Crust', price: 0 },
        { id: 'thick-crust', name: 'Thick Crust', price: 1.50 },
        { id: 'gluten-free', name: 'Gluten-Free Base', price: 3.00 },
        { id: 'cauliflower', name: 'Cauliflower Crust', price: 4.00 }
      ],
      sauce: [
        { id: 'tomato', name: 'Classic Tomato', price: 0 },
        { id: 'white', name: 'White Sauce', price: 1.00 },
        { id: 'pesto', name: 'Basil Pesto', price: 1.50 },
        { id: 'bbq', name: 'BBQ Sauce', price: 1.00 }
      ],
      cheese: [
        { id: 'mozzarella', name: 'Mozzarella', price: 0 },
        { id: 'cheddar', name: 'Cheddar', price: 1.00 },
        { id: 'vegan-cheese', name: 'Vegan Cheese', price: 2.50 },
        { id: 'goat-cheese', name: 'Goat Cheese', price: 2.00 }
      ],
      toppings: [
        { id: 'pepperoni', name: 'Pepperoni', price: 2.00 },
        { id: 'mushrooms', name: 'Mushrooms', price: 1.50 },
        { id: 'bell-peppers', name: 'Bell Peppers', price: 1.50 },
        { id: 'olives', name: 'Black Olives', price: 1.50 },
        { id: 'chicken', name: 'Grilled Chicken', price: 3.00 },
        { id: 'bacon', name: 'Bacon', price: 2.50 }
      ]
    };

    const burgerIngredients = {
      base: [
        { id: 'brioche', name: 'Brioche Bun', price: 0 },
        { id: 'whole-wheat', name: 'Whole Wheat Bun', price: 1.00 },
        { id: 'gluten-free-bun', name: 'Gluten-Free Bun', price: 2.50 },
        { id: 'lettuce-wrap', name: 'Lettuce Wrap', price: 1.50 }
      ],
      patty: [
        { id: 'beef', name: 'Beef Patty', price: 0 },
        { id: 'turkey', name: 'Turkey Patty', price: 1.50 },
        { id: 'plant-based', name: 'Plant-Based Patty', price: 3.00 },
        { id: 'black-bean', name: 'Black Bean Patty', price: 2.50 }
      ],
      cheese: [
        { id: 'american', name: 'American Cheese', price: 0.50 },
        { id: 'swiss', name: 'Swiss Cheese', price: 1.00 },
        { id: 'vegan-cheese-slice', name: 'Vegan Cheese', price: 1.50 },
        { id: 'blue-cheese', name: 'Blue Cheese', price: 1.50 }
      ],
      toppings: [
        { id: 'lettuce', name: 'Lettuce', price: 0.50 },
        { id: 'tomato', name: 'Tomato', price: 0.50 },
        { id: 'onion', name: 'Red Onion', price: 0.50 },
        { id: 'pickles', name: 'Pickles', price: 0.50 },
        { id: 'bacon-burger', name: 'Bacon', price: 2.00 },
        { id: 'avocado', name: 'Avocado', price: 2.50 }
      ]
    };

    return productType === 'pizza' ? pizzaIngredients : burgerIngredients;
  };

  const ingredientDetails = getIngredientDetails();
  const selectedItems = [];

  Object.entries(selectedIngredients)?.forEach(([category, items]) => {
    items?.forEach(itemId => {
      const ingredient = ingredientDetails?.[category]?.find(ing => ing?.id === itemId);
      if (ingredient) {
        selectedItems?.push({
          category,
          ...ingredient
        });
      }
    });
  });

  const getSizeInfo = () => {
    if (productType === 'pizza') {
      const sizeMap = {
        small: { name: 'Small (10")', multiplier: 1 },
        medium: { name: 'Medium (12")', multiplier: 1.4 },
        large: { name: 'Large (14")', multiplier: 1.8 },
        xlarge: { name: 'X-Large (16")', multiplier: 2.2 }
      };
      return sizeMap?.[selectedSize] || sizeMap?.medium;
    } else {
      const sizeMap = {
        single: { name: 'Single (1/4 lb)', multiplier: 1 },
        double: { name: 'Double (1/2 lb)', multiplier: 1.6 },
        triple: { name: 'Triple (3/4 lb)', multiplier: 2.2 }
      };
      return sizeMap?.[selectedSize] || sizeMap?.single;
    }
  };

  const sizeInfo = getSizeInfo();

  return (
    <div className="bg-card rounded-lg p-6 shadow-warm sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-text-primary">Order Summary</h2>
        <Icon name="Receipt" size={20} className="text-text-secondary" />
      </div>
      {/* Product Preview */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <Icon name={productType === 'pizza' ? 'Pizza' : 'Beef'} size={24} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary capitalize">Custom {productType}</h3>
            <p className="text-sm text-text-secondary">{sizeInfo?.name}</p>
          </div>
        </div>
      </div>
      {/* Selected Ingredients */}
      <div className="mb-6">
        <h4 className="font-medium text-text-primary mb-3">Ingredients</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {selectedItems?.length > 0 ? (
            selectedItems?.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-text-secondary">{item?.name}</span>
                <span className="text-text-primary font-medium">
                  {item?.price === 0 ? 'Free' : `+$${item?.price?.toFixed(2)}`}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-text-secondary italic">No ingredients selected</p>
          )}
        </div>
      </div>
      {/* Nutritional Info */}
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <h4 className="font-medium text-text-primary mb-3 flex items-center">
          <Icon name="Activity" size={16} className="mr-2" />
          Nutrition Facts
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-text-secondary">Calories</span>
            <p className="font-semibold text-text-primary">{nutritionalInfo?.calories}</p>
          </div>
          <div>
            <span className="text-text-secondary">Protein</span>
            <p className="font-semibold text-text-primary">{nutritionalInfo?.protein}g</p>
          </div>
          <div>
            <span className="text-text-secondary">Carbs</span>
            <p className="font-semibold text-text-primary">{nutritionalInfo?.carbs}g</p>
          </div>
          <div>
            <span className="text-text-secondary">Fat</span>
            <p className="font-semibold text-text-primary">{nutritionalInfo?.fat}g</p>
          </div>
        </div>
      </div>
      {/* Price Breakdown */}
      <div className="mb-6 p-4 border border-border rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-text-secondary">Base Price</span>
          <span className="text-text-primary">${(productType === 'pizza' ? 12.99 : 9.99)?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-text-secondary">Size Multiplier</span>
          <span className="text-text-primary">×{sizeInfo?.multiplier}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-text-secondary">Extras</span>
          <span className="text-text-primary">
            +${selectedItems?.reduce((sum, item) => sum + item?.price, 0)?.toFixed(2)}
          </span>
        </div>
        <div className="border-t border-border pt-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-text-primary">Total</span>
            <span className="font-bold text-xl text-primary">${totalPrice?.toFixed(2)}</span>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="space-y-3">
        <Button 
          variant="default" 
          fullWidth 
          iconName="ShoppingCart" 
          iconPosition="left"
          onClick={onAddToCart}
          disabled={selectedItems?.length === 0}
        >
          Add to Cart
        </Button>
        
        <Button 
          variant="outline" 
          fullWidth 
          iconName="Heart" 
          iconPosition="left"
          onClick={onSaveRecipe}
          disabled={selectedItems?.length === 0}
        >
          Save Recipe
        </Button>
        
        <Button 
          variant="ghost" 
          fullWidth 
          iconName="Share2" 
          iconPosition="left"
          disabled={selectedItems?.length === 0}
        >
          Share Creation
        </Button>
      </div>
    </div>
  );
};

export default OrderSummary;