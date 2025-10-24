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
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  const url = path.startsWith('/api') ? `${base}${path}` : `${base}/api${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, {
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
