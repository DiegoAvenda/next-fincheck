'use client';

import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  PiggyBank, 
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function OverviewCards({ totals, healthScore, onOpenAdvisor }) {
  const isPositiveBalance = totals.netBalance >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Total Net Balance */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Balance Neto</span>
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-indigo-400" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            ${totals.netBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            <span
              className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                isPositiveBalance
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              }`}
            >
              {isPositiveBalance ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {isPositiveBalance ? 'Superávit' : 'Déficit'}
            </span>
            <span className="text-xs text-slate-400">este mes</span>
          </div>
        </div>
        {/* Subtle accent glow */}
        <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-indigo-600/10 blur-xl pointer-events-none" />
      </div>

      {/* 2. Total Incomes */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Ingresos Totales</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-400">
            +${totals.totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="mt-2 text-xs text-slate-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
            Total acumulado
          </p>
        </div>
        <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-emerald-600/10 blur-xl pointer-events-none" />
      </div>

      {/* 3. Total Expenses */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Gastos Totales</span>
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4 text-rose-400" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-rose-400">
            -${totals.totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="mt-2 text-xs text-slate-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block"></span>
            Salidas del periodo
          </p>
        </div>
        <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-rose-600/10 blur-xl pointer-events-none" />
      </div>

      {/* 4. Savings Rate */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Tasa de Ahorro</span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <PiggyBank className="w-4 h-4 text-amber-400" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-1">
            <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {totals.savingsRate}%
            </p>
            <span className="text-xs text-slate-400">del ingreso</span>
          </div>

          <div className="mt-2.5 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                totals.savingsRate >= 20 ? 'bg-emerald-400' : totals.savingsRate >= 10 ? 'bg-amber-400' : 'bg-rose-400'
              }`}
              style={{ width: `${Math.min(100, totals.savingsRate)}%` }}
            />
          </div>
          <span className="mt-1 text-[11px] text-slate-400 block">
            {totals.savingsRate >= 20 ? 'Meta saludable cumplida (≥20%)' : 'Sugerido: subir al 20%'}
          </span>
        </div>
        <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-amber-600/10 blur-xl pointer-events-none" />
      </div>

      {/* 5. Financial Health Score */}
      <div 
        onClick={onOpenAdvisor}
        role="button"
        tabIndex={0}
        title="Ver diagnóstico financiero completo"
        className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Salud Financiera</span>
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-1.5">
            <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {healthScore.score}
            </p>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${healthScore.badgeColor}`}>
              {healthScore.score >= 75 ? (
                <CheckCircle2 className="w-3 h-3 mr-1" />
              ) : (
                <AlertCircle className="w-3 h-3 mr-1" />
              )}
              {healthScore.label}
            </span>
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-cyan-600/10 blur-xl pointer-events-none" />
      </div>
    </div>
  );
}
