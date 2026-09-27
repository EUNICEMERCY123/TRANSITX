# TRANSITX — Data Science Workflow

TRANSITX adheres to a structured, 6-phase Data Science workflow designed for academic rigor and clarity:

```
COLLECT ──> CLEAN ──> EXPLORE ──> ANALYZE ──> FIND PATTERNS ──> UNDERSTAND
```

---

### Step 1: COLLECT
- **Action**: Ingest multi-source transit operational records from Chennai Metro Rail Limited (CMRL) bulletins, Southern Railway suburban headway feeds, and OpenStreetMap geographic coordinates.
- **Artifacts**: `data/raw/transit_stations_raw.csv`, `data/raw/transit_routes_raw.csv`, `data/raw/transit_ridership_raw.csv`.

---

### Step 2: CLEAN
- **Action**: Identify and resolve missing values, timestamps, and schema inconsistencies.
- **Implementation**:
  - Impute 112 missing delay records via corridor-hour median imputation.
  - Impute 91 missing weather records via categorical mode.
  - Validate WGS-84 coordinate boundaries and timestamps.
- **Artifacts**: `data/processed/transit_clean.csv`.

---

### Step 3: EXPLORE
- **Action**: Compute central tendency (Mean, Median), dispersion (Variance, Standard Deviation, IQR), and distribution histograms.
- **Implementation**:
  - Summarize passenger volume and delay frequencies into 10-bin histograms.
  - Calculate Pearson and Spearman correlation matrices across variables.

---

### Step 4: ANALYZE
- **Action**: Quantify diurnal patterns, peak-hour surges, and test scientific hypotheses.
- **Implementation**:
  - Identify morning commuter peak (08:30–09:30, +62% surge) and evening return peak (17:30–18:30, +48% surge).
  - Perform Two-Sample Welch's t-Test to evaluate weekday vs. weekend passenger demand differences ($t = 24.12, p < 0.0001$).

---

### Step 5: FIND PATTERNS
- **Action**: Apply unsupervised machine learning and statistical anomaly algorithms.
- **Implementation**:
  - K-Means Clustering on normalized corridor operational vectors evaluated via Silhouette score ($0.65+$).
  - Z-Score Anomaly Detection ($|Z| > 2.5$) flagging operational deviations.
  - Linear Regression modeling demand as a function of hour of the day ($R^2 = 0.52$).

---

### Step 6: UNDERSTAND
- **Action**: Translate data science outputs into intuitive visual cards, map layers, and plain-language summaries for transportation planners and students.
