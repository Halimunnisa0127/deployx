# Docker Operations Runbook

DeployX manages two distinct classes of Docker containers: **Build Containers** (ephemeral, short-lived builders) and **Runtime Containers** (dedicated, persistent static file hosts).

---

## ⚙️ Docker Daemon Socket Access

DeployX communicates with Docker via the standard Docker socket:
- **Unix Domain Socket**: `/var/run/docker.sock`
- **Windows Named Pipe**: `//./pipe/docker_engine`

### User Permissions Verification
```bash
# Check if current user can interact with Docker without sudo
docker ps

# If permission is denied:
sudo usermod -aG docker $USER
newgrp docker
```

---

## 📦 Container Lifecycle & Resource Governance

### 1. Build Containers (`deployx-build-<deploymentId>`)
- **Image**: `node:20-alpine` (configurable via `DOCKER_NODE_IMAGE`)
- **Memory Limit**: `2048 MB` (enforced via `config.docker.buildMemoryBytes`)
- **CPU Quota**: `2.0 cores` (enforced via `config.docker.buildCpuQuota` / `NanoCPUs`)
- **PID Limit**: `100` (`PidsLimit: 100` prevents process exhaustion attacks)
- **Privileged**: `false` (unprivileged execution)
- **NPM Cache Volume**: `deployx-npm-cache` mounted to `/root/.npm` to accelerate subsequent dependency installs.
- **Labels Applied**:
  ```json
  {
    "deployx": "true",
    "deploymentId": "<deploymentId>",
    "projectId": "<projectId>"
  }
  ```

### 2. Runtime Containers (`deployx-runtime-<deploymentId>`)
- **Image**: `nginx:alpine` (configurable via `DOCKER_RUNTIME_IMAGE`)
- **Memory Limit**: `128 MB` (`config.docker.runtimeMemoryBytes`)
- **CPU Quota**: `0.5 cores` (`config.docker.runtimeCpuQuota`)
- **Port Allocation**: Allocated dynamically via `findFreePort()` to prevent host port collisions.
- **SPA Ingress Rule**: Automatically injects `/etc/nginx/conf.d/default.conf` configured with `try_files $uri $uri/ /index.html;`.
- **Labels Applied**:
  ```json
  {
    "deployx": "true",
    "deploymentId": "<deploymentId>",
    "projectId": "<projectId>",
    "type": "runtime"
  }
  ```

---

## 🧹 Container Inspection & Maintenance Commands

### List All DeployX Containers
```bash
# List all active runtime containers
docker ps --filter "label=deployx=true" --filter "label=type=runtime"

# List all build containers (including stopped)
docker ps -a --filter "label=deployx=true"
```

### Manually Inspect Container Logs
```bash
docker logs -f deployx-runtime-<deploymentId>
```

### Prune Abandoned Build Containers
```bash
# Remove stopped containers labeled deployx=true
docker container prune --filter "label=deployx=true"
```

### Inspect NPM Cache Volume
```bash
docker volume inspect deployx-npm-cache
```
