import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import ProductTypeSelector from './components/ProductTypeSelector';
import SizeSelector from './components/SizeSelector';
import IngredientSelector from './components/IngredientSelector';
import OrderSummary from './components/OrderSummary';
import { useCart } from '../../context/CartContext';
import ExtrasSelector from './components/ExtrasSelector';

const BuildYourOwn = () => {
  const [selectedType, setSelectedType] = useState('pizza');
  const [selectedSize, setSelectedSize] = useState('null'); 
  const [selectedIngredients, setSelectedIngredients] = useState({});
  const [selectedExtras, setSelectedExtras] = useState({});
  const [ingredientsData, setIngredientsData] = useState({});
  const [extrasData, setExtrasData] = useState({});

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

  const handleExtraChange = (category, extras) => {
    setSelectedExtras((prev) => ({
      ...prev,
      [category]: extras,
    }));
  };

const { addToCart } = useCart();

const handleAddToCart = () => {
  if (!selectedType || selectedSize === "null") {
    alert("Debe seleccionar un tipo y tamaño.");
    return;
  }

  // Convertir pizza/burger → enum del backend
  const normalizedType =
    selectedType === 'pizza' ? 'PIZZA' :
    selectedType === 'burger' ? 'BURGER' :
    'PIZZA';

  // Aplanar ingredientes en una sola lista
  const flatIngredients = Object.values(selectedIngredients).flat();

  // Aplanar extras
  const flatExtras = Object.values(selectedExtras).flat();

  // Calcular precio base por tamaño (puedes ajustar si cambia)
  const sizePrices = {
    small: 25,
    medium: 35,
    large: 45
  };

  const basePrice = sizePrices[selectedSize] || 25;

  const ingredientCost = flatIngredients.reduce(
    (sum, ing) => sum + (ing.price || 0), 0
  );

  const extrasCost = flatExtras.reduce(
    (sum, ext) => sum + (ext.price || 0), 0
  );

  const totalPrice = basePrice + ingredientCost + extrasCost;

  // Construir el producto personalizado
  const customProduct = {
    name: selectedType === "pizza" ? "Pizza Personalizada" : "Hamburguesa Personalizada",
    size: selectedSize,
    ingredients: [...flatIngredients, ...flatExtras],
    price: totalPrice,
    type: normalizedType   // ⭐ CLAVE ⭐ →
                           // PIZZA / BURGER (aceptado por backend)
  };

  addToCart(customProduct, {}, 1);

  alert("¡Personalización agregada al carrito!");

  // reset opcional
  // setSelectedIngredients({});
  // setSelectedExtras({});
};



  useEffect(() => {
    const editItem = localStorage.getItem("editItem");
    if (editItem) {
      const parsed = JSON.parse(editItem);
      // precargar datos
      setSelectedType(parsed.type);
      setSelectedSize(parsed.size);
      setSelectedIngredients(parsed.ingredients);
      localStorage.removeItem("editItem");
    }
  }, []);

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
              Elegí tu tipo, tamaño, ingredientes y extras. ¡Combiná a tu gusto!
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

              {selectedType && (
                <IngredientSelector
                  productType={selectedType}
                  selectedIngredients={selectedIngredients}
                  onIngredientChange={handleIngredientChange}
                  onIngredientsLoaded={(data) => setIngredientsData(data)}
                />
              )}

              {selectedType && (
                <ExtrasSelector
                productType={selectedType}
                selectedExtras={selectedExtras}
                onExtraChange={handleExtraChange}
                onExtrasLoaded={(data) => setExtrasData(data)}
              />
              )}
            </div>

            {/* Derecha */}
            <div className="space-y-6">
              <OrderSummary
                productType={selectedType}
                selectedSize={selectedSize}
                selectedIngredients={selectedIngredients}
                ingredientsData={ingredientsData}
                onAddToCart={handleAddToCart}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BuildYourOwn;