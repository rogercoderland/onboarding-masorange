# `@onboarding-nx/contentful-*`

Reusable, hexagonal client for the Contentful **Content Delivery API** (CDA).
Built with the native `fetch` and validated with **Zod** — no `contentful` SDK at
runtime — mirroring the real `digital` workspace
(`libs/clients/shared/contentful`).

## Layers

| Package | Rol | Contenido |
|---|---|---|
| `@onboarding-nx/contentful-domain` | Contrato + tipos | `ContentfulClientPort`, modelos del envelope CDA, schemas Zod, y **tipos generados** (`src/lib/generated`) |
| `@onboarding-nx/contentful-application` | Casos de uso / helpers | `query-builder` (`entriesByType`, `entryBySlug`) |
| `@onboarding-nx/contentful-infrastructure` | Adapter | `ContentfulHttpAdapter` (fetch + Zod), `config`, `errors`, `createLinkResolver` |

Flujo de dependencias: `infrastructure → application → domain`. El dominio no
conoce HTTP; la infraestructura implementa el port.

## Uso

```ts
import { getContentfulConfigFromEnv, ContentfulHttpAdapter } from '@onboarding-nx/contentful-infrastructure';
import { pageBySlug, allDevices } from '@onboarding-nx/contentful-application';

const client = new ContentfulHttpAdapter(getContentfulConfigFromEnv());

// The typed helpers carry the content type *and* its field shape, so the result
// is inferred — no call-site generic. `page.fields.title` is `string`.
const { items: [page], includes } = await client.getEntries(pageBySlug('home'));
const { items: devices } = await client.getEntries(allDevices());
```

The generated types (`TypePageFields`, …) are consumed through
`ResolveFields<T>` (domain), which unwraps the codegen's abstract
`EntryFieldTypes.*` descriptors into the plain values the CDA returns; the typed
helpers in `contentful-application` (`pageBySlug`, `allDevices`, `deviceBySlug`,
and the `PageFields`/`DeviceFields`/… aliases) bind each content-type id to its
resolved field type.

`getEntries`/`getEntry` devuelven el envelope ya validado por Zod, o lanzan
`ContentfulApiError` / `ContentfulValidationError`. Para resolver los `includes`
(entries/assets enlazados) usa `createLinkResolver(includes)`.

## Variables de entorno (`.env.local`, nunca commitear)

```
CONTENTFUL_SPACE_ID=...
CONTENTFUL_ENVIRONMENT=master
CONTENT_DELIVERY_API_KEY=...   # token CDA (runtime)
CONTENT_PREVIEW_API_KEY=...    # token CPA (opcional)
```

## Generar tipos desde el content model

```bash
pnpm cf:types     # regenera libs/contentful/domain/src/lib/generated
pnpm cf:smoke     # smoke en vivo: cuenta devices + resuelve la page "home"
```

> Nota: el codegen (`tools/generate-contentful-types.mjs`) lee el content model
> vía la **Delivery API** (`/content_types`) en lugar de la Management API,
> porque el CMA token del space no está operativo. Los tipos generados se
> versionan en el repo.
