// Small fetch wrapper to manage Authorization header using a stored token.
const STORAGE_KEY = 'authToken';
let token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;

export function setAuthToken(newToken) {
  token = newToken;
  if (typeof window !== 'undefined') {
    if (newToken) localStorage.setItem(STORAGE_KEY, newToken);
    else localStorage.removeItem(STORAGE_KEY);
  }
}

export async function fetchJson(path, options = {}) {
  const base = import.meta.env.VITE_API_BASE_URL || '';
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(base + path, {
    ...options,
    headers,
  });

  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }

  if (!res.ok) {
    const err = new Error(data?.message || res.statusText || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export default { setAuthToken, fetchJson };
