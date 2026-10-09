import { saveBudgets } from '@/lib/server/finance';
import { jsonError, requireUser } from '@/lib/server/requireUser';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * PUT /api/budgets
 * Replaces the monthly budget for every category of the signed-in user.
 */
export async function PUT(request) {
  const { userId, response } = await requireUser(request);
  if (response) return response;

  try {
    const body = await request.json();
    const budgets = await saveBudgets(userId, body?.budgets ?? body);
    return Response.json({ budgets });
  } catch (error) {
    return jsonError(error);
  }
}
