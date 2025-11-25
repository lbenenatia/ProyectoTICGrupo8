import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useAuth } from 'context/AuthContext';
import { useToast } from '../../../context/ToastContext';

const CardsInfo = ({ onEditCard, onAddCard }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [cards, setCards] = useState([]);

  // ✅ Usar la misma key que el carrito
  const getCardsKey = () => {
    const email = user?.email || "guest";
    return `savedCards_${email}`;
  };

  // ✅ Detectar marca de tarjeta
  const getCardBrand = (number) => {
    const numStr = String(number).replace(/\s/g, '');
    if (numStr.startsWith('4')) return 'Visa';
    if (numStr.startsWith('5')) return 'Mastercard';
    if (numStr.startsWith('3')) return 'Amex';
    return 'Tarjeta';
  };

  // ✅ Formatear número de tarjeta para mostrar
  const formatCardNumber = (number) => {
    const numStr = String(number).replace(/\s/g, '');
    return `•••• •••• •••• ${numStr.slice(-4)}`;
  };

  // ✅ Cargar tarjetas del localStorage
  useEffect(() => {
    if (!user?.email) return;

    const cardsKey = getCardsKey();
    const saved = localStorage.getItem(cardsKey);
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCards(Array.isArray(parsed) ? parsed : []);
      } catch {
        setCards([]);
      }
    } else {
      setCards([]);
    }
  }, [user]);

  // ✅ Escuchar cambios en localStorage (sincronización en tiempo real)
  useEffect(() => {
    const handleStorageChange = (e) => {
      const cardsKey = getCardsKey();
      if (e.key === cardsKey) {
        try {
          const parsed = JSON.parse(e.newValue);
          setCards(Array.isArray(parsed) ? parsed : []);
        } catch {
          setCards([]);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);

  // ✅ Eliminar tarjeta
  const handleDeleteCard = (cardId) => {
    if (!window.confirm('¿Estás seguro de que querés eliminar esta tarjeta?')) {
      return;
    }

    const cardsKey = getCardsKey();
    const updated = cards.filter(c => c.id !== cardId);
    
    setCards(updated);
    localStorage.setItem(cardsKey, JSON.stringify(updated));
    
    showToast("🗑️ Tarjeta eliminada correctamente");
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-warm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center space-x-2">
          <Icon name="CreditCard" size={20} />
          <span>Métodos de Pago</span>
        </h3>
        <Button size="sm" onClick={onAddCard} iconName="Plus" iconPosition="left">
          Agregar
        </Button>
      </div>

      {cards && cards.length > 0 ? (
        <div className="space-y-4">
          {cards.map((card) => {
            const cardNumber = card.cardNumber || card.number;
            const cardHolder = card.cardHolder || card.holder;
            const cardExpiry = card.cardExpiry || card.expiry;
            
            return (
              <div key={card.id} className="border border-border rounded-lg p-4 hover:border-primary transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="CreditCard" size={20} className="text-primary" />
                      <span className="text-sm font-medium text-text-primary">
                        {getCardBrand(cardNumber)}
                      </span>
                      <span className="text-sm font-mono text-text-secondary">
                        {formatCardNumber(cardNumber)}
                      </span>
                    </div>
                    <p className="text-sm text-text-primary font-medium mb-1">
                      {cardHolder}
                    </p>
                    <p className="text-xs text-text-secondary">
                      Vence: {cardExpiry}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onEditCard(card)}
                      title="Editar tarjeta"
                    >
                      <Icon name="Edit2" size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteCard(card.id)} 
                      className="text-destructive hover:bg-destructive/10"
                      title="Eliminar tarjeta"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <Icon name="CreditCard" size={48} className="mx-auto text-text-secondary mb-3" />
          <p className="text-text-secondary mb-4">No tenés tarjetas guardadas</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onAddCard}
            iconName="Plus"
            iconPosition="left"
          >
            Agregar primera tarjeta
          </Button>
        </div>
      )}
    </div>
  );
};

export default CardsInfo;