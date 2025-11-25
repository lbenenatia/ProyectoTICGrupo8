import React, { useState, useEffect } from 'react';
import Button from './Button';
import Input from './Input';
import Icon from '../AppIcon';

const AddressModal = ({ isOpen, onClose, onSave, address, userEmail }) => {
  const [formData, setFormData] = useState({
    label: '',
    address1: '',
    address2: '',
    number: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 CORREGIDO: Limpiar formulario cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen) {
      if (address) {
        // Si estamos editando, cargar los datos de la dirección
        setFormData(address);
      } else {
        // Si estamos creando nueva, limpiar el formulario
        setFormData({
          label: '',
          address1: '',
          address2: '',
          number: '',
          city: '',
          state: '',
          zipCode: '',
          phone: ''
        });
      }
      setError(null);
      setLoading(false);
    }
  }, [isOpen, address]); // 🔹 Se ejecuta cuando cambia isOpen o address

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validación básica
    if (!formData.label || !formData.address1 || !formData.number || !formData.city || !formData.state || !formData.phone) {
      setError('Por favor completa todos los campos obligatorios');
      setLoading(false);
      return;
    }

    try {
      // 🔹 CORREGIDO: Usar localStorage en lugar de API
      const userKey = userEmail || 'guest';
      const addressesKey = `addresses_${userKey}`;
      
      // Obtener direcciones existentes
      const existingAddresses = JSON.parse(localStorage.getItem(addressesKey) || '[]');
      
      let updatedAddresses;
      
      if (address) {
        // 🔹 CORREGIDO: Actualizar dirección existente
        updatedAddresses = existingAddresses.map(addr => 
          addr.id === address.id 
            ? { ...formData, id: address.id } 
            : addr
        );
      } else {
        // 🔹 CORREGIDO: Crear nueva dirección
        const newAddress = {
          ...formData,
          id: Date.now() // ID único
        };
        updatedAddresses = [...existingAddresses, newAddress];
      }

      // Guardar en localStorage
      localStorage.setItem(addressesKey, JSON.stringify(updatedAddresses));
      
      // Encontrar la dirección guardada (para edición) o usar la nueva
      const savedAddress = address 
        ? updatedAddresses.find(addr => addr.id === address.id)
        : updatedAddresses[updatedAddresses.length - 1];

      // Llamar callback de éxito
      onSave(savedAddress);
      onClose();
      
    } catch (err) {
      setError('Error al guardar dirección');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 CORREGIDO: Función para manejar el cierre correctamente
  const handleClose = () => {
    setFormData({
      label: '',
      address1: '',
      address2: '',
      number: '',
      city: '',
      state: '',
      zipCode: '',
      phone: ''
    });
    setError(null);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-text-primary">
              {address ? 'Editar Dirección' : 'Nueva Dirección'}
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Etiqueta *
                </label>
                <Input
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleChange}
                  placeholder="Casa, Trabajo, etc."
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Teléfono *
                </label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="099 123 456"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Calle Principal *
                </label>
                <Input
                  type="text"
                  name="address1"
                  value={formData.address1}
                  onChange={handleChange}
                  placeholder="Av. Italia"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Número *
                </label>
                <Input
                  type="text"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  placeholder="1234"
                  required
                  className="w-full"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Calle Secundaria (Opcional)
                </label>
                <Input
                  type="text"
                  name="address2"
                  value={formData.address2}
                  onChange={handleChange}
                  placeholder="Av. Bolivia"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Ciudad *
                </label>
                <Input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Montevideo"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Departamento *
                </label>
                <Input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Montevideo"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Código Postal *
                </label>
                <Input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="11000"
                  required
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
                {loading ? 'Guardando...' : address ? 'Actualizar' : 'Agregar'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;