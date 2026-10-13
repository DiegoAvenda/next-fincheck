'use client';

import React, { useState, useEffect } from 'react';
import CategoryIcon from './CategoryIcon';
import { EXPENSE_CATEGORIES } from '../lib/constants';
import { useI18n } from '../lib/useI18n';
import { getCategoryLabel, numberLocale } from '../lib/i18n';
import { 
  ShieldCheck, 
  Layers, 
  AlertTriangle, 
  Check, 
  RotateCcw, 
  Save, 
  HelpCircle,
  TrendingDown
} from 'lucide-react';

export default function BudgetManager({
  budgets,
  onSaveBudgets,
  categoryBreakdown,
  totals,
  onOpenAddModal,
  isDemoMode = false
}) {
  const { t, locale } = useI18n();
  const numLocale = numberLocale(locale);
  const [localBudgets, setLocalBudgets] = useState({ ...budgets });
  const [hasChanges, setHasChanges] = useState(false);
  const [emergencyMonthsTarget, setEmergencyMonthsTarget] = useState(3);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savingsGoalPct, setSavingsGoalPct] = useState(20);

  // Sync local budgets when parent budgets change (and not in demo mode)
  useEffect(() => {
    if (!isDemoMode) {
      /* eslint-disable react-hooks/set-state-in-effect -- intentional prop-to-form sync */
      setLocalBudgets({ ...budgets });
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [budgets, isDemoMode]);

  const handleBudgetChange = (catId, value) => {
    const num = Math.max(0, parseFloat(value) || 0);
    setLocalBudgets(prev => ({
      ...prev,
      [catId]: num
    }));
    if (!isDemoMode) {
      setHasChanges(true);
      setSaveSuccess(false);
    }
  };

  const handleSave = () => {
    if (isDemoMode) return;
    onSaveBudgets(localBudgets);
    setHasChanges(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetDefaults = () => {
    if (isDemoMode) return;
    const defaults = {};
    EXPENSE_CATEGORIES.forEach(c => {
      defaults[c.id] = c.defaultBudget;
    });
    setLocalBudgets(defaults);
    setHasChanges(true);
  };

  // Calculations
  const totalBudgetLimit = Object.values(localBudgets).reduce((sum, val) => sum + (Number(val) || 0), 0);
  const monthlyBurn = totals.totalExpense || 1;
  const emergencyFundTarget = Math.round(monthlyBurn * emergencyMonthsTarget);
  const currentSavingsBuffer = Math.max(0, totals.netBalance);
  const currentRunwayMonths = (currentSavingsBuffer / monthlyBurn).toFixed(1);
  const savingsRate = totals.savingsRate ?? 0;
  const goalMet = savingsRate >= savingsGoalPct;
  const goalMonthlyAmount = Math.round((totals.totalIncome || 0) * (savingsGoalPct / 100));

  return (
    <div className="space-y-6">
      {/* Top Banner: Global Budget Summary */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-white tracking-tight">
                {t.budgets.title}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {t.budgets.desc}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isDemoMode && hasChanges && (
              <button
                onClick={handleResetDefaults}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.budgets.reset}</span>
              </button>
            )}

            <button
              onClick={handleSave}
              disabled={isDemoMode || (!hasChanges && !saveSuccess)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                isDemoMode
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : saveSuccess
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                  : hasChanges
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isDemoMode ? (
                <>
                  <HelpCircle className="w-4 h-4" />
                  <span>{t.budgets.demoMode}</span>
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{t.budgets.saved}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{t.budgets.save}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Totals Metric Bar */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-slate-400">{t.budgets.totalAssigned}</span>
            <p className="text-xl font-black text-white mt-1">
              ${totalBudgetLimit.toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </p>
            <span className="text-[11px] text-slate-400">{t.budgets.allCategories}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-slate-400">{t.budgets.realMonthSpend}</span>
            <p className="text-xl font-black text-rose-400 mt-1">
              ${totals.totalExpense.toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </p>
            <span className="text-[11px] text-slate-400">
              {Math.round((totals.totalExpense / (totalBudgetLimit || 1)) * 100)}% {t.budgets.ofGlobal}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-slate-400">{t.budgets.remainingMargin}</span>
            <p className={`text-xl font-black mt-1 ${
              totalBudgetLimit - totals.totalExpense >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              ${Math.max(0, totalBudgetLimit - totals.totalExpense).toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </p>
            <span className="text-[11px] text-slate-400">
              {totalBudgetLimit >= totals.totalExpense ? t.budgets.withinMargin : t.budgets.overGeneral}
            </span>
          </div>
        </div>
      </div>

      {/* Emergency Fund Calculator */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-base font-bold text-white">{t.budgets.goalTitle}</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.budgets.goalDesc}
            </p>
          </div>
          <label className="flex items-center gap-2 text-xs text-slate-300">
            <span className="text-slate-400">{t.budgets.goalLabel}</span>
            <select
              value={savingsGoalPct}
              onChange={(e) => setSavingsGoalPct(Number(e.target.value))}
              aria-label={t.budgets.goalAria}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              {[10, 15, 20, 25, 30, 40, 50].map((v) => (
                <option key={v} value={v}>
                  {v}%
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-4 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${goalMet ? 'bg-emerald-400' : 'bg-amber-400'}`}
            style={{ width: `${Math.min(100, savingsGoalPct > 0 ? (savingsRate / savingsGoalPct) * 100 : 0)}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-300">
          {t.budgets.goalCarry} <strong className="text-white">{savingsRate}%</strong> {t.budgets.goalOf} {savingsGoalPct}% (≈
          ${goalMonthlyAmount.toLocaleString(numLocale)}{t.budgets.goalPerMonth}).{' '}
          {goalMet ? t.budgets.goalMet : `${t.budgets.goalMissingPrefix} $${Math.max(0, goalMonthlyAmount - currentSavingsBuffer).toLocaleString(numLocale)} ${t.budgets.goalMissing}`}
        </p>
      </div>

      {/* Emergency Fund Calculator */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/10 bg-gradient-to-br from-slate-900/90 to-indigo-950/30">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">{t.budgets.emergencyTitle}</h4>
              <p className="text-xs text-slate-400">
                {t.budgets.emergencyDesc}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400">{t.budgets.targetGoal}</span>
            <p className="text-lg font-black text-emerald-400">${emergencyFundTarget.toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          <div className="sm:col-span-8">
            <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
              <span>{t.budgets.coverageMonths}</span>
              <span className="font-bold text-indigo-400">{emergencyMonthsTarget} {t.budgets.monthsWord}</span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              step="1"
              value={emergencyMonthsTarget}
              onChange={(e) => setEmergencyMonthsTarget(parseInt(e.target.value))}
              disabled={isDemoMode}
              aria-label={t.budgets.coverageAria}
              className={`w-full h-2 bg-slate-800 rounded-lg ${
                isDemoMode ? 'cursor-not-allowed opacity-50' : 'accent-indigo-500 cursor-pointer'
              }`}
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>{t.budgets.min1}</span>
              <span>{t.budgets.basic3}</span>
              <span>{t.budgets.optimal6}</span>
              <span>{t.budgets.max12}</span>
            </div>
          </div>

          <div className="sm:col-span-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400">{t.budgets.reserveCalc}</span>
            <p className="text-xs font-semibold text-slate-200 mt-0.5">
              {t.budgets.monthlyBase} <strong>${Math.round(monthlyBurn).toLocaleString()}</strong>
            </p>
            <span className="text-[10px] text-indigo-300 block mt-1">
              {emergencyMonthsTarget} {t.budgets.monthsWord} {t.budgets.monthsTimes} ${emergencyFundTarget.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Categories Budget Grid */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/10">
        <h4 className="text-base font-bold text-white mb-4">
          {t.budgets.limitsTitle}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EXPENSE_CATEGORIES.map((cat) => {
            const currentSpent = categoryBreakdown.find(c => c.id === cat.id)?.spent || 0;
            const currentLimit = localBudgets[cat.id] ?? cat.defaultBudget;
            const pct = currentLimit > 0 ? Math.round((currentSpent / currentLimit) * 100) : 0;
            const isExceeded = currentSpent > currentLimit && currentLimit > 0;
            const isWarning = currentSpent >= currentLimit * 0.8 && !isExceeded && currentLimit > 0;

            return (
              <div
                key={cat.id}
                className="p-4 rounded-xl border border-slate-800/90 bg-slate-900/60 hover:bg-slate-900/90 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: `${cat.color}15`,
                        borderColor: `${cat.color}30`,
                        color: cat.color,
                      }}
                    >
                      <CategoryIcon name={cat.icon} className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-white">{getCategoryLabel(cat.id, t)}</h5>
                      <span className="text-xs text-slate-400">
                        {t.budgets.currentSpent}: ${currentSpent.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <span className="text-xs text-slate-400">$</span>
                      <input
                        type="number"
                        min="0"
                        step="10"
                        value={currentLimit}
                        onChange={(e) => handleBudgetChange(cat.id, e.target.value)}
                        disabled={isDemoMode}
                        className={`w-24 px-2 py-1 rounded-lg bg-slate-950 border text-right text-sm font-bold text-white focus:outline-none focus:border-indigo-500 ${
                          isDemoMode
                            ? 'border-slate-700 text-slate-500 cursor-not-allowed'
                            : 'border-slate-800'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isExceeded
                        ? 'bg-rose-500'
                        : isWarning
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>

                <div className="mt-1.5 flex items-center justify-between text-[11px]">
                  <span className={isExceeded ? 'text-rose-400 font-bold' : isWarning ? 'text-amber-400' : 'text-slate-400'}>
                    {isExceeded
                      ? `${t.budgets.exceededBy} $${(currentSpent - currentLimit).toLocaleString()}`
                      : `${t.budgets.remainingVerb} $${Math.max(0, currentLimit - currentSpent).toLocaleString()}`}
                  </span>
                  <span className={isExceeded ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                    {pct}% {t.budgets.ofTop}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
