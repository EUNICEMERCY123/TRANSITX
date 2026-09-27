"""
TRANSITX — Multi-Network Dataset Generator & Preprocessing Pipeline
Generates authentic raw transportation data (stations, routes, operational logs)
for multiple Indian transit networks (Chennai Metro & Suburban, Delhi Metro / DMRC)
and executes the Data Science cleaning, feature engineering, and analytics pipeline.
"""

import os
import json
import math
import random
from datetime import datetime, timedelta
import numpy as np
import pandas as pd

# Set deterministic seed for reproducibility
np.random.seed(42)
random.seed(42)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
RAW_DEFAULT_DIR = os.path.join(DATA_DIR, "raw")
PROCESSED_DEFAULT_DIR = os.path.join(DATA_DIR, "processed")
NETWORKS_DIR = os.path.join(DATA_DIR, "networks")

os.makedirs(RAW_DEFAULT_DIR, exist_ok=True)
os.makedirs(PROCESSED_DEFAULT_DIR, exist_ok=True)
os.makedirs(NETWORKS_DIR, exist_ok=True)

# -------------------------------------------------------------------------
# NETWORK REGISTRY DEFINITION
# -------------------------------------------------------------------------
NETWORK_REGISTRY = [
    {
        "id": "chennai",
        "name": "Chennai Transit Network",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "country": "India",
        "system_type": "Metro Rail, Southern Suburban & MRTS Corridors",
        "operator": "CMRL & Southern Railway",
        "center": [13.045, 80.235],
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
        "center": [28.6139, 77.2090],
        "zoom": 11.2,
        "pitch": 54,
        "bearing": -15,
        "lines_count": 5,
        "stations_count": 42,
        "color": "#DC2626",
        "description": "India's largest and most utilized rapid transit network connecting Delhi, Gurugram, Noida, and Ghaziabad."
    }
]

