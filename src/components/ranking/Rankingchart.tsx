import Rankcard from "@/components/ranking/Rankcard";

const households = [
    { rank: 1, profilepic: "ML", Name: "Fam. Lopez",     energy: 3240, water: 7200,  prevrank: 1 },
    { rank: 2, profilepic: "CG", Name: "Tu hogar",       energy: 2950, water: 8400,  prevrank: 3, isCurrentUser: true },
    { rank: 3, profilepic: "FH", Name: "Fam. Hernandez", energy: 2810, water: 8900,  prevrank: 2 },
    { rank: 4, profilepic: "JM", Name: "Fam. Martinez",  energy: 2650, water: 9100,  prevrank: 6 },
    { rank: 5, profilepic: "PD", Name: "Fam. Diaz",      energy: 2480, water: 9600,  prevrank: 5 },
    { rank: 6, profilepic: "RS", Name: "Fam. Sanchez",   energy: 2310, water: 10200, prevrank: 4 },
    { rank: 7, profilepic: "AT", Name: "Fam. Torres",    energy: 2190, water: 10800, prevrank: 8 },
    { rank: 8, profilepic: "LF", Name: "Fam. Flores",    energy: 2050, water: 11400, prevrank: 7 },
];
interface RankingChartData {
    place: string;
}
export function Rankingchart( {place}:RankingChartData) {
    return (
        <div className=" w-full flex items-start justify-center p-6">
            <div className="w-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-400">Ranking</span>
                        <h1 className="text-base font-bold text-slate-800">{place}</h1>
                    </div>
                    <span className="text-sm text-slate-400">8 hogares</span>
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-2">
                    {households.map((h) => (
                        <Rankcard key={h.rank} {...h} />
                    ))}
                </div>
            </div>
        </div>
    );
}