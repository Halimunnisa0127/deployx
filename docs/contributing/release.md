# Contributor Guide: Release Process & Quality Checklist

This document details the quality gates and pre-flight checklist required prior to publishing a release of DeployX.

---

## ✅ Pre-Flight Release Checklist

Complete every check in this list before tagging a release:

### 1. Environment & Configuration
- [ ] Required production secrets configured (`JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `PREVIEW_JWT_SECRET`, `PROJECT_SECRET_ENCRYPTION_KEY`).
- [ ] `NODE_ENV=production` set for backend services.
- [ ] `ALLOWED_ORIGINS` and `CLIENT_URL` point to the production domain.
- [ ] Public `VITE_*` frontend environment variables point to the production API gateway.

### 2. Database & Broker Availability
- [ ] MongoDB connection string tested and verified.
- [ ] Redis connection verified with authentication and TLS if required.
- [ ] Readiness endpoint (`GET /health/ready`) returns `200 OK` with all services `ready`.

### 3. Test Suites & Verification
- [ ] Backend unit test suite passes: `cd backend && npm test`.
- [ ] Backend integration test suite passes without hanging handles.
- [ ] Frontend test suite passes: `cd frontend && npm test`.
- [ ] Frontend production build passes: `cd frontend && npm run build`.

### 4. Docker Engine & Virtualization
- [ ] Docker daemon is reachable (`DockerClient.ping()` returns true).
- [ ] Required base images pre-pulled (`node:20-alpine`, `nginx:alpine`, `alpine:latest`).
- [ ] Docker socket permissions verified for worker execution user.

### 5. Background Workers & Services
- [ ] Deployment worker launches cleanly (`npm run worker`).
- [ ] Reconciliation loop operational (`npm run reconciliation`).
- [ ] Resource cleanup loop operational (`npm run cleanup`).

### 6. Smoke Tests & Operations
- [ ] Admin account created/verified via `npm run create-admin`.
- [ ] End-to-end deployment smoke test passes (create project &rarr; trigger build &rarr; verify live runtime serving).
- [ ] Custom domain DNS verification tested with TXT record challenge.
- [ ] In-app notifications received on deployment success.
- [ ] Promotion and instant rollback verified.

---

## 🏷️ Tagging a Semantic Version

```bash
# 1. Update version in backend/package.json and frontend/package.json
npm version patch # or minor / major

# 2. Commit and tag release
git add .
git commit -m "chore(release): bump version to v1.1.0"
git tag -a v1.1.0 -m "Release v1.1.0"

# 3. Push commit and tags to upstream
git push origin main --tags
```
