/**
 * Error Utilities - Tu Crédito Frontend
 */

import type { ApiErrorResponse } from '../types/api';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  status: number;
  response?: ApiErrorResponse;

  constructor(message: string, status: number, response?: ApiErrorResponse) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
  }
}

/**
 * Extracts error message from API error response
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.response?.detail) {
      return error.response.detail;
    }
    if (error.response?.message) {
      return error.response.message;
    }
    if (error.response?.errors) {
      const firstError = Object.values(error.response.errors)[0];
      if (Array.isArray(firstError) && firstError.length > 0) {
        return firstError[0];
      }
    }
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Ha ocurrido un error desconocido';
}
