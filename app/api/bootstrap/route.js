import { getFinanceData } from '@/lib/server/finance';
import { jsonError, requireUser } from '@/lib/server/requireUser';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/bootstrap
 * Returns every transaction and budget for the signed-in user, seeding the
 * demo dataset the first time the account is used.
 */
export async function GET(request) {
  const { userId, response } = await requireUser(request);
  if (response) return response;

  try {
    const data = await getFinanceData(userId);
    return Response.json(data);
  } catch (error) {
    return jsonError(error);
  }
}
