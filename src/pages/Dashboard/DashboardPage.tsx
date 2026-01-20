/**
 * Dashboard Page - Tu Crédito Frontend
 * Integrado desde Vercel v0 - Adaptado para react-router-dom
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUsers,
  FaCreditCard,
  FaBuilding,
  FaArrowUp,
  FaArrowDown,
  FaClock,
  FaUserPlus,
  FaFileAlt,
  FaPlus,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import { formatCurrency, formatDate } from '../../utils/format';
import { setDocumentMeta } from '../../utils/meta';
import { ROUTES } from '../../app/config/constants';
import { Button } from '../../components/ui/Button/Button';
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
  const [loading, setLoading] = useState(true);
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
      setLoading(true);

      // Cargar datos en paralelo
      const [clientesRes, creditosRes, bancosRes] = await Promise.all([
        clientesService.getAll({ page_size: 1 }),
        creditosService.getAll({ page_size: 1 }),
        bancosService.getAll({ page_size: 1 }),
      ]);

      // Obtener créditos recientes
      const creditosResFull = await creditosService.getAll({
        page_size: 5,
        ordering: '-fecha_registro',
      });

      // Calcular monto total de créditos
      const montoTotal = creditosResFull.results.reduce((sum, credito) => {
        return sum + parseFloat(credito.monto || '0');
      }, 0);

      setStats({
        clientesActivos: clientesRes.count,
        creditosActivos: creditosRes.count,
        montoTotalCreditos: montoTotal,
        bancosActivos: bancosRes.count,
      });

      setRecentCreditos(creditosResFull.results);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Clientes Activos',
      value: loading ? '...' : stats.clientesActivos.toString(),
      icon: FaUsers,
      iconClass: styles.statIconBlue,
      trend: '+12%',
      trendUp: true,
    },
    {
      label: 'Créditos Activos',
      value: loading ? '...' : stats.creditosActivos.toString(),
      icon: FaCreditCard,
      iconClass: styles.statIconGreen,
      trend: '+8%',
      trendUp: true,
    },
    {
      label: 'Monto Total',
      value: loading ? '...' : formatCurrency(stats.montoTotalCreditos),
      icon: FaArrowUp,
      iconClass: styles.statIconPurple,
      trend: '+23%',
      trendUp: true,
    },
    {
      label: 'Bancos',
      value: loading ? '...' : stats.bancosActivos.toString(),
      icon: FaBuilding,
      iconClass: styles.statIconOrange,
      trend: '0%',
      trendUp: true,
    },
  ];

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case 'activo':
      case 'aprobado':
        return styles.badgeGreen;
      case 'pendiente':
        return styles.badgeYellow;
      case 'rechazado':
      case 'vencido':
        return styles.badgeRed;
      default:
        return styles.badgeBlue;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>
          Bienvenido al sistema de gestion Tu Credito
        </p>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {statCards.map((stat) => (
          <div key={stat.label} className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>{stat.label}</p>
                <p className={styles.statValue}>{stat.value}</p>
              </div>
              <div className={`${styles.statIcon} ${stat.iconClass}`}>
                <stat.icon className={styles.statIconSvg} />
              </div>
            </div>
            <div className={styles.statFooter}>
              <span
                className={`${styles.statTrend} ${stat.trendUp ? styles.statTrendUp : styles.statTrendDown}`}
              >
                {stat.trendUp ? (
                  <FaArrowUp className={styles.statTrendIcon} />
                ) : (
                  <FaArrowDown className={styles.statTrendIcon} />
                )}
                {stat.trend}
              </span>
              <span className={styles.statPeriod}>vs mes anterior</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <Button
          variant="primary"
          width="full"
          onClick={() => navigate(ROUTES.CLIENTE_NUEVO)}
          leftIcon={<FaUserPlus />}
        >
          Nuevo Cliente
        </Button>
        <Button
          variant="primary"
          width="full"
          onClick={() => navigate(ROUTES.CREDITO_NUEVO)}
          leftIcon={<FaPlus />}
        >
          Nuevo Crédito
        </Button>
        <Button
          variant="primary"
          width="full"
          onClick={() => navigate(ROUTES.BANCO_NUEVO)}
          leftIcon={<FaBuilding />}
        >
          Nuevo Banco
        </Button>
      </div>

      {/* Main Grid */}
      <div className={styles.mainGrid}>
        {/* Recent Credits Table */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Créditos Recientes</h2>
            <Button
              variant="ghost"
              onClick={() => navigate(ROUTES.CREDITOS)}
              rightIcon={<FaExternalLinkAlt />}
            >
              Ver todos
            </Button>
          </div>
          {loading ? (
            <div className={styles.loadingState}>
              <p>Cargando créditos...</p>
            </div>
          ) : recentCreditos.length === 0 ? (
            <div className={styles.emptyState}>
              <FaCreditCard className={styles.emptyIcon} />
              <p className={styles.emptyText}>No hay créditos registrados</p>
              <Button
                variant="primary"
                onClick={() => navigate(ROUTES.CREDITO_NUEVO)}
                leftIcon={<FaPlus />}
              >
                Crear primer crédito
              </Button>
            </div>
          ) : (
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
                    <td>
                      <div className={styles.clientName}>
                        {credito.cliente_nombre}
                      </div>
                    </td>
                    <td>{formatCurrency(parseFloat(credito.monto || '0'))}</td>
                    <td>
                      <span
                        className={`${styles.badge} ${getEstadoBadgeClass(credito.tipo_credito_display || '')}`}
                      >
                        {credito.tipo_credito_display || credito.tipo_credito}
                      </span>
                    </td>
                    <td>{formatDate(credito.fecha_registro)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Activity - Placeholder */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <FaClock
                style={{
                  width: 18,
                  height: 18,
                  display: 'inline',
                  marginRight: 8,
                  verticalAlign: 'middle',
                }}
              />
              Actividad Reciente
            </h2>
          </div>
          <div className={styles.emptyState}>
            <FaFileAlt className={styles.emptyIcon} />
            <p className={styles.emptyText}>
              La actividad reciente se mostrará aquí
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
