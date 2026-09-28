import React, { useState, useEffect } from 'react';
import { Sidebar, NavItemKey } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { OverviewPage } from './pages/OverviewPage';
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
  const [currentTab, setCurrentTab] = useState<NavItemKey>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '') as NavItemKey;
      const validTabs: NavItemKey[] = ['overview', 'network', 'stations', 'routes', 'demand', 'delays', 'insights', 'data', 'about'];
      if (validTabs.includes(hash)) return hash;
      const param = new URLSearchParams(window.location.search).get('tab') as NavItemKey;
      if (param && validTabs.includes(param)) return param;
    }
    return 'overview';
  });
  const [currentSubTab, setCurrentSubTab] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<string>('2024-01-15');
  const [selectedHour, setSelectedHour] = useState<number>(9);
  const [selectedStationId, setSelectedStationId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('station');
    }
    return null;
  });

  // Multi-Network State (initialized with verified registry)
  const [networks, setNetworks] = useState<TransitNetwork[]>(FALLBACK_NETWORKS);
  const [selectedNetworkId, setSelectedNetworkId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const net = new URLSearchParams(window.location.search).get('network');
      if (net) return net;
    }
    return 'chennai';
  });

  // Core Data States (hydrated with real baseline data to guarantee immediate 3D visualization)
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
  };

  const handleNavigate = (tab: NavItemKey, subTab?: string) => {
    setCurrentTab(tab);
    setCurrentSubTab(subTab);
  };

  const currentNetwork = networks.find((n) => n.id === selectedNetworkId) || null;

  const renderContent = () => {
    const currentStations = snapshot ? snapshot.stations : stations;
    const currentRoutes = snapshot ? snapshot.routes : routes;

    switch (currentTab) {
      case 'overview':
        return (
          <OverviewPage
            summary={summary}
            onNavigate={(tab, subTab) => handleNavigate(tab, subTab)}
            availableNetworks={networks}
            selectedNetworkId={selectedNetworkId}
            onSelectNetwork={(id) => {
              setSelectedNetworkId(id);
              setSelectedStationId(null);
            }}
          />
        );
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
          <OverviewPage
            summary={summary}
            onNavigate={(tab, subTab) => handleNavigate(tab, subTab)}
            availableNetworks={networks}
            selectedNetworkId={selectedNetworkId}
            onSelectNetwork={(id) => {
              setSelectedNetworkId(id);
              setSelectedStationId(null);
            }}
          />
        );
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F7F5EF] text-[#242521] font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setCurrentSubTab(undefined);
          if (typeof window !== 'undefined') window.location.hash = tab;
        }}
        systemSummary={summary}
        currentNetwork={currentNetwork}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <Header
          currentDate={selectedDate}
          currentHour={selectedHour}
          onHourChange={(h) => setSelectedHour(h)}
          activeLineCount={routes.length}
          totalRecords={summary ? summary.total_ridership : 12805692}
          availableNetworks={networks}
          selectedNetworkId={selectedNetworkId}
          onSelectNetwork={(id) => {
            setSelectedNetworkId(id);
            setSelectedStationId(null);
          }}
        />

        {/* Scrollable page body (or fixed for map) */}
        <main
          className={`flex-1 ${
            currentTab === 'network' ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'
          }`}
        >
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
