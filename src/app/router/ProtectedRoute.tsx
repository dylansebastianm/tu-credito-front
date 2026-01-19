/**
 * Protected Route - Tu Crédito Frontend
 * Componente que protege rutas que requieren autenticación
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { ROUTES } from '../config/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component
 * Redirige a /login si el usuario no está autenticado
 */
export function ProtectedRoute({ children }: ProtectedRouteProps): React.JSX.Element {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
}
