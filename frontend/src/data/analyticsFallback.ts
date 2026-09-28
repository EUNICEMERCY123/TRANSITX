// TRANSITX — Verified High-Fidelity Analytics Fallback Dataset
// Derived directly from the 14,364-record observation dataset.

export const ANALYTICS_DATA: Record<string, any> = {
  "chennai": {
    "demand": {
      "network_id": "chennai",
      "chart_data": [
        {
          "hour": 5,
          "time": "05:00",
          "passengers": 10526,
          "delay": 1.3
        },
        {
          "hour": 6,
          "time": "06:00",
          "passengers": 24623,
          "delay": 1.5
        },
        {
          "hour": 7,
          "time": "07:00",
          "passengers": 45866,
          "delay": 1.8
        },
        {
          "hour": 8,
          "time": "08:00",
          "passengers": 88078,
          "delay": 3.5
        },
        {
          "hour": 9,
          "time": "09:00",
          "passengers": 97898,
          "delay": 3.6
        },
        {
          "hour": 10,
          "time": "10:00",
          "passengers": 67898,
          "delay": 2.1
        },
        {
          "hour": 11,
          "time": "11:00",
          "passengers": 47847,
          "delay": 1.8
        },
        {
          "hour": 12,
          "time": "12:00",
          "passengers": 52157,
          "delay": 1.9
        },
        {
          "hour": 13,
          "time": "13:00",
          "passengers": 49667,
          "delay": 1.9
        },
        {
          "hour": 14,
          "time": "14:00",
          "passengers": 46805,
          "delay": 2.0
        },
        {
          "hour": 15,
          "time": "15:00",
          "passengers": 52599,
          "delay": 2.1
        },
        {
          "hour": 16,
          "time": "16:00",
          "passengers": 64486,
          "delay": 2.1
        },
        {
          "hour": 17,
          "time": "17:00",
          "passengers": 91292,
          "delay": 2.4
        },
        {
          "hour": 18,
          "time": "18:00",
          "passengers": 103283,
          "delay": 3.7
        },
        {
          "hour": 19,
          "time": "19:00",
          "passengers": 86061,
          "delay": 3.4
        },
        {
          "hour": 20,
          "time": "20:00",
          "passengers": 62120,
          "delay": 2.0
        },
        {
          "hour": 21,
          "time": "21:00",
          "passengers": 37996,
          "delay": 1.7
        },
        {
          "hour": 22,
          "time": "22:00",
          "passengers": 20582,
          "delay": 1.5
        },
        {
          "hour": 23,
          "time": "23:00",
          "passengers": 8838,
          "delay": 1.3
        }
      ],
      "overall_hourly_average": 55716,
      "morning_peak": {
        "period": "09:00 \u2013 10:00",
        "passengers": 97898,
        "pct_above_average": 76
      },
      "evening_peak": {
        "period": "18:00 \u2013 19:00",
        "passengers": 103283,
        "pct_above_average": 85
      },
      "lowest_demand_period": {
        "time": "23:00",
        "passengers": 8838
      }
    },
    "delays": {
      "network_id": "chennai",
      "system_avg_delay": 2.2,
      "system_max_delay": 11.4,
      "route_rankings": [
        {
          "route_id": "RT_CHN_RED",
          "route_name": "Red Line (Suburban South)",
          "avg_delay": 2.51,
          "max_delay": 11.4,
          "color_hex": "#B94A3A"
        },
        {
          "route_id": "RT_CHN_BLUE",
          "route_name": "Blue Line",
          "avg_delay": 2.26,
          "max_delay": 10.5,
          "color_hex": "#2F5D50"
        },
        {
          "route_id": "RT_CHN_PURPLE",
          "route_name": "Purple Line (Suburban West)",
          "avg_delay": 2.11,
          "max_delay": 10.7,
          "color_hex": "#7A5C6E"
        },
        {
          "route_id": "RT_CHN_GREEN",
          "route_name": "Green Line",
          "avg_delay": 2.07,
          "max_delay": 11.2,
          "color_hex": "#71805A"
        },
        {
          "route_id": "RT_CHN_ORANGE",
          "route_name": "Orange Line (MRTS)",
          "avg_delay": 2.01,
          "max_delay": 8.8,
          "color_hex": "#C96F4A"
        }
      ],
      "station_rankings": [
        {
          "station_id": "ST_CHN_CEN_11",
          "station_name": "Chennai Central",
          "avg_delay": 3.3,
          "max_delay": 11.4
        },
        {
          "station_id": "ST_CHN_MAM_31",
          "station_name": "T. Nagar (Mambalam)",
          "avg_delay": 3.1,
          "max_delay": 7.0
        },
        {
          "station_id": "ST_CHN_GUI_04",
          "station_name": "Guindy",
          "avg_delay": 2.78,
          "max_delay": 6.8
        },
        {
          "station_id": "ST_CHN_AIR_01",
          "station_name": "Chennai Airport",
          "avg_delay": 2.65,
          "max_delay": 5.9
        },
        {
          "station_id": "ST_CHN_EGM_14",
          "station_name": "Egmore",
          "avg_delay": 2.64,
          "max_delay": 10.6
        },
        {
          "station_id": "ST_CHN_TAM_34",
          "station_name": "Tambaram",
          "avg_delay": 2.6,
          "max_delay": 6.2
        },
        {
          "station_id": "ST_CHN_LIC_10",
          "station_name": "Government Estate",
          "avg_delay": 2.42,
          "max_delay": 5.4
        },
        {
          "station_id": "ST_CHN_VEL_42",
          "station_name": "Velachery",
          "avg_delay": 2.33,
          "max_delay": 5.7
        },
        {
          "station_id": "ST_CHN_KOY_21",
          "station_name": "Koyambedu",
          "avg_delay": 2.32,
          "max_delay": 11.2
        },
        {
          "station_id": "ST_CHN_PRK_28",
          "station_name": "Park Town",
          "avg_delay": 2.3,
          "max_delay": 6.0
        }
      ],
      "hourly_delay_trend": [
        {
          "hour": 5,
          "time": "05:00",
          "avg_delay": 1.34
        },
        {
          "hour": 6,
          "time": "06:00",
          "avg_delay": 1.54
        },
        {
          "hour": 7,
          "time": "07:00",
          "avg_delay": 1.81
        },
        {
          "hour": 8,
          "time": "08:00",
          "avg_delay": 3.49
        },
        {
          "hour": 9,
          "time": "09:00",
          "avg_delay": 3.58
        },
        {
          "hour": 10,
          "time": "10:00",
          "avg_delay": 2.1
        },
        {
          "hour": 11,
          "time": "11:00",
          "avg_delay": 1.84
        },
        {
          "hour": 12,
          "time": "12:00",
          "avg_delay": 1.94
        },
        {
          "hour": 13,
          "time": "13:00",
          "avg_delay": 1.9
        },
        {
          "hour": 14,
          "time": "14:00",
          "avg_delay": 1.98
        },
        {
          "hour": 15,
          "time": "15:00",
          "avg_delay": 2.07
        },
        {
          "hour": 16,
          "time": "16:00",
          "avg_delay": 2.12
        },
        {
          "hour": 17,
          "time": "17:00",
          "avg_delay": 2.43
        },
        {
          "hour": 18,
          "time": "18:00",
          "avg_delay": 3.65
        },
        {
          "hour": 19,
          "time": "19:00",
          "avg_delay": 3.42
        },
        {
          "hour": 20,
          "time": "20:00",
          "avg_delay": 2.02
        },
        {
          "hour": 21,
          "time": "21:00",
          "avg_delay": 1.7
        },
        {
          "hour": 22,
          "time": "22:00",
          "avg_delay": 1.5
        },
        {
          "hour": 23,
          "time": "23:00",
          "avg_delay": 1.32
        }
      ]
    },
    "anomalies": {
      "network_id": "chennai",
      "total_anomalies": 14,
      "detection_method": "Z-score baseline deviation (|z| > 2.5 on station-hour-day distribution)",
      "anomalies": [
        {
          "record_id": "REC_CHE_14902",
          "date": "2024-01-19",
          "hour": 19,
          "time": "19:00",
          "route_name": "Orange Line (MRTS)",
          "station_name": "Chepauk",
          "observed_passengers": 3988,
          "expected_baseline": 1750.0,
          "pct_deviation": 127.9,
          "z_score": 2.82,
          "status": "Unusually High Demand",
          "explanation": "Passenger demand was 127.9% higher than the typical baseline for this station at 19:00."
        },
        {
          "record_id": "REC_CHE_14956",
          "date": "2024-01-19",
          "hour": 20,
          "time": "20:00",
          "route_name": "Orange Line (MRTS)",
          "station_name": "Chepauk",
          "observed_passengers": 2481,
          "expected_baseline": 1253.8,
          "pct_deviation": 97.9,
          "z_score": 2.7,
          "status": "Unusually High Demand",
          "explanation": "Passenger demand was 97.9% higher than the typical baseline for this station at 20:00."
        },
        {
          "record_id": "REC_CHE_14848",
          "date": "2024-01-19",
          "hour": 18,
          "time": "18:00",
          "route_name": "Orange Line (MRTS)",
          "station_name": "Chepauk",
          "observed_passengers": 3988,
          "expected_baseline": 2029.6,
          "pct_deviation": 96.5,
          "z_score": 2.8,
          "status": "Unusually High Demand",
          "explanation": "Passenger demand was 96.5% higher than the typical baseline for this station at 18:00."
        },
        {
          "record_id": "REC_CHE_10246",
          "date": "2024-01-15",
          "hour": 9,
          "time": "09:00",
          "route_name": "Red Line (Suburban South)",
          "station_name": "Chennai Central",
          "observed_passengers": 9098,
          "expected_baseline": 5111.1,
          "pct_deviation": 78.0,
          "z_score": 3.34,
          "status": "Unusually High Demand",
          "explanation": "Passenger demand was 78.0% higher than the typical baseline for this station at 09:00."
        },
        {
          "record_id": "REC_CHE_10173",
          "date": "2024-01-15",
          "hour": 8,
          "time": "08:00",
          "route_name": "Blue Line",
          "station_name": "Chennai Central",
          "observed_passengers": 7857,
          "expected_baseline": 4646.7,
          "pct_deviation": 69.1,
          "z_score": 2.99,
          "status": "Unusually High Demand",
          "explanation": "Passenger demand was 69.1% higher than the typical baseline for this station at 08:00."
        },
        {
          "record_id": "REC_CHE_10227",
          "date": "2024-01-15",
          "hour": 9,
          "time": "09:00",
          "route_name": "Blue Line",
          "station_name": "Chennai Central",
          "observed_passengers": 8385,
          "expected_baseline": 5111.1,
          "pct_deviation": 64.1,
          "z_score": 2.74,
          "status": "Unusually High Demand",
          "explanation": "Passenger demand was 64.1% higher than the typical baseline for this station at 09:00."
        },
        {
          "record_id": "REC_CHE_13869",
          "date": "2024-01-18",
          "hour": 19,
          "time": "19:00",
          "route_name": "Red Line (Suburban South)",
          "station_name": "Guindy",
          "observed_passengers": 3881,
          "expected_baseline": 3130.8,
          "pct_deviation": 24.0,
          "z_score": 2.68,
          "status": "Unusually High Demand",
          "explanation": "Passenger demand was 24.0% higher than the typical baseline for this station at 19:00."
        },
        {
          "record_id": "REC_CHE_10328",
          "date": "2024-01-15",
          "hour": 11,
          "time": "11:00",
          "route_name": "Blue Line",
          "station_name": "Guindy",
          "observed_passengers": 2175,
          "expected_baseline": 1772.8,
          "pct_deviation": 22.7,
          "z_score": 2.88,
          "status": "Unusually High Demand",
          "explanation": "Passenger demand was 22.7% higher than the typical baseline for this station at 11:00."
        },
        {
          "record_id": "REC_CHE_19081",
          "date": "2024-01-23",
          "hour": 21,
          "time": "21:00",
          "route_name": "Blue Line",
          "station_name": "Thousand Lights",
          "observed_passengers": 651,
          "expected_baseline": 548.7,
          "pct_deviation": 18.6,
          "z_score": 2.53,
          "status": "Unusually High Demand",
          "explanation": "Passenger demand was 18.6% higher than the typical baseline for this station at 21:00."
        },
        {
          "record_id": "REC_CHE_12424",
          "date": "2024-01-17",
          "hour": 11,
          "time": "11:00",
          "route_name": "Orange Line (MRTS)",
          "station_name": "Velachery",
          "observed_passengers": 893,
          "expected_baseline": 1054.6,
          "pct_deviation": -15.3,
          "z_score": -2.59,
          "status": "Unusually Low Demand",
          "explanation": "Passenger demand was 15.3% lower than the typical baseline for this station at 11:00."
        },
        {
          "record_id": "REC_CHE_12502",
          "date": "2024-01-17",
          "hour": 13,
          "time": "13:00",
          "route_name": "Green Line",
          "station_name": "Shenoy Nagar",
          "observed_passengers": 474,
          "expected_baseline": 588.8,
          "pct_deviation": -19.5,
          "z_score": -2.61,
          "status": "Unusually Low Demand",
          "explanation": "Passenger demand was 19.5% lower than the typical baseline for this station at 13:00."
        },
        {
          "record_id": "REC_CHE_14083",
          "date": "2024-01-18",
          "hour": 23,
          "time": "23:00",
          "route_name": "Red Line (Suburban South)",
          "station_name": "Kodambakkam",
          "observed_passengers": 105,
          "expected_baseline": 137.1,
          "pct_deviation": -23.4,
          "z_score": -2.7,
          "status": "Unusually Low Demand",
          "explanation": "Passenger demand was 23.4% lower than the typical baseline for this station at 23:00."
        },
        {
          "record_id": "REC_CHE_15108",
          "date": "2024-01-19",
          "hour": 23,
          "time": "23:00",
          "route_name": "Red Line (Suburban South)",
          "station_name": "Nungambakkam",
          "observed_passengers": 103,
          "expected_baseline": 139.6,
          "pct_deviation": -26.2,
          "z_score": -2.63,
          "status": "Unusually Low Demand",
          "explanation": "Passenger demand was 26.2% lower than the typical baseline for this station at 23:00."
        },
        {
          "record_id": "REC_CHE_19927",
          "date": "2024-01-24",
          "hour": 17,
          "time": "17:00",
          "route_name": "Orange Line (MRTS)",
          "station_name": "Adyar (Kasturba)",
          "observed_passengers": 1425,
          "expected_baseline": 1970.4,
          "pct_deviation": -27.7,
          "z_score": -2.55,
          "status": "Unusually Low Demand",
          "explanation": "Passenger demand was 27.7% lower than the typical baseline for this station at 17:00."
        }
      ],
      "guideline": "Anomalies represent statistical outliers. They do not assume an operational cause without external validation."
    },
    "clusters": {
      "network_id": "chennai",
      "algorithm": "K-Means Clustering",
      "k_clusters": 3,
      "silhouette_score": 0.274,
      "features_used": [
        "Daily Average Passengers",
        "Peak Hourly Passengers",
        "Average Delay (min)"
      ],
      "clusters": [
        {
          "cluster_id": 0,
          "profile_name": "High-Density Trunk Corridors",
          "route_count": 2,
          "avg_daily_passengers": 294271,
          "avg_peak_passengers": 8742,
          "avg_delay_min": 2.38,
          "simple_explanation": "Routes with very high daily passenger demand and intensive rush-hour crowding.",
          "routes": [
            {
              "route_id": "RT_CHN_BLUE",
              "route_name": "Blue Line",
              "color_hex": "#2563EB",
              "daily_avg_passengers": 278661,
              "peak_passengers": 8385,
              "avg_delay_min": 2.26
            },
            {
              "route_id": "RT_CHN_RED",
              "route_name": "Red Line (Suburban South)",
              "color_hex": "#DC2626",
              "daily_avg_passengers": 309881,
              "peak_passengers": 9098,
              "avg_delay_min": 2.51
            }
          ]
        },
        {
          "cluster_id": 1,
          "profile_name": "High-Density Trunk Corridors",
          "route_count": 2,
          "avg_daily_passengers": 153136,
          "avg_peak_passengers": 6828,
          "avg_delay_min": 2.09,
          "simple_explanation": "Routes with very high daily passenger demand and intensive rush-hour crowding.",
          "routes": [
            {
              "route_id": "RT_CHN_GREEN",
              "route_name": "Green Line",
              "color_hex": "#16A34A",
              "daily_avg_passengers": 199766,
              "peak_passengers": 6524,
              "avg_delay_min": 2.07
            },
            {
              "route_id": "RT_CHN_PURPLE",
              "route_name": "Purple Line (Suburban West)",
              "color_hex": "#9333EA",
              "daily_avg_passengers": 106505,
              "peak_passengers": 7132,
              "avg_delay_min": 2.11
            }
          ]
        },
        {
          "cluster_id": 2,
          "profile_name": "High-Density Trunk Corridors",
          "route_count": 1,
          "avg_daily_passengers": 163809,
          "avg_peak_passengers": 3988,
          "avg_delay_min": 2.01,
          "simple_explanation": "Routes with very high daily passenger demand and intensive rush-hour crowding.",
          "routes": [
            {
              "route_id": "RT_CHN_ORANGE",
              "route_name": "Orange Line (MRTS)",
              "color_hex": "#EA580C",
              "daily_avg_passengers": 163809,
              "peak_passengers": 3988,
              "avg_delay_min": 2.01
            }
          ]
        }
      ],
      "simple_definition": "K-Means groups routes that have similar passenger demand and delay patterns together."
    },
    "regression": {
      "network_id": "chennai",
      "model_type": "Simple Linear Regression",
      "formula": "Passenger Demand = -0.38 \u00d7 (Hour of Day (24-hour format)) + 969.79",
      "independent_variable": "Hour of Day (24-hour format)",
      "dependent_variable": "Average Passenger Demand",
      "metrics": {
        "r_squared": 0.0,
        "mae": 408.4,
        "rmse": 510.8,
        "slope": -0.375,
        "intercept": 969.79
      },
      "interpretation": "The regression line explains approximately 0.0% of the hourly variation (R\u00b2 = 0.0). The slope (-0.38) indicates the linear rate of change.",
      "label_notice": "EDUCATIONAL ESTIMATE \u2014 Illustrates macro-level linear relationships.",
      "data_points": [
        {
          "x": 5.0,
          "y": 212,
          "predicted_y": 968,
          "is_weekend": false
        },
        {
          "x": 5.0,
          "y": 153,
          "predicted_y": 968,
          "is_weekend": true
        },
        {
          "x": 6.0,
          "y": 496,
          "predicted_y": 968,
          "is_weekend": false
        },
        {
          "x": 6.0,
          "y": 356,
          "predicted_y": 968,
          "is_weekend": true
        },
        {
          "x": 7.0,
          "y": 925,
          "predicted_y": 967,
          "is_weekend": false
        },
        {
          "x": 7.0,
          "y": 661,
          "predicted_y": 967,
          "is_weekend": true
        },
        {
          "x": 8.0,
          "y": 1777,
          "predicted_y": 967,
          "is_weekend": false
        },
        {
          "x": 8.0,
          "y": 1267,
          "predicted_y": 967,
          "is_weekend": true
        },
        {
          "x": 9.0,
          "y": 1975,
          "predicted_y": 966,
          "is_weekend": false
        },
        {
          "x": 9.0,
          "y": 1408,
          "predicted_y": 966,
          "is_weekend": true
        },
        {
          "x": 10.0,
          "y": 1370,
          "predicted_y": 966,
          "is_weekend": false
        },
        {
          "x": 10.0,
          "y": 976,
          "predicted_y": 966,
          "is_weekend": true
        },
        {
          "x": 11.0,
          "y": 963,
          "predicted_y": 966,
          "is_weekend": false
        },
        {
          "x": 11.0,
          "y": 695,
          "predicted_y": 966,
          "is_weekend": true
        },
        {
          "x": 12.0,
          "y": 1051,
          "predicted_y": 965,
          "is_weekend": false
        },
        {
          "x": 12.0,
          "y": 753,
          "predicted_y": 965,
          "is_weekend": true
        },
        {
          "x": 13.0,
          "y": 1000,
          "predicted_y": 965,
          "is_weekend": false
        },
        {
          "x": 13.0,
          "y": 718,
          "predicted_y": 965,
          "is_weekend": true
        },
        {
          "x": 14.0,
          "y": 944,
          "predicted_y": 965,
          "is_weekend": false
        },
        {
          "x": 14.0,
          "y": 674,
          "predicted_y": 965,
          "is_weekend": true
        },
        {
          "x": 15.0,
          "y": 1060,
          "predicted_y": 964,
          "is_weekend": false
        },
        {
          "x": 15.0,
          "y": 759,
          "predicted_y": 964,
          "is_weekend": true
        },
        {
          "x": 16.0,
          "y": 1293,
          "predicted_y": 964,
          "is_weekend": false
        },
        {
          "x": 16.0,
          "y": 948,
          "predicted_y": 964,
          "is_weekend": true
        },
        {
          "x": 17.0,
          "y": 1833,
          "predicted_y": 963,
          "is_weekend": false
        },
        {
          "x": 17.0,
          "y": 1336,
          "predicted_y": 963,
          "is_weekend": true
        },
        {
          "x": 18.0,
          "y": 2077,
          "predicted_y": 963,
          "is_weekend": false
        },
        {
          "x": 18.0,
          "y": 1502,
          "predicted_y": 963,
          "is_weekend": true
        },
        {
          "x": 19.0,
          "y": 1731,
          "predicted_y": 963,
          "is_weekend": false
        },
        {
          "x": 19.0,
          "y": 1251,
          "predicted_y": 963,
          "is_weekend": true
        },
        {
          "x": 20.0,
          "y": 1250,
          "predicted_y": 962,
          "is_weekend": false
        },
        {
          "x": 20.0,
          "y": 901,
          "predicted_y": 962,
          "is_weekend": true
        },
        {
          "x": 21.0,
          "y": 762,
          "predicted_y": 962,
          "is_weekend": false
        },
        {
          "x": 21.0,
          "y": 557,
          "predicted_y": 962,
          "is_weekend": true
        },
        {
          "x": 22.0,
          "y": 414,
          "predicted_y": 962,
          "is_weekend": false
        },
        {
          "x": 22.0,
          "y": 299,
          "predicted_y": 962,
          "is_weekend": true
        },
        {
          "x": 23.0,
          "y": 178,
          "predicted_y": 961,
          "is_weekend": false
        },
        {
          "x": 23.0,
          "y": 129,
          "predicted_y": 961,
          "is_weekend": true
        }
      ]
    },
    "descriptive_stats": {
      "network_id": "chennai",
      "network_name": "Chennai Transit Network",
      "passenger_statistics": {
        "variable": "Passenger Count",
        "unit": "passengers / hr",
        "count": 14364,
        "mean": 1031.8,
        "median": 775.0,
        "variance": 774714.84,
        "std_deviation": 880.18,
        "min": 35.0,
        "max": 9098.0,
        "q1_25th_percentile": 482.0,
        "q3_75th_percentile": 1295.0,
        "iqr": 813.0,
        "skewness": 2.13,
        "histogram": [
          {
            "range": "35 - 941",
            "bin_start": 35.0,
            "bin_end": 941.3,
            "count": 8478
          },
          {
            "range": "941 - 1847",
            "bin_start": 941.3,
            "bin_end": 1847.6,
            "count": 3931
          },
          {
            "range": "1847 - 2753",
            "bin_start": 1847.6,
            "bin_end": 2753.9,
            "count": 1158
          },
          {
            "range": "2753 - 3660",
            "bin_start": 2753.9,
            "bin_end": 3660.2,
            "count": 483
          },
          {
            "range": "3660 - 4566",
            "bin_start": 3660.2,
            "bin_end": 4566.5,
            "count": 200
          },
          {
            "range": "4566 - 5472",
            "bin_start": 4566.5,
            "bin_end": 5472.8,
            "count": 77
          },
          {
            "range": "5472 - 6379",
            "bin_start": 5472.8,
            "bin_end": 6379.1,
            "count": 28
          },
          {
            "range": "6379 - 7285",
            "bin_start": 6379.1,
            "bin_end": 7285.4,
            "count": 6
          },
          {
            "range": "7285 - 8191",
            "bin_start": 7285.4,
            "bin_end": 8191.7,
            "count": 1
          },
          {
            "range": "8191 - 9098",
            "bin_start": 8191.7,
            "bin_end": 9098.0,
            "count": 2
          }
        ]
      },
      "delay_statistics": {
        "variable": "Delay Duration",
        "unit": "minutes",
        "count": 14364,
        "mean": 2.2,
        "median": 1.9,
        "variance": 1.43,
        "std_deviation": 1.2,
        "min": 0.2,
        "max": 11.4,
        "q1_25th_percentile": 1.4,
        "q3_75th_percentile": 2.7,
        "iqr": 1.3,
        "skewness": 1.51,
        "histogram": [
          {
            "range": "0 - 1",
            "bin_start": 0.2,
            "bin_end": 1.3,
            "count": 3275
          },
          {
            "range": "1 - 2",
            "bin_start": 1.3,
            "bin_end": 2.4,
            "count": 6515
          },
          {
            "range": "2 - 3",
            "bin_start": 2.4,
            "bin_end": 3.6,
            "count": 2754
          },
          {
            "range": "3 - 4",
            "bin_start": 3.6,
            "bin_end": 4.7,
            "count": 1246
          },
          {
            "range": "4 - 5",
            "bin_start": 4.7,
            "bin_end": 5.8,
            "count": 404
          },
          {
            "range": "5 - 6",
            "bin_start": 5.8,
            "bin_end": 6.9,
            "count": 113
          },
          {
            "range": "6 - 8",
            "bin_start": 6.9,
            "bin_end": 8.0,
            "count": 21
          },
          {
            "range": "8 - 9",
            "bin_start": 8.0,
            "bin_end": 9.2,
            "count": 14
          },
          {
            "range": "9 - 10",
            "bin_start": 9.2,
            "bin_end": 10.3,
            "count": 16
          },
          {
            "range": "10 - 11",
            "bin_start": 10.3,
            "bin_end": 11.4,
            "count": 6
          }
        ]
      },
      "plain_explanation": {
        "mean": "Mean represents the overall average passenger volume or delay time.",
        "median": "Median represents the middle value when all observations are sorted, resisting extreme outliers.",
        "std_dev": "Standard deviation measures how widely passenger demand fluctuates around the average.",
        "iqr": "Interquartile Range captures the middle 50% of transit operational conditions."
      }
    },
    "correlation": {
      "network_id": "chennai",
      "matrix": [
        {
          "variable": "Passenger Demand",
          "id": "passenger_count",
          "passenger_count": {
            "pearson_r": 1.0,
            "p_value": 0.0
          },
          "hour": {
            "pearson_r": -0.004,
            "p_value": 0.6613
          },
          "delay_minutes": {
            "pearson_r": 0.718,
            "p_value": 0.0
          },
          "occupancy_ratio": {
            "pearson_r": 0.686,
            "p_value": 0.0
          },
          "is_weekend": {
            "pearson_r": -0.161,
            "p_value": 0.0
          }
        },
        {
          "variable": "Hour of Day",
          "id": "hour",
          "passenger_count": {
            "pearson_r": -0.004,
            "p_value": 0.6613
          },
          "hour": {
            "pearson_r": 1.0,
            "p_value": 0.0
          },
          "delay_minutes": {
            "pearson_r": -0.019,
            "p_value": 0.0227
          },
          "occupancy_ratio": {
            "pearson_r": -0.005,
            "p_value": 0.5779
          },
          "is_weekend": {
            "pearson_r": -0.0,
            "p_value": 1.0
          }
        },
        {
          "variable": "Delay (min)",
          "id": "delay_minutes",
          "passenger_count": {
            "pearson_r": 0.718,
            "p_value": 0.0
          },
          "hour": {
            "pearson_r": -0.019,
            "p_value": 0.0227
          },
          "delay_minutes": {
            "pearson_r": 1.0,
            "p_value": 0.0
          },
          "occupancy_ratio": {
            "pearson_r": 0.648,
            "p_value": 0.0
          },
          "is_weekend": {
            "pearson_r": -0.213,
            "p_value": 0.0
          }
        },
        {
          "variable": "Occupancy Ratio",
          "id": "occupancy_ratio",
          "passenger_count": {
            "pearson_r": 0.686,
            "p_value": 0.0
          },
          "hour": {
            "pearson_r": -0.005,
            "p_value": 0.5779
          },
          "delay_minutes": {
            "pearson_r": 0.648,
            "p_value": 0.0
          },
          "occupancy_ratio": {
            "pearson_r": 1.0,
            "p_value": 0.0
          },
          "is_weekend": {
            "pearson_r": -0.249,
            "p_value": 0.0
          }
        },
        {
          "variable": "Weekend Flag",
          "id": "is_weekend",
          "passenger_count": {
            "pearson_r": -0.161,
            "p_value": 0.0
          },
          "hour": {
            "pearson_r": -0.0,
            "p_value": 1.0
          },
          "delay_minutes": {
            "pearson_r": -0.213,
            "p_value": 0.0
          },
          "occupancy_ratio": {
            "pearson_r": -0.249,
            "p_value": 0.0
          },
          "is_weekend": {
            "pearson_r": 1.0,
            "p_value": 0.0
          }
        }
      ],
      "variables": [
        "Passenger Demand",
        "Hour of Day",
        "Delay (min)",
        "Occupancy Ratio",
        "Weekend Flag"
      ],
      "column_keys": [
        "passenger_count",
        "hour",
        "delay_minutes",
        "occupancy_ratio",
        "is_weekend"
      ],
      "key_insights": [
        {
          "pair": "Passenger Demand vs. Delay Minutes",
          "correlation": 0.718,
          "strength": "Moderate Positive",
          "simple_explanation": "As passenger volume rises, delays moderately increase (r = 0.718). High station dwell times and boarding congestion add operational friction."
        },
        {
          "pair": "Passenger Demand vs. Weekend Indicator",
          "correlation": -0.161,
          "strength": "Moderate Negative",
          "simple_explanation": "Weekends exhibit lower transit ridership (r = -0.161) compared to weekday commuter surges."
        },
        {
          "pair": "Passenger Demand vs. Station Occupancy",
          "correlation": 0.686,
          "strength": "Strong Positive",
          "simple_explanation": "Station platform occupancy directly mirrors passenger demand spikes."
        }
      ],
      "guideline": "Correlation shows statistical association, not direct causation. Context must guide operational decisions."
    },
    "hypothesis": {
      "network_id": "chennai",
      "test_name": "Two-Sample Welch's t-Test",
      "research_question": "Does passenger demand differ significantly between weekdays and weekends?",
      "null_hypothesis_h0": "Average hourly passenger demand on weekdays equals average demand on weekends (\u03bc_weekday = \u03bc_weekend).",
      "alternative_hypothesis_h1": "Average hourly passenger demand differs between weekdays and weekends (\u03bc_weekday \u2260 \u03bc_weekend).",
      "significance_level_alpha": 0.05,
      "sample_sizes": {
        "weekday_observations": 10260,
        "weekend_observations": 4104
      },
      "sample_statistics": {
        "weekday_mean": 1121.5,
        "weekday_std": 935.7,
        "weekend_mean": 807.6,
        "weekend_std": 672.5,
        "absolute_difference": 313.9
      },
      "test_results": {
        "t_statistic": 22.449,
        "p_value": 4.926905080405568e-109,
        "p_value_formatted": "< 0.0001",
        "cohens_d_effect_size": 0.36,
        "effect_magnitude": "Small",
        "decision": "Reject Null Hypothesis (H0)",
        "statistically_significant": true
      },
      "simple_interpretation": "There is a statistically significant difference in passenger demand between weekdays and weekends (t = 22.45, p < 0.001). Weekday demand (mean = 1121 passengers/hr) significantly exceeds weekend demand (mean = 807 passengers/hr)."
    },
    "route_details": {
      "RT_CHN_BLUE": {
        "network_id": "chennai",
        "route_id": "RT_CHN_BLUE",
        "route_name": "Blue Line",
        "line_code": "BLUE",
        "color_hex": "#2F5D50",
        "origin": "Chennai Airport",
        "destination": "Washermanpet",
        "length_km": 23.1,
        "total_stations": 13,
        "scheduled_headway_min": 5.0,
        "total_passengers": 3901259,
        "daily_avg_passengers": 278661,
        "avg_delay_min": 2.26,
        "peak_hour": "18:00",
        "corridor_stations": [
          {
            "station_id": "ST_CHN_AIR_01",
            "station_name": "Chennai Airport",
            "latitude": 12.979,
            "longitude": 80.165,
            "is_interchange": false,
            "average_passengers": 1692,
            "peak_passengers": 3804,
            "average_delay_min": 2.6
          },
          {
            "station_id": "ST_CHN_MEA_02",
            "station_name": "Meenambakkam",
            "latitude": 12.986,
            "longitude": 80.177,
            "is_interchange": false,
            "average_passengers": 765,
            "peak_passengers": 1760,
            "average_delay_min": 2.0
          },
          {
            "station_id": "ST_CHN_ALN_03",
            "station_name": "Alandur",
            "latitude": 13.0035,
            "longitude": 80.2015,
            "is_interchange": true,
            "average_passengers": 765,
            "peak_passengers": 1748,
            "average_delay_min": 2.0
          },
          {
            "station_id": "ST_CHN_GUI_04",
            "station_name": "Guindy",
            "latitude": 13.009,
            "longitude": 80.213,
            "is_interchange": true,
            "average_passengers": 1878,
            "peak_passengers": 4259,
            "average_delay_min": 2.8
          },
          {
            "station_id": "ST_CHN_SAI_05",
            "station_name": "Saidapet",
            "latitude": 13.02,
            "longitude": 80.228,
            "is_interchange": false,
            "average_passengers": 767,
            "peak_passengers": 1750,
            "average_delay_min": 2.0
          },
          {
            "station_id": "ST_CHN_NAN_06",
            "station_name": "Nandanam",
            "latitude": 13.028,
            "longitude": 80.2405,
            "is_interchange": false,
            "average_passengers": 754,
            "peak_passengers": 1706,
            "average_delay_min": 1.9
          },
          {
            "station_id": "ST_CHN_TEY_07",
            "station_name": "Teynampet",
            "latitude": 13.036,
            "longitude": 80.244,
            "is_interchange": false,
            "average_passengers": 762,
            "peak_passengers": 1627,
            "average_delay_min": 2.0
          },
          {
            "station_id": "ST_CHN_AGD_08",
            "station_name": "AG-DMS",
            "latitude": 13.044,
            "longitude": 80.2475,
            "is_interchange": false,
            "average_passengers": 771,
            "peak_passengers": 1768,
            "average_delay_min": 2.0
          },
          {
            "station_id": "ST_CHN_THO_09",
            "station_name": "Thousand Lights",
            "latitude": 13.056,
            "longitude": 80.252,
            "is_interchange": false,
            "average_passengers": 764,
            "peak_passengers": 1677,
            "average_delay_min": 2.0
          },
          {
            "station_id": "ST_CHN_LIC_10",
            "station_name": "Government Estate",
            "latitude": 13.0673,
            "longitude": 80.2701,
            "is_interchange": false,
            "average_passengers": 1298,
            "peak_passengers": 3037,
            "average_delay_min": 2.4
          },
          {
            "station_id": "ST_CHN_CEN_11",
            "station_name": "Chennai Central",
            "latitude": 13.0827,
            "longitude": 80.2755,
            "is_interchange": true,
            "average_passengers": 2920,
            "peak_passengers": 8385,
            "average_delay_min": 3.6
          },
          {
            "station_id": "ST_CHN_HIG_12",
            "station_name": "High Court",
            "latitude": 13.088,
            "longitude": 80.287,
            "is_interchange": false,
            "average_passengers": 768,
            "peak_passengers": 1794,
            "average_delay_min": 2.0
          },
          {
            "station_id": "ST_CHN_WAS_13",
            "station_name": "Washermanpet",
            "latitude": 13.107,
            "longitude": 80.289,
            "is_interchange": false,
            "average_passengers": 755,
            "peak_passengers": 1702,
            "average_delay_min": 2.0
          }
        ],
        "hourly_demand": [
          {
            "hour": 5,
            "time": "05:00",
            "passengers": 2790,
            "delay": 1.4
          },
          {
            "hour": 6,
            "time": "06:00",
            "passengers": 6486,
            "delay": 1.6
          },
          {
            "hour": 7,
            "time": "07:00",
            "passengers": 12038,
            "delay": 1.9
          },
          {
            "hour": 8,
            "time": "08:00",
            "passengers": 23334,
            "delay": 3.6
          },
          {
            "hour": 9,
            "time": "09:00",
            "passengers": 25464,
            "delay": 3.7
          },
          {
            "hour": 10,
            "time": "10:00",
            "passengers": 17912,
            "delay": 2.2
          },
          {
            "hour": 11,
            "time": "11:00",
            "passengers": 12645,
            "delay": 1.9
          },
          {
            "hour": 12,
            "time": "12:00",
            "passengers": 13786,
            "delay": 2.0
          },
          {
            "hour": 13,
            "time": "13:00",
            "passengers": 13042,
            "delay": 2.0
          },
          {
            "hour": 14,
            "time": "14:00",
            "passengers": 12253,
            "delay": 1.9
          },
          {
            "hour": 15,
            "time": "15:00",
            "passengers": 13917,
            "delay": 2.0
          },
          {
            "hour": 16,
            "time": "16:00",
            "passengers": 16780,
            "delay": 2.2
          },
          {
            "hour": 17,
            "time": "17:00",
            "passengers": 23866,
            "delay": 2.6
          },
          {
            "hour": 18,
            "time": "18:00",
            "passengers": 27477,
            "delay": 3.8
          },
          {
            "hour": 19,
            "time": "19:00",
            "passengers": 22833,
            "delay": 3.5
          },
          {
            "hour": 20,
            "time": "20:00",
            "passengers": 16238,
            "delay": 2.1
          },
          {
            "hour": 21,
            "time": "21:00",
            "passengers": 10084,
            "delay": 1.7
          },
          {
            "hour": 22,
            "time": "22:00",
            "passengers": 5397,
            "delay": 1.6
          },
          {
            "hour": 23,
            "time": "23:00",
            "passengers": 2319,
            "delay": 1.3
          }
        ]
      },
      "RT_CHN_GREEN": {
        "network_id": "chennai",
        "route_id": "RT_CHN_GREEN",
        "route_name": "Green Line",
        "line_code": "GREEN",
        "color_hex": "#71805A",
        "origin": "Chennai Central",
        "destination": "St. Thomas Mount",
        "length_km": 22.0,
        "total_stations": 13,
        "scheduled_headway_min": 6.0,
        "total_passengers": 2796730,
        "daily_avg_passengers": 199766,
        "avg_delay_min": 2.07,
        "peak_hour": "18:00",
        "corridor_stations": [
          {
            "station_id": "ST_CHN_CEN_11",
            "station_name": "Chennai Central",
            "latitude": 13.0827,
            "longitude": 80.2755,
            "is_interchange": true,
            "average_passengers": 2186,
            "peak_passengers": 6524,
            "average_delay_min": 3.1
          },
          {
            "station_id": "ST_CHN_EGM_14",
            "station_name": "Egmore",
            "latitude": 13.0784,
            "longitude": 80.2612,
            "is_interchange": true,
            "average_passengers": 1384,
            "peak_passengers": 3139,
            "average_delay_min": 2.5
          },
          {
            "station_id": "ST_CHN_NEH_15",
            "station_name": "Nehru Park",
            "latitude": 13.079,
            "longitude": 80.248,
            "is_interchange": false,
            "average_passengers": 572,
            "peak_passengers": 1296,
            "average_delay_min": 1.9
          },
          {
            "station_id": "ST_CHN_KIL_16",
            "station_name": "Kilpauk",
            "latitude": 13.078,
            "longitude": 80.241,
            "is_interchange": false,
            "average_passengers": 574,
            "peak_passengers": 1311,
            "average_delay_min": 1.9
          },
          {
            "station_id": "ST_CHN_SHE_17",
            "station_name": "Shenoy Nagar",
            "latitude": 13.0775,
            "longitude": 80.226,
            "is_interchange": false,
            "average_passengers": 578,
            "peak_passengers": 1302,
            "average_delay_min": 1.9
          },
          {
            "station_id": "ST_CHN_ANN_18",
            "station_name": "Anna Nagar East",
            "latitude": 13.085,
            "longitude": 80.217,
            "is_interchange": false,
            "average_passengers": 575,
            "peak_passengers": 1216,
            "average_delay_min": 1.9
          },
          {
            "station_id": "ST_CHN_ANT_19",
            "station_name": "Anna Nagar Tower",
            "latitude": 13.086,
            "longitude": 80.21,
            "is_interchange": false,
            "average_passengers": 568,
            "peak_passengers": 1343,
            "average_delay_min": 1.9
          },
          {
            "station_id": "ST_CHN_THI_20",
            "station_name": "Thirumangalam",
            "latitude": 13.085,
            "longitude": 80.198,
            "is_interchange": false,
            "average_passengers": 578,
            "peak_passengers": 1282,
            "average_delay_min": 2.0
          },
          {
            "station_id": "ST_CHN_KOY_21",
            "station_name": "Koyambedu",
            "latitude": 13.0725,
            "longitude": 80.1945,
            "is_interchange": false,
            "average_passengers": 1189,
            "peak_passengers": 2587,
            "average_delay_min": 2.3
          },
          {
            "station_id": "ST_CHN_CMB_22",
            "station_name": "CMBT",
            "latitude": 13.066,
            "longitude": 80.203,
            "is_interchange": false,
            "average_passengers": 577,
            "peak_passengers": 1274,
            "average_delay_min": 1.9
          },
          {
            "station_id": "ST_CHN_VAD_23",
            "station_name": "Vadapalani",
            "latitude": 13.051,
            "longitude": 80.212,
            "is_interchange": false,
            "average_passengers": 576,
            "peak_passengers": 1357,
            "average_delay_min": 1.9
          },
          {
            "station_id": "ST_CHN_ASH_24",
            "station_name": "Ashok Nagar",
            "latitude": 13.036,
            "longitude": 80.2115,
            "is_interchange": false,
            "average_passengers": 579,
            "peak_passengers": 1336,
            "average_delay_min": 1.8
          },
          {
            "station_id": "ST_CHN_STM_25",
            "station_name": "St. Thomas Mount",
            "latitude": 13.004,
            "longitude": 80.196,
            "is_interchange": true,
            "average_passengers": 572,
            "peak_passengers": 1306,
            "average_delay_min": 1.9
          }
        ],
        "hourly_demand": [
          {
            "hour": 5,
            "time": "05:00",
            "passengers": 1981,
            "delay": 1.3
          },
          {
            "hour": 6,
            "time": "06:00",
            "passengers": 4635,
            "delay": 1.5
          },
          {
            "hour": 7,
            "time": "07:00",
            "passengers": 8595,
            "delay": 1.7
          },
          {
            "hour": 8,
            "time": "08:00",
            "passengers": 16606,
            "delay": 3.3
          },
          {
            "hour": 9,
            "time": "09:00",
            "passengers": 18545,
            "delay": 3.3
          },
          {
            "hour": 10,
            "time": "10:00",
            "passengers": 12832,
            "delay": 1.9
          },
          {
            "hour": 11,
            "time": "11:00",
            "passengers": 9028,
            "delay": 1.6
          },
          {
            "hour": 12,
            "time": "12:00",
            "passengers": 9901,
            "delay": 1.7
          },
          {
            "hour": 13,
            "time": "13:00",
            "passengers": 9480,
            "delay": 1.8
          },
          {
            "hour": 14,
            "time": "14:00",
            "passengers": 8912,
            "delay": 2.2
          },
          {
            "hour": 15,
            "time": "15:00",
            "passengers": 9946,
            "delay": 2.4
          },
          {
            "hour": 16,
            "time": "16:00",
            "passengers": 12112,
            "delay": 1.9
          },
          {
            "hour": 17,
            "time": "17:00",
            "passengers": 17159,
            "delay": 2.2
          },
          {
            "hour": 18,
            "time": "18:00",
            "passengers": 19404,
            "delay": 3.3
          },
          {
            "hour": 19,
            "time": "19:00",
            "passengers": 16189,
            "delay": 3.2
          },
          {
            "hour": 20,
            "time": "20:00",
            "passengers": 11745,
            "delay": 1.9
          },
          {
            "hour": 21,
            "time": "21:00",
            "passengers": 7169,
            "delay": 1.6
          },
          {
            "hour": 22,
            "time": "22:00",
            "passengers": 3866,
            "delay": 1.4
          },
          {
            "hour": 23,
            "time": "23:00",
            "passengers": 1662,
            "delay": 1.3
          }
        ]
      },
      "RT_CHN_RED": {
        "network_id": "chennai",
        "route_id": "RT_CHN_RED",
        "route_name": "Red Line (Suburban South)",
        "line_code": "RED",
        "color_hex": "#B94A3A",
        "origin": "Chennai Beach",
        "destination": "Tambaram",
        "length_km": 29.0,
        "total_stations": 11,
        "scheduled_headway_min": 8.0,
        "total_passengers": 4338335,
        "daily_avg_passengers": 309881,
        "avg_delay_min": 2.51,
        "peak_hour": "18:00",
        "corridor_stations": [
          {
            "station_id": "ST_CHN_BCH_26",
            "station_name": "Chennai Beach",
            "latitude": 13.0945,
            "longitude": 80.293,
            "is_interchange": true,
            "average_passengers": 1299,
            "peak_passengers": 2849,
            "average_delay_min": 2.4
          },
          {
            "station_id": "ST_CHN_FOR_27",
            "station_name": "Chennai Fort",
            "latitude": 13.0855,
            "longitude": 80.288,
            "is_interchange": true,
            "average_passengers": 762,
            "peak_passengers": 1725,
            "average_delay_min": 1.9
          },
          {
            "station_id": "ST_CHN_PRK_28",
            "station_name": "Park Town",
            "latitude": 13.0805,
            "longitude": 80.276,
            "is_interchange": true,
            "average_passengers": 1376,
            "peak_passengers": 3160,
            "average_delay_min": 2.4
          },
          {
            "station_id": "ST_CHN_CEN_11",
            "station_name": "Chennai Central",
            "latitude": 13.0827,
            "longitude": 80.2755,
            "is_interchange": true,
            "average_passengers": 2931,
            "peak_passengers": 9098,
            "average_delay_min": 3.5
          },
          {
            "station_id": "ST_CHN_EGM_14",
            "station_name": "Egmore",
            "latitude": 13.0784,
            "longitude": 80.2612,
            "is_interchange": true,
            "average_passengers": 1849,
            "peak_passengers": 4265,
            "average_delay_min": 2.8
          },
          {
            "station_id": "ST_CHN_NUN_29",
            "station_name": "Nungambakkam",
            "latitude": 13.062,
            "longitude": 80.237,
            "is_interchange": false,
            "average_passengers": 763,
            "peak_passengers": 1745,
            "average_delay_min": 2.0
          },
          {
            "station_id": "ST_CHN_KOD_30",
            "station_name": "Kodambakkam",
            "latitude": 13.051,
            "longitude": 80.23,
            "is_interchange": false,
            "average_passengers": 764,
            "peak_passengers": 1875,
            "average_delay_min": 2.1
          },
          {
            "station_id": "ST_CHN_MAM_31",
            "station_name": "T. Nagar (Mambalam)",
            "latitude": 13.0395,
            "longitude": 80.228,
            "is_interchange": false,
            "average_passengers": 2221,
            "peak_passengers": 4893,
            "average_delay_min": 3.1
          },
          {
            "station_id": "ST_CHN_GUI_04",
            "station_name": "Guindy",
            "latitude": 13.009,
            "longitude": 80.213,
            "is_interchange": true,
            "average_passengers": 1906,
            "peak_passengers": 4173,
            "average_delay_min": 2.8
          },
          {
            "station_id": "ST_CHN_STM_25",
            "station_name": "St. Thomas Mount",
            "latitude": 13.004,
            "longitude": 80.196,
            "is_interchange": true,
            "average_passengers": 759,
            "peak_passengers": 1672,
            "average_delay_min": 2.0
          },
          {
            "station_id": "ST_CHN_TAM_34",
            "station_name": "Tambaram",
            "latitude": 12.926,
            "longitude": 80.117,
            "is_interchange": false,
            "average_passengers": 1676,
            "peak_passengers": 3903,
            "average_delay_min": 2.6
          }
        ],
        "hourly_demand": [
          {
            "hour": 5,
            "time": "05:00",
            "passengers": 3067,
            "delay": 1.4
          },
          {
            "hour": 6,
            "time": "06:00",
            "passengers": 7267,
            "delay": 1.7
          },
          {
            "hour": 7,
            "time": "07:00",
            "passengers": 13580,
            "delay": 2.0
          },
          {
            "hour": 8,
            "time": "08:00",
            "passengers": 25722,
            "delay": 3.9
          },
          {
            "hour": 9,
            "time": "09:00",
            "passengers": 28843,
            "delay": 4.2
          },
          {
            "hour": 10,
            "time": "10:00",
            "passengers": 19842,
            "delay": 2.5
          },
          {
            "hour": 11,
            "time": "11:00",
            "passengers": 13934,
            "delay": 2.2
          },
          {
            "hour": 12,
            "time": "12:00",
            "passengers": 15167,
            "delay": 2.2
          },
          {
            "hour": 13,
            "time": "13:00",
            "passengers": 14514,
            "delay": 2.2
          },
          {
            "hour": 14,
            "time": "14:00",
            "passengers": 13730,
            "delay": 2.1
          },
          {
            "hour": 15,
            "time": "15:00",
            "passengers": 15422,
            "delay": 2.2
          },
          {
            "hour": 16,
            "time": "16:00",
            "passengers": 19238,
            "delay": 2.5
          },
          {
            "hour": 17,
            "time": "17:00",
            "passengers": 26807,
            "delay": 2.9
          },
          {
            "hour": 18,
            "time": "18:00",
            "passengers": 29934,
            "delay": 4.3
          },
          {
            "hour": 19,
            "time": "19:00",
            "passengers": 24949,
            "delay": 3.9
          },
          {
            "hour": 20,
            "time": "20:00",
            "passengers": 18197,
            "delay": 2.3
          },
          {
            "hour": 21,
            "time": "21:00",
            "passengers": 11027,
            "delay": 2.0
          },
          {
            "hour": 22,
            "time": "22:00",
            "passengers": 6053,
            "delay": 1.6
          },
          {
            "hour": 23,
            "time": "23:00",
            "passengers": 2589,
            "delay": 1.3
          }
        ]
      },
      "RT_CHN_ORANGE": {
        "network_id": "chennai",
        "route_id": "RT_CHN_ORANGE",
        "route_name": "Orange Line (MRTS)",
        "line_code": "ORANGE",
        "color_hex": "#C96F4A",
        "origin": "Chennai Beach",
        "destination": "Velachery",
        "length_km": 19.3,
        "total_stations": 11,
        "scheduled_headway_min": 10.0,
        "total_passengers": 2293326,
        "daily_avg_passengers": 163809,
        "avg_delay_min": 2.01,
        "peak_hour": "18:00",
        "corridor_stations": [
          {
            "station_id": "ST_CHN_BCH_26",
            "station_name": "Chennai Beach",
            "latitude": 13.0945,
            "longitude": 80.293,
            "is_interchange": true,
            "average_passengers": 975,
            "peak_passengers": 2254,
            "average_delay_min": 2.1
          },
          {
            "station_id": "ST_CHN_FOR_27",
            "station_name": "Chennai Fort",
            "latitude": 13.0855,
            "longitude": 80.288,
            "is_interchange": true,
            "average_passengers": 573,
            "peak_passengers": 1262,
            "average_delay_min": 1.8
          },
          {
            "station_id": "ST_CHN_PRK_28",
            "station_name": "Park Town",
            "latitude": 13.0805,
            "longitude": 80.276,
            "is_interchange": true,
            "average_passengers": 1035,
            "peak_passengers": 2427,
            "average_delay_min": 2.2
          },
          {
            "station_id": "ST_CHN_CHN_35",
            "station_name": "Chintadripet",
            "latitude": 13.074,
            "longitude": 80.274,
            "is_interchange": false,
            "average_passengers": 570,
            "peak_passengers": 1388,
            "average_delay_min": 1.8
          },
          {
            "station_id": "ST_CHN_CHE_36",
            "station_name": "Chepauk",
            "latitude": 13.064,
            "longitude": 80.279,
            "is_interchange": false,
            "average_passengers": 938,
            "peak_passengers": 3988,
            "average_delay_min": 2.1
          },
          {
            "station_id": "ST_CHN_TRI_37",
            "station_name": "Triplicane",
            "latitude": 13.056,
            "longitude": 80.277,
            "is_interchange": false,
            "average_passengers": 574,
            "peak_passengers": 1394,
            "average_delay_min": 1.9
          },
          {
            "station_id": "ST_CHN_MYL_38",
            "station_name": "Mylapore",
            "latitude": 13.034,
            "longitude": 80.269,
            "is_interchange": false,
            "average_passengers": 577,
            "peak_passengers": 1364,
            "average_delay_min": 1.9
          },
          {
            "station_id": "ST_CHN_ADY_39",
            "station_name": "Adyar (Kasturba)",
            "latitude": 13.006,
            "longitude": 80.252,
            "is_interchange": false,
            "average_passengers": 1086,
            "peak_passengers": 2436,
            "average_delay_min": 2.2
          },
          {
            "station_id": "ST_CHN_THV_40",
            "station_name": "Thiruvanmiyur",
            "latitude": 12.986,
            "longitude": 80.254,
            "is_interchange": false,
            "average_passengers": 574,
            "peak_passengers": 1330,
            "average_delay_min": 1.9
          },
          {
            "station_id": "ST_CHN_TAR_41",
            "station_name": "Taramani",
            "latitude": 12.977,
            "longitude": 80.244,
            "is_interchange": false,
            "average_passengers": 572,
            "peak_passengers": 1345,
            "average_delay_min": 1.9
          },
          {
            "station_id": "ST_CHN_VEL_42",
            "station_name": "Velachery",
            "latitude": 12.977,
            "longitude": 80.218,
            "is_interchange": false,
            "average_passengers": 1142,
            "peak_passengers": 2597,
            "average_delay_min": 2.3
          }
        ],
        "hourly_demand": [
          {
            "hour": 5,
            "time": "05:00",
            "passengers": 1633,
            "delay": 1.3
          },
          {
            "hour": 6,
            "time": "06:00",
            "passengers": 3778,
            "delay": 1.4
          },
          {
            "hour": 7,
            "time": "07:00",
            "passengers": 7069,
            "delay": 1.7
          },
          {
            "hour": 8,
            "time": "08:00",
            "passengers": 13437,
            "delay": 3.2
          },
          {
            "hour": 9,
            "time": "09:00",
            "passengers": 15043,
            "delay": 3.2
          },
          {
            "hour": 10,
            "time": "10:00",
            "passengers": 10499,
            "delay": 1.9
          },
          {
            "hour": 11,
            "time": "11:00",
            "passengers": 7395,
            "delay": 1.7
          },
          {
            "hour": 12,
            "time": "12:00",
            "passengers": 8028,
            "delay": 1.8
          },
          {
            "hour": 13,
            "time": "13:00",
            "passengers": 7674,
            "delay": 1.7
          },
          {
            "hour": 14,
            "time": "14:00",
            "passengers": 7237,
            "delay": 1.7
          },
          {
            "hour": 15,
            "time": "15:00",
            "passengers": 8072,
            "delay": 1.8
          },
          {
            "hour": 16,
            "time": "16:00",
            "passengers": 9964,
            "delay": 1.9
          },
          {
            "hour": 17,
            "time": "17:00",
            "passengers": 14300,
            "delay": 2.2
          },
          {
            "hour": 18,
            "time": "18:00",
            "passengers": 16272,
            "delay": 3.4
          },
          {
            "hour": 19,
            "time": "19:00",
            "passengers": 13324,
            "delay": 3.2
          },
          {
            "hour": 20,
            "time": "20:00",
            "passengers": 9656,
            "delay": 1.9
          },
          {
            "hour": 21,
            "time": "21:00",
            "passengers": 5882,
            "delay": 1.5
          },
          {
            "hour": 22,
            "time": "22:00",
            "passengers": 3175,
            "delay": 1.4
          },
          {
            "hour": 23,
            "time": "23:00",
            "passengers": 1369,
            "delay": 1.3
          }
        ]
      },
      "RT_CHN_PURPLE": {
        "network_id": "chennai",
        "route_id": "RT_CHN_PURPLE",
        "route_name": "Purple Line (Suburban West)",
        "line_code": "PURPLE",
        "color_hex": "#7A5C6E",
        "origin": "Chennai Central",
        "destination": "Tiruvallur",
        "length_km": 41.8,
        "total_stations": 6,
        "scheduled_headway_min": 12.0,
        "total_passengers": 1491067,
        "daily_avg_passengers": 106505,
        "avg_delay_min": 2.11,
        "peak_hour": "18:00",
        "corridor_stations": [
          {
            "station_id": "ST_CHN_CEN_11",
            "station_name": "Chennai Central",
            "latitude": 13.0827,
            "longitude": 80.2755,
            "is_interchange": true,
            "average_passengers": 2225,
            "peak_passengers": 7132,
            "average_delay_min": 3.0
          },
          {
            "station_id": "ST_CHN_PER_43",
            "station_name": "Perambur",
            "latitude": 13.111,
            "longitude": 80.244,
            "is_interchange": false,
            "average_passengers": 1083,
            "peak_passengers": 2389,
            "average_delay_min": 2.2
          },
          {
            "station_id": "ST_CHN_VIL_44",
            "station_name": "Villivakkam",
            "latitude": 13.11,
            "longitude": 80.207,
            "is_interchange": false,
            "average_passengers": 573,
            "peak_passengers": 1281,
            "average_delay_min": 1.9
          },
          {
            "station_id": "ST_CHN_AMB_45",
            "station_name": "Ambattur",
            "latitude": 13.118,
            "longitude": 80.155,
            "is_interchange": false,
            "average_passengers": 570,
            "peak_passengers": 1286,
            "average_delay_min": 1.9
          },
          {
            "station_id": "ST_CHN_AVA_46",
            "station_name": "Avadi",
            "latitude": 13.12,
            "longitude": 80.1,
            "is_interchange": false,
            "average_passengers": 577,
            "peak_passengers": 1267,
            "average_delay_min": 1.8
          },
          {
            "station_id": "ST_CHN_TIR_47",
            "station_name": "Tiruvallur",
            "latitude": 13.143,
            "longitude": 79.907,
            "is_interchange": false,
            "average_passengers": 575,
            "peak_passengers": 1243,
            "average_delay_min": 1.9
          }
        ],
        "hourly_demand": [
          {
            "hour": 5,
            "time": "05:00",
            "passengers": 1055,
            "delay": 1.3
          },
          {
            "hour": 6,
            "time": "06:00",
            "passengers": 2457,
            "delay": 1.6
          },
          {
            "hour": 7,
            "time": "07:00",
            "passengers": 4583,
            "delay": 1.7
          },
          {
            "hour": 8,
            "time": "08:00",
            "passengers": 8980,
            "delay": 3.5
          },
          {
            "hour": 9,
            "time": "09:00",
            "passengers": 10003,
            "delay": 3.4
          },
          {
            "hour": 10,
            "time": "10:00",
            "passengers": 6813,
            "delay": 2.0
          },
          {
            "hour": 11,
            "time": "11:00",
            "passengers": 4845,
            "delay": 1.8
          },
          {
            "hour": 12,
            "time": "12:00",
            "passengers": 5275,
            "delay": 1.9
          },
          {
            "hour": 13,
            "time": "13:00",
            "passengers": 4956,
            "delay": 1.7
          },
          {
            "hour": 14,
            "time": "14:00",
            "passengers": 4674,
            "delay": 1.8
          },
          {
            "hour": 15,
            "time": "15:00",
            "passengers": 5242,
            "delay": 1.9
          },
          {
            "hour": 16,
            "time": "16:00",
            "passengers": 6392,
            "delay": 2.1
          },
          {
            "hour": 17,
            "time": "17:00",
            "passengers": 9159,
            "delay": 2.4
          },
          {
            "hour": 18,
            "time": "18:00",
            "passengers": 10196,
            "delay": 3.4
          },
          {
            "hour": 19,
            "time": "19:00",
            "passengers": 8767,
            "delay": 3.3
          },
          {
            "hour": 20,
            "time": "20:00",
            "passengers": 6283,
            "delay": 1.9
          },
          {
            "hour": 21,
            "time": "21:00",
            "passengers": 3833,
            "delay": 1.7
          },
          {
            "hour": 22,
            "time": "22:00",
            "passengers": 2091,
            "delay": 1.4
          },
          {
            "hour": 23,
            "time": "23:00",
            "passengers": 899,
            "delay": 1.3
          }
        ]
      }
    }
  },
  "delhi": {
    "demand": {
      "network_id": "delhi",
      "chart_data": [
        {
          "hour": 5,
          "time": "05:00",
          "passengers": 18589,
          "delay": 1.4
        },
        {
          "hour": 6,
          "time": "06:00",
          "passengers": 43161,
          "delay": 1.8
        },
        {
          "hour": 7,
          "time": "07:00",
          "passengers": 80583,
          "delay": 2.3
        },
        {
          "hour": 8,
          "time": "08:00",
          "passengers": 152687,
          "delay": 4.4
        },
        {
          "hour": 9,
          "time": "09:00",
          "passengers": 170882,
          "delay": 4.6
        },
        {
          "hour": 10,
          "time": "10:00",
          "passengers": 118720,
          "delay": 2.8
        },
        {
          "hour": 11,
          "time": "11:00",
          "passengers": 84670,
          "delay": 2.4
        },
        {
          "hour": 12,
          "time": "12:00",
          "passengers": 91041,
          "delay": 2.4
        },
        {
          "hour": 13,
          "time": "13:00",
          "passengers": 87025,
          "delay": 2.4
        },
        {
          "hour": 14,
          "time": "14:00",
          "passengers": 82415,
          "delay": 2.3
        },
        {
          "hour": 15,
          "time": "15:00",
          "passengers": 91644,
          "delay": 2.4
        },
        {
          "hour": 16,
          "time": "16:00",
          "passengers": 113933,
          "delay": 2.8
        },
        {
          "hour": 17,
          "time": "17:00",
          "passengers": 160875,
          "delay": 3.4
        },
        {
          "hour": 18,
          "time": "18:00",
          "passengers": 180892,
          "delay": 4.9
        },
        {
          "hour": 19,
          "time": "19:00",
          "passengers": 150019,
          "delay": 4.5
        },
        {
          "hour": 20,
          "time": "20:00",
          "passengers": 108375,
          "delay": 2.7
        },
        {
          "hour": 21,
          "time": "21:00",
          "passengers": 67011,
          "delay": 2.1
        },
        {
          "hour": 22,
          "time": "22:00",
          "passengers": 36062,
          "delay": 1.7
        },
        {
          "hour": 23,
          "time": "23:00",
          "passengers": 15590,
          "delay": 1.4
        }
      ],
      "overall_hourly_average": 97588,
      "morning_peak": {
        "period": "09:00 \u2013 10:00",
        "passengers": 170882,
        "pct_above_average": 75
      },
      "evening_peak": {
        "period": "18:00 \u2013 19:00",
        "passengers": 180892,
        "pct_above_average": 85
      },
      "lowest_demand_period": {
        "time": "23:00",
        "passengers": 15590
      }
    },
    "delays": {
      "network_id": "delhi",
      "system_avg_delay": 2.79,
      "system_max_delay": 17.2,
      "route_rankings": [
        {
          "route_id": "RT_DEL_YELLOW",
          "route_name": "Yellow Line (Line 2)",
          "avg_delay": 3.15,
          "max_delay": 17.2,
          "color_hex": "#D89B32"
        },
        {
          "route_id": "RT_DEL_BLUE",
          "route_name": "Blue Line (Line 3/4)",
          "avg_delay": 2.96,
          "max_delay": 14.1,
          "color_hex": "#2F5D50"
        },
        {
          "route_id": "RT_DEL_RED",
          "route_name": "Red Line (Line 1)",
          "avg_delay": 2.46,
          "max_delay": 14.9,
          "color_hex": "#B94A3A"
        },
        {
          "route_id": "RT_DEL_AIRPORT",
          "route_name": "Airport Express Line",
          "avg_delay": 2.44,
          "max_delay": 8.4,
          "color_hex": "#C96F4A"
        },
        {
          "route_id": "RT_DEL_VIOLET",
          "route_name": "Violet Line (Line 6)",
          "avg_delay": 2.44,
          "max_delay": 12.7,
          "color_hex": "#7A5C6E"
        }
      ],
      "station_rankings": [
        {
          "station_id": "ST_DEL_RAJ_08",
          "station_name": "Rajiv Chowk (CP)",
          "avg_delay": 4.85,
          "max_delay": 15.4
        },
        {
          "station_id": "ST_DEL_KAS_05",
          "station_name": "Kashmere Gate",
          "avg_delay": 4.27,
          "max_delay": 15.7
        },
        {
          "station_id": "ST_DEL_NDL_07",
          "station_name": "New Delhi Railway",
          "avg_delay": 4.0,
          "max_delay": 17.2
        },
        {
          "station_id": "ST_DEL_HAU_12",
          "station_name": "Hauz Khas",
          "avg_delay": 3.86,
          "max_delay": 14.9
        },
        {
          "station_id": "ST_DEL_SIK_15",
          "station_name": "Sikanderpur",
          "avg_delay": 3.6,
          "max_delay": 14.0
        },
        {
          "station_id": "ST_DEL_BOT_27",
          "station_name": "Botanical Garden",
          "avg_delay": 3.6,
          "max_delay": 7.7
        },
        {
          "station_id": "ST_DEL_CHA_06",
          "station_name": "Chandni Chowk",
          "avg_delay": 3.55,
          "max_delay": 14.2
        },
        {
          "station_id": "ST_DEL_AIM_11",
          "station_name": "AIIMS",
          "avg_delay": 3.55,
          "max_delay": 14.0
        },
        {
          "station_id": "ST_DEL_SEC_10",
          "station_name": "Central Secretariat",
          "avg_delay": 3.44,
          "max_delay": 15.2
        },
        {
          "station_id": "ST_DEL_MIL_17",
          "station_name": "Millennium City Centre",
          "avg_delay": 3.42,
          "max_delay": 13.3
        }
      ],
      "hourly_delay_trend": [
        {
          "hour": 5,
          "time": "05:00",
          "avg_delay": 1.43
        },
        {
          "hour": 6,
          "time": "06:00",
          "avg_delay": 1.78
        },
        {
          "hour": 7,
          "time": "07:00",
          "avg_delay": 2.28
        },
        {
          "hour": 8,
          "time": "08:00",
          "avg_delay": 4.37
        },
        {
          "hour": 9,
          "time": "09:00",
          "avg_delay": 4.62
        },
        {
          "hour": 10,
          "time": "10:00",
          "avg_delay": 2.84
        },
        {
          "hour": 11,
          "time": "11:00",
          "avg_delay": 2.39
        },
        {
          "hour": 12,
          "time": "12:00",
          "avg_delay": 2.42
        },
        {
          "hour": 13,
          "time": "13:00",
          "avg_delay": 2.37
        },
        {
          "hour": 14,
          "time": "14:00",
          "avg_delay": 2.35
        },
        {
          "hour": 15,
          "time": "15:00",
          "avg_delay": 2.45
        },
        {
          "hour": 16,
          "time": "16:00",
          "avg_delay": 2.78
        },
        {
          "hour": 17,
          "time": "17:00",
          "avg_delay": 3.45
        },
        {
          "hour": 18,
          "time": "18:00",
          "avg_delay": 4.95
        },
        {
          "hour": 19,
          "time": "19:00",
          "avg_delay": 4.52
        },
        {
          "hour": 20,
          "time": "20:00",
          "avg_delay": 2.71
        },
        {
          "hour": 21,
          "time": "21:00",
          "avg_delay": 2.14
        },
        {
          "hour": 22,
          "time": "22:00",
          "avg_delay": 1.71
        },
        {
          "hour": 23,
          "time": "23:00",
          "avg_delay": 1.43
        }
      ]
    },
    "anomalies": {
      "network_id": "delhi",
      "total_anomalies": 18,
      "detection_method": "Z-score baseline deviation (|z| > 2.5 on station-hour-day distribution)",
      "anomalies": [
        {
          "record_id": "REC_DEL_14775",
          "date": "2024-01-19",
          "hour": 19,
          "time": "19:00",
          "route_name": "Yellow Line (Line 2)",
          "station_name": "Kashmere Gate",
          "observed_passengers": 15974,
          "expected_baseline": 6926.8,
          "pct_deviation": 130.6,
          "z_score": 4.04,
          "status": "Unusually High Demand",
          "explanation": "Passenger demand was 130.6% higher than the typical baseline for this station at 19:00."
        },
        {
          "record_id": "REC_DEL_14751",
          "date": "2024-01-19",
          "hour": 18,
          "time": "18:00",
          "route_name": "Red Line (Line 1)",
          "station_name": "Kashmere Gate",
          "observed_passengers": 16247,
          "expected_baseline": 8186.9,
          "pct_deviation": 98.5,
          "z_score": 3.2,
          "status": "Unusually High Demand",
          "explanation": "Passenger demand was 98.5% higher than the typical baseline for this station at 18:00."
        },
        {
          "record_id": "REC_DEL_14722",
          "date": "2024-01-19",
          "hour": 18,
          "time": "18:00",
          "route_name": "Yellow Line (Line 2)",
          "station_name": "Kashmere Gate",
          "observed_passengers": 15847,
          "expected_baseline": 8186.9,
          "pct_deviation": 93.6,
          "z_score": 3.04,
          "status": "Unusually High Demand",
          "explanation": "Passenger demand was 93.6% higher than the typical baseline for this station at 18:00."
        },
        {
          "record_id": "REC_DEL_14698",
          "date": "2024-01-19",
          "hour": 17,
          "time": "17:00",
          "route_name": "Red Line (Line 1)",
          "station_name": "Kashmere Gate",
          "observed_passengers": 13585,
          "expected_baseline": 7477.1,
          "pct_deviation": 81.7,
          "z_score": 3.21,
          "status": "Unusually High Demand",
          "explanation": "Passenger demand was 81.7% higher than the typical baseline for this station at 17:00."
        },
        {
          "record_id": "REC_DEL_10235",
          "date": "2024-01-15",
          "hour": 9,
          "time": "09:00",
          "route_name": "Blue Line (Line 3/4)",
          "station_name": "Rajiv Chowk (CP)",
          "observed_passengers": 16232,
          "expected_baseline": 9167.1,
          "pct_deviation": 77.1,
          "z_score": 3.1,
          "status": "Unusually High Demand",
          "explanation": "Passenger demand was 77.1% higher than the typical baseline for this station at 09:00."
        },
        {
          "record_id": "REC_DEL_10182",
          "date": "2024-01-15",
          "hour": 8,
          "time": "08:00",
          "route_name": "Blue Line (Line 3/4)",
          "station_name": "Rajiv Chowk (CP)",
          "observed_passengers": 14474,
          "expected_baseline": 8450.8,
          "pct_deviation": 71.3,
          "z_score": 3.14,
          "status": "Unusually High Demand",
          "explanation": "Passenger demand was 71.3% higher than the typical baseline for this station at 08:00."
        },
        {
          "record_id": "REC_DEL_10220",
          "date": "2024-01-15",
          "hour": 9,
          "time": "09:00",
          "route_name": "Yellow Line (Line 2)",
          "station_name": "Rajiv Chowk (CP)",
          "observed_passengers": 14934,
          "expected_baseline": 9167.1,
          "pct_deviation": 62.9,
          "z_score": 2.53,
          "status": "Unusually High Demand",
          "explanation": "Passenger demand was 62.9% higher than the typical baseline for this station at 09:00."
        },
        {
          "record_id": "REC_DEL_10288",
          "date": "2024-01-15",
          "hour": 10,
          "time": "10:00",
          "route_name": "Blue Line (Line 3/4)",
          "station_name": "Rajiv Chowk (CP)",
          "observed_passengers": 10237,
          "expected_baseline": 6463.1,
          "pct_deviation": 58.4,
          "z_score": 2.81,
          "status": "Unusually High Demand",
          "explanation": "Passenger demand was 58.4% higher than the typical baseline for this station at 10:00."
        },
        {
          "record_id": "REC_DEL_10273",
          "date": "2024-01-15",
          "hour": 10,
          "time": "10:00",
          "route_name": "Yellow Line (Line 2)",
          "station_name": "Rajiv Chowk (CP)",
          "observed_passengers": 10199,
          "expected_baseline": 6463.1,
          "pct_deviation": 57.8,
          "z_score": 2.78,
          "status": "Unusually High Demand",
          "explanation": "Passenger demand was 57.8% higher than the typical baseline for this station at 10:00."
        },
        {
          "record_id": "REC_DEL_13834",
          "date": "2024-01-18",
          "hour": 20,
          "time": "20:00",
          "route_name": "Blue Line (Line 3/4)",
          "station_name": "Dwarka Sector 21",
          "observed_passengers": 1500,
          "expected_baseline": 1250.8,
          "pct_deviation": 19.9,
          "z_score": 2.55,
          "status": "Unusually High Demand",
          "explanation": "Passenger demand was 19.9% higher than the typical baseline for this station at 20:00."
        },
        {
          "record_id": "REC_DEL_13800",
          "date": "2024-01-18",
          "hour": 19,
          "time": "19:00",
          "route_name": "Red Line (Line 1)",
          "station_name": "Shaheed Sthal Ghaziabad",
          "observed_passengers": 2064,
          "expected_baseline": 1731.5,
          "pct_deviation": 19.2,
          "z_score": 2.61,
          "status": "Unusually High Demand",
          "explanation": "Passenger demand was 19.2% higher than the typical baseline for this station at 19:00."
        },
        {
          "record_id": "REC_DEL_17367",
          "date": "2024-01-22",
          "hour": 10,
          "time": "10:00",
          "route_name": "Airport Express Line",
          "station_name": "Yashobhoomi Dwarka Sec 25",
          "observed_passengers": 1143,
          "expected_baseline": 1004.8,
          "pct_deviation": 13.8,
          "z_score": 2.56,
          "status": "Unusually High Demand",
          "explanation": "Passenger demand was 13.8% higher than the typical baseline for this station at 10:00."
        },
        {
          "record_id": "REC_DEL_13733",
          "date": "2024-01-18",
          "hour": 18,
          "time": "18:00",
          "route_name": "Blue Line (Line 3/4)",
          "station_name": "Rajiv Chowk (CP)",
          "observed_passengers": 7832,
          "expected_baseline": 9409.5,
          "pct_deviation": -16.8,
          "z_score": -2.51,
          "status": "Unusually Low Demand",
          "explanation": "Passenger demand was 16.8% lower than the typical baseline for this station at 18:00."
        },
        {
          "record_id": "REC_DEL_14535",
          "date": "2024-01-19",
          "hour": 14,
          "time": "14:00",
          "route_name": "Red Line (Line 1)",
          "station_name": "Rithala",
          "observed_passengers": 796,
          "expected_baseline": 960.5,
          "pct_deviation": -17.1,
          "z_score": -2.53,
          "status": "Unusually Low Demand",
          "explanation": "Passenger demand was 17.1% lower than the typical baseline for this station at 14:00."
        },
        {
          "record_id": "REC_DEL_11724",
          "date": "2024-01-16",
          "hour": 18,
          "time": "18:00",
          "route_name": "Blue Line (Line 3/4)",
          "station_name": "Botanical Garden",
          "observed_passengers": 4637,
          "expected_baseline": 5718.5,
          "pct_deviation": -18.9,
          "z_score": -2.68,
          "status": "Unusually Low Demand",
          "explanation": "Passenger demand was 18.9% lower than the typical baseline for this station at 18:00."
        },
        {
          "record_id": "REC_DEL_22053",
          "date": "2024-01-26",
          "hour": 23,
          "time": "23:00",
          "route_name": "Blue Line (Line 3/4)",
          "station_name": "Karol Bagh",
          "observed_passengers": 358,
          "expected_baseline": 442.2,
          "pct_deviation": -19.0,
          "z_score": -2.52,
          "status": "Unusually Low Demand",
          "explanation": "Passenger demand was 19.0% lower than the typical baseline for this station at 23:00."
        },
        {
          "record_id": "REC_DEL_20752",
          "date": "2024-01-25",
          "hour": 17,
          "time": "17:00",
          "route_name": "Violet Line (Line 6)",
          "station_name": "Kalkaji Mandir",
          "observed_passengers": 1058,
          "expected_baseline": 1355.9,
          "pct_deviation": -22.0,
          "z_score": -2.51,
          "status": "Unusually Low Demand",
          "explanation": "Passenger demand was 22.0% lower than the typical baseline for this station at 17:00."
        },
        {
          "record_id": "REC_DEL_14395",
          "date": "2024-01-19",
          "hour": 11,
          "time": "11:00",
          "route_name": "Airport Express Line",
          "station_name": "Shivaji Stadium",
          "observed_passengers": 544,
          "expected_baseline": 706.8,
          "pct_deviation": -23.0,
          "z_score": -2.51,
          "status": "Unusually Low Demand",
          "explanation": "Passenger demand was 23.0% lower than the typical baseline for this station at 11:00."
        }
      ],
      "guideline": "Anomalies represent statistical outliers. They do not assume an operational cause without external validation."
    },
    "clusters": {
      "network_id": "delhi",
      "algorithm": "K-Means Clustering",
      "k_clusters": 3,
      "silhouette_score": 0.342,
      "features_used": [
        "Daily Average Passengers",
        "Peak Hourly Passengers",
        "Average Delay (min)"
      ],
      "clusters": [
        {
          "cluster_id": 0,
          "profile_name": "High-Density Trunk Corridors",
          "route_count": 2,
          "avg_daily_passengers": 611086,
          "avg_peak_passengers": 16103,
          "avg_delay_min": 3.05,
          "simple_explanation": "Routes with very high daily passenger demand and intensive rush-hour crowding.",
          "routes": [
            {
              "route_id": "RT_DEL_BLUE",
              "route_name": "Blue Line (Line 3/4)",
              "color_hex": "#2563EB",
              "daily_avg_passengers": 486270,
              "peak_passengers": 16232,
              "avg_delay_min": 2.96
            },
            {
              "route_id": "RT_DEL_YELLOW",
              "route_name": "Yellow Line (Line 2)",
              "color_hex": "#EAB308",
              "daily_avg_passengers": 735902,
              "peak_passengers": 15974,
              "avg_delay_min": 3.15
            }
          ]
        },
        {
          "cluster_id": 1,
          "profile_name": "High-Density Trunk Corridors",
          "route_count": 2,
          "avg_daily_passengers": 207565,
          "avg_peak_passengers": 8502,
          "avg_delay_min": 2.44,
          "simple_explanation": "Routes with very high daily passenger demand and intensive rush-hour crowding.",
          "routes": [
            {
              "route_id": "RT_DEL_AIRPORT",
              "route_name": "Airport Express Line",
              "color_hex": "#EA580C",
              "daily_avg_passengers": 151062,
              "peak_passengers": 6472,
              "avg_delay_min": 2.44
            },
            {
              "route_id": "RT_DEL_VIOLET",
              "route_name": "Violet Line (Line 6)",
              "color_hex": "#7C3AED",
              "daily_avg_passengers": 264068,
              "peak_passengers": 10531,
              "avg_delay_min": 2.44
            }
          ]
        },
        {
          "cluster_id": 2,
          "profile_name": "High-Density Trunk Corridors",
          "route_count": 1,
          "avg_daily_passengers": 216870,
          "avg_peak_passengers": 16247,
          "avg_delay_min": 2.46,
          "simple_explanation": "Routes with very high daily passenger demand and intensive rush-hour crowding.",
          "routes": [
            {
              "route_id": "RT_DEL_RED",
              "route_name": "Red Line (Line 1)",
              "color_hex": "#DC2626",
              "daily_avg_passengers": 216870,
              "peak_passengers": 16247,
              "avg_delay_min": 2.46
            }
          ]
        }
      ],
      "simple_definition": "K-Means groups routes that have similar passenger demand and delay patterns together."
    },
    "regression": {
      "network_id": "delhi",
      "model_type": "Simple Linear Regression",
      "formula": "Passenger Demand = -0.68 \u00d7 (Hour of Day (24-hour format)) + 1731.33",
      "independent_variable": "Hour of Day (24-hour format)",
      "dependent_variable": "Average Passenger Demand",
      "metrics": {
        "r_squared": 0.0,
        "mae": 723.1,
        "rmse": 907.8,
        "slope": -0.683,
        "intercept": 1731.33
      },
      "interpretation": "The regression line explains approximately 0.0% of the hourly variation (R\u00b2 = 0.0). The slope (-0.68) indicates the linear rate of change.",
      "label_notice": "EDUCATIONAL ESTIMATE \u2014 Illustrates macro-level linear relationships.",
      "data_points": [
        {
          "x": 5.0,
          "y": 380,
          "predicted_y": 1728,
          "is_weekend": false
        },
        {
          "x": 5.0,
          "y": 278,
          "predicted_y": 1728,
          "is_weekend": true
        },
        {
          "x": 6.0,
          "y": 885,
          "predicted_y": 1727,
          "is_weekend": false
        },
        {
          "x": 6.0,
          "y": 638,
          "predicted_y": 1727,
          "is_weekend": true
        },
        {
          "x": 7.0,
          "y": 1653,
          "predicted_y": 1727,
          "is_weekend": false
        },
        {
          "x": 7.0,
          "y": 1189,
          "predicted_y": 1727,
          "is_weekend": true
        },
        {
          "x": 8.0,
          "y": 3128,
          "predicted_y": 1726,
          "is_weekend": false
        },
        {
          "x": 8.0,
          "y": 2263,
          "predicted_y": 1726,
          "is_weekend": true
        },
        {
          "x": 9.0,
          "y": 3505,
          "predicted_y": 1725,
          "is_weekend": false
        },
        {
          "x": 9.0,
          "y": 2523,
          "predicted_y": 1725,
          "is_weekend": true
        },
        {
          "x": 10.0,
          "y": 2440,
          "predicted_y": 1725,
          "is_weekend": false
        },
        {
          "x": 10.0,
          "y": 1741,
          "predicted_y": 1725,
          "is_weekend": true
        },
        {
          "x": 11.0,
          "y": 1732,
          "predicted_y": 1724,
          "is_weekend": false
        },
        {
          "x": 11.0,
          "y": 1261,
          "predicted_y": 1724,
          "is_weekend": true
        },
        {
          "x": 12.0,
          "y": 1867,
          "predicted_y": 1723,
          "is_weekend": false
        },
        {
          "x": 12.0,
          "y": 1345,
          "predicted_y": 1723,
          "is_weekend": true
        },
        {
          "x": 13.0,
          "y": 1778,
          "predicted_y": 1722,
          "is_weekend": false
        },
        {
          "x": 13.0,
          "y": 1301,
          "predicted_y": 1722,
          "is_weekend": true
        },
        {
          "x": 14.0,
          "y": 1690,
          "predicted_y": 1722,
          "is_weekend": false
        },
        {
          "x": 14.0,
          "y": 1218,
          "predicted_y": 1722,
          "is_weekend": true
        },
        {
          "x": 15.0,
          "y": 1871,
          "predicted_y": 1721,
          "is_weekend": false
        },
        {
          "x": 15.0,
          "y": 1374,
          "predicted_y": 1721,
          "is_weekend": true
        },
        {
          "x": 16.0,
          "y": 2339,
          "predicted_y": 1720,
          "is_weekend": false
        },
        {
          "x": 16.0,
          "y": 1677,
          "predicted_y": 1720,
          "is_weekend": true
        },
        {
          "x": 17.0,
          "y": 3310,
          "predicted_y": 1720,
          "is_weekend": false
        },
        {
          "x": 17.0,
          "y": 2349,
          "predicted_y": 1720,
          "is_weekend": true
        },
        {
          "x": 18.0,
          "y": 3711,
          "predicted_y": 1719,
          "is_weekend": false
        },
        {
          "x": 18.0,
          "y": 2669,
          "predicted_y": 1719,
          "is_weekend": true
        },
        {
          "x": 19.0,
          "y": 3076,
          "predicted_y": 1718,
          "is_weekend": false
        },
        {
          "x": 19.0,
          "y": 2216,
          "predicted_y": 1718,
          "is_weekend": true
        },
        {
          "x": 20.0,
          "y": 2216,
          "predicted_y": 1718,
          "is_weekend": false
        },
        {
          "x": 20.0,
          "y": 1618,
          "predicted_y": 1718,
          "is_weekend": true
        },
        {
          "x": 21.0,
          "y": 1374,
          "predicted_y": 1717,
          "is_weekend": false
        },
        {
          "x": 21.0,
          "y": 990,
          "predicted_y": 1717,
          "is_weekend": true
        },
        {
          "x": 22.0,
          "y": 738,
          "predicted_y": 1716,
          "is_weekend": false
        },
        {
          "x": 22.0,
          "y": 536,
          "predicted_y": 1716,
          "is_weekend": true
        },
        {
          "x": 23.0,
          "y": 321,
          "predicted_y": 1716,
          "is_weekend": false
        },
        {
          "x": 23.0,
          "y": 228,
          "predicted_y": 1716,
          "is_weekend": true
        }
      ]
    },
    "descriptive_stats": {
      "network_id": "delhi",
      "network_name": "Delhi Metro Rail (DMRC)",
      "passenger_statistics": {
        "variable": "Passenger Count",
        "unit": "passengers / hr",
        "count": 14098,
        "mean": 1841.28,
        "median": 1278.0,
        "variance": 2694747.44,
        "std_deviation": 1641.57,
        "min": 66.0,
        "max": 16247.0,
        "q1_25th_percentile": 739.0,
        "q3_75th_percentile": 2464.75,
        "iqr": 1725.75,
        "skewness": 1.88,
        "histogram": [
          {
            "range": "66 - 1684",
            "bin_start": 66.0,
            "bin_end": 1684.1,
            "count": 8640
          },
          {
            "range": "1684 - 3302",
            "bin_start": 1684.1,
            "bin_end": 3302.2,
            "count": 3146
          },
          {
            "range": "3302 - 4920",
            "bin_start": 3302.2,
            "bin_end": 4920.3,
            "count": 1435
          },
          {
            "range": "4920 - 6538",
            "bin_start": 4920.3,
            "bin_end": 6538.4,
            "count": 615
          },
          {
            "range": "6538 - 8156",
            "bin_start": 6538.4,
            "bin_end": 8156.5,
            "count": 173
          },
          {
            "range": "8156 - 9774",
            "bin_start": 8156.5,
            "bin_end": 9774.6,
            "count": 66
          },
          {
            "range": "9774 - 11392",
            "bin_start": 9774.6,
            "bin_end": 11392.7,
            "count": 14
          },
          {
            "range": "11392 - 13010",
            "bin_start": 11392.7,
            "bin_end": 13010.8,
            "count": 1
          },
          {
            "range": "13010 - 14628",
            "bin_start": 13010.8,
            "bin_end": 14628.9,
            "count": 3
          },
          {
            "range": "14628 - 16247",
            "bin_start": 14628.9,
            "bin_end": 16247.0,
            "count": 5
          }
        ]
      },
      "delay_statistics": {
        "variable": "Delay Duration",
        "unit": "minutes",
        "count": 14098,
        "mean": 2.79,
        "median": 2.4,
        "variance": 2.82,
        "std_deviation": 1.68,
        "min": 0.2,
        "max": 17.2,
        "q1_25th_percentile": 1.7,
        "q3_75th_percentile": 3.6,
        "iqr": 1.9,
        "skewness": 1.79,
        "histogram": [
          {
            "range": "0 - 1",
            "bin_start": 0.2,
            "bin_end": 1.9,
            "count": 4455
          },
          {
            "range": "1 - 3",
            "bin_start": 1.9,
            "bin_end": 3.6,
            "count": 6067
          },
          {
            "range": "3 - 5",
            "bin_start": 3.6,
            "bin_end": 5.3,
            "count": 2489
          },
          {
            "range": "5 - 7",
            "bin_start": 5.3,
            "bin_end": 7.0,
            "count": 699
          },
          {
            "range": "7 - 8",
            "bin_start": 7.0,
            "bin_end": 8.7,
            "count": 272
          },
          {
            "range": "8 - 10",
            "bin_start": 8.7,
            "bin_end": 10.4,
            "count": 71
          },
          {
            "range": "10 - 12",
            "bin_start": 10.4,
            "bin_end": 12.1,
            "count": 17
          },
          {
            "range": "12 - 13",
            "bin_start": 12.1,
            "bin_end": 13.8,
            "count": 12
          },
          {
            "range": "13 - 15",
            "bin_start": 13.8,
            "bin_end": 15.5,
            "count": 14
          },
          {
            "range": "15 - 17",
            "bin_start": 15.5,
            "bin_end": 17.2,
            "count": 2
          }
        ]
      },
      "plain_explanation": {
        "mean": "Mean represents the overall average passenger volume or delay time.",
        "median": "Median represents the middle value when all observations are sorted, resisting extreme outliers.",
        "std_dev": "Standard deviation measures how widely passenger demand fluctuates around the average.",
        "iqr": "Interquartile Range captures the middle 50% of transit operational conditions."
      }
    },
    "correlation": {
      "network_id": "delhi",
      "matrix": [
        {
          "variable": "Passenger Demand",
          "id": "passenger_count",
          "passenger_count": {
            "pearson_r": 1.0,
            "p_value": 0.0
          },
          "hour": {
            "pearson_r": -0.002,
            "p_value": 0.7804
          },
          "delay_minutes": {
            "pearson_r": 0.854,
            "p_value": 0.0
          },
          "occupancy_ratio": {
            "pearson_r": 0.64,
            "p_value": 0.0
          },
          "is_weekend": {
            "pearson_r": -0.153,
            "p_value": 0.0
          }
        },
        {
          "variable": "Hour of Day",
          "id": "hour",
          "passenger_count": {
            "pearson_r": -0.002,
            "p_value": 0.7804
          },
          "hour": {
            "pearson_r": 1.0,
            "p_value": 0.0
          },
          "delay_minutes": {
            "pearson_r": 0.002,
            "p_value": 0.7879
          },
          "occupancy_ratio": {
            "pearson_r": -0.005,
            "p_value": 0.5854
          },
          "is_weekend": {
            "pearson_r": -0.0,
            "p_value": 1.0
          }
        },
        {
          "variable": "Delay (min)",
          "id": "delay_minutes",
          "passenger_count": {
            "pearson_r": 0.854,
            "p_value": 0.0
          },
          "hour": {
            "pearson_r": 0.002,
            "p_value": 0.7879
          },
          "delay_minutes": {
            "pearson_r": 1.0,
            "p_value": 0.0
          },
          "occupancy_ratio": {
            "pearson_r": 0.68,
            "p_value": 0.0
          },
          "is_weekend": {
            "pearson_r": -0.202,
            "p_value": 0.0
          }
        },
        {
          "variable": "Occupancy Ratio",
          "id": "occupancy_ratio",
          "passenger_count": {
            "pearson_r": 0.64,
            "p_value": 0.0
          },
          "hour": {
            "pearson_r": -0.005,
            "p_value": 0.5854
          },
          "delay_minutes": {
            "pearson_r": 0.68,
            "p_value": 0.0
          },
          "occupancy_ratio": {
            "pearson_r": 1.0,
            "p_value": 0.0
          },
          "is_weekend": {
            "pearson_r": -0.25,
            "p_value": 0.0
          }
        },
        {
          "variable": "Weekend Flag",
          "id": "is_weekend",
          "passenger_count": {
            "pearson_r": -0.153,
            "p_value": 0.0
          },
          "hour": {
            "pearson_r": -0.0,
            "p_value": 1.0
          },
          "delay_minutes": {
            "pearson_r": -0.202,
            "p_value": 0.0
          },
          "occupancy_ratio": {
            "pearson_r": -0.25,
            "p_value": 0.0
          },
          "is_weekend": {
            "pearson_r": 1.0,
            "p_value": 0.0
          }
        }
      ],
      "variables": [
        "Passenger Demand",
        "Hour of Day",
        "Delay (min)",
        "Occupancy Ratio",
        "Weekend Flag"
      ],
      "column_keys": [
        "passenger_count",
        "hour",
        "delay_minutes",
        "occupancy_ratio",
        "is_weekend"
      ],
      "key_insights": [
        {
          "pair": "Passenger Demand vs. Delay Minutes",
          "correlation": 0.854,
          "strength": "Moderate Positive",
          "simple_explanation": "As passenger volume rises, delays moderately increase (r = 0.854). High station dwell times and boarding congestion add operational friction."
        },
        {
          "pair": "Passenger Demand vs. Weekend Indicator",
          "correlation": -0.153,
          "strength": "Moderate Negative",
          "simple_explanation": "Weekends exhibit lower transit ridership (r = -0.153) compared to weekday commuter surges."
        },
        {
          "pair": "Passenger Demand vs. Station Occupancy",
          "correlation": 0.64,
          "strength": "Strong Positive",
          "simple_explanation": "Station platform occupancy directly mirrors passenger demand spikes."
        }
      ],
      "guideline": "Correlation shows statistical association, not direct causation. Context must guide operational decisions."
    },
    "hypothesis": {
      "network_id": "delhi",
      "test_name": "Two-Sample Welch's t-Test",
      "research_question": "Does passenger demand differ significantly between weekdays and weekends?",
      "null_hypothesis_h0": "Average hourly passenger demand on weekdays equals average demand on weekends (\u03bc_weekday = \u03bc_weekend).",
      "alternative_hypothesis_h1": "Average hourly passenger demand differs between weekdays and weekends (\u03bc_weekday \u2260 \u03bc_weekend).",
      "significance_level_alpha": 0.05,
      "sample_sizes": {
        "weekday_observations": 10070,
        "weekend_observations": 4028
      },
      "sample_statistics": {
        "weekday_mean": 2000.6,
        "weekday_std": 1750.7,
        "weekend_mean": 1442.9,
        "weekend_std": 1244.2,
        "absolute_difference": 557.7
      },
      "test_results": {
        "t_statistic": 21.253,
        "p_value": 3.782932034210299e-98,
        "p_value_formatted": "< 0.0001",
        "cohens_d_effect_size": 0.34,
        "effect_magnitude": "Small",
        "decision": "Reject Null Hypothesis (H0)",
        "statistically_significant": true
      },
      "simple_interpretation": "There is a statistically significant difference in passenger demand between weekdays and weekends (t = 21.25, p < 0.001). Weekday demand (mean = 2000 passengers/hr) significantly exceeds weekend demand (mean = 1442 passengers/hr)."
    },
    "route_details": {
      "RT_DEL_YELLOW": {
        "network_id": "delhi",
        "route_id": "RT_DEL_YELLOW",
        "route_name": "Yellow Line (Line 2)",
        "line_code": "YELLOW",
        "color_hex": "#D89B32",
        "origin": "Samaypur Badli",
        "destination": "Millennium City Centre Gurugram",
        "length_km": 49.3,
        "total_stations": 17,
        "scheduled_headway_min": 3.0,
        "total_passengers": 10302626,
        "daily_avg_passengers": 735902,
        "avg_delay_min": 3.15,
        "peak_hour": "18:00",
        "corridor_stations": [
          {
            "station_id": "ST_DEL_SAM_01",
            "station_name": "Samaypur Badli",
            "latitude": 28.7455,
            "longitude": 77.1352,
            "is_interchange": false,
            "average_passengers": 1036,
            "peak_passengers": 2341,
            "average_delay_min": 2.3
          },
          {
            "station_id": "ST_DEL_JAH_02",
            "station_name": "Jahangirpuri",
            "latitude": 28.7259,
            "longitude": 77.1643,
            "is_interchange": false,
            "average_passengers": 1027,
            "peak_passengers": 2297,
            "average_delay_min": 2.3
          },
          {
            "station_id": "ST_DEL_MOD_03",
            "station_name": "Model Town",
            "latitude": 28.7027,
            "longitude": 77.1939,
            "is_interchange": false,
            "average_passengers": 1024,
            "peak_passengers": 2270,
            "average_delay_min": 2.2
          },
          {
            "station_id": "ST_DEL_VIS_04",
            "station_name": "Vishwavidyalaya (DU)",
            "latitude": 28.6946,
            "longitude": 77.2137,
            "is_interchange": false,
            "average_passengers": 1031,
            "peak_passengers": 2302,
            "average_delay_min": 2.2
          },
          {
            "station_id": "ST_DEL_KAS_05",
            "station_name": "Kashmere Gate",
            "latitude": 28.6675,
            "longitude": 77.2285,
            "is_interchange": true,
            "average_passengers": 4197,
            "peak_passengers": 15974,
            "average_delay_min": 4.6
          },
          {
            "station_id": "ST_DEL_CHA_06",
            "station_name": "Chandni Chowk",
            "latitude": 28.6578,
            "longitude": 77.2302,
            "is_interchange": false,
            "average_passengers": 2893,
            "peak_passengers": 6299,
            "average_delay_min": 3.6
          },
          {
            "station_id": "ST_DEL_NDL_07",
            "station_name": "New Delhi Railway",
            "latitude": 28.6431,
            "longitude": 77.2223,
            "is_interchange": true,
            "average_passengers": 3962,
            "peak_passengers": 9491,
            "average_delay_min": 4.4
          },
          {
            "station_id": "ST_DEL_RAJ_08",
            "station_name": "Rajiv Chowk (CP)",
            "latitude": 28.6328,
            "longitude": 77.2195,
            "is_interchange": true,
            "average_passengers": 4688,
            "peak_passengers": 14934,
            "average_delay_min": 4.9
          },
          {
            "station_id": "ST_DEL_PAT_09",
            "station_name": "Patel Chowk",
            "latitude": 28.6231,
            "longitude": 77.214,
            "is_interchange": false,
            "average_passengers": 1028,
            "peak_passengers": 2360,
            "average_delay_min": 2.3
          },
          {
            "station_id": "ST_DEL_SEC_10",
            "station_name": "Central Secretariat",
            "latitude": 28.6146,
            "longitude": 77.2119,
            "is_interchange": true,
            "average_passengers": 3059,
            "peak_passengers": 6936,
            "average_delay_min": 3.8
          },
          {
            "station_id": "ST_DEL_AIM_11",
            "station_name": "AIIMS",
            "latitude": 28.5684,
            "longitude": 77.2078,
            "is_interchange": false,
            "average_passengers": 2806,
            "peak_passengers": 6075,
            "average_delay_min": 3.6
          },
          {
            "station_id": "ST_DEL_HAU_12",
            "station_name": "Hauz Khas",
            "latitude": 28.5432,
            "longitude": 77.2065,
            "is_interchange": true,
            "average_passengers": 3301,
            "peak_passengers": 7253,
            "average_delay_min": 3.9
          },
          {
            "station_id": "ST_DEL_SAK_13",
            "station_name": "Saket",
            "latitude": 28.5204,
            "longitude": 77.2016,
            "is_interchange": false,
            "average_passengers": 1032,
            "peak_passengers": 2453,
            "average_delay_min": 2.3
          },
          {
            "station_id": "ST_DEL_QUT_14",
            "station_name": "Qutab Minar",
            "latitude": 28.5135,
            "longitude": 77.1858,
            "is_interchange": false,
            "average_passengers": 1036,
            "peak_passengers": 2396,
            "average_delay_min": 2.2
          },
          {
            "station_id": "ST_DEL_SIK_15",
            "station_name": "Sikanderpur",
            "latitude": 28.4819,
            "longitude": 77.0927,
            "is_interchange": true,
            "average_passengers": 2902,
            "peak_passengers": 6560,
            "average_delay_min": 3.6
          },
          {
            "station_id": "ST_DEL_MGR_16",
            "station_name": "MG Road Gurugram",
            "latitude": 28.48,
            "longitude": 77.0805,
            "is_interchange": false,
            "average_passengers": 1028,
            "peak_passengers": 2209,
            "average_delay_min": 2.3
          },
          {
            "station_id": "ST_DEL_MIL_17",
            "station_name": "Millennium City Centre",
            "latitude": 28.4593,
            "longitude": 77.0726,
            "is_interchange": false,
            "average_passengers": 2675,
            "peak_passengers": 6031,
            "average_delay_min": 3.4
          }
        ],
        "hourly_demand": [
          {
            "hour": 5,
            "time": "05:00",
            "passengers": 7344,
            "delay": 1.5
          },
          {
            "hour": 6,
            "time": "06:00",
            "passengers": 17117,
            "delay": 1.9
          },
          {
            "hour": 7,
            "time": "07:00",
            "passengers": 32040,
            "delay": 2.5
          },
          {
            "hour": 8,
            "time": "08:00",
            "passengers": 60701,
            "delay": 4.9
          },
          {
            "hour": 9,
            "time": "09:00",
            "passengers": 67474,
            "delay": 5.2
          },
          {
            "hour": 10,
            "time": "10:00",
            "passengers": 46898,
            "delay": 3.3
          },
          {
            "hour": 11,
            "time": "11:00",
            "passengers": 33549,
            "delay": 2.7
          },
          {
            "hour": 12,
            "time": "12:00",
            "passengers": 36222,
            "delay": 2.8
          },
          {
            "hour": 13,
            "time": "13:00",
            "passengers": 34531,
            "delay": 2.7
          },
          {
            "hour": 14,
            "time": "14:00",
            "passengers": 32731,
            "delay": 2.6
          },
          {
            "hour": 15,
            "time": "15:00",
            "passengers": 36407,
            "delay": 2.7
          },
          {
            "hour": 16,
            "time": "16:00",
            "passengers": 45301,
            "delay": 3.2
          },
          {
            "hour": 17,
            "time": "17:00",
            "passengers": 63551,
            "delay": 4.0
          },
          {
            "hour": 18,
            "time": "18:00",
            "passengers": 72477,
            "delay": 5.9
          },
          {
            "hour": 19,
            "time": "19:00",
            "passengers": 59545,
            "delay": 5.3
          },
          {
            "hour": 20,
            "time": "20:00",
            "passengers": 42950,
            "delay": 3.1
          },
          {
            "hour": 21,
            "time": "21:00",
            "passengers": 26602,
            "delay": 2.3
          },
          {
            "hour": 22,
            "time": "22:00",
            "passengers": 14292,
            "delay": 1.8
          },
          {
            "hour": 23,
            "time": "23:00",
            "passengers": 6170,
            "delay": 1.5
          }
        ]
      },
      "RT_DEL_BLUE": {
        "network_id": "delhi",
        "route_id": "RT_DEL_BLUE",
        "route_name": "Blue Line (Line 3/4)",
        "line_code": "BLUE",
        "color_hex": "#2F5D50",
        "origin": "Dwarka Sector 21",
        "destination": "Noida Electronic City",
        "length_km": 56.6,
        "total_stations": 12,
        "scheduled_headway_min": 3.5,
        "total_passengers": 6807784,
        "daily_avg_passengers": 486270,
        "avg_delay_min": 2.96,
        "peak_hour": "18:00",
        "corridor_stations": [
          {
            "station_id": "ST_DEL_DWK_18",
            "station_name": "Dwarka Sector 21",
            "latitude": 28.5523,
            "longitude": 77.0583,
            "is_interchange": true,
            "average_passengers": 1037,
            "peak_passengers": 2336,
            "average_delay_min": 2.2
          },
          {
            "station_id": "ST_DEL_DWM_19",
            "station_name": "Dwarka Mor",
            "latitude": 28.6193,
            "longitude": 77.0332,
            "is_interchange": false,
            "average_passengers": 1031,
            "peak_passengers": 2205,
            "average_delay_min": 2.2
          },
          {
            "station_id": "ST_DEL_JAN_20",
            "station_name": "Janakpuri West",
            "latitude": 28.6294,
            "longitude": 77.0778,
            "is_interchange": true,
            "average_passengers": 2474,
            "peak_passengers": 5675,
            "average_delay_min": 3.1
          },
          {
            "station_id": "ST_DEL_RAJ_21",
            "station_name": "Rajouri Garden",
            "latitude": 28.6489,
            "longitude": 77.1215,
            "is_interchange": true,
            "average_passengers": 1029,
            "peak_passengers": 2253,
            "average_delay_min": 2.1
          },
          {
            "station_id": "ST_DEL_KAR_22",
            "station_name": "Karol Bagh",
            "latitude": 28.6442,
            "longitude": 77.1904,
            "is_interchange": false,
            "average_passengers": 2555,
            "peak_passengers": 5833,
            "average_delay_min": 3.3
          },
          {
            "station_id": "ST_DEL_RAJ_08",
            "station_name": "Rajiv Chowk (CP)",
            "latitude": 28.6328,
            "longitude": 77.2195,
            "is_interchange": true,
            "average_passengers": 4692,
            "peak_passengers": 16232,
            "average_delay_min": 4.8
          },
          {
            "station_id": "ST_DEL_MAN_23",
            "station_name": "Mandi House",
            "latitude": 28.6258,
            "longitude": 77.2343,
            "is_interchange": true,
            "average_passengers": 2687,
            "peak_passengers": 6118,
            "average_delay_min": 3.4
          },
          {
            "station_id": "ST_DEL_AKS_24",
            "station_name": "Akshardham",
            "latitude": 28.6179,
            "longitude": 77.2795,
            "is_interchange": false,
            "average_passengers": 2256,
            "peak_passengers": 5230,
            "average_delay_min": 3.0
          },
          {
            "station_id": "ST_DEL_MAY_25",
            "station_name": "Mayur Vihar-I",
            "latitude": 28.6047,
            "longitude": 77.2952,
            "is_interchange": true,
            "average_passengers": 1030,
            "peak_passengers": 2282,
            "average_delay_min": 2.1
          },
          {
            "station_id": "ST_DEL_NOI_26",
            "station_name": "Noida Sector 18",
            "latitude": 28.5708,
            "longitude": 77.3219,
            "is_interchange": false,
            "average_passengers": 2785,
            "peak_passengers": 6107,
            "average_delay_min": 3.4
          },
          {
            "station_id": "ST_DEL_BOT_27",
            "station_name": "Botanical Garden",
            "latitude": 28.5641,
            "longitude": 77.3343,
            "is_interchange": true,
            "average_passengers": 2983,
            "peak_passengers": 6403,
            "average_delay_min": 3.6
          },
          {
            "station_id": "ST_DEL_NOE_28",
            "station_name": "Noida Electronic City",
            "latitude": 28.6276,
            "longitude": 77.3725,
            "is_interchange": false,
            "average_passengers": 1028,
            "peak_passengers": 2342,
            "average_delay_min": 2.2
          }
        ],
        "hourly_demand": [
          {
            "hour": 5,
            "time": "05:00",
            "passengers": 4913,
            "delay": 1.5
          },
          {
            "hour": 6,
            "time": "06:00",
            "passengers": 11382,
            "delay": 1.8
          },
          {
            "hour": 7,
            "time": "07:00",
            "passengers": 21047,
            "delay": 2.4
          },
          {
            "hour": 8,
            "time": "08:00",
            "passengers": 40221,
            "delay": 4.7
          },
          {
            "hour": 9,
            "time": "09:00",
            "passengers": 44814,
            "delay": 4.9
          },
          {
            "hour": 10,
            "time": "10:00",
            "passengers": 31412,
            "delay": 3.1
          },
          {
            "hour": 11,
            "time": "11:00",
            "passengers": 22193,
            "delay": 2.5
          },
          {
            "hour": 12,
            "time": "12:00",
            "passengers": 24046,
            "delay": 2.7
          },
          {
            "hour": 13,
            "time": "13:00",
            "passengers": 22962,
            "delay": 2.6
          },
          {
            "hour": 14,
            "time": "14:00",
            "passengers": 21681,
            "delay": 2.5
          },
          {
            "hour": 15,
            "time": "15:00",
            "passengers": 24144,
            "delay": 2.6
          },
          {
            "hour": 16,
            "time": "16:00",
            "passengers": 29982,
            "delay": 3.1
          },
          {
            "hour": 17,
            "time": "17:00",
            "passengers": 42121,
            "delay": 3.8
          },
          {
            "hour": 18,
            "time": "18:00",
            "passengers": 46688,
            "delay": 5.1
          },
          {
            "hour": 19,
            "time": "19:00",
            "passengers": 38874,
            "delay": 4.6
          },
          {
            "hour": 20,
            "time": "20:00",
            "passengers": 28594,
            "delay": 2.9
          },
          {
            "hour": 21,
            "time": "21:00",
            "passengers": 17636,
            "delay": 2.3
          },
          {
            "hour": 22,
            "time": "22:00",
            "passengers": 9468,
            "delay": 1.7
          },
          {
            "hour": 23,
            "time": "23:00",
            "passengers": 4092,
            "delay": 1.4
          }
        ]
      },
      "RT_DEL_RED": {
        "network_id": "delhi",
        "route_id": "RT_DEL_RED",
        "route_name": "Red Line (Line 1)",
        "line_code": "RED",
        "color_hex": "#B94A3A",
        "origin": "Rithala",
        "destination": "Shaheed Sthal Ghaziabad",
        "length_km": 34.4,
        "total_stations": 8,
        "scheduled_headway_min": 4.0,
        "total_passengers": 3036185,
        "daily_avg_passengers": 216870,
        "avg_delay_min": 2.46,
        "peak_hour": "18:00",
        "corridor_stations": [
          {
            "station_id": "ST_DEL_RIT_29",
            "station_name": "Rithala",
            "latitude": 28.7207,
            "longitude": 77.1071,
            "is_interchange": false,
            "average_passengers": 1030,
            "peak_passengers": 2449,
            "average_delay_min": 2.1
          },
          {
            "station_id": "ST_DEL_NSP_30",
            "station_name": "Netaji Subhash Place",
            "latitude": 28.6953,
            "longitude": 77.1524,
            "is_interchange": true,
            "average_passengers": 1026,
            "peak_passengers": 2438,
            "average_delay_min": 2.2
          },
          {
            "station_id": "ST_DEL_IND_31",
            "station_name": "Inderlok",
            "latitude": 28.6732,
            "longitude": 77.1698,
            "is_interchange": true,
            "average_passengers": 1028,
            "peak_passengers": 2357,
            "average_delay_min": 2.2
          },
          {
            "station_id": "ST_DEL_TIS_32",
            "station_name": "Tis Hazari",
            "latitude": 28.6672,
            "longitude": 77.2163,
            "is_interchange": false,
            "average_passengers": 1025,
            "peak_passengers": 2298,
            "average_delay_min": 2.2
          },
          {
            "station_id": "ST_DEL_KAS_05",
            "station_name": "Kashmere Gate",
            "latitude": 28.6675,
            "longitude": 77.2285,
            "is_interchange": true,
            "average_passengers": 4200,
            "peak_passengers": 16247,
            "average_delay_min": 4.4
          },
          {
            "station_id": "ST_DEL_SHA_33",
            "station_name": "Shahdara",
            "latitude": 28.6735,
            "longitude": 77.2872,
            "is_interchange": false,
            "average_passengers": 1035,
            "peak_passengers": 2203,
            "average_delay_min": 2.2
          },
          {
            "station_id": "ST_DEL_DIL_34",
            "station_name": "Dilshad Garden",
            "latitude": 28.6759,
            "longitude": 77.3215,
            "is_interchange": false,
            "average_passengers": 1032,
            "peak_passengers": 2201,
            "average_delay_min": 2.2
          },
          {
            "station_id": "ST_DEL_SSG_35",
            "station_name": "Shaheed Sthal Ghaziabad",
            "latitude": 28.6711,
            "longitude": 77.4124,
            "is_interchange": false,
            "average_passengers": 1035,
            "peak_passengers": 2302,
            "average_delay_min": 2.1
          }
        ],
        "hourly_demand": [
          {
            "hour": 5,
            "time": "05:00",
            "passengers": 2172,
            "delay": 1.4
          },
          {
            "hour": 6,
            "time": "06:00",
            "passengers": 5053,
            "delay": 1.6
          },
          {
            "hour": 7,
            "time": "07:00",
            "passengers": 9301,
            "delay": 2.0
          },
          {
            "hour": 8,
            "time": "08:00",
            "passengers": 17871,
            "delay": 3.9
          },
          {
            "hour": 9,
            "time": "09:00",
            "passengers": 19817,
            "delay": 4.1
          },
          {
            "hour": 10,
            "time": "10:00",
            "passengers": 13967,
            "delay": 2.4
          },
          {
            "hour": 11,
            "time": "11:00",
            "passengers": 9872,
            "delay": 2.1
          },
          {
            "hour": 12,
            "time": "12:00",
            "passengers": 10560,
            "delay": 2.1
          },
          {
            "hour": 13,
            "time": "13:00",
            "passengers": 10139,
            "delay": 2.1
          },
          {
            "hour": 14,
            "time": "14:00",
            "passengers": 9530,
            "delay": 2.0
          },
          {
            "hour": 15,
            "time": "15:00",
            "passengers": 10685,
            "delay": 2.2
          },
          {
            "hour": 16,
            "time": "16:00",
            "passengers": 13274,
            "delay": 2.3
          },
          {
            "hour": 17,
            "time": "17:00",
            "passengers": 19471,
            "delay": 3.0
          },
          {
            "hour": 18,
            "time": "18:00",
            "passengers": 21356,
            "delay": 4.2
          },
          {
            "hour": 19,
            "time": "19:00",
            "passengers": 17532,
            "delay": 3.9
          },
          {
            "hour": 20,
            "time": "20:00",
            "passengers": 12458,
            "delay": 2.4
          },
          {
            "hour": 21,
            "time": "21:00",
            "passengers": 7789,
            "delay": 1.9
          },
          {
            "hour": 22,
            "time": "22:00",
            "passengers": 4210,
            "delay": 1.7
          },
          {
            "hour": 23,
            "time": "23:00",
            "passengers": 1813,
            "delay": 1.4
          }
        ]
      },
      "RT_DEL_VIOLET": {
        "network_id": "delhi",
        "route_id": "RT_DEL_VIOLET",
        "route_name": "Violet Line (Line 6)",
        "line_code": "VIOLET",
        "color_hex": "#7A5C6E",
        "origin": "Kashmere Gate",
        "destination": "Badarpur Border",
        "length_km": 46.6,
        "total_stations": 10,
        "scheduled_headway_min": 4.5,
        "total_passengers": 3696955,
        "daily_avg_passengers": 264068,
        "avg_delay_min": 2.44,
        "peak_hour": "18:00",
        "corridor_stations": [
          {
            "station_id": "ST_DEL_KAS_05",
            "station_name": "Kashmere Gate",
            "latitude": 28.6675,
            "longitude": 77.2285,
            "is_interchange": true,
            "average_passengers": 3143,
            "peak_passengers": 10531,
            "average_delay_min": 3.7
          },
          {
            "station_id": "ST_DEL_LAQ_36",
            "station_name": "Lal Quila (Red Fort)",
            "latitude": 28.656,
            "longitude": 77.241,
            "is_interchange": false,
            "average_passengers": 770,
            "peak_passengers": 1661,
            "average_delay_min": 2.0
          },
          {
            "station_id": "ST_DEL_DEL_37",
            "station_name": "Delhi Gate",
            "latitude": 28.6406,
            "longitude": 77.2405,
            "is_interchange": false,
            "average_passengers": 769,
            "peak_passengers": 1821,
            "average_delay_min": 2.0
          },
          {
            "station_id": "ST_DEL_ITO_38",
            "station_name": "ITO",
            "latitude": 28.6292,
            "longitude": 77.2412,
            "is_interchange": false,
            "average_passengers": 778,
            "peak_passengers": 1850,
            "average_delay_min": 2.1
          },
          {
            "station_id": "ST_DEL_MAN_23",
            "station_name": "Mandi House",
            "latitude": 28.6258,
            "longitude": 77.2343,
            "is_interchange": true,
            "average_passengers": 2003,
            "peak_passengers": 4285,
            "average_delay_min": 2.8
          },
          {
            "station_id": "ST_DEL_SEC_10",
            "station_name": "Central Secretariat",
            "latitude": 28.6146,
            "longitude": 77.2119,
            "is_interchange": true,
            "average_passengers": 2328,
            "peak_passengers": 5390,
            "average_delay_min": 3.1
          },
          {
            "station_id": "ST_DEL_KHA_39",
            "station_name": "Khan Market",
            "latitude": 28.6003,
            "longitude": 77.2272,
            "is_interchange": false,
            "average_passengers": 783,
            "peak_passengers": 1740,
            "average_delay_min": 2.0
          },
          {
            "station_id": "ST_DEL_LAJ_40",
            "station_name": "Lajpat Nagar",
            "latitude": 28.5706,
            "longitude": 77.2374,
            "is_interchange": true,
            "average_passengers": 1766,
            "peak_passengers": 3876,
            "average_delay_min": 2.7
          },
          {
            "station_id": "ST_DEL_KAL_41",
            "station_name": "Kalkaji Mandir",
            "latitude": 28.5501,
            "longitude": 77.2514,
            "is_interchange": true,
            "average_passengers": 780,
            "peak_passengers": 1709,
            "average_delay_min": 2.0
          },
          {
            "station_id": "ST_DEL_BAD_42",
            "station_name": "Badarpur Border",
            "latitude": 28.4947,
            "longitude": 77.3005,
            "is_interchange": false,
            "average_passengers": 773,
            "peak_passengers": 1917,
            "average_delay_min": 1.9
          }
        ],
        "hourly_demand": [
          {
            "hour": 5,
            "time": "05:00",
            "passengers": 2611,
            "delay": 1.3
          },
          {
            "hour": 6,
            "time": "06:00",
            "passengers": 6110,
            "delay": 1.6
          },
          {
            "hour": 7,
            "time": "07:00",
            "passengers": 11646,
            "delay": 2.0
          },
          {
            "hour": 8,
            "time": "08:00",
            "passengers": 21566,
            "delay": 3.7
          },
          {
            "hour": 9,
            "time": "09:00",
            "passengers": 24724,
            "delay": 4.1
          },
          {
            "hour": 10,
            "time": "10:00",
            "passengers": 16855,
            "delay": 2.4
          },
          {
            "hour": 11,
            "time": "11:00",
            "passengers": 12142,
            "delay": 2.1
          },
          {
            "hour": 12,
            "time": "12:00",
            "passengers": 12759,
            "delay": 2.0
          },
          {
            "hour": 13,
            "time": "13:00",
            "passengers": 12255,
            "delay": 2.0
          },
          {
            "hour": 14,
            "time": "14:00",
            "passengers": 11812,
            "delay": 2.2
          },
          {
            "hour": 15,
            "time": "15:00",
            "passengers": 12932,
            "delay": 2.1
          },
          {
            "hour": 16,
            "time": "16:00",
            "passengers": 16199,
            "delay": 2.4
          },
          {
            "hour": 17,
            "time": "17:00",
            "passengers": 22653,
            "delay": 2.9
          },
          {
            "hour": 18,
            "time": "18:00",
            "passengers": 25749,
            "delay": 4.2
          },
          {
            "hour": 19,
            "time": "19:00",
            "passengers": 21768,
            "delay": 3.9
          },
          {
            "hour": 20,
            "time": "20:00",
            "passengers": 15324,
            "delay": 2.3
          },
          {
            "hour": 21,
            "time": "21:00",
            "passengers": 9599,
            "delay": 2.0
          },
          {
            "hour": 22,
            "time": "22:00",
            "passengers": 5114,
            "delay": 1.6
          },
          {
            "hour": 23,
            "time": "23:00",
            "passengers": 2249,
            "delay": 1.4
          }
        ]
      },
      "RT_DEL_AIRPORT": {
        "network_id": "delhi",
        "route_id": "RT_DEL_AIRPORT",
        "route_name": "Airport Express Line",
        "line_code": "ORANGE",
        "color_hex": "#C96F4A",
        "origin": "New Delhi Railway",
        "destination": "Yashobhoomi Dwarka Sec 25",
        "length_km": 24.9,
        "total_stations": 6,
        "scheduled_headway_min": 8.0,
        "total_passengers": 2114868,
        "daily_avg_passengers": 151062,
        "avg_delay_min": 2.44,
        "peak_hour": "18:00",
        "corridor_stations": [
          {
            "station_id": "ST_DEL_NDL_07",
            "station_name": "New Delhi Railway",
            "latitude": 28.6431,
            "longitude": 77.2223,
            "is_interchange": true,
            "average_passengers": 2921,
            "peak_passengers": 6472,
            "average_delay_min": 3.6
          },
          {
            "station_id": "ST_DEL_SHI_43",
            "station_name": "Shivaji Stadium",
            "latitude": 28.6295,
            "longitude": 77.213,
            "is_interchange": false,
            "average_passengers": 771,
            "peak_passengers": 1699,
            "average_delay_min": 2.1
          },
          {
            "station_id": "ST_DEL_DHA_44",
            "station_name": "Dhaula Kuan",
            "latitude": 28.5925,
            "longitude": 77.161,
            "is_interchange": true,
            "average_passengers": 775,
            "peak_passengers": 1699,
            "average_delay_min": 1.9
          },
          {
            "station_id": "ST_DEL_AER_45",
            "station_name": "Delhi Aerocity",
            "latitude": 28.5492,
            "longitude": 77.1215,
            "is_interchange": false,
            "average_passengers": 769,
            "peak_passengers": 1740,
            "average_delay_min": 2.0
          },
          {
            "station_id": "ST_DEL_IGI_46",
            "station_name": "IGI Airport (T3)",
            "latitude": 28.5562,
            "longitude": 77.0864,
            "is_interchange": false,
            "average_passengers": 1941,
            "peak_passengers": 4203,
            "average_delay_min": 2.8
          },
          {
            "station_id": "ST_DEL_YAS_47",
            "station_name": "Yashobhoomi Dwarka Sec 25",
            "latitude": 28.545,
            "longitude": 77.042,
            "is_interchange": false,
            "average_passengers": 770,
            "peak_passengers": 1748,
            "average_delay_min": 2.1
          }
        ],
        "hourly_demand": [
          {
            "hour": 5,
            "time": "05:00",
            "passengers": 1549,
            "delay": 1.4
          },
          {
            "hour": 6,
            "time": "06:00",
            "passengers": 3498,
            "delay": 1.8
          },
          {
            "hour": 7,
            "time": "07:00",
            "passengers": 6549,
            "delay": 2.0
          },
          {
            "hour": 8,
            "time": "08:00",
            "passengers": 12328,
            "delay": 3.9
          },
          {
            "hour": 9,
            "time": "09:00",
            "passengers": 14052,
            "delay": 4.1
          },
          {
            "hour": 10,
            "time": "10:00",
            "passengers": 9589,
            "delay": 2.4
          },
          {
            "hour": 11,
            "time": "11:00",
            "passengers": 6914,
            "delay": 2.1
          },
          {
            "hour": 12,
            "time": "12:00",
            "passengers": 7453,
            "delay": 2.1
          },
          {
            "hour": 13,
            "time": "13:00",
            "passengers": 7138,
            "delay": 2.1
          },
          {
            "hour": 14,
            "time": "14:00",
            "passengers": 6660,
            "delay": 2.0
          },
          {
            "hour": 15,
            "time": "15:00",
            "passengers": 7475,
            "delay": 2.2
          },
          {
            "hour": 16,
            "time": "16:00",
            "passengers": 9177,
            "delay": 2.4
          },
          {
            "hour": 17,
            "time": "17:00",
            "passengers": 13080,
            "delay": 2.8
          },
          {
            "hour": 18,
            "time": "18:00",
            "passengers": 14622,
            "delay": 4.0
          },
          {
            "hour": 19,
            "time": "19:00",
            "passengers": 12300,
            "delay": 3.9
          },
          {
            "hour": 20,
            "time": "20:00",
            "passengers": 9049,
            "delay": 2.4
          },
          {
            "hour": 21,
            "time": "21:00",
            "passengers": 5385,
            "delay": 1.8
          },
          {
            "hour": 22,
            "time": "22:00",
            "passengers": 2978,
            "delay": 1.6
          },
          {
            "hour": 23,
            "time": "23:00",
            "passengers": 1265,
            "delay": 1.4
          }
        ]
      }
    }
  }
};

