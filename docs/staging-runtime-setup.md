# DeployX Local/Staging Runtime Setup Guide

This guide describes how to configure, run, and verify the DeployX system in a real staging or local development environment outside of sandboxed limits.

---

## 1. Environment Requirements

Ensure the target system meets these requirements:
- **Node.js**: v20.x (LTS) or higher (validated in `package.json`).
- **npm**: v10.x or higher (compatible with Node 20).
- **MongoDB**: v6.0+ (running locally or a remote Atlas cluster).
- **Redis**: v7.0+ (used for BullMQ job queueing and heartbeats).
- **Docker Engine / Desktop**: v24.0+ (required to run build sandboxes; the daemon socket must be accessible).
- **Git**: v2.40+ (available on system PATH for checkout actions).
- **GitHub Account**: A valid account with an OAuth App configuration.

---

## 2. Environment Variables

Create `backend/.env` by copying `backend/.env.example`. Ensure the following variables are configured:

### Application
```ini
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
```

### MongoDB
```ini
MONGODB_URI=mongodb://127.0.0.1:27017/deployx
```

### Redis
```ini
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

### JWT
```ini
JWT_ACCESS_SECRET=your_jwt_access_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
```

### GitHub
```ini
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
GITHUB_REDIRECT_URI=http://localhost:5000/integrations/github/oauth/callback
GITHUB_TOKEN_ENCRYPTION_KEY=your_64_hex_character_key_here
GITHUB_WEBHOOK_SECRET=your_webhook_secret_here
```

### Google OAuth
```ini
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:5000/integrations/google/oauth/callback
```

### Encryption
```ini
PROJECT_SECRET_ENCRYPTION_KEY=your_64_hex_character_key_here
```

### Artifact Storage
```ini
ARTIFACT_MAX_SIZE_BYTES=52428800
ARTIFACT_MAX_FILE_COUNT=10000
```

### Cleanup/Retention
```ini
ARTIFACT_RETENTION_DAYS=30
ARTIFACT_CLEANUP_INTERVAL_MS=86400000
DOCKER_DISK_WARNING_PERCENT=75
DOCKER_DISK_CRITICAL_PERCENT=90
DEPLOYMENT_QUEUE_TIMEOUT_MS=600000
DEPLOYMENT_BUILD_TIMEOUT_MS=900000
```

---

## 3. Service Startup Commands

Run each process in a separate terminal tab or process manager:

### Backend API
- **Command**: `npm run dev` (or `npm start`)
- **Location**: `backend` directory

### Deployment Worker
- **Command**: `npm run worker`
- **Location**: `backend` directory

### Reconciliation Worker
- **Command**: `npm run reconciliation`
- **Location**: `backend` directory

### Resource Cleanup Worker
- **Command**: `npm run cleanup`
- **Location**: `backend` directory

### Frontend App
- **Command**: `npm run dev`
- **Location**: `frontend` directory

---

## 4. Infrastructure Verification Checklist

Before running smoke tests, verify connections:

### MongoDB
- **Check**: Run `mongosh --eval "db.adminCommand('ping')"`
- **Expected Output**: `{ ok: 1 }`

### Redis
- **Check**: Run `redis-cli ping`
- **Expected Output**: `PONG`

### Docker
- **Check**: Run `docker ps`
- **Expected Output**: Active container list (or empty list if no running containers, with exit code 0).

### API Health Check
Once backend is running:
- **Ping /health**: `curl http://localhost:5000/health`
- **Ping /health/ready**: `curl http://localhost:5000/health/ready` (Asserts `{ "mongodb": "ready", "redis": "ready" }`).

---

## 5. First Smoke Test (Step-by-Step)

1. Start all infrastructure (Docker, MongoDB, Redis).
2. Start the API, Workers (Deployment, Reconciler, Cleanup), and Frontend.
3. Open the browser to the client URL (`http://localhost:5173`).
4. **Register/Login**: Create a user account on the signup page.
5. **Create Project**: Input a name, connect a test GitHub repository, and save.
6. **Add Environment Variable**: Add a secret variable `TEST_API_KEY=supersecret`.
7. **Deploy**: Click "Deploy" to trigger a manual build.
8. **Check State**:
   - The UI dashboard should transition: `queued` → `building` → `ready`.
   - Inspect build logs streaming directly in the frontend terminal interface.

