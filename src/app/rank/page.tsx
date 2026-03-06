import AvgconsumeCard from "@/components/ranking/Avgconsumecard";
import ConsumeCard from "@/components/ranking/Consumecard";
import {Rankingchart} from "@/components/ranking/Rankingchart";

export default function rank(){
    return (
        <div className={"m-10"}>
            <div className="flex gap-4 justify-center">
                <ConsumeCard consume={8.4}/>
                <AvgconsumeCard consumeavg={10.5}/>
            </div>
            <div className={"pt-10"}>
                <Rankingchart place={"2"}/>
            </div>
        </div>
    )
}