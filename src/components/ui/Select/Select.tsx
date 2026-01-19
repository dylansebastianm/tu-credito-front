import React from 'react';
/**
 * Select Component - Tu Crédito Frontend
 * 
 * UI IMPLEMENTATION PROVIDED BY VERCEL v0 – PLACEHOLDER ONLY
 * Este componente será reemplazado cuando se integre el diseño de v0
 */

import type { SelectHTMLAttributes } from 'react';
import styles from './Select.module.css';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

/**
 * Select component
 * Select reutilizable con label y manejo de errores
 */
export function Select({
  label,
  error,
  options,
  className,
  id,
  ...props
}: SelectProps): React.JSX.Element {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`${styles.select} ${error ? styles.error : ''} ${className || ''}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
