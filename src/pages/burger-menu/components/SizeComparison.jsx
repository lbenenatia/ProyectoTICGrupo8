import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SizeComparison = ({ isOpen, onClose }) => {
  const [selectedBurger, setSelectedBurger] = useState('classic-beef');

  const burgerSizes = {
    'classic-beef': {
      name: 'Classic Beef Burger',
      sizes: {
        small: {
          diameter: '4"',
          weight: '4 oz',
          price: 8.99,
          calories: 420,
          description: 'Perfect for light appetite or kids'
        },
        medium: {
          diameter: '5"',
          weight: '6 oz',
          price: 11.99,
          calories: 580,
          description: 'Our most popular size - great value'
        },
        large: {
          diameter: '6"',
          weight: '8 oz',
          price: 15.99,
          calories: 750,
          description: 'Hearty portion for big appetites'
        },
        xl: {
          diameter: '7"',
          weight: '10 oz',
          price: 19.99,
          calories: 920,
          description: 'Maximum satisfaction guaranteed'
        }
      }
    },
    'plant-based': {
      name: 'Plant-Based Burger',
      sizes: {
        small: {
          diameter: '4"',
          weight: '3.5 oz',
          price: 9.99,
          calories: 350,
          description: 'Light and nutritious option'
        },
        medium: {
          diameter: '5"',
          weight: '5 oz',
          price: 12.99,
          calories: 480,
          description: 'Balanced plant-based nutrition'
        },
        large: {
          diameter: '6"',
          weight: '7 oz',
          price: 16.99,
          calories: 620,
          description: 'Filling plant-powered meal'
        },
        xl: {
          diameter: '7"',
          weight: '9 oz',
          price: 20.99,
          calories: 780,
          description: 'Ultimate plant-based experience'
        }
      }
    }
  };

  const burgerOptions = [
    { id: 'classic-beef', name: 'Classic Beef Burger' },
    { id: 'plant-based', name: 'Plant-Based Burger' }
  ];

  const getSizeCircle = (size) => {
    const sizeMap = {
      small: 'w-16 h-16',
      medium: 'w-20 h-20',
      large: 'w-24 h-24',
      xl: 'w-28 h-28'
    };
    return sizeMap?.[size] || 'w-20 h-20';
  };

  const getValueScore = (size, data) => {
    const caloriesPerDollar = data?.calories / data?.price;
    const baseScore = caloriesPerDollar / 50; // Normalize to 0-1 range roughly
    return Math.min(Math.round(baseScore * 100), 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-warm-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Icon name="Ruler" size={24} className="text-primary" />
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Size Comparison</h2>
              <p className="text-sm text-text-secondary">Compare burger sizes and find your perfect portion</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Burger Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-text-primary mb-3">Select Burger Type</h3>
            <div className="flex flex-wrap gap-2">
              {burgerOptions?.map((burger) => (
                <Button
                  key={burger?.id}
                  variant={selectedBurger === burger?.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedBurger(burger?.id)}
                >
                  {burger?.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Visual Size Comparison */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-text-primary mb-4">Visual Size Comparison</h3>
            <div className="flex items-end justify-center space-x-8 py-8 bg-muted rounded-lg">
              {Object.entries(burgerSizes?.[selectedBurger]?.sizes)?.map(([size, data]) => (
                <div key={size} className="flex flex-col items-center">
                  <div className={`${getSizeCircle(size)} bg-primary rounded-full flex items-center justify-center mb-2 relative`}>
                    <Icon name="Beef" size={size === 'xl' ? 24 : size === 'large' ? 20 : 16} className="text-primary-foreground" />
                    <div className="absolute -bottom-6 text-xs font-medium text-text-primary">
                      {data?.diameter}
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <div className="text-sm font-medium text-text-primary capitalize">{size}</div>
                    <div className="text-xs text-text-secondary">{data?.weight}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Size</th>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Dimensions</th>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Price</th>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Calories</th>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Value Score</th>
                  <th className="text-left py-3 px-4 font-medium text-text-primary">Best For</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(burgerSizes?.[selectedBurger]?.sizes)?.map(([size, data]) => (
                  <tr key={size} className="border-b border-border hover:bg-muted/50 transition-quick">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 bg-primary rounded-full`} />
                        <span className="font-medium text-text-primary capitalize">{size}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-text-secondary">
                      {data?.diameter} • {data?.weight}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-primary">${data?.price}</span>
                    </td>
                    <td className="py-3 px-4 text-text-secondary">
                      {data?.calories} cal
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-accent rounded-full"
                            style={{ width: `${getValueScore(size, data)}%` }}
                          />
                        </div>
                        <span className="text-xs text-text-secondary">{getValueScore(size, data)}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-text-secondary">
                      {data?.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Value Insights */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="TrendingUp" size={16} className="text-success" />
                <span className="text-sm font-medium text-success">Best Value</span>
              </div>
              <p className="text-xs text-text-secondary">
                Medium size offers the best calories-per-dollar ratio for most customers.
              </p>
            </div>
            
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Users" size={16} className="text-warning" />
                <span className="text-sm font-medium text-warning">Most Popular</span>
              </div>
              <p className="text-xs text-text-secondary">
                Medium size is chosen by 65% of our customers for its perfect portion balance.
              </p>
            </div>
            
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Award" size={16} className="text-primary" />
                <span className="text-sm font-medium text-primary">Premium Choice</span>
              </div>
              <p className="text-xs text-text-secondary">
                Large and XL sizes use premium ingredients and artisanal preparation methods.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeComparison;