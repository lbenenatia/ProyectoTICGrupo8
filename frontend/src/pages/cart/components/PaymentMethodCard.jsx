import React, { useState, useEffect } from "react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Icon from "../../../components/AppIcon";

const PaymentMethodCard = ({ selectedMethod, onMethodChange }) => {
  const [cards, setCards] = useState([]);
  const [showCardForm, setShowCardForm] = useState(false);
  const [form, setForm] = useState({ number: "", holder: "", expiry: "", cvv: "" });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [showCVV, setShowCVV] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("savedCards");
    if (saved) setCards(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(""), 3000);
    return () => clearTimeout(t);
  }, [successMessage]);

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "");
    const trimmed = digits.slice(0, 16);
    return trimmed.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  };

  const validateInput = (name, value) => {
    let regex;
    switch (name) {
      case "number":
        regex = /^[0-9 ]*$/;
        break;
      case "holder":
        regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]*$/;
        break;
      case "expiry":
        regex = /^[0-9/]*$/;
        break;
      case "cvv":
        regex = /^[0-9]*$/;
        break;
      default:
        regex = /^[^<>%$#@!^*{}[\]\\|]*$/;
    }
    return regex.test(value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (!validateInput(name, value)) return;

    let formatted = value;
    if (name === "number") formatted = formatCardNumber(value);
    if (name === "expiry") {
      formatted = value
        .replace(/[^0-9/]/g, "")
        .slice(0, 5)
        .replace(/^(\d{2})(\d)/, "$1/$2");
    }

    setForm((prev) => ({ ...prev, [name]: formatted }));
    if (formatted.trim() !== "") setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (form.number.replace(/\s/g, "").length !== 16) newErrors.number = true;
    if (!form.holder.trim()) newErrors.holder = true;
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) newErrors.expiry = true;
    if (form.cvv.length !== 3) newErrors.cvv = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveCard = () => {
    if (!validateForm()) {
      setSuccessMessage("Verificá que todos los campos estén completos y válidos.");
      return;
    }

    const newCard = { id: Date.now(), ...form };
    const updated = [...cards, newCard];
    setCards(updated);
    localStorage.setItem("savedCards", JSON.stringify(updated));
    setShowCardForm(false);
    setForm({ number: "", holder: "", expiry: "", cvv: "" });
    setErrors({});
    setSuccessMessage("Tarjeta guardada correctamente.");
  };

  const handleDeleteCard = (id) => {
    const updated = cards.filter((c) => c.id !== id);
    setCards(updated);
    localStorage.setItem("savedCards", JSON.stringify(updated));
    if (selectedCard === id) setSelectedCard(null);
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

  const paymentMethods = [
    { id: "card", title: "Tarjeta", icon: "CreditCard" },
    { id: "cash", title: "Efectivo", icon: "Wallet" },
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-warm">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Método de pago</h3>

      {/* Métodos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-warm ${
              selectedMethod === method.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => {
              onMethodChange(method.id);
              setSuccessMessage("");
            }}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  selectedMethod === method.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <Icon name={method.icon} size={20} />
              </div>
              <h4 className="font-medium text-text-primary">{method.title}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Tarjetas */}
      {selectedMethod === "card" && (
        <div className="space-y-4">
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

          {cards.length > 0 && (
            <>
              <h4 className="font-medium text-text-primary mb-2">Tus tarjetas</h4>
              {cards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => setSelectedCard(card.id)}
                  className={`p-3 bg-background rounded-lg border-2 cursor-pointer transition-all duration-200 flex justify-between items-center ${
                    selectedCard === card.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <div>
                    <p className="font-medium text-text-primary">
                      •••• {card.number.slice(-4)}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {card.holder} • Vence {card.expiry}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="xs"
                    iconName="Trash"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCard(card.id);
                    }}
                  />
                </div>
              ))}
            </>
          )}

          {!showCardForm && (
            <Button
              variant="outline"
              size="sm"
              iconName="Plus"
              onClick={() => {
                setShowCardForm(true);
                setSuccessMessage("");
              }}
            >
              Agregar nueva tarjeta
            </Button>
          )}

          {showCardForm && (
            <div className="space-y-3 p-4 bg-background rounded-lg border border-border mt-3">
              <h5 className="font-medium text-text-primary">Nueva tarjeta</h5>

              <Input
                label={<Label text="Número de tarjeta" required />}
                name="number"
                placeholder="1111 2222 3333 4444"
                value={form.number}
                onChange={handleInputChange}
                className={errors.number ? errorRing : inputRing}
              />

              <Input
                label={<Label text="Titular" required />}
                name="holder"
                placeholder="Nombre del titular"
                value={form.holder}
                onChange={handleInputChange}
                className={errors.holder ? errorRing : inputRing}
              />

              <Input
                label={<Label text="Fecha de vencimiento (MM/AA)" required />}
                name="expiry"
                placeholder="12/28"
                value={form.expiry}
                onChange={handleInputChange}
                className={errors.expiry ? errorRing : inputRing}
              />

              <div className="relative">
                <Input
                  type={showCVV ? "text" : "password"}
                  label={<Label text="CVV" required />}
                  name="cvv"
                  placeholder="•••"
                  maxLength={3}
                  value={form.cvv}
                  onChange={handleInputChange}
                  className={`${errors.cvv ? errorRing : inputRing} pr-10`}
                />
                <button
                  type="button"
                  className="absolute right-3 bottom-2.5 text-text-secondary hover:text-text-primary"
                  onClick={() => setShowCVV((prev) => !prev)}
                >
                  <Icon name={showCVV ? "EyeOff" : "Eye"} size={18} />
                </button>
              </div>

              <div className="flex space-x-3">
                <Button variant="default" size="sm" onClick={handleSaveCard}>
                  Guardar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowCardForm(false);
                    setErrors({});
                    setSuccessMessage("");
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {selectedMethod === "cash" && (
        <div className="p-4 bg-background rounded-lg border border-border">
          <p className="text-sm text-text-secondary">Abonás al recibir el pedido.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodCard;
