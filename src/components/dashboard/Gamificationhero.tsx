import { Flame, Star, Droplets, Zap, Shield } from 'lucide-react';
import TrophyCard from "@/components/dashboard/TrophyCard";


interface GamificationHeroProps {
    dayStreak: number;
    level: number;
    xp: number;
    maxXp: number;
    levelName: string;
}

// Trofeos de ejemplo — en producción vendrían como prop o desde un store
const TROPHIES = [
    { logo: <Droplets size={22} />, name: 'Water Saver', dots: 3, unlocked: true,  bg: 'bg-teal-500' },
    { logo: <Zap       size={22} />, name: 'Efficiency Pro', dots: 2, unlocked: true,  bg: 'bg-amber-400' },
    { logo: <Shield    size={22} />, name: 'Drought Hero',   dots: 0, unlocked: false, bg: 'bg-slate-600' },
    { logo: <Flame     size={22} />, name: 'Streak Master',  dots: 1, unlocked: true,  bg: 'bg-amber-400' },
];

export default function GamificationHero({
                                             dayStreak,
                                             level,
                                             xp,
                                             maxXp,
                                             levelName,
                                         }: GamificationHeroProps) {
    const xpLeft   = maxXp - xp;
    const nextLevel = level + 1;
    const progress  = Math.min((xp / maxXp) * 100, 100);

    return (
        <div
            className="w-full rounded-3xl p-5 flex flex-col gap-5"
            style={{ background: 'linear-gradient(to right, #0b587a, #0c1a3d)' }}>
            {/* ── Row 1: Level + Streak ── */}
            <div className="flex items-center justify-between">
                {/* Level block */}
                <div className="flex items-center gap-3">
                    {/* Circle with level number */}
                    <div className="relative w-14 h-14 flex items-center justify-center">
                        {/* SVG ring */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 56 56">
                            <circle cx="28" cy="28" r="24" fill="none" stroke="#1e3a4a" strokeWidth="4" />
                            <circle
                                cx="28" cy="28" r="24"
                                fill="none"
                                stroke="#2dd4bf"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 24}`}
                                strokeDashoffset={`${2 * Math.PI * 24 * (1 - progress / 100)}`}
                                className="transition-all duration-700"
                            />
                        </svg>
                        <span className="relative text-white font-bold text-lg leading-none">{level}</span>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-slate-400 text-xs font-medium uppercase tracking-widest">Nivel</span>
                        <span className="text-white font-bold text-base leading-tight">{levelName}</span>
                    </div>
                </div>

                {/* Streak badge */}
                <div className="flex items-center gap-2 bg-[#1e2d3d] rounded-xl px-3 py-2">
                    <Flame size={18} className="text-orange-400" />
                    <div className="flex flex-col items-center leading-none">
                        <span className="text-white font-bold text-lg">{dayStreak}</span>
                        <span className="text-slate-400 text-[10px] uppercase tracking-wider">días</span>
                    </div>
                </div>
            </div>

            {/* ── Row 2: XP bar ── */}
            <div className="flex flex-col gap-1.5">
                {/* XP label */}
                <div className="flex items-center gap-1.5">
                    <Star size={16} className="text-amber-400 fill-amber-400" />
                    <span className="text-white font-bold text-xl">{xp.toLocaleString()}</span>
                    <span className="text-slate-400 text-sm">/ {maxXp.toLocaleString()} XP</span>
                </div>

                {/* Bar */}
                <div className="h-3 w-full rounded-full bg-[#1a2e3d] overflow-hidden">
                    <div
                        className="h-full rounded-full bg-amber-400 transition-all duration-700"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Remaining */}
                <p className="text-slate-400 text-xs">
                    {xpLeft.toLocaleString()} XP para Nivel {nextLevel}
                </p>
            </div>

            {/* ── Row 3: Trophy cards ── */}
            <div className="grid grid-cols-4 gap-2">
                {TROPHIES.map((t) => (
                    <TrophyCard
                        key={t.name}
                        logo={
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${t.unlocked ? t.bg : 'bg-slate-700'} text-white`}>
                                {t.logo}
                            </div>
                        }
                        name={t.name}
                        dots={t.dots}
                        unlocked={t.unlocked}
                    />
                ))}
            </div>
        </div>
    );
}