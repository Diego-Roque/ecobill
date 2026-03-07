'use client';

import { useEffect, useState } from 'react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ReferenceLine,
    Tooltip,
    Cell,
} from 'recharts';
import { TabOption } from "@/components/consumo/Tabselector";
import {ChartEntry} from "@/data/Consumptiondata";


// ── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const val = payload[0].value;
    return (
        <div className="bg-white border border-slate-100 rounded-xl shadow-md px-3 py-2 text-xs">
            <p className="font-semibold text-slate-500 mb-0.5">{label}</p>
            <p className="font-bold text-slate-800">{val.toLocaleString()} L</p>
        </div>
    );
};

// ── Component ────────────────────────────────────────────────────────────────
interface ConsumptionChartProps {
    activeTab: TabOption;
    data: ChartEntry[];
    threshold: number;
    overCount: number;
}

export default function ConsumptionChart({ activeTab, data, threshold, overCount }: ConsumptionChartProps) {
    const [animKey, setAnimKey] = useState(0);
    const [chartVisible, setChartVisible] = useState(true);

    useEffect(() => {
        setChartVisible(false);
        const t = setTimeout(() => {
            setAnimKey((k) => k + 1);
            setChartVisible(true);
        }, 200);
        return () => clearTimeout(t);
    }, [activeTab]);

    const periodLabel =
        activeTab === 'Diario' ? 'días' :
            activeTab === 'Semanal' ? 'semanas' : 'meses';

    return (
        <div className="bg-white rounded-3xl p-4 shadow-sm">
            {/* Sub-header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 bg-amber-50 rounded-xl px-3 py-1.5">
                    <span className="text-amber-400 text-sm">⚠️</span>
                    <p className="text-sm text-slate-700">
                        <span className="font-bold text-amber-500">
                            {overCount} {periodLabel}
                        </span>
                        {' '}sobre el umbral eficiente
                    </p>
                </div>
                <span className="bg-rose-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide animate-pulse">
                    EN VIVO
                </span>
            </div>

            {/* Chart */}
            <div
                style={{
                    opacity: chartVisible ? 1 : 0,
                    transform: chartVisible ? 'translateY(0)' : 'translateY(8px)',
                    transition: 'opacity 0.35s ease, transform 0.35s ease',
                }}
            >
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                        key={animKey}
                        data={data}
                        margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                        barSize={28}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis
                            dataKey="label"
                            tick={{ fontSize: 11, fill: '#94a3b8' }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: '#94a3b8' }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: 'rgba(0,0,0,0.04)', radius: 8 }}
                        />
                        <ReferenceLine
                            y={threshold}
                            stroke="#f59e0b"
                            strokeDasharray="5 4"
                            strokeWidth={1.5}
                            label={{
                                value: 'Umbral',
                                position: 'insideTopLeft',
                                fontSize: 10,
                                fill: '#f59e0b',
                                dy: -6,
                            }}
                        />
                        <Bar
                            dataKey="value"
                            radius={[6, 6, 0, 0]}
                            animationDuration={700}
                            animationEasing="ease-out"
                        >
                            {data.map((entry, i) => (
                                <Cell
                                    key={i}
                                    fill={entry.value > threshold ? '#f59e0b' : '#2dd4bf'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-5 mt-2">
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-400 inline-block" />
                    <span className="text-xs text-slate-400">Eficiente</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                    <span className="text-xs text-slate-400">Sobre umbral</span>
                </div>
            </div>
        </div>
    );
}