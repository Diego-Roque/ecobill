import GamificationHero from "@/components/dashboard/Gamificationhero";
import {divide} from "es-toolkit/compat";
import BillForecast from "@/components/dashboard/BillForecast";

export default function Dashboard() {

    return (
        <div className="p-10">
            <div>
                <GamificationHero dayStreak={12} level={27} xp={20} maxXp={100} levelName={"test"} />
            </div>
            <div className="mt-10">
                <BillForecast/>
            </div>
        </div>


    )
}