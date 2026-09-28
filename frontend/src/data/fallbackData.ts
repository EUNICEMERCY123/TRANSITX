import { TransitNetwork, Route, Station, SystemSummary, NetworkSnapshot } from '../types/transit';

export const FALLBACK_NETWORKS: TransitNetwork[] = [
  {
    "id": "chennai",
    "name": "Chennai Transit Network",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "country": "India",
    "system_type": "Metro Rail, Southern Suburban & MRTS Corridors",
    "operator": "CMRL & Southern Railway",
    "center": [
      13.045,
      80.235
    ],
    "zoom": 11.8,
    "pitch": 52,
    "bearing": -12,
    "lines_count": 5,
    "stations_count": 47,
    "color": "#2563EB",
    "description": "Multi-modal transit network connecting Central Chennai to Airport, Tambaram suburban corridor, and coastal IT belts."
  },
  {
    "id": "delhi",
    "name": "Delhi Metro Rail (DMRC)",
    "city": "Delhi NCR",
    "state": "National Capital Region",
    "country": "India",
    "system_type": "Rapid Transit & Airport Express Metro",
    "operator": "Delhi Metro Rail Corporation (DMRC)",
    "center": [
      28.6139,
      77.209
    ],
    "zoom": 11.2,
    "pitch": 54,
    "bearing": -15,
    "lines_count": 5,
    "stations_count": 42,
    "color": "#DC2626",
    "description": "India's largest and most utilized rapid transit network connecting Delhi, Gurugram, Noida, and Ghaziabad."
  }
];

export const FALLBACK_CHENNAI_ROUTES: Route[] = [
  {
    "route_id": "RT_CHN_BLUE",
    "route_name": "Blue Line",
    "line_code": "BLUE",
    "color_hex": "#2F5D50",
    "origin": "Chennai Airport",
    "destination": "Washermanpet",
    "length_km": 23.1,
    "total_stations": 13,
    "scheduled_headway_min": 5.0,
    "station_sequence": [
      "ST_CHN_AIR_01",
      "ST_CHN_MEA_02",
      "ST_CHN_ALN_03",
      "ST_CHN_GUI_04",
      "ST_CHN_SAI_05",
      "ST_CHN_NAN_06",
      "ST_CHN_TEY_07",
      "ST_CHN_AGD_08",
      "ST_CHN_THO_09",
      "ST_CHN_LIC_10",
      "ST_CHN_CEN_11",
      "ST_CHN_HIG_12",
      "ST_CHN_WAS_13"
    ],
    "coordinates_path": [
      [
        12.979,
        80.165
      ],
      [
        12.986,
        80.177
      ],
      [
        13.0035,
        80.2015
      ],
      [
        13.009,
        80.213
      ],
      [
        13.02,
        80.228
      ],
      [
        13.028,
        80.2405
      ],
      [
        13.036,
        80.244
      ],
      [
        13.044,
        80.2475
      ],
      [
        13.056,
        80.252
      ],
      [
        13.0673,
        80.2701
      ],
      [
        13.0827,
        80.2755
      ],
      [
        13.088,
        80.287
      ],
      [
        13.107,
        80.289
      ]
    ],
    "total_passengers": 3901259,
    "daily_avg_passengers": 278661,
    "avg_delay_min": 2.26
  },
  {
    "route_id": "RT_CHN_GREEN",
    "route_name": "Green Line",
    "line_code": "GREEN",
    "color_hex": "#71805A",
    "origin": "Chennai Central",
    "destination": "St. Thomas Mount",
    "length_km": 22.0,
    "total_stations": 13,
    "scheduled_headway_min": 6.0,
    "station_sequence": [
      "ST_CHN_CEN_11",
      "ST_CHN_EGM_14",
      "ST_CHN_NEH_15",
      "ST_CHN_KIL_16",
      "ST_CHN_SHE_17",
      "ST_CHN_ANN_18",
      "ST_CHN_ANT_19",
      "ST_CHN_THI_20",
      "ST_CHN_KOY_21",
      "ST_CHN_CMB_22",
      "ST_CHN_VAD_23",
      "ST_CHN_ASH_24",
      "ST_CHN_STM_25"
    ],
    "coordinates_path": [
      [
        13.0827,
        80.2755
      ],
      [
        13.0784,
        80.2612
      ],
      [
        13.079,
        80.248
      ],
      [
        13.078,
        80.241
      ],
      [
        13.0775,
        80.226
      ],
      [
        13.085,
        80.217
      ],
      [
        13.086,
        80.21
      ],
      [
        13.085,
        80.198
      ],
      [
        13.0725,
        80.1945
      ],
      [
        13.066,
        80.203
      ],
      [
        13.051,
        80.212
      ],
      [
        13.036,
        80.2115
      ],
      [
        13.004,
        80.196
      ]
    ],
    "total_passengers": 2796730,
    "daily_avg_passengers": 199766,
    "avg_delay_min": 2.07
  },
  {
    "route_id": "RT_CHN_RED",
    "route_name": "Red Line (Suburban South)",
    "line_code": "RED",
    "color_hex": "#B94A3A",
    "origin": "Chennai Beach",
    "destination": "Tambaram",
    "length_km": 29.0,
    "total_stations": 11,
    "scheduled_headway_min": 8.0,
    "station_sequence": [
      "ST_CHN_BCH_26",
      "ST_CHN_FOR_27",
      "ST_CHN_PRK_28",
      "ST_CHN_CEN_11",
      "ST_CHN_EGM_14",
      "ST_CHN_NUN_29",
      "ST_CHN_KOD_30",
      "ST_CHN_MAM_31",
      "ST_CHN_GUI_04",
      "ST_CHN_STM_25",
      "ST_CHN_TAM_34"
    ],
    "coordinates_path": [
      [
        13.0945,
        80.293
      ],
      [
        13.0855,
        80.288
      ],
      [
        13.0805,
        80.276
      ],
      [
        13.0827,
        80.2755
      ],
      [
        13.0784,
        80.2612
      ],
      [
        13.062,
        80.237
      ],
      [
        13.051,
        80.23
      ],
      [
        13.0395,
        80.228
      ],
      [
        13.009,
        80.213
      ],
      [
        13.004,
        80.196
      ],
      [
        12.926,
        80.117
      ]
    ],
    "total_passengers": 4338335,
    "daily_avg_passengers": 309881,
    "avg_delay_min": 2.51
  },
  {
    "route_id": "RT_CHN_ORANGE",
    "route_name": "Orange Line (MRTS)",
    "line_code": "ORANGE",
    "color_hex": "#C96F4A",
    "origin": "Chennai Beach",
    "destination": "Velachery",
    "length_km": 19.3,
    "total_stations": 11,
    "scheduled_headway_min": 10.0,
    "station_sequence": [
      "ST_CHN_BCH_26",
      "ST_CHN_FOR_27",
      "ST_CHN_PRK_28",
      "ST_CHN_CHN_35",
      "ST_CHN_CHE_36",
      "ST_CHN_TRI_37",
      "ST_CHN_MYL_38",
      "ST_CHN_ADY_39",
      "ST_CHN_THV_40",
      "ST_CHN_TAR_41",
      "ST_CHN_VEL_42"
    ],
    "coordinates_path": [
      [
        13.0945,
        80.293
      ],
      [
        13.0855,
        80.288
      ],
      [
        13.0805,
        80.276
      ],
      [
        13.074,
        80.274
      ],
      [
        13.064,
        80.279
      ],
      [
        13.056,
        80.277
      ],
      [
        13.034,
        80.269
      ],
      [
        13.006,
        80.252
      ],
      [
        12.986,
        80.254
      ],
      [
        12.977,
        80.244
      ],
      [
        12.977,
        80.218
      ]
    ],
    "total_passengers": 2293326,
    "daily_avg_passengers": 163809,
    "avg_delay_min": 2.01
  },
  {
    "route_id": "RT_CHN_PURPLE",
    "route_name": "Purple Line (Suburban West)",
    "line_code": "PURPLE",
    "color_hex": "#7A5C6E",
    "origin": "Chennai Central",
    "destination": "Tiruvallur",
    "length_km": 41.8,
    "total_stations": 6,
    "scheduled_headway_min": 12.0,
    "station_sequence": [
      "ST_CHN_CEN_11",
      "ST_CHN_PER_43",
      "ST_CHN_VIL_44",
      "ST_CHN_AMB_45",
      "ST_CHN_AVA_46",
      "ST_CHN_TIR_47"
    ],
    "coordinates_path": [
      [
        13.0827,
        80.2755
      ],
      [
        13.111,
        80.244
      ],
      [
        13.11,
        80.207
      ],
      [
        13.118,
        80.155
      ],
      [
        13.12,
        80.1
      ],
      [
        13.143,
        79.907
      ]
    ],
    "total_passengers": 1491067,
    "daily_avg_passengers": 106505,
    "avg_delay_min": 2.11
  }
];

