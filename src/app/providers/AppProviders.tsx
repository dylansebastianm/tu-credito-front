/**
 * App Providers - Tu Crédito Frontend
 * Wrapper para todos los providers de la aplicación
 */

import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '../router/routes';
import { ErrorBoundary } from '../../components/ui/ErrorBoundary/ErrorBoundary';

interface AppProvidersProps {
  children?: React.ReactNode;
}

/**
 * AppProviders component
 * Provee el router y otros providers globales
 */
export function AppProviders({ children }: AppProvidersProps): React.JSX.Element {
  return (
    <ErrorBoundary>
      {children || <RouterProvider router={router} />}
    </ErrorBoundary>
  );
}
