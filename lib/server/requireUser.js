import { getSessionFromRequest } from '../auth';

/**
 * Resolves the authenticated user for a Route Handler.
 * Returns `{ userId }` on success or `{ response }` with a 401 payload.
 */
export async function requireUser(request) {
  const session = await getSessionFromRequest(request);
  if (!session?.user?.id) {
    return {
      response: Response.json({ error: 'No autenticado.' }, { status: 401 }),
    };
  }
  return { userId: session.user.id, user: session.user };
}

export function jsonError(error) {
  if (error?.name === 'ValidationError') {
    return Response.json({ error: error.message }, { status: 400 });
  }
  console.error('[fincheck] API error:', error);
  return Response.json(
    { error: 'No se pudo completar la operación. Revisa la conexión con MongoDB.' },
    { status: 500 },
  );
}
