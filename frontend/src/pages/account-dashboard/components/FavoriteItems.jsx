import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const FavoriteItems = ({ favorites, onAddToCart, onRemoveFavorite, onCustomize }) => {
  // Asegurarnos de que favorites siempre sea un array
  const safeFavorites = favorites || [];

  // Función para determinar si es una receta personalizada
  const isCustomRecipe = (item) => {
    return item?.customData !== undefined || item?.isCustom;
  };

  // Función para obtener badges según el tipo de receta
  const getRecipeBadges = (item) => {
    const badges = [];
    
    if (!item) return badges;
    
    // Badge de personalizado
    if (isCustomRecipe(item)) {
      badges.push({ label: 'Personalizado', color: 'bg-accent/10 text-accent', icon: 'Sparkles' });
    }
    
    // Badge según el tipo de producto
    if (item?.customData?.type === 'pizza') {
      badges.push({ label: 'Pizza', color: 'bg-primary/10 text-primary', icon: 'Pizza' });
    } else if (item?.customData?.type === 'burger') {
      badges.push({ label: 'Hamburguesa', color: 'bg-warning/10 text-warning', icon: 'Beef' });
    }
    
    // Badge de tamaño si existe
    if (item?.customData?.sizeInfo?.nameEs) {
      badges.push({ label: item.customData.sizeInfo.nameEs, color: 'bg-success/10 text-success', icon: 'Ruler' });
    }
    
    return badges;
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-warm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Tus Recetas Favoritas</h3>
          <p className="text-sm text-text-secondary">
            {safeFavorites.length} {safeFavorites.length === 1 ? 'receta guardada' : 'recetas guardadas'}
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          iconName="Settings"
          onClick={() => {/* Puedes agregar funcionalidad de gestión aquí */}}
        >
          Administrar
        </Button>
      </div>
      
      {safeFavorites.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="Heart" size={48} className="text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">No tenés recetas favoritas guardadas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
          {safeFavorites.map((item) => {
            if (!item) return null; // Skip null items
            
            const badges = getRecipeBadges(item);
            const isCustom = isCustomRecipe(item);
            
            return (
              <div 
                key={item?.id} 
                className="border border-border rounded-lg p-4 hover:shadow-warm-sm transition-warm bg-background"
              >
                {/* Imagen y Header */}
                <div className="flex items-start space-x-3 mb-3">
                  <div className="relative flex-shrink-0">
                    <Image
                      src={item?.image}
                      alt={item?.name || 'Receta favorita'}
                      className="w-16 h-16 rounded-lg object-cover"
                      fallback={isCustom ? '/images/custom-recipe.jpg' : '/images/default-food.jpg'}
                    />
                    {isCustom && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                        <Icon name="Sparkles" size={12} className="text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-text-primary truncate">{item?.name || 'Receta sin nombre'}</h4>
                        <p className="text-sm text-text-secondary line-clamp-2 mt-1">
                          {item?.customData?.ingredients?.map(ing => ing?.name).filter(Boolean).join(', ') || item?.description || 'Sin descripción'}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveFavorite(item?.id)}
                        iconName="Heart"
                        className="text-accent hover:bg-accent/10 flex-shrink-0 ml-2"
                      />
                    </div>
                    
                    {/* Badges */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {badges.map((badge, index) => (
                        <span 
                          key={index} 
                          className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${badge.color}`}
                        >
                          {badge.icon && <Icon name={badge.icon} size={10} />}
                          {badge.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Precio y Acciones */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-lg font-semibold text-primary">
                      ${typeof item?.price === 'number' ? item.price.toFixed(2) : '0.00'}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isCustom && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onCustomize(item?.id)}
                        iconName="Edit2"
                      >
                        Modificar
                      </Button>
                    )}
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onAddToCart(item?.id)}
                      iconName="Plus"
                    >
                      Agregar
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FavoriteItems;