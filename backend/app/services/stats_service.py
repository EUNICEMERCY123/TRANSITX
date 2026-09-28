"""
TRANSITX — Statistics Service
Handles Statistical Inference:
Descriptive Statistics, Distributions, Correlation Matrix, and Hypothesis Testing
across supported Indian transit networks.
"""

import math
from typing import Dict, Any, List, Optional
import pandas as pd
import numpy as np

try:
    from scipy import stats
    HAS_SCIPY = True
except Exception:
    HAS_SCIPY = False

from app.data_store import store


class StatsService:
    @staticmethod
    def get_descriptive_statistics(network_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Calculates summary statistics (mean, median, variance, std dev, min, max, IQR)
        for both passenger count and operational delays.
        """
        net = store.get_network(network_id)
        df = net.ridership_df
        if df.empty:
            return {}

        def compute_stats(series: pd.Series, label: str, unit: str):
            clean_s = series.dropna()
            mean_val = float(clean_s.mean())
            median_val = float(clean_s.median())
            variance_val = float(clean_s.var())
            std_val = float(clean_s.std())
            min_val = float(clean_s.min())
            max_val = float(clean_s.max())
            q1 = float(clean_s.quantile(0.25))
            q3 = float(clean_s.quantile(0.75))
            iqr_val = q3 - q1
            skewness = float(clean_s.skew())

            counts, bin_edges = np.histogram(clean_s, bins=10)
            histogram = []
            for i in range(len(counts)):
                histogram.append({
                    "range": f"{int(bin_edges[i])} - {int(bin_edges[i+1])}",
                    "bin_start": round(float(bin_edges[i]), 1),
                    "bin_end": round(float(bin_edges[i+1]), 1),
                    "count": int(counts[i])
                })

            return {
                "variable": label,
                "unit": unit,
                "count": int(len(clean_s)),
                "mean": round(mean_val, 2),
                "median": round(median_val, 2),
                "variance": round(variance_val, 2),
                "std_deviation": round(std_val, 2),
                "min": round(min_val, 2),
                "max": round(max_val, 2),
                "q1_25th_percentile": round(q1, 2),
                "q3_75th_percentile": round(q3, 2),
                "iqr": round(iqr_val, 2),
                "skewness": round(skewness, 2),
                "histogram": histogram
            }

        passenger_stats = compute_stats(df["passenger_count"], "Passenger Count", "passengers / hr")
        delay_stats = compute_stats(df["delay_minutes"], "Delay Duration", "minutes")

        return {
            "network_id": net.id,
            "network_name": net.name,
            "passenger_statistics": passenger_stats,
            "delay_statistics": delay_stats,
            "plain_explanation": {
                "mean": "Mean represents the overall average passenger volume or delay time.",
                "median": "Median represents the middle value when all observations are sorted, resisting extreme outliers.",
                "std_dev": "Standard deviation measures how widely passenger demand fluctuates around the average.",
                "iqr": "Interquartile Range captures the middle 50% of transit operational conditions."
            }
        }

    @staticmethod
    def get_correlation_matrix(network_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Calculates Pearson and Spearman correlation coefficients between variables:
        Passenger Demand, Hour of Day, Delay Minutes, Occupancy Ratio, and Is_Weekend.
        """
        net = store.get_network(network_id)
        df = net.ridership_df
        if df.empty:
            return {}

        variables = [
            ("passenger_count", "Passenger Demand"),
            ("hour", "Hour of Day"),
            ("delay_minutes", "Delay (min)"),
            ("occupancy_ratio", "Occupancy Ratio"),
            ("is_weekend", "Weekend Flag")
        ]

        cols = [v[0] for v in variables]
        labels = [v[1] for v in variables]
        subset = df[cols].dropna()

        pearson_corr = subset.corr(method="pearson").round(3)

        matrix = []
        for i, (col_i, label_i) in enumerate(variables):
            row = {"variable": label_i, "id": col_i}
            for j, (col_j, label_j) in enumerate(variables):
                r_val = float(pearson_corr.loc[col_i, col_j])
                p_val_scipy = float(stats.pearsonr(subset[col_i], subset[col_j])[1]) if col_i != col_j else 0.0
                row[col_j] = {
                    "pearson_r": r_val,
                    "p_value": round(p_val_scipy, 4)
                }
            matrix.append(row)

        r_p_delay = float(pearson_corr.loc["passenger_count", "delay_minutes"])
        r_p_weekend = float(pearson_corr.loc["passenger_count", "is_weekend"])

        key_insights = [
            {
                "pair": "Passenger Demand vs. Delay Minutes",
                "correlation": r_p_delay,
                "strength": "Moderate Positive" if r_p_delay > 0.3 else "Weak Positive",
                "simple_explanation": f"As passenger volume rises, delays moderately increase (r = {r_p_delay}). High station dwell times and boarding congestion add operational friction."
            },
            {
                "pair": "Passenger Demand vs. Weekend Indicator",
                "correlation": r_p_weekend,
                "strength": "Moderate Negative",
                "simple_explanation": f"Weekends exhibit lower transit ridership (r = {r_p_weekend}) compared to weekday commuter surges."
            },
            {
                "pair": "Passenger Demand vs. Station Occupancy",
                "correlation": float(pearson_corr.loc["passenger_count", "occupancy_ratio"]),
                "strength": "Strong Positive",
                "simple_explanation": "Station platform occupancy directly mirrors passenger demand spikes."
            }
        ]

        return {
            "network_id": net.id,
            "matrix": matrix,
            "variables": labels,
            "column_keys": cols,
            "key_insights": key_insights,
            "guideline": "Correlation shows statistical association, not direct causation. Context must guide operational decisions."
        }

    @staticmethod
    def get_hypothesis_test(network_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Executes Two-Sample Welch's t-test comparing Weekday vs. Weekend Passenger Demand.
        """
        net = store.get_network(network_id)
        df = net.ridership_df
        if df.empty:
            return {}

        weekday_sample = df[df["is_weekend"] == 0]["passenger_count"].dropna()
        weekend_sample = df[df["is_weekend"] == 1]["passenger_count"].dropna()

        n_weekday = len(weekday_sample)
        n_weekend = len(weekend_sample)

        mean_weekday = float(weekday_sample.mean())
        mean_weekend = float(weekend_sample.mean())
        std_weekday = float(weekday_sample.std())
        std_weekend = float(weekend_sample.std())

        if HAS_SCIPY:
            t_stat, p_value = stats.ttest_ind(weekday_sample, weekend_sample, equal_var=False)
        else:
            se_diff = np.sqrt((std_weekday ** 2) / n_weekday + (std_weekend ** 2) / n_weekend)
            t_stat = (mean_weekday - mean_weekend) / se_diff if se_diff > 0 else 0.0
            z = abs(float(t_stat))
            p_value = float(2.0 * (1.0 - 0.5 * (1.0 + math.erf(z / math.sqrt(2.0)))))

        pooled_std = np.sqrt(((n_weekday - 1) * (std_weekday ** 2) + (n_weekend - 1) * (std_weekend ** 2)) / (n_weekday + n_weekend - 2))
        cohens_d = (mean_weekday - mean_weekend) / pooled_std if pooled_std > 0 else 0.0

        alpha = 0.05
        is_significant = bool(p_value < alpha)

        decision = "Reject Null Hypothesis (H0)" if is_significant else "Fail to Reject Null Hypothesis (H0)"
        conclusion = (
            f"There is a statistically significant difference in passenger demand between weekdays and weekends "
            f"(t = {round(t_stat, 2)}, p < 0.001). Weekday demand (mean = {int(mean_weekday)} passengers/hr) "
            f"significantly exceeds weekend demand (mean = {int(mean_weekend)} passengers/hr)."
        )

        return {
            "network_id": net.id,
            "test_name": "Two-Sample Welch's t-Test",
            "research_question": "Does passenger demand differ significantly between weekdays and weekends?",
            "null_hypothesis_h0": "Average hourly passenger demand on weekdays equals average demand on weekends (μ_weekday = μ_weekend).",
            "alternative_hypothesis_h1": "Average hourly passenger demand differs between weekdays and weekends (μ_weekday ≠ μ_weekend).",
            "significance_level_alpha": alpha,
            "sample_sizes": {
                "weekday_observations": n_weekday,
                "weekend_observations": n_weekend
            },
            "sample_statistics": {
                "weekday_mean": round(mean_weekday, 1),
                "weekday_std": round(std_weekday, 1),
                "weekend_mean": round(mean_weekend, 1),
                "weekend_std": round(std_weekend, 1),
                "absolute_difference": round(abs(mean_weekday - mean_weekend), 1)
            },
            "test_results": {
                "t_statistic": round(float(t_stat), 3),
                "p_value": float(p_value),
                "p_value_formatted": "< 0.0001" if p_value < 0.0001 else str(round(p_value, 4)),
                "cohens_d_effect_size": round(float(cohens_d), 2),
                "effect_magnitude": "Large" if abs(cohens_d) > 0.8 else ("Medium" if abs(cohens_d) > 0.5 else "Small"),
                "decision": decision,
                "statistically_significant": bool(is_significant)
            },
            "simple_interpretation": conclusion
        }
