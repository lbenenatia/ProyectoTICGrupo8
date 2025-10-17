import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchJson } from 'lib/api';

export default function ForgotPasswordReset() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!token) return setError('Missing reset token');
    if (!password || password.length < 6) return setError('Password must be at least 6 characters');
    if (password !== confirm) return setError('Passwords do not match');
    setLoading(true);
    try {
      await fetchJson('/auth/password-reset/confirm', { method: 'POST', body: JSON.stringify({ token, password }) });
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-semibold mb-4">Restablecer contraseña</h1>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block">
            <span className="text-sm">Nueva contraseña</span>
            <input type="password" className="w-full mt-1 p-2 border rounded" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="new-password" />
          </label>
          <label className="block">
            <span className="text-sm">Confirmar nueva contraseña</span>
            <input type="password" className="w-full mt-1 p-2 border rounded" value={confirm} onChange={e => setConfirm(e.target.value)} required autoComplete="new-password" />
          </label>
          <div className="flex justify-end">
            <button className="bg-primary text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Guardando…' : 'Establecer contraseña'}</button>
          </div>
        </form>
      </div>
    </main>
  );
}
