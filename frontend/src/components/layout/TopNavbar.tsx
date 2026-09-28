import React, { useState } from 'react';
import {
  Map,
  Building2,
  GitFork,
  Clock,
  AlertTriangle,
  Sparkles,
  Database,
  Info,
  Calendar,
  Activity,
  Users,
  Menu,
  X,
  Home
} from 'lucide-react';
import { TransitNetwork } from '../../types/transit';
import { formatCompactNumber, formatExactNumber } from '../../utils/formatters';

export type TabKey = 'landing' | 'network' | 'stations' | 'routes' | 'demand' | 'delays' | 'insights' | 'data' | 'about';

interface TopNavbarProps {
  currentTab: TabKey;
  onSelectTab: (tab: TabKey, subTab?: string) => void;
  onReturnToHome: () => void;
  currentDate?: string;
  currentHour?: number;
  activeLineCount?: number;
  totalRecords?: number;
  availableNetworks?: TransitNetwork[];
  selectedNetworkId?: string;
  onSelectNetwork?: (networkId: string) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentTab,
  onSelectTab,
  onReturnToHome,
  currentDate = '2024-01-15',
  currentHour = 9,
  activeLineCount = 5,
  totalRecords = 14364,
  availableNetworks = [],
  selectedNetworkId = 'chennai',
  onSelectNetwork
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: 'network', label: 'Network', icon: Map },
    { key: 'stations', label: 'Stations', icon: Building2 },
    { key: 'routes', label: 'Routes', icon: GitFork },
    { key: 'demand', label: 'Demand', icon: Clock },
    { key: 'delays', label: 'Delays', icon: AlertTriangle },
    { key: 'insights', label: 'Insights', icon: Sparkles },
    { key: 'data', label: 'Data', icon: Database },
    { key: 'about', label: 'About', icon: Info }
  ];

  return (
    <header className="h-14 bg-[#FFFFFF] border-b border-[#DDD9CF] px-4 lg:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-xs font-sans">
      {/* LEFT: Logo & Landing Return & City Switcher */}
      <div className="flex items-center space-x-3 shrink-0">
        <button
          onClick={onReturnToHome}
          className="flex items-center space-x-2 cursor-pointer group text-left"
          title="Return to Landing Page"
        >
          <div className="w-6 h-6 rounded-lg bg-[#D89B32] flex items-center justify-center text-[#242521] shadow-xs group-hover:bg-[#E7AE45] transition-colors">
            <span className="font-black text-xs">TX</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-sm font-black tracking-tight text-[#242521]">TRANSITX</span>
            <span className="hidden sm:inline-block text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-[#242621] text-[#FFF3D6]">
              India
            </span>
          </div>
        </button>

        <span className="text-[#DDD9CF]">/</span>

        {/* City Network Switcher (Compact) */}
        <div className="flex items-center bg-[#F7F5EF] p-0.5 rounded-lg border border-[#DDD9CF]">
          {availableNetworks.map((net) => {
            const isSelected = net.id === selectedNetworkId;
            return (
              <button
                key={net.id}
                onClick={() => onSelectNetwork && onSelectNetwork(net.id)}
                className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
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

      {/* CENTER: Navigation Links (Desktop) */}
      <nav className="hidden lg:flex items-center space-x-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onSelectTab(item.key)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#D89B32] text-[#242521] shadow-xs'
                  : 'text-[#6E6E67] hover:text-[#242521] hover:bg-[#F7F5EF]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#242521]' : 'text-[#6E6E67]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* RIGHT: Operational Telemetry & Home Button */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        {/* Operational Time Indicator */}
        <div className="flex items-center space-x-1.5 bg-[#FFF8EB] border border-[#FDE4B4] px-2.5 py-1 rounded-lg text-xs font-bold text-[#A86F18]">
          <Clock className="w-3.5 h-3.5 text-[#D89B32]" />
          <span className="font-mono text-[#242521]">{`${currentHour.toString().padStart(2, '0')}:00`}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#D89B32] animate-pulse"></span>
        </div>

        {/* Active Lines Status */}
        <div className="hidden sm:flex items-center space-x-1.5 bg-[#F2F7F3] border border-[#CCE0CE] px-2.5 py-1 rounded-lg text-[11px] font-semibold text-[#3E6642]">
          <Activity className="w-3 h-3 text-[#5F8A63]" />
          <span>{activeLineCount} Lines</span>
        </div>

        {/* Back to Hero Landing Page Button */}
        <button
          onClick={onReturnToHome}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-[#DDD9CF] bg-[#F7F5EF] hover:bg-[#EEEAE0] text-xs font-semibold text-[#242521] transition-all cursor-pointer"
          title="Return to Overview / Landing Page"
        >
          <Home className="w-3.5 h-3.5 text-[#6E6E67]" />
          <span className="hidden md:inline">Hero</span>
        </button>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-1.5 rounded-lg border border-[#DDD9CF] text-[#242521] hover:bg-[#F7F5EF] cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-14 left-0 right-0 bg-[#FFFFFF] border-b border-[#DDD9CF] p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  onSelectTab(item.key);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#D89B32] text-[#242521]'
                    : 'text-[#6E6E67] hover:bg-[#F7F5EF] text-left'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
