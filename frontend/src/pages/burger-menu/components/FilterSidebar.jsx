import React from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';

const FilterSidebar = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  isOpen, 
  onClose 
}) => {
  const dietaryOptions = [
    { id: 'gluten-free', label: 'Gluten-Free', count: 12 },
    { id: 'vegan', label: 'Vegan', count: 8 },
    { id: 'vegetarian', label: 'Vegetarian', count: 15 },
    { id: 'keto', label: 'Keto-Friendly', count: 6 },
    { id: 'dairy-free', label: 'Dairy-Free', count: 10 },
    { id: 'nut-free', label: 'Nut-Free', count: 18 }
  ];

  const proteinTypes = [
    { id: 'beef', label: 'Beef', count: 14 },
    { id: 'chicken', label: 'Chicken', count: 12 },
    { id: 'turkey', label: 'Turkey', count: 6 },
    { id: 'plant-based', label: 'Plant-Based', count: 8 },
    { id: 'fish', label: 'Fish', count: 4 }
  ];

  const priceRanges = [
    { id: 'under-10', label: 'Under $10', count: 8 },
    { id: '10-15', label: '$10 - $15', count: 12 },
    { id: '15-20', label: '$15 - $20', count: 6 },
    { id: 'over-20', label: 'Over $20', count: 3 }
  ];

  const calorieRanges = [
    { id: 'under-400', label: 'Under 400 cal', count: 5 },
    { id: '400-600', label: '400 - 600 cal', count: 12 },
    { id: '600-800', label: '600 - 800 cal', count: 8 },
    { id: 'over-800', label: 'Over 800 cal', count: 4 }
  ];

  const handleFilterToggle = (category, value) => {
    const currentFilters = filters?.[category] || [];
    const newFilters = currentFilters?.includes(value)
      ? currentFilters?.filter(item => item !== value)
      : [...currentFilters, value];
    
    onFilterChange(category, newFilters);
  };

  const getActiveFilterCount = () => {
    return Object.values(filters)?.reduce((total, filterArray) => {
      return total + (Array.isArray(filterArray) ? filterArray?.length : 0);
    }, 0);
  };

  const FilterSection = ({ title, items, category, icon }) => (
    <div className="mb-6">
      <div className="flex items-center space-x-2 mb-3">
        <Icon name={icon} size={16} className="text-primary" />
        <h3 className="font-medium text-text-primary">{title}</h3>
      </div>
      <div className="space-y-2">
        {items?.map((item) => (
          <div key={item?.id} className="flex items-center justify-between">
            <Checkbox
              label={item?.label}
              checked={filters?.[category]?.includes(item?.id) || false}
              onChange={() => handleFilterToggle(category, item?.id)}
              size="sm"
            />
            <span className="text-xs text-text-secondary">({item?.count})</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-16 left-0 h-screen lg:h-auto w-80 lg:w-full
        bg-background border-r lg:border-r-0 border-border
        transform transition-transform duration-300 z-50 lg:z-auto
        overflow-y-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 lg:p-0">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <h2 className="text-lg font-semibold text-text-primary">Filters</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              iconName="X"
            />
          </div>

          {/* Filter Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Icon name="Filter" size={18} className="text-primary" />
              <span className="font-medium text-text-primary">
                Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
              </span>
            </div>
            {getActiveFilterCount() > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-xs"
              >
                Clear All
              </Button>
            )}
          </div>

          {/* Dietary Preferences */}
          <FilterSection
            title="Dietary Preferences"
            items={dietaryOptions}
            category="dietary"
            icon="Heart"
          />

          {/* Protein Types */}
          <FilterSection
            title="Protein Types"
            items={proteinTypes}
            category="protein"
            icon="Beef"
          />

          {/* Price Range */}
          <FilterSection
            title="Price Range"
            items={priceRanges}
            category="price"
            icon="DollarSign"
          />

          {/* Calorie Range */}
          <FilterSection
            title="Calorie Range"
            items={calorieRanges}
            category="calories"
            icon="Activity"
          />

          {/* Safety Information */}
          <div className="mt-6 p-3 bg-success/10 rounded-lg border border-success/20">
            <div className="flex items-start space-x-2">
              <Icon name="Shield" size={16} className="text-success mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-success mb-1">
                  Cross-Contamination Safety
                </h4>
                <p className="text-xs text-text-secondary">
                  All gluten-free items are prepared in dedicated areas with separate equipment to prevent cross-contamination.
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