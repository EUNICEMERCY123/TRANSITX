import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Play, Pause, Layers, X, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Route, Station } from '../../types/transit';
import { formatCompactNumber, formatExactNumber, formatPercentage } from '../../utils/formatters';

interface TransitNetworkMapProps {
  routes: Route[];
  stations: Station[];
  selectedHour: number;
  onHourChange: (hour: number) => void;
  selectedStationId: string | null;
  onSelectStation: (stationId: string | null) => void;
  onViewStationInsights?: (stationId: string) => void;
}

export const TransitNetworkMap: React.FC<TransitNetworkMapProps> = ({
  routes,
  stations,
  selectedHour,
  onHourChange,
  selectedStationId,
  onSelectStation,
  onViewStationInsights
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polylinesLayerRef = useRef<L.LayerGroup | null>(null);
  const stationsLayerRef = useRef<L.LayerGroup | null>(null);
  const particlesLayerRef = useRef<L.LayerGroup | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Layer toggles
  const [showStations, setShowStations] = useState<boolean>(true);
  const [showFlow, setShowFlow] = useState<boolean>(true);
  const [showDelays, setShowDelays] = useState<boolean>(false);
  const [showCrowd, setShowCrowd] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [networkTab, setNetworkTab] = useState<'routes' | 'stations' | 'crowd' | 'delays'>('routes');

  // Active route filter (null means all lines)
  const [activeRouteFilter, setActiveRouteFilter] = useState<string | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Chennai transit network
    const map = L.map(mapContainerRef.current, {
      center: [13.045, 80.235],
      zoom: 12,
      zoomControl: false,
      attributionControl: false
    });

    // Standard high-reliability OpenStreetMap basemap (no private API key required)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const polylinesGroup = L.layerGroup().addTo(map);
    const particlesGroup = L.layerGroup().addTo(map);
    const stationsGroup = L.layerGroup().addTo(map);

    polylinesLayerRef.current = polylinesGroup;
    particlesLayerRef.current = particlesGroup;
    stationsLayerRef.current = stationsGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Route Polylines
  useEffect(() => {
    if (!polylinesLayerRef.current || !mapInstanceRef.current) return;
    const group = polylinesLayerRef.current;
    group.clearLayers();

    routes.forEach((route) => {
      if (activeRouteFilter && route.route_id !== activeRouteFilter) return;
      if (!route.coordinates_path || route.coordinates_path.length === 0) return;

      const latlngs: L.LatLngExpression[] = route.coordinates_path.map(
        (c) => [c[0], c[1]] as [number, number]
      );

      // Subtle outer glow
      const glowPoly = L.polyline(latlngs, {
        color: route.color_hex,
        weight: 8,
        opacity: 0.22,
        lineCap: 'round',
        lineJoin: 'round'
      });
      group.addLayer(glowPoly);

      // Main corridor route polyline
      const mainPoly = L.polyline(latlngs, {
        color: route.color_hex,
        weight: 4,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      });

      mainPoly.bindTooltip(
        `<div class="p-1 text-xs">
          <div class="font-bold text-slate-900">${route.route_name}</div>
          <div class="text-[11px] text-slate-500">${route.origin} ↔ ${route.destination}</div>
        </div>`,
        { sticky: true }
      );

      group.addLayer(mainPoly);
    });
  }, [routes, activeRouteFilter]);

  // Update Stations Markers
  useEffect(() => {
    if (!stationsLayerRef.current || !mapInstanceRef.current) return;
    const group = stationsLayerRef.current;
    group.clearLayers();

    if (!showStations) return;

    stations.forEach((station) => {
      if (activeRouteFilter && !station.lines_served.includes(activeRouteFilter)) {
        return;
      }

      let markerColor = '#2563EB';
      let radius = station.is_interchange ? 7 : 5;

      if (showCrowd) {
        markerColor = station.status_color || '#16A34A';
        radius = station.occupancy_ratio && station.occupancy_ratio > 0.8 ? 8 : 5;
      } else if (showDelays) {
        markerColor = (station.current_delay_min || 0) > 4.0 ? '#DC2626' : '#16A34A';
      }

      const isSelected = selectedStationId === station.station_id;

      const circle = L.circleMarker([station.latitude, station.longitude], {
        radius: isSelected ? radius + 4 : radius,
        fillColor: markerColor,
        color: isSelected ? '#0F172A' : '#FFFFFF',
        weight: isSelected ? 3 : 2,
        opacity: 1,
        fillOpacity: 0.95
      });

      // Short, clean tooltip matching school student & product test:
      // "CENTRAL STATION / 2,840 passengers / High demand"
      circle.bindTooltip(
        `<div class="p-1 text-xs">
          <div class="font-bold text-[#242521]">${station.station_name}</div>
          <div class="text-[11px] text-[#6E6E67] font-semibold mt-0.5">${(station.current_passengers || 0).toLocaleString()} passengers</div>
          <div class="text-[10px] font-bold ${
            station.crowd_level === 'Critical' || station.crowd_level === 'High'
              ? 'text-[#A86F18]'
              : 'text-[#5F8A63]'
          }">${station.crowd_level || 'Normal'} demand</div>
        </div>`,
        { direction: 'top', offset: [0, -6] }
      );

      circle.on('click', () => {
        onSelectStation(station.station_id);
      });

      group.addLayer(circle);
    });
  }, [stations, showStations, showCrowd, showDelays, activeRouteFilter, selectedStationId]);

  // Animated Passenger Flow Particles
  useEffect(() => {
    if (!particlesLayerRef.current || !mapInstanceRef.current || !showFlow) {
      if (particlesLayerRef.current) particlesLayerRef.current.clearLayers();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const group = particlesLayerRef.current;
    let progress = 0;

    const animateParticles = () => {
      progress = (progress + 0.005) % 1.0;
      group.clearLayers();

      routes.forEach((route) => {
        if (activeRouteFilter && route.route_id !== activeRouteFilter) return;
        const coords = route.coordinates_path;
        if (!coords || coords.length < 2) return;

        // Number of particles based on flow density (2 to 6)
        const particleCount = route.flow_density || 3;

        for (let i = 0; i < particleCount; i++) {
          const particleOffset = (progress + i / particleCount) % 1.0;
          const totalSegments = coords.length - 1;
          const segmentFloat = particleOffset * totalSegments;
          const segIndex = Math.min(Math.floor(segmentFloat), totalSegments - 1);
          const t = segmentFloat - segIndex;

          const p1 = coords[segIndex];
          const p2 = coords[segIndex + 1];

          const lat = p1[0] + (p2[0] - p1[0]) * t;
          const lng = p1[1] + (p2[1] - p1[1]) * t;

          const particle = L.circleMarker([lat, lng], {
            radius: 3.5,
            fillColor: route.color_hex,
            color: '#FFFFFF',
            weight: 1.5,
            opacity: 0.9,
            fillOpacity: 0.95
          });

          group.addLayer(particle);
        }
      });

      animFrameRef.current = requestAnimationFrame(animateParticles);
    };

    animFrameRef.current = requestAnimationFrame(animateParticles);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [routes, showFlow, activeRouteFilter]);

  // Timeline playback timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      onHourChange(selectedHour >= 23 ? 5 : selectedHour + 1);
    }, 1500);
    return () => clearInterval(interval);
  }, [isPlaying, selectedHour, onHourChange]);

  const selectedStationObj = stations.find((s) => s.station_id === selectedStationId);

  // Hourly transit volume weights for the timeline scrubber bars (5 to 23)
  const timelineHours = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  const hourHeights = {
    5: 18, 6: 35, 7: 65, 8: 95, 9: 100, 10: 75,
    11: 50, 12: 55, 13: 52, 14: 50, 15: 58, 16: 72,
    17: 92, 18: 98, 19: 88, 20: 64, 21: 42, 22: 26, 23: 15
  };

  // Calculate station surge percentage from usual
  const currentPass = selectedStationObj?.current_passengers || 2400;
  const usualPass = selectedStationObj?.avg_passengers_per_hour || 2100;
  const surgePct = Math.round(((currentPass - usualPass) / usualPass) * 100);

  return (
    <div className="relative w-full h-full min-h-[620px] bg-[#F7F5EF] overflow-hidden select-none">
      {/* Map Container */}
      <div ref={mapContainerRef} className="absolute inset-0 z-0" />

      {/* Top Floating Network Overview Drawer (Left) */}
      <div className="absolute top-4 left-4 z-10 w-80 bg-[#FFFFFF]/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#DDD9CF] p-4 transition-all">
        <div className="flex items-center justify-between pb-3 border-b border-[#DDD9CF]">
          <div>
            <h2 className="text-sm font-bold text-[#242521]">Network Overview</h2>
            <p className="text-[11px] text-[#6E6E67] font-medium">Chennai Transit Corridor Hub</p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FFF3D6] text-[#A86F18] border border-[#F2C66D]">
            {routes.length} Lines
          </span>
        </div>

        {/* Overview Tabs: Routes | Stations | Crowd | Delays */}
        <div className="flex items-center space-x-1 mt-3 p-1 bg-[#F7F5EF] rounded-xl text-xs font-semibold text-[#6E6E67]">
          {(['routes', 'stations', 'crowd', 'delays'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setNetworkTab(tab)}
              className={`flex-1 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                networkTab === tab
                  ? 'bg-[#D89B32] text-[#242521] shadow-xs font-bold'
                  : 'hover:text-[#242521] text-[#6E6E67]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-3 max-h-56 overflow-y-auto space-y-1.5 pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#DDD9CF]">
          {networkTab === 'routes' &&
            routes.map((route) => {
              const isFiltered = activeRouteFilter === route.route_id;
              return (
                <div
                  key={route.route_id}
                  onClick={() =>
                    setActiveRouteFilter(isFiltered ? null : route.route_id)
                  }
                  className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition-all ${
                    isFiltered
                      ? 'border-[#D89B32] bg-[#FFF8EB] shadow-xs'
                      : 'border-[#DDD9CF]/70 hover:border-[#DDD9CF] hover:bg-[#F7F5EF]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: route.color_hex }}
                    ></span>
                    <div>
                      <div className="text-xs font-bold text-[#242521]">{route.route_name}</div>
                      <div className="text-[10px] text-[#6E6E67]">
                        {route.origin} → {route.destination}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      route.operational_status === 'Delay'
                        ? 'bg-[#FAECE9] text-[#782619] border border-[#ECC4BE]'
                        : route.operational_status === 'Busy'
                        ? 'bg-[#FAF3E5] text-[#7D5514] border border-[#EEDCB8]'
                        : 'bg-[#E9EFE9] text-[#243C35] border border-[#C5D6C5]'
                    }`}
                  >
                    {route.operational_status || 'Normal'}
                  </span>
                </div>
              );
            })}

          {networkTab === 'stations' && (
            <div className="space-y-1">
              {stations.slice(0, 8).map((st) => (
                <div
                  key={st.station_id}
                  onClick={() => onSelectStation(st.station_id)}
                  className="flex items-center justify-between p-2 rounded-lg border border-[#DDD9CF]/70 hover:bg-[#F7F5EF] cursor-pointer text-xs"
                >
                  <span className="font-semibold text-[#242521]">{st.station_name}</span>
                  <span className="text-[#6E6E67] font-mono text-[11px]">
                    {(st.current_passengers || 0).toLocaleString()} pass
                  </span>
                </div>
              ))}
            </div>
          )}

          {networkTab === 'crowd' && (
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#FAF3E5] border border-[#D89B32]/40 text-[#7D5514]">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#D89B32]" />
                  Peak Crowding Hotspots
                </div>
                <div className="mt-1 text-[11px] text-[#7D5514]">
                  Chennai Central, T. Nagar (Mambalam), and Guindy experience high passenger density.
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
                <div className="p-2 rounded-lg bg-[#E9EFE9] border border-[#3E7659]/30">
                  <div className="text-[#243C35] font-bold">Low Demand</div>
                  <div className="text-[#6E6E67]">&lt; 45% Capacity</div>
                </div>
                <div className="p-2 rounded-lg bg-[#FAF3E5] border border-[#D89B32]/40">
                  <div className="text-[#7D5514] font-bold">High Demand</div>
                  <div className="text-[#6E6E67]">&gt; 75% Capacity</div>
                </div>
              </div>
            </div>
          )}

          {networkTab === 'delays' && (
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#FFF8EB] border border-[#FDE4B4] text-[#242521]">
                <div className="font-bold text-[#A86F18]">Typical Waiting Time by Line</div>
                <div className="mt-0.5 text-[11px] text-[#7D5514]">
                  Trains arrive every 5 to 10 minutes across city corridors.
                </div>
              </div>
              <div className="space-y-1">
                {routes.map((r) => (
                  <div key={r.route_id} className="flex justify-between items-center text-xs p-1">
                    <span className="text-[#242521]">{r.route_name}</span>
                    <span className="font-mono font-bold text-[#A86F18]">
                      {r.avg_delay_min || 2.4} min avg delay
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Layer Controls (Bottom Left) */}
      <div className="absolute bottom-24 left-4 z-10 bg-[#FFFFFF]/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#DDD9CF] p-3.5 w-64 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#242521] pb-2 border-b border-[#DDD9CF]">
          <Layers className="w-4 h-4 text-[#D89B32]" />
          <span>Map Visual Layers</span>
        </div>

        <div className="space-y-1.5 text-xs text-[#242521]">
          <label className="flex items-center justify-between cursor-pointer py-1 px-1 rounded-md hover:bg-[#F7F5EF]">
            <span className="font-medium">Stations</span>
            <input
              type="checkbox"
              checked={showStations}
              onChange={(e) => setShowStations(e.target.checked)}
              className="rounded accent-[#D89B32] h-4 w-4"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer py-1 px-1 rounded-md hover:bg-[#F7F5EF]">
            <span className="font-medium">Live Passenger Flow</span>
            <input
              type="checkbox"
              checked={showFlow}
              onChange={(e) => setShowFlow(e.target.checked)}
              className="rounded accent-[#D89B32] h-4 w-4"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer py-1 px-1 rounded-md hover:bg-[#F7F5EF]">
            <span className="font-medium">Crowd Level</span>
            <input
              type="checkbox"
              checked={showCrowd}
              onChange={(e) => setShowCrowd(e.target.checked)}
              className="rounded accent-[#D89B32] h-4 w-4"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer py-1 px-1 rounded-md hover:bg-[#F7F5EF]">
            <span className="font-medium">Delays</span>
            <input
              type="checkbox"
              checked={showDelays}
              onChange={(e) => setShowDelays(e.target.checked)}
              className="rounded accent-[#D89B32] h-4 w-4"
            />
          </label>
        </div>

        {activeRouteFilter && (
          <button
            onClick={() => setActiveRouteFilter(null)}
            className="w-full mt-2 py-1 text-[11px] font-semibold text-[#242521] bg-[#D89B32] hover:bg-[#E7AE45] rounded-lg transition-colors cursor-pointer"
          >
            Clear Route Filter
          </button>
        )}
      </div>

      {/* Floating Station Detail Card Overlay (Top Right) */}
      {selectedStationObj && (
        <div className="absolute top-4 right-4 z-10 w-80 bg-[#FFFFFF]/98 backdrop-blur-md rounded-2xl shadow-2xl border border-[#DDD9CF] p-5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-start justify-between pb-3 border-b border-[#DDD9CF]">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D89B32]"></span>
                <h3 className="text-base font-extrabold text-[#242521]">
                  {selectedStationObj.station_name}
                </h3>
              </div>
              <p className="text-xs text-[#6E6E67] font-medium mt-0.5">
                {selectedStationObj.zone} Zone • {selectedStationObj.station_type}
                {selectedStationObj.is_interchange ? ' • Interchange' : ''}
              </p>
            </div>
            <button
              onClick={() => onSelectStation(null)}
              className="text-[#6E6E67] hover:text-[#242521] p-1 rounded-lg hover:bg-[#F7F5EF] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Passenger count & surge from usual */}
          <div className="my-3.5 p-3.5 bg-[#F7F5EF] rounded-xl border border-[#DDD9CF] flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-[#6E6E67] uppercase tracking-wider">
                Current Passengers
              </div>
              <div className="text-2xl font-black text-[#242521] mt-0.5">
                {formatExactNumber(currentPass)}
              </div>
              <div className="text-[11px] font-bold flex items-center gap-1 mt-0.5 text-[#A86F18]">
                <span>{surgePct > 0 ? `↑ ${surgePct}%` : `↓ ${Math.abs(surgePct)}%`} from usual level</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-[#6E6E67] font-medium">Peak Hour</div>
              <div className="text-base font-bold text-[#242521]">
                08:30 AM
              </div>
            </div>
          </div>

          {/* Next arrivals schedule */}
          <div className="space-y-1.5 mb-4">
            <div className="text-[11px] font-bold text-[#6E6E67] uppercase tracking-wider">
              Next Arrivals
            </div>
            <div className="space-y-1">
              {selectedStationObj.lines_served.map((lineId, idx) => {
                const rt = routes.find((r) => r.route_id === lineId);
                const waitTime = 2 + idx * 3;
                return (
                  <div
                    key={lineId}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#F7F5EF] text-xs border border-[#DDD9CF]"
                  >
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: rt?.color_hex || '#D89B32' }}
                      ></span>
                      <span className="font-semibold text-[#242521]">
                        {rt?.route_name || lineId}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-[#A86F18]">
                      {waitTime} min
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clean CTA Button */}
          {onViewStationInsights && (
            <button
              onClick={() => onViewStationInsights(selectedStationObj.station_id)}
              className="w-full flex items-center justify-center space-x-2 py-2.5 bg-[#D89B32] hover:bg-[#E7AE45] text-[#242521] rounded-xl text-xs font-bold transition-all shadow-md shadow-[#D89B32]/25 cursor-pointer"
            >
              <span>View Station</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Floating Bottom Timeline Scrubber Player */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-11/12 max-w-2xl bg-[#FFFFFF]/95 backdrop-blur-md rounded-2xl shadow-2xl border border-[#DDD9CF] p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 rounded-full bg-[#D89B32] hover:bg-[#E7AE45] text-[#242521] flex items-center justify-center shadow-md transition-all cursor-pointer"
              title={isPlaying ? 'Pause simulation' : 'Play timeline'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <div>
              <span className="text-xs font-bold text-[#242521]">Explore Time</span>
              <span className="text-[11px] text-[#6E6E67] ml-2">Move slider to see demand shifts</span>
            </div>
          </div>

          {/* Current Time Badge */}
          <div className="bg-[#242621] text-[#F2C66D] px-3 py-1 rounded-full text-xs font-mono font-extrabold tracking-wider shadow-xs">
            {`${selectedHour.toString().padStart(2, '0')}:00`}
          </div>
        </div>

        {/* Diurnal Volume Bar Heights */}
        <div className="flex items-end justify-between h-8 px-1 mb-1 gap-1">
          {timelineHours.map((h) => {
            const isSelected = selectedHour === h;
            const heightPct = hourHeights[h as keyof typeof hourHeights] || 20;
            return (
              <div
                key={h}
                onClick={() => onHourChange(h)}
                className="flex-1 flex flex-col justify-end items-center cursor-pointer group"
                title={`${h}:00 - Volume index: ${heightPct}%`}
              >
                <div
                  className={`w-full rounded-t-xs transition-all duration-150 ${
                    isSelected
                      ? 'bg-[#D89B32] scale-y-110 shadow-xs'
                      : 'bg-[#DDD9CF] group-hover:bg-[#C5C0B3]'
                  }`}
                  style={{ height: `${heightPct}%` }}
                ></div>
              </div>
            );
          })}
        </div>

        {/* Slider input */}
        <input
          type="range"
          min="5"
          max="23"
          value={selectedHour}
          onChange={(e) => onHourChange(parseInt(e.target.value))}
          className="w-full h-1.5 bg-[#DDD9CF] rounded-lg appearance-none cursor-pointer accent-[#D89B32]"
        />

        {/* Hour Ticks */}
        <div className="flex justify-between text-[10px] text-[#6E6E67] font-semibold px-0.5 mt-1 font-mono">
          <span>06:00</span>
          <span>09:00</span>
          <span>12:00</span>
          <span>15:00</span>
          <span>18:00</span>
          <span>21:00</span>
        </div>
      </div>
    </div>
  );
};
