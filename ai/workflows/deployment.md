# Workflow: Deployment

## Overview
This workflow defines the operational steps required to deploy DeployX updates safely to staging and production environments.

---

## Step 1: Pre-Deployment Verification
1. Ensure all features for release are merged into `main` branch.
2. Review and complete `ai/checklists/deployment-checklist.md`.
3. Confirm CI pipeline build and automated test suites passed.
4. Verify environment variable configurations for target deployment environment.

---

## Step 2: Containerization & Build
1. Build production Docker image using `ai/templates/dockerfile-template.md`:
   `docker build -t deployx-app:v1.0.0 .`
2. Tag and push container image to artifact registry:
   `docker tag deployx-app:v1.0.0 registry.deployx.io/app:v1.0.0`
   `docker push registry.deployx.io/app:v1.0.0`

---

## Step 3: Database & Infrastructure Migrations
1. Take pre-deployment database backup snapshot.
2. Apply pending database migrations in target environment.
3. Verify backward compatibility of API endpoints during migration window.

---

## Step 4: Deployment Execution
1. Trigger zero-downtime deployment (blue/green or rolling update).
2. Execute container startup health check (`/api/health`).
3. Invalidate CDN cache for updated frontend assets if necessary.

---

## Step 5: Post-Deployment Smoke Testing & Monitoring
1. Perform smoke tests on critical user flows (authentication, dashboard, deployment trigger).
2. Monitor application performance metrics (error rates, response times, memory usage).
3. If error rates spike, execute instant rollback to previous container tag.
