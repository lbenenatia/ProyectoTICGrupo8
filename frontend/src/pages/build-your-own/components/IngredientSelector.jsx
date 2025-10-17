import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const IngredientSelector = ({ 
  selectedIngredients, 
  onIngredientChange, 
  productType, 
  dietaryFilters 
}) => {
  const [activeCategory, setActiveCategory] = useState('base');

  const pizzaIngredients = {
    base: [
      { id: 'thin-crust', name: 'Thin Crust', price: 0, dietary: ['vegetarian'], allergens: ['gluten'] },
      { id: 'thick-crust', name: 'Thick Crust', price: 1.50, dietary: ['vegetarian'], allergens: ['gluten'] },
      { id: 'gluten-free', name: 'Gluten-Free Base', price: 3.00, dietary: ['vegetarian', 'gluten-free'], allergens: [] },
      { id: 'cauliflower', name: 'Cauliflower Crust', price: 4.00, dietary: ['vegetarian', 'gluten-free', 'keto'], allergens: [] }
    ],
    sauce: [
      { id: 'tomato', name: 'Classic Tomato', price: 0, dietary: ['vegetarian', 'vegan'], allergens: [] },
      { id: 'white', name: 'White Sauce', price: 1.00, dietary: ['vegetarian'], allergens: ['dairy'] },
      { id: 'pesto', name: 'Basil Pesto', price: 1.50, dietary: ['vegetarian'], allergens: ['nuts', 'dairy'] },
      { id: 'bbq', name: 'BBQ Sauce', price: 1.00, dietary: ['vegetarian'], allergens: [] }
    ],
    cheese: [
      { id: 'mozzarella', name: 'Mozzarella', price: 0, dietary: ['vegetarian'], allergens: ['dairy'] },
      { id: 'cheddar', name: 'Cheddar', price: 1.00, dietary: ['vegetarian'], allergens: ['dairy'] },
      { id: 'vegan-cheese', name: 'Vegan Cheese', price: 2.50, dietary: ['vegan'], allergens: [] },
      { id: 'goat-cheese', name: 'Goat Cheese', price: 2.00, dietary: ['vegetarian'], allergens: ['dairy'] }
    ],
    toppings: [
      { id: 'pepperoni', name: 'Pepperoni', price: 2.00, dietary: [], allergens: [] },
      { id: 'mushrooms', name: 'Mushrooms', price: 1.50, dietary: ['vegetarian', 'vegan'], allergens: [] },
      { id: 'bell-peppers', name: 'Bell Peppers', price: 1.50, dietary: ['vegetarian', 'vegan'], allergens: [] },
      { id: 'olives', name: 'Black Olives', price: 1.50, dietary: ['vegetarian', 'vegan'], allergens: [] },
      { id: 'chicken', name: 'Grilled Chicken', price: 3.00, dietary: [], allergens: [] },
      { id: 'bacon', name: 'Bacon', price: 2.50, dietary: [], allergens: [] }
    ]
  };

  const burgerIngredients = {
    base: [
      { id: 'brioche', name: 'Brioche Bun', price: 0, dietary: ['vegetarian'], allergens: ['gluten', 'eggs'] },
      { id: 'whole-wheat', name: 'Whole Wheat Bun', price: 1.00, dietary: ['vegetarian'], allergens: ['gluten'] },
      { id: 'gluten-free-bun', name: 'Gluten-Free Bun', price: 2.50, dietary: ['vegetarian', 'gluten-free'], allergens: [] },
      { id: 'lettuce-wrap', name: 'Lettuce Wrap', price: 1.50, dietary: ['vegetarian', 'vegan', 'keto'], allergens: [] }
    ],
    patty: [
      { id: 'beef', name: 'Beef Patty', price: 0, dietary: [], allergens: [] },
      { id: 'turkey', name: 'Turkey Patty', price: 1.50, dietary: [], allergens: [] },
      { id: 'plant-based', name: 'Plant-Based Patty', price: 3.00, dietary: ['vegetarian', 'vegan'], allergens: [] },
      { id: 'black-bean', name: 'Black Bean Patty', price: 2.50, dietary: ['vegetarian', 'vegan'], allergens: [] }
    ],
    cheese: [
      { id: 'american', name: 'American Cheese', price: 0.50, dietary: ['vegetarian'], allergens: ['dairy'] },
      { id: 'swiss', name: 'Swiss Cheese', price: 1.00, dietary: ['vegetarian'], allergens: ['dairy'] },
      { id: 'vegan-cheese-slice', name: 'Vegan Cheese', price: 1.50, dietary: ['vegan'], allergens: [] },
      { id: 'blue-cheese', name: 'Blue Cheese', price: 1.50, dietary: ['vegetarian'], allergens: ['dairy'] }
    ],
    toppings: [
      { id: 'lettuce', name: 'Lettuce', price: 0.50, dietary: ['vegetarian', 'vegan'], allergens: [] },
      { id: 'tomato', name: 'Tomato', price: 0.50, dietary: ['vegetarian', 'vegan'], allergens: [] },
      { id: 'onion', name: 'Red Onion', price: 0.50, dietary: ['vegetarian', 'vegan'], allergens: [] },
      { id: 'pickles', name: 'Pickles', price: 0.50, dietary: ['vegetarian', 'vegan'], allergens: [] },
      { id: 'bacon-burger', name: 'Bacon', price: 2.00, dietary: [], allergens: [] },
      { id: 'avocado', name: 'Avocado', price: 2.50, dietary: ['vegetarian', 'vegan'], allergens: [] }
    ]
  };

  const ingredients = productType === 'pizza' ? pizzaIngredients : burgerIngredients;
  const categories = Object.keys(ingredients);

  const filterIngredients = (items) => {
    if (!dietaryFilters || dietaryFilters?.length === 0) return items;
    
    return items?.filter(item => {
      return dietaryFilters?.every(filter => 
        item?.dietary?.includes(filter) || filter === 'none'
      );
    });
  };

  const handleIngredientToggle = (categoryId, ingredientId) => {
    const currentCategory = selectedIngredients?.[categoryId] || [];
    const isSelected = currentCategory?.includes(ingredientId);
    
    let newSelection;
    if (categoryId === 'base' || categoryId === 'patty') {
      // Single selection for base/patty
      newSelection = isSelected ? [] : [ingredientId];
    } else {
      // Multiple selection for others
      newSelection = isSelected 
        ? currentCategory?.filter(id => id !== ingredientId)
        : [...currentCategory, ingredientId];
    }
    
    onIngredientChange(categoryId, newSelection);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      base: 'Circle',
      sauce: 'Droplets',
      cheese: 'Milk',
      toppings: 'Plus',
      patty: 'Beef',
    };
    return icons?.[category] || 'Circle';
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-warm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">Build Your Creation</h2>
        <Icon name="ChefHat" size={20} className="text-text-secondary" />
      </div>
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-border">
        {categories?.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg font-medium transition-warm ${
              activeCategory === category
                ? 'bg-primary text-primary-foreground border-b-2 border-primary'
                : 'text-text-secondary hover:text-text-primary hover:bg-muted'
            }`}
          >
            <Icon name={getCategoryIcon(category)} size={16} />
            <span className="capitalize">{category}</span>
          </button>
        ))}
      </div>
      {/* Ingredients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filterIngredients(ingredients?.[activeCategory])?.map((ingredient) => {
          const isSelected = selectedIngredients?.[activeCategory]?.includes(ingredient?.id) || false;
          const isSingleSelect = activeCategory === 'base' || activeCategory === 'patty';
          
          return (
            <div
              key={ingredient?.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-warm ${
                isSelected
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }`}
              onClick={() => handleIngredientToggle(activeCategory, ingredient?.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-text-primary">{ingredient?.name}</h3>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  isSelected ? 'bg-primary border-primary' : 'border-border'
                }`}>
                  {isSelected && <Icon name="Check" size={12} className="text-primary-foreground" />}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary">
                  {ingredient?.price === 0 ? 'Free' : `+$${ingredient?.price?.toFixed(2)}`}
                </span>
                {ingredient?.dietary?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {ingredient?.dietary?.slice(0, 2)?.map((diet) => (
                      <span
                        key={diet}
                        className="text-xs bg-success/10 text-success px-2 py-1 rounded-full"
                      >
                        {diet}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {ingredient?.allergens?.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-warning">
                    Contains: {ingredient?.allergens?.join(', ')}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {filterIngredients(ingredients?.[activeCategory])?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Filter" size={48} className="text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">No ingredients match your dietary filters</p>
          <Button variant="outline" size="sm" className="mt-2">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default IngredientSelector;