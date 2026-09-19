# Environment Variables Reference

This document provides a complete reference for all environment variables used by DeployX.

---

## 🔒 Security Best Practices

> [!CAUTION]
> **Client-Side vs Server-Side Secrets**:
> - Frontend variables starting with `VITE_*` are compiled directly into the client bundle and are publicly visible to anyone inspecting browser network traffic.
> - **Never** place encryption keys, JWT secrets, database connection strings, or SMTP credentials in `frontend/.env` or any `VITE_*` variable.

---

## 🖥️ Backend Server Environment Variables

Configured in `backend/.env` or injected via Docker / host systemd environment.

### Core & Server Network Settings

| Variable | Required | Environment | Purpose | Secret | Default Value |
| :--- | :---: | :--- | :--- | :---: | :--- |
| `NODE_ENV` | No | All | Application environment (`development`, `production`, `test`) | No | `development` |
| `PORT` | No | All | Express HTTP server listening port | No | `5000` |
| `CLIENT_URL` | No | Production | Frontend URL used for OAuth redirects and CORS origin checks | No | `undefined` |
| `APP_BASE_DOMAIN` | No | All | Base root domain for project subdomains | No | `deployx.app` |
| `ALLOWED_ORIGINS` | No | All | Comma-separated list of allowed CORS origins | No | `http://localhost:5173` |

### Database & Message Queue

| Variable | Required | Environment | Purpose | Secret | Default Value |
| :--- | :---: | :--- | :--- | :---: | :--- |
| `MONGODB_URI` | **Yes** | All | MongoDB connection string (local or MongoDB Atlas URI) | **Yes** | *None (Fails fast if missing)* |
| `REDIS_HOST` | No | All | Redis hostname for BullMQ deployment queues | No | `127.0.0.1` |
| `REDIS_PORT` | **Yes** | All | Redis listening port | No | *None (e.g., 6379)* |
| `REDIS_PASSWORD` | No | All | Redis authentication password | **Yes** | `""` |

### Authentication & Cryptographic Keys

| Variable | Required | Environment | Purpose | Secret | Default Value |
| :--- | :---: | :--- | :--- | :---: | :--- |
| `JWT_ACCESS_SECRET` | **Yes** | All | Secret key used to sign short-lived user access tokens | **Yes** | *None* |
| `JWT_ACCESS_EXPIRATION` | No | All | Expiration period for access tokens | No | `15m` |
| `JWT_REFRESH_SECRET` | **Yes** | All | Secret key used to sign long-lived refresh tokens | **Yes** | *None* |
| `JWT_REFRESH_EXPIRATION`| No | All | Expiration period for refresh tokens | No | `7d` |
| `PREVIEW_JWT_SECRET` | **Yes** | All | Secret key used to sign deployment preview cookies | **Yes** | *None* |
| `PROJECT_SECRET_ENCRYPTION_KEY` | **Yes** | All | 32-byte hex/string key for AES-256-GCM encryption of user env vars | **Yes** | *None* |
| `OTP_EXPIRY_MINUTES` | No | All | Expiration duration in minutes for password reset OTP codes | No | `10` |

### Third-Party OAuth & Integrations

| Variable | Required | Environment | Purpose | Secret | Default Value |
| :--- | :---: | :--- | :--- | :---: | :--- |
| `GITHUB_CLIENT_ID` | No | Optional | GitHub OAuth App Client ID | No | `undefined` |
| `GITHUB_CLIENT_SECRET` | No | Optional | GitHub OAuth App Client Secret | **Yes** | `undefined` |
| `GITHUB_REDIRECT_URI` | No | Optional | Callback URL registered in GitHub OAuth App | No | `undefined` |
| `GITHUB_TOKEN_ENCRYPTION_KEY` | No | Optional | Key for encrypting stored GitHub OAuth user tokens | **Yes** | `undefined` |
| `GITHUB_WEBHOOK_SECRET`| No | Optional | Secret key used to verify incoming GitHub webhook HMAC SHA-256 signatures | **Yes** | `undefined` |
| `GOOGLE_CLIENT_ID` | No | Optional | Google OAuth 2.0 Client ID | No | `undefined` |
| `GOOGLE_CLIENT_SECRET` | No | Optional | Google OAuth 2.0 Client Secret | **Yes** | `undefined` |
| `GOOGLE_REDIRECT_URI` | No | Optional | Callback URL registered in Google Cloud Console | No | `undefined` |

### Gemini AI Assistant

| Variable | Required | Environment | Purpose | Secret | Default Value |
| :--- | :---: | :--- | :--- | :---: | :--- |
| `GEMINI_API_KEY` | No | Optional | Google Gemini API Key for build diagnostics & chat | **Yes** | `undefined` |
| `GEMINI_MODEL` | No | All | Gemini LLM model identifier | No | `gemini-2.0-flash` |

### Docker Build & Runtime Resource Controls

