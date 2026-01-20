/**
 * Banco Types - Tu Crédito Frontend
 */

/**
 * Banco completo desde el backend
 */
export interface Banco {
  id: number;
  nombre: string;
  tipo: 'PRIVADO' | 'GOBIERNO';
  tipo_display?: string; // "Privado" | "Gobierno"
  direccion?: string;
  created_at?: string; // ISO datetime string
  updated_at?: string; // ISO datetime string
}

/**
 * Datos para crear un banco
 */
export interface BancoCreate {
  nombre: string;
  tipo: 'PRIVADO' | 'GOBIERNO';
  direccion?: string;
}

/**
 * Datos para actualizar un banco
 */
export interface BancoUpdate extends Partial<BancoCreate> {}
