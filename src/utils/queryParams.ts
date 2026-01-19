/**
 * Query Params Utilities - Tu Crédito Frontend
 */

/**
 * Construye query string desde un objeto
 */
export function buildQueryString(params: Record<string, string | number | boolean | null | undefined>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Parsea query string a objeto
 */
export function parseQueryString(search: string): Record<string, string> {
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(search);

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}

/**
 * Obtiene un parámetro específico de la URL
 */
export function getQueryParam(key: string, defaultValue: string | null = null): string | null {
  const params = parseQueryString(window.location.search);
  return params[key] ?? defaultValue;
}
