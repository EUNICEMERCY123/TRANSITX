import React, { useState, useEffect } from 'react';
import { TopNavbar, TabKey } from './components/layout/TopNavbar';
import { LandingPage } from './pages/LandingPage';
import { NetworkPage } from './pages/NetworkPage';
import { StationsPage } from './pages/StationsPage';
import { RoutesPage } from './pages/RoutesPage';
import { DemandPage } from './pages/DemandPage';
import { DelaysPage } from './pages/DelaysPage';
import { InsightsPage } from './pages/InsightsPage';
import { DataPage } from './pages/DataPage';
import { AboutPage } from './pages/AboutPage';
import {
  fetchNetworks,
  fetchSystemSummary,
  fetchRoutes,
  fetchStations,
  fetchNetworkSnapshot
} from './services/api';
import { Route, Station, SystemSummary, NetworkSnapshot, TransitNetwork } from './types/transit';
import {
  FALLBACK_NETWORKS,
  FALLBACK_SUMMARIES,
  FALLBACK_CHENNAI_ROUTES,
  FALLBACK_CHENNAI_STATIONS,
  getFallbackSnapshot
} from './data/fallbackData';

export const App: React.FC = () => {
  // Navigation & View Mode: 'landing' or 'app'
  const [viewMode, setViewMode] = useState<'landing' | 'app'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      const validAppTabs = ['network', 'stations', 'routes', 'demand', 'delays', 'insights', 'data', 'about'];
      if (validAppTabs.includes(hash)) return 'app';
    }
    return 'landing';
  });

  const [currentTab, setCurrentTab] = useState<TabKey>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '') as TabKey;
      const validTabs: TabKey[] = ['network', 'stations', 'routes', 'demand', 'delays', 'insights', 'data', 'about'];
      if (validTabs.includes(hash)) return hash;
    }
    return 'network';
  });

  const [currentSubTab, setCurrentSubTab] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<string>('2024-01-15');
  const [selectedHour, setSelectedHour] = useState<number>(9);
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);

  // Multi-Network State (initialized with verified registry)
  const [networks, setNetworks] = useState<TransitNetwork[]>(FALLBACK_NETWORKS);
  const [selectedNetworkId, setSelectedNetworkId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const net = new URLSearchParams(window.location.search).get('network');
      if (net) return net;
    }
    return 'chennai';
  });

  // Core Data States (hydrated with real baseline data to guarantee immediate visualization)
  const [summary, setSummary] = useState<SystemSummary | null>(() => FALLBACK_SUMMARIES['chennai'] || null);
  const [routes, setRoutes] = useState<Route[]>(FALLBACK_CHENNAI_ROUTES);
  const [stations, setStations] = useState<Station[]>(FALLBACK_CHENNAI_STATIONS);
  const [snapshot, setSnapshot] = useState<NetworkSnapshot | null>(() => getFallbackSnapshot('chennai', '2024-01-15', 9));
  const [loading, setLoading] = useState<boolean>(false);

  // Load available transit networks on mount
  useEffect(() => {
    let isMounted = true;
    fetchNetworks()
      .then((data) => {
        if (isMounted && data.length > 0) {
          setNetworks(data);
        }
      })
      .catch((err) => console.error('Error fetching networks:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  // Reload network-specific data when selectedNetworkId changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      fetchSystemSummary(selectedNetworkId).then((d) => isMounted && setSummary(d)),
      fetchRoutes(selectedNetworkId).then((d) => isMounted && setRoutes(d)),
      fetchStations(selectedNetworkId).then((d) => isMounted && setStations(d)),
      fetchNetworkSnapshot(selectedNetworkId, selectedDate, selectedHour).then((d) => isMounted && setSnapshot(d))
    ])
      .catch((err) => console.error('Error fetching network data:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedNetworkId]);

  // Update snapshot when date or hour changes
  useEffect(() => {
    let isMounted = true;
    fetchNetworkSnapshot(selectedNetworkId, selectedDate, selectedHour)
      .then((d) => {
        if (isMounted) setSnapshot(d);
      })
      .catch((err) => console.error('Error updating network snapshot:', err));

    return () => {
      isMounted = false;
    };
  }, [selectedNetworkId, selectedDate, selectedHour]);

  // Navigate to Station detail from map
  const handleViewStationInsights = (stationId: string) => {
    setSelectedStationId(stationId);
    setCurrentTab('stations');
    if (typeof window !== 'undefined') window.location.hash = 'stations';
  };

  const handleNavigateToTab = (tab: TabKey, subTab?: string) => {
    setViewMode('app');
    setCurrentTab(tab);
    setCurrentSubTab(subTab);
    if (typeof window !== 'undefined') window.location.hash = tab;
  };

  const handleExploreNetwork = () => {
    setViewMode('app');
    setCurrentTab('network');
    setCurrentSubTab(undefined);
    if (typeof window !== 'undefined') window.location.hash = 'network';
  };

  const handleReturnToHome = () => {
    setViewMode('landing');
    if (typeof window !== 'undefined') window.location.hash = '';
  };

  const currentNetwork = networks.find((n) => n.id === selectedNetworkId) || null;
  const currentStations = snapshot ? snapshot.stations : stations;
  const currentRoutes = snapshot ? snapshot.routes : routes;

  // Render the Hero Landing Page
  if (viewMode === 'landing') {
    return (
      <LandingPage
        summary={summary}
        routes={currentRoutes}
        stations={currentStations}
        availableNetworks={networks}
        selectedNetworkId={selectedNetworkId}
        onSelectNetwork={(id) => {
          setSelectedNetworkId(id);
          setSelectedStationId(null);
        }}
        onExploreNetwork={handleExploreNetwork}
        onNavigateToTab={handleNavigateToTab}
      />
    );
  }

  // Render Main Application
  const renderAppContent = () => {
    switch (currentTab) {
      case 'network':
        return (
          <NetworkPage
            routes={currentRoutes}
            stations={currentStations}
            selectedHour={selectedHour}
            onHourChange={(h) => setSelectedHour(h)}
            selectedStationId={selectedStationId}
            onSelectStation={(sid) => setSelectedStationId(sid)}
            onViewStationInsights={handleViewStationInsights}
            currentNetwork={currentNetwork}
          />
        );
      case 'stations':
        return (
          <StationsPage
            stations={currentStations}
            initialStationId={selectedStationId}
            networkId={selectedNetworkId}
          />
        );
      case 'routes':
        return (
          <RoutesPage
            routes={currentRoutes}
            networkId={selectedNetworkId}
          />
        );
      case 'demand':
        return (
          <DemandPage
            routes={currentRoutes}
            stations={currentStations}
            networkId={selectedNetworkId}
          />
        );
      case 'delays':
        return (
          <DelaysPage
            networkId={selectedNetworkId}
          />
        );
      case 'insights':
        return (
          <InsightsPage
            initialSubTab={currentSubTab}
            networkId={selectedNetworkId}
            routes={currentRoutes}
          />
        );
      case 'data':
        return (
          <DataPage
            routes={currentRoutes}
            stations={currentStations}
            networkId={selectedNetworkId}
          />
        );
      case 'about':
        return <AboutPage />;
      default:
        return (
          <NetworkPage
            routes={currentRoutes}
            stations={currentStations}
            selectedHour={selectedHour}
            onHourChange={(h) => setSelectedHour(h)}
            selectedStationId={selectedStationId}
            onSelectStation={(sid) => setSelectedStationId(sid)}
            onViewStationInsights={handleViewStationInsights}
            currentNetwork={currentNetwork}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#F7F5EF] text-[#242521] font-sans">
      {/* Sleek Top Navigation Bar (replaces the vertical sidebar) */}
      <TopNavbar
        currentTab={currentTab}
        onSelectTab={(tab, subTab) => handleNavigateToTab(tab, subTab)}
        onReturnToHome={handleReturnToHome}
        currentDate={selectedDate}
        currentHour={selectedHour}
        activeLineCount={routes.length}
        totalRecords={selectedNetworkId === 'delhi' ? 14098 : 14364}
        availableNetworks={networks}
        selectedNetworkId={selectedNetworkId}
        onSelectNetwork={(id) => {
          setSelectedNetworkId(id);
          setSelectedStationId(null);
        }}
      />

      {/* Main Content Workspace — Full Horizontal Space */}
      <main
        className={`flex-1 min-w-0 ${
          currentTab === 'network' ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'
        }`}
      >
        {renderAppContent()}
      </main>
    </div>
  );
};

export default App;
