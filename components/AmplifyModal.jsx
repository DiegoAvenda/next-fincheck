'use client';

import React, { useState } from 'react';
import { storageService } from '../lib/storage';
import {
  Cloud,
  Database,
  Lock,
  Check,
  Copy,
  Terminal,
  ExternalLink,
  X,
  UserCheck,
  Server,
  Download
} from 'lucide-react';

export default function AmplifyModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'schema' | 'export'

  if (!isOpen) return null;

  const dynamoPayload = storageService.exportAllDataJSON();

  const handleCopy = () => {
    navigator.clipboard.writeText(dynamoPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([dynamoPayload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `amplify_dynamodb_seed_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl rounded-2xl border border-white/15 bg-slate-900 shadow-2xl p-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">AWS Amplify Integration</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Gen 2 Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">Amazon Cognito Auth + Amazon DynamoDB Storage</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-4 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Arquitectura & Despliegue
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'schema'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Esquemas DynamoDB
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'export'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Exportar Datos DynamoDB
          </button>
        </div>

        {/* Tab 1: Overview & Deployment */}
        {activeTab === 'overview' && (
          <div className="mt-4 space-y-4 max-h-[420px] overflow-y-auto pr-1 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                Amazon Cognito Authentication
              </h4>
              <p className="text-slate-300 mt-1 leading-relaxed">
                Configurado en <code className="text-indigo-400">amplify/auth/resource.ts</code> con inicio de sesión por correo electrónico y atributos personalizados. Cada usuario tiene aislamiento de datos criptográfico con <code className="text-emerald-400">allow.owner()</code>.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                Amazon DynamoDB & AppSync GraphQL
              </h4>
              <p className="text-slate-300 mt-1 leading-relaxed">
                Los modelos <code className="text-indigo-400">Transaction</code> y <code className="text-indigo-400">Budget</code> están definidos en <code className="text-indigo-400">amplify/data/resource.ts</code> listos para provisionar tablas DynamoDB con particionado por usuario.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                Comandos de Despliegue en AWS Amplify
              </h4>
              <div className="mt-2 space-y-2">
                <div>
                  <span className="text-slate-400">1. Para desarrollo en la nube con Sandbox local:</span>
                  <pre className="mt-1 p-2 rounded bg-black/60 text-emerald-400 font-mono text-[11px]">
                    npx ampx sandbox
                  </pre>
                </div>
                <div>
                  <span className="text-slate-400">2. Para despliegue continuo en producción:</span>
                  <p className="text-slate-300 mt-0.5">
                    Conecta este repositorio de GitHub en la consola de <strong>AWS Amplify Hosting</strong>. Amplify detectará el backend Gen 2 automáticamente y compilará la base de datos y la autenticación sin configuración manual extra.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: DynamoDB Schema */}
        {activeTab === 'schema' && (
          <div className="mt-4 space-y-3 max-h-[420px] overflow-y-auto pr-1 text-xs">
            <p className="text-slate-300">
              Archivos preparados en la raíz de tu proyecto:
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
              <span className="text-slate-500">// amplify/data/resource.ts</span>
              <br />
              <span className="text-purple-400">Transaction</span>: &#123;
              <br />&nbsp;&nbsp;id: ID,
              <br />&nbsp;&nbsp;description: String!,
              <br />&nbsp;&nbsp;amount: Float!,
              <br />&nbsp;&nbsp;type: String!, <span className="text-slate-500">// &apos;income&apos; | &apos;expense&apos;</span>
              <br />&nbsp;&nbsp;category: String!,
              <br />&nbsp;&nbsp;date: AWSDate!,
              <br />&nbsp;&nbsp;paymentMethod: String,
              <br />&nbsp;&nbsp;notes: String,
              <br />&nbsp;&nbsp;owner: String <span className="text-slate-500">// Cognito sub</span>
              <br />&#125;
              <br /><br />
              <span className="text-purple-400">Budget</span>: &#123;
              <br />&nbsp;&nbsp;category: String!,
              <br />&nbsp;&nbsp;monthlyLimit: Float!,
              <br />&nbsp;&nbsp;owner: String
              <br />&#125;
            </div>
          </div>
        )}

        {/* Tab 3: JSON Export */}
        {activeTab === 'export' && (
          <div className="mt-4 space-y-3 max-h-[420px] overflow-y-auto pr-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Payload compatible con DynamoDB BatchWriteItem:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            <textarea
              readOnly
              value={dynamoPayload}
              rows={12}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400 focus:outline-none"
            />
          </div>
        )}

        {/* Bottom */}
        <div className="mt-5 pt-3 flex items-center justify-end border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-750 text-white transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
