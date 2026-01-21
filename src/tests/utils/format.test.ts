/**
 * Tests para format utilities - Tu Crédito Frontend
 * Tests críticos para formateo de datos financieros
 */

import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatDate,
  formatPercent,
  calculateCuotaMensual,
  calculateMontoTotal,
  getEstadoLabel,
} from '../../utils/format';

describe('formatCurrency', () => {
  it('debe formatear números positivos correctamente', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00');
    expect(formatCurrency(1000000)).toBe('$1,000,000.00');
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('debe formatear números negativos correctamente', () => {
    expect(formatCurrency(-1000)).toBe('-$1,000.00');
    expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
  });

  it('debe manejar strings numéricos', () => {
    expect(formatCurrency('1000')).toBe('$1,000.00');
    expect(formatCurrency('1234.56')).toBe('$1,234.56');
  });

  it('debe manejar valores inválidos', () => {
    expect(formatCurrency('invalid')).toBe('$0.00');
    expect(formatCurrency(NaN)).toBe('$0.00');
  });

  it('debe manejar cero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
    expect(formatCurrency('0')).toBe('$0.00');
  });

  it('debe formatear con diferentes monedas', () => {
    expect(formatCurrency(1000, 'EUR')).toContain('1,000.00');
    expect(formatCurrency(1000, 'MXN')).toContain('1,000.00');
  });
});

describe('formatDate', () => {
  it('debe formatear fechas válidas correctamente', () => {
    // Usar una fecha específica con hora para evitar problemas de zona horaria
    const date = new Date('2024-01-15T12:00:00');
    const formatted = formatDate(date);
    expect(formatted).toContain('2024');
    expect(formatted).toContain('enero');
    expect(formatted).toContain('15');
  });

  it('debe manejar strings de fecha', () => {
    const formatted = formatDate('2024-01-15');
    expect(formatted).toContain('2024');
    expect(formatted).toContain('enero');
  });

  it('debe manejar fechas inválidas', () => {
    expect(formatDate('invalid-date')).toBe('');
    expect(formatDate(new Date('invalid'))).toBe('');
  });
});

describe('formatPercent', () => {
  it('debe formatear porcentajes con 2 decimales', () => {
    expect(formatPercent(12.5)).toBe('12.50%');
    expect(formatPercent(0)).toBe('0.00%');
    expect(formatPercent(100)).toBe('100.00%');
  });

  it('debe manejar decimales largos', () => {
    expect(formatPercent(12.345678)).toBe('12.35%');
  });
});

describe('calculateCuotaMensual', () => {
  it('debe calcular la cuota mensual correctamente', () => {
    const monto = 100000;
    const tasaInteres = 12; // 12% anual
    const plazoMeses = 60; // 5 años

    const cuota = calculateCuotaMensual(monto, tasaInteres, plazoMeses);
    
    // Verificar que la cuota es un número positivo
    expect(cuota).toBeGreaterThan(0);
    // Verificar que la cuota es razonable (menor al monto)
    expect(cuota).toBeLessThan(monto);
    // Verificar que tiene máximo 2 decimales
    expect(cuota.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
  });

  it('debe manejar diferentes tasas de interés', () => {
    const monto = 100000;
    const plazoMeses = 60;

    const cuotaAlta = calculateCuotaMensual(monto, 20, plazoMeses);
    const cuotaBaja = calculateCuotaMensual(monto, 5, plazoMeses);

    // Tasa más alta = cuota más alta
    expect(cuotaAlta).toBeGreaterThan(cuotaBaja);
  });

  it('debe manejar diferentes plazos', () => {
    const monto = 100000;
    const tasaInteres = 12;

    const cuotaCorta = calculateCuotaMensual(monto, tasaInteres, 12);
    const cuotaLarga = calculateCuotaMensual(monto, tasaInteres, 120);

    // Plazo más corto = cuota más alta
    expect(cuotaCorta).toBeGreaterThan(cuotaLarga);
  });
});

describe('calculateMontoTotal', () => {
  it('debe calcular el monto total correctamente', () => {
    const cuotaMensual = 2000;
    const plazoMeses = 60;

    const total = calculateMontoTotal(cuotaMensual, plazoMeses);
    
    expect(total).toBe(120000); // 2000 * 60
  });

  it('debe redondear correctamente a 2 decimales', () => {
    const cuotaMensual = 1999.99;
    const plazoMeses = 3;

    const total = calculateMontoTotal(cuotaMensual, plazoMeses);
    
    // Debe ser aproximadamente 5999.97, redondeado
    expect(total).toBeCloseTo(5999.97, 2);
  });
});

describe('getEstadoLabel', () => {
  it('debe retornar etiquetas correctas para estados conocidos', () => {
    expect(getEstadoLabel('activo')).toBe('Activo');
    expect(getEstadoLabel('inactivo')).toBe('Inactivo');
    expect(getEstadoLabel('pendiente')).toBe('Pendiente');
    expect(getEstadoLabel('aprobado')).toBe('Aprobado');
  });

  it('debe retornar el estado original si no está en el mapeo', () => {
    expect(getEstadoLabel('estado-desconocido')).toBe('estado-desconocido');
  });
});
