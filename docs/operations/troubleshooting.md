# Troubleshooting Guide & Decision Trees

This guide contains systematic troubleshooting decision trees and symptom-cause-remediation tables for common DeployX operational issues.

---

## 🌲 Troubleshooting Decision Trees

### 1. Deployment Stuck in `queued`

```mermaid
flowchart TD
    Start[Deployment status remains 'queued'] --> Q1{Is Redis reachable?}
    Q1 -->|No| FixRedis[Restart Redis service and verify REDIS_HOST/REDIS_PORT]
    Q1 -->|Yes| Q2{Is BullMQ Worker running?}
    
    Q2 -->|No| FixWorker[Start worker: 'npm run worker' or systemctl start deployx-worker]
    Q2 -->|Yes| Q3{Does BullMQ show active jobs?}
    
    Q3 -->|Jobs waiting| CheckConcurrency[Worker at max capacity: increase WORKER_CONCURRENCY]
    Q3 -->|Job missing| RunReconciler[Run reconciler: 'npm run reconciliation' to recover or fail stale jobs]
```

---

### 2. Deployment Stuck in `building` or Failed during Docker phase

```mermaid
flowchart TD
    Start[Deployment status is 'building' or fails immediately] --> Q1{Can worker connect to Docker daemon?}
    Q1 -->|No / Socket Error| FixDocker[Verify Docker is running and user is in docker group]
    Q1 -->|Yes| Q2{Did build exceed BUILD_TIMEOUT_MS?}
    
    Q2 -->|Yes| FixTimeout[Build took > 10m: increase timeout or optimize npm dependencies]
    Q2 -->|No| Q3{Did container run out of memory?}
    
    Q3 -->|Exit code 137 / OOM| FixMem[Increase DOCKER_BUILD_MEMORY_MB to 4096]
    Q3 -->|Exit code != 0| InspectLogs[Check GET /deployments/:id/logs for compiler or npm syntax errors]
```

---

### 3. Custom Domain Verification Fails

```mermaid
flowchart TD
    Start[Domain verificationStatus is 'failed'] --> Q1{Is DNS TXT record propagated?}
    Q1 -->|No| WaitDNS[Wait for DNS TTL propagation: 'dig TXT hostname' or nslookup]
    Q1 -->|Yes| Q2{Does TXT value match deployx-verification=token?}
    
    Q2 -->|No| FixTXT[Update DNS TXT record to match value from GET /domains/:id/instructions]
    Q2 -->|Yes| Q3{Is environment development with .deployx.app?}
    
    Q3 -->|Yes| Shortcut[Development shortcut activates automatically]
    Q3 -->|No| TriggerVerify[Click 'Verify DNS' in dashboard or POST /domains/:id/verify]
```

---

## 📋 Symptom-Cause-Remediation Matrix

| Symptom | Likely Cause | Verification Command | Remediation Action |
| :--- | :--- | :--- | :--- |
| **Frontend displays "Network Error" / Cannot reach API** | Backend API is stopped, port 5000 is blocked, or CORS origin is mismatched | `curl http://localhost:5000/health` | Check `ALLOWED_ORIGINS` in `backend/.env` and verify `VITE_API_BASE_URL` in `frontend/.env`. |
| **`503 Service Unavailable` on `/health/ready`** | MongoDB or Redis is offline or rejecting connections | `curl http://localhost:5000/health/ready` | Check MongoDB (`systemctl status mongod`) and Redis (`redis-cli ping`). |
| **Docker daemon unreachable (`EACCES` / `ECONNREFUSED`)** | Docker daemon is stopped or current user lacks socket permissions | `docker info` | Start Docker service (`systemctl start docker`) and add user to group (`sudo usermod -aG docker $USER`). |
| **Build fails during git fetch (`401 Bad credentials`)** | Expired GitHub OAuth token or missing repository access | Check `integrations/github/status` | Reconnect GitHub account via dashboard Settings &rarr; Integrations. |
| **Deployment logs not streaming** | DeploymentLog records missing or MongoDB write failure | `GET /deployments/:id/logs` | Inspect worker terminal output for demux stream errors. |
| **Admin dashboard returns `403 Forbidden`** | Current user has `role: 'user'` instead of `'admin'` | Inspect `User.role` in MongoDB | Run `node scripts/createAdmin.js` to elevate the account to admin. |
| **Preview deployment returns `401 / 403`** | Missing or expired `deployx_preview_token` cookie | Inspect browser cookies | Click preview link from dashboard to re-issue preview session token via `POST /deployments/:id/preview-auth`. |
| **Custom domain returns `404 Deployment Not Found`** | Domain is not verified or project has no ready deployment | `GET /domains/:id` | Ensure domain status is `verified` and project has at least one deployment in `status: 'ready'`. |
