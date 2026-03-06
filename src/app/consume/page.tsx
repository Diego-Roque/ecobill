'use client';

import { useState } from 'react';
import TabSelector, { TabOption } from "@/components/consumo/Tabselector";
import ConsumptionChart from "@/components/consumo/Consumptionchart";
import ConsumoCardMonth from "@/components/consumo/ConsumecardMonth";
import MiHogarCard from "@/components/consumo/MiHogarCard";

export default function Consume() {
    const [activeTab, setActiveTab] = useState<TabOption>('Diario');


    return (
        <div className={"m-10"}>
            <div>
                <ConsumoCardMonth/>
            </div>

            <div className={"pt-10"}>
                <TabSelector active={activeTab} onChange={setActiveTab} />
                <ConsumptionChart activeTab={activeTab} />
            </div>

            <div>
                <MiHogarCard/>
            </div>
        </div>
    );
}