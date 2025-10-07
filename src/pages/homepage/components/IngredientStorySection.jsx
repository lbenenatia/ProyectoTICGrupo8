import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const IngredientStorySection = () => {
  const [activeIngredient, setActiveIngredient] = useState(0);

  const ingredients = [
    {
      id: 1,
      name: 'Gluten-Free Flour Blend',
      category: 'Base',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
      source: 'Organic Farms, Colorado',
      story: `Our signature gluten-free flour blend combines rice flour, tapioca starch, and potato flour from certified organic farms in Colorado. Each batch is tested for cross-contamination and provides the perfect texture for our artisanal crusts.`,
      benefits: ['Certified Gluten-Free', 'Organic Sourcing', 'Cross-Contamination Free', 'Rich in Nutrients'],
      icon: 'Wheat',
      color: 'success'
    },
    {
      id: 2,
      name: 'Artisanal Aged Cheeses',
      category: 'Dairy',
      image: 'https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg?auto=compress&cs=tinysrgb&w=600',
      source: 'Local Creameries, Vermont',
      story: `Hand-selected from family-owned creameries in Vermont, our cheeses are aged to perfection using traditional methods. From sharp cheddars to creamy mozzarella, each variety brings authentic flavor and superior melting qualities.`,
      benefits: ['Locally Sourced', 'Traditional Aging', 'Superior Melting', 'Rich Flavor Profile'],
      icon: 'Milk',
      color: 'primary'
    },
    {
      id: 3,
      name: 'Plant-Based Proteins',
      category: 'Protein',
      image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600',
      source: 'Sustainable Farms, California',
      story: `Our plant-based proteins are crafted from pea protein, mushrooms, and natural seasonings sourced from sustainable farms in California. Each patty delivers the taste and texture meat-lovers crave while supporting environmental sustainability.`,
      benefits: ['100% Plant-Based', 'Sustainable Sourcing', 'High Protein Content', 'Environmentally Friendly'],
      icon: 'Leaf',
      color: 'success'
    },
    {
      id: 4,
      name: 'Premium Grass-Fed Beef',
      category: 'Protein',
      image: 'https://images.pexels.com/photos/1639565/pexels-photo-1639565.jpeg?auto=compress&cs=tinysrgb&w=600',
      source: 'Ranch Partners, Montana',
      story: `Sourced exclusively from grass-fed cattle on family ranches in Montana, our beef is never treated with hormones or antibiotics. The cattle roam freely on open pastures, resulting in leaner, more flavorful meat with superior nutritional value.`,
      benefits: ['Grass-Fed Only', 'No Hormones/Antibiotics', 'Free-Range', 'Superior Nutrition'],
      icon: 'Beef',
      color: 'secondary'
    }
  ];

  const currentIngredient = ingredients?.[activeIngredient];
  
  const getColorClasses = (color) => {
    const colors = {
      success: 'text-success bg-success/10 border-success/30',
      primary: 'text-primary bg-primary/10 border-primary/30',
      secondary: 'text-secondary bg-secondary/10 border-secondary/30'
    };
    return colors?.[color] || colors?.primary;
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-accent/10 border border-accent/30 rounded-full px-4 py-2 mb-4">
            <Icon name="Sparkles" size={16} className="text-accent" />
            <span className="text-accent font-medium text-sm">Premium Sourcing</span>
          </div>
          
          <h2 className="font-playfair text-4xl lg:text-5xl font-semibold text-text-primary mb-4">
            Ingredient Stories
          </h2>
          
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Every ingredient tells a story of quality, sustainability, and care. Discover the premium sources behind your perfect meal.
          </p>
        </div>

        {/* Ingredient Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {ingredients?.map((ingredient, index) => (
            <button
              key={ingredient?.id}
              onClick={() => setActiveIngredient(index)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg border transition-warm ${
                index === activeIngredient
                  ? getColorClasses(ingredient?.color)
                  : 'bg-card border-border text-text-secondary hover:bg-muted hover:text-primary'
              }`}
            >
              <Icon 
                name={ingredient?.icon} 
                size={18} 
                className={index === activeIngredient ? `text-${ingredient?.color}` : 'text-text-secondary'} 
              />
              <span className="font-medium">{ingredient?.name}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-warm-lg">
              <Image
                src={currentIngredient?.image}
                alt={currentIngredient?.name}
                className="w-full h-96 object-cover"
              />
              
              {/* Overlay Badge */}
              <div className="absolute top-4 left-4">
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-full border backdrop-blur-sm ${getColorClasses(currentIngredient?.color)}`}>
                  <Icon name={currentIngredient?.icon} size={16} />
                  <span className="font-medium text-sm">{currentIngredient?.category}</span>
                </div>
              </div>

              {/* Source Badge */}
              <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
                <div className="flex items-center space-x-2">
                  <Icon name="MapPin" size={14} className="text-white" />
                  <span className="text-white text-sm font-medium">{currentIngredient?.source}</span>
                </div>
              </div>
            </div>

            {/* Quality Indicators */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <Icon name="Shield" size={24} className="text-success mx-auto mb-2" />
                <h5 className="font-medium text-text-primary text-sm mb-1">Quality Certified</h5>
                <p className="text-xs text-text-secondary">Third-party verified</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <Icon name="Truck" size={24} className="text-primary mx-auto mb-2" />
                <h5 className="font-medium text-text-primary text-sm mb-1">Fresh Daily</h5>
                <p className="text-xs text-text-secondary">Direct from source</p>
              </div>
            </div>
          </div>

          {/* Right Side - Story Content */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getColorClasses(currentIngredient?.color)}`}>
                <Icon name={currentIngredient?.icon} size={24} />
              </div>
              <div>
                <h3 className="font-playfair text-2xl font-semibold text-text-primary">
                  {currentIngredient?.name}
                </h3>
                <p className="text-text-secondary">
                  Sourced from {currentIngredient?.source}
                </p>
              </div>
            </div>

            {/* Story */}
            <p className="text-lg text-text-primary leading-relaxed mb-6">
              {currentIngredient?.story}
            </p>

            {/* Benefits */}
            <div className="mb-8">
              <h4 className="font-semibold text-text-primary mb-4 flex items-center space-x-2">
                <Icon name="CheckCircle" size={18} className="text-success" />
                <span>Key Benefits</span>
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {currentIngredient?.benefits?.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Icon name="Check" size={14} className="text-success" />
                    <span className="text-sm text-text-secondary">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sustainability Info */}
            <div className="bg-success/5 border border-success/20 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Leaf" size={18} className="text-success" />
                <h4 className="font-semibold text-success">Sustainability Commitment</h4>
              </div>
              <p className="text-sm text-text-secondary">
                We partner with suppliers who share our commitment to environmental responsibility, 
                fair labor practices, and sustainable farming methods.
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="default" iconName="Eye" iconPosition="left">
                View Sourcing Details
              </Button>
              <Button variant="outline" iconName="ExternalLink" iconPosition="left">
                Visit Our Suppliers
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16 pt-12 border-t border-border">
          <div className="text-center">
            <Icon name="Users" size={32} className="text-primary mx-auto mb-3" />
            <div className="text-2xl font-bold text-text-primary mb-1">25+</div>
            <div className="text-sm text-text-secondary">Trusted Suppliers</div>
          </div>
          <div className="text-center">
            <Icon name="MapPin" size={32} className="text-primary mx-auto mb-3" />
            <div className="text-2xl font-bold text-text-primary mb-1">8</div>
            <div className="text-sm text-text-secondary">Source Regions</div>
          </div>
          <div className="text-center">
            <Icon name="Shield" size={32} className="text-primary mx-auto mb-3" />
            <div className="text-2xl font-bold text-text-primary mb-1">100%</div>
            <div className="text-sm text-text-secondary">Quality Certified</div>
          </div>
          <div className="text-center">
            <Icon name="Leaf" size={32} className="text-primary mx-auto mb-3" />
            <div className="text-2xl font-bold text-text-primary mb-1">85%</div>
            <div className="text-sm text-text-secondary">Organic Ingredients</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IngredientStorySection;