# TRANSITX — Public Transportation Dataset Source & Provenance

## 1. Overview & Dataset Identity
- **Dataset Name**: Chennai Metropolitan Transit Multi-Corridor Operational Ridership & Headway Dataset (CMT-ORHD)
- **Primary Transportation Network**: Chennai Urban Public Transit System (Metropolitan Metro Rail Corridors & Southern Railway Suburban Rail Lines)
- **Geographic Coverage**: Greater Chennai Metropolitan Area, Tamil Nadu, India (Lat: 12.95°N - 13.15°N, Lon: 80.12°E - 80.30°E)
- **Observation Period**: Multi-week operational baseline (Hourly granularity across representative weekday and weekend cycles, focused on January - February 2024)
- **Data Architecture**: Split into Raw (`data/raw/`) and Clean Processed (`data/processed/`) directories adhering to data governance standards.

## 2. Transit Lines & Corridors
The dataset models five core transit trunk corridors serving the city:
1. **Blue Line (Corridor 1)**: Wimco Nagar / Washermanpet to Chennai Airport via Chennai Central, Anna Salai, and Guindy. (Color: `#2563EB`)
2. **Green Line (Corridor 2)**: Chennai Central to St. Thomas Mount via Egmore, Koyambedu, and Alandur. (Color: `#16A34A`)
3. **Red Line (Suburban South Corridor)**: Chennai Beach / Chennai Central to Tambaram via Egmore, Mambalam (T. Nagar), and Guindy. (Color: `#DC2626`)
4. **Orange Line (MRTS Coastal Corridor)**: Chennai Beach to Velachery via Park Town, Chepauk, Mylapore, and Adyar (Kasturba Nagar). (Color: `#EA580C`)
5. **Purple Line (Suburban West Corridor)**: Chennai Central / Beach to Avadi & Tiruvallur via Perambur and Villivakkam. (Color: `#9333EA`)

## 3. Data Providers & Reference Benchmarks
- **Transit Operators & Sources**:
  1. Chennai Metro Rail Limited (CMRL) Monthly Operational Press Bulletins and Open Data Disclosures.
  2. Southern Railway (SR) Chennai Suburban Passenger Boarding & Headway Statistics.
  3. OpenStreetMap (OSM) Transit / Overpass API for verified station geographic coordinates (WGS-84 coordinate system).
  4. GTFS (General Transit Feed Specification) feed schemas standardizing station sequences, route structures, and stop identifiers.
- **Access Date**: Baseline benchmark synchronized January 2024 (archival reference).

## 4. Attributes & Schema
### Station Dimensions
- `station_id`: Unique identifier (e.g., `ST_CEN_01`, `ST_EGM_02`)
- `station_name`: Official station designation (e.g., `Chennai Central`, `Egmore`, `T. Nagar`)
- `latitude`, `longitude`: WGS-84 decimal degree coordinates
- `lines_served`: Array of transit lines interchanging at the facility
- `is_interchange`: Boolean flag indicating multi-corridor transfer facility
- `zone`: Administrative transport zone (Central, South, North, West, Coastal)
- `station_type`: Physical elevation (`Underground`, `Elevated`, `At-Grade`)

### Route Dimensions
- `route_id`: Unique corridor route identifier (`RT_BLUE`, `RT_GREEN`, `RT_RED`, `RT_ORANGE`, `RT_PURPLE`)
- `route_name`: Line designation
- `line_code`: Abbreviated mnemonic (`BLUE`, `GREEN`, `RED`, `ORG`, `PUR`)
- `color_hex`: Hex color code for cartographic representation
- `origin`, `destination`: Terminal station names
- `length_km`: Total corridor route distance in kilometers
- `total_stations`: Number of active stations on corridor
- `scheduled_headway_min`: Normal scheduled inter-train interval (minutes)

### Operational Records (Time-Series)
- `record_id`: Observation record primary key
- `timestamp`: ISO-8601 formatted timestamp (`YYYY-MM-DD HH:MM:SS`)
- `date`: Calendar date (`YYYY-MM-DD`)
- `hour`: Hour of the day (`0` to `23`)
- `day_of_week`: Day name (`Monday` through `Sunday`)
- `is_weekend`: Binary flag (`0` = Weekday, `1` = Weekend)
- `route_id`, `station_id`: Relational foreign keys
- `passenger_count`: Net hourly passenger flow (boardings + alightings)
- `capacity`: Station nominal throughput capacity per hour
- `occupancy_ratio`: `passenger_count / capacity`
- `delay_minutes`: Average train arrival delay at the station during the hour (minutes)
- `crowd_level`: Semantic categorization (`Low`, `Moderate`, `High`, `Critical`)
- `weather_condition`: Contextual meteorological tag (`Clear`, `Cloudy`, `Humid`, `Rain`)
- `is_anomaly`: Ground truth statistical flag for verification

## 5. Limitations & Transparency Notice
- **Data Aggregation**: Passenger boardings and delays are aggregated to hourly bins to preserve individual privacy while providing robust macro-scale analytics.
- **De-identification**: No personally identifiable information (PII), smart-card numbers, or individual trip sequences are stored, fulfilling syllabus Module 6 requirements.
- **Operational Delays**: Southern Railway suburban delays represent variance against published timetable headways; Metro delays reflect operational signal and terminal turnback variance.
- **Extrapolations**: Late-night operational maintenance hours (00:00 - 04:30) have minimal or zero scheduled service; values are appropriately marked rather than assumed continuous.
