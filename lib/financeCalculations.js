import { EXPENSE_CATEGORIES } from './constants';

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

export function calculateBudgetAlerts(categoryBreakdown = []) {
  const critical = [];
  const warnings = [];

  categoryBreakdown.forEach((cat) => {
    if (cat.isOverBudget) {
      critical.push({
        id: `alert-crit-${cat.id}`,
        category: cat.id,
        severity: 'danger',
        title: `¡Presupuesto superado en ${cat.label}!`,
        message: `Has gastado $${cat.spent.toLocaleString()} de tu límite de $${cat.budget.toLocaleString()} (${cat.percentageOfBudget}%). Excedido por $${cat.overAmount.toLocaleString()}.`,
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
        title: `Cuidado: Cerca del límite en ${cat.label}`,
        message: `Has consumido el ${cat.percentageOfBudget}% ($${cat.spent.toLocaleString()} de $${cat.budget.toLocaleString()}). Te quedan solo $${cat.remaining.toLocaleString()}.`,
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

export function calculateHealthScore(totals, categoryBreakdown, alerts) {
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

  let label = 'Excelente';
  let badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';

  if (score < 50) {
    label = 'Crítico / En Riesgo';
    badgeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  } else if (score < 75) {
    label = 'Mejorable';
    badgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  } else if (score < 90) {
    label = 'Saludable';
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

export function generateSmartAdvice(totals, breakdown, rule503020, alerts) {
  const recommendations = [];

  // Advice 1: Budget Breaches
  if (alerts.critical.length > 0) {
    const worst = alerts.critical[0];
    recommendations.push({
      type: 'urgent',
      title: `Fuga de dinero detectada en "${worst.category}"`,
      description: `Has sobrepasado este presupuesto por $${worst.overAmount.toLocaleString()}. Considera recortar gastos no esenciales en esta categoría durante las próximas 2 semanas para equilibrar tu saldo de fin de mes.`,
      icon: 'AlertTriangle',
      tag: 'Ajuste de Presupuesto',
      color: 'rose',
    });
  }

  // Advice 2: 50/30/20 Rule recommendation
  if (rule503020.wants.currentPct > 30) {
    const diff = rule503020.wants.spent - rule503020.wants.targetAmount;
    recommendations.push({
      type: 'savings',
      title: 'Controla el consumo en "Deseos y Estilo de Vida"',
      description: `Tus gastos discrecionales representan el ${rule503020.wants.currentPct}% de tus ingresos (lo ideal es max 30%). Si optimizas unos $${Math.max(30, Math.round(diff))} al mes, liberarías suficiente flujo para duplicar tu aportación a inversiones.`,
      icon: 'Scissors',
      tag: 'Regla 50/30/20',
      color: 'amber',
    });
  }

  // Advice 3: Savings Rate & Emergency Fund
  const monthlyBurn = totals.totalExpense || 1;
  const estimatedEmergencyFundNeeded = monthlyBurn * 3;
  if (totals.savingsRate >= 20) {
    recommendations.push({
      type: 'investment',
      title: '¡Excelente tasa de ahorro! Pon a trabajar tu dinero',
      description: `Estás ahorrando el ${totals.savingsRate}% de tus ingresos mensuales. En lugar de dejarlo inactivo en cuenta corriente, destina al menos el 50% de tu excedente a Renta Fija (CETES/SOFIPOs) o ETFs indexados como VOO (S&P 500) para vencer a la inflación.`,
      icon: 'TrendingUp',
      tag: 'Crecimiento Patrimonial',
      color: 'emerald',
    });
  } else {
    recommendations.push({
      type: 'savings',
      title: 'Construye tu Fondo de Emergencia (3 a 6 meses)',
      description: `Tu gasto mensual actual ronda los $${Math.round(monthlyBurn).toLocaleString()}. Tu meta base de respaldo ante imprevistos debería ser de $${Math.round(estimatedEmergencyFundNeeded).toLocaleString()} en instrumentos líquidos con rendimientos diarios.`,
      icon: 'ShieldCheck',
      tag: 'Seguridad Financiera',
      color: 'cyan',
    });
  }

  // Advice 4: Micro-expenses & subscription audit
  const entertainment = breakdown.find(c => c.id === 'Ocio y Salidas' || c.id === 'Compras');
  if (entertainment && entertainment.spent > 150) {
    recommendations.push({
      type: 'tip',
      title: 'Auditoría de suscripciones y micro-gastos',
      description: `Revisa cobros automáticos (streaming, apps, membresías que no uses con frecuencia). Cancelar solo 2 servicios innecesarios te devolverá entre $20 y $40 mensuales de liquidez inmediata.`,
      icon: 'SearchCheck',
      tag: 'Optimización de Gastos',
      color: 'indigo',
    });
  }

  return recommendations;
}
