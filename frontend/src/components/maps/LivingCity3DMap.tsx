import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  Play,
  Pause,
  Layers,
  X,
  ArrowRight,
  Box,
  AlertTriangle,
  RotateCcw,
  Info,
  ChevronDown,
  ChevronUp,
  Activity,
  Compass,
  Map as MapIcon
} from 'lucide-react';
import { Route, Station, TransitNetwork } from '../../types/transit';
import { formatExactNumber } from '../../utils/formatters';
import { THEME } from '../../utils/theme';

interface LivingCity3DMapProps {
  routes: Route[];
  stations: Station[];
  selectedHour: number;
  onHourChange: (hour: number) => void;
  selectedStationId: string | null;
  onSelectStation: (stationId: string | null) => void;
  onViewStationInsights?: (stationId: string) => void;
  currentNetwork?: TransitNetwork | null;
}

interface SimulatedTrain {
  id: string;
  routeId: string;
  routeName: string;
  lineCode: string;
  color: string;
  path: [number, number][]; // [lng, lat]
  speed: number;
  progress: number;
  marker: maplibregl.Marker;
  element: HTMLDivElement;
}

interface SimulatedPedestrian {
  id: string;
  stationId: string;
  stationName: string;
  passengersPerHour: number;
  originLng: number;
  originLat: number;
  angle: number;
  maxRadius: number; // in degrees
  phase: number;
  speed: number;
  marker: maplibregl.Marker;
  element: HTMLDivElement;
}

