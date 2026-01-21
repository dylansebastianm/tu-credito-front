/**
 * Confirm Dialog Component - Tu Crédito Frontend
 * Diálogo de confirmación reutilizable para acciones destructivas
 */

import React, { useEffect, useCallback, useState } from 'react';
import { FiAlertTriangle, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import styles from './ConfirmDialog.module.css';

export type ConfirmDialogType = 'danger' | 'warning' | 'info';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  type?: ConfirmDialogType;
  confirmText?: string;
  cancelText?: string;
  showIcon?: boolean;
}

/**
 * ConfirmDialog component
 * Diálogo de confirmación con diferentes variantes (danger, warning, info)
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'danger',
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  showIcon = true,
}: ConfirmDialogProps): React.JSX.Element | null {
  const [isLoading, setIsLoading] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    },
    [onClose, isLoading]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Error en confirmación:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <FiTrash2 size={24} />;
      case 'warning':
        return <FiAlertTriangle size={24} />;
      case 'info':
        return <FiAlertCircle size={24} />;
      default:
        return <FiTrash2 size={24} />;
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={`${styles.overlay} ${isOpen ? styles.visible : ''}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className={styles.dialog}>
        <div className={styles.header}>
          {showIcon && (
            <div className={`${styles.iconWrapper} ${styles[type]}`}>
              {getIcon()}
            </div>
          )}
          <div className={styles.content}>
            <h2 id="confirm-dialog-title" className={styles.title}>
              {title}
            </h2>
            <p className={styles.message}>{message}</p>
          </div>
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.confirmButton} ${styles[type]}`}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner} />
                Procesando...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
