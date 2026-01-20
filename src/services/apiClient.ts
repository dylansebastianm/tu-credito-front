/**
 * API Client - Tu Crédito Frontend
 * Wrapper para fetch con manejo de autenticación y errores
 */

import { ENV } from '../app/config/env';
import { ApiError } from '../utils/error';
import type { ApiRequestOptions, ApiErrorResponse } from '../types/api';
import { buildQueryString } from '../utils/queryParams';
import { STORAGE_KEYS } from '../app/config/constants';

/**
 * Referencia al contexto de loading
 * Se inicializa dinámicamente para evitar dependencias circulares
 */
let loadingContext: { incrementLoading: () => void; decrementLoading: () => void } | null = null;

/**
 * Establece el contexto de loading
 * Debe ser llamado desde el componente que tiene acceso al contexto
 */
export function setLoadingContext(context: { incrementLoading: () => void; decrementLoading: () => void }): void {
  loadingContext = context;
}

/**
 * Obtiene el token de autenticación
 */
function getAuthToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
}

/**
 * Cliente API base
 */
export async function apiClient<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    params,
    requireAuth = true,
  } = options;

  // Construir URL con query params
  let url = `${ENV.API_BASE_URL}${endpoint}`;
  if (params) {
    url += buildQueryString(params);
  }

  // Headers por defecto
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Agregar token de autenticación si es requerido
  if (requireAuth) {
    const token = getAuthToken();
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  // Configuración de la petición
  const config: RequestInit = {
    method,
    headers: defaultHeaders,
  };

  // Agregar body si existe
  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  // Activar loading ANTES del fetch
  loadingContext?.incrementLoading();

  try {
    const response = await fetch(url, config);

    // Manejar errores HTTP
    if (!response.ok) {
      let errorResponse: ApiErrorResponse | undefined;
      
      try {
        errorResponse = await response.json();
      } catch {
        // Si no se puede parsear el JSON, usar el texto del error
      }

      const errorMessage = errorResponse?.detail || errorResponse?.message || response.statusText;
      throw new ApiError(errorMessage, response.status, errorResponse);
    }

    // Si la respuesta está vacía (204 No Content), retornar null
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return null as T;
    }

    // Parsear JSON
    return await response.json();
  } catch (error) {
    // Re-lanzar ApiError
    if (error instanceof ApiError) {
      throw error;
    }

    // Otros errores (red, parse, etc.)
    throw new ApiError(
      error instanceof Error ? error.message : 'Error de red desconocido',
      0
    );
  } finally {
    // Desactivar loading siempre, incluso si hay error
    loadingContext?.decrementLoading();
  }
}

/**
 * Métodos de conveniencia
 */
export const api = {
  get: <T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method'>) =>
    apiClient<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    apiClient<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    apiClient<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    apiClient<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method'>) =>
    apiClient<T>(endpoint, { ...options, method: 'DELETE' }),
};
