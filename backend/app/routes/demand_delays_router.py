from fastapi import APIRouter, Query
from typing import Optional
from app.services.data_service import DataService
from app.services.ml_service import MLService

router = APIRouter(tags=["Demand & Delays"])

@router.get("/demand")
def get_demand(
    route_id: Optional[str] = Query(None),
    station_id: Optional[str] = Query(None),
    date: Optional[str] = Query(None),
    network_id: Optional[str] = Query(None)
):
    return DataService.get_demand_analysis(route_id=route_id, station_id=station_id, date=date, network_id=network_id)

@router.get("/delays")
def get_delays(network_id: Optional[str] = Query(None)):
    return DataService.get_delays_analysis(network_id=network_id)

@router.get("/anomalies")
def get_anomalies(limit: int = Query(25), network_id: Optional[str] = Query(None)):
    return MLService.get_anomalies(limit=limit, network_id=network_id)

@router.get("/networks/{network_id}/demand")
def get_network_demand(
    network_id: str,
    route_id: Optional[str] = Query(None),
    station_id: Optional[str] = Query(None),
    date: Optional[str] = Query(None)
):
    return DataService.get_demand_analysis(route_id=route_id, station_id=station_id, date=date, network_id=network_id)

@router.get("/networks/{network_id}/delays")
def get_network_delays(network_id: str):
    return DataService.get_delays_analysis(network_id=network_id)

@router.get("/networks/{network_id}/anomalies")
def get_network_anomalies(network_id: str, limit: int = Query(25)):
    return MLService.get_anomalies(limit=limit, network_id=network_id)
