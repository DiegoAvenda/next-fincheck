'use client';

import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Check, HelpCircle, Sparkles } from 'lucide-react';

const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: '¡Bienvenido a FinCheck!',
    content: (
      <div>
        <p className="mb-3">Tu asistente de finanzas personales en español. Empezaremos con una breve capacitación.</p>
        <div className="glass-panel rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white">Sin IA, sin suscripciones</p>
              <p className="text-xs text-slate-400 mt-0.5">Sin costos ocultos. Todos los cálculos son transparentes y auditables.</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'dashboard',
    target: 'dashboard',
    title: 'Tu Dashboard Financiero',
    content: (
      <div className="space-y-3">
        <p>Los 5 cards muestran tu resumen financiero del mes:</p>
        <ul className="text-xs text-slate-400 space-y-1.5 ml-4">
          <li><strong className="text-white">Balance Neto</strong> - Tu dinero disponible</li>
          <li><strong className="text-white">Ingresos</strong> - Dinero que recibes</li>
          <li><strong className="text-white">Gastos</strong> - Dinero que gastas</li>
          <li><strong className="text-white">Ahorro (%)</strong> - Cuánto ahorras del ingreso</li>
          <li><strong className="text-white">Salud Financiera</strong> - Score de 0-100 basado en reglas</li>
        </ul>
      </div>
    )
  },
  {
    id: 'budgets',
    target: 'budgets',
    title: 'Gestor de Presupuestos',
    content: (
      <div className="space-y-3">
        <p>Establece topes para cada categoría y recibe alertas:</p>
        <ul className="text-xs text-slate-400 space-y-1.5 ml-4">
          <li><strong className="text-emerald-400">Verde:</strong> Dentro del presupuesto</li>
          <li><strong className="text-amber-400">Ámbar:</strong> Cerca del límite (80%)</li>
          <li><strong className="text-rose-500">Rojo:</strong> Excedido el presupuesto</li>
        </ul>
        <p className="mt-2 text-xs text-slate-300">Usa el cálculo de fondo de emergencia para saber cuánto necesitas ahorrar.</p>
      </div>
    )
  },
  {
    id: 'advisor',
    target: 'advisor',
    title: 'Asesor Financiero',
    content: (
      <div className="space-y-3">
        <p>Nuestro asesor te da recomendaciones accionables de ahorro:</p>
        <ul className="text-xs text-slate-400 space-y-1.5 ml-4">
          <li><strong className="text-white">Regla 50/30/20</strong> - Distribución ideal de gastos</li>
          <li><strong className="text-white">Fondo de emergencia</strong> - Cuánto necesitas ahorrar</li>
          <li><strong className="text-white">Optimización de gastos</strong> - Detecta fugas de dinero</li>
        </ul>
        <p className="mt-2 text-xs text-indigo-300 bg-indigo-500/10 p-2 rounded">💡 Todas las recomendaciones usan reglas deterministas, no AI</p>
      </div>
    )
  },
  {
    id: 'add-transaction',
    target: 'add-transaction',
    title: 'Registrar Movimientos',
    content: (
      <div className="space-y-3">
        <p>Categoría automática: escribe una descripción y te sugerimos la categoría correcta.</p>
        <ul className="text-xs text-slate-400 space-y-1 ml-4">
          <li><strong className="text-white">Ej. &quot;Gasolina&quot;</strong> → <span className="text-cyan-400">Transporte</span></li>
          <li><strong className="text-white">Ej. &quot;Netflix&quot;</strong> → <span className="text-pink-400">Ocio y Salidas</span></li>
          <li><strong className="text-white">Ej. &quot;Renta&quot;</strong> → <span className="text-blue-400">Vivienda</span></li>
        </ul>
      </div>
    )
  },
  {
    id: 'demo-mode',
    title: 'Modo Demostración',
    content: (
      <div className="space-y-3">
        <p>Sin iniciar sesión, puedes probar la app con datos de ejemplo editables.</p>
        <div className="glass-panel rounded-xl p-4 border border-white/10">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">Modo demostración editable</p>
              <p className="text-xs text-slate-400 mt-0.5">Puedes añadir, editar y borrar con datos de ejemplo. Se guardan en este navegador.</p>
            </div>
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-300">Cuando inicies sesión con Google, tus datos se sincronizarán en la nube.</p>
      </div>
    )
  }
];

export default function OnboardingTour({ onComplete, onSkip }) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete && onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = ONBOARDING_STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-white/15 bg-slate-900 shadow-2xl p-6 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white">
            {step.title}
          </h3>
          <button
            onClick={onSkip}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="my-6">
          <div className="prose prose-sm prose-invert max-w-none text-slate-300">
            {step.content}
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%` }}
            />
          </div>
          <span className="text-xs text-slate-400">
            {currentStep + 1} de {ONBOARDING_STEPS.length}
          </span>
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
              {currentStep === ONBOARDING_STEPS.length - 1 ? (
                <>
                  <Check className="w-4 h-4" />
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
  );
}

// Hook para manejar el estado del onboarding
export function useOnboarding() {
  // Lazy initializers: leer localStorage durante el render inicial evita
  // el setState síncrono dentro de un useEffect (cascading renders).
  const [completed, setCompleted] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem('fincheck-onboarding-completed') === 'true';
    } catch {
      return false;
    }
  });
  const [showTour, setShowTour] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem('fincheck-onboarding-completed') !== 'true';
    } catch {
      return true;
    }
  });

  const persistCompleted = () => {
    try {
      localStorage.setItem('fincheck-onboarding-completed', 'true');
    } catch {}
  };

  const completeTour = () => {
    persistCompleted();
    setCompleted(true);
    setShowTour(false);
  };

  const skipTour = () => {
    persistCompleted();
    setShowTour(false);
  };

  const resetTour = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fincheck-onboarding-completed');
    }
    setCompleted(false);
    setShowTour(true);
  };

  return { showTour, completed, completeTour, skipTour, resetTour };
}