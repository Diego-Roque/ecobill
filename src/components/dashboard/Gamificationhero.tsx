'use client';

import { Star, Flame, Lock, Trophy, Award } from 'lucide-react';
import TrophyCard from "@/components/dashboard/TrophyCard";
import { USER_GAMIFICATION, USER_LOGROS, type LogroIcon } from "@/data/Userdata";

// ── Mapeo de icon string → JSX ────────────────────────────────────────────────
const ICON_MAP: Record<LogroIcon, React.ReactNode> = {
    lock:   <Lock   size={18} />,
    flame:  <Flame  size={18} />,
    trophy: <Trophy size={18} />,
    award:  <Award  size={18} />,
};

const BG_MAP: Record<LogroIcon, string> = {
    lock:   'bg-slate-600',
    flame:  'bg-orange-400',
    trophy: 'bg-amber-400',
    award:  'bg-teal-500',
};

// Últimos 4 logros (o menos si hay menos de 4)
const VISIBLE_LOGROS = USER_LOGROS.filter(l => l.unlocked).slice(-4);

interface GamificationHeroProps {
    dayStreak: number;
    level:     number;
    xp:        number;
    maxXp:     number;
    levelName: string;
}

export default function GamificationHero({ dayStreak, level, xp, maxXp, levelName }: GamificationHeroProps) {
    const xpLeft    = maxXp - xp;
    const nextLevel = level + 1;
    const progress  = Math.min((xp / maxXp) * 100, 100);

    return (
        <div
            className="w-full rounded-3xl p-4 sm:p-5 flex flex-col gap-4 sm:gap-5"
            style={{ background: 'linear-gradient(to right, #0b587a, #0c1a3d)' }}
        >
            {/* ── Row 1: Level + Streak ── */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="relative w-11 h-11 sm:w-14 sm:h-14 flex-shrink-0 flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 56 56">
                            <circle cx="28" cy="28" r="24" fill="none" stroke="#1e3a4a" strokeWidth="4" />
                            <circle
                                cx="28" cy="28" r="24"
                                fill="none" stroke="#2dd4bf" strokeWidth="4" strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 24}`}
                                strokeDashoffset={`${2 * Math.PI * 24 * (1 - progress / 100)}`}
                                className="transition-all duration-700"
                            />
                        </svg>
                        <span className="relative text-white font-bold text-base sm:text-lg leading-none">{level}</span>
                    </div>

                    <div className="flex flex-col min-w-0">
                        <span className="text-slate-400 text-[10px] sm:text-xs font-medium uppercase tracking-widest">Nivel</span>
                        <span className="text-white font-bold text-sm sm:text-base leading-tight truncate">{levelName}</span>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 bg-[#1e2d3d] rounded-xl px-2.5 sm:px-3 py-2 flex-shrink-0">
                    <Flame size={16} className="text-orange-400" />
                    <div className="flex flex-col items-center leading-none">
                        <span className="text-white font-bold text-base sm:text-lg">{dayStreak}</span>
                        <span className="text-slate-400 text-[9px] sm:text-[10px] uppercase tracking-wider">días</span>
                    </div>
                </div>
            </div>

            {/* ── Row 2: XP bar ── */}
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                    <Star size={14} className="text-amber-400 fill-amber-400 flex-shrink-0" />
                    <span className="text-white font-bold text-lg sm:text-xl">{xp.toLocaleString('es-MX')}</span>
                    <span className="text-slate-400 text-xs sm:text-sm">/ {maxXp.toLocaleString('es-MX')} XP</span>
                </div>
                <div className="h-2.5 sm:h-3 w-full rounded-full bg-[#1a2e3d] overflow-hidden">
                    <div
                        className="h-full rounded-full bg-amber-400 transition-all duration-700"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-slate-400 text-[11px] sm:text-xs">
                    {xpLeft.toLocaleString('es-MX')} XP para Nivel {nextLevel}
                </p>
            </div>

            {/* ── Row 3: Logros (últimos 4) ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {VISIBLE_LOGROS.map((l) => (
                    <TrophyCard
                        key={l.id}
                        logo={
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${l.unlocked ? BG_MAP[l.icon] : 'bg-slate-700'} text-white`}>
                                {ICON_MAP[l.icon]}
                            </div>
                        }
                        name={l.title}
                        dots={l.unlocked ? 3 : Math.round(l.progress / 34)}
                        unlocked={!!l.unlocked}
                    />
                ))}
            </div>
        </div>
    );
}