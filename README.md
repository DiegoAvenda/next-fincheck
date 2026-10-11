# FinCheck

Personal finance web app: income and expense tracking, breakdown by
category, budget alerts, 50/30/20 rule, and savings and
investment recommendations.

## Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) + React 19 |
| Authentication | [Better Auth](https://better-auth.com) with **Google** provider |
| Database | **MongoDB** (official driver, no ORM) |
| Client state | Zustand |
| Styles | Tailwind CSS 4 |

> Before this version the project used AWS Amplify Gen 2 (Amazon Cognito +
DynamoDB/AppSync). That backend was fully replaced by Better Auth +
MongoDB.

## Getting started

### 1. Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

```dotenv
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=<generate one with: node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))">

MONGODB_URI=mongodb://127.0.0.1:27017/fincheck
MONGODB_DB_NAME=fincheck
MONGODB_TRANSACTIONS=false

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### 2. MongoDB

- **Local:** install MongoDB Community and use `mongodb://127.0.0.1:27017/fincheck`.
  If your server does not run as a *replica set*, keep `MONGODB_TRANSACTIONS=false`.
- **Atlas (no install needed):** create a free cluster and paste the
  `mongodb+srv://...` connection string into `MONGODB_URI`.

Collections are created automatically on first use and indexes
(`transactions` by `userId + id`, `budgets` by `userId`) are generated
automatically.

### 3. Google credentials

1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials).
2. Create a web-application **OAuth client ID**.
3. Add the authorized *redirect URIs*:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://YOUR-DOMAIN/api/auth/callback/google`
4. Copy the *Client ID* and *Client Secret* into `GOOGLE_CLIENT_ID` and
   `GOOGLE_CLIENT_SECRET`.

### 4. Run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with Google.

## Architecture

```
app/
  api/auth/[...all]/route.js   → Better Auth endpoints (login, callback, session, logout)
  api/bootstrap/route.js       → loads the user data (new accounts start empty)
  api/transactions/route.js    → create/update and delete transactions
  api/budgets/route.js         → save budgets
  page.js                      → dashboard (local demo without login, real data with session)
lib/
  auth.js                      → Better Auth setup (Google + MongoDB adapter)
  auth-client.js               → Better Auth client for React
  mongodb.js                   → cached MongoDB client + indexes
  server/finance.js            → transactions/budgets repository
  apiClient.js                 → typed fetch wrapper for the /api routes
  store.js                     → shared state (Zustand)
components/
  LoginView.jsx                → Google sign-in screen
  UserMenu.jsx                 → account menu and sign-out
  BackendModal.jsx             → period data viewer and export
```

### Data model

```
transactions  { userId, id, description, amount, type, category, date, paymentMethod, notes }
budgets       { userId, values: { [category]: monthlyLimit } }
```

All documents are filtered by `userId` (the Better Auth user id),
so each account only sees and modifies its own data.
