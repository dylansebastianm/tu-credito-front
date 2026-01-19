import React from 'react';
/**
 * Button Component - Tu Crédito Frontend
 * 
 * UI IMPLEMENTATION PROVIDED BY VERCEL v0 – PLACEHOLDER ONLY
 * Este componente será reemplazado cuando se integre el diseño de v0
 */

import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

/**
 * Button component
 * Botón reutilizable con variantes y tamaños
 */
export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps): React.JSX.Element {
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classNames}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Cargando...' : children}
    </button>
  );
}
