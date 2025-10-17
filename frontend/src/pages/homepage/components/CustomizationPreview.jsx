import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CustomizationPreview = () => {
  const [activeTab, setActiveTab] = useState('pizza');

  const customizationOptions = {
    pizza: {
      title: 'Build Your Perfect Pizza',
      subtitle: 'Endless combinations, your way',
      image: 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=600',
      steps: [
        {
          step: 1,
          title: 'Choose Your Base',
          options: ['Traditional Dough', 'Gluten-Free', 'Cauliflower', 'Whole Wheat'],
          icon: 'Circle'
        },
        {
          step: 2,
          title: 'Select Size',
          options: ['Personal 8"', 'Medium 12"', 'Large 16"', 'Family 20"'],
          icon: 'Maximize'
        },
        {
          step: 3,
          title: 'Pick Your Sauce',
          options: ['Classic Marinara', 'White Sauce', 'BBQ', 'Pesto'],
          icon: 'Droplets'
        },
        {
          step: 4,
          title: 'Add Toppings',
          options: ['Premium Meats', 'Fresh Vegetables', 'Artisan Cheeses', 'Specialty Items'],
          icon: 'Plus'
        }
      ],
      dietary: ['Gluten-Free Bases', 'Vegan Cheese', 'Keto Options', 'Dairy-Free'],
      startingPrice: 12.99
    },
    burger: {
      title: 'Craft Your Dream Burger',
      subtitle: 'Premium ingredients, infinite possibilities',
      image: 'https://images.pexels.com/photos/1639565/pexels-photo-1639565.jpeg?auto=compress&cs=tinysrgb&w=600',
      steps: [
        {
          step: 1,
          title: 'Choose Your Bun',
          options: ['Brioche', 'Whole Grain', 'Gluten-Free', 'Lettuce Wrap'],
          icon: 'Circle'
        },
        {
          step: 2,
          title: 'Select Patty',
          options: ['Grass-Fed Beef', 'Plant-Based', 'Turkey', 'Black Bean'],
          icon: 'Beef'
        },
        {
          step: 3,
          title: 'Pick Your Cheese',
          options: ['Aged Cheddar', 'Swiss', 'Vegan Cheese', 'Blue Cheese'],
          icon: 'Milk'
        },
        {
          step: 4,
          title: 'Add Toppings',
          options: ['Fresh Vegetables', 'Premium Bacon', 'Avocado', 'Specialty Sauces'],
          icon: 'Plus'
        }
      ],
      dietary: ['Plant-Based Patties', 'Gluten-Free Buns', 'Dairy-Free Options', 'Keto Wraps'],
      startingPrice: 14.99
    }
  };

  const currentOption = customizationOptions?.[activeTab];

  return (
    <section className="py-16 bg-gradient-to-br from-muted/30 to-background">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-4">
            <Icon name="Settings" size={16} className="text-primary" />
            <span className="text-primary font-medium text-sm">Customization Studio</span>
          </div>
          
          <h2 className="font-playfair text-4xl lg:text-5xl font-semibold text-text-primary mb-4">
            Your Perfect Bite, Guaranteed
          </h2>
          
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Experience unlimited customization with our interactive builder. Every ingredient, every preference, perfectly crafted.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-card border border-border rounded-lg p-1 inline-flex">
            <button
              onClick={() => setActiveTab('pizza')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-warm ${
                activeTab === 'pizza' ?'bg-primary text-primary-foreground shadow-warm-sm' :'text-text-secondary hover:text-primary'
              }`}
            >
              <Icon name="Pizza" size={18} />
              <span>Pizza Builder</span>
            </button>
            <button
              onClick={() => setActiveTab('burger')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-warm ${
                activeTab === 'burger' ?'bg-primary text-primary-foreground shadow-warm-sm' :'text-text-secondary hover:text-primary'
              }`}
            >
              <Icon name="Beef" size={18} />
              <span>Burger Builder</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Steps */}
          <div>
            <h3 className="font-playfair text-3xl font-semibold text-text-primary mb-2">
              {currentOption?.title}
            </h3>
            <p className="text-lg text-text-secondary mb-8">
              {currentOption?.subtitle}
            </p>

            {/* Customization Steps */}
            <div className="space-y-6">
              {currentOption?.steps?.map((step) => (
                <div key={step?.step} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <Icon name={step?.icon} size={18} className="text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-text-primary mb-2">
                      Step {step?.step}: {step?.title}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {step?.options?.map((option, index) => (
                        <span
                          key={index}
                          className="text-sm bg-muted text-text-secondary px-3 py-1 rounded-full border border-border"
                        >
                          {option}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dietary Options */}
            <div className="mt-8 p-4 bg-success/5 border border-success/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Icon name="Heart" size={18} className="text-success" />
                <h4 className="font-semibold text-success">Dietary Preferences Available</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentOption?.dietary?.map((diet, index) => (
                  <span
                    key={index}
                    className="text-sm bg-success/10 text-success px-3 py-1 rounded-full border border-success/30"
                  >
                    {diet}
                  </span>
                ))}
              </div>
            </div>

            {/* Pricing & CTA */}
            <div className="mt-8 flex items-center justify-between">
              <div>
                <span className="text-sm text-text-secondary">Starting from</span>
                <div className="text-2xl font-bold text-primary">
                  ${currentOption?.startingPrice}
                </div>
              </div>
              <Link to="/build-your-own">
                <Button variant="default" size="lg" iconName="ChefHat" iconPosition="left">
                  Start Building
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Side - Visual Preview */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-warm-lg">
              <Image
                src={currentOption?.image}
                alt={currentOption?.title}
                className="w-full h-96 object-cover"
              />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end">
                <div className="p-6 text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Sparkles" size={16} className="text-accent" />
                    <span className="text-accent font-medium text-sm">Live Preview</span>
                  </div>
                  <h4 className="font-semibold text-lg mb-1">Interactive Builder</h4>
                  <p className="text-white/90 text-sm">
                    See your creation come to life with real-time pricing and nutritional info
                  </p>
                </div>
              </div>

              {/* Interactive Elements */}
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2">
                <Icon name="Eye" size={20} className="text-white" />
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <Icon name="Clock" size={24} className="text-primary mx-auto mb-2" />
                <h5 className="font-medium text-text-primary text-sm mb-1">Real-Time Updates</h5>
                <p className="text-xs text-text-secondary">Instant pricing & nutrition</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <Icon name="Save" size={24} className="text-primary mx-auto mb-2" />
                <h5 className="font-medium text-text-primary text-sm mb-1">Save Favorites</h5>
                <p className="text-xs text-text-secondary">Quick reorder anytime</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomizationPreview;