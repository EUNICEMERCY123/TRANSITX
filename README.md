# TRANSITX — Understanding Public Transportation Through Data

[![Status](https://img.shields.io/badge/Status-Complete%20Production%20Build-success.svg)](#)
[![Python](https://img.shields.io/badge/Python-3.14-green.svg)](#)
[![FastAPI](https://img.shields.io/badge/FastAPI-1.0.0-teal.svg)](#)
[![React](https://img.shields.io/badge/React-19-cyan.svg)](#)
[![MapLibre GL](https://img.shields.io/badge/MapLibre--GL-3D%20Perspective-blue.svg)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](#)

> **TRANSITX** is a modern, publicly deployable **India-wide 3D Public Transportation Data Experience** (*"See how India moves"*). It transforms rapid transit data into interactive visual insights about passenger demand, station occupancy, corridor velocity, moving transit vehicles, and delays.
>
> *Under the hood, TRANSITX implements the complete academic requirements of the Data Science Ecosystem curriculum through rigorous statistical inference, machine learning, and content-based recommendation across multi-city Indian transit networks.*

---

## 1. Product Identity & Problem-Solution

### The Problem
India's rapid transit systems carry tens of millions of commuters daily across dense metropolitan centers. Commuters, transport planners, and students often struggle to understand macro-level urban mobility:
- When and where does extreme crowding materialize?
- How do schedule delays propagate across elevated and underground corridors?
- Which lines behave similarly in commuter usage patterns?

### The Solution
TRANSITX turns operational transit records into an intuitive, solution-first 3D platform that enables users to:
1. **Switch seamlessly between Indian transit networks** (Chennai Metro & Suburban, Delhi Metro / DMRC).
2. **Observe a Living 3D City Visualization** featuring elevated 3D transit tracks, dynamic station pillars, density-scaled passenger particles, and stylized moving metro trains.
3. **Scrub through a 24-hour Time Machine** (05:00 to 23:00) to inspect diurnal commuter shifts.
4. **Access two-level explanations**: Intuitive plain English for everyday riders, plus deep statistical breakdowns for academic and operational evaluation.

---

## 2. Multi-City Transit Network Architecture

TRANSITX features a fully generic, multi-network architecture with dynamic city switching:

### Supported Indian Transit Networks:
1. **Chennai Transit Network (CMRL & Southern Railway)**:
   - **Corridors**: Blue Line (Airport ↔ Washermanpet), Green Line (Central ↔ St. Thomas Mount), Red Line (Beach ↔ Tambaram Suburban), Orange Line (Beach ↔ Velachery MRTS), Purple Line (Central ↔ Tiruvallur Suburban West).
   - **Scale**: 47 active stations, 5 transit corridors, 14,364 verified operational records.
   - **Center**: `13.045° N, 80.235° E` (Pitch: 52°, Bearing: -12°).

2. **Delhi Metro Rail (DMRC & Airport Express)**:
   - **Corridors**: Yellow Line (Samaypur Badli ↔ Millennium City Centre Gurugram), Blue Line (Dwarka Sec 21 ↔ Noida Electronic City), Red Line (Rithala ↔ Shaheed Sthal Ghaziabad), Violet Line (Kashmere Gate ↔ Badarpur Border), Airport Express (New Delhi ↔ IGI Airport T3 ↔ Yashobhoomi Dwarka Sec 25).
   - **Scale**: 47 key stations, 5 rapid transit corridors, 14,098 verified operational records.
   - **Center**: `28.6139° N, 77.2090° E` (Pitch: 54°, Bearing: -15°).

---

## 3. Living 3D City Visualization Engine

- **Technology**: **MapLibre GL JS** (Open-source, WebGL-accelerated).
- **Basemap**: Clean, high-performance Carto Positron vector/raster tiles — **100% free, zero private API keys, zero developer watermarks, zero "API KEY REQUIRED" errors**.
- **3D Perspective Camera**: Default 50°–55° tilt pitch with -15° bearing for realistic city depth. Interactive toggle flips instantly between 2D orthographic and 3D oblique views.
- **3D Elevated Transit Corridors**: Multi-tier corridor rendering with authentic line branding colors, elevation offset, and high-contrast night/day styling.
- **3D Station Nodes & Pillars**: Multi-ring station markers with pulse halos on major interchange hubs (e.g., Chennai Central, Rajiv Chowk, Kashmere Gate) color-coded by real-time crowd occupancy:
  - 🟢 **Normal**: < 45% platform capacity
  - 🟡 **Moderate**: 45% – 75% capacity
  - 🟠 **High**: 75% – 100% capacity
  - 🔴 **Critical**: > 100% capacity
- **Stylized Moving Transit Vehicles (Trains)**: `requestAnimationFrame`-driven metro coaches with headlights moving along route vectors at physically calibrated speeds, scaled to the selected operational hour.
- **WebGL Fallback**: Graceful detection ensures full interface functionality even on devices without hardware WebGL acceleration.

---

## 4. Question-First Navigation Architecture

The interface is structured around natural, user-centered questions:

1. **Overview ("See how India moves")**:
   - Hero banner with instant India network switcher pills.
   - High-level KPIs: Total Ridership (12.8M+), Peak Commuter Hour (09:00 AM), Typical Delay (2.2 min), Primary Interchange Hub.
   - Quick Question cards: *Where is it busy?*, *When is demand highest?*, *Which routes carry the most people?*, etc.

2. **Network ("3D Living Map")**:
   - Interactive 3D MapLibre visualization with moving trains and flow particles.
   - Time Machine scrubber (05:00 to 23:00) with Play/Pause simulation.
   - Station click drawer showing passenger volume, rush hour surge percentage, next arrivals, and quick link to deep insights.

3. **Stations ("Where are people gathering?")**:
   - Ranked passenger volume leaderboard across all network stations.
   - 24-hour diurnal demand area charts.
   - Upcoming train schedule countdowns.

4. **Routes ("Which routes carry the most people?")**:
   - Ranked transit lines by daily ridership, scheduled headways, and corridor length.
   - Station-by-station passenger boarding loads along the line.
   - Side-by-side corridor comparison tool.

5. **Demand ("When is demand highest?")**:
   - Diurnal time-series bar charts highlighting morning rush (08:30–09:30 AM) and evening rush (17:30–19:00 PM).
   - Multi-dimensional filters (by route, station, calendar date).

6. **Delays ("Where are delays happening?")**:
   - Average waiting times and maximum recorded delays by line.
   - Station delay top 10 rankings.
   - Rush-hour delay synchronization trends.

7. **Insights ("Operational Patterns & Intelligence")**:
   - **Two-Level Explanations**:
     - *Level 1 (Commuters/Students)*: Plain-English summary of anomalies, corridor clusters, and demand estimates.
     - *Level 2 ("How was this found?")*: Complete mathematical formulations, centroids, silhouette scores, regression equations, and p-values.

8. **Data ("Data Explorer")**:
   - Paginated, filterable, sortable table across verified operational logs.
   - Export to CSV functionality.

9. **About ("How TRANSITX Works")**:
   - Transparent documentation of data provenance, cleaning pipeline, ethical de-identification, and full-stack architecture.

---

## 5. Data Science Ecosystem Academic Alignment

TRANSITX incorporates the full 5-module curriculum without imposing academic jargon on the end user:

| Module | Data Science Method | TRANSITX Implementation | User-Facing Feature |
| :--- | :--- | :--- | :--- |
| **Module 1** | Ecosystem & Data Pipeline | Python 3.14, Pandas, NumPy, WGS-84 validation | Data Explorer, Multi-City Store |
| **Module 2** | Cleaning & Preprocessing | Median delay imputation, mode weather fill, crowd tiers | Cleaned operational tables |
| **Module 3** | Statistical Inference & Testing | Mean, IQR, Pearson/Spearman matrix, Welch's t-test | Compare Patterns, Delay Trends |
| **Module 4** | Machine Learning Modeling | K-Means clustering, OLS linear regression | Route Profiles, Demand Estimator |
| **Module 5** | Recommender Systems | Content-based vector cosine similarity | Similar Routes Recommender |

---

## 6. API Reference (Multi-City REST API)

All endpoints support both active city parameterization (`?network_id=...`) and explicit network routes (`/api/networks/{network_id}/...`):

- `GET /api/networks` — Returns list of all available Indian transit networks and spatial bounds.
- `GET /api/networks/{network_id}/summary` — High-level ridership, delay, and peak metrics.
- `GET /api/networks/{network_id}/network?date=...&hour=...` — 3D map snapshot with station occupancy and route flows.
- `GET /api/networks/{network_id}/stations` — List of stations with WGS-84 coordinates and lines served.
- `GET /api/networks/{network_id}/stations/{station_id}` — Station diurnal curve, next arrivals, and anomaly history.
- `GET /api/networks/{network_id}/routes` — Corridor lengths, total stations, colors, and line coordinates.
- `GET /api/networks/{network_id}/routes/{route_id}` — Station-by-station corridor loads.
- `GET /api/networks/{network_id}/similar-routes/{route_id}` — Vector cosine similarity recommendations.
- `GET /api/networks/{network_id}/compare-routes?route_a=...&route_b=...` — Side-by-side comparison.
- `GET /api/networks/{network_id}/demand` — Diurnal demand breakdown by route and station.
- `GET /api/networks/{network_id}/delays` — Punctuality rankings and hourly delay curves.
- `GET /api/networks/{network_id}/anomalies` — Z-score baseline outliers (|Z| > 2.5).
- `GET /api/networks/{network_id}/clusters` — K-Means route clustering.
- `POST /api/networks/{network_id}/regression` — OLS linear regression model.
- `GET /api/networks/{network_id}/hypothesis-test` — Two-sample Welch's t-test (Weekday vs. Weekend).
- `GET /api/networks/{network_id}/data` — Paginated records for Data Explorer.

---

## 7. Running the Platform Locally

### Prerequisites
- Python 3.10+ (tested on Python 3.14)
- Node.js 18+ (tested on Node 20+)

### 1. Data Generation
```bash
python data/prepare_dataset.py
```

### 2. Backend Server (FastAPI on Port 8001)
```bash
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8001
```

### 3. Frontend Application (React 19 + MapLibre GL on Port 5173)
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to explore the 3D living network.
