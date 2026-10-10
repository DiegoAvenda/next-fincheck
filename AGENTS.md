<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# FinCheck — Instrucciones para agentes

App de finanzas personales (ES): gastos/ingresos, presupuestos por categoría,
regla 50/30/20 y consejos de ahorro/inversión. Dashboard en `app/page.js`.

## Stack

- Next.js 16 App Router + React 19, solo **JS** (`.js`/`.jsx`, sin TS). Alias `@/*` → `./*` (`jsconfig.json`).
- Auth: Better Auth solo **Google** (`lib/auth.js` server, `lib/auth-client.js` cliente). Sin email/password.
- DB: MongoDB driver oficial, sin ORM (`lib/mongodb.js`, repo `lib/server/finance.js`).
- Estado cliente: Zustand (`lib/store.js`). Fetch: `lib/apiClient.js`. Cálculos puros: `lib/financeCalculations.js`. Constantes/demo: `lib/constants.js`.
- Estilos: Tailwind CSS 4 (`@import "tailwindcss"` en `app/globals.css`), tema oscuro + `glass-panel`. Iconos `lucide-react`.
- Package manager `pnpm@10.5.2`. `next.config.mjs` usa `serverExternalPackages: ['mongodb']` — no quitar.

## Comandos

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build
pnpm lint     # eslint-config-next core-web-vitals
```

Sin tests. Verificar con `pnpm lint` y `pnpm build`; no commitear `.next/`, `.env.local`.

## Env (`BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `MONGODB_URI`, `MONGODB_DB_NAME`, `MONGODB_TRANSACTIONS`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`)

- Local: `MONGODB_URI=mongodb://127.0.0.1:27017/fincheck`, `MONGODB_TRANSACTIONS=false` salvo replica set/Atlas.
- Callback Google: `/api/auth/callback/google`. Nunca loguear secretos ni exponerlos al cliente (`NEXT_PUBLIC_*` solo si es imprescindible).

## Estructura y patrones obligatorios

- `app/api/auth/[...all]/route.js` → Better Auth. `app/api/bootstrap|transactions|budgets/route.js` → siempre `export const runtime='nodejs'; export const dynamic='force-dynamic';` + `requireUser(request)` (`lib/server/requireUser.js`, 401 `{error}`) + `try/catch → jsonError(error)` (`ValidationError`→400, resto→500). No existe ruta de borrado masivo: la cuenta solo se modifica por upsert/delete unitario.
- `lib/server/*` solo servidor: nunca importar `mongodb.js`/`auth.js`/`server/finance.js` desde componentes cliente. Cliente solo usa `financeApi` + `useFinStore` + `authClient.useSession()` / `signIn.social({provider:'google'})`.
- Mongo: usar `getDb()`/`ensureIndexes()` con caché `globalThis.__finCheckMongo`. Índices: `transactions {userId:1,id:1}` único, `budgets {userId:1}` único. Conexión lazy (seguro en build).
- Datos siempre filtrados por `userId` de sesión. `POST /api/transactions` hace upsert por `{userId,id}` con `$set`/`$setOnInsert` sin repetir `id/userId` en `$set`. Respuesta cliente sin `userId` (`toClientTransaction`). Normalizar en `normalizeTransaction/normalizeBudgets` (texto max 280, `amount=abs()`, `type expense|income`, fecha `YYYY-MM-DD`).
- Zustand: mutación optimista + rollback en `catch`. `init()` carga `/api/bootstrap` (la cuenta nueva arranca vacía, sin siembra); `clear()` al cerrar sesión. No llamar cálculos dentro del render sin `useMemo`.
- `app/page.js` es `'use client'`: sin usuario muestra demo editable (`INITIAL_TRANSACTIONS/BUDGETS` en `lib/constants.js`, persistido en localStorage, nunca toca la DB); con usuario muestra Mongo, que arranca vacío. Respetar `isDemoMode`, no montar acciones destructivas en sesión.
- Nuevas categorías: añadir en `EXPENSE_CATEGORIES/INCOME_CATEGORIES` con `id,label,icon,color,group (needs|wants|savings)`; grupos alimentan 50/30/20.
- UI en español, montos `$` con `toLocaleString()`. Reutilizar componentes `components/*.jsx` y clases `glass-panel`, `glow-*`.

## No hacer

- No reintroducir Amplify/Cognito/Dynamo/AppSync, ni Prisma/Mongoose, ni activar `emailAndPassword`, ni transacciones Mongo por defecto.
- No crear rutas API sin `requireUser`, no confiar en `id/userId` del body, no devolver documentos crudos con `userId/_id`.
- No convertir a TS ni añadir dependencias sin necesidad; no tocar el bloque `nextjs-agent-rules` de arriba.
