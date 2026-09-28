"""
TRANSITX — Multi-Network Data Store
Loads, indexes, and caches transit networks across India (Chennai, Delhi, etc.)
for instantaneous query resolution and multi-city comparative analytics.
"""

import os
import json
from typing import Dict, Any, List, Optional
import pandas as pd
import numpy as np

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))

# Discover data directory across local, Docker, and serverless environments
possible_roots = [
    os.environ.get("TRANSITX_DATA_DIR"),
    os.path.join(os.path.dirname(os.path.dirname(CURRENT_DIR)), "data"),
    os.path.join(os.path.dirname(CURRENT_DIR), "data"),
    os.path.join(os.getcwd(), "data"),
    os.path.join(os.getcwd(), "..", "data"),
    os.path.join(CURRENT_DIR, "data"),
]

DATA_DIR = None
for p in possible_roots:
    if p and os.path.isdir(p) and (os.path.exists(os.path.join(p, "networks")) or os.path.exists(os.path.join(p, "processed"))):
        DATA_DIR = p
        break

if not DATA_DIR:
    DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(CURRENT_DIR)), "data")

NETWORKS_DIR = os.path.join(DATA_DIR, "networks")
PROCESSED_DEFAULT_DIR = os.path.join(DATA_DIR, "processed")


class NetworkContainer:
    """Holds dataframes, lists, and metadata for a single transit network."""
    def __init__(self, metadata: Dict[str, Any], data_dir: str):
        self.metadata = metadata
        self.id = metadata.get("id", "chennai")
        self.name = metadata.get("name", "Transit Network")
        self.city = metadata.get("city", "City")
        self.data_dir = data_dir

        self.ridership_df: pd.DataFrame = pd.DataFrame()
        self.stations_df: pd.DataFrame = pd.DataFrame()
        self.routes_df: pd.DataFrame = pd.DataFrame()
        self.station_metrics_df: pd.DataFrame = pd.DataFrame()
        self.route_metrics_df: pd.DataFrame = pd.DataFrame()
        self.anomalies_df: pd.DataFrame = pd.DataFrame()
        self.stations_list: List[Dict[str, Any]] = []
        self.routes_list: List[Dict[str, Any]] = []

        self.load()

    def load(self):
        # 1. Clean Ridership CSV
        clean_path = os.path.join(self.data_dir, "transit_clean.csv")
        if os.path.exists(clean_path):
            self.ridership_df = pd.read_csv(clean_path)
            self.ridership_df["timestamp"] = pd.to_datetime(self.ridership_df["timestamp"])

        # 2. Stations Clean JSON & DF
        st_json_path = os.path.join(self.data_dir, "stations_clean.json")
        if os.path.exists(st_json_path):
            with open(st_json_path, "r", encoding="utf-8") as f:
                self.stations_list = json.load(f)
            self.stations_df = pd.DataFrame(self.stations_list)

        # 3. Routes Clean JSON & DF
        rt_json_path = os.path.join(self.data_dir, "routes_clean.json")
        if os.path.exists(rt_json_path):
            with open(rt_json_path, "r", encoding="utf-8") as f:
                self.routes_list = json.load(f)
            self.routes_df = pd.DataFrame(self.routes_list)

        # 4. Metrics
        st_metrics_path = os.path.join(self.data_dir, "station_metrics.csv")
        if os.path.exists(st_metrics_path):
            self.station_metrics_df = pd.read_csv(st_metrics_path)

        rt_metrics_path = os.path.join(self.data_dir, "route_metrics.csv")
        if os.path.exists(rt_metrics_path):
            self.route_metrics_df = pd.read_csv(rt_metrics_path)

        anom_path = os.path.join(self.data_dir, "anomalies_detected.csv")
        if os.path.exists(anom_path):
            self.anomalies_df = pd.read_csv(anom_path)


class DataStore:
    def __init__(self):
        self.networks: Dict[str, NetworkContainer] = {}
        self.default_network_id = "chennai"
        self.load_all_networks()

    def load_all_networks(self):
        print("Initializing TRANSITX Multi-Network DataStore...")
        registry_path = os.path.join(NETWORKS_DIR, "networks.json")

        if os.path.exists(registry_path):
            with open(registry_path, "r", encoding="utf-8") as f:
                networks_meta = json.load(f)

            for meta in networks_meta:
                net_id = meta["id"]
                net_proc_dir = os.path.join(NETWORKS_DIR, net_id, "processed")
                if os.path.exists(net_proc_dir):
                    container = NetworkContainer(meta, net_proc_dir)
                    self.networks[net_id] = container
                    print(f"Loaded network [{net_id}] ({meta['name']}): {len(container.ridership_df)} records, {len(container.stations_list)} stations, {len(container.routes_list)} routes.")
        
        # If networks directory was not loaded or empty, fallback to default processed
        if not self.networks and os.path.exists(PROCESSED_DEFAULT_DIR):
            meta = {
                "id": "chennai",
                "name": "Chennai Transit Network",
                "city": "Chennai",
                "state": "Tamil Nadu",
                "country": "India",
                "center": [13.045, 80.235],
                "zoom": 12,
                "lines_count": 5,
                "stations_count": 47
            }
            self.networks["chennai"] = NetworkContainer(meta, PROCESSED_DEFAULT_DIR)
            print("Loaded fallback default network [chennai].")

    def get_networks_metadata(self) -> List[Dict[str, Any]]:
        return [net.metadata for net in self.networks.values()]

    def get_network(self, network_id: Optional[str] = None) -> NetworkContainer:
        if network_id and network_id in self.networks:
            return self.networks[network_id]
        if self.default_network_id in self.networks:
            return self.networks[self.default_network_id]
        if self.networks:
            return next(iter(self.networks.values()))
        raise RuntimeError("No transit networks loaded in DataStore!")

    # Backward compatibility properties (mapped to default network)
    @property
    def ridership_df(self) -> pd.DataFrame:
        return self.get_network().ridership_df

    @property
    def stations_df(self) -> pd.DataFrame:
        return self.get_network().stations_df

    @property
    def routes_df(self) -> pd.DataFrame:
        return self.get_network().routes_df

    @property
    def station_metrics_df(self) -> pd.DataFrame:
        return self.get_network().station_metrics_df

    @property
    def route_metrics_df(self) -> pd.DataFrame:
        return self.get_network().route_metrics_df

    @property
    def anomalies_df(self) -> pd.DataFrame:
        return self.get_network().anomalies_df

    @property
    def stations_list(self) -> List[Dict[str, Any]]:
        return self.get_network().stations_list

    @property
    def routes_list(self) -> List[Dict[str, Any]]:
        return self.get_network().routes_list


# Global singleton instance
store = DataStore()
