import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import ProductTypeSelector from './components/ProductTypeSelector';
import SizeSelector from './components/SizeSelector';
import IngredientSelector from './components/IngredientSelector';
import OrderSummary from './components/OrderSummary';
import { useCart } from '../../context/CartContext';

const BuildYourOwn = () => {
  const [selectedType, setSelectedType] = useState('pizza');
  const [selectedSize, setSelectedSize] = useState('null'); 
  const [selectedIngredients, setSelectedIngredients] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  const handleTypeChange = (type) => {
    if (type === 'pizza') {
      setSelectedType('pizza');
    } else if (type === 'burger') {
      setSelectedType('burger');
    } else {
      setSelectedType(null);
      setSelectedSize(null);
      setSelectedIngredients({});
    }
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const handleIngredientChange = (category, ingredients) => {
    setSelectedIngredients((prev) => ({
      ...prev,
      [category]: ingredients,
    }));
  };

  useEffect(() => {
    if (!selectedType || !selectedSize) {
      setTotalPrice(0);
      return;
    }
    const basePrice = selectedType === 'pizza' ? 0 : 0;

    const sizeMultipliers = {
      pizza: { small: 1, medium: 1.4, large: 1.8, xlarge: 2.2 },
      burger: { single: 1, double: 1.6, triple: 2.2 },
    };

    const multiplier = sizeMultipliers?.[selectedType]?.[selectedSize] || 1;

    const ingredientPrices = {
      pepperoni: 2,
      mushrooms: 1.5,
      bacon: 2.5,
      chicken: 3,
      avocado: 2.5,
      cheddar: 1.0,
      american: 0.5,
      tomato: 0.5,
      fries: 3.5,
      drink: 2.5,
    };

    let extras = 0;
    Object.values(selectedIngredients)?.flat()?.forEach((id) => {
      extras += ingredientPrices[id] || 0;
    });

    setTotalPrice(basePrice * multiplier + extras);
  }, [selectedType, selectedSize, selectedIngredients]);

  const handleAddToCart = () => {
    alert(
      `Agregaste una ${selectedType || 'creación'} por $${totalPrice.toFixed(
        2
      )}`
    );
  };

  const handleSaveRecipe = () => {
    alert('Receta guardada con éxito.');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          {/* Encabezado */}
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-playfair font-semibold text-text-primary mb-4">
              Creá Tu Propia Pizza o Hamburguesa
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Elegí tu tipo, tamaño y los ingredientes. ¡Combiná a tu gusto!
            </p>
          </div>
          {/* Contenido */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Izquierda */}
            <div className="lg:col-span-2 space-y-6">
              <ProductTypeSelector
                selectedType={selectedType}
                onTypeChange={handleTypeChange}
              />

              {selectedType && (
                <SizeSelector
                  productType={selectedType}
                  selectedSize={selectedSize}
                  onSizeChange={handleSizeChange}
                />
              )}

              {selectedType && selectedSize && (
                <IngredientSelector
                  productType={selectedType}
                  selectedIngredients={selectedIngredients}
                  onIngredientChange={handleIngredientChange}
                />
              )}
            </div>

            {/* Derecha */}
            <div className="space-y-6">
              <OrderSummary
                productType={selectedType}
                selectedSize={selectedSize}
                selectedIngredients={selectedIngredients}
                totalPrice={totalPrice}
                onAddToCart={handleAddToCart}
                onSaveRecipe={handleSaveRecipe}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BuildYourOwn;
