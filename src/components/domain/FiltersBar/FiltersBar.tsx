import React from 'react';
/**
 * Filters Bar Component - Tu Crédito Frontend
 */

import styles from './FiltersBar.module.css';

interface FiltersBarProps {
  children?: React.ReactNode;
  onReset?: () => void;
}

/**
 * FiltersBar component
 * Barra de filtros reutilizable
 */
export function FiltersBar({ children, onReset }: FiltersBarProps): React.JSX.Element {
  return (
    <div className={styles.filtersBar}>
      <div className={styles.filters}>{children}</div>
      {onReset && (
        <button onClick={onReset} className={styles.resetButton}>
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
