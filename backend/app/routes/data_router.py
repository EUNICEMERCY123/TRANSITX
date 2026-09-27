from fastapi import APIRouter, Query
from typing import Optional
from app.services.data_service import DataService
from app.data_store import store

router = APIRouter(tags=["Data & System"])

@router.get("/health")
def health_check():
    total_records = sum(len(net.ridership_df) for net in store.networks.values())
    return {
        "status": "healthy",
        "service": "TRANSITX API",
        "version": "1.0.0",
        "networks_loaded": len(store.networks),
        "networks": list(store.networks.keys()),
        "total_records_loaded": total_records
    }

@router.get("/data")
def get_data(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=10, le=200),
    route_id: Optional[str] = Query(None),
    station_id: Optional[str] = Query(None),
    date: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    sort_by: Optional[str] = Query("timestamp"),
    sort_asc: bool = Query(False),
    network_id: Optional[str] = Query(None)
):
    return DataService.get_data_explorer(
        page=page,
        page_size=page_size,
        route_id=route_id,
        station_id=station_id,
        date=date,
        search=search,
        sort_by=sort_by,
        sort_asc=sort_asc,
        network_id=network_id
    )

@router.get("/networks/{network_id}/data")
def get_network_data(
    network_id: str,
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=10, le=200),
    route_id: Optional[str] = Query(None),
    station_id: Optional[str] = Query(None),
    date: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    sort_by: Optional[str] = Query("timestamp"),
    sort_asc: bool = Query(False)
):
    return DataService.get_data_explorer(
        page=page,
        page_size=page_size,
        route_id=route_id,
        station_id=station_id,
        date=date,
        search=search,
        sort_by=sort_by,
        sort_asc=sort_asc,
        network_id=network_id
    )

@router.get("/metadata")
def get_metadata(network_id: Optional[str] = Query(None)):
    net = store.get_network(network_id)
    df = net.ridership_df
    return {
        "network_id": net.id,
        "dataset_name": f"{net.name} Operational Ridership Dataset",
        "geography": f"{net.city}, India",
        "total_records": len(df) if df is not None else 0,
        "total_stations": len(net.stations_list),
        "total_routes": len(net.routes_list),
        "date_range": [
            str(df["date"].min()) if df is not None and not df.empty else "N/A",
            str(df["date"].max()) if df is not None and not df.empty else "N/A"
        ],
        "columns": [
            {"name": "record_id", "type": "string", "description": "Unique record identifier"},
            {"name": "timestamp", "type": "datetime", "description": "Observation date and time"},
            {"name": "date", "type": "date", "description": "Calendar date (YYYY-MM-DD)"},
            {"name": "hour", "type": "integer", "description": "Hour of the day (0-23)"},
            {"name": "day_of_week", "type": "string", "description": "Day name"},
            {"name": "is_weekend", "type": "integer", "description": "0=Weekday, 1=Weekend"},
            {"name": "route_id", "type": "string", "description": "Unique transit corridor code"},
            {"name": "station_id", "type": "string", "description": "Unique transit station code"},
            {"name": "passenger_count", "type": "integer", "description": "Net passenger flow per hour"},
            {"name": "delay_minutes", "type": "float", "description": "Average arrival delay in minutes"},
            {"name": "occupancy_ratio", "type": "float", "description": "Passenger demand divided by station capacity"},
            {"name": "crowd_level", "type": "string", "description": "Low, Moderate, High, Critical"},
            {"name": "weather_condition", "type": "string", "description": "Clear, Cloudy, Rain"},
            {"name": "is_anomaly", "type": "boolean", "description": "Statistical outlier flag (|Z| > 2.5)"}
        ],
        "preprocessing_steps": [
            "1. Verified station geographic coordinates via OpenStreetMap WGS-84 benchmarks.",
            "2. Handled missing operational delay values using route-hour median imputation.",
            "3. Imputed missing contextual weather records with mode.",
            "4. Derived semantic time period and crowd occupancy tier metrics.",
            "5. Computed baseline mean and standard deviation for Z-score anomaly detection."
        ]
    }

@router.get("/networks/{network_id}/metadata")
def get_network_metadata(network_id: str):
    return get_metadata(network_id=network_id)
