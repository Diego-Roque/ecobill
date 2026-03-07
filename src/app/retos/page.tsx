import CircleProgress from "@/components/reto/Circleprogress";
import StatChip from "@/components/reto/StatChip";
import { Award, Flame, Trophy } from "lucide-react";
import LogroCard from "@/components/reto/Logocard";
import {
    USER_GAMIFICATION,
    USER_NIVELES,
    USER_LOGROS,
    USER_RETOS_STATS,
} from "@/data/Userdata";

const { level, xp, maxXp: xpNext, dayStreak, levelName } = USER_GAMIFICATION;
const pct = xp / xpNext;

export default function RetosPage() {
    return (
        <div className="min-h-screen bg-slate-50 pb-24 px-4 pt-6 flex flex-col gap-4">

            {/* XP Card */}
            <div className="bg-white rounded-3xl p-5 shadow-sm">
                <CircleProgress level={level} pct={pct} />
                <p className="text-center text-xs font-bold tracking-widest text-slate-400 uppercase mt-3">
                    {levelName}
                </p>
                <p className="text-center text-4xl font-black text-slate-900 mt-1">
                    {xp.toLocaleString('es-MX')} XP
                </p>

                {/* XP bar */}
                <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Nivel {level}</span>
                        <span>{xp.toLocaleString('es-MX')}/{xpNext.toLocaleString('es-MX')} XP</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div
                            className="h-2.5 rounded-full"
                            style={{
                                width: `${pct * 100}%`,
                                background: 'linear-gradient(to right, #38bdf8, #1e3a8a)',
                            }}
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="flex gap-3 mt-4">
                    <StatChip icon={<Flame  size={18} />} value={String(dayStreak)}                                            label="Racha"  />
                    <StatChip icon={<Trophy size={18} />} value={`${USER_RETOS_STATS.logrosUnlocked}/${USER_RETOS_STATS.logrosTotal}`} label="Logros" />
                    <StatChip icon={<Award  size={18} />} value={USER_RETOS_STATS.colonyRank}                                  label={`de ${USER_RETOS_STATS.colonyTotal}`} />
                </div>
            </div>

            {/* Niveles */}
            <div className="bg-white rounded-3xl p-5 shadow-sm">
                <h2 className="text-base font-bold text-slate-800 mb-4">Niveles</h2>
                <div className="flex justify-between">
                    {USER_NIVELES.map((n) => (
                        <div key={n.label} className="flex flex-col items-center gap-1 flex-1">
                            <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold border-2
                                ${n.done
                                ? 'bg-teal-500 border-teal-500 text-white'
                                : 'bg-white border-slate-200 text-slate-400'}`}>
                                {n.done ? '✓' : n.xp}
                            </div>
                            <span className={`text-[10px] text-center leading-tight
                                ${n.done ? 'text-teal-500 font-semibold' : 'text-slate-400'}`}>
                                {n.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Logros */}
            <div className="bg-white rounded-3xl p-5 shadow-sm">
                <h2 className="text-base font-bold text-slate-800 mb-4">Logros</h2>
                <div className="grid grid-cols-3 gap-3">
                    {USER_LOGROS.map((l) => <LogroCard key={l.id} logro={l} />)}
                </div>
            </div>

        </div>
    );
}