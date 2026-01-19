// Formatting utilities for Tu Crédito

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
};

export const formatDateShort = (dateString: string): string => {
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(dateString));
};

export const formatPercent = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

export const formatPhone = (phone: string): string => {
  return phone;
};

export const getEstadoLabel = (estado: string): string => {
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
};

export const getEstadoColor = (estado: string): string => {
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
};

// Calculate monthly payment
export const calculateCuotaMensual = (monto: number, tasaInteres: number, plazoMeses: number): number => {
  const tasaMensual = tasaInteres / 100 / 12;
  const cuota = monto * (tasaMensual * Math.pow(1 + tasaMensual, plazoMeses)) / (Math.pow(1 + tasaMensual, plazoMeses) - 1);
  return Math.round(cuota * 100) / 100;
};

// Calculate total amount
export const calculateMontoTotal = (cuotaMensual: number, plazoMeses: number): number => {
  return Math.round(cuotaMensual * plazoMeses * 100) / 100;
};
