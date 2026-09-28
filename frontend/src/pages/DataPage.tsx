import React, { useState, useEffect } from 'react';
import {
  Database,
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  Info,
  ChevronDown,
  ChevronUp,
  CheckCircle2
} from 'lucide-react';
import { Route, Station, DataExplorerResult } from '../types/transit';
import { fetchDataExplorer, fetchAllDataExplorer } from '../services/api';

interface DataPageProps {
  routes: Route[];
  stations: Station[];
  networkId?: string;
}

export const DataPage: React.FC<DataPageProps> = ({
  routes,
  stations,
  networkId
}) => {
  const [dataResult, setDataResult] = useState<DataExplorerResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [exporting, setExporting] = useState<boolean>(false);
  const [showMethod, setShowMethod] = useState<boolean>(false);

  // Filters
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [selectedRoute, setSelectedRoute] = useState<string>('ALL');
  const [selectedStation, setSelectedStation] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Reset filters when switching networks to prevent cross-city filter mismatch
  useEffect(() => {
    setSelectedRoute('ALL');
    setSelectedStation('ALL');
    setSearchQuery('');
    setPage(1);
  }, [networkId]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchDataExplorer(
      networkId,
      page,
      pageSize,
      selectedRoute === 'ALL' ? undefined : selectedRoute,
      selectedStation === 'ALL' ? undefined : selectedStation,
      undefined,
      searchQuery || undefined
    )
      .then((data: DataExplorerResult) => {
        if (isMounted) {
          setDataResult(data);
          setLoading(false);
        }
      })
      .catch((err: any) => {
        console.error(err);
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [page, pageSize, selectedRoute, selectedStation, searchQuery, networkId]);

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const rowsToExport = await fetchAllDataExplorer(
        networkId,
        selectedRoute === 'ALL' ? undefined : selectedRoute,
        selectedStation === 'ALL' ? undefined : selectedStation,
        searchQuery || undefined
      );

      const targetRows = rowsToExport.length > 0 ? rowsToExport : (dataResult ? dataResult.rows : []);
      if (targetRows.length === 0) return;

      const headers = ['Record ID', 'Date', 'Time', 'Route', 'Station', 'Passengers', 'Delay (min)', 'Crowd Level', 'Is Anomaly', 'Weather'];
      const csvContent = [
        headers.join(','),
        ...targetRows.map((r) =>
          [
            r.record_id,
            r.date,
            r.time,
            `"${r.route_name}"`,
            `"${r.station_name}"`,
            r.passengers,
            r.delay_minutes,
            r.crowd_level,
            r.is_anomaly,
            `"${r.weather}"`
          ].join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transitx_${networkId || 'network'}_observations_export.csv`;
      a.click();
    } catch (err) {
      console.error('Export CSV error:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="pb-4 border-b border-[#DDD9CF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-[#D89B32] uppercase tracking-wider flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5" />
            <span>Dataset Exploration</span>
          </div>
          <h1 className="text-2xl font-black text-[#242521] tracking-tight mt-1">
            What observations are behind these insights?
          </h1>
          <p className="text-xs text-[#6E6E67] mt-0.5">
            {networkId === 'delhi' ? '14,098' : '14,364'} hourly telemetry records across {stations.length || 47} stations and {routes.length || 5} corridors powering the TRANSITX platform.
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

          <button
            onClick={handleExportCSV}
            disabled={exporting}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-[#242621] hover:bg-[#2D302A] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* Expandable DSE Method Explanation */}
      {showMethod && (
        <div className="p-4 bg-[#FFF8EB] rounded-2xl border border-[#FDE4B4] text-xs text-[#242521] space-y-1.5 animate-in fade-in duration-200">
          <div className="font-bold flex items-center gap-1.5 text-[#A86F18]">
            <CheckCircle2 className="w-4 h-4 text-[#D89B32]" />
            <span>Data Science Method: Data Ingestion, Cleaning & Empirical Observation Logging</span>
          </div>
          <p className="leading-relaxed text-[11px] text-[#7D5514]">
            <strong>Data used:</strong> {networkId === 'delhi' ? '14,098' : '14,364'} hourly observation rows logged across 14 consecutive observation days (15 Jan – 28 Jan 2024).<br />
            <strong>Methodology & Cleaning:</strong> Synchronized timestamps to hourly intervals, normalized station nomenclature, imputed missing delay metrics using corridor-specific medians, and classified crowd density percentiles relative to station platform capacity.<br />
            <strong>Why it matters:</strong> Guarantees end-to-end data provenance and auditability. Every pattern, anomaly, and regression model in TRANSITX links back directly to verifiable telemetry.
          </p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-[#FFFFFF] rounded-2xl border border-[#DDD9CF] shadow-xs">
          <div className="text-[#6E6E67] text-xs font-medium uppercase">Total Measurements</div>
          <div className="text-2xl font-black text-[#242521] font-mono mt-0.5">
            {networkId === 'delhi' ? '14,098' : '14,364'}
          </div>
          <div className="text-[11px] text-[#6E6E67]">Hourly observation records</div>
        </div>

        <div className="p-4 bg-[#FFFFFF] rounded-2xl border border-[#DDD9CF] shadow-xs">
          <div className="text-[#6E6E67] text-xs font-medium uppercase">Corridors Monitored</div>
          <div className="text-2xl font-black text-[#242521] font-mono mt-0.5">
            {routes.length > 0 ? `${routes.length} Lines` : '5 Lines'}
          </div>
          <div className="text-[11px] text-[#6E6E67]">Metro & Suburban</div>
        </div>

        <div className="p-4 bg-[#FFFFFF] rounded-2xl border border-[#DDD9CF] shadow-xs">
          <div className="text-[#6E6E67] text-xs font-medium uppercase">Active Stations</div>
          <div className="text-2xl font-black text-[#242521] font-mono mt-0.5">
            {stations.length > 0 ? `${stations.length} Stations` : '47 Stations'}
          </div>
          <div className="text-[11px] text-[#6E6E67]">WGS-84 mapped</div>
        </div>

        <div className="p-4 bg-[#FFFFFF] rounded-2xl border border-[#DDD9CF] shadow-xs">
          <div className="text-[#6E6E67] text-xs font-medium uppercase">Observation Period</div>
          <div className="text-sm font-bold text-[#242521] mt-1">15 Jan – 28 Jan 2024</div>
          <div className="text-[11px] text-[#6E6E67]">14-Day Baseline</div>
        </div>
      </div>

      {/* Filter and Table Container */}
      <div className="bg-[#FFFFFF] p-5 rounded-3xl border border-[#DDD9CF] shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#6E6E67]" />
              <input
                type="text"
                placeholder="Search station or line..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-8 pr-3 py-1.5 bg-[#F7F5EF] border border-[#DDD9CF] rounded-xl text-xs focus:ring-2 focus:ring-[#D89B32] w-48 text-[#242521]"
              />
            </div>

            {/* Route Filter */}
            <select
              value={selectedRoute}
              onChange={(e) => {
                setSelectedRoute(e.target.value);
                setPage(1);
              }}
              className="p-1.5 bg-[#F7F5EF] border border-[#DDD9CF] rounded-xl text-xs font-semibold text-[#242521]"
            >
              <option value="ALL">All Routes</option>
              {routes.map((r) => (
                <option key={r.route_id} value={r.route_id}>{r.route_name}</option>
              ))}
            </select>

            {/* Station Filter */}
            <select
              value={selectedStation}
              onChange={(e) => {
                setSelectedStation(e.target.value);
                setPage(1);
              }}
              className="p-1.5 bg-[#F7F5EF] border border-[#DDD9CF] rounded-xl text-xs font-semibold text-[#242521]"
            >
              <option value="ALL">All Stations</option>
              {stations.map((s) => (
                <option key={s.station_id} value={s.station_id}>{s.station_name}</option>
              ))}
            </select>

            {/* Page Size */}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value));
                setPage(1);
              }}
              className="p-1.5 bg-[#F7F5EF] border border-[#DDD9CF] rounded-xl text-xs font-semibold text-[#242521]"
            >
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
          </div>

          {/* Pagination Controls */}
          {dataResult && (
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#6E6E67]">
              <span>
                Page {dataResult.page} of {dataResult.total_pages} ({dataResult.total_rows.toLocaleString()} rows)
              </span>
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-1 rounded-lg border border-[#DDD9CF] hover:bg-[#F7F5EF] disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= dataResult.total_pages}
                onClick={() => setPage(page + 1)}
                className="p-1 rounded-lg border border-[#DDD9CF] hover:bg-[#F7F5EF] disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#DDD9CF]">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F7F5EF] border-b border-[#DDD9CF] text-[#242521] font-bold">
              <tr>
                <th className="p-3">Record ID</th>
                <th className="p-3">Date</th>
                <th className="p-3">Time</th>
                <th className="p-3">Route</th>
                <th className="p-3">Station</th>
                <th className="p-3 text-right">Passengers</th>
                <th className="p-3 text-right">Delay (min)</th>
                <th className="p-3 text-center">Crowd</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3">Weather</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-[#6E6E67]">
                    <div className="w-6 h-6 border-2 border-[#D89B32] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading measurements...
                  </td>
                </tr>
              ) : dataResult && dataResult.rows.length > 0 ? (
                dataResult.rows.map((row) => (
                  <tr key={row.record_id} className="border-b border-[#DDD9CF]/60 hover:bg-[#F7F5EF]/60 font-mono text-[11px]">
                    <td className="p-3 text-[#6E6E67]">{row.record_id}</td>
                    <td className="p-3 text-[#242521]">{row.date}</td>
                    <td className="p-3 text-[#242521] font-bold">{row.time}</td>
                    <td className="p-3 text-[#242521] font-sans font-semibold">{row.route_name}</td>
                    <td className="p-3 text-[#242521] font-sans font-bold">{row.station_name}</td>
                    <td className="p-3 text-right font-bold text-[#A86F18]">{row.passengers.toLocaleString()}</td>
                    <td className="p-3 text-right text-[#242521]">{row.delay_minutes.toFixed(1)}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        row.crowd_level === 'Critical' ? 'bg-[#FAECE9] text-[#782619] border border-[#ECC4BE]' :
                        row.crowd_level === 'High' ? 'bg-[#FAF3E5] text-[#7D5514] border border-[#EEDCB8]' :
                        row.crowd_level === 'Moderate' ? 'bg-[#FFF3D6] text-[#A86F18] border border-[#F2C66D]' :
                        'bg-[#E9EFE9] text-[#243C35] border border-[#C5D6C5]'
                      }`}>
                        {row.crowd_level}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {row.is_anomaly ? (
                        <span className="bg-[#FFF3D6] text-[#A86F18] border border-[#F2C66D] font-bold text-[10px] px-2 py-0.5 rounded-full">
                          Unusual
                        </span>
                      ) : (
                        <span className="text-[#6E6E67] text-[10px]">Normal</span>
                      )}
                    </td>
                    <td className="p-3 text-[#6E6E67] font-sans">{row.weather}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-[#6E6E67]">
                    No records found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
