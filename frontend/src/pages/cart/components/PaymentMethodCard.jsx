import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const PaymentMethodCard = ({ selectedMethod, onMethodChange, savedCards, onAddCard }) => {
  const [showCardForm, setShowCardForm] = useState(false);
  const [saveCard, setSaveCard] = useState(false);

  const paymentMethods = [
    {
      id: 'card',
      title: 'Credit/Debit Card',
      icon: 'CreditCard',
      description: 'Visa, Mastercard, American Express'
    },
    {
      id: 'paypal',
      title: 'PayPal',
      icon: 'Wallet',
      description: 'Pay with your PayPal account'
    },
    {
      id: 'apple-pay',
      title: 'Apple Pay',
      icon: 'Smartphone',
      description: 'Touch ID or Face ID'
    },
    {
      id: 'google-pay',
      title: 'Google Pay',
      icon: 'Smartphone',
      description: 'Pay with Google'
    }
  ];

  const expiryMonths = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1)?.padStart(2, '0'),
    label: String(i + 1)?.padStart(2, '0')
  }));

  const expiryYears = Array.from({ length: 10 }, (_, i) => {
    const year = new Date()?.getFullYear() + i;
    return { value: String(year), label: String(year) };
  });

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-warm">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Payment Method</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {paymentMethods?.map((method) => (
          <div
            key={method?.id}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-warm ${
              selectedMethod === method?.id
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
            }`}
            onClick={() => onMethodChange(method?.id)}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                selectedMethod === method?.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                <Icon name={method?.icon} size={20} />
              </div>
              <div>
                <h4 className="font-medium text-text-primary">{method?.title}</h4>
                <p className="text-sm text-text-secondary">{method?.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedMethod === 'card' && (
        <div className="space-y-4">
          {savedCards && savedCards?.length > 0 && (
            <div>
              <h4 className="font-medium text-text-primary mb-3">Saved Cards</h4>
              <div className="space-y-2">
                {savedCards?.map((card) => (
                  <div
                    key={card?.id}
                    className="p-3 bg-background rounded-lg border border-border cursor-pointer hover:border-primary/50 transition-warm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon name="CreditCard" size={20} className="text-primary" />
                        <div>
                          <p className="font-medium text-text-primary">•••• •••• •••• {card?.last4}</p>
                          <p className="text-sm text-text-secondary">{card?.brand} • Expires {card?.expiry}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" iconName="MoreVertical" />
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                iconName="Plus"
                className="mt-3"
                onClick={() => setShowCardForm(!showCardForm)}
              >
                Add New Card
              </Button>
            </div>
          )}

          {(showCardForm || !savedCards || savedCards?.length === 0) && (
            <div className="space-y-4 p-4 bg-background rounded-lg border border-border">
              <h5 className="font-medium text-text-primary">
                {savedCards && savedCards?.length > 0 ? 'Add New Card' : 'Card Information'}
              </h5>
              
              <Input
                label="Cardholder Name"
                placeholder="John Doe"
                required
              />
              
              <Input
                label="Card Number"
                placeholder="1234 5678 9012 3456"
                required
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    label="Expiry Month"
                    options={expiryMonths}
                    placeholder="MM"
                    required
                  />
                  <Select
                    label="Expiry Year"
                    options={expiryYears}
                    placeholder="YYYY"
                    required
                  />
                </div>
                <Input
                  label="CVV"
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>

              <Checkbox
                label="Save this card for future orders"
                checked={saveCard}
                onChange={(e) => setSaveCard(e?.target?.checked)}
              />

              {savedCards && savedCards?.length > 0 && (
                <div className="flex space-x-3">
                  <Button variant="default" size="sm">Save Card</Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCardForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {selectedMethod === 'paypal' && (
        <div className="p-4 bg-background rounded-lg border border-border">
          <div className="flex items-center space-x-3 mb-3">
            <Icon name="Wallet" size={24} className="text-primary" />
            <div>
              <p className="font-medium text-text-primary">PayPal</p>
              <p className="text-sm text-text-secondary">You'll be redirected to PayPal to complete payment</p>
            </div>
          </div>
          <Button variant="outline" size="sm" fullWidth>
            Connect PayPal Account
          </Button>
        </div>
      )}
      {(selectedMethod === 'apple-pay' || selectedMethod === 'google-pay') && (
        <div className="p-4 bg-background rounded-lg border border-border">
          <div className="flex items-center space-x-3 mb-3">
            <Icon name="Smartphone" size={24} className="text-primary" />
            <div>
              <p className="font-medium text-text-primary">
                {selectedMethod === 'apple-pay' ? 'Apple Pay' : 'Google Pay'}
              </p>
              <p className="text-sm text-text-secondary">
                {selectedMethod === 'apple-pay' ?'Use Touch ID or Face ID to pay' :'Pay with your Google account'
                }
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" fullWidth>
            Set up {selectedMethod === 'apple-pay' ? 'Apple Pay' : 'Google Pay'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodCard;