import React, { useState, useEffect } from 'react';
import Button from './Button';
import Input from './Input';
import Icon from '../AppIcon';

const CardModal = ({ isOpen, onClose, onSave, card }) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    cardExpiry: '',
    cardCVV: ''
  });
  const [errors, setErrors] = useState({});
  const [showCVV, setShowCVV] = useState(false);

  useEffect(() => {
    if (card) {
      // Al editar, no mostramos el número completo ni el CVV por seguridad
      setFormData({
        cardNumber: '',
        cardHolder: card.holder || card.cardHolder || '',
        cardExpiry: card.expiry || card.cardExpiry || '',
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
    setErrors({});
  }, [card, isOpen]);

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

  const validateInput = (name, value) => {
    let regex;
    switch (name) {
      case 'cardNumber':
        regex = /^[0-9 ]*$/;
        break;
      case 'cardHolder':
        regex = /^[A-Za-zÀÉÍÓÚáéíóúÑñ ]*$/;
        break;
      case 'cardExpiry':
        regex = /^[0-9/]*$/;
        break;
      case 'cardCVV':
        regex = /^[0-9]*$/;
        break;
      default:
        regex = /^[^<>%$#@!^*{}[\]\\|]*$/;
    }
    return regex.test(value);
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (!validateInput(name, value)) return;

    if (name === 'cardNumber') {
      value = formatCardNumber(value);
    } else if (name === 'cardExpiry') {
      value = formatExpiry(value);
    } else if (name === 'cardCVV') {
      value = value.slice(0, 3);
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (value.trim() !== '') {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!card || formData.cardNumber) {
      if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
        newErrors.cardNumber = true;
      }
    }

    if (!formData.cardHolder.trim()) {
      newErrors.cardHolder = true;
    }

    if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
      newErrors.cardExpiry = true;
    }

    if (!card || formData.cardCVV) {
      if (formData.cardCVV.length !== 3) {
        newErrors.cardCVV = true;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const dataToSave = {
      cardHolder: formData.cardHolder,
      holder: formData.cardHolder, 
      cardExpiry: formData.cardExpiry,
      expiry: formData.cardExpiry 
    };

    if (formData.cardNumber) {
      dataToSave.cardNumber = formData.cardNumber;
      dataToSave.number = formData.cardNumber; 
    }

    if (formData.cardCVV) {
      dataToSave.cardCVV = formData.cardCVV;
      dataToSave.cvv = formData.cardCVV; 
    }

    onSave(dataToSave);
  };

  if (!isOpen) return null;

  const inputRing = "ring-1 ring-border focus:ring-2 focus:ring-primary/60 focus:border-primary/60 rounded-md transition-shadow";
  const errorRing = "ring-1 ring-red-500 focus:ring-2 focus:ring-red-400 focus:border-red-400 rounded-md transition-shadow";

  const Label = ({ text, required }) => (
    <span className="font-medium text-text-primary">
      {text}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </span>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-card rounded-lg max-w-md w-full">
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

          {card && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
                <Icon name="Info" size={16} className="mt-0.5 flex-shrink-0" />
                <span>Por seguridad, si querés cambiar el número de tarjeta o CVV, ingresalos nuevamente.</span>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label text="Número de Tarjeta" required={!card} />
              <Input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder={card ? "•••• •••• •••• " + String(card.number || card.cardNumber).slice(-4) : "1234 5678 9012 3456"}
                className={`${errors.cardNumber ? errorRing : inputRing} w-full mt-1`}
              />
              {errors.cardNumber && (
                <p className="text-xs text-red-500 mt-1">
                  El número de tarjeta debe tener 16 dígitos
                </p>
              )}
            </div>

            <div>
              <Label text="Titular" required />
              <Input
                type="text"
                name="cardHolder"
                value={formData.cardHolder}
                onChange={handleChange}
                placeholder="Nombre del titular"
                className={`${errors.cardHolder ? errorRing : inputRing} w-full mt-1`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label text="Vencimiento" required />
                <Input
                  type="text"
                  name="cardExpiry"
                  value={formData.cardExpiry}
                  onChange={handleChange}
                  placeholder="MM/AA"
                  className={`${errors.cardExpiry ? errorRing : inputRing} w-full mt-1`}
                />
                {errors.cardExpiry && (
                  <p className="text-xs text-red-500 mt-1">
                    Formato: MM/AA
                  </p>
                )}
              </div>

              <div>
                <Label text="CVV" required={!card} />
                <div className="relative">
                  <Input
                    type={showCVV ? "text" : "password"}
                    name="cardCVV"
                    value={formData.cardCVV}
                    onChange={handleChange}
                    placeholder="•••"
                    maxLength={3}
                    className={`${errors.cardCVV ? errorRing : inputRing} w-full mt-1 pr-10`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
                    onClick={() => setShowCVV(prev => !prev)}
                  >
                    <Icon name={showCVV ? "EyeOff" : "Eye"} size={18} />
                  </button>
                </div>
                {errors.cardCVV && (
                  <p className="text-xs text-red-500 mt-1">
                    El CVV debe tener 3 dígitos
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="default"
                className="flex-1"
              >
                {card ? 'Actualizar' : 'Agregar'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CardModal;