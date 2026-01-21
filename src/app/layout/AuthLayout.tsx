/**
 * Auth Layout - Tu Crédito Frontend
 */

import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  FaChartLine,
  FaUsers,
  FaCreditCard,
  FaBuilding,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUser,
} from 'react-icons/fa';
import { authService } from '../../services/auth.service';
import { ROUTES } from '../config/constants';
import styles from './AuthLayout.module.css';

interface NavItem {
  route: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { route: ROUTES.DASHBOARD, label: 'Dashboard', icon: FaChartLine },
  { route: ROUTES.CLIENTES, label: 'Clientes', icon: FaUsers },
  { route: ROUTES.CREDITOS, label: 'Créditos', icon: FaCreditCard },
  { route: ROUTES.BANCOS, label: 'Bancos', icon: FaBuilding },
];


/**
 * AuthLayout component
 * Layout con sidebar y navbar para rutas autenticadas
 */
export function AuthLayout(): React.JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('Administrador');

  useEffect(() => {
    // Obtener nombre de usuario
    authService.getCurrentUser().then((user) => {
      if (user) {
        setUserName(user.username || 'Administrador');
      }
    });
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate(ROUTES.LOGIN);
  };

  const isActive = (route: string) => {
    const path = location.pathname;
    if (route === ROUTES.CLIENTES) return path.startsWith('/clientes');
    if (route === ROUTES.CREDITOS) return path.startsWith('/creditos');
    if (route === ROUTES.BANCOS) return path.startsWith('/bancos');
    return path === route;
  };


  return (
    <div className={styles.layout}>
      {/* Overlay for mobile */}
      <div
        className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarVisible : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
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
                <Link
                  to={item.route}
                  onClick={() => setSidebarOpen(false)}
                  className={`${styles.navButton} ${isActive(item.route) ? styles.navButtonActive : ''}`}
                >
                  <item.icon className={styles.navIcon} />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <FaUser className={styles.userAvatarIcon} />
            </div>
            <div className={styles.userDetails}>
              <p className={styles.userName}>{userName}</p>
              <p className={styles.userRole}>Administrador</p>
            </div>
            <button
              onClick={handleLogout}
              className={styles.logoutButton}
              title="Cerrar sesión"
            >
              <FaSignOutAlt className={styles.logoutIcon} />
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
                <FaTimes className={styles.menuIcon} />
              ) : (
                <FaBars className={styles.menuIcon} />
              )}
            </button>
          </div>
        </header>

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
