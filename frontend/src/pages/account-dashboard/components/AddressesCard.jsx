import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AddressesCard = ({ addresses, onEditAddress, onAddAddress, onDeleteAddress }) => {
  return (
    <div className="bg-card rounded-lg p-6 shadow-warm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center space-x-2">
          <Icon name="MapPin" size={20} />
          <span>Direcciones</span>
        </h3>
        <Button variant="outline" size="sm" onClick={onAddAddress} iconName="Plus" iconPosition="left">
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
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {address.label}
                    </span>
                  </div>
                  <p className="text-sm text-text-primary font-medium">
                    {address.address1} {address.number}
                  </p>
                  {address.address2 && (
                    <p className="text-sm text-text-secondary">
                      {address.address2}
                    </p>
                  )}
                  <p className="text-sm text-text-secondary">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <div className="flex items-center space-x-1 mt-2 text-sm text-text-secondary">
                    <Icon name="Phone" size={14} />
                    <span>{address.phone}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEditAddress(address)}>
                    <Icon name="Edit2" size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDeleteAddress(address.id)} className="text-red-600 hover:text-red-700">
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
          <Button onClick={onAddAddress} iconName="Plus" iconPosition="left">
            Agregar dirección
          </Button>
        </div>
      )}
    </div>
  );
};

export default AddressesCard;
