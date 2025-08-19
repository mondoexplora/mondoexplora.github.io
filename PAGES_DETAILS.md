# PÁGINAS DETALLES - MONDOEXPLORA

## 📋 **Resumen**
Documentación técnica detallada de todas las páginas del proyecto MondoExplora Next.js, incluyendo el sistema de blog completo migrado de Flask a Next.js.

## 🏠 **PÁGINA HOME** (`/[lang]/page.tsx`)

### **URL Structure**
- **Patrón**: `/[lang]/` (ej: `/en/`, `/es/`, `/fr/`, `/it/`)
- **Ejemplo**: `https://mondoexplora.com/en/`

### **Funcionalidad**
- **H1**: "Discover Amazing Destinations"
- **Contenido**: Destinos populares, rutas, países y ofertas destacadas
- **Data Source**: `getPopularDestinations()`, `getPopularRoutes()`, `getPopularCountries()`, `getFeaturedDeals()`

### **Componentes**
- `Hero` - Sección principal con título y CTA
- `HotelGrid` - Grid de ofertas destacadas
- `Footer` - Pie de página con navegación

### **generateStaticParams**
```typescript
export async function generateStaticParams() {
  return [
    { lang: 'en' },
    { lang: 'es' },
    { lang: 'fr' },
    { lang: 'it' }
  ];
}
```

---

## 🏙️ **PÁGINA DESTINATION** (`/[lang]/destination/[city]/page.tsx`)

### **URL Structure**
- **Patrón**: `/[lang]/destination/[city]`
- **Ejemplo**: `https://mondoexplora.com/en/destination/bangkok`

### **Funcionalidad**
- **H1**: Generado desde `destinationData.hero_title`
- **Hoteles**: Muestra hasta 6 hoteles del destino
- **Data Source**: `getDestinationData(lang, city)`

### **Data Structure**
```typescript
interface DestinationData {
  city: string;
  country: string;
  hero_title: string;
  description: string;
  hero_image: string;
  hotels?: Hotel[];
}
```

### **Componentes**
- `Hero` - Con título, descripción e imagen de fondo
- `HotelGrid` - Grid de hoteles con paginación
- `Footer` - Pie de página

### **generateStaticParams**
Lee todos los archivos JSON de `data/[lang]/destination/` y genera parámetros para cada ciudad.

---

## 🛣️ **PÁGINA ROUTE** (`/[lang]/route/[origin]/[destination]/page.tsx`)

### **URL Structure**
- **Patrón**: `/[lang]/route/[origin]/[destination]`
- **Ejemplo**: `https://mondoexplora.com/en/route/new-york/bangkok`

### **Funcionalidad**
- **H1**: Generado dinámicamente (ej: "New York to Bangkok")
- **CTA Dual**: Abre `/travel_modes/` en nueva tab + redirección a affiliate link
- **Hoteles**: Muestra 6 hoteles del destino
- **Data Sources**: 
  - `getDestinationData(lang, destination)` - Para hoteles
  - `getDestinationUrlData(destination)` - Para affiliate link

### **CTA System**
```typescript
// RouteCTA Component
- Nuevo tab: /[lang]/travel_modes/[origin]/[destination]
- Redirección actual: affiliate_link del destino
```

### **Componentes**
- `Hero` - Con título dinámico y CTA dual
- `RouteCTA` - Botón con lógica dual (Client Component)
- `HotelGrid` - 6 hoteles del destino
- `Related Links` - Enlaces a país y travel modes

### **generateStaticParams**
Lee rutas desde `config/routes.json`:
```json
{
  "routes": [
    { "origin": "new-york", "destination": "bangkok" },
    { "origin": "london", "destination": "paris" }
  ]
}
```

---

## 🌍 **PÁGINA COUNTRY** (`/[lang]/country/[country]/page.tsx`)

### **URL Structure**
- **Patrón**: `/[lang]/country/[country]`
- **Ejemplo**: `https://mondoexplora.com/en/country/thailand`

### **Funcionalidad**
- **H1**: "Discover [Country]"
- **Destinos**: Grid de destinos populares del país
- **Data Source**: `getCountryData(lang, country)`

### **Data Structure**
```typescript
interface CountryData {
  name: string;
  hero_image: string;
  description?: string;
  popular_destinations?: Array<{
    name: string;
    slug: string;
    image: string;
    description: string;
    hotel_count: number;
    hotel_deals: number;
    avg_price: number;
  }>;
}
```

### **Componentes**
- `Hero` - Con título "Discover [Country]"
- `Destination Cards` - Grid de destinos populares
- `Footer` - Pie de página

### **Destination Cards**
- **Imagen**: Desde `destination.hero_image` o `destination.image`
- **Precio**: Badge en esquina superior derecha (fondo blanco, texto verde)
- **Link**: `/[lang]/destination/[slug]`

### **generateStaticParams**
Lee todos los archivos JSON de `data/[lang]/country/` y genera parámetros para cada país.

---

## 🚗 **PÁGINA TRAVEL_MODES** (`/[lang]/travel_modes/[origin]/[destination]/page.tsx`)

### **URL Structure**
- **Patrón**: `/[lang]/travel_modes/[origin]/[destination]`
- **Ejemplo**: `https://mondoexplora.com/en/travel_modes/new-york/bangkok`

### **Funcionalidad**
- **Estado**: Placeholder (pendiente de implementación)
- **Propósito**: Comparación de modos de transporte
- **Data Source**: `getRouteData(lang, origin, destination)`

### **generateStaticParams**
Mismo sistema que route pages - lee desde `config/routes.json`.

---

## 🔧 **CONFIGURACIÓN TÉCNICA**

### **TypeScript Interfaces**
```typescript
// src/types/index.ts
export interface Hotel {
  title: string;
  description: string;
  price: number;
  original_price?: number;
  hero_image: string;
  link: string;
  location_heading: string;
  location_subheading: string;
  vendor_name?: string;
}

export interface DestinationData {
  city: string;
  country: string;
  hero_title: string;
  description: string;
  hero_image: string;
  hotels?: Hotel[];
}

export interface CountryData {
  name: string;
  hero_image: string;
  description?: string;
  popular_destinations?: Array<{...}>;
}

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'it';
```

### **Data Loading Functions**
```typescript
// src/lib/data.ts
- getDestinationData(lang: SupportedLanguage, city: string)
- getCountryData(lang: SupportedLanguage, country: string)
- getDestinationUrlData(destination: string)
- getRouteData(lang: SupportedLanguage, origin: string, destination: string)
```

### **CSS Classes Principales**
```css
- .main-content - Contenedor principal
- .hotel-section-header - Título de sección de hoteles
- .destination-grid - Grid de destinos
- .destination-card - Tarjeta de destino
- .destination-price-badge - Badge de precio
- .hero-section - Sección hero
- .related-links - Enlaces relacionados
```

---

## ⚠️ **ERRORES COMUNES Y SOLUCIONES**

### **TypeScript Errors**
1. **"Property does not exist on type"**
   - **Solución**: Verificar interface en `src/types/index.ts`
   - **Ejemplo**: `hotel.value` → `hotel.original_price`

2. **"Argument of type 'string' is not assignable to parameter of type 'SupportedLanguage'"**
   - **Solución**: Cast `lang as SupportedLanguage`
   - **Ejemplo**: `getDestinationData(lang as SupportedLanguage, city)`

3. **"Module has no exported member"**
   - **Solución**: Verificar imports y exports en `src/types/index.ts`

### **Build Errors**
1. **"Page is missing generateStaticParams()"**
   - **Solución**: Agregar función `generateStaticParams()` al archivo
   - **Causa**: Next.js `output: 'export'` requiere parámetros estáticos

2. **"Cannot find module '@/components/'"**
   - **Solución**: Verificar `tsconfig.json` paths y existencia de archivos

### **Runtime Errors**
1. **"Event handlers cannot be passed to Client Component props"**
   - **Solución**: Mover lógica a Client Component separado
   - **Ejemplo**: `DestinationImage` component para `onError`

---

## 🚀 **DEPLOYMENT**

### **Netlify Configuration**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "out"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### **Build Process**
1. `npm run build` - Genera páginas estáticas en `/out`
2. Netlify publica desde `/out`
3. Redirects manejan rutas dinámicas

### **Branch Strategy**
- **`spa-experiment`**: Desarrollo activo
- **`main`**: Producción estable
- **Deploy automático** desde `spa-experiment`

---

## 📝 **SISTEMA DE BLOG COMPLETO**

### **🏠 PÁGINA BLOG HOME** (`/blog/page.tsx`)

#### **URL Structure**
- **Patrón**: `/blog/`
- **Ejemplo**: `https://mondoexplora.com/blog/`

#### **Funcionalidad**
- **H1**: "MondoExplora Travel Blog"
- **Contenido**: Posts destacados, categorías y navegación
- **Data Source**: Mock data desde localStorage (posts de ejemplo)

#### **Componentes**
- `BlogHeader` - Navegación del blog
- `FeaturedPosts` - Posts destacados
- `BlogFooter` - Pie de página del blog

#### **CSS Aislado**
- **Archivo**: `src/app/blog.css`
- **Prefijo**: `blog-` para evitar conflictos con el sitio principal
- **Clases principales**: `.blog-container`, `.blog-header`, `.blog-main`, `.blog-card`

---

### **🔐 PÁGINA BLOG LOGIN** (`/blog/login/page.tsx`)

#### **URL Structure**
- **Patrón**: `/blog/login/`
- **Ejemplo**: `https://mondoexplora.com/blog/login/`

#### **Funcionalidad**
- **Autenticación**: Sistema de login para bloggers
- **Validación**: Verifica usuarios en localStorage
- **Redirección**: A dashboard tras login exitoso
- **Estado**: Requiere `isApproved: true` para acceso

#### **Data Structure**
```typescript
interface BlogUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  isApproved: boolean;
  createdAt: string;
}
```

#### **Componentes**
- `LoginForm` - Formulario de autenticación
- `ErrorHandling` - Manejo de errores de login
- `SuccessRedirect` - Redirección tras login exitoso

---

### **📝 PÁGINA BLOG SIGNUP** (`/blog/signup/page.tsx`)

#### **URL Structure**
- **Patrón**: `/blog/signup/`
- **Ejemplo**: `https://mondoexplora.com/blog/signup/`

#### **Funcionalidad**
- **Registro en 2 pasos**: Email + código de invitación, luego datos personales
- **Validación**: Códigos de invitación desde localStorage
- **Estado**: Nuevos usuarios marcados como `isApproved: false`
- **Persistencia**: Datos guardados en localStorage

#### **Proceso de Registro**
1. **Paso 1**: Email y código de invitación
2. **Paso 2**: Nombre completo, username, bio
3. **Guardado**: Usuario agregado a `pendingCreators` en localStorage

#### **Data Structure**
```typescript
interface InvitationCode {
  code: string;
  createdBy: string;
  createdAt: string;
  isUsed: boolean;
  usedBy?: string;
}
```

---

### **📊 PÁGINA BLOG DASHBOARD** (`/blog/dashboard/page.tsx`)

#### **URL Structure**
- **Patrón**: `/blog/dashboard/`
- **Ejemplo**: `https://mondoexplora.com/blog/dashboard/`

#### **Funcionalidad**
- **Dashboard personal**: Estadísticas y posts del blogger
- **Posts del usuario**: Lista de posts creados por el usuario actual
- **Acciones rápidas**: Crear nuevo post, editar existentes
- **Estado**: Muestra información del usuario logueado

#### **Componentes**
- `UserStats` - Estadísticas del usuario
- `UserPosts` - Lista de posts del usuario
- `QuickActions` - Botones de acción rápida
- `EmptyStates` - Estados vacíos cuando no hay posts

---

### **⚙️ PÁGINA BLOG ADMIN** (`/blog/admin/page.tsx`)

#### **URL Structure**
- **Patrón**: `/blog/admin/`
- **Ejemplo**: `https://mondoexplora.com/blog/admin/`

#### **Funcionalidad**
- **Gestión de códigos**: Generar y ver códigos de invitación
- **Aprobación de usuarios**: Aprobar creadores pendientes
- **Estadísticas**: Contadores de usuarios y códigos
- **Debug info**: Información de localStorage para desarrollo

#### **Acciones Disponibles**
- **Generate Codes**: Crear nuevos códigos de invitación
- **Approve Creator**: Mover usuarios de `pendingCreators` a `approvedCreators`
- **View Stats**: Ver estadísticas de usuarios y códigos

#### **Data Management**
- **localStorage Keys**: `invitationCodes`, `pendingCreators`, `approvedCreators`
- **Debug Info**: Muestra contadores en tiempo real

---

### **✏️ PÁGINA BLOG CREATE** (`/blog/create/page.tsx`)

#### **URL Structure**
- **Patrón**: `/blog/create/`
- **Ejemplo**: `https://mondoexplora.com/blog/create/`

#### **Funcionalidad**
- **Creación avanzada**: Formulario completo para crear posts de viaje
- **Google Maps**: Integración con Places Autocomplete y Geocoding
- **Itinerario diario**: Sistema de días por destino
- **Alojamiento**: Campos para nombre y URL del hotel
- **Mapa interactivo**: Preview de la ruta en tiempo real

#### **Características Principales**

##### **1. Información Básica**
- **Título del post**: Genera slug automáticamente
- **Descripción**: Resumen del viaje
- **Slug URL**: Generado automáticamente desde el título

##### **2. Journey Map (Mapa del Viaje)**
- **Destinos**: Agregar múltiples destinos con autocomplete
- **Alojamiento**: Nombre del hotel y URL de reserva (opcionales)
- **Descripción general**: Overview de cada destino
- **Itinerario diario**: Sistema de días con renumeración automática

##### **3. Google Maps Integration**
- **Places Autocomplete**: Sugerencias al escribir nombres de destinos
- **Geocoding**: Conversión automática de nombres a coordenadas
- **Map Preview**: Visualización de la ruta en tiempo real
- **Markers**: Marcadores numerados para cada destino

##### **4. Sistema de Días**
- **Día 1**: Automático en cada destino
- **Agregar días**: Botón "+ Add Day" para más días
- **Eliminar días**: Botón "×" (excepto el primer día)
- **Renumeración**: Automática al eliminar días

##### **5. Campos de Alojamiento**
- **Nombre del hotel**: Campo de texto opcional
- **URL de reserva**: Campo URL opcional
- **Layout**: Ambos campos en la misma fila (grid 2 columnas)

#### **Data Structure**
```typescript
interface Day {
  id: number;
  dayNumber: number;
  content: string;
}

interface Destination {
  id: number;
  name: string;
  content: string;
  accommodationName?: string;
  accommodationUrl?: string;
  days: Day[];
  lat?: number;
  lng?: number;
}

interface FormData {
  title: string;
  description: string;
  slug: string;
  content: string;
  destinations: Destination[];
  countries: string[];
  tags: string[];
  images: File[];
}
```

#### **Google Maps Configuration**
```typescript
// Environment Variables
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here

// API Features Used
- Maps JavaScript API
- Places API (Autocomplete)
- Geocoding API
- Directions API
```

#### **UI/UX Features**
- **Layout compacto**: Espaciado optimizado para mejor experiencia
- **CSS aislado**: Prefijo `blog-` para evitar conflictos
- **Responsive**: Adaptado para móviles y desktop
- **Loading states**: Indicadores de carga
- **Error handling**: Manejo de errores de API y validación

---

### **📄 PÁGINA BLOG POST** (`/blog/[slug]/page.tsx`)

#### **URL Structure**
- **Patrón**: `/blog/[slug]/`
- **Ejemplo**: `https://mondoexplora.com/blog/amazing-adventures-thailand/`
- **Compatibilidad**: Next.js 15 con async/await para params dinámicos

#### **Funcionalidad**
- **Posts individuales**: Visualización de posts completos
- **Contenido dinámico**: Título, descripción, contenido, imágenes
- **Navegación**: Links al blog y dashboard
- **SEO**: Metadatos dinámicos por post

#### **generateStaticParams**
```typescript
export async function generateStaticParams() {
  return [
    { slug: 'amazing-adventures-thailand' },
    { slug: 'exploring-tokyo-streets' },
    { slug: 'hidden-gems-paris' },
    { slug: 'create' } // Prevents routing conflict
  ]
}
```

---

### **🧹 PÁGINA CLEAR STORAGE** (`/blog/clear-storage/page.tsx`)

#### **URL Structure**
- **Patrón**: `/blog/clear-storage/`
- **Ejemplo**: `https://mondoexplora.com/blog/clear-storage/`

#### **Funcionalidad**
- **Utilidad de desarrollo**: Limpia todos los datos de localStorage
- **Debugging**: Útil para testing y desarrollo
- **Redirección**: Automática al blog homepage tras limpieza

#### **localStorage Keys Cleared**
- `blogUsers`
- `pendingCreators`
- `currentUser`
- `userPosts`
- `invitationCodes`

---

## 🔧 **CONFIGURACIÓN TÉCNICA DEL BLOG**

### **CSS Aislado**
```css
/* src/app/blog.css */
.blog-container { /* Contenedor principal */ }
.blog-header { /* Header del blog */ }
.blog-main { /* Contenido principal */ }
.blog-card { /* Tarjetas de contenido */ }
.blog-form { /* Formularios */ }
.blog-btn { /* Botones */ }
.blog-alert { /* Alertas */ }
```

### **Environment Variables**
```bash
# .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_real_api_key_here
```

### **localStorage Structure**
```javascript
// Users
blogUsers: BlogUser[]

// Invitation Codes
invitationCodes: InvitationCode[]

// Pending Creators
pendingCreators: BlogUser[]

// Approved Creators
approvedCreators: BlogUser[]

// Current User
currentUser: BlogUser

// User Posts
userPosts: BlogPost[]
```

### **Google Maps API Setup**
1. **API Key**: Configurado en Google Cloud Console
2. **Referrers**: `http://localhost:3000/*`, `https://mondoexplora.com/*`
3. **APIs Enabled**: Maps JavaScript, Places, Geocoding, Directions
4. **Security**: Environment variables para evitar exposición

### **Next.js 15 Configuration**
1. **Dynamic Routes**: Configuración async/await para params
2. **Development vs Production**: next.config.js condicional
3. **Static Export**: Solo en producción, desarrollo dinámico
4. **Compatibility**: Rutas dinámicas del blog funcionando correctamente

---

## ⚠️ **PROBLEMAS CONOCIDOS DEL BLOG**

### **Google Maps Issues**
1. **Autocomplete Dropdown**: No aparece en algunos casos
   - **Estado**: Investigación en progreso
   - **Workaround**: Geocoding manual como fallback

2. **ZERO_RESULTS Error**: Errores de geocoding
   - **Causa**: Nombres de lugares no reconocidos
   - **Solución**: Priorizar coordenadas de autocomplete

### **localStorage Limitations**
1. **Persistencia**: Solo funciona en el navegador actual
2. **Escalabilidad**: No adecuado para producción
3. **Sincronización**: No hay sincronización entre dispositivos

### **CSS Isolation**
1. **Prefijos**: Todos los estilos deben usar prefijo `blog-`
2. **Conflictos**: Evitar clases que puedan colisionar con el sitio principal

### **Next.js 15 Compatibility**
1. **Async Params**: Todas las rutas dinámicas usan async/await
2. **Server Components**: Separación clara entre server y client components
3. **Dynamic Routes**: Funcionamiento correcto en desarrollo y producción

---

## 🚀 **PRÓXIMOS PASOS DEL BLOG**

### **Inmediatos**
1. **Resolver Google Maps Autocomplete** - Investigar dropdown issues
2. **Testing completo** - Verificar todas las funcionalidades
3. **Documentación** - Completar guías de usuario

### **Mediano Plazo**
1. **Base de datos real** - Migrar de localStorage a DB persistente
2. **Sistema de comentarios** - Agregar funcionalidad de comentarios
3. **Rich text editor** - Implementar editor avanzado para contenido
4. **Sistema de categorías** - Organizar posts por categorías

### **Largo Plazo**
1. **SEO optimization** - Metadatos dinámicos para posts
2. **Social sharing** - Integración con redes sociales
3. **Analytics** - Tracking de visitas y engagement
4. **Monetización** - Sistema de afiliados integrado

---

## 📊 **ESTADÍSTICAS**

### **Páginas Generadas**
- **Destinations**: ~1000+ (por idioma × ciudades)
- **Countries**: ~200+ (por idioma × países)
- **Routes**: Configurable via `config/routes.json`
- **Home**: 4 páginas (uno por idioma)

### **Performance**
- **Build Time**: ~15-20 segundos
- **Bundle Size**: Optimizado para producción
- **Lighthouse Score**: 90+ (estimado)

---

## 🔄 **MANTENIMIENTO**

### **Agregar Nuevas Rutas**
1. Editar `config/routes.json`
2. Agregar `{ "origin": "city1", "destination": "city2" }`
3. Commit y push a `spa-experiment`

### **Agregar Nuevos Destinos**
1. Crear archivo `data/[lang]/destination/[city].json`
2. Seguir estructura de `DestinationData`
3. Deploy automático desde GitHub

### **Actualizar Tipos**
1. Editar `src/types/index.ts`
2. Verificar todos los usos en el código
3. Testear build local: `npm run build` 