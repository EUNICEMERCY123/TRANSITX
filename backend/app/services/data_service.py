"""
TRANSITX — Data Service
Handles queries, aggregations, snapshots, and filtering across transit operational records
for any supported Indian transit network (Chennai, Delhi, etc.).
"""

from typing import Optional, Dict, Any, List
import pandas as pd
import numpy as np
from app.data_store import store


class DataService:
    @staticmethod
    def get_system_summary(network_id: Optional[str] = None) -> Dict[str, Any]:
        """Provides high-level system metrics for Overview and dashboard headers."""
        net = store.get_network(network_id)
        df = net.ridership_df
        if df.empty:
            return {}

        total_passengers = int(df["passenger_count"].sum())
        daily_average = int(total_passengers / max(1, df["date"].nunique()))
        avg_delay = round(float(df["delay_minutes"].mean()), 2)
        total_routes = len(net.routes_list)
        total_stations = len(net.stations_list)

        # Busiest station
        st_agg = df.groupby("station_name")["passenger_count"].sum()
        busiest_station = st_agg.idxmax() if not st_agg.empty else "N/A"
        busiest_station_vol = int(st_agg.max()) if not st_agg.empty else 0

        # Busiest route
        rt_agg = df.groupby("route_name")["passenger_count"].sum()
        busiest_route = rt_agg.idxmax() if not rt_agg.empty else "N/A"

        # Peak operational hour across system
        hr_agg = df.groupby("hour")["passenger_count"].sum()
        peak_hour = int(hr_agg.idxmax()) if not hr_agg.empty else 9
        peak_hour_vol = int(hr_agg.max()) if not hr_agg.empty else 0

        # Total anomalies
        anomaly_count = len(net.anomalies_df)

        return {
            "network_id": net.id,
            "network_name": net.name,
            "city": net.city,
            "total_ridership": total_passengers,
            "daily_average_ridership": daily_average,
            "system_avg_delay_min": avg_delay,
            "total_routes": total_routes,
            "total_stations": total_stations,
            "busiest_station": busiest_station,
            "busiest_station_volume": busiest_station_vol,
            "busiest_route": busiest_route,
            "system_peak_hour": f"{peak_hour:02d}:00",
            "system_peak_volume": peak_hour_vol,
            "detected_anomalies_count": anomaly_count,
            "observation_dates": sorted(df["date"].unique().tolist())
        }

    @staticmethod
    def get_network_snapshot(network_id: Optional[str] = None, date: Optional[str] = "2024-01-15", hour: Optional[int] = 9) -> Dict[str, Any]:
        """
        Returns real-time or time-slice operational snapshot for the 3D living map:
        Station occupancy, crowd level, route passenger flow density, and delay statuses.
        """
        net = store.get_network(network_id)
        df = net.ridership_df
        if df.empty:
            return {"network_id": net.id, "stations": [], "routes": []}

        # Filter by date and hour if available, else baseline average for that hour
        slice_df = df[(df["date"] == date) & (df["hour"] == hour)]
        if slice_df.empty:
            slice_df = df[df["hour"] == hour]

        # Aggregate station metrics for this time slice
        st_snapshot = slice_df.groupby("station_id").agg(
            current_passengers=("passenger_count", "mean"),
            avg_delay=("delay_minutes", "mean"),
            occupancy_ratio=("occupancy_ratio", "mean")
        ).reset_index()

        st_map = {row["station_id"]: row for _, row in st_snapshot.iterrows()}

        # Build stations payload with geographic coordinates
        stations_payload = []
        for st in net.stations_list:
            sid = st["station_id"]
            metric = st_map.get(sid, None)
            cur_pass = int(metric["current_passengers"]) if metric is not None else int(st.get("avg_passengers_per_hour", 600))
            cur_delay = round(float(metric["avg_delay"]), 1) if metric is not None else round(float(st.get("avg_delay_min", 2.0)), 1)
            occ = round(float(metric["occupancy_ratio"]), 2) if metric is not None else round(float(st.get("avg_occupancy", 0.5)), 2)

            if occ >= 1.0:
                crowd = "Critical"
                status_color = "#DC2626"
            elif occ >= 0.75:
                crowd = "High"
                status_color = "#EA580C"
            elif occ >= 0.45:
                crowd = "Moderate"
                status_color = "#F59E0B"
            else:
                crowd = "Low"
                status_color = "#16A34A"

            stations_payload.append({
                "station_id": sid,
                "station_name": st["station_name"],
                "latitude": st["latitude"],
                "longitude": st["longitude"],
                "zone": st.get("zone", "Central"),
                "station_type": st.get("station_type", "Elevated"),
                "is_interchange": st.get("is_interchange", False),
                "lines_served": st.get("lines_served", []),
                "current_passengers": cur_pass,
                "current_delay_min": cur_delay,
                "occupancy_ratio": occ,
                "crowd_level": crowd,
                "status_color": status_color
            })

        # Build routes payload with flow density multiplier
        rt_snapshot = slice_df.groupby("route_id").agg(
            route_passengers=("passenger_count", "sum"),
            route_delay=("delay_minutes", "mean")
        ).reset_index()
        rt_map = {row["route_id"]: row for _, row in rt_snapshot.iterrows()}

        routes_payload = []
        for rt in net.routes_list:
            rid = rt["route_id"]
            metric = rt_map.get(rid, None)
            cur_vol = int(metric["route_passengers"]) if metric is not None else 5000
            cur_del = round(float(metric["route_delay"]), 1) if metric is not None else float(rt.get("avg_delay_min", 2.5))

            flow_density = min(5, max(1, int(round((cur_vol / 12000) * 5))))

            if cur_del > 5.0:
                status = "Delay"
                status_color = "#DC2626"
            elif cur_vol > 15000:
                status = "Busy"
                status_color = "#EA580C"
            else:
                status = "Normal"
                status_color = "#16A34A"

            routes_payload.append({
                "route_id": rid,
                "route_name": rt["route_name"],
                "line_code": rt["line_code"],
                "color_hex": rt["color_hex"],
                "origin": rt["origin"],
                "destination": rt["destination"],
                "length_km": rt["length_km"],
                "scheduled_headway_min": rt["scheduled_headway_min"],
                "coordinates_path": rt["coordinates_path"],
                "station_sequence": rt["station_sequence"],
                "current_volume": cur_vol,
                "current_delay_min": cur_del,
                "flow_density": flow_density,
                "operational_status": status,
                "status_color": status_color
            })

        return {
            "network_id": net.id,
            "network_name": net.name,
            "selected_date": date,
            "selected_hour": hour,
            "time_formatted": f"{hour:02d}:00",
            "stations": stations_payload,
            "routes": routes_payload
        }

    @staticmethod
    def get_station_details(station_id: str, network_id: Optional[str] = None, date: Optional[str] = None) -> Dict[str, Any]:
        """Provides in-depth analysis for an individual station."""
        net = store.get_network(network_id)
        df = net.ridership_df
        st_obj = next((s for s in net.stations_list if s["station_id"] == station_id), None)
        if not st_obj:
            return {}

        st_records = df[df["station_id"] == station_id]
        if date:
            date_records = st_records[st_records["date"] == date]
            if not date_records.empty:
                st_records = date_records

        # Hourly curve
        hourly_series = st_records.groupby("hour").agg(
            passengers=("passenger_count", "mean"),
            delay=("delay_minutes", "mean")
        ).reset_index()

        hourly_series["passengers"] = hourly_series["passengers"].round().astype(int)
        hourly_series["delay"] = hourly_series["delay"].round(1)
        hourly_data = [
            {"hour": int(row["hour"]), "time": f"{int(row['hour']):02d}:00", "passengers": int(row["passengers"]), "delay": float(row["delay"])}
            for _, row in hourly_series.iterrows()
        ]

        # Peak period calculation
        peak_row = hourly_series.loc[hourly_series["passengers"].idxmax()] if not hourly_series.empty else None
        peak_hour = int(peak_row["hour"]) if peak_row is not None else 9
        peak_pass = int(peak_row["passengers"]) if peak_row is not None else int(st_obj.get("peak_passengers", 1500))

        # Simulated next arrivals based on lines served
        arrivals = []
        for i, line_id in enumerate(st_obj.get("lines_served", [])):
            rt = next((r for r in net.routes_list if r["route_id"] == line_id), None)
            if rt:
                wait_min = int(3 + (i * 3) + (hash(station_id) % 4))
                arrivals.append({
                    "route_id": line_id,
                    "route_name": rt["route_name"],
                    "line_code": rt["line_code"],
                    "color_hex": rt["color_hex"],
                    "destination": rt["destination"],
                    "wait_minutes": wait_min
                })

        # Station anomalies
        st_anomalies = net.anomalies_df[net.anomalies_df["station_id"] == station_id] if not net.anomalies_df.empty else pd.DataFrame()
        anomaly_list = []
        for _, anom in st_anomalies.head(5).iterrows():
            anomaly_list.append({
                "date": anom["date"],
                "hour": int(anom["hour"]),
                "time": f"{int(anom['hour']):02d}:00",
                "passenger_count": int(anom["passenger_count"]),
                "baseline_mean": round(float(anom["baseline_mean"]), 1),
                "pct_deviation": round(float(anom["pct_deviation"]), 1),
                "z_score": round(float(anom["z_score"]), 2),
                "explanation": f"Observed demand was {abs(anom['pct_deviation'])}% {'higher' if anom['pct_deviation'] > 0 else 'lower'} than usual baseline."
            })

        return {
            "network_id": net.id,
            "station_id": station_id,
            "station_name": st_obj["station_name"],
            "zone": st_obj.get("zone", "Central"),
            "station_type": st_obj.get("station_type", "Elevated"),
            "is_interchange": st_obj.get("is_interchange", False),
            "lines_served": st_obj.get("lines_served", []),
            "average_passengers_hourly": int(st_obj.get("avg_passengers_per_hour", 600)),
            "peak_period": f"{peak_hour:02d}:00 – {peak_hour+1:02d}:00",
            "peak_passengers": peak_pass,
            "average_delay_min": round(float(st_obj.get("avg_delay_min", 2.0)), 1),
            "hourly_demand": hourly_data,
            "next_arrivals": arrivals,
            "anomalies": anomaly_list
        }

    @staticmethod
    def get_route_details(route_id: str, network_id: Optional[str] = None) -> Dict[str, Any]:
        """Provides in-depth corridor analysis and station-by-station breakdown."""
        net = store.get_network(network_id)
        rt_obj = next((r for r in net.routes_list if r["route_id"] == route_id), None)
        if not rt_obj:
            return {}

        df = net.ridership_df
        rt_records = df[df["route_id"] == route_id]

        st_map = {s["station_id"]: s for s in net.stations_list}
        corridor_stations = []
        for sid in rt_obj["station_sequence"]:
            s_data = st_map.get(sid, None)
            if s_data:
                s_subset = rt_records[rt_records["station_id"] == sid]
                avg_load = int(s_subset["passenger_count"].mean()) if not s_subset.empty else 1000
                peak_load = int(s_subset["passenger_count"].max()) if not s_subset.empty else 2500
                avg_delay = round(float(s_subset["delay_minutes"].mean()), 1) if not s_subset.empty else 2.0
                corridor_stations.append({
                    "station_id": sid,
                    "station_name": s_data["station_name"],
                    "latitude": s_data["latitude"],
                    "longitude": s_data["longitude"],
                    "is_interchange": s_data.get("is_interchange", False),
                    "average_passengers": avg_load,
                    "peak_passengers": peak_load,
                    "average_delay_min": avg_delay
                })

        hourly_series = rt_records.groupby("hour").agg(
            passengers=("passenger_count", "sum"),
            delay=("delay_minutes", "mean")
        ).reset_index()
        hourly_data = [
            {"hour": int(row["hour"]), "time": f"{int(row['hour']):02d}:00", "passengers": int(round(row["passengers"] / 14)), "delay": round(float(row["delay"]), 1)}
            for _, row in hourly_series.iterrows()
        ]

        peak_row = hourly_series.loc[hourly_series["passengers"].idxmax()] if not hourly_series.empty else None
        peak_hour = int(peak_row["hour"]) if peak_row is not None else 9

        return {
            "network_id": net.id,
            "route_id": route_id,
            "route_name": rt_obj["route_name"],
            "line_code": rt_obj["line_code"],
            "color_hex": rt_obj["color_hex"],
            "origin": rt_obj["origin"],
            "destination": rt_obj["destination"],
            "length_km": rt_obj["length_km"],
            "total_stations": len(corridor_stations),
            "scheduled_headway_min": rt_obj["scheduled_headway_min"],
            "total_passengers": rt_obj.get("total_passengers", 100000),
            "daily_avg_passengers": rt_obj.get("daily_avg_passengers", 15000),
            "avg_delay_min": rt_obj.get("avg_delay_min", 2.5),
            "peak_hour": f"{peak_hour:02d}:00",
            "corridor_stations": corridor_stations,
            "hourly_demand": hourly_data
        }

    @staticmethod
    def get_demand_analysis(
        route_id: Optional[str] = None,
        station_id: Optional[str] = None,
        date: Optional[str] = None,
        network_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Provides demand timeseries, peak hour metrics, and period breakdown."""
        net = store.get_network(network_id)
        df = net.ridership_df
        filtered_df = df.copy()

        if route_id and route_id != "ALL":
            filtered_df = filtered_df[filtered_df["route_id"] == route_id]
        if station_id and station_id != "ALL":
            filtered_df = filtered_df[filtered_df["station_id"] == station_id]
        if date and date != "ALL":
            filtered_df = filtered_df[filtered_df["date"] == date]

        hourly_summary = filtered_df.groupby("hour").agg(
            total_passengers=("passenger_count", "sum"),
            avg_delay=("delay_minutes", "mean")
        ).reset_index()

        num_days = max(1, filtered_df["date"].nunique())
        hourly_summary["avg_hourly_passengers"] = (hourly_summary["total_passengers"] / num_days).round().astype(int)
        hourly_summary["avg_delay"] = hourly_summary["avg_delay"].round(1)

        morning_slice = hourly_summary[(hourly_summary["hour"] >= 7) & (hourly_summary["hour"] <= 10)]
        morning_peak = morning_slice.loc[morning_slice["avg_hourly_passengers"].idxmax()] if not morning_slice.empty else None

        evening_slice = hourly_summary[(hourly_summary["hour"] >= 16) & (hourly_summary["hour"] <= 20)]
        evening_peak = evening_slice.loc[evening_slice["avg_hourly_passengers"].idxmax()] if not evening_slice.empty else None

        min_slice = hourly_summary.loc[hourly_summary["avg_hourly_passengers"].idxmin()] if not hourly_summary.empty else None

        chart_data = [
            {
                "hour": int(r["hour"]),
                "time": f"{int(r['hour']):02d}:00",
                "passengers": int(r["avg_hourly_passengers"]),
                "delay": float(r["avg_delay"])
            }
            for _, r in hourly_summary.iterrows()
        ]

        overall_avg = int(hourly_summary["avg_hourly_passengers"].mean()) if not hourly_summary.empty else 1000

        m_pct = round(((int(morning_peak["avg_hourly_passengers"]) - overall_avg) / overall_avg) * 100) if morning_peak is not None and overall_avg > 0 else 0
        e_pct = round(((int(evening_peak["avg_hourly_passengers"]) - overall_avg) / overall_avg) * 100) if evening_peak is not None and overall_avg > 0 else 0

        return {
            "network_id": net.id,
            "chart_data": chart_data,
            "overall_hourly_average": overall_avg,
            "morning_peak": {
                "period": f"{int(morning_peak['hour']):02d}:00 – {int(morning_peak['hour'])+1:02d}:00" if morning_peak is not None else "08:00 – 09:00",
                "passengers": int(morning_peak["avg_hourly_passengers"]) if morning_peak is not None else 0,
                "pct_above_average": m_pct
            },
            "evening_peak": {
                "period": f"{int(evening_peak['hour']):02d}:00 – {int(evening_peak['hour'])+1:02d}:00" if evening_peak is not None else "18:00 – 19:00",
                "passengers": int(evening_peak["avg_hourly_passengers"]) if evening_peak is not None else 0,
                "pct_above_average": e_pct
            },
            "lowest_demand_period": {
                "time": f"{int(min_slice['hour']):02d}:00" if min_slice is not None else "23:00",
                "passengers": int(min_slice["avg_hourly_passengers"]) if min_slice is not None else 0
            }
        }

    @staticmethod
    def get_delays_analysis(network_id: Optional[str] = None) -> Dict[str, Any]:
        """Provides operational delay rankings, hourly delay curves, and route comparisons."""
        net = store.get_network(network_id)
        df = net.ridership_df
        if df.empty:
            return {}

        route_delays = df.groupby(["route_id", "route_name"]).agg(
            avg_delay=("delay_minutes", "mean"),
            max_delay=("delay_minutes", "max"),
            total_trips=("record_id", "count")
        ).reset_index()
        route_delays["avg_delay"] = route_delays["avg_delay"].round(2)
        route_delays = route_delays.sort_values(by="avg_delay", ascending=False)

        color_map = {r["route_id"]: r["color_hex"] for r in net.routes_list}
        route_rankings = [
            {
                "route_id": r["route_id"],
                "route_name": r["route_name"],
                "avg_delay": float(r["avg_delay"]),
                "max_delay": float(r["max_delay"]),
                "color_hex": color_map.get(r["route_id"], "#64748B")
            }
            for _, r in route_delays.iterrows()
        ]

        st_delays = df.groupby(["station_id", "station_name"]).agg(
            avg_delay=("delay_minutes", "mean"),
            max_delay=("delay_minutes", "max")
        ).reset_index()
        st_delays["avg_delay"] = st_delays["avg_delay"].round(2)
        st_delays = st_delays.sort_values(by="avg_delay", ascending=False).head(10)
        station_rankings = [
            {
                "station_id": r["station_id"],
                "station_name": r["station_name"],
                "avg_delay": float(r["avg_delay"]),
                "max_delay": float(r["max_delay"])
            }
            for _, r in st_delays.iterrows()
        ]

        hour_delays = df.groupby("hour")["delay_minutes"].mean().reset_index()
        hour_delays["delay_minutes"] = hour_delays["delay_minutes"].round(2)
        delay_curve = [
            {"hour": int(r["hour"]), "time": f"{int(r['hour']):02d}:00", "avg_delay": float(r["delay_minutes"])}
            for _, r in hour_delays.iterrows()
        ]

        return {
            "network_id": net.id,
            "system_avg_delay": round(float(df["delay_minutes"].mean()), 2),
            "system_max_delay": round(float(df["delay_minutes"].max()), 1),
            "route_rankings": route_rankings,
            "station_rankings": station_rankings,
            "hourly_delay_trend": delay_curve
        }

    @staticmethod
    def get_data_explorer(
        page: int = 1,
        page_size: int = 50,
        route_id: Optional[str] = None,
        station_id: Optional[str] = None,
        date: Optional[str] = None,
        search: Optional[str] = None,
        sort_by: Optional[str] = "timestamp",
        sort_asc: bool = False,
        network_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Provides paginated, filtered, sortable data access for the Data Explorer."""
        net = store.get_network(network_id)
        df = net.ridership_df
        if df.empty:
            return {"total_rows": 0, "page": page, "rows": []}

        filtered = df.copy()

        if route_id and route_id != "ALL":
            filtered = filtered[filtered["route_id"] == route_id]
        if station_id and station_id != "ALL":
            filtered = filtered[filtered["station_id"] == station_id]
        if date and date != "ALL":
            filtered = filtered[filtered["date"] == date]
        if search:
            s = search.lower().strip()
            filtered = filtered[
                filtered["station_name"].str.lower().str.contains(s, na=False) |
                filtered["route_name"].str.lower().str.contains(s, na=False) |
                filtered["record_id"].str.lower().str.contains(s, na=False) |
                filtered["route_id"].str.lower().str.contains(s, na=False)
            ]

        total_rows = len(filtered)

        if sort_by in filtered.columns:
            filtered = filtered.sort_values(by=sort_by, ascending=sort_asc)
        else:
            filtered = filtered.sort_values(by="timestamp", ascending=False)

        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        page_slice = filtered.iloc[start_idx:end_idx]

        rows = []
        for _, r in page_slice.iterrows():
            rows.append({
                "record_id": r["record_id"],
                "date": r["date"],
                "time": f"{int(r['hour']):02d}:00",
                "route_name": r["route_name"],
                "station_name": r["station_name"],
                "passengers": int(r["passenger_count"]),
                "delay_minutes": float(r["delay_minutes"]),
                "crowd_level": r["crowd_level"],
                "is_anomaly": bool(r["is_anomaly"]),
                "weather": r["weather_condition"]
            })

        return {
            "network_id": net.id,
            "total_rows": total_rows,
            "page": page,
            "page_size": page_size,
            "total_pages": int(np.ceil(total_rows / page_size)),
            "rows": rows
        }
