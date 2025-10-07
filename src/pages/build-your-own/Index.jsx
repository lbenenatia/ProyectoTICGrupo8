import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import ProductTypeSelector from './components/ProductTypeSelector';
import SizeSelector from './components/SizeSelector';
import DietaryFilters from './components/DietaryFilters';
import IngredientSelector from './components/IngredientSelector';
import CreationPreview from './components/CreationPreview';
import OrderSummary from './components/OrderSummary';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const BuildYourOwn = () => {
  const [selectedType, setSelectedType] = useState('pizza');
  const [selectedSize, setSelectedSize] = useState('medium');
  const [dietaryFilters, setDietaryFilters] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState({
    base: ['thin-crust'],
    sauce: ['tomato'],
    cheese: ['mozzarella'],
    toppings: [],
    patty: ['beef']
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [nutritionalInfo, setNutritionalInfo] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });

  // Calculate price based on selections
  useEffect(() => {
    const calculatePrice = () => {
      const basePrice = selectedType === 'pizza' ? 12.99 : 9.99;
      
      const sizeMultipliers = {
        pizza: { small: 1, medium: 1.4, large: 1.8, xlarge: 2.2 },
        burger: { single: 1, double: 1.6, triple: 2.2 }
      };
      
      const multiplier = sizeMultipliers?.[selectedType]?.[selectedSize] || 1;
      
      const ingredientPrices = {
        // Pizza ingredients
        'thick-crust': 1.50, 'gluten-free': 3.00, 'cauliflower': 4.00,
        'white': 1.00, 'pesto': 1.50, 'bbq': 1.00,
        'cheddar': 1.00, 'vegan-cheese': 2.50, 'goat-cheese': 2.00,
        'pepperoni': 2.00, 'mushrooms': 1.50, 'bell-peppers': 1.50, 'olives': 1.50, 'chicken': 3.00, 'bacon': 2.50,
        // Burger ingredients
        'whole-wheat': 1.00, 'gluten-free-bun': 2.50, 'lettuce-wrap': 1.50,
        'turkey': 1.50, 'plant-based': 3.00, 'black-bean': 2.50,
        'american': 0.50, 'swiss': 1.00, 'vegan-cheese-slice': 1.50, 'blue-cheese': 1.50,
        'lettuce': 0.50, 'tomato': 0.50, 'onion': 0.50, 'pickles': 0.50, 'bacon-burger': 2.00, 'avocado': 2.50
      };
      
      let extrasTotal = 0;
      Object.values(selectedIngredients)?.flat()?.forEach(ingredientId => {
        extrasTotal += ingredientPrices?.[ingredientId] || 0;
      });
      
      const finalPrice = (basePrice * multiplier) + extrasTotal;
      setTotalPrice(finalPrice);
    };

    calculatePrice();
  }, [selectedType, selectedSize, selectedIngredients]);

  // Calculate nutritional information
  useEffect(() => {
    const calculateNutrition = () => {
      const baseNutrition = {
        pizza: { calories: 250, protein: 12, carbs: 30, fat: 10 },
        burger: { calories: 300, protein: 20, carbs: 25, fat: 15 }
      };
      
      const sizeMultipliers = {
        pizza: { small: 0.8, medium: 1, large: 1.3, xlarge: 1.6 },
        burger: { single: 1, double: 1.6, triple: 2.2 }
      };
      
      const multiplier = sizeMultipliers?.[selectedType]?.[selectedSize] || 1;
      const base = baseNutrition?.[selectedType];
      
      // Add ingredient nutritional values
      const ingredientNutrition = {
        'pepperoni': { calories: 80, protein: 4, carbs: 0, fat: 7 },
        'chicken': { calories: 60, protein: 12, carbs: 0, fat: 2 },
        'bacon': { calories: 90, protein: 6, carbs: 0, fat: 8 },
        'avocado': { calories: 50, protein: 1, carbs: 3, fat: 5 },
        'cheese': { calories: 40, protein: 3, carbs: 1, fat: 3 }
      };
      
      let totalNutrition = {
        calories: Math.round(base?.calories * multiplier),
        protein: Math.round(base?.protein * multiplier),
        carbs: Math.round(base?.carbs * multiplier),
        fat: Math.round(base?.fat * multiplier)
      };
      
      // Add extras from ingredients
      Object.values(selectedIngredients)?.flat()?.forEach(ingredientId => {
        const nutrition = ingredientNutrition?.[ingredientId];
        if (nutrition) {
          totalNutrition.calories += nutrition?.calories;
          totalNutrition.protein += nutrition?.protein;
          totalNutrition.carbs += nutrition?.carbs;
          totalNutrition.fat += nutrition?.fat;
        }
      });
      
      setNutritionalInfo(totalNutrition);
    };

    calculateNutrition();
  }, [selectedType, selectedSize, selectedIngredients]);

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setSelectedSize(type === 'pizza' ? 'medium' : 'single');
    
    // Reset ingredients based on type
    if (type === 'pizza') {
      setSelectedIngredients({
        base: ['thin-crust'],
        sauce: ['tomato'],
        cheese: ['mozzarella'],
        toppings: []
      });
    } else {
      setSelectedIngredients({
        base: ['brioche'],
        patty: ['beef'],
        cheese: ['american'],
        toppings: []
      });
    }
  };

  const handleIngredientChange = (category, ingredients) => {
    setSelectedIngredients(prev => ({
      ...prev,
      [category]: ingredients
    }));
  };

  const handleAddToCart = () => {
    // Mock add to cart functionality
    alert(`Added custom ${selectedType} to cart for $${totalPrice?.toFixed(2)}!`);
  };

  const handleSaveRecipe = () => {
    // Mock save recipe functionality
    alert('Recipe saved to your favorites!');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-playfair font-semibold text-text-primary mb-4">
              Build Your Own Creation
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Unleash your creativity! Design the perfect pizza or burger with our interactive builder. 
              Every ingredient, every size, exactly your way.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4 bg-card rounded-full px-6 py-3 shadow-warm-sm">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="Check" size={16} className="text-primary-foreground" />
                </div>
                <span className="text-sm font-medium text-text-primary">Type</span>
              </div>
              <Icon name="ChevronRight" size={16} className="text-text-secondary" />
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  selectedSize ? 'bg-primary' : 'bg-muted'
                }`}>
                  <Icon name="Check" size={16} className={selectedSize ? 'text-primary-foreground' : 'text-text-secondary'} />
                </div>
                <span className="text-sm font-medium text-text-primary">Size</span>
              </div>
              <Icon name="ChevronRight" size={16} className="text-text-secondary" />
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  Object.values(selectedIngredients)?.some(arr => arr?.length > 0) ? 'bg-primary' : 'bg-muted'
                }`}>
                  <Icon name="Check" size={16} className={
                    Object.values(selectedIngredients)?.some(arr => arr?.length > 0) ? 'text-primary-foreground' : 'text-text-secondary'
                  } />
                </div>
                <span className="text-sm font-medium text-text-primary">Build</span>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Configuration */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Type Selection */}
              <ProductTypeSelector 
                selectedType={selectedType}
                onTypeChange={handleTypeChange}
              />

              {/* Size Selection */}
              <SizeSelector
                selectedSize={selectedSize}
                onSizeChange={setSelectedSize}
                productType={selectedType}
              />

              {/* Dietary Filters */}
              <DietaryFilters
                selectedFilters={dietaryFilters}
                onFilterChange={setDietaryFilters}
              />

              {/* Ingredient Selection */}
              <IngredientSelector
                selectedIngredients={selectedIngredients}
                onIngredientChange={handleIngredientChange}
                productType={selectedType}
                dietaryFilters={dietaryFilters}
              />

              {/* Creation Preview for Mobile */}
              <div className="lg:hidden">
                <CreationPreview
                  productType={selectedType}
                  selectedSize={selectedSize}
                  selectedIngredients={selectedIngredients}
                />
              </div>
            </div>

            {/* Right Column - Preview & Summary */}
            <div className="space-y-6">
              {/* Creation Preview for Desktop */}
              <div className="hidden lg:block">
                <CreationPreview
                  productType={selectedType}
                  selectedSize={selectedSize}
                  selectedIngredients={selectedIngredients}
                />
              </div>

              {/* Order Summary */}
              <OrderSummary
                productType={selectedType}
                selectedSize={selectedSize}
                selectedIngredients={selectedIngredients}
                totalPrice={totalPrice}
                nutritionalInfo={nutritionalInfo}
                onAddToCart={handleAddToCart}
                onSaveRecipe={handleSaveRecipe}
              />
            </div>
          </div>

          {/* Community Section */}
          <div className="mt-16 bg-card rounded-lg p-8 shadow-warm">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">Join the Creative Community</h2>
              <p className="text-text-secondary">
                Share your creations, discover new combinations, and compete in monthly challenges!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Users" size={32} className="text-primary" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">Share & Discover</h3>
                <p className="text-sm text-text-secondary">
                  Share your custom recipes and discover amazing combinations from other food creators
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Trophy" size={32} className="text-accent" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">Monthly Challenges</h3>
                <p className="text-sm text-text-secondary">
                  Compete in themed creation challenges and win exclusive rewards and recognition
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Star" size={32} className="text-success" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">Earn Rewards</h3>
                <p className="text-sm text-text-secondary">
                  Get points for popular recipes and unlock special ingredients and discounts
                </p>
              </div>
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" iconName="ArrowRight" iconPosition="right">
                Explore Community Creations
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BuildYourOwn;