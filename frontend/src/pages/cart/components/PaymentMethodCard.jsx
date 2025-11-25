import React from "react";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";

const PaymentMethodCard = ({
  selectedMethod,
  onMethodChange,
  selectedCard,
  savedCards,
  onAddCard,
  onEditCard,
  onSelectCard,
  onDeleteCard,
}) => {
  const paymentMethods = [
    { id: "card", title: "Tarjeta", icon: "CreditCard" },
    { id: "cash", title: "Efectivo", icon: "Wallet" },
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-warm">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Método de pago
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-warm ${
              selectedMethod === method.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => onMethodChange(method.id)}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  selectedMethod === method.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <Icon name={method.icon} size={20} />
              </div>
              <h4 className="font-medium text-text-primary">{method.title}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Tarjetas */}
      {selectedMethod === "card" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-text-primary">
              Tarjetas guardadas
            </h4>
            <Button
              variant="ghost"
              size="sm"
              iconName="Plus"
              onClick={onAddCard}
            >
              Agregar tarjeta
            </Button>
          </div>

          {savedCards.length > 0 ? (
              savedCards.map((card) => (
                <div
                  key={card.id}
                  className={`p-4 bg-background rounded-lg border-2 cursor-pointer transition-all duration-200 flex justify-between items-start ${
                    selectedCard?.id === card.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <div 
                    className="flex-1"
                    onClick={() => onSelectCard(card)}
                  >
                    <p className="font-medium text-text-primary">
                      •••• {card.cardNumber ? card.cardNumber.slice(-4) : '****'}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {card.cardHolder} • Vence {card.cardExpiry}
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="Edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditCard(card);
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="Trash"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCard(card.id);
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
            <div className="text-center py-6 border-2 border-dashed border-border rounded-lg">
              <Icon name="DollarSign" size={32} className="text-text-secondary mx-auto mb-2" />
              <p className="text-text-secondary mb-3">
                No hay tarjetas guardadas
              </p>
            </div>
          )}
        </div>
      )}

      {selectedMethod === "cash" && (
        <div className="p-4 bg-background rounded-lg border border-border">
          <p className="text-sm text-text-secondary">Abonás al recibir el pedido.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodCard;