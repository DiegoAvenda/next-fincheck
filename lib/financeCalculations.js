import { EXPENSE_CATEGORIES } from './constants';

export function getMonthKey(dateValue) {
  const str = String(dateValue ?? '').slice(0, 7);
  return /^\d{4}-\d{2}$/.test(str) ? str : null;
}

export function formatMonthES(monthKey) {
  return formatMonthLabel(monthKey, 'es');
}

export function formatMonthLabel(monthKey, locale = 'es') {
  if (!monthKey) return locale === 'en' ? 'Period' : 'Periodo';
  const [y, m] = String(monthKey).split('-').map(Number);
  if (!y || !m) return String(monthKey);
  const d = new Date(y, m - 1, 1);
  const tag = locale === 'en' ? 'en-US' : 'es-MX';
  const label = d.toLocaleDateString(tag, { month: 'short', year: 'numeric' });
  return label.replace('.', '');
}

export function listMonths(transactions = []) {
  const set = new Set();
  transactions.forEach((tx) => {
    const key = getMonthKey(tx?.date);
    if (key) set.add(key);
  });
  return [...set].sort().reverse();
}

/**
 * Heurística simple de recurrencias: agrupa por descripción normalizada y
 * devuelve las que aparecen en >=2 meses distintos.
 */
export function detectRecurring(transactions = [], limit = 3) {
  const groups = new Map();
  transactions.forEach((tx) => {
    const name = String(tx?.description ?? '').trim().toLowerCase();
    if (!name || tx?.type !== 'expense') return;
    const month = getMonthKey(tx?.date);
    if (!month) return;
    if (!groups.has(name)) {
      groups.set(name, {
        name: String(tx.description).trim(),
        category: tx.category,
        months: new Set(),
        count: 0,
        total: 0,
      });
    }
    const g = groups.get(name);
    g.months.add(month);
    g.count += 1;
    g.total += Number(tx.amount) || 0;
  });
  return [...groups.values()]
    .filter((g) => g.months.size >= 2 || g.count >= 3)
    .map((g) => ({
      name: g.name,
      category: g.category,
      months: g.months.size,
      count: g.count,
      avgAmount: Math.round(g.total / Math.max(1, g.count)),
    }))
    .sort((a, b) => b.count - a.count || b.avgAmount - a.avgAmount)
    .slice(0, limit);
}

