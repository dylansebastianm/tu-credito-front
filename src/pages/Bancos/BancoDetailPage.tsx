/**
 * Banco Detail Page - Tu Crédito Frontend
 * Integrado desde Vercel v0 - Adaptado para react-router-dom
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Building2,
  Mail,
  CreditCard,
  Percent,
} from 'lucide-react';
import { setDocumentMeta } from '../../utils/meta';
import { mockBancos, type MockBanco } from '../../data/mock-data';
import { formatCurrency, formatDate, formatPercent, getEstadoLabel } from '../../utils/format';
import { ROUTES } from '../../app/config/constants';
import styles from './Bancos.module.css';

/**
 * BancoDetailPage component
 * Página de detalle de banco
 */
export function BancoDetailPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [banco, setBanco] = useState<MockBanco | null>(null);

  useEffect(() => {
    if (id) {
      const foundBanco = mockBancos.find((b) => b.id === id);
      setBanco(foundBanco || null);

      if (foundBanco) {
        setDocumentMeta({
          title: foundBanco.nombre,
          description: `Detalle del banco ${foundBanco.nombre}`,
        });
      }
    }
  }, [id]);

  if (!banco) {
    return (
      <div className={styles.container}>
        <p>Banco no encontrado</p>
      </div>
    );
  }

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado) {
      case 'activo':
        return styles.badgeGreen;
      case 'inactivo':
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
              onClick={() => navigate(ROUTES.BANCOS)}
              className={styles.secondaryButton}
            >
              <ArrowLeft className={styles.buttonIcon} />
              Volver
            </button>
          </div>
          <div className={styles.headerActions}>
            <span
              className={`${styles.badge} ${getEstadoBadgeClass(banco.estado)}`}
            >
              {getEstadoLabel(banco.estado)}
            </span>
            <button
              onClick={() => navigate(ROUTES.BANCO_DETAIL(banco.id))}
              className={styles.primaryButton}
            >
              <Edit className={styles.buttonIcon} />
              Editar
            </button>
          </div>
        </div>
        <h1 className={styles.title}>{banco.nombre}</h1>
        <p className={styles.subtitle}>Código: {banco.codigo}</p>
      </div>

      <div className={styles.detailGrid}>
        <div className={styles.detailCard}>
          <div className={styles.detailCardHeader}>
            <h3 className={styles.detailCardTitle}>
              <Building2 className={styles.detailCardIcon} />
              Información General
            </h3>
          </div>
          <div className={styles.detailCardBody}>
            <div className={styles.detailList}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Nombre</span>
                <span className={styles.detailValue}>{banco.nombre}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Código</span>
                <span className={styles.detailValue} style={{ fontFamily: 'monospace' }}>
                  {banco.codigo}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Dirección</span>
                <span className={styles.detailValue}>{banco.direccion}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Fecha de Registro</span>
                <span className={styles.detailValue}>
                  {formatDate(banco.fechaRegistro)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.detailCard}>
          <div className={styles.detailCardHeader}>
            <h3 className={styles.detailCardTitle}>
              <Mail className={styles.detailCardIcon} />
              Contacto
            </h3>
          </div>
          <div className={styles.detailCardBody}>
            <div className={styles.detailList}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Email</span>
                <span className={styles.detailValue}>{banco.email}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Teléfono</span>
                <span className={styles.detailValue}>{banco.telefono}</span>
              </div>
              {banco.sitioWeb && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Sitio Web</span>
                  <a
                    href={banco.sitioWeb}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#2563eb', textDecoration: 'underline' }}
                  >
                    {banco.sitioWeb}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.detailCard}>
          <div className={styles.detailCardHeader}>
            <h3 className={styles.detailCardTitle}>
              <Percent className={styles.detailCardIcon} />
              Tasas y Plazos
            </h3>
          </div>
          <div className={styles.detailCardBody}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem',
              }}
            >
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Tasa Mínima</span>
                <span
                  className={styles.detailValue}
                  style={{ fontSize: '1.25rem', fontWeight: 700 }}
                >
                  {formatPercent(banco.tasaInteresMin)}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Tasa Máxima</span>
                <span
                  className={styles.detailValue}
                  style={{ fontSize: '1.25rem', fontWeight: 700 }}
                >
                  {formatPercent(banco.tasaInteresMax)}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Plazo Mínimo</span>
                <span
                  className={styles.detailValue}
                  style={{ fontSize: '1.25rem', fontWeight: 700 }}
                >
                  {banco.plazoMinimo} meses
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Plazo Máximo</span>
                <span
                  className={styles.detailValue}
                  style={{ fontSize: '1.25rem', fontWeight: 700 }}
                >
                  {banco.plazoMaximo} meses
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.detailCard}>
          <div className={styles.detailCardHeader}>
            <h3 className={styles.detailCardTitle}>
              <CreditCard className={styles.detailCardIcon} />
              Montos y Créditos
            </h3>
          </div>
          <div className={styles.detailCardBody}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem',
              }}
            >
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Monto Mínimo</span>
                <span
                  className={styles.detailValue}
                  style={{ fontSize: '1.25rem', fontWeight: 700 }}
                >
                  {formatCurrency(banco.montoMinimo)}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Monto Máximo</span>
                <span
                  className={styles.detailValue}
                  style={{ fontSize: '1.25rem', fontWeight: 700 }}
                >
                  {formatCurrency(banco.montoMaximo)}
                </span>
              </div>
            </div>
            <div
              style={{
                marginTop: '1.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid #e5e7eb',
              }}
            >
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Créditos Activos</span>
                <span
                  className={styles.detailValue}
                  style={{ fontSize: '2rem', fontWeight: 700, color: '#2563eb' }}
                >
                  {banco.creditosActivos}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
