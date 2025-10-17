import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const FamilyProfiles = ({ familyMembers, onAddMember, onEditMember, onViewOrders }) => {
  const getDietaryPreferences = (dietary) => {
    const prefs = [];
    if (dietary?.glutenFree) prefs?.push('Gluten-Free');
    if (dietary?.vegan) prefs?.push('Vegan');
    if (dietary?.vegetarian) prefs?.push('Vegetarian');
    if (dietary?.keto) prefs?.push('Keto');
    if (dietary?.dairyFree) prefs?.push('Dairy-Free');
    return prefs;
  };

  const getAgeGroupIcon = (ageGroup) => {
    switch (ageGroup) {
      case 'adult': return 'User';
      case 'teen': return 'UserCheck';
      case 'child': return 'Baby';
      default: return 'User';
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-warm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Family Profiles</h3>
        <Button variant="outline" size="sm" onClick={onAddMember} iconName="UserPlus">
          Add Member
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {familyMembers?.map((member) => (
          <div key={member?.id} className="border border-border rounded-lg p-4 hover:shadow-warm-sm transition-warm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Image
                    src={member?.avatar}
                    alt={member?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-muted rounded-full border-2 border-card flex items-center justify-center">
                    <Icon name={getAgeGroupIcon(member?.ageGroup)} size={8} className="text-text-secondary" />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary">{member?.name}</h4>
                  <p className="text-sm text-text-secondary capitalize">{member?.relationship}</p>
                  <p className="text-xs text-text-secondary">{member?.age} years old</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditMember(member?.id)}
                iconName="Edit2"
              />
            </div>

            {/* Dietary Preferences */}
            <div className="mb-3">
              <div className="text-xs text-text-secondary mb-1">Dietary Preferences</div>
              <div className="flex flex-wrap gap-1">
                {getDietaryPreferences(member?.dietary)?.length > 0 ? (
                  getDietaryPreferences(member?.dietary)?.map((pref, index) => (
                    <span key={index} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {pref}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-text-secondary">No restrictions</span>
                )}
              </div>
            </div>

            {/* Favorite Items */}
            <div className="mb-3">
              <div className="text-xs text-text-secondary mb-1">Favorite Items</div>
              <div className="flex items-center space-x-2">
                {member?.favoriteItems?.slice(0, 3)?.map((item, index) => (
                  <Image
                    key={index}
                    src={item?.image}
                    alt={item?.name}
                    className="w-6 h-6 rounded object-cover"
                  />
                ))}
                {member?.favoriteItems?.length > 3 && (
                  <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                    <span className="text-xs text-text-secondary">+{member?.favoriteItems?.length - 3}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Icon name="ShoppingBag" size={12} className="text-text-secondary" />
                  <span className="text-text-secondary">{member?.totalOrders} orders</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Heart" size={12} className="text-error" />
                  <span className="text-text-secondary">{member?.favoriteItems?.length} favorites</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewOrders(member?.id)}
                className="text-xs"
              >
                View Orders
              </Button>
            </div>
          </div>
        ))}
      </div>
      {familyMembers?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Users" size={48} className="text-text-secondary mx-auto mb-4" />
          <h4 className="text-lg font-medium text-text-primary mb-2">No Family Members Added</h4>
          <p className="text-text-secondary mb-4">
            Add family members to manage their dietary preferences and order history
          </p>
          <Button variant="default" onClick={onAddMember} iconName="UserPlus">
            Add First Member
          </Button>
        </div>
      )}
    </div>
  );
};

export default FamilyProfiles;