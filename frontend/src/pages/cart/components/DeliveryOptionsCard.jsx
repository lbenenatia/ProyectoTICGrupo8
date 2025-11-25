import React, { useState, useEffect } from "react";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";
import AddressModal from "../../../components/ui/AddressModal";
import { useAuth } from "context/AuthContext";

const DeliveryOptionsCard = ({
  selectedOption,
  onOptionChange,
  deliveryAddress,
  onAddressChange,
}) => {
  const { user } = useAuth();

  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const getAddressesKey = () => {
    const email = user?.email || "guest";
    return `addresses_${email}`;
  };

  useEffect(() => {
    if (!user?.email) return;

    const addressesKey = getAddressesKey();
    const saved = localStorage.getItem(addressesKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAddresses(parsed);

        if (parsed.length > 0 && !deliveryAddress) {
          onAddressChange(parsed[parsed.length - 1]);
        }
      } catch {
        setAddresses([]);
      }
    }
  }, [user]);

  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(""), 3000);
    return () => clearTimeout(t);
  }, [successMessage]);

  const handleSaveAddress = (addressData) => {
    const addressesKey = getAddressesKey();

    if (editingAddress) {
      // Actualizar dirección existente
      const updated = addresses.map((addr) =>
        addr.id === editingAddress.id ? { ...addressData, id: editingAddress.id } : addr
      );
      setAddresses(updated);
      localStorage.setItem(addressesKey, JSON.stringify(updated));
      
      if (deliveryAddress?.id === editingAddress.id) {
        onAddressChange({ ...addressData, id: editingAddress.id });
      }
      
      setSuccessMessage("Dirección actualizada correctamente.");
    } else {
      // Agregar nueva dirección
      const newAddress = { ...addressData, id: Date.now() };
      const updated = [...addresses, newAddress];
      setAddresses(updated);
      localStorage.setItem(addressesKey, JSON.stringify(updated));
      onAddressChange(newAddress);
      setSuccessMessage("Dirección guardada correctamente.");
    }

    setShowAddressModal(false);
    setEditingAddress(null);
  };

  const handleDeleteAddress = (id) => {
    if (!window.confirm("¿Estás seguro de que querés eliminar esta dirección?")) {
      return;
    }

    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);

    const addressesKey = getAddressesKey();
    localStorage.setItem(addressesKey, JSON.stringify(updated));

    if (deliveryAddress?.id === id) {
      onAddressChange(updated.length > 0 ? updated[0] : null);
    }

    setSuccessMessage("Dirección eliminada correctamente.");
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddressModal(true);
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setShowAddressModal(true);
  };

  const deliveryOptions = [
    { id: "delivery", title: "Delivery", icon: "Truck" },
    { id: "pickup", title: "Pick up", icon: "MapPin" },
  ];

  return (
    <>
      <div className="bg-card rounded-lg border border-border p-6 shadow-warm">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Opciones de entrega
        </h3>

        {/* Opciones Delivery / Pickup */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            {
              id: "delivery",
              title: "Delivery",
              icon: "Truck",
            },
            {
              id: "pickup",
              title: "Pick up",
              icon: "MapPin",
            },
          ].map((option) => (
            <div
              key={option.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-warm ${
                selectedOption === option.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => {
                onOptionChange(option.id);
                setSuccessMessage("");
              }}
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
                  <p className="text-sm text-text-secondary">
                    {option.description}
                  </p>
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
                variant="default"
                size="sm"
                iconName="Plus"
                onClick={handleAddNewAddress}
              >
                Agregar nuevo
              </Button>
            </div>

            {successMessage && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-700 flex items-center gap-2">
                  <Icon name="CheckCircle" size={16} />
                  {successMessage}
                </p>
              </div>
            )}

            {addresses.length > 0 ? (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => onAddressChange(addr)}
                    className={`p-4 bg-background rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      deliveryAddress?.id === addr.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon 
                            name={deliveryAddress?.id === addr.id ? "CheckCircle" : "MapPin"} 
                            size={16} 
                            className={deliveryAddress?.id === addr.id ? "text-primary" : "text-text-secondary"}
                          />
                          <p className="font-medium text-text-primary">
                            {addr.label || "Domicilio"}
                          </p>
                        </div>
                        <p className="text-sm text-text-secondary">
                          {addr.street1 || addr.address1} {addr.number && `#${addr.number}`}
                        </p>
                        {(addr.street2 || addr.address2) && (
                          <p className="text-sm text-text-secondary">
                            Entre {addr.street2 || addr.address2}
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
                      <div className="flex items-center gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="xs"
                          iconName="Edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditAddress(addr);
                          }}
                          title="Editar dirección"
                        />
                        <Button
                          variant="ghost"
                          size="xs"
                          iconName="Trash"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(addr.id);
                          }}
                          title="Eliminar dirección"
                          className="text-destructive hover:bg-destructive/10"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-background rounded-lg border border-border">
                <Icon name="MapPin" size={48} className="text-text-secondary mx-auto mb-3" />
                <p className="text-sm text-text-secondary mb-4">
                  No hay domicilios guardados.
                </p>
              </div>
            )}
          </div>
        )}

        {selectedOption === "pickup" && (
          <div className="p-4 bg-background rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <Icon name="MapPin" size={20} className="text-text-secondary" />
              </div>
              <div>
                <p className="font-medium text-text-primary mb-1">Retiro en local</p>
                <p className="text-sm text-text-secondary">
                  Lo levantás en el local.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Dirección */}
      <AddressModal
        isOpen={showAddressModal}
        onClose={() => {
          setShowAddressModal(false);
          setEditingAddress(null);
        }}
        onSave={handleSaveAddress}
        address={editingAddress}
        userEmail={user?.email}
      />
    </>
  );
};

export default DeliveryOptionsCard;