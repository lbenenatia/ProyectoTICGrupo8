// 🔥 PaymentMethodCard.jsx — Versión fusionada
import React, { useState, useEffect } from "react";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";
import CardModal from "../../../components/ui/CardModal";
import { useAuth } from "context/AuthContext";

const PaymentMethodCard = ({
  selectedMethod,
  onMethodChange,
  selectedCard,
  onCardSelect,
}) => {
  const { user } = useAuth();

  const [cards, setCards] = useState([]);
  const [showCardModal, setShowCardModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const getCardsKey = () => {
    const email = user?.email || "guest";
    return `savedCards_${email}`;
  };

  // 🔥 Cargar tarjetas del usuario
  useEffect(() => {
    if (!user?.email) return;

    const cardsKey = getCardsKey();
    const saved = localStorage.getItem(cardsKey);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCards(parsed);

        // Si no hay seleccionada, seleccionar la última
        if (parsed.length > 0 && !selectedCard) {
          onCardSelect && onCardSelect(parsed[parsed.length - 1].id);
        }
      } catch {
        setCards([]);
      }
    } else {
      setCards([]);
    }
  }, [user]);

  // 🔥 Ocultar mensaje después de 3s
  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(""), 3000);
    return () => clearTimeout(t);
  }, [successMessage]);

  // 🔥 Guardar tarjeta (nuevo + edición)
  const handleSaveCard = (cardData) => {
    const cardsKey = getCardsKey();

    if (editingCard) {
      // Edición
      const updated = cards.map((card) =>
        card.id === editingCard.id
          ? {
              ...card,
              ...cardData,
              id: editingCard.id,
              number: cardData.number || cardData.cardNumber || editingCard.number,
            }
          : card
      );

      setCards(updated);
      localStorage.setItem(cardsKey, JSON.stringify(updated));

      if (selectedCard === editingCard.id) {
        onCardSelect && onCardSelect(editingCard.id);
      }

      setSuccessMessage("Tarjeta actualizada correctamente.");
    } else {
      // Nueva tarjeta
      const newCard = {
        ...cardData,
        id: Date.now(),
        number: cardData.cardNumber || cardData.number,
        holder: cardData.cardHolder || cardData.holder,
        expiry: cardData.cardExpiry || cardData.expiry,
      };

      const updated = [...cards, newCard];
      setCards(updated);
      localStorage.setItem(cardsKey, JSON.stringify(updated));

      onCardSelect && onCardSelect(newCard.id);
      setSuccessMessage("Tarjeta guardada correctamente.");
    }

    setShowCardModal(false);
    setEditingCard(null);
    onMethodChange("card");
  };

  const handleDeleteCard = (id) => {
    if (!window.confirm("¿Estás seguro de que querés eliminar esta tarjeta?")) {
      return;
    }

    const updated = cards.filter((c) => c.id !== id);
    setCards(updated);

    const cardsKey = getCardsKey();
    localStorage.setItem(cardsKey, JSON.stringify(updated));

    // Si elimino la seleccionada → seleccionar otra
    if (selectedCard === id) {
      const newSelected = updated.length > 0 ? updated[0].id : null;
      onCardSelect && onCardSelect(newSelected);
    }

    setSuccessMessage("Tarjeta eliminada correctamente.");
  };

  const handleEditCard = (card) => {
    setEditingCard(card);
    setShowCardModal(true);
  };

  const handleAddNewCard = () => {
    setEditingCard(null);
    setShowCardModal(true);
  };

  const handleSelectCard = (cardId) => {
    onCardSelect && onCardSelect(cardId);
  };

  const getCardBrand = (number) => {
    const numStr = String(number).replace(/\s/g, "");
    if (numStr.startsWith("4")) return "Visa";
    if (numStr.startsWith("5")) return "Mastercard";
    if (numStr.startsWith("3")) return "Amex";
    return "Tarjeta";
  };

  const paymentMethods = [
    { id: "card", title: "Tarjeta", icon: "CreditCard" },
    { id: "cash", title: "Efectivo", icon: "Wallet" },
  ];

  return (
    <>
      <div className="bg-card rounded-lg border border-border p-6 shadow-warm">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Método de pago
        </h3>

        {/* Métodos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-warm ${
                selectedMethod === method.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => {
                onMethodChange(method.id);
                setSuccessMessage("");
              }}
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
                <h4 className="font-medium text-text-primary">
                  {method.title}
                </h4>
              </div>
            </div>
          ))}
        </div>

        {/* Tarjetas */}
        {selectedMethod === "card" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-text-primary">Tus tarjetas</h4>
              <Button
                variant="default"
                size="sm"
                iconName="Plus"
                onClick={handleAddNewCard}
              >
                Agregar nueva
              </Button>
            </div>

            {successMessage && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-700 flex items-center gap-2">
                  <Icon name="CheckCircle" size={16} />
                  {successMessage}
                </p>
              </div>
            )}

            {cards.length > 0 ? (
              <div className="space-y-3">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => handleSelectCard(card.id)}
                    className={`p-4 bg-background rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedCard === card.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon
                            name={
                              selectedCard === card.id
                                ? "CheckCircle"
                                : "CreditCard"
                            }
                            size={16}
                          />
                          <p className="font-medium text-text-primary">
                            {getCardBrand(card.number || card.cardNumber)} ••••{" "}
                            {String(card.number || card.cardNumber).slice(-4)}
                          </p>
                        </div>

                        <p className="text-sm text-text-secondary">
                          {card.holder || card.cardHolder}
                        </p>
                        <p className="text-sm text-text-secondary">
                          Vence {card.expiry || card.cardExpiry}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="xs"
                          iconName="Edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditCard(card);
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="xs"
                          iconName="Trash"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCard(card.id);
                          }}
                          className="text-destructive hover:bg-destructive/10"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-background rounded-lg border border-border">
                <Icon
                  name="CreditCard"
                  size={48}
                  className="text-text-secondary mx-auto mb-3"
                />
                <p className="text-sm text-text-secondary mb-4">
                  No hay tarjetas guardadas.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Plus"
                  onClick={handleAddNewCard}
                >
                  Agregar tu primera tarjeta
                </Button>
              </div>
            )}
          </div>
        )}

        {selectedMethod === "cash" && (
          <div className="p-4 bg-background rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <Icon name="Wallet" size={20} />
              </div>
              <div>
                <p className="font-medium text-text-primary mb-1">
                  Pago en efectivo
                </p>
                <p className="text-sm text-text-secondary">
                  Abonás al recibir el pedido.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <CardModal
        isOpen={showCardModal}
        onClose={() => {
          setShowCardModal(false);
          setEditingCard(null);
        }}
        onSave={handleSaveCard}
        card={editingCard}
        userEmail={user?.email}
      />
    </>
  );
};

export default PaymentMethodCard;
