/**
 * Back Button Component - Tu Crédito Frontend
 * Botón circular para navegar hacia atrás
 */

import React from 'react';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import styles from './BackButton.module.css';

interface BackButtonProps {
  onClick: () => void;
  'aria-label'?: string;
}

/**
 * BackButton component
 * Botón circular con flecha hacia atrás
 */
export function BackButton({ onClick, 'aria-label': ariaLabel = 'Volver' }: BackButtonProps): React.JSX.Element {
  return (
    <button
      onClick={onClick}
      className={styles.backButton}
      aria-label={ariaLabel}
      type="button"
    >
      <MdKeyboardArrowLeft size={20} />
    </button>
  );
}
