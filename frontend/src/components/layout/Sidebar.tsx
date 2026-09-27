import React from 'react';
import {
  Compass,
  MapPin,
  Building2,
  GitFork,
  BarChart3,
  Clock,
  Sparkles,
  Database,
  Info,
  ChevronRight
} from 'lucide-react';
import { TransitNetwork } from '../../types/transit';

export type NavItemKey =
  | 'overview'
  | 'network'
  | 'stations'
  | 'routes'
  | 'demand'
  | 'delays'
  | 'insights'
  | 'data'
  | 'about';

interface SidebarProps {
  currentTab: NavItemKey;
  onSelectTab: (tab: NavItemKey) => void;
  systemSummary?: any;
  currentNetwork?: TransitNetwork | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, currentNetwork }) => {
  // Structured Section Groups as specified
  const navSections = [
    {
      label: 'EXPLORE',
      items: [
        { key: 'overview', label: 'Overview', icon: Compass },
        { key: 'network', label: 'Network', icon: MapPin },
        { key: 'stations', label: 'Stations', icon: Building2 },
        { key: 'routes', label: 'Routes', icon: GitFork },
      ]
    },
    {
      label: 'ANALYZE',
      items: [
        { key: 'demand', label: 'Demand', icon: BarChart3 },
        { key: 'delays', label: 'Delays', icon: Clock },
        { key: 'insights', label: 'Insights', icon: Sparkles },
      ]
    },
    {
      label: 'DATA',
      items: [
        { key: 'data', label: 'Data', icon: Database },
        { key: 'about', label: 'About', icon: Info },
      ]
    }
  ];

  return (
    <aside className="w-[270px] bg-[#242621] text-[#D8D8D0] flex flex-col justify-between shrink-0 h-screen border-r border-[rgba(255,255,255,0.08)] select-none shadow-2xl z-30 sticky top-0 font-sans">
      {/* ─── BRAND BLOCK ─── */}
      <div className="pt-6 pb-5 px-5 border-b border-[rgba(255,255,255,0.08)]">
        <div
          className="flex items-center space-x-3.5 cursor-pointer group"
          onClick={() => onSelectTab('overview')}
        >
          {/* Refined Geometric Amber Brand Mark */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
            style={{
              background: 'rgba(216, 155, 50, 0.15)',
              border: '1px solid rgba(216, 155, 50, 0.35)'
            }}
          >
            <span className="text-[#D89B32] font-black text-lg tracking-wider">TX</span>
          </div>
          <div>
            <div className="text-[21px] font-bold tracking-tight text-[#FFFFFF] leading-tight">
              TRANSITX
            </div>
            <p className="text-[12.5px] font-normal text-[#92958B] tracking-normal mt-0.5">
              India Mobility Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* ─── NAVIGATION SECTIONS ─── */}
      <nav className="flex-1 py-4 px-3.5 space-y-5 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#2D302A]">
        {navSections.map((section) => (
          <div key={section.label} className="space-y-1">
            {/* Small uppercase section label with 0.08em letter spacing */}
            <div className="px-3 pb-1.5 text-[10.5px] font-semibold text-[#92958B] tracking-[0.08em] uppercase">
              {section.label}
            </div>

            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.key;

              return (
                <button
                  key={item.key}
                  onClick={() => onSelectTab(item.key as NavItemKey)}
                  className={`w-full h-11 flex items-center justify-between px-3.5 rounded-lg text-[14px] font-medium transition-all duration-150 group text-left cursor-pointer ${
                    isActive
                      ? 'border-l-3 border-[#D89B32] bg-[rgba(216,155,50,0.12)] text-[#FFFFFF] font-semibold'
                      : 'text-[#D8D8D0] hover:bg-[rgba(216,155,50,0.08)] hover:text-[#FFFFFF] hover:translate-x-0.5'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <Icon
                      className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                        isActive
                          ? 'text-[#D89B32]'
                          : 'text-[#92958B] group-hover:text-[#D89B32]'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-[#D89B32] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ─── BOTTOM UTILITY STATUS AREA ─── */}
      <div className="p-4 px-5 border-t border-[rgba(255,255,255,0.08)] bg-[#1F211D]">
        <div className="bg-[#2D302A]/80 rounded-xl p-3 border border-[rgba(255,255,255,0.06)] flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <div className="text-[10px] text-[#92958B] uppercase font-bold tracking-[0.08em]">
              City Network
            </div>
            <div className="text-[13px] font-semibold text-[#FFFFFF] truncate mt-0.5">
              {currentNetwork?.city || 'Chennai'}
            </div>
            <div className="flex items-center space-x-1.5 mt-1 text-[11px] text-[#D8D8D0]">
              <span className="w-2 h-2 rounded-full bg-[#5F8A63] shrink-0"></span>
              <span>Network operational</span>
            </div>
          </div>
          <span className="text-[10.5px] font-mono text-[#D89B32] bg-[rgba(216,155,50,0.12)] border border-[rgba(216,155,50,0.25)] px-2 py-0.5 rounded-md shrink-0">
            {currentNetwork?.lines_count || 5} Lines
          </span>
        </div>
      </div>
    </aside>
  );
};
