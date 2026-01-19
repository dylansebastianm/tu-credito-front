import React from 'react';
/**
 * Not Found Page - Tu Crédito Frontend
 * 
 * UI IMPLEMENTATION PROVIDED BY VERCEL v0 – PLACEHOLDER ONLY
 * Este componente será reemplazado cuando se integre el diseño de v0
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { setDocumentMeta } from '../../utils/meta';
import { ROUTES } from '../../app/config/constants';
import styles from './NotFoundPage.module.css';

/**
 * NotFoundPage component
 * Página 404
 */
export function NotFoundPage(): React.JSX.Element {
  useEffect(() => {
    setDocumentMeta({
      title: 'Página no encontrada',
      description: 'La página que buscas no existe',
    });
  }, []);

  return (
    <main className={styles.notFoundPage}>
      <h1>404</h1>
      <h2>Página no encontrada</h2>
      {/* UI IMPLEMENTATION PROVIDED BY VERCEL v0 – PLACEHOLDER ONLY */}
      <p>La página que buscas no existe o ha sido movida.</p>
      <Link to={ROUTES.DASHBOARD}>Volver al Dashboard</Link>
    </main>
  );
}
