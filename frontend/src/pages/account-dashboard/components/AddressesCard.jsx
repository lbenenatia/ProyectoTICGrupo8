import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useAuth } from 'context/AuthContext';
import { useToast } from '../../../context/ToastContext';

const AddressesCard = ({ onEditAddress, onAddAddress }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [addresses, setAddresses] = useState([]);

  // ✅ Usar la misma key que el carrito
  const getAddressesKey = () => {
    const email = user?.email || "guest";
    return `addresses_${email}`;
  };

  // ✅ Cargar direcciones del localStorage
  useEffect(() => {
    if (!user?.email) return;

    const addressesKey = getAddressesKey();
    const saved = localStorage.getItem(addressesKey);
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAddresses(Array.isArray(parsed) ? parsed : []);
      } catch {
        setAddresses([]);
      }
    } else {
      setAddresses([]);
    }
  }, [user]);

  // ✅ Escuchar cambios en localStorage (sincronización en tiempo real)
  useEffect(() => {
    const handleStorageChange = (e) => {
      const addressesKey = getAddressesKey();
      if (e.key === addressesKey) {
        try {
          const parsed = JSON.parse(e.newValue);
          setAddresses(Array.isArray(parsed) ? parsed : []);
        } catch {
          setAddresses([]);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);

  // ✅ Eliminar dirección
  const handleDeleteAddress = (addressId) => {
    if (!window.confirm('¿Estás seguro de que querés eliminar esta dirección?')) {
      return;
    }

    const addressesKey = getAddressesKey();
    const updated = addresses.filter(a => a.id !== addressId);
    
    setAddresses(updated);
    localStorage.setItem(addressesKey, JSON.stringify(updated));
    
    showToast("🗑️ Dirección eliminada correctamente");
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-warm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center space-x-2">
          <Icon name="MapPin" size={20} />
          <span>Direcciones</span>
        </h3>
        <Button size="sm" onClick={onAddAddress} iconName="Plus" iconPosition="left">
          Agregar
        </Button>
      </div>

      {addresses && addresses.length > 0 ? (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address.id} className="border border-border rounded-lg p-4 hover:border-primary transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="MapPin" size={20} className="text-primary" />
                    {address.label && (
                      <span className="text-sm font-medium text-text-primary">
                        {address.label}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-primary font-medium">
                    {address.street1 || address.address1} {address.number && `#${address.number}`}
                  </p>
                  {(address.street2 || address.address2) && (
                    <p className="text-sm text-text-secondary">
                      Entre {address.street2 || address.address2}
                    </p>
                  )}
                  <p className="text-sm text-text-secondary">
                    {address.city}, {address.state}
                  </p>
                  {address.phone && (
                    <div className="flex items-center space-x-1 mt-2 text-sm text-text-secondary">
                      <Icon name="Phone" size={14} />
                      <span>{address.phone}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEditAddress(address)}
                    title="Editar dirección"
                  >
                    <Icon name="Edit2" size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteAddress(address.id)} 
                    className="text-destructive hover:bg-destructive/10"
                    title="Eliminar dirección"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Icon name="MapPin" size={48} className="mx-auto text-text-secondary mb-3" />
          <p className="text-text-secondary mb-4">No tenés direcciones guardadas</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onAddAddress}
            iconName="Plus"
            iconPosition="left"
          >
            Agregar primera dirección
          </Button>
        </div>
      )}
    </div>
  );
};

export default AddressesCard;