/**
 * Docs Page - Tu Crédito Frontend
 * Integrado desde Vercel v0 - Adaptado para react-router-dom
 */

import React, { useEffect, useState } from 'react';
import { Layers, Layout, Server, Palette } from 'lucide-react';
import { setDocumentMeta } from '../../utils/meta';
import styles from './DocsPage.module.css';

type TabId = 'arquitectura' | 'componentes' | 'servicios' | 'estilos';

/**
 * DocsPage component
 * Página de documentación de la API
 */
export function DocsPage(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<TabId>('arquitectura');

  useEffect(() => {
    setDocumentMeta({
      title: 'Documentación',
      description: 'Guía técnica del sistema Tu Crédito',
    });
  }, []);

  const tabs = [
    { id: 'arquitectura' as TabId, label: 'Arquitectura', icon: Layers },
    { id: 'componentes' as TabId, label: 'Componentes', icon: Layout },
    { id: 'servicios' as TabId, label: 'Servicios', icon: Server },
    { id: 'estilos' as TabId, label: 'Estilos', icon: Palette },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Documentación</h1>
        <p className={styles.subtitle}>Guía técnica del sistema Tu Crédito</p>
      </div>

      <div className={styles.tabs}>
        <div className={styles.tabList}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tabButton} ${activeTab === tab.id ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className={styles.tabIcon} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Arquitectura Tab */}
        <div
          className={`${styles.tabContent} ${activeTab === 'arquitectura' ? styles.tabContentActive : ''}`}
        >
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <Layers className={styles.cardTitleIcon} />
                Arquitectura del Sistema
              </h2>
              <p className={styles.cardDescription}>
                Estructura general del proyecto Tu Crédito
              </p>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Estructura de Carpetas</h3>
                <pre className={styles.codeBlock}>
{`/src
  /app
    /router          # Configuración de rutas
    /layout          # Layouts (Auth, Public)
    /providers       # Providers globales
    /config          # Configuración (env, constants)
  /pages
    /Login           # Página de login
    /Dashboard       # Dashboard principal
    /Clientes        # Módulo de clientes
    /Creditos        # Módulo de créditos
    /Bancos          # Módulo de bancos
    /Docs            # Documentación
  /components
    /ui              # Componentes UI reutilizables
    /domain          # Componentes de dominio
  /services          # Servicios API
  /types             # Definiciones TypeScript
  /utils             # Utilidades
  /styles            # Estilos globales
  /data              # Mock data`}
                </pre>
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Tecnologías</h3>
                <div className={styles.badgeList}>
                  <span className={styles.badge}>React 18+</span>
                  <span className={styles.badge}>TypeScript</span>
                  <span className={styles.badge}>Vite</span>
                  <span className={`${styles.badge} ${styles.badgeOutline}`}>CSS Modules</span>
                  <span className={`${styles.badge} ${styles.badgeOutline}`}>Lucide Icons</span>
                </div>
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Patrón de Navegación</h3>
                <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                  La aplicación utiliza react-router-dom para navegación. Las rutas están
                  protegidas con ProtectedRoute que verifica autenticación.
                </p>
                <pre className={styles.codeBlock}>
{`// Rutas disponibles
/                    → Dashboard (protegida)
/clientes            → Lista de clientes (protegida)
/clientes/nuevo      → Crear cliente (protegida)
/clientes/:id        → Detalle cliente (protegida)
/creditos            → Lista de créditos (protegida)
/creditos/nuevo      → Crear crédito (protegida)
/creditos/:id        → Detalle crédito (protegida)
/bancos              → Lista de bancos (protegida)
/bancos/nuevo        → Crear banco (protegida)
/bancos/:id          → Detalle banco (protegida)
/docs                → Documentación (protegida)
/login               → Login (pública)`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Componentes Tab */}
        <div
          className={`${styles.tabContent} ${activeTab === 'componentes' ? styles.tabContentActive : ''}`}
        >
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <Layout className={styles.cardTitleIcon} />
                Componentes del Sistema
              </h2>
              <p className={styles.cardDescription}>
                Descripción de los componentes principales
              </p>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.componentGrid}>
                <div className={styles.componentCard}>
                  <h4 className={styles.componentTitle}>AuthLayout</h4>
                  <p className={styles.componentDescription}>
                    Layout principal para usuarios autenticados. Incluye sidebar con navegación,
                    header con breadcrumbs y área de contenido.
                  </p>
                </div>

                <div className={styles.componentCard}>
                  <h4 className={styles.componentTitle}>LoginPage</h4>
                  <p className={styles.componentDescription}>
                    Formulario de autenticación con validación. Incluye toggle de visibilidad
                    de contraseña y manejo de errores.
                  </p>
                </div>

                <div className={styles.componentCard}>
                  <h4 className={styles.componentTitle}>DashboardPage</h4>
                  <p className={styles.componentDescription}>
                    Panel principal con estadísticas, créditos recientes, actividad reciente
                    y acciones rápidas.
                  </p>
                </div>

                <div className={styles.componentCard}>
                  <h4 className={styles.componentTitle}>ClientesListPage</h4>
                  <p className={styles.componentDescription}>
                    Módulo completo de clientes con listado, búsqueda, filtros, formulario
                    de creación/edición y vista de detalle.
                  </p>
                </div>

                <div className={styles.componentCard}>
                  <h4 className={styles.componentTitle}>CreditosListPage</h4>
                  <p className={styles.componentDescription}>
                    Gestión de créditos con cálculo automático de cuotas y monto total.
                    Incluye selección de cliente y banco.
                  </p>
                </div>

                <div className={styles.componentCard}>
                  <h4 className={styles.componentTitle}>BancosListPage</h4>
                  <p className={styles.componentDescription}>
                    Administración de bancos con configuración de tasas, plazos y montos
                    mínimos/máximos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Servicios Tab */}
        <div
          className={`${styles.tabContent} ${activeTab === 'servicios' ? styles.tabContentActive : ''}`}
        >
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <Server className={styles.cardTitleIcon} />
                Servicios y Datos
              </h2>
              <p className={styles.cardDescription}>
                Lógica de negocio y manejo de datos
              </p>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Mock Data</h3>
                <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                  El sistema utiliza mock data para desarrollo. Los datos se encuentran
                  en src/data/mock-data.ts.
                </p>
                <pre className={styles.codeBlock}>
{`// src/data/mock-data.ts
import { mockClientes, mockCreditos, mockBancos } from './mock-data';

// Obtener estadísticas del dashboard
const stats = getDashboardStats();

// Obtener actividad reciente
const activity = getRecentActivity();`}
                </pre>
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>API Documentation</h3>
                <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                  Acceso a la documentación interactiva de la API REST:
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <a
                    href="http://localhost:8000/api/docs/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: '#2563eb',
                      color: 'white',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: 500,
                    }}
                  >
                    Swagger UI
                  </a>
                  <a
                    href="http://localhost:8000/api/redoc/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: '#059669',
                      color: 'white',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: 500,
                    }}
                  >
                    ReDoc
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estilos Tab */}
        <div
          className={`${styles.tabContent} ${activeTab === 'estilos' ? styles.tabContentActive : ''}`}
        >
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <Palette className={styles.cardTitleIcon} />
                Sistema de Estilos
              </h2>
              <p className={styles.cardDescription}>
                CSS Modules y sistema de diseño
              </p>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>CSS Modules</h3>
                <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                  El sistema utiliza CSS Modules para estilos con scope local.
                  Cada componente tiene su propio archivo .module.css.
                </p>
                <pre className={styles.codeBlock}>
{`// Uso en componente
import styles from './LoginPage.module.css';

<div className={styles.container}>
  <h1 className={styles.title}>Login</h1>
</div>`}
                </pre>
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Breakpoints Responsive</h3>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Breakpoint</th>
                      <th>Min Width</th>
                      <th>CSS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>sm</td>
                      <td>640px</td>
                      <td className={styles.mono}>@media (min-width: 640px)</td>
                    </tr>
                    <tr>
                      <td>md</td>
                      <td>768px</td>
                      <td className={styles.mono}>@media (min-width: 768px)</td>
                    </tr>
                    <tr>
                      <td>lg</td>
                      <td>1024px</td>
                      <td className={styles.mono}>@media (min-width: 1024px)</td>
                    </tr>
                    <tr>
                      <td>xl</td>
                      <td>1280px</td>
                      <td className={styles.mono}>@media (min-width: 1280px)</td>
                    </tr>
                    <tr>
                      <td>2xl</td>
                      <td>1536px</td>
                      <td className={styles.mono}>@media (min-width: 1536px)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
