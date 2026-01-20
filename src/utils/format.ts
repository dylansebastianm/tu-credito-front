/**
 * Format Utilities - Tu Crédito Frontend
 * Integrado desde Vercel v0
 */

/**
 * Formatea un número como moneda
 */
export function formatCurrency(value: number | string, currency: string = 'USD'): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return '0.00';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue);
}

/**
 * Formatea una fecha a formato legible
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * Formatea una fecha corta
 */
export function formatDateShort(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(dateString));
}

/**
 * Formatea una fecha y hora
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

/**
 * Formatea un porcentaje
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

/**
 * Formatea un teléfono
 */
export function formatPhone(phone: string): string {
  return phone;
}

/**
 * Obtiene la etiqueta de estado
 */
export function getEstadoLabel(estado: string): string {
  const labels: Record<string, string> = {
    activo: 'Activo',
    inactivo: 'Inactivo',
    pendiente: 'Pendiente',
    aprobado: 'Aprobado',
    rechazado: 'Rechazado',
    pagado: 'Pagado',
    vencido: 'Vencido',
  };
  return labels[estado] || estado;
}

/**
 * Obtiene el color de estado
 */
export function getEstadoColor(estado: string): string {
  const colors: Record<string, string> = {
    activo: 'success',
    inactivo: 'default',
    pendiente: 'warning',
    aprobado: 'info',
    rechazado: 'error',
    pagado: 'success',
    vencido: 'error',
  };
  return colors[estado] || 'default';
}

/**
 * Calcula la cuota mensual
 */
export function calculateCuotaMensual(monto: number, tasaInteres: number, plazoMeses: number): number {
  const tasaMensual = tasaInteres / 100 / 12;
  const cuota = monto * (tasaMensual * Math.pow(1 + tasaMensual, plazoMeses)) / (Math.pow(1 + tasaMensual, plazoMeses) - 1);
  return Math.round(cuota * 100) / 100;
}

/**
 * Calcula el monto total
 */
export function calculateMontoTotal(cuotaMensual: number, plazoMeses: number): number {
  return Math.round(cuotaMensual * plazoMeses * 100) / 100;
}

/**
 * Trunca un texto a una longitud máxima
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
}
