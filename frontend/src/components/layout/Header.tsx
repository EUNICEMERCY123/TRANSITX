import React from 'react';
import { Calendar, Clock, Activity, Users } from 'lucide-react';
import { formatCompactNumber, formatExactNumber } from '../../utils/formatters';
import { TransitNetwork } from '../../types/transit';

interface HeaderProps {
  currentDate?: string;
  currentHour?: number;
  onHourChange?: (hour: number) => void;
  activeLineCount?: number;
  totalRecords?: number;
  availableNetworks?: TransitNetwork[];
  selectedNetworkId?: string;
  onSelectNetwork?: (networkId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDate = '2024-01-15',
  currentHour = 9,
  activeLineCount = 5,
  totalRecords = 12805692,
  availableNetworks = [],
  selectedNetworkId = 'chennai',
  onSelectNetwork
}) => {
  return (
    <header className="h-16 bg-[#FFFFFF] border-b border-[#DDD9CF] px-6 flex items-center justify-between shrink-0 sticky top-0 z-20 shadow-xs font-sans">
      {/* Left: Brand Title & City Network Switcher */}
      <div className="flex items-center space-x-3.5">
        <div className="flex items-center space-x-2">
          <h1 className="text-base font-bold text-[#242521] tracking-tight">
            TRANSITX
          </h1>
          <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md bg-[#242621] text-[#FFF3D6] tracking-wider">
            India
          </span>
        </div>

        <span className="text-[#DDD9CF]">/</span>

        {/* City Network Switcher */}
        <div className="flex items-center bg-[#F7F5EF] p-0.5 rounded-xl border border-[#DDD9CF]">
          {availableNetworks.map((net) => {
            const isSelected = net.id === selectedNetworkId;
            return (
              <button
                key={net.id}
                onClick={() => onSelectNetwork && onSelectNetwork(net.id)}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#D89B32] text-[#242521] font-bold shadow-xs'
                    : 'text-[#6E6E67] hover:text-[#242521] hover:bg-[#EEEAE0]/70'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: isSelected ? '#242521' : '#D89B32' }}
                ></span>
                <span>{net.city}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Operational Controls & Status Indicators */}
      <div className="flex items-center space-x-3">
        {/* Date Pill */}
        <div className="hidden sm:flex items-center space-x-2 bg-[#F7F5EF] border border-[#DDD9CF] px-3 py-1.5 rounded-lg text-xs font-medium text-[#242521]">
          <Calendar className="w-3.5 h-3.5 text-[#6E6E67]" />
          <span>{currentDate}</span>
        </div>

        {/* Operational Time Pill (Amber & Charcoal) */}
        <div className="flex items-center space-x-2 bg-[#FFF8EB] border border-[#FDE4B4] px-3 py-1.5 rounded-lg text-xs font-bold text-[#A86F18]">
          <Clock className="w-3.5 h-3.5 text-[#D89B32]" />
          <span className="font-mono text-[#242521]">{`${currentHour.toString().padStart(2, '0')}:00`}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#D89B32] animate-pulse"></span>
        </div>

        {/* Active Lines Status (Semantic Green allowed here for operational status) */}
        <div className="hidden md:flex items-center space-x-1.5 bg-[#F2F7F3] border border-[#CCE0CE] px-3 py-1.5 rounded-lg text-xs font-semibold text-[#3E6642]">
          <Activity className="w-3.5 h-3.5 text-[#5F8A63]" />
          <span>{activeLineCount} Lines Active</span>
        </div>

        {/* Total Ridership Analyzed */}
        <div
          title={`${formatExactNumber(totalRecords)} total passenger journeys analyzed`}
          className="hidden lg:flex items-center space-x-2 bg-[#F7F5EF] hover:bg-[#EEEAE0] border border-[#DDD9CF] px-3 py-1.5 rounded-lg text-xs font-semibold text-[#242521] cursor-help transition-colors"
        >
          <Users className="w-3.5 h-3.5 text-[#6E6E67]" />
          <span>{formatCompactNumber(totalRecords)} Passengers</span>
        </div>
      </div>
    </header>
  );
};
