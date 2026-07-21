# onboarding-nx — Práctica de onboarding MasOrange (squad Digital)

Repo **personal de práctica** (fuera del monorepo) para entrenar el stack y el modelo mental del
squad **Digital** antes de empezar con tickets reales. Acompaña a la guía
[`../public-pages-guia.md`](../public-pages-guia.md).

Stack: **Nx 22** + **Next.js 16 (App Router)** + **React 19** + **Tailwind** + **TS project
references** + **Jest** (app Next) / **Vitest** (libs y app Vite).

Cubre la **Unit 1 — Base** del onboarding: workspace Nx con references, app Next que compila y
corre, libs gestionadas con `package.json` (no `project.json`), y una estructura de librerías que
**imita la arquitectura hexagonal** del workspace `digital` del monorepo.

La **Unit 3 — Minimal App** (patrones de render de Next + Cache Components) está documentada en el
README de la app: [`apps/web/README.md`](./apps/web/README.md) — las 4 pantallas, su estrategia de
caché, el server action, la API de revalidación y los resultados de Lighthouse.

## Unit 5 — ConfigCat feature flags

La lib [`libs/configcat`](./libs/configcat/README.md) (`@onboarding-nx/configcat`) replica la
`@digital/configcat` del monorepo: port `IConfigCatClient` + adapters CSR/SSR/Mock, Provider +
hooks tipados y helper SSR. Demo en **`/flags`** (valores CSR y SSR, targeting por usuario y debug
panel); además `show_new_feature` controla el banner del header, `button_color` el CTA del checkout
y `max_items` el límite del carrito.

Setup manual (dashboard de ConfigCat):

1. Cuenta gratis en <https://app.configcat.com/signup>.
2. En el Config por defecto, crear 3 flags: `show_new_feature` (boolean, OFF), `button_color`
   (text, `blue`), `max_items` (whole number, `10`).
3. Copiar la **SDK Key** (Config → SDK Key) en `.env.local`:
   `NEXT_PUBLIC_CONFIGCAT_SDK_KEY` y `CONFIGCAT_SDK_KEY` (misma key; ver `.env.example`).
4. Targeting: en `show_new_feature`, regla `IF Email CONTAINS @masorange.com → ON`, resto OFF.
   Probar en `/flags` cambiando de identidad.

Sin SDK key la app sigue funcionando con los valores por defecto (fail-soft del Provider).

## Unit 6 — Grafana Faro / observabilidad frontend

La lib [`libs/observability`](./libs/observability/README.md)
(`@onboarding-nx/observability`) replica `@digital/observability` del monorepo:
`ObservabilityProvider` (inicializa el SDK de Faro en el navegador),
`FaroErrorBoundary` (captura errores de render y los reporta con
`type: react_error_boundary`), y el hook `useFaroEvent` para empujar eventos, logs, errores y
contexto de usuario. Demo en **`/error-test`**, con los 3 disparadores de error, botones de
evento/log por nivel y un panel de contexto de usuario.

La app **nunca importa `@grafana/faro-*` directamente** — todo pasa por la lib
(`grep -rn "@grafana/faro" apps/web/app` no devuelve nada).

Setup manual (Grafana Cloud):

1. Cuenta gratis en <https://grafana.com/auth/sign-up/create-user> (stack `eu-west`).
2. **Frontend Observability → Create app**: nombre `onboarding-nx-web`, allowed origins
   `http://localhost:3000`.
3. Copiar el **Collector URL** en `.env.local` → `NEXT_PUBLIC_FARO_COLLECTOR_URL`
   (ver `.env.example`; las 4 vars de Faro son `NEXT_PUBLIC_` porque el SDK corre en el
   navegador, y la clave del collector es pública por diseño).
4. Verificar en Grafana Cloud → Frontend Observability → **Errors** que llegan los 3 errores
   de `/error-test`, y en **Events** el `demo_button_click`.

Sin collector URL la app funciona igual: un `console.warn` y cero peticiones al collector
(fail-soft del Provider, igual criterio que ConfigCat).

## Estructura

```text
onboarding-nx/
├── apps/
│   ├── web/                     # app Next.js (App Router + Tailwind, tests con Jest)
│   │                            #   → @onboarding-nx/web
│   └── panel/                   # app React + Vite (SPA, tests con Vitest)
│                                #   → @onboarding-nx/panel
└── libs/
    ├── ui/                      # lib de componentes React (Vitest)   → @onboarding-nx/ui
    ├── configcat/               # feature flags ConfigCat (port + adapters CSR/SSR/Mock)
    │                            #   → @onboarding-nx/configcat (Unit 5)
    ├── observability/           # Grafana Faro: provider + error boundary + useFaroEvent
    │                            #   → @onboarding-nx/observability (Unit 6)
    └── devices/                 # bounded context partido en capas hexagonales
        ├── domain/              # @onboarding-nx/domain          (TS puro: modelos + ports)
        ├── application/         # @onboarding-nx/application     (casos de uso; depende de domain)
        └── infrastructure/      # @onboarding-nx/infrastructure  (adapters; impl. del port)
```

### Estado de las capas hexagonales

`libs/devices/{domain,application,infrastructure}` están **scaffolded** (cada capa exporta de
momento un stub que devuelve el nombre de su capa). La estructura y las `references` ya respetan la
regla **las dependencias fluyen hacia dentro** (el dominio no conoce React/HTTP), pero el flujo de
ejemplo todavía no está implementado. El primer ejercicio es rellenarlas (ver más abajo).

## Comandos (siempre con `pnpm nx` desde la raíz del workspace)

```sh
pnpm nx dev @onboarding-nx/web         # levantar la app Next en dev
pnpm nx build @onboarding-nx/web       # build de producción de la app Next
pnpm nx dev @onboarding-nx/panel          # levantar la SPA (React + Vite)
pnpm nx graph                             # ver el grafo de dependencias

# Correr todo el workspace:
pnpm nx run-many -t lint test typecheck build

# Solo lo afectado por tus cambios:
pnpm nx affected -t lint test typecheck

# Sincronizar TS project references tras añadir deps entre libs:
pnpm nx sync
```

> Tras crear una lib nueva o añadir una dependencia entre libs: `pnpm install` (enlaza el paquete
> workspace) y `pnpm nx sync` (actualiza las project references).

## Setup

```sh
pnpm install                              # instalar dependencias (usa pnpm + workspaces)
pnpm nx run-many -t lint test typecheck build   # verificar que todo está en verde
```

Requisitos: Node 20+, pnpm. Convención de tests: **Vitest** en las libs y en la app `panel`;
**Jest** en la app `web` (Next aún no soporta vitest oficialmente).

## Ejercicios sugeridos (ver detalle en la guía, Bloque 6)

1. **Recon**: `pnpm nx graph` y localiza la relación `infrastructure → application → domain`.
2. **Implementa el flujo hexagonal** en `libs/devices/*/src/lib/*.ts`: define un modelo `Device` y
   un `DeviceCatalogPort` en **domain**, un caso de uso `GetDevices` en **application**, y un
   `InMemoryDeviceCatalogAdapter` en **infrastructure**. Declara las deps entre capas (`workspace:*`)
   en cada `package.json` y corre `pnpm nx sync`. Que `pnpm nx test` siga en verde.
3. **Conecta la app**: en `apps/web`, crea una página que use el adapter para listar dispositivos
   (practica componentes server/client de Next).
4. **Convención de commits**: rama `feat/PRACT-1-device-catalog`, commit
   `feat(devices): PRACT-1 add GetDevices use case`.
5. **Workflow de PR**: rama → PR → review del mentor → merge (objetivo mínimo de la Unit 1:
   ≥1 PR mergeado).
6. **Rompe un boundary a propósito**: importa `react` desde `@onboarding-nx/domain` y observa por
   qué es mala idea (en el monorepo real lo bloquea ESLint `@nx/enforce-module-boundaries`). Revierte.

## Estado verificado

Ejecutado `pnpm nx run-many -t lint test typecheck build` sobre los **17 proyectos** →
**todo en verde**. Único aviso: un `eslint-disable` sin usar en `web` (cosmético,
`nx lint @onboarding-nx/web --fix`).

Unit 6 verificada además en navegador (`/error-test`, sin collector URL configurada):

- el error de render se captura, muestra el fallback y **se recupera** al pulsar Reintentar;
- el error del handler y la promesa rechazada llegan a `window` (donde los recoge la
  instrumentación de Faro) **sin tumbar la página**;
- fail-soft correcto: **0 peticiones** al collector y un `console.warn` por señal descartada;
- `/` y `/dispositivos` **mantienen Static/ISR** en el build — el provider no fuerza dinámico.

Pendiente de la cuenta de Grafana Cloud: confirmar la ingesta real en
Frontend Observability → Errors / Events.
