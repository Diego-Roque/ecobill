'use client';

import GamificationHero from "@/components/dashboard/Gamificationhero";
import BillForecast from "@/components/dashboard/BillForecast";
import { Rankingchart } from "@/components/ranking/Rankingchart";
import { USER_GAMIFICATION, USER_RANKING } from "@/data/Userdata";

export default function Dashboard() {
    return (
        <div className="p-5 pb-24 flex flex-col gap-6">
            <GamificationHero
                dayStreak={USER_GAMIFICATION.dayStreak}
                level={USER_GAMIFICATION.level}
                xp={USER_GAMIFICATION.xp}
                maxXp={USER_GAMIFICATION.maxXp}
                levelName={USER_GAMIFICATION.levelName}
            />
            <BillForecast />
            <Rankingchart place={USER_RANKING.place} />
        </div>
    );
}