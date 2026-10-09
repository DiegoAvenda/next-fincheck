import { toNextJsHandler } from 'better-auth/next-js';

import { auth } from '@/lib/auth';

/*
  Better Auth catch-all endpoint.

  Handles every auth route under /api/auth/* (sign-in, callback, session,
  sign-out, ...). Google redirects back to /api/auth/callback/google.
*/

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const { GET, POST } = toNextJsHandler(auth);
