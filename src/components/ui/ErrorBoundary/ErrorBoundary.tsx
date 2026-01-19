/**
 * Error Boundary - Tu Crédito Frontend
 * Manejo global de errores de React
 */

import { Component } from 'react';
import type { ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | React.JSX.Element | null;
}

/**
 * ErrorBoundary component
 * Captura errores en componentes hijos y muestra un fallback
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // TODO: Enviar error a servicio de logging en producción
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={styles.errorBoundary}>
          <div className={styles.content}>
            <h1>Algo salió mal</h1>
            <p>Ha ocurrido un error inesperado. Por favor, intenta recargar la página.</p>
            {import.meta.env.DEV && this.state.error && (
              <details className={styles.details}>
                <summary>Detalles del error (solo en desarrollo)</summary>
                <pre>{this.state.error instanceof Error ? this.state.error.stack : String(this.state.error)}</pre>
              </details>
            )}
            <button onClick={this.handleReset} className={styles.button}>
              Intentar de nuevo
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
