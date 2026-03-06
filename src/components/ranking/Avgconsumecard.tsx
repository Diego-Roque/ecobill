interface AvgconsumeCardProps {
    consumeavg: number;
}

export default function AvgconsumeCard({ consumeavg }: AvgconsumeCardProps) {
    const formatted =
        consumeavg >= 1000
            ? `${(consumeavg / 1000).toFixed(1)}k L`
            : `${consumeavg} L`;

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 px-10 py-8 w-full">
            {/* Target / bullseye icon */}


            {/* Value */}
            <p className="text-3xl font-bold tracking-tight text-slate-800 font-mono">
                {formatted}
            </p>

            {/* Label */}
            <p className="text-sm text-slate-400">Promedio colonia</p>
        </div>
    );
}