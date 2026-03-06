import GamificationHero from "@/components/dashboard/Gamificationhero";
import {divide} from "es-toolkit/compat";
import BillForecast from "@/components/dashboard/BillForecast";
import {Rankingchart} from "@/components/ranking/Rankingchart";

export default function Dashboard() {

    return (
        <div className="p-10">
            <div>
                <GamificationHero dayStreak={12} level={27} xp={20} maxXp={100} levelName={"test"} />
            </div>
            <div className="mt-10">
                <BillForecast/>
            </div>
            <div className="mt-10">
                <Rankingchart place={"2"}/>
            </div>
        </div>


    )
}