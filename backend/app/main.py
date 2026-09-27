"""
TRANSITX — FastAPI Backend Application
Main entry point orchestrating transit APIs, CORS, and data store initialization.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.network_router import router as network_router
from app.routes.stations_router import router as stations_router
from app.routes.routes_router import router as routes_router
from app.routes.demand_delays_router import router as demand_delays_router
from app.routes.analysis_router import router as analysis_router
from app.routes.data_router import router as data_router

app = FastAPI(
    title="TRANSITX API",
    description="Public Transportation Data Science & Analytics Platform API",
    version="1.0.0"
)

# Enable CORS for local development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes with /api prefix
app.include_router(network_router, prefix="/api")
app.include_router(stations_router, prefix="/api")
app.include_router(routes_router, prefix="/api")
app.include_router(demand_delays_router, prefix="/api")
app.include_router(analysis_router, prefix="/api")
app.include_router(data_router, prefix="/api")

@app.get("/")
def root():
    return {
        "project": "TRANSITX — Understanding Public Transportation Through Data",
        "status": "online",
        "api_docs": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8001, reload=True)
