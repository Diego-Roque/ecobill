import GamificationHero from "@/components/dashboard/Gamificationhero";
import BillForecast from "@/components/dashboard/BillForecast";
import { Rankingchart } from "@/components/ranking/Rankingchart";

export default function Dashboard() {
    return (
        <div className="p-5 pb-24 flex flex-col gap-6">
            <GamificationHero dayStreak={12} level={27} xp={20} maxXp={100} levelName={"test"} />
            <BillForecast />
            <Rankingchart place={"2"} />
        </div>
    );
}