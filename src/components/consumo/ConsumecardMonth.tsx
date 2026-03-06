'use client';

interface ConsumoCardProps {
    liters?: number;
    changePercent?: number;
    proximityPercent?: number;
    litersRemaining?: number;
}

export default function ConsumoCardMonth({
                                        liters = 7886,
                                        changePercent = -6,
                                        proximityPercent = 53,
                                        litersRemaining = 7114,
                                    }: ConsumoCardProps) {
    const isDown = changePercent < 0;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm w-full">
            {/* Title */}
            <p className="text-center text-xs font-bold tracking-widest text-slate-400 uppercase mb-3">
                Consumo del mes de Marzo
            </p>

            {/* Main number */}
            <div className="flex items-baseline justify-center gap-2 mb-1">
                <span className="text-5xl font-black text-slate-900">
                    {liters.toLocaleString()}
                </span>
                <span className="text-xl font-medium text-slate-400">litros</span>
            </div>

            {/* Change */}
            <div className="flex items-center justify-center gap-1 mb-5">
                <span className={`text-sm font-semibold ${isDown ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {isDown ? '↘' : '↗'} {changePercent}%
                </span>
                <span className="text-sm text-slate-400">vs mes pasado</span>
            </div>

            {/* Progress bar section */}
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-slate-700">Proximidad tarifa T2</span>
                <span className="text-sm font-bold text-slate-700">{proximityPercent}%</span>
            </div>

            {/* Gradient bar */}
            <div className="relative h-3 rounded-full overflow-hidden bg-slate-100 mb-2">
                {/* Full gradient track */}
                <div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                        width: `${proximityPercent}%`,
                        background: 'linear-gradient(to right, #22c55e, #84cc16, #eab308, #f97316, #ef4444)',
                    }}
                />
            </div>

            {/* Caption */}
            <p className="text-center text-xs text-slate-400">
                Quedan ~{litersRemaining.toLocaleString()}L antes de subir de tarifa
            </p>
        </div>
    );
}