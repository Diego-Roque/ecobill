'use client';

import { useEffect, useState } from 'react';
import {
    ResponsiveContainer, Area, Line, XAxis, YAxis,
    CartesianGrid, Tooltip, ReferenceLine, ComposedChart,
} from 'recharts';
import StatCard from "@/components/dashboard/StatCard";
import {
    CURRENT_BILL_RAW,
    BILL_DAYS_IN_MONTH,
    BILL_LIMIT_T2,
    BILL_PROJECTION,
    BILL_FORECAST_END,
    BILL_PROJECTED_END,
    BILL_SAVING,
    BILL_PERFORMANCE,
    CURRENT_TIER,
    NEXT_TIER,
} from "@/data/Consumptiondata";

// ── Escala dinámica del eje Y ─────────────────────────────────────────────────
const REFERENCE_LIMIT = CURRENT_TIER.maxM3 === Infinity
    ? BILL_LIMIT_T2
    : Math.round(CURRENT_TIER.maxM3 * CURRENT_TIER.pricePerM3);
const REFERENCE_LABEL = CURRENT_TIER.maxM3 === Infinity
    ? 'Ref. T2'
    : `Límite ${CURRENT_TIER.id}`;

const _allValues = [
    ...CURRENT_BILL_RAW.filter((v): v is number => v !== null),
    ...BILL_PROJECTION,
    REFERENCE_LIMIT,
];
const _maxValue  = Math.max(..._allValues);
const Y_MAX      = Math.ceil(_maxValue * 1.25 / 50) * 50; // redondear al 50 superior con 25% margen

// Generar ticks legibles según el rango
function buildTicks(max: number): number[] {
    const step = max <= 200 ? 50 : max <= 500 ? 100 : max <= 1000 ? 200 : 500;
    const ticks = [0];
    let v = step;
    while (v <= max) { ticks.push(v); v += step; }
    return ticks;
}
const Y_TICKS = buildTicks(Y_MAX);

// ── Chart data ────────────────────────────────────────────────────────────────
const CHART_DATA = Array.from({ length: BILL_DAYS_IN_MONTH }, (_, i) => ({
    day:        `D${i + 1}`,
    real:       CURRENT_BILL_RAW[i] ?? null,
    projection: BILL_PROJECTION[i],
}));

// ── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-slate-100 rounded-xl shadow-lg px-3 py-2 text-xs">
            <p className="font-semibold text-slate-600 mb-1">{label}</p>
            {payload.map((p: any) =>
                p.value != null ? (
                    <p key={p.dataKey} style={{ color: p.color }} className="font-medium">
                        {p.name}:{' '}
                        <span className="text-slate-700">${p.value.toLocaleString('es-MX')}</span>
                    </p>
                ) : null
            )}
        </div>
    );
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function BillForecast() {
    const [visible,    setVisible]    = useState(false);
    const [chartReady, setChartReady] = useState(false);

    useEffect(() => {
        const t1 = setTimeout(() => setVisible(true),    100);
        const t2 = setTimeout(() => setChartReady(true), 400);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    const realColor  = BILL_PERFORMANCE === 'good' ? '#22c55e' : BILL_PERFORMANCE === 'bad' ? '#ef4444' : '#2dd4bf';
    const gradientId = BILL_PERFORMANCE === 'good' ? 'gradGreen' : BILL_PERFORMANCE === 'bad' ? 'gradRed' : 'gradTeal';

    const performanceLabel =
        BILL_PERFORMANCE === 'good' ? `Ahorro est. -$${BILL_SAVING.toLocaleString('es-MX')}` :
            BILL_PERFORMANCE === 'bad'  ? 'Por encima del promedio' : 'Sin datos';
    const performanceColor =
        BILL_PERFORMANCE === 'good' ? '#22c55e' :
            BILL_PERFORMANCE === 'bad'  ? '#ef4444' : '#94a3b8';

    return (
        <div
            className="bg-white rounded-3xl p-5 shadow-sm w-full mx-auto"
            style={{
                opacity:    visible ? 1 : 0,
                transform:  visible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
            }}
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <div
                    className="w-5 h-5 rounded-full border-2"
                    style={{ borderColor: realColor, borderTopColor: 'transparent' }}
                />
                <h2 className="font-bold text-slate-800 text-base">Pronóstico de factura de agua</h2>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-2 mb-5">
                <StatCard
                    label="Proyectado"
                    value={`$${BILL_FORECAST_END.toLocaleString('es-MX')}`}
                    visible={visible}
                    delay={100}
                />
                <StatCard
                    label="Tarifa actual"
                    value={CURRENT_TIER.id}
                    visible={visible}
                    delay={200}
                />
                <StatCard
                    label={BILL_PERFORMANCE === 'good' ? 'Ahorro est.' : 'Exceso est.'}
                    value={
                        BILL_PERFORMANCE === 'good'
                            ? `-$${BILL_SAVING.toLocaleString('es-MX')}`
                            : `+$${Math.abs(BILL_FORECAST_END - BILL_PROJECTED_END).toLocaleString('es-MX')}`
                    }
                    highlight
                    visible={visible}
                    delay={300}
                />
            </div>

            {/* Performance badge */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: performanceColor }} />
                    <span className="text-xs font-medium" style={{ color: performanceColor }}>
                        {performanceLabel}
                    </span>
                </div>
                {NEXT_TIER && (
                    <span className="text-xs text-slate-400">
                        Siguiente tier:{' '}
                        <span className="font-semibold text-slate-600">
                            {NEXT_TIER.id} · ${NEXT_TIER.pricePerM3}/m³
                        </span>
                    </span>
                )}
            </div>

            {/* Chart */}
            <div
                style={{
                    opacity:    chartReady ? 1 : 0,
                    transform:  chartReady ? 'translateY(0)' : 'translateY(10px)',
                    transition: 'opacity 0.8s ease, transform 0.8s ease',
                }}
            >
                <ResponsiveContainer width="100%" height={200}>
                    <ComposedChart data={CHART_DATA} margin={{ top: 8, right: 48, left: -8, bottom: 0 }}>
                        <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor={realColor} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={realColor} stopOpacity={0.02} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

                        <XAxis
                            dataKey="day"
                            tick={{ fontSize: 10, fill: '#94a3b8' }}
                            tickLine={false}
                            axisLine={false}
                            interval={3}
                        />
                        <YAxis
                            tick={{ fontSize: 10, fill: '#94a3b8' }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) => `$${v}`}
                            domain={[0, Y_MAX]}
                            ticks={Y_TICKS}
                            width={36}
                        />

                        <Tooltip content={<CustomTooltip />} />

                        <ReferenceLine
                            y={REFERENCE_LIMIT}
                            stroke="#f59e0b"
                            strokeDasharray="5 5"
                            strokeWidth={1.5}
                            label={{
                                value: REFERENCE_LABEL,
                                position: 'right',
                                fontSize: 10,
                                fill: '#f59e0b',
                                offset: 4,
                            }}
                        />

                        <Line
                            type="monotone"
                            dataKey="projection"
                            name="Promedio histórico"
                            stroke="#94a3b8"
                            strokeWidth={1.5}
                            strokeDasharray="5 4"
                            dot={false}
                            activeDot={{ r: 3, fill: '#94a3b8' }}
                            animationDuration={1600}
                            animationEasing="ease-out"
                        />
                        <Area
                            type="monotone"
                            dataKey="real"
                            name="Consumo real"
                            stroke={realColor}
                            strokeWidth={2.5}
                            fill={`url(#${gradientId})`}
                            dot={false}
                            activeDot={{ r: 4, fill: realColor }}
                            animationDuration={1200}
                            animationEasing="ease-out"
                            connectNulls={false}
                        />
                    </ComposedChart>
                </ResponsiveContainer>

                {/* Legend */}
                <div className="flex items-center justify-center gap-5 mt-2">
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: realColor }} />
                        <span className="text-xs text-slate-500">Consumo real</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="inline-block w-5 border-t-2 border-dashed border-slate-400" />
                        <span className="text-xs text-slate-500">Promedio histórico</span>
                    </div>
                </div>
            </div>
        </div>
    );
}