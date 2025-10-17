import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "context/AuthContext";

console.log("Componente login cargado");

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();

  const from = location.state?.from?.pathname || "/account-dashboard";

async function handleSubmit(e) {
  e.preventDefault();
  setError(null);

  try {
    const response = await fetch("http://localhost:4028/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Error al iniciar sesión");
    }

    const user = await response.json();
    console.log("Usuario autenticado:", user);

    // Podés guardar al usuario si tenés un contexto global
    // localStorage.setItem("user", JSON.stringify(user));

    console.log("Login correcto, redirigiendo...");
    navigate("/");
  } catch (err) {
    setError(err.message || "No se pudo iniciar sesión");
  }

  console.log("Login completo, navegando...");

}

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4 text-center">Iniciar sesión</h1>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3 bg-white p-6 rounded shadow">
          <label className="block">
            <span className="text-sm">Email</span>
            <input type="email" placeholder="Email" autoComplete="email" className="w-full mt-1 p-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="block">
            <span className="text-sm">Contraseña</span>
            <input type="password" placeholder="Contraseña" autoComplete="current-password" className="w-full mt-1 p-2 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <div className="flex items-center justify-center">
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded w-full" disabled={loading}>
              {loading ? 'Iniciando...' : 'Iniciar sesión'}
            </button>
          </div>
        </form>

        <div className="text-sm text-center mt-4">
          <Link to="/forgot-password" className="text-primary hover:underline">¿Olvidaste tu contraseña?</Link>
          <span className="mx-2 text-text-secondary">|</span>
          <Link to="/register" className="text-primary hover:underline">Registrarse</Link>
        </div>
      </div>
    </main>
  );
}