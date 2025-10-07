import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterSidebar = ({ filters, onFiltersChange, onClearFilters, isOpen, onToggle }) => {
  const [priceRange, setPriceRange] = useState([0, 50]);

  const dietaryOptions = [
    { id: 'gluten-free', label: 'Gluten-Free', count: 12 },
    { id: 'vegan', label: 'Vegan', count: 8 },
    { id: 'vegetarian', label: 'Vegetarian', count: 15 },
    { id: 'keto', label: 'Keto-Friendly', count: 6 },
    { id: 'dairy-free', label: 'Dairy-Free', count: 9 },
    { id: 'low-carb', label: 'Low-Carb', count: 7 }
  ];

  const ingredientCategories = [
    {
      name: 'Proteins',
      items: [
        { id: 'pepperoni', label: 'Pepperoni', count: 18 },
        { id: 'sausage', label: 'Italian Sausage', count: 12 },
        { id: 'chicken', label: 'Grilled Chicken', count: 14 },
        { id: 'bacon', label: 'Bacon', count: 10 },
        { id: 'ham', label: 'Ham', count: 8 },
        { id: 'plant-protein', label: 'Plant-Based Protein', count: 6 }
      ]
    },
    {
      name: 'Vegetables',
      items: [
        { id: 'mushrooms', label: 'Mushrooms', count: 16 },
        { id: 'bell-peppers', label: 'Bell Peppers', count: 14 },
        { id: 'onions', label: 'Red Onions', count: 12 },
        { id: 'olives', label: 'Olives', count: 10 },
        { id: 'tomatoes', label: 'Fresh Tomatoes', count: 11 },
        { id: 'spinach', label: 'Fresh Spinach', count: 9 }
      ]
    },
    {
      name: 'Cheeses',
      items: [
        { id: 'mozzarella', label: 'Mozzarella', count: 22 },
        { id: 'cheddar', label: 'Cheddar', count: 8 },
        { id: 'parmesan', label: 'Parmesan', count: 12 },
        { id: 'goat-cheese', label: 'Goat Cheese', count: 6 },
        { id: 'vegan-cheese', label: 'Vegan Cheese', count: 8 }
      ]
    }
  ];

  const sizeOptions = [
    { id: 'small', label: 'Small (10")', count: 24 },
    { id: 'medium', label: 'Medium (12")', count: 24 },
    { id: 'large', label: 'Large (14")', count: 24 },
    { id: 'xlarge', label: 'X-Large (16")', count: 24 }
  ];

  const handleDietaryChange = (dietaryId, checked) => {
    const newDietary = checked
      ? [...filters?.dietary, dietaryId]
      : filters?.dietary?.filter(id => id !== dietaryId);
    onFiltersChange({ ...filters, dietary: newDietary });
  };

  const handleIngredientChange = (ingredientId, checked) => {
    const newIngredients = checked
      ? [...filters?.ingredients, ingredientId]
      : filters?.ingredients?.filter(id => id !== ingredientId);
    onFiltersChange({ ...filters, ingredients: newIngredients });
  };

  const handleSizeChange = (sizeId, checked) => {
    const newSizes = checked
      ? [...filters?.sizes, sizeId]
      : filters?.sizes?.filter(id => id !== sizeId);
    onFiltersChange({ ...filters, sizes: newSizes });
  };

  const handlePriceRangeChange = (newRange) => {
    setPriceRange(newRange);
    onFiltersChange({ ...filters, priceRange: newRange });
  };

  const getActiveFiltersCount = () => {
    return filters?.dietary?.length + filters?.ingredients?.length + filters?.sizes?.length;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-16 left-0 h-screen lg:h-auto w-80 bg-background border-r border-border z-50 lg:z-auto
        transform transition-transform duration-300 ease-in-out overflow-y-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Icon name="Filter" size={20} className="text-primary" />
              <h2 className="text-lg font-semibold text-text-primary">Filters</h2>
              {getActiveFiltersCount() > 0 && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  {getActiveFiltersCount()}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                disabled={getActiveFiltersCount() === 0}
              >
                Clear All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={onToggle}
                className="lg:hidden"
              />
            </div>
          </div>

          {/* Dietary Preferences */}
          <div className="mb-6">
            <h3 className="font-medium text-text-primary mb-3 flex items-center">
              <Icon name="Leaf" size={16} className="text-success mr-2" />
              Dietary Preferences
            </h3>
            <div className="space-y-2">
              {dietaryOptions?.map(option => (
                <div key={option?.id} className="flex items-center justify-between">
                  <Checkbox
                    label={option?.label}
                    checked={filters?.dietary?.includes(option?.id)}
                    onChange={(e) => handleDietaryChange(option?.id, e?.target?.checked)}
                  />
                  <span className="text-xs text-text-secondary">({option?.count})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="font-medium text-text-primary mb-3 flex items-center">
              <Icon name="DollarSign" size={16} className="text-primary mr-2" />
              Price Range
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">$0</span>
                <span className="font-medium text-text-primary">
                  ${priceRange?.[0]} - ${priceRange?.[1]}
                </span>
                <span className="text-text-secondary">$50+</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={priceRange?.[1]}
                onChange={(e) => handlePriceRangeChange([priceRange?.[0], parseInt(e?.target?.value)])}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>

          {/* Size Options */}
          <div className="mb-6">
            <h3 className="font-medium text-text-primary mb-3 flex items-center">
              <Icon name="Maximize" size={16} className="text-accent mr-2" />
              Pizza Sizes
            </h3>
            <div className="space-y-2">
              {sizeOptions?.map(option => (
                <div key={option?.id} className="flex items-center justify-between">
                  <Checkbox
                    label={option?.label}
                    checked={filters?.sizes?.includes(option?.id)}
                    onChange={(e) => handleSizeChange(option?.id, e?.target?.checked)}
                  />
                  <span className="text-xs text-text-secondary">({option?.count})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ingredients */}
          {ingredientCategories?.map(category => (
            <div key={category?.name} className="mb-6">
              <h3 className="font-medium text-text-primary mb-3 flex items-center">
                <Icon 
                  name={category?.name === 'Proteins' ? 'Beef' : category?.name === 'Vegetables' ? 'Carrot' : 'Milk'} 
                  size={16} 
                  className="text-primary mr-2" 
                />
                {category?.name}
              </h3>
              <div className="space-y-2">
                {category?.items?.map(item => (
                  <div key={item?.id} className="flex items-center justify-between">
                    <Checkbox
                      label={item?.label}
                      checked={filters?.ingredients?.includes(item?.id)}
                      onChange={(e) => handleIngredientChange(item?.id, e?.target?.checked)}
                    />
                    <span className="text-xs text-text-secondary">({item?.count})</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Safety Information */}
          <div className="mt-8 p-4 bg-success/5 border border-success/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="Shield" size={16} className="text-success mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-success mb-1">Cross-Contamination Safety</h4>
                <p className="text-xs text-text-secondary">
                  All gluten-free pizzas are prepared in a dedicated area with separate tools and surfaces to prevent cross-contamination.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;