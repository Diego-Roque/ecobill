
interface ConsumeCardProps {
    consume: number;

}
export default function ConsumeCard({consume}:ConsumeCardProps){
    const formatted =
        consume >= 1000
            ? `${(consume / 1000).toFixed(1)}k L`
            : `${consume} L`;

    return (
        <div className="w-full bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 px-10 py-8">
            {/* Water icon*/}


            {/* Value */}
            <p className="text-3xl font-bold tracking-tight text-slate-800 font-mono">
                {formatted}
            </p>

            {/* Label */}
            <p className="text-sm text-slate-400">Tu consumo</p>
        </div>
    );
}
