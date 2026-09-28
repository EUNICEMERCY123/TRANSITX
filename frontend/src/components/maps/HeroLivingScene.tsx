import React, { useEffect, useRef, useState } from 'react';
import { Route, Station } from '../../types/transit';
import { Play, Activity, Sparkles, Navigation, Layers, Compass } from 'lucide-react';

interface HeroLivingSceneProps {
  routes: Route[];
  stations: Station[];
  networkName?: string;
  cityName?: string;
  onExplore: () => void;
}

interface SimulatedTrain {
  routeId: string;
  color: string;
  path: [number, number][]; // canvas coordinates
  progress: number;
  speed: number;
  length: number;
}

interface FlowParticle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  speed: number;
  color: string;
}

export const HeroLivingScene: React.FC<HeroLivingSceneProps> = ({
  routes,
  stations,
  networkName = 'Chennai Transit Network',
  cityName = 'Chennai',
  onExplore
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredStation, setHoveredStation] = useState<Station | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeSpeed, setActiveSpeed] = useState<number>(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Compute coordinate bounds
    // Compute coordinate bounds dynamically from stations
    const lats = stations.length > 0 ? stations.map((s) => s.latitude) : [13.04];
    const lngs = stations.length > 0 ? stations.map((s) => s.longitude) : [80.23];
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latSpan = Math.max(0.02, maxLat - minLat);
    const lngSpan = Math.max(0.02, maxLng - minLng);

    const project = (lat: number, lng: number): [number, number] => {
      // Invert latitude for canvas Y, map longitude to X
      const padding = 60;
      const drawWidth = width - padding * 2;
      const drawHeight = height - padding * 2;

      // Maintain aspect ratio
      const scale = Math.min(drawWidth / lngSpan, drawHeight / latSpan);
      const centerX = width / 2;
      const centerY = height / 2;
      const midLng = (minLng + maxLng) / 2;
      const midLat = (minLat + maxLat) / 2;

      const x = centerX + (lng - midLng) * scale;
      const y = centerY - (lat - midLat) * scale;
      return [x, y];
    };

    // Prepare route paths in canvas space
    const projectedRoutes = routes.map((r) => {
      const pts: [number, number][] = (r.coordinates_path || []).map((pt) => project(pt[0], pt[1]));
      return {
        ...r,
        pts
      };
    });

    // Initialize simulated trains
    const trains: SimulatedTrain[] = routes.map((r, i) => {
      const pts = (r.coordinates_path || []).map((pt) => project(pt[0], pt[1]));
      return {
        routeId: r.route_id,
        color: r.color_hex || '#D89B32',
        path: pts,
        progress: (i * 0.22) % 1,
        speed: 0.0007 + (i % 3) * 0.0002,
        length: 18
      };
    });

    // Passenger flow particles
    const particles: FlowParticle[] = [];
    const maxParticles = 35;

    const spawnParticle = () => {
      if (stations.length < 2 || particles.length >= maxParticles) return;
      const s1 = stations[Math.floor(Math.random() * stations.length)];
      // pick a nearby station or interchange
      const s2 = stations[Math.floor(Math.random() * stations.length)];
      if (s1.station_id === s2.station_id) return;

      const [x1, y1] = project(s1.latitude, s1.longitude);
      const [x2, y2] = project(s2.latitude, s2.longitude);

      particles.push({
        x: x1,
        y: y1,
        targetX: x2,
        targetY: y2,
        progress: 0,
        speed: 0.004 + Math.random() * 0.006,
        color: '#D89B32'
      });
    };

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Subtle background grid
      ctx.strokeStyle = '#DDD9CF33';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw stylized road connections / corridor shadows
      projectedRoutes.forEach((route) => {
        if (route.pts.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(route.pts[0][0], route.pts[0][1]);
        for (let i = 1; i < route.pts.length; i++) {
          ctx.lineTo(route.pts[i][0], route.pts[i][1]);
        }
        ctx.strokeStyle = '#DDD9CF88';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      });

      // Draw active transit route lines
      projectedRoutes.forEach((route) => {
        if (route.pts.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(route.pts[0][0], route.pts[0][1]);
        for (let i = 1; i < route.pts.length; i++) {
          ctx.lineTo(route.pts[i][0], route.pts[i][1]);
        }
        ctx.strokeStyle = route.color_hex || '#D89B32';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = route.color_hex || '#D89B32';
        ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      });

      // Spawn and update passenger flow particles
      if (frame % 8 === 0) spawnParticle();
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.progress += p.speed * activeSpeed;
        if (p.progress >= 1) {
          particles.splice(i, 1);
          continue;
        }
        const curX = p.x + (p.targetX - p.x) * p.progress;
        const curY = p.y + (p.targetY - p.y) * p.progress;

        ctx.beginPath();
        ctx.arc(curX, curY, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#D89B32CC';
        ctx.shadowColor = '#D89B32';
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Update and draw simulated trains moving along routes
      trains.forEach((train) => {
        if (!train.path || train.path.length < 2) return;
        train.progress = (train.progress + train.speed * activeSpeed) % 1;

        // Calculate position on multi-segment line
        const totalSegments = train.path.length - 1;
        const exactIdx = train.progress * totalSegments;
        const segIdx = Math.min(totalSegments - 1, Math.floor(exactIdx));
        const segProgress = exactIdx - segIdx;

        const pA = train.path[segIdx];
        const pB = train.path[segIdx + 1];
        if (!pA || !pB) return;

        const trainX = pA[0] + (pB[0] - pA[0]) * segProgress;
        const trainY = pA[1] + (pB[1] - pA[1]) * segProgress;

        // Train glow halo
        ctx.beginPath();
        ctx.arc(trainX, trainY, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#D89B3233';
        ctx.fill();

        // Train body
        ctx.beginPath();
        ctx.arc(trainX, trainY, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#242521';
        ctx.strokeStyle = '#D89B32';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        // Headlight beam
        const angle = Math.atan2(pB[1] - pA[1], pB[0] - pA[0]);
        const beamX = trainX + Math.cos(angle) * 7;
        const beamY = trainY + Math.sin(angle) * 7;
        ctx.beginPath();
        ctx.arc(beamX, beamY, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 5;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw Station Nodes
      stations.forEach((st) => {
        const [sx, sy] = project(st.latitude, st.longitude);
        const isHovered = hoveredStation?.station_id === st.station_id;
        const isInterchange = st.is_interchange;

        // Interchange pulse animation
        if (isInterchange) {
          const pulse = (Math.sin(frame * 0.05 + sx) + 1) / 2;
          ctx.beginPath();
          ctx.arc(sx, sy, 7 + pulse * 4, 0, Math.PI * 2);
          ctx.strokeStyle = '#D89B3266';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Station outer circle
        ctx.beginPath();
        ctx.arc(sx, sy, isHovered ? 6 : (isInterchange ? 4.5 : 3.5), 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? '#D89B32' : (isInterchange ? '#A86F18' : '#242521');
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = isHovered ? 2.5 : 1.5;
        ctx.fill();
        ctx.stroke();

        // Label prominent interchange stations
        if (isInterchange || isHovered) {
          ctx.font = 'bold 10px Inter, system-ui, sans-serif';
          ctx.fillStyle = '#242521';
          ctx.textAlign = 'center';
          ctx.fillText(st.station_name, sx, sy - 10);
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [routes, stations, activeSpeed, hoveredStation]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    // Check hit test against stations
    const lats = stations.map((s) => s.latitude);
    const lngs = stations.map((s) => s.longitude);
    const minLat = Math.min(...lats, 12.95);
    const maxLat = Math.max(...lats, 13.15);
    const minLng = Math.min(...lngs, 80.12);
    const maxLng = Math.max(...lngs, 80.30);
    const latSpan = Math.max(0.05, maxLat - minLat);
    const lngSpan = Math.max(0.05, maxLng - minLng);

    const width = rect.width;
    const height = rect.height;
    const padding = 60;
    const drawWidth = width - padding * 2;
    const drawHeight = height - padding * 2;
    const scale = Math.min(drawWidth / lngSpan, drawHeight / latSpan);
    const centerX = width / 2;
    const centerY = height / 2;
    const midLng = (minLng + maxLng) / 2;
    const midLat = (minLat + maxLat) / 2;

    let found: Station | null = null;
    for (const st of stations) {
      const sx = centerX + (st.longitude - midLng) * scale;
      const sy = centerY - (st.latitude - midLat) * scale;
      const dist = Math.hypot(x - sx, y - sy);
      if (dist < 12) {
        found = st;
        break;
      }
    }
    setHoveredStation(found);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[480px] sm:h-[540px] md:h-[600px] rounded-3xl bg-[#FAF9F5] border border-[#DDD9CF] shadow-lg overflow-hidden flex flex-col items-center justify-center select-none"
    >
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredStation(null)}
        onClick={onExplore}
        className="absolute inset-0 w-full h-full cursor-pointer"
      />

      {/* Top Left Live Status HUD */}
      <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none z-10">
        <div className="flex items-center space-x-2 bg-[#FFFFFF]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#DDD9CF] shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#5F8A63] animate-pulse"></span>
          <span className="text-xs font-bold text-[#242521]">{cityName} Transit Network</span>
          <span className="text-[10px] font-mono text-[#6E6E67] px-1.5 py-0.5 rounded bg-[#F7F5EF] border border-[#DDD9CF]">
            {routes.length} Corridors
          </span>
        </div>
        <div className="text-[10px] text-[#6E6E67] font-semibold flex items-center gap-1 bg-[#FFFFFF]/80 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-[#DDD9CF] w-fit">
          <Activity className="w-3 h-3 text-[#D89B32]" />
          <span>Real-Time Moving Vehicle & Station Telemetry</span>
        </div>
      </div>

      {/* Top Right HUD: Peak Period & Active Vehicles */}
      <div className="absolute top-4 right-4 flex items-center space-x-2 pointer-events-none z-10">
        <div className="bg-[#FFFFFF]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#DDD9CF] shadow-xs text-right">
          <div className="text-[10px] font-bold text-[#6E6E67] uppercase tracking-wider">Simulated Period</div>
          <div className="text-xs font-mono font-black text-[#A86F18]">08:30 AM — Peak Rush</div>
        </div>
      </div>

      {/* Hover Station Tooltip */}
      {hoveredStation && (
        <div
          className="absolute z-20 pointer-events-none bg-[#242621] text-white px-3 py-2 rounded-xl text-xs shadow-xl border border-[#2D302A] space-y-0.5 transform -translate-x-1/2 -translate-y-full mb-3"
          style={{ left: mousePos.x, top: mousePos.y }}
        >
          <div className="font-bold text-[#F2C66D]">{hoveredStation.station_name}</div>
          <div className="text-[10px] text-[#D8D8D0]">
            {hoveredStation.zone} • {hoveredStation.is_interchange ? 'Interchange Hub' : 'Local Station'}
          </div>
          <div className="text-[10px] text-[#DDD9CF] font-mono">
            Typical Demand: <b>{(hoveredStation.avg_passengers_per_hour || 1200).toLocaleString()}</b> pass/hr
          </div>
        </div>
      )}

      {/* Center Interactive Overlay CTA Banner */}
      <div className="absolute bottom-5 inset-x-4 sm:inset-x-auto sm:w-auto flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FFFFFF]/95 backdrop-blur-md px-5 py-3 rounded-2xl border border-[#DDD9CF] shadow-xl z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-[#FFF3D6] text-[#A86F18]">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="text-xs font-black text-[#242521]">Living City Multi-Corridor View</div>
            <div className="text-[11px] text-[#6E6E67]">
              Hover stations or click below to launch full 3D interactive map
            </div>
          </div>
        </div>

        <button
          onClick={onExplore}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-[#D89B32] hover:bg-[#E7AE45] text-[#242521] text-xs font-extrabold rounded-xl transition-all shadow-md shadow-[#D89B32]/30 cursor-pointer"
        >
          <span>Launch Interactive Map</span>
          <Navigation className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
