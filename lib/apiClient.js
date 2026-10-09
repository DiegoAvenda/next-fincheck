'use client';

/*
  Thin fetch wrapper around the FinCheck API routes.
  Every request carries the Better Auth session cookie (`credentials`).
*/

async function request(url, { method = 'GET', body } = {}) {
  const init = { method, credentials: 'same-origin' };

  if (body !== undefined) {
    init.headers = { 'Content-Type': 'application/json' };
    init.body = JSON.stringify(body);
  }

  const response = await fetch(url, init);
  const contentType = response.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    const error = new Error(payload?.error ?? `Error ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return payload;
}

export const financeApi = {
  bootstrap: () => request('/api/bootstrap'),
  saveTransaction: (transaction) =>
    request('/api/transactions', { method: 'POST', body: { transaction } }),
  deleteTransaction: (id) =>
    request(`/api/transactions?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),
  saveBudgets: (budgets) => request('/api/budgets', { method: 'PUT', body: { budgets } }),
  reset: () => request('/api/data/reset', { method: 'POST' }),
};
