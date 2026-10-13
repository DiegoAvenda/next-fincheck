export const EXPENSE_CATEGORIES = [
  { id: 'AlimentaciÃ³n', label: 'AlimentaciÃ³n', icon: 'Utensils', color: '#F59E0B', group: 'needs', defaultBudget: 450 },
  { id: 'Vivienda', label: 'Vivienda y Renta', icon: 'Home', color: '#3B82F6', group: 'needs', defaultBudget: 700 },
  { id: 'Servicios', label: 'Servicios e Internet', icon: 'Zap', color: '#06B6D4', group: 'needs', defaultBudget: 180 },
  { id: 'Transporte', label: 'Transporte y Movilidad', icon: 'Car', color: '#8B5CF6', group: 'needs', defaultBudget: 220 },
  { id: 'Ocio y Salidas', label: 'Ocio, Salidas y Streaming', icon: 'Film', color: '#EC4899', group: 'wants', defaultBudget: 180 },
  { id: 'Salud y Cuidado', label: 'Salud y Bienestar', icon: 'HeartPulse', color: '#10B981', group: 'needs', defaultBudget: 140 },
  { id: 'EducaciÃ³n', label: 'EducaciÃ³n y Cursos', icon: 'GraduationCap', color: '#6366F1', group: 'savings', defaultBudget: 120 },
  { id: 'Compras', label: 'Compras Personales', icon: 'ShoppingBag', color: '#F97316', group: 'wants', defaultBudget: 160 },
  { id: 'InversiÃ³n Directa', label: 'InversiÃ³n Directa', icon: 'TrendingUp', color: '#10B981', group: 'savings', defaultBudget: 300 },
  { id: 'Otros Gastos', label: 'Otros Gastos', icon: 'MoreHorizontal', color: '#64748B', group: 'wants', defaultBudget: 100 },
];

export const INCOME_CATEGORIES = [
  { id: 'Salario', label: 'Salario / NÃ³mina', icon: 'Briefcase', color: '#10B981' },
  { id: 'Freelance', label: 'Freelance / Negocio', icon: 'Laptop', color: '#06B6D4' },
  { id: 'Rendimientos', label: 'Rendimientos e Inversiones', icon: 'PiggyBank', color: '#8B5CF6' },
  { id: 'Otros Ingresos', label: 'Otros Ingresos', icon: 'PlusCircle', color: '#F59E0B' },
];

export const PAYMENT_METHODS = [
  { id: 'tarjeta_debito', label: 'Tarjeta de DÃ©bito' },
  { id: 'tarjeta_credito', label: 'Tarjeta de CrÃ©dito' },
  { id: 'transferencia', label: 'Transferencia Bancaria' },
  { id: 'efectivo', label: 'Efectivo' },
];

