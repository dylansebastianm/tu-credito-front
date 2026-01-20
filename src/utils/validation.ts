/**
 * Validation Utilities - Tu Crédito Frontend
 * Funciones de validación para formularios
 */

/**
 * Valida formato de email
 */
export function isValidEmail(email: string): boolean {
  if (!email || !email.trim()) {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Valida formato de teléfono
 * Acepta formatos como: +52 55 1234 5678, (55) 1234-5678, 5512345678, etc.
 */
export function isValidPhone(phone: string): boolean {
  if (!phone || !phone.trim()) {
    return false;
  }
  // Remover espacios, guiones, paréntesis y el símbolo +
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  // Debe tener entre 10 y 15 dígitos
  const phoneRegex = /^\d{10,15}$/;
  return phoneRegex.test(cleaned);
}

/**
 * Valida que un string no esté vacío
 */
export function isRequired(value: string | number | undefined | null): boolean {
  if (value === undefined || value === null) {
    return false;
  }
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  return true;
}

/**
 * Valida que un número sea mayor que 0
 */
export function isPositiveNumber(value: number | string | undefined | null): boolean {
  if (value === undefined || value === null || value === '') {
    return false;
  }
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && num > 0;
}

/**
 * Valida que un número esté en un rango
 */
export function isInRange(
  value: number | string | undefined | null,
  min: number,
  max: number
): boolean {
  if (value === undefined || value === null || value === '') {
    return false;
  }
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && num >= min && num <= max;
}

/**
 * Obtiene mensaje de error para email
 */
export function getEmailError(email: string): string | null {
  if (!isRequired(email)) {
    return 'El email es requerido';
  }
  if (!isValidEmail(email)) {
    return 'El formato del email no es válido';
  }
  return null;
}

/**
 * Obtiene mensaje de error para teléfono
 */
export function getPhoneError(phone: string): string | null {
  if (!isRequired(phone)) {
    return 'El teléfono es requerido';
  }
  if (!isValidPhone(phone)) {
    return 'El formato del teléfono no es válido. Debe tener entre 10 y 15 dígitos';
  }
  return null;
}
