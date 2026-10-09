import { resetFinanceData } from '@/lib/server/finance';
import { jsonError, requireUser } from '@/lib/server/requireUser';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/data/reset
 * Restores the demo dataset for the signed-in user.
 */
export async function POST(request) {
  const { userId, response } = await requireUser(request);
  if (response) return response;

  try {
    const data = await resetFinanceData(userId);
    return Response.json(data);
  } catch (error) {
    return jsonError(error);
  }
}
