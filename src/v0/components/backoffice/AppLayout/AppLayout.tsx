"use client";

import React from "react"

import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Building2,
  FileText,
  LogOut,
  Menu,
  X,
  DollarSign,
  User,
} from "lucide-react";
import type { Route } from "@/lib/routes";
import styles from "./AppLayout.module.css";

interface AppLayoutProps {
  children: React.ReactNode;
  currentRoute: Route;
  onNavigate: (route: Route) => void;
  onLogout: () => void;
  userName: string;
}

const navItems = [
  { route: "dashboard" as Route, label: "Dashboard", icon: LayoutDashboard },
  { route: "clientes" as Route, label: "Clientes", icon: Users },
  { route: "creditos" as Route, label: "Creditos", icon: CreditCard },
  { route: "bancos" as Route, label: "Bancos", icon: Building2 },
  { route: "docs" as Route, label: "Documentacion", icon: FileText },
];

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  clientes: "Clientes",
  "cliente-nuevo": "Nuevo Cliente",
  "cliente-detalle": "Detalle Cliente",
  "cliente-editar": "Editar Cliente",
  creditos: "Creditos",
  "credito-nuevo": "Nuevo Credito",
  "credito-detalle": "Detalle Credito",
  "credito-editar": "Editar Credito",
  bancos: "Bancos",
  "banco-nuevo": "Nuevo Banco",
  "banco-detalle": "Detalle Banco",
  "banco-editar": "Editar Banco",
  docs: "Documentacion",
};

export function AppLayout({
  children,
  currentRoute,
  onNavigate,
  onLogout,
  userName,
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (route: Route) => {
    if (route === "clientes") return currentRoute.startsWith("cliente");
    if (route === "creditos") return currentRoute.startsWith("credito");
    if (route === "bancos") return currentRoute.startsWith("banco");
    return currentRoute === route;
  };

  const getParentRoute = (): Route | null => {
    if (currentRoute.startsWith("cliente") && currentRoute !== "clientes")
      return "clientes";
    if (currentRoute.startsWith("credito") && currentRoute !== "creditos")
      return "creditos";
    if (currentRoute.startsWith("banco") && currentRoute !== "bancos")
      return "bancos";
    return null;
  };

  const parentRoute = getParentRoute();

  return (
    <div className={styles.layout}>
      {/* Overlay for mobile */}
      <div
        className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarVisible : ""}`}
      >
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <DollarSign className={styles.logoIconSvg} />
            </div>
            <div className={styles.logoText}>
              <h1 className={styles.logoTitle}>Tu Credito</h1>
              <p className={styles.logoSubtitle}>Sistema de Gestion</p>
            </div>
          </div>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.route} className={styles.navItem}>
                <button
                  onClick={() => {
                    onNavigate(item.route);
                    setSidebarOpen(false);
                  }}
                  className={`${styles.navButton} ${isActive(item.route) ? styles.navButtonActive : ""}`}
                >
                  <item.icon className={styles.navIcon} />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <User className={styles.userAvatarIcon} />
            </div>
            <div className={styles.userDetails}>
              <p className={styles.userName}>{userName}</p>
              <p className={styles.userRole}>Administrador</p>
            </div>
            <button
              onClick={onLogout}
              className={styles.logoutButton}
              title="Cerrar sesion"
            >
              <LogOut className={styles.logoutIcon} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button
              className={styles.menuButton}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <X className={styles.menuIcon} />
              ) : (
                <Menu className={styles.menuIcon} />
              )}
            </button>
            <nav className={styles.breadcrumb}>
              <button
                onClick={() => onNavigate("dashboard")}
                className={styles.breadcrumbLink}
              >
                Inicio
              </button>
              {parentRoute && (
                <>
                  <span className={styles.breadcrumbSeparator}>/</span>
                  <button
                    onClick={() => onNavigate(parentRoute)}
                    className={styles.breadcrumbLink}
                  >
                    {routeLabels[parentRoute]}
                  </button>
                </>
              )}
              <span className={styles.breadcrumbSeparator}>/</span>
              <span className={styles.breadcrumbCurrent}>
                {routeLabels[currentRoute] || currentRoute}
              </span>
            </nav>
          </div>
        </header>

        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
