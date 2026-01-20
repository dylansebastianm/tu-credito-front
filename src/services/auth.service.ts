/**
 * Auth Service - Tu Crédito Frontend
 * Servicio de autenticación conectado al backend
 * 
 * SECURITY NOTE: localStorage NO es seguro para tokens en producción
 * En producción, considerar usar httpOnly cookies
 */

import { api } from './apiClient';
import type { LoginCredentials, RegisterCredentials, AuthTokens, User, RegisterResponse } from '../types/auth';
import { STORAGE_KEYS } from '../app/config/constants';

/**
 * Servicio de autenticación
 * 
 * NOTA: Las contraseñas se envían en texto plano pero viajan por HTTPS (encriptadas en tránsito).
 * El backend hashea automáticamente las contraseñas antes de guardarlas en la base de datos.
 */
export const authService = {
  /**
   * Inicia sesión con credenciales
   * Las credenciales viajan encriptadas por HTTPS.
   */
  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    const tokens = await api.post<AuthTokens>(
      '/auth/token/',
      credentials,
      { requireAuth: false }
    );

    // Guardar tokens en localStorage
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, tokens.access);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh);

    return tokens;
  },

  /**
   * Registra un nuevo usuario
   * La contraseña se hashea automáticamente en el backend antes de guardar.
   * Las credenciales viajan encriptadas por HTTPS.
   * 
   * IMPORTANTE: Solo los superusuarios pueden crear usuarios.
   * Requiere autenticación JWT y que el usuario tenga is_superuser=true.
   */
  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>(
      '/auth/register/',
      credentials,
      { requireAuth: true }  // Requiere autenticación
    );

    return response;
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
   */
  async getCurrentUser(): Promise<User | null> {
    if (!this.isAuthenticated()) {
      return null;
    }

    try {
      const user = await api.get<User>('/auth/me/');
      return user;
    } catch {
      // Si falla, retornar null (token inválido o expirado)
      return null;
    }
  },

  /**
   * Refresca el token de acceso
   */
  async refreshToken(): Promise<AuthTokens | null> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      return null;
    }

    try {
      const tokens = await api.post<AuthTokens>(
        '/auth/token/refresh/',
        { refresh: refreshToken },
        { requireAuth: false }
      );

      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, tokens.access);
      if (tokens.refresh) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh);
      }
      
      return tokens;
    } catch {
      this.logout();
      return null;
    }
  },
};
