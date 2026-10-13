'use client';

import React, { useState } from 'react';
import {
  Check,
  Copy,
  Database,
  Download,
  HardDrive,
  KeyRound,
  Lock,
  Server,
  Terminal,
  X,
} from 'lucide-react';

import { useFinStore } from '../lib/store';
import { useI18n } from '../lib/useI18n';

const TABS = [
  { id: 'overview', labelKey: 'tabOverview' },
  { id: 'schema', labelKey: 'tabSchema' },
  { id: 'export', labelKey: 'tabExport' },
];

export default function BackendModal({ isOpen, onClose, transactions: propTransactions, budgets: propBudgets }) {
  const { t, locale } = useI18n();
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const storeTransactions = useFinStore((state) => state.transactions);
  const storeBudgets = useFinStore((state) => state.budgets);
  // In demo mode (no session) the store is empty: the demo lives in static
  // constants + localStorage, so the parent passes it explicitly.
  const transactions = propTransactions ?? storeTransactions;
  const budgets = propBudgets ?? storeBudgets;

  if (!isOpen) return null;

  const exportedAt = new Date().toISOString();
  const payload = JSON.stringify(
    {
      schemaVersion: '2.0',
      exportedAt,
      provider: 'mongodb',
      collections: {
        transactions,
        budgets: Object.entries(budgets).map(([category, monthlyLimit]) => ({
          category,
          monthlyLimit,
        })),
      },
    },
    null,
    2,
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `fincheck_mongodb_export_${exportedAt.slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl border border-white/15 bg-slate-900 shadow-2xl p-6 relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{t.backend.title}</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {t.backend.synced}
                </span>
              </div>
              <p className="text-xs text-slate-400">{t.backend.desc}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 mt-4 border-b border-slate-800 pb-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.labelKey ? t.backend[tab.labelKey] : tab.id}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="mt-4 space-y-4 max-h-[420px] overflow-y-auto pr-1 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-400" />
                {t.backend.account}
              </h4>
              <p className="text-slate-300 mt-1 leading-relaxed">
                {t.backend.accountDesc}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                {t.backend.where}
              </h4>
              <p className="text-slate-300 mt-1 leading-relaxed">
                {t.backend.whereDesc}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                {t.backend.setup}
              </h4>
              <div>
                <div>
                  <span className="text-slate-400">{t.backend.setup1}</span>
                </div>
                <div>
                  <span className="text-slate-400">{t.backend.setup2}</span>
                </div>
                <div>
                  <span className="text-slate-400">{t.backend.setup3}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schema' && (
          <div className="mt-4 space-y-3 max-h-[420px] overflow-y-auto pr-1 text-xs">
            <p className="text-slate-300">
              {t.backend.schemaDesc}
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
              <span className="text-slate-500">{'// gestionadas por Better Auth'}</span>
              <br />
              <span className="text-purple-400">user</span> / <span className="text-purple-400">session</span> /{' '}
              <span className="text-purple-400">account</span> /{' '}
              <span className="text-purple-400">verification</span>
              <br />
              <br />
              <span className="text-slate-500">{'// datos financieros de FinCheck'}</span>
              <br />
              <span className="text-purple-400">transactions</span>: &#123;
              <br />
              &nbsp;&nbsp;userId: String!, <span className="text-slate-500">{'// índice único (userId, id)'}</span>
              <br />
              &nbsp;&nbsp;id: String!,
              <br />
              &nbsp;&nbsp;description: String!,
              <br />
              &nbsp;&nbsp;amount: Number!,
              <br />
              &nbsp;&nbsp;type: &apos;income&apos; | &apos;expense&apos;,
              <br />
              &nbsp;&nbsp;category: String!,
              <br />
              &nbsp;&nbsp;date: String!, <span className="text-slate-500">{'// YYYY-MM-DD'}</span>
              <br />
              &nbsp;&nbsp;paymentMethod: String,
              <br />
              &nbsp;&nbsp;notes: String
              <br />
              &#125;
              <br />
              <br />
              <span className="text-purple-400">budgets</span>: &#123;
              <br />
              &nbsp;&nbsp;userId: String!, <span className="text-slate-500">{'// índice único'}</span>
              <br />
              &nbsp;&nbsp;values: &#123; [{locale === 'en' ? 'category' : 'categoría'}]: Number &#125;
              <br />
              &#125;
            </div>
          </div>
        )}

        {activeTab === 'export' && (
          <div className="mt-4 space-y-3 max-h-[420px] overflow-y-auto pr-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">{t.backend.exportDocs}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t.backend.download}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? t.backend.copied : t.backend.copy}</span>
                </button>
              </div>
            </div>

            <textarea
              readOnly
              value={payload}
              rows={12}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400 focus:outline-none"
            />

            <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <Lock className="w-3.5 h-3.5" /> {t.backend.exportNote}
              <HardDrive className="w-3.5 h-3.5 ml-1" /> {t.backend.backupNote}
            </p>
          </div>
        )}

        <div className="mt-5 pt-3 flex items-center justify-end border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            {t.backend.done}
          </button>
        </div>
      </div>
    </div>
  );
}
