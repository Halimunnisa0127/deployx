# System Architecture

This document describes the end-to-end component topology, data flows, and runtime interaction models in DeployX.

---

## 📐 High-Level Architecture Diagram

```mermaid
flowchart TD
    Client[Browser / API Client]
    
    subgraph Ingress Layer [Edge & Ingress Layer]
        Caddy[Caddy Reverse Proxy\nHTTPS :443 / HTTP :80\nWildcard *.deployx.app]
    end

    subgraph Application Tier [Application & Control Plane]
        Frontend[Frontend Vite SPA\nReact 19 + Tailwind CSS\n:5173]
        BackendAPI[Backend Express API\nREST Endpoints\n:5000]
        DomainRouter[Domain Router Middleware\nHost Header Resolver]
    end

    subgraph State & Broker Tier [Persistence & Message Bus]
        MongoDB[(MongoDB Database\nAccounts, Projects, Logs,\nMetrics, Settings)]
        Redis[(Redis Key-Value Store\nBullMQ Deployment Queue,\nRate Limiting)]
    end

    subgraph Execution Tier [Asynchronous Execution Plane]
        Worker[BullMQ Deployment Worker\nJob Consumer]
        Reconciler[Reconciliation Worker\nStale Job Recovery]
        Cleaner[Resource Cleanup Worker\nRetention Pruning]
        DockerEngine[Docker Engine Daemon\nsocket: /var/run/docker.sock]
        
        subgraph Containers [Docker Containers]
            BuildContainer[Ephemeral Build Container\nnode:20-alpine\nIsolated CPU/RAM]
            RuntimeContainer[Runtime Serving Container\nnginx:alpine\nDynamic Port]
        end
        
        ArtifactStore[(Local Artifact Storage\n.tar bundles + SHA-256)]
    end

    Client -->|HTTPS / HTTP| Caddy
    Caddy -->|/api, /auth, /projects...| BackendAPI
    Caddy -->|Dashboard UI| Frontend
    Caddy -->|*.deployx.app / Custom Domains| BackendAPI

    BackendAPI --> DomainRouter
    DomainRouter -->|Lookup verified domain| MongoDB
    DomainRouter -->|Stream artifact files| ArtifactStore

    BackendAPI -->|Persist state & logs| MongoDB
    BackendAPI -->|Enqueue build job| Redis

    Redis -->|Dispatch jobs| Worker
    Worker -->|Read/Update deployment state| MongoDB
    Worker -->|Create & run build container| DockerEngine
    DockerEngine --> BuildContainer
    BuildContainer -->|Extract dist tar| ArtifactStore
    ArtifactStore -->|Mount / inject| RuntimeContainer
    Worker -->|Spawn Nginx host| RuntimeContainer

    Reconciler -->|Check queue & container state| Redis
    Reconciler -->|Reconcile stuck records| MongoDB
    Cleaner -->|Enforce 30-day retention| ArtifactStore
```

---

## 🔄 Dual Ingress Paths

When an HTTP request arrives at DeployX via Caddy, it follows one of two paths:

### 1. Management Plane API & Dashboard Traffic
- Standard API routes (`/api/*`, `/auth/*`, `/projects/*`, `/deployments/*`, `/domains/*`, `/admin/*`) bypass the domain router.
- Handled by Express controllers, validated by Zod schemas, authenticated by JWT middleware, and saved to MongoDB.

### 2. Deployed Application Traffic (Wildcards & Custom Domains)
- Requests destined for project subdomains (`https://<project-slug>.deployx.app`) or verified custom domains (`https://example.com`) hit the `domainRouter` middleware.
- `domainRouter` extracts the HTTP `Host` header, queries MongoDB for an active, verified `Domain` or `Project` record, resolves the active `Deployment`, and directly streams the requested static assets (`index.html`, `bundle.js`, `style.css`) from the deployment's `.tar` artifact bundle without requiring client authentication.

---

## 🗄️ Persistence & Execution Isolation

```mermaid
flowchart LR
    subgraph Host System
        A[Express Server] -->|Encrypt Secrets AES-256-GCM| B[(MongoDB)]
        C[BullMQ Worker] -->|Fetch Secrets & Decrypt| B
        C -->|Inject Clean Env Array| D[Docker Engine]
    end

    subgraph Isolated Container
        D --> E[Container: node:20-alpine]
        E -->|git fetch --depth 1| F[GitHub Remote]
        E -->|npm ci && npm run build| G[Output Directory dist/]
    end

    G -->|Stream Tar Archive| H[Local Storage Repository]
```

- **Secret Protection**: User environment variables are encrypted at rest using AES-256-GCM. The worker decrypts secrets only in memory when preparing the Docker execution script.
- **Log Demuxing**: Container `stdout` and `stderr` streams are captured separately via `demuxStream` and written incrementally to `DeploymentLog` collections, preventing secret leakage into container logs.
