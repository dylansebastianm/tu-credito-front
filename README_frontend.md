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
- `/docs` - Documentación (protegida)
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
│   │   ├── Docs/
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
```

### Scripts NPM

- `dev`: Inicia Vite en modo desarrollo
- `build`: Construye la aplicación para producción
- `preview`: Preview local del build de producción
- `lint`: Ejecuta ESLint

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

## 🚀 Próximos Pasos

- [ ] Implementar lógica real en servicios API
- [ ] Migrar autenticación a httpOnly cookies
- [ ] Integrar diseño de Vercel v0
- [ ] Agregar tests (Jest/Vitest)
- [ ] Configurar CI/CD
- [ ] Optimizar bundle size

## 📄 Licencia

Este proyecto es parte de una prueba técnica.

---

**Desarrollado con ❤️ usando React, TypeScript y Vite**
