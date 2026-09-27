from fastapi import APIRouter, Query
from typing import Optional
from app.data_store import store
from app.services.data_service import DataService

router = APIRouter(tags=["Network"])

@router.get("/networks")
def list_networks():
    """Returns metadata for all available India transit networks (Chennai, Delhi, etc.)."""
    return store.get_networks_metadata()

@router.get("/summary")
def get_summary(network_id: Optional[str] = Query(None)):
    return DataService.get_system_summary(network_id=network_id)

@router.get("/network")
def get_network(
    network_id: Optional[str] = Query(None),
    date: Optional[str] = "2024-01-15",
    hour: Optional[int] = 9
):
    return DataService.get_network_snapshot(network_id=network_id, date=date, hour=hour)

@router.get("/networks/{network_id}/summary")
def get_network_summary(network_id: str):
    return DataService.get_system_summary(network_id=network_id)

@router.get("/networks/{network_id}/network")
def get_network_details(
    network_id: str,
    date: Optional[str] = "2024-01-15",
    hour: Optional[int] = 9
):
    return DataService.get_network_snapshot(network_id=network_id, date=date, hour=hour)
