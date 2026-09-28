"""
TRANSITX — Vercel Serverless Function Entry Point
Exposes the FastAPI application for Vercel Serverless Python runtime.
"""

import os
import sys

# Compute project root and backend paths
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(CURRENT_DIR) if os.path.basename(CURRENT_DIR) == "api" else CURRENT_DIR
BACKEND_DIR = os.path.join(PROJECT_ROOT, "backend")

# Ensure Python can import from both project root and backend
for path in [PROJECT_ROOT, BACKEND_DIR]:
    if path not in sys.path:
        sys.path.insert(0, path)

# Point to data directory
os.environ.setdefault("TRANSITX_DATA_DIR", os.path.join(PROJECT_ROOT, "data"))

# Import the configured FastAPI app instance
from app.main import app
