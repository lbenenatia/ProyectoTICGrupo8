import React from "react";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";

const DeliveryOptionsCard = ({
  selectedOption,
  onOptionChange,
  deliveryAddress,
  addresses,
  onAddAddress,
  onEditAddress,
  onSelectAddress,
  onDeleteAddress,
}) => {
  const DeliveryOptions = [
    { id: "delivery", title: "Delivery", icon: "Truck" },
    { id: "pickup", title: "Retiro en local", icon: "MapPin" },
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-warm">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Opciones de entrega
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {DeliveryOptions.map((option) => (
          <div
            key={option.id}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-warm ${
              selectedOption === option.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => onOptionChange(option.id)}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  selectedOption === option.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <Icon name={option.icon} size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-text-primary">{option.title}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Domicilios */}
      {selectedOption === "delivery" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-text-primary">
              Domicilios guardados
            </h4>
            <Button
              variant="ghost"
              size="sm"
              iconName="Plus"
              onClick={onAddAddress}
            >
              Agregar domicilio
            </Button>
          </div>

          {addresses.length > 0 ? (
            addresses.map((addr) => (
              <div
                key={addr.id}
                className={`p-4 bg-background rounded-lg border-2 cursor-pointer transition-all duration-200 flex justify-between items-start ${
                  deliveryAddress?.id === addr.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div 
                  className="flex-1"
                  onClick={() => onSelectAddress(addr)}
                >
                  <p className="font-medium text-text-primary">
                    {addr.label || "Domicilio"}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {addr.address1} {addr.number && `#${addr.number}`}
                  </p>
                  {addr.address2 && (
                    <p className="text-sm text-text-secondary">
                      Entre {addr.address2}
                    </p>
                  )}
                  <p className="text-sm text-text-secondary">
                    {addr.city}, {addr.state}
                  </p>
                  {addr.phone && (
                    <p className="text-sm text-text-secondary">
                      Tel: {addr.phone}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="xs"
                    iconName="Edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditAddress(addr);
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="xs"
                    iconName="Trash"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteAddress(addr.id);
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 border-2 border-dashed border-border rounded-lg">
              <Icon name="MapPin" size={32} className="text-text-secondary mx-auto mb-2" />
              <p className="text-text-secondary mb-3">
                No hay domicilios guardados
              </p>
            </div>
          )}
        </div>
      )}
      
      {selectedOption === "pickup" && (
        <div className="p-4 bg-background rounded-lg border border-border">
          <p className="text-sm text-text-secondary">Lo levantás en el local.</p>
        </div>
      )}
    </div>
  );
};

export default DeliveryOptionsCard;