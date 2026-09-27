from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.data_store import store
from app.services.data_service import DataService
from app.services.ml_service import MLService

router = APIRouter(tags=["Routes"])

@router.get("/routes")
def list_routes(network_id: Optional[str] = Query(None)):
    net = store.get_network(network_id)
    return net.routes_list

@router.get("/routes/{route_id}")
def route_details(route_id: str, network_id: Optional[str] = Query(None)):
    details = DataService.get_route_details(route_id=route_id, network_id=network_id)
    if not details:
        raise HTTPException(status_code=404, detail="Route not found")
    return details

@router.get("/similar-routes/{route_id}")
def get_similar_routes(route_id: str, network_id: Optional[str] = Query(None)):
    result = MLService.get_similar_routes(route_id=route_id, network_id=network_id)
    if not result:
        raise HTTPException(status_code=404, detail="Route not found for similarity analysis")
    return result

@router.get("/compare-routes")
def compare_routes(
    route_a: Optional[str] = Query(None),
    route_b: Optional[str] = Query(None),
    network_id: Optional[str] = Query(None)
):
    net = store.get_network(network_id)
    default_a = net.routes_list[0]["route_id"] if net.routes_list else "RT_CHN_BLUE"
    default_b = net.routes_list[1]["route_id"] if len(net.routes_list) > 1 else default_a
    ra = route_a or default_a
    rb = route_b or default_b
    return MLService.compare_routes(ra, rb, network_id=network_id)

@router.get("/networks/{network_id}/routes")
def list_network_routes(network_id: str):
    net = store.get_network(network_id)
    return net.routes_list

@router.get("/networks/{network_id}/routes/{route_id}")
def network_route_details(network_id: str, route_id: str):
    details = DataService.get_route_details(route_id=route_id, network_id=network_id)
    if not details:
        raise HTTPException(status_code=404, detail="Route not found")
    return details

@router.get("/networks/{network_id}/similar-routes/{route_id}")
def get_network_similar_routes(network_id: str, route_id: str):
    result = MLService.get_similar_routes(route_id=route_id, network_id=network_id)
    if not result:
        raise HTTPException(status_code=404, detail="Route not found for similarity analysis")
    return result

@router.get("/networks/{network_id}/compare-routes")
def compare_network_routes(
    network_id: str,
    route_a: Optional[str] = Query(None),
    route_b: Optional[str] = Query(None)
):
    net = store.get_network(network_id)
    default_a = net.routes_list[0]["route_id"] if net.routes_list else "RT_CHN_BLUE"
    default_b = net.routes_list[1]["route_id"] if len(net.routes_list) > 1 else default_a
    ra = route_a or default_a
    rb = route_b or default_b
    return MLService.compare_routes(ra, rb, network_id=network_id)
