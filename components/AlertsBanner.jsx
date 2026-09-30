'use client';

import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, X, ChevronRight, ShieldAlert } from 'lucide-react';

export default function AlertsBanner({ alerts, onNavigateToBudgets }) {
  const [dismissed, setDismissed] = useState(false);

  if (alerts.totalCount === 0 || dismissed) {
    return null;
  }

  const criticalCount = alerts.critical.length;
  const warningCount = alerts.warnings.length;

  return (
    <div className="w-full transition-all duration-300">
      <div className="relative overflow-hidden rounded-2xl border border-rose-500/30 bg-gradient-to-r from-rose-950/60 via-slate-900/80 to-amber-950/40 p-4 sm:p-5 backdrop-blur-md shadow-xl shadow-rose-950/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Icon & Title */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0 text-rose-400 mt-0.5 sm:mt-0">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-sm font-bold text-white">
                  {criticalCount > 0
                    ? `¡Atención! Tienes ${criticalCount} ${criticalCount === 1 ? 'categoría que sobrepasó' : 'categorías que sobrepasaron'} el presupuesto`
                    : `Alerta Preventiva: Tienes ${warningCount} ${warningCount === 1 ? 'categoría cerca del límite' : 'categorías cerca del límite'}`}
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {criticalCount > 0 ? 'Límite Excedido' : 'Riesgo Moderado'}
                </span>
              </div>

              {/* Specific Details */}
              <div className="mt-1.5 flex flex-wrap gap-2 text-xs text-slate-300">
                {alerts.critical.map((c) => (
                  <span
                    key={c.id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <strong>{c.category}:</strong> Gastaste ${c.spent.toLocaleString()} / ${c.budget.toLocaleString()} (+${c.overAmount.toLocaleString()} excedido)
                  </span>
                ))}

                {alerts.warnings.map((w) => (
                  <span
                    key={w.id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    <strong>{w.category}:</strong> Al {w.percentage}% (${w.spent.toLocaleString()} / ${w.budget.toLocaleString()})
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              onClick={onNavigateToBudgets}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-950 hover:bg-slate-200 transition-colors shadow-sm"
            >
              <span>Ajustar Presupuesto</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setDismissed(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Ocultar alerta"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