---

## 6. Evidence Collection

During or after the smoke test, verify these storage locations:

- **MongoDB Deployment**: Query `db.deployments.find()` in shell. Ensure status matches `'ready'`.
- **BullMQ**: Check keys `bullet:deployments:*` in Redis (`redis-cli keys "bull:deployments:*"`).
- **Docker Container**: Run `docker ps -a --filter label=deployx=true` during build to see active sandbox.
- **DeploymentLog**: Check MongoDB collection `deploymentlogs`. Ensure no secrets appear.
- **Artifact Metadata**: Check `db.artifacts.find()` for correct checksum, file count, and size.
- **Project Pointers**: Ensure `db.projects.findOne()` has `productionDeployment` field matching your latest deployment.
- **Domain**: Verify custom domains in `db.domains.find()`.
- **DeploymentPromotionHistory**: Verify promotion events in `db.deploymentpromotionhistories.find()`.

---

## 7. Failure and Recovery Procedures (Manual Tests)

### Worker Crash Recovery
1. Trigger a deployment.
2. Once status changes to `building`, stop the Deployment Worker (`Ctrl+C` or `kill -9`).
3. Verify the Docker container remains running (`docker ps`).
4. Start the worker again (`npm run worker`).
5. Confirm the worker detects and re-attaches to the container, completing successfully.

### Redis Outage Recovery
1. Start a deployment.
2. Stop the local Redis server (`redis-cli shutdown` or systemctl).
3. Observe API behavior (requests to health endpoints will degrade to `503`).
4. Restore Redis. Verify the API and worker recover connection and process subsequent queue events.

### Docker Outage Recovery
1. Stop the Docker daemon.
2. Create a deployment.
3. Confirm the build transitions to `failed` with error `Docker daemon is unavailable`.

### Cancellation Test
1. Start a deployment.
2. Click **Cancel** in the frontend while in `building` state.
3. Confirm the container stops and deletes instantly, and status changes to `cancelled`.

### Invalid Build Test
1. Configure an invalid build command (e.g. `npm run invalid-cmd`).
2. Trigger deployment. Confirm status changes to `failed` and logs detail the error.

### Duplicate Webhook Test
1. Send duplicate headers/payloads to `/integrations/github/webhook`.
2. Verify only one deployment is enqueued.

### Promotion and Rollback Test
1. Promote Deployment #1. Verify `productionDeployment` updates.
2. Promote Deployment #2. Verify domain/production serves build #2.
3. Roll back to Deployment #1. Verify it updates without triggering a rebuild.

---

## 8. Final Runtime Test Matrix

| Category | Verification Case | Status (PASS/FAIL/BLOCKED/NOT RUN) | Evidence / Notes |
| :--- | :--- | :--- | :--- |
| **API** | API startup and `/health` response | | |
| | `/health/ready` check (DB connected) | | |
| **Worker** | Worker startup and heartbeats | | |
| **Infra** | MongoDB integration | | |
| | Redis integration | | |
| | Docker socket connection | | |
| **Flows** | Manual deployment flow | | |
| | GitHub Webhook trigger | | |
| | Immutable commit SHA pinning | | |
| | Environment Secret encryption at rest | | |
| | Secret masking in API and logs | | |
| | Live build logs streaming | | |
| | Artifact tar extraction & storage | | |
| | Direct artifact file serving | | |
| | SPA routing fallbacks | | |
| | Promotion target updates | | |
| | Rollback zero-rebuild | | |
| | Custom domain verification (TXT) | | |
| | Custom domain serving | | |
| **Recovery**| Worker crash recovery | | |
| | Redis disconnect recovery | | |
| | MongoDB disconnect recovery | | |
| **Prune** | Orphan Docker container cleanup | | |
| | Expired artifact retention cleanup | | |
| **Dashboard**| Admin health and metrics overview | | |
| | Admin incident reporting | | |
| **Security**| Cross-tenant route boundary checks | | |

---

## 9. Important Staging Warnings

> [!IMPORTANT]
> - Do **NOT** declare production readiness without completing all runtime matrix checks.
> - Do **NOT** bypass authorization validations for convenience in local setups.
