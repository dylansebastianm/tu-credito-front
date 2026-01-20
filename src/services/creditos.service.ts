/**
 * Creditos Service - Tu Crédito Frontend
 * Servicio para gestionar créditos con el backend
 */

import { api } from './apiClient';
import type { Credito, CreditoCreate, CreditoUpdate, CreditoListItem } from '../types/credito';
import type { PaginatedResponse } from '../types/api';

/**
 * Parámetros para listar créditos
 */
export interface CreditosListParams {
  page?: number;
  page_size?: number;
  search?: string;
  cliente?: number;
  banco?: number;
  tipo_credito?: 'AUTOMOTRIZ' | 'HIPOTECARIO' | 'COMERCIAL';
  ordering?: string;
}

/**
 * Servicio de créditos
 */
export const creditosService = {
  /**
   * Obtiene lista paginada de créditos
   */
  async getAll(params?: CreditosListParams): Promise<PaginatedResponse<CreditoListItem>> {
    const queryParams: Record<string, string | number> = {};
    
    if (params?.page) queryParams.page = params.page;
    if (params?.page_size) queryParams.page_size = params.page_size;
    if (params?.search) queryParams.search = params.search;
    if (params?.cliente) queryParams.cliente = params.cliente;
    if (params?.banco) queryParams.banco = params.banco;
    if (params?.tipo_credito) queryParams.tipo_credito = params.tipo_credito;
    if (params?.ordering) queryParams.ordering = params.ordering;

    return api.get<PaginatedResponse<CreditoListItem>>('/creditos/', {
      params: queryParams,
    });
  },

  /**
   * Obtiene un crédito por ID
   */
  async getById(id: number): Promise<Credito> {
    return api.get<Credito>(`/creditos/${id}/`);
  },

  /**
   * Crea un nuevo crédito
   */
  async create(data: CreditoCreate): Promise<Credito> {
    return api.post<Credito>('/creditos/', data);
  },

  /**
   * Actualiza un crédito (parcial)
   */
  async update(id: number, data: CreditoUpdate): Promise<Credito> {
    return api.patch<Credito>(`/creditos/${id}/`, data);
  },

  /**
   * Actualiza un crédito (completo)
   */
  async updateFull(id: number, data: CreditoCreate): Promise<Credito> {
    return api.put<Credito>(`/creditos/${id}/`, data);
  },

  /**
   * Elimina un crédito
   */
  async delete(id: number): Promise<void> {
    return api.delete<void>(`/creditos/${id}/`);
  },
};
