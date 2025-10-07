import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProfileCard = ({ user, onEditProfile }) => {
  return (
    <div className="bg-card rounded-lg p-6 shadow-warm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Image
              src={user?.avatar}
              alt={user?.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-card flex items-center justify-center">
              <Icon name="Check" size={12} className="text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-text-primary">{user?.name}</h2>
            <p className="text-text-secondary">{user?.email}</p>
            <div className="flex items-center space-x-2 mt-1">
              <Icon name="MapPin" size={14} className="text-text-secondary" />
              <span className="text-sm text-text-secondary">{user?.location}</span>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onEditProfile} iconName="Edit2" iconPosition="left">
          Edit
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="text-2xl font-bold text-primary">{user?.totalOrders}</div>
          <div className="text-sm text-text-secondary">Total Orders</div>
        </div>
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="text-2xl font-bold text-accent">{user?.loyaltyPoints}</div>
          <div className="text-sm text-text-secondary">Loyalty Points</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;