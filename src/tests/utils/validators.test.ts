/**
 * Tests para validators - Tu Crédito Frontend
 * Tests para validaciones de formularios
 */

import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isNotEmpty,
  isPositive,
  isInRange,
} from '../../utils/validators';

describe('isValidEmail', () => {
  it('debe validar emails correctos', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    expect(isValidEmail('user+tag@example.com')).toBe(true);
  });

  it('debe rechazar emails inválidos', () => {
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('user@domain')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });
});

describe('isNotEmpty', () => {
  it('debe validar strings no vacíos', () => {
    expect(isNotEmpty('texto')).toBe(true);
    expect(isNotEmpty('  texto  ')).toBe(true);
  });

  it('debe rechazar valores vacíos', () => {
    expect(isNotEmpty('')).toBe(false);
    expect(isNotEmpty('   ')).toBe(false);
    expect(isNotEmpty(null)).toBe(false);
    expect(isNotEmpty(undefined)).toBe(false);
  });
});

describe('isPositive', () => {
  it('debe validar números positivos', () => {
    expect(isPositive(1)).toBe(true);
    expect(isPositive(100)).toBe(true);
    expect(isPositive(0.1)).toBe(true);
  });

  it('debe validar strings numéricos positivos', () => {
    expect(isPositive('1')).toBe(true);
    expect(isPositive('100')).toBe(true);
    expect(isPositive('0.1')).toBe(true);
  });

  it('debe rechazar números no positivos', () => {
    expect(isPositive(0)).toBe(false);
    expect(isPositive(-1)).toBe(false);
    expect(isPositive(-100)).toBe(false);
  });

  it('debe rechazar valores inválidos', () => {
    expect(isPositive('invalid')).toBe(false);
    expect(isPositive(NaN)).toBe(false);
  });
});

describe('isInRange', () => {
  it('debe validar números dentro del rango', () => {
    expect(isInRange(5, 1, 10)).toBe(true);
    expect(isInRange(1, 1, 10)).toBe(true); // límite inferior
    expect(isInRange(10, 1, 10)).toBe(true); // límite superior
  });

  it('debe validar strings numéricos dentro del rango', () => {
    expect(isInRange('5', 1, 10)).toBe(true);
    expect(isInRange('1', 1, 10)).toBe(true);
  });

  it('debe rechazar números fuera del rango', () => {
    expect(isInRange(0, 1, 10)).toBe(false);
    expect(isInRange(11, 1, 10)).toBe(false);
    expect(isInRange(-5, 1, 10)).toBe(false);
  });

  it('debe rechazar valores inválidos', () => {
    expect(isInRange('invalid', 1, 10)).toBe(false);
    expect(isInRange(NaN, 1, 10)).toBe(false);
  });
});
