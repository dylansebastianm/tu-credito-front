/**
 * Credito Types - Tu Crédito Frontend
 */

import type { ClienteListItem } from './cliente';
import type { BancoInfo } from './cliente';

/**
 * Crédito completo desde el backend
 */
export interface Credito {
  id: number;
  cliente: number; // ID del cliente
  cliente_info?: ClienteListItem; // Información completa del cliente (solo en detail)
  descripcion: string;
  pago_minimo: string; // Decimal como string desde el backend
  pago_maximo: string; // Decimal como string desde el backend
  plazo_meses: number;
  fecha_registro: string; // ISO datetime string
  banco: number; // ID del banco
  banco_info?: BancoInfo; // Información completa del banco (solo en detail)
  tipo_credito: 'AUTOMOTRIZ' | 'HIPOTECARIO' | 'COMERCIAL';
  tipo_credito_display?: string; // "Automotriz" | "Hipotecario" | "Comercial"
  tasa_interes: string; // Decimal como string (tasa anual %)
  cuota_mensual: string; // Decimal como string (calculado automáticamente)
  monto_total: string; // Decimal como string (calculado automáticamente)
  created_at?: string; // ISO datetime string
  updated_at?: string; // ISO datetime string
}

/**
 * Crédito simplificado para listado
 */
export interface CreditoListItem {
  id: number;
  cliente_nombre: string;
  descripcion: string;
  pago_minimo: string;
  pago_maximo: string;
  plazo_meses: number;
  fecha_registro: string; // ISO datetime string
  banco_nombre: string;
  tipo_credito: 'AUTOMOTRIZ' | 'HIPOTECARIO' | 'COMERCIAL';
  tipo_credito_display?: string;
  tasa_interes: string; // Decimal como string
  cuota_mensual: string; // Decimal como string
  monto_total: string; // Decimal como string
}

/**
 * Datos para crear un crédito
 */
export interface CreditoCreate {
  cliente: number;
  descripcion: string;
  pago_minimo: string; // Decimal como string (ej: "1000.00")
  pago_maximo: string; // Decimal como string (ej: "5000.00")
  plazo_meses: number;
  banco: number;
  tipo_credito: 'AUTOMOTRIZ' | 'HIPOTECARIO' | 'COMERCIAL';
  tasa_interes: string; // Decimal como string (ej: "12.00" para 12%)
}

/**
 * Datos para actualizar un crédito
 */
export interface CreditoUpdate extends Partial<CreditoCreate> {}
