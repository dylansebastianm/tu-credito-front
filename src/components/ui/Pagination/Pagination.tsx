/**
 * Pagination Component - Tu Crédito Frontend
 * Componente modularizado para paginación
 */

import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

/**
 * Pagination component
 * Componente de paginación con flechas y números de página
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps): React.JSX.Element {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    const leftSibling = Math.max(currentPage - siblingCount, 1);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages);

    const showLeftEllipsis = leftSibling > 2;
    const showRightEllipsis = rightSibling < totalPages - 1;

    if (totalPages <= 5 + siblingCount * 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (showLeftEllipsis) {
        pages.push('...');
      } else {
        for (let i = 2; i < leftSibling; i++) {
          pages.push(i);
        }
      }

      for (let i = leftSibling; i <= rightSibling; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      if (showRightEllipsis) {
        pages.push('...');
      } else {
        for (let i = rightSibling + 1; i < totalPages; i++) {
          pages.push(i);
        }
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className={styles.pagination}>
      <button
        className={`${styles.arrow} ${currentPage === 1 ? styles.disabled : ''}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Página anterior"
        type="button"
      >
        <FiChevronLeft size={18} />
      </button>

      <div className={styles.pages}>
        {pages.map((page, index) =>
          page === '...' ? (
            <span key={`ellipsis-${index}`} className={styles.ellipsis}>
              ...
            </span>
          ) : (
            <button
              key={page}
              className={`${styles.page} ${currentPage === page ? styles.active : ''}`}
              onClick={() => onPageChange(page as number)}
              aria-label={`Ir a página ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
              type="button"
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        className={`${styles.arrow} ${currentPage === totalPages ? styles.disabled : ''}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Página siguiente"
        type="button"
      >
        <FiChevronRight size={18} />
      </button>
    </div>
  );
}
