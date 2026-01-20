/**
 * Loading Context - Tu Crédito Frontend
 * Contexto global para manejar el estado de loading durante las peticiones API
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  incrementLoading: () => void;
  decrementLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

/**
 * Hook para usar el contexto de loading
 */
export function useLoading(): LoadingContextType {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading debe usarse dentro de LoadingProvider');
  }
  return context;
}

/**
 * Provider del contexto de loading
 */
export function LoadingProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [loadingCount, setLoadingCount] = useState(0);

  const setLoading = useCallback((loading: boolean) => {
    setLoadingCount(loading ? 1 : 0);
  }, []);

  const incrementLoading = useCallback(() => {
    setLoadingCount((prev) => prev + 1);
  }, []);

  const decrementLoading = useCallback(() => {
    setLoadingCount((prev) => Math.max(0, prev - 1));
  }, []);

  const value: LoadingContextType = {
    isLoading: loadingCount > 0,
    setLoading,
    incrementLoading,
    decrementLoading,
  };

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
}
