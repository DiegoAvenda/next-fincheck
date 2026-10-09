'use client';

import { createAuthClient } from 'better-auth/react';

/*
  Better Auth client (browser).

  Usage:
    authClient.signIn.social({ provider: 'google', callbackURL: '/' })
    const { data: session, isPending } = authClient.useSession()
    authClient.signOut()
*/
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || undefined,
});

export const { signIn, signOut, useSession } = authClient;
