/**
 * Cliente Types - Tu Crédito Frontend
 */

/**
 * Información básica del banco (usado en banco_info)
 */
export interface BancoInfo {
  id: number;
  nombre: string;
  tipo: 'PRIVADO' | 'GOBIERNO';
  tipo_display: string;
  direccion?: string;
}

/**
 * Cliente completo desde el backend
 */
export interface Cliente {
  id: number;
  nombre_completo: string;
  fecha_nacimiento: string; // ISO date string (YYYY-MM-DD)
  edad: number;
  nacionalidad?: string;
  direccion?: string;
  email: string;
  telefono?: string;
  tipo_persona: 'NATURAL' | 'JURIDICO';
  tipo_persona_display?: string; // "Persona Natural" | "Persona Jurídica"
  banco?: number; // ID del banco
  banco_info?: BancoInfo; // Información completa del banco (solo en detail)
  created_at?: string; // ISO datetime string
  updated_at?: string; // ISO datetime string
}

/**
 * Cliente simplificado para listado
 */
export interface ClienteListItem {
  id: number;
  nombre_completo: string;
  email: string;
  telefono?: string;
  edad: number;
  tipo_persona: 'NATURAL' | 'JURIDICO';
  tipo_persona_display?: string;
}

/**
 * Datos para crear un cliente
 */
export interface ClienteCreate {
  nombre_completo: string;
  fecha_nacimiento: string; // YYYY-MM-DD
  nacionalidad?: string;
  direccion?: string;
  email: string;
  telefono?: string;
  tipo_persona: 'NATURAL' | 'JURIDICO';
  banco?: number;
}

/**
 * Datos para actualizar un cliente
 */
export interface ClienteUpdate extends Partial<ClienteCreate> {}