export const FALLBACK_CHENNAI_STATIONS: Station[] = [
  {
    "station_id": "ST_CHN_AIR_01",
    "station_name": "Chennai Airport",
    "latitude": 12.979,
    "longitude": 80.165,
    "zone": "South",
    "station_type": "Elevated",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_BLUE"
    ],
    "avg_passengers_per_hour": 1693,
    "peak_passengers": 3804,
    "avg_delay_min": 2.65,
    "avg_occupancy": 0.183
  },
  {
    "station_id": "ST_CHN_MEA_02",
    "station_name": "Meenambakkam",
    "latitude": 12.986,
    "longitude": 80.177,
    "zone": "South",
    "station_type": "Elevated",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_BLUE"
    ],
    "avg_passengers_per_hour": 765,
    "peak_passengers": 1760,
    "avg_delay_min": 2.0,
    "avg_occupancy": 0.182
  },
  {
    "station_id": "ST_CHN_ALN_03",
    "station_name": "Alandur",
    "latitude": 13.0035,
    "longitude": 80.2015,
    "zone": "South",
    "station_type": "Elevated",
    "is_interchange": true,
    "lines_served": [
      "RT_CHN_BLUE",
      "RT_CHN_GREEN"
    ],
    "avg_passengers_per_hour": 766,
    "peak_passengers": 1748,
    "avg_delay_min": 1.97,
    "avg_occupancy": 0.182
  },
  {
    "station_id": "ST_CHN_GUI_04",
    "station_name": "Guindy",
    "latitude": 13.009,
    "longitude": 80.213,
    "zone": "South",
    "station_type": "Elevated",
    "is_interchange": true,
    "lines_served": [
      "RT_CHN_BLUE",
      "RT_CHN_RED"
    ],
    "avg_passengers_per_hour": 1893,
    "peak_passengers": 4259,
    "avg_delay_min": 2.78,
    "avg_occupancy": 0.18
  },
  {
    "station_id": "ST_CHN_SAI_05",
    "station_name": "Saidapet",
    "latitude": 13.02,
    "longitude": 80.228,
    "zone": "Central",
    "station_type": "Underground",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_BLUE"
    ],
    "avg_passengers_per_hour": 767,
    "peak_passengers": 1750,
    "avg_delay_min": 2.02,
    "avg_occupancy": 0.183
  },
  {
    "station_id": "ST_CHN_NAN_06",
    "station_name": "Nandanam",
    "latitude": 13.028,
    "longitude": 80.2405,
    "zone": "Central",
    "station_type": "Underground",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_BLUE"
    ],
    "avg_passengers_per_hour": 755,
    "peak_passengers": 1706,
    "avg_delay_min": 1.94,
    "avg_occupancy": 0.18
  },
  {
    "station_id": "ST_CHN_TEY_07",
    "station_name": "Teynampet",
    "latitude": 13.036,
    "longitude": 80.244,
    "zone": "Central",
    "station_type": "Underground",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_BLUE"
    ],
    "avg_passengers_per_hour": 762,
    "peak_passengers": 1627,
    "avg_delay_min": 2.05,
    "avg_occupancy": 0.181
  },
  {
    "station_id": "ST_CHN_AGD_08",
    "station_name": "AG-DMS",
    "latitude": 13.044,
    "longitude": 80.2475,
    "zone": "Central",
    "station_type": "Underground",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_BLUE"
    ],
    "avg_passengers_per_hour": 771,
    "peak_passengers": 1768,
    "avg_delay_min": 1.98,
    "avg_occupancy": 0.184
  },
  {
    "station_id": "ST_CHN_THO_09",
    "station_name": "Thousand Lights",
    "latitude": 13.056,
    "longitude": 80.252,
    "zone": "Central",
    "station_type": "Underground",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_BLUE"
    ],
    "avg_passengers_per_hour": 765,
    "peak_passengers": 1677,
    "avg_delay_min": 1.98,
    "avg_occupancy": 0.182
  },
  {
    "station_id": "ST_CHN_LIC_10",
    "station_name": "Government Estate",
    "latitude": 13.0673,
    "longitude": 80.2701,
    "zone": "Central",
    "station_type": "Underground",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_BLUE"
    ],
    "avg_passengers_per_hour": 1299,
    "peak_passengers": 3037,
    "avg_delay_min": 2.42,
    "avg_occupancy": 0.182
  },
  {
    "station_id": "ST_CHN_CEN_11",
    "station_name": "Chennai Central",
    "latitude": 13.0827,
    "longitude": 80.2755,
    "zone": "Central",
    "station_type": "Underground",
    "is_interchange": true,
    "lines_served": [
      "RT_CHN_BLUE",
      "RT_CHN_GREEN",
      "RT_CHN_RED",
      "RT_CHN_PURPLE"
    ],
    "avg_passengers_per_hour": 2566,
    "peak_passengers": 9098,
    "avg_delay_min": 3.3,
    "avg_occupancy": 0.161
  },
  {
    "station_id": "ST_CHN_HIG_12",
    "station_name": "High Court",
    "latitude": 13.088,
    "longitude": 80.287,
    "zone": "North",
    "station_type": "Underground",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_BLUE"
    ],
    "avg_passengers_per_hour": 768,
    "peak_passengers": 1794,
    "avg_delay_min": 2.01,
    "avg_occupancy": 0.183
  },
  {
    "station_id": "ST_CHN_WAS_13",
    "station_name": "Washermanpet",
    "latitude": 13.107,
    "longitude": 80.289,
    "zone": "North",
    "station_type": "Underground",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_BLUE"
    ],
    "avg_passengers_per_hour": 756,
    "peak_passengers": 1702,
    "avg_delay_min": 2.0,
    "avg_occupancy": 0.18
  },
  {
    "station_id": "ST_CHN_EGM_14",
    "station_name": "Egmore",
    "latitude": 13.0784,
    "longitude": 80.2612,
    "zone": "Central",
    "station_type": "Underground",
    "is_interchange": true,
    "lines_served": [
      "RT_CHN_GREEN",
      "RT_CHN_RED"
    ],
    "avg_passengers_per_hour": 1617,
    "peak_passengers": 4265,
    "avg_delay_min": 2.64,
    "avg_occupancy": 0.16
  },
  {
    "station_id": "ST_CHN_NEH_15",
    "station_name": "Nehru Park",
    "latitude": 13.079,
    "longitude": 80.248,
    "zone": "Central",
    "station_type": "Underground",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_GREEN"
    ],
    "avg_passengers_per_hour": 573,
    "peak_passengers": 1296,
    "avg_delay_min": 1.88,
    "avg_occupancy": 0.136
  },
  {
    "station_id": "ST_CHN_KIL_16",
    "station_name": "Kilpauk",
    "latitude": 13.078,
    "longitude": 80.241,
    "zone": "Central",
    "station_type": "Underground",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_GREEN"
    ],
    "avg_passengers_per_hour": 574,
    "peak_passengers": 1311,
    "avg_delay_min": 1.88,
    "avg_occupancy": 0.137
  },
  {
    "station_id": "ST_CHN_SHE_17",
    "station_name": "Shenoy Nagar",
    "latitude": 13.0775,
    "longitude": 80.226,
    "zone": "West",
    "station_type": "Underground",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_GREEN"
    ],
    "avg_passengers_per_hour": 578,
    "peak_passengers": 1302,
    "avg_delay_min": 1.9,
    "avg_occupancy": 0.138
  },
  {
    "station_id": "ST_CHN_ANN_18",
    "station_name": "Anna Nagar East",
    "latitude": 13.085,
    "longitude": 80.217,
    "zone": "West",
    "station_type": "Underground",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_GREEN"
    ],
    "avg_passengers_per_hour": 576,
    "peak_passengers": 1216,
    "avg_delay_min": 1.91,
    "avg_occupancy": 0.137
  },
  {
    "station_id": "ST_CHN_ANT_19",
    "station_name": "Anna Nagar Tower",
    "latitude": 13.086,
    "longitude": 80.21,
    "zone": "West",
    "station_type": "Underground",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_GREEN"
    ],
    "avg_passengers_per_hour": 569,
    "peak_passengers": 1343,
    "avg_delay_min": 1.92,
    "avg_occupancy": 0.135
  },
  {
    "station_id": "ST_CHN_THI_20",
    "station_name": "Thirumangalam",
    "latitude": 13.085,
    "longitude": 80.198,
    "zone": "West",
    "station_type": "Underground",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_GREEN"
    ],
    "avg_passengers_per_hour": 578,
    "peak_passengers": 1282,
    "avg_delay_min": 1.95,
    "avg_occupancy": 0.138
  },
  {
    "station_id": "ST_CHN_KOY_21",
    "station_name": "Koyambedu",
    "latitude": 13.0725,
    "longitude": 80.1945,
    "zone": "West",
    "station_type": "Elevated",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_GREEN"
    ],
    "avg_passengers_per_hour": 1189,
    "peak_passengers": 2587,
    "avg_delay_min": 2.32,
    "avg_occupancy": 0.135
  },
  {
    "station_id": "ST_CHN_CMB_22",
    "station_name": "CMBT",
    "latitude": 13.066,
    "longitude": 80.203,
    "zone": "West",
    "station_type": "Elevated",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_GREEN"
    ],
    "avg_passengers_per_hour": 577,
    "peak_passengers": 1274,
    "avg_delay_min": 1.94,
    "avg_occupancy": 0.137
  },
  {
    "station_id": "ST_CHN_VAD_23",
    "station_name": "Vadapalani",
    "latitude": 13.051,
    "longitude": 80.212,
    "zone": "West",
    "station_type": "Elevated",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_GREEN"
    ],
    "avg_passengers_per_hour": 576,
    "peak_passengers": 1357,
    "avg_delay_min": 1.92,
    "avg_occupancy": 0.137
  },
  {
    "station_id": "ST_CHN_ASH_24",
    "station_name": "Ashok Nagar",
    "latitude": 13.036,
    "longitude": 80.2115,
    "zone": "West",
    "station_type": "Elevated",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_GREEN"
    ],
    "avg_passengers_per_hour": 579,
    "peak_passengers": 1336,
    "avg_delay_min": 1.85,
    "avg_occupancy": 0.138
  },
  {
    "station_id": "ST_CHN_STM_25",
    "station_name": "St. Thomas Mount",
    "latitude": 13.004,
    "longitude": 80.196,
    "zone": "South",
    "station_type": "Elevated",
    "is_interchange": true,
    "lines_served": [
      "RT_CHN_GREEN",
      "RT_CHN_RED"
    ],
    "avg_passengers_per_hour": 666,
    "peak_passengers": 1672,
    "avg_delay_min": 1.95,
    "avg_occupancy": 0.159
  },
  {
    "station_id": "ST_CHN_BCH_26",
    "station_name": "Chennai Beach",
    "latitude": 13.0945,
    "longitude": 80.293,
    "zone": "North",
    "station_type": "At-Grade",
    "is_interchange": true,
    "lines_served": [
      "RT_CHN_RED",
      "RT_CHN_ORANGE"
    ],
    "avg_passengers_per_hour": 1138,
    "peak_passengers": 2849,
    "avg_delay_min": 2.25,
    "avg_occupancy": 0.159
  },
  {
    "station_id": "ST_CHN_FOR_27",
    "station_name": "Chennai Fort",
    "latitude": 13.0855,
    "longitude": 80.288,
    "zone": "Central",
    "station_type": "At-Grade",
    "is_interchange": true,
    "lines_served": [
      "RT_CHN_RED",
      "RT_CHN_ORANGE"
    ],
    "avg_passengers_per_hour": 668,
    "peak_passengers": 1725,
    "avg_delay_min": 1.88,
    "avg_occupancy": 0.159
  },
  {
    "station_id": "ST_CHN_PRK_28",
    "station_name": "Park Town",
    "latitude": 13.0805,
    "longitude": 80.276,
    "zone": "Central",
    "station_type": "At-Grade",
    "is_interchange": true,
    "lines_served": [
      "RT_CHN_RED",
      "RT_CHN_ORANGE"
    ],
    "avg_passengers_per_hour": 1206,
    "peak_passengers": 3160,
    "avg_delay_min": 2.3,
    "avg_occupancy": 0.159
  },
  {
    "station_id": "ST_CHN_NUN_29",
    "station_name": "Nungambakkam",
    "latitude": 13.062,
    "longitude": 80.237,
    "zone": "Central",
    "station_type": "At-Grade",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_RED"
    ],
    "avg_passengers_per_hour": 763,
    "peak_passengers": 1745,
    "avg_delay_min": 2.02,
    "avg_occupancy": 0.182
  },
  {
    "station_id": "ST_CHN_KOD_30",
    "station_name": "Kodambakkam",
    "latitude": 13.051,
    "longitude": 80.23,
    "zone": "Central",
    "station_type": "At-Grade",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_RED"
    ],
    "avg_passengers_per_hour": 764,
    "peak_passengers": 1875,
    "avg_delay_min": 2.07,
    "avg_occupancy": 0.182
  },
  {
    "station_id": "ST_CHN_MAM_31",
    "station_name": "T. Nagar (Mambalam)",
    "latitude": 13.0395,
    "longitude": 80.228,
    "zone": "Central",
    "station_type": "At-Grade",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_RED"
    ],
    "avg_passengers_per_hour": 2221,
    "peak_passengers": 4893,
    "avg_delay_min": 3.1,
    "avg_occupancy": 0.182
  },
  {
    "station_id": "ST_CHN_PAL_32",
    "station_name": "Pallavaram",
    "latitude": 12.968,
    "longitude": 80.147,
    "zone": "South",
    "station_type": "At-Grade",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_RED"
    ],
    "avg_passengers_per_hour": 600,
    "peak_passengers": 1500,
    "avg_delay_min": 2.1,
    "avg_occupancy": 0.55
  },
  {
    "station_id": "ST_CHN_CHR_33",
    "station_name": "Chromepet",
    "latitude": 12.952,
    "longitude": 80.14,
    "zone": "South",
    "station_type": "At-Grade",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_RED"
    ],
    "avg_passengers_per_hour": 600,
    "peak_passengers": 1500,
    "avg_delay_min": 2.1,
    "avg_occupancy": 0.55
  },
  {
    "station_id": "ST_CHN_TAM_34",
    "station_name": "Tambaram",
    "latitude": 12.926,
    "longitude": 80.117,
    "zone": "South",
    "station_type": "At-Grade",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_RED"
    ],
    "avg_passengers_per_hour": 1676,
    "peak_passengers": 3903,
    "avg_delay_min": 2.6,
    "avg_occupancy": 0.181
  },
  {
    "station_id": "ST_CHN_CHN_35",
    "station_name": "Chintadripet",
    "latitude": 13.074,
    "longitude": 80.274,
    "zone": "Central",
    "station_type": "Elevated",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_ORANGE"
    ],
    "avg_passengers_per_hour": 570,
    "peak_passengers": 1388,
    "avg_delay_min": 1.84,
    "avg_occupancy": 0.136
  },
  {
    "station_id": "ST_CHN_CHE_36",
    "station_name": "Chepauk",
    "latitude": 13.064,
    "longitude": 80.279,
    "zone": "Coastal",
    "station_type": "Elevated",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_ORANGE"
    ],
    "avg_passengers_per_hour": 938,
    "peak_passengers": 3988,
    "avg_delay_min": 2.1,
    "avg_occupancy": 0.14
  },
  {
    "station_id": "ST_CHN_TRI_37",
    "station_name": "Triplicane",
    "latitude": 13.056,
    "longitude": 80.277,
    "zone": "Coastal",
    "station_type": "Elevated",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_ORANGE"
    ],
    "avg_passengers_per_hour": 575,
    "peak_passengers": 1394,
    "avg_delay_min": 1.85,
    "avg_occupancy": 0.137
  },
  {
    "station_id": "ST_CHN_MYL_38",
    "station_name": "Mylapore",
    "latitude": 13.034,
    "longitude": 80.269,
    "zone": "Coastal",
    "station_type": "Elevated",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_ORANGE"
    ],
    "avg_passengers_per_hour": 577,
    "peak_passengers": 1364,
    "avg_delay_min": 1.87,
    "avg_occupancy": 0.137
  },
  {
    "station_id": "ST_CHN_ADY_39",
    "station_name": "Adyar (Kasturba)",
    "latitude": 13.006,
    "longitude": 80.252,
    "zone": "Coastal",
    "station_type": "Elevated",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_ORANGE"
    ],
    "avg_passengers_per_hour": 1086,
    "peak_passengers": 2436,
    "avg_delay_min": 2.21,
    "avg_occupancy": 0.136
  },
  {
    "station_id": "ST_CHN_THV_40",
    "station_name": "Thiruvanmiyur",
    "latitude": 12.986,
    "longitude": 80.254,
    "zone": "Coastal",
    "station_type": "Elevated",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_ORANGE"
    ],
    "avg_passengers_per_hour": 575,
    "peak_passengers": 1330,
    "avg_delay_min": 1.91,
    "avg_occupancy": 0.137
  },
  {
    "station_id": "ST_CHN_TAR_41",
    "station_name": "Taramani",
    "latitude": 12.977,
    "longitude": 80.244,
    "zone": "South",
    "station_type": "Elevated",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_ORANGE"
    ],
    "avg_passengers_per_hour": 572,
    "peak_passengers": 1345,
    "avg_delay_min": 1.85,
    "avg_occupancy": 0.136
  },
  {
    "station_id": "ST_CHN_VEL_42",
    "station_name": "Velachery",
    "latitude": 12.977,
    "longitude": 80.218,
    "zone": "South",
    "station_type": "Elevated",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_ORANGE"
    ],
    "avg_passengers_per_hour": 1143,
    "peak_passengers": 2597,
    "avg_delay_min": 2.33,
    "avg_occupancy": 0.136
  },
  {
    "station_id": "ST_CHN_PER_43",
    "station_name": "Perambur",
    "latitude": 13.111,
    "longitude": 80.244,
    "zone": "North",
    "station_type": "At-Grade",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_PURPLE"
    ],
    "avg_passengers_per_hour": 1084,
    "peak_passengers": 2389,
    "avg_delay_min": 2.2,
    "avg_occupancy": 0.136
  },
  {
    "station_id": "ST_CHN_VIL_44",
    "station_name": "Villivakkam",
    "latitude": 13.11,
    "longitude": 80.207,
    "zone": "North",
    "station_type": "At-Grade",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_PURPLE"
    ],
    "avg_passengers_per_hour": 573,
    "peak_passengers": 1281,
    "avg_delay_min": 1.86,
    "avg_occupancy": 0.136
  },
  {
    "station_id": "ST_CHN_AMB_45",
    "station_name": "Ambattur",
    "latitude": 13.118,
    "longitude": 80.155,
    "zone": "West",
    "station_type": "At-Grade",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_PURPLE"
    ],
    "avg_passengers_per_hour": 571,
    "peak_passengers": 1286,
    "avg_delay_min": 1.87,
    "avg_occupancy": 0.136
  },
  {
    "station_id": "ST_CHN_AVA_46",
    "station_name": "Avadi",
    "latitude": 13.12,
    "longitude": 80.1,
    "zone": "West",
    "station_type": "At-Grade",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_PURPLE"
    ],
    "avg_passengers_per_hour": 577,
    "peak_passengers": 1267,
    "avg_delay_min": 1.79,
    "avg_occupancy": 0.137
  },
  {
    "station_id": "ST_CHN_TIR_47",
    "station_name": "Tiruvallur",
    "latitude": 13.143,
    "longitude": 79.907,
    "zone": "West",
    "station_type": "At-Grade",
    "is_interchange": false,
    "lines_served": [
      "RT_CHN_PURPLE"
    ],
    "avg_passengers_per_hour": 576,
    "peak_passengers": 1243,
    "avg_delay_min": 1.9,
    "avg_occupancy": 0.137
  }
];

