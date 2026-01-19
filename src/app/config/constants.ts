/**
 * Constants - Tu Crédito Frontend
 */

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  CLIENTES: '/clientes',
  CLIENTE_NUEVO: '/clientes/nuevo',
  CLIENTE_DETAIL: (id: number | string) => `/clientes/${id}`,
  CREDITOS: '/creditos',
  CREDITO_NUEVO: '/creditos/nuevo',
  CREDITO_DETAIL: (id: number | string) => `/creditos/${id}`,
  BANCOS: '/bancos',
  BANCO_NUEVO: '/bancos/nuevo',
  BANCO_DETAIL: (id: number | string) => `/bancos/${id}`,
  DOCS: '/docs',
  NOT_FOUND: '*',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'tu_credito_auth_token',
  REFRESH_TOKEN: 'tu_credito_refresh_token',
} as const;
