# Installation & Prerequisites

This guide covers everything required to set up the host machine or virtual server for running DeployX.

---

## 📋 System Requirements

| Component | Minimum Specification | Recommended Specification |
| :--- | :--- | :--- |
| **Operating System** | Ubuntu 22.04 LTS / macOS 13+ / Windows 11 (WSL2 or native with Docker Desktop) | Ubuntu 22.04 LTS or Debian 12 (Linux) |
| **CPU** | 2 Cores (x86_64 or ARM64) | 4+ Cores |
| **Memory** | 4 GB RAM | 8+ GB RAM |
| **Disk Storage** | 20 GB free disk space (SSD) | 50+ GB SSD (for Docker images and artifacts) |
| **Node.js** | Node.js `v20.x` or `v22.x` (Active LTS) | Node.js `v20.x` |
| **Docker** | Docker Engine `24.x+` with Docker socket access | Docker Engine `26.x+` with buildkit enabled |
| **MongoDB** | MongoDB `v6.0+` or `v7.0+` (or MongoDB Atlas) | MongoDB `v7.0+` |
| **Redis** | Redis `v7.0+` (or Upstash Redis) | Redis `v7.2+` (with AOF enabled) |
| **Caddy** | Caddy `v2.7+` (for HTTPS termination and reverse proxying) | Caddy `v2.8+` |

---

## 📦 Runtime Dependencies Setup

### 1. Install Node.js and NPM

Ensure Node.js `20.x` is installed on your development or deployment system.

```bash
# Verify Node and NPM installation
node -v    # Expected: v20.x.x or higher
npm -v     # Expected: v10.x.x or higher
```

### 2. Install and Start Docker Daemon

DeployX executes untrusted builds and runs isolated static web server containers using Dockerode directly over the local Docker daemon socket:
- **Linux**: `/var/run/docker.sock`
- **macOS / Windows**: Docker Desktop named pipe `//./pipe/docker_engine` or standard socket.

Ensure Docker daemon is running and reachable by current user:

```bash
# Verify Docker service is active
docker info

# Ensure standard base images are pre-cached (speeds up first builds)
docker pull node:20-alpine
docker pull nginx:alpine
docker pull alpine:latest
```

> [!IMPORTANT]
> The DeployX worker requires write/execution permissions on the Docker socket. On Linux, ensure the executing user belongs to the `docker` group (`sudo usermod -aG docker $USER`).

### 3. Install and Verify MongoDB

DeployX requires MongoDB for storing accounts, projects, deployment metadata, domains, and operational settings.

- **Local MongoDB**:
  ```bash
  mongod --version
  ```
- **MongoDB Atlas Connection URI**:
  ```text
  mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/deployx?retryWrites=true&w=majority
  ```

### 4. Install and Verify Redis

DeployX uses Redis for BullMQ asynchronous deployment job queues and distributed locking.

```bash
# Test local Redis connection
redis-cli ping
# Expected output: PONG
```

### 5. Install Caddy Server

Caddy serves as the local/edge HTTPS termination gateway and reverse proxy:
- **Windows**: `winget install CaddyServer.Caddy` or download `caddy.exe` to PATH.
- **Ubuntu/Debian**: `sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https && curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg && curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list && sudo apt update && sudo apt install caddy`
- **macOS**: `brew install caddy`

---

## 📥 Cloning and Installing Dependencies

Clone the DeployX repository and install dependencies across all workspaces:

```bash
# 1. Clone repository
git clone https://github.com/Halimunnisa0127/deployx.git
cd deployx

# 2. Install backend dependencies
cd backend
npm install
cd ..

# 3. Install frontend dependencies
cd frontend
npm install
cd ..
```

---

## 🔑 Initial Account Provisioning (Admin CLI)

DeployX provides a built-in CLI utility to bootstrap the first administrator account directly into MongoDB:

```bash
cd backend
npm run create-admin
```

The interactive CLI will prompt for:
- **Full Name**: e.g., `System Administrator`
- **Email Address**: e.g., `admin@deployx.app`
- **Password**: Min 8 characters (at least 1 uppercase, 1 lowercase, 1 number, 1 special character).

---

## ⏭️ Next Steps

Continue to [Local Development Guide](./local-development.md) or review the [Environment Variables Reference](./environment-variables.md).
