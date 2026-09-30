'use client';

import React, { useState, useEffect } from 'react';
import CategoryIcon from './CategoryIcon';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS } from '../lib/constants';
import { X, Check, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export default function TransactionModal({ isOpen, onClose, onSave, editingTransaction }) {
  const [type, setType] = useState('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0].id);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState('tarjeta_debito');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type || 'expense');
      setDescription(editingTransaction.description || '');
      setAmount(String(editingTransaction.amount || ''));
      setCategory(editingTransaction.category || EXPENSE_CATEGORIES[0].id);
      setDate(editingTransaction.date || new Date().toISOString().slice(0, 10));
      setPaymentMethod(editingTransaction.paymentMethod || 'tarjeta_debito');
      setNotes(editingTransaction.notes || '');
    } else {
      setType('expense');
      setDescription('');
      setAmount('');
      setCategory(EXPENSE_CATEGORIES[0].id);
      setDate(new Date().toISOString().slice(0, 10));
      setPaymentMethod('tarjeta_debito');
      setNotes('');
    }
    setErrors({});
  }, [editingTransaction, isOpen]);

  // When type changes, adjust default category if needed
  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'income') {
      setCategory(INCOME_CATEGORIES[0].id);
      setPaymentMethod('transferencia');
    } else {
      setCategory(EXPENSE_CATEGORIES[0].id);
      setPaymentMethod('tarjeta_debito');
    }
  };

  if (!isOpen) return null;

  const currentCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!description.trim()) {
      newErrors.description = 'Ingresa un concepto o descripción';
    }
    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Ingresa un monto válido mayor a 0';
    }
    if (!date) {
      newErrors.date = 'Selecciona una fecha';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      id: editingTransaction ? editingTransaction.id : `tx-${Date.now()}`,
      description: description.trim(),
      amount: parsedAmount,
      type,
      category,
      date,
      paymentMethod,
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg rounded-2xl border border-white/15 bg-slate-900 shadow-2xl p-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white">
            {editingTransaction ? 'Editar Movimiento' : 'Registrar Movimiento'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Type Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Gasto (-)</span>
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                type === 'income'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Ingreso (+)</span>
            </button>
          </div>

          {/* Amount and Currency */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Monto ($) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">
                $
              </span>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errors.amount) setErrors({ ...errors, amount: null });
                }}
                className={`w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-950 border text-white text-base font-bold placeholder-slate-600 focus:outline-none focus:ring-2 ${
                  errors.amount
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
                }`}
              />
            </div>
            {errors.amount && (
              <p className="text-xs text-rose-400 mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Concept / Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Concepto / Título *
            </label>
            <input
              type="text"
              placeholder="Ej. Supermercado, Pago quincenal, Gasolina..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors({ ...errors, description: null });
              }}
              className={`w-full px-3.5 py-2 rounded-xl bg-slate-950 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                errors.description
                  ? 'border-rose-500 focus:ring-rose-500'
                  : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-rose-400 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Category & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Categoría *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                {currentCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Fecha *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Método de Pago
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PAYMENT_METHODS.map((pm) => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setPaymentMethod(pm.id)}
                  className={`py-2 px-2 text-xs font-medium rounded-lg border text-center transition-colors ${
                    paymentMethod === pm.id
                      ? 'bg-indigo-600/30 border-indigo-500 text-white font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {pm.label}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Notas adicionales (opcional)
            </label>
            <input
              type="text"
              placeholder="Ej. Factura #402, compra a 3 meses..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/25 transition-all active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{editingTransaction ? 'Actualizar' : 'Guardar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
