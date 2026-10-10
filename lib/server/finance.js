import { COLLECTIONS, ensureIndexes, getDb } from '../mongodb';

/*
  Finance repository (server-only).

  Every document is scoped by `userId` (the Better Auth user id), so each user
  only ever reads and writes their own transactions and budgets.
*/

const MAX_TEXT_LENGTH = 280;

function toNumber(value, fallback = 0) {
  const parsed = typeof value === 'number' ? value : Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toText(value) {
  if (value === undefined || value === null) return null;
  const text = String(value).slice(0, MAX_TEXT_LENGTH);
  return text.length > 0 ? text : null;
}

function normalizeTransaction(input, userId) {
  const id = toText(input?.id) ?? crypto.randomUUID();
  const description = toText(input?.description);
  const category = toText(input?.category);
  const type = input?.type === 'income' ? 'income' : 'expense';
  const date = toText(input?.date) ?? new Date().toISOString().slice(0, 10);

  if (!description) throw new ValidationError('La descripción es obligatoria.');
  if (!category) throw new ValidationError('La categoría es obligatoria.');

  return {
    id,
    userId,
    description,
    amount: Math.abs(toNumber(input?.amount)),
    type,
    category,
    date: date.slice(0, 10),
    paymentMethod: toText(input?.paymentMethod),
    notes: toText(input?.notes),
  };
}

function normalizeBudgets(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new ValidationError('Los presupuestos deben ser un objeto por categoría.');
  }
  const values = {};
  for (const [category, amount] of Object.entries(input)) {
    const key = toText(category);
    if (!key) continue;
    values[key] = Math.max(0, toNumber(amount));
  }
  return values;
}

function toClientTransaction(doc) {
  return {
    id: doc.id,
    description: doc.description,
    amount: doc.amount,
    type: doc.type,
    category: doc.category,
    date: doc.date,
    paymentMethod: doc.paymentMethod ?? undefined,
    notes: doc.notes ?? undefined,
  };
}

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Returns the finance data for a user. New accounts start empty so the user
 * always sees their real numbers (no demo seeding in the cloud).
 */
export async function getFinanceData(userId) {
  await ensureIndexes();
  const db = getDb();

  const [documents, budgetDocument] = await Promise.all([
    db
      .collection(COLLECTIONS.transactions)
      .find({ userId })
      .sort({ date: -1, createdAt: -1 })
      .toArray(),
    db.collection(COLLECTIONS.budgets).findOne({ userId }),
  ]);

  return {
    transactions: documents.map(toClientTransaction),
    budgets: budgetDocument?.values ?? {},
    seeded: false,
  };
}

export async function upsertTransaction(userId, input) {
  await ensureIndexes();
  const normalized = normalizeTransaction(input, userId);
  const { id, userId: _ignoredUserId, ...fields } = normalized;

  await getDb().collection(COLLECTIONS.transactions).updateOne(
    { userId, id },
    {
      // `id`/`userId` stay in the filter: repeating them in `$set` would
      // collide with `$setOnInsert` ("Updating the path 'id' would create a conflict").
      $set: { ...fields, updatedAt: new Date() },
      $setOnInsert: { userId, id, createdAt: new Date() },
    },
    { upsert: true },
  );

  return { id, ...fields };
}

export async function deleteTransaction(userId, id) {
  const transactionId = toText(id);
  if (!transactionId) throw new ValidationError('Falta el identificador de la transacción.');
  await ensureIndexes();
  await getDb()
    .collection(COLLECTIONS.transactions)
    .deleteOne({ userId, id: transactionId });
}

export async function saveBudgets(userId, input) {
  await ensureIndexes();
  const values = normalizeBudgets(input);

  await getDb().collection(COLLECTIONS.budgets).updateOne(
    { userId },
    {
      $set: { values, updatedAt: new Date() },
      $setOnInsert: { userId, createdAt: new Date() },
    },
    { upsert: true },
  );

  return values;
}
