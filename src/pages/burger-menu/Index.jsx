import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BurgerCard from './components/BurgerCard';
import FilterSidebar from './components/FilterSidebar';
import SizeComparison from './components/SizeComparison';
import TestimonialSection from './components/TestimonialSection';

const BurgerMenu = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    dietary: [],
    protein: [],
    price: [],
    calories: []
  });
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSizeComparisonOpen, setIsSizeComparisonOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Mock burger data
  const burgers = [
    {
      id: 1,
      name: "Classic Beef Burger",
      description: "Juicy beef patty with lettuce, tomato, onion, pickles, and our signature sauce on a toasted bun",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      basePrice: 11.99,
      calories: 580,
      rating: 4.8,
      isPopular: true,
      isNew: false,
      dietaryOptions: [],
      ingredients: ["Beef patty", "Lettuce", "Tomato", "Onion", "Pickles", "Signature sauce", "Sesame bun"],
      allergens: ["Gluten", "Sesame", "Eggs"],
      sourcing: "Grass-fed beef from local farms, organic vegetables, artisanal buns baked fresh daily"
    },
    {
      id: 2,
      name: "Plant-Based Deluxe",
      description: "Beyond Meat patty with avocado, sprouts, vegan cheese, and herb aioli on a whole grain bun",
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
      basePrice: 12.99,
      calories: 480,
      rating: 4.7,
      isPopular: true,
      isNew: false,
      dietaryOptions: ["Vegan", "Dairy-Free"],
      ingredients: ["Plant-based patty", "Avocado", "Sprouts", "Vegan cheese", "Herb aioli", "Whole grain bun"],
      allergens: ["Gluten"],
      sourcing: "Organic plant-based proteins, locally sourced vegetables, house-made vegan cheese"
    },
    {
      id: 3,
      name: "Gluten-Free BBQ Bacon",
      description: "Beef patty with crispy bacon, BBQ sauce, onion rings, and cheddar on a gluten-free bun",
      image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop",
      basePrice: 14.99,
      calories: 650,
      rating: 4.9,
      isPopular: false,
      isNew: true,
      dietaryOptions: ["Gluten-Free"],
      ingredients: ["Beef patty", "Bacon", "BBQ sauce", "Onion rings", "Cheddar cheese", "Gluten-free bun"],
      allergens: ["Dairy"],
      sourcing: "Certified gluten-free facility, premium bacon from heritage pork, aged cheddar"
    },
    {
      id: 4,
      name: "Keto Lettuce Wrap",
      description: "Double beef patty with bacon, cheese, avocado, and mayo wrapped in crisp lettuce",
      image: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=400&h=300&fit=crop",
      basePrice: 13.99,
      calories: 420,
      rating: 4.6,
      isPopular: false,
      isNew: false,
      dietaryOptions: ["Keto", "Gluten-Free"],
      ingredients: ["Double beef patty", "Bacon", "Cheese", "Avocado", "Mayo", "Butter lettuce"],
      allergens: ["Dairy", "Eggs"],
      sourcing: "Grass-fed beef, organic butter lettuce, hormone-free bacon"
    },
    {
      id: 5,
      name: "Spicy Chicken Deluxe",
      description: "Crispy chicken breast with jalapeños, pepper jack cheese, and chipotle mayo",
      image: "https://images.unsplash.com/photo-1606755962773-d324e2d53014?w=400&h=300&fit=crop",
      basePrice: 12.49,
      calories: 590,
      rating: 4.5,
      isPopular: true,
      isNew: false,
      dietaryOptions: [],
      ingredients: ["Chicken breast", "Jalapeños", "Pepper jack cheese", "Chipotle mayo", "Brioche bun"],
      allergens: ["Gluten", "Dairy", "Eggs"],
      sourcing: "Free-range chicken, fresh jalapeños, artisanal pepper jack cheese"
    },
    {
      id: 6,
      name: "Turkey Avocado Club",
      description: "Lean turkey patty with avocado, bacon, swiss cheese, and herb mayo on sourdough",
      image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop",
      basePrice: 13.49,
      calories: 520,
      rating: 4.4,
      isPopular: false,
      isNew: false,
      dietaryOptions: [],
      ingredients: ["Turkey patty", "Avocado", "Bacon", "Swiss cheese", "Herb mayo", "Sourdough bun"],
      allergens: ["Gluten", "Dairy", "Eggs"],
      sourcing: "Organic ground turkey, ripe avocados, artisanal swiss cheese"
    },
    {
      id: 7,
      name: "Mushroom Swiss Veggie",
      description: "Grilled portobello mushroom with swiss cheese, caramelized onions, and garlic aioli",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      basePrice: 11.49,
      calories: 380,
      rating: 4.3,
      isPopular: false,
      isNew: false,
      dietaryOptions: ["Vegetarian"],
      ingredients: ["Portobello mushroom", "Swiss cheese", "Caramelized onions", "Garlic aioli", "Brioche bun"],
      allergens: ["Gluten", "Dairy", "Eggs"],
      sourcing: "Organic portobello mushrooms, locally sourced onions, house-made aioli"
    },
    {
      id: 8,
      name: "Fish & Chips Burger",
      description: "Beer-battered cod fillet with tartar sauce, lettuce, and crispy fries on the side",
      image: "https://images.unsplash.com/photo-1619740455993-a42e0d8c8b8e?w=400&h=300&fit=crop",
      basePrice: 15.99,
      calories: 720,
      rating: 4.2,
      isPopular: false,
      isNew: true,
      dietaryOptions: [],
      ingredients: ["Beer-battered cod", "Tartar sauce", "Lettuce", "Brioche bun", "Side of fries"],
      allergens: ["Gluten", "Fish", "Eggs"],
      sourcing: "Fresh Atlantic cod, house-made beer batter, hand-cut fries"
    }
  ];

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'calories-low', label: 'Calories: Low to High' },
    { value: 'name', label: 'Name A-Z' }
  ];

  // Filter and sort burgers
  const filteredBurgers = burgers?.filter(burger => {
    // Search filter
    if (searchQuery && !burger?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) &&
        !burger?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase()) &&
        !burger?.ingredients?.some(ingredient => ingredient?.toLowerCase()?.includes(searchQuery?.toLowerCase()))) {
      return false;
    }

    // Dietary filters
    if (filters?.dietary?.length > 0) {
      const hasDietaryMatch = filters?.dietary?.some(diet => {
        switch (diet) {
          case 'gluten-free':
            return burger?.dietaryOptions?.includes('Gluten-Free');
          case 'vegan':
            return burger?.dietaryOptions?.includes('Vegan');
          case 'vegetarian':
            return burger?.dietaryOptions?.includes('Vegetarian') || burger?.dietaryOptions?.includes('Vegan');
          case 'keto':
            return burger?.dietaryOptions?.includes('Keto');
          case 'dairy-free':
            return burger?.dietaryOptions?.includes('Dairy-Free') || burger?.dietaryOptions?.includes('Vegan');
          case 'nut-free':
            return !burger?.allergens?.some(allergen => allergen?.toLowerCase()?.includes('nut'));
          default:
            return false;
        }
      });
      if (!hasDietaryMatch) return false;
    }

    // Protein filters
    if (filters?.protein?.length > 0) {
      const hasProteinMatch = filters?.protein?.some(protein => {
        switch (protein) {
          case 'beef':
            return burger?.ingredients?.some(ing => ing?.toLowerCase()?.includes('beef'));
          case 'chicken':
            return burger?.ingredients?.some(ing => ing?.toLowerCase()?.includes('chicken'));
          case 'turkey':
            return burger?.ingredients?.some(ing => ing?.toLowerCase()?.includes('turkey'));
          case 'plant-based':
            return burger?.ingredients?.some(ing => ing?.toLowerCase()?.includes('plant-based')) ||
                   burger?.dietaryOptions?.includes('Vegan');
          case 'fish':
            return burger?.ingredients?.some(ing => ing?.toLowerCase()?.includes('cod') || ing?.toLowerCase()?.includes('fish'));
          default:
            return false;
        }
      });
      if (!hasProteinMatch) return false;
    }

    // Price filters
    if (filters?.price?.length > 0) {
      const hasPriceMatch = filters?.price?.some(priceRange => {
        switch (priceRange) {
          case 'under-10':
            return burger?.basePrice < 10;
          case '10-15':
            return burger?.basePrice >= 10 && burger?.basePrice <= 15;
          case '15-20':
            return burger?.basePrice > 15 && burger?.basePrice <= 20;
          case 'over-20':
            return burger?.basePrice > 20;
          default:
            return false;
        }
      });
      if (!hasPriceMatch) return false;
    }

    // Calorie filters
    if (filters?.calories?.length > 0) {
      const hasCalorieMatch = filters?.calories?.some(calorieRange => {
        switch (calorieRange) {
          case 'under-400':
            return burger?.calories < 400;
          case '400-600':
            return burger?.calories >= 400 && burger?.calories <= 600;
          case '600-800':
            return burger?.calories > 600 && burger?.calories <= 800;
          case 'over-800':
            return burger?.calories > 800;
          default:
            return false;
        }
      });
      if (!hasCalorieMatch) return false;
    }

    return true;
  });

  // Sort burgers
  const sortedBurgers = [...filteredBurgers]?.sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b?.isPopular ? 1 : 0) - (a?.isPopular ? 1 : 0) || b?.rating - a?.rating;
      case 'rating':
        return b?.rating - a?.rating;
      case 'price-low':
        return a?.basePrice - b?.basePrice;
      case 'price-high':
        return b?.basePrice - a?.basePrice;
      case 'calories-low':
        return a?.calories - b?.calories;
      case 'name':
        return a?.name?.localeCompare(b?.name);
      default:
        return 0;
    }
  });

  const handleFilterChange = (category, values) => {
    setFilters(prev => ({
      ...prev,
      [category]: values
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      dietary: [],
      protein: [],
      price: [],
      calories: []
    });
    setSearchQuery('');
  };

  const handleCustomize = (burger, size) => {
    // Navigate to build-your-own with pre-filled burger data
    console.log('Customize burger:', burger, 'Size:', size);
  };

  const handleAddToCart = (burger, size) => {
    const cartItem = {
      id: `${burger?.id}-${size}-${Date.now()}`,
      burger,
      size,
      quantity: 1,
      customizations: []
    };
    setCartItems(prev => [...prev, cartItem]);
    console.log('Added to cart:', cartItem);
  };

  const getActiveFilterCount = () => {
    return Object.values(filters)?.reduce((total, filterArray) => {
      return total + (Array.isArray(filterArray) ? filterArray?.length : 0);
    }, 0);
  };

  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-12">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl lg:text-5xl font-bold text-text-primary mb-4">
                Burger Menu
              </h1>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                Discover our signature burgers crafted with premium ingredients. From classic beef to plant-based delights, 
                every burger is customizable to match your dietary preferences.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant="default"
                onClick={() => setIsSizeComparisonOpen(true)}
                iconName="Ruler"
                iconPosition="left"
              >
                Size Comparison
              </Button>
              <Link to="/build-your-own">
                <Button
                  variant="outline"
                  iconName="ChefHat"
                  iconPosition="left"
                >
                  Build Your Own
                </Button>
              </Link>
              <Button
                variant="outline"
                iconName="Heart"
                iconPosition="left"
              >
                Dietary Guide
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-80 flex-shrink-0">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Search and Controls */}
              <div className="bg-card rounded-lg p-4 mb-6 border border-border shadow-warm-sm">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1">
                    <Input
                      type="search"
                      placeholder="Search burgers, ingredients, or dietary options..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e?.target?.value)}
                      className="w-full"
                    />
                  </div>

                  {/* Sort */}
                  <div className="flex items-center space-x-4">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e?.target?.value)}
                      className="px-3 py-2 border border-border rounded-md bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {sortOptions?.map(option => (
                        <option key={option?.value} value={option?.value}>
                          {option?.label}
                        </option>
                      ))}
                    </select>

                    {/* View Mode */}
                    <div className="flex border border-border rounded-md overflow-hidden">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-background text-text-secondary hover:text-text-primary'}`}
                      >
                        <Icon name="Grid3X3" size={16} />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-background text-text-secondary hover:text-text-primary'}`}
                      >
                        <Icon name="List" size={16} />
                      </button>
                    </div>

                    {/* Mobile Filter Toggle */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsFilterOpen(true)}
                      iconName="Filter"
                      className="lg:hidden"
                    >
                      {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
                    </Button>
                  </div>
                </div>

                {/* Active Filters */}
                {getActiveFilterCount() > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-text-primary">Active Filters:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                        className="text-xs"
                      >
                        Clear All
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(filters)?.map(([category, values]) =>
                        values?.map(value => (
                          <span
                            key={`${category}-${value}`}
                            className="inline-flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                          >
                            <span>{value?.replace('-', ' ')}</span>
                            <button
                              onClick={() => handleFilterChange(category, values?.filter(v => v !== value))}
                              className="hover:text-primary/80"
                            >
                              <Icon name="X" size={12} />
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-text-secondary">
                  Showing {sortedBurgers?.length} of {burgers?.length} burgers
                </p>
                {searchQuery && (
                  <p className="text-sm text-text-secondary">
                    Results for "{searchQuery}"
                  </p>
                )}
              </div>

              {/* Burger Grid/List */}
              {sortedBurgers?.length > 0 ? (
                <div className={`grid gap-6 mb-12 ${
                  viewMode === 'grid' ?'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' :'grid-cols-1'
                }`}>
                  {sortedBurgers?.map(burger => (
                    <BurgerCard
                      key={burger?.id}
                      burger={burger}
                      onCustomize={handleCustomize}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-text-primary mb-2">No burgers found</h3>
                  <p className="text-text-secondary mb-4">
                    Try adjusting your filters or search terms to find the perfect burger.
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}

              {/* Testimonials Section */}
              <TestimonialSection />
            </div>
          </div>
        </div>

        {/* Size Comparison Modal */}
        <SizeComparison
          isOpen={isSizeComparisonOpen}
          onClose={() => setIsSizeComparisonOpen(false)}
        />

        {/* Cart Summary (if items exist) */}
        {cartItems?.length > 0 && (
          <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground rounded-lg p-4 shadow-warm-lg">
            <div className="flex items-center space-x-3">
              <Icon name="ShoppingCart" size={20} />
              <div>
                <p className="font-medium">{cartItems?.length} items in cart</p>
                <p className="text-sm opacity-90">
                  ${cartItems?.reduce((total, item) => total + item?.burger?.basePrice, 0)?.toFixed(2)}
                </p>
              </div>
              <Link to="/order-delivery">
                <Button variant="secondary" size="sm">
                  View Cart
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BurgerMenu;