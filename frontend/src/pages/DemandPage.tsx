import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from 'recharts';
import {
  Clock,
  TrendingUp
} from 'lucide-react';
import { Route, Station, DemandAnalysis } from '../types/transit';
import { fetchDemandAnalysis } from '../services/api';
import { formatExactNumber } from '../utils/formatters';

interface DemandPageProps {
  routes: Route[];
  stations: Station[];
  networkId?: string;
}

export const DemandPage: React.FC<DemandPageProps> = ({
  routes,
  stations,
  networkId
}) => {
  const [selectedRoute, setSelectedRoute] = useState<string>('ALL');
  const [selectedStation, setSelectedStation] = useState<string>('ALL');
  const [selectedDate, setSelectedDate] = useState<string>('2024-01-15');
  const [demandData, setDemandData] = useState<DemandAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchDemandAnalysis(
      selectedRoute === 'ALL' ? undefined : selectedRoute,
      selectedStation === 'ALL' ? undefined : selectedStation,
      selectedDate === 'ALL' ? undefined : selectedDate,
      networkId
    )
      .then((data) => {
        if (isMounted) {
          setDemandData(data);
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
  }, [selectedRoute, selectedStation, selectedDate, networkId]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#DDD9CF]">
        <div>
          <div className="text-xs font-bold text-[#D89B32] uppercase tracking-wider">
            Travel Demand
          </div>
          <h1 className="text-2xl font-black text-[#242521] tracking-tight mt-1">
            When is public transport busiest?
          </h1>
          <p className="text-xs text-[#6E6E67] mt-0.5">
            See how passenger counts change throughout the day and find rush hours.
          </p>
        </div>

        {/* Interactive Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Route filter */}
          <select
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
            className="px-3 py-2 bg-[#FFFFFF] border border-[#DDD9CF] rounded-xl text-xs font-semibold text-[#242521] shadow-xs focus:ring-2 focus:ring-[#D89B32]"
          >
            <option value="ALL">All Routes</option>
            {routes.map((r) => (
              <option key={r.route_id} value={r.route_id}>
                {r.route_name}
              </option>
            ))}
          </select>

          {/* Station filter */}
          <select
            value={selectedStation}
            onChange={(e) => setSelectedStation(e.target.value)}
            className="px-3 py-2 bg-[#FFFFFF] border border-[#DDD9CF] rounded-xl text-xs font-semibold text-[#242521] shadow-xs focus:ring-2 focus:ring-[#D89B32]"
          >
            <option value="ALL">All Stations</option>
            {stations.map((s) => (
              <option key={s.station_id} value={s.station_id}>
                {s.station_name}
              </option>
            ))}
          </select>

          {/* Date filter */}
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 bg-[#FFFFFF] border border-[#DDD9CF] rounded-xl text-xs font-semibold text-[#242521] shadow-xs focus:ring-2 focus:ring-[#D89B32]"
          >
            <option value="2024-01-15">Mon, 15 Jan 2024</option>
            <option value="2024-01-16">Tue, 16 Jan 2024</option>
            <option value="2024-01-17">Wed, 17 Jan 2024</option>
            <option value="2024-01-18">Thu, 18 Jan 2024</option>
            <option value="2024-01-19">Fri, 19 Jan 2024</option>
            <option value="2024-01-20">Sat, 20 Jan 2024</option>
            <option value="2024-01-21">Sun, 21 Jan 2024</option>
            <option value="ALL">14-Day Average</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center space-y-3 bg-[#FFFFFF] rounded-3xl border border-[#DDD9CF]">
          <div className="w-8 h-8 border-3 border-[#D89B32] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-[#6E6E67]">Calculating passenger demand...</p>
        </div>
      ) : demandData ? (
        <>
          {/* Main Diurnal Demand Visualization */}
          <div className="bg-[#FFFFFF] p-7 rounded-3xl border border-[#DDD9CF] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-[#242521]">
                  Passenger Demand Throughout the Day
                </h2>
                <p className="text-xs text-[#6E6E67]">
                  Passenger demand rises sharply around the morning and evening travel periods.
                </p>
              </div>

              <div className="flex items-center space-x-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-[#6E6E67]">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#DDD9CF]"></span> Regular Hours
                </span>
                <span className="flex items-center gap-1.5 text-[#A86F18]">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#D89B32]"></span> Peak Travel Hours
                </span>
              </div>
            </div>

            <div className="h-80 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={demandData.chart_data}
                  margin={{ top: 20, right: 10, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#EEEAE0" vertical={false} />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 11, fill: '#6E6E67' }}
                    axisLine={{ stroke: '#DDD9CF' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#6E6E67' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        const isPeak = (d.hour >= 8 && d.hour <= 9) || (d.hour >= 17 && d.hour <= 18);
                        return (
                          <div className="bg-[#242621] text-white p-3 rounded-xl shadow-lg text-xs space-y-1 border border-[#2D302A]">
                            <div className="font-bold text-[#F2C66D] flex items-center justify-between gap-4">
                              <span>{d.time}</span>
                              {isPeak && <span className="bg-[#D89B32] text-[#242521] text-[10px] px-1.5 py-0.5 rounded font-bold">RUSH HOUR</span>}
                            </div>
                            <div>Passengers: <span className="font-bold text-white">{d.passengers.toLocaleString()}</span></div>
                            <div className="text-[#D8D8D0]">Average Delay: {d.delay} min</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="passengers" radius={[6, 6, 0, 0]}>
                    {demandData.chart_data.map((entry) => {
                      const isPeak = (entry.hour >= 8 && entry.hour <= 9) || (entry.hour >= 17 && entry.hour <= 18);
                      return (
                        <Cell
                          key={`cell-${entry.hour}`}
                          fill={isPeak ? '#D89B32' : '#DDD9CF'}
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3.5 bg-[#FFF8EB] rounded-2xl border border-[#FDE4B4] text-xs text-[#242521]">
              <span className="font-bold text-[#A86F18]">Summary:</span> Passenger demand peaks twice daily: between 8:30 AM – 9:30 AM for inbound morning commutes, and 5:30 PM – 7:00 PM for return evening journeys.
            </div>
          </div>

          {/* Key Insights Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Morning Peak */}
            <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#DDD9CF] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-[#FFF3D6] text-[#A86F18]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#242521]">Morning Peak</h3>
                    <p className="text-[11px] text-[#6E6E67]">{demandData.morning_peak.period}</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#FFF3D6] text-[#A86F18] border border-[#F2C66D]">
                  +{demandData.morning_peak.pct_above_average}%
                </span>
              </div>
              <div className="text-2xl font-black text-[#242521]">
                {formatExactNumber(demandData.morning_peak.passengers)}
              </div>
              <p className="text-xs text-[#6E6E67]">
                Passenger demand is highest during this morning work and school commute period.
              </p>
            </div>

            {/* Evening Peak */}
            <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#DDD9CF] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-[#EEEAE0] text-[#242521]">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#242521]">Evening Peak</h3>
                    <p className="text-[11px] text-[#6E6E67]">{demandData.evening_peak.period}</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#EEEAE0] text-[#242521] border border-[#DDD9CF]">
                  +{demandData.evening_peak.pct_above_average}%
                </span>
              </div>
              <div className="text-2xl font-black text-[#242521]">
                {formatExactNumber(demandData.evening_peak.passengers)}
              </div>
              <p className="text-xs text-[#6E6E67]">
                Return home journey creates sustained crowding across central hubs.
              </p>
            </div>

            {/* Lowest Demand Period */}
            <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#DDD9CF] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-[#F7F5EF] text-[#6E6E67]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#242521]">Lowest Demand</h3>
                    <p className="text-[11px] text-[#6E6E67]">{demandData.lowest_demand_period.time}</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#F7F5EF] text-[#6E6E67] border border-[#DDD9CF]">
                  Quiet
                </span>
              </div>
              <div className="text-2xl font-black text-[#242521]">
                {formatExactNumber(demandData.lowest_demand_period.passengers)}
              </div>
              <p className="text-xs text-[#6E6E67]">
                Late night period with minimal scheduled services and maintenance windows.
              </p>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
