import React from "react";
import Input from "components/ui/Input";

const PersonalInfo = ({
  name, setName,
  surname, setSurname,
  email, setEmail,
  birthDate, setBirthDate,
  password, setPassword
}) => {
  return (
    <>
      <label className="block">
        <span className="text-sm">Nombre</span>
        <Input
          type="text"
          placeholder="Juan"
          className="bg-white w-full mt-1 p-2 border border-gray-300 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label className="block">
        <span className="text-sm">Apellido</span>
        <Input
          type="text"
          placeholder="Pérez"
          className="bg-white w-full mt-1 p-2 border border-gray-300 rounded"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          required
        />
      </label>

      <label className="block">
        <span className="text-sm">Email</span>
        <Input
          type="email"
          placeholder="juan.perez@example.com"
          className="bg-white w-full mt-1 p-2 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </label>

      <label className="block">
        <span className="text-sm">Fecha de nacimiento</span>
        <Input
          type="date"
          className="bg-white w-full mt-1 p-2 border border-gray-300 rounded"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          required
        />
      </label>

      <label className="block">
        <span className="text-sm">Contraseña</span>
        <Input
          type="password"
          placeholder="Contraseña"
          className="bg-white w-full mt-1 p-2 border border-gray-300 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
    </>
  );
};

export default PersonalInfo;
