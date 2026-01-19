/**
 * Validation Utilities - Tu Crédito Frontend
 */

/**
 * Valida un email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida que un string no esté vacío
 */
export function isNotEmpty(value: string | null | undefined): boolean {
  return value !== null && value !== undefined && value.trim().length > 0;
}

/**
 * Valida que un número sea positivo
 */
export function isPositive(value: number | string): boolean {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(numValue) && numValue > 0;
}

/**
 * Valida que un número esté en un rango
 */
export function isInRange(value: number | string, min: number, max: number): boolean {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(numValue) && numValue >= min && numValue <= max;
}
