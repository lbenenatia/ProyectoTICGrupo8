import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TestimonialSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      dietary: "Gluten-Free",
      rating: 5,
      text: `Finally found a place that takes gluten-free seriously! The dedicated prep area and separate equipment give me complete confidence. The gluten-free bun is actually better than regular ones I've had elsewhere.`,
      burgerOrdered: "Gluten-Free Classic Beef",
      orderDate: "2 weeks ago",
      verified: true
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      dietary: "Keto",
      rating: 5,
      text: `The lettuce wrap option is a game-changer! Full flavor without the carbs. Staff is knowledgeable about keto requirements and helped me customize perfectly. This is my new go-to spot.`,
      burgerOrdered: "Keto Bacon Cheeseburger",
      orderDate: "1 week ago",
      verified: true
    },
    {
      id: 3,
      name: "Emily Johnson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      dietary: "Vegan",
      rating: 5,
      text: `The plant-based patty is incredible - even my meat-loving husband was impressed! Love that they have vegan cheese and mayo options. The customization tool made it easy to build my perfect burger.`,
      burgerOrdered: "Ultimate Plant-Based Deluxe",
      orderDate: "3 days ago",
      verified: true
    },
    {
      id: 4,
      name: "David Park",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      dietary: "Dairy-Free",
      rating: 5,
      text: `As someone with severe dairy allergies, I appreciate the clear ingredient labeling and allergen protocols. The dairy-free cheese melts perfectly and tastes amazing. Safe and delicious!`,
      burgerOrdered: "Dairy-Free BBQ Burger",
      orderDate: "5 days ago",
      verified: true
    }
  ];

  const customCreations = [
    {
      id: 1,
      creator: "Alex Thompson",
      creatorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      burgerName: "The Spicy Garden Crunch",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      rating: 4.8,
      recreateCount: 127,
      description: "Plant-based patty with jalapeños, avocado, crispy onions, and chipotle mayo on a gluten-free bun",
      dietary: ["Gluten-Free", "Vegan"],
      calories: 485
    },
    {
      id: 2,
      creator: "Maria Santos",
      creatorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      burgerName: "Keto Breakfast Beast",
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
      rating: 4.9,
      recreateCount: 89,
      description: "Double beef patty with fried egg, bacon, cheese, and avocado in a lettuce wrap",
      dietary: ["Keto", "Dairy-Free"],
      calories: 620
    },
    {
      id: 3,
      creator: "James Wilson",
      creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      burgerName: "Mediterranean Fusion",
      image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop",
      rating: 4.7,
      recreateCount: 156,
      description: "Turkey patty with feta, sun-dried tomatoes, spinach, and tzatziki on whole grain bun",
      dietary: ["Vegetarian"],
      calories: 520
    }
  ];

  const getDietaryBadgeColor = (type) => {
    const colors = {
      'Gluten-Free': 'bg-success text-success-foreground',
      'Vegan': 'bg-accent text-accent-foreground',
      'Keto': 'bg-secondary text-secondary-foreground',
      'Vegetarian': 'bg-warning text-warning-foreground',
      'Dairy-Free': 'bg-primary text-primary-foreground'
    };
    return colors?.[type] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-8">
      {/* Dietary Success Stories */}
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="Heart" size={24} className="text-primary" />
          <div>
            <h2 className="text-2xl font-semibold text-text-primary">Dietary Success Stories</h2>
            <p className="text-text-secondary">Real customers sharing their perfect burger experiences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Featured Testimonial */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 border border-border shadow-warm">
              <div className="flex items-start space-x-4 mb-4">
                <Image
                  src={testimonials?.[activeTestimonial]?.avatar}
                  alt={testimonials?.[activeTestimonial]?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium text-text-primary">{testimonials?.[activeTestimonial]?.name}</h3>
                    {testimonials?.[activeTestimonial]?.verified && (
                      <Icon name="CheckCircle" size={16} className="text-success" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDietaryBadgeColor(testimonials?.[activeTestimonial]?.dietary)}`}>
                      {testimonials?.[activeTestimonial]?.dietary}
                    </span>
                    <div className="flex items-center space-x-1">
                      {[...Array(testimonials?.[activeTestimonial]?.rating)]?.map((_, i) => (
                        <Icon key={i} name="Star" size={12} className="text-accent fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary mb-3">
                    Ordered: {testimonials?.[activeTestimonial]?.burgerOrdered} • {testimonials?.[activeTestimonial]?.orderDate}
                  </p>
                </div>
              </div>
              <blockquote className="text-text-primary italic">
                "{testimonials?.[activeTestimonial]?.text}"
              </blockquote>
            </div>

            {/* Testimonial Navigation */}
            <div className="flex justify-center space-x-2 mt-4">
              {testimonials?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-quick ${
                    index === activeTestimonial ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* All Testimonials List */}
          <div className="space-y-3">
            {testimonials?.map((testimonial, index) => (
              <button
                key={testimonial?.id}
                onClick={() => setActiveTestimonial(index)}
                className={`w-full text-left p-3 rounded-lg border transition-quick ${
                  index === activeTestimonial
                    ? 'border-primary bg-primary/5' :'border-border bg-card hover:border-primary/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Image
                    src={testimonial?.avatar}
                    alt={testimonial?.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-text-primary text-sm">{testimonial?.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getDietaryBadgeColor(testimonial?.dietary)}`}>
                        {testimonial?.dietary}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary truncate">
                      {testimonial?.text?.substring(0, 60)}...
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial?.rating)]?.map((_, i) => (
                      <Icon key={i} name="Star" size={10} className="text-accent fill-current" />
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Custom Creation Gallery */}
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="Palette" size={24} className="text-primary" />
          <div>
            <h2 className="text-2xl font-semibold text-text-primary">Custom Creation Gallery</h2>
            <p className="text-text-secondary">Unique burgers created by our community</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customCreations?.map((creation) => (
            <div key={creation?.id} className="bg-card rounded-lg overflow-hidden border border-border shadow-warm hover:shadow-warm-lg transition-warm">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={creation?.image}
                  alt={creation?.burgerName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                  <Icon name="Star" size={12} className="text-accent fill-current" />
                  <span className="text-xs font-medium text-text-primary">{creation?.rating}</span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Image
                    src={creation?.creatorAvatar}
                    alt={creation?.creator}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-sm text-text-secondary">by {creation?.creator}</span>
                </div>

                <h3 className="font-semibold text-text-primary mb-2">{creation?.burgerName}</h3>
                <p className="text-sm text-text-secondary mb-3 line-clamp-2">{creation?.description}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {creation?.dietary?.map((diet, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getDietaryBadgeColor(diet)}`}
                    >
                      {diet}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-text-secondary">{creation?.calories} cal</span>
                    <div className="flex items-center space-x-1">
                      <Icon name="Copy" size={12} className="text-primary" />
                      <span className="text-primary">{creation?.recreateCount} recreated</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-border">
                  <button className="w-full bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-quick flex items-center justify-center space-x-2">
                    <Icon name="Copy" size={14} />
                    <span>Recreate This Burger</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;