export const FALLBACK_DELHI_ROUTES: Route[] = [
  {
    "route_id": "RT_DEL_YELLOW",
    "route_name": "Yellow Line (Line 2)",
    "line_code": "YELLOW",
    "color_hex": "#D89B32",
    "origin": "Samaypur Badli",
    "destination": "Millennium City Centre Gurugram",
    "length_km": 49.3,
    "total_stations": 17,
    "scheduled_headway_min": 3.0,
    "station_sequence": [
      "ST_DEL_SAM_01",
      "ST_DEL_JAH_02",
      "ST_DEL_MOD_03",
      "ST_DEL_VIS_04",
      "ST_DEL_KAS_05",
      "ST_DEL_CHA_06",
      "ST_DEL_NDL_07",
      "ST_DEL_RAJ_08",
      "ST_DEL_PAT_09",
      "ST_DEL_SEC_10",
      "ST_DEL_AIM_11",
      "ST_DEL_HAU_12",
      "ST_DEL_SAK_13",
      "ST_DEL_QUT_14",
      "ST_DEL_SIK_15",
      "ST_DEL_MGR_16",
      "ST_DEL_MIL_17"
    ],
    "coordinates_path": [
      [
        28.7455,
        77.1352
      ],
      [
        28.7259,
        77.1643
      ],
      [
        28.7027,
        77.1939
      ],
      [
        28.6946,
        77.2137
      ],
      [
        28.6675,
        77.2285
      ],
      [
        28.6578,
        77.2302
      ],
      [
        28.6431,
        77.2223
      ],
      [
        28.6328,
        77.2195
      ],
      [
        28.6231,
        77.214
      ],
      [
        28.6146,
        77.2119
      ],
      [
        28.5684,
        77.2078
      ],
      [
        28.5432,
        77.2065
      ],
      [
        28.5204,
        77.2016
      ],
      [
        28.5135,
        77.1858
      ],
      [
        28.4819,
        77.0927
      ],
      [
        28.48,
        77.0805
      ],
      [
        28.4593,
        77.0726
      ]
    ],
    "total_passengers": 10302626,
    "daily_avg_passengers": 735902,
    "avg_delay_min": 3.15
  },
  {
    "route_id": "RT_DEL_BLUE",
    "route_name": "Blue Line (Line 3/4)",
    "line_code": "BLUE",
    "color_hex": "#2F5D50",
    "origin": "Dwarka Sector 21",
    "destination": "Noida Electronic City",
    "length_km": 56.6,
    "total_stations": 12,
    "scheduled_headway_min": 3.5,
    "station_sequence": [
      "ST_DEL_DWK_18",
      "ST_DEL_DWM_19",
      "ST_DEL_JAN_20",
      "ST_DEL_RAJ_21",
      "ST_DEL_KAR_22",
      "ST_DEL_RAJ_08",
      "ST_DEL_MAN_23",
      "ST_DEL_AKS_24",
      "ST_DEL_MAY_25",
      "ST_DEL_NOI_26",
      "ST_DEL_BOT_27",
      "ST_DEL_NOE_28"
    ],
    "coordinates_path": [
      [
        28.5523,
        77.0583
      ],
      [
        28.6193,
        77.0332
      ],
      [
        28.6294,
        77.0778
      ],
      [
        28.6489,
        77.1215
      ],
      [
        28.6442,
        77.1904
      ],
      [
        28.6328,
        77.2195
      ],
      [
        28.6258,
        77.2343
      ],
      [
        28.6179,
        77.2795
      ],
      [
        28.6047,
        77.2952
      ],
      [
        28.5708,
        77.3219
      ],
      [
        28.5641,
        77.3343
      ],
      [
        28.6276,
        77.3725
      ]
    ],
    "total_passengers": 6807784,
    "daily_avg_passengers": 486270,
    "avg_delay_min": 2.96
  },
  {
    "route_id": "RT_DEL_RED",
    "route_name": "Red Line (Line 1)",
    "line_code": "RED",
    "color_hex": "#B94A3A",
    "origin": "Rithala",
    "destination": "Shaheed Sthal Ghaziabad",
    "length_km": 34.4,
    "total_stations": 8,
    "scheduled_headway_min": 4.0,
    "station_sequence": [
      "ST_DEL_RIT_29",
      "ST_DEL_NSP_30",
      "ST_DEL_IND_31",
      "ST_DEL_TIS_32",
      "ST_DEL_KAS_05",
      "ST_DEL_SHA_33",
      "ST_DEL_DIL_34",
      "ST_DEL_SSG_35"
    ],
    "coordinates_path": [
      [
        28.7207,
        77.1071
      ],
      [
        28.6953,
        77.1524
      ],
      [
        28.6732,
        77.1698
      ],
      [
        28.6672,
        77.2163
      ],
      [
        28.6675,
        77.2285
      ],
      [
        28.6735,
        77.2872
      ],
      [
        28.6759,
        77.3215
      ],
      [
        28.6711,
        77.4124
      ]
    ],
    "total_passengers": 3036185,
    "daily_avg_passengers": 216870,
    "avg_delay_min": 2.46
  },
  {
    "route_id": "RT_DEL_VIOLET",
    "route_name": "Violet Line (Line 6)",
    "line_code": "VIOLET",
    "color_hex": "#7A5C6E",
    "origin": "Kashmere Gate",
    "destination": "Badarpur Border",
    "length_km": 46.6,
    "total_stations": 10,
    "scheduled_headway_min": 4.5,
    "station_sequence": [
      "ST_DEL_KAS_05",
      "ST_DEL_LAQ_36",
      "ST_DEL_DEL_37",
      "ST_DEL_ITO_38",
      "ST_DEL_MAN_23",
      "ST_DEL_SEC_10",
      "ST_DEL_KHA_39",
      "ST_DEL_LAJ_40",
      "ST_DEL_KAL_41",
      "ST_DEL_BAD_42"
    ],
    "coordinates_path": [
      [
        28.6675,
        77.2285
      ],
      [
        28.656,
        77.241
      ],
      [
        28.6406,
        77.2405
      ],
      [
        28.6292,
        77.2412
      ],
      [
        28.6258,
        77.2343
      ],
      [
        28.6146,
        77.2119
      ],
      [
        28.6003,
        77.2272
      ],
      [
        28.5706,
        77.2374
      ],
      [
        28.5501,
        77.2514
      ],
      [
        28.4947,
        77.3005
      ]
    ],
    "total_passengers": 3696955,
    "daily_avg_passengers": 264068,
    "avg_delay_min": 2.44
  },
  {
    "route_id": "RT_DEL_AIRPORT",
    "route_name": "Airport Express Line",
    "line_code": "ORANGE",
    "color_hex": "#C96F4A",
    "origin": "New Delhi Railway",
    "destination": "Yashobhoomi Dwarka Sec 25",
    "length_km": 24.9,
    "total_stations": 6,
    "scheduled_headway_min": 8.0,
    "station_sequence": [
      "ST_DEL_NDL_07",
      "ST_DEL_SHI_43",
      "ST_DEL_DHA_44",
      "ST_DEL_AER_45",
      "ST_DEL_IGI_46",
      "ST_DEL_YAS_47"
    ],
    "coordinates_path": [
      [
        28.6431,
        77.2223
      ],
      [
        28.6295,
        77.213
      ],
      [
        28.5925,
        77.161
      ],
      [
        28.5492,
        77.1215
      ],
      [
        28.5562,
        77.0864
      ],
      [
        28.545,
        77.042
      ]
    ],
    "total_passengers": 2114868,
    "daily_avg_passengers": 151062,
    "avg_delay_min": 2.44
  }
];

