'use client';

import React, { useState, useMemo } from 'react';
import { INVESTMENT_STRATEGIES } from '../lib/constants';
import { calculateCompoundInterest } from '../lib/financeCalculations';
import {
  Sparkles,
  TrendingUp,
  PiggyBank,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  DollarSign,
  Calendar,
  Percent,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export default function FinancialAdvisor({
  rule503020,
  smartAdvice = [],
  totals,
  categoryBreakdown,
}) {
  // Compound Interest Simulator state
  const [initialCapital, setInitialCapital] = useState(1000);
  const [monthlyContribution, setMonthlyContribution] = useState(250);
  const [annualRate, setAnnualRate] = useState(10);
  const [years, setYears] = useState(10);

  // Calculate compound growth
  const compoundResult = useMemo(() => {
    return calculateCompoundInterest(initialCapital, monthlyContribution, annualRate, years);
  }, [initialCapital, monthlyContribution, annualRate, years]);

  const presetRates = [
    { label: 'Cuentas / CETES (8%)', rate: 8 },
    { label: 'S&P 500 / ETFs (10%)', rate: 10 },
    { label: 'Crecimiento Alto (12%)', rate: 12 },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Header & Financial Health Diagnosis */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/10 relative overflow-hidden bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-slate-900/90">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-indigo-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
            <Sparkles className="w-5 h-5 text-slate-950 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white tracking-tight">Asesor Financiero Inteligente</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                IA Engine
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Diagnóstico de tu estructura de gasto, recomendaciones de optimización y proyecciones de inversión.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Regla 50/30/20 Section */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
          <div>
            <h4 className="text-base font-bold text-white">Estructura de Gastos: Regla 50 / 30 / 20</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              El estándar de oro para finanzas equilibradas y sostenibles en el tiempo.
            </p>
          </div>
          <span className="text-xs text-indigo-400 font-semibold">
            Ingreso base considerado: ${totals.totalIncome.toLocaleString()}
          </span>
        </div>

        {/* 3 Pillars Visual comparison */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 50% Necesidades */}
          <div className={`p-4 rounded-xl border transition-all ${
            rule503020.needs.status === 'healthy'
              ? 'bg-slate-900/70 border-emerald-500/30'
              : 'bg-slate-900/70 border-amber-500/30'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">50% NECESIDADES</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                rule503020.needs.status === 'healthy'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/20 text-amber-400'
              }`}>
                {rule503020.needs.currentPct}% actual
              </span>
            </div>
            <p className="text-xl font-black text-white mt-2">
              ${rule503020.needs.spent.toLocaleString()}
            </p>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Límite sugerido (50%): ${rule503020.needs.targetAmount.toLocaleString()}
            </span>

            <div className="mt-3 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  rule503020.needs.currentPct <= 50 ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
                style={{ width: `${Math.min(100, rule503020.needs.currentPct * 2)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Vivienda, despensa, transporte, luz, agua, seguros y salud.
            </p>
          </div>

          {/* 30% Deseos */}
          <div className={`p-4 rounded-xl border transition-all ${
            rule503020.wants.status === 'healthy'
              ? 'bg-slate-900/70 border-emerald-500/30'
              : 'bg-slate-900/70 border-rose-500/30'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">30% DESEOS & ESTILO</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                rule503020.wants.status === 'healthy'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-rose-500/20 text-rose-400'
              }`}>
                {rule503020.wants.currentPct}% actual
              </span>
            </div>
            <p className="text-xl font-black text-white mt-2">
              ${rule503020.wants.spent.toLocaleString()}
            </p>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Tope sugerido (30%): ${rule503020.wants.targetAmount.toLocaleString()}
            </span>

            <div className="mt-3 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  rule503020.wants.currentPct <= 30 ? 'bg-indigo-400' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, (rule503020.wants.currentPct / 30) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Salidas a restaurantes, ocio, viajes, compras personales y hobbies.
            </p>
          </div>

          {/* 20% Ahorro e Inversión */}
          <div className={`p-4 rounded-xl border transition-all ${
            rule503020.savings.status === 'healthy'
              ? 'bg-slate-900/70 border-emerald-500/30'
              : 'bg-slate-900/70 border-amber-500/30'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">20% AHORRO E INVERSIÓN</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                rule503020.savings.status === 'healthy'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/20 text-amber-400'
              }`}>
                {rule503020.savings.currentPct}% actual
              </span>
            </div>
            <p className="text-xl font-black text-emerald-400 mt-2">
              ${rule503020.savings.spent.toLocaleString()}
            </p>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Meta mínima (20%): ${rule503020.savings.targetAmount.toLocaleString()}
            </span>

            <div className="mt-3 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  rule503020.savings.currentPct >= 20 ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
                style={{ width: `${Math.min(100, (rule503020.savings.currentPct / 20) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Fondo de emergencia, aportaciones a CETES, ETFs indexados y retiro.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Dynamic Savings Recommendations Cards */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h4 className="text-base font-bold text-white">Recomendaciones Clave de Optimización</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {smartAdvice.map((advice, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  advice.color === 'rose'
                    ? 'bg-rose-500/20 text-rose-400'
                    : advice.color === 'emerald'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : advice.color === 'amber'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-indigo-500/20 text-indigo-400'
                }`}>
                  {advice.color === 'rose' ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : advice.color === 'emerald' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <Lightbulb className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {advice.tag}
                    </span>
                  </div>
                  <h5 className="text-sm font-bold text-white mt-1">{advice.title}</h5>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {advice.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Interactive Compound Interest Simulator */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h4 className="text-base font-bold text-white">
                Simulador de Inversión & Interés Compuesto
              </h4>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Calcula cómo crece tu dinero al reinvertir rendimientos de forma constante.
            </p>
          </div>

          {/* Quick rate presets */}
          <div className="flex flex-wrap gap-1.5">
            {presetRates.map(p => (
              <button
                key={p.rate}
                onClick={() => setAnnualRate(p.rate)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  annualRate === p.rate
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Initial Capital */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <label className="text-xs font-medium text-slate-400 block mb-1">
              Aporte Inicial
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">$</span>
              <input
                type="number"
                min="0"
                step="100"
                value={initialCapital}
                onChange={(e) => setInitialCapital(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-bold text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Monthly Contribution */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <label className="text-xs font-medium text-slate-400 block mb-1">
              Aporte Mensual Recurrente
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">$</span>
              <input
                type="number"
                min="0"
                step="50"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-bold text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Annual Return Rate */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <label className="text-xs font-medium text-slate-400 block mb-1">
              Rendimiento Anual Estimado
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="30"
                step="0.5"
                value={annualRate}
                onChange={(e) => setAnnualRate(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-full pl-3 pr-8 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-bold text-sm focus:outline-none focus:border-indigo-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">%</span>
            </div>
          </div>

          {/* Investment Horizon (Years) */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <label className="text-xs font-medium text-slate-400 block mb-1">
              Horizonte de Años: <span className="text-indigo-400 font-bold">{years} años</span>
            </label>
            <input
              type="range"
              min="1"
              max="30"
              value={years}
              onChange={(e) => setYears(parseInt(e.target.value))}
              className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer mt-2"
            />
          </div>
        </div>

        {/* Compound Simulation Results */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-400">Total Invertido de tu Bolsillo</span>
            <p className="text-xl font-bold text-slate-200 mt-1">
              ${compoundResult.totalInvested.toLocaleString()}
            </p>
            <span className="text-[11px] text-slate-400">Aportes directos</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/20">
            <span className="text-xs text-emerald-400">Ganancia por Interés Compuesto</span>
            <p className="text-xl font-bold text-emerald-400 mt-1">
              +${compoundResult.totalInterest.toLocaleString()}
            </p>
            <span className="text-[11px] text-emerald-500/80">Rendimientos multiplicados</span>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-tr from-indigo-950 to-slate-900 border border-indigo-500/40">
            <span className="text-xs text-indigo-300 font-semibold">Patrimonio Final Estimado</span>
            <p className="text-2xl font-black text-white mt-1">
              ${compoundResult.finalBalance.toLocaleString()}
            </p>
            <span className="text-[11px] text-indigo-300">
              En {years} años al {annualRate}% anual
            </span>
          </div>
        </div>

        {/* Visual Progress Bar Chart */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <h5 className="text-xs font-semibold text-slate-400 mb-2">
            Progresión de Crecimiento en el Tiempo
          </h5>
          <div className="h-6 w-full bg-slate-950 rounded-xl overflow-hidden flex border border-slate-800">
            <div
              className="bg-indigo-600 transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-white"
              style={{
                width: `${(compoundResult.totalInvested / compoundResult.finalBalance) * 100}%`,
              }}
              title={`Aportado: $${compoundResult.totalInvested.toLocaleString()}`}
            >
              Capital ({Math.round((compoundResult.totalInvested / compoundResult.finalBalance) * 100)}%)
            </div>
            <div
              className="bg-emerald-500 transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-slate-950"
              style={{
                width: `${(compoundResult.totalInterest / compoundResult.finalBalance) * 100}%`,
              }}
              title={`Intereses: $${compoundResult.totalInterest.toLocaleString()}`}
            >
              Interés Compuesto ({Math.round((compoundResult.totalInterest / compoundResult.finalBalance) * 100)}%)
            </div>
          </div>
        </div>
      </div>

      {/* 5. Investment Guide: Where to Invest */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/10">
        <h4 className="text-base font-bold text-white mb-1">
          Guía de Instrumentos de Inversión Recomendados
        </h4>
        <p className="text-xs text-slate-400 mb-5">
          Opciones reales según tu horizonte temporal y tolerancia al riesgo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INVESTMENT_STRATEGIES.map((strategy) => (
            <div
              key={strategy.id}
              className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h5 className="text-sm font-bold text-white">{strategy.name}</h5>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    strategy.riskColor === 'emerald'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : strategy.riskColor === 'indigo'
                      ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                      : strategy.riskColor === 'amber'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                  }`}>
                    Riesgo {strategy.risk}
                  </span>
                </div>

                <p className="text-xs font-semibold text-emerald-400 mt-1">
                  Rendimiento estimado: {strategy.expectedReturn}
                </p>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {strategy.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                  Vehículos populares:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {strategy.instruments.map((inst, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-200"
                    >
                      {inst}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