export const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-1',
    description: 'Monthly Payroll Payment',
    amount: 3200,
    type: 'income',
    category: 'Salario',
    date: '2026-09-01',
    paymentMethod: 'transferencia',
    notes: 'Consolidated biweekly deposit'
  },
  {
    id: 'tx-2',
    description: 'Freelance Frontend Project',
    amount: 650,
    type: 'income',
    category: 'Freelance',
    date: '2026-09-12',
    paymentMethod: 'transferencia',
    notes: 'DiseÃ±o y optimizaciÃ³n web'
  },
  {
    id: 'tx-3',
    description: 'Savings Account / Sofipo Returns',
    amount: 85,
    type: 'income',
    category: 'Rendimientos',
    date: '2026-09-25',
    paymentMethod: 'transferencia',
    notes: 'Interest earned this month'
  },
  {
    id: 'tx-4',
    description: 'Apartment Rent',
    amount: 700,
    type: 'expense',
    category: 'Vivienda',
    date: '2026-09-02',
    paymentMethod: 'transferencia',
    notes: 'Includes condo fee'
  },
  {
    id: 'tx-5',
    description: 'Biweekly Grocery',
    amount: 245,
    type: 'expense',
    category: 'AlimentaciÃ³n',
    date: '2026-09-05',
    paymentMethod: 'tarjeta_debito',
    notes: 'Despensa bÃ¡sica, frutas y verduras'
  },
  {
    id: 'tx-6',
    description: 'Second Biweekly Grocery',
    amount: 195,
    type: 'expense',
    category: 'AlimentaciÃ³n',
    date: '2026-09-20',
    paymentMethod: 'tarjeta_debito',
    notes: 'Regular groceries'
  },
  {
    id: 'tx-7',
    description: 'Dinner with Friends & Restaurant',
    amount: 85,
    type: 'expense',
    category: 'Ocio y Salidas',
    date: '2026-09-08',
    paymentMethod: 'tarjeta_credito',
    notes: 'Italian restaurant'
  },
  {
    id: 'tx-8',
    description: 'Concert Tickets + Drinks',
    amount: 140,
    type: 'expense',
    category: 'Ocio y Salidas',
    date: '2026-09-16',
    paymentMethod: 'tarjeta_credito',
    notes: 'Weekend festival tickets'
  },
  {
    id: 'tx-9',
    description: 'Gas Refill & Tolls',
    amount: 130,
    type: 'expense',
    category: 'Transporte',
    date: '2026-09-10',
    paymentMethod: 'tarjeta_debito',
    notes: 'Full tank gas'
  },
  {
    id: 'tx-10',
    description: 'Fiber Internet + Electricity',
    amount: 110,
    type: 'expense',
    category: 'Servicios',
    date: '2026-09-14',
    paymentMethod: 'tarjeta_debito',
    notes: 'Monthly bill'
  },
  {
    id: 'tx-11',
    description: 'AportaciÃ³n ETF S&P 500 / VOO',
    amount: 300,
    type: 'expense',
    category: 'InversiÃ³n Directa',
    date: '2026-09-15',
    paymentMethod: 'transferencia',
    notes: 'AportaciÃ³n periÃ³dica automÃ¡tica'
  },
  {
    id: 'tx-12',
    description: 'Dental Checkup & Cleaning',
    amount: 90,
    type: 'expense',
    category: 'Salud y Cuidado',
    date: '2026-09-18',
    paymentMethod: 'tarjeta_debito',
    notes: 'RevisiÃ³n anual'
  },
  {
    id: 'tx-13',
    description: 'Streaming Subscriptions (Netflix/Spotify)',
    amount: 32,
    type: 'expense',
    category: 'Ocio y Salidas',
    date: '2026-09-22',
    paymentMethod: 'tarjeta_credito',
    notes: 'Family plans'
  },
  {
    id: 'tx-14',
    description: 'Pago de NÃ³mina Mensual',
    amount: 3200,
    type: 'income',
    category: 'Salario',
    date: '2026-10-01',
    paymentMethod: 'transferencia',
    notes: 'DepÃ³sito quincenal consolidado'
  },
  {
    id: 'tx-15',
    description: 'Apartment Rent',
    amount: 700,
    type: 'expense',
    category: 'Vivienda',
    date: '2026-10-02',
    paymentMethod: 'transferencia',
    notes: 'Includes condo fee'
  },
  {
    id: 'tx-16',
    description: 'Weekly Grocery',
    amount: 228,
    type: 'expense',
    category: 'AlimentaciÃ³n',
    date: '2026-10-04',
    paymentMethod: 'tarjeta_debito',
    notes: 'Despensa bÃ¡sica de la semana'
  },
  {
    id: 'tx-17',
    description: 'Gas Refill',
    amount: 135,
    type: 'expense',
    category: 'Transporte',
    date: '2026-10-06',
    paymentMethod: 'tarjeta_debito',
    notes: 'Full tank'
  },
  {
    id: 'tx-18',
    description: 'Cena con Amigos',
    amount: 92,
    type: 'expense',
    category: 'Ocio y Salidas',
    date: '2026-10-07',
    paymentMethod: 'tarjeta_credito',
    notes: 'Local restaurant'
  },
  {
    id: 'tx-19',
    description: 'AportaciÃ³n ETF S&P 500 / VOO',
    amount: 300,
    type: 'expense',
    category: 'InversiÃ³n Directa',
    date: '2026-10-08',
    paymentMethod: 'transferencia',
    notes: 'AportaciÃ³n periÃ³dica automÃ¡tica'
  },
  {
    id: 'tx-20',
    description: 'Freelance Landing Page Project',
    amount: 420,
    type: 'income',
    category: 'Freelance',
    date: '2026-10-09',
    paymentMethod: 'transferencia',
    notes: '50% advance'
  }
];

