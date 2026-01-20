import React from 'react';
import { FaDollarSign } from 'react-icons/fa';
import { formatCurrency } from '../../../utils/format';
import styles from './PaymentSummaryCard.module.css';

interface PaymentSummaryCardProps {
  amount: number;
  rate: number;
  term: number;
  monthlyPayment: number;
  totalAmount: number;
}

export function PaymentSummaryCard({
  amount,
  rate,
  term,
  monthlyPayment,
  totalAmount,
}: PaymentSummaryCardProps): React.JSX.Element {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <FaDollarSign className={styles.headerIcon} />
        <p className={styles.headerTitle}>Información Financiera</p>
      </div>

      <div className={styles.detailsRow}>
        <div className={styles.detailItem}>
          <p className={styles.detailLabel}>Monto</p>
          <p className={styles.detailValue}>{formatCurrency(amount)}</p>
        </div>
        <div className={styles.detailItem}>
          <p className={styles.detailLabel}>Tasa</p>
          <p className={styles.detailValue}>{rate.toFixed(2)}%</p>
        </div>
        <div className={styles.detailItem}>
          <p className={styles.detailLabel}>Plazo</p>
          <p className={styles.detailValue}>{term} meses</p>
        </div>
        <div className={styles.detailItemLast}>
          <p className={styles.detailLabel}>Cuota Mensual</p>
          <p className={styles.detailValue}>{formatCurrency(monthlyPayment)}</p>
        </div>
      </div>

      <div className={styles.totalRow}>
        <p className={styles.totalLabel}>Monto Total a Pagar</p>
        <p className={styles.totalValue}>{formatCurrency(totalAmount)}</p>
      </div>
    </div>
  );
}

