// ── data/Consumptiondata.ts ───────────────────────────────────────────────────
// Única fuente de verdad. Edita solo RAW → todo lo demás se deriva.

export type TabOption = 'Diario' | 'Semanal' | 'Mensual';

export interface ChartEntry {
    label: string;
    value: number;
}

// ── Tiers ─────────────────────────────────────────────────────────────────────
export interface Tier {
    id:         'T1' | 'T2' | 'T3' | 'T4';
    label:      string;
    desc:       string;
    minM3:      number;
    maxM3:      number;       // Infinity para T4
    pricePerM3: number;
}

export const TIERS: Tier[] = [
    { id: 'T1', label: 'T1 – Básico',  desc: 'Consumo bajo',     minM3: 0,  maxM3: 15,       pricePerM3: 10 },
    { id: 'T2', label: 'T2 – Normal',  desc: 'Consumo normal',   minM3: 16, maxM3: 30,       pricePerM3: 15 },
    { id: 'T3', label: 'T3 – Alto',    desc: 'Consumo alto',     minM3: 31, maxM3: 60,       pricePerM3: 20 },
    { id: 'T4', label: 'T4 – Muy alto',desc: 'Consumo muy alto', minM3: 61, maxM3: Infinity, pricePerM3: 25 },
];

export function getTierForM3(m3: number): Tier {
    return TIERS.find(t => m3 >= t.minM3 && m3 <= t.maxM3) ?? TIERS[TIERS.length - 1];
}

// Costo en pesos para un volumen acumulado en m³ (tarifa progresiva)
function calcCostMXN(m3: number): number {
    let remaining = m3;
    let cost = 0;
    for (const tier of TIERS) {
        if (remaining <= 0) break;
        const capacity = tier.maxM3 === Infinity ? remaining : tier.maxM3 - tier.minM3 + 1;
        const consumed = Math.min(remaining, capacity);
        cost += consumed * tier.pricePerM3;
        remaining -= consumed;
    }
    return Math.round(cost * 100) / 100;
}

// ── Labels de días ────────────────────────────────────────────────────────────
const DAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

// ── RAW: única fuente de verdad (litros por día) ──────────────────────────────
// El último mes es el mes actual. Los días sin datos no se agregan.
const RAW: { month: string; days: number[] }[] = [
    {
        month: 'Ene',
        // Familia 4 personas, ~720 L/día promedio, fines de semana +20%
        // Total: 22,629 L = 22.63 m³ → T2
        days: [
            732, 620, 666, 656, 750, 886, 934,   // S1
            631, 692, 621, 655, 707, 744, 782,   // S2
            734, 715, 656, 723, 763, 740, 915,   // S3
            743, 677, 644, 790, 677, 759, 760,   // S4
            770, 725, 762,                        // S5 parcial
        ],
    },
    {
        month: 'Feb',
        // Total: 21,319 L = 21.32 m³ → T2
        days: [
            770, 733, 815, 704, 736, 946, 899,   // S1
            794, 741, 765, 642, 676, 825, 778,   // S2
            677, 652, 685, 752, 701, 843, 807,   // S3
            683, 808, 754, 747, 665, 924, 797,   // S4
        ],
    },
    {
        month: 'Mar',
        // 15 días registrados. Total parcial: 11,157 L = 11.16 m³ → T1 (en camino a T2)
        days: [
            675, 784, 722, 707, 730, 910, 895,   // S1
            648, 612, 663, 655, 645, 931, 917,   // S2
            663,                                  // S3 parcial (día 15)
        ],
    },
];

// ── Derivar semanas y totales ─────────────────────────────────────────────────
interface MonthSummary {
    label:   string;
    total:   number;    // litros
    totalM3: number;    // m³
    weeks:   ChartEntry[];
    days:    ChartEntry[];
    rawDays: number[];  // litros crudos, para derivar BillForecast
}

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

    const total = m.days.reduce((a, b) => a + b, 0);
    return { label: m.month, total, totalM3: total / 1000, weeks, days, rawDays: m.days };
});

