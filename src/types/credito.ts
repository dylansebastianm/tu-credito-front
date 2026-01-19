/**
 * Credito Types - Tu Crédito Frontend
 */

export interface Credito {
  id: number;
  cliente: number; // ID del cliente
  descripcion: string;
  pago_minimo: string; // Decimal como string
  pago_maximo: string; // Decimal como string
  plazo_meses?: number;
  fecha_registro: string; // ISO date string
  banco: number; // ID del banco
  tipo_credito: 'AUTOMOTRIZ' | 'HIPOTECARIO' | 'COMERCIAL';
}

export interface CreditoCreate {
  cliente: number;
  descripcion: string;
  pago_minimo: string;
  pago_maximo: string;
  plazo_meses?: number;
  banco: number;
  tipo_credito: 'AUTOMOTRIZ' | 'HIPOTECARIO' | 'COMERCIAL';
}

export interface CreditoUpdate extends Partial<CreditoCreate> {}
