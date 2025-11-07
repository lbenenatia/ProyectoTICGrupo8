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

  const handleAddToCart = () => {
    alert(
      `Agregaste una ${selectedType || 'creación'} al carrito`
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
            <h1 className="mt-8 text-3xl font-semibold mb-8 text-gray-800 dark:text-gray-100">
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

              {selectedType && selectedSize && selectedSize !== 'null' && (
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