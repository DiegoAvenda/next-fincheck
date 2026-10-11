'use client';

import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';

const TOUR_KEY = 'fincheck-tour-v2';

/*
 * Walkthrough guiado tipo spotlight.
 * Cada paso puede anclarse a un elemento real vía `target` ([data-tour="..."]).
 * El tour cambia a la pestaña del paso, recorta un spotlight sobre el elemento
 * y posiciona el tooltip al lado. Sin el elemento: tooltip centrado (fallback).
 */

const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: '¡Bienvenido a FinCheck!',
    description:
      'Tu asistente de finanzas personales en español. Te mostramos un recorrido rápido por cada sección.',
    cta: 'En este tour verás el dashboard, transacciones, presupuestos, asesor y cómo registrar movimientos.',
  },
  {
    id: 'dashboard',
    tab: 'dashboard',
    target: 'overview-cards',
    title: 'Tu Dashboard Financiero',
    description:
      'Estas 5 tarjetas son tu resumen del mes: balance neto, ingresos, gastos, tasa de ahorro y salud financiera (score de 0-100).',
  },
  {
    id: 'transactions',
    tab: 'transactions',
    target: 'nav-transactions',
    title: 'Transacciones',
    description:
      'Aquí viven todos tus movimientos. Puedes buscar, filtrar por tipo o categoría, exportar a CSV y registrar nuevos con el botón verde.',
  },
  {
    id: 'budgets',
    tab: 'budgets',
    target: 'nav-budgets',
    title: 'Gestor de Presupuestos',
    description:
      'Ponle un tope a cada categoría: verde dentro del presupuesto, ámbar cerca del límite (80%) y rojo si te pasas.',
  },
  {
    id: 'advisor',
    tab: 'advisor',
    target: 'nav-advisor',
    title: 'Asesor de Ahorro',
    description:
      'Diagnóstico con la regla 50/30/20, fondo de emergencia sugerido y consejos para detectar fugas. Todo con reglas transparentes, sin IA.',
  },
  {
    id: 'add-transaction',
    tab: 'dashboard',
    target: 'add-transaction',
    title: 'Registrar Movimientos',
    description:
      'Con este botón registras gastos e ingresos. Si escribes "Gasolina" o "Netflix", te sugerimos la categoría automáticamente.',
  },
];

const TOOLTIP_W = 340;
const TOOLTIP_H_EST = 260;
const GAP = 12;

function getSpotRect(target) {
  if (typeof document === 'undefined' || !target) return null;
  const candidates = Array.from(document.querySelectorAll(`[data-tour="${target}"]`));
  const visible = candidates.find((el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  });
  if (!visible) return null;
  const r = visible.getBoundingClientRect();
  const pad = 8;
  return {
    top: Math.max(8, r.top - pad),
    left: Math.max(8, r.left - pad),
    width: r.width + pad * 2,
    height: r.height + pad * 2,
  };
}

function placeTooltip(spot) {
  if (!spot || typeof window === 'undefined') return { centered: true };
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const w = Math.min(TOOLTIP_W, vw - 32);
  if (spot.top + spot.height + GAP + TOOLTIP_H_EST <= vh) {
    return {
      top: spot.top + spot.height + GAP,
      left: Math.max(16, Math.min(spot.left, vw - w - 16)),
      width: w,
    };
  }
  if (spot.top - GAP - TOOLTIP_H_EST >= 8) {
    return {
      top: spot.top - GAP - TOOLTIP_H_EST,
      left: Math.max(16, Math.min(spot.left, vw - w - 16)),
      width: w,
    };
  }
  if (spot.left + spot.width + GAP + w <= vw) {
    return {
      top: Math.max(16, Math.min(spot.top, vh - TOOLTIP_H_EST - 16)),
      left: spot.left + spot.width + GAP,
      width: w,
    };
  }
  if (spot.left - GAP - w >= 8) {
    return {
      top: Math.max(16, Math.min(spot.top, vh - TOOLTIP_H_EST - 16)),
      left: spot.left - GAP - w,
      width: w,
    };
  }
  return { centered: true };
}

export default function OnboardingTour({ onComplete, onSkip, onGoToTab }) {
  const [currentStep, setCurrentStep] = useState(() => {
    // ?tour=N abre directo en ese paso (útil para probar). Fuera de rango = 0.
    if (typeof window === 'undefined') return 0;
    try {
      const n = Number(new URLSearchParams(window.location.search).get('tour'));
      if (Number.isInteger(n) && n >= 0 && n < ONBOARDING_STEPS.length) return n;
    } catch {}
    return 0;
  });
  const [spot, setSpot] = useState(null);
  const [tooltip, setTooltip] = useState({ centered: true });
  const step = ONBOARDING_STEPS[currentStep];
  const isLast = currentStep === ONBOARDING_STEPS.length - 1;
  const rafRef = useRef(0);

  const measure = useCallback(() => {
    const rect = getSpotRect(ONBOARDING_STEPS[currentStep].target);
    setSpot(rect);
    setTooltip(placeTooltip(rect));
  }, [currentStep]);

  // Cambiar de pestaña al entrar al paso + medir tras el render.
  useEffect(() => {
    const s = ONBOARDING_STEPS[currentStep];
    if (s.tab && onGoToTab) onGoToTab(s.tab);
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = requestAnimationFrame(measure);
    });
    return () => cancelAnimationFrame(rafRef.current);
  }, [currentStep, measure, onGoToTab]);

  // Scroll al objetivo + re-medir en resize/scroll.
  useLayoutEffect(() => {
    if (typeof document === 'undefined' || !step.target) return undefined;
    const el = document.querySelector(`[data-tour="${step.target}"]`);
    if (el) {
      try {
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } catch {}
    }
    const onReposition = () => measure();
    window.addEventListener('resize', onReposition);
    window.addEventListener('scroll', onReposition, true);
    const t = setTimeout(measure, 350);
    return () => {
      window.removeEventListener('resize', onReposition);
      window.removeEventListener('scroll', onReposition, true);
      clearTimeout(t);
    };
  }, [step.target, measure]);

  // Escape = omitir, flechas = navegar.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onSkip?.();
      if (e.key === 'ArrowRight') setCurrentStep((c) => Math.min(c + 1, ONBOARDING_STEPS.length - 1));
      if (e.key === 'ArrowLeft') setCurrentStep((c) => Math.max(c - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onSkip]);

  const handleNext = () => {
    if (!isLast) {
      setCurrentStep((c) => c + 1);
    } else {
      onComplete?.();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const tooltipStyle = tooltip.centered
    ? {}
    : { top: tooltip.top, left: tooltip.left, width: tooltip.width };

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label={step.title}>
      {spot ? (
        <>
          {/* Overlay en 4 piezas dejando el "agujero" del spotlight */}
          <div
            className="absolute left-0 right-0 top-0 bg-black/70 backdrop-blur-[1px]"
            style={{ height: spot.top }}
          />
          <div
            className="absolute left-0 right-0 bg-black/70 backdrop-blur-[1px]"
            style={{ top: spot.top + spot.height, bottom: 0 }}
          />
          <div
            className="absolute bg-black/70 backdrop-blur-[1px]"
            style={{ top: spot.top, left: 0, width: spot.left, height: spot.height }}
          />
          <div
            className="absolute bg-black/70 backdrop-blur-[1px]"
            style={{ top: spot.top, left: spot.left + spot.width, right: 0, height: spot.height }}
          />
          {/* Anillo resaltando el elemento */}
          <div
            className="absolute rounded-2xl border-2 border-indigo-400 shadow-[0_0_0_4px_rgba(99,102,241,0.25),0_0_40px_rgba(99,102,241,0.35)] pointer-events-none transition-all duration-300"
            style={{ top: spot.top, left: spot.left, width: spot.width, height: spot.height }}
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onSkip} />
      )}

      {/* Tooltip */}
      <div
        className={`absolute ${tooltip.centered ? 'inset-0 flex items-center justify-center p-4 pointer-events-none' : ''}`}
        style={tooltip.centered ? undefined : tooltipStyle}
      >
        <div className="pointer-events-auto w-full max-w-[340px] rounded-2xl border border-white/15 bg-slate-900 shadow-2xl p-5 relative animate-in fade-in zoom-in-95 duration-200">
          <button
            type="button"
            onClick={onSkip}
            aria-label="Cerrar tour"
            className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
            Paso {currentStep + 1} de {ONBOARDING_STEPS.length}
          </p>
          <h3 className="text-base font-bold text-white mt-1 pr-6">{step.title}</h3>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">{step.description}</p>
          {step.cta && (
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">{step.cta}</p>
          )}

          <div className="flex items-center gap-1.5 mt-4 mb-4">
            {ONBOARDING_STEPS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Ir al paso ${i + 1}: ${s.title}`}
                onClick={() => setCurrentStep(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentStep ? 'w-6 bg-indigo-400' : 'w-1.5 bg-slate-700 hover:bg-slate-600'
                }`}
              />
            ))}
          </div>

        {/* Buttons */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onSkip}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Omitir
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" />
              Anterior
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all"
            >
              {isLast ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Comenzar</span>
                </>
              ) : (
                <>
                  <span>Siguiente</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

// Hook para manejar el estado del onboarding
export function useOnboarding() {
  // Lazy initializers: leer localStorage durante el render inicial evita
  // el setState síncrono dentro de un useEffect (cascading renders).
  const [completed, setCompleted] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem(TOUR_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [showTour, setShowTour] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem(TOUR_KEY) !== 'true';
    } catch {
      return true;
    }
  });

  const persistCompleted = () => {
    try {
      localStorage.setItem(TOUR_KEY, 'true');
    } catch {}
  };

  const completeTour = () => {
    persistCompleted();
    setCompleted(true);
    setShowTour(false);
  };

  const skipTour = () => {
    persistCompleted();
    setCompleted(true);
    setShowTour(false);
  };

  const resetTour = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOUR_KEY);
    }
    setCompleted(false);
    setShowTour(true);
  };

  return { showTour, completed, completeTour, skipTour, resetTour };
}