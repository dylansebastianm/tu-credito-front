/**
 * Banco Types - Tu Crédito Frontend
 */

/**
 * Banco completo desde el backend
 */
export interface Banco {
  id: number;
  nombre: string;
  codigo: string;
  tipo: 'PRIVADO' | 'GOBIERNO';
  tipo_display?: string; // "Privado" | "Gobierno"
  direccion?: string;
  email?: string;
  telefono?: string;
  sitio_web?: string;
  tasa_interes_min?: string; // Decimal como string desde backend
  tasa_interes_max?: string; // Decimal como string desde backend
  plazo_minimo?: number;
  plazo_maximo?: number;
  monto_minimo?: string; // Decimal como string desde backend
  monto_maximo?: string; // Decimal como string desde backend
  estado: 'activo' | 'inactivo';
  estado_display?: string; // "Activo" | "Inactivo"
  creditos_activos?: number; // Calculado en backend
  created_at?: string; // ISO datetime string
  updated_at?: string; // ISO datetime string
}

/**
 * Banco simplificado para listado
 */
export interface BancoListItem {
  id: number;
  nombre: string;
  codigo: string;
  tipo: 'PRIVADO' | 'GOBIERNO';
  tipo_display?: string;
  tasa_interes_min?: string;
  tasa_interes_max?: string;
  estado: 'activo' | 'inactivo';
  estado_display?: string;
  creditos_activos?: number;
}

/**
 * Datos para crear un banco
 */
export interface BancoCreate {
  nombre: string;
  codigo: string;
  tipo: 'PRIVADO' | 'GOBIERNO';
  direccion?: string;
  email?: string;
  telefono?: string;
  sitio_web?: string;
  tasa_interes_min?: number | string;
  tasa_interes_max?: number | string;
  plazo_minimo?: number;
  plazo_maximo?: number;
  monto_minimo?: number | string;
  monto_maximo?: number | string;
  estado?: 'activo' | 'inactivo';
}

/**
 * Datos para actualizar un banco
 */
export interface BancoUpdate extends Partial<BancoCreate> {}
