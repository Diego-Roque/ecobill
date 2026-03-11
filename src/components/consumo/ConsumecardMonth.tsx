'use client';

import { TrendingDown, TrendingUp } from "lucide-react";

interface ConsumoCardProps {
    monthName:        string;
    liters:           number;
    m3:               number;
    changePercent:    number;
    proximityPercent: number;
    litersRemaining:  number | null; // null cuando estamos en T4 (sin límite superior)
    tierId:           string;
    tierLabel:        string;
}

export default function ConsumoCardMonth({
                                             monthName,
                                             liters,
                                             m3,
                                             changePercent,
                                             proximityPercent,
                                             litersRemaining,
                                             tierId,
                                             tierLabel,
                                         }: ConsumoCardProps) {
    const isDown   = changePercent < 0;
    const isMaxTier = tierId === 'T4';

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm w-full">
            {/* Title */}
            <p className="text-center text-xs font-bold tracking-widest text-slate-400 uppercase mb-3">
                Consumo del mes de {monthName}
            </p>

            {/* Main numbers */}
            <div className="flex items-baseline justify-center gap-2 mb-1">
                <span className="text-5xl font-black text-slate-900">
                    {liters.toLocaleString('es-MX')}
                </span>
                <span className="text-xl font-medium text-slate-400">L</span>
                <span className="text-2xl font-black text-slate-400">/</span>
                <span className="text-3xl font-black text-slate-700">
                    {m3.toFixed(2)}
                </span>
                <span className="text-lg font-medium text-slate-400">m³</span>
            </div>

            {/* Change + tier badge */}
            <div className="flex items-center justify-center gap-3 mb-5">
                <span className={`text-sm font-semibold flex items-center gap-1 ${isDown ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {isDown ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                    {changePercent}%
                </span>
                <span className="text-sm text-slate-400">vs mes pasado</span>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${isMaxTier ? 'bg-rose-100 text-rose-700' : 'bg-teal-100 text-teal-700'}`}>
                    {tierLabel}
                </span>
            </div>

            {/* Progress bar section */}
            {isMaxTier ? (
                // T4: sin límite superior, mostrar alerta en su lugar
                <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-center">
                    <p className="text-sm font-bold text-rose-600 mb-0.5">Tarifa máxima alcanzada</p>
                    <p className="text-xs text-rose-400">
                        Estás en el tramo más caro ($25/m³). Reducir consumo por debajo de 61 m³ bajará tu tarifa.
                    </p>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-slate-700">Proximidad límite {tierId}</span>
                        <span className="text-sm font-bold text-slate-700">{proximityPercent}%</span>
                    </div>
                    <div className="relative h-3 rounded-full overflow-hidden bg-slate-100 mb-2">
                        <div
                            className="absolute inset-y-0 left-0 rounded-full"
                            style={{
                                width: `${Math.min(proximityPercent, 100)}%`,
                                background: 'linear-gradient(to right, #22c55e, #84cc16, #eab308, #f97316, #ef4444)',
                            }}
                        />
                    </div>
                    <p className="text-center text-xs text-slate-400">
                        Quedan ~{litersRemaining!.toLocaleString('es-MX')} L ({(litersRemaining! / 1000).toFixed(2)} m³) antes de subir a{' '}
                        {tierId === 'T1' ? 'T2' : tierId === 'T2' ? 'T3' : 'T4'}
                    </p>
                </>
            )}
        </div>
    );
}