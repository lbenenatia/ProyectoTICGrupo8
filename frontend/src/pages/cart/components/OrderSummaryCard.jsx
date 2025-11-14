import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const OrderSummaryCard = ({ items, deliveryFee, total, onModifyItem, onRemoveItem }) => {
  const safeItems = items || [];
  const safeDeliveryFee = deliveryFee || 0;
  const safeTotal = total || 0;

  const handleRemoveClick = (itemId, itemName) => {
    console.log('🗑️ Intentando eliminar item:', itemId, itemName);
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${itemName}" del carrito?`)) {
      onRemoveItem(itemId);
    }
  };

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
            <Icon name="ShoppingCart" size={48} className="text-text-secondary mx-auto mb-4" />
            <p className="text-text-secondary">Tu carrito está vacío</p>
          </div>
        ) : (
          safeItems.map((item, index) => {
            // PRODUCTOS PERSONALIZADOS
            if (item.customProduct) {
              const customProduct = item.customProduct;
              const customData = customProduct.customData;
              const itemName = customProduct.name || 'Producto personalizado';
              
              return (
                <div key={item.id} className="p-3 bg-background rounded-md border border-border">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-text-primary text-sm">
                        {itemName}
                      </p>
                      
                      {/* Tamaño */}
                      {customData?.sizeInfo && (
                        <p className="text-xs text-text-secondary mt-1">
                          Tamaño: {customData.sizeInfo.nameEs}
                        </p>
                      )}
                      
                      {/* INGREDIENTES */}
                      {customData?.ingredients && customData.ingredients.length > 0 && (
                        <div className="mt-2 space-y-1">
                          <p className="text-xs font-medium text-text-secondary flex items-center gap-1">
                            <Icon name="ChefHat" size={12} />
                            Ingredientes seleccionados:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {customData.ingredients.map((ingredient, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                              >
                                {ingredient.name}
                                {ingredient.price > 0 && (
                                  <span className="ml-1 text-[10px] opacity-75">
                                    +${ingredient.price.toFixed(2)}
                                  </span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-primary">
                            ${(customProduct.price * item.qty).toFixed(2)}
                          </span>
                          <span className="text-xs text-text-secondary">
                            × {item.qty}
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
                          onClick={() => onModifyItem(item.id)}
                          title="Modificar item"
                        />
                      )}
                      {onRemoveItem && (
                        <Button
                          variant="ghost"
                          size="xs"
                          iconName="Trash2"
                          onClick={() => handleRemoveClick(item.id, itemName)}
                          title="Eliminar item"
                          className="text-destructive hover:bg-destructive/10"
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            }
            
            // PRODUCTOS NORMALES DEL MENÚ
            const productName = item.product?.name || 'Producto';
            const productPrice = item.product?.price || 0;
            const quantity = item.qty || 1;

            return (
              <div key={item.id} className="p-3 bg-background rounded-md border border-border">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-text-primary text-sm">
                      {productName}
                    </p>
                    
                    {/* Tamaño para productos normales */}
                    {item.size && (
                      <p className="text-xs text-text-secondary mt-1">
                        Tamaño: {item.size}
                      </p>
                    )}
                    
                    {/* Ingredientes para productos normales */}
                    {item.ingredients && item.ingredients.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs font-medium text-text-secondary flex items-center gap-1">
                          <Icon name="ChefHat" size={12} />
                          Ingredientes extra:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {item.ingredients.map((ingredient, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                            >
                              {ingredient.name || `Ingrediente ${idx + 1}`}
                            </span>
                          ))}
                        </div>
                      </div>
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
                        onClick={() => onModifyItem(item.id)}
                        title="Modificar item"
                      />
                    )}
                    {onRemoveItem && (
                      <Button
                        variant="ghost"
                        size="xs"
                        iconName="Trash2"
                        onClick={() => handleRemoveClick(item.id, productName)}
                        title="Eliminar item"
                        className="text-destructive hover:bg-destructive/10"
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
          <span className="text-text-secondary">Envío</span>
          <span className="text-text-primary">${safeDeliveryFee.toFixed(2)}</span>
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