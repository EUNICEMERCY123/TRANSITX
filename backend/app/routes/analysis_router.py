from fastapi import APIRouter, Query, Body
from typing import Optional, Dict, Any
from app.services.stats_service import StatsService
from app.services.ml_service import MLService

router = APIRouter(tags=["Analysis"])

@router.get("/statistics")
def get_statistics(network_id: Optional[str] = Query(None)):
    return StatsService.get_descriptive_statistics(network_id=network_id)

@router.get("/correlation")
def get_correlation(network_id: Optional[str] = Query(None)):
    return StatsService.get_correlation_matrix(network_id=network_id)

@router.get("/hypothesis-test")
def get_hypothesis_test(network_id: Optional[str] = Query(None)):
    return StatsService.get_hypothesis_test(network_id=network_id)

@router.get("/clusters")
def get_clusters(n_clusters: int = Query(3, ge=2, le=5), network_id: Optional[str] = Query(None)):
    return MLService.get_route_clusters(n_clusters=n_clusters, network_id=network_id)

@router.post("/regression")
def run_regression(
    payload: Optional[Dict[str, Any]] = Body(default={"independent_var": "hour"}),
    network_id: Optional[str] = Query(None)
):
    ind_var = payload.get("independent_var", "hour") if payload else "hour"
    net_id = payload.get("network_id", network_id) if payload else network_id
    return MLService.run_regression(independent_var=ind_var, network_id=net_id)

# Explicit /networks/{network_id}/... routes
@router.get("/networks/{network_id}/statistics")
def get_network_statistics(network_id: str):
    return StatsService.get_descriptive_statistics(network_id=network_id)

@router.get("/networks/{network_id}/correlation")
def get_network_correlation(network_id: str):
    return StatsService.get_correlation_matrix(network_id=network_id)

@router.get("/networks/{network_id}/hypothesis-test")
def get_network_hypothesis_test(network_id: str):
    return StatsService.get_hypothesis_test(network_id=network_id)

@router.get("/networks/{network_id}/clusters")
def get_network_clusters(network_id: str, n_clusters: int = Query(3, ge=2, le=5)):
    return MLService.get_route_clusters(n_clusters=n_clusters, network_id=network_id)

@router.post("/networks/{network_id}/regression")
def run_network_regression(
    network_id: str,
    payload: Optional[Dict[str, Any]] = Body(default={"independent_var": "hour"})
):
    ind_var = payload.get("independent_var", "hour") if payload else "hour"
    return MLService.run_regression(independent_var=ind_var, network_id=network_id)
