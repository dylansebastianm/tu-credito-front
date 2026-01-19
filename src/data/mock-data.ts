/**
 * Mock Data - Tu Crédito Frontend
 * Datos de prueba para desarrollo sin backend
 */

// Re-export types from v0 for mock data compatibility
export interface MockCliente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  fechaNacimiento: string;
  dni: string;
  estado: 'activo' | 'inactivo' | 'pendiente';
  fechaRegistro: string;
  creditosActivos: number;
  montoTotalCreditos: number;
}

export interface MockCredito {
  id: string;
  clienteId: string;
  clienteNombre: string;
  bancoId: string;
  bancoNombre: string;
  monto: number;
  tasaInteres: number;
  plazoMeses: number;
  cuotaMensual: number;
  montoTotal: number;
  estado: 'pendiente' | 'aprobado' | 'rechazado' | 'activo' | 'pagado' | 'vencido';
  fechaSolicitud: string;
  fechaAprobacion?: string;
  fechaVencimiento?: string;
  proposito: string;
  observaciones?: string;
}

export interface MockBanco {
  id: string;
  nombre: string;
  codigo: string;
  direccion: string;
  telefono: string;
  email: string;
  sitioWeb?: string;
  tasaInteresMin: number;
  tasaInteresMax: number;
  plazoMinimo: number;
  plazoMaximo: number;
  montoMinimo: number;
  montoMaximo: number;
  estado: 'activo' | 'inactivo';
  fechaRegistro: string;
  creditosActivos: number;
}

export const mockClientes: MockCliente[] = [
  {
    id: 'cli-001',
    nombre: 'Juan',
    apellido: 'Pérez García',
    email: 'juan.perez@email.com',
    telefono: '+52 55 1234 5678',
    direccion: 'Av. Reforma 123',
    ciudad: 'Ciudad de México',
    fechaNacimiento: '1985-03-15',
    dni: 'PEGJ850315HDFRRC01',
    estado: 'activo',
    fechaRegistro: '2023-01-15',
    creditosActivos: 2,
    montoTotalCreditos: 150000,
  },
  {
    id: 'cli-002',
    nombre: 'María',
    apellido: 'López Hernández',
    email: 'maria.lopez@email.com',
    telefono: '+52 55 2345 6789',
    direccion: 'Calle Juárez 456',
    ciudad: 'Guadalajara',
    fechaNacimiento: '1990-07-22',
    dni: 'LOHM900722MJCPRR05',
    estado: 'activo',
    fechaRegistro: '2023-02-20',
    creditosActivos: 1,
    montoTotalCreditos: 75000,
  },
  {
    id: 'cli-003',
    nombre: 'Carlos',
    apellido: 'Martínez Ruiz',
    email: 'carlos.martinez@email.com',
    telefono: '+52 81 3456 7890',
    direccion: 'Blvd. Monterrey 789',
    ciudad: 'Monterrey',
    fechaNacimiento: '1978-11-08',
    dni: 'MARC781108HNLRRL02',
    estado: 'pendiente',
    fechaRegistro: '2023-03-10',
    creditosActivos: 0,
    montoTotalCreditos: 0,
  },
  {
    id: 'cli-004',
    nombre: 'Ana',
    apellido: 'Sánchez Torres',
    email: 'ana.sanchez@email.com',
    telefono: '+52 33 4567 8901',
    direccion: 'Calle Hidalgo 321',
    ciudad: 'Guadalajara',
    fechaNacimiento: '1992-05-30',
    dni: 'SATA920530MJCNRN08',
    estado: 'activo',
    fechaRegistro: '2023-04-05',
    creditosActivos: 3,
    montoTotalCreditos: 250000,
  },
  {
    id: 'cli-005',
    nombre: 'Roberto',
    apellido: 'González Flores',
    email: 'roberto.gonzalez@email.com',
    telefono: '+52 55 5678 9012',
    direccion: 'Av. Insurgentes 654',
    ciudad: 'Ciudad de México',
    fechaNacimiento: '1988-09-12',
    dni: 'GOFR880912HDFLNB04',
    estado: 'inactivo',
    fechaRegistro: '2023-05-18',
    creditosActivos: 0,
    montoTotalCreditos: 50000,
  },
];

export const mockBancos: MockBanco[] = [
  {
    id: 'ban-001',
    nombre: 'Banco Nacional',
    codigo: 'BN001',
    direccion: 'Av. Paseo de la Reforma 500',
    telefono: '+52 55 5000 1000',
    email: 'contacto@banconacional.com',
    sitioWeb: 'https://www.banconacional.com',
    tasaInteresMin: 8.5,
    tasaInteresMax: 18.0,
    plazoMinimo: 6,
    plazoMaximo: 60,
    montoMinimo: 10000,
    montoMaximo: 500000,
    estado: 'activo',
    fechaRegistro: '2022-01-01',
    creditosActivos: 45,
  },
  {
    id: 'ban-002',
    nombre: 'Crédito Express',
    codigo: 'CE002',
    direccion: 'Blvd. Manuel Ávila Camacho 40',
    telefono: '+52 55 5000 2000',
    email: 'info@creditoexpress.com',
    sitioWeb: 'https://www.creditoexpress.com',
    tasaInteresMin: 10.0,
    tasaInteresMax: 24.0,
    plazoMinimo: 3,
    plazoMaximo: 36,
    montoMinimo: 5000,
    montoMaximo: 200000,
    estado: 'activo',
    fechaRegistro: '2022-03-15',
    creditosActivos: 32,
  },
  {
    id: 'ban-003',
    nombre: 'FinanciaPro',
    codigo: 'FP003',
    direccion: 'Calle Río Lerma 232',
    telefono: '+52 55 5000 3000',
    email: 'soporte@financiapro.com',
    sitioWeb: 'https://www.financiapro.com',
    tasaInteresMin: 7.5,
    tasaInteresMax: 15.0,
    plazoMinimo: 12,
    plazoMaximo: 84,
    montoMinimo: 50000,
    montoMaximo: 1000000,
    estado: 'activo',
    fechaRegistro: '2022-06-01',
    creditosActivos: 28,
  },
];

