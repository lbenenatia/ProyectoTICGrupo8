import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CardsInfo = ({ cards, onEditCard, onAddCard, onDeleteCard }) => {
  return (
    <div className="bg-card rounded-lg p-6 shadow-warm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center space-x-2">
          <Icon name="CreditCard" size={20} />
          <span>Métodos de Pago</span>
        </h3>
        <Button variant="outline" size="sm" onClick={onAddCard} iconName="Plus" iconPosition="left">
          Agregar
        </Button>
      </div>

      {cards && cards.length > 0 ? (
        <div className="space-y-4">
          {cards.map((card) => (
            <div key={card.id} className="border border-border rounded-lg p-4 hover:border-primary transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="CreditCard" size={20} className="text-primary" />
                    <span className="text-sm font-mono text-text-primary">
                      {card.cardNumber}
                    </span>
                  </div>
                  <p className="text-sm text-text-primary font-medium mb-1">
                    {card.cardHolder}
                  </p>
                  <p className="text-xs text-text-secondary">
                    Vence: {card.cardExpiry}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEditCard(card)}>
                    <Icon name="Edit2" size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDeleteCard(card.id)} className="text-red-600 hover:text-red-700">
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Icon name="CreditCard" size={48} className="mx-auto text-text-secondary mb-3" />
          <p className="text-text-secondary mb-4">No tenés tarjetas guardadas</p>
          <Button onClick={onAddCard} iconName="Plus" iconPosition="left">
            Agregar tarjeta
          </Button>
        </div>
      )}
    </div>
  );
};

export default CardsInfo;
