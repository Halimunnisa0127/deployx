# Production Deployment Runbook

This runbook covers deploying DeployX to a production Linux host (Ubuntu 22.04 LTS recommended).

---

## 🏛️ Production Topology

```text
                  Internet
                     │
              HTTPS :443 / HTTP :80
                     ▼
           ┌──────────────────┐
           │   Caddy Gateway  │
           └─────────┬────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
┌──────────────┐          ┌──────────────┐
│ Frontend SPA │          │ Backend API  │
│ Static dist  │          │ Express :5000│
└──────────────┘          └──────┬───────┘
                                 │
             ┌───────────────────┼───────────────────┐
             ▼                   ▼                   ▼
      ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
      │   MongoDB   │     │    Redis    │     │ BullMQ      │
      │  Database   │     │  Queue Bus  │     │ Workers     │
      └─────────────┘     └─────────────┘     └──────┬──────┘
                                                     │
                                                     ▼
                                              ┌─────────────┐
                                              │Docker Socket│
                                              │/var/run/... │
                                              └─────────────┘
```

---

## 📋 Step-by-Step Production Deployment

### Step 1: System Provisioning & Dependencies
```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git build-essential

# Install Docker Engine
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER

# Install Caddy Server
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install caddy
```

---

### Step 2: Clone and Build Frontend Assets
```bash
# Clone to deployment directory
git clone https://github.com/Halimunnisa0127/deployx.git /opt/deployx
cd /opt/deployx

# Configure Frontend Environment
cat << 'EOF' > frontend/.env
VITE_API_BASE_URL=https://api.deployx.app
VITE_APP_BASE_DOMAIN=deployx.app
EOF

# Build Frontend Bundle
cd frontend
npm ci
npm run build
```

---

### Step 3: Install Backend & Configure Environment
```bash
cd /opt/deployx/backend
npm ci --production

# Generate secure random encryption secrets
JWT_ACCESS=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_REFRESH=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
PREVIEW_SEC=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
PROJ_ENC=$(node -e "console.log(require('crypto').randomBytes(16).toString('hex'))")

cat << EOF > .env
NODE_ENV=production
PORT=5000
APP_BASE_DOMAIN=deployx.app
CLIENT_URL=https://deployx.app
ALLOWED_ORIGINS=https://deployx.app,https://api.deployx.app

MONGODB_URI=mongodb://127.0.0.1:27017/deployx
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

JWT_ACCESS_SECRET=${JWT_ACCESS}
JWT_REFRESH_SECRET=${JWT_REFRESH}
PREVIEW_JWT_SECRET=${PREVIEW_SEC}
PROJECT_SECRET_ENCRYPTION_KEY=${PROJ_ENC}
EOF
```

---

### Step 4: Systemd Service Units

Create systemd service definitions to ensure process supervision and automated restarts:

#### 1. Backend API Service (`/etc/systemd/system/deployx-api.service`)
```ini
[Unit]
Description=DeployX Express API Server
After=network.target mongod.service redis-server.service

[Service]
Type=simple
User=deployx
WorkingDirectory=/opt/deployx/backend
ExecStart=/usr/bin/node src/server.js
Restart=always
RestartSec=5
EnvironmentFile=/opt/deployx/backend/.env

[Install]
WantedBy=multi-user.target
```

#### 2. Deployment Worker Service (`/etc/systemd/system/deployx-worker.service`)
```ini
[Unit]
Description=DeployX BullMQ Deployment Worker
After=network.target redis-server.service docker.service

[Service]
Type=simple
User=deployx
WorkingDirectory=/opt/deployx/backend
ExecStart=/usr/bin/node src/workers/deployment.worker.js
Restart=always
RestartSec=5
EnvironmentFile=/opt/deployx/backend/.env

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start services
sudo systemctl daemon-reload
sudo systemctl enable --now deployx-api deployx-worker
```

---

### Step 5: Caddy Ingress Configuration (`/etc/caddy/Caddyfile`)

```caddy
# Frontend Dashboard
deployx.app {
    root * /opt/deployx/frontend/dist
    file_server
    try_files {path} /index.html
}

# Backend Control Plane API
api.deployx.app {
    reverse_proxy 127.0.0.1:5000
}

# Wildcard Projects & Custom Domains Gateway
*.deployx.app {
    reverse_proxy 127.0.0.1:5000
}
```

```bash
# Reload Caddy
sudo systemctl reload caddy
```
