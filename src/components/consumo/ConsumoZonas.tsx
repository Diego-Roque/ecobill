'use client';

import { useEffect, useState } from 'react';
import { Droplets, UtensilsCrossed, WashingMachine, Leaf, MoreHorizontal } from 'lucide-react';
import { ZONAS_DATA, CURRENT_MONTH_STATS } from "@/data/Consumptiondata";

const ICON_MAP: Record<string, React.ReactNode> = {
    banos:    <Droplets       size={15} />,
    cocina:   <UtensilsCrossed size={15} />,
    lavadora: <WashingMachine  size={15} />,
    jardin:   <Leaf            size={15} />,
    otros:    <MoreHorizontal  size={15} />,
};

export default function ConsumoZonas() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

    return (
        <div className="bg-white rounded-3xl p-5 shadow-sm w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-base font-bold text-slate-800">Consumo por zona</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Basado en {CURRENT_MONTH_STATS.liters.toLocaleString('es-MX')} L este mes
                    </p>
                </div>
                <span className="text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
                    {CURRENT_MONTH_STATS.m3.toFixed(1)} m³
                </span>
            </div>

            {/* Zona rows */}
            <div className="flex flex-col gap-3.5">
                {ZONAS_DATA.map((z, idx) => (
                    <div key={z.id}>
                        {/* Label row */}
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                                {/* Icon circle */}
                                <div
                                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: `${z.color}18`, color: z.color }}
                                >
                                    {ICON_MAP[z.id]}
                                </div>
                                <span className="text-sm font-semibold text-slate-700">{z.label}</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <span className="text-xs text-slate-400 font-medium tabular-nums">
                                    {z.liters.toLocaleString('es-MX')} L
                                </span>
                                <span
                                    className="text-xs font-bold tabular-nums w-9 text-right"
                                    style={{ color: z.color }}
                                >
                                    {z.pct}%
                                </span>
                            </div>
                        </div>

                        {/* Bar */}
                        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-700 ease-out"
                                style={{
                                    width: mounted ? `${z.pct}%` : '0%',
                                    backgroundColor: z.color,
                                    transitionDelay: `${idx * 80}ms`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Stacked mini-bar total */}
            <div className="mt-5 h-2.5 w-full rounded-full overflow-hidden flex">
                {ZONAS_DATA.map((z, idx) => (
                    <div
                        key={z.id}
                        className="h-full transition-all duration-700 ease-out"
                        style={{
                            width: mounted ? `${z.pct}%` : '0%',
                            backgroundColor: z.color,
                            transitionDelay: `${300 + idx * 60}ms`,
                        }}
                        title={`${z.label}: ${z.pct}%`}
                    />
                ))}
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-1.5">Distribución total del mes</p>
        </div>
    );
}