export const FALLBACK_DELHI_STATIONS: Station[] = [
  {
    "station_id": "ST_DEL_SAM_01",
    "station_name": "Samaypur Badli",
    "latitude": 28.7455,
    "longitude": 77.1352,
    "zone": "North Delhi",
    "station_type": "Elevated",
    "is_interchange": false,
    "lines_served": [
      "RT_DEL_YELLOW"
    ],
    "avg_passengers_per_hour": 1036,
    "peak_passengers": 2341,
    "avg_delay_min": 2.26,
    "avg_occupancy": 0.247
  },
  {
    "station_id": "ST_DEL_JAH_02",
    "station_name": "Jahangirpuri",
    "latitude": 28.7259,
    "longitude": 77.1643,
    "zone": "North Delhi",
    "station_type": "Elevated",
    "is_interchange": false,
    "lines_served": [
      "RT_DEL_YELLOW"
    ],
    "avg_passengers_per_hour": 1027,
    "peak_passengers": 2297,
    "avg_delay_min": 2.25,
    "avg_occupancy": 0.245
  },
  {
    "station_id": "ST_DEL_MOD_03",
    "station_name": "Model Town",
    "latitude": 28.7027,
    "longitude": 77.1939,
    "zone": "North Delhi",
    "station_type": "Elevated",
    "is_interchange": false,
    "lines_served": [
      "RT_DEL_YELLOW"
    ],
    "avg_passengers_per_hour": 1025,
    "peak_passengers": 2270,
    "avg_delay_min": 2.24,
    "avg_occupancy": 0.244
  },
  {
    "station_id": "ST_DEL_VIS_04",
    "station_name": "Vishwavidyalaya (DU)",
    "latitude": 28.6946,
    "longitude": 77.2137,
    "zone": "North Delhi",
    "station_type": "Underground",
    "is_interchange": false,
    "lines_served": [
      "RT_DEL_YELLOW"
    ],
    "avg_passengers_per_hour": 1032,
    "peak_passengers": 2302,
    "avg_delay_min": 2.23,
    "avg_occupancy": 0.246
  },
  {
    "station_id": "ST_DEL_KAS_05",
    "station_name": "Kashmere Gate",
    "latitude": 28.6675,
    "longitude": 77.2285,
    "zone": "Old Delhi",
    "station_type": "Underground",
    "is_interchange": true,
    "lines_served": [
      "RT_DEL_YELLOW",
      "RT_DEL_RED",
      "RT_DEL_VIOLET"
    ],
    "avg_passengers_per_hour": 3847,
    "peak_passengers": 16247,
    "avg_delay_min": 4.27,
    "avg_occupancy": 0.229
  },
  {
    "station_id": "ST_DEL_CHA_06",
    "station_name": "Chandni Chowk",
    "latitude": 28.6578,
    "longitude": 77.2302,
    "zone": "Old Delhi",
    "station_type": "Underground",
    "is_interchange": false,
    "lines_served": [
      "RT_DEL_YELLOW"
    ],
    "avg_passengers_per_hour": 2893,
    "peak_passengers": 6299,
    "avg_delay_min": 3.55,
    "avg_occupancy": 0.246
  },
  {
    "station_id": "ST_DEL_NDL_07",
    "station_name": "New Delhi Railway",
    "latitude": 28.6431,
    "longitude": 77.2223,
    "zone": "Central Delhi",
    "station_type": "Underground",
    "is_interchange": true,
    "lines_served": [
      "RT_DEL_YELLOW",
      "RT_DEL_AIRPORT"
    ],
    "avg_passengers_per_hour": 3442,
    "peak_passengers": 9491,
    "avg_delay_min": 4.0,
    "avg_occupancy": 0.216
  },
  {
    "station_id": "ST_DEL_RAJ_08",
    "station_name": "Rajiv Chowk (CP)",
    "latitude": 28.6328,
    "longitude": 77.2195,
    "zone": "Central Delhi",
    "station_type": "Underground",
    "is_interchange": true,
    "lines_served": [
      "RT_DEL_YELLOW",
      "RT_DEL_BLUE"
    ],
    "avg_passengers_per_hour": 4691,
    "peak_passengers": 16232,
    "avg_delay_min": 4.85,
    "avg_occupancy": 0.248
  },
  {
    "station_id": "ST_DEL_PAT_09",
    "station_name": "Patel Chowk",
    "latitude": 28.6231,
    "longitude": 77.214,
    "zone": "Central Delhi",
    "station_type": "Underground",
    "is_interchange": false,
    "lines_served": [
      "RT_DEL_YELLOW"
    ],
    "avg_passengers_per_hour": 1028,
    "peak_passengers": 2360,
    "avg_delay_min": 2.25,
    "avg_occupancy": 0.245
  },
  {
    "station_id": "ST_DEL_SEC_10",
    "station_name": "Central Secretariat",
    "latitude": 28.6146,
    "longitude": 77.2119,
    "zone": "Central Delhi",
    "station_type": "Underground",
    "is_interchange": true,
    "lines_served": [
      "RT_DEL_YELLOW",
      "RT_DEL_VIOLET"
    ],
    "avg_passengers_per_hour": 2694,
    "peak_passengers": 6936,
    "avg_delay_min": 3.44,
    "avg_occupancy": 0.214
  },
  {
    "station_id": "ST_DEL_AIM_11",
    "station_name": "AIIMS",
    "latitude": 28.5684,
    "longitude": 77.2078,
    "zone": "South Delhi",
    "station_type": "Underground",
    "is_interchange": false,
    "lines_served": [
      "RT_DEL_YELLOW"
    ],
    "avg_passengers_per_hour": 2806,
    "peak_passengers": 6075,
    "avg_delay_min": 3.55,
    "avg_occupancy": 0.247
  },
  {
    "station_id": "ST_DEL_HAU_12",
    "station_name": "Hauz Khas",
    "latitude": 28.5432,
    "longitude": 77.2065,
    "zone": "South Delhi",
    "station_type": "Underground",
    "is_interchange": true,
    "lines_served": [
      "RT_DEL_YELLOW"
    ],
    "avg_passengers_per_hour": 3301,
    "peak_passengers": 7253,
    "avg_delay_min": 3.86,
    "avg_occupancy": 0.246
  },
  {
    "station_id": "ST_DEL_SAK_13",
    "station_name": "Saket",
    "latitude": 28.5204,
    "longitude": 77.2016,
    "zone": "South Delhi",
    "station_type": "Underground",
    "is_interchange": false,
    "lines_served": [
      "RT_DEL_YELLOW"
    ],
    "avg_passengers_per_hour": 1032,
    "peak_passengers": 2453,
    "avg_delay_min": 2.26,
    "avg_occupancy": 0.246
  },
  {
    "station_id": "ST_DEL_QUT_14",
    "station_name": "Qutab Minar",
    "latitude": 28.5135,
    "longitude": 77.1858,
    "zone": "South Delhi",
    "station_type": "Elevated",
    "is_interchange": false,
    "lines_served": [
      "RT_DEL_YELLOW"
    ],
    "avg_passengers_per_hour": 1036,
    "peak_passengers": 2396,
    "avg_delay_min": 2.2,
    "avg_occupancy": 0.247
  },
  {
    "station_id": "ST_DEL_SIK_15",
    "station_name": "Sikanderpur",
    "latitude": 28.4819,
    "longitude": 77.0927,
    "zone": "Gurugram",
    "station_type": "Elevated",
    "is_interchange": true,
    "lines_served": [
      "RT_DEL_YELLOW"
    ],
    "avg_passengers_per_hour": 2902,
    "peak_passengers": 6560,
    "avg_delay_min": 3.6,
    "avg_occupancy": 0.247
  },
  {
    "station_id": "ST_DEL_MGR_16",
    "station_name": "MG Road Gurugram",
    "latitude": 28.48,
    "longitude": 77.0805,
    "zone": "Gurugram",
    "station_type": "Elevated",
    "is_interchange": false,
    "lines_served": [
      "RT_DEL_YELLOW"
    ],
    "avg_passengers_per_hour": 1028,
    "peak_passengers": 2209,
    "avg_delay_min": 2.25,
    "avg_occupancy": 0.245
  },
  {
    "station_id": "ST_DEL_MIL_17",
    "station_name": "Millennium City Centre",
    "latitude": 28.4593,
    "longitude": 77.0726,
    "zone": "Gurugram",
    "station_type": "Elevated",
    "is_interchange": false,
    "lines_served": [
      "RT_DEL_YELLOW"
    ],
    "avg_passengers_per_hour": 2676,
    "peak_passengers": 6031,
    "avg_delay_min": 3.42,
    "avg_occupancy": 0.245
  },
  {
    "station_id": "ST_DEL_DWK_18",
    "station_name": "Dwarka Sector 21",
    "latitude": 28.5523,
    "longitude": 77.0583,
    "zone": "West Delhi",
    "station_type": "Underground",
    "is_interchange": true,
    "lines_served": [
      "RT_DEL_BLUE",
      "RT_DEL_AIRPORT"
    ],
    "avg_passengers_per_hour": 1037,
    "peak_passengers": 2336,
    "avg_delay_min": 2.19,
    "avg_occupancy": 0.247
  },
  {
    "station_id": "ST_DEL_DWM_19",
    "station_name": "Dwarka Mor",
    "latitude": 28.6193,
    "longitude": 77.0332,
    "zone": "West Delhi",
    "station_type": "Elevated",
    "is_interchange": false,
    "lines_served": [
      "RT_DEL_BLUE"
    ],
    "avg_passengers_per_hour": 1032,
    "peak_passengers": 2205,
    "avg_delay_min": 2.2,
    "avg_occupancy": 0.246
  },
  {
    "station_id": "ST_DEL_JAN_20",
    "station_name": "Janakpuri West",
    "latitude": 28.6294,
    "longitude": 77.0778,
    "zone": "West Delhi",
    "station_type": "Elevated",
    "is_interchange": true,
    "lines_served": [
      "RT_DEL_BLUE"
    ],
    "avg_passengers_per_hour": 2474,
    "peak_passengers": 5675,
    "avg_delay_min": 3.14,
    "avg_occupancy": 0.245
  },
  {
    "station_id": "ST_DEL_RAJ_21",
    "station_name": "Rajouri Garden",
    "latitude": 28.6489,
    "longitude": 77.1215,
    "zone": "West Delhi",
    "station_type": "Elevated",
    "is_interchange": true,
    "lines_served": [
      "RT_DEL_BLUE"
    ],
    "avg_passengers_per_hour": 1029,
    "peak_passengers": 2253,
    "avg_delay_min": 2.14,
    "avg_occupancy": 0.245
  },
  {
    "station_id": "ST_DEL_KAR_22",
    "station_name": "Karol Bagh",
    "latitude": 28.6442,
    "longitude": 77.1904,
    "zone": "Central Delhi",
    "station_type": "Underground",
    "is_interchange": false,
    "lines_served": [
      "RT_DEL_BLUE"
    ],
    "avg_passengers_per_hour": 2555,
    "peak_passengers": 5833,
    "avg_delay_min": 3.29,
    "avg_occupancy": 0.243
  },
  {
    "station_id": "ST_DEL_MAN_23",
    "station_name": "Mandi House",
    "latitude": 28.6258,
    "longitude": 77.2343,
    "zone": "Central Delhi",
    "station_type": "Underground",
    "is_interchange": true,
    "lines_served": [
      "RT_DEL_BLUE",
      "RT_DEL_VIOLET"
    ],
    "avg_passengers_per_hour": 2346,
    "peak_passengers": 6118,
    "avg_delay_min": 3.11,
    "avg_occupancy": 0.215
  },
  {
    "station_id": "ST_DEL_AKS_24",
    "station_name": "Akshardham",
    "latitude": 28.6179,
    "longitude": 77.2795,
    "zone": "East Delhi",
    "station_type": "Elevated",
    "is_interchange": false,
    "lines_served": [
      "RT_DEL_BLUE"
    ],
    "avg_passengers_per_hour": 2257,
    "peak_passengers": 5230,
    "avg_delay_min": 3.04,
    "avg_occupancy": 0.244
  },
  {
    "station_id": "ST_DEL_MAY_25",
    "station_name": "Mayur Vihar-I",
    "latitude": 28.6047,
    "longitude": 77.2952,
    "zone": "East Delhi",
    "station_type": "Elevated",
    "is_interchange": true,
    "lines_served": [
      "RT_DEL_BLUE"
    ],
    "avg_passengers_per_hour": 1031,
    "peak_passengers": 2282,
    "avg_delay_min": 2.13,
    "avg_occupancy": 0.245
  },
  {
    "station_id": "ST_DEL_NOI_26",
    "station_name": "Noida Sector 18",
    "latitude": 28.5708,
    "longitude": 77.3219,
    "zone": "Noida",
    "station_type": "Elevated",
    "is_interchange": false,
    "lines_served": [
      "RT_DEL_BLUE"
    ],
    "avg_passengers_per_hour": 2785,
    "peak_passengers": 6107,
    "avg_delay_min": 3.39,
    "avg_occupancy": 0.246
  },
  {
    "station_id": "ST_DEL_BOT_27",
    "station_name": "Botanical Garden",
    "latitude": 28.5641,
    "longitude": 77.3343,
    "zone": "Noida",
    "station_type": "Elevated",
    "is_interchange": true,
    "lines_served": [
      "RT_DEL_BLUE"
    ],
    "avg_passengers_per_hour": 2983,
    "peak_passengers": 6403,
    "avg_delay_min": 3.6,
    "avg_occupancy": 0.245
  },
  {
    "station_id": "ST_DEL_NOE_28",
    "station_name": "Noida Electronic City",
    "latitude": 28.6276,
    "longitude": 77.3725,
    "zone": "Noida",
    "station_type": "Elevated",
    "is_interchange": false,
    "lines_served": [
      "RT_DEL_BLUE"
    ],
    "avg_passengers_per_hour": 1028,
    "peak_passengers": 2342,
    "avg_delay_min": 2.18,
    "avg_occupancy": 0.245
  },
  {
    "station_id": "ST_DEL_RIT_29",
    "station_name": "Rithala",
    "latitude": 28.7207,
    "longitude": 77.1071,
    "zone": "North West",
    "station_type": "Elevated",
    "is_interchange": false,
    "lines_served": [
      "RT_DEL_RED"
    ],
    "avg_passengers_per_hour": 1031,
    "peak_passengers": 2449,
    "avg_delay_min": 2.14,
    "avg_occupancy": 0.245
  },
  {
    "station_id": "ST_DEL_NSP_30",
    "station_name": "Netaji Subhash Place",
    "latitude": 28.6953,
    "longitude": 77.1524,
    "zone": "North West",
    "station_type": "Elevated",
    "is_interchange": true,
    "lines_served": [
      "RT_DEL_RED"
    ],
    "avg_passengers_per_hour": 1026,
    "peak_passengers": 2438,
    "avg_delay_min": 2.15,
    "avg_occupancy": 0.244
  },
  {
    "station_id": "ST_DEL_IND_31",
    "station_name": "Inderlok",
    "latitude": 28.6732,
    "longitude": 77.1698,
    "zone": "North West",
    "station_type": "Elevated",
    "is_interchange": true,
    "lines_served": [
      "RT_DEL_RED"
    ],
    "avg_passengers_per_hour": 1029,
    "peak_passengers": 2357,
    "avg_delay_min": 2.19,
    "avg_occupancy": 0.245
  },
  {
    "station_id": "ST_DEL_TIS_32",
    "station_name": "Tis Hazari",
    "latitude": 28.6672,
    "longitude": 77.2163,
    "zone": "Old Delhi",
    "station_type": "Elevated",
    "is_interchange": false,
    "lines_served": [
      "RT_DEL_RED"
    ],
    "avg_passengers_per_hour": 1025,
    "peak_passengers": 2298,
    "avg_delay_min": 2.24,
    "avg_occupancy": 0.244
  },
  {
    "station_id": "ST_DEL_SHA_33",
    "station_name": "Shahdara",
    "latitude": 28.6735,
    "longitude": 77.2872,
    "zone": "East Delhi",
    "station_type": "Elevated",
    "is_interchange": false,
    "lines_served": [
      "RT_DEL_RED"
    ],
    "avg_passengers_per_hour": 1035,
    "peak_passengers": 2203,
    "avg_delay_min": 2.17,
    "avg_occupancy": 0.246
  },
  {
    "station_id": "ST_DEL_DIL_34",
    "station_name": "Dilshad Garden",
    "latitude": 28.6759,
    "longitude": 77.3215,
    "zone": "East Delhi",
    "station_type": "Elevated",
    "is_interchange": false,
    "lines_served": [
      "RT_DEL_RED"
    ],
    "avg_passengers_per_hour": 1032,
    "peak_passengers": 2201,
    "avg_delay_min": 2.22,
    "avg_occupancy": 0.246
  },
  {
    "station_id": "ST_DEL_SSG_35",
    "station_name": "Shaheed Sthal Ghaziabad",
    "latitude": 28.6711,
    "longitude": 77.4124,
    "zone": "Ghaziabad",
    "station_type": "Elevated",
    "is_interchange": false,
    "lines_served": [
      "RT_DEL_RED"
    ],
    "avg_passengers_per_hour": 1035,
    "peak_passengers": 2302,
    "avg_delay_min": 2.13,
    "avg_occupancy": 0.246
  },
  {
    "station_id": "ST_DEL_LAQ_36",
    "station_name": "Lal Quila (Red Fort)",
    "latitude": 28.656,
    "longitude": 77.241,
    "zone": "Old Delhi",
    "station_type": "Underground",
    "is_interchange": false,
    "lines_served": [
      "RT_DEL_VIOLET"
    ],
    "avg_passengers_per_hour": 771,
    "peak_passengers": 1661,
    "avg_delay_min": 1.96,
    "avg_occupancy": 0.184
  },
  {
    "station_id": "ST_DEL_DEL_37",
    "station_name": "Delhi Gate",
    "latitude": 28.6406,
    "longitude": 77.2405,
    "zone": "Old Delhi",
    "station_type": "Underground",
    "is_interchange": false,
    "lines_served": [
      "RT_DEL_VIOLET"
    ],
    "avg_passengers_per_hour": 769,
    "peak_passengers": 1821,
    "avg_delay_min": 1.98,
    "avg_occupancy": 0.183
  },
  {
    "station_id": "ST_DEL_ITO_38",
    "station_name": "ITO",
    "latitude": 28.6292,
    "longitude": 77.2412,
    "zone": "Central Delhi",
    "station_type": "Underground",
    "is_interchange": false,
    "lines_served": [
      "RT_DEL_VIOLET"
    ],
    "avg_passengers_per_hour": 779,
    "peak_passengers": 1850,
    "avg_delay_min": 2.05,
    "avg_occupancy": 0.185
  },
  {
    "station_id": "ST_DEL_KHA_39",
    "station_name": "Khan Market",
    "latitude": 28.6003,
    "longitude": 77.2272,
    "zone": "Central Delhi",
    "station_type": "Underground",
    "is_interchange": false,
    "lines_served": [
      "RT_DEL_VIOLET"
    ],
    "avg_passengers_per_hour": 784,
    "peak_passengers": 1740,
    "avg_delay_min": 2.02,
    "avg_occupancy": 0.187
  },
  {
    "station_id": "ST_DEL_LAJ_40",
    "station_name": "Lajpat Nagar",
    "latitude": 28.5706,
    "longitude": 77.2374,
    "zone": "South Delhi",
    "station_type": "Underground",
    "is_interchange": true,
    "lines_served": [
      "RT_DEL_VIOLET"
    ],
    "avg_passengers_per_hour": 1767,
    "peak_passengers": 3876,
    "avg_delay_min": 2.74,
    "avg_occupancy": 0.183
  },
  {
    "station_id": "ST_DEL_KAL_41",
    "station_name": "Kalkaji Mandir",
    "latitude": 28.5501,
    "longitude": 77.2514,
    "zone": "South Delhi",
    "station_type": "Elevated",
    "is_interchange": true,
    "lines_served": [
      "RT_DEL_VIOLET"
    ],
    "avg_passengers_per_hour": 780,
    "peak_passengers": 1709,
    "avg_delay_min": 1.99,
    "avg_occupancy": 0.186
  },
  {
    "station_id": "ST_DEL_BAD_42",
    "station_name": "Badarpur Border",
    "latitude": 28.4947,
    "longitude": 77.3005,
    "zone": "South Delhi",
    "station_type": "Elevated",
    "is_interchange": false,
    "lines_served": [
      "RT_DEL_VIOLET"
    ],
    "avg_passengers_per_hour": 774,
    "peak_passengers": 1917,
    "avg_delay_min": 1.93,
    "avg_occupancy": 0.184
  },
  {
    "station_id": "ST_DEL_SHI_43",
    "station_name": "Shivaji Stadium",
    "latitude": 28.6295,
    "longitude": 77.213,
    "zone": "Central Delhi",
    "station_type": "Underground",
    "is_interchange": false,
    "lines_served": [
      "RT_DEL_AIRPORT"
    ],
    "avg_passengers_per_hour": 772,
    "peak_passengers": 1699,
    "avg_delay_min": 2.07,
    "avg_occupancy": 0.184
  },
  {
    "station_id": "ST_DEL_DHA_44",
    "station_name": "Dhaula Kuan",
    "latitude": 28.5925,
    "longitude": 77.161,
    "zone": "South West",
    "station_type": "Elevated",
    "is_interchange": true,
    "lines_served": [
      "RT_DEL_AIRPORT"
    ],
    "avg_passengers_per_hour": 775,
    "peak_passengers": 1699,
    "avg_delay_min": 1.95,
    "avg_occupancy": 0.185
  },
  {
    "station_id": "ST_DEL_AER_45",
    "station_name": "Delhi Aerocity",
    "latitude": 28.5492,
    "longitude": 77.1215,
    "zone": "South West",
    "station_type": "Underground",
    "is_interchange": false,
    "lines_served": [
      "RT_DEL_AIRPORT"
    ],
    "avg_passengers_per_hour": 770,
    "peak_passengers": 1740,
    "avg_delay_min": 2.0,
    "avg_occupancy": 0.183
  },
  {
    "station_id": "ST_DEL_IGI_46",
    "station_name": "IGI Airport (T3)",
    "latitude": 28.5562,
    "longitude": 77.0864,
    "zone": "South West",
    "station_type": "Underground",
    "is_interchange": false,
    "lines_served": [
      "RT_DEL_AIRPORT"
    ],
    "avg_passengers_per_hour": 1942,
    "peak_passengers": 4203,
    "avg_delay_min": 2.85,
    "avg_occupancy": 0.185
  },
  {
    "station_id": "ST_DEL_YAS_47",
    "station_name": "Yashobhoomi Dwarka Sec 25",
    "latitude": 28.545,
    "longitude": 77.042,
    "zone": "South West",
    "station_type": "Underground",
    "is_interchange": false,
    "lines_served": [
      "RT_DEL_AIRPORT"
    ],
    "avg_passengers_per_hour": 771,
    "peak_passengers": 1748,
    "avg_delay_min": 2.1,
    "avg_occupancy": 0.184
  }
];

