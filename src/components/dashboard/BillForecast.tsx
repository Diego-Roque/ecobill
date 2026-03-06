'use client'

import { useEffect, useState } from 'react';
import {
    ResponsiveContainer,
    Area,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
    ComposedChart,
} from 'recharts';
import StatCard from "@/components/dashboard/StatCard";


// TODO mamada de promedio
// ── Data ────────────────────────────────────────────────────────────────────
const generateData = () => {
    const days = 28;
    const realDays = 15; // data up to day 15
    const endReal = 4800;
    const endProjection = 8600;
    const limitT2 = 8800;

    return Array.from({ length: days }, (_, i) => {
        const day = i + 1;
        const realValue = day <= realDays ? Math.round((endReal / realDays) * day) : null;
        const projection = Math.round((endProjection / days) * day);
        return {
            day: `Dia ${day}`,
            real: realValue,
            projection,
            limit: limitT2,
        };
    });
};

const DATA = generateData();

// ── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-slate-100 rounded-xl shadow-lg px-3 py-2 text-xs">
            <p className="font-semibold text-slate-600 mb-1">{label}</p>
            {payload.map((p: any) => (
                p.value != null && (
                    <p key={p.dataKey} style={{ color: p.color }} className="font-medium">
                        {p.name}: <span className="text-slate-700">${p.value.toLocaleString()}</span>
                    </p>
                )
            ))}
        </div>
    );
};

export default function BillForecast() {
    const [visible, setVisible] = useState(false);
    const [chartReady, setChartReady] = useState(false);

    useEffect(() => {
        const t1 = setTimeout(() => setVisible(true), 100);
        const t2 = setTimeout(() => setChartReady(true), 400);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    return (
        <div
            className="bg-white rounded-3xl p-5 shadow-sm w-full  mx-auto"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
            }}
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 rounded-full border-2 border-teal-400 border-t-transparent" />
                <h2 className="font-bold text-slate-800 text-base">Pronostico de factura</h2>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-2 mb-5">
                <StatCard label="Proyectado"    value="$1480"  visible={visible} delay={100} />
                <StatCard label="Tarifa actual" value="T2"     visible={visible} delay={200} />
                <StatCard label="Si reduces 10%" value="-$220" highlight visible={visible} delay={300} />
            </div>

            {/* Chart */}
            <div
                style={{
                    opacity: chartReady ? 1 : 0,
                    transform: chartReady ? 'translateY(0)' : 'translateY(10px)',
                    transition: 'opacity 0.8s ease, transform 0.8s ease',
                }}
            >
                <ResponsiveContainer width="100%" height={200}>
                    <ComposedChart data={DATA} margin={{ top: 10, right: 16, left: -16, bottom: 0 }}>
                        <defs>
                            <linearGradient id="realGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor="#2dd4bf" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0.02} />
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
                            tickFormatter={(v) => `${v / 1000}k`}
                            domain={[0, 10000]}
                            ticks={[0, 3000, 5000, 8000, 10000]}
                        />

                        <Tooltip content={<CustomTooltip />} />

                        {/* Limit T2 reference line */}
                        <ReferenceLine
                            y={8800}
                            stroke="#f59e0b"
                            strokeDasharray="5 5"
                            strokeWidth={1.5}
                            label={{ value: 'Límite T2', position: 'right', fontSize: 10, fill: '#f59e0b' }}
                        />

                        {/* Real area */}
                        <Area
                            type="monotone"
                            dataKey="real"
                            name="Consumo real"
                            stroke="#2dd4bf"
                            strokeWidth={2.5}
                            fill="url(#realGrad)"
                            dot={false}
                            activeDot={{ r: 4, fill: '#2dd4bf' }}
                            animationDuration={1200}
                            animationEasing="ease-out"
                            connectNulls={false}
                        />

                        {/* Projection line */}
                        <Line
                            type="monotone"
                            dataKey="projection"
                            name="Proyeccion"
                            stroke="#94a3b8"
                            strokeWidth={1.5}
                            strokeDasharray="5 4"
                            dot={false}
                            activeDot={{ r: 3, fill: '#94a3b8' }}
                            animationDuration={1600}
                            animationEasing="ease-out"
                        />
                    </ComposedChart>
                </ResponsiveContainer>

                {/* Legend */}
                <div className="flex items-center justify-center gap-5 mt-2">
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-teal-400 inline-block" />
                        <span className="text-xs text-slate-500">Consumo real</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="inline-block w-5 border-t-2 border-dashed border-slate-400" />
                        <span className="text-xs text-slate-500">Proyeccion</span>
                    </div>
                </div>
            </div>
        </div>
    );
}