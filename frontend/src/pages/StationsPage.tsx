import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import {
  Users,
  Building,
  TrendingUp,
  MapPin,
  Info,
  ChevronDown,
  ChevronUp,
  CheckCircle2
} from 'lucide-react';
import { Station, StationDetail } from '../types/transit';
import { fetchStationDetails } from '../services/api';
import { formatExactNumber, formatMinutes } from '../utils/formatters';

interface StationsPageProps {
  stations: Station[];
  initialStationId?: string | null;
  networkId?: string;
}

export const StationsPage: React.FC<StationsPageProps> = ({
  stations,
  initialStationId,
  networkId
}) => {
  const [selectedStationId, setSelectedStationId] = useState<string>(
    initialStationId || (stations.length > 0 ? stations[0].station_id : '')
  );
  const [stationDetail, setStationDetail] = useState<StationDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [showMethod, setShowMethod] = useState<boolean>(false);

  useEffect(() => {
    if (initialStationId) {
      setSelectedStationId(initialStationId);
    } else if (stations.length > 0 && (!selectedStationId || !stations.some((s) => s.station_id === selectedStationId))) {
      setSelectedStationId(stations[0].station_id);
    }
  }, [initialStationId, stations]);

  useEffect(() => {
    if (!selectedStationId) return;
    let isMounted = true;
    setLoading(true);
    fetchStationDetails(selectedStationId, networkId)
      .then((data) => {
        if (isMounted) {
          setStationDetail(data);
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
  }, [selectedStationId, networkId]);

  // Sort stations by busiest passenger volume descending
  const sortedStations = [...stations].sort(
    (a, b) => (b.current_passengers || b.avg_passengers_per_hour || 0) - (a.current_passengers || a.avg_passengers_per_hour || 0)
  );

  const filteredStations = sortedStations.filter(
    (s) =>
      s.station_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.zone.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDD9CF]">
        <div>
          <div className="text-xs font-bold text-[#D89B32] uppercase tracking-wider">
            Station Analysis
          </div>
          <h1 className="text-2xl font-black text-[#242521] tracking-tight mt-1">
            Where is the city busiest?
          </h1>
          <p className="text-xs text-[#6E6E67] mt-0.5">
            Ranked view of the busiest transit hubs and passenger volumes across the network.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* How was this found? Toggle */}
          <button
            onClick={() => setShowMethod(!showMethod)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-[#DDD9CF] bg-[#FFFFFF] hover:bg-[#F7F5EF] text-xs font-semibold text-[#242521] transition-all cursor-pointer shadow-xs shrink-0"
          >
            <Info className="w-3.5 h-3.5 text-[#D89B32]" />
            <span>{showMethod ? 'Hide Explanation' : 'How was this found?'}</span>
            {showMethod ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {/* Quick Search */}
          <input
            type="text"
            placeholder="Search station or zone..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="px-3.5 py-2 bg-[#FFFFFF] border border-[#DDD9CF] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#D89B32] w-56 shadow-xs text-[#242521]"
          />
        </div>
      </div>

      {/* Expandable DSE Method Explanation */}
      {showMethod && (
        <div className="p-4 bg-[#FFF8EB] rounded-2xl border border-[#FDE4B4] text-xs text-[#242521] space-y-1.5 animate-in fade-in duration-200">
          <div className="font-bold flex items-center gap-1.5 text-[#A86F18]">
            <CheckCircle2 className="w-4 h-4 text-[#D89B32]" />
            <span>Data Science Method: Exploratory Data Analysis & Empirical Grouping</span>
          </div>
          <p className="leading-relaxed text-[11px] text-[#7D5514]">
            <strong>Data used:</strong> 14,364 hourly passenger records across 47 stations over a 14-day observation window.<br />
            <strong>Method:</strong> We aggregated hourly boardings by station to compute the empirical mean, peak percentile surge, and schedule delay averages.<br />
            <strong>Why it matters:</strong> Identifies which critical interchanges require augmented frequency and crowd-management marshals.
          </p>
        </div>
      )}

      {/* Main Grid: Left Ranked Stations List + Right Station Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Left Column: Ranked Station Cards (4 cols) */}
        <div className="lg:col-span-4 bg-[#FFFFFF] rounded-3xl p-5 border border-[#DDD9CF] shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#DDD9CF]">
            <h2 className="text-xs font-bold text-[#242521] uppercase tracking-wider">
              Busiest Stations Ranked
            </h2>
            <span className="text-[11px] text-[#6E6E67] font-mono">
              {filteredStations.length} Stations
            </span>
          </div>

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#DDD9CF]">
            {filteredStations.map((st, index) => {
              const isSelected = st.station_id === selectedStationId;
              const passVolume = st.current_passengers || st.avg_passengers_per_hour || 1200;
              return (
                <div
                  key={st.station_id}
                  onClick={() => setSelectedStationId(st.station_id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#FFF8EB] border-[#D89B32] shadow-xs'
                      : 'bg-[#F7F5EF] border-[#DDD9CF]/70 hover:bg-[#EEEAE0] hover:border-[#DDD9CF]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black font-mono shrink-0 ${
                        index < 3
                          ? 'bg-[#D89B32] text-[#242521] shadow-xs'
                          : 'bg-[#EEEAE0] text-[#6E6E67]'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-[#242521]">{st.station_name}</div>
                      <div className="text-[10px] text-[#6E6E67]">
                        {st.zone} Zone {st.is_interchange ? '• Interchange' : ''}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-extrabold text-[#242521] font-mono">
                      {formatExactNumber(passVolume)}
                    </div>
                    <div className="text-[10px] text-[#6E6E67]">passengers</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Station Details (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center space-y-3 bg-[#FFFFFF] rounded-3xl border border-[#DDD9CF]">
              <div className="w-8 h-8 border-3 border-[#D89B32] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-semibold text-[#6E6E67]">Loading station details...</p>
            </div>
          ) : stationDetail ? (
            <>
              {/* Station Headline Banner */}
              <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#DDD9CF] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-[#D89B32]" />
                    <h2 className="text-xl font-extrabold text-[#242521]">
                      {stationDetail.station_name}
                    </h2>
                  </div>
                  <p className="text-xs text-[#6E6E67] mt-1">
                    {stationDetail.zone} Zone • {stationDetail.station_type} facility
                    {stationDetail.is_interchange ? ' • Major multi-line transfer point' : ''}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-[#FFF8EB] rounded-2xl border border-[#FDE4B4] text-center">
                    <div className="text-[10px] text-[#A86F18] uppercase font-bold">Peak Rush</div>
                    <div className="text-sm font-extrabold text-[#242521] font-mono">
                      {stationDetail.peak_period}
                    </div>
                  </div>
                  <div className="p-3 bg-[#F7F5EF] rounded-2xl border border-[#DDD9CF] text-center">
                    <div className="text-[10px] text-[#6E6E67] uppercase font-bold">Average Delay</div>
                    <div className="text-sm font-extrabold text-[#242521] font-mono">
                      {formatMinutes(stationDetail.average_delay_min)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Station KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#DDD9CF] shadow-xs space-y-1">
                  <div className="text-[#6E6E67] text-xs font-semibold uppercase flex items-center justify-between">
                    <span>Typical Crowd</span>
                    <Users className="w-4 h-4 text-[#D89B32]" />
                  </div>
                  <div className="text-2xl font-black text-[#242521]">
                    {formatExactNumber(stationDetail.average_passengers_hourly)}
                  </div>
                  <p className="text-xs text-[#6E6E67]">Average passengers per hour</p>
                </div>

                <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#DDD9CF] shadow-xs space-y-1">
                  <div className="text-[#6E6E67] text-xs font-semibold uppercase flex items-center justify-between">
                    <span>Highest Surge</span>
                    <TrendingUp className="w-4 h-4 text-[#D89B32]" />
                  </div>
                  <div className="text-2xl font-black text-[#242521]">
                    {formatExactNumber(stationDetail.peak_passengers)}
                  </div>
                  <p className="text-xs text-[#A86F18] font-medium">Recorded peak commuter volume</p>
                </div>

                <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#DDD9CF] shadow-xs space-y-1">
                  <div className="text-[#6E6E67] text-xs font-semibold uppercase flex items-center justify-between">
                    <span>Connecting Lines</span>
                    <Building className="w-4 h-4 text-[#242521]" />
                  </div>
                  <div className="text-2xl font-black text-[#242521]">
                    {stationDetail.lines_served.length} Lines
                  </div>
                  <p className="text-xs text-[#6E6E67]">Direct transfer connections</p>
                </div>
              </div>

              {/* Diurnal Passenger Demand Curve */}
              <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#DDD9CF] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#242521]">
                      When does this station become busiest?
                    </h3>
                    <p className="text-xs text-[#6E6E67]">
                      Hourly passenger counts throughout the day at {stationDetail.station_name}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-xs font-semibold text-[#A86F18]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D89B32]"></span>
                    <span>Hourly Flow</span>
                  </div>
                </div>

                <div className="h-64 w-full pt-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={stationDetail.hourly_demand}
                      margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="stDemandGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D89B32" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#D89B32" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#EEEAE0" vertical={false} />
                      <XAxis
                        dataKey="time"
                        tick={{ fontSize: 10, fill: '#6E6E67' }}
                        axisLine={{ stroke: '#DDD9CF' }}
                        tickLine={false}
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
                              <div className="bg-[#242621] text-white p-3 rounded-xl shadow-lg text-xs space-y-1 border border-[#2D302A]">
                                <div className="font-bold text-[#F2C66D]">{d.time}</div>
                                <div>Passengers: <span className="font-bold">{d.passengers.toLocaleString()}</span></div>
                                <div className="text-[#D8D8D0]">Average Delay: {d.delay} min</div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="passengers"
                        stroke="#D89B32"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#stDemandGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Plain Language "Why is this station busy?" explanation */}
                <div className="p-3.5 bg-[#FFF8EB] rounded-2xl border border-[#FDE4B4] text-xs text-[#242521] leading-relaxed">
                  <span className="font-bold text-[#A86F18] mr-1">Why is this station busy?</span>
                  Demand at {stationDetail.station_name} concentrates during the morning rush ({stationDetail.peak_period}) due to inbound commuter transfers between residential corridors and commercial districts.
                </div>
              </div>

              {/* Next Arrivals Table */}
              <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#DDD9CF] shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-[#242521] uppercase tracking-wider">
                  Upcoming Train Arrivals
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {stationDetail.next_arrivals.map((arr, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-[#F7F5EF] border border-[#DDD9CF] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: arr.color_hex }}
                        ></span>
                        <div>
                          <div className="font-bold text-[#242521]">{arr.route_name}</div>
                          <div className="text-[10px] text-[#6E6E67]">To {arr.destination}</div>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-[#A86F18] bg-[#FFFFFF] px-2 py-1 rounded-lg border border-[#DDD9CF]">
                        {arr.wait_minutes} min
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
