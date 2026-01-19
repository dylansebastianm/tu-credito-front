import React from 'react';
/**
 * Table Component - Tu Crédito Frontend
 * 
 * UI IMPLEMENTATION PROVIDED BY VERCEL v0 – PLACEHOLDER ONLY
 * Este componente será reemplazado cuando se integre el diseño de v0
 */

import type { HTMLAttributes } from 'react';
import styles from './Table.module.css';

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  columns: { key: string; label: string }[];
  data: Record<string, unknown>[];
}

/**
 * Table component
 * Tabla reutilizable para mostrar datos
 */
export function Table({
  columns,
  data,
  className,
  ...props
}: TableProps): React.JSX.Element {
  return (
    <table className={`${styles.table} ${className || ''}`} {...props}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key}>{column.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td key={column.key}>{String(row[column.key] || '')}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
