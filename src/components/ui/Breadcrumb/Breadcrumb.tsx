/**
 * Breadcrumb Component - Tu Crédito Frontend
 * Componente modularizado para navegación breadcrumb
 */

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Breadcrumb.module.css';

export interface BreadcrumbItem {
  label: string;
  route?: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

/**
 * Breadcrumb component
 * Muestra la ruta de navegación actual
 */
export function Breadcrumb({ items }: BreadcrumbProps): React.JSX.Element {
  return (
    <nav className={styles.breadcrumb}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <React.Fragment key={index}>
            {isLast ? (
              <span className={styles.breadcrumbCurrent}>{item.label}</span>
            ) : item.route ? (
              <Link
                to={item.route}
                className={styles.breadcrumbLink}
                onClick={item.onClick}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={styles.breadcrumbLink}
                onClick={item.onClick}
                style={{ cursor: item.onClick ? 'pointer' : 'default' }}
              >
                {item.label}
              </span>
            )}
            {!isLast && <span className={styles.breadcrumbSeparator}>/</span>}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