export const mockCreditos: MockCredito[] = [
  {
    id: 'cre-001',
    clienteId: 'cli-001',
    clienteNombre: 'Juan Pérez García',
    bancoId: 'ban-001',
    bancoNombre: 'Banco Nacional',
    monto: 100000,
    tasaInteres: 12.5,
    plazoMeses: 24,
    cuotaMensual: 4707.35,
    montoTotal: 112976.4,
    estado: 'activo',
    fechaSolicitud: '2023-06-01',
    fechaAprobacion: '2023-06-05',
    fechaVencimiento: '2025-06-01',
    proposito: 'Remodelación de vivienda',
    observaciones: 'Cliente con buen historial crediticio',
  },
  {
    id: 'cre-002',
    clienteId: 'cli-001',
    clienteNombre: 'Juan Pérez García',
    bancoId: 'ban-002',
    bancoNombre: 'Crédito Express',
    monto: 50000,
    tasaInteres: 15.0,
    plazoMeses: 12,
    cuotaMensual: 4512.92,
    montoTotal: 54155.04,
    estado: 'activo',
    fechaSolicitud: '2023-08-15',
    fechaAprobacion: '2023-08-18',
    fechaVencimiento: '2024-08-15',
    proposito: 'Capital de trabajo',
  },
  {
    id: 'cre-003',
    clienteId: 'cli-002',
    clienteNombre: 'María López Hernández',
    bancoId: 'ban-003',
    bancoNombre: 'FinanciaPro',
    monto: 75000,
    tasaInteres: 10.0,
    plazoMeses: 36,
    cuotaMensual: 2420.04,
    montoTotal: 87121.44,
    estado: 'activo',
    fechaSolicitud: '2023-07-10',
    fechaAprobacion: '2023-07-15',
    fechaVencimiento: '2026-07-10',
    proposito: 'Compra de vehículo',
  },
  {
    id: 'cre-004',
    clienteId: 'cli-004',
    clienteNombre: 'Ana Sánchez Torres',
    bancoId: 'ban-001',
    bancoNombre: 'Banco Nacional',
    monto: 150000,
    tasaInteres: 11.0,
    plazoMeses: 48,
    cuotaMensual: 3875.52,
    montoTotal: 186024.96,
    estado: 'aprobado',
    fechaSolicitud: '2023-09-01',
    fechaAprobacion: '2023-09-10',
    proposito: 'Consolidación de deudas',
  },
  {
    id: 'cre-005',
    clienteId: 'cli-003',
    clienteNombre: 'Carlos Martínez Ruiz',
    bancoId: 'ban-002',
    bancoNombre: 'Crédito Express',
    monto: 30000,
    tasaInteres: 18.0,
    plazoMeses: 12,
    cuotaMensual: 2750.93,
    montoTotal: 33011.16,
    estado: 'pendiente',
    fechaSolicitud: '2023-10-01',
    proposito: 'Gastos médicos',
  },
];

// Dashboard statistics
export const getDashboardStats = () => {
  const clientesActivos = mockClientes.filter(c => c.estado === 'activo').length;
  const creditosActivos = mockCreditos.filter(c => c.estado === 'activo').length;
  const montoTotalCreditos = mockCreditos
    .filter(c => c.estado === 'activo')
    .reduce((sum, c) => sum + c.monto, 0);
  const creditosPendientes = mockCreditos.filter(c => c.estado === 'pendiente').length;

  return {
    clientesActivos,
    creditosActivos,
    montoTotalCreditos,
    creditosPendientes,
    bancosActivos: mockBancos.filter(b => b.estado === 'activo').length,
  };
};

// Recent activity
export const getRecentActivity = () => [
  { id: 1, type: 'credito', message: 'Nuevo credito solicitado por Carlos Martinez', time: 'Hace 2 horas' },
  { id: 2, type: 'cliente', message: 'Cliente Ana Sanchez actualizado', time: 'Hace 5 horas' },
  { id: 3, type: 'credito', message: 'Credito #cre-004 aprobado', time: 'Hace 1 dia' },
  { id: 4, type: 'banco', message: 'Nuevo banco FinanciaPro registrado', time: 'Hace 2 dias' },
  { id: 5, type: 'credito', message: 'Pago recibido para credito #cre-001', time: 'Hace 3 dias' },
];

// Recent creditos for dashboard
export const getRecentCreditos = () => mockCreditos.slice(0, 5);
