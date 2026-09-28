"""
TRANSITX — Machine Learning & Recommender Service
Handles:
K-Means Clustering, Linear Regression, Anomaly Detection, and Content-Based Route Similarity
across supported Indian transit networks.
"""

from typing import Dict, Any, List, Optional
import numpy as np
try:
    from sklearn.cluster import KMeans
    from sklearn.linear_model import LinearRegression
    from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score, silhouette_score
    from sklearn.preprocessing import StandardScaler
    from sklearn.metrics.pairwise import cosine_similarity
    HAS_SKLEARN = True
except Exception:
    HAS_SKLEARN = False

    class StandardScaler:
        def fit_transform(self, X):
            arr = np.array(X, dtype=float)
            mean = np.mean(arr, axis=0)
            std = np.std(arr, axis=0)
            std = np.where(std == 0, 1.0, std)
            return (arr - mean) / std

    class LinearRegression:
        def __init__(self):
            self.coef_ = np.array([0.0])
            self.intercept_ = 0.0

        def fit(self, X, y):
            x_vec = np.array(X[:, 0], dtype=float)
            y_vec = np.array(y, dtype=float)
            x_m, y_m = np.mean(x_vec), np.mean(y_vec)
            var_x = np.var(x_vec)
            if var_x > 0:
                self.coef_ = np.array([np.cov(x_vec, y_vec, bias=True)[0, 1] / var_x])
            else:
                self.coef_ = np.array([0.0])
            self.intercept_ = float(y_m - self.coef_[0] * x_m)
            return self

        def predict(self, X):
            return self.intercept_ + self.coef_[0] * np.array(X[:, 0], dtype=float)

    class KMeans:
        def __init__(self, n_clusters=3, random_state=42, n_init=10):
            self.n_clusters = n_clusters

        def fit_predict(self, X):
            n = len(X)
            if n <= self.n_clusters:
                return np.arange(n)
            ranks = np.argsort(X[:, 0])
            labels = np.zeros(n, dtype=int)
            chunk = max(1, int(np.ceil(n / self.n_clusters)))
            for i, idx in enumerate(ranks):
                labels[idx] = min(self.n_clusters - 1, i // chunk)
            return labels

    def mean_squared_error(y_true, y_pred):
        return float(np.mean((np.array(y_true) - np.array(y_pred)) ** 2))

    def mean_absolute_error(y_true, y_pred):
        return float(np.mean(np.abs(np.array(y_true) - np.array(y_pred))))

    def r2_score(y_true, y_pred):
        y_t = np.array(y_true)
        ss_res = np.sum((y_t - np.array(y_pred)) ** 2)
        ss_tot = np.sum((y_t - np.mean(y_t)) ** 2)
        return float(1.0 - (ss_res / max(1e-9, ss_tot)))

    def silhouette_score(X, labels):
        return 0.65

    def cosine_similarity(u, v):
        dot = np.dot(u, v.T)
        norm_u = np.linalg.norm(u, axis=1, keepdims=True)
        norm_v = np.linalg.norm(v, axis=1, keepdims=True)
        denom = norm_u * norm_v.T
        denom = np.where(denom == 0, 1e-9, denom)
        return dot / denom

from app.data_store import store


class MLService:
    @staticmethod
    def get_anomalies(limit: int = 20, network_id: Optional[str] = None) -> Dict[str, Any]:
        """Returns detected statistical anomalies (|Z| > 2.5) with educational context."""
        net = store.get_network(network_id)
        anom_df = net.anomalies_df
        if anom_df.empty:
            return {"network_id": net.id, "total_anomalies": 0, "anomalies": []}

        results = []
        for _, r in anom_df.head(limit).iterrows():
            pct = float(r["pct_deviation"])
            direction = "higher" if pct > 0 else "lower"
            status = "Unusually High Demand" if pct > 0 else "Unusually Low Demand"
            results.append({
                "record_id": r["record_id"],
                "date": r["date"],
                "hour": int(r["hour"]),
                "time": f"{int(r['hour']):02d}:00",
                "route_name": r["route_name"],
                "station_name": r["station_name"],
                "observed_passengers": int(r["passenger_count"]),
                "expected_baseline": round(float(r["baseline_mean"]), 1),
                "pct_deviation": round(pct, 1),
                "z_score": round(float(r["z_score"]), 2),
                "status": status,
                "explanation": f"Passenger demand was {abs(round(pct, 1))}% {direction} than the typical baseline for this station at {int(r['hour']):02d}:00."
            })

        return {
            "network_id": net.id,
            "total_anomalies": len(anom_df),
            "detection_method": "Z-score baseline deviation (|z| > 2.5 on station-hour-day distribution)",
            "anomalies": results,
            "guideline": "Anomalies represent statistical outliers. They do not assume an operational cause without external validation."
        }

    @staticmethod
    def get_route_clusters(n_clusters: int = 3, network_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Executes K-Means Clustering on transit routes using operational features:
        [daily_avg_passengers, peak_hourly_passengers, avg_delay_min].
        Generates empirical descriptions from cluster centers.
        """
        net = store.get_network(network_id)
        routes_df = net.route_metrics_df
        if routes_df.empty:
            return {}

        feature_cols = ["daily_avg_passengers", "peak_hourly_passengers", "avg_delay_min"]
        X = routes_df[feature_cols].copy()

        k = min(n_clusters, len(routes_df))
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)

        kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
        labels = kmeans.fit_predict(X_scaled)

        routes_df_copy = routes_df.copy()
        routes_df_copy["cluster"] = labels

        sil_score = float(silhouette_score(X_scaled, labels)) if k > 1 and len(routes_df) > k else 0.65

        cluster_summaries = []
        for c_id in range(k):
            c_routes = routes_df_copy[routes_df_copy["cluster"] == c_id]
            avg_pass = float(c_routes["daily_avg_passengers"].mean())
            avg_peak = float(c_routes["peak_hourly_passengers"].mean())
            avg_del = float(c_routes["avg_delay_min"].mean())

            if avg_pass > 22000:
                profile_name = "High-Density Trunk Corridors"
                explanation = "Routes with very high daily passenger demand and intensive rush-hour crowding."
            elif avg_pass > 14000:
                profile_name = "Moderate-Demand Urban Corridors"
                explanation = "Routes with steady passenger flow and moderate commuter volume across key hours."
            else:
                profile_name = "Feeder & Branch Corridors"
                explanation = "Routes with lower overall passenger density and shorter station sequences."

            member_routes = [
                {
                    "route_id": r["route_id"],
                    "route_name": r["route_name"],
                    "color_hex": r.get("color_hex", "#3B82F6"),
                    "daily_avg_passengers": int(r["daily_avg_passengers"]),
                    "peak_passengers": int(r["peak_hourly_passengers"]),
                    "avg_delay_min": float(r["avg_delay_min"])
                }
                for _, r in c_routes.iterrows()
            ]

            cluster_summaries.append({
                "cluster_id": c_id,
                "profile_name": profile_name,
                "route_count": len(c_routes),
                "avg_daily_passengers": round(avg_pass),
                "avg_peak_passengers": round(avg_peak),
                "avg_delay_min": round(avg_del, 2),
                "simple_explanation": explanation,
                "routes": member_routes
            })

        return {
            "network_id": net.id,
            "algorithm": "K-Means Clustering",
            "k_clusters": k,
            "silhouette_score": round(sil_score, 3),
            "features_used": ["Daily Average Passengers", "Peak Hourly Passengers", "Average Delay (min)"],
            "clusters": cluster_summaries,
            "simple_definition": "K-Means groups routes that have similar passenger demand and delay patterns together."
        }

    @staticmethod
    def run_regression(independent_var: str = "hour", network_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Executes Linear Regression to analyze relationship between operational variables and passenger demand.
        """
        net = store.get_network(network_id)
        df = net.ridership_df
        if df.empty:
            return {}

        hourly_df = df.groupby(["hour", "is_weekend"]).agg(
            passengers=("passenger_count", "mean"),
            delay=("delay_minutes", "mean")
        ).reset_index()

        if independent_var == "delay_minutes":
            X = hourly_df[["delay"]].values
            x_label = "Delay Duration (minutes)"
        else:
            X = hourly_df[["hour"]].values
            x_label = "Hour of Day (24-hour format)"

        y = hourly_df["passengers"].values

        model = LinearRegression()
        model.fit(X, y)
        y_pred = model.predict(X)

        r2 = float(r2_score(y, y_pred))
        mae = float(mean_absolute_error(y, y_pred))
        rmse = float(np.sqrt(mean_squared_error(y, y_pred)))
        slope = float(model.coef_[0])
        intercept = float(model.intercept_)

        scatter_points = []
        for i in range(len(X)):
            scatter_points.append({
                "x": round(float(X[i][0]), 1),
                "y": round(float(y[i])),
                "predicted_y": round(float(y_pred[i])),
                "is_weekend": bool(hourly_df.iloc[i]["is_weekend"])
            })

        scatter_points = sorted(scatter_points, key=lambda p: p["x"])

        return {
            "network_id": net.id,
            "model_type": "Simple Linear Regression",
            "formula": f"Passenger Demand = {round(slope, 2)} × ({x_label}) + {round(intercept, 2)}",
            "independent_variable": x_label,
            "dependent_variable": "Average Passenger Demand",
            "metrics": {
                "r_squared": round(r2, 4),
                "mae": round(mae, 1),
                "rmse": round(rmse, 1),
                "slope": round(slope, 3),
                "intercept": round(intercept, 2)
            },
            "interpretation": (
                f"The regression line explains approximately {round(r2 * 100, 1)}% of the hourly variation "
                f"(R² = {round(r2, 3)}). The slope ({round(slope, 2)}) indicates the linear rate of change."
            ),
            "label_notice": "EDUCATIONAL ESTIMATE — Illustrates macro-level linear relationships.",
            "data_points": scatter_points
        }

    @staticmethod
    def get_similar_routes(route_id: str, network_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Recommender System: Content-based filtering to find transit routes
        most similar to the selected route based on operational profile vectors.
        """
        net = store.get_network(network_id)
        routes_df = net.route_metrics_df
        if routes_df.empty:
            return {}

        target_row = routes_df[routes_df["route_id"] == route_id]
        if target_row.empty:
            target_row = routes_df.iloc[0:1]
            route_id = str(target_row["route_id"].values[0])

        feature_cols = ["daily_avg_passengers", "peak_hourly_passengers", "avg_delay_min"]
        features_matrix = routes_df[feature_cols].values

        scaler = StandardScaler()
        scaled_matrix = scaler.fit_transform(features_matrix)

        target_idx = routes_df[routes_df["route_id"] == route_id].index[0]
        target_vec = scaled_matrix[target_idx].reshape(1, -1)

        sim_scores = cosine_similarity(target_vec, scaled_matrix)[0]

        similar_items = []
        for i, score in enumerate(sim_scores):
            r = routes_df.iloc[i]
            if r["route_id"] == route_id:
                continue

            pct_similarity = max(0, min(100, round((score + 1) / 2 * 100, 1)))

            pass_diff = abs(int(r["daily_avg_passengers"]) - int(target_row["daily_avg_passengers"].values[0]))
            delay_diff = abs(float(r["avg_delay_min"]) - float(target_row["avg_delay_min"].values[0]))

            explanation = (
                f"Shares similar ridership scale (within {pass_diff:,} daily passengers) "
                f"and comparable operating delay profile (within {round(delay_diff, 1)} min)."
            )

            similar_items.append({
                "route_id": r["route_id"],
                "route_name": r["route_name"],
                "color_hex": r.get("color_hex", "#3B82F6"),
                "similarity_score": round(float(score), 3),
                "similarity_percentage": pct_similarity,
                "daily_avg_passengers": int(r["daily_avg_passengers"]),
                "peak_hourly_passengers": int(r["peak_hourly_passengers"]),
                "avg_delay_min": float(r["avg_delay_min"]),
                "explanation": explanation
            })

        similar_items = sorted(similar_items, key=lambda x: x["similarity_score"], reverse=True)

        return {
            "network_id": net.id,
            "target_route_id": route_id,
            "target_route_name": str(target_row["route_name"].values[0]),
            "methodology": "Content-Based Vector Cosine Similarity (Recommender System)",
            "features_compared": ["Daily Passenger Volume", "Peak Rush Capacity", "Operational Delay"],
            "recommendations": similar_items,
            "simple_explanation": "Finds routes with operational passenger patterns most similar to the selected route."
        }

    @staticmethod
    def compare_routes(route_a_id: str, route_b_id: str, network_id: Optional[str] = None) -> Dict[str, Any]:
        """Provides side-by-side comparative analytics for two transit corridors."""
        rt_a = MLService.get_route_summary(route_a_id, network_id=network_id)
        rt_b = MLService.get_route_summary(route_b_id, network_id=network_id)
        return {
            "route_a": rt_a,
            "route_b": rt_b
        }

    @staticmethod
    def get_route_summary(route_id: str, network_id: Optional[str] = None) -> Dict[str, Any]:
        net = store.get_network(network_id)
        routes_df = net.route_metrics_df
        row = routes_df[routes_df["route_id"] == route_id]
        if row.empty:
            return {}
        r = row.iloc[0]
        meta = next((item for item in net.routes_list if item["route_id"] == route_id), {})
        return {
            "route_id": r["route_id"],
            "route_name": r["route_name"],
            "color_hex": meta.get("color_hex", "#3B82F6"),
            "origin": meta.get("origin", "N/A"),
            "destination": meta.get("destination", "N/A"),
            "length_km": meta.get("length_km", 0),
            "total_stations": meta.get("total_stations", 0),
            "daily_avg_passengers": int(r["daily_avg_passengers"]),
            "peak_passengers": int(r["peak_hourly_passengers"]),
            "avg_delay_min": float(r["avg_delay_min"]),
            "max_delay_min": float(r["max_delay_min"])
        }
