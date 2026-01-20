/**
 * Global Loading Component - Tu Crédito Frontend
 * Spinner global que se muestra durante las peticiones API
 */

import React from 'react';
import { useLoading } from '../../../contexts/LoadingContext';
import styles from './GlobalLoading.module.css';

/**
 * GlobalLoading component
 * Muestra un spinner con overlay cuando hay peticiones en curso
 */
export function GlobalLoading(): React.JSX.Element | null {
  const { isLoading } = useLoading();

  if (!isLoading) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.spinner} />
    </div>
  );
}
