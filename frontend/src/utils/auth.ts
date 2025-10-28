import { jwtDecode } from "jwt-decode";

export type Claims = {
  role: 'ADMIN' | 'CUSTOMER';
  sub: string;
  exp: number;
};

export function getRole(): 'ADMIN' | 'CUSTOMER' | null {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const c = jwtDecode<Claims>(token);
    return c.role;
  } catch {
    return null;
  }
}
