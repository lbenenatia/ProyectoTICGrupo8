import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DietaryFilterBar = ({ onFilterChange }) => {
  const [activeFilters, setActiveFilters] = useState([]);

  const dietaryOptions = [
    {
      id: 'pizza',
      name: 'Pizzas',
      icon: 'Pizza',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/30'
    },
    {
      id: 'burger',
      name: 'Hamburguesas',
      icon: 'Hamburger',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/30'
    },
    {
      id: 'gluten-free',
      name: 'Sin Glúten',
      icon: 'Wheat',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/30'
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

  // Mobile drawer state
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && mobileOpen) setMobileOpen(false);
    };
    if (mobileOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  return (
    <div className="bg-card border-b border-border shadow-warm-sm sticky top-16 z-40">
      <div className="container mx-auto px-4 lg:px-6 py-4">
        {/* HEADER + FILTROS */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-y-3">

          {/* Izquierda: título + chips */}
          <div className="flex items-center gap-3 flex-wrap">
            <Icon name="Filter" size={20} className="text-primary" />
            <h3 className="font-semibold text-text-primary">Preferencias</h3>

            {/* Chips pegados al título (solo desktop) */}
            <div className="hidden sm:flex items-center gap-3 flex-wrap">
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
                    {isActive && <Icon name="Check" size={14} className={option?.color} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Derecha: botón Clear All o Filters (mobile) */}
          <div className="flex items-center gap-2 ml-auto">
            {activeFilters?.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                iconName="X"
                iconPosition="left"
                className="hidden sm:inline-flex"
              >
                Borrar Filtros ({activeFilters?.length})
              </Button>
            )}

            {/* Botón mobile para abrir drawer */}
            <button
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-white sm:hidden"
              aria-expanded={mobileOpen}
              aria-controls="mobile-dietary-drawer"
              onClick={() => setMobileOpen(true)}
            >
              <Icon name="Filter" size={16} />
              <span className="text-sm">Filtros</span>
            </button>
          </div>
        </div>


        {/* Active Filters Summary (hidden on mobile) */}
        {activeFilters?.length > 0 && (
          <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg hidden sm:block">
            <div className="flex items-center space-x-2">
              <Icon name="Info" size={16} className="text-primary" />
              <span className="text-sm text-primary font-medium">
                Opciones: {activeFilters?.map(id => 
                  dietaryOptions?.find(opt => opt?.id === id)?.name
                )?.join(', ')}
              </span>
            </div>
          </div>
        )}

        {/* Mobile Drawer Overlay */}
        {mobileOpen && (
          <div
            id="mobile-dietary-drawer"
            className="fixed inset-0 z-50 sm:hidden"
            role="dialog"
            aria-modal="true"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
            <div className="absolute inset-x-4 bottom-4 bg-card rounded-lg p-4 max-h-[70vh] overflow-auto">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Icon name="Filter" size={18} className="text-primary" />
                  <h4 className="font-semibold">Filtros</h4>
                </div>
                <button
                  className="inline-flex items-center px-3 py-2 rounded-md border"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close filters"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>

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
                      <Icon name={option?.icon} size={16} className={isActive ? option?.color : 'text-text-secondary'} />
                      <span className="font-medium text-sm">{option?.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => { clearAllFilters(); setMobileOpen(false); }}>Borrar Filtros</Button>
                <Button size="sm" onClick={() => setMobileOpen(false)}>Listo</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DietaryFilterBar;