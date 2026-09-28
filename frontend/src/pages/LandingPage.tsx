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
  Database,
  CheckCircle2,
  Brain,
  ShieldCheck,
  ChevronDown,
  Navigation,
  Compass,
  Activity,
  BarChart3,
  Search,
  BookOpen
} from 'lucide-react';
import { Route, Station, SystemSummary, TransitNetwork } from '../types/transit';
import { formatCompactNumber, formatExactNumber } from '../utils/formatters';
import { HeroLivingScene } from '../components/maps/HeroLivingScene';

interface LandingPageProps {
  summary: SystemSummary | null;
  routes: Route[];
  stations: Station[];
  availableNetworks: TransitNetwork[];
  selectedNetworkId: string;
  onSelectNetwork: (networkId: string) => void;
  onExploreNetwork: () => void;
  onNavigateToTab: (tab: any, subTab?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  summary,
  routes,
  stations,
  availableNetworks,
  selectedNetworkId,
  onSelectNetwork,
  onExploreNetwork,
  onNavigateToTab
}) => {
  const currentNet = availableNetworks.find((n) => n.id === selectedNetworkId) || availableNetworks[0];

  const supportingQuestions = [
    {
      question: 'Where is the city busiest?',
      description: 'Discover the busiest transit hubs and crowding across the network.',
      icon: Building2,
      tab: 'stations',
      badge: 'Busiest Hubs'
    },
    {
      question: 'Which routes carry the most passengers?',
      description: 'Compare volume, frequency, and stop density across transit corridors.',
      icon: GitFork,
      tab: 'routes',
      badge: 'Corridor Load'
    },
    {
      question: 'When does demand peak?',
      description: 'Track how passenger demand surges during morning and evening rush hours.',
      icon: Clock,
      tab: 'demand',
      badge: 'Peak Surges'
    },
    {
      question: 'Where do delays happen?',
      description: 'Find bottleneck stations and evaluate typical waiting time reliability.',
      icon: AlertTriangle,
      tab: 'delays',
      badge: 'Schedule Delays'
    },
    {
      question: 'Which routes behave similarly?',
      description: 'Find corridors that share similar passenger numbers and operational rhythms.',
      icon: Brain,
      tab: 'insights',
      subTab: 'similarity',
      badge: 'Route Similarity'
    },
    {
      question: "What's unusual?",
      description: 'Detect statistical demand spikes that deviate from typical hourly baselines.',
      icon: Sparkles,
      tab: 'insights',
      subTab: 'anomalies',
      badge: 'Statistical Outliers'
    }
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'DATA',
      desc: 'Transportation observations are collected from routes and stations.',
      method: 'Multi-corridor transit telemetry & 14-day observation records',
      icon: Database
    },
    {
      step: '02',
      title: 'CLEAN',
      desc: 'The data is checked and prepared before analysis.',
      method: 'Corridor median imputation & date validation',
      icon: CheckCircle2
    },
    {
      step: '03',
      title: 'EXPLORE',
      desc: 'We look for patterns in passengers, time and delays.',
      method: 'Descriptive stats, distributions & diurnal hourly curves',
      icon: Search
    },
    {
      step: '04',
      title: 'ANALYZE',
      desc: 'Statistics and machine learning help us understand those patterns.',
      method: 'Linear regression, Pearson correlation & Welch’s t-test',
      icon: BarChart3
    },
    {
      step: '05',
      title: 'FIND PATTERNS',
      desc: 'Unusual behaviour and similar routes are identified.',
      method: 'Z-score anomaly detection & K-Means clustering',
      icon: Brain
    },
    {
      step: '06',
      title: 'EXPLAIN',
      desc: 'The results are converted into simple insights.',
      method: 'Transparent, plain-language summaries & ethical disclosures',
      icon: BookOpen
    }
  ];

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const observationCount = selectedNetworkId === 'delhi' ? 14098 : 14364;

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#242521] selection:bg-[#FFF3D6] selection:text-[#A86F18] font-sans">
      {/* Top Hero Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#DDD9CF] px-6 lg:px-12 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-3.5">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D89B32]"></span>
            <span className="text-lg font-black tracking-tight text-[#242521]">TRANSITX</span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#242621] text-[#FFF3D6]">
              Intelligence
            </span>
          </div>

          <span className="text-[#DDD9CF]">/</span>

          {/* Quick City Switcher */}
          <div className="flex items-center bg-[#F7F5EF] p-0.5 rounded-xl border border-[#DDD9CF]">
            {availableNetworks.map((net) => {
              const isSelected = net.id === selectedNetworkId;
              return (
                <button
                  key={net.id}
                  onClick={() => onSelectNetwork(net.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#D89B32] text-[#242521] font-bold shadow-xs'
                      : 'text-[#6E6E67] hover:text-[#242521]'
                  }`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: isSelected ? '#242521' : '#D89B32' }}
                  ></span>
                  <span>{net.city}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center / Right Links & CTA */}
        <div className="flex items-center space-x-4">
          <button
            onClick={scrollToHowItWorks}
            className="hidden md:inline-flex text-xs font-bold text-[#6E6E67] hover:text-[#242521] transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => onNavigateToTab('about')}
            className="hidden sm:inline-flex text-xs font-bold text-[#6E6E67] hover:text-[#242521] transition-colors cursor-pointer"
          >
            Methodology
          </button>

          <button
            onClick={onExploreNetwork}
            className="flex items-center space-x-2 px-4 py-2 bg-[#D89B32] hover:bg-[#E7AE45] text-[#242521] rounded-xl text-xs font-extrabold shadow-md shadow-[#D89B32]/25 transition-all cursor-pointer"
          >
            <span>Explore the Network</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Hero Container */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 pb-16 space-y-16">
        
        {/* HERO TOP HEADLINE & CTA */}
        <div className="text-center max-w-4xl mx-auto space-y-5 pt-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#FFF3D6] border border-[#F2C66D] text-[#A86F18] text-xs font-bold shadow-xs animate-in fade-in duration-300">
            <span className="w-2 h-2 rounded-full bg-[#D89B32] animate-pulse"></span>
            <span>PUBLIC TRANSPORT • DATA • CITY MOVEMENT • INTELLIGENCE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#242521] tracking-tight leading-[1.08]">
            SEE HOW THE CITY MOVES.
          </h1>

          <p className="text-base sm:text-lg text-[#6E6E67] max-w-2xl mx-auto leading-relaxed font-medium">
            Explore passenger demand, busy stations, route patterns, delays and unusual transportation behaviour through data.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onExploreNetwork}
              className="flex items-center space-x-2.5 px-6 py-3.5 bg-[#D89B32] hover:bg-[#E7AE45] text-[#242521] text-sm font-extrabold rounded-2xl shadow-lg shadow-[#D89B32]/30 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Explore the Network</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={scrollToHowItWorks}
              className="flex items-center space-x-2 px-5 py-3.5 bg-[#FFFFFF] hover:bg-[#F7F5EF] text-[#242521] border border-[#DDD9CF] text-sm font-bold rounded-2xl transition-all shadow-xs cursor-pointer"
            >
              <span>See How It Works</span>
              <ChevronDown className="w-4 h-4 text-[#6E6E67]" />
            </button>
          </div>
        </div>

        {/* HERO CENTERPIECE: LIVING CITY TRANSPORTATION VISUAL */}
        <div className="space-y-3">
          <HeroLivingScene
            routes={routes}
            stations={stations}
            networkName={currentNet.name}
            cityName={currentNet.city}
            onExplore={onExploreNetwork}
          />
          <div className="flex items-center justify-between text-xs text-[#6E6E67] px-2">
            <span>Living simulation showing actual transit geometry and passenger rhythm</span>
            <span className="font-mono text-[#A86F18] font-bold">WGS-84 Mapped Corridors</span>
          </div>
        </div>

        {/* PART 6: LIVE DATA PREVIEW SUMMARY FROM ACTUAL DATASET */}
        <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border border-[#DDD9CF] shadow-xs">
          <div className="text-center mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#A86F18]">
              Ground-Truth Foundation
            </span>
            <h2 className="text-lg font-black text-[#242521] mt-0.5">
              Verified Operational Dataset ({currentNet.city})
            </h2>
            <p className="text-xs text-[#6E6E67] mt-0.5">
              Derived directly from station tap logs, corridor sensors, and scheduled headway telemetry.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div className="p-5 rounded-2xl bg-[#F7F5EF] border border-[#DDD9CF]">
              <div className="text-3xl sm:text-4xl font-black text-[#242521] font-mono">
                {routes.length || 5}
              </div>
              <div className="text-xs font-bold text-[#242521] uppercase tracking-wider mt-1">
                Transit Lines
              </div>
              <div className="text-[11px] text-[#6E6E67] mt-0.5">Metro & suburban corridors</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F7F5EF] border border-[#DDD9CF]">
              <div className="text-3xl sm:text-4xl font-black text-[#242521] font-mono">
                {stations.length || 47}
              </div>
              <div className="text-xs font-bold text-[#242521] uppercase tracking-wider mt-1">
                Stations
              </div>
              <div className="text-[11px] text-[#6E6E67] mt-0.5">Geo-referenced nodes</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F7F5EF] border border-[#DDD9CF]">
              <div className="text-3xl sm:text-4xl font-black text-[#242521] font-mono">
                {formatExactNumber(observationCount)}
              </div>
              <div className="text-xs font-bold text-[#242521] uppercase tracking-wider mt-1">
                Observations
              </div>
              <div className="text-[11px] text-[#6E6E67] mt-0.5">Hourly telemetry records</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F7F5EF] border border-[#DDD9CF]">
              <div className="text-3xl sm:text-4xl font-black text-[#242521] font-mono">
                14 Days
              </div>
              <div className="text-xs font-bold text-[#242521] uppercase tracking-wider mt-1">
                Recorded Data
              </div>
              <div className="text-[11px] text-[#6E6E67] mt-0.5">15 Jan – 28 Jan 2024</div>
            </div>
          </div>
        </div>

        {/* PART 5: CORE ANALYTICAL QUESTIONS (Within 10 Seconds Understanding) */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D89B32]">
              Interactive Investigation
            </span>
            <h2 className="text-2xl font-black text-[#242521] tracking-tight">
              Six Questions Solved by TRANSITX
            </h2>
            <p className="text-xs text-[#6E6E67]">
              Click any question to jump directly into the full analytical investigation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {supportingQuestions.map((q, idx) => {
              const Icon = q.icon;
              return (
                <div
                  key={idx}
                  onClick={() => onNavigateToTab(q.tab, q.subTab)}
                  className="group bg-[#FFFFFF] p-6 rounded-3xl border border-[#DDD9CF] shadow-xs hover:border-[#D89B32] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-2xl bg-[#FFF3D6] text-[#A86F18]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F7F5EF] text-[#6E6E67] border border-[#DDD9CF]">
                        {q.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-[#242521] group-hover:text-[#A86F18] transition-colors">
                        {q.question}
                      </h3>
                      <p className="text-xs text-[#6E6E67] mt-1 leading-relaxed">
                        {q.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 text-xs font-bold text-[#A86F18] group-hover:translate-x-1 transition-transform">
                    <span>Inspect data</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PART 7: "HOW TRANSITX WORKS" PIPELINE SECTION */}
        <section id="how-it-works" className="space-y-8 scroll-mt-20 pt-6">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#A86F18]">
              Methodological Rigor
            </span>
            <h2 className="text-2xl font-black text-[#242521] tracking-tight">
              HOW TRANSITX WORKS
            </h2>
            <p className="text-xs text-[#6E6E67]">
              From raw telemetry feeds to actionable, understandable mobility intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {workflowSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#DDD9CF] shadow-xs space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#DDD9CF]/60">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-xl bg-[#FFF3D6] text-[#A86F18] flex items-center justify-center font-mono font-bold text-xs">
                        {step.step}
                      </div>
                      <h3 className="text-sm font-black text-[#242521] tracking-wide">
                        {step.title}
                      </h3>
                    </div>
                    <Icon className="w-4 h-4 text-[#D89B32]" />
                  </div>

                  <p className="text-xs font-semibold text-[#242521] leading-relaxed">
                    {step.desc}
                  </p>

                  <div className="p-2.5 rounded-xl bg-[#F7F5EF] border border-[#DDD9CF]/80 text-[11px] text-[#6E6E67]">
                    <span className="font-bold text-[#A86F18] block mb-0.5">DSE Implementation:</span>
                    {step.method}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* BOTTOM FINAL LAUNCH CTA BANNER */}
        <div className="bg-[#242621] text-white p-8 sm:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-[#2D302A]">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#F2C66D]">
              <Sparkles className="w-4 h-4 text-[#D89B32]" />
              <span>Full Interactive Platform Ready</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#FFFFFF]">
              Experience Public Transport Intelligence
            </h2>
            <p className="text-xs sm:text-sm text-[#D8D8D0] leading-relaxed">
              Interact with the 3D living city map, explore rush hour peaks, diagnose schedule delay bottlenecks, and inspect 14,364 verified observation records.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onExploreNetwork}
              className="flex items-center justify-center space-x-2 px-6 py-3.5 bg-[#D89B32] hover:bg-[#E7AE45] text-[#242521] rounded-2xl text-sm font-extrabold shadow-lg shadow-[#D89B32]/30 transition-all cursor-pointer"
            >
              <span>Explore the Network</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer info */}
        <footer className="pt-8 border-t border-[#DDD9CF] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6E6E67]">
          <div>
            <span className="font-bold text-[#242521]">TRANSITX</span> • Data Science Engineering Platform
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#5F8A63]" />
              <span>Aggregated Hourly Telemetry • Privacy Protected</span>
            </span>
          </div>
        </footer>

      </main>
    </div>
  );
};
