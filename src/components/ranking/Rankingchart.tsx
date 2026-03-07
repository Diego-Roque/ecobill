import Rankcard from "@/components/ranking/Rankcard";
import { HOUSEHOLDS } from "@/data/Userdata";

interface RankingChartData {
    place: string;
}

export function Rankingchart({ place }: RankingChartData) {
    return (
        <div className="w-full flex items-start justify-center p-6">
            <div className="w-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-400">Ranking</span>
                        <h1 className="text-base font-bold text-slate-800">{place}</h1>
                    </div>
                    <span className="text-sm text-slate-400">{HOUSEHOLDS.length} hogares</span>
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-2">
                    {HOUSEHOLDS.map((h) => (
                        <Rankcard key={h.rank} {...h} />
                    ))}
                </div>
            </div>
        </div>
    );
}