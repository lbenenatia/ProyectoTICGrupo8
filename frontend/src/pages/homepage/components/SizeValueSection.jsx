import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const SizeValueSection = () => {
  const [activeCategory, setActiveCategory] = useState('pizza');

  const sizeOptions = {
    pizza: {
      title: 'Pizza Sizes & Value',
      subtitle: 'Perfect portions for every occasion',
      sizes: [
        {
          name: 'Personal',
          size: '8"',
          description: 'Perfect for one person',
          servings: '1 person',
          price: 12.99,
          image: 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=300',
          popular: false,
          bestFor: ['Quick lunch', 'Individual meal', 'Trying new flavors'],
          dimensions: '8 inches diameter',
          slices: '4 slices'
        },
        {
          name: 'Medium',
          size: '12"',
          description: 'Great for sharing',
          servings: '2-3 people',
          price: 18.99,
          image: 'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&w=300',
          popular: true,
          bestFor: ['Date night', 'Small family', 'Lunch sharing'],
          dimensions: '12 inches diameter',
          slices: '8 slices'
        },
        {
          name: 'Large',
          size: '16"',
          description: 'Family favorite',
          servings: '4-5 people',
          price: 24.99,
          image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=300',
          popular: false,
          bestFor: ['Family dinner', 'Group meals', 'Best value'],
          dimensions: '16 inches diameter',
          slices: '12 slices'
        },
        {
          name: 'Family',
          size: '20"',
          description: 'Party size',
          servings: '6-8 people',
          price: 32.99,
          image: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=300',
          popular: false,
          bestFor: ['Parties', 'Large families', 'Events'],
          dimensions: '20 inches diameter',
          slices: '16 slices'
        }
      ]
    },
    burger: {
      title: 'Burger Sizes & Value',
      subtitle: 'From light bites to hearty meals',
      sizes: [
        {
          name: 'Single',
          size: '1/4 lb',
          description: 'Classic single patty',
          servings: '1 person',
          price: 14.99,
          image: 'https://images.pexels.com/photos/1639565/pexels-photo-1639565.jpeg?auto=compress&cs=tinysrgb&w=300',
          popular: true,
          bestFor: ['Regular appetite', 'Balanced meal', 'Most popular'],
          dimensions: '1/4 pound patty',
          extras: 'Standard toppings'
        },
        {
          name: 'Double',
          size: '1/2 lb',
          description: 'Double the satisfaction',
          servings: '1 person',
          price: 19.99,
          image: 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?auto=compress&cs=tinysrgb&w=300',
          popular: false,
          bestFor: ['Big appetite', 'Hearty meal', 'Protein boost'],
          dimensions: '2 x 1/4 pound patties',
          extras: 'Double cheese & toppings'
        },
        {
          name: 'Triple',
          size: '3/4 lb',
          description: 'Ultimate indulgence',
          servings: '1 person',
          price: 24.99,
          image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=300',
          popular: false,
          bestFor: ['Challenge seekers', 'Sharing', 'Maximum protein'],
          dimensions: '3 x 1/4 pound patties',
          extras: 'Triple everything'
        },
        {
          name: 'Slider Pack',
          size: '3 mini',
          description: 'Perfect for sampling',
          servings: '1-2 people',
          price: 16.99,
          image: 'https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg?auto=compress&cs=tinysrgb&w=300',
          popular: false,
          bestFor: ['Variety tasting', 'Light meal', 'Appetizer'],
          dimensions: '3 x 2oz mini patties',
          extras: 'Mix & match flavors'
        }
      ]
    }
  };

  const currentOptions = sizeOptions?.[activeCategory];

  const calculateValuePerServing = (price, servings) => {
    const servingCount = parseInt(servings?.split(' ')?.[0]) || 1;
    return (price / servingCount)?.toFixed(2);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-muted/30 to-background">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-warning/10 border border-warning/30 rounded-full px-4 py-2 mb-4">
            <Icon name="DollarSign" size={16} className="text-warning" />
            <span className="text-warning font-medium text-sm">Value Comparison</span>
          </div>
          
          <h2 className="font-playfair text-4xl lg:text-5xl font-semibold text-text-primary mb-4">
            Every Diet, Every Craving, Every Size
          </h2>
          
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Choose the perfect size for your appetite and budget. Our transparent pricing ensures you get the best value every time.
          </p>
        </div>

        {/* Category Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-card border border-border rounded-lg p-1 inline-flex">
            <button
              onClick={() => setActiveCategory('pizza')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-warm ${
                activeCategory === 'pizza' ?'bg-primary text-primary-foreground shadow-warm-sm' :'text-text-secondary hover:text-primary'
              }`}
            >
              <Icon name="Pizza" size={18} />
              <span>Pizza Sizes</span>
            </button>
            <button
              onClick={() => setActiveCategory('burger')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-warm ${
                activeCategory === 'burger' ?'bg-primary text-primary-foreground shadow-warm-sm' :'text-text-secondary hover:text-primary'
              }`}
            >
              <Icon name="Beef" size={18} />
              <span>Burger Sizes</span>
            </button>
          </div>
        </div>

        {/* Category Title */}
        <div className="text-center mb-8">
          <h3 className="font-playfair text-3xl font-semibold text-text-primary mb-2">
            {currentOptions?.title}
          </h3>
          <p className="text-lg text-text-secondary">
            {currentOptions?.subtitle}
          </p>
        </div>

        {/* Size Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {currentOptions?.sizes?.map((size, index) => (
            <div key={index} className="bg-card border border-border rounded-xl overflow-hidden shadow-warm hover:shadow-warm-lg transition-warm group">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={size?.image}
                  alt={`${size?.name} ${activeCategory}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-warm"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {size?.popular && (
                    <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}
                </div>

                {/* Size Badge */}
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-white text-sm font-medium">{size?.size}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-text-primary text-lg">{size?.name}</h4>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">${size?.price}</div>
                    <div className="text-xs text-text-secondary">
                      ${calculateValuePerServing(size?.price, size?.servings)}/person
                    </div>
                  </div>
                </div>

                <p className="text-sm text-text-secondary mb-3">{size?.description}</p>

                {/* Size Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Serves:</span>
                    <span className="font-medium text-text-primary">{size?.servings}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Size:</span>
                    <span className="font-medium text-text-primary">{size?.dimensions}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">
                      {activeCategory === 'pizza' ? 'Slices:' : 'Includes:'}
                    </span>
                    <span className="font-medium text-text-primary">
                      {activeCategory === 'pizza' ? size?.slices : size?.extras}
                    </span>
                  </div>
                </div>

                {/* Best For */}
                <div className="mb-4">
                  <h5 className="text-xs font-medium text-text-secondary mb-2 uppercase tracking-wide">
                    Best For:
                  </h5>
                  <div className="flex flex-wrap gap-1">
                    {size?.bestFor?.slice(0, 2)?.map((use, i) => (
                      <span key={i} className="text-xs bg-muted text-text-secondary px-2 py-1 rounded-full">
                        {use}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Button variant="default" size="sm" fullWidth>
                  Order {size?.name}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Value Proposition */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-8 mb-8">
          <div className="text-center">
            <Icon name="TrendingUp" size={32} className="text-primary mx-auto mb-4" />
            <h3 className="font-playfair text-2xl font-semibold text-text-primary mb-3">
              Best Value Guarantee
            </h3>
            <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
              Our transparent pricing ensures you always get the best value. Larger sizes offer better per-serving rates, 
              and all sizes include the same premium ingredients and customization options.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Icon name="Shield" size={24} className="text-success mx-auto mb-2" />
                <h4 className="font-medium text-text-primary mb-1">Same Quality</h4>
                <p className="text-sm text-text-secondary">Premium ingredients in every size</p>
              </div>
              <div className="text-center">
                <Icon name="Settings" size={24} className="text-primary mx-auto mb-2" />
                <h4 className="font-medium text-text-primary mb-1">Full Customization</h4>
                <p className="text-sm text-text-secondary">All dietary options available</p>
              </div>
              <div className="text-center">
                <Icon name="DollarSign" size={24} className="text-warning mx-auto mb-2" />
                <h4 className="font-medium text-text-primary mb-1">Better Value</h4>
                <p className="text-sm text-text-secondary">Larger sizes = lower per-serving cost</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/build-your-own">
              <Button variant="default" size="lg" iconName="ChefHat" iconPosition="left">
                Build Your Own
              </Button>
            </Link>
            <Link to={activeCategory === 'pizza' ? '/pizza-menu' : '/burger-menu'}>
              <Button variant="outline" size="lg" iconName="Eye" iconPosition="left">
                View Full Menu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SizeValueSection;