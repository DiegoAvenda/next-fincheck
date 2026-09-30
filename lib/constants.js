export const EXPENSE_CATEGORIES = [
  { id: 'Alimentación', label: 'Alimentación', icon: 'Utensils', color: '#F59E0B', group: 'needs', defaultBudget: 450 },
  { id: 'Vivienda', label: 'Vivienda y Renta', icon: 'Home', color: '#3B82F6', group: 'needs', defaultBudget: 700 },
  { id: 'Servicios', label: 'Servicios e Internet', icon: 'Zap', color: '#06B6D4', group: 'needs', defaultBudget: 180 },
  { id: 'Transporte', label: 'Transporte y Movilidad', icon: 'Car', color: '#8B5CF6', group: 'needs', defaultBudget: 220 },
  { id: 'Ocio y Salidas', label: 'Ocio, Salidas y Streaming', icon: 'Film', color: '#EC4899', group: 'wants', defaultBudget: 180 },
  { id: 'Salud y Cuidado', label: 'Salud y Bienestar', icon: 'HeartPulse', color: '#10B981', group: 'needs', defaultBudget: 140 },
  { id: 'Educación', label: 'Educación y Cursos', icon: 'GraduationCap', color: '#6366F1', group: 'savings', defaultBudget: 120 },
  { id: 'Compras', label: 'Compras Personales', icon: 'ShoppingBag', color: '#F97316', group: 'wants', defaultBudget: 160 },
  { id: 'Inversión Directa', label: 'Inversión Directa', icon: 'TrendingUp', color: '#10B981', group: 'savings', defaultBudget: 300 },
  { id: 'Otros Gastos', label: 'Otros Gastos', icon: 'MoreHorizontal', color: '#64748B', group: 'wants', defaultBudget: 100 },
];

export const INCOME_CATEGORIES = [
  { id: 'Salario', label: 'Salario / Nómina', icon: 'Briefcase', color: '#10B981' },
  { id: 'Freelance', label: 'Freelance / Negocio', icon: 'Laptop', color: '#06B6D4' },
  { id: 'Rendimientos', label: 'Rendimientos e Inversiones', icon: 'PiggyBank', color: '#8B5CF6' },
  { id: 'Otros Ingresos', label: 'Otros Ingresos', icon: 'PlusCircle', color: '#F59E0B' },
];

export const PAYMENT_METHODS = [
  { id: 'tarjeta_debito', label: 'Tarjeta de Débito' },
  { id: 'tarjeta_credito', label: 'Tarjeta de Crédito' },
  { id: 'transferencia', label: 'Transferencia Bancaria' },
  { id: 'efectivo', label: 'Efectivo' },
];

export const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-1',
    description: 'Pago de Nómina Mensual',
    amount: 3200,
    type: 'income',
    category: 'Salario',
    date: '2026-09-01',
    paymentMethod: 'transferencia',
    notes: 'Depósito quincenal consolidado'
  },
  {
    id: 'tx-2',
    description: 'Proyecto Freelance Frontend',
    amount: 650,
    type: 'income',
    category: 'Freelance',
    date: '2026-09-12',
    paymentMethod: 'transferencia',
    notes: 'Diseño y optimización web'
  },
  {
    id: 'tx-3',
    description: 'Rendimientos Cuentas de Ahorro / Sofipo',
    amount: 85,
    type: 'income',
    category: 'Rendimientos',
    date: '2026-09-25',
    paymentMethod: 'transferencia',
    notes: 'Intereses generados del mes'
  },
  {
    id: 'tx-4',
    description: 'Renta del Departamento',
    amount: 700,
    type: 'expense',
    category: 'Vivienda',
    date: '2026-09-02',
    paymentMethod: 'transferencia',
    notes: 'Incluye cuota condominal'
  },
  {
    id: 'tx-5',
    description: 'Supermercado Quincenal',
    amount: 245,
    type: 'expense',
    category: 'Alimentación',
    date: '2026-09-05',
    paymentMethod: 'tarjeta_debito',
    notes: 'Despensa básica, frutas y verduras'
  },
  {
    id: 'tx-6',
    description: 'Supermercado Segunda Quincena',
    amount: 195,
    type: 'expense',
    category: 'Alimentación',
    date: '2026-09-20',
    paymentMethod: 'tarjeta_debito',
    notes: 'Despensa regular'
  },
  {
    id: 'tx-7',
    description: 'Cena con Amigos y Restaurante',
    amount: 85,
    type: 'expense',
    category: 'Ocio y Salidas',
    date: '2026-09-08',
    paymentMethod: 'tarjeta_credito',
    notes: 'Restaurante italiano'
  },
  {
    id: 'tx-8',
    description: 'Entradas Concierto + Bebidas',
    amount: 140,
    type: 'expense',
    category: 'Ocio y Salidas',
    date: '2026-09-16',
    paymentMethod: 'tarjeta_credito',
    notes: 'Boletos para festival de fin de semana'
  },
  {
    id: 'tx-9',
    description: 'Recarga Gasolina y Peajes',
    amount: 130,
    type: 'expense',
    category: 'Transporte',
    date: '2026-09-10',
    paymentMethod: 'tarjeta_debito',
    notes: 'Gasolina tanque lleno'
  },
  {
    id: 'tx-10',
    description: 'Servicio de Internet Fibra + Luz',
    amount: 110,
    type: 'expense',
    category: 'Servicios',
    date: '2026-09-14',
    paymentMethod: 'tarjeta_debito',
    notes: 'Recibo mensual'
  },
  {
    id: 'tx-11',
    description: 'Aportación ETF S&P 500 / VOO',
    amount: 300,
    type: 'expense',
    category: 'Inversión Directa',
    date: '2026-09-15',
    paymentMethod: 'transferencia',
    notes: 'Aportación periódica automática'
  },
  {
    id: 'tx-12',
    description: 'Consulta Dental y Limpieza',
    amount: 90,
    type: 'expense',
    category: 'Salud y Cuidado',
    date: '2026-09-18',
    paymentMethod: 'tarjeta_debito',
    notes: 'Revisión anual'
  },
  {
    id: 'tx-13',
    description: 'Suscripciones Streaming (Netflix/Spotify)',
    amount: 32,
    type: 'expense',
    category: 'Ocio y Salidas',
    date: '2026-09-22',
    paymentMethod: 'tarjeta_credito',
    notes: 'Planes familiares'
  }
];

