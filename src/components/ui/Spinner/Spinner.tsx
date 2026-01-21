import React from 'react';
/**
 * Spinner Component - Tu Crédito Frontend
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
