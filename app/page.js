'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import OverviewCards from '../components/OverviewCards';
import AlertsBanner from '../components/AlertsBanner';
import CategoryBreakdown from '../components/CategoryBreakdown';
import TransactionsTable from '../components/TransactionsTable';
import TransactionModal from '../components/TransactionModal';
import BudgetManager from '../components/BudgetManager';
import FinancialAdvisor from '../components/FinancialAdvisor';
import BackendModal from '../components/BackendModal';
import LoginView from '../components/LoginView';

import { authClient, signIn } from '../lib/auth-client';
import { useFinStore } from '../lib/store';
import {
  calculateTotals,
  calculateCategoryBreakdown,
  calculateBudgetAlerts,
  calculate503020,
  calculateHealthScore,
  generateSmartAdvice,
} from '../lib/financeCalculations';
import { RotateCcw, Sparkles, Database, ArrowRight, CloudOff, Loader2, LogIn } from 'lucide-react';
import { INITIAL_TRANSACTIONS, INITIAL_BUDGETS } from '../lib/constants';

export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user ?? null;

  // UI state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isBackendModalOpen, setIsBackendModalOpen] = useState(false);

  // Shared data (MongoDB through /api routes)
  const transactions = useFinStore((state) => state.transactions);
  const budgets = useFinStore((state) => state.budgets);
  const status = useFinStore((state) => state.status);
  const syncError = useFinStore((state) => state.error);
  const initStore = useFinStore((state) => state.init);
  const clearStore = useFinStore((state) => state.clear);

  // Demo data for non-authenticated users
  const demoTransactions = useMemo(() => INITIAL_TRANSACTIONS, []);
  const demoBudgets = useMemo(() => INITIAL_BUDGETS, []);

  useEffect(() => {
    if (user?.id) {
      initStore();
    } else if (!isPending) {
      clearStore();
    }
  }, [user?.id, isPending, initStore, clearStore]);

  const handleSaveTransaction = (transaction) => {
    useFinStore.getState().addOrUpdateTransaction(transaction).catch(() => {});
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id) => {
    useFinStore.getState().deleteTransaction(id).catch(() => {});
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsAddModalOpen(true);
  };

  const handleSaveBudgets = (newBudgets) => {
    useFinStore.getState().setBudgets(newBudgets).catch(() => {});
  };

  const handleResetData = async () => {
    if (!confirm('¿Restablecer tus datos de FinCheck con el conjunto de demostración?')) return;
    await useFinStore.getState().resetData();
  };

  // Derived calculations - use demo data when not authenticated
  const displayTransactions = user ? transactions : demoTransactions;
  const displayBudgets = user ? budgets : demoBudgets;

  const totals = useMemo(() => calculateTotals(displayTransactions), [displayTransactions]);
  const categoryBreakdown = useMemo(
    () => calculateCategoryBreakdown(displayTransactions, displayBudgets),
    [displayTransactions, displayBudgets],
  );
  const alerts = useMemo(() => calculateBudgetAlerts(categoryBreakdown), [categoryBreakdown]);
  const rule503020 = useMemo(
    () => calculate503020(categoryBreakdown, totals.totalIncome, totals.netBalance),
    [categoryBreakdown, totals.totalIncome, totals.netBalance],
  );
  const healthScore = useMemo(
    () => calculateHealthScore(totals, categoryBreakdown, alerts),
    [totals, categoryBreakdown, alerts],
  );
  const smartAdvice = useMemo(
    () => generateSmartAdvice(totals, categoryBreakdown, rule503020, alerts),
    [totals, categoryBreakdown, rule503020, alerts],
  );

  // Session still resolving
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-sm font-medium">Iniciando FinCheck...</p>
        </div>
      </div>
    );
  }

  const isLoadingData = user && (status === 'loading' || status === 'idle');
  const isDemoMode = !user;

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        isDemoMode={isDemoMode}
        onOpenAddModal={() => {
          setEditingTransaction(null);
          setIsAddModalOpen(true);
        }}
        onOpenBackendModal={() => setIsBackendModalOpen(true)}
        onResetData={handleResetData}
        alertsCount={alerts.totalCount}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {isDemoMode && (
          <div className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-200 text-sm">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-semibold">Modo Demostración</p>
                <p className="text-xs text-indigo-200/80 mt-0.5">Explora el dashboard con datos de ejemplo</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                authClient.signIn.social({ provider: 'google', callbackURL: '/' });
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shrink-0 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Iniciar Sesión</span>
            </button>
          </div>
        )}

        {syncError && (
          <div className="flex items-start gap-3 p-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-200 text-sm">
            <CloudOff className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">No se pudo sincronizar con MongoDB</p>
              <p className="text-xs text-rose-200/80 mt-0.5">{syncError}</p>
            </div>
          </div>
        )}

        {isLoadingData ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
            <p className="text-sm font-medium">Cargando tus finanzas desde MongoDB...</p>
          </div>
        ) : (
          <>
            <AlertsBanner
              alerts={alerts}
              onNavigateToBudgets={() => setActiveTab('budgets')}
            />

            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <OverviewCards
                  totals={totals}
                  healthScore={healthScore}
                  onOpenAdvisor={() => setActiveTab('advisor')}
                />

                <CategoryBreakdown
                  categoryBreakdown={categoryBreakdown}
                  totalExpense={totals.totalExpense}
                  onNavigateToBudgets={() => setActiveTab('budgets')}
                />

                {smartAdvice.length > 0 && (
                  <div className="glass-panel rounded-2xl p-5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          Recomendación Financiera Activa: {smartAdvice[0].title}
                        </h4>
                        <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                          {smartAdvice[0].description}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('advisor')}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shrink-0 self-start sm:self-auto transition-colors"
                    >
                      <span>Explorar Asesor e Inversión</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white">Movimientos Recientes</h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('transactions')}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <span>Ver todas las transacciones</span>
                      <span>→</span>
                    </button>
                  </div>

                  <TransactionsTable
                    transactions={displayTransactions.slice(0, 5)}
                    onOpenAddModal={() => {
                      setEditingTransaction(null);
                      setIsAddModalOpen(true);
                    }}
                    onEditTransaction={handleEditTransaction}
                    onDeleteTransaction={handleDeleteTransaction}
                    isDemoMode={isDemoMode}
                  />
                </div>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="animate-in fade-in duration-300">
                <TransactionsTable
                  transactions={displayTransactions}
                  onOpenAddModal={() => {
                    setEditingTransaction(null);
                    setIsAddModalOpen(true);
                  }}
                  onEditTransaction={handleEditTransaction}
                  onDeleteTransaction={handleDeleteTransaction}
                  isDemoMode={isDemoMode}
                />
              </div>
            )}

            {activeTab === 'budgets' && (
              <div className="animate-in fade-in duration-300">
                <BudgetManager
                  budgets={displayBudgets}
                  onSaveBudgets={handleSaveBudgets}
                  categoryBreakdown={categoryBreakdown}
                  totals={totals}
                  onOpenAddModal={() => {
                    setEditingTransaction(null);
                    setIsAddModalOpen(true);
                  }}
                  isDemoMode={isDemoMode}
                />
              </div>
            )}

            {activeTab === 'advisor' && (
              <div className="animate-in fade-in duration-300">
                <FinancialAdvisor
                  rule503020={rule503020}
                  smartAdvice={smartAdvice}
                  totals={totals}
                  categoryBreakdown={categoryBreakdown}
                />
              </div>
            )}
          </>
        )}
      </main>

      <footer className="border-t border-white/5 py-8 mt-12 bg-slate-950/60 backdrop-blur-sm text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">FinCheck</span>
            <span>•</span>
            <span>Plataforma Inteligente de Finanzas Personales</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsBackendModalOpen(true)}
              className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Better Auth + MongoDB</span>
            </button>

            <span>•</span>

            <button
              type="button"
              onClick={handleResetData}
              className="hover:text-rose-400 flex items-center gap-1 transition-colors"
              title="Restaurar datos de demostración"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer Demo</span>
            </button>
          </div>
        </div>
      </footer>

      {!isDemoMode && (
        <TransactionModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingTransaction(null);
          }}
          onSave={handleSaveTransaction}
          editingTransaction={editingTransaction}
        />
      )}

      <BackendModal isOpen={isBackendModalOpen} onClose={() => setIsBackendModalOpen(false)} />
    </div>
  );
}