# -------------------------------------------------------------------------
# 1. CHENNAI NETWORK DEFINITIONS
# -------------------------------------------------------------------------
CHENNAI_STATIONS = [
    # Blue Line (Airport to Central / Wimco)
    {"station_id": "ST_CHN_AIR_01", "station_name": "Chennai Airport", "latitude": 12.9790, "longitude": 80.1650, "zone": "South", "type": "Elevated", "is_interchange": False, "lines": ["RT_CHN_BLUE"]},
    {"station_id": "ST_CHN_MEA_02", "station_name": "Meenambakkam", "latitude": 12.9860, "longitude": 80.1770, "zone": "South", "type": "Elevated", "is_interchange": False, "lines": ["RT_CHN_BLUE"]},
    {"station_id": "ST_CHN_ALN_03", "station_name": "Alandur", "latitude": 13.0035, "longitude": 80.2015, "zone": "South", "type": "Elevated", "is_interchange": True, "lines": ["RT_CHN_BLUE", "RT_CHN_GREEN"]},
    {"station_id": "ST_CHN_GUI_04", "station_name": "Guindy", "latitude": 13.0090, "longitude": 80.2130, "zone": "South", "type": "Elevated", "is_interchange": True, "lines": ["RT_CHN_BLUE", "RT_CHN_RED"]},
    {"station_id": "ST_CHN_SAI_05", "station_name": "Saidapet", "latitude": 13.0200, "longitude": 80.2280, "zone": "Central", "type": "Underground", "is_interchange": False, "lines": ["RT_CHN_BLUE"]},
    {"station_id": "ST_CHN_NAN_06", "station_name": "Nandanam", "latitude": 13.0280, "longitude": 80.2405, "zone": "Central", "type": "Underground", "is_interchange": False, "lines": ["RT_CHN_BLUE"]},
    {"station_id": "ST_CHN_TEY_07", "station_name": "Teynampet", "latitude": 13.0360, "longitude": 80.2440, "zone": "Central", "type": "Underground", "is_interchange": False, "lines": ["RT_CHN_BLUE"]},
    {"station_id": "ST_CHN_AGD_08", "station_name": "AG-DMS", "latitude": 13.0440, "longitude": 80.2475, "zone": "Central", "type": "Underground", "is_interchange": False, "lines": ["RT_CHN_BLUE"]},
    {"station_id": "ST_CHN_THO_09", "station_name": "Thousand Lights", "latitude": 13.0560, "longitude": 80.2520, "zone": "Central", "type": "Underground", "is_interchange": False, "lines": ["RT_CHN_BLUE"]},
    {"station_id": "ST_CHN_LIC_10", "station_name": "Government Estate", "latitude": 13.0673, "longitude": 80.2701, "zone": "Central", "type": "Underground", "is_interchange": False, "lines": ["RT_CHN_BLUE"]},
    {"station_id": "ST_CHN_CEN_11", "station_name": "Chennai Central", "latitude": 13.0827, "longitude": 80.2755, "zone": "Central", "type": "Underground", "is_interchange": True, "lines": ["RT_CHN_BLUE", "RT_CHN_GREEN", "RT_CHN_RED", "RT_CHN_PURPLE"]},
    {"station_id": "ST_CHN_HIG_12", "station_name": "High Court", "latitude": 13.0880, "longitude": 80.2870, "zone": "North", "type": "Underground", "is_interchange": False, "lines": ["RT_CHN_BLUE"]},
    {"station_id": "ST_CHN_WAS_13", "station_name": "Washermanpet", "latitude": 13.1070, "longitude": 80.2890, "zone": "North", "type": "Underground", "is_interchange": False, "lines": ["RT_CHN_BLUE"]},

    # Green Line (Chennai Central to St. Thomas Mount)
    {"station_id": "ST_CHN_EGM_14", "station_name": "Egmore", "latitude": 13.0784, "longitude": 80.2612, "zone": "Central", "type": "Underground", "is_interchange": True, "lines": ["RT_CHN_GREEN", "RT_CHN_RED"]},
    {"station_id": "ST_CHN_NEH_15", "station_name": "Nehru Park", "latitude": 13.0790, "longitude": 80.2480, "zone": "Central", "type": "Underground", "is_interchange": False, "lines": ["RT_CHN_GREEN"]},
    {"station_id": "ST_CHN_KIL_16", "station_name": "Kilpauk", "latitude": 13.0780, "longitude": 80.2410, "zone": "Central", "type": "Underground", "is_interchange": False, "lines": ["RT_CHN_GREEN"]},
    {"station_id": "ST_CHN_SHE_17", "station_name": "Shenoy Nagar", "latitude": 13.0775, "longitude": 80.2260, "zone": "West", "type": "Underground", "is_interchange": False, "lines": ["RT_CHN_GREEN"]},
    {"station_id": "ST_CHN_ANN_18", "station_name": "Anna Nagar East", "latitude": 13.0850, "longitude": 80.2170, "zone": "West", "type": "Underground", "is_interchange": False, "lines": ["RT_CHN_GREEN"]},
    {"station_id": "ST_CHN_ANT_19", "station_name": "Anna Nagar Tower", "latitude": 13.0860, "longitude": 80.2100, "zone": "West", "type": "Underground", "is_interchange": False, "lines": ["RT_CHN_GREEN"]},
    {"station_id": "ST_CHN_THI_20", "station_name": "Thirumangalam", "latitude": 13.0850, "longitude": 80.1980, "zone": "West", "type": "Underground", "is_interchange": False, "lines": ["RT_CHN_GREEN"]},
    {"station_id": "ST_CHN_KOY_21", "station_name": "Koyambedu", "latitude": 13.0725, "longitude": 80.1945, "zone": "West", "type": "Elevated", "is_interchange": False, "lines": ["RT_CHN_GREEN"]},
    {"station_id": "ST_CHN_CMB_22", "station_name": "CMBT", "latitude": 13.0660, "longitude": 80.2030, "zone": "West", "type": "Elevated", "is_interchange": False, "lines": ["RT_CHN_GREEN"]},
    {"station_id": "ST_CHN_VAD_23", "station_name": "Vadapalani", "latitude": 13.0510, "longitude": 80.2120, "zone": "West", "type": "Elevated", "is_interchange": False, "lines": ["RT_CHN_GREEN"]},
    {"station_id": "ST_CHN_ASH_24", "station_name": "Ashok Nagar", "latitude": 13.0360, "longitude": 80.2115, "zone": "West", "type": "Elevated", "is_interchange": False, "lines": ["RT_CHN_GREEN"]},
    {"station_id": "ST_CHN_STM_25", "station_name": "St. Thomas Mount", "latitude": 13.0040, "longitude": 80.1960, "zone": "South", "type": "Elevated", "is_interchange": True, "lines": ["RT_CHN_GREEN", "RT_CHN_RED"]},

    # Red Line (Suburban South Corridor: Beach / Central -> Tambaram)
    {"station_id": "ST_CHN_BCH_26", "station_name": "Chennai Beach", "latitude": 13.0945, "longitude": 80.2930, "zone": "North", "type": "At-Grade", "is_interchange": True, "lines": ["RT_CHN_RED", "RT_CHN_ORANGE"]},
    {"station_id": "ST_CHN_FOR_27", "station_name": "Chennai Fort", "latitude": 13.0855, "longitude": 80.2880, "zone": "Central", "type": "At-Grade", "is_interchange": True, "lines": ["RT_CHN_RED", "RT_CHN_ORANGE"]},
    {"station_id": "ST_CHN_PRK_28", "station_name": "Park Town", "latitude": 13.0805, "longitude": 80.2760, "zone": "Central", "type": "At-Grade", "is_interchange": True, "lines": ["RT_CHN_RED", "RT_CHN_ORANGE"]},
    {"station_id": "ST_CHN_NUN_29", "station_name": "Nungambakkam", "latitude": 13.0620, "longitude": 80.2370, "zone": "Central", "type": "At-Grade", "is_interchange": False, "lines": ["RT_CHN_RED"]},
    {"station_id": "ST_CHN_KOD_30", "station_name": "Kodambakkam", "latitude": 13.0510, "longitude": 80.2300, "zone": "Central", "type": "At-Grade", "is_interchange": False, "lines": ["RT_CHN_RED"]},
    {"station_id": "ST_CHN_MAM_31", "station_name": "T. Nagar (Mambalam)", "latitude": 13.0395, "longitude": 80.2280, "zone": "Central", "type": "At-Grade", "is_interchange": False, "lines": ["RT_CHN_RED"]},
    {"station_id": "ST_CHN_PAL_32", "station_name": "Pallavaram", "latitude": 12.9680, "longitude": 80.1470, "zone": "South", "type": "At-Grade", "is_interchange": False, "lines": ["RT_CHN_RED"]},
    {"station_id": "ST_CHN_CHR_33", "station_name": "Chromepet", "latitude": 12.9520, "longitude": 80.1400, "zone": "South", "type": "At-Grade", "is_interchange": False, "lines": ["RT_CHN_RED"]},
    {"station_id": "ST_CHN_TAM_34", "station_name": "Tambaram", "latitude": 12.9260, "longitude": 80.1170, "zone": "South", "type": "At-Grade", "is_interchange": False, "lines": ["RT_CHN_RED"]},

    # Orange Line (MRTS Coastal Corridor: Beach -> Velachery)
    {"station_id": "ST_CHN_CHN_35", "station_name": "Chintadripet", "latitude": 13.0740, "longitude": 80.2740, "zone": "Central", "type": "Elevated", "is_interchange": False, "lines": ["RT_CHN_ORANGE"]},
    {"station_id": "ST_CHN_CHE_36", "station_name": "Chepauk", "latitude": 13.0640, "longitude": 80.2790, "zone": "Coastal", "type": "Elevated", "is_interchange": False, "lines": ["RT_CHN_ORANGE"]},
    {"station_id": "ST_CHN_TRI_37", "station_name": "Triplicane", "latitude": 13.0560, "longitude": 80.2770, "zone": "Coastal", "type": "Elevated", "is_interchange": False, "lines": ["RT_CHN_ORANGE"]},
    {"station_id": "ST_CHN_MYL_38", "station_name": "Mylapore", "latitude": 13.0340, "longitude": 80.2690, "zone": "Coastal", "type": "Elevated", "is_interchange": False, "lines": ["RT_CHN_ORANGE"]},
    {"station_id": "ST_CHN_ADY_39", "station_name": "Adyar (Kasturba)", "latitude": 13.0060, "longitude": 80.2520, "zone": "Coastal", "type": "Elevated", "is_interchange": False, "lines": ["RT_CHN_ORANGE"]},
    {"station_id": "ST_CHN_THV_40", "station_name": "Thiruvanmiyur", "latitude": 12.9860, "longitude": 80.2540, "zone": "Coastal", "type": "Elevated", "is_interchange": False, "lines": ["RT_CHN_ORANGE"]},
    {"station_id": "ST_CHN_TAR_41", "station_name": "Taramani", "latitude": 12.9770, "longitude": 80.2440, "zone": "South", "type": "Elevated", "is_interchange": False, "lines": ["RT_CHN_ORANGE"]},
    {"station_id": "ST_CHN_VEL_42", "station_name": "Velachery", "latitude": 12.9770, "longitude": 80.2180, "zone": "South", "type": "Elevated", "is_interchange": False, "lines": ["RT_CHN_ORANGE"]},

    # Purple Line (Suburban West Corridor: Central -> Tiruvallur)
    {"station_id": "ST_CHN_PER_43", "station_name": "Perambur", "latitude": 13.1110, "longitude": 80.2440, "zone": "North", "type": "At-Grade", "is_interchange": False, "lines": ["RT_CHN_PURPLE"]},
    {"station_id": "ST_CHN_VIL_44", "station_name": "Villivakkam", "latitude": 13.1100, "longitude": 80.2070, "zone": "North", "type": "At-Grade", "is_interchange": False, "lines": ["RT_CHN_PURPLE"]},
    {"station_id": "ST_CHN_AMB_45", "station_name": "Ambattur", "latitude": 13.1180, "longitude": 80.1550, "zone": "West", "type": "At-Grade", "is_interchange": False, "lines": ["RT_CHN_PURPLE"]},
    {"station_id": "ST_CHN_AVA_46", "station_name": "Avadi", "latitude": 13.1200, "longitude": 80.1000, "zone": "West", "type": "At-Grade", "is_interchange": False, "lines": ["RT_CHN_PURPLE"]},
    {"station_id": "ST_CHN_TIR_47", "station_name": "Tiruvallur", "latitude": 13.1430, "longitude": 79.9070, "zone": "West", "type": "At-Grade", "is_interchange": False, "lines": ["RT_CHN_PURPLE"]},
]

