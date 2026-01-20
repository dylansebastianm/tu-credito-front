/**
 * Bancos Service - Tu Crédito Frontend
 * Servicio para gestionar bancos con el backend
 */

import { api } from './apiClient';
import type { Banco, BancoCreate, BancoUpdate } from '../types/banco';
import type { PaginatedResponse } from '../types/api';

/**
 * Parámetros para listar bancos
 */
export interface BancosListParams {
  page?: number;
  page_size?: number;
  search?: string;
  tipo?: 'PRIVADO' | 'GOBIERNO';
  ordering?: string;
}

/**
 * Servicio de bancos
 */
export const bancosService = {
  /**
   * Obtiene lista paginada de bancos
   */
  async getAll(params?: BancosListParams): Promise<PaginatedResponse<Banco>> {
    const queryParams: Record<string, string | number> = {};
    
    if (params?.page) queryParams.page = params.page;
    if (params?.page_size) queryParams.page_size = params.page_size;
    if (params?.search) queryParams.search = params.search;
    if (params?.tipo) queryParams.tipo = params.tipo;
    if (params?.ordering) queryParams.ordering = params.ordering;

    return api.get<PaginatedResponse<Banco>>('/bancos/', {
      params: queryParams,
    });
  },

  /**
   * Obtiene un banco por ID
   */
  async getById(id: number): Promise<Banco> {
    return api.get<Banco>(`/bancos/${id}/`);
  },

  /**
   * Crea un nuevo banco
   */
  async create(data: BancoCreate): Promise<Banco> {
    return api.post<Banco>('/bancos/', data);
  },

  /**
   * Actualiza un banco (parcial)
   */
  async update(id: number, data: BancoUpdate): Promise<Banco> {
    return api.patch<Banco>(`/bancos/${id}/`, data);
  },

  /**
   * Actualiza un banco (completo)
   */
  async updateFull(id: number, data: BancoCreate): Promise<Banco> {
    return api.put<Banco>(`/bancos/${id}/`, data);
  },

  /**
   * Elimina un banco
   */
  async delete(id: number): Promise<void> {
    return api.delete<void>(`/bancos/${id}/`);
  },
};
