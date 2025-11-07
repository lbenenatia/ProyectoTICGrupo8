import React from 'react';
import Button from '../../../components/ui/Button';

const OrderSummaryCard = ({ items, subtotal, deliveryFee, tax, total, onModifyItem, onRemoveItem }) => {
  // Validar que todo exista
  const safeItems = items || [];
  const safeSubtotal = subtotal || 0;
  const safeDeliveryFee = deliveryFee || 0;
  const safeTax = tax || 0;
  const safeTotal = total || 0;

  console.log('📋 OrderSummaryCard renderizando con:', { 
    itemsCount: safeItems.length, 
    subtotal: safeSubtotal,
    total: safeTotal 
  });

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-warm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Resumen del Pedido</h3>
        <span className="text-sm text-text-secondary">{safeItems.length} items</span>
      </div>

      {/* Lista de items */}
      <div className="space-y-4 mb-6">
        {safeItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-text-secondary">Tu carrito está vacío</p>
          </div>
        ) : (
          safeItems.map((item, index) => {
            // Extraer datos de forma segura - NUNCA renderizar objetos directamente
            const productName = item?.product?.name || 'Producto';
            const productPrice = item?.product?.price || 0;
            const quantity = item?.qty || 1;
            const itemSize = item?.size || null;
            
            // IMPORTANTE: Convertir size a string legible si es necesario
            let sizeDisplay = '';
            if (itemSize) {
              sizeDisplay = String(itemSize); // Asegurar que es string
            }
            
            // Contar ingredientes sin renderizar el array
            const ingredientsCount = Array.isArray(item?.ingredients) ? item.ingredients.length : 0;
            
            console.log(`  Renderizando item ${index}:`, { 
              name: productName, 
              price: productPrice, 
              qty: quantity,
              size: sizeDisplay
            });
            
            return (
              <div key={item?.id || index} className="p-3 bg-background rounded-md border border-border">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-text-primary text-sm">
                      {productName}
                    </p>
                    
                    {/* Mostrar tamaño SOLO si existe y es string */}
                    {sizeDisplay && (
                      <p className="text-xs text-text-secondary mt-1">
                        Tamaño: {sizeDisplay}
                      </p>
                    )}
                    
                    {/* Mostrar cantidad de ingredientes sin renderizar el array */}
                    {ingredientsCount > 0 && (
                      <p className="text-xs text-text-secondary mt-1">
                        {ingredientsCount} {ingredientsCount === 1 ? 'ingrediente' : 'ingredientes'}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-primary">
                          ${(productPrice * quantity).toFixed(2)}
                        </span>
                        <span className="text-xs text-text-secondary">
                          × {quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 ml-2">
                    {onModifyItem && (
                      <Button
                        variant="ghost"
                        size="xs"
                        iconName="Edit"
                        onClick={() => onModifyItem(item?.id)}
                      />
                    )}
                    {onRemoveItem && (
                      <Button
                        variant="ghost"
                        size="xs"
                        iconName="Trash2"
                        onClick={() => onRemoveItem(item?.id)}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {/* Totales */}
      <div className="space-y-2 border-t border-border pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Subtotal</span>
          <span className="text-text-primary">${safeSubtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Envío</span>
          <span className="text-text-primary">${safeDeliveryFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Impuestos</span>
          <span className="text-text-primary">${safeTax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-semibold border-t border-border pt-2">
          <span className="text-text-primary">Total</span>
          <span className="text-primary">${safeTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryCard;