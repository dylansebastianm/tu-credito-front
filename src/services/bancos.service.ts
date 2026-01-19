/**
 * Bancos Service - Tu Crédito Frontend
 * Stub de servicio para bancos
 * TODO: Implementar lógica real cuando el backend esté listo
 */

import type { Banco, BancoCreate, BancoUpdate } from '../types/banco';
import type { PaginatedResponse } from '../types/api';

/**
 * Servicio de bancos
 */
export const bancosService = {
  /**
   * Obtiene lista paginada de bancos
   */
  async getAll(_params?: {
    page?: number;
    page_size?: number;
    search?: string;
    tipo?: string;
    ordering?: string;
  }): Promise<PaginatedResponse<Banco>> {
    // TODO: Implementar petición real
    // return api.get<PaginatedResponse<Banco>>('/bancos/', { params });
    
    throw new Error('Not implemented yet');
  },

  /**
   * Obtiene un banco por ID
   */
  async getById(_id: number): Promise<Banco> {
    // TODO: Implementar petición real
    // return api.get<Banco>(`/bancos/${id}/`);
    
    throw new Error('Not implemented yet');
  },

  /**
   * Crea un nuevo banco
   */
  async create(_data: BancoCreate): Promise<Banco> {
    // TODO: Implementar petición real
    // return api.post<Banco>('/bancos/', data);
    
    throw new Error('Not implemented yet');
  },

  /**
   * Actualiza un banco
   */
  async update(_id: number, _data: BancoUpdate): Promise<Banco> {
    // TODO: Implementar petición real
    // return api.patch<Banco>(`/bancos/${id}/`, data);
    
    throw new Error('Not implemented yet');
  },

  /**
   * Elimina un banco
   */
  async delete(_id: number): Promise<void> {
    // TODO: Implementar petición real
    // return api.delete<void>(`/bancos/${id}/`);
    
    throw new Error('Not implemented yet');
  },
};
