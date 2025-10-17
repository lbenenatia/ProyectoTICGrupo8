import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [surname, setSurname] = useState('');
    const [birthDate, setBirthDate] = useState('');   // viene como "YYYY-MM-DD"
    const [address, setAddress] = useState('');


  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    // Construimos el objeto con los campos que tu backend espera
    const userData = {
        name,
        surname,
        email,
        birthDate,          // viene como "YYYY-MM-DD" desde el input date
        address,
        passwordHash: password,
        isActive: true,
        isEmailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    };


    try {
      const response = await fetch("http://localhost:4028/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Error al crear usuario");
      }

      // Si se crea correctamente, redirigimos al login
      navigate('/login', { replace: true });

    } catch (err) {
      console.error("Error registrando usuario:", err);
      setError(err.message || 'Registration failed');
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4 text-center">Crear cuenta</h1>
        {error && <div className="text-red-600 mb-2">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3 bg-white p-6 rounded shadow">
            <label className="block">
                <span className="text-sm">Nombre</span>
                <input type="text" className="w-full mt-1 p-2 border rounded" value={name} onChange={(e) => setName(e.target.value)} required/>
            </label>
            <label className="block">
                <span className="text-sm">Apellido</span>
                <input type="text" className="w-full mt-1 p-2 border rounded" value={surname} onChange={(e) => setSurname(e.target.value)} required/>
            </label>
            <label className="block">
                <span className="text-sm">Email</span>
                <input className="w-full mt-1 p-2 border rounded" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
            </label>
            <label className="block">
                <span className="text-sm">Fecha de nacimiento</span>
                <input type="date" className="w-full mt-1 p-2 border rounded" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required/>
            </label>
            <label className="block">
                <span className="text-sm">Domicilio</span>
                <input type="text" className="w-full mt-1 p-2 border rounded" value={address} onChange={(e) => setAddress(e.target.value)} required/>
            </label>
            <label className="block">
              <span className="text-sm">Contraseña</span>
              <input type="password" className="w-full mt-1 p-2 border rounded" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="new-password" />
            </label>

            <div className="flex items-center justify-center">
              <button type="submit" className="bg-primary text-white px-4 py-2 rounded w-full">Crear cuenta</button>
            </div>
        </form>

        <div className="text-sm text-center mt-4">
          <a href="/login" className="text-primary hover:underline">Iniciar sesión</a>
          <span className="mx-2 text-text-secondary">|</span>
          <a href="/forgot-password" className="text-primary hover:underline">¿Olvidaste tu contraseña?</a>
        </div>
      </div>
    </main>
  );
}
    