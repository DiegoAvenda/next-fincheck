'use client';

import React from 'react';
import { Plus, TrendingUp, Layers, Receipt, PieChart, Sparkles, HardDrive, LogIn, CloudCheck, RefreshCw, CloudOff } from 'lucide-react';

import UserMenu from './UserMenu';
import { authClient, signIn } from '../lib/auth-client';

export default function Navbar({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenBackendModal,
  user,
  isDemoMode = false,
  period,
  setPeriod,
  alertsCount = 0,
  syncStatus = 'synced', // 'synced' | 'syncing' | 'error'
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-white/20">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white">FinCheck</span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Control de Finanzas Personales</p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <PieChart className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              data-tour="nav-transactions"
              onClick={() => setActiveTab('transactions')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'transactions'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>Transacciones</span>
            </button>

            <button
              data-tour="nav-budgets"
              onClick={() => setActiveTab('budgets')}
              className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'budgets'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Presupuestos</span>
              {alertsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 ring-4 ring-rose-500/20 animate-pulse"></span>
              )}
            </button>

            <button
              data-tour="nav-advisor"
              onClick={() => setActiveTab('advisor')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'advisor'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Asesor</span>
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sync Status */}
            {user && (
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700 text-xs text-slate-300">
                {syncStatus === 'synced' ? (
                  <>
                    <CloudCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sync</span>
                  </>
                ) : syncStatus === 'syncing' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                    <span>Sync...</span>
                  </>
                ) : (
                  <>
                    <CloudOff className="w-3.5 h-3.5 text-rose-400" />
                    <span>Offline</span>
                  </>
                )}
              </div>
            )}

            {/* Mis datos pill */}
            <button
              type="button"
              onClick={onOpenBackendModal}
              title="Ver y exportar mis datos"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
            >
              <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mis datos</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>

            {isDemoMode ? (
              <button
                type="button"
                onClick={() => {
                  signIn.social({ provider: 'google', callbackURL: '/' });
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/25 transition-all active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Iniciar Sesión</span>
              </button>
            ) : (
              <>
                <UserMenu user={user} onOpenBackendModal={onOpenBackendModal} />

                {/* Quick Add Button */}
                <button
                  type="button"
                  data-tour="add-transaction"
                  onClick={onOpenAddModal}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/25 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span className="hidden sm:inline">Nuevo Registro</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800/60 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md font-medium ${
              activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Resumen</span>
          </button>
          <button
            data-tour="nav-transactions"
            onClick={() => setActiveTab('transactions')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md font-medium ${
              activeTab === 'transactions' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Gastos/Ingresos</span>
          </button>
          <button
            data-tour="nav-budgets"
            onClick={() => setActiveTab('budgets')}
            className={`relative flex items-center gap-1 px-3 py-1 rounded-md font-medium ${
              activeTab === 'budgets' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Presupuestos</span>
            {alertsCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>}
          </button>
          <button
            data-tour="nav-advisor"
            onClick={() => setActiveTab('advisor')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md font-medium ${
              activeTab === 'advisor' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Asesor</span>
          </button>
        </div>
      </div>
    </header>
  );
}
