/**
 * Auth Service - Tu Crédito Frontend
 * Servicio de autenticación mock (temporal, usar localStorage)
 * 
 * TODO: Integrar con backend real y reemplazar localStorage por httpOnly cookies
 * TODO: Implementar refresh token automático
 * SECURITY NOTE: localStorage NO es seguro para tokens en producción
 */

import type { LoginCredentials, AuthTokens, User } from '../types/auth';
import { STORAGE_KEYS } from '../app/config/constants';

/**
 * Servicio de autenticación
 */
export const authService = {
  /**
   * Inicia sesión con credenciales
   */
  async login(_credentials: LoginCredentials): Promise<AuthTokens> {
    // TODO: Implementar petición real al backend
    // const tokens = await api.post<AuthTokens>('/auth/token/', credentials);
    
    // Mock temporal
    const tokens: AuthTokens = {
      access: 'mock_access_token_' + Date.now(),
      refresh: 'mock_refresh_token_' + Date.now(),
    };

    // Guardar tokens en localStorage (TEMPORAL)
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, tokens.access);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh);

    return tokens;
  },

  /**
   * Cierra sesión
   */
  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && token.length > 0;
  },

  /**
   * Obtiene el token de acceso actual
   */
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  /**
   * Obtiene el refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  /**
   * Obtiene información del usuario actual
   * TODO: Implementar endpoint real del backend
   */
  async getCurrentUser(): Promise<User | null> {
    // TODO: Implementar petición real
    // const user = await api.get<User>('/auth/me/');
    
    // Mock temporal
    if (!this.isAuthenticated()) {
      return null;
    }

    return {
      id: 1,
      username: 'admin',
      email: 'admin@tucredito.com',
      first_name: 'Admin',
      last_name: 'User',
    };
  },

  /**
   * Refresca el token de acceso
   * TODO: Implementar refresh real
   */
  async refreshToken(): Promise<AuthTokens | null> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      return null;
    }

    try {
      // TODO: Implementar petición real
      // const tokens = await api.post<AuthTokens>('/auth/token/refresh/', {
      //   refresh: refreshToken,
      // });
      
      // Mock temporal
      const tokens: AuthTokens = {
        access: 'mock_access_token_' + Date.now(),
        refresh: refreshToken, // Mantener el mismo refresh token
      };

      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, tokens.access);
      
      return tokens;
    } catch {
      this.logout();
      return null;
    }
  },
};
