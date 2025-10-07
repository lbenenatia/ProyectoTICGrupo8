import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DietaryFilterBar = ({ onFilterChange }) => {
  const [activeFilters, setActiveFilters] = useState([]);

  const dietaryOptions = [
    {
      id: 'gluten-free',
      name: 'Gluten-Free',
      icon: 'Wheat',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/30'
    },
    {
      id: 'vegan',
      name: 'Vegan',
      icon: 'Leaf',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/30'
    },
    {
      id: 'keto',
      name: 'Keto',
      icon: 'Zap',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/30'
    },
    {
      id: 'vegetarian',
      name: 'Vegetarian',
      icon: 'Salad',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/30'
    },
    {
      id: 'dairy-free',
      name: 'Dairy-Free',
      icon: 'Milk',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/30'
    },
    {
      id: 'low-carb',
      name: 'Low-Carb',
      icon: 'TrendingDown',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/30'
    }
  ];

  const toggleFilter = (filterId) => {
    const newFilters = activeFilters?.includes(filterId)
      ? activeFilters?.filter(id => id !== filterId)
      : [...activeFilters, filterId];
    
    setActiveFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    onFilterChange?.([]);
  };

  return (
    <div className="bg-card border-b border-border shadow-warm-sm sticky top-16 z-40">
      <div className="container mx-auto px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="Filter" size={20} className="text-primary" />
            <h3 className="font-semibold text-text-primary">Dietary Preferences</h3>
            <span className="text-sm text-text-secondary">
              Find options that match your lifestyle
            </span>
          </div>
          
          {activeFilters?.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear All ({activeFilters?.length})
            </Button>
          )}
        </div>

        {/* Filter Options */}
        <div className="flex flex-wrap gap-3">
          {dietaryOptions?.map((option) => {
            const isActive = activeFilters?.includes(option?.id);
            return (
              <button
                key={option?.id}
                onClick={() => toggleFilter(option?.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-warm ${
                  isActive
                    ? `${option?.bgColor} ${option?.borderColor} ${option?.color}`
                    : 'bg-background border-border text-text-secondary hover:bg-muted hover:text-primary'
                }`}
              >
                <Icon 
                  name={option?.icon} 
                  size={16} 
                  className={isActive ? option?.color : 'text-text-secondary'} 
                />
                <span className="font-medium text-sm">{option?.name}</span>
                {isActive && (
                  <Icon name="Check" size={14} className={option?.color} />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Filters Summary */}
        {activeFilters?.length > 0 && (
          <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="Info" size={16} className="text-primary" />
              <span className="text-sm text-primary font-medium">
                Showing options for: {activeFilters?.map(id => 
                  dietaryOptions?.find(opt => opt?.id === id)?.name
                )?.join(', ')}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DietaryFilterBar;