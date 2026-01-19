/**
 * Cliente Detail Page - Tu Crédito Frontend
 * Integrado desde Vercel v0 - Adaptado para react-router-dom
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  User,
  Mail,
  CreditCard,
} from 'lucide-react';
import { setDocumentMeta } from '../../utils/meta';
import { mockClientes, type MockCliente } from '../../data/mock-data';
import { formatCurrency, formatDate, getEstadoLabel } from '../../utils/format';
import { ROUTES } from '../../app/config/constants';
import styles from './Clientes.module.css';

/**
 * ClienteDetailPage component
 * Página de detalle de cliente
 */
export function ClienteDetailPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<MockCliente | null>(null);

  useEffect(() => {
    if (id) {
      const foundCliente = mockClientes.find((c) => c.id === id);
      setCliente(foundCliente || null);

      if (foundCliente) {
        setDocumentMeta({
          title: `${foundCliente.nombre} ${foundCliente.apellido}`,
          description: `Detalle del cliente ${foundCliente.nombre} ${foundCliente.apellido}`,
        });
      }
    }
  }, [id]);

  if (!cliente) {
    return (
      <div className={styles.container}>
        <p>Cliente no encontrado</p>
      </div>
    );
  }

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado) {
      case 'activo':
        return styles.badgeGreen;
      case 'inactivo':
        return styles.badgeRed;
      case 'pendiente':
        return styles.badgeYellow;
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
              onClick={() => navigate(ROUTES.CLIENTES)}
              className={styles.secondaryButton}
            >
              <ArrowLeft className={styles.buttonIcon} />
              Volver
            </button>
          </div>
          <div className={styles.headerActions}>
            <button
              onClick={() => navigate(ROUTES.CLIENTE_DETAIL(cliente.id))}
              className={styles.primaryButton}
            >
              <Edit className={styles.buttonIcon} />
              Editar
            </button>
          </div>
        </div>
        <h1 className={styles.title}>
          {cliente.nombre} {cliente.apellido}
        </h1>
        <p className={styles.subtitle}>Detalle del cliente</p>
      </div>

      <div className={styles.detailGrid}>
        <div className={styles.detailCard}>
          <div className={styles.detailCardHeader}>
            <h3 className={styles.detailCardTitle}>
              <User className={styles.detailCardIcon} />
              Información Personal
            </h3>
          </div>
          <div className={styles.detailCardBody}>
            <div className={styles.detailList}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Nombre Completo</span>
                <span className={styles.detailValue}>
                  {cliente.nombre} {cliente.apellido}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>DNI/CURP</span>
                <span className={styles.detailValue}>{cliente.dni}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Fecha de Nacimiento</span>
                <span className={styles.detailValue}>
                  {formatDate(cliente.fechaNacimiento)}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Estado</span>
                <span
                  className={`${styles.badge} ${getEstadoBadgeClass(cliente.estado)}`}
                >
                  {getEstadoLabel(cliente.estado)}
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
                <span className={styles.detailValue}>{cliente.email}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Teléfono</span>
                <span className={styles.detailValue}>{cliente.telefono}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Dirección</span>
                <span className={styles.detailValue}>{cliente.direccion}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Ciudad</span>
                <span className={styles.detailValue}>{cliente.ciudad}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.detailCard} ${styles.detailCardFull}`}>
          <div className={styles.detailCardHeader}>
            <h3 className={styles.detailCardTitle}>
              <CreditCard className={styles.detailCardIcon} />
              Información de Créditos
            </h3>
          </div>
          <div className={styles.detailCardBody}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.5rem',
              }}
            >
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Créditos Activos</span>
                <span
                  className={styles.detailValue}
                  style={{ fontSize: '1.5rem', fontWeight: 700 }}
                >
                  {cliente.creditosActivos}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Monto Total</span>
                <span
                  className={styles.detailValue}
                  style={{ fontSize: '1.5rem', fontWeight: 700 }}
                >
                  {formatCurrency(cliente.montoTotalCreditos)}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Fecha de Registro</span>
                <span className={styles.detailValue}>
                  {formatDate(cliente.fechaRegistro)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