export function getFallbackDemand(networkId: string = 'chennai') {
  const key = networkId === 'delhi' ? 'delhi' : 'chennai';
  return ANALYTICS_DATA[key]?.demand || ANALYTICS_DATA['chennai'].demand;
}

export function getFallbackDelays(networkId: string = 'chennai') {
  const key = networkId === 'delhi' ? 'delhi' : 'chennai';
  return ANALYTICS_DATA[key]?.delays || ANALYTICS_DATA['chennai'].delays;
}

export function getFallbackAnomalies(networkId: string = 'chennai') {
  const key = networkId === 'delhi' ? 'delhi' : 'chennai';
  return ANALYTICS_DATA[key]?.anomalies || ANALYTICS_DATA['chennai'].anomalies;
}

export function getFallbackClusters(networkId: string = 'chennai') {
  const key = networkId === 'delhi' ? 'delhi' : 'chennai';
  return ANALYTICS_DATA[key]?.clusters || ANALYTICS_DATA['chennai'].clusters;
}

export function getFallbackRegression(networkId: string = 'chennai') {
  const key = networkId === 'delhi' ? 'delhi' : 'chennai';
  return ANALYTICS_DATA[key]?.regression || ANALYTICS_DATA['chennai'].regression;
}

export function getFallbackStats(networkId: string = 'chennai') {
  const key = networkId === 'delhi' ? 'delhi' : 'chennai';
  return ANALYTICS_DATA[key]?.descriptive_stats || ANALYTICS_DATA['chennai'].descriptive_stats;
}

export function getFallbackCorrelation(networkId: string = 'chennai') {
  const key = networkId === 'delhi' ? 'delhi' : 'chennai';
  return ANALYTICS_DATA[key]?.correlation || ANALYTICS_DATA['chennai'].correlation;
}

export function getFallbackHypothesis(networkId: string = 'chennai') {
  const key = networkId === 'delhi' ? 'delhi' : 'chennai';
  return ANALYTICS_DATA[key]?.hypothesis || ANALYTICS_DATA['chennai'].hypothesis;
}

export function getFallbackRouteDetail(routeId: string, networkId: string = 'chennai') {
  const key = networkId === 'delhi' ? 'delhi' : 'chennai';
  const cityRoutes = ANALYTICS_DATA[key]?.route_details || {};
  if (cityRoutes[routeId]) {
    return cityRoutes[routeId];
  }
  // Return first route if not found
  const firstKey = Object.keys(cityRoutes)[0];
  return cityRoutes[firstKey] || null;
}
