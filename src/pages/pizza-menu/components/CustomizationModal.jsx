import React, { useState, useEffect } from 'react';

import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const CustomizationModal = ({ pizza, isOpen, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState('medium');
  const [selectedCrust, setSelectedCrust] = useState('traditional');
  const [selectedSauce, setSelectedSauce] = useState('marinara');
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const sizeOptions = [
    { id: 'small', name: 'Small', diameter: '10"', slices: 6, multiplier: 0.8, serves: '1-2 people' },
    { id: 'medium', name: 'Medium', diameter: '12"', slices: 8, multiplier: 1, serves: '2-3 people' },
    { id: 'large', name: 'Large', diameter: '14"', slices: 10, multiplier: 1.4, serves: '3-4 people' },
    { id: 'xlarge', name: 'X-Large', diameter: '16"', slices: 12, multiplier: 1.8, serves: '4-6 people' }
  ];

  const crustOptions = [
    { id: 'traditional', name: 'Traditional Hand-Tossed', price: 0, description: 'Classic crispy outside, chewy inside' },
    { id: 'thin', name: 'Thin & Crispy', price: 0, description: 'Light and crispy throughout' },
    { id: 'thick', name: 'Thick Crust', price: 2, description: 'Hearty and filling' },
    { id: 'gluten-free', name: 'Gluten-Free', price: 4, description: 'Made with rice flour blend' },
    { id: 'cauliflower', name: 'Cauliflower Crust', price: 5, description: 'Low-carb, keto-friendly' }
  ];

  const sauceOptions = [
    { id: 'marinara', name: 'Classic Marinara', price: 0, description: 'Traditional tomato sauce' },
    { id: 'white', name: 'Garlic White Sauce', price: 1, description: 'Creamy garlic and herb base' },
    { id: 'bbq', name: 'BBQ Sauce', price: 1, description: 'Sweet and tangy barbecue' },
    { id: 'pesto', name: 'Basil Pesto', price: 2, description: 'Fresh basil and pine nuts' },
    { id: 'buffalo', name: 'Buffalo Sauce', price: 1, description: 'Spicy buffalo wing sauce' },
    { id: 'none', name: 'No Sauce', price: 0, description: 'Just cheese and toppings' }
  ];

  const toppingCategories = [
    {
      name: 'Meats',
      items: [
        { id: 'pepperoni', name: 'Pepperoni', price: 2.5, dietary: [] },
        { id: 'sausage', name: 'Italian Sausage', price: 2.5, dietary: [] },
        { id: 'chicken', name: 'Grilled Chicken', price: 3, dietary: [] },
        { id: 'bacon', name: 'Bacon', price: 3, dietary: [] },
        { id: 'ham', name: 'Ham', price: 2.5, dietary: [] },
        { id: 'plant-protein', name: 'Plant-Based Protein', price: 3.5, dietary: ['vegan'] }
      ]
    },
    {
      name: 'Vegetables',
      items: [
        { id: 'mushrooms', name: 'Mushrooms', price: 1.5, dietary: ['vegetarian', 'vegan'] },
        { id: 'bell-peppers', name: 'Bell Peppers', price: 1.5, dietary: ['vegetarian', 'vegan'] },
        { id: 'onions', name: 'Red Onions', price: 1, dietary: ['vegetarian', 'vegan'] },
        { id: 'olives', name: 'Black Olives', price: 1.5, dietary: ['vegetarian', 'vegan'] },
        { id: 'tomatoes', name: 'Fresh Tomatoes', price: 1.5, dietary: ['vegetarian', 'vegan'] },
        { id: 'spinach', name: 'Fresh Spinach', price: 2, dietary: ['vegetarian', 'vegan'] },
        { id: 'jalapenos', name: 'Jalapeños', price: 1, dietary: ['vegetarian', 'vegan'] },
        { id: 'pineapple', name: 'Pineapple', price: 2, dietary: ['vegetarian', 'vegan'] }
      ]
    },
    {
      name: 'Cheeses',
      items: [
        { id: 'extra-mozzarella', name: 'Extra Mozzarella', price: 2, dietary: ['vegetarian'] },
        { id: 'cheddar', name: 'Cheddar', price: 2, dietary: ['vegetarian'] },
        { id: 'parmesan', name: 'Parmesan', price: 2.5, dietary: ['vegetarian'] },
        { id: 'goat-cheese', name: 'Goat Cheese', price: 3, dietary: ['vegetarian'] },
        { id: 'feta', name: 'Feta', price: 2.5, dietary: ['vegetarian'] },
        { id: 'vegan-cheese', name: 'Vegan Cheese', price: 3, dietary: ['vegan'] }
      ]
    }
  ];

  useEffect(() => {
    if (isOpen && pizza) {
      // Reset customization when modal opens
      setSelectedSize('medium');
      setSelectedCrust('traditional');
      setSelectedSauce('marinara');
      setSelectedToppings([]);
      setQuantity(1);
    }
  }, [isOpen, pizza]);

  if (!isOpen || !pizza) return null;

  const calculatePrice = () => {
    const sizeMultiplier = sizeOptions?.find(s => s?.id === selectedSize)?.multiplier || 1;
    const basePrice = pizza?.basePrice * sizeMultiplier;
    
    const crustPrice = crustOptions?.find(c => c?.id === selectedCrust)?.price || 0;
    const saucePrice = sauceOptions?.find(s => s?.id === selectedSauce)?.price || 0;
    
    const toppingsPrice = selectedToppings?.reduce((total, toppingId) => {
      const topping = toppingCategories?.flatMap(cat => cat?.items)?.find(item => item?.id === toppingId);
      return total + (topping?.price || 0);
    }, 0);

    return ((basePrice + crustPrice + saucePrice + toppingsPrice) * quantity)?.toFixed(2);
  };

  const calculateNutrition = () => {
    const sizeMultiplier = sizeOptions?.find(s => s?.id === selectedSize)?.multiplier || 1;
    const baseCalories = pizza?.nutrition?.calories * sizeMultiplier;
    const toppingsCalories = selectedToppings?.length * 50; // Approximate calories per topping
    
    return {
      calories: Math.round(baseCalories + toppingsCalories),
      protein: Math.round(pizza?.nutrition?.protein * sizeMultiplier + selectedToppings?.length * 2),
      carbs: Math.round(pizza?.nutrition?.carbs * sizeMultiplier),
      fat: Math.round(pizza?.nutrition?.fat * sizeMultiplier + selectedToppings?.length * 3)
    };
  };

  const handleToppingToggle = (toppingId) => {
    setSelectedToppings(prev =>
      prev?.includes(toppingId)
        ? prev?.filter(id => id !== toppingId)
        : [...prev, toppingId]
    );
  };

  const handleAddToCart = () => {
    const customization = {
      size: selectedSize,
      crust: selectedCrust,
      sauce: selectedSauce,
      toppings: selectedToppings,
      quantity,
      price: calculatePrice(),
      nutrition: calculateNutrition()
    };
    
    onAddToCart(pizza, customization);
    onClose();
  };

  const selectedSizeInfo = sizeOptions?.find(s => s?.id === selectedSize);
  const nutrition = calculateNutrition();

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-warm-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Image
              src={pizza?.image}
              alt={pizza?.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold text-text-primary">{pizza?.name}</h2>
              <p className="text-sm text-text-secondary">Customize your perfect pizza</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" iconName="X" onClick={onClose} />
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customization Options */}
            <div className="lg:col-span-2 space-y-6">
              {/* Size Selection */}
              <div>
                <h3 className="text-lg font-medium text-text-primary mb-3">Choose Size</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {sizeOptions?.map(size => (
                    <button
                      key={size?.id}
                      onClick={() => setSelectedSize(size?.id)}
                      className={`p-4 rounded-lg border-2 transition-warm text-center ${
                        selectedSize === size?.id
                          ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="text-sm font-medium text-text-primary">{size?.name}</div>
                      <div className="text-xs text-text-secondary">{size?.diameter}</div>
                      <div className="text-xs text-text-secondary">{size?.slices} slices</div>
                      <div className="text-sm font-medium text-primary mt-1">
                        ${(pizza?.basePrice * size?.multiplier)?.toFixed(2)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Crust Selection */}
              <div>
                <h3 className="text-lg font-medium text-text-primary mb-3">Choose Crust</h3>
                <div className="space-y-2">
                  {crustOptions?.map(crust => (
                    <button
                      key={crust?.id}
                      onClick={() => setSelectedCrust(crust?.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-warm text-left ${
                        selectedCrust === crust?.id
                          ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-text-primary">{crust?.name}</div>
                          <div className="text-sm text-text-secondary">{crust?.description}</div>
                        </div>
                        <div className="text-sm font-medium text-primary">
                          {crust?.price > 0 ? `+$${crust?.price}` : 'Free'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sauce Selection */}
              <div>
                <h3 className="text-lg font-medium text-text-primary mb-3">Choose Sauce</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {sauceOptions?.map(sauce => (
                    <button
                      key={sauce?.id}
                      onClick={() => setSelectedSauce(sauce?.id)}
                      className={`p-3 rounded-lg border-2 transition-warm text-left ${
                        selectedSauce === sauce?.id
                          ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-text-primary text-sm">{sauce?.name}</div>
                          <div className="text-xs text-text-secondary">{sauce?.description}</div>
                        </div>
                        <div className="text-xs font-medium text-primary">
                          {sauce?.price > 0 ? `+$${sauce?.price}` : 'Free'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toppings Selection */}
              <div>
                <h3 className="text-lg font-medium text-text-primary mb-3">Add Toppings</h3>
                {toppingCategories?.map(category => (
                  <div key={category?.name} className="mb-4">
                    <h4 className="font-medium text-text-primary mb-2">{category?.name}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {category?.items?.map(topping => (
                        <button
                          key={topping?.id}
                          onClick={() => handleToppingToggle(topping?.id)}
                          className={`p-3 rounded-lg border-2 transition-warm text-left ${
                            selectedToppings?.includes(topping?.id)
                              ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-text-primary text-sm">{topping?.name}</div>
                              {topping?.dietary?.length > 0 && (
                                <div className="flex space-x-1 mt-1">
                                  {topping?.dietary?.map(diet => (
                                    <span
                                      key={diet}
                                      className="text-xs px-1 py-0.5 bg-success/10 text-success rounded"
                                    >
                                      {diet}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="text-xs font-medium text-primary">
                              +${topping?.price}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card rounded-lg p-4 shadow-warm">
                <h3 className="font-medium text-text-primary mb-4">Order Summary</h3>
                
                {/* Pizza Details */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Size:</span>
                    <span className="text-text-primary">{selectedSizeInfo?.name} ({selectedSizeInfo?.diameter})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Crust:</span>
                    <span className="text-text-primary">{crustOptions?.find(c => c?.id === selectedCrust)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Sauce:</span>
                    <span className="text-text-primary">{sauceOptions?.find(s => s?.id === selectedSauce)?.name}</span>
                  </div>
                  {selectedToppings?.length > 0 && (
                    <div>
                      <span className="text-text-secondary">Toppings:</span>
                      <div className="mt-1 space-y-1">
                        {selectedToppings?.map(toppingId => {
                          const topping = toppingCategories?.flatMap(cat => cat?.items)?.find(item => item?.id === toppingId);
                          return (
                            <div key={toppingId} className="flex justify-between text-xs">
                              <span className="text-text-primary">• {topping?.name}</span>
                              <span className="text-primary">+${topping?.price}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Nutrition Info */}
                <div className="mb-4 p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium text-text-primary mb-2">Nutrition (total)</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center">
                      <div className="font-medium text-text-primary">{nutrition?.calories}</div>
                      <div className="text-text-secondary">Calories</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-text-primary">{nutrition?.protein}g</div>
                      <div className="text-text-secondary">Protein</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-text-primary">{nutrition?.carbs}g</div>
                      <div className="text-text-secondary">Carbs</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-text-primary">{nutrition?.fat}g</div>
                      <div className="text-text-secondary">Fat</div>
                    </div>
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-text-primary">Quantity</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="xs"
                      iconName="Minus"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    />
                    <span className="w-8 text-center text-text-primary">{quantity}</span>
                    <Button
                      variant="outline"
                      size="xs"
                      iconName="Plus"
                      onClick={() => setQuantity(quantity + 1)}
                    />
                  </div>
                </div>

                {/* Total Price */}
                <div className="border-t border-border pt-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-text-primary">Total</span>
                    <span className="text-xl font-bold text-primary">${calculatePrice()}</span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                  variant="default"
                  fullWidth
                  iconName="ShoppingCart"
                  iconPosition="left"
                  onClick={handleAddToCart}
                >
                  Add to Cart - ${calculatePrice()}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizationModal;