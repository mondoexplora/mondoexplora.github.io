# MondoExplora - Páginas Detalladas

## 📋 Índice
- [Página Principal (Home)](#página-principal-home)
- [Páginas de Ruta](#páginas-de-ruta)
- [Páginas de Destino](#páginas-de-destino)
- [Páginas de País](#páginas-de-país)
- [Páginas de Modos de Viaje](#páginas-de-modos-de-viaje)
- [Layouts y Componentes](#layouts-y-componentes)
- [Estructura de Datos](#estructura-de-datos)
- [Problemas Comunes](#problemas-comunes)

---

## 🏠 Página Principal (Home)

### Archivo: `src/app/page.tsx`
- **Ruta:** `/`
- **Funcionalidad:** Redirecciona a `/en`
- **Tipo:** Server Component
- **Datos:** No carga datos específicos

### Archivo: `src/app/[lang]/page.tsx`
- **Ruta:** `/en`, `/es`, `/fr`, `/it`
- **Funcionalidad:** Redirecciona a `/`
- **Tipo:** Server Component
- **generateStaticParams:** Genera rutas para todos los idiomas

---

## 🛣️ Páginas de Ruta

### Archivo: `src/app/[lang]/route/[origin]/[destination]/page.tsx`

#### **URL Structure:**
```
/en/route/new-york/bangkok
/es/route/madrid/paris
```

#### **Generación de H1:**
```typescript
const formatCityName = (cityName: string) => {
  return cityName
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const displayOrigin = formatCityName(origin);      // "New York"
const displayDestination = formatCityName(destination); // "Bangkok"
const headline = `${displayOrigin} to ${displayDestination}`; // "New York to Bangkok"
```

#### **Datos Cargados:**
1. **Destination Data:** `getDestinationData(lang, destination)`
   - **Archivo:** `data/{lang}/destination/{destination}.json`
   - **Contiene:** Hoteles, hero_image, descripción
   
2. **URL Data:** `getDestinationUrlData(destination)`
   - **Archivo:** `data/le_destination_urls/{destination}.json`
   - **Contiene:** affiliate_link, country_name

#### **CTA (Call to Action):**
- **Componente:** `RouteCTA` (Client Component)
- **Acción 1:** Abre nueva pestaña → `/{lang}/travel_modes/{origin}/{destination}`
- **Acción 2:** Redirige pestaña actual → `affiliateLink` del archivo URL data

#### **Hoteles:**
- **Fuente:** `destinationData.hotels.slice(0, 6)`
- **Cantidad:** 6 hoteles
- **Componente:** `HotelGrid` con `lang={lang}`

#### **Enlaces Relacionados:**
1. **País:** `/{lang}/country/{country_name}`
2. **Destino:** `/{lang}/destination/{destination}`
3. **Modos de Viaje:** `/{lang}/travel_modes/{origin}/{destination}`

#### **generateStaticParams:**
```typescript
// Lee todos los archivos de le_destination_urls
// Genera combinaciones para todos los idiomas soportados
```

---

## 🏙️ Páginas de Destino

### Archivo: `src/app/[lang]/destination/[city]/page.tsx`

#### **URL Structure:**
```
/en/destination/bangkok
/es/destination/madrid
```

#### **Datos Cargados:**
- **Archivo:** `data/{lang}/destination/{city}.json`
- **Contiene:** Hoteles, hero_title, description, hero_image, city, country

#### **H1:**
- **Fuente:** `destinationData.hero_title`

#### **Hoteles:**
- **Fuente:** `destinationData.hotels` (todos)
- **Componente:** `HotelGrid` con `lang={lang}`

#### **Location Display:**
- **Formato:** `${destinationData.city}, ${destinationData.country}`

#### **generateStaticParams:**
```typescript
// Lee todos los archivos de data/{lang}/destination/
// Genera combinaciones para todos los idiomas soportados
```

---

## 🌍 Páginas de País

### Archivo: `src/app/[lang]/country/[country]/page.tsx`

#### **URL Structure:**
```
/en/country/thailand
/es/country/spain
```

#### **Casos Especiales:**
- **Tanzania:** `tanzania,-united-republic-of`
- **Taiwan:** `taiwan-(province-of-china)`

#### **Datos Cargados:**
- **Archivo:** `data/{lang}/country/{country}.json`
- **Contiene:** name, hero_title, description, hero_image, popular_destinations

#### **H1:**
- **Fuente:** `countryData.hero_title`

#### **Location Display:**
- **Formato:** `countryData.name`

#### **Destinos Populares:**
- **Fuente:** `countryData.popular_destinations`
- **Display:** Grid con nombre, descripción, hotel_deals, avg_price

#### **generateStaticParams:**
```typescript
// Lee todos los archivos de data/{lang}/country/
// Genera combinaciones para todos los idiomas soportados
```

---

## 🚗 Páginas de Modos de Viaje

### Archivo: `src/app/[lang]/travel_modes/[origin]/[destination]/page.tsx`

#### **URL Structure:**
```
/en/travel_modes/new-york/bangkok
```

#### **Funcionalidad:**
- **Estado:** Placeholder/Coming Soon
- **H1:** "Transport Options: {Origin} to {Destination}"
- **Contenido:** Grid con 4 modos de transporte (✈️ Flights, 🚄 Trains, 🚌 Buses, 🚗 Car Rental)

#### **generateStaticParams:**
```typescript
// Usa las mismas combinaciones que las páginas de ruta
```

---

## 🧩 Layouts y Componentes

### Layout Principal: `src/app/layout.tsx`
- **Metadata:** Título, descripción, favicon
- **Favicon:** `/favicon.svg`

### Layout de Idioma: `src/app/[lang]/layout.tsx`
- **Tipo:** Server Component (async)
- **Función:** Wrapper para páginas internacionalizadas
- **Params:** `Promise<{ lang: string }>`

### Componente Hero: `src/components/Hero.tsx`
- **Props:** title, subtitle, backgroundImage, location?, cta?
- **Logo:** "MondoExplora" en esquina superior derecha
- **Estilos:** CSS personalizado en `hotel-boxes.css`

### Componente RouteCTA: `src/components/RouteCTA.tsx`
- **Tipo:** Client Component ('use client')
- **Props:** lang, origin, destination, affiliateLink?
- **Funcionalidad:** Dual action (nueva pestaña + redirección)

### Componente HotelGrid: `src/components/HotelGrid.tsx`
- **Props:** hotels, hotelsPerPage=6, lang
- **Paginación:** Componente Pagination
- **Hoteles por página:** 6 (configurable)

### Componente HotelCard: `src/components/HotelCard.tsx`
- **Props:** hotel, onViewDeal, lang
- **CTA Text:** Localizado según idioma
- **Sin descuento:** No muestra porcentaje de descuento

---

## 📊 Estructura de Datos

### Archivos de Destino: `data/{lang}/destination/{city}.json`
```json
{
  "hero_title": "string",
  "description": "string", 
  "hero_image": "url",
  "city": "string",
  "country": "string",
  "hotels": [Hotel[]]
}
```

### Archivos de País: `data/{lang}/country/{country}.json`
```json
{
  "name": "string",
  "hero_title": "string",
  "description": "string",
  "hero_image": "url",
  "popular_destinations": [Destination[]]
}
```

### Archivos de URL: `data/le_destination_urls/{destination}.json`
```json
{
  "destination": "string",
  "affiliate_link": "url",
  "country_name": "string"
}
```

### Tipo Hotel:
```typescript
interface Hotel {
  title: string;
  description: string;
  hero_image: string;
  price: number;
  original_price?: number;
  link: string;
  vendor_name: string;
  location_heading: string;
  location_subheading: string;
}
```

---

## 🔧 Problemas Comunes

### Error: "params should be awaited"
**Causa:** Next.js 15 requiere await en params
**Solución:** 
```typescript
const { lang, origin, destination } = await params;
```

### Error: "use client" + generateStaticParams
**Causa:** No se pueden usar juntos
**Solución:** Mover lógica cliente a componente separado

### Error: "Cannot read properties of undefined"
**Causa:** Datos no cargados correctamente
**Solución:** Verificar rutas de archivos y manejo de errores

### Error: "Type 'unknown' is not assignable"
**Causa:** Tipos no definidos correctamente
**Solución:** Type casting: `as string | undefined`

### Error: "Middleware cannot be used with output: export"
**Causa:** Conflicto con exportación estática
**Solución:** Remover middleware o cambiar configuración

### Error: "Page is missing generateStaticParams()"
**Causa:** Páginas dinámicas sin generateStaticParams
**Solución:** Agregar función generateStaticParams

### Error: "A require() style import is forbidden"
**Causa:** require() en ES modules
**Solución:** Usar import dinámico:
```typescript
const fs = await import('fs').then(m => m.promises);
```

---

## 🎨 Estilos CSS

### Archivo Principal: `src/app/globals.css`
- **Tailwind CSS**
- **Import:** `@import '../styles/hotel-boxes.css';`

### Archivo de Estilos: `src/styles/hotel-boxes.css`
- **Hotel boxes styling**
- **Hero section styling**
- **Footer styling**
- **Pagination styling**
- **Related links styling**
- **Route CTA button styling**

### Clases Principales:
- `.hero-section`: Hero container
- `.hotel-card`: Individual hotel card
- `.hotel-grid`: Hotel grid container
- `.route-cta-button`: CTA button styling
- `.main-content`: Main content wrapper
- `.hotel-section-header`: Hotel section header

---

## 🚀 Deployment

### Netlify Configuration: `netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  NODE_VERSION = "18"
```

### Next.js Configuration: `next.config.ts`
```typescript
{
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
    remotePatterns: [...]
  }
}
```

---

## 📝 Notas de Mantenimiento

### Para Agregar Nuevos Destinos:
1. Crear archivo en `data/{lang}/destination/{city}.json`
2. Crear archivo en `data/le_destination_urls/{city}.json`
3. Verificar que generateStaticParams incluya el nuevo destino

### Para Cambiar Estilos:
1. Modificar `src/styles/hotel-boxes.css`
2. Verificar responsive design
3. Probar en diferentes páginas

### Para Debugging:
1. Verificar rutas de archivos JSON
2. Revisar console.log en terminal
3. Verificar tipos TypeScript
4. Limpiar caché: `rm -rf .next`

---

*Última actualización: Enero 2025* 