// Types for Tu Crédito backoffice

// Cliente types
export interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  fechaNacimiento: string;
  dni: string;
  estado: 'activo' | 'inactivo' | 'pendiente';
  fechaRegistro: string;
  creditosActivos: number;
  montoTotalCreditos: number;
}

export type ClienteFormData = Omit<Cliente, 'id' | 'fechaRegistro' | 'creditosActivos' | 'montoTotalCreditos'>;

// Credito types
export type EstadoCredito = 'pendiente' | 'aprobado' | 'rechazado' | 'activo' | 'pagado' | 'vencido';

export interface Credito {
  id: string;
  clienteId: string;
  clienteNombre: string;
  bancoId: string;
  bancoNombre: string;
  monto: number;
  tasaInteres: number;
  plazoMeses: number;
  cuotaMensual: number;
  montoTotal: number;
  estado: EstadoCredito;
  fechaSolicitud: string;
  fechaAprobacion?: string;
  fechaVencimiento?: string;
  proposito: string;
  observaciones?: string;
}

export type CreditoFormData = Omit<Credito, 'id' | 'clienteNombre' | 'bancoNombre' | 'cuotaMensual' | 'montoTotal' | 'fechaSolicitud' | 'fechaAprobacion' | 'fechaVencimiento'>;

// Banco types
export interface Banco {
  id: string;
  nombre: string;
  codigo: string;
  direccion: string;
  telefono: string;
  email: string;
  sitioWeb?: string;
  tasaInteresMin: number;
  tasaInteresMax: number;
  plazoMinimo: number;
  plazoMaximo: number;
  montoMinimo: number;
  montoMaximo: number;
  estado: 'activo' | 'inactivo';
  fechaRegistro: string;
  creditosActivos: number;
}

export type BancoFormData = Omit<Banco, 'id' | 'fechaRegistro' | 'creditosActivos'>;

// API types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ClienteFilters extends PaginatedFilters {
  estado?: Cliente['estado'];
}

export interface CreditoFilters extends PaginatedFilters {
  estado?: EstadoCredito;
  clienteId?: string;
  bancoId?: string;
}

export interface BancoFilters extends PaginatedFilters {
  estado?: Banco['estado'];
}

// Auth types
export interface User {
  id: string;
  email: string;
  nombre: string;
  rol: 'admin' | 'user';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
