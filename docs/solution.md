# TRANSITX — Solution Overview

## 1. Solution Definition
> **TRANSITX** turns public transportation data into an interactive, visual system that helps users explore passenger demand, identify unusual patterns, understand peak periods, compare routes and stations, and discover useful patterns through data science.

## 2. Core Pillars of the Solution

### Pillar 1: Map-First Operations Command Center
- Real geographic cartography of the Chennai Metropolitan Transit System (47 stations, 5 transit lines).
- Animated, density-calibrated passenger flow along route corridors showing live direction and speed.
- Interactive station pins color-coded by crowd level (Low, Moderate, High, Critical).
- Dynamic time-scrubber with diurnal histogram bars allowing users to inspect network state from 05:00 to 23:00.

### Pillar 2: Explainable Statistical Inference
- Descriptive statistics (Mean, Median, Std Dev, Variance, IQR) calculated across 14,364 verified operational records.
- Pearson & Spearman correlation matrices revealing relationships between passenger volume, time of day, and delays.
- Formal Two-Sample Welch's t-Test verifying statistically significant differences between weekday and weekend travel ($p < 0.001$).

### Pillar 3: Machine Learning & Anomaly Detection
- **Z-Score Anomaly Detection**: Automatically flags station surges ($|Z| > 2.5$) and presents simple percentage deviations (e.g. "+64% above baseline").
- **K-Means Clustering**: Groups corridors into empirical behavioral profiles (High-Density Trunk, Moderate Suburban, and Branch Corridors) evaluated with Silhouette Coefficients ($> 0.65$).
- **Linear Regression**: Fits operational trends with $R^2$, MAE, and RMSE metrics, paired with an interactive educational demand estimator.

### Pillar 4: Recommender System (Content-Based)
- Vector cosine similarity matching across normalized ridership, rush volume, and delays to recommend substitute or complementary transit routes.

### Pillar 5: Data Governance & Ethics
- Privacy preservation through hourly aggregation (zero individual PII).
- Explicit recognition of sampling bias, data quality limits, and non-prescriptive insight communication.
