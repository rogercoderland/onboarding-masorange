# @onboarding-nx/configcat

Feature flags con [ConfigCat](https://configcat.com/) para la Unit 5 del onboarding. Réplica en
pequeño de la lib interna `@digital/configcat` del monorepo
(`monorepo-front/workspaces/digital/libs/configcat`).

## Arquitectura (hexagonal ligera)

Un **port** y tres **adapters** — toda la app depende de la interfaz, nunca del SDK:

```text
src/types/index.ts            IConfigCatClient (port) + tipos de dominio
src/client/ConfigCatClientCSR.ts   adapter navegador  → configcat-js      (AutoPoll 60s)
src/client/ConfigCatClientSSR.ts   adapter servidor   → configcat-js-ssr  (ManualPoll)
src/testing/MockConfigCatClient.ts adapter de tests   → sin red
src/context/ConfigCatProvider.tsx  Provider React + contexto (CSR)
src/hooks/                    useFeatureFlag + useBooleanFlag/useStringFlag/useNumberFlag, useConfigCat
src/resolveServerFeatureFlags.ts   helper tipado para Server Components / Route Handlers
```

**¿Por qué dos SDKs?** `configcat-js` hace AutoPoll (un timer en el navegador que refresca la
config y dispara `configChanged` → la UI reacciona sola). En el servidor un timer no tiene sentido
(procesos efímeros por request), así que `configcat-js-ssr` se usa en ManualPoll: un fetch por
petición y a otra cosa. Como en producción, **no** usamos `configcat-react`: el Provider propio nos
da control (fail-soft, tipos, testabilidad vía el port).

### Entradas del paquete

| Import | Para | Contiene |
|---|---|---|
| `@onboarding-nx/configcat` | componentes cliente | Provider, hooks, cliente CSR |
| `@onboarding-nx/configcat/server` | Server Components / route handlers | cliente SSR, `resolveServerFeatureFlags` (sin React) |
| `@onboarding-nx/configcat/testing` | tests | `MockConfigCatClient`, `TestConfigCatProvider` |

## Variables de entorno

| Variable | Dónde vive | Uso |
|---|---|---|
| `NEXT_PUBLIC_CONFIGCAT_SDK_KEY` | bundle del navegador | `ConfigCatProvider` (CSR) |
| `CONFIGCAT_SDK_KEY` | solo servidor | `resolveServerFeatureFlags` (SSR) |

La SDK key es **pública por diseño** (viaja al navegador; los flags no son secretos). Por eso el
Provider es *fail-soft*: sin key, `console.warn` y todos los flags devuelven su default — al
contrario que la config de Contentful, que es server-only y falla ruidosamente si falta.

## Uso CSR

```tsx
// app/layout.tsx
<ConfigCatProvider sdkKey={process.env.NEXT_PUBLIC_CONFIGCAT_SDK_KEY ?? ''}>
  {children}
</ConfigCatProvider>

// cualquier componente cliente
const showNewFeature = useBooleanFlag('show_new_feature');        // false por defecto
const buttonColor = useStringFlag('button_color', 'blue');
const maxItems = useNumberFlag('max_items', 10);

// contexto completo (targeting, refresh, debug)
const { setUser, user, isReady, refresh, getAllFlags } = useConfigCat();
setUser({ identifier: 'ana', email: 'ana@masorange.com' });        // re-evalúa targeting
```

## Uso SSR (Next 16 + Cache Components)

```tsx
import { connection } from 'next/server';
import { resolveServerFeatureFlags } from '@onboarding-nx/configcat/server';

export async function ServerFlags() {
  await connection(); // marca el componente como dinámico: flags frescos por petición
  const flags = await resolveServerFeatureFlags({
    sdkKey: process.env.CONFIGCAT_SDK_KEY ?? '',
    flags: {
      showNewFeature: { key: 'show_new_feature', defaultValue: false },
      maxItems: { key: 'max_items', defaultValue: 10 },
    },
    // user opcional: targeting también en servidor
  });
  return <p>{flags.showNewFeature ? 'ON' : 'OFF'}</p>; // flags.* tipado por los defaults
}
```

Con `cacheComponents: true`, un Server Component con I/O no cacheada debe ser dinámico y vivir bajo
`<Suspense>`; `await connection()` es lo que lo marca. Resultado: la página sale como ◐ Partial
Prerender (shell estático + flags streameados por petición). El cliente SSR es **efímero**
(init → leer → dispose): no dejamos timers vivos en el servidor.

## Testing

```tsx
import { TestConfigCatProvider, MockConfigCatClient } from '@onboarding-nx/configcat/testing';

render(
  <TestConfigCatProvider flags={{ show_new_feature: true }}>
    <MyComponent />
  </TestConfigCatProvider>
);
```

`TestConfigCatProvider` reutiliza el **mismo** `ConfigCatContext` que el Provider real, respaldado
por el `MockConfigCatClient` (adapter del port sin red): los hooks funcionan en tests sin tocar
ConfigCat. `pnpm nx run @onboarding-nx/configcat:test`.

## Diferencias deliberadas con `@digital/configcat`

1. **`getAllFlagsSync()` en el port**: en producción el `getAllFlags()` del contexto devuelve `{}`
   (stub comentado como "simplified version"); aquí lo implementan los tres adapters porque el
   debug panel de `/flags` lo necesita.
2. **`setOnFlagsChanged` en el cliente CSR**: en producción, cuando AutoPoll detecta un cambio
   actualiza la cache del cliente pero nada re-renderiza React (el `updateTrigger` solo cambia con
   `setUser`/`refresh`). Este listener conecta `configChanged` → re-render, que es lo que exige la
   DoD ("togglear en el dashboard se refleja en la app").
3. **`resolveServerFeatureFlags` acepta `user` opcional** (targeting también en SSR) y **no hace
   `forceRefreshAsync()` extra por lectura**: el cliente es efímero y `init()` ya trae la config
   fresca; el refresh por-lectura de producción tiene sentido en clientes SSR de vida larga.
