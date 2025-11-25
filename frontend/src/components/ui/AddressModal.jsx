import React, { useState, useEffect } from 'react';
import Button from './Button';
import Input from './Input';
import Icon from '../AppIcon';

const AddressModal = ({ isOpen, onClose, onSave, address }) => {
  const [formData, setFormData] = useState({
    label: '',
    street1: '',
    street2: '',
    number: '',
    city: '',
    state: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (address) {
      setFormData({
        label: address.label || '',
        street1: address.street1 || address.address1 || '',
        street2: address.street2 || address.address2 || '',
        number: address.number || '',
        city: address.city || '',
        state: address.state || '',
        phone: address.phone || ''
      });
    } else {
      setFormData({
        label: '',
        street1: '',
        street2: '',
        number: '',
        city: '',
        state: '',
        phone: ''
      });
    }
    setErrors({});
  }, [address, isOpen]);

  const validateInput = (name, value) => {
    let regex;
    switch (name) {
      case 'number':
        regex = /^[0-9]*$/;
        break;
      case 'phone':
        regex = /^[0-9 ]*$/;
        break;
      case 'city':
      case 'state':
      case 'street1':
      case 'street2':
      case 'label':
        regex = /^[A-Za-zÀÉÍÓÚáéíóúÑñ0-9 ,.()-]*$/;
        break;
      default:
        regex = /^[^<>%$#@!^*{}[\]\\|]*$/;
    }
    return regex.test(value);
  };

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 9);
    return digits.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const inputType = e.nativeEvent?.inputType;

    if (!validateInput(name, value)) return;

    let formatted = value;
    if (name === 'phone' && inputType !== 'deleteContentBackward') {
      formatted = formatPhone(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formatted
    }));

    if (formatted.trim() !== '') {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['street1', 'number', 'city', 'state', 'phone'];
    
    requiredFields.forEach(field => {
      if (!formData[field]?.trim()) {
        newErrors[field] = true;
      }
    });

    // Validar teléfono (9 dígitos en Uruguay)
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 9) {
      newErrors.phone = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSave(formData);
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
      <div className="bg-card dark:bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-text-primary">
              {address ? 'Editar Dirección' : 'Nueva Dirección'}
            </h2>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <Icon name="X" size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label text="Etiqueta (opcional)" />
              <Input
                type="text"
                name="label"
                value={formData.label}
                onChange={handleChange}
                placeholder="Casa, Trabajo, etc."
                className={`${inputRing} w-full mt-1`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label text="Calle Principal" required />
                <Input
                  type="text"
                  name="street1"
                  value={formData.street1}
                  onChange={handleChange}
                  placeholder="Av. 18 de Julio"
                  className={`${errors.street1 ? errorRing : inputRing} w-full mt-1`}
                />
              </div>

              <div>
                <Label text="Número" required />
                <Input
                  type="text"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  placeholder="1234"
                  className={`${errors.number ? errorRing : inputRing} w-full mt-1`}
                />
              </div>
            </div>

            <div>
              <Label text="Calle Secundaria (opcional)" />
              <Input
                type="text"
                name="street2"
                value={formData.street2}
                onChange={handleChange}
                placeholder="Entre calles"
                className={`${inputRing} w-full mt-1`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label text="Ciudad" required />
                <Input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Montevideo"
                  className={`${errors.city ? errorRing : inputRing} w-full mt-1`}
                />
              </div>

              <div>
                <Label text="Departamento" required />
                <Input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Montevideo"
                  className={`${errors.state ? errorRing : inputRing} w-full mt-1`}
                />
              </div>
            </div>

            <div>
              <Label text="Teléfono" required />
              <Input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="09X XXX XXX"
                className={`${errors.phone ? errorRing : inputRing} w-full mt-1`}
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">
                  Ingresá un teléfono válido de 9 dígitos
                </p>
              )}
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
                {address ? 'Actualizar' : 'Agregar'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;