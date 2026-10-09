import { ValidationError, deleteTransaction, upsertTransaction } from '@/lib/server/finance';
import { jsonError, requireUser } from '@/lib/server/requireUser';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/transactions
 * Creates or updates a single transaction for the signed-in user.
 */
export async function POST(request) {
  const { userId, response } = await requireUser(request);
  if (response) return response;

  try {
    const body = await request.json();
    const transaction = await upsertTransaction(userId, body?.transaction ?? body);
    return Response.json({ transaction });
  } catch (error) {
    return jsonError(error);
  }
}

/**
 * DELETE /api/transactions?id=<id>
 */
export async function DELETE(request) {
  const { userId, response } = await requireUser(request);
  if (response) return response;

  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) throw new ValidationError('Falta el identificador de la transacción.');
    await deleteTransaction(userId, id);
    return Response.json({ ok: true });
  } catch (error) {
    return jsonError(error);
  }
}
