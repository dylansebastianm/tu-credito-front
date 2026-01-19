import React from 'react';
/**
 * Spinner Component - Tu Crédito Frontend
 * 
 * UI IMPLEMENTATION PROVIDED BY VERCEL v0 – PLACEHOLDER ONLY
 * Este componente será reemplazado cuando se integre el diseño de v0
 */

import styles from './Spinner.module.css';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Spinner component
 * Indicador de carga
 */
export function Spinner({ size = 'md' }: SpinnerProps): React.JSX.Element {
  return <div className={`${styles.spinner} ${styles[size]}`} />;
}
