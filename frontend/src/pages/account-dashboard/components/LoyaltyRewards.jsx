import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LoyaltyRewards = ({ loyaltyData, onRedeemReward, onViewHistory }) => {
  const { currentPoints, nextTierPoints, currentTier, rewards, recentEarnings } = loyaltyData;
  const progressPercentage = (currentPoints / nextTierPoints) * 100;

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Bronze': return 'text-amber-600 bg-amber-50';
      case 'Silver': return 'text-gray-600 bg-gray-50';
      case 'Gold': return 'text-yellow-600 bg-yellow-50';
      case 'Platinum': return 'text-purple-600 bg-purple-50';
      default: return 'text-text-secondary bg-muted';
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-warm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Loyalty & Rewards</h3>
        <Button variant="ghost" size="sm" onClick={onViewHistory} iconName="History">
          History
        </Button>
      </div>
      {/* Current Status */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Icon name="Award" size={20} className="text-accent" />
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(currentTier)}`}>
              {currentTier} Member
            </span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{currentPoints}</div>
            <div className="text-sm text-text-secondary">points</div>
          </div>
        </div>
        
        <div className="mb-2">
          <div className="flex justify-between text-sm text-text-secondary mb-1">
            <span>Progress to next tier</span>
            <span>{nextTierPoints - currentPoints} points needed</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary rounded-full h-2 transition-all duration-500"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>
      {/* Available Rewards */}
      <div className="mb-6">
        <h4 className="font-medium text-text-primary mb-3">Available Rewards</h4>
        <div className="space-y-3">
          {rewards?.map((reward) => (
            <div key={reward?.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon name={reward?.icon} size={16} className="text-primary" />
                </div>
                <div>
                  <div className="font-medium text-text-primary">{reward?.title}</div>
                  <div className="text-sm text-text-secondary">{reward?.description}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-primary">{reward?.points} pts</div>
                <Button
                  variant={currentPoints >= reward?.points ? "default" : "outline"}
                  size="sm"
                  disabled={currentPoints < reward?.points}
                  onClick={() => onRedeemReward(reward?.id)}
                >
                  {currentPoints >= reward?.points ? "Redeem" : "Need More"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Recent Earnings */}
      <div>
        <h4 className="font-medium text-text-primary mb-3">Recent Earnings</h4>
        <div className="space-y-2">
          {recentEarnings?.map((earning, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-2">
                <Icon name="Plus" size={14} className="text-success" />
                <span className="text-sm text-text-secondary">{earning?.description}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-success">+{earning?.points}</span>
                <span className="text-xs text-text-secondary">{earning?.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoyaltyRewards;