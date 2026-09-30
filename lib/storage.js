import { INITIAL_TRANSACTIONS, INITIAL_BUDGETS } from './constants';

const TRANSACTIONS_KEY = 'fincheck_transactions_v1';
const BUDGETS_KEY = 'fincheck_budgets_v1';
const AMPLIFY_CONFIG_KEY = 'fincheck_amplify_config_v1';

export const storageService = {
  // --- TRANSACTIONS ---
  getTransactions: () => {
    if (typeof window === 'undefined') return INITIAL_TRANSACTIONS;
    try {
      const data = localStorage.getItem(TRANSACTIONS_KEY);
      if (!data) {
        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
        return INITIAL_TRANSACTIONS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading transactions from localStorage:', e);
      return INITIAL_TRANSACTIONS;
    }
  },

  saveTransactions: (transactions) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    } catch (e) {
      console.error('Error saving transactions:', e);
    }
  },

  // --- BUDGETS ---
  getBudgets: () => {
    if (typeof window === 'undefined') return INITIAL_BUDGETS;
    try {
      const data = localStorage.getItem(BUDGETS_KEY);
      if (!data) {
        localStorage.setItem(BUDGETS_KEY, JSON.stringify(INITIAL_BUDGETS));
        return INITIAL_BUDGETS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading budgets from localStorage:', e);
      return INITIAL_BUDGETS;
    }
  },

  saveBudgets: (budgets) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
    } catch (e) {
      console.error('Error saving budgets:', e);
    }
  },

  // --- RESET / RESTORE ---
  resetToDefault: () => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
    localStorage.setItem(BUDGETS_KEY, JSON.stringify(INITIAL_BUDGETS));
    return {
      transactions: INITIAL_TRANSACTIONS,
      budgets: INITIAL_BUDGETS,
    };
  },

  // --- EXPORT / IMPORT FOR AWS DYNAMODB ---
  exportAllDataJSON: () => {
    const transactions = storageService.getTransactions();
    const budgets = storageService.getBudgets();
    return JSON.stringify({
      schemaVersion: '1.0',
      exportedAt: new Date().toISOString(),
      dynamoDbTables: {
        Transaction: transactions,
        Budget: Object.entries(budgets).map(([category, amount]) => ({ category, monthlyLimit: amount })),
      }
    }, null, 2);
  },

  importDataJSON: (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.dynamoDbTables?.Transaction && Array.isArray(parsed.dynamoDbTables.Transaction)) {
        storageService.saveTransactions(parsed.dynamoDbTables.Transaction);
      }
      if (parsed.dynamoDbTables?.Budget && Array.isArray(parsed.dynamoDbTables.Budget)) {
        const budgetObj = {};
        parsed.dynamoDbTables.Budget.forEach((b) => {
          budgetObj[b.category] = b.monthlyLimit;
        });
        storageService.saveBudgets(budgetObj);
      }
      return true;
    } catch (e) {
      console.error('Failed to import JSON data:', e);
      return false;
    }
  }
};
