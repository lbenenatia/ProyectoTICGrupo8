import React from "react";
import Input from "components/ui/Input";

const AddressInfo = ({ 
  label, setLabel,
  address1, setAddress1,
  address2, setAddress2,
  number, setNumber,
  city, setCity,
  state, setState,
  zipCode, setZipCode,
  Phone, setPhone
}) => {
  return (
    <>
      <label className="block">
        <span className="text-sm">Etiqueta</span>
        <Input
          type="text"
          placeholder="Casa, Trabajo, etc."
          className="bg-white w-full mt-1 p-2 border border-gray-300 rounded"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          required
        />
      </label>

      <label className="block">
        <span className="text-sm">Calle 1</span>
        <Input
          type="text"
          placeholder="Av. Italia"
          className="bg-white w-full mt-1 p-2 border border-gray-300 rounded"
          value={address1}
          onChange={(e) => setAddress1(e.target.value)}
          required
        />
      </label>

      <label className="block">
        <span className="text-sm">Calle 2 (Opcional)</span>
        <Input
          type="text"
          placeholder="Av. Bolivia"
          className="bg-white w-full mt-1 p-2 border border-gray-300 rounded"
          value={address2}
          onChange={(e) => setAddress2(e.target.value)}
          required
        />
      </label>

      <label className="block">
        <span className="text-sm">Número</span>
        <Input
          type="text"
          placeholder="1234"
          className="bg-white w-full mt-1 p-2 border border-gray-300 rounded"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          required
        />
      </label>

      <label className="block">
        <span className="text-sm">Ciudad</span>
        <Input
          type="text"
          placeholder="Montevideo"
          className="bg-white w-full mt-1 p-2 border border-gray-300 rounded"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
      </label>

      <label className="block">
        <span className="text-sm">Departamento</span>
        <Input
          type="text"
          placeholder="Montevideo"
          className="bg-white w-full mt-1 p-2 border border-gray-300 rounded"
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
        />
      </label>

      <label className="block">
        <span className="text-sm">Código Zip</span>
        <Input
          type="text"
          placeholder="12345"
          className="bg-white w-full mt-1 p-2 border border-gray-300 rounded"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          required
        />
      </label>

      <label className="block">
        <span className="text-sm">Telefono</span>
        <Input
          type="text"
          placeholder="Casa, Trabajo, etc."
          className="bg-white w-full mt-1 p-2 border border-gray-300 rounded"
          value={Phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </label>
    </>
  );
};

export default AddressInfo;
