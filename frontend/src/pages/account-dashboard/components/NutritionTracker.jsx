import React from 'react';
import Icon from '../../../components/AppIcon';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import Button from '../../../components/ui/Button';


const NutritionTracker = ({ nutritionData, onSetGoals, onViewDetails }) => {
  const { dailyGoals, weeklyProgress, achievements } = nutritionData;

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return '#7A9B57'; // success
    if (percentage >= 75) return '#E8B449'; // warning
    return '#D4621A'; // primary
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-warm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Nutrition Tracker</h3>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onViewDetails} iconName="TrendingUp">
            Details
          </Button>
          <Button variant="outline" size="sm" onClick={onSetGoals} iconName="Target">
            Set Goals
          </Button>
        </div>
      </div>
      {/* Daily Goals Progress */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {dailyGoals?.map((goal) => (
          <div key={goal?.name} className="text-center">
            <div className="w-16 h-16 mx-auto mb-2">
              <CircularProgressbar
                value={goal?.percentage}
                text={`${goal?.current}`}
                styles={buildStyles({
                  textSize: '20px',
                  pathColor: getProgressColor(goal?.percentage),
                  textColor: 'var(--color-text-primary)',
                  trailColor: 'var(--color-muted)',
                })}
              />
            </div>
            <div className="text-sm font-medium text-text-primary">{goal?.name}</div>
            <div className="text-xs text-text-secondary">{goal?.current}/{goal?.target} {goal?.unit}</div>
          </div>
        ))}
      </div>
      {/* Weekly Progress */}
      <div className="mb-6">
        <h4 className="font-medium text-text-primary mb-3">Weekly Progress</h4>
        <div className="space-y-3">
          {weeklyProgress?.map((item) => (
            <div key={item?.day} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-xs font-medium text-text-primary">
                    {item?.day?.charAt(0)}
                  </span>
                </div>
                <span className="text-sm text-text-secondary">{item?.day}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary rounded-full h-2 transition-all duration-500"
                    style={{ width: `${item?.completion}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-text-primary w-10 text-right">
                  {item?.completion}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Achievements */}
      <div>
        <h4 className="font-medium text-text-primary mb-3">Recent Achievements</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {achievements?.map((achievement) => (
            <div key={achievement?.id} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <div className="p-2 bg-success/10 rounded-lg">
                <Icon name={achievement?.icon} size={16} className="text-success" />
              </div>
              <div>
                <div className="text-sm font-medium text-text-primary">{achievement?.title}</div>
                <div className="text-xs text-text-secondary">{achievement?.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NutritionTracker;