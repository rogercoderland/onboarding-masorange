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
> workspace) y `pnpm nx sync` (actualiza las project references). Es exactamente el tipo de paso
> que se practica en la Unit 1.

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

Ejecutado `pnpm nx run-many -t lint test typecheck build` sobre los 6 proyectos → **todo en verde**
(`@onboarding-nx/web`, `@onboarding-nx/panel`, `@onboarding-nx/ui`, `@onboarding-nx/domain`,
`@onboarding-nx/application`, `@onboarding-nx/infrastructure`). Único aviso: un `eslint-disable` sin
usar en `web` (cosmético, `nx lint @onboarding-nx/web --fix`).
