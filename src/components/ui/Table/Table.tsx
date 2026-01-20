import React from 'react';
import type { TableHTMLAttributes } from 'react';
import { FaSearch } from 'react-icons/fa';
import styles from './Table.module.css';

export type TableFilterOption = {
  value: string;
  label: string;
};

interface TableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

interface TableFilterProps {
  value: string;
  onChange: (value: string) => void;
  options: TableFilterOption[];
}

/**
 * Table component
 * Tabla reutilizable (incluye search + filtro + tabla + footer)
 */
export function Table({
  children,
  search,
  filter,
  footer,
  className,
  ...props
}: TableHTMLAttributes<HTMLTableElement> & {
  children: React.ReactNode;
  search: TableSearchProps;
  filter: TableFilterProps;
  footer?: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className={styles.card}>
      <div className={styles.filters}>
        <div className={styles.searchWrapper}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder={search.placeholder}
            value={search.value}
            onChange={(e) => search.onChange(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <select
          value={filter.value}
          onChange={(e) => filter.onChange(e.target.value)}
          className={styles.filterSelect}
        >
          {filter.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.tableWrapper}>
        <table className={`${styles.table} ${className || ''}`} {...props}>
          {children}
        </table>
      </div>

      {footer ? <div className={styles.tableFooter}>{footer}</div> : null}
    </div>
  );
}
