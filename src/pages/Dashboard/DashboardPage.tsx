/**
 * Dashboard Page - Tu Crédito Frontend
 * Integrado desde Vercel v0 - Adaptado para react-router-dom
 */

import React, { useEffect } from 'react';
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
import {
  getDashboardStats,
  getRecentActivity,
  getRecentCreditos,
} from '../../data/mock-data';
import { formatCurrency, formatDate } from '../../utils/format';
import { setDocumentMeta } from '../../utils/meta';
import { ROUTES } from '../../app/config/constants';
import { Button } from '../../components/ui/Button/Button';
import styles from './DashboardPage.module.css';

/**
 * DashboardPage component
 * Página principal del dashboard
 */
export function DashboardPage(): React.JSX.Element {
  const navigate = useNavigate();
  const stats = getDashboardStats();
  const recentActivity = getRecentActivity();
  const recentCreditos = getRecentCreditos();

  useEffect(() => {
    setDocumentMeta({
      title: 'Dashboard',
      description: 'Panel principal de Tu Crédito',
    });
  }, []);

  const statCards = [
    {
      label: 'Clientes Activos',
      value: stats.clientesActivos.toString(),
      icon: FaUsers,
      iconClass: styles.statIconBlue,
      trend: '+12%',
      trendUp: true,
    },
    {
      label: 'Créditos Activos',
      value: stats.creditosActivos.toString(),
      icon: FaCreditCard,
      iconClass: styles.statIconGreen,
      trend: '+8%',
      trendUp: true,
    },
    {
      label: 'Monto Total',
      value: formatCurrency(stats.montoTotalCreditos),
      icon: FaArrowUp,
      iconClass: styles.statIconPurple,
      trend: '+23%',
      trendUp: true,
    },
    {
      label: 'Bancos',
      value: stats.bancosActivos.toString(),
      icon: FaBuilding,
      iconClass: styles.statIconOrange,
      trend: '0%',
      trendUp: true,
    },
  ];

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado) {
      case 'activo':
        return styles.badgeGreen;
      case 'pendiente':
        return styles.badgeYellow;
      case 'aprobado':
        return styles.badgeBlue;
      case 'rechazado':
      case 'vencido':
        return styles.badgeRed;
      default:
        return styles.badgeBlue;
    }
  };

  const getActivityIconClass = (type: string) => {
    switch (type) {
      case 'credito':
        return styles.activityIconGreen;
      case 'cliente':
        return styles.activityIconBlue;
      default:
        return styles.activityIconYellow;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'credito':
        return FaCreditCard;
      case 'cliente':
        return FaUserPlus;
      default:
        return FaFileAlt;
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
              {recentCreditos.slice(0, 5).map((credito) => (
                <tr key={credito.id}>
                  <td>
                    <div className={styles.clientName}>
                      {credito.clienteNombre}
                    </div>
                  </td>
                  <td>{formatCurrency(credito.monto)}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${getEstadoBadgeClass(credito.estado)}`}
                    >
                      {credito.estado}
                    </span>
                  </td>
                  <td>{formatDate(credito.fechaSolicitud)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Activity */}
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
          <ul className={styles.activityList}>
            {recentActivity.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <li key={activity.id} className={styles.activityItem}>
                  <div
                    className={`${styles.activityIcon} ${getActivityIconClass(activity.type)}`}
                  >
                    <Icon className={styles.activityIconSvg} />
                  </div>
                  <div className={styles.activityContent}>
                    <p className={styles.activityText}>{activity.message}</p>
                    <p className={styles.activityTime}>{activity.time}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
