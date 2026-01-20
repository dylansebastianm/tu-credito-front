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
 * Prioriza mostrar los detalles específicos de validación sobre mensajes genéricos
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const response = error.response;

    // Prioridad 1: Detalles específicos de validación (details)
    if (response?.details && typeof response.details === 'object') {
      const details = response.details as Record<string, string[]>;
      const errorMessages: string[] = [];

      // Recopilar todos los mensajes de error de todos los campos
      for (const [field, messages] of Object.entries(details)) {
        if (Array.isArray(messages) && messages.length > 0) {
          // Agregar cada mensaje con el nombre del campo si hay múltiples campos
          const fieldLabel = getFieldLabel(field);
          messages.forEach((msg) => {
            errorMessages.push(`${fieldLabel}: ${msg}`);
          });
        }
      }

      if (errorMessages.length > 0) {
        return errorMessages.join('\n');
      }
    }

    // Prioridad 2: Errores en formato errors
    if (response?.errors && typeof response.errors === 'object') {
      const errors = response.errors as Record<string, string[]>;
      const errorMessages: string[] = [];

      for (const [field, messages] of Object.entries(errors)) {
        if (Array.isArray(messages) && messages.length > 0) {
          const fieldLabel = getFieldLabel(field);
          messages.forEach((msg) => {
            errorMessages.push(`${fieldLabel}: ${msg}`);
          });
        }
      }

      if (errorMessages.length > 0) {
        return errorMessages.join('\n');
      }
    }

    // Prioridad 3: Mensaje detallado (detail)
    if (response?.detail) {
      return response.detail;
    }

    // Prioridad 4: Mensaje genérico (message) - solo si no hay detalles
    if (response?.message && !response?.details && !response?.errors) {
      return response.message;
    }

    // Última opción: mensaje del error
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Ha ocurrido un error desconocido';
}

/**
 * Convierte nombres de campos de la API a etiquetas legibles
 */
function getFieldLabel(field: string): string {
  const fieldLabels: Record<string, string> = {
    fecha_nacimiento: 'Fecha de Nacimiento',
    nombre_completo: 'Nombre Completo',
    email: 'Email',
    telefono: 'Teléfono',
    nacionalidad: 'Nacionalidad',
    tipo_persona: 'Tipo de Persona',
    cliente: 'Cliente',
    banco: 'Banco',
    descripcion: 'Descripción',
    monto: 'Monto',
    pago_minimo: 'Pago Mínimo',
    pago_maximo: 'Pago Máximo',
    plazo_meses: 'Plazo en Meses',
    tipo_credito: 'Tipo de Crédito',
    tasa_interes: 'Tasa de Interés',
    nombre: 'Nombre',
    estado: 'Estado',
    tipo: 'Tipo',
    password: 'Contraseña',
    username: 'Usuario',
  };

  return fieldLabels[field] || field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' ');
}
