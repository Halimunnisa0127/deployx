# Local Development Guide

This guide walks through starting and developing DeployX in a local environment.

---

## 🏗️ Multi-Process Architecture

Running DeployX locally involves four primary processes:

```text
┌────────────────────────────────────────────────────────┐
│               Local Development Stack                  │
│                                                        │
│  [1] Caddy Gateway         : *.deployx.app / :443      │
│  [2] Backend Express API   : http://localhost:5000     │
│  [3] BullMQ Worker         : Background Job Runner     │
│  [4] Frontend Vite Dev     : http://localhost:5173     │
│                                                        │
│  Supporting Infrastructure : MongoDB (:27017), Redis (:6379), Docker Engine
└────────────────────────────────────────────────────────┘
```

---

## 🚀 One-Click Launch (Windows)

On Windows systems with Caddy, Docker, MongoDB, and Redis installed:

```cmd
start-dev.bat
```

This batch script automatically launches four separate terminal windows:
1. `DeployX - Caddy HTTPS Gateway` (`caddy.exe run --config Caddyfile`)
2. `DeployX - Backend API` (`cd backend && npm run dev`)
3. `DeployX - Worker` (`cd backend && npm run worker`)
4. `DeployX - Frontend` (`cd frontend && npm run dev`)

---

## 💻 Manual Multi-Terminal Startup (Linux / macOS / Windows)

Open separate terminal tabs for each service:

### Terminal 1: Backend Express API

```bash
cd backend
# Runs nodemon watching src/server.js
npm run dev
```

*Log Verification:*
```text
[MongoDB] Connected successfully to mongodb://127.0.0.1:27017/deployx
[Redis] Connected successfully (local)
Server listening on port 5000 in development mode
```

### Terminal 2: BullMQ Deployment Worker

```bash
cd backend
# Starts deployment execution worker listening on BullMQ queue 'deployments'
npm run worker
```

*Log Verification:*
```text
[Worker] Connected to MongoDB
[Worker] Listening for deployment jobs on queue 'deployments'...
```

### Terminal 3: Frontend Vite Server

```bash
cd frontend
# Starts Vite dev server with React Fast Refresh and Tailwind CSS
npm run dev
```

*Access URL:* `http://localhost:5173`

### Terminal 4: Caddy Gateway (Optional for Custom Subdomains / HTTPS)

```bash
# Run from repository root
caddy run --config Caddyfile
```

---

## ⚙️ Background Support Workers

DeployX provides two optional background workers for cluster maintenance:

### 1. Reconciliation Worker

Monitors and recovers stale queued builds or abandoned containers.

```bash
cd backend
npm run reconciliation
```

- Sweeps for jobs stuck in `queued` state longer than `DEPLOYMENT_QUEUE_TIMEOUT_MS` (default 5 min).
- Re-attaches or fails builds stuck in `building` state longer than `DEPLOYMENT_BUILD_TIMEOUT_MS` (default 10 min).
- Prunes orphaned build containers.

### 2. Resource Cleanup Worker

Enforces retention policies on build artifacts and temporary containers.

```bash
cd backend
npm run cleanup
```

- Deletes local artifact archives for non-production deployments older than `ARTIFACT_RETENTION_DAYS` (default 30 days).
- Cleans orphaned container records from terminated runs.

---

## 🧪 Verifying Local Installation

1. **API Health Check**:
   ```bash
   curl http://localhost:5000/health
   ```
   *Expected Response:*
   ```json
   {
     "success": true,
     "message": "DeployX Backend Running",
     "environment": "development",
     "version": "1.0.0",
     "uptime": 12.34,
     "timestamp": "2026-09-07T13:00:00.000Z"
   }
   ```

2. **Database & Queue Readiness**:
   ```bash
   curl http://localhost:5000/health/ready
   ```
   *Expected Response:*
   ```json
   {
     "success": true,
     "status": "ready",
     "services": {
       "mongodb": "ready",
       "redis": "ready"
     },
     "timestamp": "2026-09-07T13:00:00.000Z"
   }
   ```

3. **Frontend Dashboard**:
   Open `http://localhost:5173` in a web browser. Log in with the administrator credentials created via `npm run create-admin` or register a new user account at `http://localhost:5173/signup`.
