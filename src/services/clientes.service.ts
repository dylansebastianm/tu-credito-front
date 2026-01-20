/**
 * Clientes Service - Tu Crédito Frontend
 * Servicio para gestionar clientes con el backend
 */

import { api } from './apiClient';
import type { Cliente, ClienteCreate, ClienteUpdate, ClienteListItem } from '../types/cliente';
import type { PaginatedResponse } from '../types/api';

/**
 * Parámetros para listar clientes
 */
export interface ClientesListParams {
  page?: number;
  page_size?: number;
  search?: string;
  tipo_persona?: 'NATURAL' | 'JURIDICO';
  banco?: number;
  edad?: number;
  ordering?: string;
}

/**
 * Servicio de clientes
 */
export const clientesService = {
  /**
   * Obtiene lista paginada de clientes
   */
  async getAll(params?: ClientesListParams): Promise<PaginatedResponse<ClienteListItem>> {
    const queryParams: Record<string, string | number> = {};
    
    if (params?.page) queryParams.page = params.page;
    if (params?.page_size) queryParams.page_size = params.page_size;
    if (params?.search) queryParams.search = params.search;
    if (params?.tipo_persona) queryParams.tipo_persona = params.tipo_persona;
    if (params?.banco) queryParams.banco = params.banco;
    if (params?.edad) queryParams.edad = params.edad;
    if (params?.ordering) queryParams.ordering = params.ordering;

    return api.get<PaginatedResponse<ClienteListItem>>('/clientes/', {
      params: queryParams,
    });
  },

  /**
   * Obtiene un cliente por ID
   */
  async getById(id: number): Promise<Cliente> {
    return api.get<Cliente>(`/clientes/${id}/`);
  },

  /**
   * Crea un nuevo cliente
   */
  async create(data: ClienteCreate): Promise<Cliente> {
    return api.post<Cliente>('/clientes/', data);
  },

  /**
   * Actualiza un cliente (parcial)
   */
  async update(id: number, data: ClienteUpdate): Promise<Cliente> {
    return api.patch<Cliente>(`/clientes/${id}/`, data);
  },

  /**
   * Actualiza un cliente (completo)
   */
  async updateFull(id: number, data: ClienteCreate): Promise<Cliente> {
    return api.put<Cliente>(`/clientes/${id}/`, data);
  },

  /**
   * Elimina un cliente
   */
  async delete(id: number): Promise<void> {
    return api.delete<void>(`/clientes/${id}/`);
  },
};
