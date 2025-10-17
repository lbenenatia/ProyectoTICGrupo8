import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const MenuHighlights = () => {
  const featuredItems = [
    {
      id: 1,
      category: 'pizza',
      name: 'Mediterranean Delight',
      description: 'Gluten-free base with artisanal feta, sun-dried tomatoes, olives, and fresh herbs',
      image: 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: { small: 14.99, medium: 18.99, large: 22.99 },
      dietary: ['gluten-free', 'vegetarian'],
      rating: 4.8,
      customizable: true,
      popular: true
    },
    {
      id: 2,
      category: 'burger',
      name: 'Plant-Based Champion',
      description: 'Beyond patty with vegan cheese, avocado, and house-made herb aioli on brioche bun',
      image: 'https://images.pexels.com/photos/1639565/pexels-photo-1639565.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: { single: 16.99, double: 21.99 },
      dietary: ['vegan', 'dairy-free'],
      rating: 4.9,
      customizable: true,
      new: true
    },
    {
      id: 3,
      category: 'pizza',
      name: 'Keto Carnivore',
      description: 'Cauliflower crust loaded with premium meats, cheese, and low-carb vegetables',
      image: 'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: { small: 16.99, medium: 20.99, large: 24.99 },
      dietary: ['keto', 'low-carb'],
      rating: 4.7,
      customizable: true,
      chef: true
    },
    {
      id: 4,
      category: 'burger',
      name: 'Classic Reimagined',
      description: 'Grass-fed beef, aged cheddar, crispy bacon, and signature sauce on artisan bun',
      image: 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: { single: 15.99, double: 19.99 },
      dietary: [],
      rating: 4.8,
      customizable: true,
      popular: true
    }
  ];

  const getDietaryBadgeColor = (dietary) => {
    if (dietary?.includes('gluten-free') || dietary?.includes('vegan')) return 'bg-success/10 text-success border-success/30';
    if (dietary?.includes('keto')) return 'bg-warning/10 text-warning border-warning/30';
    return 'bg-primary/10 text-primary border-primary/30';
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-accent/10 border border-accent/30 rounded-full px-4 py-2 mb-4">
            <Icon name="Star" size={16} className="text-accent" />
            <span className="text-accent font-medium text-sm">Featured Favorites</span>
          </div>
          
          <h2 className="font-playfair text-4xl lg:text-5xl font-semibold text-text-primary mb-4">
            Taste the Difference
          </h2>
          
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Discover our most loved creations, crafted with premium ingredients and designed to satisfy every dietary preference
          </p>
        </div>

        {/* Featured Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredItems?.map((item) => (
            <div key={item?.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-warm hover:shadow-warm-lg transition-warm group">
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={item?.image}
                  alt={item?.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-warm"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {item?.popular && (
                    <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                  {item?.new && (
                    <span className="bg-accent text-accent-foreground text-xs font-medium px-2 py-1 rounded-full">
                      New
                    </span>
                  )}
                  {item?.chef && (
                    <span className="bg-secondary text-secondary-foreground text-xs font-medium px-2 py-1 rounded-full">
                      Chef's Choice
                    </span>
                  )}
                </div>

                {/* Rating */}
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                  <Icon name="Star" size={12} className="text-accent fill-current" />
                  <span className="text-white text-xs font-medium">{item?.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-primary uppercase tracking-wide">
                    {item?.category}
                  </span>
                  {item?.customizable && (
                    <div className="flex items-center space-x-1">
                      <Icon name="Settings" size={12} className="text-text-secondary" />
                      <span className="text-xs text-text-secondary">Customizable</span>
                    </div>
                  )}
                </div>

                <h3 className="font-semibold text-text-primary mb-2 line-clamp-1">
                  {item?.name}
                </h3>

                <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                  {item?.description}
                </p>

                {/* Dietary Tags */}
                {item?.dietary?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item?.dietary?.slice(0, 2)?.map((diet) => (
                      <span
                        key={diet}
                        className={`text-xs px-2 py-1 rounded-full border ${getDietaryBadgeColor(item?.dietary)}`}
                      >
                        {diet?.replace('-', ' ')}
                      </span>
                    ))}
                    {item?.dietary?.length > 2 && (
                      <span className="text-xs text-text-secondary">
                        +{item?.dietary?.length - 2} more
                      </span>
                    )}
                  </div>
                )}

                {/* Pricing */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-primary">
                      ${Object.values(item?.price)?.[0]}
                    </span>
                    {Object.keys(item?.price)?.length > 1 && (
                      <span className="text-xs text-text-secondary">
                        - ${Object.values(item?.price)?.[Object.values(item?.price)?.length - 1]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="default" size="sm" fullWidth>
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="sm" iconName="Eye">
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pizza-menu">
              <Button variant="outline" size="lg" iconName="Pizza" iconPosition="left">
                View All Pizzas
              </Button>
            </Link>
            <Link to="/burger-menu">
              <Button variant="outline" size="lg" iconName="Beef" iconPosition="left">
                View All Burgers
              </Button>
            </Link>
            <Link to="/build-your-own">
              <Button variant="default" size="lg" iconName="ChefHat" iconPosition="left">
                Build Your Own
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuHighlights;