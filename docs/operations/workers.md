# Worker Operations Runbook

DeployX employs three distinct background worker processes for queue processing, cluster reconciliation, and artifact retention.

---

## 🏗️ Worker Roles & Responsibilities

| Worker Name | Script | Interval / Mode | Core Responsibility |
| :--- | :--- | :--- | :--- |
| **Deployment Worker** | `src/workers/deployment.worker.js` | Event-Driven (BullMQ) | Consumes deployment jobs from Redis, executes Docker builds, extracts artifacts, and spawns Nginx runtime hosts. |
| **Reconciliation Worker** | `src/workers/reconciliation.worker.js` | Periodic (Every 60s) | Detects stalled builds, re-attaches running containers after worker crash, fails lost jobs, and cleans orphaned build containers. |
| **Resource Cleanup Worker**| `src/workers/resource.cleanup.worker.js` | Periodic (Every 24h) | Enforces 30-day artifact retention policy, ensures active production targets are never deleted, and prunes dead container metadata. |

---

## 🏃 Starting & Managing Workers

### 1. Starting the Deployment Worker

```bash
cd backend
npm run worker
```

#### Multi-Worker Scaling
You can run multiple worker processes concurrently across one or more host machines connected to the same Redis instance. Control concurrency per process via `WORKER_CONCURRENCY` in `.env`:
```ini
WORKER_CONCURRENCY=2
```

---

### 2. Starting the Reconciliation Worker

```bash
cd backend
npm run reconciliation
```

#### Reconciliation Behavior Rules:
1. **Stale Queued Deployments**: If a deployment is in `status: 'queued'` for longer than `DEPLOYMENT_QUEUE_TIMEOUT_MS` (default 5 min) and no active BullMQ job exists, it is marked as `status: 'failed'`.
2. **Stale Building Deployments**: If a deployment is in `status: 'building'` for longer than `DEPLOYMENT_BUILD_TIMEOUT_MS` (default 10 min) and its Docker container is dead or missing, it is marked as `status: 'failed'`.
3. **Container Recovery**: If the deployment worker restarts while a build container is still executing, the worker re-attaches to the running container stream upon restart and completes artifact extraction normally.

---

### 3. Starting the Resource Cleanup Worker

```bash
cd backend
npm run cleanup
```

#### Retention & Pruning Rules:
1. **Active Target Protection**: Deployments referenced as `Project.productionDeployment` or `Domain.targetDeployment` are **exempt** from deletion regardless of age.
2. **Terminal State Cleanup**: Artifacts belonging to failed or cancelled deployments are scheduled for immediate disk removal.
3. **Two-Step Atomic File Deletion**:
   - Step 1: Physical `.tar` file is deleted from local storage.
   - Step 2: Storage existence check confirms deletion. Only upon confirmation is the `Artifact` metadata record deleted from MongoDB.