export const FALLBACK_SUMMARIES: Record<string, SystemSummary> = {
  chennai: {
    network_id: 'chennai',
    network_name: 'Chennai Transit Network',
    city: 'Chennai',
    total_ridership: 14820717,
    daily_average_ridership: 1058622,
    system_avg_delay_min: 2.2,
    total_routes: 5,
    total_stations: 47,
    busiest_station: 'Chennai Central',
    busiest_station_volume: 2730048,
    busiest_route: 'Red Line (Suburban South)',
    system_peak_hour: '18:00',
    system_peak_volume: 1445956,
    detected_anomalies_count: 14,
    observation_dates: [
      '2024-01-15', '2024-01-16', '2024-01-17', '2024-01-18', '2024-01-19',
      '2024-01-20', '2024-01-21', '2024-01-22', '2024-01-23', '2024-01-24',
      '2024-01-25', '2024-01-26', '2024-01-27', '2024-01-28'
    ]
  },
  delhi: {
    network_id: 'delhi',
    network_name: 'Delhi Metro Rail (DMRC)',
    city: 'Delhi NCR',
    total_ridership: 18942310,
    daily_average_ridership: 1353022,
    system_avg_delay_min: 1.8,
    total_routes: 5,
    total_stations: 47,
    busiest_station: 'Rajiv Chowk',
    busiest_station_volume: 3890200,
    busiest_route: 'Yellow Line (Samaypur Badli - Millennium City)',
    system_peak_hour: '09:00',
    system_peak_volume: 1820400,
    detected_anomalies_count: 19,
    observation_dates: [
      '2024-01-15', '2024-01-16', '2024-01-17', '2024-01-18', '2024-01-19',
      '2024-01-20', '2024-01-21', '2024-01-22', '2024-01-23', '2024-01-24',
      '2024-01-25', '2024-01-26', '2024-01-27', '2024-01-28'
    ]
  }
};

