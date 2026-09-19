# Deployment Pipeline

This document details the complete end-to-end lifecycle of a DeployX deployment from trigger to live traffic serving.

---

## 🔁 Pipeline Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as Developer / Webhook
    participant API as DeployX API
    participant Queue as Redis / BullMQ
    participant Worker as Deployment Worker
    participant Docker as Docker Daemon
    participant Storage as Artifact Storage
    participant DB as MongoDB

    User->>API: Trigger Deployment (POST /deployments)
    API->>DB: Verify Ownership & Snapshot Build Settings
    API->>DB: Increment DeploymentCounter
    API->>DB: Create Deployment (status: 'queued')
    API->>Queue: Enqueue Job (jobId: 'deploy-<id>')
    API-->>User: Return Queued Deployment Response

    Queue->>Worker: Dispatch Job (data: { deploymentId })
    Worker->>DB: Update Deployment (status: 'building', startedAt: now)
    Worker->>DB: Fetch & Decrypt Project Secrets (AES-256-GCM)
    Worker->>Docker: Create Build Container (node:20-alpine)
    
    rect rgb(240, 248, 255)
        Note over Worker,Docker: Isolated Container Build Phase
        Docker->>Docker: apk add --no-cache git
        Docker->>Docker: git fetch --depth 1 origin <ref>
        Docker->>Docker: npm ci (cached via volume)
        Docker->>Docker: npm run build
        Docker-->>Worker: Stream logs incrementally (demux stdout/stderr)
        Worker->>DB: Append logs to DeploymentLog collection
    end

    alt Build Succeeded (Exit Code 0)
        Worker->>Docker: Extract Output Directory (dist/)
        Docker-->>Worker: Stream Tar Archive
        Worker->>Storage: Store .tar Bundle & Compute SHA-256
        Worker->>DB: Create Artifact Record (size, checksum, count)
        Worker->>Docker: Create & Start Runtime Container (nginx:alpine)
        Docker-->>Worker: Return Container ID & Allocated Dynamic Port
        Worker->>Docker: Verify Health on http://localhost:<port>/
        Worker->>DB: Update Deployment (status: 'ready', runtimePort, url)
        Worker->>DB: Update Project (productionDeployment, status: 'live')
        Worker->>DB: Create In-App Notification (type: 'success')
    else Build Failed or Timed Out (Non-zero Exit Code)
        Worker->>Docker: Clean Up Build Container
        Worker->>DB: Update Deployment (status: 'failed', errorMessage)
        Worker->>DB: Create In-App Notification (type: 'error')
    end
```

---

## 📊 Deployment States

Deployments follow a strictly enforced finite state machine:

```mermaid
stateDiagram-v2
    [*] --> queued: Enqueued via API / Webhook
    queued --> building: Worker starts execution
    queued --> cancelled: Cancelled by user before pickup
    
    building --> ready: Build succeeds, artifact stored, runtime healthy
    building --> failed: Compilation error, exit code != 0, or timeout
    building --> cancelled: Force cancelled by user/admin

    ready --> [*]: Live or promoted to Production
    failed --> [*]: Terminal state
    cancelled --> [*]: Terminal state
```

| Status | Description | Valid Next Transitions |
| :--- | :--- | :--- |
| `queued` | Deployment record created, waiting in BullMQ for available worker | `building`, `cancelled` |
| `building` | Worker has spawned isolated build container and is executing git/install/build | `ready`, `failed`, `cancelled` |
| `ready` | Build completed successfully, artifact archived, runtime host verified healthy | *Terminal* |
| `failed` | Build command failed, script timed out, or runtime container failed health checks | *Terminal* |
| `cancelled` | Build was aborted by user or administrator | *Terminal* |

---

## 📦 Artifact Storage Model

1. **Extraction**: When the build container exits with code `0`, `ArtifactService` extracts the specified output directory (default: `dist`) directly from the container via Docker archive streaming.
2. **Integrity Verification**:
   - Computes SHA-256 checksum across all files.
   - Enforces `ARTIFACT_MAX_SIZE_BYTES` (default 50 MB) and `ARTIFACT_MAX_FILE_COUNT` (default 10,000 files).
3. **Local Storage**: Bundles are saved to local persistent storage under unique storage keys (`deployments/<id>/artifact.tar`).
4. **Promotion & Rollback**: Because artifacts are immutable, promoting or rolling back a deployment does not require rebuilding; DeployX simply updates the `Project.productionDeployment` pointer in MongoDB.