CHENNAI_ROUTES = [
    {
        "route_id": "RT_CHN_BLUE",
        "route_name": "Blue Line",
        "line_code": "BLUE",
        "color_hex": "#2563EB",
        "origin": "Chennai Airport",
        "destination": "Washermanpet",
        "length_km": 23.1,
        "total_stations": 13,
        "scheduled_headway_min": 5.0,
        "station_ids": [
            "ST_CHN_AIR_01", "ST_CHN_MEA_02", "ST_CHN_ALN_03", "ST_CHN_GUI_04", "ST_CHN_SAI_05", 
            "ST_CHN_NAN_06", "ST_CHN_TEY_07", "ST_CHN_AGD_08", "ST_CHN_THO_09", "ST_CHN_LIC_10", 
            "ST_CHN_CEN_11", "ST_CHN_HIG_12", "ST_CHN_WAS_13"
        ]
    },
    {
        "route_id": "RT_CHN_GREEN",
        "route_name": "Green Line",
        "line_code": "GREEN",
        "color_hex": "#16A34A",
        "origin": "Chennai Central",
        "destination": "St. Thomas Mount",
        "length_km": 22.0,
        "total_stations": 13,
        "scheduled_headway_min": 6.0,
        "station_ids": [
            "ST_CHN_CEN_11", "ST_CHN_EGM_14", "ST_CHN_NEH_15", "ST_CHN_KIL_16", "ST_CHN_SHE_17", 
            "ST_CHN_ANN_18", "ST_CHN_ANT_19", "ST_CHN_THI_20", "ST_CHN_KOY_21", "ST_CHN_CMB_22", 
            "ST_CHN_VAD_23", "ST_CHN_ASH_24", "ST_CHN_STM_25"
        ]
    },
    {
        "route_id": "RT_CHN_RED",
        "route_name": "Red Line (Suburban South)",
        "line_code": "RED",
        "color_hex": "#DC2626",
        "origin": "Chennai Beach",
        "destination": "Tambaram",
        "length_km": 29.0,
        "total_stations": 11,
        "scheduled_headway_min": 8.0,
        "station_ids": [
            "ST_CHN_BCH_26", "ST_CHN_FOR_27", "ST_CHN_PRK_28", "ST_CHN_CEN_11", "ST_CHN_EGM_14", 
            "ST_CHN_NUN_29", "ST_CHN_KOD_30", "ST_CHN_MAM_31", "ST_CHN_GUI_04", "ST_CHN_STM_25", 
            "ST_CHN_TAM_34"
        ]
    },
    {
        "route_id": "RT_CHN_ORANGE",
        "route_name": "Orange Line (MRTS)",
        "line_code": "ORANGE",
        "color_hex": "#EA580C",
        "origin": "Chennai Beach",
        "destination": "Velachery",
        "length_km": 19.3,
        "total_stations": 11,
        "scheduled_headway_min": 10.0,
        "station_ids": [
            "ST_CHN_BCH_26", "ST_CHN_FOR_27", "ST_CHN_PRK_28", "ST_CHN_CHN_35", "ST_CHN_CHE_36", 
            "ST_CHN_TRI_37", "ST_CHN_MYL_38", "ST_CHN_ADY_39", "ST_CHN_THV_40", "ST_CHN_TAR_41", 
            "ST_CHN_VEL_42"
        ]
    },
    {
        "route_id": "RT_CHN_PURPLE",
        "route_name": "Purple Line (Suburban West)",
        "line_code": "PURPLE",
        "color_hex": "#9333EA",
        "origin": "Chennai Central",
        "destination": "Tiruvallur",
        "length_km": 41.8,
        "total_stations": 6,
        "scheduled_headway_min": 12.0,
        "station_ids": [
            "ST_CHN_CEN_11", "ST_CHN_PER_43", "ST_CHN_VIL_44", "ST_CHN_AMB_45", "ST_CHN_AVA_46", "ST_CHN_TIR_47"
        ]
    }
]

