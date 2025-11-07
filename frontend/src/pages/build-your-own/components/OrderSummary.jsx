import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OrderSummary = ({ 
  productType, 
  selectedSize, 
  selectedIngredients, 
  totalPrice, 
  onAddToCart,
  onSaveRecipe 
}) => {

  const getIngredientDetails = () => {
    const pizzaIngredients = {
      base: [
        { id: 'thin-crust', name: 'Masa fina', price: 0 },
        { id: 'thick-crust', name: 'Masa gruesa', price: 1.50 },
        { id: 'gluten-free', name: 'Base sin gluten', price: 3.00 }
      ],
      salsa: [
        { id: 'tomato', name: 'Salsa de tomate', price: 0 },
        { id: 'pomodoro', name: 'Salsa pomodoro', price: 1.00 }


      ],
      queso: [
        { id: 'mozzarella', name: 'Muzzarella', price: 0 },
        { id: '4-cheese', name: '4 Quesos', price: 2.50 },
        { id: 'roquefort', name: 'Roquefort', price: 2.00 }

      ],
      toppings: [
        { id: 'pepperoni', name: 'Pepperoni', price: 2.00 },
        { id: 'sausage', name: 'Salchicha', price: 2.00 },
        { id: 'tuna', name: 'Atún', price: 2.00 },
        { id: 'mushroom', name: 'Champiñon', price: 1.50 },
        { id: 'egg', name: 'Huevo', price: 1.00 },
        { id: 'oregano', name: 'Orégano', price: 0.50 },
        { id: 'pepper', name: 'Morrón', price: 1.50 },
        { id: 'tomato', name: 'Tomate', price: 1.50 },
        { id: 'olive', name: 'Aceituna', price: 1.50 },
        { id: 'cucumber', name: 'Pepino', price: 1.50 },
        { id: 'basil', name: 'Albahaca', price: 1.50 },
        { id: 'onion', name: 'Cebolla', price: 1.50 },
        { id: 'ham', name: 'Jamón', price: 1.50 },
        { id: 'chicken', name: 'Pollo', price: 3.00 },
        { id: 'anchovy', name: 'Anchoa', price: 1.50 },
        { id: 'bacon', name: 'Panceta', price: 2.50 }
      ]
    };

    const burgerIngredients = {
      base: [
        { id: 'potato', name: 'Pan brioche', price: 0 },
        { id: 'whole-wheat', name: 'Pan integral', price: 1.00 },
        { id: 'gluten-free-bun', name: 'Pan sin gluten', price: 2.50 }

      ],
      carne: [
        { id: 'beef', name: 'Carne de res', price: 0 },
        { id: 'chicken', name: 'Pollo', price: 1.50 },
        { id: 'pork', name: 'Cerdo', price: 2.00 },
        { id: 'lentils', name: 'Lentejas', price: 2.00 },
        { id: 'soy', name: 'Soja', price: 2.00 },
        { id: 'salmon', name: 'Salmón', price: 2.50 }
      ],
      queso: [
        { id: 'american', name: 'Americano', price: 0.50 },
        { id: 'cheddar', name: 'Cheddar', price: 1.00 },
        { id: 'swiss', name: 'Suizo', price: 1.00 },
        { id: 'blue-cheese', name: 'Queso azul', price: 1.50 }
      ],
      toppings: [
        { id: 'lettuce', name: 'Lechuga', price: 0.50 },
        { id: 'tomato', name: 'Tomate', price: 0.50 },
        { id: 'onion', name: 'Cebolla', price: 0.50 },
        { id: 'pickles', name: 'Pepinillos', price: 0.50 },
        { id: 'bacon-burger', name: 'Bacon', price: 2.00 },
        { id: 'jalapenos', name: 'Jalapeños', price: 1.00 },
        { id: 'mushrooms', name: 'Champiñones', price: 1.50 },
        { id: 'fried-egg', name: 'Huevo frito', price: 1.50 },
        { id: 'peppers', name: 'Morrones', price: 1.50 },
        { id: 'ham', name: 'Jamón', price: 1.50 },
        { id: 'avocado', name: 'Aguacate', price: 2.50 }
      ],
      aderezos: [
        { id: 'ketchup', name: 'Kétchup', price: 0.25 },
        { id: 'mustard', name: 'Mostaza', price: 0.25 },
        { id: 'mayo', name: 'Mayonesa', price: 0.25 },
        { id: 'bbq-sauce', name: 'Salsa BBQ', price: 0.50 },
        { id: 'aioli', name: 'Alioli', price: 0.50 },
        { id: 'ranch-dressing', name: 'Aderezo ranch', price: 0.50 },
        { id: 'special-sauce', name: 'Salsa especial', price: 1.00 },
        { id: 'hot-sauce', name: 'Salsa picante', price: 0.50 },
        { id: 'creole', name: 'Criolla', price: 0.50 }
      ]
    };

    return productType === 'pizza' ? pizzaIngredients : burgerIngredients;
  };


  const ingredientDetails = getIngredientDetails();
  const selectedItems = [];

  Object.entries(selectedIngredients)?.forEach(([category, items]) => {
    items?.forEach(itemId => {
      const ingredient = ingredientDetails?.[category]?.find(ing => ing?.id === itemId);
      if (ingredient) {
        selectedItems?.push({
          category,
          ...ingredient
        });
      }
    });
  });

  const getSizeInfo = () => {
    if (productType === 'pizza') {
      const sizeMap = {
        small: { nameEs: 'Pequeña' },
        medium: { nameEs: 'Mediana' },
        large: { nameEs: 'Grande' }
      };
      return sizeMap?.[selectedSize] || null;
    } else {
      const sizeMap = {
        single: { nameEs: 'Simple' },
        double: { nameEs: 'Doble' },
        triple: { nameEs: 'Triple' }
      };
      return sizeMap?.[selectedSize] || null;
    }
  };

  const sizeInfo = getSizeInfo();

  return (
    <div className="bg-card rounded-lg p-6 shadow-warm sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-text-primary">Resumen del Pedido</h2>
        <Icon name="Receipt" size={20} className="text-text-secondary" />
      </div>

      {/* Product Preview */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <Icon name={productType === 'pizza' ? 'Pizza' : 'Beef'} size={24} className="text-primary-foreground" />
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

      {/* Selected Ingredients */}
      <div className="mb-6">
        <h4 className="font-medium text-text-primary mb-3">Ingredientes</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {selectedItems?.length > 0 ? (
            selectedItems?.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-text-secondary">{item?.name}</span>
                <span className="text-text-primary font-medium">
                  {item?.price === 0 ? 'Gratis' : `+$${item?.price?.toFixed(2)}`}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-text-secondary italic">Sin ingredientes seleccionados</p>
          )}
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="mb-6 p-4 border border-border rounded-lg">
        {(() => {
          const basePrice = productType === 'pizza' ? 12.99 : 9.99;
          const extrasPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);
          const total = basePrice + extrasPrice;

          return (
              <>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text-secondary">Precio base</span>
                  <span className="text-text-primary">${basePrice.toFixed(2)}</span>
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
              </>
          );
        })()}
      </div>


      {/* Action Buttons */}
      <div className="space-y-3">
        <Button 
          variant="default" 
          fullWidth 
          iconName="ShoppingCart" 
          iconPosition="left"
          onClick={onAddToCart}
          disabled={selectedItems?.length === 0}
        >
          Agregar al Carrito
        </Button>

        <Button 
          variant="outline" 
          fullWidth 
          iconName="Heart" 
          iconPosition="left"
          onClick={onSaveRecipe}
          disabled={selectedItems?.length === 0}
        >
          Favoritos
        </Button>
      </div>
    </div>
  );
};

export default OrderSummary;