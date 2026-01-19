import React from 'react';
/**
 * Alert Component - Tu Crédito Frontend
 * 
 * UI IMPLEMENTATION PROVIDED BY VERCEL v0 – PLACEHOLDER ONLY
 * Este componente será reemplazado cuando se integre el diseño de v0
 */

import type { HTMLAttributes } from 'react';
import styles from './Alert.module.css';

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'warning' | 'error' | 'info';
  onClose?: () => void;
}

/**
 * Alert component
 * Alerta reutilizable para mensajes
 */
export function Alert({
  variant = 'info',
  onClose,
  className,
  children,
  ...props
}: AlertProps): React.JSX.Element {
  return (
    <div className={`${styles.alert} ${styles[variant]} ${className || ''}`} {...props}>
      {children}
      {onClose && (
        <button onClick={onClose} className={styles.closeButton}>
          ×
        </button>
      )}
    </div>
  );
}
