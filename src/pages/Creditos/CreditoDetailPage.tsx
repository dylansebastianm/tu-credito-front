/**
 * Credito Detail Page - Tu Crédito Frontend
 * Integrado desde Vercel v0 - Adaptado para react-router-dom
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  User,
  Building2,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { setDocumentMeta } from '../../utils/meta';
import { mockCreditos, type MockCredito } from '../../data/mock-data';
import { formatCurrency, formatDate, formatPercent, getEstadoLabel } from '../../utils/format';
import { ROUTES } from '../../app/config/constants';
import styles from './Creditos.module.css';

/**
 * CreditoDetailPage component
 * Página de detalle de crédito
 */
export function CreditoDetailPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [credito, setCredito] = useState<MockCredito | null>(null);

  useEffect(() => {
    if (id) {
      const foundCredito = mockCreditos.find((c) => c.id === id);
      setCredito(foundCredito || null);

      if (foundCredito) {
        setDocumentMeta({
          title: `Crédito ${foundCredito.id}`,
          description: `Detalle del crédito ${foundCredito.id}`,
        });
      }
    }
  }, [id]);

  if (!credito) {
    return (
      <div className={styles.container}>
        <p>Crédito no encontrado</p>
      </div>
    );
  }

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado) {
      case 'activo':
      case 'aprobado':
      case 'pagado':
        return styles.badgeGreen;
      case 'pendiente':
        return styles.badgeYellow;
      case 'rechazado':
      case 'vencido':
        return styles.badgeRed;
      default:
        return styles.badgeGray;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerInfo}>
            <button
              onClick={() => navigate(ROUTES.CREDITOS)}
              className={styles.secondaryButton}
            >
              <ArrowLeft className={styles.buttonIcon} />
              Volver
            </button>
          </div>
          <div className={styles.headerActions}>
            <span
              className={`${styles.badge} ${getEstadoBadgeClass(credito.estado)}`}
            >
              {getEstadoLabel(credito.estado)}
            </span>
            <button
              onClick={() => navigate(ROUTES.CREDITO_DETAIL(credito.id))}
              className={styles.primaryButton}
            >
              <Edit className={styles.buttonIcon} />
              Editar
            </button>
          </div>
        </div>
        <h1 className={styles.title}>Crédito {credito.id}</h1>
        <p className={styles.subtitle}>Detalle del crédito</p>
      </div>

      <div className={styles.detailGrid}>
        <div className={styles.detailCard}>
          <div className={styles.detailCardHeader}>
            <h3 className={styles.detailCardTitle}>
              <User className={styles.detailCardIcon} />
              Cliente
            </h3>
          </div>
          <div className={styles.detailCardBody}>
            <div className={styles.detailList}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Nombre</span>
                <span className={styles.detailValue}>{credito.clienteNombre}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>ID Cliente</span>
                <span className={styles.detailValue}>{credito.clienteId}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.detailCard}>
          <div className={styles.detailCardHeader}>
            <h3 className={styles.detailCardTitle}>
              <Building2 className={styles.detailCardIcon} />
              Banco
            </h3>
          </div>
          <div className={styles.detailCardBody}>
            <div className={styles.detailList}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Nombre</span>
                <span className={styles.detailValue}>{credito.bancoNombre}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>ID Banco</span>
                <span className={styles.detailValue}>{credito.bancoId}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.detailCard} ${styles.detailCardFull}`}>
          <div className={styles.detailCardHeader}>
            <h3 className={styles.detailCardTitle}>
              <DollarSign className={styles.detailCardIcon} />
              Información Financiera
            </h3>
          </div>
          <div className={styles.detailCardBody}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1.5rem',
              }}
            >
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Monto</span>
                <span
                  className={styles.detailValue}
                  style={{ fontSize: '1.25rem', fontWeight: 700 }}
                >
                  {formatCurrency(credito.monto)}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Tasa</span>
                <span
                  className={styles.detailValue}
                  style={{ fontSize: '1.25rem', fontWeight: 700 }}
                >
                  {formatPercent(credito.tasaInteres)}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Plazo</span>
                <span
                  className={styles.detailValue}
                  style={{ fontSize: '1.25rem', fontWeight: 700 }}
                >
                  {credito.plazoMeses} meses
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Cuota Mensual</span>
                <span
                  className={styles.detailValue}
                  style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563eb' }}
                >
                  {formatCurrency(credito.cuotaMensual)}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Monto Total</span>
                <span
                  className={styles.detailValue}
                  style={{ fontSize: '1.25rem', fontWeight: 700, color: '#059669' }}
                >
                  {formatCurrency(credito.montoTotal)}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Fecha Solicitud</span>
                <span className={styles.detailValue}>
                  {formatDate(credito.fechaSolicitud)}
                </span>
              </div>
              {credito.fechaAprobacion && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Fecha Aprobación</span>
                  <span className={styles.detailValue}>
                    {formatDate(credito.fechaAprobacion)}
                  </span>
                </div>
              )}
              {credito.fechaVencimiento && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Fecha Vencimiento</span>
                  <span className={styles.detailValue}>
                    {formatDate(credito.fechaVencimiento)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`${styles.detailCard} ${styles.detailCardFull}`}>
          <div className={styles.detailCardHeader}>
            <h3 className={styles.detailCardTitle}>
              <Calendar className={styles.detailCardIcon} />
              Información Adicional
            </h3>
          </div>
          <div className={styles.detailCardBody}>
            <div className={styles.detailList}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Propósito</span>
                <span className={styles.detailValue}>{credito.proposito}</span>
              </div>
              {credito.observaciones && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Observaciones</span>
                  <span className={styles.detailValue}>{credito.observaciones}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
