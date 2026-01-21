/**
 * Dashboard Page - Tu Crédito Frontend
 * Panel principal del sistema
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers,
  FiCreditCard,
  FiDollarSign,
  FiGrid,
  FiArrowUp,
  FiExternalLink,
  FiClock,
  FiFileText,
  FiPlus,
  FiUserPlus,
} from 'react-icons/fi';
import { Breadcrumb } from '../../components/ui/Breadcrumb/Breadcrumb';
import { formatCurrency, formatDate } from '../../utils/format';
import { setDocumentMeta } from '../../utils/meta';
import { ROUTES } from '../../app/config/constants';
import { clientesService } from '../../services/clientes.service';
import { creditosService } from '../../services/creditos.service';
import { bancosService } from '../../services/bancos.service';
import type { CreditoListItem } from '../../types/credito';
import styles from './DashboardPage.module.css';

/**
 * DashboardPage component
 * Página principal del dashboard
 */
export function DashboardPage(): React.JSX.Element {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    clientesActivos: 0,
    creditosActivos: 0,
    montoTotalCreditos: 0,
    bancosActivos: 0,
  });
  const [recentCreditos, setRecentCreditos] = useState<CreditoListItem[]>([]);

  useEffect(() => {
    setDocumentMeta({
      title: 'Dashboard',
      description: 'Panel principal de Tu Crédito',
    });

    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Cargar datos en paralelo
      const [clientesRes, creditosRes, bancosRes, creditosRecentRes, allCreditosRes] = await Promise.all([
        clientesService.getAll({ page_size: 1 }),
        creditosService.getAll({ page_size: 1 }),
        bancosService.getAll({ page_size: 1 }),
        creditosService.getAll({
          page_size: 10,
          ordering: '-fecha_registro',
        }),
        creditosService.getAll({ page_size: 1000 }), // Para calcular monto total
      ]);

      // Calcular monto total de todos los créditos
      const montoTotal = allCreditosRes.results.reduce((sum, credito) => {
        return sum + parseFloat(credito.monto || '0');
      }, 0);

      setStats({
        clientesActivos: clientesRes.count,
        creditosActivos: creditosRes.count,
        montoTotalCreditos: montoTotal,
        bancosActivos: bancosRes.count,
      });

      // Limitar a los últimos 10 créditos
      setRecentCreditos(creditosRecentRes.results.slice(0, 10));
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    }
  };

  const formatMontoTotal = (monto: number): string => {
    if (monto >= 1000000) {
      return `$${(monto / 1000000).toFixed(1)}M`;
    }
    if (monto >= 1000) {
      return `$${(monto / 1000).toFixed(1)}K`;
    }
    return formatCurrency(monto);
  };

  const getTipoCreditoClass = (tipo: string): string => {
    const tipoLower = tipo.toLowerCase();
    if (tipoLower.includes('comercial')) return styles.comercial;
    if (tipoLower.includes('automotriz')) return styles.automotriz;
    if (tipoLower.includes('hipotecario')) return styles.hipotecario;
    return styles.personal;
  };

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Inicio', route: ROUTES.DASHBOARD },
          { label: 'Dashboard' },
        ]}
      />

      {/* Header */}
      <div className={styles.header}>
        <h1>Dashboard</h1>
        <p>Bienvenido al sistema de gestión Tu Credito</p>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Clientes Activos</span>
            <span className={styles.statValue}>{stats.clientesActivos}</span>
            <span className={`${styles.statChange} ${styles.positive}`}>
              <FiArrowUp size={12} />
              +12% vs mes anterior
            </span>
          </div>
          <div className={`${styles.statIcon} ${styles.blue}`}>
            <FiUsers size={22} />
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Créditos Activos</span>
            <span className={styles.statValue}>{stats.creditosActivos}</span>
            <span className={`${styles.statChange} ${styles.positive}`}>
              <FiArrowUp size={12} />
              +8% vs mes anterior
            </span>
          </div>
          <div className={`${styles.statIcon} ${styles.green}`}>
            <FiCreditCard size={22} />
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Monto Total</span>
            <span className={styles.statValue}>
              {formatMontoTotal(stats.montoTotalCreditos)}
            </span>
            <span className={`${styles.statChange} ${styles.positive}`}>
              <FiArrowUp size={12} />
              +23% vs mes anterior
            </span>
          </div>
          <div className={`${styles.statIcon} ${styles.purple}`}>
            <FiDollarSign size={22} />
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Bancos</span>
            <span className={styles.statValue}>{stats.bancosActivos}</span>
            <span className={styles.statChange}>
              <FiArrowUp size={12} />
              0% vs mes anterior
            </span>
          </div>
          <div className={`${styles.statIcon} ${styles.amber}`}>
            <FiGrid size={22} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <button
          className={`${styles.actionButton} ${styles.primary}`}
          onClick={() => navigate(ROUTES.CLIENTE_NUEVO)}
        >
          <FiUserPlus size={16} />
          Nuevo Cliente
        </button>
        <button
          className={`${styles.actionButton} ${styles.secondary}`}
          onClick={() => navigate(ROUTES.CREDITO_NUEVO)}
        >
          <FiPlus size={16} />
          Nuevo Crédito
        </button>
        <button
          className={`${styles.actionButton} ${styles.secondary}`}
          onClick={() => navigate(ROUTES.BANCO_NUEVO)}
        >
          <FiGrid size={16} />
          Nuevo Banco
        </button>
      </div>

      {/* Content Grid */}
      <div className={styles.contentGrid}>
        {/* Recent Credits Table */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Créditos Recientes</h2>
            <a
              href="#"
              className={styles.viewAllLink}
              onClick={(e) => {
                e.preventDefault();
                navigate(ROUTES.CREDITOS);
              }}
            >
              Ver todos
              <FiExternalLink size={14} />
            </a>
          </div>
          {recentCreditos.length === 0 ? (
            <div className={styles.emptyState}>
              <FiCreditCard size={48} />
              <p>No hay créditos registrados</p>
            </div>
          ) : (
            <>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Monto</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCreditos.map((credito) => (
                    <tr key={credito.id}>
                      <td className={styles.clientName}>{credito.cliente_nombre}</td>
                      <td className={styles.amount}>
                        {formatCurrency(parseFloat(credito.monto || '0'))}
                      </td>
                      <td>
                        <span
                          className={`${styles.badge} ${getTipoCreditoClass(
                            credito.tipo_credito_display || credito.tipo_credito
                          )}`}
                        >
                          {credito.tipo_credito_display ||
                            credito.tipo_credito.charAt(0).toUpperCase() +
                              credito.tipo_credito.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td>{formatDate(credito.fecha_registro)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>

        {/* Activity Card */}
        <div className={`${styles.card} ${styles.activityCard}`}>
          <div className={styles.activityHeader}>
            <FiClock size={18} />
            <h2 className={styles.cardTitle}>Actividad Reciente</h2>
          </div>
          <div className={styles.activityContent}>
            <div className={styles.activityIcon}>
              <FiFileText size={24} />
            </div>
            <p>La actividad reciente se mostrará aquí</p>
          </div>
        </div>
      </div>
    </div>
  );
}
