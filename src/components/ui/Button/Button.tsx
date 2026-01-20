/**
 * Button Component - Tu Crédito Frontend
 * Componente unificado de botón con variantes de color
 */

import React from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { ImSpinner2 } from 'react-icons/im';
import styles from './Button.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Variante del botón (define el color)
   */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  /**
   * Ancho del botón ('auto' | 'full')
   */
  width?: 'auto' | 'full';
  /**
   * Estado de carga
   */
  isLoading?: boolean;
  /**
   * Icono a la izquierda del texto
   */
  leftIcon?: ReactNode;
  /**
   * Icono a la derecha del texto
   */
  rightIcon?: ReactNode;
  /**
   * Clase CSS adicional
   */
  className?: string;
  /**
   * Contenido del botón (opcional si solo se usa icono)
   */
  children?: ReactNode;
}

/**
 * Button component
 * Botón reutilizable con variantes y tamaños consistentes
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="md" leftIcon={<FaSave />}>
 *   Guardar
 * </Button>
 * ```
 */
export function Button({
  variant = 'primary',
  width = 'auto',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps): React.JSX.Element {
  const classNames = [
    styles.button,
    styles[variant],
    width === 'full' && styles.fullWidth,
    isLoading && styles.loading,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classNames}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <ImSpinner2 className={`${styles.icon} ${styles.spinner}`} />}
      {!isLoading && leftIcon && <span className={styles.icon}>{leftIcon}</span>}
      {children && <span>{children}</span>}
      {!isLoading && rightIcon && <span className={styles.icon}>{rightIcon}</span>}
    </button>
  );
}