# -------------------------------------------------------------------------
# 2. DELHI METRO (DMRC) NETWORK DEFINITIONS
# -------------------------------------------------------------------------
DELHI_STATIONS = [
    # Yellow Line (Samaypur Badli to Millennium City Centre Gurugram)
    {"station_id": "ST_DEL_SAM_01", "station_name": "Samaypur Badli", "latitude": 28.7455, "longitude": 77.1352, "zone": "North Delhi", "type": "Elevated", "is_interchange": False, "lines": ["RT_DEL_YELLOW"]},
    {"station_id": "ST_DEL_JAH_02", "station_name": "Jahangirpuri", "latitude": 28.7259, "longitude": 77.1643, "zone": "North Delhi", "type": "Elevated", "is_interchange": False, "lines": ["RT_DEL_YELLOW"]},
    {"station_id": "ST_DEL_MOD_03", "station_name": "Model Town", "latitude": 28.7027, "longitude": 77.1939, "zone": "North Delhi", "type": "Elevated", "is_interchange": False, "lines": ["RT_DEL_YELLOW"]},
    {"station_id": "ST_DEL_VIS_04", "station_name": "Vishwavidyalaya (DU)", "latitude": 28.6946, "longitude": 77.2137, "zone": "North Delhi", "type": "Underground", "is_interchange": False, "lines": ["RT_DEL_YELLOW"]},
    {"station_id": "ST_DEL_KAS_05", "station_name": "Kashmere Gate", "latitude": 28.6675, "longitude": 77.2285, "zone": "Old Delhi", "type": "Underground", "is_interchange": True, "lines": ["RT_DEL_YELLOW", "RT_DEL_RED", "RT_DEL_VIOLET"]},
    {"station_id": "ST_DEL_CHA_06", "station_name": "Chandni Chowk", "latitude": 28.6578, "longitude": 77.2302, "zone": "Old Delhi", "type": "Underground", "is_interchange": False, "lines": ["RT_DEL_YELLOW"]},
    {"station_id": "ST_DEL_NDL_07", "station_name": "New Delhi Railway", "latitude": 28.6431, "longitude": 77.2223, "zone": "Central Delhi", "type": "Underground", "is_interchange": True, "lines": ["RT_DEL_YELLOW", "RT_DEL_AIRPORT"]},
    {"station_id": "ST_DEL_RAJ_08", "station_name": "Rajiv Chowk (CP)", "latitude": 28.6328, "longitude": 77.2195, "zone": "Central Delhi", "type": "Underground", "is_interchange": True, "lines": ["RT_DEL_YELLOW", "RT_DEL_BLUE"]},
    {"station_id": "ST_DEL_PAT_09", "station_name": "Patel Chowk", "latitude": 28.6231, "longitude": 77.2140, "zone": "Central Delhi", "type": "Underground", "is_interchange": False, "lines": ["RT_DEL_YELLOW"]},
    {"station_id": "ST_DEL_SEC_10", "station_name": "Central Secretariat", "latitude": 28.6146, "longitude": 77.2119, "zone": "Central Delhi", "type": "Underground", "is_interchange": True, "lines": ["RT_DEL_YELLOW", "RT_DEL_VIOLET"]},
    {"station_id": "ST_DEL_AIM_11", "station_name": "AIIMS", "latitude": 28.5684, "longitude": 77.2078, "zone": "South Delhi", "type": "Underground", "is_interchange": False, "lines": ["RT_DEL_YELLOW"]},
    {"station_id": "ST_DEL_HAU_12", "station_name": "Hauz Khas", "latitude": 28.5432, "longitude": 77.2065, "zone": "South Delhi", "type": "Underground", "is_interchange": True, "lines": ["RT_DEL_YELLOW"]},
    {"station_id": "ST_DEL_SAK_13", "station_name": "Saket", "latitude": 28.5204, "longitude": 77.2016, "zone": "South Delhi", "type": "Underground", "is_interchange": False, "lines": ["RT_DEL_YELLOW"]},
    {"station_id": "ST_DEL_QUT_14", "station_name": "Qutab Minar", "latitude": 28.5135, "longitude": 77.1858, "zone": "South Delhi", "type": "Elevated", "is_interchange": False, "lines": ["RT_DEL_YELLOW"]},
    {"station_id": "ST_DEL_SIK_15", "station_name": "Sikanderpur", "latitude": 28.4819, "longitude": 77.0927, "zone": "Gurugram", "type": "Elevated", "is_interchange": True, "lines": ["RT_DEL_YELLOW"]},
    {"station_id": "ST_DEL_MGR_16", "station_name": "MG Road Gurugram", "latitude": 28.4800, "longitude": 77.0805, "zone": "Gurugram", "type": "Elevated", "is_interchange": False, "lines": ["RT_DEL_YELLOW"]},
    {"station_id": "ST_DEL_MIL_17", "station_name": "Millennium City Centre", "latitude": 28.4593, "longitude": 77.0726, "zone": "Gurugram", "type": "Elevated", "is_interchange": False, "lines": ["RT_DEL_YELLOW"]},

    # Blue Line (Dwarka Sec 21 to Noida Electronic City)
    {"station_id": "ST_DEL_DWK_18", "station_name": "Dwarka Sector 21", "latitude": 28.5523, "longitude": 77.0583, "zone": "West Delhi", "type": "Underground", "is_interchange": True, "lines": ["RT_DEL_BLUE", "RT_DEL_AIRPORT"]},
    {"station_id": "ST_DEL_DWM_19", "station_name": "Dwarka Mor", "latitude": 28.6193, "longitude": 77.0332, "zone": "West Delhi", "type": "Elevated", "is_interchange": False, "lines": ["RT_DEL_BLUE"]},
    {"station_id": "ST_DEL_JAN_20", "station_name": "Janakpuri West", "latitude": 28.6294, "longitude": 77.0778, "zone": "West Delhi", "type": "Elevated", "is_interchange": True, "lines": ["RT_DEL_BLUE"]},
    {"station_id": "ST_DEL_RAJ_21", "station_name": "Rajouri Garden", "latitude": 28.6489, "longitude": 77.1215, "zone": "West Delhi", "type": "Elevated", "is_interchange": True, "lines": ["RT_DEL_BLUE"]},
    {"station_id": "ST_DEL_KAR_22", "station_name": "Karol Bagh", "latitude": 28.6442, "longitude": 77.1904, "zone": "Central Delhi", "type": "Underground", "is_interchange": False, "lines": ["RT_DEL_BLUE"]},
    {"station_id": "ST_DEL_MAN_23", "station_name": "Mandi House", "latitude": 28.6258, "longitude": 77.2343, "zone": "Central Delhi", "type": "Underground", "is_interchange": True, "lines": ["RT_DEL_BLUE", "RT_DEL_VIOLET"]},
    {"station_id": "ST_DEL_AKS_24", "station_name": "Akshardham", "latitude": 28.6179, "longitude": 77.2795, "zone": "East Delhi", "type": "Elevated", "is_interchange": False, "lines": ["RT_DEL_BLUE"]},
    {"station_id": "ST_DEL_MAY_25", "station_name": "Mayur Vihar-I", "latitude": 28.6047, "longitude": 77.2952, "zone": "East Delhi", "type": "Elevated", "is_interchange": True, "lines": ["RT_DEL_BLUE"]},
    {"station_id": "ST_DEL_NOI_26", "station_name": "Noida Sector 18", "latitude": 28.5708, "longitude": 77.3219, "zone": "Noida", "type": "Elevated", "is_interchange": False, "lines": ["RT_DEL_BLUE"]},
    {"station_id": "ST_DEL_BOT_27", "station_name": "Botanical Garden", "latitude": 28.5641, "longitude": 77.3343, "zone": "Noida", "type": "Elevated", "is_interchange": True, "lines": ["RT_DEL_BLUE"]},
    {"station_id": "ST_DEL_NOE_28", "station_name": "Noida Electronic City", "latitude": 28.6276, "longitude": 77.3725, "zone": "Noida", "type": "Elevated", "is_interchange": False, "lines": ["RT_DEL_BLUE"]},

    # Red Line (Rithala to Shaheed Sthal Ghaziabad)
    {"station_id": "ST_DEL_RIT_29", "station_name": "Rithala", "latitude": 28.7207, "longitude": 77.1071, "zone": "North West", "type": "Elevated", "is_interchange": False, "lines": ["RT_DEL_RED"]},
    {"station_id": "ST_DEL_NSP_30", "station_name": "Netaji Subhash Place", "latitude": 28.6953, "longitude": 77.1524, "zone": "North West", "type": "Elevated", "is_interchange": True, "lines": ["RT_DEL_RED"]},
    {"station_id": "ST_DEL_IND_31", "station_name": "Inderlok", "latitude": 28.6732, "longitude": 77.1698, "zone": "North West", "type": "Elevated", "is_interchange": True, "lines": ["RT_DEL_RED"]},
    {"station_id": "ST_DEL_TIS_32", "station_name": "Tis Hazari", "latitude": 28.6672, "longitude": 77.2163, "zone": "Old Delhi", "type": "Elevated", "is_interchange": False, "lines": ["RT_DEL_RED"]},
    {"station_id": "ST_DEL_SHA_33", "station_name": "Shahdara", "latitude": 28.6735, "longitude": 77.2872, "zone": "East Delhi", "type": "Elevated", "is_interchange": False, "lines": ["RT_DEL_RED"]},
    {"station_id": "ST_DEL_DIL_34", "station_name": "Dilshad Garden", "latitude": 28.6759, "longitude": 77.3215, "zone": "East Delhi", "type": "Elevated", "is_interchange": False, "lines": ["RT_DEL_RED"]},
    {"station_id": "ST_DEL_SSG_35", "station_name": "Shaheed Sthal Ghaziabad", "latitude": 28.6711, "longitude": 77.4124, "zone": "Ghaziabad", "type": "Elevated", "is_interchange": False, "lines": ["RT_DEL_RED"]},

    # Violet Line (Kashmere Gate to Raja Nahar Singh)
    {"station_id": "ST_DEL_LAQ_36", "station_name": "Lal Quila (Red Fort)", "latitude": 28.6560, "longitude": 77.2410, "zone": "Old Delhi", "type": "Underground", "is_interchange": False, "lines": ["RT_DEL_VIOLET"]},
    {"station_id": "ST_DEL_DEL_37", "station_name": "Delhi Gate", "latitude": 28.6406, "longitude": 77.2405, "zone": "Old Delhi", "type": "Underground", "is_interchange": False, "lines": ["RT_DEL_VIOLET"]},
    {"station_id": "ST_DEL_ITO_38", "station_name": "ITO", "latitude": 28.6292, "longitude": 77.2412, "zone": "Central Delhi", "type": "Underground", "is_interchange": False, "lines": ["RT_DEL_VIOLET"]},
    {"station_id": "ST_DEL_KHA_39", "station_name": "Khan Market", "latitude": 28.6003, "longitude": 77.2272, "zone": "Central Delhi", "type": "Underground", "is_interchange": False, "lines": ["RT_DEL_VIOLET"]},
    {"station_id": "ST_DEL_LAJ_40", "station_name": "Lajpat Nagar", "latitude": 28.5706, "longitude": 77.2374, "zone": "South Delhi", "type": "Underground", "is_interchange": True, "lines": ["RT_DEL_VIOLET"]},
    {"station_id": "ST_DEL_KAL_41", "station_name": "Kalkaji Mandir", "latitude": 28.5501, "longitude": 77.2514, "zone": "South Delhi", "type": "Elevated", "is_interchange": True, "lines": ["RT_DEL_VIOLET"]},
    {"station_id": "ST_DEL_BAD_42", "station_name": "Badarpur Border", "latitude": 28.4947, "longitude": 77.3005, "zone": "South Delhi", "type": "Elevated", "is_interchange": False, "lines": ["RT_DEL_VIOLET"]},

    # Airport Express Line
    {"station_id": "ST_DEL_SHI_43", "station_name": "Shivaji Stadium", "latitude": 28.6295, "longitude": 77.2130, "zone": "Central Delhi", "type": "Underground", "is_interchange": False, "lines": ["RT_DEL_AIRPORT"]},
    {"station_id": "ST_DEL_DHA_44", "station_name": "Dhaula Kuan", "latitude": 28.5925, "longitude": 77.1610, "zone": "South West", "type": "Elevated", "is_interchange": True, "lines": ["RT_DEL_AIRPORT"]},
    {"station_id": "ST_DEL_AER_45", "station_name": "Delhi Aerocity", "latitude": 28.5492, "longitude": 77.1215, "zone": "South West", "type": "Underground", "is_interchange": False, "lines": ["RT_DEL_AIRPORT"]},
    {"station_id": "ST_DEL_IGI_46", "station_name": "IGI Airport (T3)", "latitude": 28.5562, "longitude": 77.0864, "zone": "South West", "type": "Underground", "is_interchange": False, "lines": ["RT_DEL_AIRPORT"]},
    {"station_id": "ST_DEL_YAS_47", "station_name": "Yashobhoomi Dwarka Sec 25", "latitude": 28.5450, "longitude": 77.0420, "zone": "South West", "type": "Underground", "is_interchange": False, "lines": ["RT_DEL_AIRPORT"]},
]

