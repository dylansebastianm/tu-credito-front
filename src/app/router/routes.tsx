/**
 * Routes Configuration - Tu Crédito Frontend
 * Configuración de rutas de la aplicación
 */

import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AuthLayout } from '../layout/AuthLayout';
import { PublicLayout } from '../layout/PublicLayout';
import { LoginPage } from '../../pages/Login/LoginPage';
import { DashboardPage } from '../../pages/Dashboard/DashboardPage';
import { ClientesListPage } from '../../pages/Clientes/ClientesListPage';
import { ClienteCreatePage } from '../../pages/Clientes/ClienteCreatePage';
import { ClienteDetailPage } from '../../pages/Clientes/ClienteDetailPage';
import { CreditosListPage } from '../../pages/Creditos/CreditosListPage';
import { CreditoCreatePage } from '../../pages/Creditos/CreditoCreatePage';
import { CreditoDetailPage } from '../../pages/Creditos/CreditoDetailPage';
import { BancosListPage } from '../../pages/Bancos/BancosListPage';
import { BancoCreatePage } from '../../pages/Bancos/BancoCreatePage';
import { BancoDetailPage } from '../../pages/Bancos/BancoDetailPage';
import { DocsPage } from '../../pages/Docs/DocsPage';
import { NotFoundPage } from '../../pages/NotFound/NotFoundPage';
import { ROUTES } from '../config/constants';

/**
 * Router configuration
 */
export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: <LoginPage />,
      },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <AuthLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: ROUTES.DASHBOARD,
        element: <DashboardPage />,
      },
      {
        path: ROUTES.CLIENTES,
        element: <ClientesListPage />,
      },
      {
        path: ROUTES.CLIENTE_NUEVO,
        element: <ClienteCreatePage />,
      },
      {
        path: '/clientes/:id',
        element: <ClienteDetailPage />,
      },
      {
        path: ROUTES.CREDITOS,
        element: <CreditosListPage />,
      },
      {
        path: ROUTES.CREDITO_NUEVO,
        element: <CreditoCreatePage />,
      },
      {
        path: '/creditos/:id',
        element: <CreditoDetailPage />,
      },
      {
        path: ROUTES.BANCOS,
        element: <BancosListPage />,
      },
      {
        path: ROUTES.BANCO_NUEVO,
        element: <BancoCreatePage />,
      },
      {
        path: '/bancos/:id',
        element: <BancoDetailPage />,
      },
      {
        path: ROUTES.DOCS,
        element: <DocsPage />,
      },
      {
        path: ROUTES.NOT_FOUND,
        element: <NotFoundPage />,
      },
    ],
  },
]);
