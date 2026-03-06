import CircleProgress from "@/components/reto/Circleprogress";
import StatChip from "@/components/reto/StatChip";
import {Award, Flame, Trophy} from "lucide-react";
import LogroCard from "@/components/reto/Logocard";

const NIVELES = [
    { label: "Novato Eco",          xp: 0,  done: true  },
    { label: "Guardián del Agua",   xp: 10, done: false },
    { label: "Maestro Sustentable", xp: 15, done: false },
    { label: "Leyenda EcoBill",     xp: 20, done: false },
];

type Logro = {
    id: number;
    title: string;
    desc: string;
    progress: number; // 0-100
    xp?: number;
    unlocked?: boolean;
    icon: 'lock' | 'flame' | 'trophy' | 'award';
};

const LOGROS: Logro[] = [
    { id: 1, title: "Ahorrador",      desc: "Reduce 10% tu consumo mensual",    progress: 0,   icon: 'lock'   },
    { id: 2, title: "Racha 7",        desc: "7 días bajo el límite diario",     progress: 100, xp: 150, unlocked: true, icon: 'flame' },
    { id: 3, title: "Eficiencia Pro", desc: "Mantén tarifa T1 por 2 meses",     progress: 47,  icon: 'lock'   },
    { id: 4, title: "Eco Vecino",     desc: "Top 10 de tu colonia",             progress: 100, xp: 250, unlocked: true, icon: 'award' },
    { id: 5, title: "Héroe Sequía",   desc: "Reduce 20% durante alerta",        progress: 0,   icon: 'lock'   },
    { id: 6, title: "Racha 30",       desc: "30 días consecutivos bajo límite", progress: 47,  icon: 'lock'   },
    { id: 7, title: "Mentor Verde",   desc: "Invita 3 vecinos a EcoBill",       progress: 33,  icon: 'lock'   },
    { id: 8, title: "Líder Colonia",  desc: "#1 en tu colonia por 1 mes",       progress: 72,  icon: 'lock'   },
    { id: 9, title: "Maestro Agua",   desc: "Completa todos los retos",         progress: 12,  icon: 'lock'   },
];


export default function RetosPage() {
    const level = 6;
    const xp = 2450;
    const xpNext = 2700;
    const pct = xp / xpNext;

    return (
        <div className="min-h-screen bg-slate-50 pb-24 px-4 pt-6 flex flex-col gap-4">

            {/* XP Card */}
            <div className="bg-white rounded-3xl p-5 shadow-sm">
                <CircleProgress level={level} pct={pct} />
                <p className="text-center text-xs font-bold tracking-widest text-slate-400 uppercase mt-3">
                    Cascada
                </p>
                <p className="text-center text-4xl font-black text-slate-900 mt-1">
                    {xp.toLocaleString()} XP
                </p>

                {/* XP bar */}
                <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Nivel {level}</span>
                        <span>{xp}/{xpNext} XP</span>
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
                    <StatChip icon={<Flame size={18} />}   value="14"  label="Racha"   />
                    <StatChip icon={<Trophy size={18} />}  value="2/9" label="Logros"  />
                    <StatChip icon={<Award size={18} />}   value="#2"  label="de 48"   />
                </div>
            </div>

            {/* Niveles */}
            <div className="bg-white rounded-3xl p-5 shadow-sm">
                <h2 className="text-base font-bold text-slate-800 mb-4">Niveles</h2>
                <div className="flex justify-between">
                    {NIVELES.map((n) => (
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
                    {LOGROS.map((l) => <LogroCard key={l.id} logro={l} />)}
                </div>
            </div>

        </div>
    );
}