/**
 * Loading Initializer - Tu Crédito Frontend
 * Componente que inicializa el contexto de loading en el apiClient
 */

import React, { useEffect } from 'react';
import { useLoading } from '../../../contexts/LoadingContext';
import { setLoadingContext } from '../../../services/apiClient';

/**
 * LoadingInitializer component
 * Conecta el contexto de loading con el apiClient
 */
export function LoadingInitializer(): null {
  const { incrementLoading, decrementLoading } = useLoading();

  useEffect(() => {
    setLoadingContext({ incrementLoading, decrementLoading });
  }, [incrementLoading, decrementLoading]);

  return null;
}
