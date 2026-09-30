'use client';

import React, { useState } from 'react';
import CategoryIcon from './CategoryIcon';
import { AlertTriangle, CheckCircle, PieChart, Sparkles } from 'lucide-react';

export default function CategoryBreakdown({ categoryBreakdown = [], totalExpense = 0, onNavigateToBudgets }) {
  const [activeCategory, setActiveCategory] = useState(null);

  // Filter only categories with spending for the chart
  const activeSpendings = categoryBreakdown.filter((cat) => cat.spent > 0);

  // Compute SVG Donut Chart Slices
  const radius = 70;
  const strokeWidth = 26;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  const slices = activeSpendings.map((cat) => {
    const fraction = totalExpense > 0 ? cat.spent / totalExpense : 0;
    const strokeDasharray = `${fraction * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedOffset;
    accumulatedOffset += fraction * circumference;

    return {
      ...cat,
      fraction,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const selectedOrTop = activeCategory
    ? categoryBreakdown.find((c) => c.id === activeCategory)
    : activeSpendings[0] || null;

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white tracking-tight">Gastos por Categoría</h3>
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {activeSpendings.length} activas
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Distribución y seguimiento de presupuesto mensual</p>
        </div>

        <button
          onClick={onNavigateToBudgets}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 self-start sm:self-auto"
        >
          <span>Configurar límites</span>
          <span>→</span>
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Interactive SVG Donut Chart */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-56 h-56 flex items-center justify-center">
            {totalExpense === 0 ? (
              <div className="w-48 h-48 rounded-full border-4 border-dashed border-slate-800 flex flex-col items-center justify-center text-center p-4">
                <PieChart className="w-8 h-8 text-slate-600 mb-1" />
                <span className="text-xs text-slate-500">Sin gastos en el periodo</span>
              </div>
            ) : (
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  className="stroke-slate-800/60"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                {slices.map((slice) => {
                  const isHovered = activeCategory === slice.id;
                  return (
                    <circle
                      key={slice.id}
                      cx="100"
                      cy="100"
                      r={radius}
                      stroke={slice.color}
                      strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                      strokeDasharray={slice.strokeDasharray}
                      strokeDashoffset={slice.strokeDashoffset}
                      fill="transparent"
                      className="transition-all duration-300 cursor-pointer"
                      style={{
                        filter: isHovered ? `drop-shadow(0 0 8px ${slice.color}88)` : 'none',
                        opacity: activeCategory && !isHovered ? 0.4 : 1,
                      }}
                      onMouseEnter={() => setActiveCategory(slice.id)}
                      onMouseLeave={() => setActiveCategory(null)}
                    />
                  );
                })}
              </svg>
            )}

            {/* Inner Center Info */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
              <span className="text-[11px] font-medium text-slate-400">
                {selectedOrTop && activeCategory ? selectedOrTop.label : 'Gasto Total'}
              </span>
              <p className="text-xl sm:text-2xl font-black text-white mt-0.5">
                ${(selectedOrTop && activeCategory ? selectedOrTop.spent : totalExpense).toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </p>
              {selectedOrTop && activeCategory && (
                <span className="text-[11px] font-bold text-indigo-400 mt-0.5">
                  {selectedOrTop.percentageOfTotal}% del total
                </span>
              )}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-2 text-center">
            Pasa el cursor sobre el gráfico para inspeccionar cada categoría
          </p>
        </div>

        {/* Category Budget Bars List */}
        <div className="lg:col-span-7 space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
          {categoryBreakdown.map((cat) => {
            const hasSpending = cat.spent > 0;
            const isHovered = activeCategory === cat.id;

            return (
              <div
                key={cat.id}
                onMouseEnter={() => setActiveCategory(cat.id)}
                onMouseLeave={() => setActiveCategory(null)}
                className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isHovered
                    ? 'bg-slate-800/80 border-slate-600 shadow-md'
                    : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
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

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white truncate">{cat.label}</span>
                        {cat.isOverBudget && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            Excedido
                          </span>
                        )}
                        {cat.isNearBudget && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            80%+
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">
                        {cat.percentageOfTotal}% del gasto total • {cat.count} {cat.count === 1 ? 'registro' : 'registros'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-white">
                      ${cat.spent.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 block">
                      de ${cat.budget.toLocaleString()} límit.
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-2.5 w-full bg-slate-800/90 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      cat.isOverBudget
                        ? 'bg-rose-500'
                        : cat.isNearBudget
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                    style={{
                      width: `${Math.min(100, cat.percentageOfBudget)}%`,
                    }}
                  />
                </div>

                <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                  <span>
                    {cat.isOverBudget
                      ? `+$${cat.overAmount.toLocaleString()} sobre el límite`
                      : `Disponible: $${cat.remaining.toLocaleString()}`}
                  </span>
                  <span className={cat.isOverBudget ? 'font-bold text-rose-400' : 'text-slate-400'}>
                    {cat.percentageOfBudget}% usado
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
