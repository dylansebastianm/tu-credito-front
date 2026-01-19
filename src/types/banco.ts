/**
 * Banco Types - Tu Crédito Frontend
 */

export interface Banco {
  id: number;
  nombre: string;
  tipo: 'PRIVADO' | 'GOBIERNO';
  direccion?: string;
}

export interface BancoCreate {
  nombre: string;
  tipo: 'PRIVADO' | 'GOBIERNO';
  direccion?: string;
}

export interface BancoUpdate extends Partial<BancoCreate> {}
