'use client';

import React, { useState } from 'react';
import { TrendingUp, ShieldCheck, Database, Sparkles, Loader2, AlertTriangle } from 'lucide-react';

import { authClient } from '../lib/auth-client';
import GoogleIcon from './GoogleIcon';

const HIGHLIGHTS = [
  {
    icon: Sparkles,
    title: 'Panel inteligente',
    description: 'Alertas de presupuesto, regla 50/30/20 y recomendaciones de ahorro e inversión.',
  },
  {
    icon: Database,
    title: 'Tus datos en MongoDB',
    description: 'Transacciones y presupuestos aislados por usuario, disponibles en cualquier dispositivo.',
  },
  {
    icon: ShieldCheck,
    title: 'Acceso seguro',
    description: 'Better Auth gestiona la sesión; nunca vemos tu contraseña de Google.',
  },
];

export default function LoginView() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsRedirecting(true);

    try {
      const { error: signInError } = await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/',
      });

      if (signInError) {
        setError(
          signInError.message ??
            'Google rechazó el inicio de sesión. Revisa GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET.',
        );
        setIsRedirecting(false);
      }
    } catch {
      setError(
        'No se pudo contactar al servicio de autenticación. Revisa tu conexión e intenta de nuevo.',
      );
      setIsRedirecting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#080b12] selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-white/20">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">FinCheck</h1>
            <p className="text-xs text-slate-400">Control de Finanzas e Inversión</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-xl p-6 shadow-2xl">
          <h2 className="text-lg font-bold text-white text-center">Inicia sesión para continuar</h2>
          <p className="text-sm text-slate-400 text-center mt-1">
            Usa tu cuenta de Google. Tus movimientos quedan ligados a tu usuario.
          </p>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isRedirecting}
            className="mt-6 w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isRedirecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Redirigiendo a Google...</span>
              </>
            ) : (
              <>
                <GoogleIcon className="w-5 h-5" />
                <span>Continuar con Google</span>
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <p className="mt-4 text-[11px] text-slate-500 text-center leading-relaxed">
            ¿Aún no configuras Google OAuth? Agrega <code className="text-slate-400">GOOGLE_CLIENT_ID</code> y{' '}
            <code className="text-slate-400">GOOGLE_CLIENT_SECRET</code> en{' '}
            <code className="text-slate-400">.env.local</code>.
          </p>
        </div>

        <ul className="mt-6 space-y-3">
          {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex items-start gap-3 text-xs">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-200">{title}</p>
                <p className="text-slate-500">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
