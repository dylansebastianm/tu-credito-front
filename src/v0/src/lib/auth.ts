// Simple auth state management for Tu Crédito
import type { User, AuthState } from './types';

const AUTH_KEY = 'tucredito_auth';

// Mock user
const mockUser: User = {
  id: 'user-001',
  email: 'admin@tucredito.com',
  nombre: 'Administrador',
  rol: 'admin',
};

export const getAuthState = (): AuthState => {
  if (typeof window === 'undefined') {
    return { user: null, isAuthenticated: false };
  }
  
  const stored = localStorage.getItem(AUTH_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { user: null, isAuthenticated: false };
    }
  }
  return { user: null, isAuthenticated: false };
};

export const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock validation
  if (email === 'admin@tucredito.com' && password === 'admin123') {
    const state: AuthState = { user: mockUser, isAuthenticated: true };
    localStorage.setItem(AUTH_KEY, JSON.stringify(state));
    return { success: true };
  }
  
  return { success: false, error: 'Credenciales inválidas. Usa: admin@tucredito.com / admin123' };
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const isAuthenticated = (): boolean => {
  return getAuthState().isAuthenticated;
};
