import React, { createContext, useState, useEffect, useContext } from "react";
import { fetchJson, setAuthToken } from '../lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      const token = localStorage.getItem('authToken');
      if (token) setAuthToken(token);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

    useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Real API-backed login
  async function login({ email, password }) {
    if (!email || !password) throw new Error("Email and password are required");
    setLoading(true);
    try {
      // expected response: { token: 'jwt', user: { ... } }
      const data = await fetchJson('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (!data?.token) throw new Error('Invalid login response');

      setAuthToken(data.token);
      localStorage.setItem('authToken', data.token);
      
      const userData = data.user || { email };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } finally {
      setLoading(false);
    }
  }

  // register function
  async function register({ name, email, password }) {
    if (!email || !password || !name) throw new Error('Name, email and password are required');
    setLoading(true);
    try {
      const data = await fetchJson('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      return data;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}