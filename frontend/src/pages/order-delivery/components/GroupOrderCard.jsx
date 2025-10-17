import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const GroupOrderCard = ({ groupOrder, onInviteMembers, onRemoveMember, onFinalizeOrder }) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);

  const handleInvite = () => {
    if (inviteEmail?.trim()) {
      onInviteMembers([inviteEmail]);
      setInviteEmail('');
      setShowInviteForm(false);
    }
  };

  const getTotalItems = () => {
    return groupOrder?.members?.reduce((total, member) => total + member?.items?.length, 0);
  };

  const getTotalAmount = () => {
    return groupOrder?.members?.reduce((total, member) => 
      total + member?.items?.reduce((memberTotal, item) => memberTotal + item?.price, 0), 0
    );
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-warm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Group Order</h3>
          <p className="text-sm text-text-secondary">
            {groupOrder?.members?.length} members • {getTotalItems()} items • ${getTotalAmount()?.toFixed(2)}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="UserPlus"
            onClick={() => setShowInviteForm(!showInviteForm)}
          >
            Invite
          </Button>
          <Button
            variant="default"
            size="sm"
            iconName="ShoppingCart"
            onClick={onFinalizeOrder}
            disabled={getTotalItems() === 0}
          >
            Finalize Order
          </Button>
        </div>
      </div>
      {/* Invite Form */}
      {showInviteForm && (
        <div className="bg-background rounded-lg p-4 mb-6 border border-border">
          <h4 className="font-medium text-text-primary mb-3">Invite Members</h4>
          <div className="flex space-x-3">
            <Input
              placeholder="Enter email address"
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e?.target?.value)}
              className="flex-1"
            />
            <Button
              variant="default"
              size="sm"
              onClick={handleInvite}
              disabled={!inviteEmail?.trim()}
            >
              Send Invite
            </Button>
          </div>
          <div className="flex items-center space-x-4 mt-3">
            <Button variant="ghost" size="xs" iconName="Copy">
              Copy Link
            </Button>
            <Button variant="ghost" size="xs" iconName="Share">
              Share
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setShowInviteForm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      {/* Group Members */}
      <div className="space-y-4">
        {groupOrder?.members?.map((member) => (
          <div key={member?.id} className="bg-background rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-medium text-sm">
                    {member?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-text-primary">{member?.name}</p>
                  <p className="text-sm text-text-secondary">{member?.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-text-secondary">
                  {member?.items?.length} items • ${member?.items?.reduce((total, item) => total + item?.price, 0)?.toFixed(2)}
                </span>
                {member?.status === 'pending' && (
                  <span className="text-xs bg-warning text-warning-foreground px-2 py-1 rounded">
                    Pending
                  </span>
                )}
                {member?.status === 'completed' && (
                  <span className="text-xs bg-success text-success-foreground px-2 py-1 rounded">
                    Ready
                  </span>
                )}
                {member?.id !== groupOrder?.organizer && (
                  <Button
                    variant="ghost"
                    size="xs"
                    iconName="X"
                    onClick={() => onRemoveMember(member?.id)}
                  />
                )}
              </div>
            </div>

            {/* Member's Items */}
            {member?.items?.length > 0 ? (
              <div className="space-y-2">
                {member?.items?.map((item) => (
                  <div key={item?.id} className="flex items-center space-x-3 p-2 bg-card rounded">
                    <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={item?.image}
                        alt={item?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary">{item?.name}</p>
                      <p className="text-xs text-text-secondary">{item?.customizations}</p>
                    </div>
                    <span className="text-sm font-medium text-primary">${item?.price?.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Icon name="ShoppingCart" size={24} className="text-text-secondary mx-auto mb-2" />
                <p className="text-sm text-text-secondary">
                  {member?.status === 'pending' ? 'Waiting for order...' : 'No items added yet'}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Group Order Settings */}
      <div className="mt-6 p-4 bg-background rounded-lg border border-border">
        <h4 className="font-medium text-text-primary mb-3">Order Settings</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Order Deadline</span>
            <span className="text-sm font-medium text-text-primary">
              {new Date(groupOrder.deadline)?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Delivery Address</span>
            <span className="text-sm font-medium text-text-primary">{groupOrder?.deliveryAddress}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Payment Method</span>
            <span className="text-sm font-medium text-text-primary">{groupOrder?.paymentMethod}</span>
          </div>
        </div>
      </div>
      {/* Order Summary */}
      <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-text-primary">Total Order</p>
            <p className="text-sm text-text-secondary">{getTotalItems()} items from {groupOrder?.members?.length} members</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-primary">${getTotalAmount()?.toFixed(2)}</p>
            <p className="text-sm text-text-secondary">+ delivery & tax</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupOrderCard;