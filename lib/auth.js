import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { nextCookies } from 'better-auth/next-js';

import { getDb, getMongoClient } from './mongodb';

/*
  Better Auth (server).

  - Sessions, users, accounts and verifications live in MongoDB
    (collections `user`, `session`, `account`, `verification`).
  - Only Google is enabled as a sign-in method (email + password is disabled).
*/

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export function isGoogleAuthConfigured() {
  return Boolean(googleClientId && googleClientSecret);
}

export const auth = betterAuth({
  appName: 'FinCheck',
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(getDb(), {
    client: getMongoClient(),
    // Standalone MongoDB servers do not support transactions. Keep it opt-in so
    // the app also works against a local `mongod` without a replica set.
    transaction: process.env.MONGODB_TRANSACTIONS === 'true',
  }),
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    google: {
      clientId: googleClientId ?? '',
      clientSecret: googleClientSecret ?? '',
      prompt: 'select_account',
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh the session cookie daily
  },
  plugins: [nextCookies()],
});

/**
 * Reads the current session from a Request's headers (Route Handlers) and
 * returns it, or `null` when the request is not authenticated.
 */
export async function getSessionFromRequest(request) {
  try {
    return await auth.api.getSession({ headers: request.headers });
  } catch {
    return null;
  }
}
