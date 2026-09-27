import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import {
  Scale
} from 'lucide-react';
import { Route, RouteDetail } from '../types/transit';
import { fetchRouteDetails, compareRoutes } from '../services/api';
import { formatCompactNumber, formatExactNumber, formatMinutes } from '../utils/formatters';

interface RoutesPageProps {
  routes: Route[];
  networkId?: string;
}

export const RoutesPage: React.FC<RoutesPageProps> = ({ routes, networkId }) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>(
    routes.length > 0 ? routes[0].route_id : ''
  );
  const [routeDetail, setRouteDetail] = useState<RouteDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Comparison State
  const [compareRouteA, setCompareRouteA] = useState<string>(
    routes.length > 0 ? routes[0].route_id : ''
  );
  const [compareRouteB, setCompareRouteB] = useState<string>(
    routes.length > 1 ? routes[1].route_id : (routes.length > 0 ? routes[0].route_id : '')
  );
  const [comparisonData, setComparisonData] = useState<any>(null);

  // Sync routes when network changes
  useEffect(() => {
    if (routes.length > 0) {
      if (!routes.some((r) => r.route_id === selectedRouteId)) {
        setSelectedRouteId(routes[0].route_id);
      }
      if (!routes.some((r) => r.route_id === compareRouteA)) {
        setCompareRouteA(routes[0].route_id);
      }
      if (!routes.some((r) => r.route_id === compareRouteB)) {
        setCompareRouteB(routes.length > 1 ? routes[1].route_id : routes[0].route_id);
      }
    }
  }, [routes]);

  useEffect(() => {
    if (!selectedRouteId) return;
    let isMounted = true;
    setLoading(true);
    fetchRouteDetails(selectedRouteId, networkId)
      .then((data) => {
        if (isMounted) {
          setRouteDetail(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [selectedRouteId, networkId]);

  useEffect(() => {
    if (!compareRouteA || !compareRouteB) return;
    compareRoutes(compareRouteA, compareRouteB, networkId).then((res) => {
      setComparisonData(res);
    });
  }, [compareRouteA, compareRouteB, networkId]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="pb-4 border-b border-[#DDD9CF]">
        <div className="text-xs font-bold text-[#D89B32] uppercase tracking-wider">
          Corridor Analysis
        </div>
        <h1 className="text-2xl font-black text-[#242521] tracking-tight mt-1">
          Which routes carry the most people?
        </h1>
        <p className="text-xs text-[#6E6E67] mt-0.5">
          Compare total ridership, rush hours, and delays across the transit corridors.
        </p>
      </div>

      {/* Route Cards Overview (Ranked / Interactive) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {routes.map((rt) => {
          const isSelected = selectedRouteId === rt.route_id;
          const dailyVol = rt.daily_avg_passengers || 24000;
          return (
            <div
              key={rt.route_id}
              onClick={() => setSelectedRouteId(rt.route_id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-[#FFF8EB] border-[#D89B32] shadow-md ring-2 ring-[#D89B32]/25'
                  : 'bg-[#FFFFFF] border-[#DDD9CF] hover:border-[#D89B32]/60 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: rt.color_hex }}
                ></span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    rt.operational_status === 'Delay'
                      ? 'bg-[#FAECE9] text-[#782619] border border-[#ECC4BE]'
                      : rt.operational_status === 'Busy'
                      ? 'bg-[#FAF3E5] text-[#7D5514] border border-[#EEDCB8]'
                      : 'bg-[#E9EFE9] text-[#243C35] border border-[#C5D6C5]'
                  }`}
                >
                  {rt.operational_status || 'Normal'}
                </span>
              </div>

              <div>
                <h2 className="text-xs font-bold text-[#242521]">{rt.route_name}</h2>
                <div className="text-xl font-extrabold text-[#242521] mt-1 font-mono">
                  {formatCompactNumber(dailyVol)}
                </div>
                <div className="text-[10px] text-[#6E6E67]">passengers today</div>
              </div>

              <div className="pt-2 border-t border-[#DDD9CF]/60 text-[11px] text-[#6E6E67] flex justify-between">
                <span>Peak: 8:30 AM</span>
                <span>{rt.total_stations} stops</span>
              </div>
            </div>
          );
        })}
      </div>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center space-y-3 bg-[#FFFFFF] rounded-3xl border border-[#DDD9CF]">
          <div className="w-8 h-8 border-3 border-[#D89B32] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-[#6E6E67]">Loading corridor details...</p>
        </div>
      ) : routeDetail ? (
        <>
          {/* Corridor Detail Banner */}
          <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#DDD9CF] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: routeDetail.color_hex }}
                ></span>
                <div>
                  <h3 className="text-lg font-bold text-[#242521]">
                    {routeDetail.route_name}
                  </h3>
                  <p className="text-xs text-[#6E6E67]">
                    {routeDetail.origin} ↔ {routeDetail.destination} • {routeDetail.length_km} km
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-xs">
                <div className="text-right">
                  <span className="text-[#6E6E67] block text-[10px] uppercase font-bold">Daily Average</span>
                  <span className="text-sm font-extrabold text-[#242521] font-mono">
                    {formatExactNumber(routeDetail.daily_avg_passengers)} pass
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[#6E6E67] block text-[10px] uppercase font-bold">Average Delay</span>
                  <span className="text-sm font-extrabold text-[#242521] font-mono">
                    {formatMinutes(routeDetail.avg_delay_min)}
                  </span>
                </div>
              </div>
            </div>

            {/* Station sequence alignment */}
            <div className="pt-3 border-t border-[#DDD9CF]/60">
              <div className="text-[11px] font-bold text-[#6E6E67] uppercase tracking-wider mb-2">
                Stations Along Corridor ({routeDetail.corridor_stations.length} Stops)
              </div>
              <div className="flex items-center overflow-x-auto py-2 space-x-3 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-[#DDD9CF]">
                {routeDetail.corridor_stations.map((st, idx) => (
                  <div key={st.station_id} className="flex items-center shrink-0">
                    <div className="flex flex-col items-center">
                      <span
                        className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                          st.is_interchange ? 'bg-[#D89B32] ring-2 ring-[#D89B32]/35' : 'bg-[#6E6E67]'
                        }`}
                      ></span>
                      <span className="text-[11px] font-semibold text-[#242521] mt-1 max-w-[85px] text-center truncate">
                        {st.station_name}
                      </span>
                    </div>
                    {idx < routeDetail.corridor_stations.length - 1 && (
                      <div
                        className="w-6 h-0.5 mx-1 rounded-full"
                        style={{ backgroundColor: routeDetail.color_hex }}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Passenger Demand Along the Route Chart */}
          <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#DDD9CF] shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#242521]">
                Passenger Demand Along This Route
              </h3>
              <p className="text-xs text-[#6E6E67]">
                See where passenger boardings are heaviest station-by-station.
              </p>
            </div>

            <div className="h-64 w-full pt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={routeDetail.corridor_stations}
                  margin={{ top: 10, right: 10, left: -10, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#EEEAE0" vertical={false} />
                  <XAxis
                    dataKey="station_name"
                    tick={{ fontSize: 10, fill: '#6E6E67' }}
                    angle={-20}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#6E6E67' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-[#242621] text-white p-2.5 rounded-xl shadow-lg text-xs space-y-1 border border-[#2D302A]">
                            <div className="font-bold text-[#F2C66D]">{d.station_name}</div>
                            <div>Average: <span className="font-bold">{d.average_passengers.toLocaleString()}</span> pass/hr</div>
                            <div>Peak Load: <span className="font-bold">{d.peak_passengers.toLocaleString()}</span></div>
                            <div className="text-[#D8D8D0]">Delay: {d.average_delay_min} min</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="average_passengers"
                    fill={routeDetail.color_hex}
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Route Comparison Section */}
          <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#DDD9CF] shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-[#242521] flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-[#D89B32]" />
                  <span>Compare Two Routes</span>
                </h3>
                <p className="text-xs text-[#6E6E67]">
                  Select two corridors to compare passenger volume and delay differences.
                </p>
              </div>

              <div className="flex items-center space-x-2 text-xs font-semibold">
                <select
                  value={compareRouteA}
                  onChange={(e) => setCompareRouteA(e.target.value)}
                  className="p-2 rounded-xl border border-[#DDD9CF] bg-[#FFFFFF] text-[#242521]"
                >
                  {routes.map((r) => (
                    <option key={r.route_id} value={r.route_id}>{r.route_name}</option>
                  ))}
                </select>
                <span className="text-[#6E6E67] font-bold">vs</span>
                <select
                  value={compareRouteB}
                  onChange={(e) => setCompareRouteB(e.target.value)}
                  className="p-2 rounded-xl border border-[#DDD9CF] bg-[#FFFFFF] text-[#242521]"
                >
                  {routes.map((r) => (
                    <option key={r.route_id} value={r.route_id}>{r.route_name}</option>
                  ))}
                </select>
              </div>
            </div>

            {comparisonData && comparisonData.route_a && comparisonData.route_b && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#DDD9CF] space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-[#242521]">
                    <span>{comparisonData.route_a.route_name}</span>
                    <span className="font-mono text-[#6E6E67]">{comparisonData.route_a.length_km} km</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#DDD9CF]">
                    <div>
                      <span className="text-[#6E6E67] block text-[10px]">Daily Passengers</span>
                      <span className="font-bold text-[#242521] text-sm font-mono">
                        {formatExactNumber(comparisonData.route_a.daily_avg_passengers)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#6E6E67] block text-[10px]">Average Delay</span>
                      <span className="font-bold text-[#A86F18] text-sm font-mono">
                        {formatMinutes(comparisonData.route_a.avg_delay_min)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#DDD9CF] space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-[#242521]">
                    <span>{comparisonData.route_b.route_name}</span>
                    <span className="font-mono text-[#6E6E67]">{comparisonData.route_b.length_km} km</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#DDD9CF]">
                    <div>
                      <span className="text-[#6E6E67] block text-[10px]">Daily Passengers</span>
                      <span className="font-bold text-[#242521] text-sm font-mono">
                        {formatExactNumber(comparisonData.route_b.daily_avg_passengers)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#6E6E67] block text-[10px]">Average Delay</span>
                      <span className="font-bold text-[#A86F18] text-sm font-mono">
                        {formatMinutes(comparisonData.route_b.avg_delay_min)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};
