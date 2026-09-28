import React from 'react';
import { LivingCity3DMap } from '../components/maps/LivingCity3DMap';
import { Route, Station, TransitNetwork } from '../types/transit';

interface NetworkPageProps {
  routes: Route[];
  stations: Station[];
  selectedHour: number;
  onHourChange: (hour: number) => void;
  selectedStationId: string | null;
  onSelectStation: (stationId: string | null) => void;
  onViewStationInsights?: (stationId: string) => void;
  currentNetwork?: TransitNetwork | null;
}

export const NetworkPage: React.FC<NetworkPageProps> = ({
  routes,
  stations,
  selectedHour,
  onHourChange,
  selectedStationId,
  onSelectStation,
  onViewStationInsights,
  currentNetwork
}) => {
  return (
    <div className="flex-1 w-full h-[calc(100vh-3.5rem)] flex flex-col relative overflow-hidden">
      {/* Title Bar per Part 11 */}
      <div className="bg-[#FFFFFF] border-b border-[#DDD9CF] px-6 py-2 flex items-center justify-between shrink-0 z-20 shadow-xs">
        <div>
          <h1 className="text-sm font-black text-[#242521] tracking-tight">
            How is the city moving?
          </h1>
          <p className="text-[11px] text-[#6E6E67]">
            Explore routes, stations, passenger activity and transportation patterns.
          </p>
        </div>
        <div className="hidden sm:flex items-center space-x-2 text-[11px] text-[#6E6E67] font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#5F8A63]"></span>
          <span>{currentNetwork?.name || 'Chennai Transit Network'}</span>
          <span>•</span>
          <span>{routes.length} Corridors</span>
          <span>•</span>
          <span>{stations.length} Stations</span>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <LivingCity3DMap
          routes={routes}
          stations={stations}
          selectedHour={selectedHour}
          onHourChange={onHourChange}
          selectedStationId={selectedStationId}
          onSelectStation={onSelectStation}
          onViewStationInsights={onViewStationInsights}
          currentNetwork={currentNetwork}
        />
      </div>
    </div>
  );
};
