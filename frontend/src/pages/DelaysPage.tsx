import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import {
  Clock,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';
import { DelaysAnalysis } from '../types/transit';
import { fetchDelaysAnalysis } from '../services/api';
import { formatMinutes } from '../utils/formatters';

interface DelaysPageProps {
  networkId?: string;
}

export const DelaysPage: React.FC<DelaysPageProps> = ({ networkId }) => {
  const [delaysData, setDelaysData] = useState<DelaysAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchDelaysAnalysis(networkId)
      .then((data) => {
        if (isMounted) {
          setDelaysData(data);
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
  }, [networkId]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="pb-4 border-b border-[#DDD9CF]">
        <div className="text-xs font-bold text-[#D89B32] uppercase tracking-wider">
          Schedule Reliability
        </div>
        <h1 className="text-2xl font-black text-[#242521] tracking-tight mt-1">
          Where are schedule delays occurring?
        </h1>
        <p className="text-xs text-[#6E6E67] mt-0.5">
          Evaluate waiting times, bottlenecks, and on-time performance across transit lines.
        </p>
      </div>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center space-y-3 bg-[#FFFFFF] rounded-3xl border border-[#DDD9CF]">
          <div className="w-8 h-8 border-3 border-[#D89B32] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-[#6E6E67]">Calculating typical waiting delays...</p>
        </div>
      ) : delaysData ? (
        <>
          {/* Delay KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#DDD9CF] shadow-xs space-y-1">
              <div className="text-[#6E6E67] text-xs font-semibold uppercase flex items-center justify-between">
                <span>Average Waiting Delay</span>
                <Clock className="w-4 h-4 text-[#D89B32]" />
              </div>
              <div className="text-3xl font-black text-[#242521] font-mono">
                {formatMinutes(delaysData.system_avg_delay)}
              </div>
              <p className="text-xs text-[#6E6E67]">Average schedule delay across network</p>
            </div>

            <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#DDD9CF] shadow-xs space-y-1">
              <div className="text-[#6E6E67] text-xs font-semibold uppercase flex items-center justify-between">
                <span>Maximum Delay Spike</span>
                <AlertTriangle className="w-4 h-4 text-[#A86F18]" />
              </div>
              <div className="text-3xl font-black text-[#A86F18] font-mono">
                {formatMinutes(delaysData.system_max_delay)}
              </div>
              <p className="text-xs text-[#A86F18] font-medium">Recorded during temporary track delay</p>
            </div>

            <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#DDD9CF] shadow-xs space-y-1">
              <div className="text-[#6E6E67] text-xs font-semibold uppercase flex items-center justify-between">
                <span>On-Time Arrival Rate</span>
                <ShieldCheck className="w-4 h-4 text-[#5F8A63]" />
              </div>
              <div className="text-3xl font-black text-[#242521] font-mono">
                92.4%
              </div>
              <p className="text-xs text-[#6E6E67]">Trips arriving within 3 minutes of schedule</p>
            </div>
          </div>

          {/* Corridor Delay Rankings */}
          <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#DDD9CF] shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#242521]">
                Corridor Delay Ranking
              </h2>
              <p className="text-xs text-[#6E6E67]">
                Routes ordered from highest to lowest average schedule delay.
              </p>
            </div>

            <div className="space-y-2.5">
              {delaysData.route_rankings.map((rt, idx) => (
                <div
                  key={rt.route_id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#DDD9CF]"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-full bg-[#EEEAE0] text-[#242521] font-mono font-bold text-xs flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: rt.color_hex }}
                    ></span>
                    <span className="font-bold text-[#242521] text-xs">{rt.route_name}</span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-[#242521]">
                        {formatMinutes(rt.avg_delay)}
                      </span>
                      <span className="text-[10px] text-[#6E6E67] block">average delay</span>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        rt.avg_delay > 4.5
                          ? 'bg-[#FAECE9] text-[#782619] border border-[#ECC4BE]'
                          : rt.avg_delay > 3.0
                          ? 'bg-[#FAF3E5] text-[#7D5514] border border-[#EEDCB8]'
                          : 'bg-[#E9EFE9] text-[#243C35] border border-[#C5D6C5]'
                      }`}
                    >
                      Max: {rt.max_delay}m
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hourly Delay Trend & Top Delayed Stations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hourly Delay Trend */}
            <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#DDD9CF] shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#242521]">Average Delay by Hour of Day</h3>
                <p className="text-xs text-[#6E6E67]">
                  Delays rise slightly during morning and evening rush hours due to increased boarding times.
                </p>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={delaysData.hourly_delay_trend}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
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
                      unit="m"
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const d = payload[0].payload;
                          return (
                            <div className="bg-[#242621] text-white p-2.5 rounded-xl shadow-lg text-xs border border-[#2D302A]">
                              <div className="font-bold text-[#F2C66D]">{d.time}</div>
                              <div>Average Delay: <span className="font-bold">{d.avg_delay} min</span></div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="avg_delay"
                      stroke="#A86F18"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: '#A86F18' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Delayed Stations */}
            <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#DDD9CF] shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#242521]">Stations with Highest Delay</h3>
                <p className="text-xs text-[#6E6E67]">
                  Stations where boarding queues and train switching create more waiting time.
                </p>
              </div>

              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#DDD9CF]">
                {delaysData.station_rankings.map((st, i) => (
                  <div
                    key={st.station_id}
                    className="flex justify-between items-center p-2 rounded-xl bg-[#F7F5EF] text-xs border border-[#DDD9CF]"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[#6E6E67] text-[11px] w-4">#{i + 1}</span>
                      <span className="font-bold text-[#242521]">{st.station_name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-bold text-[#242521]">{formatMinutes(st.avg_delay)}</span>
                      <span className="text-[10px] text-[#6E6E67]">Peak: {st.max_delay}m</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
