import { Bell, Droplets, Flame, Zap } from "lucide-react";

interface HeaderTopProps {
    streak: number;
    energy: number;
}

export default function Header({ streak, energy }: HeaderTopProps) {
    return (
        <header className="w-full bg-white border-b border-gray-200">

            <div className="mx-auto flex items-center justify-between px-4 py-3">

                {/* Logo + name */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-500 text-white">
                        <Droplets size={20} />
                    </div>

                    <span className="font-semibold text-lg text-gray-800">
            AquaSmart
          </span>
                </div>

                {/* right section */}
                <div className="flex items-center gap-4">

                    {/* streak */}
                    <div className="flex items-center gap-1 text-red-500 font-medium text-sm">
                        <Flame size={18} />
                        {streak}
                    </div>

                    {/* energy */}
                    <div className="flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                        <Zap size={16} />
                        {energy}
                    </div>

                    {/* notification */}
                    <div className="relative text-gray-500">
                        <Bell size={20} />

                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </div>

                </div>
            </div>

            {/* bottom accent bar */}
            <div className="h-1 w-full bg-teal-500"></div>

        </header>
    );
}