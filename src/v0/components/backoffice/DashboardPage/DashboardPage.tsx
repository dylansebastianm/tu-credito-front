"use client";

import {
  Users,
  CreditCard,
  Building2,
  TrendingUp,
  TrendingDown,
  Clock,
  UserPlus,
  FileText,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import {
  getDashboardStats,
  getRecentActivity,
  getRecentCreditos,
} from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Route } from "@/lib/routes";
import styles from "./DashboardPage.module.css";

interface DashboardPageProps {
  navigate: (route: Route) => void;
}

export function DashboardPage({ navigate }: DashboardPageProps) {
  const stats = getDashboardStats();
  const recentActivity = getRecentActivity();
  const recentCreditos = getRecentCreditos();

  const statCards = [
    {
      label: "Clientes Activos",
      value: stats.clientesActivos.toString(),
      icon: Users,
      iconClass: styles.statIconBlue,
      trend: "+12%",
      trendUp: true,
    },
    {
      label: "Creditos Activos",
      value: stats.creditosActivos.toString(),
      icon: CreditCard,
      iconClass: styles.statIconGreen,
      trend: "+8%",
      trendUp: true,
    },
    {
      label: "Monto Total",
      value: formatCurrency(stats.montoTotalCreditos),
      icon: TrendingUp,
      iconClass: styles.statIconPurple,
      trend: "+23%",
      trendUp: true,
    },
    {
      label: "Bancos",
      value: stats.bancosActivos.toString(),
      icon: Building2,
      iconClass: styles.statIconOrange,
      trend: "0%",
      trendUp: true,
    },
  ];

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado) {
      case "activo":
        return styles.badgeGreen;
      case "pendiente":
        return styles.badgeYellow;
      case "aprobado":
        return styles.badgeBlue;
      case "rechazado":
      case "vencido":
        return styles.badgeRed;
      default:
        return styles.badgeBlue;
    }
  };

  const getActivityIconClass = (type: string) => {
    switch (type) {
      case "credito":
        return styles.activityIconGreen;
      case "cliente":
        return styles.activityIconBlue;
      default:
        return styles.activityIconYellow;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "credito":
        return CreditCard;
      case "cliente":
        return UserPlus;
      default:
        return FileText;
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
                  <TrendingUp className={styles.statTrendIcon} />
                ) : (
                  <TrendingDown className={styles.statTrendIcon} />
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
        <button
          className={styles.quickActionCard}
          onClick={() => navigate("cliente-nuevo")}
        >
          <div className={styles.quickActionIcon}>
            <UserPlus className={styles.quickActionIconSvg} />
          </div>
          <p className={styles.quickActionText}>Nuevo Cliente</p>
        </button>
        <button
          className={styles.quickActionCard}
          onClick={() => navigate("credito-nuevo")}
        >
          <div className={styles.quickActionIcon}>
            <Plus className={styles.quickActionIconSvg} />
          </div>
          <p className={styles.quickActionText}>Nuevo Credito</p>
        </button>
        <button
          className={styles.quickActionCard}
          onClick={() => navigate("banco-nuevo")}
        >
          <div className={styles.quickActionIcon}>
            <Building2 className={styles.quickActionIconSvg} />
          </div>
          <p className={styles.quickActionText}>Nuevo Banco</p>
        </button>
      </div>

      {/* Main Grid */}
      <div className={styles.mainGrid}>
        {/* Recent Credits Table */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Creditos Recientes</h2>
            <button
              className={styles.viewAllButton}
              onClick={() => navigate("creditos")}
            >
              Ver todos
              <ArrowUpRight
                style={{
                  width: 14,
                  height: 14,
                  display: "inline",
                  marginLeft: 4,
                }}
              />
            </button>
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
              <Clock
                style={{
                  width: 18,
                  height: 18,
                  display: "inline",
                  marginRight: 8,
                  verticalAlign: "middle",
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