export function calculateTotals(transactions = []) {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((tx) => {
    const amt = Number(tx.amount) || 0;
    if (tx.type === 'income') {
      totalIncome += amt;
    } else {
      totalExpense += amt;
    }
  });

  const netBalance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.max(0, ((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  return {
    totalIncome,
    totalExpense,
    netBalance,
    savingsRate: Math.round(savingsRate * 10) / 10,
  };
}

export function calculateCategoryBreakdown(transactions = [], budgets = {}) {
  const expenseMap = {};

  // Initialize all known expense categories
  EXPENSE_CATEGORIES.forEach((cat) => {
    expenseMap[cat.id] = {
      id: cat.id,
      label: cat.label,
      color: cat.color,
      group: cat.group,
      icon: cat.icon,
      spent: 0,
      count: 0,
      budget: budgets[cat.id] ?? cat.defaultBudget ?? 0,
    };
  });

  let totalExpense = 0;
  transactions.forEach((tx) => {
    if (tx.type === 'expense') {
      const amt = Number(tx.amount) || 0;
      totalExpense += amt;
      if (!expenseMap[tx.category]) {
        expenseMap[tx.category] = {
          id: tx.category,
          label: tx.category,
          color: '#94A3B8',
          group: 'wants',
          icon: 'MoreHorizontal',
          spent: 0,
          count: 0,
          budget: budgets[tx.category] || 0,
        };
      }
      expenseMap[tx.category].spent += amt;
      expenseMap[tx.category].count += 1;
    }
  });

  const result = Object.values(expenseMap).map((cat) => {
    const budget = cat.budget || 0;
    const percentageOfBudget = budget > 0 ? Math.round((cat.spent / budget) * 100) : 0;
    const percentageOfTotal = totalExpense > 0 ? Math.round((cat.spent / totalExpense) * 100) : 0;
    const isOverBudget = budget > 0 && cat.spent > budget;
    const isNearBudget = budget > 0 && cat.spent >= budget * 0.8 && !isOverBudget;
    const overAmount = isOverBudget ? cat.spent - budget : 0;
    const remaining = Math.max(0, budget - cat.spent);

    return {
      ...cat,
      percentageOfBudget,
      percentageOfTotal,
      isOverBudget,
      isNearBudget,
      overAmount,
      remaining,
    };
  });

  // Sort descending by amount spent
  return result.sort((a, b) => b.spent - a.spent);
}

export function calculateBudgetAlerts(categoryBreakdown = [], locale = 'es') {
  const critical = [];
  const warnings = [];
  const en = locale === 'en';

  categoryBreakdown.forEach((cat) => {
    if (cat.isOverBudget) {
      critical.push({
        id: `alert-crit-${cat.id}`,
        category: cat.id,
        severity: 'danger',
        title: en
          ? `Budget exceeded in ${cat.label}!`
          : `¡Presupuesto superado en ${cat.label}!`,
        message: en
          ? `You spent $${cat.spent.toLocaleString()} of your $${cat.budget.toLocaleString()} limit (${cat.percentageOfBudget}%). Over by $${cat.overAmount.toLocaleString()}.`
          : `Has gastado $${cat.spent.toLocaleString()} de tu límite de $${cat.budget.toLocaleString()} (${cat.percentageOfBudget}%). Excedido por $${cat.overAmount.toLocaleString()}.`,
        spent: cat.spent,
        budget: cat.budget,
        percentage: cat.percentageOfBudget,
        overAmount: cat.overAmount,
      });
    } else if (cat.isNearBudget) {
      warnings.push({
        id: `alert-warn-${cat.id}`,
        category: cat.id,
        severity: 'warning',
        title: en
          ? `Heads up: near the limit in ${cat.label}`
          : `Cuidado: Cerca del límite en ${cat.label}`,
        message: en
          ? `You have used ${cat.percentageOfBudget}% ($${cat.spent.toLocaleString()} of $${cat.budget.toLocaleString()}). Only $${cat.remaining.toLocaleString()} left.`
          : `Has consumido el ${cat.percentageOfBudget}% ($${cat.spent.toLocaleString()} de $${cat.budget.toLocaleString()}). Te quedan solo $${cat.remaining.toLocaleString()}.`,
        spent: cat.spent,
        budget: cat.budget,
        percentage: cat.percentageOfBudget,
        remaining: cat.remaining,
      });
    }
  });

  return {
    allAlerts: [...critical, ...warnings],
    critical,
    warnings,
    hasCritical: critical.length > 0,
    hasWarnings: warnings.length > 0,
    totalCount: critical.length + warnings.length,
  };
}

export function calculate503020(categoryBreakdown = [], totalIncome = 0, netBalance = 0) {
  let needsSpent = 0;
  let wantsSpent = 0;
  let savingsSpent = 0;

  categoryBreakdown.forEach((cat) => {
    if (cat.group === 'needs') {
      needsSpent += cat.spent;
    } else if (cat.group === 'wants') {
      wantsSpent += cat.spent;
    } else if (cat.group === 'savings') {
      savingsSpent += cat.spent;
    }
  });

  // Remaining unspent income is also considered potential savings
  const totalSavings = savingsSpent + Math.max(0, netBalance);

  const base = totalIncome > 0 ? totalIncome : (needsSpent + wantsSpent + savingsSpent) || 1;
  const needsPct = Math.round((needsSpent / base) * 100);
  const wantsPct = Math.round((wantsSpent / base) * 100);
  const savingsPct = Math.round((totalSavings / base) * 100);

  return {
    needs: {
      spent: needsSpent,
      currentPct: needsPct,
      targetPct: 50,
      targetAmount: Math.round(base * 0.5),
      status: needsPct <= 50 ? 'healthy' : 'warning',
    },
    wants: {
      spent: wantsSpent,
      currentPct: wantsPct,
      targetPct: 30,
      targetAmount: Math.round(base * 0.3),
      status: wantsPct <= 30 ? 'healthy' : 'warning',
    },
    savings: {
      spent: totalSavings,
      currentPct: savingsPct,
      targetPct: 20,
      targetAmount: Math.round(base * 0.2),
      status: savingsPct >= 20 ? 'healthy' : 'warning',
    },
  };
}

export function calculateHealthScore(totals, categoryBreakdown, alerts, locale = 'es') {
  let score = 100;

  // Penalize negative balance
  if (totals.netBalance < 0) {
    score -= 35;
  } else if (totals.savingsRate < 10) {
    score -= 15;
  } else if (totals.savingsRate < 20) {
    score -= 5;
  }

  // Penalize overbudget categories
  score -= (alerts.critical.length * 12);
  score -= (alerts.warnings.length * 4);

  // Normalize
  score = Math.max(15, Math.min(100, score));

  let label = locale === 'en' ? 'Excellent' : 'Excelente';
  let badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';

  if (score < 50) {
    label = locale === 'en' ? 'Critical / At Risk' : 'Crítico / En Riesgo';
    badgeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  } else if (score < 75) {
    label = locale === 'en' ? 'Needs Work' : 'Mejorable';
    badgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  } else if (score < 90) {
    label = locale === 'en' ? 'Healthy' : 'Saludable';
    badgeColor = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
  }

  return { score, label, badgeColor };
}

export function calculateCompoundInterest(initialAmount, monthlyContribution, annualRatePercent, years) {
  const r = (annualRatePercent / 100) / 12;
  const totalMonths = years * 12;
  const yearlyData = [];

  let currentBalance = Number(initialAmount) || 0;
  let totalInvested = Number(initialAmount) || 0;

  for (let y = 1; y <= years; y++) {
    for (let m = 1; m <= 12; m++) {
      currentBalance = (currentBalance + Number(monthlyContribution)) * (1 + r);
      totalInvested += Number(monthlyContribution);
    }

    yearlyData.push({
      year: y,
      totalInvested: Math.round(totalInvested),
      interestEarned: Math.round(currentBalance - totalInvested),
      totalBalance: Math.round(currentBalance),
    });
  }

  return {
    finalBalance: Math.round(currentBalance),
    totalInvested: Math.round(totalInvested),
    totalInterest: Math.round(currentBalance - totalInvested),
    yearlyData,
  };
}

export function generateSmartAdvice(totals, breakdown, rule503020, alerts, locale = 'es') {
  const recommendations = [];
  const en = locale === 'en';

  // Advice 1: Budget Breaches
  if (alerts.critical.length > 0) {
    const worst = alerts.critical[0];
    recommendations.push({
      type: 'urgent',
      title: en
        ? `Money leak detected in "${worst.category}"`
        : `Fuga de dinero detectada en "${worst.category}"`,
      description: en
        ? `You exceeded this budget by $${worst.overAmount.toLocaleString()}. Consider cutting non-essential spending in this category over the next 2 weeks to balance your end-of-month position.`
        : `Has sobrepasado este presupuesto por $${worst.overAmount.toLocaleString()}. Considera recortar gastos no esenciales en esta categoría durante las próximas 2 semanas para equilibrar tu saldo de fin de mes.`,
      icon: 'AlertTriangle',
      tag: en ? 'Budget Adjustment' : 'Ajuste de Presupuesto',
      color: 'rose',
    });
  }

  // Advice 2: 50/30/20 Rule recommendation
  if (rule503020.wants.currentPct > 30) {
    const diff = rule503020.wants.spent - rule503020.wants.targetAmount;
    recommendations.push({
      type: 'savings',
      title: en
        ? 'Rein in "Wants & Lifestyle" spending'
        : 'Controla el consumo en "Deseos y Estilo de Vida"',
      description: en
        ? `Discretionary spending is ${rule503020.wants.currentPct}% of your income (ideally max 30%). Trimming about $${Math.max(30, Math.round(diff))} a month would free up cash to strengthen your emergency fund.`
        : `Tus gastos discrecionales representan el ${rule503020.wants.currentPct}% de tus ingresos (lo ideal es max 30%). Si optimizas unos $${Math.max(30, Math.round(diff))} al mes, liberarías flujo para reforzar tu fondo de emergencia.`,
      icon: 'Scissors',
      tag: en ? '50/30/20 Rule' : 'Regla 50/30/20',
      color: 'amber',
    });
  }

  // Advice 3: Savings Rate & Emergency Fund
  const monthlyBurn = totals.totalExpense || 1;
  const estimatedEmergencyFundNeeded = monthlyBurn * 3;
  if (totals.savingsRate >= 20) {
    recommendations.push({
      type: 'savings',
      title: en ? 'Excellent savings rate! Keep it up' : '¡Excelente tasa de ahorro! Sigue así',
      description: en
        ? `You are saving ${totals.savingsRate}% of your monthly income. Keep this pace and direct the surplus to your emergency fund until it covers 3 to 6 months of expenses.`
        : `Estás ahorrando el ${totals.savingsRate}% de tus ingresos mensuales. Mantén ese ritmo y destina el excedente a tu fondo de emergencia hasta cubrir de 3 a 6 meses de gastos.`,
      icon: 'PiggyBank',
      tag: en ? 'Healthy Saving' : 'Ahorro Saludable',
      color: 'emerald',
    });
  } else {
    recommendations.push({
      type: 'savings',
      title: en ? 'Build your Emergency Fund (3 to 6 months)' : 'Construye tu Fondo de Emergencia (3 a 6 meses)',
      description: en
        ? `Your current monthly spending is around $${Math.round(monthlyBurn).toLocaleString()}. Your baseline safety-net goal should be $${Math.round(estimatedEmergencyFundNeeded).toLocaleString()} in liquid, daily-yield instruments.`
        : `Tu gasto mensual actual ronda los $${Math.round(monthlyBurn).toLocaleString()}. Tu meta base de respaldo ante imprevistos debería ser de $${Math.round(estimatedEmergencyFundNeeded).toLocaleString()} en instrumentos líquidos con rendimientos diarios.`,
      icon: 'ShieldCheck',
      tag: en ? 'Financial Safety' : 'Seguridad Financiera',
      color: 'cyan',
    });
  }

  // Advice 4: Micro-expenses & subscription audit
  const entertainment = breakdown.find(c => c.id === 'Ocio y Salidas' || c.id === 'Compras');
  if (entertainment && entertainment.spent > 150) {
    recommendations.push({
      type: 'tip',
      title: en ? 'Subscription & micro-expense audit' : 'Auditoría de suscripciones y micro-gastos',
      description: en
        ? `Review automatic charges (streaming, apps, memberships you rarely use). Cancelling just 2 unneeded services returns $20–$40 a month in immediate liquidity.`
        : `Revisa cobros automáticos (streaming, apps, membresías que no uses con frecuencia). Cancelar solo 2 servicios innecesarios te devolverá entre $20 y $40 mensuales de liquidez inmediata.`,
      icon: 'SearchCheck',
      tag: en ? 'Expense Optimization' : 'Optimización de Gastos',
      color: 'indigo',
    });
  }

  return recommendations;
}

/**
 * Sugiere una categoría de gasto automáticamente basado en la descripción
 * de una transacción usando coincidencias de palabras clave.
 * @param {string} description - La descripción de la transacción
 * @param {Array} expenseCategories - Array de categorías de EXPENSE_CATEGORIES
 * @returns {string|null} - La categoría sugerida o null si no hay coincidencia clara
 */
export function suggestCategoryByDescription(description, expenseCategories = EXPENSE_CATEGORIES) {
  if (!description) return null;

  const lowerDesc = description.toLowerCase().trim();

  // Palabras clave para cada categoría
  const keywordMap = {
    // Necesidades
    'alimentación': 'Alimentación',
    'despensa': 'Alimentación',
    'supermercado': 'Alimentación',
    'frutas': 'Alimentación',
    'verduras': 'Alimentación',
    'comida': 'Alimentación',
    'vivienda': 'Vivienda',
    'renta': 'Vivienda',
    'hipoteca': 'Vivienda',
    'servicios': 'Servicios',
    'internet': 'Servicios',
    'luz': 'Servicios',
    'agua': 'Servicios',
    'gas': 'Servicios',
    'telefono': 'Servicios',
    'transporte': 'Transporte',
    'gasolina': 'Transporte',
    'auto': 'Transporte',
    'carro': 'Transporte',
    'peaje': 'Transporte',
    'metro': 'Transporte',
    'salud': 'Salud y Cuidado',
    'medico': 'Salud y Cuidado',
    'doctor': 'Salud y Cuidado',
    'farmacia': 'Salud y Cuidado',
    'bienestar': 'Salud y Cuidado',
    // Deseos
    'ocio': 'Ocio y Salidas',
    'salidas': 'Ocio y Salidas',
    'cine': 'Ocio y Salidas',
    'restaurante': 'Ocio y Salidas',
    'comida fuera': 'Ocio y Salidas',
    'streaming': 'Ocio y Salidas',
    'netflix': 'Ocio y Salidas',
    'spotify': 'Ocio y Salidas',
    'compras personales': 'Compras',
    'shopping': 'Compras',
    'ropa': 'Compras',
    'electrónica': 'Compras',
    'otros gastos': 'Otros Gastos',
    // Ahorro/Inversión
    'educación': 'Educación',
    'curso': 'Educación',
    'libro': 'Educación',
    'formación': 'Educación',
    'inversión directa': 'Inversión Directa',
    'etf': 'Inversión Directa',
    'acciones': 'Inversión Directa',
  };

  // Comprobar coincidencias exactas primero (case insensitive)
  const exactMatch = expenseCategories.find(cat => 
    cat.id.toLowerCase() === lowerDesc || 
    cat.label.toLowerCase() === lowerDesc
  );
  if (exactMatch) return exactMatch.id;

  // Comprobar si alguna palabra clave coincide con el id de la categoría
  for (const [keyword, categoryId] of Object.entries(keywordMap)) {
    if (lowerDesc.includes(keyword)) {
      // Verificar que la categoría existe
      if (expenseCategories.some(cat => cat.id === categoryId)) {
        return categoryId;
      }
    }
  }

  // Si no hay coincidencia exacta, intentar con palabras individuales
  const words = lowerDesc.split(/\s+/).filter(w => w.length > 2);
  for (const word of words) {
    for (const [keyword, categoryId] of Object.entries(keywordMap)) {
      if (word === keyword || word.includes(keyword) || keyword.includes(word)) {
        if (expenseCategories.some(cat => cat.id === categoryId)) {
          return categoryId;
        }
      }
    }
  }

  // Fallback: la primera categoría que coincida con cualquier palabra clave en la descripción
  for (const cat of expenseCategories) {
    const catLabelLower = cat.label.toLowerCase();
    for (const [keyword] of Object.entries(keywordMap)) {
      if (lowerDesc.includes(keyword) && catLabelLower.includes(keyword.slice(0, 4))) {
        return cat.id;
      }
    }
  }

  return null;
}

/**
 * Procesa una lista de transacciones para asignar categorías automáticamente
 * cuando no están presentes, usando análisis de descripción.
 * @param {Array} transactions - Array de transacciones sin procesar
 * @param {Array} expenseCategories - Array de categorías de EXPENSE_CATEGORIES
 * @returns {Array} - Transacciones con categorías asignadas
 */
export function autoCategorizeTransactions(transactions, expenseCategories = EXPENSE_CATEGORIES) {
  return transactions.map(tx => {
    // Si la transacción ya tiene categoría, mantenerla
    if (tx.category) return tx;
    
    // Si es ingreso, mantener categoría por defecto (o asignar la primera de INCOME_CATEGORIES)
    if (tx.type === 'income') {
      return tx;
    }
    
    // Asignar automáticamente la categoría basada en la descripción
    const suggestedCategory = suggestCategoryByDescription(tx.description, expenseCategories);
    
    return {
      ...tx,
      category: suggestedCategory || 'Otros Gastos' // Usar 'Otros Gastos' como default
    };
  });
}
