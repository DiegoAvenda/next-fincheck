import { MongoClient } from 'mongodb';

/*
  MongoDB connection helper (server-only).

  - Creates a single MongoClient per Node.js process (and per dev HMR reload
    thanks to the global cache).
  - `new MongoClient()` does not open a socket, so importing this module during
    `next build` is safe: the connection is established lazily on first query.
*/

const DEFAULT_URI = 'mongodb://127.0.0.1:27017/fincheck';
const DEFAULT_DB_NAME = 'fincheck';

function globalCache() {
  if (!globalThis.__finCheckMongo) {
    globalThis.__finCheckMongo = {
      client: null,
      db: null,
      indexes: null,
    };
  }
  return globalThis.__finCheckMongo;
}

export function getMongoUri() {
  return process.env.MONGODB_URI || DEFAULT_URI;
}

export function getMongoClient() {
  const cache = globalCache();
  if (!cache.client) {
    cache.client = new MongoClient(getMongoUri(), {
      // Avoid persisting `undefined` fields (keeps documents tidy).
      ignoreUndefined: true,
    });
  }
  return cache.client;
}

export function getDb() {
  const cache = globalCache();
  if (!cache.db) {
    cache.db = getMongoClient().db(process.env.MONGODB_DB_NAME || DEFAULT_DB_NAME);
  }
  return cache.db;
}

export const COLLECTIONS = {
  transactions: 'transactions',
  budgets: 'budgets',
};

/**
 * Creates the indexes needed by the finance repository. Runs once per process.
 */
export function ensureIndexes() {
  const cache = globalCache();
  if (!cache.indexes) {
    cache.indexes = (async () => {
      const db = getDb();
      await db
        .collection(COLLECTIONS.transactions)
        .createIndex({ userId: 1, id: 1 }, { unique: true });
      await db
        .collection(COLLECTIONS.budgets)
        .createIndex({ userId: 1 }, { unique: true });
    })().catch((error) => {
      // Allow a later request to retry if the DB was temporarily unavailable.
      cache.indexes = null;
      throw error;
    });
  }
  return cache.indexes;
}
