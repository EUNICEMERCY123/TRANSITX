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
    <div className="flex-1 w-full h-[calc(100vh-4rem)] flex flex-col relative overflow-hidden">
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
  );
};
