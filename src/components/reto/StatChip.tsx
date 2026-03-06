export default function StatChip({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
    return (
        <div className="flex-1 bg-teal-50 rounded-2xl p-3 flex flex-col items-center gap-1">
            <div className="text-amber-400">{icon}</div>
            <span className="text-lg font-black text-slate-800">{value}</span>
            <span className="text-xs text-slate-400">{label}</span>
        </div>
    );
}