'use client';

import { useState } from 'react';
import TabSelector, { TabOption } from "@/components/consumo/Tabselector";
import ConsumptionChart from "@/components/consumo/Consumptionchart";
import ConsumoCardMonth from "@/components/consumo/ConsumecardMonth";
import MiHogarCard from "@/components/consumo/MiHogarCard";
import {
    CURRENT_MONTH_STATS,
    CHART_DATA,
    OVER_COUNT,
    THRESHOLD,
} from "@/data/Consumptiondata";

export default function Consume() {
    const [activeTab, setActiveTab] = useState<TabOption>('Diario');

    return (
        <div className="m-10">
            <div>
                <ConsumoCardMonth
                    monthName={CURRENT_MONTH_STATS.monthName}
                    liters={CURRENT_MONTH_STATS.liters}
                    changePercent={CURRENT_MONTH_STATS.changePercent}
                    proximityPercent={CURRENT_MONTH_STATS.proximityPercent}
                    litersRemaining={CURRENT_MONTH_STATS.litersRemaining}
                />
            </div>

            <div className="pt-10">
                <TabSelector active={activeTab} onChange={setActiveTab} />
                <ConsumptionChart
                    activeTab={activeTab}
                    data={CHART_DATA[activeTab]}
                    threshold={THRESHOLD[activeTab]}
                    overCount={OVER_COUNT[activeTab]}
                />
            </div>

            <div>
                <MiHogarCard />
            </div>
        </div>
    );
}