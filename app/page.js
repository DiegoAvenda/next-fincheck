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
import AmplifyModal from '../components/AmplifyModal';

import { storageService } from '../lib/storage';
import {
  calculateTotals,
  calculateCategoryBreakdown,
  calculateBudgetAlerts,
  calculate503020,
  calculateHealthScore,
  generateSmartAdvice,
} from '../lib/financeCalculations';
import { 
  RotateCcw, 
  Sparkles, 
  Cloud, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isAmplifyModalOpen, setIsAmplifyModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize data on client mount
  useEffect(() => {
    const loadedTx = storageService.getTransactions();
    const loadedBudgets = storageService.getBudgets();
    setTransactions(loadedTx);
    setBudgets(loadedBudgets);
    setIsMounted(true);
  }, []);

  // Save changes to localStorage
  const handleSaveTransaction = (tx) => {
    let updated;
    const exists = transactions.some((item) => item.id === tx.id);
    if (exists) {
      updated = transactions.map((item) => (item.id === tx.id ? tx : item));
    } else {
      updated = [tx, ...transactions];
    }
    setTransactions(updated);
    storageService.saveTransactions(updated);
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    storageService.saveTransactions(updated);
  };

  const handleEditTransaction = (tx) => {
    setEditingTransaction(tx);
    setIsAddModalOpen(true);
  };

  const handleSaveBudgets = (newBudgets) => {
    setBudgets(newBudgets);
    storageService.saveBudgets(newBudgets);
  };

  const handleResetData = () => {
    if (confirm('¿Restablecer datos de prueba iniciales?')) {
      const data = storageService.resetToDefault();
      if (data) {
        setTransactions(data.transactions);
        setBudgets(data.budgets);
      }
    }
  };

  // Perform Calculations
  const totals = useMemo(() => calculateTotals(transactions), [transactions]);
  const categoryBreakdown = useMemo(
    () => calculateCategoryBreakdown(transactions, budgets),
    [transactions, budgets]
  );
  const alerts = useMemo(
    () => calculateBudgetAlerts(categoryBreakdown),
    [categoryBreakdown]
  );
  const rule503020 = useMemo(
    () => calculate503020(categoryBreakdown, totals.totalIncome, totals.netBalance),
    [categoryBreakdown, totals.totalIncome, totals.netBalance]
  );
  const healthScore = useMemo(
    () => calculateHealthScore(totals, categoryBreakdown, alerts),
    [totals, categoryBreakdown, alerts]
  );
  const smartAdvice = useMemo(
    () => generateSmartAdvice(totals, categoryBreakdown, rule503020, alerts),
    [totals, categoryBreakdown, rule503020, alerts]
  );

  // Avoid hydration mismatch while reading localStorage
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-sm font-medium">Iniciando FinCheck...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => {
          setEditingTransaction(null);
          setIsAddModalOpen(true);
        }}
        onOpenAmplifyModal={() => setIsAmplifyModalOpen(true)}
        onResetData={handleResetData}
        alertsCount={alerts.totalCount}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Dynamic Budget Breach Alerts Banner */}
        <AlertsBanner
          alerts={alerts}
          onNavigateToBudgets={() => setActiveTab('budgets')}
        />

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* KPI Metric Cards */}
            <OverviewCards
              totals={totals}
              healthScore={healthScore}
              onOpenAdvisor={() => setActiveTab('advisor')}
            />

            {/* Category Breakdown & Donut Chart */}
            <CategoryBreakdown
              categoryBreakdown={categoryBreakdown}
              totalExpense={totals.totalExpense}
              onNavigateToBudgets={() => setActiveTab('budgets')}
            />

            {/* Quick Teaser for AI Recommendations */}
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
                  onClick={() => setActiveTab('advisor')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shrink-0 self-start sm:self-auto transition-colors"
                >
                  <span>Explorar Asesor & Inversión</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Recent Transactions Snapshot */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Movimientos Recientes</h3>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <span>Ver todas las transacciones</span>
                  <span>→</span>
                </button>
              </div>

              <TransactionsTable
                transactions={transactions.slice(0, 5)}
                onOpenAddModal={() => {
                  setEditingTransaction(null);
                  setIsAddModalOpen(true);
                }}
                onEditTransaction={handleEditTransaction}
                onDeleteTransaction={handleDeleteTransaction}
              />
            </div>
          </div>
        )}

        {/* TAB 2: TRANSACTIONS RECORD */}
        {activeTab === 'transactions' && (
          <div className="animate-in fade-in duration-300">
            <TransactionsTable
              transactions={transactions}
              onOpenAddModal={() => {
                setEditingTransaction(null);
                setIsAddModalOpen(true);
              }}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </div>
        )}

        {/* TAB 3: BUDGETS & ALERTS */}
        {activeTab === 'budgets' && (
          <div className="animate-in fade-in duration-300">
            <BudgetManager
              budgets={budgets}
              onSaveBudgets={handleSaveBudgets}
              categoryBreakdown={categoryBreakdown}
              totals={totals}
              onOpenAddModal={() => {
                setEditingTransaction(null);
                setIsAddModalOpen(true);
              }}
            />
          </div>
        )}

        {/* TAB 4: ADVISOR & INVESTMENTS */}
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
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-12 bg-slate-950/60 backdrop-blur-sm text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">FinCheck</span>
            <span>•</span>
            <span>Plataforma Inteligente de Finanzas Personales</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAmplifyModalOpen(true)}
              className="hover:text-amber-400 flex items-center gap-1 transition-colors"
            >
              <Cloud className="w-3.5 h-3.5 text-amber-400" />
              <span>Configuración AWS Amplify</span>
            </button>

            <span>•</span>

            <button
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

      {/* Add / Edit Transaction Modal */}
      <TransactionModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
        editingTransaction={editingTransaction}
      />

      {/* AWS Amplify Integration Modal */}
      <AmplifyModal
        isOpen={isAmplifyModalOpen}
        onClose={() => setIsAmplifyModalOpen(false)}
      />
    </div>
  );
}
