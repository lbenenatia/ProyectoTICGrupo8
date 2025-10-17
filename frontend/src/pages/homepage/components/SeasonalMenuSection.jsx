import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const SeasonalMenuSection = () => {
  const [activeItem, setActiveItem] = useState(0);

  const seasonalItems = [
    {
      id: 1,
      name: 'Autumn Harvest Pizza',
      category: 'Limited Time Pizza',
      description: 'Butternut squash base, caramelized onions, goat cheese, candied walnuts, and fresh sage on our signature gluten-free crust',
      image: 'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&w=600',
      price: { small: 16.99, medium: 21.99, large: 26.99 },
      dietary: ['gluten-free', 'vegetarian'],
      availableUntil: 'November 30, 2024',
      ingredients: ['Butternut Squash', 'Goat Cheese', 'Candied Walnuts', 'Fresh Sage', 'Caramelized Onions'],
      nutritionHighlight: 'Rich in Vitamin A & Fiber',
      chefNote: 'Inspired by traditional autumn flavors with a modern twist',
      limited: true,
      new: true
    },
    {
      id: 2,
      name: 'Spiced Apple Cider Burger',
      category: 'Seasonal Burger',
      description: 'Grass-fed beef patty with apple cider glaze, sharp cheddar, crispy bacon, and apple slaw on brioche bun',
      image: 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?auto=compress&cs=tinysrgb&w=600',
      price: { single: 17.99, double: 22.99 },
      dietary: [],
      availableUntil: 'December 15, 2024',
      ingredients: ['Apple Cider Glaze', 'Sharp Cheddar', 'Crispy Bacon', 'Apple Slaw', 'Brioche Bun'],
      nutritionHighlight: 'High Protein & Natural Sweetness',
      chefNote: 'Perfect balance of sweet and savory autumn flavors',
      limited: true,
      popular: true
    },
    {
      id: 3,
      name: 'Pumpkin Spice Cauliflower Crust',
      category: 'Seasonal Base',
      description: 'Keto-friendly cauliflower crust infused with pumpkin spice blend, perfect for any toppings',
      image: 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=600',
      price: { small: 15.99, medium: 19.99, large: 24.99 },
      dietary: ['keto', 'gluten-free', 'low-carb'],
      availableUntil: 'October 31, 2024',
      ingredients: ['Cauliflower', 'Pumpkin Spice', 'Almond Flour', 'Eggs', 'Mozzarella'],
      nutritionHighlight: 'Low Carb & Seasonal Spices',
      chefNote: 'Our most requested seasonal base returns',
      limited: true,
      trending: true
    },
    {
      id: 4,
      name: 'Cranberry Walnut Vegan Burger',
      category: 'Plant-Based Special',
      description: 'House-made lentil and quinoa patty with cranberry compote, candied walnuts, and vegan aioli',
      image: 'https://images.pexels.com/photos/1639565/pexels-photo-1639565.jpeg?auto=compress&cs=tinysrgb&w=600',
      price: { single: 16.99, double: 21.99 },
      dietary: ['vegan', 'dairy-free', 'plant-based'],
      availableUntil: 'January 15, 2025',
      ingredients: ['Lentil-Quinoa Patty', 'Cranberry Compote', 'Candied Walnuts', 'Vegan Aioli', 'Whole Grain Bun'],
      nutritionHighlight: 'Complete Protein & Antioxidants',
      chefNote: 'Celebrating plant-based innovation',
      limited: true,
      chef: true
    }
  ];

  const currentItem = seasonalItems?.[activeItem];

  const getDietaryBadgeColor = (dietary) => {
    if (dietary?.includes('gluten-free') || dietary?.includes('vegan')) return 'bg-success/10 text-success border-success/30';
    if (dietary?.includes('keto')) return 'bg-warning/10 text-warning border-warning/30';
    return 'bg-primary/10 text-primary border-primary/30';
  };

  const getTimeRemaining = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} days left` : 'Ending soon';
  };

  return (
    <section className="py-16 bg-gradient-to-br from-accent/5 to-primary/5">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-accent/20 border border-accent/30 rounded-full px-4 py-2 mb-4">
            <Icon name="Calendar" size={16} className="text-accent" />
            <span className="text-accent font-medium text-sm">Limited Time Only</span>
          </div>
          
          <h2 className="font-playfair text-4xl lg:text-5xl font-semibold text-text-primary mb-4">
            Seasonal Menu Innovation
          </h2>
          
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Discover our chef's seasonal creations that push creative boundaries while maintaining all your favorite dietary options. Available for a limited time only.
          </p>
        </div>

        {/* Item Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {seasonalItems?.map((item, index) => (
            <button
              key={item?.id}
              onClick={() => setActiveItem(index)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg border transition-warm ${
                index === activeItem
                  ? 'bg-accent/20 border-accent/30 text-accent' :'bg-card border-border text-text-secondary hover:bg-muted hover:text-primary'
              }`}
            >
              <span className="font-medium text-sm">{item?.name}</span>
              {item?.new && (
                <span className="bg-accent text-accent-foreground text-xs px-1.5 py-0.5 rounded-full">
                  New
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Image & Details */}
          <div>
            <div className="relative overflow-hidden rounded-2xl shadow-warm-lg mb-6">
              <Image
                src={currentItem?.image}
                alt={currentItem?.name}
                className="w-full h-96 object-cover"
              />
              
              {/* Overlay Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {currentItem?.limited && (
                  <span className="bg-accent text-accent-foreground text-xs font-medium px-2 py-1 rounded-full">
                    Limited Time
                  </span>
                )}
                {currentItem?.new && (
                  <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
                    New
                  </span>
                )}
                {currentItem?.popular && (
                  <span className="bg-secondary text-secondary-foreground text-xs font-medium px-2 py-1 rounded-full">
                    Popular
                  </span>
                )}
                {currentItem?.trending && (
                  <span className="bg-warning text-warning-foreground text-xs font-medium px-2 py-1 rounded-full">
                    Trending
                  </span>
                )}
                {currentItem?.chef && (
                  <span className="bg-success text-success-foreground text-xs font-medium px-2 py-1 rounded-full">
                    Chef's Choice
                  </span>
                )}
              </div>

              {/* Countdown */}
              <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={14} className="text-accent" />
                  <span className="text-white text-sm font-medium">
                    {getTimeRemaining(currentItem?.availableUntil)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-lg p-3 text-center">
                <Icon name="Star" size={20} className="text-accent mx-auto mb-1" />
                <div className="text-sm font-medium text-text-primary">4.9★</div>
                <div className="text-xs text-text-secondary">Rating</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-3 text-center">
                <Icon name="Users" size={20} className="text-primary mx-auto mb-1" />
                <div className="text-sm font-medium text-text-primary">2.5K+</div>
                <div className="text-xs text-text-secondary">Orders</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-3 text-center">
                <Icon name="Heart" size={20} className="text-success mx-auto mb-1" />
                <div className="text-sm font-medium text-text-primary">95%</div>
                <div className="text-xs text-text-secondary">Love It</div>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-sm font-medium text-primary uppercase tracking-wide">
                {currentItem?.category}
              </span>
              <div className="flex items-center space-x-1">
                <Icon name="Calendar" size={14} className="text-text-secondary" />
                <span className="text-xs text-text-secondary">
                  Until {currentItem?.availableUntil}
                </span>
              </div>
            </div>

            <h3 className="font-playfair text-3xl font-semibold text-text-primary mb-4">
              {currentItem?.name}
            </h3>

            <p className="text-lg text-text-secondary leading-relaxed mb-6">
              {currentItem?.description}
            </p>

            {/* Dietary Tags */}
            {currentItem?.dietary?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {currentItem?.dietary?.map((diet) => (
                  <span
                    key={diet}
                    className={`text-sm px-3 py-1 rounded-full border ${getDietaryBadgeColor(currentItem?.dietary)}`}
                  >
                    {diet?.replace('-', ' ')}
                  </span>
                ))}
              </div>
            )}

            {/* Ingredients */}
            <div className="mb-6">
              <h4 className="font-semibold text-text-primary mb-3 flex items-center space-x-2">
                <Icon name="List" size={18} className="text-primary" />
                <span>Key Ingredients</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentItem?.ingredients?.map((ingredient, index) => (
                  <span
                    key={index}
                    className="text-sm bg-muted text-text-secondary px-3 py-1 rounded-full border border-border"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>

            {/* Chef's Note & Nutrition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="ChefHat" size={16} className="text-primary" />
                  <h5 className="font-medium text-primary text-sm">Chef's Note</h5>
                </div>
                <p className="text-xs text-text-secondary">{currentItem?.chefNote}</p>
              </div>
              <div className="bg-success/5 border border-success/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Activity" size={16} className="text-success" />
                  <h5 className="font-medium text-success text-sm">Nutrition Highlight</h5>
                </div>
                <p className="text-xs text-text-secondary">{currentItem?.nutritionHighlight}</p>
              </div>
            </div>

            {/* Pricing & Actions */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-2xl font-bold text-primary">
                    ${Object.values(currentItem?.price)?.[0]}
                  </span>
                  {Object.keys(currentItem?.price)?.length > 1 && (
                    <span className="text-sm text-text-secondary">
                      - ${Object.values(currentItem?.price)?.[Object.values(currentItem?.price)?.length - 1]}
                    </span>
                  )}
                </div>
                <span className="text-sm text-text-secondary">Starting price</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="default" size="lg" iconName="ShoppingCart" iconPosition="left">
                Order Now
              </Button>
              <Link to="/build-your-own">
                <Button variant="outline" size="lg" iconName="Settings" iconPosition="left">
                  Customize
                </Button>
              </Link>
            </div>

            {/* Availability Warning */}
            <div className="mt-4 p-3 bg-warning/10 border border-warning/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="AlertTriangle" size={16} className="text-warning" />
                <span className="text-sm text-warning font-medium">
                  Limited availability - Order before {currentItem?.availableUntil}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeasonalMenuSection;