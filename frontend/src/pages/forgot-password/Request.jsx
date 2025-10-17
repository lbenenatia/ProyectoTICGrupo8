import React, { useState } from 'react';
import { fetchJson } from 'lib/api';
import { Link } from 'react-router-dom';

export default function ForgotPasswordRequest() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      await fetchJson('/auth/password-reset', { method: 'POST', body: JSON.stringify({ email }) });
      setStatus({ ok: true, message: 'If that email exists we sent instructions to reset your password.' });
    } catch (err) {
      setStatus({ ok: false, message: err.message || 'Request failed' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-semibold mb-4">Restablecer contraseña</h1>
        <p className="text-sm text-text-secondary mb-4">Ingresa el correo electrónico de tu cuenta y te enviaremos instrucciones para restablecer tu contraseña.</p>
        {status && (
          <div className={`${status.ok ? 'text-green-700' : 'text-red-700'} mb-3`}>{status.message}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block">
            <span className="text-sm">Email</span>
            <input className="w-full mt-1 p-2 border rounded" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
          </label>
          <div className="flex justify-end">
            <button className="bg-primary text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Enviando…' : 'Enviar instrucciones'}</button>
          </div>
        </form>
        <div className="text-sm text-center mt-4">
          <Link to="/login" className="text-primary hover:underline">Iniciar sesión</Link>
          <span className="mx-2 text-text-secondary">|</span>
          <Link to="/register" className="text-primary hover:underline">Registrarse</Link>
        </div>
      </div>
    </main>
  );
}
