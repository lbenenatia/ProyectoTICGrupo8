import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const FavoriteItems = ({ favorites, onAddToCart, onRemoveFavorite, onCustomize }) => {
  const getDietaryBadges = (dietary) => {
    const badges = [];
    if (dietary?.glutenFree) badges?.push({ label: 'GF', color: 'bg-success/10 text-success' });
    if (dietary?.vegan) badges?.push({ label: 'V', color: 'bg-accent/10 text-accent' });
    if (dietary?.keto) badges?.push({ label: 'K', color: 'bg-primary/10 text-primary' });
    return badges;
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-warm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Favorite Items</h3>
        <Button variant="ghost" size="sm" iconName="Settings">
          Manage
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {favorites?.map((item) => (
          <div key={item?.id} className="border border-border rounded-lg p-4 hover:shadow-warm-sm transition-warm">
            <div className="flex items-start space-x-3 mb-3">
              <div className="relative">
                <Image
                  src={item?.image}
                  alt={item?.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                {item?.isCustom && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                    <Icon name="Sparkles" size={10} className="text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-text-primary">{item?.name}</h4>
                    <p className="text-sm text-text-secondary line-clamp-2">{item?.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveFavorite(item?.id)}
                    iconName="Heart"
                    className="text-error hover:bg-error/10"
                  />
                </div>
                
                <div className="flex items-center space-x-2 mt-2">
                  {getDietaryBadges(item?.dietary)?.map((badge, index) => (
                    <span key={index} className={`text-xs px-2 py-1 rounded-full ${badge?.color}`}>
                      {badge?.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-lg font-semibold text-primary">${item?.price}</div>
                <div className="flex items-center space-x-1 text-sm text-text-secondary">
                  <Icon name="Clock" size={14} />
                  <span>{item?.prepTime} min</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {item?.isCustom && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCustomize(item?.id)}
                    iconName="Edit2"
                  >
                    Modify
                  </Button>
                )}
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onAddToCart(item?.id)}
                  iconName="Plus"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteItems;