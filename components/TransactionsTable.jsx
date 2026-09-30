'use client';

import React, { useState, useMemo } from 'react';
import CategoryIcon from './CategoryIcon';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../lib/constants';
import {
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Trash2,
  Edit2,
  Download,
  Plus,
  Calendar,
  CreditCard,
  FileSpreadsheet
} from 'lucide-react';

export default function TransactionsTable({
  transactions = [],
  onOpenAddModal,
  onEditTransaction,
  onDeleteTransaction,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'expense' | 'income'
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filtered transactions
  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      // Type filter
      if (filterType !== 'all' && tx.type !== filterType) return false;
      // Category filter
      if (selectedCategory !== 'all' && tx.category !== selectedCategory) return false;
      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchDesc = (tx.description || '').toLowerCase().includes(term);
        const matchNotes = (tx.notes || '').toLowerCase().includes(term);
        const matchCat = (tx.category || '').toLowerCase().includes(term);
        if (!matchDesc && !matchNotes && !matchCat) return false;
      }
      return true;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, filterType, selectedCategory, searchTerm]);

  // Totals for filtered view
  const filteredTotals = useMemo(() => {
    let income = 0;
    let expense = 0;
    filtered.forEach((tx) => {
      const amt = Number(tx.amount) || 0;
      if (tx.type === 'income') income += amt;
      else expense += amt;
    });
    return { income, expense, balance: income - expense };
  }, [filtered]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Fecha', 'Tipo', 'Categoría', 'Descripción', 'Monto', 'Método de Pago', 'Notas'];
    const rows = filtered.map((tx) => [
      `"${tx.id}"`,
      `"${tx.date}"`,
      `"${tx.type === 'income' ? 'Ingreso' : 'Gasto'}"`,
      `"${tx.category}"`,
      `"${(tx.description || '').replace(/"/g, '""')}"`,
      tx.amount,
      `"${tx.paymentMethod || ''}"`,
      `"${(tx.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fincheck_transacciones_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const allCategories = [
    ...EXPENSE_CATEGORIES.map(c => ({ id: c.id, label: c.label, type: 'Gasto' })),
    ...INCOME_CATEGORIES.map(c => ({ id: c.id, label: c.label, type: 'Ingreso' }))
  ];

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/10 space-y-5">
      {/* Header with Title and Search/Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white tracking-tight">Registro de Movimientos</h3>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {filtered.length} {filtered.length === 1 ? 'registro' : 'registros'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Control pormenorizado de gastos e ingresos</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition-colors"
            title="Exportar a archivo CSV / Excel"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Nueva Transacción</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
        {/* Search Input */}
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por concepto, notas o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>

        {/* Type Filter Buttons */}
        <div className="sm:col-span-3 flex rounded-xl bg-slate-900/90 border border-slate-800 p-1">
          <button
            onClick={() => setFilterType('all')}
            className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-colors ${
              filterType === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterType('expense')}
            className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-colors ${
              filterType === 'expense' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-rose-400'
            }`}
          >
            Gastos
          </button>
          <button
            onClick={() => setFilterType('income')}
            className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-colors ${
              filterType === 'income' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-emerald-400'
            }`}
          >
            Ingresos
          </button>
        </div>

        {/* Category Dropdown */}
        <div className="sm:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filtrar por categoría"
            className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="all">Todas las categorías</option>
            {allCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label} ({c.type})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table / List Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/40">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Movimiento / Concepto</th>
              <th className="py-3 px-4">Categoría</th>
              <th className="py-3 px-4">Fecha</th>
              <th className="py-3 px-4">Método</th>
              <th className="py-3 px-4 text-right">Monto</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-slate-400">
                  <div className="max-w-xs mx-auto flex flex-col items-center">
                    <FileSpreadsheet className="w-10 h-10 text-slate-600 mb-2" />
                    <p className="font-medium text-slate-300">No se encontraron movimientos</p>
                    <p className="text-xs text-slate-500 mt-1">Prueba cambiando los filtros o registra uno nuevo.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((tx) => {
                const isIncome = tx.type === 'income';

                return (
                  <tr key={tx.id} className="hover:bg-slate-900/50 transition-colors group">
                    {/* Concept & Notes */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isIncome
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {isIncome ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-white tracking-tight leading-snug">
                            {tx.description}
                          </p>
                          {tx.notes && (
                            <p className="text-xs text-slate-400 truncate max-w-xs">{tx.notes}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800/90 text-slate-300 border border-slate-700/60">
                        <CategoryIcon name={tx.category} className="w-3.5 h-3.5 text-indigo-400" />
                        {tx.category}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-xs text-slate-300 whitespace-nowrap">
                      {tx.date}
                    </td>

                    {/* Payment Method */}
                    <td className="py-3 px-4 text-xs text-slate-400 capitalize whitespace-nowrap">
                      {tx.paymentMethod ? tx.paymentMethod.replace('_', ' ') : '—'}
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4 text-right whitespace-nowrap font-bold">
                      <span className={isIncome ? 'text-emerald-400' : 'text-rose-400'}>
                        {isIncome ? '+' : '-'}${Number(tx.amount).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onEditTransaction(tx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Editar transacción"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar "${tx.description}"?`)) {
                              onDeleteTransaction(tx.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Eliminar registro"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