| Variable | Required | Environment | Purpose | Secret | Default Value |
| :--- | :---: | :--- | :--- | :---: | :--- |
| `DOCKER_NODE_IMAGE` | No | All | Base container image used during build phase | No | `node:20-alpine` |
| `DOCKER_RUNTIME_IMAGE` | No | All | Base image used to serve static artifacts | No | `nginx:alpine` |
| `DOCKER_UTILITY_IMAGE` | No | All | Utility image used for isolated smoke testing | No | `alpine:latest` |
| `DOCKER_BUILD_MEMORY_MB` | No | All | Memory limit for build container in megabytes | No | `2048` |
| `DOCKER_RUNTIME_MEMORY_MB`| No | All | Memory limit for runtime Nginx container in MB | No | `128` |
| `DOCKER_BUILD_CPU` | No | All | CPU core limit allocated to build containers | No | `2` |
| `DOCKER_RUNTIME_CPU` | No | All | CPU core limit allocated to runtime containers | No | `0.5` |
| `BUILD_TIMEOUT_MS` | No | All | Maximum allowed build duration in milliseconds | No | `600000` (10 min) |
| `DOCKER_NPM_CACHE_VOLUME`| No | All | Persistent Docker volume name for NPM package caching | No | `deployx-npm-cache` |

### Worker & Queue Tuning

| Variable | Required | Environment | Purpose | Secret | Default Value |
| :--- | :---: | :--- | :--- | :---: | :--- |
| `WORKER_CONCURRENCY` | No | All | Number of concurrent build jobs processed per worker | No | `1` |
| `WORKER_HEARTBEAT_INTERVAL_MS` | No | All | Heartbeat interval for worker process health tracking | No | `15000` (15s) |
| `WORKER_HEARTBEAT_TTL_SECONDS` | No | All | Heartbeat expiration TTL in Redis | No | `30` |
| `RECONCILIATION_INTERVAL_MS` | No | All | Interval between stale build sweep cycles | No | `60000` (1 min) |
| `QUEUE_MAX_ATTEMPTS` | No | All | Maximum retry attempts for failed BullMQ jobs | No | `3` |
| `QUEUE_BACKOFF_DELAY_MS` | No | All | Initial exponential backoff delay for retried jobs | No | `2000` |

### Artifact Storage & Timeouts

| Variable | Required | Environment | Purpose | Secret | Default Value |
| :--- | :---: | :--- | :--- | :---: | :--- |
| `ARTIFACT_MAX_SIZE_BYTES` | No | All | Maximum allowed compressed artifact size in bytes | No | `52428800` (50 MB) |
| `ARTIFACT_MAX_FILE_COUNT` | No | All | Maximum number of files allowed per artifact bundle | No | `10000` |
| `DEPLOYMENT_QUEUE_TIMEOUT_MS` | No | All | Time after which a queued job is deemed stale | No | `300000` (5 min) |
| `DEPLOYMENT_BUILD_TIMEOUT_MS` | No | All | Maximum total duration for build phase | No | `600000` (10 min) |

### Rate Limiting & Logs

| Variable | Required | Environment | Purpose | Secret | Default Value |
| :--- | :---: | :--- | :--- | :---: | :--- |
| `RATE_LIMIT_WINDOW_MS` | No | All | Rate limit evaluation sliding window in milliseconds | No | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | No | All | Maximum HTTP requests per IP within the window | No | `100` |
| `AI_RATE_LIMIT_WINDOW_MS` | No | All | AI endpoint rate limit window in milliseconds | No | `300000` (5 min) |
| `AI_RATE_LIMIT_MAX_REQUESTS` | No | All | Maximum AI chat/analyze requests per IP in window | No | `5` |
| `MAX_LOG_LENGTH` | No | All | Maximum characters stored per individual log line | No | `5000` |
| `MAX_LOGS_PER_DEPLOYMENT` | No | All | Maximum log lines stored per deployment | No | `10000` |

### Domain Routing & DNS Verification

| Variable | Required | Environment | Purpose | Secret | Default Value |
| :--- | :---: | :--- | :--- | :---: | :--- |
| `DOMAIN_ROUTER_IP` | No | All | IPv4 address provided in custom domain A-record instructions | No | `76.76.21.21` |
| `DOMAIN_CNAME_TARGET` | No | All | Target hostname provided for CNAME instructions | No | `cname.<APP_BASE_DOMAIN>` |

### SMTP Email Notifications

| Variable | Required | Environment | Purpose | Secret | Default Value |
| :--- | :---: | :--- | :--- | :---: | :--- |
| `SMTP_HOST` | No | All | SMTP relay server hostname | No | `""` |
| `SMTP_PORT` | No | All | SMTP port (e.g. 587 or 465) | No | `587` |
| `SMTP_SECURE` | No | All | Use TLS wrapper (`true` for port 465) | No | `false` |
| `SMTP_USER` | No | All | SMTP username / authentication account | No | `""` |
| `SMTP_PASS` | No | All | SMTP account password / API key | **Yes** | `""` |
| `SMTP_FROM` | No | All | Sender email address for outgoing system emails | No | `support@deployx.app` |

---

## 🌐 Frontend Client Environment Variables

Configured in `frontend/.env`.

| Variable | Required | Environment | Purpose | Secret | Default Value |
| :--- | :---: | :--- | :--- | :---: | :--- |
| `VITE_API_BASE_URL` | **Yes** | All | Base URL of the backend REST API | **No (Public)** | `http://localhost:5000` |
| `VITE_APP_BASE_DOMAIN`| No | All | Base application domain for preview URL display | **No (Public)** | `deployx.app` |
