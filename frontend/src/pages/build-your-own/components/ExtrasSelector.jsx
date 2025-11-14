import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import useIngredients from '../../../hooks/useIngredients';

const ExtrasSelector = ({
  selectedIngredients,
  onIngredientChange,
  productType,
  dietaryFilters,
  onIngredientsLoaded
}) => {
  const [activeCategory, setActiveCategory] = useState('bebida');
  const { ingredients: apiIngredients, loading, error } = useIngredients(productType);

  useEffect(() => {
    if (apiIngredients && Object.keys(apiIngredients).length > 0) {
      onIngredientsLoaded && onIngredientsLoaded(apiIngredients);
    }
  }, [apiIngredients, onIngredientsLoaded]);


  // Use API ingredients if available, otherwise use empty object
  const ingredients = apiIngredients || {};
  const categories = Object.keys(ingredients);

  // Update active category when ingredients change
  useEffect(() => {
    if (categories.length > 0 && !categories.includes(activeCategory)) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

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

    // Categories that should have single selection (base categories)
    const singleSelectCategories = ['bebida', 'acompañamiento'];
    const categoryLower = categoryId?.toLowerCase();
    const isSingleSelect = singleSelectCategories.includes(categoryLower);

    let newSelection;
    if (isSingleSelect) {
      // Single selection for base/patty/sauce
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
    const categoryLower = category?.toLowerCase();
    const icons = {
      bebida: 'cup-soda',
      acompañamiento: 'salad',
    };
    return icons[categoryLower] || 'Circle';
  };

  // Show loading state
  if (loading) {
    return (
      <div className="bg-card rounded-lg p-6 shadow-warm">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Icon name="Loader2" size={32} className="text-primary animate-spin mx-auto mb-4" />
            <p className="text-text-secondary">Cargando extras...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-card rounded-lg p-6 shadow-warm">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Icon name="AlertCircle" size={32} className="text-destructive mx-auto mb-4" />
            <p className="text-destructive font-medium mb-2">Error al cargar extras</p>
            <p className="text-text-secondary text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-6 shadow-warm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">Agregá tus extras</h2>
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
          const singleSelectCategories = ['bebida', 'acompañamiento'];
          const categoryLower = activeCategory?.toLowerCase();
          const isSingleSelect = singleSelectCategories.includes(categoryLower);

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

export default ExtrasSelector;