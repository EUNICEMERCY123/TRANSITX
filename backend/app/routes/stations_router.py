from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.data_store import store
from app.services.data_service import DataService

router = APIRouter(tags=["Stations"])

@router.get("/stations")
def list_stations(query: Optional[str] = None, network_id: Optional[str] = Query(None)):
    net = store.get_network(network_id)
    stations = net.stations_list
    if query:
        q = query.lower()
        stations = [s for s in stations if q in s["station_name"].lower() or q in s.get("zone", "").lower()]
    return stations

@router.get("/stations/{station_id}")
def station_details(station_id: str, date: Optional[str] = None, network_id: Optional[str] = Query(None)):
    details = DataService.get_station_details(station_id=station_id, network_id=network_id, date=date)
    if not details:
        raise HTTPException(status_code=404, detail="Station not found")
    return details

@router.get("/networks/{network_id}/stations")
def list_network_stations(network_id: str, query: Optional[str] = None):
    net = store.get_network(network_id)
    stations = net.stations_list
    if query:
        q = query.lower()
        stations = [s for s in stations if q in s["station_name"].lower() or q in s.get("zone", "").lower()]
    return stations

@router.get("/networks/{network_id}/stations/{station_id}")
def network_station_details(network_id: str, station_id: str, date: Optional[str] = None):
    details = DataService.get_station_details(station_id=station_id, network_id=network_id, date=date)
    if not details:
        raise HTTPException(status_code=404, detail="Station not found")
    return details
