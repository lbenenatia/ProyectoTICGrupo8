import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const TestimonialSection = () => {
  const [activeTab, setActiveTab] = useState('dietary');

  const testimonialCategories = [
    { id: 'dietary', label: 'Dietary Success', icon: 'Leaf', count: 24 },
    { id: 'safety', label: 'Safety & Trust', icon: 'Shield', count: 18 },
    { id: 'family', label: 'Family Stories', icon: 'Users', count: 32 },
    { id: 'custom', label: 'Custom Creations', icon: 'Palette', count: 15 }
  ];

  const testimonials = {
    dietary: [
      {
        id: 1,
        name: "Sarah Mitchell",
        location: "Portland, OR",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        rating: 5,
        date: "2 weeks ago",
        dietary: "Gluten-Free",
        title: "Finally found my perfect pizza place!",
        content: `As someone with celiac disease, finding a pizza place that takes cross-contamination seriously has been a challenge. PizzaBurger Hub's dedicated gluten-free preparation area and separate tools give me complete confidence. Their cauliflower crust is absolutely delicious - crispy, flavorful, and doesn't fall apart like others I've tried. I can finally enjoy pizza night with my family without worry!`,
        helpful: 47,
        pizzaOrdered: "Margherita with Cauliflower Crust",
        verified: true
      },
      {
        id: 2,
        name: "Marcus Johnson",
        location: "Austin, TX",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        rating: 5,
        date: "1 month ago",
        dietary: "Vegan",
        title: "Best vegan pizza in town!",
        content: `The plant-based protein options here are incredible. The vegan cheese actually melts and tastes amazing - not like cardboard like other places. I love that I can customize everything and see exactly what goes into my pizza. The nutritional information helps me stay on track with my fitness goals too.`,
        helpful: 33,
        pizzaOrdered: "Build Your Own with Vegan Cheese & Plant Protein",
        verified: true
      },
      {
        id: 3,
        name: "Jennifer Chen",
        location: "Seattle, WA",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        rating: 5,
        date: "3 weeks ago",
        dietary: "Keto",
        title: "Keto-friendly without compromise",
        content: `Their cauliflower crust is a game-changer for my keto lifestyle. I can load it up with all the meats and cheeses I want, and the nutritional calculator shows me exactly how it fits my macros. It's so nice to not feel restricted when ordering pizza!`,
        helpful: 28,
        pizzaOrdered: "Meat Lovers with Cauliflower Crust",
        verified: true
      }
    ],
    safety: [
      {
        id: 4,
        name: "David Rodriguez",
        location: "Denver, CO",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        rating: 5,
        date: "1 week ago",
        dietary: "Gluten-Free",
        title: "Exceptional safety protocols",
        content: `I have severe gluten sensitivity, and the staff here really understands cross-contamination. They use separate prep areas, dedicated tools, and even change gloves when handling my order. The manager personally checked with me about my dietary needs. This level of care is rare in the food industry.`,
        helpful: 52,
        pizzaOrdered: "Custom Gluten-Free Veggie Pizza",
        verified: true
      },
      {
        id: 5,
        name: "Lisa Thompson",
        location: "Phoenix, AZ",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
        rating: 5,
        date: "2 weeks ago",
        dietary: "Multiple Allergies",
        title: "Allergy-conscious and transparent",
        content: `With my daughter's multiple food allergies (dairy, nuts, eggs), eating out is usually stressful. The ingredient transparency here is amazing - every single ingredient is listed with allergen information. The staff is knowledgeable and takes allergies seriously. We finally have a safe place for family pizza night!`,
        helpful: 41,
        pizzaOrdered: "Allergy-Safe Custom Pizza",
        verified: true
      }
    ],
    family: [
      {
        id: 6,
        name: "The Williams Family",
        location: "Nashville, TN",
        avatar: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=150&h=150&fit=crop&crop=face",
        rating: 5,
        date: "1 month ago",
        dietary: "Mixed Dietary Needs",
        title: "One order, everyone happy!",
        content: `With a gluten-free daughter, vegan son, and keto husband, family pizza night used to be impossible. Now we can order multiple pizzas with different crusts and toppings all in one order. The family meal deals make it affordable too. Everyone gets exactly what they want and need!`,
        helpful: 67,
        pizzaOrdered: "Family Pack - 3 Different Dietary Pizzas",
        verified: true
      },
      {
        id: 7,
        name: "Amanda Foster",
        location: "Chicago, IL",
        avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
        rating: 5,
        date: "3 weeks ago",
        dietary: "Family Preferences",
        title: "Teaching kids about healthy choices",
        content: `I love that my kids can see the nutritional information as we build their pizzas together. It's become a fun way to teach them about balanced eating while still enjoying their favorite food. The veggie options are so fresh and colorful that even my picky eater asks for extra vegetables!`,
        helpful: 35,
        pizzaOrdered: "Kids\' Custom Veggie Pizzas",
        verified: true
      }
    ],
    custom: [
      {
        id: 8,
        name: "Chef Roberto Martinez",
        location: "San Francisco, CA",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
        rating: 5,
        date: "2 weeks ago",
        dietary: "Creative Foodie",
        title: "Endless creative possibilities",
        content: `As a professional chef, I appreciate the quality of ingredients and the freedom to create unique combinations. My 'Mediterranean Fusion' pizza with pesto base, goat cheese, sun-dried tomatoes, and fresh spinach has become so popular that other customers ask for the recipe. The build-your-own tool makes experimentation fun!`,
        helpful: 89,
        pizzaOrdered: "Custom Mediterranean Fusion Creation",
        verified: true
      },
      {
        id: 9,
        name: "College Food Club",
        location: "Boulder, CO",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face",
        rating: 5,
        date: "1 week ago",
        dietary: "Student Budget",
        title: "Weekly pizza creation challenges",
        content: `Our food club has weekly challenges to create the most unique pizza combinations. The customization options are incredible, and we love sharing our creations on social media. Last week's winning combo was BBQ sauce, chicken, pineapple, jalapeños, and goat cheese - sounds weird but tastes amazing!`,
        helpful: 23,
        pizzaOrdered: "Weekly Challenge Creations",
        verified: true
      }
    ]
  };

  const activeTestimonials = testimonials?.[activeTab] || [];

  const getDietaryBadgeColor = (dietary) => {
    const colors = {
      'Gluten-Free': 'bg-success/10 text-success',
      'Vegan': 'bg-accent/10 text-accent',
      'Keto': 'bg-primary/10 text-primary',
      'Multiple Allergies': 'bg-warning/10 text-warning',
      'Mixed Dietary Needs': 'bg-secondary/10 text-secondary',
      'Family Preferences': 'bg-muted text-text-secondary',
      'Creative Foodie': 'bg-primary/10 text-primary',
      'Student Budget': 'bg-accent/10 text-accent'
    };
    return colors?.[dietary] || 'bg-muted text-text-secondary';
  };

  return (
    <section className="py-16 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            Real Stories from Our Community
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Discover how PizzaBurger Hub has transformed pizza experiences for customers with diverse dietary needs, 
            safety concerns, and creative appetites.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {testimonialCategories?.map(category => (
            <button
              key={category?.id}
              onClick={() => setActiveTab(category?.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-warm ${
                activeTab === category?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-text-secondary hover:bg-primary/10 hover:text-primary'
              }`}
            >
              <Icon name={category?.icon} size={16} />
              <span>{category?.label}</span>
              <span className="bg-black/10 text-xs px-2 py-0.5 rounded-full">
                {category?.count}
              </span>
            </button>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTestimonials?.map(testimonial => (
            <div key={testimonial?.id} className="bg-background rounded-lg shadow-warm p-6 hover:shadow-warm-lg transition-warm">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Image
                    src={testimonial?.avatar}
                    alt={testimonial?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-text-primary">{testimonial?.name}</h4>
                      {testimonial?.verified && (
                        <Icon name="CheckCircle" size={16} className="text-success" />
                      )}
                    </div>
                    <p className="text-sm text-text-secondary">{testimonial?.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    {[...Array(testimonial?.rating)]?.map((_, i) => (
                      <Icon key={i} name="Star" size={14} className="text-accent fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-text-secondary">{testimonial?.date}</p>
                </div>
              </div>

              {/* Dietary Badge */}
              <div className="mb-3">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDietaryBadgeColor(testimonial?.dietary)}`}>
                  {testimonial?.dietary}
                </span>
              </div>

              {/* Title */}
              <h5 className="font-semibold text-text-primary mb-3">{testimonial?.title}</h5>

              {/* Content */}
              <p className="text-sm text-text-secondary mb-4 line-clamp-4">{testimonial?.content}</p>

              {/* Pizza Ordered */}
              <div className="mb-4 p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <Icon name="Pizza" size={14} className="text-primary" />
                  <span className="text-xs font-medium text-text-secondary">ORDERED</span>
                </div>
                <p className="text-sm text-text-primary">{testimonial?.pizzaOrdered}</p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <button className="flex items-center space-x-1 text-sm text-text-secondary hover:text-primary transition-warm">
                  <Icon name="ThumbsUp" size={14} />
                  <span>Helpful ({testimonial?.helpful})</span>
                </button>
                <Button variant="ghost" size="xs" iconName="Share2">
                  Share
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-background rounded-lg p-8 shadow-warm">
            <h3 className="text-xl font-semibold text-text-primary mb-4">
              Share Your PizzaBurger Hub Story
            </h3>
            <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
              Have you found your perfect pizza combination or discovered how our dietary options 
              have made a difference? We'd love to hear from you!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="default" iconName="MessageSquare" iconPosition="left">
                Write a Review
              </Button>
              <Button variant="outline" iconName="Camera" iconPosition="left">
                Share Your Creation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;