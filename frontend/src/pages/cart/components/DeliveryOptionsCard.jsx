import React, { useState, useEffect } from "react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Icon from "../../../components/AppIcon";

const DeliveryOptionsCard = ({
  selectedOption,
  onOptionChange,
  deliveryAddress,
  onAddressChange,
}) => {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    label: "",
    street1: "",
    street2: "",
    number: "",
    city: "",
    state: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("addresses");
    if (saved) {
      const parsed = JSON.parse(saved);
      setAddresses(parsed);
      if (parsed.length > 0 && !deliveryAddress) onAddressChange(parsed[0]);
    }
  }, []);

  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(""), 3000);
    return () => clearTimeout(t);
  }, [successMessage]);

  const requiredFields = ["street1", "number", "city", "state", "phone"];

  const validateForm = () => {
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!form[field].trim()) newErrors[field] = true;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateInput = (name, value) => {
    let regex;
    switch (name) {
      case "number":
        regex = /^[0-9]*$/;
        break;
      case "phone":
        regex = /^[0-9 ]*$/;
        break;
      case "city":
      case "state":
      case "street1":
      case "street2":
      case "label":
        regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ,.()-]*$/;
        break;
      default:
        regex = /^[^<>%$#@!^*{}[\]\\|]*$/;
    }
    return regex.test(value);
  };

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 9);
    return digits.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const inputType = e.nativeEvent?.inputType;

    if (!validateInput(name, value)) return;

    let formatted = value;
    if (name === "phone" && inputType !== "deleteContentBackward") {
      formatted = formatPhone(value);
    }

    setForm((prev) => ({ ...prev, [name]: formatted }));

    if (formatted.trim() !== "") {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleSaveAddress = () => {
    if (!validateForm()) {
      setSuccessMessage("Completá todos los campos obligatorios.");
      return;
    }

    const phoneDigits = form.phone.replace(/\D/g, "");
    if (phoneDigits.length !== 9) {
      setErrors((prev) => ({ ...prev, phone: true }));
      setSuccessMessage("Ingresá un teléfono válido 9 dígitos.");
      return;
    }

    const newAddress = { ...form, id: Date.now() };
    const updated = [...addresses, newAddress];
    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));
    onAddressChange(newAddress);
    setShowAddressForm(false);
    setForm({
      label: "",
      street1: "",
      street2: "",
      number: "",
      city: "",
      state: "",
      phone: "",
    });
    setErrors({});
    setSuccessMessage("Dirección guardada correctamente.");
  };

  const handleDeleteAddress = (id) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));
    if (deliveryAddress?.id === id) onAddressChange(null);
  };

  const inputRing =
    "ring-1 ring-border focus:ring-2 focus:ring-primary/60 focus:border-primary/60 rounded-md transition-shadow";
  const errorRing =
    "ring-1 ring-red-500 focus:ring-2 focus:ring-red-400 focus:border-red-400 rounded-md transition-shadow";

  const Label = ({ text, required }) => (
    <span className="font-medium text-text-primary">
      {text}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </span>
  );

  return (
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
            description: "Entrega a domicilio",
            icon: "Truck",
          },
          {
            id: "pickup",
            title: "Retiro en local",
            description: "Pasá a buscar tu pedido",
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
              variant="ghost"
              size="sm"
              iconName={showAddressForm ? "X" : "Plus"}
              onClick={() => {
                setShowAddressForm(!showAddressForm);
                setSuccessMessage("");
              }}
            >
              {showAddressForm ? "Cancelar" : "Agregar nuevo"}
            </Button>
          </div>

          {successMessage && (
            <p
              className={`text-sm font-medium ${
                successMessage.startsWith("⚠️")
                  ? "text-red-500"
                  : "text-green-600"
              }`}
            >
              {successMessage}
            </p>
          )}

          {addresses.length > 0 ? (
            addresses.map((addr) => (
              <div
                key={addr.id}
                onClick={() => onAddressChange(addr)}
                className={`p-4 bg-background rounded-lg border-2 cursor-pointer transition-all duration-200 flex justify-between items-start ${
                  deliveryAddress?.id === addr.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div className="flex-1">
                  <p className="font-medium text-text-primary">
                    {addr.label || "Domicilio"}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {addr.street1} {addr.number && `#${addr.number}`}
                  </p>
                  {addr.street2 && (
                    <p className="text-sm text-text-secondary">
                      Entre {addr.street2}
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
                <Button
                  variant="ghost"
                  size="xs"
                  iconName="Trash"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAddress(addr.id);
                  }}
                />
              </div>
            ))
          ) : (
            <p className="text-sm text-text-secondary">
              No hay domicilios guardados.
            </p>
          )}

          {/* Formulario */}
          {showAddressForm && (
            <div className="space-y-4 p-4 bg-background rounded-lg border border-border mt-4">
              <h5 className="font-medium text-text-primary">Nuevo domicilio</h5>

              <Input
                label={<Label text="Etiqueta" />}
                name="label"
                placeholder="Casa, trabajo..."
                value={form.label}
                onChange={handleInputChange}
                className={inputRing}
              />

              <Input
                label={<Label text="Calle 1" required />}
                name="street1"
                placeholder="Av. 18 de Julio"
                value={form.street1}
                onChange={handleInputChange}
                className={errors.street1 ? errorRing : inputRing}
              />

              <Input
                label={<Label text="Calle 2 (opcional)" />}
                name="street2"
                placeholder="Entre calles"
                value={form.street2}
                onChange={handleInputChange}
                className={inputRing}
              />

              <Input
                label={<Label text="Número" required />}
                name="number"
                placeholder="1234"
                value={form.number}
                onChange={handleInputChange}
                className={errors.number ? errorRing : inputRing}
              />

              <Input
                label={<Label text="Ciudad" required />}
                name="city"
                placeholder="Montevideo"
                value={form.city}
                onChange={handleInputChange}
                className={errors.city ? errorRing : inputRing}
              />

              <Input
                label={<Label text="Departamento" required />}
                name="state"
                placeholder="Montevideo"
                value={form.state}
                onChange={handleInputChange}
                className={errors.state ? errorRing : inputRing}
              />

              <Input
                label={<Label text="Teléfono" required />}
                name="phone"
                placeholder="09X XXX XXX"
                value={form.phone}
                onChange={handleInputChange}
                className={errors.phone ? errorRing : inputRing}
              />

              <Button variant="default" size="sm" onClick={handleSaveAddress}>
                Guardar dirección
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeliveryOptionsCard;
