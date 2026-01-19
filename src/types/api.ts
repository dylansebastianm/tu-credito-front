/**
 * API Types - Tu Crédito Frontend
 * Tipos para respuestas de la API Django REST Framework
 */

/**
 * Respuesta paginada de Django REST Framework
 */
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Respuesta de error de la API
 */
export interface ApiErrorResponse {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
  [key: string]: unknown;
}

/**
 * Opciones para peticiones API
 */
export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | null | undefined>;
  requireAuth?: boolean;
}
