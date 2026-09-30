'use client';

import React, { useState } from 'react';
import CategoryIcon from './CategoryIcon';
import { EXPENSE_CATEGORIES } from '../lib/constants';
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
  onOpenAddModal
}) {
  const [localBudgets, setLocalBudgets] = useState({ ...budgets });
  const [hasChanges, setHasChanges] = useState(false);
  const [emergencyMonthsTarget, setEmergencyMonthsTarget] = useState(3);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleBudgetChange = (catId, value) => {
    const num = Math.max(0, parseFloat(value) || 0);
    setLocalBudgets(prev => ({
      ...prev,
      [catId]: num
    }));
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const handleSave = () => {
    onSaveBudgets(localBudgets);
    setHasChanges(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetDefaults = () => {
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

  return (
    <div className="space-y-6">
      {/* Top Banner: Global Budget Summary */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-white tracking-tight">
                Gestor de Presupuestos Mensuales
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Establece topes de gasto por categoría para recibir alertas preventivas automáticas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {hasChanges && (
              <button
                onClick={handleResetDefaults}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer</span>
              </button>
            )}

            <button
              onClick={handleSave}
              disabled={!hasChanges && !saveSuccess}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                saveSuccess
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                  : hasChanges
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>¡Presupuesto Guardado!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Guardar Presupuesto</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Totals Metric Bar */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-slate-400">Presupuesto Asignado Total</span>
            <p className="text-xl font-black text-white mt-1">
              ${totalBudgetLimit.toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </p>
            <span className="text-[11px] text-slate-400">Suma de todas las categorías</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-slate-400">Gastos Reales del Mes</span>
            <p className="text-xl font-black text-rose-400 mt-1">
              ${totals.totalExpense.toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </p>
            <span className="text-[11px] text-slate-400">
              {Math.round((totals.totalExpense / (totalBudgetLimit || 1)) * 100)}% del presupuesto global
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-slate-400">Margen Restante Estimado</span>
            <p className={`text-xl font-black mt-1 ${
              totalBudgetLimit - totals.totalExpense >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              ${Math.max(0, totalBudgetLimit - totals.totalExpense).toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </p>
            <span className="text-[11px] text-slate-400">
              {totalBudgetLimit >= totals.totalExpense ? 'Dentro del margen' : 'Presupuesto general rebasado'}
            </span>
          </div>
        </div>
      </div>

      {/* Emergency Fund Calculator */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/10 bg-gradient-to-br from-slate-900/90 to-indigo-950/30">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Calculadora de Fondo de Emergencia</h4>
              <p className="text-xs text-slate-400">
                Tu red de seguridad líquida recomendada para imprevistos médicos, laborales o mecánicos.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400">Meta recomendada</span>
            <p className="text-lg font-black text-emerald-400">${emergencyFundTarget.toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          <div className="sm:col-span-8">
            <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
              <span>Meses de cobertura deseados:</span>
              <span className="font-bold text-indigo-400">{emergencyMonthsTarget} meses</span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              step="1"
              value={emergencyMonthsTarget}
              onChange={(e) => setEmergencyMonthsTarget(parseInt(e.target.value))}
              aria-label="Meses de cobertura de emergencia deseados"
              className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>1 mes (mínimo)</span>
              <span>3 meses (básico)</span>
              <span>6 meses (óptimo)</span>
              <span>12 meses (máximo)</span>
            </div>
          </div>

          <div className="sm:col-span-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400">Cálculo de Reserva</span>
            <p className="text-xs font-semibold text-slate-200 mt-0.5">
              Gasto mensual base: <strong>${Math.round(monthlyBurn).toLocaleString()}</strong>
            </p>
            <span className="text-[10px] text-indigo-300 block mt-1">
              {emergencyMonthsTarget} meses × gasto mensual = ${emergencyFundTarget.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Categories Budget Grid */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/10">
        <h4 className="text-base font-bold text-white mb-4">
          Límites por Categoría de Gasto
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
                      <h5 className="text-sm font-semibold text-white">{cat.label}</h5>
                      <span className="text-xs text-slate-400">
                        Gastado actual: ${currentSpent.toLocaleString()}
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
                        className="w-24 px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-right text-sm font-bold text-white focus:outline-none focus:border-indigo-500"
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
                      ? `Excedido por $${(currentSpent - currentLimit).toLocaleString()}`
                      : `Restan $${Math.max(0, currentLimit - currentSpent).toLocaleString()}`}
                  </span>
                  <span className={isExceeded ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                    {pct}% del tope
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
