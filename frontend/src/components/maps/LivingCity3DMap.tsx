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
  Map as MapIcon,
  GitFork,
  Car
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
  direction: 1 | -1; // 1 = Outbound (start -> end), -1 = Inbound (end -> start)
  path: [number, number][]; // [lng, lat]
  cumDistances: number[]; // Cumulative distances in meters
  totalDistance: number;
  currentDistance: number;
  speedMps: number; // Simulation speed in meters/sec
  marker: maplibregl.Marker;
  element: HTMLDivElement;
}

interface SimulatedRoadCar {
  id: string;
  roadId: string;
  roadName: string;
  color: string;
  direction: 1 | -1;
  path: [number, number][]; // [lng, lat]
  cumDistances: number[];
  totalDistance: number;
  currentDistance: number;
  speedMps: number;
  congestion: string;
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
  maxRadius: number;
  phase: number;
  speed: number;
  marker: maplibregl.Marker;
  element: HTMLDivElement;
}

interface ArterialRoad {
  id: string;
  name: string;
  congestion: 'normal' | 'slow' | 'heavy' | 'severe';
  speed_factor: number;
  color: string;
  coordinates: [number, number][]; // [lng, lat]
}

// Geodesic distance in meters
function geoDistance(p1: [number, number], p2: [number, number]): number {
  const R = 6371000;
  const dLat = ((p2[1] - p1[1]) * Math.PI) / 180;
  const avgLat = (((p1[1] + p2[1]) / 2) * Math.PI) / 180;
  const dLng = ((p2[0] - p1[0]) * Math.PI) / 180 * Math.cos(avgLat);
  return Math.sqrt(dLat * dLat + dLng * dLng) * R;
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
  const roadCarMarkersRef = useRef<maplibregl.Marker[]>([]);
  const activeRoadCarsRef = useRef<SimulatedRoadCar[]>([]);
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
    return true; // Default Traffic ON to showcase living city road cars immediately
  });
  const [is3DMode, setIs3DMode] = useState<boolean>(true);
  const [showBuildings, setShowBuildings] = useState<boolean>(true);
  const [showRoutes, setShowRoutes] = useState<boolean>(true);
  const [showStations, setShowStations] = useState<boolean>(true);
  const [showVehicles, setShowVehicles] = useState<boolean>(true);
  const [showPedestrians, setShowPedestrians] = useState<boolean>(true);
  const [showCrowd, setShowCrowd] = useState<boolean>(false);
  const [showDelays, setShowDelays] = useState<boolean>(false);
  const [showRoads, setShowRoads] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [networkTab, setNetworkTab] = useState<'routes' | 'stations' | 'crowd' | 'delays'>('routes');
  const [activeRouteFilter, setActiveRouteFilter] = useState<string | null>(null);
  const [isWebGLSupported, setIsWebGLSupported] = useState<boolean>(true);
  const [isOverviewOpen, setIsOverviewOpen] = useState<boolean>(false);
  const [isLayersOpen, setIsLayersOpen] = useState<boolean>(false);
  const [arterialRoads, setArterialRoads] = useState<ArterialRoad[]>([]);

  // Hourly volume weights for scrubber
  const timelineHours = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  const hourHeights: Record<number, number> = {
    5: 18, 6: 35, 7: 65, 8: 95, 9: 100, 10: 75,
    11: 50, 12: 55, 13: 52, 14: 50, 15: 58, 16: 72,
    17: 92, 18: 98, 19: 88, 20: 64, 21: 42, 22: 26, 23: 15
  };

  // Geographic Center & Camera parameters per network (Starts with dramatic tilted 3D perspective)
  const defaultCenter = useMemo<[number, number]>(() => {
    if (currentNetwork && currentNetwork.center) {
      return [currentNetwork.center[1], currentNetwork.center[0]]; // [lng, lat]
    }
    if (stations.length > 0) {
      const avgLat = stations.reduce((acc, s) => acc + s.latitude, 0) / stations.length;
      const avgLng = stations.reduce((acc, s) => acc + s.longitude, 0) / stations.length;
      return [avgLng, avgLat];
    }
    return [77.2090, 28.6139]; // Delhi default
  }, [currentNetwork, stations]);

  const defaultZoom = currentNetwork?.id === 'delhi' ? 12.3 : 12.4;
  const defaultPitch = 56; // High 3D tilt to clearly reveal 3D building extrusions
  const defaultBearing = -15;

  // Load Arterial Road Network for current city
  useEffect(() => {
    let isMounted = true;
    const netId = currentNetwork?.id === 'delhi' ? 'delhi' : 'chennai';
    fetch(`/data/${netId}_roads.json`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: ArterialRoad[]) => {
        if (isMounted) setArterialRoads(data);
      })
      .catch((err) => console.warn('Could not load arterial roads:', err));

    return () => {
      isMounted = false;
    };
  }, [currentNetwork?.id]);

  // Load and apply Real 3D Buildings from static GeoJSON
  const setup3DBuildings = async (map: maplibregl.Map) => {
    const netId = currentNetwork?.id === 'delhi' ? 'delhi' : 'chennai';
    const sourceId = 'real-buildings-source';
    const layerId = '3d-buildings-real';

    try {
      let geojson: any = null;
      try {
        const res = await fetch(`/data/${netId}_buildings.geojson`);
        if (res.ok) {
          geojson = await res.json();
        }
      } catch (err) {
        console.warn('Could not load static building geojson, fallback to procedural.', err);
      }

      if (!geojson || !geojson.features || geojson.features.length === 0) {
        geojson = {
          type: 'FeatureCollection',
          features: stations.map((st, i) => {
            const size = 0.0006;
            const h = 85 + ((i * 23) % 140);
            return {
              type: 'Feature',
              properties: {
                id: `BLD_FB_${st.station_id}`,
                name: `${st.station_name} Urban Tower`,
                type: 'Commercial Skyscraper',
                height: h,
                min_height: 0,
                levels: Math.max(4, Math.round(h / 4.0))
              },
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [st.longitude - size, st.latitude - size],
                  [st.longitude + size, st.latitude - size],
                  [st.longitude + size, st.latitude + size],
                  [st.longitude - size, st.latitude + size],
                  [st.longitude - size, st.latitude - size]
                ]]
              }
            };
          })
        };
      }

      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: 'geojson',
          data: geojson
        });
      } else {
        (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(geojson);
      }

      if (!map.getLayer(layerId)) {
        map.addLayer({
          id: layerId,
          type: 'fill-extrusion',
          source: sourceId,
          layout: {
            visibility: showBuildings && is3DMode ? 'visible' : 'none'
          },
          paint: {
            // High-contrast architectural stone palette (distinct from cream/ivory roads)
            'fill-extrusion-color': [
              'interpolate',
              ['linear'],
              ['get', 'height'],
              75, '#D5CCB8',    // Warm sandstone base
              120, '#C2B199',   // Architectural travertine
              180, '#A89278',   // Sandstone high-rise
              240, '#7F674E',   // Bronze architectural tower
              320, '#4E3F32'    // Deep granite tower crown
            ],
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'min_height'],
            'fill-extrusion-opacity': 0.92,
            'fill-extrusion-vertical-gradient': true
          }
        });

        // Building click inspector popup
        map.on('click', layerId, (e) => {
          if (!e.features || e.features.length === 0) return;
          const props = e.features[0].properties || {};
          new maplibregl.Popup({ offset: [0, -10], closeButton: true })
            .setLngLat(e.lngLat)
            .setHTML(`
              <div style="font-family: system-ui, -apple-system, sans-serif; padding: 6px 10px; min-width: 165px; background: #FCFBF7; color: #242521;">
                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                  <div style="width: 8px; height: 8px; border-radius: 2px; background: #D89B32;"></div>
                  <div style="font-weight: 800; font-size: 12px; color: #242521;">${props.name || props.type || 'Urban Structure'}</div>
                </div>
                <div style="font-size: 11px; color: #6E6E67; margin-bottom: 2px;">
                  Classification: <span style="font-weight: 600; color: #242521;">${props.type || 'Commercial Complex'}</span>
                </div>
                <div style="font-size: 11px; color: #6E6E67;">
                  Elevation: <span style="font-weight: 700; color: #D89B32;">${Math.round(Number(props.height || 85))}m</span> (${props.levels || 12} floors)
                </div>
              </div>
            `)
            .addTo(map);
        });

        map.on('mouseenter', layerId, () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', layerId, () => {
          map.getCanvas().style.cursor = '';
        });
      }
    } catch (err) {
      console.warn('Notice setting up 3D buildings:', err);
    }
  };

  // Update Road Traffic Corridors and Transit Route Vector Layers
  const updateRouteLayers = (map: maplibregl.Map) => {
    if (!map.isStyleLoaded()) return;

    // 1. Remove prior route layers
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

    // 2. Remove prior road traffic layers
    arterialRoads.forEach((rd) => {
      const src = `road-source-${rd.id}`;
      const lyr = `road-layer-${rd.id}`;
      if (map.getLayer(lyr)) map.removeLayer(lyr);
      if (map.getSource(src)) map.removeSource(src);
    });

    // 3. Render Arterial Road Corridors when Traffic is ON
    if (showTraffic && showRoads) {
      arterialRoads.forEach((rd) => {
        if (!rd.coordinates || rd.coordinates.length < 2) return;
        const src = `road-source-${rd.id}`;
        const lyr = `road-layer-${rd.id}`;

        map.addSource(src, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: { id: rd.id, name: rd.name, color: rd.color },
            geometry: { type: 'LineString', coordinates: rd.coordinates }
          }
        });

        map.addLayer({
          id: lyr,
          type: 'line',
          source: src,
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': rd.color,
            'line-width': 4.5,
            'line-opacity': 0.82
          }
        });
      });
    }

    // 4. Render Transit Route Layers
    if (!showRoutes) return;

    routes.forEach((route) => {
      if (!route.coordinates_path || route.coordinates_path.length === 0) return;

      const sourceId = `route-source-${route.route_id}`;
      const isFilteredOut = activeRouteFilter !== null && activeRouteFilter !== route.route_id;
      const opacityMultiplier = isFilteredOut ? 0.2 : 1.0;
      const routeColor = route.color_hex || '#D89B32';
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

      // Ambient corridor backing halo
      map.addLayer({
        id: `route-glow-${route.route_id}`,
        type: 'line',
        source: sourceId,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': mapStyleMode === 'satellite' ? '#000000' : '#242521',
          'line-width': isFilteredOut ? 6 : 12,
          'line-opacity': mapStyleMode === 'satellite' ? 0.8 : 0.32 * opacityMultiplier,
          'line-blur': mapStyleMode === 'satellite' ? 1.5 : 3.5
        }
      });

      // Main Elevated Guideway Line
      map.addLayer({
        id: `route-line-${route.route_id}`,
        type: 'line',
        source: sourceId,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': routeColor,
          'line-width': isFilteredOut ? 3.5 : 6,
          'line-opacity': 0.98 * opacityMultiplier
        }
      });

      // Center Technical Guideway Stripe
      map.addLayer({
        id: `route-track-${route.route_id}`,
        type: 'line',
        source: sourceId,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#FFFFFF',
          'line-width': 1.8,
          'line-dasharray': [3, 4],
          'line-opacity': 0.92 * opacityMultiplier
        }
      });
    });
  };

  // Base map style definition: Esri World Street Map (Roads) and Esri World Imagery (Satellite)
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
            'raster-opacity': mapStyleMode === 'standard' && showRoads ? 1.0 : 0.0,
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
  }, [mapStyleMode, showRoads]);

  // Initialize MapLibre GL
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
      roadCarMarkersRef.current.forEach((m) => m.remove());
      pedestrianMarkersRef.current.forEach((p) => p.marker.remove());
      stationMarkersRef.current = {};
      trainMarkersRef.current = [];
      activeTrainsRef.current = [];
      roadCarMarkersRef.current = [];
      activeRoadCarsRef.current = [];
      pedestrianMarkersRef.current = [];
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Smooth Basemap Switcher
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !map.isStyleLoaded()) return;

    if (map.getLayer('esri-street-layer')) {
      map.setPaintProperty('esri-street-layer', 'raster-opacity', mapStyleMode === 'standard' && showRoads ? 1.0 : 0.0);
    }
    if (map.getLayer('esri-satellite-layer')) {
      map.setPaintProperty('esri-satellite-layer', 'raster-opacity', mapStyleMode === 'satellite' ? 1.0 : 0.0);
    }

    updateRouteLayers(map);
  }, [mapStyleMode, showRoads, arterialRoads]);

  // Handle City / Network Change: Smooth camera flight and layer re-hydration
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.flyTo({
      center: defaultCenter,
      zoom: defaultZoom,
      pitch: is3DMode ? defaultPitch : 0,
      bearing: is3DMode ? defaultBearing : 0,
      duration: 1800,
      essential: true
    });

    if (map.isStyleLoaded()) {
      setup3DBuildings(map);
      updateRouteLayers(map);
    }
  }, [defaultCenter, defaultZoom, defaultPitch, defaultBearing, currentNetwork]);

  // Synchronize 3D Buildings visibility
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const layerId = '3d-buildings-real';
    if (map.getLayer(layerId)) {
      map.setLayoutProperty(layerId, 'visibility', showBuildings && is3DMode ? 'visible' : 'none');
    }
  }, [showBuildings, is3DMode]);

  // Refresh Route and Road Layers
  useEffect(() => {
    if (mapInstanceRef.current && mapInstanceRef.current.isStyleLoaded()) {
      updateRouteLayers(mapInstanceRef.current);
    }
  }, [routes, activeRouteFilter, showTraffic, showRoutes, arterialRoads]);

  // Update 3D Station Nodes
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

      let statusColor = '#6E6E67';
      let statusLabel = 'Normal Operation';

      if (isSelected) {
        statusColor = THEME.primaryAmber;
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

      const passVolume = station.current_passengers || 2100;
      const isHighDemand = passVolume > 2800 || station.is_interchange;

      const el = document.createElement('div');
      el.className = 'group relative cursor-pointer';
      el.style.width = '38px';
      el.style.height = '38px';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';

      el.innerHTML = `
        <div class="relative flex items-center justify-center">
          <div class="absolute rounded-full transition-all duration-500 ${isHighDemand ? 'animate-ping opacity-40' : 'opacity-25'}" style="
            width: ${isHighDemand ? '34px' : '22px'};
            height: ${isHighDemand ? '34px' : '22px'};
            background-color: ${statusColor};
          "></div>
          
          <div class="relative flex items-center justify-center rounded-full transition-all duration-300 shadow-md ${
            isSelected
              ? 'ring-4 ring-[#242521] scale-135 shadow-xl'
              : 'hover:scale-125 hover:shadow-lg'
          }" style="
            width: ${station.is_interchange ? '19px' : '15px'};
            height: ${station.is_interchange ? '19px' : '15px'};
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
          <div style="font-family: system-ui, -apple-system, sans-serif; padding: 6px 9px; min-width: 155px; background: #FCFBF7; color: #242521;">
            <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 2px;">
              <span style="display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: ${statusColor};"></span>
              <strong style="font-size: 12px; color: #242521;">${station.station_name}</strong>
            </div>
            <div style="font-size: 10.5px; color: #6E6E67; margin-bottom: 2px;">
              ${station.station_type} • ${station.zone} ${station.is_interchange ? '• Interchange' : ''}
            </div>
            <div style="font-size: 11px; font-weight: 700; color: ${statusColor}; margin-bottom: 2px;">
              ${statusLabel}
            </div>
            <div style="font-size: 10px; color: #242521; font-weight: 600; border-top: 1px solid #DDD9CF; padding-top: 3px; margin-top: 3px;">
              Demand: ${(station.current_passengers || 2100).toLocaleString()} pass/hr
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

  // Active Metro Vehicles, Road Traffic Cars & Commuter Crowd Animation Loop
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    trainMarkersRef.current.forEach((m) => m.remove());
    roadCarMarkersRef.current.forEach((m) => m.remove());
    pedestrianMarkersRef.current.forEach((p) => p.marker.remove());
    trainMarkersRef.current = [];
    activeTrainsRef.current = [];
    roadCarMarkersRef.current = [];
    activeRoadCarsRef.current = [];
    pedestrianMarkersRef.current = [];

    // 1. Moving Metro / Transit Vehicles (Bi-directional Fleet Model)
    if (showVehicles) {
      routes.forEach((route, rIdx) => {
        if (activeRouteFilter && activeRouteFilter !== route.route_id) return;
        if (!route.coordinates_path || route.coordinates_path.length < 2) return;

        const pathLngLat: [number, number][] = route.coordinates_path.map((c) => [c[1], c[0]]);

        const cumDistances: number[] = [0];
        let runningDist = 0;
        for (let s = 0; s < pathLngLat.length - 1; s++) {
          const segD = geoDistance(pathLngLat[s], pathLngLat[s + 1]);
          runningDist += segD;
          cumDistances.push(runningDist);
        }
        const totalDistance = runningDist;
        if (totalDistance <= 100) return;

        // Schedule-driven vehicle frequency (2 Outbound, 2 Inbound = 4 trains per corridor)
        const isPeak = (selectedHour >= 8 && selectedHour <= 10) || (selectedHour >= 17 && selectedHour <= 20);
        const trainsPerDirection = isPeak ? 2 : 2;

        const directions: (1 | -1)[] = [1, -1];
        directions.forEach((dir) => {
          for (let i = 0; i < trainsPerDirection; i++) {
            const headwaySpacing = totalDistance / trainsPerDirection;
            const timeOffset = (selectedHour * 0.28 * totalDistance) % totalDistance;
            const initialDist = (i * headwaySpacing + timeOffset) % totalDistance;

            const trainId = `${route.line_code || 'METRO'}-${dir === 1 ? 'UP' : 'DN'}-${i + 1}`;
            const routeColor = route.color_hex || '#D89B32';

            // High-Visibility Stylized Metro Train Cab (Charcoal + Warm White + Headlight Beam)
            const trainEl = document.createElement('div');
            trainEl.className = 'transit-train-marker flex items-center justify-center';
            trainEl.style.width = '36px';
            trainEl.style.height = '56px';
            trainEl.style.pointerEvents = 'auto';
            trainEl.style.cursor = 'pointer';

            trainEl.innerHTML = `
              <div class="relative flex flex-col items-center justify-center w-full h-full">
                <!-- Forward Headlight Beam (Luminous Gold Cone) -->
                <div style="
                  position: absolute;
                  top: -28px;
                  width: 24px;
                  height: 32px;
                  background: radial-gradient(ellipse at bottom, rgba(254, 240, 138, 0.85) 0%, rgba(254, 240, 138, 0.3) 50%, transparent 80%);
                  filter: blur(1.5px);
                  pointer-events: none;
                "></div>

                <!-- Train Body -->
                <div style="
                  position: relative;
                  width: 24px;
                  height: 50px;
                  border-radius: 6px;
                  background: #242521;
                  border: 1.5px solid #FCFBF7;
                  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.55);
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  overflow: hidden;
                ">
                  <!-- Front Nose & Dual High-Beam Golden Headlights -->
                  <div style="
                    width: 100%;
                    height: 13px;
                    background: #181916;
                    border-bottom: 2px solid ${routeColor};
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 3px;
                  ">
                    <span style="width: 4px; height: 4px; border-radius: 9999px; background: #FEF08A; box-shadow: 0 0 5px #FEF08A;"></span>
                    <div style="width: 8px; height: 4px; background: #6E6E67; border-radius: 1px;"></div>
                    <span style="width: 4px; height: 4px; border-radius: 9999px; background: #FEF08A; box-shadow: 0 0 5px #FEF08A;"></span>
                  </div>

                  <!-- Cabin Roof Line & Route Livery Stripe -->
                  <div style="width: 100%; height: 3px; background: ${routeColor};"></div>
                  <div style="flex: 1; width: 100%; background: #2E302A; display: flex; flex-direction: column; justify-content: space-evenly; align-items: center; padding: 2px 0;">
                    <div style="width: 16px; height: 2px; background: rgba(255,255,255,0.45); border-radius: 1px;"></div>
                    <div style="width: 16px; height: 2px; background: rgba(255,255,255,0.45); border-radius: 1px;"></div>
                    <div style="width: 16px; height: 2px; background: rgba(255,255,255,0.45); border-radius: 1px;"></div>
                  </div>

                  <!-- Rear Running Red Taillights -->
                  <div style="
                    width: 100%;
                    height: 5px;
                    background: #181916;
                    display: flex;
                    justify-content: space-between;
                    padding: 0 4px;
                    align-items: center;
                  ">
                    <span style="width: 3px; height: 3px; border-radius: 9999px; background: #EF4444;"></span>
                    <span style="width: 3px; height: 3px; border-radius: 9999px; background: #EF4444;"></span>
                  </div>
                </div>
              </div>
            `;

            const destLabel = dir === 1 ? route.destination : route.origin;
            const popup = new maplibregl.Popup({ offset: [0, -18], closeButton: false })
              .setHTML(`
                <div style="font-family: system-ui, -apple-system, sans-serif; padding: 6px 9px; font-size: 11px; min-width: 160px; background: #FCFBF7; color: #242521;">
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2px;">
                    <span style="font-weight: 800; color: ${routeColor};">${trainId}</span>
                    <span style="font-size: 9.5px; background: #242521; color: #FFF3D6; padding: 1px 4px; border-radius: 4px; font-weight: bold;">
                      ${dir === 1 ? 'OUTBOUND' : 'INBOUND'}
                    </span>
                  </div>
                  <div style="font-weight: 700; color: #242521; font-size: 11.5px;">${route.route_name}</div>
                  <div style="color: #6E6E67; font-size: 10px; margin-top: 1px;">
                    Towards <strong style="color: #242521;">${destLabel}</strong>
                  </div>
                  <div style="color: #4E8752; font-weight: 700; font-size: 10px; margin-top: 3px; border-top: 1px solid #DDD9CF; padding-top: 3px;">
                    Speed: ~54 km/h • Scheduled Transit Movement
                  </div>
                </div>
              `);

            const marker = new maplibregl.Marker({
              element: trainEl,
              rotationAlignment: 'map',
              pitchAlignment: 'map'
            })
              .setLngLat(pathLngLat[0])
              .setPopup(popup)
              .addTo(map);

            trainMarkersRef.current.push(marker);

            // Simulation speed in meters/sec: 480 m/s (~30 pixels/sec at zoom 12)
            // Traverses full line in ~45 seconds smoothly
            const speedMps = 480 + (rIdx * 25);

            activeTrainsRef.current.push({
              id: trainId,
              routeId: route.route_id,
              routeName: route.route_name,
              lineCode: route.line_code,
              color: routeColor,
              direction: dir,
              path: pathLngLat,
              cumDistances,
              totalDistance,
              currentDistance: initialDist,
              speedMps,
              marker,
              element: trainEl
            });
          }
        });
      });
    }

    // 2. Moving Road Traffic (Cars on Arterial Corridors when Traffic is ON)
    if (showTraffic && showRoads && arterialRoads.length > 0) {
      const carColors = ['#FCFBF7', '#242521', '#E7AE45', '#92958B', '#D89B32', '#3A3B36'];

      arterialRoads.forEach((road, rdIdx) => {
        if (!road.coordinates || road.coordinates.length < 2) return;

        const cumDistances: number[] = [0];
        let runningDist = 0;
        for (let s = 0; s < road.coordinates.length - 1; s++) {
          const segD = geoDistance(road.coordinates[s], road.coordinates[s + 1]);
          runningDist += segD;
          cumDistances.push(runningDist);
        }
        const totalDistance = runningDist;
        if (totalDistance <= 100) return;

        // 4 to 6 road cars per arterial road corridor (in both directions)
        const carsPerRoad = 5;
        const directions: (1 | -1)[] = [1, -1];

        directions.forEach((dir) => {
          for (let cIdx = 0; cIdx < carsPerRoad; cIdx++) {
            const spacing = totalDistance / carsPerRoad;
            const timeOffset = (selectedHour * 0.22 * totalDistance + cIdx * spacing) % totalDistance;
            const carColor = carColors[(rdIdx * 3 + cIdx + (dir === 1 ? 0 : 2)) % carColors.length];

            const carEl = document.createElement('div');
            carEl.className = 'road-traffic-car flex items-center justify-center';
            carEl.style.width = '18px';
            carEl.style.height = '28px';
            carEl.style.pointerEvents = 'auto';
            carEl.style.cursor = 'pointer';

            carEl.innerHTML = `
              <div class="relative flex flex-col items-center justify-center w-full h-full">
                <!-- Forward Headlights -->
                <div style="position: absolute; top: -10px; width: 12px; height: 14px; background: radial-gradient(circle, rgba(254,240,138,0.7) 0%, transparent 80%); filter: blur(1px);"></div>

                <!-- Stylized Car Body -->
                <div style="
                  width: 12px;
                  height: 22px;
                  border-radius: 4px;
                  background: ${carColor};
                  border: 1px solid ${carColor === '#FCFBF7' ? '#242521' : '#FCFBF7'};
                  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  overflow: hidden;
                ">
                  <!-- Windshield -->
                  <div style="width: 8px; height: 4px; background: #181916; border-radius: 1px; margin-top: 3px;"></div>
                  <!-- Rear window -->
                  <div style="width: 8px; height: 3px; background: #181916; border-radius: 1px; margin-top: 5px;"></div>
                </div>
              </div>
            `;

            const popup = new maplibregl.Popup({ offset: [0, -12], closeButton: false })
              .setHTML(`
                <div style="font-family: system-ui, -apple-system, sans-serif; padding: 5px 8px; font-size: 10.5px; min-width: 140px; background: #FCFBF7; color: #242521;">
                  <div style="font-weight: 800; color: #242521; display: flex; items-center; gap: 4px;">
                    <span style="width: 6px; height: 6px; border-radius: 50%; background: ${road.color};"></span>
                    ${road.name}
                  </div>
                  <div style="color: #6E6E67; font-size: 9.5px; margin-top: 2px;">
                    Arterial Congestion: <strong style="color: ${road.color};">${road.congestion.toUpperCase()}</strong>
                  </div>
                  <div style="color: #6E6E67; font-size: 9px; margin-top: 3px; border-top: 1px solid #DDD9CF; padding-top: 2px;">
                    Historical/data-based traffic simulation
                  </div>
                </div>
              `);

            const marker = new maplibregl.Marker({
              element: carEl,
              rotationAlignment: 'map',
              pitchAlignment: 'map'
            })
              .setLngLat(road.coordinates[0])
              .setPopup(popup)
              .addTo(map);

            roadCarMarkersRef.current.push(marker);

            // Speed scaled by road congestion level
            const baseCarSpeed = 420 * (road.speed_factor || 1.0);

            activeRoadCarsRef.current.push({
              id: `CAR_${road.id}_${dir}_${cIdx}`,
              roadId: road.id,
              roadName: road.name,
              color: carColor,
              direction: dir,
              path: road.coordinates,
              cumDistances,
              totalDistance,
              currentDistance: timeOffset,
              speedMps: baseCarSpeed + (cIdx * 15),
              congestion: road.congestion,
              marker,
              element: carEl
            });
          }
        });
      });
    }

    // 3. Commuter Crowd Figures (Scaled by Station Demand)
    if (showPedestrians) {
      const pedColors = ['#242521', '#4A4E46', '#D89B32', '#7B8068', '#52574E', '#C56F4B', '#343831'];
      const volumeWeight = (hourHeights[selectedHour] || 50) / 75;

      stations.forEach((station) => {
        if (activeRouteFilter && !station.lines_served.includes(activeRouteFilter)) return;

        const pass = station.current_passengers || 2100;
        let baseCount = 4;
        if (pass > 3200 || station.is_interchange) {
          baseCount = 14;
        } else if (pass > 1800) {
          baseCount = 8;
        }
        const pedCount = Math.max(3, Math.min(18, Math.round(baseCount * volumeWeight)));

        for (let pIdx = 0; pIdx < pedCount; pIdx++) {
          const pedEl = document.createElement('div');
          pedEl.className = 'transit-pedestrian-figure flex flex-col items-center justify-center pointer-events-auto cursor-pointer';
          pedEl.style.width = '16px';
          pedEl.style.height = '20px';

          const color = pedColors[(pIdx + station.station_id.charCodeAt(0)) % pedColors.length];

          pedEl.innerHTML = `
            <div class="relative flex flex-col items-center group">
              <div style="width: 5px; height: 5px; border-radius: 9999px; background-color: #242521; border: 0.8px solid #FCFBF7;"></div>
              <div style="width: 6.5px; height: 10px; border-radius: 2px; background-color: ${color}; margin-top: -1px; border: 0.5px solid #FCFBF7; box-shadow: 0 1px 3px rgba(0,0,0,0.35);"></div>
              <div style="width: 8px; height: 2.5px; border-radius: 9999px; background-color: rgba(36, 37, 33, 0.32); filter: blur(0.6px); margin-top: 0.5px;"></div>
            </div>
          `;

          const pedPopup = new maplibregl.Popup({ offset: [0, -12], closeButton: false })
            .setHTML(`
              <div style="font-family: system-ui, -apple-system, sans-serif; padding: 5px 8px; font-size: 11px; min-width: 165px; background: #FCFBF7; color: #242521;">
                <div style="display: flex; align-items: center; gap: 4px; font-weight: 800; color: #242521;">
                  <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #D89B32;"></span>
                  Station Commuter Activity
                </div>
                <div style="color: #6E6E67; font-size: 10px; margin-top: 2px;">
                  Concourse & Entrance • ${station.station_name}
                </div>
                <div style="color: #242521; font-weight: 700; font-size: 10.5px; margin-top: 1px;">
                  ${pass.toLocaleString()} pass/hr aggregate rate
                </div>
                <div style="color: #6E6E67; font-size: 9px; margin-top: 4px; border-top: 1px solid #DDD9CF; padding-top: 3px;">
                  Aggregate activity simulation (no individual GPS tracking)
                </div>
              </div>
            `);

          const angle = (pIdx * (2 * Math.PI / pedCount)) + (station.station_id.charCodeAt(0) * 0.15);
          const maxRadius = 0.00035 + (pIdx % 4) * 0.00012;
          const initialPhase = (pIdx / pedCount) % 1.0;

          const marker = new maplibregl.Marker({ element: pedEl })
            .setLngLat([station.longitude, station.latitude])
            .setPopup(pedPopup)
            .addTo(map);

          pedestrianMarkersRef.current.push({
            id: `PED_${station.station_id}_${pIdx}`,
            stationId: station.station_id,
            stationName: station.station_name,
            passengersPerHour: pass,
            originLng: station.longitude,
            originLat: station.latitude,
            angle,
            maxRadius,
            phase: initialPhase,
            speed: 0.0018 + Math.random() * 0.0012,
            marker,
            element: pedEl
          });
        }
      });
    }

    // 4. Continuous High-Performance Animation Loop (60 FPS)
    let lastTime = performance.now();

    const animateScene = (currentTime: number) => {
      const deltaSec = Math.min(0.1, (currentTime - lastTime) / 1000);
      lastTime = currentTime;

      // Animate Metro Trains along Transit Corridors
      activeTrainsRef.current.forEach((train) => {
        train.currentDistance = (train.currentDistance + train.speedMps * deltaSec) % train.totalDistance;

        let effectiveDist = train.direction === 1 ? train.currentDistance : (train.totalDistance - train.currentDistance);

        let segIdx = 0;
        while (segIdx < train.cumDistances.length - 2 && train.cumDistances[segIdx + 1] < effectiveDist) {
          segIdx++;
        }

        const dStart = train.cumDistances[segIdx];
        const dEnd = train.cumDistances[segIdx + 1];
        const segLen = Math.max(0.1, dEnd - dStart);
        const t = Math.max(0, Math.min(1, (effectiveDist - dStart) / segLen));

        const p1 = train.path[segIdx];
        const p2 = train.path[segIdx + 1];

        const lng = p1[0] + (p2[0] - p1[0]) * t;
        const lat = p1[1] + (p2[1] - p1[1]) * t;

        let dLng = p2[0] - p1[0];
        let dLat = p2[1] - p1[1];
        if (train.direction === -1) {
          dLng = -dLng;
          dLat = -dLat;
        }

        const avgLat = (lat * Math.PI) / 180;
        const bearingDeg = (Math.atan2(dLng * Math.cos(avgLat), dLat) * 180) / Math.PI;

        train.marker.setLngLat([lng, lat]);
        train.marker.setRotation(bearingDeg);
      });

      // Animate Road Traffic Cars along Arterial Roads
      activeRoadCarsRef.current.forEach((car) => {
        car.currentDistance = (car.currentDistance + car.speedMps * deltaSec) % car.totalDistance;

        let effectiveDist = car.direction === 1 ? car.currentDistance : (car.totalDistance - car.currentDistance);

        let segIdx = 0;
        while (segIdx < car.cumDistances.length - 2 && car.cumDistances[segIdx + 1] < effectiveDist) {
          segIdx++;
        }

        const dStart = car.cumDistances[segIdx];
        const dEnd = car.cumDistances[segIdx + 1];
        const segLen = Math.max(0.1, dEnd - dStart);
        const t = Math.max(0, Math.min(1, (effectiveDist - dStart) / segLen));

        const p1 = car.path[segIdx];
        const p2 = car.path[segIdx + 1];

        const lng = p1[0] + (p2[0] - p1[0]) * t;
        const lat = p1[1] + (p2[1] - p1[1]) * t;

        let dLng = p2[0] - p1[0];
        let dLat = p2[1] - p1[1];
        if (car.direction === -1) {
          dLng = -dLng;
          dLat = -dLat;
        }

        const avgLat = (lat * Math.PI) / 180;
        const bearingDeg = (Math.atan2(dLng * Math.cos(avgLat), dLat) * 180) / Math.PI;

        car.marker.setLngLat([lng, lat]);
        car.marker.setRotation(bearingDeg);
      });

      // Animate Commuter Pedestrians
      pedestrianMarkersRef.current.forEach((ped) => {
        ped.phase = (ped.phase + ped.speed * (deltaSec * 60)) % 1.0;
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
  }, [routes, stations, showVehicles, showPedestrians, showTraffic, showRoads, arterialRoads, activeRouteFilter, selectedHour]);

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
        
        {/* UPPER ROW: Floating Controls Bar + Station Detail Zone */}
        <div className="flex-1 flex justify-between min-h-0 gap-3 sm:gap-4 overflow-hidden relative">
          
          {/* FLOATING TOP CONTROL STRIP (Left / Center) */}
          <div className="flex flex-col gap-2 pointer-events-none z-20">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 bg-[#FCFBF7]/95 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-[#DDD9CF] shadow-lg pointer-events-auto">
              {/* Corridors Overview Toggle */}
              <button
                onClick={() => {
                  setIsOverviewOpen(!isOverviewOpen);
                  if (isLayersOpen) setIsLayersOpen(false);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isOverviewOpen
                    ? 'bg-[#D89B32] text-[#242521] shadow-xs'
                    : 'bg-[#F7F5EF] text-[#6E6E67] hover:text-[#242521]'
                }`}
              >
                <GitFork className="w-3.5 h-3.5" />
                <span>Corridors ({routes.length})</span>
              </button>

              {/* Layers Popover Toggle */}
              <button
                onClick={() => {
                  setIsLayersOpen(!isLayersOpen);
                  if (isOverviewOpen) setIsOverviewOpen(false);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isLayersOpen
                    ? 'bg-[#D89B32] text-[#242521] shadow-xs'
                    : 'bg-[#F7F5EF] text-[#6E6E67] hover:text-[#242521]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Layers</span>
              </button>

              <span className="w-px h-4 bg-[#DDD9CF]"></span>

              {/* 3D / 2D Perspective Toggle */}
              <button
                onClick={toggle3DMode}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  is3DMode
                    ? 'bg-[#242521] text-[#F2C66D] shadow-xs'
                    : 'bg-[#F7F5EF] text-[#6E6E67] hover:text-[#242521]'
                }`}
                title="Toggle 3D Perspective (56°)"
              >
                <Box className="w-3.5 h-3.5" />
                <span>{is3DMode ? '3D' : '2D'}</span>
              </button>

              {/* Standard / Satellite Basemap Switcher */}
              <div className="flex bg-[#F7F5EF] p-0.5 rounded-xl text-[11px] font-bold border border-[#DDD9CF]">
                <button
                  onClick={() => setMapStyleMode('standard')}
                  className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                    mapStyleMode === 'standard'
                      ? 'bg-[#D89B32] text-[#242521] shadow-xs'
                      : 'text-[#6E6E67] hover:text-[#242521]'
                  }`}
                >
                  Standard
                </button>
                <button
                  onClick={() => setMapStyleMode('satellite')}
                  className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                    mapStyleMode === 'satellite'
                      ? 'bg-[#D89B32] text-[#242521] shadow-xs'
                      : 'text-[#6E6E67] hover:text-[#242521]'
                  }`}
                >
                  Satellite
                </button>
              </div>

              {/* Traffic Toggle (Road Traffic Movement & Congestion) */}
              <button
                onClick={() => setShowTraffic(!showTraffic)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                  showTraffic
                    ? 'bg-[#D89B32] text-[#242521] border-[#D89B32] shadow-xs'
                    : 'bg-[#F7F5EF] text-[#6E6E67] border-[#DDD9CF] hover:text-[#242521]'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>Traffic: {showTraffic ? 'ON' : 'OFF'}</span>
              </button>

              {/* Reset View */}
              <button
                onClick={resetCamera}
                className="p-1.5 rounded-xl text-[#6E6E67] hover:text-[#242521] hover:bg-[#F7F5EF] transition-colors cursor-pointer"
                title="Reset Camera View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Informational Traffic Status Banner (Honest Data Distinction) */}
            {showTraffic && (
              <div className="self-start bg-[#FCFBF7]/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#DDD9CF] text-[#242521] text-xs shadow-md pointer-events-auto flex items-center gap-2 animate-in fade-in duration-200">
                <Car className="w-3.5 h-3.5 text-[#D89B32] shrink-0" />
                <span className="text-[11px]">
                  <strong>Moving Road Traffic:</strong> Data-based arterial road simulation (actual street geometry, congestion-calibrated speeds).
                </span>
                <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-[#DDD9CF] text-[10px] font-bold">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#4E8752]"></span>Normal</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#D89B32]"></span>Slow</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#C96F4A]"></span>Heavy</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#9E2A2B]"></span>Severe</span>
                </div>
              </div>
            )}

            {/* Satellite Mode Notice */}
            {mapStyleMode === 'satellite' && (
              <div className="self-start bg-[#242521]/95 text-[#FFF3D6] px-3 py-1 rounded-xl text-[10.5px] font-medium shadow-md pointer-events-auto flex items-center gap-1.5 animate-in fade-in duration-200">
                <Compass className="w-3.5 h-3.5 text-[#D89B32]" />
                <span>High-resolution satellite imagery (historical aerial capture, not real-time video feed)</span>
              </div>
            )}

            {/* FLOATING DRAWER 1: Corridors & Stations Panel */}
            {isOverviewOpen && (
              <div className="w-[340px] sm:w-[350px] max-h-[calc(100vh-16rem)] flex flex-col gap-2.5 overflow-y-auto pr-1 pb-1 animate-in fade-in slide-in-from-top-2 duration-200 pointer-events-auto z-20">
                <div className="w-full bg-[#FCFBF7]/98 backdrop-blur-md rounded-2xl shadow-2xl border border-[#DDD9CF] p-4 transition-all">
                  <div className="flex items-center justify-between pb-2 border-b border-[#DDD9CF]">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#4E8752]"></span>
                        <h2 className="text-sm font-bold text-[#242521]">
                          {currentNetwork?.name || 'Transit Network'}
                        </h2>
                      </div>
                      <p className="text-[11px] text-[#6E6E67] font-medium">
                        {currentNetwork?.city || 'India'}, {currentNetwork?.state || ''}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FFF8EB] text-[#A86F18] border border-[#FDE4B4]">
                        {routes.length} Lines
                      </span>
                      <button
                        onClick={() => setIsOverviewOpen(false)}
                        className="p-1 rounded-lg text-[#6E6E67] hover:bg-[#F7F5EF] hover:text-[#242521] cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
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

                  {/* Tab Content */}
                  <div className="mt-2.5 max-h-48 overflow-y-auto space-y-1.5 pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#DDD9CF] [&::-webkit-scrollbar-thumb]:rounded-full">
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
                                  zoom: 12.8,
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
                        {stations.slice(0, 15).map((st) => (
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
              </div>
            )}

            {/* FLOATING DRAWER 2: Layers Popover */}
            {isLayersOpen && (
              <div className="w-[280px] bg-[#FCFBF7]/98 backdrop-blur-md rounded-2xl shadow-2xl border border-[#DDD9CF] p-3 animate-in fade-in slide-in-from-top-2 duration-200 pointer-events-auto space-y-2 z-20">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#DDD9CF]">
                  <div className="flex items-center space-x-2 text-xs font-bold text-[#242521]">
                    <Layers className="w-4 h-4 text-[#D89B32]" />
                    <span>Map Visual Layers</span>
                  </div>
                  <button
                    onClick={() => setIsLayersOpen(false)}
                    className="p-1 rounded-lg text-[#6E6E67] hover:bg-[#F7F5EF] hover:text-[#242521] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1 text-xs text-[#242521]">
                  <label className="flex items-center justify-between cursor-pointer py-1 px-1.5 rounded-lg hover:bg-[#F7F5EF]">
                    <span className="font-medium text-[11px]">3D Urban Buildings</span>
                    <input
                      type="checkbox"
                      checked={showBuildings}
                      onChange={(e) => setShowBuildings(e.target.checked)}
                      className="rounded accent-[#D89B32] h-3.5 w-3.5 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer py-1 px-1.5 rounded-lg hover:bg-[#F7F5EF]">
                    <span className="font-medium text-[11px]">Moving Metro Trains</span>
                    <input
                      type="checkbox"
                      checked={showVehicles}
                      onChange={(e) => setShowVehicles(e.target.checked)}
                      className="rounded accent-[#D89B32] h-3.5 w-3.5 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer py-1 px-1.5 rounded-lg hover:bg-[#F7F5EF]">
                    <span className="font-medium text-[11px]">Moving Road Traffic (Cars)</span>
                    <input
                      type="checkbox"
                      checked={showTraffic}
                      onChange={(e) => setShowTraffic(e.target.checked)}
                      className="rounded accent-[#D89B32] h-3.5 w-3.5 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer py-1 px-1.5 rounded-lg hover:bg-[#F7F5EF]">
                    <span className="font-medium text-[11px]">Transit Routes</span>
                    <input
                      type="checkbox"
                      checked={showRoutes}
                      onChange={(e) => setShowRoutes(e.target.checked)}
                      className="rounded accent-[#D89B32] h-3.5 w-3.5 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer py-1 px-1.5 rounded-lg hover:bg-[#F7F5EF]">
                    <span className="font-medium text-[11px]">Stations (3D Nodes)</span>
                    <input
                      type="checkbox"
                      checked={showStations}
                      onChange={(e) => setShowStations(e.target.checked)}
                      className="rounded accent-[#D89B32] h-3.5 w-3.5 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer py-1 px-1.5 rounded-lg hover:bg-[#F7F5EF]">
                    <span className="font-medium text-[11px]">Passenger Activity (Crowd)</span>
                    <input
                      type="checkbox"
                      checked={showPedestrians}
                      onChange={(e) => setShowPedestrians(e.target.checked)}
                      className="rounded accent-[#D89B32] h-3.5 w-3.5 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer py-1 px-1.5 rounded-lg hover:bg-[#F7F5EF]">
                    <span className="font-medium text-[11px]">Crowd Density Rings</span>
                    <input
                      type="checkbox"
                      checked={showCrowd}
                      onChange={(e) => setShowCrowd(e.target.checked)}
                      className="rounded accent-[#D89B32] h-3.5 w-3.5 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer py-1 px-1.5 rounded-lg hover:bg-[#F7F5EF]">
                    <span className="font-medium text-[11px]">Road Geography</span>
                    <input
                      type="checkbox"
                      checked={showRoads}
                      onChange={(e) => setShowRoads(e.target.checked)}
                      className="rounded accent-[#D89B32] h-3.5 w-3.5 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer py-1 px-1.5 rounded-lg hover:bg-[#F7F5EF]">
                    <span className="font-medium text-[11px]">Operational Delays</span>
                    <input
                      type="checkbox"
                      checked={showDelays}
                      onChange={(e) => setShowDelays(e.target.checked)}
                      className="rounded accent-[#D89B32] h-3.5 w-3.5 cursor-pointer"
                    />
                  </label>
                </div>

                <div className="pt-2 border-t border-[#DDD9CF] flex items-start gap-1 text-[9.5px] text-[#6E6E67] leading-tight">
                  <Info className="w-3 h-3 text-[#6E6E67] shrink-0 mt-0.5" />
                  <span>
                    Aggregate activity representations; individual identities are not tracked.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ─── ZONE 3: RIGHT DETAIL ZONE (Station Details) ─── */}
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
                    <span className="text-[11px] text-[#6E6E67] ml-2 hidden sm:inline">
                      {selectedHour >= 8 && selectedHour <= 10
                        ? 'Morning Peak Rush: Full fleet deployment & heavy road congestion'
                        : selectedHour >= 17 && selectedHour <= 20
                        ? 'Evening Peak Commute: High transit demand & arterial traffic'
                        : selectedHour >= 23 || selectedHour <= 5
                        ? 'Night Window: Reduced frequency (20-min headway)'
                        : 'Standard Operating Timetable'}
                    </span>
                  </div>
                </div>

                <div className="bg-[#242521] text-[#F2C66D] px-3 py-1 rounded-full text-xs font-mono font-extrabold tracking-wider shadow-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D89B32] animate-pulse"></span>
                  <span>{`${selectedHour.toString().padStart(2, '0')}:00`}</span>
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

              <input
                type="range"
                min="5"
                max="23"
                value={selectedHour}
                onChange={(e) => onHourChange(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#DDD9CF] rounded-lg appearance-none cursor-pointer accent-[#D89B32]"
              />

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

          {selectedStationObj ? (
            <div className="hidden lg:block w-[320px] sm:w-[340px] shrink-0 pointer-events-none" />
          ) : null}
        </div>

      </div>
    </div>
  );
};

export default LivingCity3DMap;
