"use client";

import { useState } from "react";
import { Layers, Layout, Server, Palette } from "lucide-react";
import styles from "./DocsPage.module.css";

type TabId = "arquitectura" | "componentes" | "servicios" | "estilos";

export function DocsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("arquitectura");

  const tabs = [
    { id: "arquitectura" as TabId, label: "Arquitectura", icon: Layers },
    { id: "componentes" as TabId, label: "Componentes", icon: Layout },
    { id: "servicios" as TabId, label: "Servicios", icon: Server },
    { id: "estilos" as TabId, label: "Estilos", icon: Palette },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Documentacion</h1>
        <p className={styles.subtitle}>Guia tecnica del sistema Tu Credito</p>
      </div>

      <div className={styles.tabs}>
        <div className={styles.tabList}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tabButton} ${activeTab === tab.id ? styles.tabButtonActive : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className={styles.tabIcon} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Arquitectura Tab */}
        <div
          className={`${styles.tabContent} ${activeTab === "arquitectura" ? styles.tabContentActive : ""}`}
        >
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <Layers className={styles.cardTitleIcon} />
                Arquitectura del Sistema
              </h2>
              <p className={styles.cardDescription}>
                Estructura general del proyecto Tu Credito
              </p>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Estructura de Carpetas</h3>
                <pre className={styles.codeBlock}>
{`/app
  page.tsx          # Pagina principal con routing
  layout.tsx        # Layout raiz
  globals.css       # Estilos globales

/components
  /backoffice       # Componentes del backoffice
    /AppLayout      # Layout principal autenticado
    /LoginPage      # Pagina de login
    /DashboardPage  # Dashboard con estadisticas
    /ClientesPage   # Modulo de clientes
    /CreditosPage   # Modulo de creditos
    /BancosPage     # Modulo de bancos
    /DocsPage       # Documentacion
    /shared         # Estilos compartidos

/lib
  types.ts          # Definiciones TypeScript
  mock-data.ts      # Datos de prueba
  auth.ts           # Gestion de autenticacion
  format.ts         # Utilidades de formato
  routes.ts         # Tipos de rutas`}
                </pre>
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Tecnologias</h3>
                <div className={styles.badgeList}>
                  <span className={styles.badge}>Next.js 14</span>
                  <span className={styles.badge}>React 18</span>
                  <span className={styles.badge}>TypeScript</span>
                  <span className={`${styles.badge} ${styles.badgeOutline}`}>CSS Modules</span>
                  <span className={`${styles.badge} ${styles.badgeOutline}`}>Lucide Icons</span>
                </div>
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Patron de Navegacion</h3>
                <p style={{ color: "#6b7280", marginBottom: "16px" }}>
                  La aplicacion utiliza un sistema de routing basado en estado React.
                  Esto permite una experiencia SPA fluida sin recargas de pagina.
                </p>
                <pre className={styles.codeBlock}>
{`// Tipos de rutas disponibles
type Route = 
  | "dashboard" 
  | "clientes" | "cliente-detalle" | "cliente-nuevo" | "cliente-editar"
  | "creditos" | "credito-detalle" | "credito-nuevo" | "credito-editar"
  | "bancos" | "banco-detalle" | "banco-nuevo" | "banco-editar"
  | "docs";

// Navegacion
const navigate = (route: Route, params?: Record<string, string>) => {
  setRouteState({ route, params });
};`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Componentes Tab */}
        <div
          className={`${styles.tabContent} ${activeTab === "componentes" ? styles.tabContentActive : ""}`}
        >
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <Layout className={styles.cardTitleIcon} />
                Componentes del Sistema
              </h2>
              <p className={styles.cardDescription}>
                Descripcion de los componentes principales
              </p>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.componentGrid}>
                <div className={styles.componentCard}>
                  <h4 className={styles.componentTitle}>AppLayout</h4>
                  <p className={styles.componentDescription}>
                    Layout principal para usuarios autenticados. Incluye sidebar con navegacion,
                    header con breadcrumbs y area de contenido.
                  </p>
                </div>

                <div className={styles.componentCard}>
                  <h4 className={styles.componentTitle}>LoginPage</h4>
                  <p className={styles.componentDescription}>
                    Formulario de autenticacion con validacion. Incluye toggle de visibilidad
                    de contrasena y manejo de errores.
                  </p>
                </div>

                <div className={styles.componentCard}>
                  <h4 className={styles.componentTitle}>DashboardPage</h4>
                  <p className={styles.componentDescription}>
                    Panel principal con estadisticas, creditos recientes, actividad reciente
                    y acciones rapidas.
                  </p>
                </div>

                <div className={styles.componentCard}>
                  <h4 className={styles.componentTitle}>ClientesPage</h4>
                  <p className={styles.componentDescription}>
                    Modulo completo de clientes con listado, busqueda, filtros, formulario
                    de creacion/edicion y vista de detalle.
                  </p>
                </div>

                <div className={styles.componentCard}>
                  <h4 className={styles.componentTitle}>CreditosPage</h4>
                  <p className={styles.componentDescription}>
                    Gestion de creditos con calculo automatico de cuotas y monto total.
                    Incluye seleccion de cliente y banco.
                  </p>
                </div>

                <div className={styles.componentCard}>
                  <h4 className={styles.componentTitle}>BancosPage</h4>
                  <p className={styles.componentDescription}>
                    Administracion de bancos con configuracion de tasas, plazos y montos
                    minimos/maximos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Servicios Tab */}
        <div
          className={`${styles.tabContent} ${activeTab === "servicios" ? styles.tabContentActive : ""}`}
        >
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <Server className={styles.cardTitleIcon} />
                Servicios y Datos
              </h2>
              <p className={styles.cardDescription}>
                Logica de negocio y manejo de datos
              </p>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Autenticacion</h3>
                <p style={{ color: "#6b7280", marginBottom: "16px" }}>
                  Sistema de autenticacion mock basado en localStorage para demostracion.
                </p>
                <pre className={styles.codeBlock}>
{`// lib/auth.ts
import { login, logout, isAuthenticated } from '@/lib/auth';

// Iniciar sesion
const success = await login('admin@tucredito.com', 'admin123');
if (success) {
  // Usuario autenticado
}

// Verificar autenticacion
if (isAuthenticated()) {
  // Usuario logueado
}

// Cerrar sesion
logout();`}
                </pre>
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Tipos de Datos</h3>
                <pre className={styles.codeBlock}>
{`// lib/types.ts
interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  fechaNacimiento: string;
  dni: string;
  estado: 'activo' | 'inactivo' | 'pendiente';
  fechaRegistro: string;
  creditosActivos: number;
  montoTotalCreditos: number;
}

interface Credito {
  id: string;
  clienteId: string;
  clienteNombre: string;
  bancoId: string;
  bancoNombre: string;
  monto: number;
  tasaInteres: number;
  plazoMeses: number;
  cuotaMensual: number;
  montoTotal: number;
  estado: EstadoCredito;
  fechaSolicitud: string;
  proposito: string;
}

interface Banco {
  id: string;
  nombre: string;
  codigo: string;
  tasaInteresMin: number;
  tasaInteresMax: number;
  plazoMinimo: number;
  plazoMaximo: number;
  montoMinimo: number;
  montoMaximo: number;
  estado: 'activo' | 'inactivo';
}`}
                </pre>
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Utilidades de Formato</h3>
                <pre className={styles.codeBlock}>
{`// lib/format.ts
import { 
  formatCurrency, 
  formatDate, 
  formatPercent,
  calculateCuotaMensual,
  calculateMontoTotal
} from '@/lib/format';

formatCurrency(100000);     // "$100,000.00"
formatDate('2024-01-15');   // "15 ene 2024"
formatPercent(12.5);        // "12.50%"

// Calculo de cuota mensual
const cuota = calculateCuotaMensual(100000, 12, 24);
const total = calculateMontoTotal(cuota, 24);`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Estilos Tab */}
        <div
          className={`${styles.tabContent} ${activeTab === "estilos" ? styles.tabContentActive : ""}`}
        >
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <Palette className={styles.cardTitleIcon} />
                Sistema de Estilos
              </h2>
              <p className={styles.cardDescription}>
                CSS Modules y sistema de diseno
              </p>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>CSS Modules</h3>
                <p style={{ color: "#6b7280", marginBottom: "16px" }}>
                  El sistema utiliza CSS Modules para estilos con scope local.
                  Cada componente tiene su propio archivo .module.css.
                </p>
                <pre className={styles.codeBlock}>
{`// Estructura de carpetas
/components/backoffice
  /LoginPage
    LoginPage.tsx
    LoginPage.module.css
    index.ts
  /DashboardPage
    DashboardPage.tsx
    DashboardPage.module.css
    index.ts

// Uso en componente
import styles from './LoginPage.module.css';

<div className={styles.container}>
  <h1 className={styles.title}>Login</h1>
</div>`}
                </pre>
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Colores del Sistema</h3>
                <div className={styles.colorGrid}>
                  <div className={styles.colorSwatch}>
                    <div className={`${styles.colorBox} ${styles.colorBoxBackground}`}></div>
                    <span className={styles.colorLabel}>background</span>
                  </div>
                  <div className={styles.colorSwatch}>
                    <div className={`${styles.colorBox} ${styles.colorBoxForeground}`}></div>
                    <span className={styles.colorLabel}>foreground</span>
                  </div>
                  <div className={styles.colorSwatch}>
                    <div className={`${styles.colorBox} ${styles.colorBoxPrimary}`}></div>
                    <span className={styles.colorLabel}>primary</span>
                  </div>
                  <div className={styles.colorSwatch}>
                    <div className={`${styles.colorBox} ${styles.colorBoxSecondary}`}></div>
                    <span className={styles.colorLabel}>secondary</span>
                  </div>
                  <div className={styles.colorSwatch}>
                    <div className={`${styles.colorBox} ${styles.colorBoxMuted}`}></div>
                    <span className={styles.colorLabel}>muted</span>
                  </div>
                  <div className={styles.colorSwatch}>
                    <div className={`${styles.colorBox} ${styles.colorBoxAccent}`}></div>
                    <span className={styles.colorLabel}>accent</span>
                  </div>
                  <div className={styles.colorSwatch}>
                    <div className={`${styles.colorBox} ${styles.colorBoxDestructive}`}></div>
                    <span className={styles.colorLabel}>destructive</span>
                  </div>
                  <div className={styles.colorSwatch}>
                    <div className={`${styles.colorBox} ${styles.colorBoxBorder}`}></div>
                    <span className={styles.colorLabel}>border</span>
                  </div>
                </div>
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