export const INITIAL_BUDGETS = {
  'AlimentaciÃ³n': 450,
  'Vivienda': 700,
  'Servicios': 180,
  'Transporte': 200,
  'Ocio y Salidas': 180, // Notice total spent is 85+140+32 = 257, so it triggers an alert (> 100%)!
  'Salud y Cuidado': 140,
  'EducaciÃ³n': 120,
  'Compras': 150,
  'InversiÃ³n Directa': 300,
  'Otros Gastos': 100,
};

export const INVESTMENT_STRATEGIES = [
  {
    id: 'renta_fija',
    name: 'Renta Fija / Cuentas de Alto Rendimiento',
    risk: 'Bajo',
    riskColor: 'emerald',
    expectedReturn: '9% - 11% anual',
    description: 'Ideal para tu Fondo de Emergencia y metas a corto plazo (< 1 aÃ±o). Capital garantizado y liquidez diaria o semanal.',
    instruments: ['CETES Directo', 'SOFIPOs (Nu, Finsus, Klar)', 'HYSA Cuentas Remuneradas', 'Bonos del Tesoro'],
    suitableFor: 'Fondo de emergencia (3 a 6 meses de gastos)'
  },
  {
    id: 'fondos_indexados',
    name: 'Fondos Indexados & ETFs (S&P 500 / Global)',
    risk: 'Moderado',
    riskColor: 'indigo',
    expectedReturn: '10% - 14% histÃ³rico',
    description: 'El motor principal para la creaciÃ³n de riqueza a mediano y largo plazo (> 3-5 aÃ±os). DiversificaciÃ³n instantÃ¡nea en las empresas mÃ¡s sÃ³lidas del mundo.',
    instruments: ['VOO / IVV (S&P 500)', 'VT (Mercado Global Total)', 'QQQ (TecnologÃ­a)', 'ACWI'],
    suitableFor: 'Crecimiento de patrimonio a largo plazo'
  },
  {
    id: 'fibras_inmobiliarias',
    name: 'FIBRAs / Real Estate Investment Trusts',
    risk: 'Moderado',
    riskColor: 'amber',
    expectedReturn: '7% - 9% dividendos + plusvalÃ­a',
    description: 'InversiÃ³n en bienes raÃ­ces comerciales e industriales sin comprar una propiedad completa. Genera flujo de efectivo pasivo periÃ³dico mediante dividendos.',
    instruments: ['FIBRA Monterrey (FMTY14)', 'FIBRA Uno (FUNO11)', 'FIBRA Prologis', 'VNQ (ETFs globales)'],
    suitableFor: 'GeneraciÃ³n de ingresos pasivos recurrentes'
  },
  {
    id: 'retiro_ppr',
    name: 'Ahorro para el Retiro / PPR con Ventajas Fiscales',
    risk: 'Bajo a Moderado',
    riskColor: 'cyan',
    expectedReturn: '10% compuesto + deducciones de impuestos',
    description: 'Planes personales de retiro deducibles de impuestos. El gobierno te devuelve dinero en tu declaraciÃ³n anual por cada peso ahorrado para tu jubilaciÃ³n.',
    instruments: ['PPR No Discrecional (Actinver, Fintual)', 'Afores / Aportaciones Voluntarias', 'IRAs / 401(k) si aplica'],
    suitableFor: 'JubilaciÃ³n y optimizaciÃ³n de impuestos anuales'
  }
];

