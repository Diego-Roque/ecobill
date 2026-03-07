// ── data/Consumptiondata.ts ───────────────────────────────────────────────────
// Única fuente de verdad para todos los datos de consumo.
// Edita RAW para cambiar días, semanas y meses se derivan automáticamente.

export type TabOption = 'Diario' | 'Semanal' | 'Mensual';

export interface ChartEntry {
    label: string;
    value: number;
}

// ── Labels de días ────────────────────────────────────────────────────────────
const DAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

// ── Data diaria por mes ───────────────────────────────────────────────────────
const RAW: { month: string; days: number[] }[] = [
    {
        month: 'Ene',
        days: [
            310, 420, 390, 480, 510, 620, 350,   // S1
            290, 400, 370, 500, 470, 590, 310,   // S2
            330, 440, 410, 520, 490, 640, 360,   // S3
            300, 410, 380, 495, 460, 605, 325,   // S4
            320, 430, 400,                        // S5 parcial
        ],
    },
    {
        month: 'Feb',
        days: [
            340, 450, 420, 510, 500, 660, 370,   // S1
            305, 415, 385, 510, 480, 600, 320,   // S2
            355, 465, 430, 535, 505, 655, 375,   // S3
            315, 425, 395, 505, 475, 615, 335,   // S4
        ],
    },
    {
        month: 'Mar',
        days: [
            320, 410, 380, 520, 460, 610, 340,   // S1
            290, 430, 360, 500, 480, 590, 330,   // S2
            315,                                  // S3 parcial (día 15)
        ],
    },
];

// ── Tipos internos ────────────────────────────────────────────────────────────
interface MonthSummary {
    label: string;
    total: number;
    weeks: ChartEntry[];
    days: ChartEntry[];
}

// ── Derivar semanas y totales por mes ─────────────────────────────────────────
export const MONTHS: MonthSummary[] = RAW.map((m) => {
    const days: ChartEntry[] = m.days.map((v, i) => ({
        label: DAY_LABELS[i % 7],
        value: v,
    }));

    const weeks: ChartEntry[] = [];
    let i = 0, weekNum = 1;
    while (i < m.days.length) {
        const slice = m.days.slice(i, i + 7);
        weeks.push({ label: `S${weekNum}`, value: slice.reduce((a, b) => a + b, 0) });
        i += 7;
        weekNum++;
    }

    return { label: m.month, total: m.days.reduce((a, b) => a + b, 0), weeks, days };
});

// ── Mes actual (último en el array) ──────────────────────────────────────────
const CURRENT = MONTHS[MONTHS.length - 1];
const PREV    = MONTHS[MONTHS.length - 2];

// ── Umbrales eficientes por tab ───────────────────────────────────────────────
export const THRESHOLD: Record<TabOption, number> = {
    Diario:  450,
    Semanal: 2700,
    Mensual: 9500,
};

// ── Datos para las gráficas por tab ──────────────────────────────────────────
export const CHART_DATA: Record<TabOption, ChartEntry[]> = {
    Diario:  CURRENT.days.slice(-7),
    Semanal: CURRENT.weeks,
    Mensual: MONTHS.map((m) => ({ label: m.label, value: m.total })),
};

// ── Conteo de períodos sobre umbral por tab ───────────────────────────────────
export const OVER_COUNT: Record<TabOption, number> = {
    Diario:  CHART_DATA.Diario.filter((d)  => d.value > THRESHOLD.Diario).length,
    Semanal: CHART_DATA.Semanal.filter((d) => d.value > THRESHOLD.Semanal).length,
    Mensual: CHART_DATA.Mensual.filter((d) => d.value > THRESHOLD.Mensual).length,
};

// ── Stats para ConsumoCardMonth ───────────────────────────────────────────────
const T2_LIMIT = 15_000;

export const CURRENT_MONTH_STATS = {
    monthName:        CURRENT.label,
    liters:           CURRENT.total,
    changePercent:    Math.round(((CURRENT.total - PREV.total) / PREV.total) * 100),
    proximityPercent: Math.round((CURRENT.total / T2_LIMIT) * 100),
    litersRemaining:  T2_LIMIT - CURRENT.total,
};

// ── BillForecast: datos de factura en pesos ───────────────────────────────────
export const BILL_DAYS_IN_MONTH = 28;
export const BILL_LIMIT_T2      = 8_800;

export const HISTORICAL_BILL_MONTHS: number[][] = [
    [180, 370, 560, 740, 920, 1110, 1300, 1490, 1680, 1870,
        2060, 2250, 2440, 2620, 2800, 2990, 3180, 3370, 3560, 3740,
        3920, 4110, 4300, 4490, 4670, 4850, 5030, 5200],
    [200, 400, 600, 800, 1000, 1190, 1380, 1570, 1760, 1950,
        2140, 2330, 2520, 2710, 2890, 3070, 3260, 3450, 3640, 3830,
        4010, 4200, 4380, 4570, 4750, 4930, 5110, 5300],
    [160, 330, 500, 670, 840, 1010, 1190, 1370, 1550, 1730,
        1910, 2090, 2270, 2450, 2620, 2800, 2980, 3160, 3340, 3510,
        3690, 3870, 4050, 4220, 4400, 4570, 4750, 4900],
];

export const CURRENT_BILL_RAW: (number | null)[] = [
    190,  390,  610,  820,  1040, 1260, 1480,
    1720, 1960, 2200, 2450, 2700, 2960, 3220, 3500,
    null, null, null, null, null, null, null,
    null, null, null, null, null, null,
];

// ── Cálculos estáticos del pronóstico ────────────────────────────────────────
// Calculados aquí (módulo, no componente) → mismo valor en servidor y cliente
// → sin hydration mismatch.

export const BILL_PROJECTION: number[] = Array.from({ length: BILL_DAYS_IN_MONTH }, (_, i) => {
    const vals = HISTORICAL_BILL_MONTHS.map(m => m[i]);
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
});

const _lastRealIndex = CURRENT_BILL_RAW.reduce<number>((last, v, i) => (v !== null ? i : last), 0);
const _lastReal      = (CURRENT_BILL_RAW[_lastRealIndex] ?? 0) as number;

export const BILL_FORECAST_END  = Math.round((_lastReal / (_lastRealIndex + 1)) * BILL_DAYS_IN_MONTH);
export const BILL_PROJECTED_END = BILL_PROJECTION[BILL_DAYS_IN_MONTH - 1];
export const BILL_SAVING        = BILL_FORECAST_END < BILL_PROJECTED_END
    ? BILL_PROJECTED_END - BILL_FORECAST_END
    : 0;
export const BILL_PERFORMANCE: 'good' | 'bad' | 'neutral' =
    _lastReal === 0                              ? 'neutral' :
        _lastReal <= BILL_PROJECTION[_lastRealIndex] ? 'good'    : 'bad';