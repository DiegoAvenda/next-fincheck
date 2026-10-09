'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { financeApi } from './apiClient';
import {
  calculateTotals,
  calculateCategoryBreakdown,
  calculateBudgetAlerts,
  calculate503020,
  calculateHealthScore,
  generateSmartAdvice,
} from './financeCalculations';

/*
  Zustand store for the shared finance state.

  Data lives in MongoDB and is read/written through the API routes; every
  mutation updates the UI optimistically and rolls back when the request fails.
*/

function extractErrorMessage(error) {
  if (error?.status === 401) return 'Tu sesión expiró. Vuelve a iniciar sesión.';
  return error?.message ?? 'No se pudo sincronizar con el servidor.';
}

export const useFinStore = create(
  devtools((set, get) => ({
    transactions: [],
    budgets: {},
    status: 'idle', // 'idle' | 'loading' | 'ready' | 'error'
    error: null,

    /** Loads (and on first run seeds) the user's data from MongoDB. */
    init: async () => {
      set({ status: 'loading', error: null });
      try {
        const data = await financeApi.bootstrap();
        set({
          transactions: data?.transactions ?? [],
          budgets: data?.budgets ?? {},
          status: 'ready',
          error: null,
        });
      } catch (error) {
        set({ status: 'error', error: extractErrorMessage(error) });
      }
    },

    /** Clears local state (used on sign-out). */
    clear: () => set({ transactions: [], budgets: {}, status: 'idle', error: null }),

    addOrUpdateTransaction: async (transaction) => {
      const previous = get().transactions;
      const exists = previous.some((item) => item.id === transaction.id);
      const next = exists
        ? previous.map((item) => (item.id === transaction.id ? transaction : item))
        : [transaction, ...previous];

      set({ transactions: next });

      try {
        await financeApi.saveTransaction(transaction);
        set({ error: null });
      } catch (error) {
        set({ transactions: previous, error: extractErrorMessage(error) });
        throw error;
      }
    },

    deleteTransaction: async (id) => {
      const previous = get().transactions;
      set({ transactions: previous.filter((item) => item.id !== id) });

      try {
        await financeApi.deleteTransaction(id);
        set({ error: null });
      } catch (error) {
        set({ transactions: previous, error: extractErrorMessage(error) });
        throw error;
      }
    },

    setBudgets: async (budgets) => {
      const previous = get().budgets;
      set({ budgets });

      try {
        await financeApi.saveBudgets(budgets);
        set({ error: null });
      } catch (error) {
        set({ budgets: previous, error: extractErrorMessage(error) });
        throw error;
      }
    },

    resetData: async () => {
      try {
        const data = await financeApi.reset();
        set({
          transactions: data?.transactions ?? [],
          budgets: data?.budgets ?? {},
          error: null,
        });
      } catch (error) {
        set({ error: extractErrorMessage(error) });
      }
    },

    // ---- Derived selectors ----
    getTotals: () => calculateTotals(get().transactions),
    getCategoryBreakdown: () => calculateCategoryBreakdown(get().transactions, get().budgets),
    getAlerts: () => calculateBudgetAlerts(get().getCategoryBreakdown()),
    getRule503020: () => {
      const totals = get().getTotals();
      return calculate503020(get().getCategoryBreakdown(), totals.totalIncome, totals.netBalance);
    },
    getHealthScore: () => {
      const alerts = get().getAlerts();
      return calculateHealthScore(get().getTotals(), get().getCategoryBreakdown(), alerts);
    },
    getSmartAdvice: () =>
      generateSmartAdvice(
        get().getTotals(),
        get().getCategoryBreakdown(),
        get().getRule503020(),
        get().getAlerts(),
      ),
  })),
);
