/**
 * Creditos Service - Tu Crédito Frontend
 * Stub de servicio para créditos
 * TODO: Implementar lógica real cuando el backend esté listo
 */

import type { Credito, CreditoCreate, CreditoUpdate } from '../types/credito';
import type { PaginatedResponse } from '../types/api';

/**
 * Servicio de créditos
 */
export const creditosService = {
  /**
   * Obtiene lista paginada de créditos
   */
  async getAll(_params?: {
    page?: number;
    page_size?: number;
    search?: string;
    cliente?: number;
    banco?: number;
    tipo_credito?: string;
    ordering?: string;
  }): Promise<PaginatedResponse<Credito>> {
    // TODO: Implementar petición real
    // return api.get<PaginatedResponse<Credito>>('/creditos/', { params });
    
    throw new Error('Not implemented yet');
  },

  /**
   * Obtiene un crédito por ID
   */
  async getById(_id: number): Promise<Credito> {
    // TODO: Implementar petición real
    // return api.get<Credito>(`/creditos/${id}/`);
    
    throw new Error('Not implemented yet');
  },

  /**
   * Crea un nuevo crédito
   */
  async create(_data: CreditoCreate): Promise<Credito> {
    // TODO: Implementar petición real
    // return api.post<Credito>('/creditos/', data);
    
    throw new Error('Not implemented yet');
  },

  /**
   * Actualiza un crédito
   */
  async update(_id: number, _data: CreditoUpdate): Promise<Credito> {
    // TODO: Implementar petición real
    // return api.patch<Credito>(`/creditos/${id}/`, data);
    
    throw new Error('Not implemented yet');
  },

  /**
   * Elimina un crédito
   */
  async delete(_id: number): Promise<void> {
    // TODO: Implementar petición real
    // return api.delete<void>(`/creditos/${id}/`);
    
    throw new Error('Not implemented yet');
  },
};
