import React from 'react';
import { HiOutlinePencil } from 'react-icons/hi';
import { BackButton } from '../../ui/BackButton/BackButton';
import styles from './DetailCardShell.module.css';

export type DetailStatus = 'activo' | 'inactivo' | 'pendiente';

interface DetailCardShellProps {
  title: string;
  subtitle: string;
  status: DetailStatus;
  onBack?: () => void;
  onEdit?: () => void;
  children: React.ReactNode;
}

export function DetailCardShell({
  title,
  subtitle,
  status,
  onBack,
  onEdit,
  children,
}: DetailCardShellProps): React.JSX.Element {
  const badgeClass =
    status === 'activo'
      ? styles.badge
      : status === 'pendiente'
        ? `${styles.badge} ${styles.badgePending}`
        : `${styles.badge} ${styles.badgeInactive}`;

  const statusLabel =
    status === 'activo' ? 'Activo' : status === 'pendiente' ? 'Pendiente' : 'Inactivo';

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          {onBack && <BackButton onClick={onBack} />}
          <div>
            <div className={styles.titleGroup}>
              <h1 className={styles.title}>{title}</h1>
              <span className={badgeClass}>{statusLabel}</span>
            </div>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>
        </div>
        <button className={styles.editButton} onClick={onEdit} type="button">
          <HiOutlinePencil size={12} />
          <span>Editar</span>
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.grid}>{children}</div>
      </div>
    </div>
  );
}

interface DetailSectionProps {
  title: string;
  icon: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function DetailSection({
  title,
  icon,
  fullWidth,
  children,
}: DetailSectionProps): React.JSX.Element {
  return (
    <div className={fullWidth ? styles.gridFull : undefined}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          {icon}
          <h2 className={styles.sectionTitle}>{title}</h2>
        </div>
        <div className={styles.sectionContent}>{children}</div>
      </div>
    </div>
  );
}

export { styles as detailShellStyles };