export const LivingCity3DMap: React.FC<LivingCity3DMapProps> = ({
  routes,
  stations,
  selectedHour,
  onHourChange,
  selectedStationId,
  onSelectStation,
  onViewStationInsights,
  currentNetwork
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const stationMarkersRef = useRef<{ [id: string]: maplibregl.Marker }>({});
  const trainMarkersRef = useRef<maplibregl.Marker[]>([]);
  const activeTrainsRef = useRef<SimulatedTrain[]>([]);
  const pedestrianMarkersRef = useRef<SimulatedPedestrian[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Basemap & Visual Controls
  const [mapStyleMode, setMapStyleMode] = useState<'standard' | 'satellite'>(() => {
    if (typeof window !== 'undefined') {
      const s = new URLSearchParams(window.location.search).get('style');
      if (s === 'satellite') return 'satellite';
    }
    return 'standard';
  });
  const [showTraffic, setShowTraffic] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('traffic') === 'true';
    }
    return false;
  });
  const [is3DMode, setIs3DMode] = useState<boolean>(true);
  const [showBuildings, setShowBuildings] = useState<boolean>(true);
  const [showStations, setShowStations] = useState<boolean>(true);
  const [showVehicles, setShowVehicles] = useState<boolean>(true);
  const [showPedestrians, setShowPedestrians] = useState<boolean>(true);
  const [showCrowd, setShowCrowd] = useState<boolean>(false);
  const [showDelays, setShowDelays] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [networkTab, setNetworkTab] = useState<'routes' | 'stations' | 'crowd' | 'delays'>('routes');
  const [activeRouteFilter, setActiveRouteFilter] = useState<string | null>(null);
  const [isWebGLSupported, setIsWebGLSupported] = useState<boolean>(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isControlsCollapsed, setIsControlsCollapsed] = useState<boolean>(false);

  // Optional Mapbox token from environment variable
  const mapboxToken = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_MAPBOX_ACCESS_TOKEN) || '';

  // Hourly volume weights for scrubber
  const timelineHours = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  const hourHeights: Record<number, number> = {
    5: 18, 6: 35, 7: 65, 8: 95, 9: 100, 10: 75,
    11: 50, 12: 55, 13: 52, 14: 50, 15: 58, 16: 72,
    17: 92, 18: 98, 19: 88, 20: 64, 21: 42, 22: 26, 23: 15
  };

  // Geographic Center & Camera parameters per network
  const defaultCenter = useMemo<[number, number]>(() => {
    if (currentNetwork && currentNetwork.center) {
      return [currentNetwork.center[1], currentNetwork.center[0]]; // [lng, lat]
    }
    if (stations.length > 0) {
      const avgLat = stations.reduce((acc, s) => acc + s.latitude, 0) / stations.length;
      const avgLng = stations.reduce((acc, s) => acc + s.longitude, 0) / stations.length;
      return [avgLng, avgLat];
    }
    return [80.2376, 13.0475]; // Chennai default
  }, [currentNetwork, stations]);

  const defaultZoom = currentNetwork?.zoom || 11.8;
  const defaultPitch = currentNetwork?.pitch || 48;
  const defaultBearing = currentNetwork?.bearing || -10;

  // Generate realistic 3D geographic building footprints around transit corridors
  const geographicBuildingsGeoJSON = useMemo(() => {
    const features: any[] = [];
    if (!stations || stations.length === 0) return { type: 'FeatureCollection', features };

    stations.forEach((st, sIdx) => {
      // Density: Major hubs and interchanges have higher surrounding urban cluster density
      const clusterCount = st.is_interchange ? 14 : 7;
      const baseHeight = st.is_interchange ? 38 : 22;

      for (let b = 0; b < clusterCount; b++) {
        const angle = (b * (2 * Math.PI / clusterCount)) + (sIdx * 0.4);
        const dist = 0.0012 + (b % 4) * 0.0009; // 120m to 390m radius from station
        const bLng = st.longitude + (dist * Math.cos(angle)) / Math.cos((st.latitude * Math.PI) / 180);
        const bLat = st.latitude + dist * Math.sin(angle);

        // Realistic variations: high-rises near commercial hubs, mid-rises in suburban sectors
        const heightVariation = ((sIdx * 7 + b * 13) % 25);
        const height = Math.min(78, Math.max(14, baseHeight + heightVariation - (b % 3 === 0 ? 8 : 0)));
        const levels = Math.max(3, Math.round(height / 3.2));

        // Polygonal building footprint (approx 45m x 35m)
        const size = 0.00035 + (b % 3) * 0.0001;
        const coordinates = [
          [bLng - size, bLat - size],
          [bLng + size, bLat - size],
          [bLng + size, bLat + size],
          [bLng - size, bLat + size],
          [bLng - size, bLat - size]
        ];

        features.push({
          type: 'Feature',
          properties: {
            id: `BLD_${st.station_id}_${b}`,
            height,
            min_height: 0,
            levels,
            station_name: st.station_name,
            type: height > 45 ? 'Commercial High-Rise' : height > 28 ? 'Office Complex' : 'Mixed Urban Structure'
          },
          geometry: {
            type: 'Polygon',
            coordinates: [coordinates]
          }
        });
      }
    });

    return {
      type: 'FeatureCollection' as const,
      features
    };
  }, [stations]);

  // Setup 3D Buildings Vector Extrusions (Warm Limestone & Soft Architectural Sand)
  const setup3DBuildings = (map: maplibregl.Map) => {
    // 1. Add Procedural Real Geographic Buildings GeoJSON
    if (!map.getSource('procedural-buildings-source')) {
      map.addSource('procedural-buildings-source', {
        type: 'geojson',
        data: geographicBuildingsGeoJSON as any
      });
    } else {
      (map.getSource('procedural-buildings-source') as maplibregl.GeoJSONSource).setData(geographicBuildingsGeoJSON as any);
    }

    if (!map.getLayer('3d-buildings-procedural')) {
      try {
        map.addLayer({
          id: '3d-buildings-procedural',
          type: 'fill-extrusion',
          source: 'procedural-buildings-source',
          paint: {
            // Warm architectural stone palette: soft ivory sand to slate limestone
            'fill-extrusion-color': [
              'interpolate',
              ['linear'],
              ['get', 'height'],
              14, '#EDE8DC',
              30, '#E0D9CB',
              50, '#CFC6B6',
              75, '#B2A99A'
            ],
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'min_height'],
            'fill-extrusion-opacity': 0.85
          }
        });

        // Building click inspector
        map.on('click', '3d-buildings-procedural', (e) => {
          if (!e.features || e.features.length === 0) return;
          const props = e.features[0].properties || {};
          new maplibregl.Popup({ offset: [0, -10], closeButton: true })
            .setLngLat(e.lngLat)
            .setHTML(`
              <div style="font-family: system-ui, -apple-system, sans-serif; padding: 6px 10px; min-width: 150px; background: #FCFBF7; color: #242521;">
                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                  <div style="width: 8px; height: 8px; border-radius: 2px; background: #D89B32;"></div>
                  <div style="font-weight: 800; font-size: 12px; color: #242521;">${props.type || 'Urban Structure'}</div>
                </div>
                <div style="font-size: 11px; color: #6E6E67; margin-bottom: 2px;">
                  District: <span style="font-weight: 600; color: #242521;">${props.station_name || 'City Sector'}</span>
                </div>
                <div style="font-size: 11px; color: #6E6E67;">
                  Height: <span style="font-weight: 700; color: #D89B32;">${Math.round(Number(props.height || 24))}m</span> (${props.levels || 7} floors)
                </div>
              </div>
            `)
            .addTo(map);
        });

        map.on('mouseenter', '3d-buildings-procedural', () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', '3d-buildings-procedural', () => {
          map.getCanvas().style.cursor = '';
        });
      } catch (err) {
        console.warn('Procedural 3D buildings notice:', err);
      }
    }
  };

  // Update Route Vector Layers (Tracks, Glow, and Traffic States)
  const updateRouteLayers = (map: maplibregl.Map) => {
    if (!map.isStyleLoaded()) return;

    routes.forEach((route) => {
      const sourceId = `route-source-${route.route_id}`;
      const glowLayerId = `route-glow-${route.route_id}`;
      const lineLayerId = `route-line-${route.route_id}`;
      const trackLayerId = `route-track-${route.route_id}`;

      if (map.getLayer(trackLayerId)) map.removeLayer(trackLayerId);
      if (map.getLayer(lineLayerId)) map.removeLayer(lineLayerId);
      if (map.getLayer(glowLayerId)) map.removeLayer(glowLayerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    });

    routes.forEach((route) => {
      if (!route.coordinates_path || route.coordinates_path.length === 0) return;

      const sourceId = `route-source-${route.route_id}`;
      const isFilteredOut = activeRouteFilter !== null && activeRouteFilter !== route.route_id;
      const opacityMultiplier = isFilteredOut ? 0.2 : 1.0;

      // When traffic mode is active, color routes by congestion status
      let routeColor = route.color_hex;
      if (showTraffic) {
        if (route.operational_status === 'Delay' || (route.current_delay_min && route.current_delay_min > 5.0)) {
          routeColor = THEME.traffic.heavy; // Red / Dark Red
        } else if (route.operational_status === 'Busy' || (route.current_delay_min && route.current_delay_min > 2.5)) {
          routeColor = THEME.traffic.slow; // Amber
        } else {
          routeColor = THEME.traffic.normal; // Forest Green
        }
      }

      const coordinates = route.coordinates_path.map((coord) => [coord[1], coord[0]]);

      map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {
            route_id: route.route_id,
            route_name: route.route_name,
            color: routeColor
          },
          geometry: {
            type: 'LineString',
            coordinates
          }
        }
      });

      // 1. Soft corridor backing halo (provides high contrast on both standard and satellite)
      map.addLayer({
        id: `route-glow-${route.route_id}`,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': mapStyleMode === 'satellite' ? '#000000' : routeColor,
          'line-width': isFilteredOut ? 5 : 12,
          'line-opacity': mapStyleMode === 'satellite' ? 0.6 : 0.25 * opacityMultiplier,
          'line-blur': mapStyleMode === 'satellite' ? 2 : 4
        }
      });

      // 2. Main Elevated Transit Track Line
      map.addLayer({
        id: `route-line-${route.route_id}`,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': routeColor,
          'line-width': isFilteredOut ? 2.5 : 5,
          'line-opacity': 0.96 * opacityMultiplier
        }
      });

      // 3. Inner Technical Guideway Stripe
      map.addLayer({
        id: `route-track-${route.route_id}`,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#FFFFFF',
          'line-width': 1.6,
          'line-dasharray': [3, 4],
          'line-opacity': 0.85 * opacityMultiplier
        }
      });
    });
  };

  // Base map style definition with Real Roads (Esri World Street Map) and Real Satellite (Esri World Imagery)
  const mapStyleDefinition = useMemo<maplibregl.StyleSpecification>(() => {
    return {
      version: 8,
      name: 'TRANSITX Dual Environment',
      sources: {
        'esri-street-source': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
          ],
          tileSize: 256,
          attribution: 'Tiles &copy; Esri &mdash; Real Road Network &amp; Street Geography'
        },
        'esri-satellite-source': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          ],
          tileSize: 256,
          attribution: 'Tiles &copy; Esri &mdash; High-Resolution Earth Imagery'
        }
      },
      layers: [
        {
          id: 'esri-street-layer',
          type: 'raster',
          source: 'esri-street-source',
          paint: {
            'raster-opacity': mapStyleMode === 'standard' ? 1.0 : 0.0,
            'raster-fade-duration': 350
          }
        },
        {
          id: 'esri-satellite-layer',
          type: 'raster',
          source: 'esri-satellite-source',
          paint: {
            'raster-opacity': mapStyleMode === 'satellite' ? 1.0 : 0.0,
            'raster-fade-duration': 350
          }
        }
      ]
    };
  }, [mapStyleMode]);

  // Initialize MapLibre GL with Real Geographic World Foundation
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const hasWebGL =
      typeof window !== 'undefined' &&
      !!(window.WebGLRenderingContext &&
        (document.createElement('canvas').getContext('webgl') ||
          document.createElement('canvas').getContext('experimental-webgl')));

    if (!hasWebGL) {
      setIsWebGLSupported(false);
      return;
    }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: mapStyleDefinition,
      center: defaultCenter,
      zoom: defaultZoom,
      pitch: defaultPitch,
      bearing: defaultBearing
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: true }), 'bottom-right');

    map.on('error', (e) => {
      console.warn('Map engine notice:', e);
    });

    map.on('load', () => {
      mapInstanceRef.current = map;
      setup3DBuildings(map);
      updateRouteLayers(map);
    });

    mapInstanceRef.current = map;

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      Object.values(stationMarkersRef.current).forEach((m) => m.remove());
      trainMarkersRef.current.forEach((m) => m.remove());
      pedestrianMarkersRef.current.forEach((p) => p.marker.remove());
      stationMarkersRef.current = {};
      trainMarkersRef.current = [];
      activeTrainsRef.current = [];
      pedestrianMarkersRef.current = [];
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Smooth Basemap Switcher (Standard Roads vs Genuine Satellite)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !map.isStyleLoaded()) return;

    if (map.getLayer('esri-street-layer')) {
      map.setPaintProperty('esri-street-layer', 'raster-opacity', mapStyleMode === 'standard' ? 1.0 : 0.0);
    }
    if (map.getLayer('esri-satellite-layer')) {
      map.setPaintProperty('esri-satellite-layer', 'raster-opacity', mapStyleMode === 'satellite' ? 1.0 : 0.0);
    }

    // Refresh route glow halos for optimal contrast on satellite imagery
    updateRouteLayers(map);
  }, [mapStyleMode]);

  // Handle City / Network Change: Smoothly fly to new city coordinates
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo({
      center: defaultCenter,
      zoom: defaultZoom,
      pitch: is3DMode ? defaultPitch : 0,
      bearing: is3DMode ? defaultBearing : 0,
      duration: 1800,
      essential: true
    });
    // Refresh procedural 3D building models for the selected network
    if (mapInstanceRef.current.isStyleLoaded()) {
      setup3DBuildings(mapInstanceRef.current);
      updateRouteLayers(mapInstanceRef.current);
    }
  }, [defaultCenter, defaultZoom, defaultPitch, defaultBearing, geographicBuildingsGeoJSON]);

  // Synchronize 3D Buildings visibility
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !map.isStyleLoaded()) return;

    if (map.getLayer('3d-buildings-procedural')) {
      map.setLayoutProperty('3d-buildings-procedural', 'visibility', showBuildings && is3DMode ? 'visible' : 'none');
    }
  }, [showBuildings, is3DMode]);

  // Refresh Route and Traffic Layers when filters, traffic state, or routes update
  useEffect(() => {
    if (mapInstanceRef.current && mapInstanceRef.current.isStyleLoaded()) {
      updateRouteLayers(mapInstanceRef.current);
    }
  }, [routes, activeRouteFilter, showTraffic]);

  // Update 3D Station Nodes (Warm Urban High-Contrast Markers)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    Object.values(stationMarkersRef.current).forEach((m) => m.remove());
    stationMarkersRef.current = {};

    if (!showStations) return;

    stations.forEach((station) => {
      const isFilteredOut = activeRouteFilter !== null && !station.lines_served.includes(activeRouteFilter);
      if (isFilteredOut) return;

      const isSelected = selectedStationId === station.station_id;

      // Status color matching AMBER / URBAN theme
      let statusColor: string = '#6E6E67'; // Normal warm gray
      let statusLabel = 'Normal Operation';

      if (isSelected) {
        statusColor = THEME.primaryAmber; // Amber for selected station
        statusLabel = 'Selected Station';
      } else if (showCrowd) {
        if (station.crowd_level === 'High' || station.crowd_level === 'Critical' || (station.current_passengers && station.current_passengers > 3500)) {
          statusColor = THEME.terracotta;
          statusLabel = 'High Passenger Density';
        } else if (station.crowd_level === 'Moderate') {
          statusColor = THEME.primaryAmber;
          statusLabel = 'Moderate Demand';
        } else {
          statusColor = '#6E6E67';
          statusLabel = 'Normal Demand';
        }
      } else if (showDelays || showTraffic) {
        const del = station.current_delay_min || 1.8;
        if (del > 5.0) {
          statusColor = THEME.semantic.severe;
          statusLabel = `${del} min delay (Congested)`;
        } else if (del > 2.5) {
          statusColor = THEME.primaryAmber;
          statusLabel = `${del} min delay (Slow)`;
        } else {
          statusColor = THEME.semantic.normal;
          statusLabel = `${del} min delay (On Time)`;
        }
      }

      const el = document.createElement('div');
      el.className = 'group relative cursor-pointer';
      el.style.width = '36px';
      el.style.height = '36px';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';

      el.innerHTML = `
        <div class="relative flex items-center justify-center">
          ${
            station.is_interchange || isSelected
              ? `<div class="absolute -inset-2 rounded-full animate-ping opacity-35" style="background-color: ${statusColor};"></div>`
              : ''
          }
          <div class="relative flex items-center justify-center rounded-full transition-all duration-300 shadow-md ${
            isSelected
              ? 'ring-4 ring-[#242521] scale-130 shadow-xl'
              : 'hover:scale-125 hover:shadow-lg'
          }" style="
            width: ${station.is_interchange ? '18px' : '14px'};
            height: ${station.is_interchange ? '18px' : '14px'};
            background-color: ${statusColor};
            border: 2.5px solid #FCFBF7;
          ">
            ${
              station.is_interchange
                ? '<div style="width: 5px; height: 5px; border-radius: 9999px; background-color: #FCFBF7;"></div>'
                : ''
            }
          </div>
        </div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelectStation(station.station_id);
        map.flyTo({
          center: [station.longitude, station.latitude],
          zoom: 14.5,
          pitch: is3DMode ? defaultPitch : 0,
          duration: 900
        });
      });

      const popup = new maplibregl.Popup({ offset: [0, -18], closeButton: false })
        .setHTML(`
          <div style="font-family: system-ui, -apple-system, sans-serif; padding: 6px 9px; min-width: 145px; background: #FCFBF7; color: #242521;">
            <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 2px;">
              <span style="display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: ${statusColor};"></span>
              <strong style="font-size: 12px; color: #242521;">${station.station_name}</strong>
            </div>
            <div style="font-size: 10.5px; color: #6E6E67; margin-bottom: 2px;">
              ${station.station_type} • ${station.zone}
            </div>
            <div style="font-size: 11px; font-weight: 700; color: ${statusColor};">
              ${statusLabel}
            </div>
          </div>
        `);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([station.longitude, station.latitude])
        .setPopup(popup)
        .addTo(map);

      stationMarkersRef.current[station.station_id] = marker;
    });
  }, [stations, selectedStationId, showStations, showCrowd, showDelays, showTraffic, activeRouteFilter, is3DMode]);

  // Active Metro Vehicles & Simulated Commuters Animation Tick
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    trainMarkersRef.current.forEach((m) => m.remove());
    pedestrianMarkersRef.current.forEach((p) => p.marker.remove());
    trainMarkersRef.current = [];
    activeTrainsRef.current = [];
    pedestrianMarkersRef.current = [];

    // 1. Moving Metro Trains (Charcoal body, Warm livery stripe, Golden headlights)
    if (showVehicles) {
      routes.forEach((route, rIdx) => {
        if (activeRouteFilter && activeRouteFilter !== route.route_id) return;
        if (!route.coordinates_path || route.coordinates_path.length < 2) return;

        const pathLngLat: [number, number][] = route.coordinates_path.map((c) => [c[1], c[0]]);
        const trainCount = selectedHour >= 8 && selectedHour <= 19 ? 3 : 2;

        for (let i = 0; i < trainCount; i++) {
          const initialProgress = (i / trainCount + rIdx * 0.2) % 1.0;

          const trainEl = document.createElement('div');
          trainEl.className = 'transit-train-marker flex items-center justify-center';
          trainEl.style.width = '32px';
          trainEl.style.height = '32px';
          trainEl.style.pointerEvents = 'auto';
          trainEl.style.cursor = 'pointer';

          trainEl.innerHTML = `
            <div class="relative flex items-center justify-center">
              <div class="absolute -top-3 w-3 h-4 bg-amber-100/60 blur-[2px] rounded-full"></div>
              <div class="relative flex items-center justify-center w-5 h-8 rounded-md shadow-lg border border-[#FCFBF7]/90 transition-transform" style="
                background: linear-gradient(180deg, #242521 0%, ${route.color_hex} 65%);
              ">
                <div class="absolute top-1 w-3.5 h-1.5 bg-[#EEEAE0]/90 rounded-xs"></div>
                <div class="absolute top-0.5 flex justify-between w-3">
                  <span class="w-1 h-1 rounded-full bg-amber-200"></span>
                  <span class="w-1 h-1 rounded-full bg-amber-200"></span>
                </div>
                <div class="w-2.5 h-0.5 bg-white/40 my-0.5"></div>
                <div class="w-2.5 h-0.5 bg-white/40"></div>
              </div>
            </div>
          `;

          const popup = new maplibregl.Popup({ offset: [0, -16], closeButton: false })
            .setHTML(`
              <div style="font-family: system-ui; padding: 5px 8px; font-size: 11px; background: #FCFBF7; color: #242521;">
                <span style="font-weight: 800; color: ${route.color_hex};">${route.line_code} METRO TRAIN</span>
                <div style="color: #6E6E67; font-size: 10px;">${route.route_name} • Operational Service</div>
              </div>
            `);

          const marker = new maplibregl.Marker({ element: trainEl, rotationAlignment: 'map' })
            .setLngLat(pathLngLat[0])
            .setPopup(popup)
            .addTo(map);

          trainMarkersRef.current.push(marker);

          activeTrainsRef.current.push({
            id: `TR_${route.route_id}_${i}`,
            routeId: route.route_id,
            routeName: route.route_name,
            lineCode: route.line_code,
            color: route.color_hex,
            path: pathLngLat,
            speed: 0.0004 + Math.random() * 0.0001,
            progress: initialProgress,
            marker,
            element: trainEl
          });
        }
      });
    }

    // 2. Data-Driven Commuter Pedestrian Flows (Neutral Charcoal, Muted Olive, Warm Terracotta, Amber)
    if (showPedestrians) {
      const pedColors = ['#242521', '#4A4E46', '#D89B32', '#7B8068', '#52574E', '#C56F4B', '#343831'];
      const volumeWeight = (hourHeights[selectedHour] || 50) / 75;

      stations.forEach((station) => {
        if (activeRouteFilter && !station.lines_served.includes(activeRouteFilter)) return;

        const baseCount = station.is_interchange ? 5 : 3;
        const pedCount = Math.max(2, Math.min(8, Math.round(baseCount * volumeWeight)));

        for (let pIdx = 0; pIdx < pedCount; pIdx++) {
          const pedEl = document.createElement('div');
          pedEl.className = 'transit-pedestrian-figure flex flex-col items-center justify-center pointer-events-auto cursor-pointer';
          pedEl.style.width = '14px';
          pedEl.style.height = '18px';

          const color = pedColors[(pIdx + station.station_id.charCodeAt(0)) % pedColors.length];

          pedEl.innerHTML = `
            <div class="relative flex flex-col items-center group">
              <div style="width: 5px; height: 5px; border-radius: 9999px; background-color: #242521; border: 0.8px solid #FCFBF7;"></div>
              <div style="width: 6px; height: 9px; border-radius: 2px; background-color: ${color}; margin-top: -1px; border: 0.5px solid #FCFBF7; box-shadow: 0 1px 2px rgba(0,0,0,0.25);"></div>
              <div style="width: 8px; height: 2.5px; border-radius: 9999px; background-color: rgba(36, 37, 33, 0.28); filter: blur(0.6px); margin-top: 0.5px;"></div>
            </div>
          `;

          const pedPopup = new maplibregl.Popup({ offset: [0, -12], closeButton: false })
            .setHTML(`
              <div style="font-family: system-ui, -apple-system, sans-serif; padding: 5px 8px; font-size: 11px; min-width: 155px; background: #FCFBF7; color: #242521;">
                <div style="display: flex; align-items: center; gap: 4px; font-weight: 800; color: #242521;">
                  <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #D89B32;"></span>
                  Commuter Flow
                </div>
                <div style="color: #6E6E67; font-size: 10px; margin-top: 2px;">
                  Plaza & Entrance • ${station.station_name}
                </div>
                <div style="color: #242521; font-weight: 700; font-size: 10px; margin-top: 1px;">
                  ~${(station.current_passengers || 2400).toLocaleString()} pass/hr aggregate rate
                </div>
                <div style="color: #6E6E67; font-size: 9px; margin-top: 4px; border-top: 1px solid #DDD9CF; padding-top: 3px;">
                  Simulated passenger activity (no personal GPS tracking)
                </div>
              </div>
            `);

          const angle = (pIdx * (2 * Math.PI / pedCount)) + (station.station_id.charCodeAt(0) * 0.1);
          const maxRadius = 0.00035 + (pIdx % 3) * 0.00015;
          const initialPhase = (pIdx / pedCount + (station.station_id.charCodeAt(station.station_id.length - 1) % 5) * 0.2) % 1.0;

          const marker = new maplibregl.Marker({ element: pedEl })
            .setLngLat([station.longitude, station.latitude])
            .setPopup(pedPopup)
            .addTo(map);

          pedestrianMarkersRef.current.push({
            id: `PED_${station.station_id}_${pIdx}`,
            stationId: station.station_id,
            stationName: station.station_name,
            passengersPerHour: station.current_passengers || 2400,
            originLng: station.longitude,
            originLat: station.latitude,
            angle,
            maxRadius,
            phase: initialPhase,
            speed: 0.0025 + Math.random() * 0.0015,
            marker,
            element: pedEl
          });
        }
      });
    }

    // 3. Combined High-Performance Animation Loop
    let lastTime = performance.now();
    const animateScene = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // Animate Vehicles
      activeTrainsRef.current.forEach((train) => {
        train.progress = (train.progress + train.speed * (delta * 60)) % 1.0;

        const totalSegments = train.path.length - 1;
        const segmentFloat = train.progress * totalSegments;
        const segIndex = Math.min(Math.floor(segmentFloat), totalSegments - 1);
        const t = segmentFloat - segIndex;

        const p1 = train.path[segIndex];
        const p2 = train.path[segIndex + 1];

        const lng = p1[0] + (p2[0] - p1[0]) * t;
        const lat = p1[1] + (p2[1] - p1[1]) * t;

        const dLng = p2[0] - p1[0];
        const dLat = p2[1] - p1[1];
        const bearingDeg = (Math.atan2(dLng, dLat) * 180) / Math.PI;

        train.marker.setLngLat([lng, lat]);
        train.marker.setRotation(bearingDeg);
      });

      // Animate Pedestrians
      pedestrianMarkersRef.current.forEach((ped) => {
        ped.phase = (ped.phase + ped.speed * (delta * 60)) % 1.0;
        const progress = Math.abs(Math.sin(ped.phase * Math.PI));
        const r = ped.maxRadius * progress;
        const lng = ped.originLng + (r * Math.cos(ped.angle)) / Math.cos((ped.originLat * Math.PI) / 180);
        const lat = ped.originLat + r * Math.sin(ped.angle);
        ped.marker.setLngLat([lng, lat]);
      });

      animFrameRef.current = requestAnimationFrame(animateScene);
    };

    animFrameRef.current = requestAnimationFrame(animateScene);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [routes, stations, showVehicles, showPedestrians, activeRouteFilter, selectedHour]);

  // Timeline scrubber playback simulation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      onHourChange(selectedHour >= 23 ? 5 : selectedHour + 1);
    }, 1500);
    return () => clearInterval(interval);
  }, [isPlaying, selectedHour, onHourChange]);

  // Camera Controls
  const toggle3DMode = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const next3D = !is3DMode;
    setIs3DMode(next3D);
    map.easeTo({
      pitch: next3D ? defaultPitch : 0,
      bearing: next3D ? defaultBearing : 0,
      duration: 1000
    });
  };

  const resetCamera = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo({
      center: defaultCenter,
      zoom: defaultZoom,
      pitch: is3DMode ? defaultPitch : 0,
      bearing: is3DMode ? defaultBearing : 0,
      duration: 1200
    });
    setActiveRouteFilter(null);
    onSelectStation(null);
  };

  const selectedStationObj = stations.find((s) => s.station_id === selectedStationId);
  const currentPass = selectedStationObj?.current_passengers || 2400;
  const usualPass = selectedStationObj?.avg_passengers_per_hour || 2100;
  const surgePct = Math.round(((currentPass - usualPass) / usualPass) * 100);

  return (
    <div className="relative w-full h-full bg-[#E8E2D5] overflow-hidden select-none font-sans">
      {/* Real Map Canvas */}
      <div ref={mapContainerRef} className="absolute inset-0 z-0 w-full h-full" />

      {/* Fallback Banner if WebGL is unavailable */}
      {!isWebGLSupported && (
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-[#F7F5EF] p-6 text-center">
          <div className="max-w-md bg-[#FFFFFF] p-6 rounded-2xl shadow-xl border border-[#DDD9CF]">
            <AlertTriangle className="w-10 h-10 text-[#D89B32] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#242521]">WebGL Acceleration Unavailable</h3>
            <p className="text-xs text-[#6E6E67] mt-1">
              Rendering the interactive network summary. All transit metrics and operational dashboards remain fully functional.
            </p>
          </div>
        </div>
      )}

      {/* ─── MASTER APP SHELL: 3-ZONE RESERVED VIEWPORT LAYOUT ─── */}
      <div className="absolute inset-0 z-10 pointer-events-none p-3 sm:p-4 flex flex-col justify-between overflow-hidden">
        
        {/* UPPER ROW: Left Control Zone | Center Map Space | Right Detail Zone */}
        <div className="flex-1 flex justify-between min-h-0 gap-3 sm:gap-4 overflow-hidden">
          
          {/* ─── ZONE 1: LEFT UI ZONE (Reserved Width: 340px - 360px) ─── */}
          <div className="w-[340px] sm:w-[350px] md:w-[360px] max-h-full flex flex-col gap-2.5 shrink-0 overflow-y-auto pr-1 pb-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#D8D3C8] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#B8B2A6]">
            
            {/* Panel 1: Main Network Overview Panel */}
            <div className="w-full bg-[#FCFBF7]/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#DDD9CF] p-3 transition-all pointer-events-auto shrink-0">
              <div className="flex items-center justify-between pb-2 border-b border-[#DDD9CF]">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#5F8A63]"></span>
                    <h2 className="text-sm font-bold text-[#242521]">
                      {currentNetwork?.name || 'Transit Network'}
                    </h2>
                  </div>
                  <p className="text-[11px] text-[#6E6E67] font-medium">
                    {currentNetwork?.city || 'India'}, {currentNetwork?.state || ''}
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FFF8EB] text-[#A86F18] border border-[#FDE4B4]">
                  {routes.length} Lines
                </span>
              </div>

              {/* Overview Tabs: Routes | Stations | Crowd | Delays */}
              <div className="flex items-center space-x-1 mt-2 p-1 bg-[#F7F5EF] rounded-xl text-xs font-semibold text-[#6E6E67] border border-[#DDD9CF]/60">
                {(['routes', 'stations', 'crowd', 'delays'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setNetworkTab(tab)}
                    className={`flex-1 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                      networkTab === tab
                        ? 'bg-[#D89B32] text-[#242521] shadow-xs font-bold'
                        : 'hover:text-[#242521] text-[#6E6E67]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content (Scrollable internally) */}
              <div className="mt-2 max-h-24 sm:max-h-28 overflow-y-auto space-y-1 pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#DDD9CF] [&::-webkit-scrollbar-thumb]:rounded-full">
                {networkTab === 'routes' &&
                  routes.map((route) => {
                    const isFiltered = activeRouteFilter === route.route_id;
                    return (
                      <div
                        key={route.route_id}
                        onClick={() => {
                          const nextFilter = isFiltered ? null : route.route_id;
                          setActiveRouteFilter(nextFilter);
                          if (nextFilter && route.coordinates_path && route.coordinates_path.length > 0) {
                            const midPoint = route.coordinates_path[Math.floor(route.coordinates_path.length / 2)];
                            mapInstanceRef.current?.flyTo({
                              center: [midPoint[1], midPoint[0]],
                              zoom: 12.5,
                              pitch: is3DMode ? defaultPitch : 0,
                              duration: 1000
                            });
                          }
                        }}
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
                    {stations.slice(0, 10).map((st) => (
                      <div
                        key={st.station_id}
                        onClick={() => {
                          onSelectStation(st.station_id);
                          mapInstanceRef.current?.flyTo({
                            center: [st.longitude, st.latitude],
                            zoom: 14.5,
                            pitch: is3DMode ? defaultPitch : 0,
                            duration: 1000
                          });
                        }}
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
                        Peak Crowding Hubs
                      </div>
                      <div className="mt-1 text-[11px] text-[#7D5514]">
                        Interchange junctions reach high commuter density during peak commute hours (08:30–09:30 & 17:30–19:00).
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
                      <div className="p-2 rounded-lg bg-[#E9EFE9] border border-[#3E7659]/30">
                        <div className="text-[#243C35] font-bold">Standard Demand</div>
                        <div className="text-[#6E6E67]">&lt; 45% Capacity</div>
                      </div>
                      <div className="p-2 rounded-lg bg-[#FAF3E5] border border-[#D89B32]/40">
                        <div className="text-[#7D5514] font-bold">Peak Demand</div>
                        <div className="text-[#6E6E67]">&gt; 75% Capacity</div>
                      </div>
                    </div>
                  </div>
                )}

                {networkTab === 'delays' && (
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#F7F5EF] border border-[#DDD9CF] text-[#242521]">
                      <div className="font-bold">Historical Operational Delays</div>
                      <div className="mt-0.5 text-[11px] text-[#6E6E67]">
                        Recorded scheduled headways across operational corridors.
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

            {/* Panel 2: 3D Living Controls (Warm White & Amber) */}
            <div className="w-full bg-[#FCFBF7]/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#DDD9CF] p-2.5 space-y-1 pointer-events-auto shrink-0 transition-all">
              <div className="flex items-center justify-between pb-1 border-b border-[#DDD9CF]">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#242521]">
                  <Layers className="w-4 h-4 text-[#D89B32]" />
                  <span>3D Living Controls</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* 3D Tilt Toggle */}
                  <button
                    onClick={toggle3DMode}
                    className={`flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors cursor-pointer ${
                      is3DMode
                        ? 'bg-[#D89B32] text-[#242521] border-[#D89B32] shadow-xs'
                        : 'bg-[#F7F5EF] text-[#6E6E67] border-[#DDD9CF]'
                    }`}
                    title="Toggle 3D Camera Perspective (48°)"
                  >
                    <Box className="w-3 h-3" />
                    <span>{is3DMode ? '3D Active' : '2D Flat'}</span>
                  </button>

                  {/* Collapse/Expand Toggle */}
                  <button
                    onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
                    className="p-1 rounded-md text-[#6E6E67] hover:text-[#242521] hover:bg-[#F7F5EF] transition-colors cursor-pointer"
                    title={isControlsCollapsed ? 'Expand 3D Controls' : 'Collapse 3D Controls'}
                  >
                    {isControlsCollapsed ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronUp className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {!isControlsCollapsed && (
                <>
                  {/* Reset View Button */}
                  <button
                    onClick={resetCamera}
                    className="w-full flex items-center justify-center space-x-1.5 py-1 text-[11px] font-semibold text-[#242521] bg-[#F7F5EF] hover:bg-[#EEEAE0] rounded-lg transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#6E6E67]" />
                    <span>Reset Network View</span>
                  </button>

                  {/* Layer Checkboxes */}
                  <div className="space-y-0.5 text-xs text-[#242521] pt-0.5">
                    <label className="flex items-center justify-between cursor-pointer py-0.5 px-1 rounded hover:bg-[#F7F5EF]">
                      <span className="font-medium text-[11px]">3D Urban Buildings</span>
                      <input
                        type="checkbox"
                        checked={showBuildings}
                        onChange={(e) => setShowBuildings(e.target.checked)}
                        className="rounded accent-[#D89B32] h-3.5 w-3.5 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer py-0.5 px-1 rounded hover:bg-[#F7F5EF]">
                      <span className="font-medium text-[11px]">Stations (3D Nodes)</span>
                      <input
                        type="checkbox"
                        checked={showStations}
                        onChange={(e) => setShowStations(e.target.checked)}
                        className="rounded accent-[#D89B32] h-3.5 w-3.5 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer py-0.5 px-1 rounded hover:bg-[#F7F5EF]">
                      <span className="font-medium text-[11px]">Moving Metro Trains</span>
                      <input
                        type="checkbox"
                        checked={showVehicles}
                        onChange={(e) => setShowVehicles(e.target.checked)}
                        className="rounded accent-[#D89B32] h-3.5 w-3.5 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer py-0.5 px-1 rounded hover:bg-[#F7F5EF]">
                      <span className="font-medium text-[11px]">Pedestrian Activity (Simulated)</span>
                      <input
                        type="checkbox"
                        checked={showPedestrians}
                        onChange={(e) => setShowPedestrians(e.target.checked)}
                        className="rounded accent-[#D89B32] h-3.5 w-3.5 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer py-0.5 px-1 rounded hover:bg-[#F7F5EF]">
                      <span className="font-medium text-[11px]">Crowd Density</span>
                      <input
                        type="checkbox"
                        checked={showCrowd}
                        onChange={(e) => setShowCrowd(e.target.checked)}
                        className="rounded accent-[#D89B32] h-3.5 w-3.5 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer py-0.5 px-1 rounded hover:bg-[#F7F5EF]">
                      <span className="font-medium text-[11px]">Operational Delays</span>
                      <input
                        type="checkbox"
                        checked={showDelays}
                        onChange={(e) => setShowDelays(e.target.checked)}
                        className="rounded accent-[#D89B32] h-3.5 w-3.5 cursor-pointer"
                      />
                    </label>
                  </div>

                  {/* Ethical / Aggregate Disclosure Note */}
                  <div className="pt-1.5 border-t border-[#DDD9CF] flex items-start gap-1 text-[9.5px] text-[#6E6E67] leading-tight">
                    <Info className="w-3 h-3 text-[#6E6E67] shrink-0 mt-0.5" />
                    <span>
                      People figures represent simulated aggregate passenger activity, not individual GPS tracking.
                    </span>
                  </div>

                  {activeRouteFilter && (
                    <button
                      onClick={() => setActiveRouteFilter(null)}
                      className="w-full mt-1.5 py-1 text-[11px] font-semibold text-[#242521] bg-[#D89B32] hover:bg-[#E7AE45] rounded-lg transition-colors cursor-pointer"
                    >
                      Clear Route Filter
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* ─── ZONE 2: CENTER MAP VIEWPORT with TOP FLOATING CONTROLS ─── */}
          <div className="flex-1 min-w-0 flex flex-col justify-between pointer-events-none px-1">
            
            {/* Top Center-Right Floating Bar: Map Style Switcher (Standard / Satellite) & Traffic Toggle */}
            <div className="flex items-center justify-end pointer-events-none">
              <div className="flex items-center gap-2 bg-[#FCFBF7]/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#DDD9CF] shadow-lg pointer-events-auto">
                {/* Standard / Satellite Switcher */}
                <div className="flex items-center space-x-1.5 border-r border-[#DDD9CF] pr-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E6E67]">Basemap</span>
                  <div className="flex bg-[#F7F5EF] p-0.5 rounded-lg text-[11px] font-bold">
                    <button
                      onClick={() => setMapStyleMode('standard')}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        mapStyleMode === 'standard'
                          ? 'bg-[#D89B32] text-[#242521] shadow-xs'
                          : 'text-[#6E6E67] hover:text-[#242521]'
                      }`}
                    >
                      Standard
                    </button>
                    <button
                      onClick={() => setMapStyleMode('satellite')}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        mapStyleMode === 'satellite'
                          ? 'bg-[#D89B32] text-[#242521] shadow-xs'
                          : 'text-[#6E6E67] hover:text-[#242521]'
                      }`}
                    >
                      Satellite
                    </button>
                  </div>
                </div>

                {/* Traffic Toggle */}
                <button
                  onClick={() => setShowTraffic(!showTraffic)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                    showTraffic
                      ? 'bg-[#D89B32] text-[#242521] border-[#D89B32] shadow-xs'
                      : 'bg-[#F7F5EF] text-[#6E6E67] border-[#DDD9CF] hover:text-[#242521]'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${showTraffic ? 'bg-[#242521] animate-pulse' : 'bg-[#92958B]'}`}></span>
                  <span>Traffic: {showTraffic ? 'ON' : 'OFF'}</span>
                </button>
              </div>
            </div>

            {/* Informational Traffic Status Banner (Honest Data Distinction) */}
            {showTraffic && (
              <div className="self-center mt-2 bg-[#FCFBF7]/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#DDD9CF] text-[#242521] text-xs shadow-md pointer-events-auto flex items-center gap-2 animate-in fade-in duration-200">
                <Info className="w-3.5 h-3.5 text-[#D89B32] shrink-0" />
                <span className="text-[11px]">
                  <strong>Traffic Layer:</strong> Live road traffic provider requires Mapbox token (see <code className="bg-[#F7F5EF] px-1 rounded">.env.example</code>). Displaying historical transit congestion patterns.
                </span>
                <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-[#DDD9CF] text-[10px] font-bold">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#5F8A63]"></span>Normal</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#D89B32]"></span>Slow</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#C96F4A]"></span>Heavy</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#8B1E1E]"></span>Severe</span>
                </div>
              </div>
            )}

            <div className="flex-1 pointer-events-none" />
          </div>

          {/* ─── ZONE 3: RIGHT DETAIL ZONE (Reserved Width: 320px - 340px) ─── */}
          {selectedStationObj ? (
            <div className="w-[320px] sm:w-[340px] max-h-full flex flex-col shrink-0 overflow-y-auto pointer-events-none scrollbar-thin">
              <div className="w-full bg-[#FCFBF7]/98 backdrop-blur-md rounded-2xl shadow-2xl border border-[#DDD9CF] p-4 sm:p-5 pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-200 shrink-0">
                <div className="flex items-start justify-between pb-3 border-b border-[#DDD9CF]">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D89B32]"></span>
                      <h3 className="text-base font-extrabold text-[#242521]">
                        {selectedStationObj.station_name}
                      </h3>
                    </div>
                    <p className="text-xs text-[#6E6E67] font-medium mt-0.5">
                      {selectedStationObj.zone} • {selectedStationObj.station_type}
                      {selectedStationObj.is_interchange ? ' • Interchange' : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => onSelectStation(null)}
                    className="p-1 rounded-lg text-[#6E6E67] hover:bg-[#F7F5EF] hover:text-[#242521] transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Key Passenger Volume Metrics */}
                <div className="grid grid-cols-2 gap-3 my-4">
                  <div className="p-3 rounded-xl bg-[#F7F5EF] border border-[#DDD9CF]">
                    <div className="text-[10px] uppercase font-bold text-[#6E6E67]">
                      Current Passengers
                    </div>
                    <div className="text-xl font-extrabold text-[#242521] mt-0.5">
                      {currentPass.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-[#C96F4A] font-semibold mt-0.5">
                      {surgePct >= 0 ? `↑ ${surgePct}% from usual level` : `↓ ${Math.abs(surgePct)}% from usual level`}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F7F5EF] border border-[#DDD9CF]">
                    <div className="text-[10px] uppercase font-bold text-[#6E6E67]">
                      Rush Hour
                    </div>
                    <div className="text-xl font-extrabold text-[#242521] mt-0.5">
                      08:30 AM
                    </div>
                    <div className="text-[10px] text-[#6E6E67] mt-0.5">
                      Peak volume period
                    </div>
                  </div>
                </div>

                {/* Next Arrivals / Line Connections */}
                <div className="mb-4">
                  <div className="text-xs font-bold text-[#242521] mb-2 uppercase tracking-wide">
                    Next Arrivals
                  </div>
                  <div className="space-y-1.5">
                    {selectedStationObj.lines_served.map((lineId, idx) => {
                      const rt = routes.find((r) => r.route_id === lineId);
                      const waitTime = Math.max(1, (idx * 3 + (selectedHour % 4) + 1));
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

                {/* CTA Button */}
                {onViewStationInsights && (
                  <button
                    onClick={() => onViewStationInsights(selectedStationObj.station_id)}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 bg-[#D89B32] hover:bg-[#E7AE45] text-[#242521] rounded-xl text-xs font-bold transition-all shadow-md shadow-[#D89B32]/25 cursor-pointer"
                  >
                    <span>View Station Insights</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ) : null}

        </div>

        {/* ─── ZONE 4: BOTTOM TIME MACHINE ZONE (Horizontal Strip Centered in Map Space) ─── */}
        <div className="shrink-0 flex items-center justify-center pt-3 pointer-events-none">
          {/* Left spacing balance: Matches left panel width on desktop so Time Machine centers in map space */}
          <div className="hidden lg:block w-[340px] sm:w-[350px] md:w-[360px] shrink-0 pointer-events-none" />

          {/* Time Machine: Horizontally centered within the available map viewport */}
          <div className="flex-1 min-w-0 flex justify-center pointer-events-none px-2">
            <div className="w-full max-w-lg md:max-w-xl lg:max-w-2xl bg-[#FCFBF7]/95 backdrop-blur-md rounded-2xl shadow-2xl border border-[#DDD9CF] p-3 sm:p-4 pointer-events-auto transition-all">
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
                    <span className="text-xs font-bold text-[#242521]">Explore Time Machine</span>
                    <span className="text-[11px] text-[#6E6E67] ml-2 hidden sm:inline">Move slider to inspect diurnal demand shift</span>
                  </div>
                </div>

                {/* Current Time Badge (Deep Charcoal with Soft Amber text) */}
                <div className="bg-[#242521] text-[#F2C66D] px-3 py-1 rounded-full text-xs font-mono font-extrabold tracking-wider shadow-xs">
                  {`${selectedHour.toString().padStart(2, '0')}:00`}
                </div>
              </div>

              {/* Diurnal Volume Bar Heights */}
              <div className="flex items-end justify-between h-7 sm:h-8 px-1 mb-1 gap-1">
                {timelineHours.map((h) => {
                  const isSelected = selectedHour === h;
                  const heightPct = hourHeights[h] || 20;
                  return (
                    <div
                      key={h}
                      onClick={() => onHourChange(h)}
                      className="h-full flex-1 flex flex-col justify-end items-center cursor-pointer group"
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

              {/* Range slider input */}
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

          {/* Right spacing balance: Only reserves space when Station Details panel is active on the right */}
          {selectedStationObj ? (
            <div className="hidden lg:block w-[320px] sm:w-[340px] shrink-0 pointer-events-none" />
          ) : null}
        </div>

      </div>
    </div>
  );
};
