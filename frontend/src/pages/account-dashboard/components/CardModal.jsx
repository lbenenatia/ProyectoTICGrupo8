import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const CardModal = ({ isOpen, onClose, onSave, card, userEmail }) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    cardExpiry: '',
    cardCVV: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (card) {
      // Al editar, no mostramos el número completo por seguridad
      setFormData({
        cardNumber: '',
        cardHolder: card.cardHolder,
        cardExpiry: card.cardExpiry,
        cardCVV: ''
      });
    } else {
      setFormData({
        cardNumber: '',
        cardHolder: '',
        cardExpiry: '',
        cardCVV: ''
      });
    }
  }, [card]);

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

    if (formData.cardCVV && formData.cardCVV.length !== 3) {
      setError('El CVV debe tener 3 dígitos');
      setLoading(false);
      return;
    }

    try {
      const url = card
        ? `http://localhost:4028/api/user/cards/${card.id}`
        : `http://localhost:4028/api/user/${userEmail}/cards`;

      const method = card ? 'PUT' : 'POST';

      const payload = {
        cardHolder: formData.cardHolder,
        cardExpiry: formData.cardExpiry
      };

      // Solo incluir número y CVV si se proporcionaron
      if (formData.cardNumber) {
        payload.cardNumber = formData.cardNumber.replace(/\s/g, '');
      }

      if (formData.cardCVV) {
        payload.cardCVV = formData.cardCVV;
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        onSave(data.card);
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al guardar tarjeta');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
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
              onClick={onClose}
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
              Por seguridad, debes ingresar nuevamente el número de tarjeta y CVV
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Número de Tarjeta *
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
                  CVV *
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
                onClick={onClose}
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
