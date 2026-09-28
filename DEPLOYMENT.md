# TRANSITX — Production Deployment Guide

This guide details how to deploy **TRANSITX** into production with full 3D living city maps, real transit routes, dynamic vehicle interpolation, and analytical data science engines active.

---

## 1. Why Did the Network Show "0 Lines Active" on Vercel Initially?

- **Local Development**: During local development, the Vite dev server (`http://localhost:5173`) intercepted all `/api/*` calls and proxied them via `vite.config.ts` to `http://127.0.0.1:8001`, where your local FastAPI server was running.
- **Production on Vercel**: In production, the Vite dev server does not exist. Vercel serves only the static build assets (`dist/`). When the browser navigated to the Vercel site and requested `/api/networks`, Vercel had no backend route configured, returning a 404 or index HTML page. Since no backend responded, the route and station lists were empty, displaying **"0 Lines Active"**.

---

## 2. Supported Production Deployment Architectures

You have two simple, production-ready choices. Choose whichever fits your workflow best:

### Option A: Vercel Full-Stack Monorepo (Frontend + Serverless Python API)
*Single deployment on Vercel — no secondary cloud hosting needed.*

1. **How It Works**:
   - Vercel builds the React frontend from `frontend/` into static CDN assets.
   - Vercel automatically deploys `api/index.py` as a Python Serverless Function.
   - The root `vercel.json` rewrites all `/api/*` requests directly to `api/index.py`.
   - The verified baseline dataset is bundled into both frontend and backend for instantaneous 3D map rendering with zero cold-start delay.
2. **Setup on Vercel**:
   - In your Vercel Dashboard project settings:
     - **Root Directory**: Leave as `.` (repository root).
     - **Build Command**: `cd frontend && npm install && npm run build` (configured automatically via `vercel.json`).
     - **Output Directory**: `frontend/dist`.
   - **Environment Variables**:
     - `VITE_MAPBOX_ACCESS_TOKEN` *(optional)*: Mapbox access token if you wish to use custom Mapbox vector tiles (Esri World Street and Esri World Imagery load automatically with no token needed).

---

### Option B: Decoupled Cloud Architecture (Frontend on Vercel + Backend on Render/Railway)
*Recommended for heavy data science workloads requiring long-running processes or continuous memory persistence.*

1. **Step 1: Deploy Backend to Render (Free Tier)**:
   - Create a free account at [render.com](https://render.com).
   - Click **New +** → **Web Service**.
   - Connect your GitHub repository (`DSE_TransitX`).
   - Configure:
     - **Root Directory**: Leave blank (root).
     - **Environment**: `Python 3`.
     - **Build Command**: `pip install -r requirements.txt`.
     - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
   - Alternatively, Render will automatically detect `render.yaml` or `backend/Dockerfile`.
   - Once deployed, copy your backend URL: e.g., `https://transitx-backend.onrender.com`.

2. **Step 2: Connect Frontend on Vercel**:
   - Go to your Vercel Project → **Settings** → **Environment Variables**.
   - Add:
     - **Key**: `VITE_API_BASE_URL`
     - **Value**: `https://transitx-backend.onrender.com` (your Render backend URL).
   - Trigger a Redeploy in Vercel.
   - The frontend will now route all `/api` calls directly to your dedicated cloud FastAPI server.

---

## 3. Environment Variables Reference

| Variable | Location | Required | Description |
| :--- | :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Frontend / Vercel | Optional | Base URL of deployed FastAPI backend. If blank, defaults to same-domain `/api`. |
| `VITE_MAPBOX_ACCESS_TOKEN` | Frontend / Vercel | Optional | Token for Mapbox satellite imagery. Default Esri satellite layers require no token. |
| `PORT` | Backend / Render | Provided by host | Port for FastAPI uvicorn runner (defaults to 8000/8001). |
| `TRANSITX_DATA_DIR` | Backend / Render | Optional | Path to transit data folder (auto-discovered if not specified). |

---

## 4. Local Development vs. Production Verification

- **Run Local Backend**:
  ```powershell
  python -m uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload --app-dir backend
  ```
- **Run Local Frontend**:
  ```powershell
  cd frontend
  npm run dev
  ```
- **Verify Production Build**:
  ```powershell
  cd frontend
  npm run build
  ```
