import React from "react";
import Input from "components/ui/Input";

const CardInfo = ({
  cardNumber, setCardNumber,
  cardHolder, setCardHolder,
  cardExpiry, setCardExpiry,
  cardCVV, setCardCVV
}) => {

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  };

  const formatExpiry = (value) => {
    return value
      .replace(/[^0-9/]/g, "")
      .slice(0, 5)
      .replace(/^(\d{2})(\d)/, "$1/$2");
  };

  return (
    <>
      <label className="block">
        <span className="text-sm">Número de tarjeta</span>
        <Input
          type="text"
          placeholder="1111 2222 3333 4444"
          className="bg-white w-full mt-1 p-2 border border-gray-300 rounded"
          value={cardNumber}
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          required
        />
      </label>

      <label className="block">
        <span className="text-sm">Titular</span>
        <Input
          type="text"
          placeholder="Juan Pérez"
          className="bg-white w-full mt-1 p-2 border border-gray-300 rounded"
          value={cardHolder}
          onChange={(e) => setCardHolder(e.target.value)}
          required
        />
      </label>

      <label className="block">
        <span className="text-sm">Vencimiento (MM/AA)</span>
        <Input
          type="text"
          placeholder="12/28"
          className="bg-white w-full mt-1 p-2 border border-gray-300 rounded"
          value={cardExpiry}
          onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
          required
        />
      </label>

      <label className="block">
        <span className="text-sm">CVV</span>
        <Input
          type="password"
          placeholder="•••"
          maxLength={3}
          className="bg-white w-full mt-1 p-2 border border-gray-300 rounded"
          value={cardCVV}
          onChange={(e) => setCardCVV(e.target.value)}
          required
        />
      </label>
    </>
  );
};

export default CardInfo;
