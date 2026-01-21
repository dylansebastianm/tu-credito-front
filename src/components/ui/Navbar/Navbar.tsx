import React from 'react';
/**
 * Navbar Component - Tu Crédito Frontend
 * 
 * UI IMPLEMENTATION PROVIDED BY VERCEL v0 – PLACEHOLDER ONLY
 * Este componente será reemplazado cuando se integre el diseño de v0
 */

import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../../services/auth.service';
import { ROUTES } from '../../../app/config/constants';
import styles from './Navbar.module.css';

/**
 * Navbar component
 * Navegación principal de la aplicación
 */
export function Navbar(): React.JSX.Element {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to={ROUTES.DASHBOARD} className={styles.logo}>
          Tu Crédito
        </Link>
        <ul className={styles.menu}>
          <li>
            <Link to={ROUTES.DASHBOARD}>Dashboard</Link>
          </li>
          <li>
            <Link to={ROUTES.CLIENTES}>Clientes</Link>
          </li>
          <li>
            <Link to={ROUTES.CREDITOS}>Créditos</Link>
          </li>
          <li>
            <Link to={ROUTES.BANCOS}>Bancos</Link>
          </li>
          <li>
            <button onClick={handleLogout}>Salir</button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
