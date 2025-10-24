import React from 'react';
import Button from '../../../components/ui/Button';

import Image from '../../../components/AppImage';

const OrderSummaryCard = ({ items, subtotal, deliveryFee, tax, total, onModifyItem, onRemoveItem }) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-warm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Resumen del Pedido</h3>
        <span className="text-sm text-text-secondary">{items?.length} items</span>
      </div>
      <p className="text-xs text-text-secondary mt-1">
        {items.size} • {items.customizations}
      </p>
      {items.ingredients?.length > 0 && (
        <p className="text-xs text-text-secondary">
          Ingredientes: {items.ingredients.join(", ")}
        </p>
      )}

      <div className="space-y-4 mb-6">
        {items?.map((item) => (
          <div key={item?.id} className="flex items-start space-x-3 p-3 bg-background rounded-md">
            <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
              <Image
                src={item?.image}
                alt={item?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-text-primary text-sm">{item?.name}</h4>
              <p className="text-xs text-text-secondary mt-1">{item?.size} • {item?.customizations}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-medium text-primary">${item?.price?.toFixed(2)}</span>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="xs"
                    iconName="Edit"
                    onClick={() => onModifyItem(item?.id)}
                  />
                  <Button
                    variant="ghost"
                    size="xs"
                    iconName="Trash2"
                    onClick={() => onRemoveItem(item?.id)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-2 border-t border-border pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Subtotal</span>
          <span className="text-text-primary">${subtotal?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Envío</span>
          <span className="text-text-primary">${deliveryFee?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-semibold border-t border-border pt-2">
          <span className="text-text-primary">Total</span>
          <span className="text-primary">${total?.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryCard;