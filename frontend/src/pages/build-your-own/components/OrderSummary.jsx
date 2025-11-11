import React, { useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useCart } from '../../../context/CartContext';

const OrderSummary = ({
  productType,
  selectedSize,
  selectedIngredients,
  ingredientsData,
  onSaveRecipe,
}) => {
  const { addToCart, addToFavorites } = useCart(); // ✅ Agregar addToFavorites

  // 🔹 Crear lista con los ingredientes seleccionados y sus datos reales
  const selectedItems = useMemo(() => {
    const items = [];
    if (!ingredientsData || !selectedIngredients) return items;

    Object.entries(selectedIngredients).forEach(([category, ids]) => {
      const categoryIngredients = ingredientsData[category] || [];
      ids.forEach((id) => {
        const found = categoryIngredients.find((ing) => ing.id === id);
        if (found) {
          items.push({
            category,
            name: found.name,
            price: found.price || 0,
          });
        }
      });
    });
    return items;
  }, [selectedIngredients, ingredientsData]);

  // 🔹 Tamaños con multiplicadores
  const sizeMap =
    productType === 'pizza'
      ? {
          small: { nameEs: 'Pequeña', multiplier: 1 },
          medium: { nameEs: 'Mediana', multiplier: 1.4 },
          large: { nameEs: 'Grande', multiplier: 1.8 },
        }
      : {
          single: { nameEs: 'Simple', multiplier: 1 },
          double: { nameEs: 'Doble', multiplier: 1.6 },
          triple: { nameEs: 'Triple', multiplier: 2.2 },
        };

  const sizeInfo = sizeMap[selectedSize] || null;

  // 🔹 Cálculo de precios
  const basePrice = productType === 'pizza' ? 12.99 : 9.99;
  const extrasPrice = selectedItems.reduce((sum, item) => sum + (item.price || 0), 0);
  const total = basePrice * (sizeInfo?.multiplier || 1) + extrasPrice;

  // 🔹 Validar ingredientes obligatorios
  const hasRequiredIngredients = useMemo(() => {
    if (productType === 'pizza') {
      const masaOk = selectedIngredients?.masa?.length > 0 || selectedIngredients?.base?.length > 0;
      const salsaOk = selectedIngredients?.salsa?.length > 0;
      return masaOk && salsaOk;
    }
    if (productType === 'burger') {
      const panOk = selectedIngredients?.pan?.length > 0 || selectedIngredients?.base?.length > 0;
      const carneOk = selectedIngredients?.carne?.length > 0;
      return panOk && carneOk;
    }
    return false;
  }, [productType, selectedIngredients]);

  const missingText =
    productType === 'pizza'
      ? 'Seleccioná al menos una masa y una salsa.'
      : 'Seleccioná al menos un pan y una carne.';

  // 🔹 Función para agregar al carrito
  const handleAddToCart = () => {
    const productName = productType === 'pizza' ? 'Pizza' : 'Hamburguesa';
    const sizeName = sizeInfo?.nameEs || '';
    
    const ingredientsList = selectedItems.map(item => item.name).join(', ');
    
    const item = {
      id: `custom-${Date.now()}`,
      name: `${productName} ${sizeName}`,
      description: ingredientsList || 'Sin ingredientes adicionales',
      price: total,
      image: productType === 'pizza' ? '/images/custom-pizza.jpg' : '/images/custom-burger.jpg',
      quantity: 1,
      customData: {
        type: productType,
        size: selectedSize,
        sizeInfo: sizeInfo,
        ingredients: selectedItems,
        basePrice: basePrice * (sizeInfo?.multiplier || 1),
        extrasPrice: extrasPrice,
      }
    };

    addToCart(item);
    alert(`✅ ${item.name} añadido al carrito con éxito.`);
  };

  // 🔹 FUNCIÓN PARA AGREGAR A FAVORITOS - NUEVA
  const handleAddToFavorites = () => {
    if (!hasRequiredIngredients) {
      alert('❌ ' + missingText);
      return;
    }

    const productName = productType === 'pizza' ? 'Pizza' : 'Hamburguesa';
    const sizeName = sizeInfo?.nameEs || '';
    
    const recipe = {
      name: `${productName} ${sizeName} Personalizada`,
      productType: productType,
      price: total,
      image: productType === 'pizza' ? '/images/custom-pizza.jpg' : '/images/custom-burger.jpg',
      customData: {
        type: productType,
        size: selectedSize,
        sizeInfo: sizeInfo,
        ingredients: selectedItems,
        basePrice: basePrice * (sizeInfo?.multiplier || 1),
        extrasPrice: extrasPrice,
        selectedIngredients: selectedIngredients, // Guardamos la selección para poder recrearla
      }
    };

    addToFavorites(recipe);
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-warm sticky top-24">
      {/* Título */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-text-primary">Resumen del Pedido</h2>
        <Icon name="Receipt" size={20} className="text-text-secondary" />
      </div>

      {/* Tipo y tamaño */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <Icon
              name={productType === 'pizza' ? 'Pizza' : 'Beef'}
              size={24}
              className="text-primary-foreground"
            />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary capitalize">{productType}</h3>
            {selectedSize && selectedSize !== 'null' ? (
              <p className="text-sm text-text-secondary">{sizeInfo?.nameEs}</p>
            ) : (
              <p className="text-sm text-text-secondary italic">Sin tamaño seleccionado</p>
            )}
          </div>
        </div>
      </div>

      {/* Ingredientes */}
      <div className="mb-6">
        <h4 className="font-medium text-text-primary mb-3">Ingredientes</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {selectedItems.length > 0 ? (
            selectedItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-text-secondary capitalize">{item.name}</span>
                <span className="text-text-primary font-medium">
                  {item.price === 0 ? 'Gratis' : `+$${item.price.toFixed(2)}`}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-text-secondary italic">Sin ingredientes seleccionados</p>
          )}
        </div>
      </div>

      {/* Precio total */}
      <div className="mb-6 p-4 border border-border rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-text-secondary">Precio base ({sizeInfo?.nameEs || 'sin tamaño'})</span>
          <span className="text-text-primary">${(basePrice * (sizeInfo?.multiplier || 1)).toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-text-secondary">Extras</span>
          <span className="text-text-primary">+${extrasPrice.toFixed(2)}</span>
        </div>
        <div className="border-t border-border pt-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-text-primary">Total</span>
            <span className="font-bold text-xl text-primary">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="space-y-3">
        <Button
          variant="default"
          fullWidth
          iconName="ShoppingCart"
          iconPosition="left"
          onClick={handleAddToCart}
          disabled={!hasRequiredIngredients}
        >
          Agregar al Carrito
        </Button>

        <Button
          variant="outline"
          fullWidth
          iconName="Heart"
          iconPosition="left"
          onClick={handleAddToFavorites} // ✅ Cambiado a la nueva función
          disabled={!hasRequiredIngredients}
        >
          Agregar a Favoritos
        </Button>

        {!hasRequiredIngredients && (
          <p className="text-xs text-destructive text-center">{missingText}</p>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;