# Architecture Overview

DeployX is an open-source platform-as-a-service (PaaS) engineered to provide a self-hostable alternative to commercial platforms such as Vercel, Railway, and Render. 

---

## 🎯 Design Principles

1. **Strict Ephemeral Isolation**: Untrusted repository source code and user-configured build commands are strictly executed inside unprivileged Docker containers with explicit CPU (`NanoCPUs`), memory, and process limits (`PidsLimit: 100`).
2. **Immutable Artifacts**: Build outputs are packaged as verified `.tar` archives, indexed with SHA-256 checksums, and stored in a local artifact repository for fast rollback and promotion.
3. **Multi-Tenant State Separation**: Every project, deployment, domain, secret, and notification is tied to an authenticated owner with strict database and middleware-level tenant separation.
4. **Resilient Asynchronous Pipelines**: Builds are queued via Redis-backed BullMQ queues and picked up by concurrent workers with automated reconciliation for stale jobs or worker restarts.
5. **Zero-Downtime Instant Promotion**: Promoting a deployment simply rebinds the target project's `productionDeployment` pointer in MongoDB, immediately routing incoming domain requests to the promoted deployment artifact.

---

## 🏛️ Core Subsystems

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        DeployX Platform                                │
├────────────────────────┬───────────────────────┬───────────────────────┤
│    Client & Ingress    │   Control Plane       │   Execution Plane     │
├────────────────────────┼───────────────────────┼───────────────────────┤
│ • React 19 SPA         │ • Express 4 REST API  │ • BullMQ Worker       │
│ • Caddy Reverse Proxy  │ • Mongoose ORM        │ • Dockerode Engine    │
│ • Custom Domain Router │ • Redis Message Broker│ • Ephemeral Builders  │
│ • Dynamic Port Gateway │ • JWT Auth Engine     │ • Nginx Runtime Hosts │
└────────────────────────┴───────────────────────┴───────────────────────┘
```

### 1. Ingress & Routing Subsystem
- **Caddy Gateway**: Terminates TLS for wildcards (`*.deployx.app`) and forwards requests upstream to the Express backend (`127.0.0.1:5000`).
- **DomainRouter Middleware**: Inspects the HTTP `Host` header. If the request matches a custom domain or project subdomain, it bypasses standard API routes and streams the requested assets directly from the deployment's artifact archive.

### 2. Control Plane Subsystem
- **Express API**: Handles authentication, user management, project creation, deployment scheduling, domain verification, and platform telemetry.
- **MongoDB**: Primary persistence layer for metadata, user settings, audit trails, and time-series system metrics.
- **Redis & BullMQ**: Manages asynchronous deployment jobs, state tracking, and rate-limiting counters.

### 3. Execution & Virtualization Subsystem
- **Docker Client (`DockerClient`)**: Interacts directly with the Docker daemon. Launches isolated Alpine/Node build containers, executes git checkout, runs build scripts, captures output streams via demuxed pipes, and creates dedicated `nginx:alpine` runtime containers.
- **Artifact Service (`ArtifactService`)**: Compresses and extracts build output directories, calculates SHA-256 integrity checksums, and manages storage lifecycle.
- **Reconciliation & Cleanup Workers**: Independent background processes that detect stuck builds and enforce retention policies.
