# @onboarding-nx/observability

Observabilidad frontend con **Grafana Faro**: inicialización del SDK, error boundary que
reporta a Grafana, y un hook para empujar eventos, logs y errores desde la app.

Espeja `@digital/observability` del monorepo real
(`workspaces/digital/libs/observability/`), igual que `@onboarding-nx/configcat` espeja
`@digital/configcat`. La versión de producción son ~3.4k LOC; esta son ~400.

## Arquitectura

```text
src/
  index.ts                             # barrel público (también re-exporta LogLevel)
  lib/
    constants.ts                       # LOG_PREFIX, defaults, ruidos a ignorar
    types.ts                           # ObservabilityConfig, FaroUser, EventAttributes…
    before-send.ts                     # filtro anti-bucle + ignoreErrors
    provider.tsx                       # 'use client' · initializeFaro en useEffect
    hooks/
      use-faro-event.ts                # pushError / pushLog / pushEvent / setUser
    components/
      react-error-boundary.tsx         # class component, agnóstico de Faro
      faro-error-boundary.tsx          # lo envuelve y reporta a Faro
      error-boundary.css               # fallback estilado con tokens de @onboarding-nx/theme
  testing/
    mock-faro.ts                       # stub del singleton faro, sin importar vitest
```

### Entradas del paquete

| Import | Para | Contiene |
|---|---|---|
| `@onboarding-nx/observability` | La app | Provider, hook, boundaries, tipos, `LogLevel` |
| `@onboarding-nx/observability/testing` | Tests | `mockFaroApi()`, `clearMockFaro()` |

## Variables de entorno

| Variable | Dónde vive | Uso |
|---|---|---|
| `NEXT_PUBLIC_FARO_COLLECTOR_URL` | `.env.local` raíz | URL del collector. **Vacía = observabilidad apagada** |
| `NEXT_PUBLIC_FARO_APP_NAME` | `.env.local` raíz | Nombre de la app en Grafana |
| `NEXT_PUBLIC_FARO_ENVIRONMENT` | `.env.local` raíz | `development` / `production` |
| `NEXT_PUBLIC_FARO_ENABLED` | `.env.local` raíz | `false` inicializa Faro en pausa |

Las cuatro son `NEXT_PUBLIC_` porque Faro corre en el navegador. **Eso aquí no es una fuga:**
la clave va embebida en la URL del collector y es pública por diseño — el endpoint se protege
con *allowed origins* (CORS) en Grafana Cloud, no con un secreto. Es lo contrario de
`CMA_TOKEN` o `REVALIDATE_SECRET`, que sí son secretos de servidor.

## Uso

Provider en el root layout (`apps/web/app/layout.tsx`):

```tsx
<ObservabilityProvider
  config={{
    collectorUrl: process.env.NEXT_PUBLIC_FARO_COLLECTOR_URL ?? '',
    appName: process.env.NEXT_PUBLIC_FARO_APP_NAME ?? 'onboarding-nx-web',
    environment: process.env.NEXT_PUBLIC_FARO_ENVIRONMENT,
    enabled: process.env.NEXT_PUBLIC_FARO_ENABLED !== 'false',
  }}
>
  {children}
</ObservabilityProvider>
```

`process.env.NEXT_PUBLIC_*` debe escribirse **literal**: Next lo sustituye en build, así que
una lectura dinámica (`process.env[key]`) llega como `undefined` al navegador.

Boundary y push de señales:

```tsx
<FaroErrorBoundary fallback={<MiFallback />}>
  <SeccionQuePuedeFallar />
</FaroErrorBoundary>
```

```tsx
const { pushEvent, pushLog, pushError, setUser, isFaroReady } = useFaroEvent();

pushEvent('checkout_started', { items: 3 }, 'click');
pushLog(['pago rechazado'], LogLevel.WARN);
setUser({ id: 'user-42' });   // setUser(undefined) → resetUser()
```

### Qué captura cada cosa

Un error boundary de React **solo captura errores de render**. Los otros dos casos llegan a
Grafana por la instrumentación de ventana del propio SDK:

| Origen del error | Lo captura |
|---|---|
| Render de un componente | `FaroErrorBoundary` (`type: react_error_boundary`) |
| `throw` dentro de un event handler | `window.onerror` del SDK |
| Promise rechazada sin `.catch()` | `unhandledrejection` del SDK |
| Throw del propio root layout | `apps/web/app/global-error.tsx` |

Es el malentendido más habitual de esta unit: envolver todo en un boundary no hace que los
errores de handlers pasen por él.

## Testing

```bash
pnpm nx test @onboarding-nx/observability
```

18 tests: filtrado de `beforeSend`, degradación del hook sin Faro inicializado, posición de
`skipDedupe` en `pushEvent`, y el ciclo capturar → reportar → reintentar del boundary.

`mockFaroApi()` stubea `faro.api` en sitio porque el SDK expone un singleton global mutable,
no una factoría. Está escrito sin importar `vitest` para que el paquete siga compilando —
mismo criterio que `MockConfigCatClient` en `@onboarding-nx/configcat`.

## Diferencias deliberadas con `@digital/observability`

1. **Sin cola de eventos pre-init.** Producción tiene un `faroStore` de 276 LOC que encola
   eventos durante los ~500 ms previos a la inicialización, y lleva un `TODO` del propio
   equipo cuestionando si compensa. Aquí, si Faro no está listo, se avisa y se descarta.
2. **Un solo barrel, sin split `.` / `./client`.** Producción separa las entradas para
   mantener el SDK fuera del bundle de servidor. Aquí el único consumidor desde el árbol de
   servidor es el root layout, que ya es un límite cliente.
3. **Sin tracing distribuido** (`@grafana/faro-web-tracing` / OpenTelemetry).
4. **Sin subida de source maps.** Producción lo resuelve con un script post-build y
   `@grafana/faro-cli`, no con `@grafana/faro-webpack-plugin`: estas apps van con Turbopack,
   que no tiene sistema de plugins. Esa es también la razón por la que el enunciado de la
   unit se queda corto en este punto.
5. **Sin `useMeasurement`, `trackedFetch` ni `setView` en navegación.**
6. **Sin `sessionTracking` con sampling adaptativo por red.**
7. **Deps fijadas en la raíz.** `@grafana/faro-web-sdk` está en `peerDependencies` de la lib
   *y* en `dependencies` del `package.json` raíz, con la misma versión que producción
   (`1.19.0`). `@onboarding-nx/configcat` se apoyó solo en `autoInstallPeers`, lo que deja la
   versión sin fijar.
