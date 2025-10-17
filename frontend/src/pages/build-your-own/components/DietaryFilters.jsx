import React from 'react';
import Icon from '../../../components/AppIcon';

const DietaryFilters = ({ selectedFilters, onFilterChange }) => {
  const dietaryOptions = [
    {
      id: 'vegetarian',
      name: 'Vegetarian',
      icon: 'Leaf',
      color: 'text-success',
      description: 'No meat products'
    },
    {
      id: 'vegan',
      name: 'Vegan',
      icon: 'Sprout',
      color: 'text-success',
      description: 'Plant-based only'
    },
    {
      id: 'gluten-free',
      name: 'Gluten-Free',
      icon: 'Wheat',
      color: 'text-warning',
      description: 'No gluten ingredients'
    },
    {
      id: 'keto',
      name: 'Keto',
      icon: 'Zap',
      color: 'text-primary',
      description: 'Low-carb friendly'
    },
    {
      id: 'dairy-free',
      name: 'Dairy-Free',
      icon: 'Milk',
      color: 'text-accent',
      description: 'No dairy products'
    }
  ];

  const handleFilterToggle = (filterId) => {
    const newFilters = selectedFilters?.includes(filterId)
      ? selectedFilters?.filter(id => id !== filterId)
      : [...selectedFilters, filterId];
    
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-warm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-text-primary">Dietary Preferences</h2>
        <Icon name="Filter" size={20} className="text-text-secondary" />
      </div>
      <p className="text-sm text-text-secondary mb-4">
        Filter ingredients to match your dietary needs. Multiple selections will show ingredients that meet ALL selected criteria.
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {dietaryOptions?.map((option) => {
          const isSelected = selectedFilters?.includes(option?.id);
          
          return (
            <div
              key={option?.id}
              className={`border-2 rounded-lg p-3 cursor-pointer transition-warm ${
                isSelected
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }`}
              onClick={() => handleFilterToggle(option?.id)}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Icon 
                  name={option?.icon} 
                  size={18} 
                  className={isSelected ? 'text-primary' : option?.color} 
                />
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                  isSelected ? 'bg-primary border-primary' : 'border-border'
                }`}>
                  {isSelected && <Icon name="Check" size={10} className="text-primary-foreground" />}
                </div>
              </div>
              <h3 className="font-medium text-text-primary text-sm">{option?.name}</h3>
              <p className="text-xs text-text-secondary mt-1">{option?.description}</p>
            </div>
          );
        })}
      </div>
      {selectedFilters?.length > 0 && (
        <div className="mt-4 p-3 bg-success/10 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-sm font-medium text-success">
                Active Filters: {selectedFilters?.join(', ')}
              </span>
            </div>
            <button
              onClick={() => onFilterChange([])}
              className="text-xs text-success hover:text-success/80 underline"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DietaryFilters;