const CURRENT = MONTHS[MONTHS.length - 1];
const PREV    = MONTHS[MONTHS.length - 2];

// ── Tier del mes actual ───────────────────────────────────────────────────────
export const CURRENT_TIER    = getTierForM3(CURRENT.totalM3);
export const NEXT_TIER       = TIERS[TIERS.indexOf(CURRENT_TIER) + 1] ?? null;
export const M3_TO_NEXT_TIER = NEXT_TIER ? NEXT_TIER.minM3 - CURRENT.totalM3 : null;

// ── Umbrales de gráfica (litros, proporcionales al tier actual) ───────────────
export const THRESHOLD: Record<TabOption, number> = {
    Diario:  CURRENT_TIER.maxM3 === Infinity
        ? Math.round((TIERS[2].maxM3 * 1000) / 30)  // T4: referencia en T3
        : Math.round((CURRENT_TIER.maxM3 * 1000) / 30),
    Semanal: CURRENT_TIER.maxM3 === Infinity
        ? Math.round((TIERS[2].maxM3 * 1000) / 4)
        : Math.round((CURRENT_TIER.maxM3 * 1000) / 4),
    Mensual: CURRENT_TIER.maxM3 === Infinity
        ? TIERS[2].maxM3 * 1000
        : CURRENT_TIER.maxM3 * 1000,
};

export const CHART_DATA: Record<TabOption, ChartEntry[]> = {
    Diario:  CURRENT.days.slice(-7),
    Semanal: CURRENT.weeks,
    Mensual: MONTHS.map((m) => ({ label: m.label, value: m.total })),
};

export const OVER_COUNT: Record<TabOption, number> = {
    Diario:  CHART_DATA.Diario.filter((d)  => d.value > THRESHOLD.Diario).length,
    Semanal: CHART_DATA.Semanal.filter((d) => d.value > THRESHOLD.Semanal).length,
    Mensual: CHART_DATA.Mensual.filter((d) => d.value > THRESHOLD.Mensual).length,
};

// ── Stats ConsumoCardMonth ────────────────────────────────────────────────────
export const CURRENT_MONTH_STATS = {
    monthName:        CURRENT.label,
    liters:           CURRENT.total,
    m3:               CURRENT.totalM3,
    changePercent:    Math.round(((CURRENT.total - PREV.total) / PREV.total) * 100),
    proximityPercent: CURRENT_TIER.maxM3 === Infinity
        ? 100
        : Math.round((CURRENT.totalM3 / CURRENT_TIER.maxM3) * 100),
    litersRemaining:  CURRENT_TIER.maxM3 === Infinity
        ? null
        : Math.round((CURRENT_TIER.maxM3 - CURRENT.totalM3) * 1000),
    tierId:           CURRENT_TIER.id,
    tierLabel:        CURRENT_TIER.label,
};

// ── MiHogarCard ───────────────────────────────────────────────────────────────
function buildTarifaRows(m3: number, currentTierId: string) {
    const rows = [];
    let remaining = m3;
    for (const tier of TIERS) {
        if (remaining <= 0) break;
        const capacity = tier.maxM3 === Infinity ? remaining : tier.maxM3 - tier.minM3 + 1;
        const consumed = parseFloat(Math.min(remaining, capacity).toFixed(3));
        const amount   = Math.round(consumed * tier.pricePerM3 * 100) / 100;
        rows.push({
            id:           tier.id,
            label:        tier.label,
            detail:       `${consumed.toFixed(2)} m³ × $${tier.pricePerM3}/m³`,
            amount,
            isCurrent:    tier.id === currentTierId,
            expandedText: tier.id === currentTierId
                ? `Tu hogar está en este tramo. ${tier.desc}.`
                : undefined,
            expandedRange: `Rango: ${tier.minM3} – ${tier.maxM3 === Infinity ? '∞' : tier.maxM3} m³`,
        });
        remaining -= consumed;
    }
    return rows;
}

