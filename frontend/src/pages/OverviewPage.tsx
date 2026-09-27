import React from 'react';
import {
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
  GitFork,
  Building2,
  AlertTriangle,
  Layers,
  ChevronRight,
  Check
} from 'lucide-react';
import { SystemSummary, TransitNetwork } from '../types/transit';
import { formatCompactNumber, formatExactNumber, formatMinutes } from '../utils/formatters';

interface OverviewPageProps {
  summary: SystemSummary | null;
  onNavigate: (tab: any, subTab?: string) => void;
  availableNetworks?: TransitNetwork[];
  selectedNetworkId?: string;
  onSelectNetwork?: (networkId: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  summary,
  onNavigate,
  availableNetworks = [],
  selectedNetworkId = 'chennai',
  onSelectNetwork
}) => {
  const currentNet = availableNetworks.find((n) => n.id === selectedNetworkId);

  const quickQuestions = [
    {
      question: 'Where is it busy?',
      description: 'See which stations have the highest crowds right now.',
      icon: Building2,
      tab: 'stations',
      badge: 'Crowded Stations',
      color: 'text-[#A86F18] bg-[#FFF3D6] border-[#F2C66D]'
    },
    {
      question: 'When is it busiest?',
      description: 'Discover the morning and evening rush hour peaks.',
      icon: Clock,
      tab: 'demand',
      badge: 'Peak Hours',
      color: 'text-[#A86F18] bg-[#FFF3D6] border-[#F2C66D]'
    },
    {
      question: 'Which routes are busiest?',
      description: `Compare passenger volume across the ${summary?.total_routes || 5} transit lines.`,
      icon: GitFork,
      tab: 'routes',
      badge: 'Corridor Load',
      color: 'text-[#242521] bg-[#EEEAE0] border-[#DDD9CF]'
    },
    {
      question: 'Where are delays high?',
      description: 'Check average waiting times and schedule delays.',
      icon: Clock,
      tab: 'delays',
      badge: 'Waiting Times',
      color: 'text-[#A86F18] bg-[#FFF3D6] border-[#F2C66D]'
    },
    {
      question: 'What looks unusual?',
      description: 'Spot stations with passenger numbers higher than normal.',
      icon: AlertTriangle,
      tab: 'insights',
      subTab: 'anomalies',
      badge: 'Unusual Demand',
      color: 'text-[#A86F18] bg-[#FFF3D6] border-[#F2C66D]'
    },
    {
      question: 'Which routes are similar?',
      description: 'Find corridors that share similar passenger patterns.',
      icon: Sparkles,
      tab: 'insights',
      subTab: 'similarity',
      badge: 'Similar Corridors',
      color: 'text-[#242521] bg-[#EEEAE0] border-[#DDD9CF]'
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-9 animate-in fade-in duration-300">
      {/* Hero Banner: India-Wide Living Transit Platform */}
      <div className="bg-[#FFFFFF] rounded-3xl p-8 sm:p-10 border border-[#DDD9CF] shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D89B32]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="max-w-3xl space-y-5 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FFF3D6] border border-[#F2C66D] text-[#A86F18] text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-[#D89B32]"></span>
              <span>India Public Transportation Platform</span>
            </div>

            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#EEEAE0] border border-[#DDD9CF] text-[#242521] text-xs font-semibold">
              <MapPin className="w-3 h-3 text-[#6E6E67]" />
              <span>{currentNet?.city || 'India'}</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-[#242521] tracking-tight leading-tight">
            See how India moves.
          </h1>

          <p className="text-base sm:text-lg text-[#6E6E67] leading-relaxed font-normal">
            Explore passenger demand, station occupancy, corridor velocity, and operational delays
            across India's largest rapid transit networks in interactive 3D.
          </p>

          {/* Quick Network Selector Switch in Hero */}
          <div className="pt-1">
            <div className="text-xs font-bold text-[#6E6E67] uppercase tracking-wider mb-2">
              Select Indian Transit Network:
            </div>
            <div className="flex flex-wrap gap-2.5">
              {availableNetworks.map((net) => {
                const isSelected = net.id === selectedNetworkId;
                return (
                  <button
                    key={net.id}
                    onClick={() => onSelectNetwork && onSelectNetwork(net.id)}
                    className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#242621] text-[#FFFFFF] border-[#242621] shadow-md'
                        : 'bg-[#FFFFFF] hover:bg-[#F7F5EF] text-[#242521] border-[#DDD9CF]'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: net.color }}
                    ></span>
                    <span>{net.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#E7AE45] ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('network')}
              className="inline-flex items-center space-x-2.5 px-6 py-3.5 bg-[#D89B32] hover:bg-[#E7AE45] text-[#242521] rounded-xl text-sm font-bold shadow-lg shadow-[#D89B32]/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Explore 3D Living Network</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('insights')}
              className="inline-flex items-center space-x-2 px-5 py-3.5 bg-[#FFFFFF] hover:bg-[#F7F5EF] text-[#242521] border border-[#DDD9CF] rounded-xl text-sm font-semibold transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#A86F18]" />
              <span>See Operational Patterns</span>
            </button>
          </div>
        </div>
      </div>

      {/* Snapshot Summary Metrics with Human-Readable Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          title={`${summary ? formatExactNumber(summary.total_ridership) : '---'} total passenger journeys analyzed`}
          className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#DDD9CF] shadow-xs space-y-1.5 cursor-help"
        >
          <div className="flex items-center justify-between text-[#6E6E67] text-xs font-semibold uppercase tracking-wider">
            <span>Total Ridership</span>
            <TrendingUp className="w-4 h-4 text-[#D89B32]" />
          </div>
          <div className="text-3xl font-black text-[#242521] tracking-tight">
            {summary ? formatCompactNumber(summary.total_ridership) : '12.8M'}
          </div>
          <p className="text-xs text-[#6E6E67] font-medium">
            {summary ? `~${formatCompactNumber(summary.daily_average_ridership)} daily passengers` : 'Daily average'}
          </p>
        </div>

        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#DDD9CF] shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-[#6E6E67] text-xs font-semibold uppercase tracking-wider">
            <span>Busiest Travel Time</span>
            <Clock className="w-4 h-4 text-[#D89B32]" />
          </div>
          <div className="text-3xl font-black text-[#242521] tracking-tight">
            {summary ? summary.system_peak_hour : '09:00 AM'}
          </div>
          <p className="text-xs text-[#A86F18] font-medium">
            Rush hour commuter surge
          </p>
        </div>

        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#DDD9CF] shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-[#6E6E67] text-xs font-semibold uppercase tracking-wider">
            <span>Typical Waiting Delay</span>
            <Clock className="w-4 h-4 text-[#A86F18]" />
          </div>
          <div className="text-3xl font-black text-[#242521] tracking-tight">
            {summary ? formatMinutes(summary.system_avg_delay_min) : '2.2 min'}
          </div>
          <p className="text-xs text-[#6E6E67] font-medium">
            Schedule delay variance
          </p>
        </div>

        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#DDD9CF] shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-[#6E6E67] text-xs font-semibold uppercase tracking-wider">
            <span>Busiest Station</span>
            <MapPin className="w-4 h-4 text-[#D89B32]" />
          </div>
          <div className="text-xl font-bold text-[#242521] truncate">
            {summary ? summary.busiest_station : 'Central Hub'}
          </div>
          <p className="text-xs text-[#6E6E67] font-medium truncate">
            {currentNet?.city || 'City'} primary interchange hub
          </p>
        </div>
      </div>

      {/* "WHAT DO YOU WANT TO KNOW?" Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#242521] tracking-tight">
            What do you want to know?
          </h2>
          <p className="text-xs text-[#6E6E67] mt-0.5">
            Select a question to jump directly to the relevant view.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickQuestions.map((q) => {
            const Icon = q.icon;
            return (
              <div
                key={q.question}
                onClick={() => onNavigate(q.tab, q.subTab)}
                className="group p-5 bg-[#FFFFFF] rounded-2xl border border-[#DDD9CF] hover:border-[#D89B32] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className={`p-2.5 rounded-xl border ${q.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#6E6E67] group-hover:text-[#A86F18] flex items-center gap-0.5 transition-colors">
                    Explore <ChevronRight className="w-3 h-3" />
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#242521] group-hover:text-[#A86F18] transition-colors">
                    {q.question}
                  </h3>
                  <p className="text-xs text-[#6E6E67] mt-1 leading-relaxed">
                    {q.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Network Corridors Quick Access Bar */}
      <div className="bg-[#242621] text-white rounded-3xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-lg border border-[#2D302A]">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#D89B32] uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Interactive 3D Transit Corridors</span>
          </div>
          <h3 className="text-lg font-bold text-white">
            {summary?.total_routes || 5} Major Lines Serving {summary?.total_stations || 47} Stations
          </h3>
          <p className="text-xs text-[#D8D8D0] max-w-xl">
            {currentNet?.description || 'Active rapid transit corridors with 3D elevations, live simulated vehicles, and passenger density particles.'}
          </p>
        </div>

        <button
          onClick={() => onNavigate('network')}
          className="px-5 py-3 bg-[#D89B32] hover:bg-[#E7AE45] text-[#242521] rounded-xl text-xs font-bold transition-all shadow-md shrink-0 flex items-center justify-center space-x-2 cursor-pointer"
        >
          <span>Open 3D Live Map</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
