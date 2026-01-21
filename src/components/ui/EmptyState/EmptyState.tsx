import React from 'react';
/**
 * Empty State Component - Tu Crédito Frontend
 */

import styles from './EmptyState.module.css';

interface EmptyStateProps {
  title?: string;
  message?: string;
  action?: React.ReactNode;
}

/**
 * EmptyState component
 * Estado vacío para listas sin datos
 */
export function EmptyState({
  title = 'No hay datos',
  message = 'No se encontraron resultados',
  action,
}: EmptyStateProps): React.JSX.Element {
  return (
    <div className={styles.emptyState}>
      <h3>{title}</h3>
      <p>{message}</p>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
