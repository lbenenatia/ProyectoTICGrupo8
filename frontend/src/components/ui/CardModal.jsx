import React, { useState, useEffect } from 'react';
import Button from './Button';
import Input from './Input';
import Icon from '../AppIcon';

const CardModal = ({ isOpen, onClose, onSave, card, userEmail }) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    cardExpiry: '',
    cardCVV: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 CORREGIDO: Limpiar formulario cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen) {
      if (card) {
        // Al editar, mostramos los datos existentes (excepto número completo y CVV por seguridad)
        setFormData({
          cardNumber: '', // No mostrar número completo por seguridad
          cardHolder: card.cardHolder || '',
          cardExpiry: card.cardExpiry || '',
          cardCVV: '' // No mostrar CVV por seguridad
        });
      } else {
        // Nueva tarjeta - limpiar formulario
        setFormData({
          cardNumber: '',
          cardHolder: '',
          cardExpiry: '',
          cardCVV: ''
        });
      }
      setError(null);
      setLoading(false);
    }
  }, [isOpen, card]); // 🔹 Se ejecuta cuando cambia isOpen o card

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  const formatExpiry = (value) => {
    return value
      .replace(/[^0-9/]/g, '')
      .slice(0, 5)
      .replace(/^(\d{2})(\d)/, '$1/$2');
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === 'cardNumber') {
      value = formatCardNumber(value);
    } else if (name === 'cardExpiry') {
      value = formatExpiry(value);
    } else if (name === 'cardCVV') {
      value = value.replace(/\D/g, '').slice(0, 3);
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validaciones
    if (!card && formData.cardNumber.replace(/\s/g, '').length !== 16) {
      setError('El número de tarjeta debe tener 16 dígitos');
      setLoading(false);
      return;
    }

    if (!formData.cardHolder.trim()) {
      setError('El nombre del titular es requerido');
      setLoading(false);
      return;
    }

    if (!formData.cardExpiry || !/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
      setError('La fecha de vencimiento debe tener el formato MM/AA');
      setLoading(false);
      return;
    }

    if (!card && formData.cardCVV.length !== 3) {
      setError('El CVV debe tener 3 dígitos');
      setLoading(false);
      return;
    }

    try {
      // 🔹 CORREGIDO: Usar localStorage en lugar de API
      const userKey = userEmail || 'guest';
      const cardsKey = `savedCards_${userKey}`;
      
      // Obtener tarjetas existentes
      const existingCards = JSON.parse(localStorage.getItem(cardsKey) || '[]');
      
      let updatedCards;
      
      // Preparar datos de la tarjeta
      const cardData = {
        cardHolder: formData.cardHolder,
        cardExpiry: formData.cardExpiry,
        // Solo incluir número si se proporcionó (para nuevas tarjetas o edición con nuevo número)
        ...(formData.cardNumber && { 
          cardNumber: formData.cardNumber.replace(/\s/g, ''),
          last4: formData.cardNumber.replace(/\s/g, '').slice(-4)
        }),
        // Solo incluir CVV si se proporcionó
        ...(formData.cardCVV && { cardCVV: formData.cardCVV }),
        // Determinar marca basada en el primer dígito
        brand: formData.cardNumber.startsWith('4') ? 'Visa' : 
               formData.cardNumber.startsWith('5') ? 'Mastercard' : 'Otra'
      };

      if (card) {
        // 🔹 CORREGIDO: Actualizar tarjeta existente
        updatedCards = existingCards.map(c => 
          c.id === card.id 
            ? { ...c, ...cardData, id: card.id } 
            : c
        );
      } else {
        // 🔹 CORREGIDO: Crear nueva tarjeta
        const newCard = {
          ...cardData,
          id: Date.now() // ID único
        };
        updatedCards = [...existingCards, newCard];
      }

      // Guardar en localStorage
      localStorage.setItem(cardsKey, JSON.stringify(updatedCards));
      
      // Encontrar la tarjeta guardada (para edición) o usar la nueva
      const savedCard = card 
        ? updatedCards.find(c => c.id === card.id)
        : updatedCards[updatedCards.length - 1];

      // Llamar callback de éxito
      onSave(savedCard);
      onClose();
      
    } catch (err) {
      setError('Error al guardar tarjeta');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 CORREGIDO: Función para manejar el cierre correctamente
  const handleClose = () => {
    setFormData({
      cardNumber: '',
      cardHolder: '',
      cardExpiry: '',
      cardCVV: ''
    });
    setError(null);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-text-primary">
              {card ? 'Editar Tarjeta' : 'Nueva Tarjeta'}
            </h2>
            <button
              onClick={handleClose}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <Icon name="X" size={24} />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {card && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
              <Icon name="Info" size={16} className="inline mr-2" />
              {card.last4 ? `Editando tarjeta terminada en ${card.last4}` : 'Editando tarjeta'}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Número de Tarjeta {!card && '*'}
              </label>
              <Input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                required={!card}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Titular *
              </label>
              <Input
                type="text"
                name="cardHolder"
                value={formData.cardHolder}
                onChange={handleChange}
                placeholder="Juan Pérez"
                required
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Vencimiento *
                </label>
                <Input
                  type="text"
                  name="cardExpiry"
                  value={formData.cardExpiry}
                  onChange={handleChange}
                  placeholder="MM/AA"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  CVV {!card && '*'}
                </label>
                <Input
                  type="password"
                  name="cardCVV"
                  value={formData.cardCVV}
                  onChange={handleChange}
                  placeholder="•••"
                  maxLength={3}
                  required={!card}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={loading}
              >
                {loading ? 'Guardando...' : card ? 'Actualizar' : 'Agregar'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CardModal;