export const INITIAL_BUDGETS = {
  'Alimentación': 450,
  'Vivienda': 700,
  'Servicios': 180,
  'Transporte': 200,
  'Ocio y Salidas': 180, // Notice total spent is 85+140+32 = 257, so it triggers an alert (> 100%)!
  'Salud y Cuidado': 140,
  'Educación': 120,
  'Compras': 150,
  'Inversión Directa': 300,
  'Otros Gastos': 100,
};

export const INVESTMENT_STRATEGIES = [
  {
    id: 'renta_fija',
    name: 'Renta Fija / Cuentas de Alto Rendimiento',
    risk: 'Bajo',
    riskColor: 'emerald',
    expectedReturn: '9% - 11% anual',
    description: 'Ideal para tu Fondo de Emergencia y metas a corto plazo (< 1 año). Capital garantizado y liquidez diaria o semanal.',
    instruments: ['CETES Directo', 'SOFIPOs (Nu, Finsus, Klar)', 'HYSA Cuentas Remuneradas', 'Bonos del Tesoro'],
    suitableFor: 'Fondo de emergencia (3 a 6 meses de gastos)'
  },
  {
    id: 'fondos_indexados',
    name: 'Fondos Indexados & ETFs (S&P 500 / Global)',
    risk: 'Moderado',
    riskColor: 'indigo',
    expectedReturn: '10% - 14% histórico',
    description: 'El motor principal para la creación de riqueza a mediano y largo plazo (> 3-5 años). Diversificación instantánea en las empresas más sólidas del mundo.',
    instruments: ['VOO / IVV (S&P 500)', 'VT (Mercado Global Total)', 'QQQ (Tecnología)', 'ACWI'],
    suitableFor: 'Crecimiento de patrimonio a largo plazo'
  },
  {
    id: 'fibras_inmobiliarias',
    name: 'FIBRAs / Real Estate Investment Trusts',
    risk: 'Moderado',
    riskColor: 'amber',
    expectedReturn: '7% - 9% dividendos + plusvalía',
    description: 'Inversión en bienes raíces comerciales e industriales sin comprar una propiedad completa. Genera flujo de efectivo pasivo periódico mediante dividendos.',
    instruments: ['FIBRA Monterrey (FMTY14)', 'FIBRA Uno (FUNO11)', 'FIBRA Prologis', 'VNQ (ETFs globales)'],
    suitableFor: 'Generación de ingresos pasivos recurrentes'
  },
  {
    id: 'retiro_ppr',
    name: 'Ahorro para el Retiro / PPR con Ventajas Fiscales',
    risk: 'Bajo a Moderado',
    riskColor: 'cyan',
    expectedReturn: '10% compuesto + deducciones de impuestos',
    description: 'Planes personales de retiro deducibles de impuestos. El gobierno te devuelve dinero en tu declaración anual por cada peso ahorrado para tu jubilación.',
    instruments: ['PPR No Discrecional (Actinver, Fintual)', 'Afores / Aportaciones Voluntarias', 'IRAs / 401(k) si aplica'],
    suitableFor: 'Jubilación y optimización de impuestos anuales'
  }
];