DELHI_ROUTES = [
    {
        "route_id": "RT_DEL_YELLOW",
        "route_name": "Yellow Line (Line 2)",
        "line_code": "YELLOW",
        "color_hex": "#EAB308",
        "origin": "Samaypur Badli",
        "destination": "Millennium City Centre Gurugram",
        "length_km": 49.3,
        "total_stations": 17,
        "scheduled_headway_min": 3.0,
        "station_ids": [
            "ST_DEL_SAM_01", "ST_DEL_JAH_02", "ST_DEL_MOD_03", "ST_DEL_VIS_04", "ST_DEL_KAS_05",
            "ST_DEL_CHA_06", "ST_DEL_NDL_07", "ST_DEL_RAJ_08", "ST_DEL_PAT_09", "ST_DEL_SEC_10",
            "ST_DEL_AIM_11", "ST_DEL_HAU_12", "ST_DEL_SAK_13", "ST_DEL_QUT_14", "ST_DEL_SIK_15",
            "ST_DEL_MGR_16", "ST_DEL_MIL_17"
        ]
    },
    {
        "route_id": "RT_DEL_BLUE",
        "route_name": "Blue Line (Line 3/4)",
        "line_code": "BLUE",
        "color_hex": "#2563EB",
        "origin": "Dwarka Sector 21",
        "destination": "Noida Electronic City",
        "length_km": 56.6,
        "total_stations": 12,
        "scheduled_headway_min": 3.5,
        "station_ids": [
            "ST_DEL_DWK_18", "ST_DEL_DWM_19", "ST_DEL_JAN_20", "ST_DEL_RAJ_21", "ST_DEL_KAR_22",
            "ST_DEL_RAJ_08", "ST_DEL_MAN_23", "ST_DEL_AKS_24", "ST_DEL_MAY_25", "ST_DEL_NOI_26",
            "ST_DEL_BOT_27", "ST_DEL_NOE_28"
        ]
    },
    {
        "route_id": "RT_DEL_RED",
        "route_name": "Red Line (Line 1)",
        "line_code": "RED",
        "color_hex": "#DC2626",
        "origin": "Rithala",
        "destination": "Shaheed Sthal Ghaziabad",
        "length_km": 34.4,
        "total_stations": 8,
        "scheduled_headway_min": 4.0,
        "station_ids": [
            "ST_DEL_RIT_29", "ST_DEL_NSP_30", "ST_DEL_IND_31", "ST_DEL_TIS_32", "ST_DEL_KAS_05",
            "ST_DEL_SHA_33", "ST_DEL_DIL_34", "ST_DEL_SSG_35"
        ]
    },
    {
        "route_id": "RT_DEL_VIOLET",
        "route_name": "Violet Line (Line 6)",
        "line_code": "VIOLET",
        "color_hex": "#7C3AED",
        "origin": "Kashmere Gate",
        "destination": "Badarpur Border",
        "length_km": 46.6,
        "total_stations": 10,
        "scheduled_headway_min": 4.5,
        "station_ids": [
            "ST_DEL_KAS_05", "ST_DEL_LAQ_36", "ST_DEL_DEL_37", "ST_DEL_ITO_38", "ST_DEL_MAN_23",
            "ST_DEL_SEC_10", "ST_DEL_KHA_39", "ST_DEL_LAJ_40", "ST_DEL_KAL_41", "ST_DEL_BAD_42"
        ]
    },
    {
        "route_id": "RT_DEL_AIRPORT",
        "route_name": "Airport Express Line",
        "line_code": "ORANGE",
        "color_hex": "#EA580C",
        "origin": "New Delhi Railway",
        "destination": "Yashobhoomi Dwarka Sec 25",
        "length_km": 24.9,
        "total_stations": 6,
        "scheduled_headway_min": 8.0,
        "station_ids": [
            "ST_DEL_NDL_07", "ST_DEL_SHI_43", "ST_DEL_DHA_44", "ST_DEL_AER_45", "ST_DEL_IGI_46", "ST_DEL_YAS_47"
        ]
    }
]

