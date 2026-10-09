# FinCheck

Web app de finanzas personales: registro de gastos e ingresos, desglose por
categoría, alertas de presupuesto, regla 50/30/20 y recomendaciones de ahorro e
inversión.

## Stack

| Capa | Tecnología |
| --- | --- |
| Framework | Next.js 16 (App Router) + React 19 |
| Autenticación | [Better Auth](https://better-auth.com) con proveedor **Google** |
| Base de datos | **MongoDB** (driver oficial, sin ORM) |
| Estado en cliente | Zustand |
| Estilos | Tailwind CSS 4 |

> Antes de esta versión el proyecto usaba AWS Amplify Gen 2 (Amazon Cognito +
DynamoDB/AppSync). Ese backend fue sustituido por completo por Better Auth +
MongoDB.

## Puesta en marcha

### 1. Variables de entorno

Copia `.env.example` a `.env.local` y completa los valores:

```bash
cp .env.example .env.local
```

```dotenv
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=<genera uno con: node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))">

MONGODB_URI=mongodb://127.0.0.1:27017/fincheck
MONGODB_DB_NAME=fincheck
MONGODB_TRANSACTIONS=false

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### 2. MongoDB

- **Local:** instala MongoDB Community y usa `mongodb://127.0.0.1:27017/fincheck`.
  Si tu servidor no corre como *replica set*, deja `MONGODB_TRANSACTIONS=false`.
- **Atlas (sin instalar nada):** crea un clúster gratuito y pega la cadena
  `mongodb+srv://...` en `MONGODB_URI`.

Las colecciones se crean solas en el primer uso y los índices
(`transactions` por `userId + id`, `budgets` por `userId`) se generan
automáticamente.

### 3. Credenciales de Google

1. Entra a [Google Cloud Console → Credenciales](https://console.cloud.google.com/apis/credentials).
2. Crea una **ID de cliente de OAuth** de tipo *Aplicación web*.
3. Agrega los *URIs de redireccionamiento autorizados*:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://TU-DOMINIO/api/auth/callback/google`
4. Copia el *Client ID* y el *Client Secret* en `GOOGLE_CLIENT_ID` y
   `GOOGLE_CLIENT_SECRET`.

### 4. Ejecutar

```bash
pnpm install
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) e inicia sesión con Google.

## Arquitectura

```
app/
  api/auth/[...all]/route.js   → endpoints de Better Auth (login, callback, session, logout)
  api/bootstrap/route.js       → carga (y siembra) los datos del usuario
  api/transactions/route.js    → crear/actualizar y borrar transacciones
  api/budgets/route.js         → guardar presupuestos
  api/data/reset/route.js      → restaurar el conjunto demo
  page.js                      → dashboard (protegido por sesión)
lib/
  auth.js                      → configuración de Better Auth (Google + adaptador MongoDB)
  auth-client.js               → cliente de Better Auth para React
  mongodb.js                   → cliente MongoDB cacheado + índices
  server/finance.js            → repositorio de transacciones/presupuestos
  apiClient.js                 → fetch tipado contra las rutas /api
  store.js                     → estado compartido (Zustand)
components/
  LoginView.jsx                → pantalla de acceso con Google
  UserMenu.jsx                 → menú de cuenta y cierre de sesión
  BackendModal.jsx             → documentación de la arquitectura y export de datos
```

### Modelo de datos

```
transactions  { userId, id, description, amount, type, category, date, paymentMethod, notes }
budgets       { userId, values: { [categoría]: monthlyLimit } }
```

Todos los documentos se filtran por `userId` (el id del usuario de Better Auth),
así que cada cuenta solo ve y modifica su propia información.
