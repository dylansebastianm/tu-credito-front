/**
 * Cliente Types - Tu Crédito Frontend
 */

export interface Cliente {
  id: number;
  nombre_completo: string;
  fecha_nacimiento: string; // ISO date string
  edad: number;
  nacionalidad?: string;
  direccion?: string;
  email: string;
  telefono?: string;
  tipo_persona: 'NATURAL' | 'JURIDICO';
  banco?: number; // ID del banco
}

export interface ClienteCreate {
  nombre_completo: string;
  fecha_nacimiento: string;
  nacionalidad?: string;
  direccion?: string;
  email: string;
  telefono?: string;
  tipo_persona: 'NATURAL' | 'JURIDICO';
  banco?: number;
}

export interface ClienteUpdate extends Partial<ClienteCreate> {}
