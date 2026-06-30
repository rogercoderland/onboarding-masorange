# @onboarding-nx/web — Tienda de dispositivos (Unit 3)

App Next.js (App Router + React 19) que demuestra los **patrones de renderizado** de Next con
**Cache Components**. Es la **Unit 3 — Minimal App** del onboarding del squad Digital: en vez de
páginas demo abstractas, una tienda de móviles donde **cada pantalla mapea a un patrón distinto**.
Cada pantalla muestra un **badge con su tipo de render + timestamp**, de modo que el caché se ve a
simple vista (recargas y observas qué se congela y qué no).

> Los datos del CMS están **mockeados** en esta unit (`app/lib/mock-api.ts`); en Unit 4 se
> sustituyen por Contentful.

## Pantallas → patrón de render → estrategia de caché

| Pantalla (ruta)                 | Patrón                                                    | Estrategia (`'use cache'`)              | `cacheTag`      | Timestamp                   |
| ------------------------------- | --------------------------------------------------------- | --------------------------------------- | --------------- | --------------------------- |
| **Home** `/`                    | **Static**                                                | `cacheLife('max')`                      | `home-sections` | congelado (build)           |
| **Catálogo** `/dispositivos`    | **ISR** + filtros CSR                                     | `cacheLife('catalog')` (revalida 5 min) | `devices`       | congelado hasta ventana/tag |
| **Buscar** `/buscar`            | **SSR** (por petición)                                    | sin caché · lee `searchParams`          | —               | **vivo** (servidor, cada petición) |
| **PDP** `/dispositivos/[slug]`  | **Dynamic** (SSG de los destacados + on-demand del resto) | `cacheLife('hours')`                    | `device:<slug>` | congelado por slug          |
| **Carrito** `/carrito` + drawer | **CSR**                                                   | sin caché · `localStorage`              | —               | **vivo** (cliente, cada render)      |

`cacheLife('catalog')` es un **perfil con nombre** definido en [`next.config.js`](./next.config.js)
(mismo mecanismo que producción: un mapa `cacheLife` de perfiles). `max` y `hours` son perfiles
**integrados** de Next.

### Qué demuestra cada timestamp

- **Static / ISR / Dynamic**: el `generatedAt` se **congela** dentro de la entrada de caché. Si
  recargas, no cambia — hasta que su ventana (ISR) o su tag se revaliden.
- **SSR** (`/buscar`): leer `searchParams` en un Server Component **sin `'use cache'`** opta por
  render **por petición**; el `generatedAt` se genera en el **servidor en cada request**, así que el
  timestamp **cambia en cada recarga**. Bajo Cache Components el route es *Partial Prerender* (`◐`):
  shell estático + contenido dinámico server-streamed. Contrasta con el catálogo (ISR + filtros de
  cliente): aquí el filtrado es **server-side por petición**.
- **CSR** (carrito): el timestamp se genera **en el cliente** (en un `useEffect`) y cambia en cada
  interacción. Es lo contrario de las pantallas cacheadas, y por eso no aparece en el HTML estático.

## Componentes de servidor: Cache Components

- **`'use cache'`** marca una función/scope como cacheable; dentro, **`cacheLife(perfil)`** fija la
  ventana de frescura y **`cacheTag(tag)`** etiqueta la entrada para invalidarla luego.
- **Cliente vs servidor**: los filtros del catálogo, la galería, el selector de variante y todo el
  carrito son **islas cliente** (`'use client'`); el resto son Server Components cacheados.
- El `CartProvider` (cliente) se monta en el **root layout** envolviendo `children`. Como los
  children son Server Components ya renderizados que se pasan como prop, **Home/Catálogo siguen
  siendo Static/ISR** — solo el carrito es cliente.

## Server action + revalidación

### Server action (PDP)

`app/dispositivos/[slug]/actions.ts` (`'use server'`) revalida **una sola ficha** vía
`revalidateTag('device:<slug>', 'max')`. El formulario "Refrescar datos" de la PDP lo dispara; al
recargar, **solo** el timestamp de esa ficha salta.

### API de revalidación on-demand

`POST /api/revalidate` — contraparte externa del server action (curl hoy, webhook de Contentful en
Unit 4). Protegida por un **secreto compartido**.

```bash
# 401 — sin el header
curl -i -X POST "http://localhost:3000/api/revalidate?tag=devices"

# 200 — con el secreto, por tag
curl -X POST "http://localhost:3000/api/revalidate?tag=devices" \
  -H "x-revalidate-secret: $REVALIDATE_SECRET"

# 200 — por path
curl -X POST "http://localhost:3000/api/revalidate?path=/dispositivos" \
  -H "x-revalidate-secret: $REVALIDATE_SECRET"

# 400 — con secreto pero sin tag ni path
```

- Valida el header **`x-revalidate-secret`** contra `process.env.REVALIDATE_SECRET` → **401** si no
  coincide. **Falla en cerrado**: si la env var no está definida → **500** (nunca un secreto por
  defecto).
- `GET /api/revalidate` devuelve la documentación de uso (sin filtrar el secreto).

## Variables de entorno

```bash
cp .env.example .env.local      # y pon un valor real en .env.local
```

| Variable            | Para qué                                                      |
| ------------------- | ------------------------------------------------------------- |
| `REVALIDATE_SECRET` | secreto del header `x-revalidate-secret` de `/api/revalidate` |

`.env.local` está **gitignored** — nunca se commitea. Solo se versiona `.env.example` (placeholder).

## Cómo arrancar

```bash
pnpm nx dev   @onboarding-nx/web     # desarrollo (http://localhost:3000)
pnpm nx build @onboarding-nx/web     # build de producción (Turbopack)
pnpm nx start @onboarding-nx/web     # sirve el build
pnpm nx lint  @onboarding-nx/web     # eslint
```

En `dev`, cualquier dato dinámico sin cachear debe ir dentro de un scope `'use cache'` o de un
`<Suspense>`, o el build falla — es el modelo "dynamic by default" de Cache Components.

## Lighthouse

Medir con `npx lighthouse <url> --preset=desktop` sobre el build de producción
(`nx build` + `nx start`), Chrome headless:

Debe estar por encima del umbral del DoD (> 90). Apoyado en: `next/image` en todas las imágenes (hero y
primera tarjeta con `priority`, resto lazy), CSS con design tokens (sin framework de estilos
pesado), y JS de cliente acotado a las islas interactivas.

## Tests E2E (Playwright)

Proyecto `@onboarding-nx/web-e2e` (en [`apps/web-e2e`](../web-e2e)). El target hace `build` de la
app, levanta `next start` y corre Playwright con el **Chrome del sistema** (`channel: 'chrome'`, sin
descargar navegadores).

```bash
pnpm nx e2e @onboarding-nx/web-e2e
```

4 flujos (5 tests):

1. **Home (Static)** — renderiza hero + grid; el badge `STATIC` mantiene el **mismo timestamp** tras
   recargar (congelado).
2. **Catálogo → PDP → carrito** — filtra por marca (la query `?brand=` se actualiza), abre una PDP,
   añade al carrito → el drawer muestra el artículo y el contador del header pasa a 1.
3. **Búsqueda (SSR)** — `/buscar?q=iphone` filtra en servidor; el badge `SSR` **cambia** de timestamp
   en cada recarga (lo opuesto a Home).
4. **Revalidación** — `POST /api/revalidate` sin secreto → **401**; con secreto y
   `?tag=device:<slug>` → **200** y, tras revalidar, el timestamp de esa PDP **cambia**
   (stale-while-revalidate).

## Estructura relevante

```text
app/
├── layout.tsx                      # Header + CartProvider + CartDrawer + SiteFooter
├── page.tsx                        # Home (Static)
├── dispositivos/
│   ├── page.tsx                    # Catálogo (ISR) + filtros CSR
│   └── [slug]/
│       ├── page.tsx                # PDP (dynamic route, cache por slug)
│       └── actions.ts              # server action → revalidateTag
├── buscar/page.tsx                 # Búsqueda (SSR, lee searchParams)
├── carrito/page.tsx                # Carrito (CSR)
├── api/revalidate/route.ts         # revalidación on-demand + secreto
├── components/                     # Header, Cart*, FilterBar, Gallery, BuyBox, …
└── lib/
    ├── models.ts                   # tipos (Device, HeroBanner, CartLine, …)
    ├── mock-api.ts                 # dataset semilla + fetchers con latencia simulada
    └── cache-tags.ts               # helper de tags (devices, device(slug), home-sections)
```
