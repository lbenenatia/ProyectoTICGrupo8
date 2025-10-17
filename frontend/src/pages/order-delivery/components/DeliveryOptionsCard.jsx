import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const DeliveryOptionsCard = ({ selectedOption, onOptionChange, deliveryAddress, onAddressChange }) => {
  const [showAddressForm, setShowAddressForm] = useState(false);

  const deliveryOptions = [
    {
      id: 'delivery',
      title: 'Delivery',
      description: 'Get it delivered to your door',
      icon: 'Truck',
      time: '25-35 min',
      fee: 2.99
    },
    {
      id: 'pickup',
      title: 'Pickup',
      description: 'Pick up from our store',
      icon: 'MapPin',
      time: '15-20 min',
      fee: 0
    }
  ];

  const timeSlots = [
    { value: 'asap', label: 'ASAP (25-35 min)' },
    { value: '12:00', label: '12:00 PM' },
    { value: '12:30', label: '12:30 PM' },
    { value: '13:00', label: '1:00 PM' },
    { value: '13:30', label: '1:30 PM' },
    { value: '14:00', label: '2:00 PM' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-warm">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Delivery Options</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {deliveryOptions?.map((option) => (
          <div
            key={option?.id}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-warm ${
              selectedOption === option?.id
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
            }`}
            onClick={() => onOptionChange(option?.id)}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                selectedOption === option?.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                <Icon name={option?.icon} size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-text-primary">{option?.title}</h4>
                <p className="text-sm text-text-secondary">{option?.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-medium text-primary">{option?.time}</span>
                  <span className="text-sm text-text-secondary">
                    {option?.fee > 0 ? `$${option?.fee?.toFixed(2)}` : 'Free'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedOption === 'delivery' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-text-primary">Delivery Address</h4>
            <Button
              variant="ghost"
              size="sm"
              iconName="Plus"
              onClick={() => setShowAddressForm(!showAddressForm)}
            >
              Add New
            </Button>
          </div>

          {deliveryAddress ? (
            <div className="p-4 bg-background rounded-lg border border-border">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-text-primary">{deliveryAddress?.label}</p>
                  <p className="text-sm text-text-secondary mt-1">{deliveryAddress?.address}</p>
                  <p className="text-sm text-text-secondary">{deliveryAddress?.city}, {deliveryAddress?.state} {deliveryAddress?.zip}</p>
                </div>
                <Button variant="ghost" size="sm" iconName="Edit" />
              </div>
            </div>
          ) : (
            <div className="p-4 bg-background rounded-lg border border-border border-dashed">
              <p className="text-text-secondary text-center">No delivery address selected</p>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                className="mt-2"
                onClick={() => setShowAddressForm(true)}
              >
                Add Delivery Address
              </Button>
            </div>
          )}

          {showAddressForm && (
            <div className="space-y-4 p-4 bg-background rounded-lg border border-border">
              <h5 className="font-medium text-text-primary">Add New Address</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Address Label"
                  placeholder="Home, Work, etc."
                />
                <Input
                  label="Street Address"
                  placeholder="123 Main St"
                />
                <Input
                  label="City"
                  placeholder="New York"
                />
                <Input
                  label="State"
                  placeholder="NY"
                />
                <Input
                  label="ZIP Code"
                  placeholder="10001"
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="flex space-x-3">
                <Button variant="default" size="sm">Save Address</Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddressForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      {selectedOption === 'pickup' && (
        <div className="space-y-4">
          <h4 className="font-medium text-text-primary">Pickup Location</h4>
          <div className="p-4 bg-background rounded-lg border border-border">
            <div className="flex items-start space-x-3">
              <Icon name="MapPin" size={20} className="text-primary mt-1" />
              <div>
                <p className="font-medium text-text-primary">PizzaBurger Hub - Downtown</p>
                <p className="text-sm text-text-secondary mt-1">123 Main Street, New York, NY 10001</p>
                <p className="text-sm text-text-secondary">Phone: (555) 123-4567</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-xs bg-success text-success-foreground px-2 py-1 rounded">Open until 11:00 PM</span>
                  <Button variant="ghost" size="xs" iconName="Navigation">
                    Get Directions
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="mt-6">
        <Select
          label="Preferred Time"
          options={timeSlots}
          value="asap"
          onChange={() => {}}
          placeholder="Select delivery time"
        />
      </div>
    </div>
  );
};

export default DeliveryOptionsCard;