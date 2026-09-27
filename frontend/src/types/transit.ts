export interface TransitNetwork {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  system_type: string;
  operator: string;
  center: [number, number];
  zoom: number;
  pitch: number;
  bearing: number;
  lines_count: number;
  stations_count: number;
  color: string;
  description: string;
}

export interface Station {
  station_id: string;
  station_name: string;
  latitude: number;
  longitude: number;
  zone: string;
  station_type: string;
  is_interchange: boolean;
  lines_served: string[];
  current_passengers?: number;
  current_delay_min?: number;
  occupancy_ratio?: number;
  crowd_level?: 'Low' | 'Moderate' | 'High' | 'Critical';
  status_color?: string;
  avg_passengers_per_hour?: number;
  peak_passengers?: number;
  avg_delay_min?: number;
  avg_occupancy?: number;
}

export interface Route {
  route_id: string;
  route_name: string;
  line_code: string;
  color_hex: string;
  origin: string;
  destination: string;
  length_km: number;
  total_stations: number;
  scheduled_headway_min: number;
  station_sequence: string[];
  coordinates_path: [number, number][];
  current_volume?: number;
  current_delay_min?: number;
  flow_density?: number;
  operational_status?: 'Normal' | 'Busy' | 'Delay';
  status_color?: string;
  total_passengers?: number;
  daily_avg_passengers?: number;
  avg_delay_min?: number;
}

export interface NetworkSnapshot {
  network_id?: string;
  network_name?: string;
  selected_date: string;
  selected_hour: number;
  time_formatted: string;
  stations: Station[];
  routes: Route[];
}

export interface SystemSummary {
  network_id?: string;
  network_name?: string;
  city?: string;
  total_ridership: number;
  daily_average_ridership: number;
  system_avg_delay_min: number;
  total_routes: number;
  total_stations: number;
  busiest_station: string;
  busiest_station_volume: number;
  busiest_route: string;
  system_peak_hour: string;
  system_peak_volume: number;
  detected_anomalies_count: number;
  observation_dates: string[];
}

export interface HourlyDemandPoint {
  hour: number;
  time: string;
  passengers: number;
  delay: number;
}

export interface DemandAnalysis {
  network_id?: string;
  chart_data: HourlyDemandPoint[];
  overall_hourly_average: number;
  morning_peak: {
    period: string;
    passengers: number;
    pct_above_average: number;
  };
  evening_peak: {
    period: string;
    passengers: number;
    pct_above_average: number;
  };
  lowest_demand_period: {
    time: string;
    passengers: number;
  };
}

export interface StationDetail {
  network_id?: string;
  station_id: string;
  station_name: string;
  zone: string;
  station_type: string;
  is_interchange: boolean;
  lines_served: string[];
  average_passengers_hourly: number;
  peak_period: string;
  peak_passengers: number;
  average_delay_min: number;
  hourly_demand: HourlyDemandPoint[];
  next_arrivals: {
    route_id: string;
    route_name: string;
    line_code: string;
    color_hex: string;
    destination: string;
    wait_minutes: number;
  }[];
  anomalies: {
    date: string;
    hour: number;
    time: string;
    passenger_count: number;
    baseline_mean: number;
    pct_deviation: number;
    z_score: number;
    explanation: string;
  }[];
}

export interface RouteDetail {
  network_id?: string;
  route_id: string;
  route_name: string;
  line_code: string;
  color_hex: string;
  origin: string;
  destination: string;
  length_km: number;
  total_stations: number;
  scheduled_headway_min: number;
  total_passengers: number;
  daily_avg_passengers: number;
  avg_delay_min: number;
  peak_hour: string;
  corridor_stations: {
    station_id: string;
    station_name: string;
    latitude: number;
    longitude: number;
    is_interchange: boolean;
    average_passengers: number;
    peak_passengers: number;
    average_delay_min: number;
  }[];
  hourly_demand: HourlyDemandPoint[];
}

export interface DelaysAnalysis {
  network_id?: string;
  system_avg_delay: number;
  system_max_delay: number;
  route_rankings: {
    route_id: string;
    route_name: string;
    avg_delay: number;
    max_delay: number;
    color_hex: string;
  }[];
  station_rankings: {
    station_id: string;
    station_name: string;
    avg_delay: number;
    max_delay: number;
  }[];
  hourly_delay_trend: {
    hour: number;
    time: string;
    avg_delay: number;
  }[];
}

export interface AnomalyItem {
  record_id: string;
  date: string;
  hour: number;
  time: string;
  route_name: string;
  station_name: string;
  observed_passengers: number;
  expected_baseline: number;
  pct_deviation: number;
  z_score: number;
  status: string;
  explanation: string;
}

export interface ClusterGroup {
  cluster_id: number;
  profile_name: string;
  route_count: number;
  avg_daily_passengers: number;
  avg_peak_passengers: number;
  avg_delay_min: number;
  simple_explanation: string;
  routes: {
    route_id: string;
    route_name: string;
    color_hex: string;
    daily_avg_passengers: number;
    peak_passengers: number;
    avg_delay_min: number;
  }[];
}

export interface ClustersAnalysis {
  network_id?: string;
  algorithm: string;
  k_clusters: number;
  silhouette_score: number;
  features_used: string[];
  clusters: ClusterGroup[];
  simple_definition: string;
}

export interface RegressionResult {
  network_id?: string;
  model_type: string;
  formula: string;
  independent_variable: string;
  dependent_variable: string;
  metrics: {
    r_squared: number;
    mae: number;
    rmse: number;
    slope: number;
    intercept: number;
  };
  interpretation: string;
  label_notice: string;
  data_points: {
    x: number;
    y: number;
    predicted_y: number;
    is_weekend: boolean;
  }[];
}

export interface SimilarRoute {
  route_id: string;
  route_name: string;
  color_hex: string;
  similarity_score: number;
  similarity_percentage: number;
  daily_avg_passengers: number;
  peak_hourly_passengers: number;
  avg_delay_min: number;
  explanation: string;
}

export interface SimilarRoutesAnalysis {
  network_id?: string;
  target_route_id: string;
  target_route_name: string;
  methodology: string;
  features_compared: string[];
  recommendations: SimilarRoute[];
  simple_explanation: string;
}

export interface HypothesisTestResult {
  network_id?: string;
  test_name: string;
  research_question: string;
  null_hypothesis_h0: string;
  alternative_hypothesis_h1: string;
  significance_level_alpha: number;
  sample_sizes: {
    weekday_observations: number;
    weekend_observations: number;
  };
  sample_statistics: {
    weekday_mean: number;
    weekday_std: number;
    weekend_mean: number;
    weekend_std: number;
    absolute_difference: number;
  };
  test_results: {
    t_statistic: number;
    p_value: number;
    p_value_formatted: string;
    cohens_d_effect_size: number;
    effect_magnitude: string;
    decision: string;
    statistically_significant: boolean;
  };
  simple_interpretation: string;
}

export interface DataExplorerResult {
  network_id?: string;
  total_rows: number;
  page: number;
  page_size: number;
  total_pages: number;
  rows: {
    record_id: string;
    date: string;
    time: string;
    route_name: string;
    station_name: string;
    passengers: number;
    delay_minutes: number;
    crowd_level: string;
    is_anomaly: boolean;
    weather: string;
  }[];
}