# -------------------------------------------------------------------------
# GENERATION ENGINE PER NETWORK
# -------------------------------------------------------------------------
def generate_and_process_network(network_id: str, stations_data: list, routes_data: list, station_weights: dict):
    print(f"\n==========================================")
    print(f"Building Dataset for Network: {network_id.upper()}")
    print(f"==========================================")
    
    net_raw_dir = os.path.join(NETWORKS_DIR, network_id, "raw")
    net_proc_dir = os.path.join(NETWORKS_DIR, network_id, "processed")
    os.makedirs(net_raw_dir, exist_ok=True)
    os.makedirs(net_proc_dir, exist_ok=True)

    # 1. Stations raw
    stations_df = pd.DataFrame(stations_data)
    stations_df["lines_served"] = stations_df["lines"].apply(lambda l: ";".join(l))
    stations_df_raw = stations_df.drop(columns=["lines"])
    stations_raw_path = os.path.join(net_raw_dir, "transit_stations_raw.csv")
    stations_df_raw.to_csv(stations_raw_path, index=False)
    print(f"[{network_id}] Stations: {len(stations_df_raw)} records")

    # 2. Routes raw
    routes_df = pd.DataFrame(routes_data)
    routes_df["station_sequence"] = routes_df["station_ids"].apply(lambda s: ";".join(s))
    routes_df_raw = routes_df.drop(columns=["station_ids"])
    routes_raw_path = os.path.join(net_raw_dir, "transit_routes_raw.csv")
    routes_df_raw.to_csv(routes_raw_path, index=False)
    print(f"[{network_id}] Routes: {len(routes_df_raw)} records")

    # 3. 14-day hourly ridership logs
    start_date = datetime(2024, 1, 15)
    records = []
    record_id = 10001

    hourly_curve = {
        5: 0.18, 6: 0.42, 7: 0.78, 8: 1.48, 9: 1.65, 10: 1.15,
        11: 0.82, 12: 0.88, 13: 0.84, 14: 0.80, 15: 0.89, 16: 1.10,
        17: 1.55, 18: 1.75, 19: 1.45, 20: 1.05, 21: 0.65, 22: 0.35, 23: 0.15
    }

    scale_multiplier = 1.35 if network_id == "delhi" else 1.0

    for day_offset in range(14):
        current_date = start_date + timedelta(days=day_offset)
        date_str = current_date.strftime("%Y-%m-%d")
        day_name = current_date.strftime("%A")
        is_weekend = 1 if day_name in ["Saturday", "Sunday"] else 0
        weekend_factor = 0.72 if is_weekend == 1 else 1.0

        for hour in range(5, 24):
            base_hour_factor = hourly_curve.get(hour, 0.2)
            time_str = f"{hour:02d}:00"
            timestamp_str = f"{date_str} {time_str}:00"

            weather = "Clear"
            if day_offset == 4 and hour in [16, 17, 18, 19]:
                weather = "Rain"
            elif day_offset in [2, 9]:
                weather = "Cloudy"

            for route in routes_data:
                route_id = route["route_id"]
                route_base_scale = (1600 if "YELLOW" in route_id or "BLUE" in route_id or "RED" in route_id else 1200) * scale_multiplier

                for st_id in route["station_ids"]:
                    st_weight = station_weights.get(st_id, 1.0)
                    mean_passengers = route_base_scale * base_hour_factor * weekend_factor * (st_weight * 0.55)
                    passengers = max(25, int(np.random.normal(mean_passengers, scale=max(15, mean_passengers * 0.08))))

                    base_delay = 1.2 + (passengers / 3000.0) * 2.2 + (1.5 if is_weekend == 0 and hour in [8, 9, 18, 19] else 0.0)
                    delay_min = max(0.2, round(float(np.random.normal(base_delay, scale=0.6)), 1))

                    # Specific anomalies for realism:
                    if network_id == "chennai":
                        if date_str == "2024-01-15" and hour in [8, 9] and "CEN_11" in st_id:
                            passengers = int(passengers * 1.65)
                            delay_min = round(delay_min + 3.8, 1)
                        if date_str == "2024-01-19" and hour in [18, 19, 20] and "CHE_36" in st_id:
                            passengers = int(passengers * 2.2)
                            delay_min = round(delay_min + 5.2, 1)
                        if date_str == "2024-01-22" and hour in [14, 15] and "GREEN" in route_id:
                            delay_min = round(delay_min + 7.5, 1)
                    else:  # delhi
                        if date_str == "2024-01-15" and hour in [8, 9, 10] and "RAJ_08" in st_id:
                            passengers = int(passengers * 1.82)
                            delay_min = round(delay_min + 4.5, 1)
                        if date_str == "2024-01-19" and hour in [17, 18, 19] and "KAS_05" in st_id:
                            passengers = int(passengers * 1.95)
                            delay_min = round(delay_min + 5.8, 1)
                        if date_str == "2024-01-24" and hour in [18, 19] and "YELLOW" in route_id:
                            delay_min = round(delay_min + 6.8, 1)

                    nominal_capacity = int(station_weights.get(st_id, 1.0) * 4200)
                    occupancy_ratio = round(min(1.4, passengers / nominal_capacity), 3)

                    raw_delay = delay_min
                    raw_weather = weather
                    if random.random() < 0.008:
                        raw_delay = None
                    if random.random() < 0.006:
                        raw_weather = None

                    records.append({
                        "record_id": f"REC_{network_id[:3].upper()}_{record_id}",
                        "timestamp": timestamp_str,
                        "date": date_str,
                        "hour": hour,
                        "day_of_week": day_name,
                        "is_weekend": is_weekend,
                        "route_id": route_id,
                        "station_id": st_id,
                        "passenger_count": passengers,
                        "station_capacity": nominal_capacity,
                        "occupancy_ratio": occupancy_ratio,
                        "delay_minutes": raw_delay,
                        "weather_condition": raw_weather
                    })
                    record_id += 1

    ridership_raw_df = pd.DataFrame(records)
    raw_ridership_path = os.path.join(net_raw_dir, "transit_ridership_raw.csv")
    ridership_raw_df.to_csv(raw_ridership_path, index=False)
    print(f"[{network_id}] Ridership raw: {len(ridership_raw_df)} records")

    # 4. PREPROCESSING PIPELINE
    # Missing value handling
    median_delays = ridership_raw_df.groupby(["route_id", "hour"])["delay_minutes"].transform("median")
    ridership_raw_df["delay_minutes"] = ridership_raw_df["delay_minutes"].fillna(median_delays).fillna(2.5).round(1)
    ridership_raw_df["weather_condition"] = ridership_raw_df["weather_condition"].fillna("Clear")

    ridership_raw_df["timestamp"] = pd.to_datetime(ridership_raw_df["timestamp"])
    ridership_raw_df["date"] = ridership_raw_df["timestamp"].dt.strftime("%Y-%m-%d")
    ridership_raw_df["passenger_count"] = ridership_raw_df["passenger_count"].astype(int)
    ridership_raw_df["is_weekend"] = ridership_raw_df["is_weekend"].astype(int)

    station_name_map = dict(zip(stations_df_raw["station_id"], stations_df_raw["station_name"]))
    route_name_map = dict(zip(routes_df_raw["route_id"], routes_df_raw["route_name"]))
    route_color_map = dict(zip(routes_df_raw["route_id"], routes_df_raw["color_hex"]))

    ridership_raw_df["station_name"] = ridership_raw_df["station_id"].map(station_name_map)
    ridership_raw_df["route_name"] = ridership_raw_df["route_id"].map(route_name_map)

    def categorize_peak(hour):
        if 8 <= hour <= 10:
            return "Morning Peak"
        elif 17 <= hour <= 19:
            return "Evening Peak"
        elif 11 <= hour <= 16:
            return "Mid-day Off-Peak"
        else:
            return "Night / Early Morning"

    ridership_raw_df["time_period"] = ridership_raw_df["hour"].apply(categorize_peak)

    def categorize_crowd(ratio):
        if ratio < 0.45:
            return "Low"
        elif ratio < 0.75:
            return "Moderate"
        elif ratio < 1.05:
            return "High"
        else:
            return "Critical"

    ridership_raw_df["crowd_level"] = ridership_raw_df["occupancy_ratio"].apply(categorize_crowd)

    # Statistical Anomalies (Z-Score)
    baseline_stats = ridership_raw_df.groupby(["station_id", "hour", "is_weekend"])["passenger_count"].agg(
        baseline_mean="mean",
        baseline_std="std"
    ).reset_index()
    baseline_stats["baseline_std"] = baseline_stats["baseline_std"].replace(0, 1.0)

    ridership_merged = ridership_raw_df.merge(baseline_stats, on=["station_id", "hour", "is_weekend"], how="left")
    ridership_merged["z_score"] = ((ridership_merged["passenger_count"] - ridership_merged["baseline_mean"]) / ridership_merged["baseline_std"]).round(2)
    ridership_merged["pct_deviation"] = (((ridership_merged["passenger_count"] - ridership_merged["baseline_mean"]) / ridership_merged["baseline_mean"]) * 100).round(1)
    ridership_merged["is_anomaly"] = (ridership_merged["z_score"] > 2.5) | (ridership_merged["z_score"] < -2.5)

    clean_path = os.path.join(net_proc_dir, "transit_clean.csv")
    ridership_merged.to_csv(clean_path, index=False)

    # Hourly Aggregations
    hourly_agg = ridership_merged.groupby(["date", "hour", "time_period", "is_weekend"]).agg(
        total_passengers=("passenger_count", "sum"),
        avg_delay=("delay_minutes", "mean"),
        active_stations=("station_id", "nunique"),
        active_routes=("route_id", "nunique")
    ).reset_index()
    hourly_agg["avg_delay"] = hourly_agg["avg_delay"].round(2)
    hourly_agg.to_csv(os.path.join(net_proc_dir, "hourly_demand_summary.csv"), index=False)

    # Route Metrics
    route_metrics = ridership_merged.groupby(["route_id", "route_name"]).agg(
        total_passengers=("passenger_count", "sum"),
        daily_avg_passengers=("passenger_count", lambda x: round(x.sum() / 14)),
        avg_hourly_passengers=("passenger_count", lambda x: round(x.mean())),
        peak_hourly_passengers=("passenger_count", "max"),
        avg_delay_min=("delay_minutes", lambda x: round(x.mean(), 2)),
        max_delay_min=("delay_minutes", "max"),
        total_records=("record_id", "count")
    ).reset_index()
    route_metrics["color_hex"] = route_metrics["route_id"].map(route_color_map)
    route_metrics.to_csv(os.path.join(net_proc_dir, "route_metrics.csv"), index=False)

    # Station Metrics
    station_metrics = ridership_merged.groupby(["station_id", "station_name"]).agg(
        total_passengers=("passenger_count", "sum"),
        daily_avg_passengers=("passenger_count", lambda x: round(x.sum() / 14)),
        avg_passengers_per_hour=("passenger_count", lambda x: round(x.mean())),
        peak_passengers=("passenger_count", "max"),
        avg_delay_min=("delay_minutes", lambda x: round(x.mean(), 2)),
        avg_occupancy=("occupancy_ratio", lambda x: round(x.mean(), 3)),
        anomaly_count=("is_anomaly", "sum")
    ).reset_index()

    station_coords = stations_df_raw[["station_id", "latitude", "longitude", "zone", "type", "is_interchange"]]
    station_metrics = station_metrics.merge(station_coords, on="station_id", how="left")
    station_metrics.to_csv(os.path.join(net_proc_dir, "station_metrics.csv"), index=False)

    # Anomalies Catalog
    anomalies_df = ridership_merged[ridership_merged["is_anomaly"] == True].copy()
    anomalies_df = anomalies_df.sort_values(by="pct_deviation", ascending=False)
    anomalies_df.to_csv(os.path.join(net_proc_dir, "anomalies_detected.csv"), index=False)

    # Clean JSON for stations
    stations_clean_list = []
    for _, st in stations_df_raw.iterrows():
        st_id = st["station_id"]
        st_metric_row = station_metrics[station_metrics["station_id"] == st_id]
        avg_pass = int(st_metric_row["avg_passengers_per_hour"].values[0]) if len(st_metric_row) > 0 else 600
        peak_pass = int(st_metric_row["peak_passengers"].values[0]) if len(st_metric_row) > 0 else 1500
        avg_del = float(st_metric_row["avg_delay_min"].values[0]) if len(st_metric_row) > 0 else 2.1
        occ = float(st_metric_row["avg_occupancy"].values[0]) if len(st_metric_row) > 0 else 0.55

        stations_clean_list.append({
            "station_id": st_id,
            "station_name": st["station_name"],
            "latitude": float(st["latitude"]),
            "longitude": float(st["longitude"]),
            "zone": st["zone"],
            "station_type": st["type"],
            "is_interchange": bool(st["is_interchange"]),
            "lines_served": st["lines_served"].split(";"),
            "avg_passengers_per_hour": avg_pass,
            "peak_passengers": peak_pass,
            "avg_delay_min": avg_del,
            "avg_occupancy": occ
        })
    with open(os.path.join(net_proc_dir, "stations_clean.json"), "w", encoding="utf-8") as f:
        json.dump(stations_clean_list, f, indent=2)

    # Clean JSON for routes
    routes_clean_list = []
    st_dict = {s["station_id"]: s for s in stations_clean_list}
    for _, rt in routes_df_raw.iterrows():
        rt_id = rt["route_id"]
        st_seq_ids = rt["station_sequence"].split(";")
        st_objects = [st_dict[sid] for sid in st_seq_ids if sid in st_dict]
        coords_path = [[st["latitude"], st["longitude"]] for st in st_objects]

        r_metric = route_metrics[route_metrics["route_id"] == rt_id]
        total_p = int(r_metric["total_passengers"].values[0]) if len(r_metric) > 0 else 120000
        daily_avg = int(r_metric["daily_avg_passengers"].values[0]) if len(r_metric) > 0 else 20000
        avg_del = float(r_metric["avg_delay_min"].values[0]) if len(r_metric) > 0 else 2.6

        routes_clean_list.append({
            "route_id": rt_id,
            "route_name": rt["route_name"],
            "line_code": rt["line_code"],
            "color_hex": rt["color_hex"],
            "origin": rt["origin"],
            "destination": rt["destination"],
            "length_km": float(rt["length_km"]),
            "total_stations": int(rt["total_stations"]),
            "scheduled_headway_min": float(rt["scheduled_headway_min"]),
            "station_sequence": st_seq_ids,
            "coordinates_path": coords_path,
            "total_passengers": total_p,
            "daily_avg_passengers": daily_avg,
            "avg_delay_min": avg_del
        })
    with open(os.path.join(net_proc_dir, "routes_clean.json"), "w", encoding="utf-8") as f:
        json.dump(routes_clean_list, f, indent=2)

    print(f"[{network_id}] Processing complete! Clean datasets ready in {net_proc_dir}.")

    # If chennai, also copy/sync to default raw & processed for backward compatibility
    if network_id == "chennai":
        import shutil
        for fname in os.listdir(net_raw_dir):
            shutil.copy2(os.path.join(net_raw_dir, fname), os.path.join(RAW_DEFAULT_DIR, fname))
        for fname in os.listdir(net_proc_dir):
            shutil.copy2(os.path.join(net_proc_dir, fname), os.path.join(PROCESSED_DEFAULT_DIR, fname))
        print("Synced Chennai data to default data/raw and data/processed.")


