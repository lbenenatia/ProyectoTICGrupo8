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

  // Si el usuario intentó acceder a una página protegida, redirige ahí después del login
  const from = location.state?.from?.pathname || "/homepage";

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    try {
      // 🔥 Usa la función login del AuthContext (no hagas fetch directo)
      const userData = await login({ email, password });

      console.log("Usuario autenticado:", userData);

      // 🔥 Redirige una vez que el AuthContext ya tiene el usuario
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "No se pudo iniciar sesión");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Iniciar sesión
        </h1>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <form
          onSubmit={handleSubmit}
          className="space-y-3 bg-white p-6 rounded shadow"
        >
          <label className="block">
            <span className="text-sm">Email</span>
            <input
              type="email"
              placeholder="Email"
              autoComplete="email"
              className="w-full mt-1 p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="block">
            <span className="text-sm">Contraseña</span>
            <input
              type="password"
              placeholder="Contraseña"
              autoComplete="current-password"
              className="w-full mt-1 p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded w-full"
              disabled={loading}
            >
              {loading ? "Iniciando..." : "Iniciar sesión"}
            </button>
          </div>
        </form>

        <div className="text-sm text-center mt-4">
          <Link to="/forgot-password" className="text-primary hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
          <span className="mx-2 text-text-secondary">|</span>
          <Link to="/register" className="text-primary hover:underline">
            Registrarse
          </Link>
        </div>
      </div>
    </main>
  );
}
