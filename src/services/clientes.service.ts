/**
 * Clientes Service - Tu Crédito Frontend
 * Stub de servicio para clientes
 * TODO: Implementar lógica real cuando el backend esté listo
 */

import type { Cliente, ClienteCreate, ClienteUpdate } from '../types/cliente';
import type { PaginatedResponse } from '../types/api';

/**
 * Servicio de clientes
 */
export const clientesService = {
  /**
   * Obtiene lista paginada de clientes
   */
  async getAll(_params?: {
    page?: number;
    page_size?: number;
    search?: string;
    tipo_persona?: string;
    banco?: number;
    ordering?: string;
  }): Promise<PaginatedResponse<Cliente>> {
    // TODO: Implementar petición real
    // return api.get<PaginatedResponse<Cliente>>('/clientes/', { params });
    
    throw new Error('Not implemented yet');
  },

  /**
   * Obtiene un cliente por ID
   */
  async getById(_id: number): Promise<Cliente> {
    // TODO: Implementar petición real
    // return api.get<Cliente>(`/clientes/${id}/`);
    
    throw new Error('Not implemented yet');
  },

  /**
   * Crea un nuevo cliente
   */
  async create(_data: ClienteCreate): Promise<Cliente> {
    // TODO: Implementar petición real
    // return api.post<Cliente>('/clientes/', data);
    
    throw new Error('Not implemented yet');
  },

  /**
   * Actualiza un cliente
   */
  async update(_id: number, _data: ClienteUpdate): Promise<Cliente> {
    // TODO: Implementar petición real
    // return api.patch<Cliente>(`/clientes/${id}/`, data);
    
    throw new Error('Not implemented yet');
  },

  /**
   * Elimina un cliente
   */
  async delete(_id: number): Promise<void> {
    // TODO: Implementar petición real
    // return api.delete<void>(`/clientes/${id}/`);
    
    throw new Error('Not implemented yet');
  },
};
