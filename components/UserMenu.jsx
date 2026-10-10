'use client';

import React, { useEffect, useRef, useState } from 'react';
import { LogOut, User as UserIcon, Database } from 'lucide-react';

import { authClient } from '../lib/auth-client';

function initialsFrom(name, email) {
  const source = (name ?? '').trim() || (email ?? '').trim();
  if (!source) return '?';
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export default function UserMenu({ user, onOpenBackendModal }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          // Full reload so the session state is re-read from scratch.
          window.location.reload();
        },
        onError: () => setIsSigningOut(false),
      },
    });
  };

  const displayName = user?.name ?? user?.email ?? 'Cuenta';

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        title={user?.email ?? displayName}
        className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-white/10 bg-slate-900/70 hover:bg-slate-800 transition-colors"
      >
        {user?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt={displayName}
            className="w-7 h-7 rounded-full object-cover ring-1 ring-white/20"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-[11px] font-bold text-white">
            {initialsFrom(user?.name, user?.email)}
          </span>
        )}
        <span className="hidden sm:block max-w-[9rem] truncate text-xs font-semibold text-slate-200">
          {displayName}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/10 bg-slate-900 shadow-2xl p-3 z-50">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={displayName}
                className="w-9 h-9 rounded-full object-cover ring-1 ring-white/20"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                {initialsFrom(user?.name, user?.email)}
              </span>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.name ?? 'Usuario FinCheck'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>

          <div className="pt-2 space-y-1">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] text-slate-400">
              <UserIcon className="w-3.5 h-3.5" />
              <span>Sesión gestionada por Better Auth</span>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenBackendModal?.();
              }}
              className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mis datos y exportación</span>
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-xs font-medium text-rose-300 hover:bg-rose-500/10 transition-colors disabled:opacity-60"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isSigningOut ? 'Cerrando sesión...' : 'Cerrar sesión'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
