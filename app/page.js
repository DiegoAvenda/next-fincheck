'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowRight,
  CalendarDays,
  CloudOff,
  Database,
  Loader2,
  LogIn,
  RotateCcw,
  Sparkles,
  Upload,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import OverviewCards from '../components/OverviewCards';
import AlertsBanner from '../components/AlertsBanner';
import CategoryBreakdown from '../components/CategoryBreakdown';
import TransactionsTable from '../components/TransactionsTable';
import TransactionModal from '../components/TransactionModal';
import BudgetManager from '../components/BudgetManager';
import FinancialAdvisor from '../components/FinancialAdvisor';
import BackendModal from '../components/BackendModal';

import { authClient } from '../lib/auth-client';
import { useFinStore } from '../lib/store';
import {
  calculateTotals,
  calculateCategoryBreakdown,
  calculateBudgetAlerts,
  calculate503020,
  calculateHealthScore,
  generateSmartAdvice,
  listMonths,
  formatMonthES,
  detectRecurring,
} from '../lib/financeCalculations';
import OnboardingTour, { useOnboarding } from '../components/OnboardingTour';
import { INITIAL_TRANSACTIONS, INITIAL_BUDGETS } from '../lib/constants';

export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user ?? null;

  // Onboarding state
  const { showTour, completeTour, skipTour } = useOnboarding();

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

  // Sync status indicator for authenticated users
  const syncStatus = user
    ? status === 'ready'
      ? 'synced'
      : status === 'loading'
        ? 'syncing'
        : 'error'
    : null;

  // Demo data for non-authenticated users (static seed, no persistence)
  const [demoTransactions, setDemoTransactions] = useState(INITIAL_TRANSACTIONS);
  const [demoBudgets, setDemoBudgets] = useState(INITIAL_BUDGETS);
  const [migrateDismissed, setMigrateDismissed] = useState(false);
  const [period, setPeriod] = useState(null);

  useEffect(() => {
    if (user?.id) {
      initStore();
    } else if (!isPending) {
      clearStore();
    }
  }, [user?.id, isPending, initStore, clearStore]);

  const handleSaveTransaction = (transaction) => {
    if (!user) {
      setDemoTransactions((prev) => {
        const exists = prev.some((item) => item.id === transaction.id);
        return exists
          ? prev.map((item) => (item.id === transaction.id ? transaction : item))
          : [transaction, ...prev];
      });
    } else {
      useFinStore.getState().addOrUpdateTransaction(transaction).catch(() => {});
    }
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id) => {
    if (!user) {
      setDemoTransactions((prev) => prev.filter((item) => item.id !== id));
    } else {
      useFinStore.getState().deleteTransaction(id).catch(() => {});
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsAddModalOpen(true);
  };

  const handleSaveBudgets = (newBudgets) => {
    if (!user) {
      setDemoBudgets(newBudgets);
    } else {
      useFinStore.getState().setBudgets(newBudgets).catch(() => {});
    }
  };

  // Demo-only: resets to static seed (no persistence layer)
  const handleResetData = () => {
    if (!confirm('¿Restablecer los datos de demostración?')) return;
    setDemoTransactions(INITIAL_TRANSACTIONS);
    setDemoBudgets(INITIAL_BUDGETS);
  };

  const handleMigrateDemo = async () => {
    setMigrateDismissed(true);
    // Migrate current demo state (static seed, no persistence layer)
    for (const tx of demoTransactions) {
      try {
        await useFinStore.getState().addOrUpdateTransaction(tx);
      } catch {
        break;
      }
    }
    try {
      await useFinStore.getState().setBudgets(demoBudgets);
    } catch {
      // Si falla el guardado, las transacciones ya quedaron.
    }
  };

  // Derived calculations - use demo data when not authenticated
  const allTransactions = user ? transactions : demoTransactions;
  const allBudgets = user ? budgets : demoBudgets;
  const availableMonths = useMemo(() => listMonths(allTransactions), [allTransactions]);

  const activePeriod = period && availableMonths.includes(period) ? period : (availableMonths[0] ?? null);
  const displayTransactions = useMemo(() => {
    if (!activePeriod) return allTransactions;
    return allTransactions.filter((tx) => String(tx?.date ?? '').startsWith(activePeriod));
  }, [allTransactions, activePeriod]);
  const displayBudgets = allBudgets;
  const previousPeriodTotals = useMemo(() => {
    if (!activePeriod || availableMonths.length < 2) return null;
    const idx = availableMonths.indexOf(activePeriod);
    const prevKey = availableMonths[idx + 1];
    if (!prevKey) return null;
    const prevTx = allTransactions.filter((tx) => String(tx?.date ?? '').startsWith(prevKey));
    return { key: prevKey, ...calculateTotals(prevTx) };
  }, [allTransactions, activePeriod, availableMonths]);

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
  const recurring = useMemo(() => detectRecurring(allTransactions), [allTransactions]);
  const expenseDelta = previousPeriodTotals
    ? totals.totalExpense - previousPeriodTotals.totalExpense
    : null;
  const hasCustomDemo = useMemo(() => {
    if (!user || migrateDismissed) return false;
    return (
      demoTransactions.length !== INITIAL_TRANSACTIONS.length ||
      JSON.stringify(demoBudgets) !== JSON.stringify(INITIAL_BUDGETS)
    );
  }, [user, migrateDismissed, demoTransactions, demoBudgets]);

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
        alertsCount={alerts.totalCount}
        syncStatus={syncStatus}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {isDemoMode && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-200 text-sm">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-semibold">Modo demostración editable</p>
                <p className="text-xs text-indigo-200/80 mt-0.5">
                  Puedes añadir, editar y borrar con datos de ejemplo. Se guardan en este navegador.
                </p>
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
              <span>Guardar en mi cuenta</span>
            </button>
          </div>
        )}

        {user && hasCustomDemo && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 text-sm">
            <div className="flex items-center gap-3">
              <Upload className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-semibold">Tienes cambios del demo en este navegador</p>
                <p className="text-xs text-emerald-200/80 mt-0.5">
                  Impórtalos a tu cuenta o descártalos para quedarte con los datos de la nube.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setMigrateDismissed(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-emerald-200 hover:bg-emerald-500/15 transition-colors"
              >
                Descartar
              </button>
              <button
                type="button"
                onClick={handleMigrateDemo}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors"
              >
                Importar demo
              </button>
            </div>
          </div>
        )}

        {/* Period toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-300 shrink-0">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                {activePeriod ? formatMonthES(activePeriod) : 'Sin movimientos'}
              </p>
              <p className="text-xs text-slate-400">
                {previousPeriodTotals && expenseDelta !== null ? (
                  <>
                    vs {formatMonthES(previousPeriodTotals.key)}:{' '}
                    <span className={expenseDelta <= 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                      {expenseDelta <= 0 ? '−' : '+'}${Math.abs(Math.round(expenseDelta)).toLocaleString('es-MX')} en gastos
                    </span>
                  </>
                ) : (
                  'Presupuestos y alertas calculados sobre este mes'
                )}
              </p>
            </div>
          </div>
          {availableMonths.length > 1 && (
            <label className="flex items-center gap-2 text-xs text-slate-300">
              <span className="text-slate-400">Periodo</span>
              <select
                value={activePeriod ?? ''}
                onChange={(e) => setPeriod(e.target.value)}
                aria-label="Seleccionar mes"
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                {availableMonths.map((m) => (
                  <option key={m} value={m}>
                    {formatMonthES(m)}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        {syncError && (
          <div className="flex items-start gap-3 p-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-200 text-sm">
            <CloudOff className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">No se pudo sincronizar tus datos</p>
              <p className="text-xs text-rose-200/80 mt-0.5">{syncError}</p>
            </div>
          </div>
        )}

        {isLoadingData ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
            <p className="text-sm font-medium">Cargando tus finanzas...</p>
          </div>
        ) : (
          <>
            {user && allTransactions.length === 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-emerald-500/25 bg-emerald-500/5">
                <div>
                  <p className="text-sm font-bold text-white">Tu cuenta está en cero, como debe ser</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Los datos de prueba solo viven en el demo sin login. Registra tu primer movimiento para ver tus números reales.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingTransaction(null);
                    setIsAddModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shrink-0 transition-colors"
                >
                  Registrar mi primer movimiento
                </button>
              </div>
            )}
            <AlertsBanner
              alerts={alerts}
              onNavigateToBudgets={() => setActiveTab('budgets')}
            />

            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <OverviewCards
                  totals={totals}
                  healthScore={healthScore}
                  periodLabel={activePeriod ? formatMonthES(activePeriod) : null}
                  previousExpense={previousPeriodTotals?.totalExpense ?? null}
                  onOpenAdvisor={() => setActiveTab('advisor')}
                />

                <CategoryBreakdown
                  categoryBreakdown={categoryBreakdown}
                  totalExpense={totals.totalExpense}
                  onNavigateToBudgets={() => setActiveTab('budgets')}
                />

                {recurring.length > 0 && (
                  <div className="glass-panel rounded-2xl p-5 border border-white/10">
                    <h4 className="text-sm font-bold text-white">Posibles gastos recurrentes</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Detectados por repetirse en varios meses. Revísalos antes de renovar.
                    </p>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {recurring.map((r) => (
                        <div key={r.name} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                          <p className="text-sm font-semibold text-white truncate">{r.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            ~${r.avgAmount.toLocaleString('es-MX')} · {r.months} {r.months === 1 ? 'mes' : 'meses'} · {r.category}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
                      <span>Explorar Asesor de Ahorro</span>
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
                    isDemoMode={false}
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
                  isDemoMode={false}
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
                  isDemoMode={false}
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
              <span>Mis datos y exportación</span>
            </button>

            {isDemoMode && (
              <>
                <span>•</span>
                <button
                  type="button"
                  onClick={handleResetData}
                  className="hover:text-rose-400 flex items-center gap-1 transition-colors"
                  title="Restaurar datos de demostración"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restablecer demo</span>
                </button>
              </>
            )}
          </div>
        </div>
      </footer>

      <TransactionModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
        editingTransaction={editingTransaction}
      />

      <BackendModal
        isOpen={isBackendModalOpen}
        onClose={() => setIsBackendModalOpen(false)}
        transactions={displayTransactions}
        budgets={displayBudgets}
      />

      {showTour && (
        <OnboardingTour
          onComplete={completeTour}
          onSkip={skipTour}
        />
      )}
    </div>
  );
}