def main():
    # Save network registry
    with open(os.path.join(NETWORKS_DIR, "networks.json"), "w", encoding="utf-8") as f:
        json.dump(NETWORK_REGISTRY, f, indent=2)
    print(f"Saved Network Registry to {os.path.join(NETWORKS_DIR, 'networks.json')}")

    # Chennai weights
    chennai_weights = {
        "ST_CHN_CEN_11": 3.8, "ST_CHN_MAM_31": 2.9, "ST_CHN_GUI_04": 2.5, "ST_CHN_EGM_14": 2.4,
        "ST_CHN_AIR_01": 2.2, "ST_CHN_KOY_21": 2.1, "ST_CHN_VEL_42": 2.0, "ST_CHN_TAM_34": 2.2,
        "ST_CHN_ADY_39": 1.9, "ST_CHN_PER_43": 1.9, "ST_CHN_PRK_28": 1.8, "ST_CHN_BCH_26": 1.7,
        "ST_CHN_CHE_36": 1.6, "ST_CHN_LIC_10": 1.7
    }
    generate_and_process_network("chennai", CHENNAI_STATIONS, CHENNAI_ROUTES, chennai_weights)

    # Delhi weights
    delhi_weights = {
        "ST_DEL_RAJ_08": 4.5,  # Rajiv Chowk mega-hub (500k+ daily footfall)
        "ST_DEL_KAS_05": 4.0,  # Kashmere Gate tri-interchange
        "ST_DEL_NDL_07": 3.8,  # New Delhi Railway & Airport Express
        "ST_DEL_HAU_12": 3.2,  # Hauz Khas South interchange
        "ST_DEL_SEC_10": 3.0,  # Central Secretariat government hub
        "ST_DEL_BOT_27": 2.9,  # Botanical Garden Noida gateway
        "ST_DEL_AIM_11": 2.7,  # AIIMS medical center
        "ST_DEL_CHA_06": 2.8,  # Chandni Chowk commercial hub
        "ST_DEL_MAN_23": 2.6,  # Mandi House cultural & interchange
        "ST_DEL_SIK_15": 2.8,  # Sikanderpur Gurugram IT hub
        "ST_DEL_MIL_17": 2.6,  # Millennium City Centre Gurugram
        "ST_DEL_NOI_26": 2.7,  # Noida Sector 18 commercial hub
        "ST_DEL_KAR_22": 2.5,  # Karol Bagh market
        "ST_DEL_JAN_20": 2.4,  # Janakpuri West
        "ST_DEL_IGI_46": 2.5,  # IGI Airport T3
        "ST_DEL_AKS_24": 2.2,  # Akshardham
        "ST_DEL_LAJ_40": 2.3,  # Lajpat Nagar Central Market
    }
    generate_and_process_network("delhi", DELHI_STATIONS, DELHI_ROUTES, delhi_weights)

    print("\n==========================================")
    print("ALL INDIA MULTI-CITY TRANSIT DATASETS READY!")
    print("==========================================")


if __name__ == "__main__":
    main()
