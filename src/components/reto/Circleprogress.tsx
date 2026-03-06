export default function CircleProgress({ level, pct }: { level: number; pct: number }) {
    const r = 44;
    const circ = 2 * Math.PI * r;
    const dash = circ * pct;
    return (
        <div className="relative w-28 h-28 mx-auto">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={r} fill="none" stroke="#e2e8f0" strokeWidth="7" />
                <circle
                    cx="50" cy="50" r={r} fill="none"
                    stroke="url(#grad)" strokeWidth="7"
                    strokeDasharray={`${dash} ${circ}`}
                    strokeLinecap="round"
                />
                <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#7c3aed" />
                        <stop offset="100%" stopColor="#2dd4bf" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-black text-slate-800">Lv.{level}</span>
            </div>
        </div>
    );
}