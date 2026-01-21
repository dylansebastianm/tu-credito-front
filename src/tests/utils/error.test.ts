/**
 * Tests para error utilities - Tu Crédito Frontend
 * Tests críticos para manejo de errores del servidor
 */

import { describe, it, expect } from 'vitest';
import { ApiError, getErrorMessage } from '../../utils/error';
import type { ApiErrorResponse } from '../../types/api';

describe('ApiError', () => {
  it('debe crear un error con mensaje y status', () => {
    const error = new ApiError('Error de prueba', 400);
    
    expect(error.message).toBe('Error de prueba');
    expect(error.status).toBe(400);
    expect(error.name).toBe('ApiError');
  });

  it('debe incluir la respuesta del servidor', () => {
    const response: ApiErrorResponse = {
      detail: 'Error detallado',
    };
    const error = new ApiError('Error', 400, response);
    
    expect(error.response).toEqual(response);
  });
});

describe('getErrorMessage', () => {
  it('debe extraer mensaje de details (prioridad 1)', () => {
    const response: ApiErrorResponse = {
      details: {
        email: ['Este campo es requerido'],
        nombre_completo: ['Este campo no puede estar vacío'],
      },
    };
    const error = new ApiError('Error', 400, response);
    
    const message = getErrorMessage(error);
    
    expect(message).toContain('Email: Este campo es requerido');
    expect(message).toContain('Nombre Completo: Este campo no puede estar vacío');
  });

  it('debe extraer mensaje de errors (prioridad 2)', () => {
    const response: ApiErrorResponse = {
      errors: {
        monto: ['Este campo debe ser mayor a 0'],
      },
    };
    const error = new ApiError('Error', 400, response);
    
    const message = getErrorMessage(error);
    
    expect(message).toContain('Monto: Este campo debe ser mayor a 0');
  });

  it('debe usar detail si no hay details ni errors (prioridad 3)', () => {
    const response: ApiErrorResponse = {
      detail: 'Error detallado del servidor',
    };
    const error = new ApiError('Error genérico', 400, response);
    
    const message = getErrorMessage(error);
    
    expect(message).toBe('Error detallado del servidor');
  });

  it('debe usar message solo si no hay details ni errors (prioridad 4)', () => {
    const response: ApiErrorResponse = {
      message: 'Mensaje genérico',
    };
    const error = new ApiError('Error', 400, response);
    
    const message = getErrorMessage(error);
    
    expect(message).toBe('Mensaje genérico');
  });

  it('debe usar el mensaje del error si no hay respuesta', () => {
    const error = new ApiError('Error sin respuesta', 400);
    
    const message = getErrorMessage(error);
    
    expect(message).toBe('Error sin respuesta');
  });

  it('debe manejar errores que no son ApiError', () => {
    const error = new Error('Error estándar');
    
    const message = getErrorMessage(error);
    
    expect(message).toBe('Error estándar');
  });

  it('debe manejar errores desconocidos', () => {
    const message = getErrorMessage('string error');
    
    expect(message).toBe('Ha ocurrido un error desconocido');
  });

  it('debe traducir nombres de campos correctamente', () => {
    const response: ApiErrorResponse = {
      details: {
        fecha_nacimiento: ['Fecha inválida'],
        tipo_persona: ['Campo requerido'],
        pago_minimo: ['Debe ser positivo'],
      },
    };
    const error = new ApiError('Error', 400, response);
    
    const message = getErrorMessage(error);
    
    expect(message).toContain('Fecha de Nacimiento');
    expect(message).toContain('Tipo de Persona');
    expect(message).toContain('Pago Mínimo');
  });

  it('debe manejar múltiples mensajes por campo', () => {
    const response: ApiErrorResponse = {
      details: {
        email: [
          'Este campo es requerido',
          'Debe ser un email válido',
        ],
      },
    };
    const error = new ApiError('Error', 400, response);
    
    const message = getErrorMessage(error);
    
    expect(message).toContain('Email: Este campo es requerido');
    expect(message).toContain('Email: Debe ser un email válido');
  });

  it('debe priorizar details sobre errors', () => {
    const response: ApiErrorResponse = {
      details: {
        email: ['Error en details'],
      },
      errors: {
        email: ['Error en errors'],
      },
    };
    const error = new ApiError('Error', 400, response);
    
    const message = getErrorMessage(error);
    
    // Debe usar details, no errors
    expect(message).toContain('Error en details');
    expect(message).not.toContain('Error en errors');
  });

  it('debe priorizar details sobre detail', () => {
    const response: ApiErrorResponse = {
      details: {
        email: ['Error en details'],
      },
      detail: 'Error en detail',
    };
    const error = new ApiError('Error', 400, response);
    
    const message = getErrorMessage(error);
    
    // Debe usar details, no detail
    expect(message).toContain('Error en details');
    // Verificar que el mensaje completo no sea solo "Error en detail" (sin 's')
    // El mensaje debe ser "Email: Error en details", no "Error en detail"
    expect(message).not.toBe('Error en detail');
    expect(message).toContain('Email:');
  });
});
