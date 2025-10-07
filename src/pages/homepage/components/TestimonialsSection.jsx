import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TestimonialsSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Gluten-Free Food Blogger',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 5,
      dietary: 'Gluten-Free',
      content: `Finally found a place that takes gluten-free seriously! Their cauliflower crust pizza is incredible, and I love that they have dedicated prep areas to prevent cross-contamination. My family can all eat together without worry.`,
      order: 'Mediterranean Delight Pizza (Gluten-Free)',
      location: 'Downtown Location',
      verified: true
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      role: 'Fitness Enthusiast',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 5,
      dietary: 'Keto',
      content: `The keto options here are game-changing! I can stick to my macros while enjoying amazing burgers with lettuce wraps. The nutritional calculator in their app helps me track everything perfectly. Best cheat meal that's not actually cheating!`,order: 'Double Bacon Burger (Lettuce Wrap)',location: 'Westside Location',
      verified: true
    },
    {
      id: 3,
      name: 'Emily Johnson',role: 'Working Mom of 3',avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',rating: 5,dietary: 'Family Mixed Diets',
      content: `This place is a lifesaver for our family! My daughter is vegan, my son loves meat, and my husband is gluten-free. We can all order exactly what we want in one place. The build-your-own feature makes everyone happy.`,
      order: 'Family Pack - Mixed Dietary Options',location: 'Suburban Location',
      verified: true
    },
    {
      id: 4,
      name: 'David Park',role: 'Plant-Based Chef',avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',rating: 5,dietary: 'Vegan',content: `As a professional chef, I'm impressed by their plant-based options. The Beyond patties are cooked perfectly, and their vegan cheese actually melts and tastes amazing. The ingredient sourcing is top-notch - you can taste the quality.`,
      order: 'Plant-Based Champion Burger',
      location: 'City Center Location',
      verified: true
    }
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials?.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials?.length) % testimonials?.length);
  };

  const getDietaryColor = (dietary) => {
    if (dietary?.includes('Gluten-Free') || dietary?.includes('Vegan')) return 'text-success bg-success/10 border-success/30';
    if (dietary?.includes('Keto')) return 'text-warning bg-warning/10 border-warning/30';
    return 'text-primary bg-primary/10 border-primary/30';
  };

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-success/10 border border-success/30 rounded-full px-4 py-2 mb-4">
            <Icon name="Heart" size={16} className="text-success" />
            <span className="text-success font-medium text-sm">Customer Success Stories</span>
          </div>
          
          <h2 className="font-playfair text-4xl lg:text-5xl font-semibold text-text-primary mb-4">
            Dietary Dreams Come True
          </h2>
          
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Real stories from customers who found their perfect meal, regardless of dietary needs or preferences
          </p>
        </div>

        {/* Main Testimonial Display */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-2xl shadow-warm-lg overflow-hidden">
            <div className="p-8 lg:p-12">
              {/* Customer Info */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  <Image
                    src={testimonials?.[activeTestimonial]?.avatar}
                    alt={testimonials?.[activeTestimonial]?.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  {testimonials?.[activeTestimonial]?.verified && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center">
                      <Icon name="Check" size={12} className="text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary text-lg">
                    {testimonials?.[activeTestimonial]?.name}
                  </h3>
                  <p className="text-text-secondary text-sm">
                    {testimonials?.[activeTestimonial]?.role}
                  </p>
                  
                  <div className="flex items-center space-x-3 mt-2">
                    {/* Rating */}
                    <div className="flex items-center space-x-1">
                      {[...Array(testimonials?.[activeTestimonial]?.rating)]?.map((_, i) => (
                        <Icon key={i} name="Star" size={14} className="text-accent fill-current" />
                      ))}
                    </div>
                    
                    {/* Dietary Badge */}
                    <span className={`text-xs px-2 py-1 rounded-full border ${getDietaryColor(testimonials?.[activeTestimonial]?.dietary)}`}>
                      {testimonials?.[activeTestimonial]?.dietary}
                    </span>
                  </div>
                </div>
              </div>

              {/* Testimonial Content */}
              <blockquote className="text-lg text-text-primary leading-relaxed mb-6 italic">
                "{testimonials?.[activeTestimonial]?.content}"
              </blockquote>

              {/* Order Details */}
              <div className="bg-muted rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Icon name="ShoppingBag" size={16} className="text-primary" />
                    <span className="font-medium text-text-primary">Recent Order:</span>
                    <span className="text-text-secondary">{testimonials?.[activeTestimonial]?.order}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="MapPin" size={16} className="text-text-secondary" />
                    <span className="text-text-secondary">{testimonials?.[activeTestimonial]?.location}</span>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={prevTestimonial}
                  className="flex items-center space-x-2 text-text-secondary hover:text-primary transition-warm"
                >
                  <Icon name="ChevronLeft" size={20} />
                  <span className="text-sm">Previous</span>
                </button>

                {/* Dots Indicator */}
                <div className="flex space-x-2">
                  {testimonials?.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-warm ${
                        index === activeTestimonial ? 'bg-primary' : 'bg-border'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextTestimonial}
                  className="flex items-center space-x-2 text-text-secondary hover:text-primary transition-warm"
                >
                  <span className="text-sm">Next</span>
                  <Icon name="ChevronRight" size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">98%</div>
            <div className="text-sm text-text-secondary">Customer Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">15+</div>
            <div className="text-sm text-text-secondary">Dietary Options</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">50K+</div>
            <div className="text-sm text-text-secondary">Custom Creations</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">4.9★</div>
            <div className="text-sm text-text-secondary">Average Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;