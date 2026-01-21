# Tu Crédito - Frontend

Frontend profesional para el sistema de gestión de clientes, créditos y bancos. Construido con React 18+, TypeScript, Vite y react-router-dom.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Desarrollo](#desarrollo)
- [Integración con Vercel v0](#integración-con-vercel-v0)
- [Convenciones](#convenciones)
- [Uso de IA](#uso-de-ia)
- [Próximos Pasos](#próximos-pasos)

## 🚀 Características

### Stack Tecnológico

- **React 18+**: Librería UI
- **TypeScript**: Type safety
- **Vite**: Build tool rápido
- **react-router-dom**: Routing de la aplicación
- **CSS Modules**: Estilos encapsulados por componente
- **react-icons**: Iconos (instalado, listo para usar)

### Arquitectura

- ✅ Routing completo con react-router-dom
- ✅ Protected routes (rutas protegidas con autenticación)
- ✅ Layouts separados (AuthLayout y PublicLayout)
- ✅ Sistema de estilos global (tokens, breakpoints, utilities)
- ✅ TypeScript estricto con tipos bien definidos
- ✅ Servicios API (stubs listos para implementar)
- ✅ Manejo de errores global (ErrorBoundary)
- ✅ Metadata/SEO helper manual
- ✅ Estructura preparada para integrar Vercel v0

## 📦 Requisitos

- Node.js 18+ y npm (o yarn/pnpm)
- Backend Django ejecutándose en `http://localhost:8000`

## 🔧 Instalación

1. **Instalar dependencias**

```bash
cd frontend
npm install
```

2. **Configurar variables de entorno**

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env y configurar VITE_API_BASE_URL si es necesario
```

3. **Iniciar servidor de desarrollo**

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:5173` (puerto por defecto de Vite).

## ⚙️ Configuración

### Variables de Entorno

Crear archivo `.env` en la raíz del proyecto `frontend/`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### Rutas Disponibles

- `/login` - Página de inicio de sesión (pública)
- `/` - Dashboard (protegida)
- `/clientes` - Lista de clientes (protegida)
- `/clientes/nuevo` - Crear cliente (protegida)
- `/clientes/:id` - Detalle de cliente (protegida)
- `/creditos` - Lista de créditos (protegida)
- `/creditos/nuevo` - Crear crédito (protegida)
- `/creditos/:id` - Detalle de crédito (protegida)
- `/bancos` - Lista de bancos (protegida)
- `/bancos/nuevo` - Crear banco (protegida)
- `/bancos/:id` - Detalle de banco (protegida)
- `*` - Página 404 (cualquier ruta no encontrada)

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/
│   │   ├── config/          # Configuración (env, constants)
│   │   ├── layout/          # Layouts (AuthLayout, PublicLayout)
│   │   ├── providers/       # Providers (AppProviders)
│   │   └── router/          # Routing (routes, ProtectedRoute)
│   ├── components/
│   │   ├── domain/          # Componentes de dominio (FiltersBar)
│   │   └── ui/              # Componentes UI reutilizables
│   │       ├── Alert/
│   │       ├── Button/
│   │       ├── Card/
│   │       ├── EmptyState/
│   │       ├── ErrorBoundary/
│   │       ├── Input/
│   │       ├── Modal/
│   │       ├── Navbar/
│   │       ├── Pagination/
│   │       ├── Select/
│   │       ├── Spinner/
│   │       └── Table/
│   ├── pages/               # Páginas de la aplicación
│   │   ├── Login/
│   │   ├── Dashboard/
│   │   ├── Clientes/
│   │   ├── Creditos/
│   │   ├── Bancos/
│   │   └── NotFound/
│   ├── services/            # Servicios API
│   │   ├── apiClient.ts
│   │   ├── auth.service.ts
│   │   ├── clientes.service.ts
│   │   ├── creditos.service.ts
│   │   └── bancos.service.ts
│   ├── styles/              # Estilos globales
│   │   ├── tokens.css       # Design tokens (variables CSS)
│   │   ├── globals.css      # Reset + estilos base
│   │   ├── breakpoints.css  # Sistema de breakpoints
│   │   └── utilities.css    # Clases utilitarias
│   ├── types/               # Tipos TypeScript
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── cliente.ts
│   │   ├── credito.ts
│   │   └── banco.ts
│   ├── utils/               # Utilidades
│   │   ├── error.ts
│   │   ├── format.ts
│   │   ├── meta.ts
│   │   ├── queryParams.ts
│   │   └── validators.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css            # Entry point de estilos
├── .env.example
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README_frontend.md
```

## 🛠️ Desarrollo

### Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Build
npm run build        # Construye para producción
npm run preview      # Preview del build de producción

# Linting
npm run lint         # Ejecuta ESLint

# Testing
npm run test         # Ejecuta tests en modo watch
npm run test:ui      # Ejecuta tests con interfaz gráfica
npm run test:coverage # Ejecuta tests con cobertura
```

### Scripts NPM

- `dev`: Inicia Vite en modo desarrollo
- `build`: Construye la aplicación para producción
- `preview`: Preview local del build de producción
- `lint`: Ejecuta ESLint
- `test`: Ejecuta tests con Vitest (modo watch)
- `test:ui`: Ejecuta tests con interfaz gráfica de Vitest
- `test:coverage`: Ejecuta tests y genera reporte de cobertura

## 🎨 Integración con Vercel v0

### Pasos para Integrar Vercel v0

1. **Generar diseño en Vercel v0**
   - Crea el diseño de tus componentes/páginas en Vercel v0
   - Exporta los componentes generados

2. **Copiar archivos desde v0**
   - Copia el contenido de los componentes desde v0
   - Reemplaza el contenido de los archivos `.tsx` correspondientes
   - Reemplaza el contenido de los archivos `.module.css` correspondientes

3. **Mantener estructura existente**
   - ✅ **NO cambiar** nombres de archivos ni rutas
   - ✅ **NO cambiar** exports ni imports principales
   - ✅ **Mantener** la estructura de carpetas
   - ✅ **Mantener** los hooks useEffect para metadata (en páginas)
   - ✅ **Mantener** la lógica de routing y autenticación

4. **Archivos que pueden reemplazarse completamente**
   - `*.module.css` - Todos los archivos de estilos de componentes/páginas
   - Contenido JSX dentro de componentes/páginas (manteniendo estructura base)

5. **Archivos que NO deben tocarse**
   - `src/app/router/routes.tsx` - Configuración de rutas
   - `src/app/router/ProtectedRoute.tsx` - Lógica de protección
   - `src/app/layout/*.tsx` - Estructura base de layouts (solo estilos pueden cambiar)
   - `src/services/*` - Lógica de servicios API
   - `src/types/*` - Tipos TypeScript
   - `src/styles/*.css` - Sistema global de estilos (tokens, breakpoints, etc.)

### Convenciones para Integración

- Todos los componentes y páginas tienen el comentario:
  ```
  UI IMPLEMENTATION PROVIDED BY VERCEL v0 – PLACEHOLDER ONLY
  ```
  
- Los archivos `.module.css` tienen comentarios placeholder que indican que serán reemplazados

- La estructura de exports/imports está diseñada para que al reemplazar contenido, no haya que cambiar rutas

- Cada página usa `setDocumentMeta()` en `useEffect` - mantener esta lógica al integrar v0

## 🎯 Convenciones

### CSS Modules + Sistema Global

El proyecto usa **CSS Modules** para estilos de componentes junto con un **sistema global de estilos**:

1. **Design Tokens** (`src/styles/tokens.css`)
   - Variables CSS para colores, tipografía, spacing, etc.
   - Uso: `var(--color-primary-600)`, `var(--spacing-4)`, etc.

2. **Global Styles** (`src/styles/globals.css`)
   - Reset ligero + estilos base del documento

3. **Breakpoints** (`src/styles/breakpoints.css`)
   - Sistema de breakpoints reutilizable
   - Uso en módulos CSS: `@media (min-width: 768px) { ... }`

4. **Utilities** (`src/styles/utilities.css`)
   - Clases utilitarias mínimas (.container, .stack, .inline, etc.)

### Patrón de Uso de Breakpoints

En tus módulos CSS, usa media queries directamente:

```css
/* En tu-component.module.css */
.myComponent {
  padding: var(--spacing-4);
}

@media (min-width: 768px) {
  .myComponent {
    padding: var(--spacing-6);
  }
}

@media (min-width: 1024px) {
  .myComponent {
    padding: var(--spacing-8);
  }
}
```

### TypeScript

- Todos los componentes están tipados
- No usar `any` - tipos explícitos siempre
- Tipos compartidos en `src/types/`

### Servicios API

- Los servicios son **stubs** - están listos para implementar la lógica real
- Usan `apiClient.ts` como base
- Retornan tipos bien definidos (`PaginatedResponse<T>`, etc.)

## 📝 Notas Importantes

### Autenticación

- Actualmente usa **localStorage** (TEMPORAL) - TODO: migrar a httpOnly cookies
- `authService` tiene métodos mock - implementar lógica real cuando backend esté listo

### Metadata/SEO

- Se usa helper manual (`utils/meta.ts`) sin librerías externas
- Cada página establece metadata con `setDocumentMeta()` en `useEffect`

### Manejo de Errores

- `ErrorBoundary` captura errores de React
- `ApiError` para errores de API
- Helper `getErrorMessage()` para mostrar mensajes al usuario

## 🤖 Uso de IA

Se utilizaron herramientas de IA (Cursor, ChatGPT, Vercel v0) de manera estratégica y selectiva en las siguientes áreas del desarrollo:

1. **Diseño UX/UI con Vercel v0**
   - Generación de componentes y páginas con diseño moderno y profesional
   - Creación de interfaces de usuario consistentes y accesibles
   - Diseño de layouts responsivos y componentes reutilizables
   - **Razón**: Acelerar el proceso de diseño visual manteniendo estándares de UX/UI profesionales, permitiendo enfocarse en la lógica de negocio y funcionalidad

2. **Modularización y estructuración de componentes**
   - Asistencia en la organización de la arquitectura de componentes (UI, Domain, Pages)
   - Refactorización de código para mejorar la separación de responsabilidades
   - Estructuración de servicios API y utilidades
   - **Razón**: Acelerar la implementación de patrones arquitectónicos complejos mientras se mantiene la calidad del código

3. **Escritura y generación de código repetitivo**
   - Generación de componentes UI reutilizables (Alert, Modal, ConfirmDialog)
   - Creación de tipos TypeScript y interfaces
   - Configuración de servicios API y manejo de errores
   - **Razón**: Reducir tiempo en tareas repetitivas, permitiendo enfocarse en lógica de negocio y validaciones críticas

4. **Documentación y comentarios**
   - Generación de documentación técnica en README
   - Elaboración de comentarios y docstrings consistentes
   - Documentación de convenciones y patrones de uso
   - **Razón**: Mantener documentación completa y profesional mientras se acelera el proceso de escritura

5. **Integración y conexión de servicios**
   - Configuración de routing y autenticación
   - Integración de servicios API con el backend
   - Implementación de manejo de estados globales (LoadingContext)
   - **Razón**: Asegurar configuración correcta de componentes complejos siguiendo mejores prácticas

6. **Toma de decisiones técnicas**
   - Consulta sobre mejores prácticas para arquitectura React (Context API, Hooks)
   - Evaluación de opciones para manejo de estado y routing
   - Validación de patrones de diseño de componentes
   - **Razón**: Validar decisiones técnicas contra estándares de la industria y mejores prácticas actuales

7. **Resolución de errores de build y debugging**
   - Identificación y corrección de errores de TypeScript
   - Resolución de problemas de configuración en Vite
   - Debugging de problemas de integración con servicios API
   - **Razón**: Acelerar el proceso de debugging manteniendo la calidad del código

8. **Mejora de UX y componentes interactivos**
   - Implementación de componentes de confirmación (ConfirmDialog)
   - Mejora de feedback visual (Alert, Loading states)
   - Optimización de interacciones asíncronas
   - **Razón**: Mejorar la experiencia de usuario con componentes modernos y accesibles

#### Enfoque del uso de IA:

La IA se utilizó como herramienta de **productividad y validación**, no como reemplazo del conocimiento técnico. Todas las decisiones finales, arquitectura y lógica de negocio fueron diseñadas y revisadas por el desarrollador, utilizando IA principalmente para:
- Acelerar tareas repetitivas
- Generar diseños UX/UI profesionales con Vercel v0
- Validar decisiones técnicas
- Mantener consistencia en documentación y código
- Resolver problemas técnicos específicos

Este enfoque permitió mantener la calidad y coherencia del código mientras se optimizaba el tiempo de desarrollo y se lograba un diseño visual profesional.

## 🧪 Testing

El proyecto usa **Vitest** como test runner, compatible con Vite y con API similar a Jest. Los tests cubren utilidades críticas, validaciones y funciones puras.

### ¿Qué se está testeando?

- ✅ **Utilidades de formateo** (`format.ts`): Formateo de moneda, fechas, porcentajes, cálculos financieros
- ✅ **Manejo de errores** (`error.ts`): Extracción de mensajes de error del servidor, priorización de mensajes
- ✅ **Validadores** (`validators.ts`): Validación de emails, campos requeridos, números positivos, rangos
- 🔄 **Próximamente**: Componentes UI, servicios API, hooks personalizados, flujos de integración

### Ejecutar Tests

```bash
# Ejecutar todos los tests (modo watch - se re-ejecutan al cambiar archivos)
npm run test

# Ejecutar tests una sola vez
npm run test -- --run

# Ejecutar tests con interfaz gráfica
npm run test:ui

# Ejecutar tests con cobertura de código
npm run test:coverage

# Ejecutar tests específicos
npm run test -- src/tests/utils/format.test.ts
npm run test -- -t formatCurrency  # Solo tests que contengan "formatCurrency"
```

### Estructura de Tests

Los tests están organizados en `src/tests/` siguiendo la misma estructura del código fuente:

```
src/tests/
├── setup.ts              # Configuración global de tests
├── utils/
│   ├── format.test.ts    # Tests de formateo (18 tests) - CRÍTICO
│   ├── error.test.ts     # Tests de manejo de errores (13 tests) - CRÍTICO
│   └── validators.test.ts # Tests de validaciones (12 tests)
└── ...
```

### Prioridades de Testing

1. **Crítico**: Utilidades de formateo (`format.ts`) - Errores aquí muestran datos financieros incorrectos
2. **Crítico**: Manejo de errores (`error.ts`) - Si falla, usuarios no ven errores claros del servidor
3. **Alto**: API Client (`apiClient.ts`) - Maneja autenticación y comunicación con backend
4. **Alto**: Protección de rutas (`ProtectedRoute.tsx`) - Seguridad de rutas protegidas
5. **Medio**: Validadores, formularios, componentes UI

### Escribir Tests

Los tests usan **Vitest** y **React Testing Library**:

```typescript
import { describe, it, expect } from 'vitest';
import { formatCurrency } from '@/utils/format';

describe('formatCurrency', () => {
  it('debe formatear números correctamente', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00');
  });
});
```

## 🚀 Próximos Pasos

- [ ] Implementar lógica real en servicios API
- [ ] Migrar autenticación a httpOnly cookies
- [ ] Integrar diseño de Vercel v0
- [x] Agregar tests (Vitest) - Tests críticos implementados
- [ ] Agregar tests de API Client y ProtectedRoute
- [ ] Configurar CI/CD
- [ ] Optimizar bundle size

## 📄 Licencia

Este proyecto es parte de una prueba técnica.

---

**Desarrollado con ❤️ usando React, TypeScript y Vite**
