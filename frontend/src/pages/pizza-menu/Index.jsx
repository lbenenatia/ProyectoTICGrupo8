import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import PizzaCard from './components/PizzaCard';
import FilterSidebar from './components/FilterSidebar';
import SearchBar from './components/SearchBar';
import CustomizationModal from './components/CustomizationModal';
import TestimonialSection from './components/TestimonialSection';

const PizzaMenu = () => {
  const [filters, setFilters] = useState({
    dietary: [],
    ingredients: [],
    sizes: [],
    priceRange: [0, 50]
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [cart, setCart] = useState([]);

  // Mock pizza data
  const pizzas = [
    {
      id: 1,
      name: "Classic Margherita",
      description: "Fresh mozzarella, San Marzano tomatoes, fresh basil, and extra virgin olive oil on our signature hand-tossed crust",
      image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop",
      basePrice: 14.99,
      rating: 4.8,
      reviews: 342,
      isPopular: true,
      isNew: false,
      dietary: ["Vegetarian"],
      ingredients: [
        { name: "Mozzarella Cheese", allergens: ["Dairy"], source: "Local Farm" },
        { name: "San Marzano Tomatoes", allergens: [], source: "Italy" },
        { name: "Fresh Basil", allergens: [], source: "Local Herbs" },
        { name: "Extra Virgin Olive Oil", allergens: [], source: "Mediterranean" }
      ],
      nutrition: {
        calories: 280,
        protein: 12,
        carbs: 35,
        fat: 10
      }
    },
    {
      id: 2,
      name: "Gluten-Free Veggie Supreme",
      description: "Cauliflower crust topped with bell peppers, mushrooms, red onions, black olives, and dairy-free cheese",
      image: "https://unsplash.com/es/fotos/una-pizza-encima-de-una-mesa-de-madera-B-vBJzlAWLg",
      basePrice: 18.99,
      rating: 4.9,
      reviews: 187,
      isPopular: false,
      isNew: true,
      dietary: ["Gluten-Free", "Vegan"],
      ingredients: [
        { name: "Cauliflower Crust", allergens: [], source: "House-Made" },
        { name: "Vegan Cheese", allergens: [], source: "Plant-Based" },
        { name: "Bell Peppers", allergens: [], source: "Local Farm" },
        { name: "Mushrooms", allergens: [], source: "Organic" },
        { name: "Red Onions", allergens: [], source: "Local Farm" },
        { name: "Black Olives", allergens: [], source: "Mediterranean" }
      ],
      nutrition: {
        calories: 220,
        protein: 8,
        carbs: 25,
        fat: 8
      }
    },
    {
      id: 3,
      name: "Meat Lovers Keto",
      description: "Cauliflower crust loaded with pepperoni, Italian sausage, bacon, ham, and extra mozzarella - perfect for keto diet",
      image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop",
      basePrice: 21.99,
      rating: 4.7,
      reviews: 256,
      isPopular: true,
      isNew: false,
      dietary: ["Keto", "Gluten-Free"],
      ingredients: [
        { name: "Cauliflower Crust", allergens: [], source: "House-Made" },
        { name: "Pepperoni", allergens: [], source: "Premium Cuts" },
        { name: "Italian Sausage", allergens: [], source: "Local Butcher" },
        { name: "Bacon", allergens: [], source: "Applewood Smoked" },
        { name: "Ham", allergens: [], source: "Honey Glazed" },
        { name: "Mozzarella Cheese", allergens: ["Dairy"], source: "Local Farm" }
      ],
      nutrition: {
        calories: 320,
        protein: 22,
        carbs: 8,
        fat: 24
      }
    },
    {
      id: 4,
      name: "BBQ Chicken Ranch",
      description: "Grilled chicken, red onions, cilantro, and mozzarella on BBQ sauce base with ranch drizzle",
      image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&h=300&fit=crop",
      basePrice: 17.99,
      rating: 4.6,
      reviews: 198,
      isPopular: false,
      isNew: false,
      dietary: [],
      ingredients: [
        { name: "Grilled Chicken", allergens: [], source: "Free-Range" },
        { name: "BBQ Sauce", allergens: [], source: "House-Made" },
        { name: "Red Onions", allergens: [], source: "Local Farm" },
        { name: "Cilantro", allergens: [], source: "Fresh Herbs" },
        { name: "Mozzarella Cheese", allergens: ["Dairy"], source: "Local Farm" },
        { name: "Ranch Dressing", allergens: ["Dairy"], source: "House-Made" }
      ],
      nutrition: {
        calories: 290,
        protein: 18,
        carbs: 28,
        fat: 12
      }
    },
    {
      id: 5,
      name: "Mediterranean Delight",
      description: "Pesto base with goat cheese, sun-dried tomatoes, Kalamata olives, fresh spinach, and pine nuts",
      image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&h=300&fit=crop",
      basePrice: 19.99,
      rating: 4.8,
      reviews: 143,
      isPopular: false,
      isNew: true,
      dietary: ["Vegetarian"],
      ingredients: [
        { name: "Basil Pesto", allergens: ["Nuts"], source: "House-Made" },
        { name: "Goat Cheese", allergens: ["Dairy"], source: "Artisan" },
        { name: "Sun-Dried Tomatoes", allergens: [], source: "Mediterranean" },
        { name: "Kalamata Olives", allergens: [], source: "Greece" },
        { name: "Fresh Spinach", allergens: [], source: "Organic" },
        { name: "Pine Nuts", allergens: ["Nuts"], source: "Mediterranean" }
      ],
      nutrition: {
        calories: 310,
        protein: 14,
        carbs: 32,
        fat: 16
      }
    },
    {
      id: 6,
      name: "Spicy Buffalo Chicken",
      description: "Buffalo sauce base with grilled chicken, red onions, celery, blue cheese crumbles, and mozzarella",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
      basePrice: 18.49,
      rating: 4.5,
      reviews: 221,
      isPopular: true,
      isNew: false,
      dietary: [],
      ingredients: [
        { name: "Buffalo Sauce", allergens: [], source: "House-Made" },
        { name: "Grilled Chicken", allergens: [], source: "Free-Range" },
        { name: "Red Onions", allergens: [], source: "Local Farm" },
        { name: "Celery", allergens: [], source: "Fresh" },
        { name: "Blue Cheese", allergens: ["Dairy"], source: "Artisan" },
        { name: "Mozzarella Cheese", allergens: ["Dairy"], source: "Local Farm" }
      ],
      nutrition: {
        calories: 295,
        protein: 19,
        carbs: 26,
        fat: 14
      }
    },
    {
      id: 7,
      name: "Vegan Paradise",
      description: "Plant-based cheese with roasted vegetables, vegan pepperoni, fresh arugula, and balsamic glaze",
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
      basePrice: 20.99,
      rating: 4.7,
      reviews: 89,
      isPopular: false,
      isNew: true,
      dietary: ["Vegan", "Dairy-Free"],
      ingredients: [
        { name: "Vegan Cheese", allergens: [], source: "Plant-Based" },
        { name: "Roasted Vegetables", allergens: [], source: "Seasonal Mix" },
        { name: "Vegan Pepperoni", allergens: [], source: "Plant-Based" },
        { name: "Fresh Arugula", allergens: [], source: "Organic" },
        { name: "Balsamic Glaze", allergens: [], source: "Aged" }
      ],
      nutrition: {
        calories: 245,
        protein: 10,
        carbs: 30,
        fat: 9
      }
    },
    {
      id: 8,
      name: "Hawaiian Twist",
      description: "Ham, pineapple, jalapeños, red peppers, and mozzarella with a sweet and spicy sauce blend",
      image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop",
      basePrice: 16.99,
      rating: 4.4,
      reviews: 167,
      isPopular: false,
      isNew: false,
      dietary: [],
      ingredients: [
        { name: "Ham", allergens: [], source: "Honey Glazed" },
        { name: "Pineapple", allergens: [], source: "Fresh" },
        { name: "Jalapeños", allergens: [], source: "Fresh" },
        { name: "Red Peppers", allergens: [], source: "Roasted" },
        { name: "Mozzarella Cheese", allergens: ["Dairy"], source: "Local Farm" },
        { name: "Sweet & Spicy Sauce", allergens: [], source: "House-Made" }
      ],
      nutrition: {
        calories: 275,
        protein: 15,
        carbs: 33,
        fat: 11
      }
    }
  ];

  // Filter and search logic
  const filteredPizzas = pizzas?.filter(pizza => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery?.toLowerCase();
      const matchesName = pizza?.name?.toLowerCase()?.includes(query);
      const matchesDescription = pizza?.description?.toLowerCase()?.includes(query);
      const matchesDietary = pizza?.dietary?.some(diet => diet?.toLowerCase()?.includes(query));
      const matchesIngredients = pizza?.ingredients?.some(ing => ing?.name?.toLowerCase()?.includes(query));
      
      if (!matchesName && !matchesDescription && !matchesDietary && !matchesIngredients) {
        return false;
      }
    }

    // Dietary filter
    if (filters?.dietary?.length > 0) {
      const hasDietary = filters?.dietary?.some(diet => {
        const dietMap = {
          'gluten-free': 'Gluten-Free',
          'vegan': 'Vegan',
          'vegetarian': 'Vegetarian',
          'keto': 'Keto',
          'dairy-free': 'Dairy-Free',
          'low-carb': 'Low-Carb'
        };
        return pizza?.dietary?.includes(dietMap?.[diet]);
      });
      if (!hasDietary) return false;
    }

    // Price filter
    if (pizza?.basePrice < filters?.priceRange?.[0] || pizza?.basePrice > filters?.priceRange?.[1]) {
      return false;
    }

    return true;
  });

  // Sort logic
  const sortedPizzas = [...filteredPizzas]?.sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b?.isPopular ? 1 : 0) - (a?.isPopular ? 1 : 0) || b?.reviews - a?.reviews;
      case 'rating':
        return b?.rating - a?.rating;
      case 'price-low':
        return a?.basePrice - b?.basePrice;
      case 'price-high':
        return b?.basePrice - a?.basePrice;
      case 'newest':
        return (b?.isNew ? 1 : 0) - (a?.isNew ? 1 : 0);
      case 'name':
        return a?.name?.localeCompare(b?.name);
      default:
        return 0;
    }
  });

  const handleCustomize = (pizza) => {
    setSelectedPizza(pizza);
    setIsCustomizationOpen(true);
  };

  const handleAddToCart = (pizza, customizationOrSize) => {
    const cartItem = {
      id: Date.now(),
      pizza,
      customization: typeof customizationOrSize === 'string' ? { size: customizationOrSize } : customizationOrSize,
      timestamp: new Date()
    };
    setCart(prev => [...prev, cartItem]);
    
    // Show success message (in a real app, you'd use a toast notification)
    alert(`Added ${pizza?.name} to cart!`);
  };

  const clearFilters = () => {
    setFilters({
      dietary: [],
      ingredients: [],
      sizes: [],
      priceRange: [0, 50]
    });
    setSearchQuery('');
  };

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="pt-16 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Artisan Pizza Menu
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-6">
              Descúbre nuestras pizzas artesanales, hechas con ingredientes de primera calidad,
              personalizables para cada necesidad dietética y preferencia de sabor
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center space-x-2 bg-success/10 text-success px-4 py-2 rounded-full">
                <Icon name="Leaf" size={16} />
                <span className="text-sm font-medium">Gluten-Free Options</span>
              </div>
              <div className="flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-full">
                <Icon name="Heart" size={16} />
                <span className="text-sm font-medium">Vegan Friendly</span>
              </div>
              <div className="flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
                <Icon name="Shield" size={16} />
                <span className="text-sm font-medium">Allergen Safe</span>
              </div>
              <div className="flex items-center space-x-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full">
                <Icon name="Zap" size={16} />
                <span className="text-sm font-medium">Keto Options</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/build-your-own">
                <Button variant="default" size="lg" iconName="Palette" iconPosition="left">
                  Build Your Own Pizza
                </Button>
              </Link>
              <Button variant="outline" size="lg" iconName="Filter" iconPosition="left" onClick={() => setIsFilterOpen(true)} className="lg:hidden">
                Filter Menu
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="relative lg:flex lg:items-start lg:gap-8">
              {/* Filter Sidebar */}
              <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
            isOpen={isFilterOpen}
            onToggle={() => setIsFilterOpen(!isFilterOpen)}
          />

          {/* Main Content Area */}
              <div className="flex-1">
            {/* Search and Sort */}
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSortChange={setSortBy}
              sortBy={sortBy}
              totalResults={sortedPizzas?.length}
            />

            {/* Active Filters Display */}
            {(filters?.dietary?.length > 0 || filters?.ingredients?.length > 0 || searchQuery) && (
              <div className="mb-6 p-4 bg-card rounded-lg shadow-warm-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-text-primary">Active Filters</h3>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <span className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      Search: "{searchQuery}"
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="ml-2 hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <Icon name="X" size={12} />
                      </button>
                    </span>
                  )}
                  {filters?.dietary?.map(diet => (
                    <span key={diet} className="inline-flex items-center bg-success/10 text-success px-3 py-1 rounded-full text-sm">
                      {diet?.charAt(0)?.toUpperCase() + diet?.slice(1)?.replace('-', ' ')}
                      <button 
                        onClick={() => setFilters(prev => ({
                          ...prev,
                          dietary: prev?.dietary?.filter(d => d !== diet)
                        }))}
                        className="ml-2 hover:bg-success/20 rounded-full p-0.5"
                      >
                        <Icon name="X" size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Pizza Grid */}
            {sortedPizzas?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                {sortedPizzas?.map(pizza => (
                  <PizzaCard
                    key={pizza?.id}
                    pizza={pizza}
                    onCustomize={handleCustomize}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Icon name="Search" size={48} className="text-text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-medium text-text-primary mb-2">No pizzas found</h3>
                <p className="text-text-secondary mb-4">
                  Try adjusting your filters or search terms to find more options.
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* Load More Button (for pagination in real app) */}
            {sortedPizzas?.length > 0 && sortedPizzas?.length >= 8 && (
              <div className="text-center mb-12">
                <Button variant="outline" size="lg">
                  Load More Pizzas
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Testimonials Section */}
      <TestimonialSection />
      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            Can't Find Your Perfect Pizza?
          </h2>
          <p className="text-lg text-text-secondary mb-8">
            Use our interactive pizza builder to create your dream combination with 
            complete control over ingredients, dietary preferences, and nutritional goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/build-your-own">
              <Button variant="default" size="lg" iconName="Palette" iconPosition="left">
                Build Your Own Pizza
              </Button>
            </Link>
            <Link to="/order-delivery">
              <Button variant="outline" size="lg" iconName="Truck" iconPosition="left">
                Order & Delivery Info
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Customization Modal */}
      <CustomizationModal
        pizza={selectedPizza}
        isOpen={isCustomizationOpen}
        onClose={() => {
          setIsCustomizationOpen(false);
          setSelectedPizza(null);
        }}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default PizzaMenu;