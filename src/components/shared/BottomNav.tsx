import { Droplets, Flame, Trophy, BarChart3, Receipt } from "lucide-react";

type NavItem = {
    label: string;
    icon: React.ReactNode;
    active?: boolean;
};

export default function BottomNav() {
    const items: NavItem[] = [
        {
            label: "Inicio",
            icon: <Droplets size={22} />,
            active: true,
        },
        {
            label: "Retos",
            icon: <Flame size={22} />,
        },
        {
            label: "Ranking",
            icon: <Trophy size={22} />,
        },
        {
            label: "Consumo",
            icon: <BarChart3 size={22} />,
        },
        {
            label: "Factura",
            icon: <Receipt size={22} />,
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-sm">
            <div className="flex justify-around items-center py-3">

                {items.map((item, index) => (
                    <button
                        key={index}
                        className={`flex flex-col items-center text-xs gap-1 transition-colors
            ${
                            item.active
                                ? "text-teal-500"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        {item.icon}
                        {item.label}
                    </button>
                ))}

            </div>
        </nav>
    );
}