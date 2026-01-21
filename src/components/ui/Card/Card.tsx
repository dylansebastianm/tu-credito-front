import React from 'react';
/**
 * Card Component - Tu Crédito Frontend
 */

import type { HTMLAttributes } from 'react';
import styles from './Card.module.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
}

/**
 * Card component
 * Tarjeta reutilizable para contenedor de contenido
 */
export function Card({
  title,
  className,
  children,
  ...props
}: CardProps): React.JSX.Element {
  return (
    <div className={`${styles.card} ${className || ''}`} {...props}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
