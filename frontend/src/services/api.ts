import {
  TransitNetwork,
  SystemSummary,
  NetworkSnapshot,
  Station,
  Route,
  StationDetail,
  RouteDetail,
  DemandAnalysis,
  DelaysAnalysis,
  AnomalyItem,
  ClustersAnalysis,
  RegressionResult,
  SimilarRoutesAnalysis,
  HypothesisTestResult,
  DataExplorerResult
} from '../types/transit';

const API_BASE = '/api';

export async function fetchNetworks(): Promise<TransitNetwork[]> {
  const res = await fetch(`${API_BASE}/networks`);
  if (!res.ok) throw new Error('Failed to load networks');
  return res.json();
}

export async function fetchSystemSummary(networkId?: string): Promise<SystemSummary> {
  const url = networkId ? `${API_BASE}/networks/${networkId}/summary` : `${API_BASE}/summary`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load system summary');
  return res.json();
}

export async function fetchNetworkSnapshot(
  networkId?: string,
  date = '2024-01-15',
  hour = 9
): Promise<NetworkSnapshot> {
  const url = networkId
    ? `${API_BASE}/networks/${networkId}/network?date=${date}&hour=${hour}`
    : `${API_BASE}/network?date=${date}&hour=${hour}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load network snapshot');
  return res.json();
}

export async function fetchStations(networkId?: string, query?: string): Promise<Station[]> {
  const base = networkId ? `${API_BASE}/networks/${networkId}/stations` : `${API_BASE}/stations`;
  const url = query ? `${base}?query=${encodeURIComponent(query)}` : base;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load stations');
  return res.json();
}

export async function fetchStationDetails(
  stationId: string,
  networkId?: string,
  date?: string
): Promise<StationDetail> {
  const base = networkId
    ? `${API_BASE}/networks/${networkId}/stations/${stationId}`
    : `${API_BASE}/stations/${stationId}`;
  const url = date ? `${base}?date=${date}` : base;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load station details');
  return res.json();
}

export async function fetchRoutes(networkId?: string): Promise<Route[]> {
  const url = networkId ? `${API_BASE}/networks/${networkId}/routes` : `${API_BASE}/routes`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load routes');
  return res.json();
}

export async function fetchRouteDetails(routeId: string, networkId?: string): Promise<RouteDetail> {
  const url = networkId
    ? `${API_BASE}/networks/${networkId}/routes/${routeId}`
    : `${API_BASE}/routes/${routeId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load route details');
  return res.json();
}

export async function fetchDemandAnalysis(
  networkId?: string,
  routeId?: string,
  stationId?: string,
  date?: string
): Promise<DemandAnalysis> {
  const params = new URLSearchParams();
  if (routeId) params.append('route_id', routeId);
  if (stationId) params.append('station_id', stationId);
  if (date) params.append('date', date);
  const base = networkId ? `${API_BASE}/networks/${networkId}/demand` : `${API_BASE}/demand`;
  const res = await fetch(`${base}?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to load demand analysis');
  return res.json();
}

export async function fetchDelaysAnalysis(networkId?: string): Promise<DelaysAnalysis> {
  const url = networkId ? `${API_BASE}/networks/${networkId}/delays` : `${API_BASE}/delays`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load delays analysis');
  return res.json();
}

export async function fetchAnomalies(
  networkId?: string,
  limit = 25
): Promise<{ total_anomalies: number; anomalies: AnomalyItem[] }> {
  const base = networkId ? `${API_BASE}/networks/${networkId}/anomalies` : `${API_BASE}/anomalies`;
  const res = await fetch(`${base}?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to load anomalies');
  return res.json();
}

export async function fetchDescriptiveStatistics(networkId?: string): Promise<any> {
  const url = networkId ? `${API_BASE}/networks/${networkId}/statistics` : `${API_BASE}/statistics`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load statistics');
  return res.json();
}

export async function fetchCorrelationMatrix(networkId?: string): Promise<any> {
  const url = networkId ? `${API_BASE}/networks/${networkId}/correlation` : `${API_BASE}/correlation`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load correlation matrix');
  return res.json();
}

export async function fetchHypothesisTest(networkId?: string): Promise<HypothesisTestResult> {
  const url = networkId ? `${API_BASE}/networks/${networkId}/hypothesis-test` : `${API_BASE}/hypothesis-test`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load hypothesis test');
  return res.json();
}

export async function fetchClusters(networkId?: string, nClusters = 3): Promise<ClustersAnalysis> {
  const base = networkId ? `${API_BASE}/networks/${networkId}/clusters` : `${API_BASE}/clusters`;
  const res = await fetch(`${base}?n_clusters=${nClusters}`);
  if (!res.ok) throw new Error('Failed to load clusters');
  return res.json();
}

export async function runRegression(
  networkId?: string,
  independentVar = 'hour'
): Promise<RegressionResult> {
  const url = networkId ? `${API_BASE}/networks/${networkId}/regression` : `${API_BASE}/regression`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ independent_var: independentVar })
  });
  if (!res.ok) throw new Error('Failed to run regression model');
  return res.json();
}

export async function fetchSimilarRoutes(routeId: string, networkId?: string): Promise<SimilarRoutesAnalysis> {
  const url = networkId
    ? `${API_BASE}/networks/${networkId}/similar-routes/${routeId}`
    : `${API_BASE}/similar-routes/${routeId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load similar routes');
  return res.json();
}

export async function compareRoutes(routeA: string, routeB: string, networkId?: string): Promise<any> {
  const base = networkId ? `${API_BASE}/networks/${networkId}/compare-routes` : `${API_BASE}/compare-routes`;
  const res = await fetch(`${base}?route_a=${routeA}&route_b=${routeB}`);
  if (!res.ok) throw new Error('Failed to compare routes');
  return res.json();
}

export async function fetchDataExplorer(
  networkId?: string,
  page = 1,
  pageSize = 50,
  routeId?: string,
  stationId?: string,
  date?: string,
  search?: string,
  sortBy = 'timestamp',
  sortAsc = false
): Promise<DataExplorerResult> {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('page_size', pageSize.toString());
  if (routeId) params.append('route_id', routeId);
  if (stationId) params.append('station_id', stationId);
  if (date) params.append('date', date);
  if (search) params.append('search', search);
  params.append('sort_by', sortBy);
  params.append('sort_asc', sortAsc.toString());

  const base = networkId ? `${API_BASE}/networks/${networkId}/data` : `${API_BASE}/data`;
  const res = await fetch(`${base}?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to load data explorer records');
  return res.json();
}

export async function fetchMetadata(networkId?: string): Promise<any> {
  const url = networkId ? `${API_BASE}/networks/${networkId}/metadata` : `${API_BASE}/metadata`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load metadata');
  return res.json();
}