export const MIHOGAR_DATA = {
    tipoToma:    `Doméstica ${CURRENT_TIER.id}`,
    tarifa:      CURRENT_TIER.id,
    tarifas:     buildTarifaRows(CURRENT.totalM3, CURRENT_TIER.id),
    otrosCargos: [
        { label: 'Drenaje',          amount: 38.00 },
        { label: 'Saneamiento',      amount: 52.00 },
        { label: 'Servicio medidor', amount: 20.00 },
    ],
};

// ── BillForecast ──────────────────────────────────────────────────────────────
// CURRENT_BILL_RAW se deriva automáticamente desde RAW (Mar).
// Cada entrada es el costo acumulado en pesos hasta ese día.
// Los días sin datos (futuros) quedan como null.
export const BILL_DAYS_IN_MONTH = 28;

export const CURRENT_BILL_RAW: (number | null)[] = Array.from(
    { length: BILL_DAYS_IN_MONTH },
    (_, i) => {
        if (i >= CURRENT.rawDays.length) return null;          // día futuro
        const litersAccum = CURRENT.rawDays
            .slice(0, i + 1)
            .reduce((a, b) => a + b, 0);
        return Math.round(calcCostMXN(litersAccum / 1000));   // litros → m³ → pesos
    }
);

// Límite de referencia: costo del tope del tier actual
export const BILL_LIMIT_T2 = CURRENT_TIER.maxM3 === Infinity
    ? Math.round(calcCostMXN(TIERS[2].maxM3))   // T4: referencia en tope de T3
    : Math.round(calcCostMXN(CURRENT_TIER.maxM3));

// Deriva el historial de pesos acumulados desde los meses anteriores en RAW.
// Se normalizan a BILL_DAYS_IN_MONTH días: si el mes tiene más días se trunca,
// si tiene menos se escala proporcionalmente (interpolación lineal).
function buildHistoricalBillMonth(rawDays: number[]): number[] {
    return Array.from({ length: BILL_DAYS_IN_MONTH }, (_, i) => {
        // Mapear el día i (0-based, sobre 28) al índice proporcional del mes real
        const srcIndex = Math.min(
            Math.round((i / (BILL_DAYS_IN_MONTH - 1)) * (rawDays.length - 1)),
            rawDays.length - 1,
        );
        const litersAccum = rawDays.slice(0, srcIndex + 1).reduce((a, b) => a + b, 0);
        return Math.round(calcCostMXN(litersAccum / 1000));
    });
}

// Todos los meses excepto el actual (último) se usan como historial
export const HISTORICAL_BILL_MONTHS: number[][] = MONTHS
    .slice(0, -1)
    .map(m => buildHistoricalBillMonth(m.rawDays));

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

// ── Consumo por zona ──────────────────────────────────────────────────────────
// Edita pct para cambiar la distribución. Deben sumar 100.
export interface ZonaConsumo {
    id:    string;
    label: string;
    pct:   number;   // porcentaje del total mensual
    color: string;   // color de la barra
}

export const ZONAS_PCT: ZonaConsumo[] = [
    { id: 'banos',    label: 'Baños',    pct: 42, color: '#2dd4bf' },
    { id: 'cocina',   label: 'Cocina',   pct: 25, color: '#38bdf8' },
    { id: 'lavadora', label: 'Lavadora', pct: 18, color: '#818cf8' },
    { id: 'jardin',   label: 'Jardín',   pct: 10, color: '#4ade80' },
    { id: 'otros',    label: 'Otros',    pct:  5, color: '#94a3b8' },
];

// Litros reales por zona derivados del total mensual actual
export const ZONAS_DATA = ZONAS_PCT.map(z => ({
    ...z,
    liters: Math.round(CURRENT.total * z.pct / 100),
}));