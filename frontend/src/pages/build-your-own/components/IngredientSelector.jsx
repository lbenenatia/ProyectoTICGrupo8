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
      { id: 'thin-crust', name: 'Integral', price: 0, dietary: [], allergens: ['gluten'] },
      { id: 'thick-crust', name: 'Napolitana', price: 1.50, dietary: [], allergens: ['gluten'] },
      { id: 'gluten-free', name: 'Sin gluten', price: 3.00, dietary: ['Libre de gluten'], allergens: [] }
    ],
    salsa: [
      { id: 'tomato', name: 'Salsa de tomate', price: 0, dietary: [], allergens: [] },
      { id: 'pomodoro', name: 'Salsa pomodoro', price: 1.00, dietary: [], allergens: [] },
    ],
    queso: [
      { id: 'mozzarella', name: 'Muzzarella', price: 0, dietary: [], allergens: [] },
      { id: '4-cheese', name: '4 Quesos', price: 2.50, dietary: [], allergens: [] },
      { id: 'roquefort', name: 'Roquefort', price: 2.00, dietary: [], allergens: [] }
    ],
    toppings: [
      { id: 'pepperoni', name: 'Pepperoni', price: 2.00, dietary: [], allergens: [] },
      { id: 'sausage', name: 'Salchicha', price: 2.00, dietary: [], allergens: [] },
      { id: 'tuna', name: 'Atún', price: 2.00, dietary: [], allergens: [] },
      { id: 'mushroom', name: 'Champiñon', price: 1.50, dietary: [], allergens: [] },
      { id: 'egg', name: 'Huevo', price: 1.00, dietary: [], allergens: [] },
      { id: 'oregano', name: 'Orégano', price: 0.50, dietary: [], allergens: [] },
      { id: 'pepper', name: 'Morrón', price: 1.50, dietary: [], allergens: [] },
      { id: 'tomato', name: 'Tomate', price: 1.50, dietary: [], allergens: [] },
      { id: 'olive', name: 'Aceituna', price: 1.50, dietary: [], allergens: [] },
      { id: 'cucumber', name: 'Pepino', price: 1.50, dietary: [], allergens: [] },
      { id: 'basil', name: 'Albahaca', price: 1.50, dietary: [], allergens: [] },
      { id: 'onion', name: 'Cebolla', price: 1.50, dietary: [], allergens: [] },
      { id: 'ham', name: 'Jamón', price: 1.50, dietary: [], allergens: [] },
      { id: 'chicken', name: 'Pollo', price: 3.00, dietary: [], allergens: [] },
      { id: 'anchovy', name: 'Anchoa', price: 1.50, dietary: [], allergens: [] },
      { id: 'bacon', name: 'Panceta', price: 2.50, dietary: [], allergens: [] }
    ]
  };

  const burgerIngredients = {
    base: [
      { id: 'potato', name: 'Brioche Bun', price: 0, dietary: [], allergens: ['gluten'] },
      { id: 'whole-wheat', name: 'Pan integral', price: 1.00, dietary: [], allergens: ['gluten'] },
      { id: 'gluten-free-bun', name: 'Pan sin gluten', price: 2.50, dietary: ['Libre de gluten'], allergens: [] }
    ],
    carne: [
      { id: 'beef', name: 'Carne de res', price: 0, dietary: [], allergens: [] },
      { id: 'chicken', name: 'Pollo', price: 1.50, dietary: [], allergens: [] },
      { id: 'pork', name: 'Cerdo', price: 2.00, dietary: [], allergens: [] },
      { id: 'lentils', name: 'Lentejas', price: 2.00, dietary: [], allergens: [] },
      { id: 'soy', name: 'Soja', price: 2.00, dietary: [], allergens: [] },
      { id: 'salmon', name: 'Salmón', price: 2.50, dietary: [], allergens: [] }
    ],
    queso: [
      { id: 'american', name: 'Americano', price: 0.50, dietary: [], allergens: [] },
      { id: 'cheddar', name: 'Cheddar', price: 1.00, dietary: [], allergens: [] },
      { id: 'swiss', name: 'Suizo', price: 1.00, dietary: [], allergens: [] },
      { id: 'blue-cheese', name: 'Queso azul', price: 1.50, dietary: [], allergens: [] }
    ],
    toppings: [
      { id: 'lettuce', name: 'Lechuga', price: 0.50, dietary: [], allergens: [] },
      { id: 'tomato', name: 'Tomate', price: 0.50, dietary: [], allergens: [] },
      { id: 'onion', name: 'Cebolla', price: 0.50, dietary: [], allergens: [] },
      { id: 'pickles', name: 'Pepinillos', price: 0.50, dietary: [], allergens: [] },
      { id: 'bacon-burger', name: 'Bacon', price: 2.00, dietary: [], allergens: [] },
      { id: 'jalapenos', name: 'Jalapeños', price: 1.00, dietary: [], allergens: [] },
      { id: 'mushrooms', name: 'Champiñones', price: 1.50, dietary: [], allergens: [] },
      { id: 'fried-egg', name: 'Huevo frito', price: 1.50, dietary: [], allergens: [] },
      { id: 'peppers', name: 'Morrones', price: 1.50, dietary: [], allergens: [] },
      { id: 'ham', name: 'Jamón', price: 1.50, dietary: [], allergens: [] },
      { id: 'avocado', name: 'Aguacate', price: 2.50, dietary: [], allergens: [] }

    ],
    aderezos: [
      { id: 'ketchup', name: 'Kétchup', price: 0.25, dietary: [], allergens: [] },
      { id: 'mustard', name: 'Mostaza', price: 0.25, dietary: [], allergens: [] },
      { id: 'mayo', name: 'Mayonesa', price: 0.25, dietary: [], allergens: [] },
      { id: 'bbq-sauce', name: 'Salsa BBQ', price: 0.50, dietary: [], allergens: [] },
      { id: 'aioli', name: 'Alioli', price: 0.50, dietary: [], allergens: [] },
      { id: 'ranch-dressing', name: 'Aderezo ranch', price: 0.50, dietary: [], allergens: [] },
      { id: 'special-sauce', name: 'Salsa especial', price: 1.00, dietary: [], allergens: [] },
      { id: 'hot-sauce', name: 'Salsa picante', price: 0.50, dietary: [], allergens: [] },
      { id: 'creole', name: 'Criolla', price: 0.50, dietary: [], allergens: [] }
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
    if (categoryId === 'base' || categoryId === 'carne') {
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
      salsa: 'Droplets',
      queso: 'Milk',
      toppings: 'Plus',
      carne: 'Beef',
    };
    return icons?.[category] || 'Circle';
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-warm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">Armá tu creación</h2>
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
          const isSingleSelect = activeCategory === 'base' || activeCategory === 'carne';
          
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
                  {ingredient?.price === 0 ? 'Gratis' : `+$${ingredient?.price?.toFixed(2)}`}
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
                    Contiene: {ingredient?.allergens?.join(', ')}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IngredientSelector;