/**
 * Public Layout - Tu Crédito Frontend
 * Layout para rutas públicas (sin navbar)
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './PublicLayout.module.css';

/**
 * PublicLayout component
 * Layout simple sin navbar para rutas públicas
 */
export function PublicLayout(): React.JSX.Element {
  return (
    <div className={styles.layout}>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