export function getFallbackSnapshot(networkId: string = 'chennai', date: string = '2024-01-15', hour: number = 9): NetworkSnapshot {
  const isDelhi = networkId === 'delhi';
  const rawStations = isDelhi ? FALLBACK_DELHI_STATIONS : FALLBACK_CHENNAI_STATIONS;
  const rawRoutes = isDelhi ? FALLBACK_DELHI_ROUTES : FALLBACK_CHENNAI_ROUTES;

  const isRushHour = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19);
  const factor = isRushHour ? 1.55 : (hour >= 22 || hour <= 5 ? 0.25 : 0.85);

  const stations = rawStations.map((st) => {
    const currentPass = Math.round((st.avg_passengers_per_hour || 750) * factor);
    const occ = Math.min(1.2, Math.round(((st.avg_occupancy || 0.45) * factor) * 100) / 100);
    let crowd: 'Low' | 'Moderate' | 'High' | 'Critical' = 'Low';
    let status_color = '#16A34A';
    if (occ >= 1.0) { crowd = 'Critical'; status_color = '#DC2626'; }
    else if (occ >= 0.75) { crowd = 'High'; status_color = '#EA580C'; }
    else if (occ >= 0.45) { crowd = 'Moderate'; status_color = '#F59E0B'; }

    return {
      ...st,
      current_passengers: currentPass,
      current_delay_min: st.avg_delay_min || 2.0,
      occupancy_ratio: occ,
      crowd_level: crowd,
      status_color
    };
  });

  const routes = rawRoutes.map((rt) => {
    const currentVol = Math.round(5500 * factor);
    const flowDensity = Math.min(5, Math.max(1, Math.round((currentVol / 12000) * 5)));
    return {
      ...rt,
      current_volume: currentVol,
      current_delay_min: 2.2,
      flow_density: flowDensity
    };
  });

  const formattedHour = String(hour).padStart(2, '0');
  return {
    network_id: isDelhi ? 'delhi' : 'chennai',
    network_name: isDelhi ? 'Delhi Metro Rail (DMRC)' : 'Chennai Transit Network',
    selected_date: date,
    selected_hour: hour,
    time_formatted: `${formattedHour}:00`,
    stations,
    routes
  };
}
