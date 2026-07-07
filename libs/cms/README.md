# `@onboarding-nx/cms-*`

The **business + render** layer over Contentful. Where `@onboarding-nx/contentful-*`
is transport (raw CDA envelope), `cms` turns that envelope into a clean domain
model and renders it through a **block registry** — the
`page.sections[] → renderBlock(block) → component` pattern that mirrors the real
`digital` workspace (`libs/cms/{domain,application,infrastructure,presentation}`).

## Layers

| Package | Rol | Contenido |
|---|---|---|
| `@onboarding-nx/cms-domain` | Modelo + contrato | `CmsPage`, unión discriminada `CmsBlock` (`heroBanner`·`featureBanner`·`deviceGrid`·`footer`), `CmsDevice`, `CMS_BLOCK_TYPES`, schemas Zod, port `CmsRepository` |
| `@onboarding-nx/cms-application` | Casos de uso | `GetPageBySlug`, `GetDevices`, `GetDeviceBySlug` (port inyectado) |
| `@onboarding-nx/cms-infrastructure` | Adapter + mappers | `ContentfulCmsRepository` + mappers (envelope crudo → dominio, resuelve links/assets) |
| `@onboarding-nx/cms-presentation` | Render | **`renderBlock` + registry** + los 4 componentes-bloque (React puro) |

Flujo hexagonal: `presentation → domain`, `infrastructure → domain (+ contentful)`,
`application → domain`. La **composición** (crear el repo e inyectarlo) vive en la
app, no en la lib.

## El registry (lo importante)

Una página es **datos** (`sections: CmsBlock[]`); `renderBlock` los convierte en UI
sin que la página conozca qué componentes existen:

```tsx
import { renderBlock } from '@onboarding-nx/cms-presentation';

// page.sections viene del CMS ya mapeado a dominio
<>{page.sections.map(renderBlock)}</>
```

El registry es un `Record<CmsBlockType, Componente>` con un `satisfies` que fuerza
**exhaustividad + props correctos por bloque**. Un tipo de bloque desconocido
renderiza `null` (no lanza), así publicar un content type nuevo nunca rompe una
página en producción.

### Añadir un bloque nuevo

1. `cms-domain`: añade su id a `CMS_BLOCK_TYPES` y su schema Zod en `cms-block.schema.ts`.
2. `cms-infrastructure`: añade el `case` en `block.mapper.ts` (resuelve sus links/assets).
3. `cms-presentation`: crea el componente y añádelo al `BLOCK_REGISTRY`.

El `satisfies` del registry **no compila** hasta que completes el paso 3 — TypeScript
te obliga a cerrar el patrón.

## React puro (reutilizable, sin `next`)

`cms-presentation` usa `<a>`/`<img>` semánticos, **no** `next/link`/`next/image`, para
seguir siendo reutilizable en cualquier app React (Next o Vite, como `panel`) — igual
que en `digital`, donde la frontera Next vive en una capa aparte (`cms-cached-component`),
no dentro de los componentes tontos.

Para aplicar `next/image`/`next/link` (checklist de performance) se hace en la
**frontera de la app Next**: bien envolviendo el bloque, bien inyectando los
primitivos (`components={{ Image, Link }}`). No se acopla la lib a Next.

## Uso (composición en la app)

```ts
import { ContentfulHttpAdapter, getContentfulConfigFromEnv } from '@onboarding-nx/contentful-infrastructure';
import { ContentfulCmsRepository } from '@onboarding-nx/cms-infrastructure';
import { GetPageBySlug } from '@onboarding-nx/cms-application';

const repo = new ContentfulCmsRepository(new ContentfulHttpAdapter(getContentfulConfigFromEnv()));
const page = await new GetPageBySlug(repo).execute('home');
```

`ContentfulCmsRepository` valida cada bloque con Zod al mapear; un bloque inválido o de
tipo desconocido se descarta (con `console.warn`) en vez de tumbar la página.
