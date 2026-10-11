// Internationalization: Spanish (default) and English translations

export const translations = {
  es: {
    // Navbar
    nav: {
      brand: 'Control de Finanzas Personales',
      dashboard: 'Dashboard',
      transactions: 'Transacciones',
      budgets: 'Presupuestos',
      advisor: 'Asesor',
      sync: 'Sync',
      syncing: 'Sync...',
      offline: 'Offline',
      myData: 'Mis datos',
      signIn: 'Iniciar Sesión',
      newRecord: 'Nuevo Registro',
      summary: 'Resumen',
      expensesIncome: 'Gastos/Ingresos',
    },
    // Overview Cards
    overview: {
      netBalance: 'Balance Neto',
      surplus: 'Superávit',
      deficit: 'Déficit',
      thisMonth: 'este mes',
      totalIncome: 'Ingresos Totales',
      totalPeriod: 'Total del periodo',
      totalExpense: 'Gastos Totales',
      periodOutflows: 'Salidas del periodo',
      vsPrevMonth: 'vs mes anterior',
      savingsRate: 'Tasa de Ahorro',
      ofIncome: 'del ingreso',
      healthyGoal: 'Meta saludable cumplida (≥20%)',
      suggested: 'Sugerido: subir al 20%',
      financialHealth: 'Salud Financiera',
      viewDiagnosis: 'Ver diagnóstico financiero completo',
    },
    // Transaction Modal
    transaction: {
      editMovement: 'Editar Movimiento',
      registerMovement: 'Registrar Movimiento',
      expense: 'Gasto (-)',
      income: 'Ingreso (+)',
      amount: 'Monto ($)',
      concept: 'Concepto / Título',
      conceptPlaceholder: 'Ej. Supermercado, Pago quincenal, Gasolina...',
      category: 'Categoría',
      suggestedCategory: 'Categoría sugerida',
      apply: 'Aplicar',
      date: 'Fecha',
      paymentMethod: 'Método de Pago',
      notes: 'Notas adicionales (opcional)',
      notesPlaceholder: 'Ej. Factura #402, compra a 3 meses...',
      cancel: 'Cancelar',
      save: 'Guardar',
      update: 'Actualizar',
      errors: {
        description: 'Ingresa un concepto o descripción',
        amount: 'Ingresa un monto válido mayor a 0',
        date: 'Selecciona una fecha',
      },
    },
    // Loading
    loading: 'Iniciando FinCheck...',
    // Demo reset
    resetDemo: '¿Restablecer los datos de demostración?',
    // Onboarding
    onboarding: {
      howItWorks: '¿Cómo funciona?',
    },
  },
  en: {
    // Navbar
    nav: {
      brand: 'Personal Finance Control',
      dashboard: 'Dashboard',
      transactions: 'Transactions',
      budgets: 'Budgets',
      advisor: 'Advisor',
      sync: 'Sync',
      syncing: 'Sync...',
      offline: 'Offline',
      myData: 'My Data',
      signIn: 'Sign In',
      newRecord: 'New Record',
      summary: 'Summary',
      expensesIncome: 'Expenses/Income',
    },
    // Overview Cards
    overview: {
      netBalance: 'Net Balance',
      surplus: 'Surplus',
      deficit: 'Deficit',
      thisMonth: 'this month',
      totalIncome: 'Total Income',
      totalPeriod: 'Period total',
      totalExpense: 'Total Expenses',
      periodOutflows: 'Period outflows',
      vsPrevMonth: 'vs previous month',
      savingsRate: 'Savings Rate',
      ofIncome: 'of income',
      healthyGoal: 'Healthy goal met (≥20%)',
      suggested: 'Suggested: increase to 20%',
      financialHealth: 'Financial Health',
      viewDiagnosis: 'View full financial diagnosis',
    },
    // Transaction Modal
    transaction: {
      editMovement: 'Edit Movement',
      registerMovement: 'Register Movement',
      expense: 'Expense (-)',
      income: 'Income (+)',
      amount: 'Amount ($)',
      concept: 'Concept / Title',
      conceptPlaceholder: 'e.g. Groceries, Biweekly pay, Gas...',
      category: 'Category',
      suggestedCategory: 'Suggested category',
      apply: 'Apply',
      date: 'Date',
      paymentMethod: 'Payment Method',
      notes: 'Additional notes (optional)',
      notesPlaceholder: 'e.g. Invoice #402, 3-month purchase...',
      cancel: 'Cancel',
      save: 'Save',
      update: 'Update',
      errors: {
        description: 'Enter a concept or description',
        amount: 'Enter a valid amount greater than 0',
        date: 'Select a date',
      },
    },
    // Loading
    loading: 'Starting FinCheck...',
    // Demo reset
    resetDemo: 'Reset demo data?',
    // Onboarding
    onboarding: {
      howItWorks: 'How it works?',
    },
  },
};

export const defaultLocale = 'es';
